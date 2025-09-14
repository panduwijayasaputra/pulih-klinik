import { QueryClient, QueryKey, QueryFilters, MutationFilters } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/query-client';

// Cache strategies for different data types
export const cacheStrategies = {
  // Static or rarely changing data (30 minutes stale, 1 hour cache)
  static: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
  },
  
  // User profile data (15 minutes stale, 30 minutes cache)
  profile: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
  },
  
  // Session data (5 minutes stale, 10 minutes cache)
  session: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
  },
  
  // Real-time or frequently changing data (30 seconds stale, 2 minutes cache)
  realtime: {
    staleTime: 30 * 1000,      // 30 seconds
    gcTime: 2 * 60 * 1000,     // 2 minutes
  },
  
  // Critical data (always fresh)
  critical: {
    staleTime: 0,              // Always stale
    gcTime: 30 * 1000,         // 30 seconds cache
  },
} as const;

// Cache size management
export class CacheManager {
  private static maxCacheSize = 50 * 1024 * 1024; // 50MB
  private static cleanupThreshold = 0.8; // 80% of max size

  // Monitor cache size
  static getCacheSize(): number {
    try {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      return queries.reduce((size, query) => {
        const data = query.state.data;
        if (data) {
          // Rough estimation of object size in bytes
          return size + JSON.stringify(data).length * 2;
        }
        return size;
      }, 0);
    } catch (error) {
      console.warn('Failed to calculate cache size:', error);
      return 0;
    }
  }

  // Cleanup old or unused cache entries
  static async performCacheCleanup(): Promise<void> {
    const currentSize = this.getCacheSize();
    const threshold = this.maxCacheSize * this.cleanupThreshold;

    if (currentSize <= threshold) {
      return;
    }

    console.info('Cache cleanup triggered', { currentSize, threshold });

    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    // Sort queries by last accessed time (oldest first)
    const sortedQueries = queries
      .filter(query => query.state.data !== undefined)
      .sort((a, b) => {
        const aTime = a.state.dataUpdatedAt || 0;
        const bTime = b.state.dataUpdatedAt || 0;
        return aTime - bTime;
      });

    // Remove oldest queries until we're under the threshold
    let removedCount = 0;
    for (const query of sortedQueries) {
      if (this.getCacheSize() <= threshold) {
        break;
      }

      // Don't remove currently active queries
      if (query.getObserversCount() === 0) {
        queryClient.removeQueries({ queryKey: query.queryKey });
        removedCount++;
      }
    }

    console.info('Cache cleanup completed', { 
      removedQueries: removedCount, 
      newSize: this.getCacheSize() 
    });
  }

  // Schedule periodic cache cleanup
  static startPeriodicCleanup(intervalMs: number = 5 * 60 * 1000): () => void {
    const intervalId = setInterval(() => {
      this.performCacheCleanup();
    }, intervalMs);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

// Cache invalidation strategies
export class CacheInvalidationManager {
  // Invalidate related queries when data changes
  static invalidateRelatedQueries(
    changedEntityType: 'client' | 'therapist' | 'session' | 'consultation',
    entityId?: string
  ): void {
    const patterns: Record<typeof changedEntityType, QueryKey[]> = {
      client: [
        ['clients'],
        ...(entityId ? [
          ['clients', entityId],
          ['clients', entityId, 'profile'],
          ['clients', entityId, 'sessions'],
          ['clients', entityId, 'consultations'],
        ] : [])
      ],
      therapist: [
        ['therapists'],
        ...(entityId ? [
          ['therapists', entityId],
          ['therapists', entityId, 'profile'],
          ['therapists', entityId, 'sessions'],
          ['therapists', entityId, 'consultations'],
          ['therapists', entityId, 'availability'],
        ] : [])
      ],
      session: [
        ['sessions'],
        ...(entityId ? [
          ['sessions', entityId],
        ] : [])
      ],
      consultation: [
        ['consultations'],
        ...(entityId ? [
          ['consultations', entityId],
        ] : [])
      ],
    };

    patterns[changedEntityType].forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }

  // Smart invalidation based on user role and permissions
  static invalidateByRole(userRole: 'Administrator' | 'ClinicAdmin' | 'Therapist', clinicId?: string): void {
    switch (userRole) {
      case 'Administrator':
        // Administrators can see everything, so invalidate all queries
        queryClient.invalidateQueries();
        break;
        
      case 'ClinicAdmin':
        // Clinic admins can see clinic-specific data
        if (clinicId) {
          queryClient.invalidateQueries({ queryKey: ['clinics', clinicId] });
          queryClient.invalidateQueries({ queryKey: ['therapists'] });
          queryClient.invalidateQueries({ queryKey: ['clients'] });
        }
        break;
        
      case 'Therapist':
        // Therapists can only see their own data and assigned clients
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
        queryClient.invalidateQueries({ queryKey: ['consultations'] });
        break;
    }
  }

  // Time-based invalidation for different data types
  static scheduleTimeBasedInvalidation(): () => void {
    const intervals: Array<NodeJS.Timeout> = [];

    // Invalidate real-time data every 30 seconds
    intervals.push(setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'],
        exact: false 
      });
    }, 30 * 1000));

    // Invalidate session data every 5 minutes
    intervals.push(setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['sessions'],
        exact: false 
      });
    }, 5 * 60 * 1000));

    // Invalidate analytics data every 15 minutes
    intervals.push(setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['analytics'],
        exact: false 
      });
    }, 15 * 60 * 1000));

    // Return cleanup function
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }
}

// Background refetch manager
export class BackgroundRefreshManager {
  private static refreshIntervals = new Map<string, NodeJS.Timeout>();
  private static isOnline = true;
  private static visibilityState: 'visible' | 'hidden' = 'visible';

  // Initialize background refresh with smart strategies
  static startBackgroundRefresh(): () => void {
    const cleanupFunctions: Array<() => void> = [];

    // Monitor network connectivity
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        this.isOnline = true;
        this.resumeBackgroundRefresh();
      };
      const handleOffline = () => {
        this.isOnline = false;
        this.pauseBackgroundRefresh();
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      cleanupFunctions.push(() => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      });

      // Monitor page visibility
      const handleVisibilityChange = () => {
        this.visibilityState = document.hidden ? 'hidden' : 'visible';
        if (this.visibilityState === 'visible') {
          this.onPageVisible();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      cleanupFunctions.push(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      });
    }

    // Smart refresh intervals based on data criticality
    this.scheduleSmartRefresh();
    cleanupFunctions.push(() => this.clearAllIntervals());

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }

  // Schedule smart refresh based on data importance and user activity
  private static scheduleSmartRefresh(): void {
    // Critical data - refresh every 1 minute when online and page visible
    this.scheduleRefresh('critical', () => {
      if (this.shouldRefresh('critical')) {
        queryClient.refetchQueries({ 
          queryKey: ['notifications', 'unread'],
          type: 'active'
        });
      }
    }, 60 * 1000);

    // Real-time data - refresh every 2 minutes
    this.scheduleRefresh('realtime', () => {
      if (this.shouldRefresh('realtime')) {
        queryClient.refetchQueries({ 
          queryKey: ['notifications'],
          type: 'active'
        });
      }
    }, 2 * 60 * 1000);

    // Session data - refresh every 5 minutes
    this.scheduleRefresh('session', () => {
      if (this.shouldRefresh('session')) {
        queryClient.refetchQueries({ 
          queryKey: ['sessions'],
          type: 'active',
          stale: true // Only refetch stale queries
        });
      }
    }, 5 * 60 * 1000);

    // User profile - refresh every 15 minutes
    this.scheduleRefresh('profile', () => {
      if (this.shouldRefresh('profile')) {
        queryClient.invalidateQueries({ 
          queryKey: ['user'],
          refetchType: 'none'
        });
      }
    }, 15 * 60 * 1000);

    // Analytics and reports - refresh every 30 minutes
    this.scheduleRefresh('analytics', () => {
      if (this.shouldRefresh('analytics')) {
        queryClient.invalidateQueries({ 
          queryKey: ['analytics'],
          refetchType: 'none'
        });
      }
    }, 30 * 60 * 1000);
  }

  // Determine if refresh should happen based on conditions
  private static shouldRefresh(dataType: 'critical' | 'realtime' | 'session' | 'profile' | 'analytics'): boolean {
    // Don't refresh when offline
    if (!this.isOnline) return false;

    // Critical data refreshes even when page is hidden
    if (dataType === 'critical') return true;

    // Other data only refreshes when page is visible
    return this.visibilityState === 'visible';
  }

  // Schedule individual refresh intervals
  private static scheduleRefresh(key: string, callback: () => void, interval: number): void {
    const intervalId = setInterval(callback, interval);
    this.refreshIntervals.set(key, intervalId);
  }

  // Pause background refresh (when offline)
  private static pauseBackgroundRefresh(): void {
    this.refreshIntervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    console.info('Background refresh paused - offline');
  }

  // Resume background refresh (when back online)
  private static resumeBackgroundRefresh(): void {
    this.clearAllIntervals();
    this.scheduleSmartRefresh();
    
    // Immediately refresh critical data when back online
    queryClient.refetchQueries({ 
      type: 'active',
      stale: true 
    });
    
    console.info('Background refresh resumed - online');
  }

  // Handle page becoming visible
  private static onPageVisible(): void {
    // Refresh all stale queries when page becomes visible
    queryClient.refetchQueries({ 
      type: 'active',
      stale: true 
    });
    
    console.info('Page visible - refreshing stale queries');
  }

  // Clear all refresh intervals
  private static clearAllIntervals(): void {
    this.refreshIntervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.refreshIntervals.clear();
  }

  // Intelligent prefetch based on user navigation patterns
  static prefetchRelatedData(currentEntityType: string, currentEntityId: string): void {
    const prefetchStrategies = {
      client: () => {
        // When viewing a client, prefetch their sessions and consultations
        queryClient.prefetchQuery({
          queryKey: ['clients', currentEntityId, 'sessions'],
          queryFn: () => import('@/lib/api/therapySession').then(api => 
            api.getClientSessions(currentEntityId)
          ),
          staleTime: cacheStrategies.session.staleTime,
        });
        
        queryClient.prefetchQuery({
          queryKey: ['clients', currentEntityId, 'consultations'],
          queryFn: () => import('@/lib/api/consultation').then(api => 
            api.getClientConsultations(currentEntityId)
          ),
          staleTime: cacheStrategies.session.staleTime,
        });
      },
      
      therapist: () => {
        // When viewing a therapist, prefetch their sessions and schedule
        queryClient.prefetchQuery({
          queryKey: ['therapists', currentEntityId, 'sessions'],
          queryFn: () => import('@/lib/api/therapySession').then(api => 
            api.getTherapistSessions(currentEntityId)
          ),
          staleTime: cacheStrategies.session.staleTime,
        });
        
        queryClient.prefetchQuery({
          queryKey: ['therapists', currentEntityId, 'availability'],
          queryFn: () => import('@/lib/api/therapist').then(api => 
            api.getTherapistAvailability(currentEntityId)
          ),
          staleTime: cacheStrategies.profile.staleTime,
        });
      },
      
      session: () => {
        // When viewing a session, prefetch the client and therapist data
        import('@/lib/api/therapySession').then(api => api.getSession(currentEntityId))
          .then(session => {
            if (session.clientId) {
              queryClient.prefetchQuery({
                queryKey: ['clients', session.clientId],
                queryFn: () => import('@/lib/api/client').then(api => 
                  api.getClient(session.clientId!)
                ),
                staleTime: cacheStrategies.profile.staleTime,
              });
            }
            
            if (session.therapistId) {
              queryClient.prefetchQuery({
                queryKey: ['therapists', session.therapistId],
                queryFn: () => import('@/lib/api/therapist').then(api => 
                  api.getTherapist(session.therapistId!)
                ),
                staleTime: cacheStrategies.profile.staleTime,
              });
            }
          });
      },
    };

    const strategy = prefetchStrategies[currentEntityType as keyof typeof prefetchStrategies];
    if (strategy) {
      strategy();
    }
  }
}

// Cache warming utilities
export class CacheWarmupManager {
  // Warm up critical queries on app initialization
  static async warmupCriticalData(): Promise<void> {
    try {
      // Prefetch user profile
      await queryClient.prefetchQuery({
        queryKey: ['user'],
        queryFn: () => import('@/lib/api/auth').then(api => api.getCurrentUser()),
        staleTime: cacheStrategies.profile.staleTime,
      });

      // Prefetch unread notifications count
      await queryClient.prefetchQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: () => import('@/lib/api/notifications').then(api => api.getUnreadCount()).catch(() => 0),
        staleTime: cacheStrategies.realtime.staleTime,
      });

    } catch (error) {
      console.warn('Failed to warm up critical data:', error);
    }
  }

  // Warm up role-specific data
  static async warmupRoleSpecificData(userRole: string, clinicId?: string): Promise<void> {
    try {
      switch (userRole) {
        case 'Administrator':
          // Prefetch system-wide statistics
          queryClient.prefetchQuery({
            queryKey: ['analytics'],
            queryFn: () => import('@/lib/api/analytics').then(api => api.getSystemAnalytics()).catch(() => null),
            staleTime: cacheStrategies.static.staleTime,
          });
          break;

        case 'ClinicAdmin':
          if (clinicId) {
            // Prefetch clinic-specific data
            queryClient.prefetchQuery({
              queryKey: ['clinics', clinicId, 'analytics'],
              queryFn: () => import('@/lib/api/analytics').then(api => api.getClinicAnalytics(clinicId)).catch(() => null),
              staleTime: cacheStrategies.static.staleTime,
            });
          }
          break;

        case 'Therapist':
          // Prefetch therapist's upcoming sessions
          queryClient.prefetchQuery({
            queryKey: ['sessions', 'upcoming'],
            queryFn: () => import('@/lib/api/therapySession').then(api => api.getUpcomingSessions()).catch(() => []),
            staleTime: cacheStrategies.session.staleTime,
          });
          break;
      }
    } catch (error) {
      console.warn('Failed to warm up role-specific data:', error);
    }
  }
}

// Enhanced cache utilities with performance monitoring
export const enhancedCacheUtils = {
  // All existing cache utilities
  ...queryClient,

  // Performance monitoring
  getCacheStats: () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const mutations = queryClient.getMutationCache().getAll();

    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleMutations: mutations.filter(m => m.state.status === 'pending').length,
      cacheSize: CacheManager.getCacheSize(),
      maxCacheSize: 50 * 1024 * 1024,
      cacheHitRate: calculateCacheHitRate(),
    };
  },

  // Initialize cache management systems
  initializeCacheManagement: () => {
    const cleanupFunctions: Array<() => void> = [];

    // Start periodic cache cleanup
    cleanupFunctions.push(CacheManager.startPeriodicCleanup());

    // Start time-based invalidation
    cleanupFunctions.push(CacheInvalidationManager.scheduleTimeBasedInvalidation());

    // Start background refresh
    cleanupFunctions.push(BackgroundRefreshManager.startBackgroundRefresh());

    // Warm up critical data
    CacheWarmupManager.warmupCriticalData();

    // Return combined cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  },

  // Manual cache optimization
  optimizeCache: async () => {
    await CacheManager.performCacheCleanup();
    // Remove any failed mutations older than 1 hour
    const mutationCache = queryClient.getMutationCache();
    const oldFailedMutations = mutationCache.getAll().filter(mutation => {
      const isOld = Date.now() - mutation.state.submittedAt > 60 * 60 * 1000; // 1 hour
      const isFailed = mutation.state.status === 'error';
      return isOld && isFailed;
    });

    oldFailedMutations.forEach(mutation => {
      mutationCache.remove(mutation);
    });
  },
};

// Cache hit rate calculation
function calculateCacheHitRate(): number {
  // This would require tracking cache hits/misses
  // For now, return a placeholder value
  return 0.85; // 85% hit rate placeholder
}

export default enhancedCacheUtils;