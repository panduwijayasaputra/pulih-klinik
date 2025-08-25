import { useState, useCallback, useEffect } from 'react';
import {
  TherapySession,
  TherapySessionStats,
  TherapySessionFilters,
  CreateTherapySessionData,
  UpdateTherapySessionData,
  AIPredictions,
  AIPrediction
} from '@/types/therapySession';
import { TherapySessionAPI, TherapySessionAPIError } from '@/lib/api/therapySession';
import { TherapySessionStatusEnum } from '@/types/therapySession';
import { useAuth } from './useAuth';

export interface UseTherapySessionReturn {
  // Data
  sessions: TherapySession[];
  stats: TherapySessionStats | null;
  selectedSession: TherapySession | null;
  aiPredictions: AIPredictions | null;

  // State
  loading: boolean;
  loadingStats: boolean;
  loadingPredictions: boolean;
  error: string | null;

  // Filters
  filters: TherapySessionFilters;

  // Actions
  loadSessions: (clientId: string, forceRefresh?: boolean) => Promise<void>;
  loadStats: (clientId: string) => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  createSession: (data: CreateTherapySessionData) => Promise<boolean>;
  updateSession: (sessionId: string, data: UpdateTherapySessionData) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  generatePredictions: (clientId: string) => Promise<boolean>;
  setFilters: (filters: Partial<TherapySessionFilters>) => void;
  clearError: () => void;
  setPredictions: (predictions: AIPredictions | null) => void;
}

export const useTherapySession = (): UseTherapySessionReturn => {
  const { user } = useAuth();
  const therapistId = user?.id;

  // State
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [stats, setStats] = useState<TherapySessionStats | null>(null);
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [aiPredictions, setAiPredictions] = useState<AIPredictions | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFiltersState] = useState<TherapySessionFilters>({
    status: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Load sessions
  const loadSessions = useCallback(async (clientId: string, forceRefresh = false) => {
    if (!therapistId || !clientId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await TherapySessionAPI.getTherapySessions(
        therapistId!,
        1,
        100, // Load all sessions for now
        filters
      );

      if (response.success && response.data) {
        // Filter sessions by clientId
        const clientSessions = response.data.items.filter(session => session.clientId === clientId);
        setSessions(clientSessions);
      } else {
        setError(response.message || 'Failed to load therapy sessions');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to load therapy sessions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [therapistId, filters]);

  // Load stats
  const loadStats = useCallback(async (clientId: string) => {
    if (!therapistId || !clientId) return;

    try {
      setLoadingStats(true);
      setError(null);

      // Get all sessions for the therapist and filter by client
      const response = await TherapySessionAPI.getTherapySessions(
        therapistId!,
        1,
        1000 // Get all sessions to calculate stats
      );

      if (response.success && response.data) {
        // Filter sessions by clientId and calculate stats
        const clientSessions = response.data.items.filter(session => session.clientId === clientId);
        
        const now = new Date();
        const upcomingSessions = clientSessions.filter(session => 
          session.status === TherapySessionStatusEnum.Scheduled &&
          new Date(session.date) > now
        ).length;

        const stats = {
          totalSessions: clientSessions.length,
          completedSessions: clientSessions.filter(s => s.status === TherapySessionStatusEnum.Completed).length,
          scheduledSessions: clientSessions.filter(s => s.status === TherapySessionStatusEnum.Scheduled).length,
          plannedSessions: clientSessions.filter(s => s.status === TherapySessionStatusEnum.Planned).length,
          inProgressSessions: clientSessions.filter(s => s.status === TherapySessionStatusEnum.InProgress).length,
          cancelledSessions: clientSessions.filter(s => s.status === TherapySessionStatusEnum.Cancelled).length,
          upcomingSessions
        };

        setStats(stats as any); // Type assertion to handle interface mismatch
      } else {
        setError(response.message || 'Failed to load therapy session stats');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to load therapy session stats';
      setError(errorMessage);
    } finally {
      setLoadingStats(false);
    }
  }, [therapistId]);

  // Select session
  const selectSession = useCallback(async (sessionId: string) => {
    try {
      setError(null);

      const response = await TherapySessionAPI.getTherapySession(sessionId);

      if (response.success && response.data) {
        setSelectedSession(response.data);
      } else {
        setError(response.message || 'Failed to load therapy session');
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to load therapy session';
      setError(errorMessage);
    }
  }, []);

  // Create session
  const createSession = useCallback(async (data: CreateTherapySessionData): Promise<boolean> => {
    if (!therapistId) return false;

    try {
      setError(null);

      const response = await TherapySessionAPI.createTherapySession({
        ...data,
        therapistId
      });

      if (response.success && response.data) {
        setSessions(prev => [...prev, response.data!]);
        return true;
      } else {
        setError(response.message || 'Failed to create therapy session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to create therapy session';
      setError(errorMessage);
      return false;
    }
  }, [therapistId]);

  // Update session
  const updateSession = useCallback(async (sessionId: string, data: UpdateTherapySessionData): Promise<boolean> => {
    try {
      setError(null);

      const response = await TherapySessionAPI.updateTherapySession(sessionId, data);

      if (response.success && response.data) {
        setSessions(prev => prev.map(session =>
          session.id === sessionId ? response.data! : session
        ));
        if (selectedSession?.id === sessionId) {
          setSelectedSession(response.data);
        }
        return true;
      } else {
        setError(response.message || 'Failed to update therapy session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to update therapy session';
      setError(errorMessage);
      return false;
    }
  }, [selectedSession]);

  // Delete session
  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await TherapySessionAPI.deleteTherapySession(sessionId);

      if (response.success) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
        }
        return true;
      } else {
        setError(response.message || 'Failed to delete therapy session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to delete therapy session';
      setError(errorMessage);
      return false;
    }
  }, [selectedSession]);

  // Generate AI predictions
  const generatePredictions = useCallback(async (clientId: string): Promise<boolean> => {
    try {
      setLoadingPredictions(true);
      setError(null);

      const response = await TherapySessionAPI.generateAIPredictions(clientId);

      if (response.success && response.data) {
        setAiPredictions(response.data);
        return true;
      } else {
        setError(response.message || 'Failed to generate AI predictions');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof TherapySessionAPIError
        ? err.message
        : 'Failed to generate AI predictions';
      setError(errorMessage);
      return false;
    } finally {
      setLoadingPredictions(false);
    }
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<TherapySessionFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set AI predictions
  const setPredictions = useCallback((predictions: AIPredictions | null) => {
    setAiPredictions(predictions);
  }, []);

  return {
    // Data
    sessions,
    stats,
    selectedSession,
    aiPredictions,

    // State
    loading,
    loadingStats,
    loadingPredictions,
    error,

    // Filters
    filters,

    // Actions
    loadSessions,
    loadStats,
    selectSession,
    createSession,
    updateSession,
    deleteSession,
    generatePredictions,
    setFilters,
    clearError,
    setPredictions
  };
};
