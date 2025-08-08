'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClientList } from '@/components/clients/ClientList';
import { ClientForm } from '@/components/clients/ClientForm';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ClientsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
      <ClientList />
    </PortalPageWrapper>
  );
}


