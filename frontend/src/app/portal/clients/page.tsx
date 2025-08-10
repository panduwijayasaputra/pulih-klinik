'use client';

import React, { useState } from 'react';

import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { ClientList } from '@/components/clients/ClientList';
import { AssignTherapistModal } from '@/components/clients/AssignTherapistModal';
import { useToast } from '@/components/ui/toast';
import { useClient } from '@/hooks/useClient';

export default function ClientsPage() {
  const { addToast } = useToast();
  const { assignTherapist } = useClient();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);





  const handleAssign = (clientId: string) => {
    setSelectedClientId(clientId);
    setAssignModalOpen(true);
  };

  const handleArchive = (_clientId: string) => {
    // TODO: Implement archive functionality
    addToast({
      type: 'info',
      title: 'Fitur Arsip',
      message: 'Fitur arsip akan segera tersedia',
    });
  };

  const handleAssignSuccess = () => {
    setAssignModalOpen(false);
    setSelectedClientId(null);
    addToast({
      type: 'success',
      title: 'Berhasil',
      message: 'Klien berhasil ditugaskan ke therapist',
    });
  };

  return (
    <PortalPageWrapper
      title="Manajemen Klien"
      description="Kelola data klien, penugasan therapist, dan riwayat sesi"
    >
      <ClientList
        onAssign={handleAssign}
        onArchive={handleArchive}
      />

      {selectedClientId && (
        <AssignTherapistModal
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
  );
}


