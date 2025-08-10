'use client';

import { useCallback } from 'react';

import type { Client, ClientFormData, SessionSummary } from '@/types/client';
import { ClientEducationEnum, ClientGenderEnum, ClientStatusEnum } from '@/types/enums';
import { useClientStore } from '@/store/client';
import { ClientAPI } from '@/lib/api/client';

export const useClient = () => {
  const {
    clients,
    selectedClientId,
    sessionsByClientId,
    loading,
    error,
    setLoading,
    setError,
    setClients,
    addClient,
    updateClient,
    deleteClient,
    setSelectedClientId,
    setClientSessions,
  } = useClientStore();

  const getClientById = useCallback((id: string): Client | undefined => {
    return clients.find((c) => c.id === id);
  }, [clients]);

  const loadClients = useCallback(async (): Promise<Client[]> => {
    setLoading(true);
    setError(null);
    try {
      // Mock API delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For now, return mock data since we don't have a real API
      // In the future, this would call ClientAPI.getClients()
      const mockClients: Client[] = [
        {
          id: 'c-001',
          name: 'Andi Wijaya',
          age: 29,
          gender: ClientGenderEnum.Male,
          phone: '+62-812-1111-2222',
          email: 'andi@example.com',
          occupation: 'Karyawan',
          education: ClientEducationEnum.Bachelor,
          address: 'Jl. Sudirman No. 1, Jakarta',
          status: ClientStatusEnum.Active,
          joinDate: '2024-01-20',
          totalSessions: 3,
          primaryIssue: 'Kecemasan',
          progress: 40,
        },
        {
          id: 'c-002',
          name: 'Siti Rahma',
          age: 34,
          gender: ClientGenderEnum.Female,
          phone: '+62-812-3333-4444',
          email: 'siti@example.com',
          occupation: 'Wiraswasta',
          education: ClientEducationEnum.Master,
          address: 'Jl. Asia Afrika No. 7, Bandung',
          status: ClientStatusEnum.Pending,
          joinDate: '2024-02-02',
          totalSessions: 0,
          primaryIssue: 'Depresi',
          progress: 0,
        },
      ];
      setClients(mockClients);
      return mockClients;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gagal memuat data klien');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setClients]);

  const loadSessions = useCallback(async (
    clientId: string,
    page = 1,
    pageSize = 10
  ): Promise<{ items: SessionSummary[]; total: number }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await ClientAPI.getClientSessions(clientId, page, pageSize);
      if (res.success && res.data) {
        setClientSessions(clientId, res.data.items);
        return { items: res.data.items, total: res.data.total };
      } else {
        throw new Error(res.message || 'Gagal memuat riwayat sesi');
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setClientSessions]);

  const createClient = useCallback(async (data: ClientFormData): Promise<Client> => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: client creation would go to API; using local generation for now
      const client: Client = {
        ...data,
        id: `CLT${Date.now()}`,
        status: ClientStatusEnum.Pending,
        joinDate: new Date().toISOString().split('T')[0] || new Date().toISOString().slice(0, 10),
        totalSessions: 0,
        progress: 0,
      };
      addClient(client);
      return client;
    } finally {
      setLoading(false);
    }
  }, [addClient, setLoading, setError]);

  const updateClientData = useCallback(async (id: string, updates: Partial<Client>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      updateClient(id, updates);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateClient]);

  const removeClient = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      deleteClient(id);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, deleteClient]);

  const assignTherapist = useCallback(async (clientId: string, therapistId: string): Promise<void> => {
    const client = getClientById(clientId);
    if (!client) throw new Error('Client not found');

    // Optimistic update
    const originalClient = { ...client };
    const optimisticClient = {
      ...client,
      assignedTherapist: therapistId,
      status: ClientStatusEnum.Active,
    };
    updateClient(clientId, optimisticClient);

    try {
      const res = await ClientAPI.assignClientToTherapist(clientId, therapistId);
      if (res.success) {
        // Keep optimistic update if successful
        return;
      } else {
        // Rollback on error
        updateClient(clientId, originalClient);
        throw new Error(res.message || 'Gagal menugaskan therapist');
      }
    } catch (error) {
      // Rollback on error
      updateClient(clientId, originalClient);
      throw error;
    }
  }, [getClientById, updateClient]);

  const unassignTherapist = useCallback(async (clientId: string): Promise<void> => {
    const client = getClientById(clientId);
    if (!client) throw new Error('Client not found');

    // Optimistic update
    const originalClient = { ...client };
    const optimisticClient = {
      ...client,
      assignedTherapist: undefined,
      status: ClientStatusEnum.Pending,
    };
    updateClient(clientId, optimisticClient);

    try {
      const res = await ClientAPI.unassignClient(clientId);
      if (res.success) {
        // Keep optimistic update if successful
        return;
      } else {
        // Rollback on error
        updateClient(clientId, originalClient);
        throw new Error(res.message || 'Gagal menghapus penugasan');
      }
    } catch (error) {
      // Rollback on error
      updateClient(clientId, originalClient);
      throw error;
    }
  }, [getClientById, updateClient]);

  return {
    // state
    clients,
    selectedClientId,
    sessionsByClientId,
    loading,
    error,

    // selectors
    getClientById,

    // actions
    setClients,
    setSelectedClientId,
    loadClients,
    loadSessions,
    createClient,
    updateClient: updateClientData,
    deleteClient: removeClient,
    assignTherapist,
    unassignTherapist,
  };
};

export default useClient;


