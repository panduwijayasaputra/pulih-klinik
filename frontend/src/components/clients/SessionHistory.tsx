'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClientAPI } from '@/lib/api/client';
import { useClient } from '@/hooks/useClient';
import { SessionSummary } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

interface SessionHistoryProps {
  clientId: string;
  pageSize?: number;
}

const PHASE_LABEL: Record<SessionSummary['phase'], string> = {
  intake: 'Intake',
  induction: 'Induksi',
  therapy: 'Terapi',
  post: 'Pasca Sesi',
};

const STATUS_VARIANT: Record<SessionSummary['status'], 'success' | 'destructive' | 'outline'> = {
  completed: 'success',
  cancelled: 'destructive',
  scheduled: 'outline',
};

export const SessionHistory: React.FC<SessionHistoryProps> = ({ clientId, pageSize = 5 }) => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SessionSummary | null>(null);
  const { addToast } = useToast();
  const { sessionsByClientId, loadSessions: loadSessionsFromStore } = useClient();

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const loadSessions = useCallback(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    ClientAPI.getClientSessions(clientId, page, pageSize)
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data) {
          setSessions(res.data.items);
          setTotal(res.data.total);
          // also cache in store for other consumers
          loadSessionsFromStore(clientId, page, pageSize).catch(() => {});
        } else {
          const msg = res.message || 'Gagal memuat riwayat sesi.';
          setError(msg);
          addToast({ type: 'error', title: 'Gagal memuat', message: msg });
        }
      })
      .catch(() => {
        const msg = 'Gagal memuat riwayat sesi.';
        setError(msg);
        addToast({ type: 'error', title: 'Gagal memuat', message: msg });
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [addToast, clientId, page, pageSize]);

  useEffect(() => {
    // prefer cached sessions if present (first page only)
    const cached = sessionsByClientId[clientId];
    if (cached && cached.length > 0 && page === 1) {
      setSessions(cached.slice(0, pageSize));
      setTotal(cached.length);
      setLoading(false);
      return () => {};
    }

    const cleanup = loadSessions();
    return cleanup;
  }, [loadSessions]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, SessionSummary[]> = {};
    for (const s of sessions) {
      const day = new Date(s.date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      groups[day] = groups[day] || [];
      groups[day].push(s);
    }
    return groups;
  }, [sessions]);

  const openDetails = (s: SessionSummary): void => {
    setSelected(s);
    setOpen(true);
  };

  const formatDateTime = (iso: string): string => {
    try {
      return new Date(iso).toLocaleString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Sesi</CardTitle>
        <CardDescription>Rangkuman sesi dan penilaian singkat</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="h-4 w-40 bg-muted rounded mb-2" />
                <div className="h-14 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-destructive">{error}</span>
            <Button size="sm" variant="outline" onClick={loadSessions}>Coba lagi</Button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-sm text-muted-foreground">Belum ada riwayat sesi untuk klien ini.</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([dateLabel, items]) => (
              <div key={dateLabel} className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{dateLabel}</div>
                <div className="space-y-2">
                  {items.map((s) => (
                    <div key={s.id} className="border rounded p-3 cursor-pointer hover:bg-muted/50" onClick={() => openDetails(s)}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
                          <span className="text-sm font-medium">{PHASE_LABEL[s.phase]}</span>
                          {s.durationMinutes ? (
                            <span className="text-xs text-muted-foreground">• {s.durationMinutes} menit</span>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground">{s.therapistName}</div>
                      </div>
                      {s.notes && (
                        <div className="mt-1 text-sm text-foreground">{s.notes}</div>
                      )}
                      {s.assessment && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Penilaian {s.assessment.tool}:{' '}
                          {typeof s.assessment.preScore === 'number' && (
                            <span>sebelum {s.assessment.preScore}{s.assessment.scoreUnit ? ` ${s.assessment.scoreUnit}` : ''}</span>
                          )}
                          {typeof s.assessment.postScore === 'number' && (
                            <span>
                              {typeof s.assessment.preScore === 'number' ? ', ' : ''}
                              sesudah {s.assessment.postScore}
                              {s.assessment.scoreUnit ? ` ${s.assessment.scoreUnit}` : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Halaman {page} dari {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Details Modal */}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Sesi</DialogTitle>
        </DialogHeader>
        {selected ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[selected.status]}>{selected.status}</Badge>
                <span className="font-medium">{PHASE_LABEL[selected.phase]}</span>
              </div>
              <div className="text-xs text-muted-foreground">{formatDateTime(selected.date)}</div>
            </div>
            <div className="text-xs text-muted-foreground">Therapist: {selected.therapistName ?? selected.therapistId}</div>
            {selected.durationMinutes ? (
              <div className="text-xs text-muted-foreground">Durasi: {selected.durationMinutes} menit</div>
            ) : null}
            {selected.notes ? (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Catatan</div>
                <div className="text-foreground whitespace-pre-wrap">{selected.notes}</div>
              </div>
            ) : null}
            {selected.assessment ? (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Penilaian {selected.assessment.tool}</div>
                <div className="text-foreground">
                  {typeof selected.assessment.preScore === 'number' ? (
                    <span>Sebelum: {selected.assessment.preScore}{selected.assessment.scoreUnit ? ` ${selected.assessment.scoreUnit}` : ''}</span>
                  ) : null}
                  {typeof selected.assessment.postScore === 'number' ? (
                    <span className="ml-3">Sesudah: {selected.assessment.postScore}{selected.assessment.scoreUnit ? ` ${selected.assessment.scoreUnit}` : ''}</span>
                  ) : null}
                  {typeof selected.assessment.preScore === 'number' && typeof selected.assessment.postScore === 'number' ? (
                    <span className="ml-3 text-xs text-muted-foreground">Δ {selected.assessment.postScore - selected.assessment.preScore}</span>
                  ) : null}
                </div>
                {selected.assessment.notes ? (
                  <div className="text-xs text-muted-foreground mt-1">{selected.assessment.notes}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SessionHistory;


