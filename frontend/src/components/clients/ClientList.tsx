'use client';

import React, { useState, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';

import { Client } from '@/types/client';
import { ClientStatusEnum } from '@/types/enums';
import { useClient } from '@/hooks/useClient';
import {
  ArchiveBoxIcon,
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export interface ClientListProps {
  clients?: Client[];
  onView?: (clientId: string) => void;
  onEdit?: (clientId: string) => void;
  onAssign?: (clientId: string) => void;
  onArchive?: (clientId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  [ClientStatusEnum.Active]: 'Aktif',
  [ClientStatusEnum.Inactive]: 'Tidak Aktif',
  [ClientStatusEnum.Completed]: 'Selesai',
  [ClientStatusEnum.Pending]: 'Menunggu',
};

const getStatusBadge = (status: Client['status']) => {
  switch (status) {
    case ClientStatusEnum.Active:
      return <Badge variant="success">{STATUS_LABEL[status]}</Badge>;
    case ClientStatusEnum.Completed:
      return <Badge variant="outline">{STATUS_LABEL[status]}</Badge>;
    case ClientStatusEnum.Pending:
      return <Badge variant="warning">{STATUS_LABEL[status]}</Badge>;
    case ClientStatusEnum.Inactive:
    default:
      return <Badge variant="destructive">{STATUS_LABEL[status] ?? status}</Badge>;
  }
};

export const ClientList: React.FC<ClientListProps> = ({
  clients: clientsProp,
  onView,
  onEdit,
  onAssign,
  onArchive,
}) => {
  const { clients: storeClients, loadClients, loading } = useClient();
  const [status, setStatus] = useState<'all' | Client['status']>('all');

  // Refresh function
  const refreshClients = useCallback(async () => {
    try {
      await loadClients();
    } catch (error) {
      console.error('Failed to refresh clients:', error);
    }
  }, [loadClients]);

  // Load clients on component mount if store is empty
  React.useEffect(() => {
    if (!storeClients || storeClients.length === 0) {
      loadClients().catch(console.error);
    }
  }, [storeClients, loadClients]);

  // Prefer store clients if available; fallback to prop
  const clients = (storeClients && storeClients.length > 0) ? storeClients : (clientsProp ?? []);

  // Filter clients by status
  const filteredClients = clients.filter((c) => {
    return status === 'all' ? true : c.status === status;
  });

  // Define table columns
  const columns: TableColumn<Client>[] = [
    {
      key: 'client',
      header: 'Klien',
      render: (client) => (
        <div>
          <div className="font-medium text-gray-900">{client.name}</div>
          <div className="text-xs text-gray-500">{client.primaryIssue}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (client) => (
        <div>
          <div>{client.phone}</div>
          <div className="text-xs text-gray-500">{client.email}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (client) => getStatusBadge(client.status),
    },
    {
      key: 'joinDate',
      header: 'Bergabung',
      render: (client) => (
        <span className="text-gray-600">
          {new Date(client.joinDate).toLocaleDateString('id-ID')}
        </span>
      ),
    },
    {
      key: 'sessions',
      header: 'Sesi',
      render: (client) => (
        <span className="text-gray-600">{client.totalSessions}</span>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Client>[] = [
    {
      key: 'view',
      label: 'Lihat',
      icon: EyeIcon,
      variant: 'outline',
      onClick: (client) => onView?.(client.id),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: PencilIcon,
      variant: 'outline',
      onClick: (client) => onEdit?.(client.id),
    },
    {
      key: 'assign',
      label: 'Therapist',
      icon: UserPlusIcon,
      variant: 'default',
      onClick: (client) => onAssign?.(client.id),
    },
    {
      key: 'archive',
      label: 'Arsipkan',
      icon: ArchiveBoxIcon,
      variant: 'destructive',
      onClick: (client) => onArchive?.(client.id),
    },
  ];

  // Define status filter
  const statusFilter = {
    key: 'status',
    label: 'Semua Status',
    options: [
      { value: 'all', label: 'Semua Status' },
      ...Object.values(ClientStatusEnum).map((s) => ({
        value: s,
        label: STATUS_LABEL[s] || s,
      })),
    ],
    value: status,
    onChange: (value: string) => setStatus(value as 'all' | Client['status']),
  };

  return (
    <DataTable
      title="Daftar Klien"
      description="Kelola klien, lihat detail, dan atur penugasan therapist"
      data={filteredClients}
      columns={columns}
      actions={actions}
      loading={loading}
      emptyMessage="Tidak ada klien yang ditemukan"
      loadingMessage="Memuat data klien..."
      searchPlaceholder="Cari nama, email, atau telepon..."
      searchKeys={['name', 'email', 'phone']}
      filters={[statusFilter]}
      refreshAction={{
        label: 'Segarkan',
        onClick: refreshClients,
        loading: loading,
      }}
    />
  );
};

export default ClientList;


