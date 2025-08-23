import { create } from 'zustand';

import type { Client } from '@/types/client';
import type { SessionSummary } from '@/types/client';

interface ClientStoreState {
  // Data
  clients: Client[];
  selectedClientId: string | null;
  sessionsByClientId: Record<string, SessionSummary[]>;

  // Flags
  loading: boolean;
  error: string | null;

  // Mutators
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  setSelectedClientId: (clientId: string | null) => void;

  setClientSessions: (clientId: string, sessions: SessionSummary[]) => void;
  clearClientSessions: (clientId: string) => void;
}

export const useClientStore = create<ClientStoreState>()(
  (set, get) => ({
      // Initial State
      clients: [],
      selectedClientId: null,
      sessionsByClientId: {},
      loading: false,
      error: null,

      // Flags
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      // Clients
      setClients: (clients: Client[]) => set({ clients }),

      addClient: (client: Client) => set((state) => ({
        clients: [client, ...state.clients],
      })),

      updateClient: (id: string, updates: Partial<Client>) => set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      })),

      deleteClient: (id: string) => set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
      })),

      // Selection
      setSelectedClientId: (clientId: string | null) => set({ selectedClientId: clientId }),

      // Sessions
      setClientSessions: (clientId: string, sessions: SessionSummary[]) => set((state) => ({
        sessionsByClientId: { ...state.sessionsByClientId, [clientId]: sessions },
      })),

      clearClientSessions: (clientId: string) => set((state) => {
        const { [clientId]: _removed, ...rest } = state.sessionsByClientId;
        return { sessionsByClientId: rest };
      }),
    })
  );


