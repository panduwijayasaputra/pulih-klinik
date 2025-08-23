'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, TableAction, TableColumn } from '@/components/ui/data-table';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
// useRouter import removed - using modal-based editing
import { TherapistStatusEnum, UserRoleEnum } from '@/types/enums';
import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { TherapistAPI } from '@/lib/api/therapist';
import { Therapist, THERAPIST_SPECIALIZATIONS } from '@/types/therapist';
import { TherapistFormModal } from './TherapistFormModal';

// Helper functions to convert between specialization IDs and names
const getSpecializationNameById = (id: string): string => {
  const spec = THERAPIST_SPECIALIZATIONS.find(s => s.id === id);
  return spec ? spec.name : id; // Return id as fallback
};

// Helper function removed - no longer needed with direct ID handling

export const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resendCooldowns, setResendCooldowns] = useState<Record<string, number>>({});
  const [selectedStatus, setSelectedStatus] = useState<'all' | Therapist['status']>('all');
  const [showTherapistFormModal, setShowTherapistFormModal] = useState(false);
  const [therapistFormMode, setTherapistFormMode] = useState<'create' | 'edit'>('create');
  const [therapistFormDefaultValues, setTherapistFormDefaultValues] = useState<Partial<any>>({});
  const { user, hasRole } = useAuth();
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();
  const { addToast } = useToast();
  // Router removed since we're using modal-based editing instead of navigation

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
  const loadTherapists = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await TherapistAPI.getTherapists();
      if (response.success && response.data) {
        setTherapists(response.data.items);
      }
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
  }, [addToast]);

  useEffect(() => {
    loadTherapists();
  }, [loadTherapists]);

  // Refresh function
  const refreshTherapists = useCallback(async () => {
    await loadTherapists();
  }, [loadTherapists]);

  const handleViewDetails = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedTherapist(null);
    setShowDetailsModal(false);
  };

  const handleEditTherapist = (therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    if (therapist) {
      handleCloseDetails();
      handleEditTherapistModal(therapist);
    }
  };

  // Therapist form modal handlers
  const handleCreateTherapist = () => {
    setTherapistFormMode('create');
    setTherapistFormDefaultValues({});
    setShowTherapistFormModal(true);
  };

  const handleEditTherapistModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setTherapistFormMode('edit');
    setTherapistFormDefaultValues({
      name: therapist.fullName,  // Form expects 'name', not 'fullName'
      email: therapist.email,
      phone: therapist.phone,
      licenseNumber: therapist.licenseNumber,
      licenseType: therapist.licenseType,
      specializations: therapist.specializations, // Keep as array of IDs
      yearsExperience: therapist.yearsOfExperience, // Form expects 'yearsExperience'
      employmentType: therapist.employmentType,
      // Convert education array to string
      education: therapist.education.map(edu => 
        `${edu.degree} ${edu.field} - ${edu.institution} (${edu.year})`
      ).join('; '),
      // Convert certifications array to string
      certifications: therapist.certifications.map(cert => 
        `${cert.name} - ${cert.issuingOrganization}`
      ).join('; '),
      adminNotes: therapist.adminNotes || '', // Use actual adminNotes or empty string
    });
    setShowTherapistFormModal(true);
  };

  const handleTherapistFormSuccess = async (data: any) => {
    try {
      if (therapistFormMode === 'create') {
        // Note: In a real implementation, this would be handled by the API
        // For now, we'll just add a toast notification
        addToast({
          type: 'success',
          title: 'Therapist Berhasil Ditambahkan',
          message: `Therapist ${data.name} telah berhasil ditambahkan ke sistem.`,
        });
        // Refresh the list to show the new therapist
        refreshTherapists();
      } else {
        // Update existing therapist
        if (selectedTherapist) {
          // In a real implementation, this would call the API
          // For now, we'll update the local state and show success message
          setTherapists(prev => prev.map(t => 
            t.id === selectedTherapist.id 
              ? { 
                  ...t, 
                  fullName: data.name, // Form returns 'name', convert to 'fullName'
                  email: data.email,
                  phone: data.phone,
                  licenseNumber: data.licenseNumber,
                  licenseType: data.licenseType,
                  specializations: data.specializations, // Already an array of IDs
                  yearsOfExperience: data.yearsExperience, // Form returns 'yearsExperience'
                  employmentType: data.employmentType,
                  adminNotes: data.adminNotes,
                  // Keep existing education and certifications arrays (form only edits as strings)
                  // In a real app, these would be properly parsed or handled by the API
                  updatedAt: new Date().toISOString()
                }
              : t
          ));
          addToast({
            type: 'success',
            title: 'Therapist Berhasil Diperbarui',
            message: `Data therapist ${data.name} telah berhasil diperbarui.`,
          });
          // Close the form modal
          setShowTherapistFormModal(false);
          setSelectedTherapist(null);
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data therapist.',
      });
    }
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

    openDialog({
      title: actionTitleId,
      description: `Yakin ingin ${actionTextId} akun ${therapist.fullName}? ${newStatus === 'active' ? 'Mereka akan dapat mengakses akun kembali.' : 'Mereka tidak akan dapat mengakses akun hingga diaktifkan lagi.'}`,
      confirmText: actionTextId.charAt(0).toUpperCase() + actionTextId.slice(1),
      cancelText: 'Batal',
      onConfirm: () => executeStatusChange(therapistId, newStatus)
    });
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
            ? { ...therapist, status: newStatus === 'active' ? TherapistStatusEnum.Active : TherapistStatusEnum.Inactive }
            : therapist
        );
        return updated;
      });

      addToast({
        type: 'success',
        title: 'Status Berhasil Diperbarui',
        message: `Akun ${therapist?.fullName} telah ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}. ${newStatus === 'active' ? 'Mereka sekarang dapat mengakses akun dan melakukan sesi.' : 'Mereka tidak akan dapat mengakses akun lagi.'}`
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
    switch (status) {
      case TherapistStatusEnum.Active:
        return (
          <Badge variant="success">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        );
      case TherapistStatusEnum.PendingSetup:
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
        return <Badge variant="outline">{status}</Badge>;
    }
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
          <div className="font-medium text-gray-900">{therapist.fullName}</div>
          <div className="text-xs text-gray-500">{therapist.specializations.map(id => getSpecializationNameById(id)).join(', ')}</div>
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
      key: 'specializations',
      header: 'Spesialisasi',
      render: (therapist) => (
        <div>
          <div className="text-sm">
            {therapist.specializations.map(id => getSpecializationNameById(id)).join(', ')}
          </div>
          <div className="text-xs text-gray-500">
            {therapist.yearsOfExperience} tahun pengalaman
          </div>
        </div>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Therapist>[] = [
    {
      key: 'view',
      label: 'Detail',
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
        therapist.status === TherapistStatusEnum.PendingSetup,
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
      { value: TherapistStatusEnum.PendingSetup, label: 'Menunggu Setup' },
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
        searchKeys={['fullName', 'email', 'specializations']}
        filters={[statusFilter]}
        refreshAction={{
          label: 'Segarkan',
          onClick: refreshTherapists,
          loading: loading,
        }}
        createAction={{
          label: 'Tambah Therapist',
          icon: PlusIcon,
          onClick: handleCreateTherapist,
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogIsOpen}
        onClose={closeDialog}
        {...dialogConfig}
      />

      {/* Therapist Details Modal */}
      {showDetailsModal && selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTherapist.fullName}
                  </h2>
                  <p className="text-gray-600 mt-1">Detail Therapist</p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Therapist Information */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.fullName}</p>
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
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.specializations.map(id => getSpecializationNameById(id)).join(', ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tahun Pengalaman</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.yearsOfExperience} tahun</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedTherapist.education.map((edu, index) => (
                          <div key={index} className="mb-1">
                            {edu.degree} {edu.field} - {edu.institution} ({edu.year})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedTherapist.certifications && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Sertifikasi</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedTherapist.certifications.map((cert, index) => (
                          <div key={index} className="mb-1">
                            {cert.name} - {cert.issuingOrganization} ({cert.certificateNumber})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Kerja</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Klien Aktif</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedTherapist.currentLoad}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Maksimal Klien</span>
                        <span className="text-2xl font-bold text-green-600">{selectedTherapist.maxClients}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Modal Footer */}
              <div className="flex justify-end items-center mt-6 pt-6 border-t border-gray-200">

                {/* Right side - Action buttons */}
                <div className="flex space-x-3">

                  {/* Clinic Admin Actions */}
                  {hasRole(UserRoleEnum.ClinicAdmin) && (
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
                      {selectedTherapist.status === TherapistStatusEnum.PendingSetup && (() => {
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

      {/* Therapist Form Modal */}
      <TherapistFormModal
        open={showTherapistFormModal}
        onOpenChange={setShowTherapistFormModal}
        mode={therapistFormMode}
        {...(therapistFormMode === 'edit' && selectedTherapist?.id ? { therapistId: selectedTherapist.id } : {})}
        defaultValues={therapistFormDefaultValues}
        onSubmitSuccess={handleTherapistFormSuccess}
        onCancel={() => setShowTherapistFormModal(false)}
      />
    </>
  );
};
