'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { SessionHistory } from '@/components/clients/SessionHistory';
import { Button } from '@/components/ui/button';
import { useClient } from '@/hooks/useClient';

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getClientById, updateClient, assignTherapist, unassignTherapist } = useClient();
  const [isSaving, setIsSaving] = useState(false);

  const clientId = useMemo(() => String(params?.id ?? ''), [params]);
  const client = getClientById(clientId);

  const handleUpdate = async (updates: Partial<ReturnType<typeof getClientById>>) => {
    if (!client) return;
    setIsSaving(true);
    try {
      await updateClient(client.id, updates as any);
    } finally {
      setIsSaving(false);
    }
  };

  if (!client) {
    return (
      <PortalPageWrapper
        title="Klien Tidak Ditemukan"
        description="Periksa kembali tautan atau kembali ke daftar klien."
        actions={
          <Button variant="outline" onClick={() => router.push('/portal/clients')}>Kembali</Button>
        }
      >
        <div className="text-sm text-muted-foreground">Data klien dengan ID tersebut tidak tersedia.</div>
      </PortalPageWrapper>
    );
  }

  return (
    <PortalPageWrapper
      title={client.name}
      description={`ID: ${client.id}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/portal/clients')}>Kembali</Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClientDetails
            client={client}
            onUpdate={handleUpdate as any}
            onAssign={async (therapistId: string) => {
              await assignTherapist(client.id, therapistId);
            }}
            onUnassign={async () => {
              await unassignTherapist(client.id);
            }}
            isSaving={isSaving}
          />
        </div>
        <div>
          <SessionHistory clientId={client.id} />
        </div>
      </div>
    </PortalPageWrapper>
  );
}


