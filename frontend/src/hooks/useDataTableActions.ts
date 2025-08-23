import { useState, useCallback } from 'react';

export interface UseDataTableActionsOptions<T> {
  onDetail?: (item: T) => void | Promise<void>;
  onEdit?: (item: T) => void | Promise<void>;
  onDelete?: (item: T) => void | Promise<void>;
  onCustomAction?: (actionKey: string, item: T) => void | Promise<void>;
}

export interface DataTableActionState {
  loadingStates: Record<string, boolean>;
  setLoadingState: (actionKey: string, loading: boolean) => void;
  createAction: <T>(
    key: string,
    handler: (item: T) => void | Promise<void>,
    options?: {
      requiresDataFetch?: boolean;
      showLoading?: boolean;
    }
  ) => {
    key: string;
    onClick: (item: T) => Promise<void>;
    loading: (item: T) => boolean;
    requiresDataFetch?: boolean;
  };
  createDetailAction: <T>(
    onDetail: (item: T) => void | Promise<void>,
    options?: {
      showLoading?: boolean;
      fetchData?: (item: T) => Promise<T>;
    }
  ) => {
    key: string;
    onClick: (item: T) => Promise<void>;
    loading: (item: T) => boolean;
    requiresDataFetch?: boolean;
  };
  createEditAction: <T>(
    onEdit: (item: T) => void | Promise<void>,
    options?: {
      showLoading?: boolean;
      fetchData?: (item: T) => Promise<T>;
    }
  ) => {
    key: string;
    onClick: (item: T) => Promise<void>;
    loading: (item: T) => boolean;
    requiresDataFetch?: boolean;
  };
}

export const useDataTableActions = <T>(options: UseDataTableActionsOptions<T> = {}): DataTableActionState => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoadingState = useCallback((actionKey: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [actionKey]: loading
    }));
  }, []);

  const createAction = useCallback(<T>(
    key: string,
    handler: (item: T) => void | Promise<void>,
    options: {
      requiresDataFetch?: boolean;
      showLoading?: boolean;
    } = {}
  ) => {
    const { requiresDataFetch = false, showLoading = true } = options;

    return {
      key,
      onClick: async (item: T) => {
        if (showLoading) {
          setLoadingState(key, true);
        }
        
        try {
          const result = handler(item);
          if (result instanceof Promise) {
            await result;
          }
        } catch (error) {
          console.error(`Error in action ${key}:`, error);
          throw error;
        } finally {
          if (showLoading) {
            setLoadingState(key, false);
          }
        }
      },
      loading: (item: T) => loadingStates[key] || false,
      requiresDataFetch
    };
  }, [loadingStates, setLoadingState]);

  const createDetailAction = useCallback(<T>(
    onDetail: (item: T) => void | Promise<void>,
    options: {
      showLoading?: boolean;
      fetchData?: (item: T) => Promise<T>;
    } = {}
  ) => {
    const { showLoading = true, fetchData } = options;

    return {
      key: 'detail',
      onClick: async (item: T) => {
        if (showLoading) {
          setLoadingState('detail', true);
        }
        
        try {
          if (fetchData) {
            // Fetch fresh data first
            const freshData = await fetchData(item);
            await onDetail(freshData);
          } else {
            await onDetail(item);
          }
        } catch (error) {
          console.error('Error in detail action:', error);
          throw error;
        } finally {
          if (showLoading) {
            setLoadingState('detail', false);
          }
        }
      },
      loading: (item: T) => loadingStates['detail'] || false,
      requiresDataFetch: true
    };
  }, [loadingStates, setLoadingState]);

  const createEditAction = useCallback(<T>(
    onEdit: (item: T) => void | Promise<void>,
    options: {
      showLoading?: boolean;
      fetchData?: (item: T) => Promise<T>;
    } = {}
  ) => {
    const { showLoading = true, fetchData } = options;

    return {
      key: 'edit',
      onClick: async (item: T) => {
        if (showLoading) {
          setLoadingState('edit', true);
        }
        
        try {
          if (fetchData) {
            // Fetch fresh data first
            const freshData = await fetchData(item);
            await onEdit(freshData);
          } else {
            await onEdit(item);
          }
        } catch (error) {
          console.error('Error in edit action:', error);
          throw error;
        } finally {
          if (showLoading) {
            setLoadingState('edit', false);
          }
        }
      },
      loading: (item: T) => loadingStates['edit'] || false,
      requiresDataFetch: true
    };
  }, [loadingStates, setLoadingState]);

  return {
    loadingStates,
    setLoadingState,
    createAction,
    createDetailAction,
    createEditAction
  };
};

// Standalone action creators for backward compatibility
export const createDeleteAction = <T>(
  onDelete: (item: T) => void | Promise<void>,
  options: { showLoading?: boolean } = {}
) => {
  return {
    key: 'delete',
    onClick: onDelete,
    loading: () => false, // Loading handled by confirmation dialog
    requiresDataFetch: false
  };
};
