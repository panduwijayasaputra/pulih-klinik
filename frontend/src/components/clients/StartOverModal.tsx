'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTherapists } from '@/hooks/useTherapists';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface StartOverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  onStartOver: (therapistId: string, reason?: string) => Promise<void>;
}

export const StartOverModal: React.FC<StartOverModalProps> = ({
  open,
  onOpenChange,
  clientName,
  onStartOver,
}) => {
  const { therapists, isLoading } = useTherapists();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedTherapistId) return;

    setIsSubmitting(true);
    try {
      await onStartOver(selectedTherapistId, reason || 'Klien memulai ulang terapi dengan therapist baru');
      onOpenChange(false);
      setSelectedTherapistId('');
      setReason('');
    } catch (error) {
      console.error('Error starting over:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedTherapistId('');
    setReason('');
    onOpenChange(false);
  };

  // Get available therapists (active ones only)
  const availableTherapists = therapists.filter((t: any) => t.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowPathIcon className="w-5 h-5 text-blue-600" />
            Mulai Ulang Terapi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Klien:</strong> {clientName}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Status klien akan berubah menjadi <strong>Konsultasi</strong> dan akan ditugaskan ke therapist yang dipilih.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="therapist">Pilih Therapist Baru</Label>
            <Select
              value={selectedTherapistId}
              onValueChange={setSelectedTherapistId}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih therapist..." />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Memuat therapist...
                  </SelectItem>
                ) : availableTherapists.length === 0 ? (
                  <SelectItem value="no-therapists" disabled>
                    Tidak ada therapist tersedia
                  </SelectItem>
                ) : (
                  availableTherapists.map((therapist: any) => (
                    <SelectItem key={therapist.id} value={therapist.id}>
                      <span>{therapist.fullName || therapist.name}</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Memulai Ulang (Opsional)</Label>
            <Textarea
              id="reason"
              placeholder="Masukkan alasan memulai ulang terapi..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedTherapistId || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Mulai Ulang
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};