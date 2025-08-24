import { useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/toast';

import { useClientStatusStore } from '@/store/clientStatus';
import { useAuthStore } from '@/store/auth';
import { ClientStatusEnum } from '@/types/enums';
import type { StatusTransition } from '@/types/client';
import { validateStatusTransition } from '@/schemas/clientStatusSchema';

export interface UseClientStatusReturn {
  // State
  loading: boolean;
  error: string | null;
  
  // Status Operations
  getCurrentStatus: (clientId: string) => ClientStatusEnum | null;
  getStatusHistory: (clientId: string) => StatusTransition[];
  
  // Status Transitions
  transitionStatus: (
    clientId: string,
    toStatus: ClientStatusEnum,
    reason?: string,
    fromStatusOverride?: ClientStatusEnum | null
  ) => Promise<boolean>;
  
  // Validation
  canTransitionTo: (clientId: string, toStatus: ClientStatusEnum) => boolean;
  getAvailableTransitions: (clientId: string) => ClientStatusEnum[] | Promise<ClientStatusEnum[]>;
  
  // Utility
  clearError: () => void;
  refreshStatusHistory: (clientId: string) => void;
}

export const useClientStatus = (): UseClientStatusReturn => {
  const {
    loading,
    error,
    setError,
    getCurrentClientStatus,
    getClientStatusHistory,
    transitionClientStatus,
    clearStatusHistory,
  } = useClientStatusStore();

  const { user } = useAuthStore();
  const { addToast } = useToast();

  // Get current status for a client
  const getCurrentStatus = useCallback(
    (clientId: string) => {
      return getCurrentClientStatus(clientId);
    },
    [getCurrentClientStatus]
  );

  // Get status history for a client
  const getStatusHistory = useCallback(
    (clientId: string) => {
      return getClientStatusHistory(clientId);
    },
    [getClientStatusHistory]
  );

  // Transition client status with validation and error handling
  const transitionStatus = useCallback(
    async (clientId: string, toStatus: ClientStatusEnum, reason?: string, fromStatusOverride?: ClientStatusEnum | null) => {
      if (!user?.id) {
        setError('Pengguna tidak terautentikasi');
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Pengguna tidak terautentikasi',
        });
        return false;
      }

      // Use override status if provided, otherwise get from status store
      const currentStatus = fromStatusOverride !== undefined ? fromStatusOverride : getCurrentClientStatus(clientId);
      
      // Validate transition
      if (!validateStatusTransition(currentStatus, toStatus)) {
        const errorMsg = `Transisi status tidak valid: ${currentStatus || 'null'} → ${toStatus}`;
        setError(errorMsg);
        addToast({
          type: 'error',
          title: 'Error',
          message: errorMsg,
        });
        return false;
      }

      try {
        const success = await transitionClientStatus(
          clientId,
          currentStatus,
          toStatus,
          user.id,
          reason
        );

        if (success) {
          addToast({
            type: 'success',
            title: 'Berhasil',
            message: 'Status klien berhasil diperbarui',
          });
        }

        return success;
      } catch (error) {
        const errorMsg = 'Gagal memperbarui status klien';
        setError(errorMsg);
        addToast({
          type: 'error',
          title: 'Error', 
          message: errorMsg,
        });
        return false;
      }
    },
    [getCurrentClientStatus, transitionClientStatus, user?.id, setError, addToast]
  );

  // Check if client can transition to a specific status
  const canTransitionTo = useCallback(
    (clientId: string, toStatus: ClientStatusEnum) => {
      const currentStatus = getCurrentClientStatus(clientId);
      return validateStatusTransition(currentStatus, toStatus);
    },
    [getCurrentClientStatus]
  );

  // Get available status transitions for a client
  const getAvailableTransitions = useCallback(
    async (clientId: string) => {
      const currentStatus = getCurrentClientStatus(clientId);
      
      if (!currentStatus) {
        // If no status, only allow 'new'
        return [ClientStatusEnum.New];
      }

      // Dynamic import for ValidStatusTransitions
      const { ValidStatusTransitions } = await import('@/types/clientStatus');
      return ValidStatusTransitions[currentStatus] || [];
    },
    [getCurrentClientStatus]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Refresh status history (clear and reload)
  const refreshStatusHistory = useCallback(
    (clientId: string) => {
      clearStatusHistory(clientId);
      // In a real app, this would refetch from API
    },
    [clearStatusHistory]
  );

  // Memoized return value
  return useMemo(
    () => ({
      // State
      loading,
      error,
      
      // Status Operations
      getCurrentStatus,
      getStatusHistory,
      
      // Status Transitions
      transitionStatus,
      
      // Validation
      canTransitionTo,
      getAvailableTransitions,
      
      // Utility
      clearError,
      refreshStatusHistory,
    }),
    [
      loading,
      error,
      getCurrentStatus,
      getStatusHistory,
      transitionStatus,
      canTransitionTo,
      getAvailableTransitions,
      clearError,
      refreshStatusHistory,
    ]
  );
};