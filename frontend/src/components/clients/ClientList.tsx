'use client';

import React, { useState, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { SessionHistory } from '@/components/clients/SessionHistory';

import { Client } from '@/types/client';
import { ClientStatusEnum } from '@/types/enums';
import { useClient } from '@/hooks/useClient';
import { useToast } from '@/components/ui/toast';
import {
  ArchiveBoxIcon,
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export interface ClientListProps {
  clients?: Client[];
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
  onAssign,
  onArchive,
}) => {
  const { clients: storeClients, loadClients, loading, createClient, updateClient } = useClient();
  const { addToast } = useToast();
  const [status, setStatus] = useState<'all' | Client['status']>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientFormModal, setShowClientFormModal] = useState(false);
  const [clientFormMode, setClientFormMode] = useState<'create' | 'edit'>('create');
  const [clientFormDefaultValues, setClientFormDefaultValues] = useState<Partial<any>>({});

  // Refresh function
  const refreshClients = useCallback(async () => {
    try {
      await loadClients();
    } catch (error) {
      console.error('Failed to refresh clients:', error);
    }
  }, [loadClients]);

  // Load clients on component mount
  React.useEffect(() => {
    loadClients().catch(console.error);
  }, [loadClients]);

  // Modal handlers
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedClient(null);
  };



  // Client form modal handlers
  const handleCreateClient = () => {
    setClientFormMode('create');
    setClientFormDefaultValues({});
    setShowClientFormModal(true);
  };

  const handleEditClientModal = (client: Client) => {
    setClientFormMode('edit');
    setClientFormDefaultValues({
      name: client.name,
      age: client.age,
      gender: client.gender,
      phone: client.phone,
      email: client.email,
      occupation: client.occupation,
      education: client.education,
      address: client.address,
      primaryIssue: client.primaryIssue,
      religion: client.religion,
      province: client.province,
      emergencyContact: client.emergencyContact,
      notes: client.notes,
    });
    setShowClientFormModal(true);
  };

  const handleClientFormSuccess = async (data: any) => {
    try {
      if (clientFormMode === 'create') {
        await createClient(data);
        addToast({
          type: 'success',
          title: 'Klien Berhasil Ditambahkan',
          message: `Klien ${data.name} telah berhasil ditambahkan ke sistem.`,
        });
      } else {
        if (selectedClient) {
          await updateClient(selectedClient.id, data);
          addToast({
            type: 'success',
            title: 'Klien Berhasil Diperbarui',
            message: `Data klien ${data.name} telah berhasil diperbarui.`,
          });
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data klien.',
      });
    }
  };

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
      onClick: (client) => {
        setSelectedClient(client);
        setShowDetailsModal(true);
      },
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: PencilIcon,
      variant: 'outline',
      onClick: (client) => handleEditClientModal(client),
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
    <>
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
        createAction={{
          label: 'Tambah Klien',
          icon: PlusIcon,
          onClick: handleCreateClient,
        }}
      />

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedClient.name}
                  </h2>
                  <p className="text-gray-600 mt-1">Detail Klien</p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Client Information */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Usia</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClient.age} tahun</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClient.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Akun</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedClient.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Kontak</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.phone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.email}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Alamat</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional & Education Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Profesional & Pendidikan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.occupation}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.education}
                      </p>
                    </div>
                    {selectedClient.religion && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Agama</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedClient.religion}</p>
                      </div>
                    )}
                    {selectedClient.province && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Provinsi</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedClient.province}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Therapy Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Terapi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Masalah Utama</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <HeartIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedClient.primaryIssue}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Progress</label>
                      <div className="mt-1 flex items-center">
                        <ChartBarIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedClient.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{selectedClient.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Sesi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Sesi</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedClient.totalSessions}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Bergabung</span>
                        <span className="text-sm text-gray-600 flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(selectedClient.joinDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    {selectedClient.lastSession && (
                      <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Sesi Terakhir</span>
                          <span className="text-sm text-gray-600">
                            {new Date(selectedClient.lastSession).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                {selectedClient.emergencyContact && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontak Darurat</h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-red-700">Nama</label>
                          <p className="mt-1 text-sm text-red-800">{selectedClient.emergencyContact.name}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-red-700">Telepon</label>
                          <p className="mt-1 text-sm text-red-800">{selectedClient.emergencyContact.phone}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-red-700">Hubungan</label>
                          <p className="mt-1 text-sm text-red-800">{selectedClient.emergencyContact.relationship}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedClient.notes}</p>
                    </div>
                  </div>
                )}

                {/* Session History */}
                <div>
                  <SessionHistory clientId={selectedClient.id} pageSize={3} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end items-center mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditClientModal(selectedClient)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 flex items-center"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Klien
                  </button>
                  <button
                    onClick={() => {
                      handleCloseDetails();
                      onAssign?.(selectedClient.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-md hover:bg-green-50 flex items-center"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Assign Therapist
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Form Modal */}
      <ClientFormModal
        open={showClientFormModal}
        onOpenChange={setShowClientFormModal}
        mode={clientFormMode}
        defaultValues={clientFormDefaultValues}
        onSubmitSuccess={handleClientFormSuccess}
        onCancel={() => setShowClientFormModal(false)}
      />
    </>
  );
};

export default ClientList;


