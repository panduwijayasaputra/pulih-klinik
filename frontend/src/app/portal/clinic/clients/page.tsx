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
  
  // // Debug: Log all clients with their assigned therapists
  // console.log('🔍 All Clients Debug:');
  // clients.forEach(client => {
  //   console.log(`  - ${client.fullName} (${client.id}): assignedTherapist = ${client.assignedTherapist}`);
  // });
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [startOverModalOpen, setStartOverModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentTherapistId, setCurrentTherapistId] = useState<string | undefined>(undefined);

  const handleAssign = (clientId: string, currentTherapistId?: string) => {
    setSelectedClientId(clientId);
    setCurrentTherapistId(currentTherapistId);
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
      const client = clients.find(c => c.id === selectedClientId);
      await transitionStatus(selectedClientId, ClientStatusEnum.Consultation, reason || 'Klien memulai ulang terapi dengan therapist baru', client?.status);

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
            currentTherapistId={currentTherapistId}
            open={assignModalOpen}
            onOpenChange={(open) => {
              setAssignModalOpen(open);
              if (!open) {
                setSelectedClientId(null);
                setCurrentTherapistId(undefined);
              }
            }}
            clientId={selectedClientId}
            onAssigned={async (therapistId, reason) => {
              if (!selectedClientId) return;
              try {
                await assignTherapist(selectedClientId, therapistId);
                
                // Show specific success message based on whether it's reassignment
                const client = clients.find(c => c.id === selectedClientId);
                const isReassignment = !!currentTherapistId;
                
                addToast({
                  type: 'success',
                  title: isReassignment ? 'Therapist Berhasil Diganti' : 'Therapist Berhasil Ditugaskan',
                  message: isReassignment 
                    ? `Klien ${client?.fullName || 'ini'} telah berhasil dipindahkan ke therapist baru.${reason ? ` Alasan: ${reason}` : ''}`
                    : `Klien ${client?.fullName || 'ini'} telah berhasil ditugaskan ke therapist.`,
                  duration: 6000,
                });

                // Close modal and reset
                setAssignModalOpen(false);
                setSelectedClientId(null);
                setCurrentTherapistId(undefined);

                // Handle status transition if needed
                if (client?.status === ClientStatusEnum.New) {
                  try {
                    await transitionStatus(selectedClientId, ClientStatusEnum.Consultation, 'Klien ditugaskan ke therapist untuk konsultasi', client.status);
                  } catch (error) {
                    // Don't block success flow for status transition failure
                  }
                }
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


