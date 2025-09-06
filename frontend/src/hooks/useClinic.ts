import { useCallback, useEffect, useState } from 'react';
import { 
  ClinicBranding, 
  ClinicDocument, 
  ClinicProfile, 
  ClinicProfileFormData, 
  ClinicSettings 
} from '@/types/clinic';
import { ClinicAPI } from '@/lib/api/clinic';
import { useAuthStore } from '@/store/auth';

interface UseClinicState {
  clinic: ClinicProfile | null;
  documents: ClinicDocument[];
  stats: {
    therapists: number;
    clients: number;
    sessions: number;
    documents: number;
  } | null;
  isLoading: boolean;
  isDocumentsLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  documentsError: string | null;
  statsError: string | null;
}

export const useClinic = () => {
  const { user } = useAuthStore();
  const [state, setState] = useState<UseClinicState>({
    clinic: null,
    documents: [],
    stats: null,
    isLoading: false,
    isDocumentsLoading: false,
    isStatsLoading: false,
    error: null,
    documentsError: null,
    statsError: null
  });

  // Get the clinic ID from the authenticated user
  const clinicId = user?.clinicId;

  const updateState = useCallback((updates: Partial<UseClinicState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
      return error.message;
    }
    return fallbackMessage;
  }, []);

  // Fetch clinic profile
  const fetchClinic = useCallback(async () => {
    if (!clinicId) {
      // Don't show error on onboarding page since users don't have clinicId yet
      const isOnOnboardingPage = typeof window !== 'undefined' && window.location.pathname === '/onboarding';
      if (!isOnOnboardingPage) {
        updateState({ error: 'Clinic ID not found. Please log in again.' });
      }
      return;
    }

    updateState({ isLoading: true, error: null });
    
    try {
      const response = await ClinicAPI.getClinicProfile(clinicId);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
      } else {
        updateState({ error: response.message || 'Gagal mengambil data klinik' });
      }
    } catch (error: any) {
      // Check if it's a 404 error (clinic not found)
      if (error?.response?.status === 404 || error?.message?.includes('Clinic not found')) {
        // Clear clinic data from auth store when clinic is not found
        const { setUser, setClinic } = useAuthStore.getState();
        if (user) {
          const { clinicId: _, clinicName: __, ...userWithoutClinic } = user;
          setUser(userWithoutClinic);
          setClinic(null);
        }
        updateState({ clinic: null, error: 'Clinic not found. Please create a new clinic.' });
      } else {
        const errorMessage = handleError(error, 'Gagal mengambil data klinik');
        updateState({ error: errorMessage });
      }
    } finally {
      updateState({ isLoading: false });
    }
  }, [clinicId, updateState, handleError, user]);

  // Fetch clinic statistics
  const fetchStats = useCallback(async () => {
    if (!clinicId) {
      // Don't show error on onboarding page since users don't have clinicId yet
      const isOnOnboardingPage = typeof window !== 'undefined' && window.location.pathname === '/onboarding';
      if (!isOnOnboardingPage) {
        updateState({ statsError: 'Clinic ID not found. Please log in again.' });
      }
      return;
    }

    updateState({ isStatsLoading: true, statsError: null });
    
    try {
      const response = await ClinicAPI.getClinicStats(clinicId);
      if (response.success && response.data) {
        updateState({ stats: response.data });
      } else {
        updateState({ statsError: response.message || 'Gagal mengambil statistik klinik' });
      }
    } catch (error: any) {
      // Check if it's a 404 error (clinic not found)
      if (error?.response?.status === 404 || error?.message?.includes('Clinic not found')) {
        // Don't clear auth store here as fetchClinic will handle it
        updateState({ stats: null, statsError: 'Clinic not found' });
      } else {
        const errorMessage = handleError(error, 'Gagal mengambil statistik klinik');
        updateState({ statsError: errorMessage });
      }
    } finally {
      updateState({ isStatsLoading: false });
    }
  }, [clinicId, updateState, handleError]);

  // Create clinic profile
  const createClinic = useCallback(async (formData: ClinicProfileFormData) => {
    updateState({ isLoading: true, error: null });
    
    try {
      const response = await ClinicAPI.createClinic(formData);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        
        // Update auth store with new clinic information
        const { setUser, setClinic } = useAuthStore.getState();
        if (user) {
          setUser({
            ...user,
            clinicId: response.data.id,
            clinicName: response.data.name
          });
          // Also set the clinic data in the auth store
          setClinic({
            id: response.data.id,
            name: response.data.name,
            isActive: true, // New clinics are active by default
            ...(response.data.subscriptionTier && { subscriptionTier: response.data.subscriptionTier })
          });
        }
        
        return true;
      } else {
        updateState({ error: response.message || 'Gagal membuat data klinik' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal membuat data klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError, user]);

  // Update clinic profile
  const updateClinic = useCallback(async (formData: ClinicProfileFormData) => {
    if (!clinicId) {
      updateState({ error: 'Clinic ID not found. Please log in again.' });
      return false;
    }

    updateState({ isLoading: true, error: null });

    try {
      const response = await ClinicAPI.updateClinicProfile(clinicId, formData);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui profil klinik' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui profil klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [clinicId, updateState, handleError]);

  // Upload clinic logo
  const uploadLogo = useCallback(async (file: File) => {
    if (!clinicId) {
      updateState({ error: 'Clinic ID not found. Please log in again.' });
      return null;
    }

    updateState({ isLoading: true, error: null });

    try {
      const response = await ClinicAPI.uploadLogo(clinicId, file);
      if (response.success && response.data) {
        // Update the clinic data with new logo URL
        if (state.clinic) {
          const updatedClinic: ClinicProfile = {
            ...state.clinic,
            logo: response.data.logoUrl,
            updatedAt: new Date().toISOString()
          };
          updateState({ clinic: updatedClinic });
        }
        return response.data.logoUrl;
      } else {
        updateState({ error: response.message || 'Gagal mengunggah logo' });
        return null;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengunggah logo');
      updateState({ error: errorMessage });
      return null;
    } finally {
      updateState({ isLoading: false });
    }
  }, [clinicId, state.clinic, updateState, handleError]);

  // Update clinic branding
  const updateBranding = useCallback(async (branding: ClinicBranding) => {
    if (!clinicId) {
      updateState({ error: 'Clinic ID not found. Please log in again.' });
      return false;
    }

    updateState({ isLoading: true, error: null });

    try {
      const response = await ClinicAPI.updateClinicBranding(clinicId, branding);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui branding klinik' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui branding klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [clinicId, updateState, handleError]);

  // Update clinic settings
  const updateSettings = useCallback(async (settings: ClinicSettings) => {
    if (!clinicId) {
      updateState({ error: 'Clinic ID not found. Please log in again.' });
      return false;
    }

    updateState({ isLoading: true, error: null });

    try {
      const response = await ClinicAPI.updateClinicSettings(clinicId, settings);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui pengaturan klinik' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui pengaturan klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [clinicId, updateState, handleError]);

  // Fetch clinic documents
  const fetchDocuments = useCallback(async () => {
    if (!clinicId) {
      updateState({ documentsError: 'Clinic ID not found. Please log in again.' });
      return;
    }

    updateState({ isDocumentsLoading: true, documentsError: null });
    
    try {
      const response = await ClinicAPI.getClinicDocuments(clinicId);
      if (response.success && response.data) {
        updateState({ documents: response.data });
      } else {
        updateState({ documentsError: response.message || 'Gagal mengambil daftar dokumen' });
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengambil daftar dokumen');
      updateState({ documentsError: errorMessage });
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [clinicId, updateState, handleError]);

  // Upload document
  const uploadDocument = useCallback(async (
    file: File, 
    documentType: ClinicDocument['type'], 
    options?: {
      name?: string;
      description?: string;
      onProgress?: (progress: number) => void;
    }
  ) => {
    if (!clinicId) {
      updateState({ documentsError: 'Clinic ID not found. Please log in again.' });
      return null;
    }

    updateState({ isDocumentsLoading: true, documentsError: null });

    try {
      const response = await ClinicAPI.uploadDocument(clinicId, file, documentType, options);
      if (response.success && response.data) {
        updateState({ 
          documents: [...state.documents, response.data]
        });
        return response.data;
      } else {
        updateState({ documentsError: response.message || 'Gagal mengunggah dokumen' });
        return null;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengunggah dokumen');
      updateState({ documentsError: errorMessage });
      return null;
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [state.documents, updateState, handleError]);

  // Delete document
  const deleteDocument = useCallback(async (documentId: string) => {
    if (!clinicId) {
      updateState({ documentsError: 'Clinic ID not found. Please log in again.' });
      return false;
    }

    updateState({ isDocumentsLoading: true, documentsError: null });

    try {
      const response = await ClinicAPI.deleteDocument(clinicId, documentId);
      if (response.success) {
        const updatedDocuments = state.documents.filter(doc => doc.id !== documentId);
        updateState({ documents: updatedDocuments });
        return true;
      } else {
        updateState({ documentsError: response.message || 'Gagal menghapus dokumen' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal menghapus dokumen');
      updateState({ documentsError: errorMessage });
      return false;
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [clinicId, state.documents, updateState, handleError]);

  // Download document
  const downloadDocument = useCallback(async (documentId: string, fileName: string) => {
    try {
      // Clinic document download would be handled via direct file download
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengunduh dokumen');
      updateState({ documentsError: errorMessage });
      return false;
    }
  }, [clinicId, state.documents, updateState, handleError]);

  // Clear errors
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const clearDocumentsError = useCallback(() => {
    updateState({ documentsError: null });
  }, [updateState]);

  const clearStatsError = useCallback(() => {
    updateState({ statsError: null });
  }, [updateState]);

  // Update clinic subscription
  const updateSubscription = useCallback(async (subscriptionTier: string) => {
    if (!clinicId) {
      updateState({ error: 'Clinic ID not found. Please log in again.' });
      return false;
    }

    updateState({ isLoading: true, error: null });
    
    try {
      const response = await ClinicAPI.updateSubscription(clinicId, subscriptionTier);
      if (response.success && response.data) {
        // Update auth store with new subscription information
        const { setUser, setClinic } = useAuthStore.getState();
        if (user) {
          setUser({
            ...user,
            subscriptionTier: response.data.subscriptionTier || undefined as any
          });
          // Also update the clinic data in the auth store
          if (state.clinic) {
            setClinic({
              ...state.clinic,
              subscriptionTier: response.data.subscriptionTier || undefined as any,
              isActive: true
            });
          }
        }
        
        // Refresh clinic data
        await fetchClinic();
        
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui subscription' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui subscription');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [clinicId, updateState, handleError, user, state.clinic, fetchClinic]);

  // Auto-fetch clinic data and stats on mount (but not on onboarding page)
  useEffect(() => {
    const isOnOnboardingPage = typeof window !== 'undefined' && window.location.pathname === '/onboarding';
    if (!isOnOnboardingPage) {
      fetchClinic();
      fetchStats();
    }
  }, [fetchClinic, fetchStats]);

  return {
    // Data
    clinic: state.clinic,
    documents: state.documents,
    stats: state.stats,
    
    // Loading states
    isLoading: state.isLoading,
    isDocumentsLoading: state.isDocumentsLoading,
    isStatsLoading: state.isStatsLoading,
    
    // Error states
    error: state.error,
    documentsError: state.documentsError,
    statsError: state.statsError,
    
    // Actions
    fetchClinic,
    fetchStats,
    createClinic,
    updateClinic,
    uploadLogo,
    updateBranding,
    updateSettings,
    updateSubscription,
    
    // Document actions
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    
    // Error clearing
    clearError,
    clearDocumentsError,
    clearStatsError
  };
};