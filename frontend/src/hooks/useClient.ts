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

  const loadClients = useCallback(async (forceRefresh = false): Promise<Client[]> => {
    // Skip loading if clients are already loaded and not forcing refresh
    // But always load if clients array is empty (after localStorage clear)
    if (clients.length > 0 && !forceRefresh) {
      return clients;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await ClientAPI.getClients();
      if (response.success && response.data) {
        setClients(response.data.items);
        return response.data.items;
      } else {
        setError(response.message || 'Gagal memuat data klien');
        return [];
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gagal memuat data klien');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clients.length, setLoading, setError, setClients]);

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
      const response = await ClientAPI.createClient(data);
      if (response.success && response.data) {
        addClient(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Gagal membuat klien');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gagal membuat klien');
      throw error;
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
      assignedTherapistId: therapistId,
      status: ClientStatusEnum.Assigned,
    };
    updateClient(clientId, optimisticClient);

    try {
      const res = await ClientAPI.assignClientToTherapist(clientId, therapistId);
      if (res.success) {
        // Refresh client data to get updated status from backend
        await loadClients();
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
  }, [getClientById, updateClient, loadClients]);

  const unassignTherapist = useCallback(async (clientId: string): Promise<void> => {
    const client = getClientById(clientId);
    if (!client) throw new Error('Client not found');

    // Optimistic update
    const originalClient = { ...client };
    const optimisticClient = {
      ...client,
      assignedTherapistId: undefined,
      assignedTherapistName: undefined,
      status: ClientStatusEnum.New,
    };
    updateClient(clientId, optimisticClient);

    try {
      const res = await ClientAPI.unassignClient(clientId);
      if (res.success) {
        // Refresh client data to get updated status from backend
        await loadClients();
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
  }, [getClientById, updateClient, loadClients]);

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


