import { create } from 'zustand';
import { Client, ClientFilters } from '@/types/client';

interface ClientStore {
  // State
  selectedClient: Client | null;
  filters: ClientFilters;
  isCreateModalOpen: boolean;
  isProfileModalOpen: boolean;
  
  // Actions
  setSelectedClient: (client: Client | null) => void;
  setFilters: (filters: ClientFilters) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openProfileModal: (client: Client) => void;
  closeProfileModal: () => void;
  clearFilters: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  // Initial state
  selectedClient: null,
  filters: {},
  isCreateModalOpen: false,
  isProfileModalOpen: false,
  
  // Actions
  setSelectedClient: (client) => set({ selectedClient: client }),
  
  setFilters: (filters) => set({ filters }),
  
  openCreateModal: () => set({ isCreateModalOpen: true }),
  
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  
  openProfileModal: (client) => set({ 
    selectedClient: client, 
    isProfileModalOpen: true 
  }),
  
  closeProfileModal: () => set({ 
    isProfileModalOpen: false,
    selectedClient: null 
  }),
  
  clearFilters: () => set({ filters: {} })
}));