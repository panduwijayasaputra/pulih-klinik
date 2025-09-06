'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicProfileForm } from '@/components/clinic/ClinicProfileForm';
import { DocumentUpload } from '@/components/clinic/DocumentUpload';
import { DocumentManager } from '@/components/clinic/DocumentManager';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTabs from '@/components/ui/page-tabs';
import { useClinic } from '@/hooks/useClinic';
import {
  BuildingOfficeIcon,
  DocumentArrowUpIcon,
  PaintBrushIcon,
  UserIcon
} from '@heroicons/react/24/outline';

function ClinicManagePageContent() {
  const router = useRouter();
  const { clinic, stats, isLoading, isStatsLoading, fetchClinic, fetchStats } = useClinic();
  const [activeTab, setActiveTab] = useState('profile');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSaveSuccess = () => {
    // Refresh clinic data after successful save
    fetchClinic();
    fetchStats();
  };

  const handleCancel = () => {
    router.push('/portal/clinic');
  };

  // Redirect to onboarding if no clinic data exists
  React.useEffect(() => {
    if (!isLoading && !clinic) {
      router.push('/portal/clinic/onboarding');
    }
  }, [clinic, isLoading, router]);

  // Refresh data when profile tab becomes active
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setIsRefreshing(true);
      Promise.all([fetchClinic(), fetchStats()]).finally(() => {
        setIsRefreshing(false);
      });
    }
  };

  // Show loading state while checking clinic data or redirecting
  if (isLoading || !clinic) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Memuat data klinik...</span>
      </div>
    );
  }

  return (
    <PageWrapper
      title="Manajemen Klinik"
      description="Kelola informasi klinik, dokumen, dan pengaturan"
    >

      <PageTabs
        tabs={[
          {
            value: 'profile',
            label: 'Profil Klinik',
            icon: BuildingOfficeIcon,
            content: (
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
                                {(isLoading || isRefreshing) && activeTab === 'profile' ? (
          // Loading state for clinic status
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Memuat status...</span>
          </div>
        ) : (
                          <>
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
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {(isStatsLoading || isRefreshing) && activeTab === 'profile' ? (
                            // Loading state for stats
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                              <span className="ml-2 text-sm text-gray-600">Memuat statistik...</span>
                            </div>
                          ) : (
                            <>
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                  {stats?.therapists || 0}
                                </div>
                                <div className="text-sm text-gray-600">Therapist</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {stats?.clients || 0}
                                </div>
                                <div className="text-sm text-gray-600">Klien</div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                  {stats?.sessions || 0}
                                </div>
                                <div className="text-sm text-gray-600">Sesi</div>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                  {stats?.documents || clinic?.documents?.length || 0}
                                </div>
                                <div className="text-sm text-gray-600">Dokumen</div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ),
          },
          {
            value: 'documents',
            label: 'Dokumen',
            icon: DocumentArrowUpIcon,
            content: (
              <div className="space-y-6">
                <DocumentUpload />
                <DocumentManager />
              </div>
            ),
          },
          {
            value: 'settings',
            label: 'Pengaturan',
            icon: PaintBrushIcon,
            content: (
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
            ),
          },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        gridCols={3}
      />
    </PageWrapper>
  );
}

export default function ClinicManagePage() {
  return <ClinicManagePageContent />;
}