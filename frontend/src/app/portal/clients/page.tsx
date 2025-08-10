'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClientList } from '@/components/clients/ClientList';
import { ClientForm } from '@/components/clients/ClientForm';
import { AssignTherapistModal } from '@/components/clients/AssignTherapistModal';
import { useToast } from '@/components/ui/toast';
import { useClient } from '@/hooks/useClient';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ClientsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { assignTherapist } = useClient();
  const [open, setOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleView = (clientId: string) => {
    router.push(`/portal/clients/${clientId}`);
  };

  const handleEdit = (clientId: string) => {
    // For now, navigate to details page where editing can be done
    // In the future, this could open an edit modal
    router.push(`/portal/clients/${clientId}`);
  };

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
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" /> Tambah Klien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Klien Baru</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSubmitSuccess={() => {
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      }
    >
      <ClientList
        onView={handleView}
        onEdit={handleEdit}
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


