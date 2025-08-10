'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/client';
import { ClientStatusEnum } from '@/types/enums';
import { AssignTherapistModal } from './AssignTherapistModal';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';

export interface ClientDetailsProps {
  client: Client;
  onUpdate: (updates: Partial<Client>) => Promise<void> | void;
  onAssignTherapist?: () => void;
  onAssign?: (therapistId: string) => Promise<void> | void;
  onArchiveToggle?: () => Promise<void> | void;
  onUnassign?: () => Promise<void> | void;
  isSaving?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  [ClientStatusEnum.Active]: 'Aktif',
  [ClientStatusEnum.Inactive]: 'Tidak Aktif',
  [ClientStatusEnum.Completed]: 'Selesai',
  [ClientStatusEnum.Pending]: 'Menunggu',
};

export const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  onUpdate,
  onAssignTherapist,
  onAssign,
  onArchiveToggle,
  onUnassign,
  isSaving = false,
}) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState<string>(client.notes ?? '');
  const [status, setStatus] = useState<Client['status']>(client.status);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showAssign, setShowAssign] = useState<boolean>(false);

  const isArchived = useMemo(() => client.status === ClientStatusEnum.Inactive, [client.status]);

  const handleSave = async (): Promise<void> => {
    await onUpdate({ notes, status });
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setNotes(client.notes ?? '');
    setStatus(client.status);
    setIsEditing(false);
  };

  const handleArchiveToggle = async (): Promise<void> => {
    if (onArchiveToggle) {
      await onArchiveToggle();
    } else {
      // Fallback: toggle between inactive and active via onUpdate
      const nextStatus = client.status === ClientStatusEnum.Inactive ? ClientStatusEnum.Active : ClientStatusEnum.Inactive;
      await onUpdate({ status: nextStatus });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informasi Klien</CardTitle>
            <CardDescription>Data umum dan kontak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Nama</label>
                <Input value={client.name} readOnly />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">ID Klien</label>
                <Input value={client.id} readOnly />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Telepon</label>
                <Input value={client.phone} readOnly />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Email</label>
                <Input value={client.email} readOnly />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Pekerjaan</label>
                <Input value={client.occupation} readOnly />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Pendidikan</label>
                <Input value={client.education} readOnly />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <Badge variant={client.status === ClientStatusEnum.Active ? 'success' : client.status === ClientStatusEnum.Completed ? 'outline' : client.status === ClientStatusEnum.Pending ? 'warning' : 'destructive'}>
                    {STATUS_LABEL[client.status] ?? client.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Bergabung</label>
                <Input value={new Date(client.joinDate).toLocaleDateString('id-ID')} readOnly />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Alamat</label>
              <Textarea value={client.address} readOnly rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Statistik</CardTitle>
            <CardDescription>Ringkasan aktivitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded bg-muted">
                <div className="text-xs text-muted-foreground">Total Sesi</div>
                <div className="text-lg font-semibold">{client.totalSessions}</div>
              </div>
              <div className="p-3 rounded bg-muted">
                <div className="text-xs text-muted-foreground">Sesi Terakhir</div>
                <div className="text-lg font-semibold">{client.lastSession ? new Date(client.lastSession).toLocaleDateString('id-ID') : '-'}</div>
              </div>
              <div className="p-3 rounded bg-muted">
                <div className="text-xs text-muted-foreground">Isu Utama</div>
                <div className="text-lg font-semibold">{client.primaryIssue}</div>
              </div>
              <div className="p-3 rounded bg-muted">
                <div className="text-xs text-muted-foreground">Progress</div>
                <div className="text-lg font-semibold">{client.progress}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Editable */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Catatan & Status</CardTitle>
            <CardDescription>Update status klien dan catatan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Status</label>
              {isEditing ? (
                <Select value={status} onValueChange={(v) => setStatus(v as Client['status'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientStatusEnum).map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant={client.status === ClientStatusEnum.Active ? 'success' : client.status === ClientStatusEnum.Completed ? 'outline' : client.status === ClientStatusEnum.Pending ? 'warning' : 'destructive'}>
                    {STATUS_LABEL[client.status] ?? client.status}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Catatan</label>
              {isEditing ? (
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} />
              ) : (
                <Textarea value={client.notes ?? '-'} readOnly rows={6} />
              )}
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    Edit
                  </Button>
                  <Button onClick={handleArchiveToggle} variant={isArchived ? 'secondary' : 'destructive'} size="sm">
                    {isArchived ? 'Unarchive' : 'Archive'}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave} disabled={isSaving} size="sm">
                    Simpan
                  </Button>
                  <Button onClick={handleCancel} variant="outline" disabled={isSaving} size="sm">
                    Batal
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Penugasan Therapist</CardTitle>
            <CardDescription>Assign atau ubah therapist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Therapist Saat Ini</label>
              <Input value={client.assignedTherapist ?? '-'} readOnly />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAssign(true)} size="sm">
                {client.assignedTherapist ? 'Ubah Therapist' : 'Assign Therapist'}
              </Button>
              {client.assignedTherapist && (
                <Button onClick={() => onUnassign ? onUnassign() : onUpdate({ assignedTherapist: undefined, status: ClientStatusEnum.Pending })} variant="outline" size="sm">
                  Hapus Penugasan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Therapist Modal */}
      <AssignTherapistModal
        open={showAssign}
        onOpenChange={setShowAssign}
        clientId={client.id}
        onAssigned={async (therapistId) => {
          try {
            if (onAssign) {
              await onAssign(therapistId);
            } else {
              await onUpdate({ assignedTherapist: therapistId, status: ClientStatusEnum.Active });
            }
            // Audit log (console only for now)
            console.info('[Audit] assignClient', {
              adminId: user?.id ?? 'unknown',
              therapistId,
              clientId: client.id,
              timestamp: new Date().toISOString(),
            });
            addToast({ type: 'success', title: 'Penugasan berhasil', message: 'Klien telah ditugaskan ke therapist.' });
          } catch (err) {
            addToast({ type: 'error', title: 'Gagal menugaskan', message: err instanceof Error ? err.message : 'Terjadi kesalahan' });
            throw err;
          }
        }}
      />
    </div>
  );
};

export default ClientDetails;


