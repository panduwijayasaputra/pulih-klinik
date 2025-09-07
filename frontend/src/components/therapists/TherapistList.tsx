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
import { TherapistDetailsModal } from './TherapistDetailsModal';
import { useDataTableActions } from '@/hooks/useDataTableActions';

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
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resendCooldowns, setResendCooldowns] = useState<Record<string, number>>({});
  const [selectedStatus, setSelectedStatus] = useState<'all' | TherapistStatusEnum>('all');
  const [showTherapistFormModal, setShowTherapistFormModal] = useState(false);
  const [therapistFormMode, setTherapistFormMode] = useState<'create' | 'edit'>('create');
  const [therapistFormDefaultValues, setTherapistFormDefaultValues] = useState<Partial<any>>({});
  const { user, hasRole } = useAuth();
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();
  const { addToast } = useToast();

  // Initialize data table actions hook
  const { createDetailAction, createEditAction } = useDataTableActions();
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
      const response = await TherapistAPI.getTherapists(1, 50);
      if (response.success && response.data) {
        setTherapists(response.data.items);
      } else {
        addToast({
          type: 'error',
          title: 'Gagal Memuat Data',
          message: response.message || 'Gagal memuat daftar therapist'
        });
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
    setSelectedTherapistId(therapist.id);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedTherapistId(null);
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
    setSelectedTherapistId(therapist.id); // Store the therapist ID for the form modal
    setTherapistFormMode('edit');
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
        // For edit mode, the form modal handles the update internally
        addToast({
          type: 'success',
          title: 'Therapist Berhasil Diperbarui',
          message: `Data therapist ${data.name} telah berhasil diperbarui.`,
        });
        // Close the form modal
        setShowTherapistFormModal(false);
        // Refresh the therapist list
        refreshTherapists();
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

  const handleResendEmailConfirm = (therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
      addToast({
        type: 'error',
        title: 'Therapist Not Found',
        message: 'Therapist tidak ditemukan. Silakan segarkan halaman dan coba lagi.'
      });
      return;
    }

    openDialog({
      title: 'Kirim Ulang Email Registrasi',
      description: `Yakin ingin mengirim ulang email registrasi ke ${therapist.email}? Therapist akan menerima link setup yang baru.`,
      confirmText: 'Kirim Ulang',
      cancelText: 'Batal',
      variant: 'info',
      onConfirm: () => handleResendEmail(therapistId)
    });
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
      variant: newStatus === 'active' ? 'success' : 'danger',
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
      onClick: (therapist) => {
        setSelectedTherapistId(therapist.id);
        setShowDetailsModal(true);
      },
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: PencilIcon,
      variant: 'default',
      show: () => hasRole(UserRoleEnum.ClinicAdmin),
      onClick: async (therapist) => {
        handleEditTherapistModal(therapist);
      },
    },
    {
      key: 'activate',
      label: 'Aktifkan',
      icon: CheckCircleIcon,
      variant: 'success',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === TherapistStatusEnum.Inactive,
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
        therapist.status === TherapistStatusEnum.Active,
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
      variant: 'softInfo',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === TherapistStatusEnum.PendingSetup,
      loading: (therapist) => actionLoading === therapist.id,
      disabled: (therapist) => {
        const cooldown = resendCooldowns[therapist.id];
        return Boolean(cooldown && cooldown > 0);
      },
      onClick: (therapist) => handleResendEmailConfirm(therapist.id),
    },
  ];

  // Define status filter
  const statusFilter = {
    key: 'status',
    label: 'Semua Status',
    options: [
      { value: 'all', label: 'Semua Status' },
      { value: TherapistStatusEnum.Active, label: 'Aktif' },
      { value: TherapistStatusEnum.PendingSetup, label: 'Menunggu Setup' },
      { value: TherapistStatusEnum.OnLeave, label: 'Cuti' },
      { value: TherapistStatusEnum.Suspended, label: 'Ditahan' },
      { value: TherapistStatusEnum.Inactive, label: 'Tidak Aktif' },
    ],
    value: selectedStatus,
    onChange: (value: string) => {
      setSelectedStatus(value as 'all' | TherapistStatusEnum);
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
      <TherapistDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        therapistId={selectedTherapistId || undefined}
        hasRole={hasRole}
        actionLoading={actionLoading}
        resendCooldowns={resendCooldowns}
        onEdit={handleEditTherapist}
        onStatusChange={handleStatusChangeRequest}
        onResendEmail={handleResendEmail}
        formatCountdown={formatCountdown}
      />

      {/* Therapist Form Modal */}
      <TherapistFormModal
        open={showTherapistFormModal}
        onOpenChange={setShowTherapistFormModal}
        mode={therapistFormMode}
        {...(therapistFormMode === 'edit' && selectedTherapistId ? { therapistId: selectedTherapistId } : {})}
        defaultValues={therapistFormDefaultValues}
        onSubmitSuccess={handleTherapistFormSuccess}
        onCancel={() => setShowTherapistFormModal(false)}
      />
    </>
  );
};
