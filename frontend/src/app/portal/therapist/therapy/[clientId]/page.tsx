'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { TherapyPage } from '@/components/therapy/TherapyPage';
import { useToast } from '@/components/ui/toast';
import { useClient } from '@/hooks/useClient';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationStore } from '@/store/navigation';

export default function TherapyRoute() {
  const router = useRouter();
  const { addToast } = useToast();
  const { clients } = useClient();
  const { user } = useAuth();
  const { setBreadcrumbs } = useNavigationStore();
  const { clientId } = useParams();

  // Find the specific client
  const client = useMemo(() => {
    return clients.find(c => c.id === clientId);
  }, [clients, clientId]);

  // Check if this client is assigned to current therapist
  const isAssignedClient = useMemo(() => {
    if (!client || !user?.id) return false;
    return client.assignedTherapist === user.id;
  }, [client, user?.id]);

  // Set custom breadcrumbs when client is loaded
  useEffect(() => {
    if (client) {
      const customBreadcrumbs = [
        {
          id: 'portal',
          label: 'Portal',
          href: '/portal',
        },
        {
          id: 'clients',
          label: 'Klien Saya',
          href: '/portal/therapist/clients',
        },
        {
          id: 'therapy',
          label: 'Terapi',
          href: `/portal/therapist/therapy/${clientId}`,
          isActive: true,
        },
      ];
      setBreadcrumbs(customBreadcrumbs);
    }

    // Cleanup breadcrumbs when component unmounts
    return () => {
      setBreadcrumbs([]);
    };
  }, [client, clientId, setBreadcrumbs]);

  useEffect(() => {
    if (!clientId) {
      return; // Don't show error immediately, wait for clientId to be resolved
    }

    if (clients.length > 0 && !client) {
      addToast({
        type: 'error',
        title: 'Klien Tidak Ditemukan',
        message: 'Klien dengan ID tersebut tidak ditemukan',
      });
      router.push('/portal/therapist/clients');
      return;
    }

    if (client && !isAssignedClient) {
      addToast({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Anda tidak memiliki akses ke klien ini',
      });
      router.push('/portal/therapist/clients');
      return;
    }
  }, [clientId, client, clients.length, isAssignedClient, addToast, router]);

  if (!clientId || !client) {
    return (
      <PortalPageWrapper
        title="Memuat..."
        description="Memuat informasi klien"
        backButtonLabel="Kembali ke Daftar Klien"
        showBackButton={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Memuat data klien...</p>
          </div>
        </div>
      </PortalPageWrapper>
    );
  }

  return (
    <PortalPageWrapper
      title="Sesi Terapi"
      description={`Kelola sesi terapi untuk ${client.fullName || client.name}`}
      backButtonLabel="Kembali ke Daftar Klien"
      showBackButton={true}
    >
      <TherapyPage
        client={client}
      />
    </PortalPageWrapper>
  );
}