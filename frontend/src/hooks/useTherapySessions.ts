'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { TherapySessionAPI, SessionWithClient, TherapySessionFilters } from '@/lib/api/therapySession';
import { TherapySessionStatusEnum } from '@/types/therapySession';

export interface UseTherapySessionsReturn {
  // Data
  sessions: SessionWithClient[];
  stats: {
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    plannedSessions: number;
    inProgressSessions: number;
    cancelledSessions: number;
    upcomingSessions: number;
  } | null;

  // Loading states
  loading: boolean;
  loadingStats: boolean;
  loadingAction: boolean;

  // Error state
  error: string | null;

  // Filters
  filters: TherapySessionFilters;

  // Actions
  loadSessions: (forceRefresh?: boolean) => Promise<void>;
  loadStats: () => Promise<void>;
  updateSessionStatus: (sessionId: string, status: TherapySessionStatusEnum, notes?: string) => Promise<void>;
  setFilters: (filters: Partial<TherapySessionFilters>) => void;
  clearError: () => void;
}

export const useTherapySessions = (): UseTherapySessionsReturn => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const therapistId = user?.id;

  // State
  const [sessions, setSessions] = useState<SessionWithClient[]>([]);
  const [stats, setStats] = useState<UseTherapySessionsReturn['stats']>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFiltersState] = useState<TherapySessionFilters>({
    status: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'asc' // Changed to 'asc' to show closest to today first
  });

  // Load sessions
  const loadSessions = useCallback(async (forceRefresh = false) => {
    if (!therapistId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await TherapySessionAPI.getTherapySessions(
        therapistId,
        1,
        100, // Load all sessions for now
        filters
      );

      if (response.success && response.data) {
        setSessions(response.data.items);
      } else {
        setError(response.message || 'Failed to load sessions');
        addToast({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to load sessions'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sessions';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [therapistId, filters, addToast]);

  // Load stats
  const loadStats = useCallback(async () => {
    if (!therapistId) return;

    try {
      setLoadingStats(true);
      setError(null);

      const response = await TherapySessionAPI.getTherapySessionStats(therapistId);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load session stats');
        addToast({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to load session stats'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load session stats';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setLoadingStats(false);
    }
  }, [therapistId, addToast]);

  // Update session status
  const updateSessionStatus = useCallback(async (
    sessionId: string,
    status: TherapySessionStatusEnum,
    notes?: string
  ) => {
    try {
      setLoadingAction(true);
      setError(null);

      const response = await TherapySessionAPI.updateSessionStatus(sessionId, status, notes);

      if (response.success && response.data) {
        // Update the session in the local state
        setSessions(prev => 
          prev.map(session => 
            session.id === sessionId ? response.data! : session
          )
        );

        addToast({
          type: 'success',
          title: 'Success',
          message: response.message || 'Session status updated successfully'
        });

        // Reload stats to reflect changes
        await loadStats();
      } else {
        setError(response.message || 'Failed to update session status');
        addToast({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to update session status'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update session status';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setLoadingAction(false);
    }
  }, [addToast, loadStats]);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<TherapySessionFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    sessions,
    stats,

    // Loading states
    loading,
    loadingStats,
    loadingAction,

    // Error state
    error,

    // Filters
    filters,

    // Actions
    loadSessions,
    loadStats,
    updateSessionStatus,
    setFilters,
    clearError
  };
};
