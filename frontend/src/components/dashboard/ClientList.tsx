'use client';

import { useState } from 'react';
import { Client, ClientFilters } from '@/types/client';
import { useClientStore } from '@/store/clients';
import { useTherapists } from '@/hooks/useTherapists';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Calendar,
  Filter,
  Mail, 
  MapPin,
  Phone, 
  Search, 
  TrendingUp,
  UserCheck,
  Users, 
  X
} from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
}

export function ClientList({ clients, loading, filters, onFiltersChange }: ClientListProps) {
  const { openProfileModal } = useClientStore();
  const { therapists } = useTherapists();
  const { assignTherapist } = useClients();
  const [showFilters, setShowFilters] = useState(false);
  const [assigningClient, setAssigningClient] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleFilterChange = (key: keyof ClientFilters, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setShowFilters(false);
  };

  const getStatusBadge = (status: Client['status']) => {
    const statusConfig = {
      active: { label: 'Aktif', variant: 'success' as const },
      inactive: { label: 'Tidak Aktif', variant: 'secondary' as const },
      completed: { label: 'Selesai', variant: 'default' as const },
      pending: { label: 'Menunggu', variant: 'warning' as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && 
    (typeof value !== 'object' || Object.keys(value).length > 0)
  ).length;

  const handleQuickAssign = async (clientId: string, therapistId: string) => {
    setAssigningClient(clientId);
    try {
      await assignTherapist(clientId, therapistId);
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setAssigningClient(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari klien berdasarkan nama, email, ID, atau masalah utama..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => 
                    handleFilterChange('status', value || undefined)
                  }
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="completed">Selesai</option>
                  <option value="pending">Menunggu</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terapis
                </label>
                <Select
                  value={filters.therapist || ''}
                  onValueChange={(value) => 
                    handleFilterChange('therapist', value || undefined)
                  }
                >
                  <option value="">Semua Terapis</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masalah Utama
                </label>
                <Select
                  value={filters.primaryIssue || ''}
                  onValueChange={(value) => 
                    handleFilterChange('primaryIssue', value || undefined)
                  }
                >
                  <option value="">Semua Masalah</option>
                  <option value="Anxiety">Kecemasan</option>
                  <option value="Depression">Depresi</option>
                  <option value="Stress Management">Manajemen Stres</option>
                  <option value="Work-Life Balance">Keseimbangan Hidup</option>
                  <option value="Addiction">Kecanduan</option>
                  <option value="Trauma">Trauma</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi
                </label>
                <Select
                  value={filters.province || ''}
                  onValueChange={(value) => 
                    handleFilterChange('province', value || undefined)
                  }
                >
                  <option value="">Semua Provinsi</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="DI Yogyakarta">DI Yogyakarta</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="h-4 w-4" />
        Menampilkan {clients.length} klien
        {activeFiltersCount > 0 && ' (dengan filter)'}
      </div>

      {/* Client Cards */}
      <div className="space-y-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada klien ditemukan
              </h3>
              <p className="text-gray-600">
                {activeFiltersCount > 0 
                  ? 'Coba ubah filter pencarian untuk melihat hasil lainnya'
                  : 'Mulai dengan menambahkan klien baru ke sistem'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-start space-x-4 flex-1 cursor-pointer" 
                    onClick={() => openProfileModal(client)}
                  >
                    <Avatar className="w-12 h-12 bg-primary text-primary-foreground">
                      {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {client.name}
                        </h3>
                        {getStatusBadge(client.status)}
                        <Badge variant="outline">{client.id}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {client.address}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Bergabung: {new Date(client.joinDate).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Masalah Utama:</span> {client.primaryIssue}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium">Sesi:</span> {client.totalSessions}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`h-4 w-4 ${getProgressColor(client.progress)}`} />
                            <span className={`font-medium ${getProgressColor(client.progress)}`}>
                              {client.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {client.assignedTherapist && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Terapis:</span>{' '}
                          {therapists.find(t => t.id === client.assignedTherapist)?.name || 'Tidak diketahui'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Assignment for unassigned clients */}
                  {!client.assignedTherapist && client.status === 'pending' && (
                    <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="text-xs text-gray-500 font-medium">Tugaskan ke:</div>
                      <div className="flex flex-col gap-1 min-w-[160px]">
                        {therapists.slice(0, 3).map((therapist) => (
                          <Button
                            key={therapist.id}
                            variant="outline"
                            size="sm"
                            className="justify-start text-xs h-8"
                            disabled={assigningClient === client.id}
                            onClick={() => handleQuickAssign(client.id, therapist.id)}
                          >
                            {assigningClient === client.id ? (
                              'Memproses...'
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3 mr-2" />
                                {therapist.name.length > 15 
                                  ? `${therapist.name.substring(0, 15)}...`
                                  : therapist.name
                                }
                              </>
                            )}
                          </Button>
                        ))}
                        {therapists.length > 3 && (
                          <div className="text-xs text-gray-400 text-center pt-1">
                            +{therapists.length - 3} terapis lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}