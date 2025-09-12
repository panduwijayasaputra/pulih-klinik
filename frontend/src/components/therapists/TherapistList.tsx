'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, TableAction, TableColumn } from '@/components/ui/data-table';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
// useRouter import removed - using modal-based editing
import { UserRoleEnum } from '@/types/enums';
import { UserStatusEnum, UserStatusHelper } from '@/types/status';
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
import { UserAPI } from '@/lib/api/user';
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

// Constants for email resend retry system
const MAX_RESEND_ATTEMPTS = 3;
const RESEND_COOLDOWNS = {
  1: 1 * 60 * 1000,    // 1 minute for first retry
  2: 5 * 60 * 1000,    // 5 minutes for second retry
  3: 0,                // No cooldown for third retry (max reached)
};

export const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resendStatuses, setResendStatuses] = useState<Record<string, {
    attempts: number;
    maxAttempts: number;
    cooldownUntil?: Date;
    canResend: boolean;
    remainingCooldownMs?: number;
  }>>({});
  const [selectedStatus, setSelectedStatus] = useState<'all' | UserStatusEnum>('all');
  const [showTherapistFormModal, setShowTherapistFormModal] = useState(false);
  const [therapistFormMode, setTherapistFormMode] = useState<'create' | 'edit'>('create');
  const [therapistFormDefaultValues, setTherapistFormDefaultValues] = useState<Partial<any>>({});
  const { user, hasRole } = useAuth();
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();
  const { addToast } = useToast();

  // Initialize data table actions hook
  const { createDetailAction, createEditAction } = useDataTableActions();
  // Router removed since we're using modal-based editing instead of navigation

  // Load resend statuses for pending therapists
  const loadResendStatuses = useCallback(async () => {
    const pendingTherapists = therapists.filter(t => t.status === UserStatusEnum.PENDING);

    for (const therapist of pendingTherapists) {
      try {
        const response = await TherapistAPI.getEmailResendStatus(therapist.id);
        if (response.success && response.data) {
          setResendStatuses(prev => {
            const newStatuses = { ...prev };
            newStatuses[therapist.id] = response.data!;
            return newStatuses;
          });
        }
      } catch (error) {
        console.warn(`Failed to load resend status for therapist ${therapist.id}:`, error);
      }
    }
  }, [therapists]);

  // Load resend statuses when therapists change
  useEffect(() => {
    if (therapists.length > 0) {
      loadResendStatuses();
    }
  }, [loadResendStatuses]);

  // Handle resend cooldown countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setResendStatuses(prev => {
        const now = Date.now();
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach(key => {
          const status = updated[key];
          if (status?.remainingCooldownMs && status.remainingCooldownMs > 0) {
            const newRemainingMs = Math.max(0, status.remainingCooldownMs - 1000);
            if (newRemainingMs === 0) {
              // Cooldown expired, update status
              updated[key] = {
                ...status,
                remainingCooldownMs: 0,
                canResend: status.attempts < status.maxAttempts
              };
              hasChanges = true;
            } else {
              updated[key] = {
                ...status,
                remainingCooldownMs: newRemainingMs
              };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? updated : prev;
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
        // Filter out deleted therapists
        const activeTherapists = response.data.items.filter(
          therapist => therapist.status !== UserStatusEnum.DELETED
        );
        setTherapists(activeTherapists);
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
      // Call the real API to send setup email
      const response = await TherapistAPI.sendEmailVerification(therapistId);

      if (response.success) {
        // Refresh the resend status for this therapist
        const statusResponse = await TherapistAPI.getEmailResendStatus(therapistId);
        if (statusResponse.success && statusResponse.data) {
          setResendStatuses(prev => {
            const newStatuses = { ...prev };
            newStatuses[therapistId] = statusResponse.data!;
            return newStatuses;
          });
        }

        addToast({
          type: 'success',
          title: 'Email Setup Berhasil Dikirim',
          message: `Email setup telah dikirim ke ${therapist.email}. Therapist akan menerima instruksi untuk menyelesaikan pendaftaran.`
        });
      } else {
        throw new Error(response.message || 'Failed to send setup email');
      }
    } catch (error) {
      console.error('Resend email error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: error instanceof Error ? error.message : 'Gagal mengirim email setup. Silakan coba lagi.'
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

    const resendStatus = resendStatuses[therapistId];
    if (!resendStatus) {
      addToast({
        type: 'error',
        title: 'Status Tidak Ditemukan',
        message: 'Tidak dapat memuat status pengiriman email. Silakan segarkan halaman dan coba lagi.'
      });
      return;
    }

    // Check if max attempts reached
    if (resendStatus.attempts >= resendStatus.maxAttempts) {
      openDialog({
        title: 'Maksimal Percobaan Tercapai',
        description: `Therapist ${therapist.name} (${therapist.email}) telah mencapai maksimal ${resendStatus.maxAttempts} percobaan pengiriman email setup. Silakan hubungi administrator sistem untuk bantuan lebih lanjut.`,
        confirmText: 'Tutup',
        cancelText: '',
        variant: 'warning',
        onConfirm: () => { }, // Just close the dialog
      });
      return;
    }

    const nextAttempt = resendStatus.attempts + 1;
    const cooldownMs = RESEND_COOLDOWNS[nextAttempt as keyof typeof RESEND_COOLDOWNS] || 0;
    const cooldownText = cooldownMs > 0 ? ` Setelah pengiriman, akan ada cooldown ${cooldownMs === 1 * 60 * 1000 ? '1 menit' : '5 menit'}.` : '';

    openDialog({
      title: 'Kirim Email Setup',
      description: `Yakin ingin mengirim email setup ke ${therapist.email}? Ini adalah percobaan ke-${nextAttempt} dari ${resendStatus.maxAttempts}.${cooldownText}`,
      confirmText: 'Kirim Email',
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
      description: `Yakin ingin ${actionTextId} akun ${therapist.name}? ${newStatus === 'active' ? 'Mereka akan dapat mengakses akun kembali.' : 'Mereka tidak akan dapat mengakses akun hingga diaktifkan lagi.'}`,
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
      const therapist = therapists.find(t => t.id === therapistId);
      if (!therapist) {
        throw new Error('Therapist not found');
      }

      // Call the user status API with unified status
      const result = await UserAPI.updateUserStatus(therapist.userId, {
        status: newStatus === 'active' ? UserStatusEnum.ACTIVE : UserStatusEnum.INACTIVE,
        reason: newStatus === 'active' ? 'Account reactivated by admin' : 'Account deactivated by admin'
      });

      if (result.success) {
        // Update local state with the new unified status
        setTherapists(prev => {
          const updated = prev.map(t =>
            t.id === therapistId ? { ...t, status: result.data.status } : t
          );
          return updated;
        });

        addToast({
          type: 'success',
          title: 'Status Berhasil Diperbarui',
          message: `Akun ${therapist?.name} telah ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}. ${newStatus === 'active' ? 'Mereka sekarang dapat mengakses akun dan melakukan sesi.' : 'Mereka tidak akan dapat mengakses akun lagi.'}`
        });
      } else {
        throw new Error(result.message || 'Gagal memperbarui status therapist');
      }
    } catch (error: any) {
      console.error('Status update error:', error);

      // Handle different types of errors
      let errorMessage = 'Terjadi kesalahan tak terduga saat memperbarui status therapist. Silakan coba lagi.';

      if (error.response?.status === 403) {
        errorMessage = 'Anda tidak memiliki izin untuk memperbarui status therapist ini.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Therapist tidak ditemukan.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: errorMessage
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: UserStatusEnum) => {
    const variant = UserStatusHelper.getBadgeVariant(status);
    const label = UserStatusHelper.getDisplayLabel(status);

    return (
      <Badge variant={variant}>
        {status === UserStatusEnum.ACTIVE && <CheckCircleIcon className="w-3 h-3 mr-1" />}
        {status === UserStatusEnum.PENDING && <ClockIcon className="w-3 h-3 mr-1" />}
        {status === UserStatusEnum.INACTIVE && <XCircleIcon className="w-3 h-3 mr-1" />}
        {status === UserStatusEnum.DELETED && <XCircleIcon className="w-3 h-3 mr-1" />}
        {label}
      </Badge>
    );
  };

  // getUserStatusBadge removed - now using unified status system


  const formatCountdown = (remainingMs: number) => {
    const seconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  // Filter therapists by unified status
  const filteredTherapists = therapists.filter((therapist) => {
    const statusMatch = selectedStatus === 'all' ? true : therapist.status === selectedStatus;
    return statusMatch;
  });

  // Define table columns
  const columns: TableColumn<Therapist>[] = [
    {
      key: 'therapist',
      header: 'Therapist',
      render: (therapist) => (
        <div>
          <div className="font-medium text-gray-900">{therapist.name}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (therapist) => (
        <div>
          <div>{therapist.phone || 'N/A'}</div>
          <div className="text-xs text-gray-500">{therapist.email}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (therapist) => getStatusBadge(therapist.status),
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
      key: 'send-setup-email',
      label: (therapist) => {
        const resendStatus = resendStatuses[therapist.id];
        if (!resendStatus) {
          return 'Kirim Email Setup';
        }

        if (resendStatus.attempts >= resendStatus.maxAttempts) {
          return 'Hubungi Admin';
        }

        if (resendStatus.remainingCooldownMs && resendStatus.remainingCooldownMs > 0) {
          return `Kirim Email Setup (${formatCountdown(resendStatus.remainingCooldownMs)})`;
        }
        
        const nextAttempt = resendStatus.attempts + 1;
        return `Kirim Email Setup (${nextAttempt}/${resendStatus.maxAttempts})`;
      },
      icon: EnvelopeIcon,
      variant: 'softInfo',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === UserStatusEnum.PENDING,
      loading: (therapist) => actionLoading === therapist.id,
      disabled: (therapist) => {
        const resendStatus = resendStatuses[therapist.id];
        if (!resendStatus) {
          return false;
        }

        return !resendStatus.canResend;
      },
      onClick: (therapist) => handleResendEmailConfirm(therapist.id),
    },
    {
      key: 'set-inactive',
      label: 'Set Nonaktif',
      icon: XCircleIcon,
      variant: 'destructive',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === UserStatusEnum.ACTIVE,
      loading: (therapist) => actionLoading === therapist.id,
      onClick: (therapist) => handleStatusChangeRequest(therapist.id, 'inactive'),
    },
    {
      key: 'set-active',
      label: 'Set Aktif',
      icon: CheckCircleIcon,
      variant: 'success',
      show: (therapist) =>
        hasRole(UserRoleEnum.ClinicAdmin) &&
        therapist.status === UserStatusEnum.INACTIVE,
      loading: (therapist) => actionLoading === therapist.id,
      onClick: (therapist) => handleStatusChangeRequest(therapist.id, 'active'),
    },
  ];

  // Define status filter
  const statusFilter = {
    key: 'status',
    label: 'Status Therapist',
    options: [
      { value: 'all', label: 'Semua Status' },
      { value: UserStatusEnum.PENDING, label: 'Menunggu' },
      { value: UserStatusEnum.ACTIVE, label: 'Aktif' },
      { value: UserStatusEnum.INACTIVE, label: 'Tidak Aktif' },
    ],
    value: selectedStatus,
    onChange: (value: string) => {
      setSelectedStatus(value as 'all' | UserStatusEnum);
    },
  };

  // User status filter removed - now using unified status system

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
        searchPlaceholder="Cari nama, email..."
        searchKeys={['name', 'email']}
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
        resendCooldowns={{}}
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
