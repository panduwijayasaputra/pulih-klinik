'use client';

import { useState } from 'react';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import { useTherapists } from '@/hooks/useTherapists';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase,
  Calendar,
  Clock,
  Edit,
  FileText,
  GraduationCap,
  Heart,
  Mail, 
  MapPin,
  Phone, 
  TrendingUp,
  User,
  Users
} from 'lucide-react';

interface ClientProfileProps {
  client: Client;
}

export function ClientProfile({ client }: ClientProfileProps) {
  const { updateClient } = useClients();
  const { therapists } = useTherapists();
  const [loading, setLoading] = useState(false);

  const assignedTherapist = client.assignedTherapist 
    ? therapists.find(t => t.id === client.assignedTherapist)
    : null;

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
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleStatusUpdate = async (newStatus: Client['status']) => {
    setLoading(true);
    try {
      await updateClient(client.id, { status: newStatus });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belum ada';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16 bg-primary text-primary-foreground text-xl">
            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
            <p className="text-gray-600">ID: {client.id}</p>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(client.status)}
              <Badge variant="outline">
                {client.gender === 'male' ? 'Laki-laki' : client.gender === 'female' ? 'Perempuan' : 'Lainnya'}
              </Badge>
              <Badge variant="outline">{client.age} tahun</Badge>
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
          <TabsTrigger value="therapy">Terapi</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bergabung</p>
                    <p className="text-lg font-semibold">{formatDate(client.joinDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sesi</p>
                    <p className="text-lg font-semibold">{client.totalSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-lg font-semibold">{client.progress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sesi Terakhir</p>
                    <p className="text-lg font-semibold">
                      {client.lastSession 
                        ? formatDate(client.lastSession)
                        : 'Belum ada'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Terapi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Kemajuan Keseluruhan</span>
                  <span className="font-medium">{client.progress}%</span>
                </div>
                <Progress 
                  value={client.progress} 
                  className="h-3"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Masalah Utama</p>
                  <p className="text-lg">{client.primaryIssue}</p>
                </div>
                
                {assignedTherapist && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Terapis</p>
                    <p className="text-lg">{assignedTherapist.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button 
                  size="sm" 
                  disabled={loading}
                  onClick={() => handleStatusUpdate('active')}
                >
                  Aktifkan
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleStatusUpdate('inactive')}
                >
                  Nonaktifkan
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Tandai Selesai
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Data Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Telepon</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Alamat</p>
                      <p className="font-medium">{client.address}</p>
                      {client.province && (
                        <p className="text-sm text-gray-500">{client.province}</p>
                      )}
                    </div>
                  </div>

                  {client.religion && (
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Agama</p>
                        <p className="font-medium">{client.religion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informasi Profesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Pekerjaan</p>
                    <p className="font-medium">{client.occupation}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Pendidikan</p>
                    <p className="font-medium">{client.education}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {client.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kontak Darurat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{client.emergencyContact.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="font-medium">{client.emergencyContact.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Hubungan</p>
                    <p className="font-medium">{client.emergencyContact.relationship}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Therapy Tab */}
        <TabsContent value="therapy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informasi Terapi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Masalah Utama</p>
                  <p className="text-lg">{client.primaryIssue}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Status Terapi</p>
                  {getStatusBadge(client.status)}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Progress Keseluruhan</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kemajuan</span>
                    <span className="font-medium">{client.progress}%</span>
                  </div>
                  <Progress 
                    value={client.progress} 
                    className={`h-3 ${getProgressColor(client.progress)}`}
                  />
                </div>
              </div>

              {client.notes && (
                <>
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Catatan</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Sesi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Fitur riwayat sesi akan tersedia</p>
                <p className="text-sm text-gray-400">
                  Data sesi terapi dan catatan progress akan ditampilkan di sini
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}