'use client';

import { useState } from 'react';
import { Client } from '@/types/client';
import { Therapist } from '@/types/therapist';
import { useClients } from '@/hooks/useClients';
import { useTherapists } from '@/hooks/useTherapists';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  ArrowRight, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ClientAssignmentProps {
  clients: Client[];
  onAssignmentChange: () => void;
}

interface AssignmentAction {
  type: 'assign' | 'reassign' | 'unassign';
  client: Client;
  fromTherapist?: Therapist | undefined;
  toTherapist?: Therapist | undefined;
}

export function ClientAssignment({ clients, onAssignmentChange }: ClientAssignmentProps) {
  const { assignTherapist, unassignTherapist } = useClients();
  const { therapists } = useTherapists();
  const [selectedAction, setSelectedAction] = useState<AssignmentAction | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Group clients by assignment status
  const unassignedClients = clients.filter(client => !client.assignedTherapist && client.status === 'pending');
  const assignedClients = clients.filter(client => client.assignedTherapist);

  const handleAssignClick = (client: Client) => {
    setSelectedAction({
      type: 'assign',
      client
    });
    setShowAssignModal(true);
  };

  const handleReassignClick = (client: Client) => {
    const currentTherapist = therapists.find(t => t.id === client.assignedTherapist);
    setSelectedAction({
      type: 'reassign',
      client,
      fromTherapist: currentTherapist
    });
    setShowAssignModal(true);
  };

  const handleUnassignClick = (client: Client) => {
    const currentTherapist = therapists.find(t => t.id === client.assignedTherapist);
    setSelectedAction({
      type: 'unassign',
      client,
      fromTherapist: currentTherapist
    });
    setShowAssignModal(true);
  };

  const handleAssignmentSubmit = async (therapistId?: string) => {
    if (!selectedAction) return;

    setLoading(true);
    try {
      if (selectedAction.type === 'unassign') {
        await unassignTherapist(selectedAction.client.id);
      } else if (therapistId) {
        await assignTherapist(selectedAction.client.id, therapistId);
      }

      onAssignmentChange();
      setShowAssignModal(false);
      setSelectedAction(null);
      setAssignmentNotes('');
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClientStatusBadge = (client: Client) => {
    const statusConfig = {
      active: { label: 'Aktif', variant: 'success' as const, icon: CheckCircle },
      inactive: { label: 'Tidak Aktif', variant: 'secondary' as const, icon: XCircle },
      completed: { label: 'Selesai', variant: 'default' as const, icon: CheckCircle },
      pending: { label: 'Menunggu', variant: 'warning' as const, icon: Clock }
    };
    
    const config = statusConfig[client.status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTherapistWorkload = (therapistId: string) => {
    return assignedClients.filter(client => client.assignedTherapist === therapistId).length;
  };

  const getTherapistWorkloadColor = (workload: number) => {
    if (workload >= 15) return 'text-red-600 bg-red-50';
    if (workload >= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Statistik Penugasan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
              <div className="text-sm text-blue-800">Total Klien</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{unassignedClients.length}</div>
              <div className="text-sm text-yellow-800">Belum Ditugaskan</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{assignedClients.length}</div>
              <div className="text-sm text-green-800">Sudah Ditugaskan</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{therapists.length}</div>
              <div className="text-sm text-purple-800">Total Terapis</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapist Workload Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Beban Kerja Terapis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {therapists.map((therapist) => {
              const workload = getTherapistWorkload(therapist.id);
              return (
                <div key={therapist.id} className={`p-4 rounded-lg border ${getTherapistWorkloadColor(workload)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        {therapist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Avatar>
                      <div>
                        <p className="font-medium">{therapist.name}</p>
                        <p className="text-sm opacity-80">{therapist.specializations.join(', ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{workload}</div>
                      <div className="text-xs opacity-80">klien</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Clients */}
      {unassignedClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Klien Belum Ditugaskan ({unassignedClients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unassignedClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 bg-gray-200">
                      {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.primaryIssue}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getClientStatusBadge(client)}
                        <Badge variant="outline">{client.id}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={() => handleAssignClick(client)} size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Tugaskan
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Clients by Therapist */}
      <div className="space-y-4">
        {therapists.map((therapist) => {
          const therapistClients = assignedClients.filter(client => client.assignedTherapist === therapist.id);
          
          if (therapistClients.length === 0) return null;
          
          return (
            <Card key={therapist.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      {therapist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    <div>
                      <span>{therapist.name}</span>
                      <p className="text-sm text-gray-600 font-normal">{therapist.specializations.join(', ')}</p>
                    </div>
                  </div>
                  
                  <Badge variant="outline">
                    {therapistClients.length} klien
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {therapistClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 bg-primary text-primary-foreground text-sm">
                          {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </Avatar>
                        
                        <div>
                          <h5 className="font-medium">{client.name}</h5>
                          <p className="text-sm text-gray-600">{client.primaryIssue}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getClientStatusBadge(client)}
                            <span className="text-xs text-gray-500">
                              {client.totalSessions} sesi • {client.progress}% progress
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReassignClick(client)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnassignClick(client)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Assignment Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAction?.type === 'assign' && 'Tugaskan Klien'}
              {selectedAction?.type === 'reassign' && 'Pindah Tugas Klien'}
              {selectedAction?.type === 'unassign' && 'Batalkan Penugasan'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAction && (
            <div className="space-y-4">
              {/* Client Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                    {selectedAction.client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedAction.client.name}</h4>
                    <p className="text-sm text-gray-600">{selectedAction.client.primaryIssue}</p>
                  </div>
                </div>
              </div>

              {/* Current Assignment Info */}
              {selectedAction.fromTherapist && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Terapis saat ini:</span> {selectedAction.fromTherapist.name}
                </div>
              )}

              {/* Action-specific content */}
              {selectedAction.type === 'unassign' ? (
                <div className="text-sm text-gray-600">
                  Yakin ingin membatalkan penugasan klien ini?
                </div>
              ) : (
                <div>
                  <Label htmlFor="therapist-select">Pilih Terapis</Label>
                  <Select
                    value={selectedAction.toTherapist?.id || ''}
                    onValueChange={(value) => setSelectedAction({
                      ...selectedAction,
                      toTherapist: therapists.find(t => t.id === value)
                    })}
                  >
                    <option value="">Pilih terapis...</option>
                    {therapists
                      .filter(t => t.id !== selectedAction.client.assignedTherapist)
                      .map((therapist) => (
                        <option key={therapist.id} value={therapist.id}>
                          {therapist.name} ({getTherapistWorkload(therapist.id)} klien)
                        </option>
                      ))}
                  </Select>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label htmlFor="assignment-notes">Catatan (opsional)</Label>
                <Textarea
                  id="assignment-notes"
                  placeholder="Tambahkan catatan tentang penugasan ini..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                  Batal
                </Button>
                <Button
                  onClick={() => handleAssignmentSubmit(selectedAction.toTherapist?.id)}
                  disabled={loading || (selectedAction.type !== 'unassign' && !selectedAction.toTherapist)}
                >
                  {loading ? 'Memproses...' : 'Konfirmasi'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}