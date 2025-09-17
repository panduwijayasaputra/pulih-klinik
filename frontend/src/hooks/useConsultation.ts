import { useState, useCallback } from 'react';
import {
  Consultation,
  CreateConsultationData,
  UpdateConsultationData,
  ConsultationFilters,
  ConsultationStats
} from '@/types/consultation';
import { ConsultationAPI, ConsultationAPIError } from '@/lib/api/consultation';
import { useAuth } from './useAuth';

export interface UseConsultationReturn {
  // Data
  consultations: Consultation[];
  selectedConsultation: Consultation | null;
  stats: ConsultationStats | null;

  // State
  loading: boolean;
  loadingStats: boolean;
  error: string | null;

  // Filters
  filters: ConsultationFilters;

  // Actions
  loadConsultations: (filters?: Partial<ConsultationFilters>, page?: number, limit?: number) => Promise<void>;
  loadConsultation: (id: string) => Promise<void>;
  loadStats: (clientId?: string) => Promise<void>;
  createConsultation: (data: CreateConsultationData) => Promise<boolean>;
  updateConsultation: (id: string, data: UpdateConsultationData) => Promise<boolean>;
  deleteConsultation: (id: string) => Promise<boolean>;
  setFilters: (filters: Partial<ConsultationFilters>) => void;
  clearError: () => void;
  selectConsultation: (consultation: Consultation | null) => void;
}

export const useConsultation = (): UseConsultationReturn => {
  const { user } = useAuth();
  const therapistId = user?.id;

  // State
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [stats, setStats] = useState<ConsultationStats | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFiltersState] = useState<ConsultationFilters>({
    clientId: '',
    therapistId: '',
    formTypes: [],
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load consultations
  const loadConsultations = useCallback(async (
    customFilters?: Partial<ConsultationFilters>,
    page = 1,
    limit = 20
  ) => {
    if (!therapistId) return;

    try {
      setLoading(true);
      setError(null);

      const mergedFilters = { ...filters, ...customFilters };
      const response = await ConsultationAPI.getConsultations(mergedFilters, page, limit);

      if (response.success && response.data) {
        setConsultations(response.data.items);
      } else {
        setError(response.message || 'Failed to load consultations');
      }
    } catch (err) {
      const errorMessage = err instanceof ConsultationAPIError
        ? err.message
        : 'Failed to load consultations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [therapistId, filters]);

  // Load single consultation
  const loadConsultation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ConsultationAPI.getConsultation(id);

      if (response.success && response.data) {
        setSelectedConsultation(response.data);
      } else {
        setError(response.message || 'Failed to load consultation');
      }
    } catch (err) {
      const errorMessage = err instanceof ConsultationAPIError
        ? err.message
        : 'Failed to load consultation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats
  const loadStats = useCallback(async (clientId?: string) => {
    try {
      setLoadingStats(true);
      setError(null);

      const response = await ConsultationAPI.getConsultationStatistics(clientId);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load consultation statistics');
      }
    } catch (err) {
      const errorMessage = err instanceof ConsultationAPIError
        ? err.message
        : 'Failed to load consultation statistics';
      setError(errorMessage);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Create consultation
  const createConsultation = useCallback(async (data: CreateConsultationData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await ConsultationAPI.createConsultation(data);

      if (response.success && response.data) {
        // Add the new consultation to the list
        setConsultations(prev => [response.data!, ...prev]);
        return true;
      } else {
        setError(response.message || 'Failed to create consultation');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof ConsultationAPIError
        ? err.message
        : 'Failed to create consultation';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update consultation
  const updateConsultation = useCallback(async (id: string, data: UpdateConsultationData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await ConsultationAPI.updateConsultation(id, data);

      if (response.success && response.data) {
        // Update the consultation in the list
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === id ? response.data! : consultation
          )
        );
        
        // Update selected consultation if it's the one being updated
        if (selectedConsultation?.id === id) {
          setSelectedConsultation(response.data);
        }
        
        return true;
      } else {
        setError(response.message || 'Failed to update consultation');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof ConsultationAPIError
        ? err.message
        : 'Failed to update consultation';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedConsultation]);

  // Delete consultation
  const deleteConsultation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await ConsultationAPI.deleteConsultation(id);

      if (response.success) {
        // Remove the consultation from the list
        setConsultations(prev => prev.filter(consultation => consultation.id !== id));
        
        // Clear selected consultation if it's the one being deleted
        if (selectedConsultation?.id === id) {
          setSelectedConsultation(null);
        }
        
        return true;
      } else {
        setError(response.message || 'Failed to delete consultation');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof ConsultationAPIError
        ? err.message
        : 'Failed to delete consultation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedConsultation]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<ConsultationFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Select consultation
  const selectConsultation = useCallback((consultation: Consultation | null) => {
    setSelectedConsultation(consultation);
  }, []);

  return {
    // Data
    consultations,
    selectedConsultation,
    stats,

    // State
    loading,
    loadingStats,
    error,

    // Filters
    filters,

    // Actions
    loadConsultations,
    loadConsultation,
    loadStats,
    createConsultation,
    updateConsultation,
    deleteConsultation,
    setFilters,
    clearError,
    selectConsultation
  };
};
