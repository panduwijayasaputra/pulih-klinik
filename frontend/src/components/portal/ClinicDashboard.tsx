'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export const ClinicDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Clinic Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Klinik
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola klinik dan tim therapist Anda
          </p>
        </div>
      </div>


      {/* Clinic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Therapists */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Therapist Aktif</CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +1 dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Total Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Klien</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +18 dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Sessions This Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Bulan Ini</CardTitle>
            <ClipboardDocumentListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Generated Scripts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Script Dibuat</CardTitle>
            <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">524</div>
            <p className="text-xs text-muted-foreground">
              +24% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clinic Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Therapist Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Kelola Therapist
            </CardTitle>
            <CardDescription>
              Manajemen tim therapist klinik
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Lihat Semua Therapist
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Tambah Therapist Baru
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Jadwal & Assignment
            </Button>
          </CardContent>
        </Card>

        {/* Client Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Data Klien
            </CardTitle>
            <CardDescription>
              Manajemen data klien klinik
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Daftar Klien
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Klien Baru Hari Ini
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Laporan Progress
            </Button>
          </CardContent>
        </Card>

        {/* Analytics & Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics & Laporan
            </CardTitle>
            <CardDescription>
              Insight dan laporan kinerja klinik
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Dashboard Analytics
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Laporan Bulanan
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sesi Terbaru</CardTitle>
            <CardDescription>
              Aktivitas sesi hipnoterapi terbaru di klinik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">Klien #KL-001</p>
                    <p className="text-xs text-muted-foreground">Dr. Sarah - Sesi Selesai</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Selesai</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-sm">Klien #KL-002</p>
                    <p className="text-xs text-muted-foreground">Dr. Ahmad - Sedang Berlangsung</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">Berlangsung</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">Klien #KL-003</p>
                    <p className="text-xs text-muted-foreground">Dr. Maria - Dijadwalkan</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Terjadwal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performa Klinik</CardTitle>
            <CardDescription>
              Metrik kinerja klinik bulan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tingkat Kepuasan Klien</span>
                  <span className="text-sm font-bold text-green-600">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Efektivitas Terapi</span>
                  <span className="text-sm font-bold text-blue-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Utilisasi Therapist</span>
                  <span className="text-sm font-bold text-purple-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '78%'}} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Info */}
      {user?.subscriptionTier && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="default">{user.subscriptionTier}</Badge>
                <div>
                  <p className="font-medium text-sm">Paket Langganan Aktif</p>
                  <p className="text-xs text-muted-foreground">
                    Fitur premium tersedia untuk meningkatkan efisiensi klinik
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Kelola Langganan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};