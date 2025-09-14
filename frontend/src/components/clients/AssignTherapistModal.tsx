'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTherapists } from '@/hooks/useTherapists';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { UserStatusEnum, UserStatusHelper } from '@/types/status';
import { useAuth } from '@/hooks/useAuth';

interface AssignTherapistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  currentTherapistId?: string | undefined;
  onAssigned: (therapistId: string, reason?: string) => Promise<void> | void;
}

export const AssignTherapistModal: React.FC<AssignTherapistModalProps> = ({
  open,
  onOpenChange,
  clientId: _clientId,
  currentTherapistId,
  onAssigned,
}) => {
  const { therapists, isLoading: therapistsLoading } = useTherapists();
  const { user } = useAuth();
  const { isOpen: confirmDialogOpen, config: confirmConfig, openDialog: openConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmationDialog();
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const currentTherapist = useMemo(() => {
    const found = currentTherapistId && currentTherapistId.trim() && currentTherapistId !== '' ? therapists.find(t => t.id === currentTherapistId) : null;
    return found;
  }, [currentTherapistId, therapists]);

  const isReassign = !!currentTherapistId && currentTherapistId.trim() !== '' && currentTherapistId !== 'undefined';

  // Check if current user is a therapist but not in the therapist list
  const currentUserIsTherapist = useMemo(() => {
    if (!user?.roles) return false;
    return user.roles.some(role => role === 'therapist' || role === 'THERAPIST');
  }, [user?.roles]);

  const currentUserInTherapistList = useMemo(() => {
    if (!user?.id || !therapists.length) return false;
    return therapists.some(t => t.userId === user.id);
  }, [user?.id, therapists]);


  // Reset form when modal opens/closes or currentTherapistId changes
  useEffect(() => {
    if (!open) {
      setSelectedTherapist('');
      setReason('');
    }
  }, [open, currentTherapistId]);

  const isAtCapacity = (therapistId: string): boolean => {
    // No capacity limit - always return false
    return false;
  };

  const isSameTherapist = (therapistId: string): boolean => {
    return isReassign && therapistId === currentTherapistId;
  };

  // Filter available therapists - show all therapists but exclude current therapist for reassignment
  const availableTherapists = useMemo(() => {
    if (!isReassign) return therapists;
    return therapists.filter(t => t.id !== currentTherapistId);
  }, [therapists, isReassign, currentTherapistId]);

  const selectedInfo = useMemo(() => {
    const t = therapists.find((x) => x.id === selectedTherapist);
    if (!t) return null;
    return { currentLoad: t.currentLoad };
  }, [therapists, selectedTherapist]);

  const handleConfirm = async (): Promise<void> => {
    if (!selectedTherapist) return;
    if (isReassign && !reason.trim()) return;

    const selectedTherapistData = therapists.find(t => t.id === selectedTherapist);
    if (!selectedTherapistData) return;

    // Check if therapist is active
    if (!UserStatusHelper.isActive(selectedTherapistData.status)) {
      const statusLabel = UserStatusHelper.getDisplayLabel(selectedTherapistData.status);
      alert(`Therapist yang dipilih memiliki status "${statusLabel}" dan tidak dapat ditugaskan. Hanya therapist dengan status "Aktif" yang dapat ditugaskan klien. Silakan pastikan therapist telah menyelesaikan proses setup akun mereka.`);
      return;
    }

    if (isReassign) {
      // Show confirmation dialog for reassignment
      openConfirmDialog({
        title: 'Konfirmasi Penggantian Therapist',
        description: 'Apakah Anda yakin ingin mengganti therapist untuk klien ini?',
        variant: 'warning',
        confirmText: 'Ya, Ganti Therapist',
        cancelText: 'Batal',
        children: (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Therapist Saat Ini:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {currentTherapist?.name || 'Tidak diketahui'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Therapist Baru:</span>
                <span className="text-sm font-semibold text-blue-900">
                  {selectedTherapistData.name}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-sm font-medium text-gray-600">Alasan:</span>
                <p className="text-sm text-gray-800 mt-1 bg-white rounded p-2 border">
                  {reason.trim()}
                </p>
              </div>
            </div>
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ Tindakan ini akan mengubah penugasan therapist dan tidak dapat dibatalkan.
            </div>
          </div>
        ),
        onConfirm: () => performAssignment()
      });
    } else {
      // Show confirmation dialog for initial assignment
      openConfirmDialog({
        title: 'Konfirmasi Penugasan Therapist',
        description: 'Apakah Anda yakin ingin menugaskan therapist untuk klien ini?',
        variant: 'info',
        confirmText: 'Ya, Tugaskan Therapist',
        cancelText: 'Batal',
        children: (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Therapist yang Dipilih:</span>
                <span className="text-sm font-semibold text-blue-900">
                  {selectedTherapistData.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Kapasitas Saat Ini:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {selectedTherapistData.currentLoad}/15 klien
                </span>
              </div>
            </div>
            <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
              ℹ️ Setelah therapist ditugaskan, status klien akan berubah menjadi "Telah ditugaskan".
            </div>
          </div>
        ),
        onConfirm: () => performAssignment()
      });
    }
  };

  const performAssignment = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onAssigned(selectedTherapist, isReassign ? reason.trim() : undefined);
      onOpenChange(false);
      setSelectedTherapist('');
      setReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="pb-6 border-b border-gray-200">
          <div className="flex flex-col">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {isReassign ? 'Ganti Therapist' : 'Tugaskan Therapist'}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              {isReassign ? 'Pilih therapist baru untuk menggantikan therapist saat ini' : 'Pilih therapist yang akan menangani klien ini'}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-6 space-y-6">
          {/* Warning when no active therapists available */}
          {availableTherapists.length > 0 && availableTherapists.every(t => !UserStatusHelper.isActive(t.status) || t.currentLoad >= 15) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Tidak Ada Therapist yang Dapat Ditugaskan</span>
              </div>
              <p className="text-sm text-amber-700">
                Semua therapist saat ini tidak dapat ditugaskan karena status tidak aktif atau kapasitas penuh. 
                Therapist dengan status "Menunggu" perlu menyelesaikan proses setup akun mereka.
              </p>
              <p className="text-xs text-amber-600 mt-2">
                Therapist yang disabled akan ditampilkan dengan label status yang jelas di dropdown.
              </p>
            </div>
          )}
          
          {availableTherapists.length === 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Tidak Ada Therapist</span>
              </div>
              <p className="text-sm text-gray-700">
                {isReassign ? 'Tidak ada therapist lain yang tersedia untuk penggantian' : 'Tidak ada therapist yang ditemukan di sistem'}
              </p>
            </div>
          )}
          {/* Current Therapist Section (for re-assign) */}
          {isReassign && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Therapist Saat Ini</span>
              </div>
              {therapistsLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" />
                  <span className="text-sm text-yellow-700">Memuat data therapist...</span>
                </div>
              ) : currentTherapist ? (
                <>
                  <p className="text-sm text-yellow-700">
                    <strong>{currentTherapist.name}</strong>
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {availableTherapists.length > 0 
                      ? 'Therapist ini akan digantikan dengan pilihan baru Anda' 
                      : 'Tidak ada therapist lain yang tersedia untuk penggantian'
                    }
                  </p>
                </>
              ) : (
                <p className="text-sm text-yellow-700">
                  <strong>Therapist saat ini tidak ditemukan</strong>
                </p>
              )}
            </div>
          )}

          {/* Selection Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Pilih Therapist
              {availableTherapists.length === 0 && (
                <span className="ml-2 text-xs text-red-600">(Tidak ada therapist tersedia)</span>
              )}
            </label>
            {currentUserIsTherapist && !currentUserInTherapistList && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Perhatian</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1 break-words">
                  Anda memiliki peran therapist tetapi tidak muncul dalam daftar therapist. 
                  Silakan hubungi administrator untuk membuatkan profil therapist Anda.
                </p>
              </div>
            )}
            <Select value={selectedTherapist} onValueChange={setSelectedTherapist} disabled={availableTherapists.length === 0}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10">
                <SelectValue placeholder="Pilih therapist dari daftar">
                  {selectedTherapist && therapists.find(t => t.id === selectedTherapist)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableTherapists.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {isReassign ? 'Tidak ada therapist lain yang tersedia untuk penggantian' : 'Tidak ada therapist yang ditemukan'}
                  </div>
                ) : (
                  availableTherapists.map((t) => {
                    const isActive = UserStatusHelper.isActive(t.status);
                    const isAtCapacity = t.currentLoad >= 15;
                    const disabled = !isActive || isAtCapacity;
                    
                    // Get status badge color based on status
                    const getStatusBadgeColor = (status) => {
                      switch (status) {
                        case 'active':
                          return 'bg-green-100 text-green-800';
                        case 'pending':
                          return 'bg-yellow-100 text-yellow-800';
                        case 'inactive':
                          return 'bg-red-100 text-red-800';
                        default:
                          return 'bg-gray-100 text-gray-800';
                      }
                    };

                    return (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        disabled={disabled}
                        className="py-2 w-full"
                      >
                        <div className="flex w-full justify-between items-center gap-3">
                          <div className="flex flex-col">
                            <span className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                              {t.name}
                            </span>
                            {!isActive && (
                              <span className="text-xs text-red-600">
                                Tidak dapat ditugaskan - {UserStatusHelper.getDisplayLabel(t.status)}
                              </span>
                            )}
                            {isActive && isAtCapacity && (
                              <span className="text-xs text-red-600">
                                Tidak dapat ditugaskan - Kapasitas penuh
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(t.status)}`}>
                              {UserStatusHelper.getDisplayLabel(t.status)}
                            </span>
                            <span className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
                              {t.currentLoad}/15
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Reason Field (for reassignment only) */}
          {isReassign && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Alasan Penggantian <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan alasan mengapa therapist perlu diganti (contoh: permintaan klien, konflik jadwal, keahlian khusus diperlukan, dll.)"
                className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Alasan ini akan dicatat untuk dokumentasi internal
                </p>
                <span className="text-xs text-gray-400">
                  {reason.length}/500
                </span>
              </div>
            </div>
          )}

          {/* Selected Therapist Info */}
          {selectedInfo && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Kapasitas Therapist</span>
                <span className={`text-sm font-semibold ${isAtCapacity(selectedTherapist)
                    ? 'text-red-600'
                    : 'text-green-600'
                  }`}>
                  {selectedInfo.currentLoad}/15
                </span>
              </div>

              {isAtCapacity(selectedTherapist) ? (
                <div className="flex items-center gap-2 text-red-600">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span className="text-sm">Therapist penuh. Silakan pilih therapist lain.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="text-sm">Therapist tersedia</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="pt-6 border-t border-gray-200">
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedTherapist || isAtCapacity(selectedTherapist) || isSameTherapist(selectedTherapist) || (isReassign && !reason.trim()) || isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {isReassign ? 'Mengganti...' : 'Menugaskan...'}
                </div>
              ) : (
                isReassign ? 'Ganti Therapist' : 'Tugaskan Therapist'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={closeConfirmDialog}
        {...confirmConfig}
      />
    </>
  );
};

export default AssignTherapistModal;


