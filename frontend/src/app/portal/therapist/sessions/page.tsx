'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { useTherapySessions } from '@/hooks/useTherapySessions';

import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  HeartIcon,
  ListBulletIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { TherapySessionStatusEnum } from '@/types/therapySession';

type ViewMode = 'table' | 'calendar' | 'list';

import { SessionWithClient } from '@/lib/api/therapySession';

export default function TherapySessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  const {
    sessions,
    stats,
    loading,
    loadingStats,
    loadingAction,
    error,
    loadSessions,
    loadStats,
    updateSessionStatus
  } = useTherapySessions();

  // Filter out completed sessions for table view
  const filteredSessions = viewMode === 'table' 
    ? sessions.filter(session => session.status !== TherapySessionStatusEnum.Completed)
    : sessions;

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadSessions(),
          loadStats()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [loadSessions, loadStats]);

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

  const getStatusBadge = (status: TherapySessionStatusEnum) => {
    const statusConfig = {
      [TherapySessionStatusEnum.Completed]: {
        label: 'Selesai',
        className: 'bg-green-50 text-green-700 border-green-200'
      },
      [TherapySessionStatusEnum.Scheduled]: {
        label: 'Dijadwalkan',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      },
      [TherapySessionStatusEnum.Planned]: {
        label: 'Direncanakan',
        className: 'bg-purple-50 text-purple-700 border-purple-200'
      },
      [TherapySessionStatusEnum.InProgress]: {
        label: 'Berlangsung',
        className: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      [TherapySessionStatusEnum.Cancelled]: {
        label: 'Dibatalkan',
        className: 'bg-red-50 text-red-700 border-red-200'
      }
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'table':
        return <TableCellsIcon className="w-4 h-4" />;
      case 'calendar':
        return <CalendarDaysIcon className="w-4 h-4" />;
      case 'list':
        return <ListBulletIcon className="w-4 h-4" />;
    }
  };

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([
        loadSessions(true),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [loadSessions, loadStats]);

  // Handle view mode change with data refresh
  const handleViewModeChange = useCallback((newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    // Refresh data when view mode changes
    handleRefresh();
  }, [handleRefresh]);



  return (
    <PageWrapper 
      title="Sesi Saya" 
      description="Kelola dan pantau sesi terapi klien yang ditugaskan kepada Anda"
      actions={
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          {(['table', 'calendar', 'list'] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange(mode)}
              className={`flex items-center gap-2 ${
                viewMode === mode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {getViewModeIcon(mode)}
              {mode === 'table' && 'Tabel'}
              {mode === 'calendar' && 'Kalender'}
              {mode === 'list' && 'Daftar'}
            </Button>
          ))}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sesi</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Selesai</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedSessions}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dijadwalkan</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.scheduledSessions}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Berlangsung</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inProgressSessions}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HeartIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

                {/* Content based on view mode */}
        {viewMode === 'table' && (
                  <DataTable
          title="Daftar Sesi Terapi"
          description="Kelola dan pantau sesi terapi klien yang ditugaskan"
          data={filteredSessions}
          columns={[
              {
                key: 'client',
                header: 'Klien',
                render: (session) => (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt={session.client.fullName} />
                      <AvatarFallback className="text-xs">
                        {getInitials(session.client.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {session.client.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatAge(session.client.birthDate)} tahun • {session.client.gender}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'session',
                header: 'Sesi',
                render: (session) => (
                  <div>
                    <div className="font-medium text-gray-900">
                      Sesi #{session.sessionNumber}
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.title}
                    </div>
                  </div>
                ),
              },
              {
                key: 'datetime',
                header: 'Tanggal & Waktu',
                render: (session) => (
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {new Date(session.date).toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      {session.time}
                    </div>
                  </div>
                ),
              },
              {
                key: 'duration',
                header: 'Durasi',
                render: (session) => (
                  <span className="text-sm">{session.duration} menit</span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (session) => getStatusBadge(session.status),
              },
              {
                key: 'techniques',
                header: 'Teknik',
                render: (session) => (
                  <div className="text-sm text-gray-600">
                    {session.techniques?.slice(0, 2).join(', ')}
                    {session.techniques && session.techniques.length > 2 && '...'}
                  </div>
                ),
              },
            ]}
            actions={[
              {
                key: 'details',
                label: 'Details',
                icon: ChevronRightIcon,
                variant: 'outline',
                size: 'sm',
                onClick: (session) => {
                  router.push(`/portal/therapist/therapy/${session.clientId}`);
                },
              },
              {
                key: 'startTherapy',
                label: 'Start Therapy',
                variant: 'default',
                size: 'sm',
                onClick: (session) => {
                  router.push(`/portal/therapist/sessions/${session.id}` as any);
                },
              },
            ]}
            loading={loading}
            emptyMessage="Belum ada sesi terapi yang dijadwalkan"
            loadingMessage="Memuat data sesi terapi..."
            searchKeys={['title']}
            searchPlaceholder="Cari klien atau sesi..."
            refreshAction={{
              label: 'Refresh',
              onClick: handleRefresh,
              loading: loading || loadingStats
            }}
          />
        )}

        {viewMode === 'calendar' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5" />
                Kalender Sesi Terapi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Memuat data sesi terapi...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="" alt={session.client.fullName} />
                              <AvatarFallback className="text-xs">
                                {getInitials(session.client.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {session.client.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatAge(session.client.birthDate)} tahun
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {new Date(session.date).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ClockIcon className="w-4 h-4" />
                            <span>{session.time} • {session.duration} menit</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Sesi #{session.sessionNumber}:</span>
                            <span className="text-gray-600 ml-1">{session.title}</span>
                          </div>
                          {session.techniques && (
                            <div className="flex flex-wrap gap-1">
                              {session.techniques.slice(0, 2).map((technique: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {technique}
                                </Badge>
                              ))}
                              {session.techniques.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{session.techniques.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sessions.length === 0 && (
                    <div className="text-center py-12">
                      <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Belum ada sesi terapi yang dijadwalkan</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {viewMode === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListBulletIcon className="w-5 h-5" />
                Daftar Sesi Terapi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Memuat data sesi terapi...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src="" alt={session.client.fullName} />
                                <AvatarFallback>
                                  {getInitials(session.client.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {session.client.fullName}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {formatAge(session.client.birthDate)} tahun
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPinIcon className="w-3 h-3" />
                                    {session.client.province}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <PhoneIcon className="w-3 h-3" />
                                    {session.client.phone}
                                  </span>
                                </div>
                              </div>
                              {getStatusBadge(session.status)}
                            </div>
                            
                            <Separator className="my-3" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Sesi #{session.sessionNumber}: {session.title}
                                </h4>
                                {session.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {session.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <CalendarIcon className="w-4 h-4" />
                                    {new Date(session.date).toLocaleDateString('id-ID')}
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <ClockIcon className="w-4 h-4" />
                                    {session.time} • {session.duration} menit
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Teknik Terapi</h5>
                                <div className="flex flex-wrap gap-1">
                                  {session.techniques?.map((technique: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {technique}
                                    </Badge>
                                  )) || (
                                    <span className="text-sm text-gray-500">Tidak ada teknik yang dipilih</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              Detail
                              <ChevronRightIcon className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sessions.length === 0 && (
                    <div className="text-center py-12">
                      <ListBulletIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Belum ada sesi terapi yang dijadwalkan</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
