'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HeartIcon,
  PlayIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export const TherapistDashboard: React.FC = () => {

  return (
    <div className="space-y-6">
      {/* Therapist Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Therapist
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola klien dan sesi terapi harian Anda
          </p>
        </div>
      </div>

      {/* Daily Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi Hari Ini</CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 selesai, 3 terjadwal
            </p>
          </CardContent>
        </Card>

        {/* Active Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klien Aktif</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +3 klien baru minggu ini
            </p>
          </CardContent>
        </Card>

        {/* Scripts Generated */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Script Dibuat</CardTitle>
            <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">
              Bulan ini
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Keberhasilan</CardTitle>
            <HeartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Berdasarkan feedback klien
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              Jadwal Hari Ini
            </CardTitle>
            <CardDescription>
              Sesi hipnoterapi yang dijadwalkan untuk hari ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">09:00 - Klien #KL-045</p>
                    <p className="text-xs text-muted-foreground">Sesi Anxiety Management</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Selesai</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-sm">11:00 - Klien #KL-052</p>
                    <p className="text-xs text-muted-foreground">Sesi Smoking Cessation</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">Sedang Berlangsung</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">14:00 - Klien #KL-067</p>
                    <p className="text-xs text-muted-foreground">Sesi Weight Management</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Terjadwal</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">16:00 - Klien #KL-023</p>
                    <p className="text-xs text-muted-foreground">Follow-up Session</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Terjadwal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            <CardDescription>
              Akses fitur utama untuk aktivitas harian
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center space-y-1">
                <PlayIcon className="h-5 w-5" />
                <span className="text-xs">Mulai Sesi</span>
              </Button>
              
              <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center space-y-1">
                <UserIcon className="h-5 w-5" />
                <span className="text-xs">Tambah Klien</span>
              </Button>
              
              <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center space-y-1">
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-xs">Buat Script</span>
              </Button>
              
              <Button variant="outline" size="sm" className="h-16 flex flex-col items-center justify-center space-y-1">
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <span className="text-xs">Assessment</span>
              </Button>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button variant="default" size="sm" className="w-full justify-start">
                <PlayIcon className="h-4 w-4 mr-2" />
                Lanjutkan Sesi Tertunda
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start">
                <UsersIcon className="h-4 w-4 mr-2" />
                Lihat Semua Klien
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Client Activity and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Client Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Klien Terbaru</CardTitle>
            <CardDescription>
              Update terbaru dari klien yang sedang ditangani
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <HeartIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Klien #KL-045</p>
                    <p className="text-xs text-muted-foreground">Menyelesaikan 5/7 sesi - Progress baik</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">85%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Klien #KL-052</p>
                    <p className="text-xs text-muted-foreground">Sesi ke-3 dari 6 - Responsif terhadap terapi</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">60%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <CalendarDaysIcon className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Klien #KL-067</p>
                    <p className="text-xs text-muted-foreground">Memulai program baru - Sesi pertama</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">15%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performa Personal</CardTitle>
            <CardDescription>
              Metrik kinerja terapi bulan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sesi Selesai</span>
                  <span className="text-sm font-bold text-green-600">47/50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Kepuasan Klien</span>
                  <span className="text-sm font-bold text-blue-600">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '96%'}} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Efektivitas Terapi</span>
                  <span className="text-sm font-bold text-purple-600">91%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '91%'}} />
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <HeartIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Status Performance</span>
                  </div>
                  <Badge variant="success">Excellent</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips and Reminders */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <HeartIcon className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-purple-900 mb-1">Tip Hari Ini</h3>
              <p className="text-sm text-purple-800">
                Ingatlah untuk selalu melakukan post-session notes setelah setiap sesi. 
                Dokumentasi yang baik membantu melacak progress klien dan meningkatkan efektivitas terapi selanjutnya.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};