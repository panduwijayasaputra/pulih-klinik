import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CacheInvalidationManager, BackgroundRefreshManager } from '@/lib/utils/cache-utils';
import { queryKeys } from '@/lib/api/query-client';

// Hook for managing cache invalidation
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  // Invalidate related queries when data changes
  const invalidateRelated = useCallback((
    entityType: 'client' | 'therapist' | 'session' | 'consultation',
    entityId?: string
  ) => {
    CacheInvalidationManager.invalidateRelatedQueries(entityType, entityId);
  }, []);

  // Invalidate queries based on user role
  const invalidateByRole = useCallback((
    userRole: 'Administrator' | 'ClinicAdmin' | 'Therapist',
    clinicId?: string
  ) => {
    CacheInvalidationManager.invalidateByRole(userRole, clinicId);
  }, []);

  // Smart invalidation for CRUD operations
  const invalidateAfterMutation = useCallback((
    operation: 'create' | 'update' | 'delete',
    entityType: 'client' | 'therapist' | 'session' | 'consultation',
    entityId?: string,
    additionalInvalidations?: string[][]
  ) => {
    // Always invalidate the list query
    const listKey = queryKeys[`${entityType}s` as keyof typeof queryKeys];
    queryClient.invalidateQueries({ queryKey: listKey as any });

    if (entityId) {
      switch (operation) {
        case 'create':
          // For create operations, just invalidate lists
          break;
        case 'update':
          // For updates, invalidate the specific entity
          const entityKey = queryKeys[entityType as keyof typeof queryKeys] as any;
          if (typeof entityKey === 'function') {
            queryClient.invalidateQueries({ queryKey: entityKey(entityId) });
          }
          break;
        case 'delete':
          // For deletes, remove the specific entity from cache
          const deleteKey = queryKeys[entityType as keyof typeof queryKeys] as any;
          if (typeof deleteKey === 'function') {
            queryClient.removeQueries({ queryKey: deleteKey(entityId) });
          }
          break;
      }
    }

    // Invalidate related data
    invalidateRelated(entityType, entityId);

    // Handle additional invalidations
    if (additionalInvalidations) {
      additionalInvalidations.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
    }
  }, [queryClient, invalidateRelated]);

  // Optimistic updates with rollback capability
  const optimisticUpdate = useCallback(<T>(
    queryKey: string[],
    updater: (old: T | undefined) => T,
    mutationPromise: Promise<T>
  ) => {
    // Cancel any outgoing refetches
    queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousValue = queryClient.getQueryData<T>(queryKey);

    // Optimistically update to the new value
    queryClient.setQueryData<T>(queryKey, updater);

    // Return a context with the previous value and rollback function
    return {
      previousValue,
      rollback: () => queryClient.setQueryData<T>(queryKey, previousValue),
      confirm: mutationPromise.then(
        (data) => {
          queryClient.setQueryData<T>(queryKey, data);
          return data;
        },
        (error) => {
          queryClient.setQueryData<T>(queryKey, previousValue);
          throw error;
        }
      )
    };
  }, [queryClient]);

  // Batch invalidation for multiple operations
  const batchInvalidate = useCallback((invalidations: Array<{
    queryKey: string[];
    type?: 'invalidate' | 'remove' | 'reset';
  }>) => {
    invalidations.forEach(({ queryKey, type = 'invalidate' }) => {
      switch (type) {
        case 'invalidate':
          queryClient.invalidateQueries({ queryKey });
          break;
        case 'remove':
          queryClient.removeQueries({ queryKey });
          break;
        case 'reset':
          queryClient.resetQueries({ queryKey });
          break;
      }
    });
  }, [queryClient]);

  // Selective cache warming
  const warmupQueries = useCallback(async (
    queries: Array<{
      queryKey: string[];
      queryFn: () => Promise<any>;
      staleTime?: number;
    }>
  ) => {
    const prefetchPromises = queries.map(({ queryKey, queryFn, staleTime }) =>
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
      })
    );

    try {
      await Promise.allSettled(prefetchPromises);
    } catch (error) {
      console.warn('Some warmup queries failed:', error);
    }
  }, [queryClient]);

  return {
    invalidateRelated,
    invalidateByRole,
    invalidateAfterMutation,
    optimisticUpdate,
    batchInvalidate,
    warmupQueries,
  };
}

// Hook for background refresh management
export function useBackgroundRefresh() {
  // Prefetch related data based on current page/entity
  const prefetchRelatedData = useCallback((
    entityType: string,
    entityId: string
  ) => {
    BackgroundRefreshManager.prefetchRelatedData(entityType, entityId);
  }, []);

  return {
    prefetchRelatedData,
  };
}

// Hook for cache performance monitoring
export function useCacheMetrics() {
  const queryClient = useQueryClient();

  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const mutations = queryClient.getMutationCache().getAll();

    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      pendingMutations: mutations.filter(m => m.state.status === 'pending').length,
      errorMutations: mutations.filter(m => m.state.status === 'error').length,
    };
  }, [queryClient]);

  const clearErrorQueries = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const errorQueries = cache.getAll().filter(q => q.state.status === 'error');
    
    errorQueries.forEach(query => {
      queryClient.removeQueries({ queryKey: query.queryKey });
    });

    return errorQueries.length;
  }, [queryClient]);

  const refreshStaleQueries = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.isStale(),
    });
  }, [queryClient]);

  return {
    getCacheStats,
    clearErrorQueries,
    refreshStaleQueries,
  };
}

export default useCacheInvalidation;