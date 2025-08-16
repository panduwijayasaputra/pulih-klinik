'use client';

import React, { useMemo, useEffect, useCallback } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';

import { Client } from '@/types/client';
import { Consultation, ConsultationFormTypeEnum } from '@/types/consultation';
import { useAuth } from '@/hooks/useAuth';
import { useConsultation } from '@/store/consultation';
import { useConsultationForm } from '@/hooks/useConsultation';
import { useToast } from '@/components/ui/toast';

import { 
  CalendarIcon, 
  ChartBarIcon, 
  ClockIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export interface TherapyPageProps {
  client: Client;
}

export const TherapyPage: React.FC<TherapyPageProps> = ({
  client,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { getConsultationsByClient } = useConsultation();

  // Get the single consultation for this client (1 client = 1 consultation)
  const clientConsultation = useMemo(() => {
    const consultations = getConsultationsByClient(client.id);
    return consultations.length > 0 ? consultations[0] : null;
  }, [getConsultationsByClient, client.id]);

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

  return (
    <PageWrapper
      showBackButton={true}
      backButtonLabel="Kembali ke Daftar Klien"
      title={`Terapi ${client.fullName || client.name}`}
      subtitle={`Status: ${client.status}`}
    >

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultations">Konsultasi</TabsTrigger>
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
                <CardTitle className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Konsultasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientConsultation ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Tanggal:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(clientConsultation.sessionDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Jenis:</span>
                      <Badge variant="outline">{clientConsultation.formType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge variant={clientConsultation.status === 'completed' ? 'default' : 'secondary'}>
                        {clientConsultation.status}
                      </Badge>
                    </div>
                    {clientConsultation.primaryConcern && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Keluhan Utama:</span>
                        <p className="text-sm text-gray-900 mt-1 line-clamp-2">
                          {clientConsultation.primaryConcern}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada konsultasi untuk klien ini</p>
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
            <h3 className="text-lg font-semibold">Form Konsultasi</h3>
          </div>

          <Card>
            <CardContent className="p-6">
              <ConsultationForm
                form={form}
                onSubmit={handleFormSubmit}
                onSave={handleFormSave}
                isSubmitting={isSubmitting}
                isLoading={isLoading}
                mode={clientConsultation ? 'edit' : 'create'}
                allowTypeChange={!clientConsultation}
              />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </PageWrapper>
  );
};

export default TherapyPage;