'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTherapists } from '@/hooks/useTherapists';
import { Therapist, TherapistAssignment as TherapistAssignmentType } from '@/types/therapist';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  UserPlusIcon,
  UserMinusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface TherapistAssignmentProps {
  className?: string;
}

// Mock client data - in real app this would come from a useClients hook
const mockClients = [
  {
    id: 'client-001',
    name: 'Budi Santoso',
    email: 'budi@email.com',
    avatar: '/avatars/budi.jpg',
    registrationDate: '2023-11-01',
    status: 'active',
    assignedTherapist: 'therapist-001',
    lastSession: '2024-01-15',
    totalSessions: 8,
    issueCategory: 'anxiety-depression',
    preferredLanguage: 'id'
  },
  {
    id: 'client-002',
    name: 'Sari Dewi',
    email: 'sari@email.com',
    avatar: '/avatars/sari.jpg',
    registrationDate: '2023-11-15',
    status: 'active',
    assignedTherapist: 'therapist-001',
    lastSession: '2024-01-12',
    totalSessions: 6,
    issueCategory: 'stress-management',
    preferredLanguage: 'id'
  },
  {
    id: 'client-003',
    name: 'Ahmad Rahman',
    email: 'ahmad@email.com',
    registrationDate: '2023-12-01',
    status: 'unassigned',
    assignedTherapist: null,
    lastSession: null,
    totalSessions: 0,
    issueCategory: 'addiction-therapy',
    preferredLanguage: 'id'
  },
  {
    id: 'client-004',
    name: 'Maya Putri',
    email: 'maya@email.com',
    registrationDate: '2023-12-10',
    status: 'active',
    assignedTherapist: 'therapist-002',
    lastSession: '2024-01-10',
    totalSessions: 4,
    issueCategory: 'trauma-ptsd',
    preferredLanguage: 'en'
  },
  {
    id: 'client-005',
    name: 'Rina Kartini',
    email: 'rina@email.com',
    registrationDate: '2024-01-05',
    status: 'unassigned',
    assignedTherapist: null,
    lastSession: null,
    totalSessions: 0,
    issueCategory: 'child-adolescent',
    preferredLanguage: 'id'
  }
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getSpecializationLabel = (specId: string) => {
  const specializations: Record<string, string> = {
    'anxiety-depression': 'Kecemasan & Depresi',
    'addiction-therapy': 'Terapi Adiksi',
    'trauma-ptsd': 'Trauma & PTSD',
    'child-adolescent': 'Anak & Remaja',
    'stress-management': 'Manajemen Stres',
    'couples-family': 'Pasangan & Keluarga',
  };
  return specializations[specId] || specId;
};

const getClientStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { label: 'Aktif', color: 'green', icon: CheckCircleIcon };
    case 'unassigned':
      return { label: 'Belum Ditugaskan', color: 'yellow', icon: ExclamationTriangleIcon };
    case 'inactive':
      return { label: 'Tidak Aktif', color: 'gray', icon: XCircleIcon };
    default:
      return { label: status, color: 'gray', icon: ClockIcon };
  }
};

export const TherapistAssignment: React.FC<TherapistAssignmentProps> = ({ className = '' }) => {
  const { therapists, assignments, isLoading, error, assignTherapistToClient, unassignTherapistFromClient, getTherapistAssignments } = useTherapists();
  
  const [clients] = useState(mockClients); // In real app, this would use useClients hook
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignmentMode, setAssignmentMode] = useState<'assign' | 'reassign' | null>(null);

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get available therapists for assignment (not overloaded)
  const availableTherapists = therapists.filter(therapist => 
    therapist.status === 'active' && therapist.currentLoad < therapist.maxClients
  );

  // Get recommended therapists for a specific client based on specialization match
  const getRecommendedTherapists = (clientIssueCategory: string) => {
    return availableTherapists
      .filter(therapist => therapist.specializations.includes(clientIssueCategory))
      .sort((a, b) => {
        // Sort by current load (less loaded therapists first) and then by experience
        const loadDiff = a.currentLoad - b.currentLoad;
        if (Math.abs(loadDiff) < 2) {
          return b.yearsOfExperience - a.yearsOfExperience;
        }
        return loadDiff;
      });
  };

  const handleAssignTherapist = async () => {
    if (!selectedClient || !selectedTherapist) return;

    const success = await assignTherapistToClient(
      selectedTherapist,
      selectedClient,
      'admin-001', // In real app, this would be current user ID
      assignmentNotes || undefined
    );

    if (success) {
      // Update client status locally (in real app, this would be handled by useClients hook)
      setShowAssignmentForm(false);
      setSelectedClient(null);
      setSelectedTherapist(null);
      setAssignmentNotes('');
      setAssignmentMode(null);
    }
  };

  const handleUnassignTherapist = async (clientId: string, therapistId: string) => {
    const assignment = assignments.find(a => 
      a.clientId === clientId && a.therapistId === therapistId && a.status === 'active'
    );
    
    if (!assignment) return;

    const reason = prompt('Alasan membatalkan penugasan (opsional):');
    const success = await unassignTherapistFromClient(assignment.id, reason || undefined);

    if (success) {
      // Update client status locally
      console.log('Therapist unassigned successfully');
    }
  };

  const openAssignmentForm = (clientId: string, mode: 'assign' | 'reassign' = 'assign') => {
    setSelectedClient(clientId);
    setAssignmentMode(mode);
    setShowAssignmentForm(true);
    
    // Auto-select recommended therapist if available
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const recommended = getRecommendedTherapists(client.issueCategory);
      if (recommended.length > 0) {
        setSelectedTherapist(recommended[0]?.id || null);
      }
    }
  };

  const cancelAssignment = () => {
    setShowAssignmentForm(false);
    setSelectedClient(null);
    setSelectedTherapist(null);
    setAssignmentNotes('');
    setAssignmentMode(null);
  };

  const getTherapistById = (therapistId: string) => {
    return therapists.find(t => t.id === therapistId);
  };

  const getClientById = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  // Statistics
  const stats = {
    totalClients: clients.length,
    assignedClients: clients.filter(c => c.status === 'active').length,
    unassignedClients: clients.filter(c => c.status === 'unassigned').length,
    activeTherapists: therapists.filter(t => t.status === 'active').length,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <UserGroupIcon className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>Penugasan Therapist</CardTitle>
            <CardDescription>
              Kelola penugasan therapist ke klien berdasarkan spesialisasi dan beban kerja
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalClients}</p>
                <p className="text-xs text-blue-700">Total Klien</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.assignedClients}</p>
                <p className="text-xs text-green-700">Sudah Ditugaskan</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.unassignedClients}</p>
                <p className="text-xs text-yellow-700">Belum Ditugaskan</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <StarIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{stats.activeTherapists}</p>
                <p className="text-xs text-purple-700">Therapist Aktif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari klien berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Sudah Ditugaskan</SelectItem>
              <SelectItem value="unassigned">Belum Ditugaskan</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assignment Form Modal */}
        {showAssignmentForm && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {assignmentMode === 'assign' ? 'Tugaskan Therapist' : 'Ubah Therapist'}
              </h3>
              <Button variant="ghost" size="sm" onClick={cancelAssignment}>
                <XCircleIcon className="w-4 h-4" />
              </Button>
            </div>

            {selectedClient && (
              <div className="space-y-4">
                {/* Client Info */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-2">Klien:</h4>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getClientById(selectedClient)?.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(getClientById(selectedClient)?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getClientById(selectedClient)?.name}</p>
                      <p className="text-sm text-gray-600">
                        {getSpecializationLabel(getClientById(selectedClient)?.issueCategory || '')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Therapist Selection */}
                <div className="space-y-3">
                  <Label>Pilih Therapist *</Label>
                  
                  {/* Recommended Therapists */}
                  {selectedClient && getRecommendedTherapists(getClientById(selectedClient)?.issueCategory || '').length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-green-700">Therapist Direkomendasikan:</p>
                      <div className="space-y-2">
                        {getRecommendedTherapists(getClientById(selectedClient)?.issueCategory || '').slice(0, 3).map(therapist => (
                          <div
                            key={therapist.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedTherapist === therapist.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedTherapist(therapist.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={therapist.avatar} />
                                  <AvatarFallback className="bg-green-100 text-green-700">
                                    {getInitials(therapist.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{therapist.name}</p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <ClockIcon className="w-3 h-3" />
                                    <span>{therapist.yearsOfExperience} tahun</span>
                                    <span>•</span>
                                    <span>{therapist.currentLoad}/{therapist.maxClients} klien</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Direkomendasikan
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Available Therapists */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Semua Therapist Tersedia:</p>
                    <Select 
                      value={selectedTherapist || ''} 
                      onValueChange={setSelectedTherapist}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih therapist..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTherapists.map(therapist => (
                          <SelectItem key={therapist.id} value={therapist.id}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <p className="font-medium">{therapist.name}</p>
                                <p className="text-xs text-gray-500">
                                  {therapist.yearsOfExperience} tahun • {therapist.currentLoad}/{therapist.maxClients} klien
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Assignment Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Penugasan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tambahkan catatan khusus untuk penugasan ini..."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleAssignTherapist}
                    disabled={!selectedTherapist || isLoading}
                    className="flex-1"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-1" />
                    {isLoading ? 'Menugaskan...' : (assignmentMode === 'assign' ? 'Tugaskan Therapist' : 'Ubah Therapist')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelAssignment}
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Client List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Daftar Klien</h3>
            <p className="text-sm text-gray-500">
              {filteredClients.length} dari {clients.length} klien
            </p>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada klien yang sesuai dengan filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredClients.map(client => {
                const statusInfo = getClientStatusInfo(client.status);
                const StatusIcon = statusInfo.icon;
                const assignedTherapist = client.assignedTherapist ? getTherapistById(client.assignedTherapist) : null;
                
                return (
                  <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{client.name}</h4>
                            <Badge 
                              variant={statusInfo.color === 'green' ? 'default' : statusInfo.color === 'yellow' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>{getSpecializationLabel(client.issueCategory)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{client.totalSessions} sesi</span>
                            </div>
                          </div>

                          {/* Assigned Therapist Info */}
                          {assignedTherapist ? (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={assignedTherapist.avatar} />
                                    <AvatarFallback className="bg-green-100 text-green-700">
                                      {getInitials(assignedTherapist.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-green-900">
                                      {assignedTherapist.name}
                                    </p>
                                    <p className="text-xs text-green-700">
                                      {assignedTherapist.yearsOfExperience} tahun • 
                                      {assignedTherapist.currentLoad}/{assignedTherapist.maxClients} klien
                                    </p>
                                  </div>
                                </div>
                                <ArrowRightIcon className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                                <p className="text-sm text-yellow-800">
                                  Klien belum ditugaskan ke therapist
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        {client.status === 'unassigned' ? (
                          <Button
                            size="sm"
                            onClick={() => openAssignmentForm(client.id, 'assign')}
                            disabled={availableTherapists.length === 0}
                          >
                            <UserPlusIcon className="w-4 h-4 mr-1" />
                            Tugaskan
                          </Button>
                        ) : client.status === 'active' && assignedTherapist ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAssignmentForm(client.id, 'reassign')}
                              disabled={availableTherapists.length === 0}
                            >
                              <ArrowPathIcon className="w-4 h-4 mr-1" />
                              Ubah
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnassignTherapist(client.id, assignedTherapist.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserMinusIcon className="w-4 h-4 mr-1" />
                              Batalkan
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bulk Actions could go here in the future */}
        {stats.unassignedClients > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Ada {stats.unassignedClients} klien yang belum ditugaskan
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Pastikan semua klien mendapat therapist yang sesuai untuk pelayanan optimal
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};