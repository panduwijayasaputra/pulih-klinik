'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormModal } from '@/components/ui/form-modal';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { useTherapistClient } from '@/hooks/useTherapistClient';
import { ClientStatusLabels, ClientGenderEnum, ConsultationStatusEnum } from '@/types/enums';
import { ClientStatusColors } from '@/types/clientStatus';
import type { TherapistClient } from '@/types/therapistClient';
import { consultationSchema, type ConsultationFormData } from '@/schemas/consultationSchema';
import { getConsultationByClientId } from '@/lib/mocks/consultation';
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
  BriefcaseIcon,
  PencilIcon
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
  
  // Get consultation data for this client (one per client)
  const clientConsultation = getConsultationByClientId(clientId);
  
  // Consultation form state
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationSubmitting, setConsultationSubmitting] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(false);

  // Mock session data
  const mockSessions = [
    {
      id: '1',
      date: '2024-08-20',
      time: '14:00',
      duration: 90,
      type: 'Sesi Hipnoterapi',
      status: 'completed',
      notes: 'Sesi berjalan dengan baik. Klien merespons positif terhadap teknik relaksasi progresif.',
      techniques: ['Progressive Relaxation', 'Anchoring'],
      progress: 'Baik'
    },
    {
      id: '2',
      date: '2024-08-13',
      time: '10:30',
      duration: 60,
      type: 'Konsultasi',
      status: 'completed',
      notes: 'Assessment awal. Klien menunjukkan gejala kecemasan ringan terkait pekerjaan.',
      techniques: ['Assessment', 'Intake Interview'],
      progress: 'Assessment'
    },
    {
      id: '3',
      date: '2024-08-06',
      time: '15:00',
      duration: 75,
      type: 'Sesi Hipnoterapi',
      status: 'completed',
      notes: 'Sesi kedua. Klien mulai menunjukkan perbaikan dalam manajemen stres.',
      techniques: ['Direct Suggestion', 'Visualization'],
      progress: 'Sangat Baik'
    }
  ];

  // Initialize consultation form
  const consultationForm = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      clientId: clientId,
      therapistId: user?.id || '',
      formTypes: [],
      status: ConsultationStatusEnum.Draft,
      sessionDate: new Date().toISOString().split('T')[0] || '',
      sessionDuration: 60,
      previousTherapyExperience: false,
      currentMedications: false,
      previousPsychologicalDiagnosis: false,
      significantPhysicalIllness: false,
      traumaticExperience: false,
      familyPsychologicalHistory: false,
      symptomSeverity: 3,
      treatmentGoals: [],
      scriptGenerationPreferences: '',
    },
  });

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

  // Consultation form handlers
  const handleStartConsultation = useCallback(() => {
    setEditingConsultation(false);
    consultationForm.reset({
      clientId: clientId,
      therapistId: user?.id || '',
      formTypes: [],
      status: ConsultationStatusEnum.Draft,
      sessionDate: new Date().toISOString().split('T')[0] || '',
      sessionDuration: 60,
      previousTherapyExperience: false,
      currentMedications: false,
      previousPsychologicalDiagnosis: false,
      significantPhysicalIllness: false,
      traumaticExperience: false,
      familyPsychologicalHistory: false,
      symptomSeverity: 3,
      treatmentGoals: [],
      scriptGenerationPreferences: '',
    });
    setShowConsultationForm(true);
  }, [clientId, user?.id, consultationForm]);

  const handleEditConsultation = useCallback(() => {
    if (clientConsultation) {
      setEditingConsultation(true);
      consultationForm.reset(clientConsultation);
      setShowConsultationForm(true);
    }
  }, [clientConsultation, consultationForm]);

  const handleConsultationSubmit = useCallback(async (data: ConsultationFormData) => {
    setConsultationSubmitting(true);
    try {
      console.log('Consultation Data:', data);
      
      // TODO: Call API to save consultation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      addToast({
        type: 'success',
        title: 'Konsultasi Tersimpan',
        message: 'Data konsultasi berhasil disimpan.',
      });
      
      setShowConsultationForm(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal Menyimpan',
        message: 'Terjadi kesalahan saat menyimpan konsultasi.',
      });
    } finally {
      setConsultationSubmitting(false);
    }
  }, [addToast]);



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
      actions={[]}
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
        <div className="lg:col-span-2">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              <TabsTrigger value="consultation">Konsultasi</TabsTrigger>
              <TabsTrigger value="sessions">Sesi Terapi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-6">
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
              
              {/* Session History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    Riwayat Sesi Terapi
                  </CardTitle>
                  <CardDescription>
                    History sesi terapi dan konsultasi klien
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {session.type}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {new Date(session.date).toLocaleDateString('id-ID')} • {session.time}
                              </span>
                              <span className="text-sm text-gray-500">
                                {session.duration} menit
                              </span>
                            </div>
                            <p className="text-gray-900 mb-2">{session.notes}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Teknik:</span>
                                <span className="ml-1 font-medium">{session.techniques.join(', ')}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Progress:</span>
                                <span className="ml-1 font-medium">{session.progress}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Badge 
                              variant="outline" 
                              className={`${
                                session.progress === 'Sangat Baik' ? 'bg-green-50 text-green-700 border-green-200' :
                                session.progress === 'Baik' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {session.status === 'completed' ? 'Selesai' : 'Berlangsung'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {mockSessions.length === 0 && (
                      <div className="text-center py-8">
                        <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Belum ada riwayat sesi terapi</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="consultation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    Base Assessment Konsultasi
                  </CardTitle>
                  <CardDescription>
                    Assessment dasar untuk memulai terapi - satu per klien
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {clientConsultation ? (
                      <>
                        {/* Consultation Summary */}
                        <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                  {clientConsultation.formTypes.join(', ')} Assessment
                                </Badge>
                                <span className="text-sm text-gray-700 font-medium">
                                  📅 {new Date(clientConsultation.sessionDate).toLocaleDateString('id-ID')}
                                </span>
                                <span className="text-sm text-gray-600">
                                  ⏱️ {clientConsultation.sessionDuration} menit
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Base Assessment Summary</h3>
                              <p className="text-gray-700 mb-4">
                                Assessment ini digunakan sebagai dasar untuk semua sesi terapi selanjutnya.
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditConsultation}
                              className="flex items-center gap-2 bg-white"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </Button>
                          </div>

                          {/* Key Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Status</h6>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {clientConsultation.status}
                              </Badge>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Tingkat Keparahan</h6>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-600">{clientConsultation.symptomSeverity}</span>
                                <span className="text-sm text-gray-600">/5</span>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Durasi Gejala</h6>
                              <span className="font-medium text-gray-800">{clientConsultation.symptomDuration}</span>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Treatment Goals</h6>
                              <span className="font-medium text-gray-800">{clientConsultation.treatmentGoals?.length || 0} goals</span>
                            </div>
                          </div>

                          {/* Primary Concern */}
                          <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                            <h6 className="font-medium text-gray-900 mb-2">🎯 Keluhan Utama</h6>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {clientConsultation.primaryConcern}
                            </p>
                          </div>

                          {/* AI Script Preferences */}
                          {clientConsultation.scriptGenerationPreferences && (
                            <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                              <h6 className="font-medium text-gray-900 mb-2">🤖 AI Script Preferences</h6>
                              <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg">
                                {clientConsultation.scriptGenerationPreferences}
                              </p>
                            </div>
                          )}

                          {/* Therapist Notes */}
                          {clientConsultation.consultationNotes && (
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 mb-2">📝 Catatan Terapis</h6>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {clientConsultation.consultationNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Treatment Plan Summary */}
                        {clientConsultation.recommendedTreatmentPlan && (
                          <div className="border rounded-lg p-6 bg-green-50">
                            <h4 className="text-lg font-semibold text-green-900 mb-3">💡 Rencana Terapi</h4>
                            <p className="text-green-800 text-sm leading-relaxed">
                              {clientConsultation.recommendedTreatmentPlan}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* No Consultation - Call to Action */}
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Base Assessment</h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Base assessment diperlukan untuk memulai terapi. Assessment ini akan menjadi dasar untuk semua sesi terapi klien.
                          </p>
                          <div className="flex justify-center">
                            <Button 
                              onClick={handleStartConsultation}
                              className="flex items-center gap-2"
                              size="lg"
                            >
                              <DocumentTextIcon className="w-5 h-5" />
                              Buat Base Assessment
                            </Button>
                          </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800 mb-2">
                                Tentang Base Assessment
                              </h3>
                              <div className="text-sm text-blue-700 space-y-2">
                                <p>Base assessment adalah fondasi terapi yang berisi:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Analisis mendalam kondisi klien</li>
                                  <li>Riwayat kesehatan mental dan fisik</li>
                                  <li>Tujuan terapi yang ingin dicapai</li>
                                  <li>Preferensi untuk personalisasi AI script</li>
                                  <li>Rencana treatment yang direkomendasikan</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    Sesi Terapi
                  </CardTitle>
                  <CardDescription>
                    Kelola sesi terapi dan riwayat treatment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Riwayat Sesi Terapi</h3>
                    <p className="text-gray-600 mb-4">Belum ada sesi terapi yang tercatat untuk klien ini</p>
                    <Button disabled className="flex items-center gap-2">
                      <HeartIcon className="w-4 h-4" />
                      Mulai Sesi Terapi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Consultation Form Modal */}
      <FormModal
        open={showConsultationForm}
        onOpenChange={setShowConsultationForm}
        title={editingConsultation ? "Edit Base Assessment" : "Buat Base Assessment"}
        description={editingConsultation 
          ? `Edit assessment dasar untuk ${client?.fullName || 'klien'}` 
          : `Buat assessment dasar untuk ${client?.fullName || 'klien'}`
        }
        size="5xl"
        showCloseButton={false}
      >
        <ConsultationForm
          form={consultationForm as any} // Type conversion for compatibility
          onSubmit={handleConsultationSubmit}
          isSubmitting={consultationSubmitting}
          isLoading={false}
          mode={editingConsultation ? "edit" : "create"}
          allowTypeChange={!editingConsultation} // Don't allow type change when editing
          client={client as any} // Type conversion for compatibility
          readOnly={false}
          onCancel={() => setShowConsultationForm(false)}
        />
      </FormModal>
    </PageWrapper>
  );
}