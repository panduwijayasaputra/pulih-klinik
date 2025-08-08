'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTherapists } from '@/hooks/useTherapists';
import { TherapistFilters, THERAPIST_SPECIALIZATIONS, LICENSE_TYPES, EMPLOYMENT_TYPES, THERAPIST_STATUS } from '@/types/therapist';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  StarIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface TherapistListProps {
  className?: string;
  onCreateNew?: () => void;
  onViewTherapist?: (therapistId: string) => void;
  onEditTherapist?: (therapistId: string) => void;
  onDeleteTherapist?: (therapistId: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatYearsExperience = (years: number) => {
  return years === 1 ? '1 tahun' : `${years} tahun`;
};

const getSpecializationLabel = (specId: string) => {
  const spec = THERAPIST_SPECIALIZATIONS.find(s => s.id === specId);
  return spec ? spec.name : specId;
};

const getLicenseTypeLabel = (type: string) => {
  const licenseType = LICENSE_TYPES.find(lt => lt.value === type);
  return licenseType ? licenseType.label : type;
};

const getEmploymentTypeLabel = (type: string) => {
  const empType = EMPLOYMENT_TYPES.find(et => et.value === type);
  return empType ? empType.label : type;
};

const getStatusInfo = (status: string) => {
  const statusInfo = THERAPIST_STATUS.find(s => s.value === status);
  return statusInfo || { value: status, label: status, color: 'gray' };
};

export const TherapistList: React.FC<TherapistListProps> = ({ 
  className = '', 
  onCreateNew,
  onViewTherapist,
  onEditTherapist,
  onDeleteTherapist 
}) => {
  const { therapists, isLoading, error, fetchTherapists, deleteTherapist, clearError } = useTherapists();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TherapistFilters>({
    searchQuery: '',
    status: [],
    specializations: [],
    employmentType: [],
    licenseType: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Apply filters when they change
  useEffect(() => {
    fetchTherapists(filters);
  }, [filters, fetchTherapists]);

  const handleFilterChange = (key: keyof TherapistFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterToggle = (key: keyof TherapistFilters, value: string) => {
    setFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: [],
      specializations: [],
      employmentType: [],
      licenseType: [],
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const handleDelete = async (therapistId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus therapist ini?')) {
      const success = await deleteTherapist(therapistId);
      if (success && onDeleteTherapist) {
        onDeleteTherapist(therapistId);
      }
    }
  };

  const hasActiveFilters = filters.status?.length || filters.specializations?.length || 
    filters.employmentType?.length || filters.licenseType?.length || filters.searchQuery;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Daftar Therapist</CardTitle>
              <CardDescription>
                Kelola therapist dan tim profesional di klinik Anda
              </CardDescription>
            </div>
          </div>
          {onCreateNew && (
            <Button onClick={onCreateNew} size="sm">
              <PlusIcon className="w-4 h-4 mr-1" />
              Tambah Therapist
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama, email, atau nomor lisensi..."
                value={filters.searchQuery || ''}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}
              >
                <FunnelIcon className="w-4 h-4 mr-1" />
                Filter
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {(filters.status?.length || 0) + (filters.specializations?.length || 0) + 
                     (filters.employmentType?.length || 0) + (filters.licenseType?.length || 0)}
                  </Badge>
                )}
                {showFilters ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />}
              </Button>
              
              <Select 
                value={`${filters.sortBy}-${filters.sortOrder}`} 
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Nama A-Z</SelectItem>
                  <SelectItem value="name-desc">Nama Z-A</SelectItem>
                  <SelectItem value="joinDate-desc">Terbaru Bergabung</SelectItem>
                  <SelectItem value="joinDate-asc">Terlama Bergabung</SelectItem>
                  <SelectItem value="clientCount-desc">Klien Terbanyak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Filter Lanjutan</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Hapus Semua Filter
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="space-y-2">
                    {THERAPIST_STATUS.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={filters.status?.includes(status.value as any) || false}
                          onCheckedChange={() => handleArrayFilterToggle('status', status.value)}
                        />
                        <label htmlFor={`status-${status.value}`} className="text-sm cursor-pointer">
                          {status.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employment Type Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipe Pekerjaan</Label>
                  <div className="space-y-2">
                    {EMPLOYMENT_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`employment-${type.value}`}
                          checked={filters.employmentType?.includes(type.value as any) || false}
                          onCheckedChange={() => handleArrayFilterToggle('employmentType', type.value)}
                        />
                        <label htmlFor={`employment-${type.value}`} className="text-sm cursor-pointer">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* License Type Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipe Lisensi</Label>
                  <div className="space-y-2">
                    {LICENSE_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`license-${type.value}`}
                          checked={filters.licenseType?.includes(type.value as any) || false}
                          onCheckedChange={() => handleArrayFilterToggle('licenseType', type.value)}
                        />
                        <label htmlFor={`license-${type.value}`} className="text-sm cursor-pointer">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialization Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Spesialisasi</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {THERAPIST_SPECIALIZATIONS.slice(0, 5).map((spec) => (
                      <div key={spec.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${spec.id}`}
                          checked={filters.specializations?.includes(spec.id) || false}
                          onCheckedChange={() => handleArrayFilterToggle('specializations', spec.id)}
                        />
                        <label htmlFor={`spec-${spec.id}`} className="text-sm cursor-pointer">
                          {spec.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{therapists.length}</p>
                <p className="text-xs text-blue-700">Total Therapist</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {therapists.filter(t => t.status === 'active').length}
                </p>
                <p className="text-xs text-green-700">Aktif</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">
                  {therapists.filter(t => t.employmentType === 'full_time').length}
                </p>
                <p className="text-xs text-yellow-700">Full Time</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {therapists.reduce((sum, t) => sum + t.currentLoad, 0)}
                </p>
                <p className="text-xs text-purple-700">Total Klien</p>
              </div>
            </div>
          </div>
        </div>

        {/* Therapist List */}
        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && therapists.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                {hasActiveFilters ? 'Tidak ada therapist yang sesuai dengan filter' : 'Belum ada therapist yang terdaftar'}
              </p>
              <p className="text-sm text-gray-400">
                {hasActiveFilters ? 'Coba ubah atau hapus filter pencarian' : 'Klik "Tambah Therapist" untuk menambah therapist pertama'}
              </p>
            </div>
          )}

          {!isLoading && therapists.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {therapists.map((therapist) => {
                const statusInfo = getStatusInfo(therapist.status);
                const workloadPercentage = (therapist.currentLoad / therapist.maxClients) * 100;
                
                return (
                  <div key={therapist.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={therapist.avatar} alt={therapist.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(therapist.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{therapist.name}</h3>
                            <Badge 
                              variant={statusInfo.color === 'green' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {statusInfo.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <AcademicCapIcon className="w-4 h-4" />
                              <span>{getLicenseTypeLabel(therapist.licenseType)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>{formatYearsExperience(therapist.yearsOfExperience)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserIcon className="w-4 h-4" />
                              <span>{getEmploymentTypeLabel(therapist.employmentType)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UsersIcon className="w-4 h-4" />
                              <span>{therapist.currentLoad}/{therapist.maxClients} klien</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Spesialisasi:</p>
                            <div className="flex flex-wrap gap-1">
                              {therapist.specializations.slice(0, 3).map((specId) => (
                                <Badge key={specId} variant="outline" className="text-xs">
                                  {getSpecializationLabel(specId)}
                                </Badge>
                              ))}
                              {therapist.specializations.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{therapist.specializations.length - 3} lainnya
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Workload Progress */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Beban Kerja</span>
                              <span className="text-xs text-gray-600">{Math.round(workloadPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  workloadPercentage >= 90 
                                    ? 'bg-red-500' 
                                    : workloadPercentage >= 70 
                                      ? 'bg-yellow-500' 
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${workloadPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {onViewTherapist && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewTherapist(therapist.id)}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        )}
                        {onEditTherapist && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditTherapist(therapist.id)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                        )}
                        {onDeleteTherapist && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(therapist.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Load More / Pagination could go here */}
        {!isLoading && therapists.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Menampilkan {therapists.length} therapist
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};