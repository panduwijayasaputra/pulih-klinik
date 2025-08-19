import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import {
  Session,
  SessionStatusEnum,
  CreateSessionData,
  UpdateSessionData,
  SessionFilters,
  SessionSort,
  SessionListData,
  ConsultationSummary,
} from '@/types/therapy';
import { TherapyAPI } from '@/lib/api/therapy';
import { 
  useTherapyStore,
  TherapyError,
  OptimisticUpdate,
} from '@/store/therapy';

// Query keys for React Query
export const therapyQueryKeys = {
  all: ['therapy'] as const,
  sessions: () => [...therapyQueryKeys.all, 'sessions'] as const,
  sessionsList: (filters?: SessionFilters, sort?: SessionSort) => 
    [...therapyQueryKeys.sessions(), 'list', { filters, sort }] as const,
  session: (id: string) => [...therapyQueryKeys.sessions(), 'detail', id] as const,
  consultations: () => [...therapyQueryKeys.all, 'consultations'] as const,
  consultationsList: (clientId: string, therapyId: string) => 
    [...therapyQueryKeys.consultations(), 'list', { clientId, therapyId }] as const,
  statistics: () => [...therapyQueryKeys.all, 'statistics'] as const,
} as const;

// Custom hook for therapy page data management
export function useTherapyData(clientId?: string, therapyId?: string) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  // Zustand store actions and selectors
  const {
    sessions,
    loading,
    error,
    filters,
    sort,
    consultationSummaries,
    statistics,
    setSessions,
    setLoading,
    setError,
    clearError,
    setConsultationSummaries,
    setStatistics,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    rollbackOptimisticUpdate,
    setSelectedClient,
    setSelectedTherapy,
    getFilteredSessions,
    getSortedSessions,
  } = useTherapyStore();

  // Set selected client and therapy when provided
  useEffect(() => {
    if (clientId) setSelectedClient(clientId);
    if (therapyId) setSelectedTherapy(therapyId);
  }, [clientId, therapyId, setSelectedClient, setSelectedTherapy]);

  // Sessions query with store integration
  const sessionsQuery = useQuery({
    queryKey: therapyQueryKeys.sessionsList(filters, sort),
    queryFn: async (): Promise<SessionListData> => {
      setLoading('sessions', true);
      setError(null);
      
      try {
        const response = await TherapyAPI.getSessions(filters, sort);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch sessions');
        }
        
        // Update store with fetched data
        setSessions(response.data!.items);
        
        return response.data!;
      } catch (error) {
        const therapyError: TherapyError = {
          code: 'FETCH_SESSIONS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch sessions',
          timestamp: new Date(),
        };
        setError(therapyError);
        throw error;
      } finally {
        setLoading('sessions', false);
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  // Consultation summaries query
  const consultationsQuery = useQuery({
    queryKey: therapyQueryKeys.consultationsList(clientId || '', therapyId || ''),
    queryFn: async (): Promise<ConsultationSummary[]> => {
      if (!clientId || !therapyId) return [];
      
      setLoading('consultations', true);
      
      try {
        const response = await TherapyAPI.getConsultationSummaries(clientId, therapyId);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch consultations');
        }
        
        // Update store
        setConsultationSummaries(response.data || []);
        
        return response.data || [];
      } catch (error) {
        console.error('Consultation fetch error:', error);
        return [];
      } finally {
        setLoading('consultations', false);
      }
    },
    enabled: !!clientId && !!therapyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create session mutation with optimistic updates
  const createSessionMutation = useMutation({
    mutationFn: async (data: CreateSessionData): Promise<Session> => {
      const response = await TherapyAPI.createSession(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create session');
      }
      return response.data!;
    },
    
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: therapyQueryKeys.sessions() });
      
      // Create optimistic session
      const optimisticSession: Session = {
        id: `temp-${Date.now()}`,
        sessionNumber: sessions.filter(s => s.therapyId === data.therapyId).length + 1,
        ...data,
        status: SessionStatusEnum.New,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add optimistic update
      const optimisticUpdate: OptimisticUpdate = {
        id: `create-${Date.now()}`,
        type: 'create',
        tempData: optimisticSession,
        timestamp: new Date(),
      };
      
      addOptimisticUpdate(optimisticUpdate);
      setLoading('creating', true);
      
      return { optimisticUpdate };
    },
    
    onSuccess: (newSession, variables, context) => {
      // Remove optimistic update and add real session
      if (context?.optimisticUpdate) {
        removeOptimisticUpdate(context.optimisticUpdate.id);
      }
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: therapyQueryKeys.sessions() });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil dibuat',
      });
    },
    
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.optimisticUpdate) {
        rollbackOptimisticUpdate(context.optimisticUpdate.id);
      }
      
      const therapyError: TherapyError = {
        code: 'CREATE_SESSION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create session',
        timestamp: new Date(),
      };
      setError(therapyError);
      
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Gagal membuat sesi',
      });
    },
    
    onSettled: () => {
      setLoading('creating', false);
    },
  });

  // Update session mutation with optimistic updates
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSessionData }): Promise<Session> => {
      const response = await TherapyAPI.updateSession(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update session');
      }
      return response.data!;
    },
    
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: therapyQueryKeys.session(id) });
      await queryClient.cancelQueries({ queryKey: therapyQueryKeys.sessions() });
      
      // Get current session
      const currentSession = sessions.find(s => s.id === id);
      if (!currentSession) throw new Error('Session not found');
      
      // Create optimistic session
      const optimisticSession: Session = {
        ...currentSession,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      // Add optimistic update
      const optimisticUpdate: OptimisticUpdate = {
        id: `update-${id}-${Date.now()}`,
        type: 'update',
        originalData: currentSession,
        tempData: optimisticSession,
        timestamp: new Date(),
      };
      
      addOptimisticUpdate(optimisticUpdate);
      setLoading('updating', id);
      
      return { optimisticUpdate, previousSession: currentSession };
    },
    
    onSuccess: (updatedSession, { id }, context) => {
      // Remove optimistic update
      if (context?.optimisticUpdate) {
        removeOptimisticUpdate(context.optimisticUpdate.id);
      }
      
      // Update query cache
      queryClient.setQueryData(therapyQueryKeys.session(id), updatedSession);
      queryClient.invalidateQueries({ queryKey: therapyQueryKeys.sessions() });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil diperbarui',
      });
    },
    
    onError: (error, { id }, context) => {
      // Rollback optimistic update
      if (context?.optimisticUpdate) {
        rollbackOptimisticUpdate(context.optimisticUpdate.id);
      }
      
      const therapyError: TherapyError = {
        code: 'UPDATE_SESSION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to update session',
        timestamp: new Date(),
      };
      setError(therapyError);
      
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Gagal memperbarui sesi',
      });
    },
    
    onSettled: () => {
      setLoading('updating', null);
    },
  });

  // Delete session mutation with optimistic updates
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      const response = await TherapyAPI.deleteSession(sessionId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete session');
      }
    },
    
    onMutate: async (sessionId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: therapyQueryKeys.sessions() });
      
      // Get current session
      const currentSession = sessions.find(s => s.id === sessionId);
      if (!currentSession) throw new Error('Session not found');
      
      // Add optimistic update
      const optimisticUpdate: OptimisticUpdate = {
        id: `delete-${sessionId}-${Date.now()}`,
        type: 'delete',
        originalData: currentSession,
        timestamp: new Date(),
      };
      
      addOptimisticUpdate(optimisticUpdate);
      setLoading('deleting', sessionId);
      
      return { optimisticUpdate, deletedSession: currentSession };
    },
    
    onSuccess: (_, sessionId, context) => {
      // Remove optimistic update
      if (context?.optimisticUpdate) {
        removeOptimisticUpdate(context.optimisticUpdate.id);
      }
      
      // Invalidate queries
      queryClient.removeQueries({ queryKey: therapyQueryKeys.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: therapyQueryKeys.sessions() });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil dihapus',
      });
    },
    
    onError: (error, sessionId, context) => {
      // Rollback optimistic update
      if (context?.optimisticUpdate) {
        rollbackOptimisticUpdate(context.optimisticUpdate.id);
      }
      
      const therapyError: TherapyError = {
        code: 'DELETE_SESSION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to delete session',
        timestamp: new Date(),
      };
      setError(therapyError);
      
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Gagal menghapus sesi',
      });
    },
    
    onSettled: () => {
      setLoading('deleting', null);
    },
  });

  // Computed values
  const filteredSessions = getFilteredSessions();
  const sortedSessions = getSortedSessions(filteredSessions);
  
  // Helper functions
  const refetchSessions = useCallback(() => {
    return sessionsQuery.refetch();
  }, [sessionsQuery]);
  
  const clearErrorState = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // Data
    sessions: sortedSessions,
    consultationSummaries,
    statistics,
    
    // Queries
    sessionsQuery,
    consultationsQuery,
    
    // Mutations
    createSession: createSessionMutation.mutateAsync,
    updateSession: updateSessionMutation.mutateAsync,
    deleteSession: deleteSessionMutation.mutateAsync,
    
    // Loading states
    isLoading: loading.sessions || sessionsQuery.isLoading,
    isCreating: loading.creating,
    isUpdating: loading.updating,
    isDeleting: loading.deleting,
    
    // Error state
    error,
    clearError: clearErrorState,
    
    // Actions
    refetchSessions,
    
    // Computed
    hasData: sortedSessions.length > 0,
    isEmpty: !loading.sessions && sortedSessions.length === 0,
  };
}

export default useTherapyData;