'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Panel Administrator
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola sistem Terapintar secara keseluruhan
          </p>
        </div>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clinics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Klinik</CardTitle>
            <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 dari bulan lalu
            </p>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Aktif</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              +18% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Sistem</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Uptime 30 hari terakhir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Kelola Pengguna
            </CardTitle>
            <CardDescription>
              Tambah, edit, atau hapus pengguna sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Lihat Semua Pengguna
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Tambah Pengguna Baru
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Kelola Role & Izin
            </Button>
          </CardContent>
        </Card>

        {/* Clinic Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              Kelola Klinik
            </CardTitle>
            <CardDescription>
              Administrasi klinik dan pengaturan langganan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Daftar Klinik
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Verifikasi Pendaftaran
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Kelola Langganan
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CogIcon className="h-5 w-5 mr-2" />
              Pengaturan Sistem
            </CardTitle>
            <CardDescription>
              Konfigurasi sistem dan parameter global
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Konfigurasi AI
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Pengaturan Email
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Backup & Recovery
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Development Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <p className="text-sm text-yellow-800">
              <strong>Status Pengembangan:</strong> Panel administrator sedang dalam tahap pengembangan aktif. 
              Fitur-fitur ini akan segera tersedia dalam versi mendatang.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};