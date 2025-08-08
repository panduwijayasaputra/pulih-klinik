'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useTherapist } from '@/hooks/useTherapist';

interface Therapist {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: 'active' | 'pending' | 'inactive';
  sessions_completed: number;
  client_satisfaction: number;
}

export const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    specialization: ''
  });
  
  const { getTherapists, updateTherapistStatus, updateTherapist, loading: actionLoading, error } = useTherapist();

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      const result = await getTherapists();
      if (result.success && result.therapists) {
        setTherapists(result.therapists);
      }
    } catch (error) {
      console.error('Failed to load therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (therapistId: string, newStatus: 'active' | 'inactive') => {
    try {
      const result = await updateTherapistStatus(therapistId, newStatus);
      if (result.success) {
        // Update local state
        setTherapists(prev => prev.map(th => 
          th.id === therapistId ? { ...th, status: newStatus } : th
        ));
        alert(result.message);
      }
    } catch (error) {
      alert('Gagal mengubah status therapist');
    }
  };

  const handleEditTherapist = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    setEditForm({
      name: therapist.name,
      email: therapist.email,
      specialization: therapist.specialization
    });
  };

  const handleUpdateTherapist = async () => {
    if (!editingTherapist) return;

    try {
      const result = await updateTherapist(editingTherapist.id, editForm);
      if (result.success) {
        // Update local state
        setTherapists(prev => prev.map(th => 
          th.id === editingTherapist.id 
            ? { ...th, ...editForm }
            : th
        ));
        setEditingTherapist(null);
        alert(result.message);
      }
    } catch (error) {
      alert('Gagal memperbarui data therapist');
    }
  };

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'PTSD (Post-Traumatic Stress Disorder)',
    'Phobias',
    'Addiction',
    'Stress Management',
    'Self-Esteem Issues',
    'Relationship Problems',
    'Grief and Loss',
    'Sleep Disorders',
    'Performance Enhancement',
    'Pain Management',
    'Weight Management',
    'Smoking Cessation',
    'Other'
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Nonaktif</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Tidak Diketahui</Badge>;
    }
  };

  const getSatisfactionStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Memuat data therapist...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daftar Therapist</h2>
          <p className="text-gray-600">Kelola therapist di klinik Anda</p>
        </div>
        <Button className="flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Therapist
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Therapist</p>
                <p className="text-2xl font-bold text-gray-900">{therapists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {therapists.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {therapists.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {therapists.length > 0 
                    ? (therapists.reduce((sum, t) => sum + t.client_satisfaction, 0) / therapists.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Therapist List */}
      <div className="space-y-4">
        {therapists.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada therapist
              </h3>
              <p className="text-gray-600 mb-4">
                Mulai dengan menambahkan therapist pertama ke klinik Anda.
              </p>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Tambah Therapist Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          therapists.map((therapist) => (
            <Card key={therapist.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {therapist.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(therapist.status)}
                          <span className="text-sm text-gray-500">
                            {therapist.specialization}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          {therapist.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <AcademicCapIcon className="w-4 h-4 mr-2" />
                          {therapist.specialization}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <ChartBarIcon className="w-4 h-4 mr-2" />
                          {therapist.sessions_completed} sesi selesai
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="w-4 h-4 mr-2" />
                          <div className="flex items-center">
                            {getSatisfactionStars(therapist.client_satisfaction)}
                            <span className="ml-1">({therapist.client_satisfaction})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {therapist.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(therapist.id, 'active')}
                          disabled={actionLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Aktifkan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(therapist.id, 'inactive')}
                          disabled={actionLoading}
                        >
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Tolak
                        </Button>
                      </>
                    )}
                    
                    {therapist.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(therapist.id, 'inactive')}
                        disabled={actionLoading}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Nonaktifkan
                      </Button>
                    )}
                    
                    {therapist.status === 'inactive' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(therapist.id, 'active')}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Aktifkan
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTherapist(therapist)}
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTherapist(therapist)}
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Therapist Detail Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detail Therapist</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTherapist(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedTherapist.name}</h3>
                  <p className="text-gray-600">{selectedTherapist.email}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Statistik Performa:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Sesi Selesai</p>
                      <p className="text-lg font-semibold">{selectedTherapist.sessions_completed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating Klien</p>
                      <div className="flex items-center">
                        {getSatisfactionStars(selectedTherapist.client_satisfaction)}
                        <span className="ml-2 font-semibold">({selectedTherapist.client_satisfaction})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Therapist Modal */}
      {editingTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit Therapist</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTherapist(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nama Lengkap</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama therapist"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-specialization">Spesialisasi</Label>
                  <select
                    id="edit-specialization"
                    value={editForm.specialization}
                    onChange={(e) => setEditForm(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih Spesialisasi</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTherapist(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleUpdateTherapist}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};