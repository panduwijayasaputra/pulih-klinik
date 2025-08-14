'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { TherapistClientList } from '@/components/clients/TherapistClientList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientStatusEnum, ClientStatusLabels, UserRoleEnum } from '@/types/enums';
import { useToast } from '@/components/ui/toast';
import { useTherapistClients } from '@/hooks/useTherapistClients';
import { useClient } from '@/hooks/useClient';
import { useAuth } from '@/hooks/useAuth';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TherapistClientsPage() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatusEnum | 'all'>('all');
  const { user } = useAuth();

  // Check if user has therapist role (regardless of other roles) for dashboard access
  const hasTherapistRole = useMemo(() => {
    if (!user?.roles) return false;

    // Normalize roles to handle legacy data
    const legacyToEnumMap: Record<string, any> = {
      administrator: UserRoleEnum.Administrator,
      clinic_admin: UserRoleEnum.ClinicAdmin,
      therapist: UserRoleEnum.Therapist,
    };

    const normalizedUserRoles = user.roles.map((role) => {
      const key = String(role).toLowerCase();
      return legacyToEnumMap[key] ?? role;
    });

    return normalizedUserRoles.includes(UserRoleEnum.Therapist);
  }, [user?.roles]);

  // Access client data directly for multi-role user handling  
  const { clients: allClients } = useClient();

  // For TherapistClientList, we want to treat anyone with therapist role as a therapist
  // even if they have other roles (unlike the main ClientList which prioritizes ClinicAdmin)
  const forceTherapistMode = hasTherapistRole;

  const {
    filteredClients,
    loading,
    error,
    loadClients,
  } = useTherapistClients(searchTerm, statusFilter);

  // Override client filtering for multi-role users in therapist dashboard
  const therapistClients = useMemo(() => {
    if (!forceTherapistMode || !user?.id) return filteredClients;

    // For multi-role users accessing therapist dashboard, show their assigned clients
    const userAssignedClients = allClients.filter(client => client.assignedTherapist === user.id);

    // Apply search and status filters
    let filtered = [...userAssignedClients];

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
  }, [forceTherapistMode, user?.id, allClients, filteredClients, searchTerm, statusFilter]);

  // Calculate total clients for display
  const totalClients = useMemo(() => {
    if (!forceTherapistMode || !user?.id) return filteredClients.length;
    return allClients.filter(client => client.assignedTherapist === user.id).length;
  }, [forceTherapistMode, user?.id, allClients, filteredClients.length]);

  // Load clients on component mount
  useEffect(() => {
    if (hasTherapistRole) {
      loadClients();
    }
  }, [loadClients, hasTherapistRole]);

  // Handle view client details
  const handleViewClient = (_clientId: string) => {
    // TODO: Navigate to client details page when implemented
    addToast({
      type: 'info',
      title: 'Fitur Detail Klien',
      message: 'Fitur detail klien akan segera tersedia',
    });

    // For now, we could navigate to a client details route (to be implemented)
    // router.push(`/portal/therapist/clients/${clientId}`);
  };

  // Handle start/continue consultation
  const handleStartConsultation = (_clientId: string) => {
    // TODO: Navigate to consultation interface when implemented
    addToast({
      type: 'info',
      title: 'Fitur Konsultasi',
      message: 'Fitur konsultasi akan segera tersedia',
    });

    // For now, we could navigate to a consultation route (to be implemented)
    // router.push(`/portal/therapist/consultation/${clientId}`);
  };

  // Refresh clients
  const handleRefresh = async () => {
    await loadClients(true);
  };

  return (
      <PortalPageWrapper
        title="Klien Saya"
        description="Kelola klien yang ditugaskan kepada Anda"
      >
        <TherapistClientList
          clients={therapistClients}
          totalClients={totalClients}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
          onViewClient={handleViewClient}
          onStartConsultation={handleStartConsultation}
        />
      </PortalPageWrapper>
  );
}