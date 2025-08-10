'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useTherapists } from '@/hooks/useTherapists';
import { Badge } from '@/components/ui/badge';

interface AssignTherapistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  onAssigned: (therapistId: string) => Promise<void> | void;
}

export const AssignTherapistModal: React.FC<AssignTherapistModalProps> = ({
  open,
  onOpenChange,
  clientId,
  onAssigned,
}) => {
  const { therapists, isLoading, fetchTherapists } = useTherapists();
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAtCapacity = (therapistId: string): boolean => {
    const t = therapists.find((x) => x.id === therapistId);
    if (!t) return false;
    return t.currentLoad >= t.maxClients;
  };

  const selectedInfo = useMemo(() => {
    const t = therapists.find((x) => x.id === selectedTherapist);
    if (!t) return null;
    const loadPct = Math.round((t.currentLoad / t.maxClients) * 100);
    return { currentLoad: t.currentLoad, maxClients: t.maxClients, loadPct };
  }, [therapists, selectedTherapist]);

  const handleConfirm = async (): Promise<void> => {
    if (!selectedTherapist) return;
    setIsSubmitting(true);
    try {
      await onAssigned(selectedTherapist);
      onOpenChange(false);
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
              Assign Therapist
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Pilih therapist yang akan menangani klien ini
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-6 space-y-6">
          {/* Selection Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Pilih Therapist</label>
            <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10">
                <SelectValue placeholder="Pilih therapist dari daftar">
                  {selectedTherapist && therapists.find(t => t.id === selectedTherapist)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 w-full">
                {therapists.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Tidak ada therapist yang ditemukan
                  </div>
                ) : (
                  therapists.map((t) => {
                    const loadPct = Math.round((t.currentLoad / t.maxClients) * 100);
                    const disabled = t.currentLoad >= t.maxClients;

                    return (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        disabled={disabled}
                        className="py-2"
                      >
                        <span className="font-medium text-gray-900">{t.name}</span>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

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
              disabled={!selectedTherapist || isAtCapacity(selectedTherapist) || isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Menyimpan...
                </div>
              ) : (
                'Konfirmasi'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTherapistModal;


