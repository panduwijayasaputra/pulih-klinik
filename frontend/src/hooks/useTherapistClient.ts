import { useState, useCallback, useEffect } from 'react';
import { TherapistClient, TherapistClientStats, TherapistClientSession, TherapistClientProgress, TherapistClientFilters } from '@/types/therapistClient';
import { TherapistClientAPI, TherapistClientAPIError } from '@/lib/api/therapistClient';
import { useAuth } from './useAuth';

export interface UseTherapistClientReturn {
  // Data
  clients: TherapistClient[];
  stats: TherapistClientStats | null;
  selectedClient: TherapistClient | null;
  clientSessions: TherapistClientSession[];
  clientProgress: TherapistClientProgress | null;

  // State
  loading: boolean;
  loadingStats: boolean;
  loadingSessions: boolean;
  loadingProgress: boolean;
  error: string | null;

  // Filters
  filters: TherapistClientFilters;

  // Actions
  loadClients: (forceRefresh?: boolean) => Promise<void>;
  loadStats: () => Promise<void>;
  loadClientSessions: (clientId: string) => Promise<void>;
  loadClientProgress: (clientId: string) => Promise<void>;
  selectClient: (clientId: string) => Promise<void>;
  updateClientNotes: (clientId: string, notes: { progressNotes?: string; therapistNotes?: string }) => Promise<boolean>;
  scheduleNextSession: (clientId: string, sessionDate: string) => Promise<boolean>;
  updateClientStatus: (clientId: string, status: string) => Promise<boolean>;
  setFilters: (filters: Partial<TherapistClientFilters>) => void;
  clearError: () => void;
}

export const useTherapistClient = (): UseTherapistClientReturn => {
  const { user } = useAuth();
  const therapistId = user?.id;

  // State
  const [clients, setClients] = useState<TherapistClient[]>([]);
  const [stats, setStats] = useState<TherapistClientStats | null>(null);
  const [selectedClient, setSelectedClient] = useState<TherapistClient | null>(null);
  const [clientSessions, setClientSessions] = useState<TherapistClientSession[]>([]);
  const [clientProgress, setClientProgress] = useState<TherapistClientProgress | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFiltersState] = useState<TherapistClientFilters>({
    status: 'all',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Load clients
  const loadClients = useCallback(async (forceRefresh = false) => {
    if (!therapistId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await TherapistClientAPI.getTherapistClients(
        therapistId,
        1,
        100, // Load all clients for now
        filters
      );

      if (response.success && response.data) {
        setClients(response.data.items);
      } else {
        setError(response.message || 'Failed to load clients');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to load clients';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [therapistId, filters]);

  // Load stats
  const loadStats = useCallback(async () => {
    if (!therapistId) return;

    try {
      setLoadingStats(true);
      setError(null);

      const response = await TherapistClientAPI.getTherapistClientStats(therapistId);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load statistics');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to load statistics';
      setError(errorMessage);
    } finally {
      setLoadingStats(false);
    }
  }, [therapistId]);

  // Load client sessions
  const loadClientSessions = useCallback(async (clientId: string) => {
    if (!therapistId) return;

    try {
      setLoadingSessions(true);
      setError(null);

      const response = await TherapistClientAPI.getTherapistClientSessions(therapistId, clientId);

      if (response.success && response.data) {
        setClientSessions(response.data);
      } else {
        setError(response.message || 'Failed to load client sessions');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to load client sessions';
      setError(errorMessage);
    } finally {
      setLoadingSessions(false);
    }
  }, [therapistId]);

  // Load client progress
  const loadClientProgress = useCallback(async (clientId: string) => {
    if (!therapistId) return;

    try {
      setLoadingProgress(true);
      setError(null);

      const response = await TherapistClientAPI.getTherapistClientProgress(therapistId, clientId);

      if (response.success && response.data) {
        setClientProgress(response.data);
      } else {
        setError(response.message || 'Failed to load client progress');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to load client progress';
      setError(errorMessage);
    } finally {
      setLoadingProgress(false);
    }
  }, [therapistId]);

  // Select client
  const selectClient = useCallback(async (clientId: string) => {
    if (!therapistId) return;

    try {
      setError(null);

      const response = await TherapistClientAPI.getTherapistClient(therapistId, clientId);

      if (response.success && response.data) {
        setSelectedClient(response.data);
      } else {
        setError(response.message || 'Failed to load client details');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to load client details';
      setError(errorMessage);
    }
  }, [therapistId]);

  // Update client notes
  const updateClientNotes = useCallback(async (
    clientId: string,
    notes: { progressNotes?: string; therapistNotes?: string }
  ): Promise<boolean> => {
    if (!therapistId) return false;

    try {
      setError(null);

      const response = await TherapistClientAPI.updateTherapistClientNotes(therapistId, clientId, notes);

      if (response.success && response.data) {
        // Update the client in the list
        setClients(prev => prev.map(client =>
          client.id === clientId ? response.data : client
        ));

        // Update selected client if it's the same
        if (selectedClient?.id === clientId) {
          setSelectedClient(response.data);
        }

        return true;
      } else {
        setError(response.message || 'Failed to update client notes');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to update client notes';
      setError(errorMessage);
      return false;
    }
  }, [therapistId, selectedClient]);

  // Schedule next session
  const scheduleNextSession = useCallback(async (clientId: string, sessionDate: string): Promise<boolean> => {
    if (!therapistId) return false;

    try {
      setError(null);

      const response = await TherapistClientAPI.scheduleNextSession(therapistId, clientId, sessionDate);

      if (response.success && response.data) {
        // Update the client in the list
        setClients(prev => prev.map(client =>
          client.id === clientId ? response.data : client
        ));

        // Update selected client if it's the same
        if (selectedClient?.id === clientId) {
          setSelectedClient(response.data);
        }

        return true;
      } else {
        setError(response.message || 'Failed to schedule next session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to schedule next session';
      setError(errorMessage);
      return false;
    }
  }, [therapistId, selectedClient]);

  // Update client status
  const updateClientStatus = useCallback(async (clientId: string, status: string): Promise<boolean> => {
    if (!therapistId) return false;

    try {
      setError(null);

      const response = await TherapistClientAPI.updateTherapistClientStatus(therapistId, clientId, status);

      if (response.success && response.data) {
        // Update the client in the list
        setClients(prev => prev.map(client =>
          client.id === clientId ? response.data : client
        ));

        // Update selected client if it's the same
        if (selectedClient?.id === clientId) {
          setSelectedClient(response.data);
        }

        // Reload stats to reflect the change
        await loadStats();

        return true;
      } else {
        setError(response.message || 'Failed to update client status');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapistClientAPIError
        ? err.message
        : 'Failed to update client status';
      setError(errorMessage);
      return false;
    }
  }, [therapistId, selectedClient, loadStats]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<TherapistClientFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    if (therapistId) {
      loadClients();
      loadStats();
    }
  }, [therapistId, loadClients, loadStats]);

  // Reload clients when filters change
  useEffect(() => {
    if (therapistId) {
      loadClients();
    }
  }, [filters, loadClients]);

  return {
    // Data
    clients,
    stats,
    selectedClient,
    clientSessions,
    clientProgress,

    // State
    loading,
    loadingStats,
    loadingSessions,
    loadingProgress,
    error,

    // Filters
    filters,

    // Actions
    loadClients,
    loadStats,
    loadClientSessions,
    loadClientProgress,
    selectClient,
    updateClientNotes,
    scheduleNextSession,
    updateClientStatus,
    setFilters,
    clearError,
  };
};
