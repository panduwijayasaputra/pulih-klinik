'use client';

import React, { useState } from 'react';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BuildingOfficeIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

function AdminClinicsPageContent() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for clinics
  const mockClinics = [
    {
      id: '1',
      name: 'Mindful Therapy Center Jakarta',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      phone: '+62-21-1234-5678',
      email: 'admin@mindfultherapy.com',
      status: 'active',
      subscriptionTier: 'professional',
      therapistsCount: 8,
      clientsCount: 156,
      createdAt: '2023-06-15T00:00:00Z',
      lastActivity: '2024-01-14T10:30:00Z'
    },
    {
      id: '2', 
      name: 'Harmony Hypnotherapy Surabaya',
      address: 'Jl. Basuki Rahmat No. 456, Surabaya',
      phone: '+62-31-9876-5432',
      email: 'contact@harmonyhypno.id',
      status: 'active',
      subscriptionTier: 'basic',
      therapistsCount: 3,
      clientsCount: 87,
      createdAt: '2023-08-22T00:00:00Z',
      lastActivity: '2024-01-13T15:20:00Z'
    },
    {
      id: '3',
      name: 'Serenity Mind Clinic Bandung',
      address: 'Jl. Braga No. 789, Bandung',
      phone: '+62-22-5555-1234',
      email: 'info@serenitymind.com',
      status: 'suspended',
      subscriptionTier: 'professional',
      therapistsCount: 5,
      clientsCount: 42,
      createdAt: '2023-04-10T00:00:00Z',
      lastActivity: '2024-01-05T09:15:00Z'
    },
    {
      id: '4',
      name: 'Peaceful Therapy Medan',
      address: 'Jl. Gatot Subroto No. 321, Medan',
      phone: '+62-61-7777-8888',
      email: 'admin@peacefultherapy.id',
      status: 'pending',
      subscriptionTier: 'basic',
      therapistsCount: 2,
      clientsCount: 15,
      createdAt: '2024-01-10T00:00:00Z',
      lastActivity: '2024-01-14T08:45:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Aktif' },
      suspended: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Suspended' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon, label: 'Pending' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, label: 'Tidak Aktif' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      basic: { color: 'bg-blue-100 text-blue-800', label: 'Basic' },
      professional: { color: 'bg-purple-100 text-purple-800', label: 'Professional' },
      enterprise: { color: 'bg-orange-100 text-orange-800', label: 'Enterprise' }
    };

    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.basic;
    
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredClinics = mockClinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = (
    <Button className="flex items-center">
      <PlusIcon className="w-4 h-4 mr-2" />
      Tambah Klinik Baru
    </Button>
  );

  // Stats calculation
  const stats = {
    total: mockClinics.length,
    active: mockClinics.filter(c => c.status === 'active').length,
    suspended: mockClinics.filter(c => c.status === 'suspended').length,
    pending: mockClinics.filter(c => c.status === 'pending').length
  };

  return (
    <PortalPageWrapper
      title="Manajemen Klinik"
      description="Kelola semua klinik yang terdaftar dalam sistem"
      actions={headerActions}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Klinik</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-gray-600">Aktif</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                <p className="text-sm text-gray-600">Suspended</p>
              </div>
              <XCircleIcon className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari klinik berdasarkan nama, alamat, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinics List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Klinik</CardTitle>
          <CardDescription>
            Semua klinik yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClinics.map((clinic) => (
              <div 
                key={clinic.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{clinic.name}</h4>
                      {getStatusBadge(clinic.status)}
                      {getTierBadge(clinic.subscriptionTier)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {clinic.address}
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-1" />
                        {clinic.email}
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-1" />
                        {clinic.phone}
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-1" />
                        {clinic.therapistsCount} Therapist, {clinic.clientsCount} Klien
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <span>Bergabung: {new Date(clinic.createdAt).toLocaleDateString('id-ID')}</span>
                      <span>Aktivitas Terakhir: {new Date(clinic.lastActivity).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Lihat Detail
                  </Button>
                  {clinic.status === 'pending' && (
                    <>
                      <Button size="sm">
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm">
                        Tolak
                      </Button>
                    </>
                  )}
                  {clinic.status === 'active' && (
                    <Button variant="outline" size="sm">
                      Suspend
                    </Button>
                  )}
                  {clinic.status === 'suspended' && (
                    <Button size="sm">
                      Aktifkan
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredClinics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BuildingOfficeIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {searchTerm ? 'Tidak Ada Hasil Pencarian' : 'Belum Ada Klinik Terdaftar'}
              </p>
              <p className="mb-4">
                {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Belum ada klinik yang terdaftar dalam sistem'}
              </p>
              {!searchTerm && (
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Tambah Klinik Baru
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </PortalPageWrapper>
  );
}

export default function AdminClinicsPage() {
  return <AdminClinicsPageContent />;
}