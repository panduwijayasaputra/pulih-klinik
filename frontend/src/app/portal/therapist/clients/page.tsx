'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { TherapistClientList } from '@/components/clients/TherapistClientList';
import { ClientStatusEnum, UserRoleEnum } from '@/types/enums';
import { useToast } from '@/components/ui/toast';
import { useTherapistClient } from '@/hooks/useTherapistClient';
import { useAuth } from '@/hooks/useAuth';

export default function TherapistClientsPage() {
  const router = useRouter();
  const { addToast } = useToast();
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

  // Use the new therapist client hook
  const {
    clients: therapistClients,
    stats,
    loading,
    error,
    loadClients,
    setFilters,
    clearError
  } = useTherapistClient();

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

  // Handle start therapy
  const handleStartTherapy = (clientId: string) => {
    router.push(`/portal/therapist/therapy/${clientId}`);
  };

  // Refresh clients
  const handleRefresh = async () => {
    await loadClients(true);
  };

  // Calculate total clients for display
  const totalClients = therapistClients.length;

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
        onStartTherapy={handleStartTherapy}
      />
    </PortalPageWrapper>
  );
}