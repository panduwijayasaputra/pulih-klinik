'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { TherapyPage } from '@/components/therapy/TherapyPage';
import { useToast } from '@/components/ui/toast';
import { useClient } from '@/hooks/useClient';
import { useAuth } from '@/hooks/useAuth';

interface TherapyRouteProps {
  params: Promise<{
    clientId: string;
  }>;
}

export default function TherapyRoute({ params }: TherapyRouteProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const { clients } = useClient();
  const { user } = useAuth();
  const [clientId, setClientId] = React.useState<string>('');

  // Resolve params promise
  React.useEffect(() => {
    params.then(resolvedParams => {
      setClientId(resolvedParams.clientId);
    });
  }, [params]);

  // Find the specific client
  const client = useMemo(() => {
    return clients.find(c => c.id === clientId);
  }, [clients, clientId]);

  // Check if this client is assigned to current therapist
  const isAssignedClient = useMemo(() => {
    if (!client || !user?.id) return false;
    return client.assignedTherapist === user.id;
  }, [client, user?.id]);

  React.useEffect(() => {
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
    >
      <TherapyPage 
        client={client}
      />
    </PortalPageWrapper>
  );
}