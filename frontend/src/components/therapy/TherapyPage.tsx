'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsultationFormModal } from '@/components/consultation/ConsultationFormModal';

import { Client } from '@/types/client';
import { Consultation, ConsultationFormTypeEnum } from '@/types/consultation';
import { useAuth } from '@/hooks/useAuth';
import { useConsultationData } from '@/hooks/useConsultation';
import { useToast } from '@/components/ui/toast';

import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  HeartIcon,
  PlayIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export interface TherapyPageProps {
  client: Client;
  onNavigateBack?: () => void;
}

export const TherapyPage: React.FC<TherapyPageProps> = ({
  client,
  onNavigateBack,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { consultations, loadConsultations } = useConsultationData();
  
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [consultationMode, setConsultationMode] = useState<'create' | 'edit'>('create');

  // Get consultations for this client
  const clientConsultations = useMemo(() => {
    return consultations.filter((consultation: Consultation) => consultation.clientId === client.id);
  }, [consultations, client.id]);

  // Get latest consultation
  const latestConsultation = useMemo(() => {
    if (clientConsultations.length === 0) return null;
    return clientConsultations.sort((a: Consultation, b: Consultation) => 
      new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
    )[0];
  }, [clientConsultations]);

  // Handle navigation back
  const handleNavigateBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      router.push('/portal/therapist/clients');
    }
  };

  // Handle new consultation
  const handleNewConsultation = () => {
    setSelectedConsultation(null);
    setConsultationMode('create');
    setShowConsultationModal(true);
  };

  // Handle view consultation
  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setConsultationMode('edit');
    setShowConsultationModal(true);
  };

  // Handle consultation success
  const handleConsultationSuccess = (consultation: Consultation) => {
    addToast({
      type: 'success',
      title: 'Konsultasi Berhasil',
      message: consultationMode === 'create' ? 'Konsultasi baru telah dibuat' : 'Konsultasi telah diperbarui',
    });
    setShowConsultationModal(false);
    setSelectedConsultation(null);
    loadConsultations(); // Refresh consultations
  };

  // Handle consultation cancel
  const handleConsultationCancel = () => {
    setShowConsultationModal(false);
    setSelectedConsultation(null);
  };

  // Calculate therapy progress
  const therapyProgress = useMemo(() => {
    return {
      totalConsultations: clientConsultations.length,
      completedConsultations: clientConsultations.filter((c: Consultation) => c.status === 'completed').length,
      draftConsultations: clientConsultations.filter((c: Consultation) => c.status === 'draft').length,
      progressPercentage: client.progress,
    };
  }, [clientConsultations, client.progress]);

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleNavigateBack}
            className="flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Kembali ke Daftar Klien
          </Button>
          
          <div className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <h1 className="text-xl font-semibold text-gray-900">
              {client.fullName || client.name}
            </h1>
            <Badge variant="outline" className="ml-2">
              {client.status}
            </Badge>
          </div>
        </div>

        <Button onClick={handleNewConsultation} className="flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />
          Konsultasi Baru
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sesi</p>
                <p className="text-2xl font-bold text-blue-600">{client.totalSessions}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-green-600">{client.progress}%</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Konsultasi</p>
                <p className="text-2xl font-bold text-purple-600">{therapyProgress.totalConsultations}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bergabung</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(client.joinDate).toLocaleDateString('id-ID')}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultations">Konsultasi</TabsTrigger>
          <TabsTrigger value="therapy-plan">Rencana Terapi</TabsTrigger>
          <TabsTrigger value="sessions">Riwayat Sesi</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Informasi Klien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{client.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Telepon:</span>
                    <p className="text-gray-900">{client.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Jenis Kelamin:</span>
                    <p className="text-gray-900">{client.gender}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Umur:</span>
                    <p className="text-gray-900">
                      {client.birthDate ? 
                        Math.floor((Date.now() - new Date(client.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) 
                        : '-'} tahun
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Pekerjaan:</span>
                    <p className="text-gray-900">{client.occupation}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Pendidikan:</span>
                    <p className="text-gray-900">{client.education}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest Consultation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Konsultasi Terakhir
                  </div>
                  {latestConsultation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewConsultation(latestConsultation)}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestConsultation ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Tanggal:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(latestConsultation.sessionDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Jenis:</span>
                      <Badge variant="outline">{latestConsultation.formType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge variant={latestConsultation.status === 'completed' ? 'default' : 'secondary'}>
                        {latestConsultation.status}
                      </Badge>
                    </div>
                    {latestConsultation.primaryConcern && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Keluhan Utama:</span>
                        <p className="text-sm text-gray-900 mt-1 line-clamp-2">
                          {latestConsultation.primaryConcern}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Belum ada konsultasi</p>
                    <Button onClick={handleNewConsultation} size="sm">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Buat Konsultasi Pertama
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Progress Terapi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Progress Keseluruhan</span>
                  <span className="font-medium text-gray-900">{client.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{therapyProgress.totalConsultations}</p>
                    <p className="text-xs text-gray-600">Total Konsultasi</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{therapyProgress.completedConsultations}</p>
                    <p className="text-xs text-gray-600">Selesai</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-600">{therapyProgress.draftConsultations}</p>
                    <p className="text-xs text-gray-600">Draft</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Riwayat Konsultasi</h3>
            <Button onClick={handleNewConsultation}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Konsultasi Baru
            </Button>
          </div>

          {clientConsultations.length > 0 ? (
            <div className="grid gap-4">
              {clientConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{consultation.formType}</Badge>
                          <Badge variant={consultation.status === 'completed' ? 'default' : 'secondary'}>
                            {consultation.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(consultation.sessionDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {consultation.primaryConcern && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {consultation.primaryConcern}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewConsultation(consultation)}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Konsultasi</h3>
                <p className="text-gray-600 mb-4">
                  Mulai proses terapi dengan membuat konsultasi pertama untuk klien ini.
                </p>
                <Button onClick={handleNewConsultation}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Buat Konsultasi Pertama
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Therapy Plan Tab */}
        <TabsContent value="therapy-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HeartIcon className="w-5 h-5 mr-2" />
                Rencana Terapi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Rencana Terapi</h3>
                <p className="text-gray-600 mb-4">
                  Fitur rencana terapi akan segera tersedia. Di sini akan ditampilkan:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 max-w-md mx-auto">
                  <li>• Analisis kondisi mental klien</li>
                  <li>• Rekomendasi teknik terapi yang sesuai</li>
                  <li>• Rencana sesi terapi jangka panjang</li>
                  <li>• Target pencapaian dan milestone</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Riwayat Sesi Terapi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Riwayat Sesi</h3>
                <p className="text-gray-600 mb-4">
                  Fitur riwayat sesi akan segera tersedia. Di sini akan ditampilkan:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 max-w-md mx-auto">
                  <li>• Jadwal sesi terapi</li>
                  <li>• Catatan hasil setiap sesi</li>
                  <li>• Progress dan evaluasi</li>
                  <li>• Dokumentasi audio/video (jika ada)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Consultation Modal */}
      {showConsultationModal && user && (
        <ConsultationFormModal
          open={showConsultationModal}
          onOpenChange={setShowConsultationModal}
          clientId={client.id}
          therapistId={user.id}
          formType={ConsultationFormTypeEnum.General}
          mode={consultationMode}
          consultation={selectedConsultation || undefined}
          onSuccess={handleConsultationSuccess}
          onCancel={handleConsultationCancel}
        />
      )}
    </div>
  );
};

export default TherapyPage;