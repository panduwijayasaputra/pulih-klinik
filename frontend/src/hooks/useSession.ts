import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import {
  Session,
  SessionStatusEnum,
  CreateSessionData,
  UpdateSessionData,
  SessionFilters,
  SessionSort,
  SessionListData,
  SessionResponse,
  SessionListResponse,
  VALID_STATUS_TRANSITIONS,
} from '@/types/therapy';
import { TherapyAPI } from '@/lib/api/therapy';
import { validateStatusTransition } from '@/schemas/therapySchema';

// Hook for managing session data with React Query
export function useSessionsQuery(
  filters?: SessionFilters,
  sort?: SessionSort,
  page: number = 1,
  pageSize: number = 50,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['sessions', filters, sort, page, pageSize],
    queryFn: async (): Promise<SessionListData> => {
      const response = await TherapyAPI.getSessions(filters, sort, page, pageSize);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch sessions');
      }
      return response.data!;
    },
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    },
  });
}

// Hook for single session data
export function useSessionQuery(sessionId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: async (): Promise<Session> => {
      const response = await TherapyAPI.getSession(sessionId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch session');
      }
      return response.data!;
    },
    enabled: options?.enabled !== false && !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    },
  });
}

// Hook for session creation
export function useCreateSessionMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSessionData): Promise<Session> => {
      const response = await TherapyAPI.createSession(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create session');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.setQueryData(['session', data.id], data);
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil dibuat'
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal membuat sesi'
      });
    },
  });
}

// Hook for session updates
export function useUpdateSessionMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSessionData }): Promise<Session> => {
      const response = await TherapyAPI.updateSession(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update session');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Update cached data
      queryClient.setQueryData(['session', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil diperbarui'
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal memperbarui sesi'
      });
    },
  });
}

// Hook for session deletion
export function useDeleteSessionMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      const response = await TherapyAPI.deleteSession(sessionId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete session');
      }
    },
    onSuccess: (_, sessionId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil dihapus'
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal menghapus sesi'
      });
    },
  });
}

// Hook for session status changes
export function useSessionStatusMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ sessionId, newStatus }: { sessionId: string; newStatus: SessionStatusEnum }): Promise<Session> => {
      // Get current session data for validation
      const currentSession = queryClient.getQueryData(['session', sessionId]) as Session;
      
      if (currentSession) {
        // Validate status transition
        const validation = validateStatusTransition(currentSession.status, newStatus);
        if (!validation.success) {
          throw new Error(validation.errors?.[0]?.message || 'Invalid status transition');
        }
      }

      // Update session status
      const updateData: UpdateSessionData = { 
        status: newStatus,
        ...(newStatus === SessionStatusEnum.Started && { startTime: new Date().toISOString() }),
        ...(newStatus === SessionStatusEnum.Completed && { endTime: new Date().toISOString() }),
      };

      const response = await TherapyAPI.updateSession(sessionId, updateData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update session status');
      }
      return response.data!;
    },
    onMutate: async ({ sessionId, newStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] });
      await queryClient.cancelQueries({ queryKey: ['sessions'] });

      // Snapshot current value
      const previousSession = queryClient.getQueryData(['session', sessionId]);

      // Optimistically update
      if (previousSession) {
        queryClient.setQueryData(['session', sessionId], (old: Session) => ({
          ...old,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }));
      }

      return { previousSession };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousSession) {
        queryClient.setQueryData(['session', variables.sessionId], context.previousSession);
      }
      
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal mengubah status sesi'
      });
    },
    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(['session', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Status sesi berhasil diperbarui'
      });
    },
  });
}

// Comprehensive session management hook
export function useSessionManager(clientId?: string, therapyId?: string) {
  const { addToast } = useToast();
  const [filters, setFilters] = useState<SessionFilters>({
    clientId,
    therapyId,
  });

  // Queries
  const sessionsQuery = useSessionsQuery(filters);
  const createMutation = useCreateSessionMutation();
  const updateMutation = useUpdateSessionMutation();
  const deleteMutation = useDeleteSessionMutation();
  const statusMutation = useSessionStatusMutation();

  // Session continuity validation
  const checkSessionContinuity = useCallback((session: Session, allSessions: Session[]): { canProceed: boolean; reason?: string } => {
    const therapySessions = allSessions
      .filter(s => s.therapyId === session.therapyId)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);

    const currentIndex = therapySessions.findIndex(s => s.id === session.id);
    
    if (currentIndex <= 0) {
      return { canProceed: true };
    }

    // Check if all previous sessions are completed
    for (let i = 0; i < currentIndex; i++) {
      const prevSession = therapySessions[i];
      if (prevSession.status !== SessionStatusEnum.Completed) {
        return {
          canProceed: false,
          reason: `Sesi ${prevSession.sessionNumber} harus diselesaikan terlebih dahulu`
        };
      }
    }

    return { canProceed: true };
  }, []);

  // Get next session number for a therapy
  const getNextSessionNumber = useCallback((therapyId: string, sessions: Session[]): number => {
    const therapySessions = sessions
      .filter(s => s.therapyId === therapyId)
      .sort((a, b) => b.sessionNumber - a.sessionNumber);
    
    return therapySessions.length > 0 ? therapySessions[0].sessionNumber + 1 : 1;
  }, []);

  // Schedule conflict detection
  const checkScheduleConflict = useCallback((
    scheduledDate: string,
    duration: number = 60,
    excludeSessionId?: string
  ): { hasConflict: boolean; conflictingSessions: Session[] } => {
    if (!sessionsQuery.data?.items) {
      return { hasConflict: false, conflictingSessions: [] };
    }

    const newStart = new Date(scheduledDate);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    const conflictingSessions = sessionsQuery.data.items.filter(session => {
      // Skip the session being edited
      if (session.id === excludeSessionId) return false;
      
      // Only check scheduled or started sessions
      if (session.status !== SessionStatusEnum.Scheduled && session.status !== SessionStatusEnum.Started) {
        return false;
      }

      if (!session.scheduledDate) return false;

      const sessionStart = new Date(session.scheduledDate);
      const sessionEnd = new Date(sessionStart.getTime() + (session.duration || 60) * 60 * 1000);

      // Check for time overlap
      return (
        (newStart >= sessionStart && newStart < sessionEnd) ||
        (newEnd > sessionStart && newEnd <= sessionEnd) ||
        (newStart <= sessionStart && newEnd >= sessionEnd)
      );
    });

    return {
      hasConflict: conflictingSessions.length > 0,
      conflictingSessions
    };
  }, [sessionsQuery.data?.items]);

  // Actions
  const actions = useMemo(() => ({
    createSession: createMutation.mutateAsync,
    updateSession: updateMutation.mutateAsync,
    deleteSession: deleteMutation.mutateAsync,
    changeStatus: statusMutation.mutateAsync,
    refetch: sessionsQuery.refetch,
  }), [createMutation.mutateAsync, updateMutation.mutateAsync, deleteMutation.mutateAsync, statusMutation.mutateAsync, sessionsQuery.refetch]);

  // Filter actions
  const filterActions = useMemo(() => ({
    setFilters,
    clearFilters: () => setFilters({ clientId, therapyId }),
    addFilter: (key: keyof SessionFilters, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    removeFilter: (key: keyof SessionFilters) => {
      setFilters(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    },
  }), [clientId, therapyId]);

  return {
    // Data
    sessions: sessionsQuery.data?.items || [],
    total: sessionsQuery.data?.total || 0,
    page: sessionsQuery.data?.page || 1,
    pageSize: sessionsQuery.data?.pageSize || 50,
    
    // State
    isLoading: sessionsQuery.isLoading,
    isRefetching: sessionsQuery.isRefetching,
    error: sessionsQuery.error as Error | null,
    
    // Mutations state
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    
    // Actions
    ...actions,
    
    // Filters
    filters,
    ...filterActions,
    
    // Utilities
    checkSessionContinuity,
    getNextSessionNumber,
    checkScheduleConflict,
    
    // Computed values
    hasData: (sessionsQuery.data?.items?.length || 0) > 0,
    isEmpty: !sessionsQuery.isLoading && (sessionsQuery.data?.items?.length || 0) === 0,
  };
}

// Hook for individual session management
export function useSession(sessionId: string) {
  const query = useSessionQuery(sessionId);
  const updateMutation = useUpdateSessionMutation();
  const deleteMutation = useDeleteSessionMutation();
  const statusMutation = useSessionStatusMutation();

  const actions = useMemo(() => ({
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    changeStatus: (newStatus: SessionStatusEnum) => statusMutation.mutateAsync({ sessionId, newStatus }),
    refetch: query.refetch,
  }), [updateMutation.mutateAsync, deleteMutation.mutateAsync, statusMutation.mutateAsync, sessionId, query.refetch]);

  return {
    // Data
    session: query.data,
    
    // State
    isLoading: query.isLoading,
    error: query.error as Error | null,
    
    // Mutations state
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingStatus: statusMutation.isPending,
    
    // Actions
    ...actions,
  };
}

export default useSessionManager;