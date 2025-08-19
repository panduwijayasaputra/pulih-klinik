'use client';

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Session,
  SessionStatusEnum,
  SessionTypeEnum,
  SessionStatusLabels,
  SessionTypeLabels,
  SessionFilters,
  SessionSort,
  SessionSortField,
  SessionSortOrder,
} from '@/types/therapy';
import {
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Bars3BottomLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

interface SessionListProps {
  sessions?: Session[];
  isLoading?: boolean;
  error?: string | null;
  onSessionSelect?: (session: Session) => void;
  onSessionCreate?: () => void;
  onSessionUpdate?: (sessionId: string, updates: Partial<Session>) => void;
  onSessionDelete?: (sessionId: string) => void;
  onRetry?: () => void;
  showCreateButton?: boolean;
  clientId?: string;
  therapyId?: string;
  className?: string;
}

interface SessionCardProps {
  session: Session;
  onSelect?: (session: Session) => void;
  onUpdate?: (sessionId: string, updates: Partial<Session>) => void;
  onDelete?: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onSelect, onUpdate, onDelete }) => {
  const statusColors = {
    [SessionStatusEnum.New]: 'bg-gray-100 text-gray-800 border-gray-200',
    [SessionStatusEnum.Scheduled]: 'bg-blue-100 text-blue-800 border-blue-200',
    [SessionStatusEnum.Started]: 'bg-green-100 text-green-800 border-green-200',
    [SessionStatusEnum.Completed]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [SessionStatusEnum.Cancelled]: 'bg-red-100 text-red-800 border-red-200',
    [SessionStatusEnum.NoShow]: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  const typeColors = {
    [SessionTypeEnum.Initial]: 'bg-purple-50 text-purple-700',
    [SessionTypeEnum.Regular]: 'bg-blue-50 text-blue-700',
    [SessionTypeEnum.Progress]: 'bg-yellow-50 text-yellow-700',
    [SessionTypeEnum.Final]: 'bg-green-50 text-green-700',
    [SessionTypeEnum.Emergency]: 'bg-red-50 text-red-700',
  };

  const statusIcons = {
    [SessionStatusEnum.New]: ListBulletIcon,
    [SessionStatusEnum.Scheduled]: CalendarIcon,
    [SessionStatusEnum.Started]: PlayIcon,
    [SessionStatusEnum.Completed]: CheckIcon,
    [SessionStatusEnum.Cancelled]: XMarkIcon,
    [SessionStatusEnum.NoShow]: ExclamationTriangleIcon,
  };

  const StatusIcon = statusIcons[session.status];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tidak dijadwalkan';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Tidak ditentukan';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}j ${remainingMinutes}m` : `${hours} jam`;
    }
    return `${minutes} menit`;
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={() => onSelect?.(session)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500">
                Sesi #{session.sessionNumber}
              </span>
              <Badge className={typeColors[session.type]} variant="secondary">
                {SessionTypeLabels[session.type]}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {session.title}
            </CardTitle>
            {session.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {session.description}
              </p>
            )}
          </div>
          <Badge className={`ml-3 ${statusColors[session.status]}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {SessionStatusLabels[session.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Session info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(session.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>{formatDuration(session.duration)}</span>
            </div>
          </div>

          {/* Objectives preview */}
          {session.objectives && session.objectives.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Tujuan Sesi:</h4>
              <div className="flex flex-wrap gap-1">
                {session.objectives.slice(0, 2).map((objective, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {objective.length > 30 ? `${objective.slice(0, 30)}...` : objective}
                  </Badge>
                ))}
                {session.objectives.length > 2 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{session.objectives.length - 2} lainnya
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Progress score */}
          {session.progressScore && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Skor Progress:</span>
              <Badge variant="outline" className="font-medium">
                {session.progressScore}/10
              </Badge>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex justify-end pt-2 border-t">
            <div className="text-xs text-gray-500">
              Dibuat: {new Date(session.createdAt).toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Alert className="border-red-200 bg-red-50">
    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
    <AlertDescription className="text-red-800">
      <div className="flex items-center justify-between">
        <span>{error}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 border-red-200 text-red-700 hover:bg-red-100"
          >
            Coba Lagi
          </Button>
        )}
      </div>
    </AlertDescription>
  </Alert>
);

const EmptyState: React.FC<{ onCreateSession?: () => void }> = ({ onCreateSession }) => (
  <Card>
    <CardContent className="text-center py-12">
      <ListBulletIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Sesi</h3>
      <p className="text-gray-600 mb-6">
        Mulai terapi dengan membuat sesi pertama untuk klien ini.
      </p>
      {onCreateSession && (
        <Button onClick={onCreateSession} className="gap-2">
          <PlusIcon className="w-4 h-4" />
          Buat Sesi Pertama
        </Button>
      )}
    </CardContent>
  </Card>
);

export const SessionList: React.FC<SessionListProps> = ({
  sessions = [],
  isLoading = false,
  error = null,
  onSessionSelect,
  onSessionCreate,
  onSessionUpdate,
  onSessionDelete,
  onRetry,
  showCreateButton = true,
  className = '',
}) => {
  const [filters, setFilters] = useState<SessionFilters>({});
  const [sort, setSort] = useState<SessionSort>({
    field: 'sessionNumber',
    order: 'asc',
  });

  // Filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    let result = [...sessions];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(session =>
        session.title.toLowerCase().includes(searchTerm) ||
        session.description?.toLowerCase().includes(searchTerm) ||
        session.notes?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(session => session.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(session => session.type === filters.type);
    }

    // Apply sorting
    result.sort((a, b) => {
      const { field, order } = sort;
      const multiplier = order === 'asc' ? 1 : -1;

      let aValue: any, bValue: any;
      switch (field) {
        case 'sessionNumber':
          aValue = a.sessionNumber;
          bValue = b.sessionNumber;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'scheduledDate':
          aValue = new Date(a.scheduledDate || a.createdAt);
          bValue = new Date(b.scheduledDate || b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return -1 * multiplier;
      if (aValue > bValue) return 1 * multiplier;
      return 0;
    });

    return result;
  }, [sessions, filters, sort]);

  const handleFilterChange = useCallback((key: keyof SessionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field: SessionSortField) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (sessions.length === 0) {
    return <EmptyState onCreateSession={onSessionCreate} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bars3BottomLeftIcon className="w-5 h-5" />
            Daftar Sesi ({sessions.length})
          </h2>
          <p className="text-sm text-gray-600">
            Kelola sesi terapi dan pantau progress klien
          </p>
        </div>
        {showCreateButton && onSessionCreate && (
          <Button onClick={onSessionCreate} className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Buat Sesi Baru
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari sesi..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status filter */}
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Status</SelectItem>
                {Object.values(SessionStatusEnum).map((status) => (
                  <SelectItem key={status} value={status}>
                    {SessionStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type filter */}
            <Select
              value={filters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Tipe</SelectItem>
                {Object.values(SessionTypeEnum).map((type) => (
                  <SelectItem key={type} value={type}>
                    {SessionTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={Object.keys(filters).length === 0}
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600 mr-2">Urutkan:</span>
        {(['sessionNumber', 'title', 'scheduledDate', 'status'] as SessionSortField[]).map((field) => {
          const isActive = sort.field === field;
          const labels = {
            sessionNumber: 'Nomor',
            title: 'Judul',
            scheduledDate: 'Tanggal',
            status: 'Status',
            createdAt: 'Dibuat',
          };

          return (
            <Button
              key={field}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange(field)}
              className="gap-1"
            >
              {labels[field]}
              {isActive && (
                sort.order === 'asc' ? (
                  <ChevronUpIcon className="w-3 h-3" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3" />
                )
              )}
            </Button>
          );
        })}
      </div>

      {/* Results */}
      {filteredAndSortedSessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              Tidak ada sesi yang sesuai dengan filter yang dipilih.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Menampilkan {filteredAndSortedSessions.length} dari {sessions.length} sesi
          </div>
          <div className="grid gap-4">
            {filteredAndSortedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onSelect={onSessionSelect}
                onUpdate={onSessionUpdate}
                onDelete={onSessionDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SessionList;