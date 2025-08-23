'use client';

import React, { useMemo, useState } from 'react';

import { DataTable, TableAction, TableColumn } from '@/components/ui/data-table';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';


import { Client } from '@/types/client';
import { ClientEducationLabels, ClientGuardianMaritalStatusLabels, ClientGuardianRelationshipLabels, ClientMaritalStatusLabels, ClientRelationshipWithSpouseLabels, ClientReligionLabels, ClientStatusEnum, ClientStatusLabels } from '@/types/enums';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  EnvelopeIcon,
  EyeIcon,
  MapPinIcon,
  PhoneIcon,
  PlayIcon,
  UserIcon,
  XMarkIcon,
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filter clients by status
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      return status === 'all' ? true : c.status === status;
    });
  }, [clients, status]);

  // Modal handlers
  const handleCloseDetails = React.useCallback(() => {
    setShowDetailsModal(false);
    setSelectedClient(null);
  }, []);
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
        setSelectedClient(client);
        setShowDetailsModal(true);
      },
    },
    {
      key: 'therapy',
      label: 'Terapi',
      icon: PlayIcon,
      variant: 'default',
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

  // Helper function for status badge
  const getStatusBadge = (status: Client['status']) => {
    return <ClientStatusBadge status={status as ClientStatusEnum} />;
  };

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
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedClient.fullName || selectedClient.name}
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
                        {selectedClient.fullName || selectedClient.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClient.birthPlace}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedClient.birthDate ? new Date(selectedClient.birthDate).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClient.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Pernikahan</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {ClientMaritalStatusLabels[selectedClient.maritalStatus as keyof typeof ClientMaritalStatusLabels] || selectedClient.maritalStatus}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Akun</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedClient.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minor-specific Information */}
                {selectedClient.isMinor && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Sekolah</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedClient.school && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Sekolah</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedClient.school}</p>
                          </div>
                        )}
                        {selectedClient.grade && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Kelas</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedClient.grade}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Wali</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedClient.guardianFullName && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap Wali</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedClient.guardianFullName}</p>
                          </div>
                        )}
                        {selectedClient.guardianRelationship && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Hubungan dengan Klien</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {ClientGuardianRelationshipLabels[selectedClient.guardianRelationship as keyof typeof ClientGuardianRelationshipLabels] || selectedClient.guardianRelationship}
                            </p>
                          </div>
                        )}
                        {selectedClient.guardianPhone && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nomor Telepon Wali</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedClient.guardianPhone}</p>
                          </div>
                        )}
                        {selectedClient.guardianOccupation && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Pekerjaan Wali</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedClient.guardianOccupation}</p>
                          </div>
                        )}
                        {selectedClient.guardianMaritalStatus && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status Pernikahan Wali</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {ClientGuardianMaritalStatusLabels[selectedClient.guardianMaritalStatus as keyof typeof ClientGuardianMaritalStatusLabels] || selectedClient.guardianMaritalStatus}
                            </p>
                          </div>
                        )}
                        {selectedClient.guardianAddress && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Wali</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedClient.guardianAddress}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hak Asuh Hukum</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedClient.guardianLegalCustody ? 'Ya' : 'Tidak'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dokumen Hak Asuh</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedClient.guardianCustodyDocsAttached ? 'Terlampir' : 'Belum terlampir'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
                        {ClientEducationLabels[selectedClient.education as keyof typeof ClientEducationLabels] || selectedClient.education}
                        {selectedClient.educationMajor && (
                          <span className="text-gray-600 ml-1">- {selectedClient.educationMajor}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Agama</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {ClientReligionLabels[selectedClient.religion as keyof typeof ClientReligionLabels] || selectedClient.religion}
                      </p>
                    </div>
                    {selectedClient.hobbies && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hobi</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedClient.hobbies}</p>
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

                {/* Marital Information */}
                {selectedClient.maritalStatus === 'Married' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Pernikahan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedClient.spouseName && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nama Pasangan</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedClient.spouseName}</p>
                        </div>
                      )}
                      {selectedClient.relationshipWithSpouse && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hubungan dengan Pasangan</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {ClientRelationshipWithSpouseLabels[selectedClient.relationshipWithSpouse as keyof typeof ClientRelationshipWithSpouseLabels] || selectedClient.relationshipWithSpouse}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Visit Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Kunjungan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kunjungan Pertama</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedClient.firstVisit ? 'Ya' : 'Tidak'}
                      </p>
                    </div>
                    {!selectedClient.firstVisit && selectedClient.previousVisitDetails && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Detail Kunjungan Sebelumnya</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedClient.previousVisitDetails}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Therapy Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Terapi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {(selectedClient.emergencyContactName || selectedClient.emergencyContactPhone) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontak Darurat</h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-red-700">Nama</label>
                          <p className="mt-1 text-sm text-red-800">{selectedClient.emergencyContactName}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-red-700">Telepon</label>
                          <p className="mt-1 text-sm text-red-800">{selectedClient.emergencyContactPhone}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-red-700">Hubungan</label>
                          <p className="mt-1 text-sm text-red-800">{selectedClient.emergencyContactRelationship}</p>
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
                  {/* Session history content will be added here */}
                </div>
              </div>

              {/* Modal Footer - Action buttons based on client status */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">

                  {/* Start Therapy - only for Consultation clients */}
                  {selectedClient.status !== ClientStatusEnum.Done && (
                    <button
                      onClick={() => {
                        handleCloseDetails();
                        onStartTherapy?.(selectedClient.id);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 flex items-center"
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Mulai Terapi
                    </button>
                  )}

                </div>

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
      )}

    </>
  );
};

export const TherapistClientList = React.memo(TherapistClientListComponent);
export default TherapistClientList;