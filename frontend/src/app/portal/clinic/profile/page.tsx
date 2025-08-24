'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicProfileForm } from '@/components/clinic/ClinicProfileForm';
import { DocumentUpload } from '@/components/clinic/DocumentUpload';
import { DocumentManager } from '@/components/clinic/DocumentManager';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClinic } from '@/hooks/useClinic';
import { 
  BuildingOfficeIcon, 
  DocumentArrowUpIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

function ClinicPageContent() {
  const router = useRouter();
  const { clinic, isLoading } = useClinic();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSaveSuccess = () => {
    // Could add toast notification here
  };

  const handleCancel = () => {
    router.push('/portal');
  };

  if (isLoading && !clinic) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Memuat data klinik...</span>
      </div>
    );
  }

  const headerActions = (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => setActiveTab('documents')}
        className="flex items-center"
      >
        <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
        Kelola Dokumen
      </Button>
      <Button
        variant="outline"
        onClick={() => setActiveTab('settings')}
        className="flex items-center"
      >
        <PaintBrushIcon className="w-4 h-4 mr-2" />
        Branding
      </Button>
    </div>
  );

  return (
    <PortalPageWrapper
      title="Manajemen Klinik"
      description="Kelola informasi klinik, dokumen, dan pengaturan"
      actions={headerActions}
    >

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <BuildingOfficeIcon className="w-4 h-4" />
            Profil Klinik
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <DocumentArrowUpIcon className="w-4 h-4" />
            Dokumen
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <PaintBrushIcon className="w-4 h-4" />
            Pengaturan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <ClinicProfileForm 
                onSaveSuccess={handleSaveSuccess}
                onCancel={handleCancel}
              />
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Clinic Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status Klinik</CardTitle>
                    <CardDescription>
                      Informasi status dan langganan klinik Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Paket:</span>
                      <span className="text-sm text-gray-600 capitalize">
                        {clinic?.subscriptionTier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dibuat:</span>
                      <span className="text-sm text-gray-600">
                        {clinic?.createdAt ? 
                          new Date(clinic.createdAt).toLocaleDateString('id-ID') 
                          : '-'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Diperbarui:</span>
                      <span className="text-sm text-gray-600">
                        {clinic?.updatedAt ? 
                          new Date(clinic.updatedAt).toLocaleDateString('id-ID') 
                          : '-'
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-sm text-gray-600">Therapist</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-sm text-gray-600">Klien</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">0</div>
                        <div className="text-sm text-gray-600">Sesi</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {clinic?.documents?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Dokumen</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="space-y-6">
            <DocumentUpload />
            <DocumentManager />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Klinik</CardTitle>
              <CardDescription>
                Kelola pengaturan umum dan branding klinik Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <PaintBrushIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Pengaturan Branding</p>
                <p className="mb-4">Fitur pengaturan branding akan tersedia segera</p>
                <Button variant="outline" disabled>
                  Akan Hadir
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PortalPageWrapper>
  );
}

export default function ClinicPage() {
  return <ClinicPageContent />;
}