'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { TherapistDashboard } from '@/components/portal/TherapistDashboard';
import { UserRoleEnum } from '@/types/enums';
import { useToast } from '@/components/ui/toast';

export default function TherapistClientsPage() {
  const router = useRouter();
  const { addToast } = useToast();

  // Handle view client details
  const handleViewClient = (clientId: string) => {
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
  const handleStartConsultation = (clientId: string) => {
    // TODO: Navigate to consultation interface when implemented
    addToast({
      type: 'info',
      title: 'Fitur Konsultasi',
      message: 'Fitur konsultasi akan segera tersedia',
    });
    
    // For now, we could navigate to a consultation route (to be implemented)
    // router.push(`/portal/therapist/consultation/${clientId}`);
  };

  return (
    <RoleGuard allowedRoles={[UserRoleEnum.Therapist, UserRoleEnum.ClinicAdmin]}>
      <TherapistDashboard
        onViewClient={handleViewClient}
        onStartConsultation={handleStartConsultation}
      />
    </RoleGuard>
  );
}