'use client';

import React from 'react';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  PlusIcon,
  UserIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

function TherapistSessionsPageContent() {

  // Mock data for sessions
  const mockSessions = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientCode: 'CL-001',
      scheduledAt: '2024-01-15T10:00:00Z',
      duration: 60,
      status: 'scheduled',
      type: 'initial_consultation',
      notes: 'Initial assessment session for anxiety treatment'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      clientCode: 'CL-002', 
      scheduledAt: '2024-01-15T14:00:00Z',
      duration: 90,
      status: 'completed',
      type: 'therapy_session',
      notes: 'Follow-up hypnotherapy session for smoking cessation'
    },
    {
      id: '3',
      clientName: 'Lisa Wong',
      clientCode: 'CL-003',
      scheduledAt: '2024-01-16T09:00:00Z',
      duration: 75,
      status: 'cancelled',
      type: 'therapy_session',
      notes: 'Client requested to reschedule due to emergency'
    },
    {
      id: '4',
      clientName: 'David Lee',
      clientCode: 'CL-004',
      scheduledAt: '2024-01-16T15:30:00Z',
      duration: 60,
      status: 'scheduled',
      type: 'follow_up',
      notes: 'Progress evaluation and technique adjustment'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon, label: 'Terjadwal' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Selesai' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Dibatalkan' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: PlayIcon, label: 'Berlangsung' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getSessionTypeLabel = (type: string) => {
    const typeLabels = {
      initial_consultation: 'Konsultasi Awal',
      therapy_session: 'Sesi Terapi',
      follow_up: 'Tindak Lanjut',
      assessment: 'Assessment'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const headerActions = (
    <Button className="flex items-center">
      <PlusIcon className="w-4 h-4 mr-2" />
      Jadwalkan Sesi Baru
    </Button>
  );

  // Stats calculation
  const stats = {
    total: mockSessions.length,
    scheduled: mockSessions.filter(s => s.status === 'scheduled').length,
    completed: mockSessions.filter(s => s.status === 'completed').length,
    cancelled: mockSessions.filter(s => s.status === 'cancelled').length
  };

  return (
    <PortalPageWrapper
      title="Sesi Terapi"
      description="Kelola jadwal sesi terapi dan riwayat treatment klien"
      actions={headerActions}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Sesi</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                <p className="text-sm text-gray-600">Terjadwal</p>
              </div>
              <ClockIcon className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Selesai</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                <p className="text-sm text-gray-600">Dibatalkan</p>
              </div>
              <XCircleIcon className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Sesi</CardTitle>
          <CardDescription>
            Daftar semua sesi terapi yang telah dijadwalkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSessions.map((session) => {
              const dateTime = formatDateTime(session.scheduledAt);
              
              return (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{session.clientName}</h4>
                        <span className="text-sm text-gray-500">({session.clientCode})</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {dateTime.date}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {dateTime.time} ({session.duration} menit)
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(session.status)}
                        <span className="text-xs text-gray-500">
                          {getSessionTypeLabel(session.type)}
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {session.status === 'scheduled' && (
                      <>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">
                          Mulai Sesi
                        </Button>
                      </>
                    )}
                    {session.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Lihat Laporan
                      </Button>
                    )}
                    {session.status === 'cancelled' && (
                      <Button variant="outline" size="sm">
                        Jadwal Ulang
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {mockSessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Belum Ada Sesi Terjadwal</p>
              <p className="mb-4">Jadwalkan sesi terapi pertama Anda</p>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Jadwalkan Sesi Baru
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </PortalPageWrapper>
  );
}

export default function TherapistSessionsPage() {
  return <TherapistSessionsPageContent />;
}