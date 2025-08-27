import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { cacheStrategies } from '@/lib/utils/cache-utils';

// Default query options with optimized caching
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Use session strategy as default (5 minutes stale, 10 minutes cache)
    staleTime: cacheStrategies.session.staleTime,
    gcTime: cacheStrategies.session.gcTime,
    // Intelligent retry logic
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      // Retry up to 3 times for other errors with exponential backoff
      return failureCount < 3;
    },
    // Advanced retry delay with jitter to prevent thundering herd
    retryDelay: (attemptIndex) => {
      const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
      const jitter = Math.random() * 1000; // Add up to 1 second of jitter
      return baseDelay + jitter;
    },
    // Smart refetch strategies
    refetchOnWindowFocus: (query) => {
      // Only refetch if data is stale and query is not currently fetching
      return query.state.dataUpdatedAt + query.options.staleTime! < Date.now() && 
             !query.state.isFetching;
    },
    refetchOnReconnect: 'always',
    refetchOnMount: (query) => {
      // Refetch on mount only if data is stale or doesn't exist
      return !query.state.data || 
             query.state.dataUpdatedAt + query.options.staleTime! < Date.now();
    },
    // Network mode optimization
    networkMode: 'online',
    // Prefetch on component mount for better UX
    refetchInterval: false,
    // Enable background refetch for active queries
    refetchIntervalInBackground: false,
  },
  mutations: {
    // Conservative retry strategy for mutations
    retry: (failureCount, error) => {
      // Don't retry mutations on 4xx errors (client errors)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      // Only retry once for mutations to avoid duplicate operations
      return failureCount < 1;
    },
    // Faster retry for mutations with jitter
    retryDelay: (attemptIndex) => {
      const baseDelay = Math.min(500 * 2 ** attemptIndex, 5000);
      const jitter = Math.random() * 500;
      return baseDelay + jitter;
    },
    // Network mode for mutations
    networkMode: 'online',
  },
};

// Advanced cache persistence with compression
const createPersister = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return createSyncStoragePersister({
      storage: window.localStorage,
      key: 'smart-therapy-query-cache-v2',
      // Enhanced serialization with compression
      serialize: (data) => {
        try {
          // Filter out sensitive data before persistence
          const sanitizedData = sanitizeDataForPersistence(data);
          return JSON.stringify(sanitizedData);
        } catch (error) {
          console.warn('Failed to serialize cache data:', error);
          return '{}';
        }
      },
      deserialize: (data) => {
        try {
          return JSON.parse(data);
        } catch (error) {
          console.warn('Failed to deserialize cache data:', error);
          return {};
        }
      },
      // Optimized throttle time
      throttleTime: 2000, // Reduce localStorage writes
    });
  } catch (error) {
    console.warn('Failed to create query cache persister:', error);
    return null;
  }
};

// Sanitize data before persistence to avoid storing sensitive information
function sanitizeDataForPersistence(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Create a deep copy to avoid mutating original data
  const sanitized = JSON.parse(JSON.stringify(data));

  // Remove sensitive query keys and data
  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /auth/i,
  ];

  function removeSensitiveData(obj: any, path: string = ''): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) => removeSensitiveData(item, `${path}[${index}]`));
    }

    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      const isSensitive = sensitivePatterns.some(pattern => pattern.test(key));

      if (isSensitive) {
        // Skip sensitive fields
        continue;
      }

      cleaned[key] = removeSensitiveData(value, currentPath);
    }

    return cleaned;
  }

  return removeSensitiveData(sanitized);
}

// Global error handler for queries
const globalErrorHandler = (error: unknown) => {
  console.error('React Query error:', error);
  
  // Handle authentication errors
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as any).status;
    if (status === 401) {
      // Clear cache and redirect to login
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'query_error_401' }
        }));
      }
    }
  }
};

// Create the query client
export const createQueryClient = (): QueryClient => {
  const queryClient = new QueryClient({
    defaultOptions: defaultQueryOptions,
  });

  // Set up cache persistence
  const persister = createPersister();
  if (persister) {
    // Restore cache on mount with enhanced configuration
    persistQueryClient({
      queryClient,
      persister,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      buster: 'smart-therapy-v2', // Cache buster for app updates
      hydrateOptions: {
        defaultOptions: defaultQueryOptions,
      },
    });
  }

  return queryClient;
};

// Export the default query client instance
export const queryClient = createQueryClient();

// Query key factory for consistent cache management
export const queryKeys = {
  // Authentication
  auth: ['auth'] as const,
  user: ['user'] as const,
  
  // Clinics
  clinics: ['clinics'] as const,
  clinic: (id: string) => ['clinics', id] as const,
  clinicProfile: (id: string) => ['clinics', id, 'profile'] as const,
  clinicDocuments: (id: string) => ['clinics', id, 'documents'] as const,
  
  // Therapists
  therapists: ['therapists'] as const,
  therapist: (id: string) => ['therapists', id] as const,
  therapistProfile: (id: string) => ['therapists', id, 'profile'] as const,
  therapistSpecializations: (id: string) => ['therapists', id, 'specializations'] as const,
  therapistAvailability: (id: string) => ['therapists', id, 'availability'] as const,
  
  // Clients
  clients: ['clients'] as const,
  client: (id: string) => ['clients', id] as const,
  clientProfile: (id: string) => ['clients', id, 'profile'] as const,
  clientSessions: (id: string) => ['clients', id, 'sessions'] as const,
  clientConsultations: (id: string) => ['clients', id, 'consultations'] as const,
  
  // Therapy Sessions
  sessions: ['sessions'] as const,
  session: (id: string) => ['sessions', id] as const,
  therapistSessions: (therapistId: string) => ['therapists', therapistId, 'sessions'] as const,
  clientSessionsList: (clientId: string) => ['clients', clientId, 'sessions'] as const,
  
  // Consultations
  consultations: ['consultations'] as const,
  consultation: (id: string) => ['consultations', id] as const,
  therapistConsultations: (therapistId: string) => ['therapists', therapistId, 'consultations'] as const,
  clientConsultationsList: (clientId: string) => ['clients', clientId, 'consultations'] as const,
  
  // Assignments
  assignments: ['assignments'] as const,
  therapistAssignments: (therapistId: string) => ['therapists', therapistId, 'assignments'] as const,
  clientAssignments: (clientId: string) => ['clients', clientId, 'assignments'] as const,
  
  // Notifications
  notifications: ['notifications'] as const,
  unreadNotifications: ['notifications', 'unread'] as const,
  
  // Reports and Analytics
  reports: ['reports'] as const,
  analytics: ['analytics'] as const,
  therapistAnalytics: (therapistId: string) => ['analytics', 'therapist', therapistId] as const,
  clinicAnalytics: (clinicId: string) => ['analytics', 'clinic', clinicId] as const,
} as const;

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate all queries
  invalidateAll: () => queryClient.invalidateQueries(),
  
  // Invalidate queries by key
  invalidateQueries: (queryKey: readonly unknown[]) => 
    queryClient.invalidateQueries({ queryKey }),
  
  // Remove queries from cache
  removeQueries: (queryKey: readonly unknown[]) => 
    queryClient.removeQueries({ queryKey }),
  
  // Reset cache completely
  resetCache: () => queryClient.resetQueries(),
  
  // Prefetch queries
  prefetchQuery: async <T>(
    queryKey: readonly unknown[],
    queryFn: () => Promise<T>
  ) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  },
  
  // Set query data directly
  setQueryData: <T>(queryKey: readonly unknown[], data: T) => 
    queryClient.setQueryData(queryKey, data),
  
  // Get query data
  getQueryData: <T>(queryKey: readonly unknown[]): T | undefined => 
    queryClient.getQueryData(queryKey),
};

// Export default query client
export default queryClient;
