import { create } from 'zustand';

import type { StatusTransition } from '@/types/client';
import { ClientStatusEnum } from '@/types/enums';
import { validateStatusTransition } from '@/schemas/clientStatusSchema';

interface ClientStatusStoreState {
  // Data
  statusTransitions: StatusTransition[];
  
  // Flags
  loading: boolean;
  error: string | null;

  // Mutators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Status Operations
  addStatusTransition: (transition: StatusTransition) => void;
  getClientStatusHistory: (clientId: string) => StatusTransition[];
  getCurrentClientStatus: (clientId: string) => ClientStatusEnum | null;
  
  // Status Transition with Validation
  transitionClientStatus: (
    clientId: string,
    fromStatus: ClientStatusEnum | null,
    toStatus: ClientStatusEnum,
    userId: string,
    reason?: string
  ) => Promise<boolean>;

  // Bulk Operations
  setStatusTransitions: (transitions: StatusTransition[]) => void;
  clearStatusHistory: (clientId: string) => void;
}

export const useClientStatusStore = create<ClientStatusStoreState>()(
  (set, get) => ({
      // Initial State
      statusTransitions: [],
      loading: false,
      error: null,

      // Flags
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      // Status Operations
      addStatusTransition: (transition: StatusTransition) => set((state) => ({
        statusTransitions: [transition, ...state.statusTransitions],
      })),

      getClientStatusHistory: (clientId: string) => {
        const state = get();
        return state.statusTransitions
          .filter(t => t.clientId === clientId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },

      getCurrentClientStatus: (clientId: string) => {
        const state = get();
        const clientTransitions = state.statusTransitions
          .filter(t => t.clientId === clientId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        return clientTransitions.length > 0 ? clientTransitions[0].toStatus : null;
      },

      transitionClientStatus: async (
        clientId: string,
        fromStatus: ClientStatusEnum | null,
        toStatus: ClientStatusEnum,
        userId: string,
        reason?: string
      ) => {
        // Validate the transition
        if (!validateStatusTransition(fromStatus, toStatus)) {
          set({ error: 'Transisi status tidak valid' });
          return false;
        }

        try {
          // Create new transition record
          const transition: StatusTransition = {
            id: crypto.randomUUID(),
            clientId,
            fromStatus,
            toStatus,
            timestamp: new Date().toISOString(),
            userId,
            reason: reason || undefined,
          };

          // Add the transition to store
          get().addStatusTransition(transition);
          set({ error: null });
          return true;
        } catch (error) {
          set({ error: 'Gagal melakukan transisi status' });
          return false;
        }
      },

      // Bulk Operations
      setStatusTransitions: (transitions: StatusTransition[]) => set({ statusTransitions: transitions }),

      clearStatusHistory: (clientId: string) => set((state) => ({
        statusTransitions: state.statusTransitions.filter(t => t.clientId !== clientId),
      })),
    })
  );