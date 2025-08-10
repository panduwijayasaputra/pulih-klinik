'use client';

import { useCallback, useMemo } from 'react';

import type { Client, ClientFormData, SessionSummary } from '@/types/client';
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
        status: 'pending' as Client['status'],
        joinDate: new Date().toISOString().split('T')[0],
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
      status: 'active' as Client['status'],
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
      status: 'pending' as Client['status'],
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
    loadSessions,
    createClient,
    updateClient: updateClientData,
    deleteClient: removeClient,
    assignTherapist,
    unassignTherapist,
  };
};

export default useClient;


