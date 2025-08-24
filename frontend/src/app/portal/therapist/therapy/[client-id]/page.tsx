'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { useTherapistClient } from '@/hooks/useTherapistClient';
import { ClientStatusLabels, ClientGenderEnum } from '@/types/enums';
import { ClientStatusColors } from '@/types/clientStatus';
import type { TherapistClient } from '@/types/therapistClient';
import {
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function ClientTherapyPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { clients, loading: clientsLoading, loadClients } = useTherapistClient();
  
  const clientId = params['client-id'] as string;
  const [client, setClient] = useState<TherapistClient | null>(null);
  const [loading, setLoading] = useState(true);

  // Load clients on mount if not already loaded
  useEffect(() => {
    if (clients.length === 0 && !clientsLoading) {
      loadClients();
    }
  }, [loadClients, clients.length, clientsLoading]);

  // Find the client from the clients list
  useEffect(() => {
    // Only proceed if we have user data and clients are not loading
    if (!user?.id || clientsLoading) {
      return;
    }

    // If clients data is available
    if (clients.length > 0) {
      const foundClient = clients.find(c => c.id === clientId);
      if (foundClient) {
        // TherapistClient data is already filtered for the current therapist
        setClient(foundClient);
        setLoading(false);
      } else {
        addToast({
          type: 'error',
          title: 'Klien Tidak Ditemukan',
          message: 'Data klien tidak ditemukan atau Anda tidak memiliki akses',
        });
        router.push('/portal/therapist/clients');
        return;
      }
    } else {
      // If clients array is empty but not loading, still set loading to false
      // This handles the case where there are no clients at all
      setLoading(false);
    }
  }, [clientId, clients, clientsLoading, user?.id, addToast, router]);

  const handleBackToClients = () => {
    router.push('/portal/therapist/clients');
  };

  const handleStartSession = () => {
    addToast({
      type: 'info',
      title: 'Fitur Sesi Terapi',
      message: 'Fitur memulai sesi terapi akan segera tersedia',
    });
  };

  const handleViewHistory = () => {
    addToast({
      type: 'info',
      title: 'Fitur Riwayat Sesi',
      message: 'Fitur riwayat sesi terapi akan segera tersedia',
    });
  };

  const handleViewNotes = () => {
    addToast({
      type: 'info',
      title: 'Fitur Catatan Terapi',
      message: 'Fitur catatan terapi akan segera tersedia',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (loading || clientsLoading) {
    return (
      <PageWrapper
        title="Terapi Klien"
        showBackButton
        onBackClick={handleBackToClients}
        backButtonLabel="Kembali ke Daftar Klien"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data klien...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!client) {
    return (
      <PageWrapper
        title="Terapi Klien"
        showBackButton
        onBackClick={handleBackToClients}
        backButtonLabel="Kembali ke Daftar Klien"
      >
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Klien Tidak Ditemukan</h3>
          <p className="text-gray-600">Data klien tidak tersedia atau Anda tidak memiliki akses.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Terapi - ${client.fullName}`}
      description="Kelola sesi terapi dan progres klien"
      showBackButton
      onBackClick={handleBackToClients}
      backButtonLabel="Kembali ke Daftar Klien"
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleViewHistory}
            className="flex items-center gap-2"
          >
            <ClockIcon className="w-4 h-4" />
            Riwayat Sesi
          </Button>
          <Button
            onClick={handleStartSession}
            className="flex items-center gap-2"
          >
            <HeartIcon className="w-4 h-4" />
            Mulai Sesi Baru
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={client.fullName} />
                  <AvatarFallback className="text-lg">
                    {getInitials(client.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{client.fullName}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={`bg-${ClientStatusColors[client.status]}-50 text-${ClientStatusColors[client.status]}-700 border-${ClientStatusColors[client.status]}-200`}>
                  {ClientStatusLabels[client.status]}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Usia:</span>
                  <span className="ml-auto font-medium">{formatAge(client.birthDate)} tahun</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">Jenis Kelamin:</span>
                  <span className="ml-auto font-medium">
                    {client.gender === ClientGenderEnum.Male ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Telepon:</span>
                  <span className="ml-auto font-medium">{client.phone}</span>
                </div>

                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-auto font-medium text-xs">{client.email}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Bergabung:</span>
                    <span className="ml-auto font-medium">
                      {new Date(client.joinDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Total Sesi:</span>
                    <span className="ml-auto font-medium">{client.sessionCount || client.totalSessions || 0}</span>
                  </div>

                  {(client.lastSessionDate || client.lastSession) && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">Sesi Terakhir:</span>
                      <span className="ml-auto font-medium">
                        {new Date(client.lastSessionDate || client.lastSession!).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Progres Terapi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tingkat Progres</span>
                    <span className="font-medium">{client.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${client.progress || 0}%` }}
                    />
                  </div>
                </div>
                {(client.progressNotes || client.notes) && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Catatan Progres:</label>
                    <p className="text-sm text-gray-800 mt-1 p-3 bg-gray-50 rounded-lg">
                      {client.progressNotes || client.notes}
                    </p>
                  </div>
                )}
                {client.therapistNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Catatan Therapist:</label>
                    <p className="text-sm text-gray-800 mt-1 p-3 bg-blue-50 rounded-lg">
                      {client.therapistNotes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5" />
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleStartSession}
                  className="flex items-center gap-2 h-12"
                >
                  <HeartIcon className="w-5 h-5" />
                  Mulai Sesi Terapi
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewNotes}
                  className="flex items-center gap-2 h-12"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  Catatan Terapi
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewHistory}
                  className="flex items-center gap-2 h-12"
                >
                  <ClockIcon className="w-5 h-5" />
                  Riwayat Sesi
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="flex items-center gap-2 h-12"
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Klien</CardTitle>
              <CardDescription>
                Informasi lengkap tentang klien
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tempat, Tanggal Lahir</label>
                    <p className="text-gray-900">
                      {client.birthPlace}, {new Date(client.birthDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Agama</label>
                    <p className="text-gray-900">{client.religion}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Pekerjaan</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                      {client.occupation}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Pendidikan</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                      {client.education}
                      {client.educationMajor && ` - ${client.educationMajor}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Alamat</label>
                    <p className="text-gray-900 flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{client.address}</span>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Provinsi</label>
                    <p className="text-gray-900">{client.province}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Hobi</label>
                    <p className="text-gray-900">{client.hobbies}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Status Pernikahan</label>
                    <p className="text-gray-900">{client.maritalStatus}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {client.emergencyContactName && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Kontak Darurat</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Nama:</span>
                        <span className="ml-2 font-medium">{client.emergencyContactName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hubungan:</span>
                        <span className="ml-2 font-medium">{client.emergencyContactRelationship}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Telepon:</span>
                        <span className="ml-2 font-medium">{client.emergencyContactPhone}</span>
                      </div>
                      {client.emergencyContactAddress && (
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Alamat:</span>
                          <span className="ml-2 font-medium">{client.emergencyContactAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Previous Visit Details */}
              {!client.firstVisit && client.previousVisitDetails && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Riwayat Kunjungan Sebelumnya</h4>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                      {client.previousVisitDetails}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}