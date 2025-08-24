'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { DataTable, TableAction, TableColumn } from '@/components/ui/data-table';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { ClientDetailsModal } from '@/components/clients/ClientDetailsModal';

import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';

import { Client } from '@/types/client';
import { ClientEducationLabels, ClientGuardianMaritalStatusLabels, ClientGuardianRelationshipLabels, ClientMaritalStatusLabels, ClientRelationshipWithSpouseLabels, ClientReligionLabels, ClientStatusEnum, ClientStatusLabels, UserRoleEnum } from '@/types/enums';
import { useClient } from '@/hooks/useClient';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { ClientAPI } from '@/lib/api/client';
import { useDataTableActions } from '@/hooks/useDataTableActions';
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  EyeIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export interface ClientListProps {
  clients?: Client[];
  onAssign?: (clientId: string, currentTherapistId?: string) => void;
  onConsultation?: (clientId: string) => void;
}

const getStatusBadge = (status: Client['status']) => {
  return <ClientStatusBadge status={status as ClientStatusEnum} />;
};

export const ClientList: React.FC<ClientListProps> = ({
  clients: clientsProp,
  onAssign,
  onConsultation,
}) => {
  const { clients: storeClients, createClient, updateClient, loadClients, loading: storeLoading } = useClient();
  const [localLoading, setLocalLoading] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState<'all' | Client['status']>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showClientFormModal, setShowClientFormModal] = useState(false);
  const [clientFormMode, setClientFormMode] = useState<'create' | 'edit'>('create');
  const [clientFormDefaultValues, setClientFormDefaultValues] = useState<Partial<any>>({});

  // Initialize data table actions hook
  const { createDetailAction, createEditAction } = useDataTableActions();

  // Load clients data on mount
  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        await loadClients(true); // Force refresh
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Kesalahan Koneksi',
          message: 'Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.'
        });
      } finally {
        setLocalLoading(false);
      }
    };
    
    loadData();
  }, [loadClients, addToast]);

  // Refresh function
  const refreshClients = useCallback(async () => {
    setLocalLoading(true);
    try {
      await loadClients(true); // Force refresh
    } finally {
      setLocalLoading(false);
    }
  }, [loadClients]);

  // Modal handlers
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedClientId(null);
  };



  // Client form modal handlers
  const handleCreateClient = () => {
    setClientFormMode('create');
    setClientFormDefaultValues({});
    setShowClientFormModal(true);
  };

  const handleEditClientModal = (client: Client) => {
    setClientFormMode('edit');
    setSelectedClientId(client.id); // Store the client ID for the form modal
    setShowClientFormModal(true);
  };

  const handleClientFormSuccess = async (data: any) => {
    try {
      if (clientFormMode === 'create') {
        await createClient(data);
        addToast({
          type: 'success',
          title: 'Klien Berhasil Ditambahkan',
          message: `Klien ${data.fullName} telah berhasil ditambahkan ke sistem.`,
        });
      } else {
        // For edit mode, the form modal handles the update internally
        addToast({
          type: 'success',
          title: 'Klien Berhasil Diperbarui',
          message: `Data klien ${data.fullName} telah berhasil diperbarui.`,
        });
      }
      // Refresh the client list
      await refreshClients();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data klien.',
      });
    }
  };

  // Check if current user should be treated as therapist (not clinic admin)
  const isTherapist = React.useMemo(() => {
    if (!user?.roles) return false;
    
    // Normalize roles to handle legacy data
    const legacyToEnumMap: Record<string, any> = {
      administrator: UserRoleEnum.Administrator,
      clinic_admin: UserRoleEnum.ClinicAdmin,
      therapist: UserRoleEnum.Therapist,
    };

    const normalizedUserRoles = user.roles.map((role) => {
      const key = String(role).toLowerCase();
      return legacyToEnumMap[key] ?? role;
    });

    // If user has ClinicAdmin role, prioritize that over Therapist role
    // Only treat as therapist if they ONLY have therapist role (not both)
    const hasClinicAdmin = normalizedUserRoles.includes(UserRoleEnum.ClinicAdmin);
    const hasTherapist = normalizedUserRoles.includes(UserRoleEnum.Therapist);
    
    return hasTherapist && !hasClinicAdmin;
  }, [user?.roles]);

  // Use store clients data, fallback to prop if provided
  let displayClients = storeClients.length > 0 ? storeClients : (clientsProp ?? []);
  
  // Combine loading states
  const loading = storeLoading || localLoading;

  // For therapists, filter to only show assigned clients
  if (isTherapist && user?.id) {
    displayClients = displayClients.filter(client => client.assignedTherapist === user.id);
  }

  // Filter clients by status
  const filteredClients = displayClients.filter((c) => {
    return status === 'all' ? true : c.status === status;
  });

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
      key: 'assignedTherapist',
      header: 'Therapist',
      render: (client) => (
        <div>
          {client.assignedTherapistName ? (
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-900">{client.assignedTherapistName}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">Belum ditugaskan</span>
          )}
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

  // Define table actions based on user role
  const actions: TableAction<Client>[] = React.useMemo(() => {
    const baseActions: TableAction<Client>[] = [
      {
        key: 'view',
        label: 'Detail',
        icon: EyeIcon,
        variant: 'outline' as const,
        onClick: async (client) => {
          setSelectedClientId(client.id);
          setShowDetailsModal(true);
        },
      },
    ];

    if (isTherapist) {
      // Therapist actions: only view and consultation
      baseActions.push({
        key: 'consultation',
        label: 'Konsultasi',
        icon: ChatBubbleLeftRightIcon,
        variant: 'default',
        onClick: (client) => onConsultation?.(client.id),
      });
    } else {
      // Clinic admin actions: edit and conditional assignment/start over
      baseActions.push(
        {
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          variant: 'default' as const,
          onClick: async (client) => {
            handleEditClientModal(client);
          },
        },
        {
          key: 'assign-therapist',
          label: 'Tugaskan Therapist',
          icon: UserPlusIcon,
          variant: 'success',
          show: (client) => client.status === ClientStatusEnum.New && !client.assignedTherapist,
          onClick: (client) => onAssign?.(client.id, undefined),
        },
        {
          key: 're-assign-therapist',
          label: 'Ganti Therapist',
          icon: UserPlusIcon,
          variant: 'orange',
          show: (client) => !!client.assignedTherapist && (client.status !== ClientStatusEnum.Done && client.status !== ClientStatusEnum.New),
          onClick: (client) => onAssign?.(client.id, client.assignedTherapist),
        },
      );
    }

    return baseActions;
  }, [isTherapist, onConsultation, onAssign, createDetailAction, createEditAction]);

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

  return (
    <>
      <DataTable
        title="Daftar Klien"
        description={
          isTherapist
            ? "Daftar klien yang ditugaskan kepada Anda"
            : "Kelola klien, lihat detail, dan atur penugasan therapist"
        }
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
        // Fix: Always provide createAction, but disable if isTherapist
        createAction={{
          label: 'Tambah Klien',
          icon: PlusIcon,
          onClick: handleCreateClient,
        }}
      />

      {/* Client Details Modal */}
      <ClientDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        clientId={selectedClientId || undefined}
        isTherapist={isTherapist}
        onEdit={handleEditClientModal}
        onAssign={onAssign || (() => {})}
        onConsultation={onConsultation || (() => {})}
      />

      {/* Client Form Modal */}
      <ClientFormModal
        open={showClientFormModal}
        onOpenChange={setShowClientFormModal}
        mode={clientFormMode}
        clientId={clientFormMode === 'edit' && selectedClientId ? selectedClientId : undefined}
        defaultValues={clientFormDefaultValues}
        onSubmitSuccess={handleClientFormSuccess}
        onCancel={() => setShowClientFormModal(false)}
      />
    </>
  );
};

export default ClientList;


