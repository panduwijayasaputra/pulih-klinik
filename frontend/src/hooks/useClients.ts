'use client';

import { useEffect, useMemo, useState } from 'react';
import { Client, ClientFilters, ClientFormData, UsageMetrics } from '@/types/client';
import { ClientAPI } from '@/lib/api/client';

// Mock client data
const mockClients: Client[] = [
  {
    id: 'CLT001',
    name: 'Budi Santoso',
    age: 35,
    gender: 'male',
    phone: '+62-812-3456-7890',
    email: 'budi.santoso@email.com',
    occupation: 'Software Engineer',
    education: 'Bachelor',
    address: 'Jakarta Selatan',
    assignedTherapist: 'therapist-001',
    status: 'active',
    joinDate: '2024-01-15',
    totalSessions: 8,
    lastSession: '2024-01-20',
    primaryIssue: 'Anxiety',
    progress: 75,
    religion: 'Islam',
    province: 'DKI Jakarta'
  },
  {
    id: 'CLT002',
    name: 'Dewi Sari',
    age: 28,
    gender: 'female',
    phone: '+62-812-3456-7891',
    email: 'dewi.sari@email.com',
    occupation: 'Teacher',
    education: 'Master',
    address: 'Bandung',
    assignedTherapist: 'therapist-002',
    status: 'active',
    joinDate: '2024-01-10',
    totalSessions: 5,
    lastSession: '2024-01-18',
    primaryIssue: 'Depression',
    progress: 60,
    religion: 'Christianity',
    province: 'Jawa Barat'
  },
  {
    id: 'CLT003',
    name: 'Ahmad Rahman',
    age: 42,
    gender: 'male',
    phone: '+62-812-3456-7892',
    email: 'ahmad.rahman@email.com',
    occupation: 'Business Owner',
    education: 'Bachelor',
    address: 'Surabaya',
    assignedTherapist: 'therapist-001',
    status: 'completed',
    joinDate: '2023-12-01',
    totalSessions: 12,
    lastSession: '2024-01-15',
    primaryIssue: 'Stress Management',
    progress: 95,
    religion: 'Islam',
    province: 'Jawa Timur'
  },
  {
    id: 'CLT004',
    name: 'Sari Indah',
    age: 31,
    gender: 'female',
    phone: '+62-812-3456-7893',
    email: 'sari.indah@email.com',
    occupation: 'Doctor',
    education: 'Master',
    address: 'Yogyakarta',
    status: 'pending',
    joinDate: '2024-01-22',
    totalSessions: 0,
    primaryIssue: 'Work-Life Balance',
    progress: 0,
    religion: 'Hinduism',
    province: 'DI Yogyakarta'
  }
];

// Mock usage data
const mockUsage: UsageMetrics = {
  today: {
    clientsAdded: 3,
    clientsLimit: 15,
    scriptsGenerated: 8,
    scriptsLimit: 50,
    therapistsActive: 2,
    therapistsLimit: 3
  },
  thisMonth: {
    clientsAdded: 45,
    scriptsGenerated: 120,
    sessionsCompleted: 85,
    averageRating: 4.7
  },
  trends: {
    clientGrowth: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45],
    scriptUsage: [8, 12, 15, 18, 22, 25, 28, 30, 32, 35, 38]
  }
};

export function useClients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addClient = async (clientData: ClientFormData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClient: Client = {
        ...clientData,
        id: `CLT${String(clients.length + 1).padStart(3, '0')}`,
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        totalSessions: 0,
        progress: 0,
        assignedTherapist: undefined,
        lastSession: undefined
      };
      
      setClients(prev => [newClient, ...prev]);
    } catch (err) {
      setError('Failed to add client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      ));
    } catch (err) {
      setError('Failed to update client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      setError('Failed to delete client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTherapist = async (clientId: string, therapistId: string): Promise<void> => {
    const res = await ClientAPI.assignClientToTherapist(clientId, therapistId);
    if (!res.success) {
      throw new Error(res.message || 'Gagal menugaskan therapist');
    }
    await updateClient(clientId, { assignedTherapist: therapistId, status: 'active' as Client['status'] });
  };

  const unassignTherapist = async (clientId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await ClientAPI.unassignClient(clientId);
      if (!res.success) {
        throw new Error(res.message || 'Gagal menghapus penugasan');
      }
      setClients(prev => prev.map(client => 
        client.id === clientId ? { 
          ...client, 
          assignedTherapist: undefined,
          status: 'pending' as Client['status']
        } : client
      ));
    } finally {
      setLoading(false);
    }
  };

  const getClientById = (id: string): Client | undefined => {
    return clients.find(client => client.id === id);
  };

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    assignTherapist,
    unassignTherapist,
    getClientById
  };
}

export function useClientFilters(clients: Client[], filters: ClientFilters) {
  return useMemo(() => {
    let filteredClients = [...clients];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.id.toLowerCase().includes(searchTerm) ||
        client.primaryIssue.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filteredClients = filteredClients.filter(client => 
        client.status === filters.status
      );
    }

    if (filters.therapist) {
      filteredClients = filteredClients.filter(client => 
        client.assignedTherapist === filters.therapist
      );
    }

    if (filters.primaryIssue) {
      filteredClients = filteredClients.filter(client => 
        client.primaryIssue === filters.primaryIssue
      );
    }

    if (filters.province) {
      filteredClients = filteredClients.filter(client => 
        client.province === filters.province
      );
    }

    if (filters.dateRange) {
      filteredClients = filteredClients.filter(client => {
        const joinDate = new Date(client.joinDate);
        const fromDate = new Date(filters.dateRange?.from || '');
        const toDate = new Date(filters.dateRange?.to || '');
        return joinDate >= fromDate && joinDate <= toDate;
      });
    }

    return filteredClients;
  }, [clients, filters]);
}

export function useUsageMetrics() {
  const [usage, setUsage] = useState<UsageMetrics>(mockUsage);
  const [loading, setLoading] = useState(false);
  
  const refreshUsage = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real implementation, this would fetch from API
      setUsage(mockUsage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsage();
  }, []);

  return {
    usage,
    loading,
    refreshUsage
  };
}