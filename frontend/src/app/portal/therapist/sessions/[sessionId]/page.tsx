'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSessionQuery } from '@/hooks/useSession';
import { useClient } from '@/hooks/useClient';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationStore } from '@/store/navigation';
import {
  SessionStatusEnum,
  SessionStatusLabels,
  SessionTypeLabels,
} from '@/types/therapy';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  FlagIcon as TargetIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface SessionRouteProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function SessionRoute({ params }: SessionRouteProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { setBreadcrumbs } = useNavigationStore();
  const { getClientById } = useClient();
  const [sessionId, setSessionId] = React.useState<string>('');

  // Resolve params promise
  useEffect(() => {
    params.then(resolvedParams => {
      setSessionId(resolvedParams.sessionId);
    });
  }, [params]);

  // Fetch session data using React Query with real-time updates
  const sessionQuery = useSessionQuery(sessionId, {
    enabled: !!sessionId,
    refetchInterval: (data) => {
      // Poll every 30 seconds if session is active (scheduled or started)
      if (data?.status === SessionStatusEnum.Started || data?.status === SessionStatusEnum.Scheduled) {
        return 30000; // 30 seconds
      }
      return false; // Don't poll for completed/cancelled sessions
    },
    refetchIntervalInBackground: false,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const session = sessionQuery.data;
  const client = session ? getClientById(session.clientId) : null;
  
  // Track previous status for change detection
  const [previousStatus, setPreviousStatus] = React.useState<SessionStatusEnum | null>(null);

  // Check if this session belongs to a client assigned to current therapist
  const isAssignedSession = React.useMemo(() => {
    if (!session || !client || !user?.id) return false;
    return client.assignedTherapist === user.id;
  }, [session, client, user?.id]);

  // Detect status changes and show notifications
  useEffect(() => {
    if (session && previousStatus && session.status !== previousStatus) {
      addToast({
        type: 'info',
        title: 'Status Sesi Berubah',
        message: `Status sesi berubah dari ${SessionStatusLabels[previousStatus]} menjadi ${SessionStatusLabels[session.status]}`,
      });
    }
    
    if (session?.status) {
      setPreviousStatus(session.status);
    }
  }, [session?.status, previousStatus, addToast]);

  // Manual refresh function
  const handleRefresh = async () => {
    await sessionQuery.refetch();
    addToast({
      type: 'success',
      title: 'Data Diperbarui',
      message: 'Informasi sesi telah diperbarui',
    });
  };

  // Set custom breadcrumbs when session is loaded
  useEffect(() => {
    if (session && client) {
      const customBreadcrumbs = [
        {
          id: 'portal',
          label: 'Portal',
          href: '/portal',
        },
        {
          id: 'clients',
          label: 'Klien Saya',
          href: '/portal/therapist/clients',
        },
        {
          id: 'therapy',
          label: 'Terapi',
          href: `/portal/therapist/therapy/${client.id}`,
        },
        {
          id: 'session',
          label: 'Sesi',
          href: `/portal/therapist/sessions/${sessionId}`,
          isActive: true,
        },
      ];
      setBreadcrumbs(customBreadcrumbs);
    }

    // Cleanup breadcrumbs when component unmounts
    return () => {
      setBreadcrumbs([]);
    };
  }, [session, client, sessionId, setBreadcrumbs]);

  // Handle errors and access control
  useEffect(() => {
    if (!sessionId) {
      return; // Don't show error immediately, wait for sessionId to be resolved
    }

    // Handle session query errors
    if (sessionQuery.isError) {
      addToast({
        type: 'error',
        title: 'Sesi Tidak Ditemukan',
        message: 'Sesi dengan ID tersebut tidak ditemukan',
      });
      router.push('/portal/therapist/clients');
      return;
    }

    // Check if client data is missing when session is available
    if (session && !client) {
      addToast({
        type: 'error',
        title: 'Data Klien Tidak Ditemukan',
        message: 'Informasi klien untuk sesi ini tidak dapat ditemukan',
      });
      router.push('/portal/therapist/clients');
      return;
    }

    // Check access permissions
    if (session && client && !isAssignedSession) {
      addToast({
        type: 'error',
        title: 'Akses Ditolak',
        message: 'Anda tidak memiliki akses ke sesi ini',
      });
      router.push('/portal/therapist/clients');
      return;
    }
  }, [
    sessionId, 
    sessionQuery.isError, 
    session, 
    client, 
    isAssignedSession, 
    addToast, 
    router
  ]);

  // Show loading state
  if (!sessionId || sessionQuery.isLoading) {
    return (
      <PortalPageWrapper
        title="Memuat..."
        description="Memuat informasi sesi"
        backButtonLabel="Kembali ke Daftar Klien"
        showBackButton={true}
        onBackClick={() => router.push('/portal/therapist/clients')}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Memuat data sesi...</p>
          </div>
        </div>
      </PortalPageWrapper>
    );
  }

  // Show error state
  if (!session || !client) {
    return (
      <PortalPageWrapper
        title="Error"
        description="Terjadi kesalahan saat memuat data"
        backButtonLabel="Kembali ke Daftar Klien"
        showBackButton={true}
        onBackClick={() => router.push('/portal/therapist/clients')}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">Data sesi tidak dapat dimuat</p>
          </div>
        </div>
      </PortalPageWrapper>
    );
  }

  // Helper functions for formatting
  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Belum dijadwalkan';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: SessionStatusEnum): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case SessionStatusEnum.New:
        return 'outline';
      case SessionStatusEnum.Scheduled:
        return 'default';
      case SessionStatusEnum.Started:
        return 'secondary';
      case SessionStatusEnum.Completed:
        return 'default';
      case SessionStatusEnum.Cancelled:
      case SessionStatusEnum.NoShow:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <PortalPageWrapper
      title={`Sesi ${session.sessionNumber}: ${session.title}`}
      description={`Sesi terapi untuk ${client.fullName || client.name}`}
      backButtonLabel="Kembali ke Halaman Terapi"
      showBackButton={true}
      onBackClick={() => router.push(`/portal/therapist/therapy/${client.id}`)}
      actions={
        <div className="flex items-center gap-2">
          {/* Real-time status indicator */}
          {sessionQuery.isRefetching && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
              <span>Memperbarui...</span>
            </div>
          )}
          
          {/* Last updated indicator */}
          {sessionQuery.dataUpdatedAt && (
            <div className="text-xs text-gray-500">
              Terakhir diperbarui: {new Date(sessionQuery.dataUpdatedAt).toLocaleTimeString('id-ID')}
            </div>
          )}
          
          {/* Manual refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={sessionQuery.isRefetching}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className={`w-4 h-4 ${sessionQuery.isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Session Status Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">
                  Sesi #{session.sessionNumber}: {session.title}
                </h1>
                <p className="text-blue-700 text-sm">
                  {session.description || 'Tidak ada deskripsi'}
                </p>
              </div>
            </div>
            <Badge variant={getStatusBadgeVariant(session.status)} className="text-sm">
              {SessionStatusLabels[session.status]}
            </Badge>
          </div>
        </div>

        {/* Session Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Informasi Sesi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Detail Klien
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium text-gray-900">{client.fullName || client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Klien:</span>
                  <span className="font-medium text-gray-900">{client.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terapis:</span>
                  <span className="font-medium text-gray-900">{user?.fullName || user?.name || 'Tidak diketahui'}</span>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Detail Sesi
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipe Sesi:</span>
                  <span className="font-medium text-gray-900">
                    {SessionTypeLabels[session.type] || 'Tidak diketahui'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jadwal:</span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(session.scheduledDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {session.duration || 60} menit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={getStatusBadgeVariant(session.status)}>
                    {SessionStatusLabels[session.status]}
                  </Badge>
                </div>
                {session.startTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimulai:</span>
                    <span className="font-medium text-green-600">{formatTime(session.startTime)}</span>
                  </div>
                )}
                {session.endTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selesai:</span>
                    <span className="font-medium text-blue-600">{formatTime(session.endTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session Notes */}
        {session.notes && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <DocumentTextIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">Catatan Sesi</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{session.notes}</p>
            </div>
          </div>
        )}

        {/* Placeholder for Future Assessment Scores */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Assessment & Evaluasi</h2>
          </div>
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fitur Assessment Akan Datang</h3>
            <p className="text-gray-600">
              Sistem assessment dan evaluasi sesi akan tersedia pada pembaruan mendatang
            </p>
          </div>
        </div>

        {/* Objectives and Techniques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Objectives */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <TargetIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">Tujuan Sesi</h2>
            </div>
            {session.objectives && session.objectives.length > 0 ? (
              <ul className="space-y-3">
                {session.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <TargetIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Belum ada tujuan sesi yang ditetapkan</p>
              </div>
            )}
          </div>

          {/* Session Techniques */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <WrenchScrewdriverIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">Teknik Terapi</h2>
            </div>
            {session.techniques && session.techniques.length > 0 ? (
              <ul className="space-y-3">
                {session.techniques.map((technique, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{technique}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <WrenchScrewdriverIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Belum ada teknik terapi yang ditetapkan</p>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder for Future Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Recording Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Rekaman Sesi</h3>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 12.536a9 9 0 01-12.727 0M12 3v9m0 0l-3-3m3 3l3-3" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Fitur akan tersedia</p>
            </div>
          </div>

          {/* Session Materials Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Materi Sesi</h3>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Fitur akan tersedia</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push(`/portal/therapist/therapy/${client.id}`)}
              variant="default"
              size="lg"
              className="flex-1"
            >
              Kembali ke Halaman Terapi
            </Button>
            
            <Button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Fitur Akan Datang',
                  message: 'Fitur edit sesi akan tersedia pada pembaruan mendatang',
                });
              }}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Edit Sesi
            </Button>
          </div>
        </div>
      </div>
    </PortalPageWrapper>
  );
}