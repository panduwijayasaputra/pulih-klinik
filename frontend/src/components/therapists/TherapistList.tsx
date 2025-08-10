'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { useAuth } from '@/hooks/useAuth';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { TherapistStatusEnum, UserRoleEnum } from '@/types/enums';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon,
  StarIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
  education: string;
  certifications?: string;
  adminNotes?: string;
  status: 'active' | 'pending_setup' | 'inactive';
  sessions_completed: number;
  client_satisfaction: number;
  registrationDate: string;
  lastActive?: string;
}

export const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resendCooldowns, setResendCooldowns] = useState<Record<string, number>>({});
  const [selectedStatus, setSelectedStatus] = useState<'all' | Therapist['status']>('all');
  const { user, hasRole } = useAuth();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { addToast } = useToast();
  const router = useRouter();

  // Handle resend cooldown countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setResendCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] && updated[key] > 0) {
            updated[key] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load therapists data
  useEffect(() => {
    const loadTherapists = async () => {
      setLoading(true);
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock therapists data
        const mockTherapists = [
          {
            id: 'th-1',
            name: 'Dr. Budi Santoso',
            email: 'budi@kliniksehat.com',
            phone: '+62-812-3456-7890',
            specialization: 'Anxiety Disorders',
            licenseNumber: 'SIP-123456',
            yearsExperience: 8,
            education: 'S1 Psikologi, Universitas Indonesia',
            certifications: 'Certified Hypnotherapist, CBT Practitioner',
            adminNotes: 'Excellent therapist with strong client relationships',
            status: 'active' as const,
            sessions_completed: 45,
            client_satisfaction: 4.8,
            registrationDate: '2024-01-10',
            lastActive: '2 hours ago'
          },
          {
            id: 'th-2',
            name: 'Dr. Siti Rahayu',
            email: 'siti@kliniksehat.com',
            phone: '+62-813-4567-8901',
            specialization: 'Depression',
            licenseNumber: 'SIP-123457',
            yearsExperience: 12,
            education: 'S2 Psikologi Klinis, Universitas Gadjah Mada',
            certifications: 'EMDR Certified, Trauma Specialist',
            adminNotes: 'Specializes in trauma and depression cases',
            status: 'inactive' as const,
            sessions_completed: 32,
            client_satisfaction: 4.9,
            registrationDate: '2024-01-08',
            lastActive: '4 hours ago'
          },
          {
            id: 'th-3',
            name: 'Dr. Ahmad Pratama',
            email: 'ahmad@kliniksehat.com',
            phone: '+62-814-5678-9012',
            specialization: 'PTSD',
            licenseNumber: 'SIP-123458',
            yearsExperience: 5,
            education: 'S1 Psikologi, Universitas Airlangga',
            certifications: 'PTSD Specialist, Military Trauma Certified',
            adminNotes: 'New therapist, strong background in military trauma',
            status: 'pending_setup' as const,
            sessions_completed: 0,
            client_satisfaction: 0,
            registrationDate: '2024-01-12',
            lastActive: 'Never'
          },
          {
            id: 'th-4',
            name: 'Dr. Maya Sari',
            email: 'maya@kliniksehat.com',
            phone: '+62-815-6789-0123',
            specialization: 'Anxiety Disorders',
            licenseNumber: 'SIP-123459',
            yearsExperience: 6,
            education: 'S1 Psikologi, Universitas Padjadjaran',
            certifications: 'Anxiety Specialist, Mindfulness Practitioner',
            adminNotes: 'Experienced in anxiety and stress management',
            status: 'pending_setup' as const,
            sessions_completed: 0,
            client_satisfaction: 0,
            registrationDate: '2024-01-14',
            lastActive: 'Never'
          }
        ];

        setTherapists(mockTherapists);
      } catch (error) {
        console.error('Failed to load therapists:', error);
        addToast({
          type: 'error',
          title: 'Kesalahan Koneksi',
          message: 'Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadTherapists();
  }, [addToast]);

  // Refresh function
  const refreshTherapists = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      // In a real app, this would reload the data
    } catch (error) {
      console.error('Failed to refresh therapists:', error);
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh therapist data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const handleViewDetails = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedTherapist(null);
    setShowDetailsModal(false);
  };

  const handleEditTherapist = (therapistId: string) => {
    handleCloseDetails();
    router.push(`/portal/therapists/edit/${therapistId}`);
  };

  const handleResendEmail = async (therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
      addToast({
        type: 'error',
        title: 'Therapist Not Found',
        message: 'Therapist tidak ditemukan. Silakan segarkan halaman dan coba lagi.'
      });
      return;
    }

    setActionLoading(therapistId);
    try {
      // Mock API call to resend email
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set cooldown timer (60 seconds)
      setResendCooldowns(prev => ({
        ...prev,
        [therapistId]: 60
      }));

      addToast({
        type: 'success',
        title: 'Email Berhasil Dikirim Ulang',
        message: `Email registrasi telah dikirim ulang ke ${therapist.email}. Therapist akan menerima link setup yang baru.`
      });
    } catch (error) {
      console.error('Resend email error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: 'Gagal mengirim ulang email registrasi. Silakan coba lagi.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChangeRequest = (therapistId: string, newStatus: 'active' | 'inactive') => {
    if (!hasRole(UserRoleEnum.ClinicAdmin)) {
      addToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Only clinic administrators can change therapist status'
      });
      return;
    }

    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
      addToast({
        type: 'error',
        title: 'Therapist Not Found',
        message: 'The selected therapist could not be found. Please refresh the page and try again.'
      });
      return;
    }

    const actionTextId = newStatus === 'active' ? 'aktifkan' : 'nonaktifkan';
    const actionTitleId = newStatus === 'active' ? 'Aktifkan Akun Therapist' : 'Nonaktifkan Akun Therapist';
    const actionColor = newStatus === 'active' ? 'success' : 'warning';

    showConfirmation({
      type: actionColor,
      title: actionTitleId,
      message: `Yakin ingin ${actionTextId} akun ${therapist.name}? ${newStatus === 'active' ? 'Mereka akan dapat mengakses akun kembali.' : 'Mereka tidak akan dapat mengakses akun hingga diaktifkan lagi.'}`,
      confirmText: actionTextId.charAt(0).toUpperCase() + actionTextId.slice(1),
      cancelText: 'Batal'
    }, () => executeStatusChange(therapistId, newStatus));
  };

  const executeStatusChange = async (therapistId: string, newStatus: 'active' | 'inactive') => {
    if (!user) {
      addToast({
        type: 'error',
        title: 'Kesalahan Autentikasi',
        message: 'Sesi pengguna tidak ditemukan. Silakan login kembali.'
      });
      return;
    }

    setActionLoading(therapistId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const therapist = therapists.find(t => t.id === therapistId);

      // Update local state
      setTherapists(prev => {
        const updated = prev.map(therapist =>
          therapist.id === therapistId
            ? { ...therapist, status: newStatus }
            : therapist
        );
        console.log('Status update:', { therapistId, newStatus, updated });
        return updated;
      });

      addToast({
        type: 'success',
        title: 'Status Berhasil Diperbarui',
        message: `Akun ${therapist?.name} telah ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}. ${newStatus === 'active' ? 'Mereka sekarang dapat mengakses akun dan melakukan sesi.' : 'Mereka tidak akan dapat mengakses akun lagi.'}`
      });
    } catch (error) {
      console.error('Status update error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: 'Terjadi kesalahan tak terduga saat memperbarui status therapist. Silakan coba lagi.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    console.log('getStatusBadge called with status:', status);
    switch (status) {
      case TherapistStatusEnum.Active:
        return (
          <Badge variant="success">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        );
      case 'pending_setup':
        return (
          <Badge variant="warning">
            <ClockIcon className="w-3 h-3 mr-1" />
            Menunggu Setup
          </Badge>
        );
      case TherapistStatusEnum.Inactive:
        return (
          <Badge variant="destructive">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Tidak Aktif
          </Badge>
        );
      default:
        console.log('Default case for status:', status);
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Filter therapists by status
  const filteredTherapists = therapists.filter((therapist) => {
    return selectedStatus === 'all' ? true : therapist.status === selectedStatus;
  });

  // Define table columns
  const columns: TableColumn<Therapist>[] = [
    {
      key: 'therapist',
      header: 'Therapist',
      render: (therapist) => (
        <div>
          <div className="font-medium text-gray-900">{therapist.name}</div>
          <div className="text-xs text-gray-500">{therapist.specialization}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (therapist) => (
        <div>
          <div>{therapist.phone}</div>
          <div className="text-xs text-gray-500">{therapist.email}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (therapist) => getStatusBadge(therapist.status),
    },
    {
      key: 'performance',
      header: 'Kinerja',
      render: (therapist) => (
        <div>
          <div className="text-sm">{therapist.sessions_completed} sesi</div>
          <div className="flex items-center text-xs text-gray-500">
            <div className="flex items-center mr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(therapist.client_satisfaction)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {formatRating(therapist.client_satisfaction)}
          </div>
        </div>
      ),
    },
    {
      key: 'registration',
      header: 'Registrasi',
      render: (therapist) => (
        <div className="text-sm text-gray-600">
          {new Date(therapist.registrationDate).toLocaleDateString('id-ID')}
        </div>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Therapist>[] = [
    {
      key: 'view',
      label: 'Lihat',
      icon: EyeIcon,
      variant: 'outline',
      onClick: (therapist) => handleViewDetails(therapist),
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: PencilIcon,
      variant: 'outline',
      show: () => hasRole(UserRoleEnum.ClinicAdmin),
      onClick: (therapist) => handleEditTherapist(therapist.id),
    },
    {
      key: 'activate',
      label: 'Aktifkan',
      icon: CheckCircleIcon,
      variant: 'default',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === 'inactive',
      loading: (therapist) => actionLoading === therapist.id,
      onClick: (therapist) => handleStatusChangeRequest(therapist.id, 'active'),
    },
    {
      key: 'deactivate',
      label: 'Nonaktifkan',
      icon: XCircleIcon,
      variant: 'destructive',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === 'active',
      loading: (therapist) => actionLoading === therapist.id,
      onClick: (therapist) => handleStatusChangeRequest(therapist.id, 'inactive'),
    },
    {
      key: 'resend',
      label: (therapist) => {
        const cooldown = resendCooldowns[therapist.id];
        const isInCooldown = Boolean(cooldown && cooldown > 0);
        
        if (isInCooldown) {
          return `Kirim Ulang (${formatCountdown(cooldown || 0)})`;
        }
        return 'Kirim Ulang Email';
      },
      icon: EnvelopeIcon,
      variant: 'outline',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === 'pending_setup',
      loading: (therapist) => actionLoading === therapist.id,
      disabled: (therapist) => {
        const cooldown = resendCooldowns[therapist.id];
        return Boolean(cooldown && cooldown > 0);
      },
      onClick: (therapist) => handleResendEmail(therapist.id),
    },
  ];

  // Define status filter
  const statusFilter = {
    key: 'status',
    label: 'Semua Status',
    options: [
      { value: 'all', label: 'Semua Status' },
      { value: 'active', label: 'Aktif' },
      { value: 'pending_setup', label: 'Menunggu Setup' },
      { value: 'inactive', label: 'Tidak Aktif' },
    ],
    value: selectedStatus,
    onChange: (value: string) => {
      setSelectedStatus(value as 'all' | Therapist['status']);
    },
  };

  return (
    <>
      <DataTable
        title="Daftar Therapist"
        description="Kelola therapist, lihat detail, dan atur status akun"
        data={filteredTherapists}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="Tidak ada therapist yang ditemukan"
        loadingMessage="Memuat data therapist..."
        searchPlaceholder="Cari nama, email, atau spesialisasi..."
        searchKeys={['name', 'email', 'specialization']}
        filters={[statusFilter]}
        refreshAction={{
          label: 'Segarkan',
          onClick: refreshTherapists,
          loading: loading,
        }}
      />

      {/* Confirmation Dialog */}
      {ConfirmationDialog}

      {/* Therapist Details Modal */}
      {showDetailsModal && selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTherapist.name}
                </h2>
                <p className="text-gray-600 mt-1">Detail Therapist</p>
              </div>

              {/* Therapist Information */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Akun</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedTherapist.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Profesional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Lisensi (SIP)</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.licenseNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Spesialisasi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.specialization}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tahun Pengalaman</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.yearsExperience} tahun</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.education}</p>
                    </div>
                  </div>
                  {selectedTherapist.certifications && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Sertifikasi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.certifications}</p>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Metrik Kinerja</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Sesi Selesai</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedTherapist.sessions_completed}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Kepuasan Klien</span>
                        <div className="flex items-center">
                          <div className="flex items-center mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(selectedTherapist.client_satisfaction)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-2xl font-bold text-yellow-600">
                            {formatRating(selectedTherapist.client_satisfaction)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedTherapist.adminNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan Admin</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedTherapist.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Debug Info - Remove after testing */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <strong>Debug Info:</strong><br />
                User: {user?.name || 'Not logged in'}<br />
                User Email: {user?.email || 'None'}<br />
                User Roles: {user?.roles?.join(', ') || 'None'}<br />
                Has ClinicAdmin Role: {hasRole(UserRoleEnum.ClinicAdmin) ? 'Yes' : 'No'}<br />
                UserRoleEnum.ClinicAdmin: {UserRoleEnum.ClinicAdmin}<br />
                Is Authenticated: {user ? 'Yes' : 'No'}<br />
                Selected Therapist Status: {selectedTherapist.status}<br />
                All Therapists Statuses: {therapists.map(t => `${t.name}: ${t.status}`).join(', ')}<br />
                <button 
                  onClick={() => {
                    console.log('Manual test - current therapists:', therapists);
                    setTherapists(prev => prev.map(t => 
                      t.id === selectedTherapist.id 
                        ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
                        : t
                    ));
                  }}
                  className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  Test Status Toggle
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end items-center mt-6 pt-6 border-t border-gray-200">

                {/* Right side - Action buttons */}
                <div className="flex space-x-3">

                  {/* Clinic Admin Actions - Temporarily allowing all users for testing */}
                  {(hasRole(UserRoleEnum.ClinicAdmin) || true) && (
                    <>
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditTherapist(selectedTherapist.id)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 flex items-center"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Therapist
                      </button>

                      {/* Status Management Buttons */}
                      {selectedTherapist.status === 'active' && (
                        <button
                          onClick={() => {
                            handleCloseDetails();
                            handleStatusChangeRequest(selectedTherapist.id, 'inactive');
                          }}
                          disabled={actionLoading === selectedTherapist.id}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 flex items-center"
                        >
                          {actionLoading === selectedTherapist.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-4 h-4 mr-2" />
                              Nonaktifkan Akun
                            </>
                          )}
                        </button>
                      )}

                      {selectedTherapist.status === 'inactive' && (
                        <button
                          onClick={() => {
                            handleCloseDetails();
                            handleStatusChangeRequest(selectedTherapist.id, 'active');
                          }}
                          disabled={actionLoading === selectedTherapist.id}
                          className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 flex items-center"
                        >
                          {actionLoading === selectedTherapist.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Aktifkan Akun
                            </>
                          )}
                        </button>
                      )}

                      {/* Resend Email Button for Pending Setup */}
                      {selectedTherapist.status === 'pending_setup' && (() => {
                        const cooldown = resendCooldowns[selectedTherapist.id];
                        const isInCooldown = Boolean(cooldown && cooldown > 0);

                        return (
                          <button
                            onClick={() => handleResendEmail(selectedTherapist.id)}
                            disabled={actionLoading === selectedTherapist.id || isInCooldown}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50 flex items-center"
                          >
                            {actionLoading === selectedTherapist.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                                Mengirim...
                              </>
                            ) : isInCooldown ? (
                              <>
                                <ClockIcon className="w-4 h-4 mr-2" />
                                Kirim Ulang Email dalam {formatCountdown(cooldown || 0)}
                              </>
                            ) : (
                              <>
                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                Kirim Ulang Email
                              </>
                            )}
                          </button>
                        );
                      })()}
                    </>
                  )}

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
    </>
  );
};
