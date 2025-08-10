'use client';

import React, { useState, useEffect } from 'react';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { DataTable, TableColumn, TableAction } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { useTherapistClients } from '@/hooks/useTherapistClients';
import { ClientStatusEnum, ClientStatusLabels } from '@/types/enums';
import type { Client } from '@/types/client';
import {
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface TherapistDashboardProps {
  onViewClient?: (clientId: string) => void;
  onStartConsultation?: (clientId: string) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({
  onViewClient,
  onStartConsultation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatusEnum | 'all'>('all');

  const {
    filteredClients,
    stats,
    loading,
    error,
    loadClients,
    isTherapist,
  } = useTherapistClients(searchTerm, statusFilter);

  // Load clients on component mount
  useEffect(() => {
    if (isTherapist) {
      loadClients();
    }
  }, [loadClients, isTherapist]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ClientStatusEnum | 'all');
  };

  // Refresh clients
  const handleRefresh = async () => {
    await loadClients(true);
  };

  // If user is not a therapist, show access denied
  if (!isTherapist) {
    return (
      <PortalPageWrapper
        title="Akses Ditolak"
        description="Anda tidak memiliki akses ke halaman ini"
      >
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Halaman ini hanya dapat diakses oleh therapist.</p>
          </CardContent>
        </Card>
      </PortalPageWrapper>
    );
  }

  // Define status overview cards data
  const statusCards = [
    {
      title: 'Total Klien',
      value: stats.total,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Menunggu Konsultasi',
      value: stats.assigned,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Dalam Konsultasi',
      value: stats.consultation,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Dalam Terapi',
      value: stats.therapy,
      icon: PlayIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Selesai',
      value: stats.done,
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Define table columns
  const columns: TableColumn<Client>[] = [
    {
      key: 'client',
      header: 'Klien',
      render: (client) => (
        <div>
          <div className="font-medium text-gray-900">{client.fullName || client.name}</div>
          <div className="text-sm text-gray-500">{client.email}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (client) => (
        <div className="text-sm text-gray-600">{client.phone}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (client) => <ClientStatusBadge status={client.status as ClientStatusEnum} />,
    },
    {
      key: 'sessions',
      header: 'Sesi',
      render: (client) => (
        <div className="text-center">
          <span className="font-medium">{client.totalSessions}</span>
          <div className="text-xs text-gray-500">total</div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (client) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${client.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium">{client.progress}%</span>
        </div>
      ),
    },
    {
      key: 'lastSession',
      header: 'Sesi Terakhir',
      render: (client) => (
        <div className="text-sm text-gray-600">
          {client.lastSession 
            ? new Date(client.lastSession).toLocaleDateString('id-ID')
            : 'Belum ada'
          }
        </div>
      ),
    },
  ];

  // Define table actions based on client status
  const getActionsForClient = (client: Client): TableAction<Client>[] => {
    const baseActions: TableAction<Client>[] = [
      {
        key: 'view',
        label: 'Lihat Detail',
        icon: EyeIcon,
        variant: 'outline',
        onClick: (client) => onViewClient?.(client.id),
      },
    ];

    // Add status-specific actions
    if (client.status === ClientStatusEnum.Assigned) {
      baseActions.push({
        key: 'startConsultation',
        label: 'Mulai Konsultasi',
        icon: PlayIcon,
        variant: 'default',
        onClick: (client) => onStartConsultation?.(client.id),
      });
    } else if (client.status === ClientStatusEnum.Consultation) {
      baseActions.push({
        key: 'continueConsultation',
        label: 'Lanjutkan',
        icon: ChatBubbleLeftRightIcon,
        variant: 'default',
        onClick: (client) => onStartConsultation?.(client.id),
      });
    } else if (client.status === ClientStatusEnum.Therapy) {
      baseActions.push({
        key: 'continueTherapy',
        label: 'Lanjutkan Terapi',
        icon: PlayIcon,
        variant: 'default',
        onClick: (client) => onStartConsultation?.(client.id),
      });
    }

    return baseActions;
  };

  // Define status filter options
  const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    ...Object.values(ClientStatusEnum).map((status) => ({
      value: status,
      label: ClientStatusLabels[status],
    })),
  ];

  return (
    <PortalPageWrapper
      title="Dashboard Klien"
      description="Kelola klien yang ditugaskan kepada Anda"
    >
      <div className="space-y-6">
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama, email, atau telepon..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client List Table */}
        <DataTable
          title="Daftar Klien"
          description={`Menampilkan ${filteredClients.length} dari ${stats.total} klien`}
          data={filteredClients}
          columns={columns}
          actions={filteredClients.map((client) => getActionsForClient(client)).flat()}
          loading={loading}
          emptyMessage={
            stats.total === 0 
              ? "Anda belum memiliki klien yang ditugaskan"
              : "Tidak ada klien yang sesuai dengan filter"
          }
          loadingMessage="Memuat daftar klien..."
          refreshAction={{
            label: 'Segarkan',
            onClick: handleRefresh,
            loading: loading,
          }}
        />

        {/* Error Message */}
        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="text-red-600 text-center">
                <p className="font-medium">Terjadi Kesalahan</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalPageWrapper>
  );
};