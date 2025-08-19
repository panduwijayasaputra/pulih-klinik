'use client';

import React, { useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';
import { ConsultationSummary } from '@/components/therapy/ConsultationSummary';

import { Client } from '@/types/client';
import { Consultation, ConsultationFormTypeEnum } from '@/types/consultation';
import { ClientGenderLabels } from '@/types/enums';
import { useAuth } from '@/hooks/useAuth';
import { useConsultation } from '@/store/consultation';
import { useConsultationForm } from '@/hooks/useConsultation';
import { ConsultationAPI } from '@/lib/api/consultation';
import { ConsultationSummaryData } from '@/types/therapy';
import { useToast } from '@/components/ui/toast';
import { getClientSessions } from '@/lib/api/mockData';
import { accessibilityUtils, ACCESSIBILITY_CONSTANTS } from '@/lib/accessibility-utils';

import {
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CheckCircleIcon,
  ClockIcon as ClockIconSolid,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export interface TherapyPageProps {
  client: Client;
}

export const TherapyPage: React.FC<TherapyPageProps> = ({
  client,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { getConsultationsByClient, loadConsultations } = useConsultation();
  const [activeTab, setActiveTab] = React.useState('summary');
  const [consultationSummaryData, setConsultationSummaryData] = React.useState<ConsultationSummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = React.useState(false);
  const [summaryError, setSummaryError] = React.useState<string | null>(null);

  // Get the single consultation for this client (1 client = 1 consultation)
  const clientConsultation = useMemo(() => {
    const consultations = getConsultationsByClient(client.id);
    return consultations.length > 0 ? consultations[0] : null;
  }, [getConsultationsByClient, client.id]);

  // Load consultation summary data
  const loadConsultationSummary = useCallback(async (consultationId: string) => {
    setSummaryLoading(true);
    setSummaryError(null);
    
    try {
      const response = await ConsultationAPI.getConsultationSummary(consultationId);
      if (response.success && response.data) {
        setConsultationSummaryData(response.data);
      } else {
        setSummaryError(response.message || 'Failed to load consultation summary');
      }
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Failed to load consultation summary');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Load consultations when component mounts
  useEffect(() => {
    if (client.id) {
      loadConsultations(client.id, true); // Force reload to ensure fresh data
    }
  }, [client.id, loadConsultations]);

  // Load consultation summary when consultation data is available
  useEffect(() => {
    if (clientConsultation?.id) {
      loadConsultationSummary(clientConsultation.id);
    }
  }, [clientConsultation?.id, loadConsultationSummary]);

  // Get client sessions from mock data
  const clientSessions = useMemo(() => {
    return getClientSessions(client.id);
  }, [client.id]);

  // Initialize consultation form
  const {
    form,
    handleSubmit,
    handleSave,
    isSubmitting,
    isLoading,
  } = useConsultationForm(ConsultationFormTypeEnum.General, clientConsultation || undefined);

  // Set form values when component mounts or consultation changes
  useEffect(() => {
    if (!clientConsultation && user) {
      // Set default values for new consultation
      form.setValue('clientId', client.id);
      form.setValue('therapistId', user.id);
      form.setValue('sessionDate', new Date().toISOString().slice(0, 16));
    }
  }, [clientConsultation, form, client.id, user]);

  // Wrapper functions for form handling
  const handleFormSubmit = useCallback(async (data: any) => {
    try {
      await handleSubmit(data);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: clientConsultation ? 'Konsultasi berhasil diperbarui' : 'Konsultasi berhasil dibuat'
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [handleSubmit, clientConsultation, addToast]);

  const handleFormSave = useCallback(async (status?: any) => {
    try {
      await handleSave(status);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil disimpan'
      });
    } catch (error) {
      console.error('Form save error:', error);
    }
  }, [handleSave, addToast]);

  // Calculate therapy progress
  const therapyProgress = useMemo(() => {
    const consultations = getConsultationsByClient(client.id);
    return {
      totalConsultations: consultations.length,
      completedConsultations: consultations.filter((c: Consultation) => c.status === 'completed').length,
      draftConsultations: consultations.filter((c: Consultation) => c.status === 'draft').length,
      progressPercentage: client.progress,
    };
  }, [getConsultationsByClient, client.id, client.progress]);

  // Helper function to calculate age from birthDate
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" aria-label="Navigasi Tab Terapi">
        <TabsList 
          className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:flex lg:space-x-1"
          role={ACCESSIBILITY_CONSTANTS.ROLES.TABLIST}
          aria-label="Tab navigasi terapi"
        >
          <TabsTrigger 
            value="summary" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            role={ACCESSIBILITY_CONSTANTS.ROLES.TAB}
            aria-controls="summary-panel"
            aria-selected={activeTab === 'summary'}
            aria-label="Tab ringkasan terapi"
          >
            <ChartBarIcon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Ringkasan</span>
            <span className="sm:hidden">Ringkasan</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ai-summary" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            role={ACCESSIBILITY_CONSTANTS.ROLES.TAB}
            aria-controls="ai-summary-panel"
            aria-selected={activeTab === 'ai-summary'}
            aria-label="Tab ringkasan AI"
          >
            <DocumentTextIcon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="hidden sm:inline">AI Summary</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger 
            value="consultation" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            role={ACCESSIBILITY_CONSTANTS.ROLES.TAB}
            aria-controls="consultation-panel"
            aria-selected={activeTab === 'consultation'}
            aria-label="Tab konsultasi"
          >
            <ChatBubbleLeftRightIcon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Konsultasi</span>
            <span className="sm:hidden">Konsultasi</span>
          </TabsTrigger>
          <TabsTrigger 
            value="therapy" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            role={ACCESSIBILITY_CONSTANTS.ROLES.TAB}
            aria-controls="therapy-panel"
            aria-selected={activeTab === 'therapy'}
            aria-label="Tab terapi"
          >
            <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Terapi</span>
            <span className="sm:hidden">Terapi</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="summary" 
          className="mt-6" 
          id="summary-panel"
          role={ACCESSIBILITY_CONSTANTS.ROLES.TABPANEL}
          aria-labelledby="summary-tab"
          tabIndex={0}
        >
          <div className="space-y-6">
            {/* Current Status */}
            <Card role="region" aria-labelledby="status-title">
              <CardHeader>
                <CardTitle id="status-title" className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" aria-hidden="true" />
                  Status Terkini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                                     <div>
                     <p className="text-sm text-gray-600">Status Klien</p>
                     <Badge variant={client.status === 'therapy' ? 'default' : 'secondary'} className="mt-1">
                       {client.status === 'therapy' ? 'Aktif' : 'Tidak Aktif'}
                     </Badge>
                   </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Progress Terapi</p>
                    <p className="text-2xl font-bold text-blue-600">{client.progress || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Summary */}
            <Card role="region" aria-labelledby="client-summary-title">
              <CardHeader>
                <CardTitle id="client-summary-title" className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  Ringkasan Klien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{therapyProgress.totalConsultations}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Konsultasi</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{therapyProgress.completedConsultations}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Selesai</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">{therapyProgress.draftConsultations}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Draft</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      {client.birthDate ? calculateAge(client.birthDate) : '-'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Usia</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Therapy Progress Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-green-600" />
                  Progress Terapi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress Keseluruhan</span>
                    <span className="text-sm font-medium text-gray-700">{client.progress || 0}%</span>
                  </div>
                  <Progress 
                    value={client.progress || 0} 
                    className="w-full"
                    aria-label={`Progress terapi ${client.progress || 0} persen`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={client.progress || 0}
                  />
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div>
                      <div className="text-base sm:text-lg font-semibold text-blue-600">{therapyProgress.totalConsultations}</div>
                      <div className="text-xs text-gray-500">Total Sesi</div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-semibold text-green-600">{therapyProgress.completedConsultations}</div>
                      <div className="text-xs text-gray-500">Selesai</div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-semibold text-orange-600">
                        {therapyProgress.totalConsultations > 0 
                          ? Math.round((therapyProgress.completedConsultations / therapyProgress.totalConsultations) * 100)
                          : 0
                        }%
                      </div>
                      <div className="text-xs text-gray-500">Tingkat Penyelesaian</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Therapy Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-purple-600" />
                  Sesi Terapi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientSessions.length > 0 ? (
                    <div className="space-y-2">
                      {clientSessions.slice(0, 5).map((session, index) => (
                        <div 
                          key={session.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => router.push(`/portal/therapist/sessions/${session.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              session.status === 'completed' ? 'bg-green-500' : 
                              session.status === 'scheduled' ? 'bg-blue-500' : 
                              session.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <p className="font-medium text-sm">Sesi {index + 1}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(session.date).toLocaleDateString('id-ID')} - {session.phase}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              session.status === 'completed' ? 'default' : 
                              session.status === 'scheduled' ? 'secondary' : 
                              session.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {session.status === 'completed' ? 'Selesai' : 
                               session.status === 'scheduled' ? 'Dijadwalkan' : 
                               session.status === 'cancelled' ? 'Dibatalkan' : 'Pending'}
                            </Badge>
                            <span className="text-xs text-gray-400">Klik untuk detail</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <ClockIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada sesi terapi</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Last Session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-orange-600" />
                  Sesi Terakhir
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientConsultation ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Tanggal Sesi</span>
                      <span className="text-sm text-gray-600">
                        {clientConsultation.sessionDate ? 
                          new Date(clientConsultation.sessionDate).toLocaleDateString('id-ID') : 
                          'Tanggal tidak tersedia'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      <Badge variant={
                        clientConsultation.status === 'completed' ? 'default' : 
                        clientConsultation.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {clientConsultation.status === 'completed' ? 'Selesai' : 
                         clientConsultation.status === 'draft' ? 'Draft' : 'Pending'}
                      </Badge>
                    </div>
                                         {clientConsultation.consultationNotes && (
                       <div>
                         <span className="text-sm font-medium text-gray-700">Catatan</span>
                         <p className="text-sm text-gray-600 mt-1 line-clamp-3">{clientConsultation.consultationNotes}</p>
                       </div>
                     )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Belum ada sesi konsultasi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent 
          value="ai-summary" 
          className="mt-6" 
          id="ai-summary-panel"
          role={ACCESSIBILITY_CONSTANTS.ROLES.TABPANEL}
          aria-labelledby="ai-summary-tab"
          tabIndex={0}
        >
          <ConsultationSummary
            data={consultationSummaryData}
            isLoading={summaryLoading}
            error={summaryError}
            onRetry={() => clientConsultation?.id && loadConsultationSummary(clientConsultation.id)}
          />
        </TabsContent>

        <TabsContent 
          value="consultation" 
          className="mt-6" 
          id="consultation-panel"
          role={ACCESSIBILITY_CONSTANTS.ROLES.TABPANEL}
          aria-labelledby="consultation-tab"
          tabIndex={0}
        >
          <div className="space-y-6">
            {/* Consultation Form */}
            <ConsultationForm
              form={form as any}
              onSubmit={handleFormSubmit}
              onSave={handleFormSave}
              isSubmitting={isSubmitting}
              isLoading={isLoading}
              mode={clientConsultation ? 'edit' : 'create'}
              allowTypeChange={!clientConsultation}
              client={client}
            />
          </div>
        </TabsContent>

        <TabsContent 
          value="therapy" 
          className="mt-6" 
          id="therapy-panel"
          role={ACCESSIBILITY_CONSTANTS.ROLES.TABPANEL}
          aria-labelledby="therapy-tab"
          tabIndex={0}
        >
          {clientConsultation && clientConsultation.status === 'completed' ? (
            <div className="space-y-6">
              {/* Session Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Manajemen Sesi Terapi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{clientSessions.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Sesi</div>
                      </div>
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          {clientSessions.filter(s => s.status === 'completed').length}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Selesai</div>
                      </div>
                      <div className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">
                          {clientSessions.filter(s => s.status === 'scheduled').length}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Terjadwal</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: 'Fitur Belum Tersedia',
                            message: 'Fitur jadwal sesi baru akan segera tersedia',
                          });
                        }}
                      >
                        Jadwalkan Sesi Baru
                      </button>
                      <button 
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: 'Fitur Belum Tersedia',
                            message: 'Fitur riwayat sesi akan segera tersedia',
                          });
                        }}
                      >
                        Lihat Riwayat Lengkap
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIconSolid className="w-5 h-5 text-purple-600" />
                    Sesi Terakhir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientSessions.length > 0 ? (
                    <div className="space-y-3">
                      {clientSessions.slice(0, 3).map((session, index) => (
                        <div 
                          key={session.id}
                          className="p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => router.push(`/portal/therapist/sessions/${session.id}`)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm sm:text-base">Sesi {index + 1}</span>
                                <Badge variant={
                                  session.status === 'completed' ? 'default' : 
                                  session.status === 'scheduled' ? 'secondary' : 'outline'
                                } className="text-xs">
                                  {session.status === 'completed' ? 'Selesai' : 
                                   session.status === 'scheduled' ? 'Dijadwalkan' : 'Lainnya'}
                                </Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {new Date(session.date).toLocaleDateString('id-ID')} • 
                                Fase: {session.phase === 'intake' ? 'Penerimaan' :
                                      session.phase === 'induction' ? 'Induksi' :
                                      session.phase === 'therapy' ? 'Terapi' : 'Lainnya'}
                              </p>
                              {session.notes && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">
                                  {session.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right sm:text-center">
                              <span className="text-xs text-gray-400">Klik untuk detail</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <ClockIconSolid className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada sesi terapi</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Therapy Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-green-600" />
                    Progress Terapi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Progress Keseluruhan</span>
                      <span className="text-sm font-medium text-gray-700">{client.progress || 0}%</span>
                    </div>
                    <Progress value={client.progress || 0} className="w-full" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">
                          {clientSessions.length}
                        </div>
                        <div className="text-xs text-gray-500">Total Sesi</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">
                          {clientSessions.filter(s => s.status === 'completed').length}
                        </div>
                        <div className="text-xs text-gray-500">Selesai</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-orange-600">
                          {clientSessions.length > 0 ? 
                            Math.round((clientSessions.filter(s => s.status === 'completed').length / clientSessions.length) * 100) : 0
                          }%
                        </div>
                        <div className="text-xs text-gray-500">Tingkat Penyelesaian</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-600">
                          {clientSessions.reduce((total, session) => total + (session.durationMinutes || 0), 0)} min
                        </div>
                        <div className="text-xs text-gray-500">Total Durasi</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                  Terapi Belum Dapat Dimulai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <HeartIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Konsultasi Diperlukan</p>
                  <p className="mb-6 text-gray-600 max-w-md mx-auto">
                    {!clientConsultation 
                      ? 'Untuk memulai sesi terapi, Anda perlu menyelesaikan konsultasi awal terlebih dahulu. Konsultasi akan membantu menentukan pendekatan terapi yang tepat untuk klien.'
                      : 'Konsultasi masih dalam status draft. Silakan selesaikan konsultasi untuk membuka akses ke fitur terapi dan mulai penjadwalan sesi.'
                    }
                  </p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                    onClick={() => {
                      setActiveTab('consultation');
                      addToast({
                        type: 'info',
                        title: 'Beralih ke Konsultasi',
                        message: 'Silakan lengkapi form konsultasi terlebih dahulu',
                      });
                    }}
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    {!clientConsultation ? 'Mulai Konsultasi' : 'Lanjutkan Konsultasi'}
                  </button>
                  
                  {/* Information about what consultation includes */}
                  <div className="mt-8 text-left max-w-lg mx-auto">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Konsultasi akan mencakup:</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Penilaian kondisi dan kebutuhan klien</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Penetapan tujuan dan rencana terapi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Identifikasi metode dan teknik terapi yang sesuai</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Persiapan untuk sesi terapi pertama</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TherapyPage;