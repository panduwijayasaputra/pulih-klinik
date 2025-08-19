import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  Session,
  SessionStatusEnum,
  CreateSessionData,
  UpdateSessionData,
  SessionFilters,
  SessionSort,
  SessionStatistics,
  SessionListData,
  ConsultationSummary,
} from '@/types/therapy';

// Error types for therapy operations
export interface TherapyError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Loading states for different operations
export interface TherapyLoadingState {
  sessions: boolean;
  consultations: boolean;
  statistics: boolean;
  creating: boolean;
  updating: string | null; // sessionId being updated
  deleting: string | null; // sessionId being deleted
}

// Optimistic update tracking
export interface OptimisticUpdate {
  id: string;
  type: 'create' | 'update' | 'delete';
  originalData?: Session;
  tempData?: Session;
  timestamp: Date;
}

// Therapy store state interface
export interface TherapyState {
  // Data
  sessions: Session[];
  consultationSummaries: ConsultationSummary[];
  statistics: SessionStatistics | null;
  
  // Current selection and filtering
  selectedClientId: string | null;
  selectedTherapyId: string | null;
  filters: SessionFilters;
  sort: SessionSort;
  
  // UI state
  loading: TherapyLoadingState;
  error: TherapyError | null;
  lastUpdated: Date | null;
  
  // Optimistic updates
  optimisticUpdates: OptimisticUpdate[];
  
  // Cache invalidation
  cacheKeys: Set<string>;
}

// Therapy store actions interface
export interface TherapyActions {
  // Session management
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  removeSession: (sessionId: string) => void;
  
  // Optimistic updates
  addOptimisticUpdate: (update: OptimisticUpdate) => void;
  removeOptimisticUpdate: (updateId: string) => void;
  rollbackOptimisticUpdate: (updateId: string) => void;
  
  // Filtering and sorting
  setFilters: (filters: Partial<SessionFilters>) => void;
  clearFilters: () => void;
  setSort: (sort: SessionSort) => void;
  
  // Selection
  setSelectedClient: (clientId: string | null) => void;
  setSelectedTherapy: (therapyId: string | null) => void;
  
  // Loading states
  setLoading: (key: keyof TherapyLoadingState, value: boolean | string | null) => void;
  
  // Error handling
  setError: (error: TherapyError | null) => void;
  clearError: () => void;
  
  // Consultation summaries
  setConsultationSummaries: (summaries: ConsultationSummary[]) => void;
  
  // Statistics
  setStatistics: (stats: SessionStatistics) => void;
  
  // Cache management
  invalidateCache: (key?: string) => void;
  addCacheKey: (key: string) => void;
  
  // Data synchronization
  markDataAsUpdated: () => void;
  
  // Selectors
  getSessionsByClient: (clientId: string) => Session[];
  getSessionsByTherapy: (therapyId: string) => Session[];
  getFilteredSessions: () => Session[];
  getSortedSessions: (sessions: Session[]) => Session[];
  getSessionById: (sessionId: string) => Session | undefined;
  
  // Utility actions
  reset: () => void;
}

// Combined store type
export type TherapyStore = TherapyState & TherapyActions;

// Initial state
const initialState: TherapyState = {
  sessions: [],
  consultationSummaries: [],
  statistics: null,
  selectedClientId: null,
  selectedTherapyId: null,
  filters: {},
  sort: { field: 'sessionNumber', order: 'asc' },
  loading: {
    sessions: false,
    consultations: false,
    statistics: false,
    creating: false,
    updating: null,
    deleting: null,
  },
  error: null,
  lastUpdated: null,
  optimisticUpdates: [],
  cacheKeys: new Set(),
};

// Zustand store with persist, devtools, and immer
export const useTherapyStore = create<TherapyStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Session management
        setSessions: (sessions) => {
          set((state) => {
            state.sessions = sessions;
            state.lastUpdated = new Date();
          });
        },
        
        addSession: (session) => {
          set((state) => {
            state.sessions.push(session);
            state.lastUpdated = new Date();
          });
        },
        
        updateSession: (sessionId, updates) => {
          set((state) => {
            const sessionIndex = state.sessions.findIndex(s => s.id === sessionId);
            if (sessionIndex !== -1) {
              state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...updates };
              state.lastUpdated = new Date();
            }
          });
        },
        
        removeSession: (sessionId) => {
          set((state) => {
            state.sessions = state.sessions.filter(s => s.id !== sessionId);
            state.lastUpdated = new Date();
          });
        },
        
        // Optimistic updates
        addOptimisticUpdate: (update) => {
          set((state) => {
            state.optimisticUpdates.push(update);
            
            // Apply optimistic update immediately
            switch (update.type) {
              case 'create':
                if (update.tempData) {
                  state.sessions.push(update.tempData);
                }
                break;
              case 'update':
                if (update.tempData) {
                  const sessionIndex = state.sessions.findIndex(s => s.id === update.tempData!.id);
                  if (sessionIndex !== -1) {
                    update.originalData = { ...state.sessions[sessionIndex] };
                    state.sessions[sessionIndex] = update.tempData;
                  }
                }
                break;
              case 'delete':
                const deleteIndex = state.sessions.findIndex(s => s.id === update.id);
                if (deleteIndex !== -1) {
                  update.originalData = { ...state.sessions[deleteIndex] };
                  state.sessions.splice(deleteIndex, 1);
                }
                break;
            }
          });
        },
        
        removeOptimisticUpdate: (updateId) => {
          set((state) => {
            state.optimisticUpdates = state.optimisticUpdates.filter(u => u.id !== updateId);
          });
        },
        
        rollbackOptimisticUpdate: (updateId) => {
          set((state) => {
            const updateIndex = state.optimisticUpdates.findIndex(u => u.id === updateId);
            if (updateIndex === -1) return;
            
            const update = state.optimisticUpdates[updateIndex];
            
            // Rollback the optimistic change
            switch (update.type) {
              case 'create':
                if (update.tempData) {
                  state.sessions = state.sessions.filter(s => s.id !== update.tempData!.id);
                }
                break;
              case 'update':
                if (update.originalData) {
                  const sessionIndex = state.sessions.findIndex(s => s.id === update.originalData!.id);
                  if (sessionIndex !== -1) {
                    state.sessions[sessionIndex] = update.originalData;
                  }
                }
                break;
              case 'delete':
                if (update.originalData) {
                  state.sessions.push(update.originalData);
                }
                break;
            }
            
            // Remove the update from tracking
            state.optimisticUpdates.splice(updateIndex, 1);
          });
        },
        
        // Filtering and sorting
        setFilters: (filters) => {
          set((state) => {
            state.filters = { ...state.filters, ...filters };
          });
        },
        
        clearFilters: () => {
          set((state) => {
            state.filters = {};
          });
        },
        
        setSort: (sort) => {
          set((state) => {
            state.sort = sort;
          });
        },
        
        // Selection
        setSelectedClient: (clientId) => {
          set((state) => {
            state.selectedClientId = clientId;
          });
        },
        
        setSelectedTherapy: (therapyId) => {
          set((state) => {
            state.selectedTherapyId = therapyId;
          });
        },
        
        // Loading states
        setLoading: (key, value) => {
          set((state) => {
            (state.loading as any)[key] = value;
          });
        },
        
        // Error handling
        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },
        
        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },
        
        // Consultation summaries
        setConsultationSummaries: (summaries) => {
          set((state) => {
            state.consultationSummaries = summaries;
            state.lastUpdated = new Date();
          });
        },
        
        // Statistics
        setStatistics: (stats) => {
          set((state) => {
            state.statistics = stats;
            state.lastUpdated = new Date();
          });
        },
        
        // Cache management
        invalidateCache: (key) => {
          set((state) => {
            if (key) {
              state.cacheKeys.delete(key);
            } else {
              state.cacheKeys.clear();
            }
          });
        },
        
        addCacheKey: (key) => {
          set((state) => {
            state.cacheKeys.add(key);
          });
        },
        
        // Data synchronization
        markDataAsUpdated: () => {
          set((state) => {
            state.lastUpdated = new Date();
          });
        },
        
        // Selectors
        getSessionsByClient: (clientId) => {
          const { sessions } = get();
          return sessions.filter(session => session.clientId === clientId);
        },
        
        getSessionsByTherapy: (therapyId) => {
          const { sessions } = get();
          return sessions.filter(session => session.therapyId === therapyId);
        },
        
        getFilteredSessions: () => {
          const { sessions, filters } = get();
          let filteredSessions = [...sessions];
          
          // Apply filters
          if (filters.clientId) {
            filteredSessions = filteredSessions.filter(s => s.clientId === filters.clientId);
          }
          
          if (filters.therapyId) {
            filteredSessions = filteredSessions.filter(s => s.therapyId === filters.therapyId);
          }
          
          if (filters.status) {
            filteredSessions = filteredSessions.filter(s => s.status === filters.status);
          }
          
          if (filters.type) {
            filteredSessions = filteredSessions.filter(s => s.type === filters.type);
          }
          
          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filteredSessions = filteredSessions.filter(s => 
              s.scheduledDate && new Date(s.scheduledDate) >= fromDate
            );
          }
          
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            filteredSessions = filteredSessions.filter(s => 
              s.scheduledDate && new Date(s.scheduledDate) <= toDate
            );
          }
          
          return filteredSessions;
        },
        
        getSortedSessions: (sessions) => {
          const { sort } = get();
          const sortedSessions = [...sessions];
          
          sortedSessions.sort((a, b) => {
            let aValue: any;
            let bValue: any;
            
            switch (sort.field) {
              case 'sessionNumber':
                aValue = a.sessionNumber;
                bValue = b.sessionNumber;
                break;
              case 'title':
                aValue = a.title;
                bValue = b.title;
                break;
              case 'scheduledDate':
                aValue = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
                bValue = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
                break;
              case 'status':
                aValue = a.status;
                bValue = b.status;
                break;
              case 'createdAt':
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
                break;
              default:
                aValue = a.sessionNumber;
                bValue = b.sessionNumber;
            }
            
            if (sort.order === 'asc') {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
          });
          
          return sortedSessions;
        },
        
        getSessionById: (sessionId) => {
          const { sessions } = get();
          return sessions.find(session => session.id === sessionId);
        },
        
        // Utility actions
        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'therapy-store',
        partialize: (state) => ({
          // Only persist essential data, not loading states or errors
          sessions: state.sessions,
          consultationSummaries: state.consultationSummaries,
          selectedClientId: state.selectedClientId,
          selectedTherapyId: state.selectedTherapyId,
          filters: state.filters,
          sort: state.sort,
          lastUpdated: state.lastUpdated,
        }),
      }
    ),
    { name: 'therapy-store' }
  )
);

// Selector hooks for optimized re-renders
export const useTherapySessions = () => useTherapyStore(state => state.sessions);
export const useTherapyLoading = () => useTherapyStore(state => state.loading);
export const useTherapyError = () => useTherapyStore(state => state.error);
export const useTherapyFilters = () => useTherapyStore(state => state.filters);
export const useTherapySort = () => useTherapyStore(state => state.sort);
export const useSelectedClientId = () => useTherapyStore(state => state.selectedClientId);
export const useSelectedTherapyId = () => useTherapyStore(state => state.selectedTherapyId);
export const useConsultationSummaries = () => useTherapyStore(state => state.consultationSummaries);
export const useTherapyStatistics = () => useTherapyStore(state => state.statistics);

// Computed selectors
export const useFilteredSessions = () => useTherapyStore(state => state.getFilteredSessions());
export const useSortedFilteredSessions = () => {
  const filteredSessions = useTherapyStore(state => state.getFilteredSessions());
  const getSortedSessions = useTherapyStore(state => state.getSortedSessions);
  return getSortedSessions(filteredSessions);
};

export default useTherapyStore;