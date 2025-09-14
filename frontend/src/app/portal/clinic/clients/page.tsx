'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ClientList } from '@/components/clients/ClientList';
import { AssignTherapistModal } from '@/components/clients/AssignTherapistModal';
import { StartOverModal } from '@/components/clients/StartOverModal';
import { useToast } from '@/components/ui/toast';
import { useClient } from '@/hooks/useClient';
import { useClientStatus } from '@/hooks/useClientStatus';
import { useAuth } from '@/hooks/useAuth';
import { TherapistAPI } from '@/lib/api/therapist';
import { ClientStatusEnum, UserRoleEnum } from '@/types/enums';
import { UserIcon } from '@heroicons/react/24/outline';

function ClientsPageContent() {
  const { addToast } = useToast();
  const { assignTherapist, clients, loadClients } = useClient();
  const { transitionStatus } = useClientStatus();
  
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
    <PageWrapper
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
              const isReassignment = !!currentTherapistId;
              const client = clients.find(c => c.id === selectedClientId);
              
              if (isReassignment) {
                // For reassignment, get the current assignment ID and use transfer API
                const assignmentResponse = await TherapistAPI.getClientAssignment(selectedClientId);
                
                if (!assignmentResponse.success || !assignmentResponse.data) {
                  throw new Error('Gagal mendapatkan data penugasan klien');
                }
                
                const transferResponse = await TherapistAPI.transferClient(
                  assignmentResponse.data.id,
                  therapistId,
                  reason || 'Dipindahkan ke therapist lain',
                  'Transferred via client management interface'
                );
                
                if (!transferResponse.success) {
                  throw new Error(transferResponse.message || 'Gagal memindahkan klien ke therapist baru');
                }
              } else {
                // For initial assignment, use the regular assign API
                await assignTherapist(selectedClientId, therapistId);
              }
              
              addToast({
                type: 'success',
                title: isReassignment ? 'Therapist Berhasil Diganti' : 'Therapist Berhasil Ditugaskan',
                message: isReassignment 
                  ? `Klien ${client?.fullName || 'ini'} telah berhasil dipindahkan ke therapist baru.${reason ? ` Alasan: ${reason}` : ''}`
                  : `Klien ${client?.fullName || 'ini'} telah berhasil ditugaskan ke therapist.`,
                duration: 6000,
              });

              // Refresh client data to get updated assignment information
              await loadClients(true);

              // Close modal and reset
              setAssignModalOpen(false);
              setSelectedClientId(null);
              setCurrentTherapistId(undefined);

              // Status transition is now handled automatically by the backend
              // No need for manual status transition
            } catch (error) {
              let errorMessage = 'Gagal menugaskan therapist';
              let errorTitle = 'Gagal';
              
              if (error instanceof Error) {
                errorMessage = error.message;
                
                // Provide specific guidance for therapist status issues
                if (error.message.toLowerCase().includes('therapist is not active')) {
                  errorTitle = 'Therapist Tidak Aktif';
                  errorMessage = 'Therapist yang dipilih belum dapat ditugaskan karena belum menyelesaikan setup akun mereka. Pastikan therapist telah memverifikasi email dan menyelesaikan proses registrasi mereka terlebih dahulu.';
                } else if (error.message.toLowerCase().includes('status')) {
                  errorTitle = 'Status Therapist Bermasalah';
                  errorMessage = `${error.message}. Silakan periksa status therapist di halaman manajemen therapist.`;
                }
              }
              
              addToast({
                type: 'error',
                title: errorTitle,
                message: errorMessage,
                duration: 8000, // Longer duration for important error messages
              });
            }
          }}
        />
      )}
    </PageWrapper>
  );
}

export default function ClientsPage() {
  // Clinic admin or therapist access control
  const { user, isLoading, hasRole } = useAuth();

  // Access control check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user || (!hasRole(UserRoleEnum.ClinicAdmin) && !hasRole(UserRoleEnum.Therapist))) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Only clinic administrators and therapists can access client management.
          </p>
          <Link href="/portal">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ClientsPageContent />;
}


