'use client';

import React, { useState } from 'react';

import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { ClientList } from '@/components/clients/ClientList';
import { AssignTherapistModal } from '@/components/clients/AssignTherapistModal';
import { StartOverModal } from '@/components/clients/StartOverModal';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useToast } from '@/components/ui/toast';
import { useClient } from '@/hooks/useClient';
import { useClientStatus } from '@/hooks/useClientStatus';
import { ClientStatusEnum, UserRoleEnum } from '@/types/enums';

export default function ClientsPage() {
  const { addToast } = useToast();
  const { assignTherapist, clients } = useClient();
  const { transitionStatus } = useClientStatus();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [startOverModalOpen, setStartOverModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleAssign = (clientId: string) => {
    setSelectedClientId(clientId);
    setAssignModalOpen(true);
  };


  const handleConsultation = (_clientId: string) => {
    // TODO: Navigate to consultation interface when implemented
    addToast({
      type: 'info',
      title: 'Fitur Konsultasi',
      message: 'Fitur konsultasi akan segera tersedia',
    });

    // For now, we could navigate to a consultation route (to be implemented)
    // router.push(`/portal/therapist/consultation/${clientId}`);
  };

  const handleStartOver = (clientId: string) => {
    setSelectedClientId(clientId);
    setStartOverModalOpen(true);
  };

  const handleStartOverSubmit = async (therapistId: string, reason?: string) => {
    if (!selectedClientId) return;

    try {
      // First assign the new therapist
      await assignTherapist(selectedClientId, therapistId);

      // Then transition status to consultation
      await transitionStatus(selectedClientId, ClientStatusEnum.Consultation, reason || 'Klien memulai ulang terapi dengan therapist baru');

      addToast({
        type: 'success',
        title: 'Berhasil Memulai Ulang',
        message: 'Klien telah ditugaskan ke therapist baru dan status berubah ke Konsultasi',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal Memulai Ulang',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memulai ulang klien',
      });
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleAssignSuccess = async () => {
    if (!selectedClientId) return;

    // Get the client to check current status
    const client = clients.find(c => c.id === selectedClientId);

    // If client is new, transition to consultation
    if (client?.status === ClientStatusEnum.New) {
      try {
        await transitionStatus(selectedClientId, ClientStatusEnum.Consultation, 'Klien ditugaskan ke therapist untuk konsultasi');
      } catch (error) {
        console.error('Failed to transition status:', error);
        // Don't block success flow for status transition failure
      }
    }

    setAssignModalOpen(false);
    setSelectedClientId(null);
    addToast({
      type: 'success',
      title: 'Berhasil',
      message: client?.status === ClientStatusEnum.New
        ? 'Klien berhasil ditugaskan ke therapist dan status berubah ke Konsultasi'
        : 'Klien berhasil ditugaskan ulang ke therapist',
    });
  };

  return (
    <RoleGuard allowedRoles={[UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist]}>
      <PortalPageWrapper
        title="Manajemen Klien"
        description="Kelola data klien, penugasan therapist, dan riwayat sesi"
      >
        <ClientList
          onAssign={handleAssign}
          onConsultation={handleConsultation}
        />

        {selectedClientId && (
          <AssignTherapistModal
            currentTherapistId={clients.find(c => c.id === selectedClientId)?.assignedTherapist || ''}
            open={assignModalOpen}
            onOpenChange={(open) => {
              setAssignModalOpen(open);
              if (!open) setSelectedClientId(null);
            }}
            clientId={selectedClientId}
            onAssigned={async (therapistId) => {
              if (!selectedClientId) return;
              try {
                await assignTherapist(selectedClientId, therapistId);
                handleAssignSuccess();
              } catch (error) {
                addToast({
                  type: 'error',
                  title: 'Gagal',
                  message: error instanceof Error ? error.message : 'Gagal menugaskan therapist',
                });
              }
            }}
          />
        )}
      </PortalPageWrapper>
    </RoleGuard>
  );
}


