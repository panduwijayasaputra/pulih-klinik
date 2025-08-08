'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { 
  ClinicProfile, 
  ClinicBranding, 
  ClinicSettings,
  ClinicDocuments
} from '@/components/dashboard';
import { 
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  UsersIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function ClinicManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <RoleGuard allowedRoles={['clinic_admin']}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Klinik</h1>
            <p className="text-gray-600">Kelola profil, pengaturan, dan verifikasi klinik Anda</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <CheckCircleIcon className="w-3 h-3" />
            <span>Verified</span>
          </Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          <TabsTrigger value="documents">Dokumen</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clinic Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                  <span>Ringkasan Klinik</span>
                </CardTitle>
                <CardDescription>Data dan statistik klinik Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Therapist</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1">3</p>
                    <p className="text-xs text-blue-700">Aktif</p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Klien</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-1">12</p>
                    <p className="text-xs text-green-700">Total</p>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Sesi</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 mt-1">45</p>
                    <p className="text-xs text-purple-700">Bulan Ini</p>
                  </div>

                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <StarIcon className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Rating</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 mt-1">4.8</p>
                    <p className="text-xs text-orange-700">Rata-rata</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pendapatan Bulan Ini</span>
                    <span className="font-semibold text-gray-900">Rp 15.750.000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Sesi Selesai</span>
                    <span className="font-semibold text-gray-900">42/45 (93%)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Klien Baru</span>
                    <span className="font-semibold text-gray-900">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>Akses fitur yang sering digunakan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Edit Profil Klinik</span>
                    <span className="text-sm text-gray-500">→</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Perbarui informasi dasar klinik</p>
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Kustomisasi Branding</span>
                    <span className="text-sm text-gray-500">→</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Sesuaikan warna dan logo klinik</p>
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Kelola Dokumen</span>
                    <span className="text-sm text-gray-500">→</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Upload dan kelola dokumen legal</p>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Pengaturan Klinik</span>
                    <span className="text-sm text-gray-500">→</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Atur zona waktu dan notifikasi</p>
                </button>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <ClinicProfile />
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <ClinicBranding />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <ClinicSettings />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <ClinicDocuments />
        </TabsContent>
      </Tabs>
    </RoleGuard>
  );
}