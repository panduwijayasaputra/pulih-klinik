'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  Session,
  SessionStatusEnum,
  SessionStatusLabels,
} from '@/types/therapy';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

type ConfirmationType = 'start' | 'complete' | 'cancel' | 'reschedule';

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  session: Session;
  type: ConfirmationType;
  isLoading?: boolean;
  customMessage?: string;
  showSessionInfo?: boolean;
}

interface ConfirmationConfig {
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: 'default' | 'destructive';
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

// Configuration for different confirmation types
const confirmationConfigs: Record<ConfirmationType, ConfirmationConfig> = {
  start: {
    title: 'Mulai Sesi Terapi',
    description: 'Apakah Anda yakin ingin memulai sesi ini sekarang?',
    confirmLabel: 'Ya, Mulai Sesi',
    confirmVariant: 'default',
    icon: PlayIcon,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  complete: {
    title: 'Selesaikan Sesi',
    description: 'Apakah Anda yakin ingin menandai sesi ini sebagai selesai?',
    confirmLabel: 'Ya, Selesaikan',
    confirmVariant: 'default',
    icon: CheckIcon,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  cancel: {
    title: 'Batalkan Sesi',
    description: 'Apakah Anda yakin ingin membatalkan sesi ini?',
    confirmLabel: 'Ya, Batalkan',
    confirmVariant: 'destructive',
    icon: XMarkIcon,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  reschedule: {
    title: 'Jadwal Ulang Sesi',
    description: 'Sesi ini akan dijadwalkan ulang. Lanjutkan?',
    confirmLabel: 'Ya, Jadwal Ulang',
    confirmVariant: 'default',
    icon: ArrowPathIcon,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
};

// Helper function to format date/time
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: SessionStatusEnum): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case SessionStatusEnum.New:
      return 'outline';
    case SessionStatusEnum.Scheduled:
      return 'default';
    case SessionStatusEnum.Started:
      return 'secondary';
    case SessionStatusEnum.Completed:
      return 'default';
    case SessionStatusEnum.Cancelled:
    case SessionStatusEnum.NoShow:
      return 'destructive';
    default:
      return 'outline';
  }
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  session,
  type,
  isLoading = false,
  customMessage,
  showSessionInfo = true,
}) => {
  const { addToast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  const config = confirmationConfigs[type];
  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Confirmation action error:', error);
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses aksi',
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Get special warnings based on action type
  const getWarnings = (): string[] => {
    const warnings: string[] = [];

    if (type === 'start') {
      warnings.push('Sesi akan dimulai dan timer akan berjalan');
      warnings.push('Pastikan klien sudah siap untuk memulai sesi');
      if (session.objectives?.length > 0) {
        warnings.push(`Tujuan sesi: ${session.objectives.slice(0, 2).join(', ')}${session.objectives.length > 2 ? '...' : ''}`);
      }
    } else if (type === 'complete') {
      warnings.push('Sesi akan ditandai sebagai selesai dan tidak dapat diubah kembali');
      warnings.push('Pastikan semua catatan sesi sudah lengkap');
    } else if (type === 'cancel') {
      if (session.status === SessionStatusEnum.Started) {
        warnings.push('Sesi yang sedang berlangsung akan dihentikan');
      }
      warnings.push('Data sesi akan tetap tersimpan dengan status dibatalkan');
      if (session.scheduledDate) {
        warnings.push('Slot jadwal akan tersedia kembali');
      }
    }

    return warnings;
  };

  const warnings = getWarnings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.bgColor} ${config.borderColor} border`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {customMessage || config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Session Information */}
          {showSessionInfo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">
                      Sesi #{session.sessionNumber}: {session.title}
                    </h3>
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {SessionStatusLabels[session.status]}
                    </Badge>
                  </div>
                  
                  {session.description && (
                    <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                  )}
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    {session.scheduledDate && (
                      <p>
                        <strong>Jadwal:</strong> {formatDateTime(session.scheduledDate)}
                      </p>
                    )}
                    {session.duration && (
                      <p>
                        <strong>Durasi:</strong> {session.duration} menit
                      </p>
                    )}
                    {session.type && (
                      <p>
                        <strong>Tipe:</strong> {session.type}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className={`w-5 h-5 ${config.iconColor} mt-0.5`} />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hal yang Perlu Diperhatikan:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Special message for session start navigation */}
          {type === 'start' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-blue-700">
                  Setelah memulai sesi, Anda akan diarahkan ke halaman sesi untuk melakukan terapi.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming || isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isConfirming || isLoading}
            className="min-w-[140px]"
          >
            {isConfirming || isLoading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              config.confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Individual confirmation modals for specific use cases
export const SessionStartConfirmationModal: React.FC<Omit<ConfirmationModalProps, 'type'>> = (props) => (
  <ConfirmationModal {...props} type="start" />
);

export const SessionCompleteConfirmationModal: React.FC<Omit<ConfirmationModalProps, 'type'>> = (props) => (
  <ConfirmationModal {...props} type="complete" />
);

export const SessionCancelConfirmationModal: React.FC<Omit<ConfirmationModalProps, 'type'>> = (props) => (
  <ConfirmationModal {...props} type="cancel" />
);

export const SessionRescheduleConfirmationModal: React.FC<Omit<ConfirmationModalProps, 'type'>> = (props) => (
  <ConfirmationModal {...props} type="reschedule" />
);

export default ConfirmationModal;