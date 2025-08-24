'use client';

import React, { useMemo, useState } from 'react';

import { DataTable, TableAction, TableColumn } from '@/components/ui/data-table';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { ClientDetailsModal } from '@/components/clients/ClientDetailsModal';

import { Client } from '@/types/client';
import { ClientStatusEnum, ClientStatusLabels } from '@/types/enums';
import {
  EyeIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

export interface TherapistClientListProps {
  clients: Client[];
  totalClients?: number; // For better description messages
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onViewClient?: (clientId: string) => void;
  onStartTherapy?: (clientId: string) => void;
}

const TherapistClientListComponent: React.FC<TherapistClientListProps> = ({
  clients,
  totalClients,
  loading = false,
  error: _error = null,
  onRefresh,
  onViewClient: _onViewClient,
  onStartTherapy,
}) => {
  const [status, setStatus] = useState<'all' | Client['status']>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Filter clients by status
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      return status === 'all' ? true : c.status === status;
    });
  }, [clients, status]);

  // Modal handlers
  const handleCloseDetails = React.useCallback(() => {
    setShowDetailsModal(false);
    setSelectedClientId(null);
  }, []);

  // Custom action handlers for therapist context
  const handleEdit = React.useCallback((client: Client) => {
    // Therapists cannot edit clients, so this is a no-op
  }, []);

  const handleAssign = React.useCallback((clientId: string) => {
    // Therapists cannot assign clients, so this is a no-op
  }, []);

  const handleConsultation = React.useCallback((clientId: string) => {
    // Close modal and start therapy
    handleCloseDetails();
    onStartTherapy?.(clientId);
  }, [handleCloseDetails, onStartTherapy]);

  // Define table columns
  const columns: TableColumn<Client>[] = [
    {
      key: 'client',
      header: 'Klien',
      render: (client) => (
        <div>
          <div className="font-medium text-gray-900">{client.fullName || client.name}</div>
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
      render: (client) => <ClientStatusBadge status={client.status as ClientStatusEnum} />,
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
    {
      key: 'progress',
      header: 'Progress',
      render: (client) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${client.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium">{client.progress}%</span>
        </div>
      ),
    },
    {
      key: 'lastSession',
      header: 'Sesi Terakhir',
      render: (client) => (
        <span className="text-gray-600">
          {client.lastSession
            ? new Date(client.lastSession).toLocaleDateString('id-ID')
            : 'Belum ada'
          }
        </span>
      ),
    },
  ];

  // Define table actions - only view for therapists
  const actions: TableAction<Client>[] = [
    {
      key: 'view',
      label: 'Detail',
      icon: EyeIcon,
      variant: 'outline',
      onClick: (client) => {
        setSelectedClientId(client.id);
        setShowDetailsModal(true);
      },
    },
    {
      key: 'therapy',
      label: 'Terapi',
      icon: PlayIcon,
      variant: 'info',
      onClick: (client) => onStartTherapy?.(client.id),
      show: (client) => client.status !== ClientStatusEnum.Done,
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
        label: ClientStatusLabels[s] || s,
      })),
    ],
    value: status,
    onChange: (value: string) => setStatus(value as 'all' | Client['status']),
  };

  // Generate description message
  const description = totalClients
    ? `Menampilkan ${filteredClients.length} dari ${totalClients} klien yang ditugaskan kepada Anda`
    : `Menampilkan ${filteredClients.length} klien yang ditugaskan kepada Anda`;

  return (
    <>
      <DataTable
        title="Daftar Klien"
        description={description}
        data={filteredClients}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={
          (totalClients || 0) === 0
            ? "Anda belum memiliki klien yang ditugaskan"
            : "Tidak ada klien yang sesuai dengan filter"
        }
        loadingMessage="Memuat daftar klien..."
        searchPlaceholder="Cari nama, email, atau telepon..."
        searchKeys={['name', 'fullName', 'email', 'phone']}
        filters={[statusFilter]}
        refreshAction={{
          label: 'Segarkan',
          onClick: onRefresh || (() => { }),
          loading: loading,
        }}
      />

      {/* Client Details Modal */}
      <ClientDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        clientId={selectedClientId || undefined}
        isTherapist={true}
        onEdit={handleEdit}
        onAssign={handleAssign}
        onConsultation={handleConsultation}
      />
    </>
  );
};

export const TherapistClientList = React.memo(TherapistClientListComponent);
export default TherapistClientList;