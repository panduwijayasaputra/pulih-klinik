'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTherapists } from '@/hooks/useTherapists';
import { Textarea } from '@/components/ui/textarea';

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
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const currentTherapist = useMemo(() => {
    const found = currentTherapistId && currentTherapistId.trim() && currentTherapistId !== '' ? therapists.find(t => t.id === currentTherapistId) : null;
    return found;
  }, [currentTherapistId, therapists]);

  const isReassign = !!currentTherapistId && currentTherapistId.trim() !== '' && currentTherapistId !== 'undefined';


  // Reset form when modal opens/closes or currentTherapistId changes
  useEffect(() => {
    if (!open) {
      setSelectedTherapist('');
      setReason('');
    }
  }, [open, currentTherapistId]);

  const isAtCapacity = (therapistId: string): boolean => {
    const t = therapists.find((x) => x.id === therapistId);
    if (!t) return false;
    return t.currentLoad >= t.maxClients;
  };

  const isSameTherapist = (therapistId: string): boolean => {
    return isReassign && therapistId === currentTherapistId;
  };

  // Filter available therapists - exclude current therapist for reassignment
  const availableTherapists = useMemo(() => {
    if (!isReassign) return therapists;
    return therapists.filter(t => t.id !== currentTherapistId);
  }, [therapists, isReassign, currentTherapistId]);

  const selectedInfo = useMemo(() => {
    const t = therapists.find((x) => x.id === selectedTherapist);
    if (!t) return null;
    const loadPct = Math.round((t.currentLoad / t.maxClients) * 100);
    return { currentLoad: t.currentLoad, maxClients: t.maxClients, loadPct };
  }, [therapists, selectedTherapist]);

  const handleConfirm = async (): Promise<void> => {
    if (!selectedTherapist) return;
    if (isReassign && !reason.trim()) return;
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
          {/* Current Therapist Section (for re-assign) */}
          {isReassign && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
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
                    <strong>{currentTherapist.fullName}</strong>
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
            <label className="text-sm font-medium text-gray-700">Pilih Therapist</label>
            <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10">
                <SelectValue placeholder="Pilih therapist dari daftar">
                  {selectedTherapist && therapists.find(t => t.id === selectedTherapist)?.fullName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 w-full">
                {availableTherapists.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {isReassign ? 'Tidak ada therapist lain yang tersedia untuk penggantian' : 'Tidak ada therapist yang ditemukan'}
                  </div>
                ) : (
                  availableTherapists.map((t) => {
                    const disabled = t.currentLoad >= t.maxClients;

                    return (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        disabled={disabled}
                        className="py-2"
                      >
                        <span className="font-medium text-gray-900">{t.fullName}</span>
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
                  {selectedInfo.currentLoad}/{selectedInfo.maxClients}
                </span>
              </div>

              {isAtCapacity(selectedTherapist) ? (
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Therapist penuh. Silakan pilih therapist lain.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Kapasitas tersedia ({selectedInfo.loadPct}%)</span>
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
  );
};

export default AssignTherapistModal;


