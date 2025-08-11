'use client';

import React, { useCallback, useMemo } from 'react';
import { useClient } from './useClient';
import { useAuthStore } from '@/store/auth';
import { ClientStatusEnum, UserRoleEnum } from '@/types/enums';
import type { Client } from '@/types/client';
import type { UserRole } from '@/types/auth';

export interface TherapistClientStats {
  total: number;
  assigned: number;
  consultation: number;
  therapy: number;
  done: number;
}

export interface UseTherapistClientsReturn {
  // Data
  clients: Client[];
  filteredClients: Client[];
  stats: TherapistClientStats;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Filters
  searchTerm: string;
  statusFilter: ClientStatusEnum | 'all';
  
  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: ClientStatusEnum | 'all') => void;
  loadClients: (forceRefresh?: boolean) => Promise<Client[]>;
  getClientById: (id: string) => Client | undefined;
  
  // Therapist-specific actions
  isTherapist: boolean;
  therapistId: string | null;
}

export const useTherapistClients = (
  initialSearchTerm: string = '',
  initialStatusFilter: ClientStatusEnum | 'all' = 'all'
): UseTherapistClientsReturn => {
  const { user } = useAuthStore();
  const {
    clients: allClients,
    loading,
    error,
    loadClients: loadAllClients,
    getClientById: getClientByIdFromStore,
  } = useClient();

  // Check if current user should be treated as therapist (not clinic admin)
  const isTherapist = useMemo(() => {
    if (!user?.roles) return false;
    
    // Normalize roles to handle legacy data
    const legacyToEnumMap: Record<string, UserRole> = {
      administrator: UserRoleEnum.Administrator,
      clinic_admin: UserRoleEnum.ClinicAdmin,
      therapist: UserRoleEnum.Therapist,
    } as const as Record<string, UserRole>;

    const normalizedUserRoles = user.roles.map((role) => {
      const key = String(role).toLowerCase();
      return legacyToEnumMap[key] ?? (role as UserRole);
    });

    // If user has ClinicAdmin role, prioritize that over Therapist role
    // Only treat as therapist if they ONLY have therapist role (not both)
    const hasClinicAdmin = normalizedUserRoles.includes(UserRoleEnum.ClinicAdmin);
    const hasTherapist = normalizedUserRoles.includes(UserRoleEnum.Therapist);
    
    return hasTherapist && !hasClinicAdmin;
  }, [user?.roles]);

  const therapistId = useMemo(() => {
    return isTherapist ? user?.id || null : null;
  }, [isTherapist, user?.id]);

  // Filter clients assigned to current therapist
  const therapistClients = useMemo(() => {
    if (!isTherapist || !therapistId) {
      return [];
    }
    
    return allClients.filter(client => client.assignedTherapist === therapistId);
  }, [allClients, isTherapist, therapistId]);

  // Search functionality
  const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = React.useState<ClientStatusEnum | 'all'>(initialStatusFilter);

  // Apply search and status filters
  const filteredClients = useMemo(() => {
    let filtered = [...therapistClients];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(client => 
        client.fullName.toLowerCase().includes(searchLower) ||
        client.name?.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    return filtered;
  }, [therapistClients, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo((): TherapistClientStats => {
    const total = therapistClients.length;
    const assigned = therapistClients.filter(c => c.status === ClientStatusEnum.Assigned).length;
    const consultation = therapistClients.filter(c => c.status === ClientStatusEnum.Consultation).length;
    const therapy = therapistClients.filter(c => c.status === ClientStatusEnum.Therapy).length;
    const done = therapistClients.filter(c => c.status === ClientStatusEnum.Done).length;

    return {
      total,
      assigned,
      consultation,
      therapy,
      done,
    };
  }, [therapistClients]);

  // Load clients function
  const loadClients = useCallback(async (forceRefresh = false) => {
    const allClientsList = await loadAllClients(forceRefresh);
    
    // Return only therapist's clients
    if (!isTherapist || !therapistId) {
      return [];
    }
    
    return allClientsList.filter(client => client.assignedTherapist === therapistId);
  }, [loadAllClients, isTherapist, therapistId]);

  // Get client by ID (from therapist's clients only)
  const getClientById = useCallback((id: string): Client | undefined => {
    const client = getClientByIdFromStore(id);
    
    // Ensure the client belongs to this therapist
    if (client && isTherapist && therapistId && client.assignedTherapist === therapistId) {
      return client;
    }
    
    return undefined;
  }, [getClientByIdFromStore, isTherapist, therapistId]);

  return {
    // Data
    clients: therapistClients,
    filteredClients,
    stats,
    
    // State
    loading,
    error,
    
    // Filters
    searchTerm,
    statusFilter,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    loadClients,
    getClientById,
    
    // Therapist-specific
    isTherapist,
    therapistId,
  };
};

export default useTherapistClients;