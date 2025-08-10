'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTherapists = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return therapists;
    return therapists.filter((t) =>
      t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
    );
  }, [therapists, search]);

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Therapist</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Cari nama atau email therapist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih therapist" />
            </SelectTrigger>
            <SelectContent>
              {filteredTherapists.map((t) => {
                const loadPct = Math.round((t.currentLoad / t.maxClients) * 100);
                const disabled = t.currentLoad >= t.maxClients;
                return (
                  <SelectItem key={t.id} value={t.id} disabled={disabled}>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {t.currentLoad}/{t.maxClients}
                        </span>
                      </div>
                      <Progress value={loadPct} className="h-1.5 mt-1" />
                      <div className="mt-1 flex items-center gap-2">
                        {disabled ? (
                          <Badge variant="destructive">Penuh</Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Tersedia</span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {selectedInfo && (
            <div className="text-xs">
              {isAtCapacity(selectedTherapist) ? (
                <span className="text-destructive">Therapist penuh. Silakan pilih therapist lain.</span>
              ) : (
                <span className="text-muted-foreground">Kapasitas: {selectedInfo.currentLoad}/{selectedInfo.maxClients} ({selectedInfo.loadPct}%)</span>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTherapist || isAtCapacity(selectedTherapist) || isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Konfirmasi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTherapistModal;


