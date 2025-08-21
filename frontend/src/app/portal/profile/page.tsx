'use client';

import React, { useState } from 'react';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { UserRoleEnum } from '@/types/enums';
import { 
  CameraIcon,
  EnvelopeIcon,
  KeyIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

function ProfilePageContent() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
    specializations: '',
    licenseNumber: '',
    experience: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Mock save functionality
    console.log('Saving profile data:', profileData);
    
    addToast({
      type: 'success',
      title: "Profil berhasil diperbarui",
      message: "Informasi profil Anda telah disimpan.",
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      bio: '',
      specializations: '',
      licenseNumber: '',
      experience: ''
    });
    setIsEditing(false);
  };

  const getUserRoleLabel = (roles: string[]) => {
    const roleLabels = {
      [UserRoleEnum.Administrator]: 'Administrator Sistem',
      [UserRoleEnum.ClinicAdmin]: 'Administrator Klinik', 
      [UserRoleEnum.Therapist]: 'Therapist',
    };
    
    return roles.map(role => roleLabels[role as keyof typeof roleLabels] || role).join(', ');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PortalPageWrapper
      title="Profil Saya"
      description="Kelola informasi profil dan pengaturan akun Anda"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback className="text-lg">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <CameraIcon className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle>{user?.name || 'Nama User'}</CardTitle>
              <CardDescription>
                {user?.roles ? getUserRoleLabel(user.roles) : 'User'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <span>{user?.email || '-'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <span>{profileData.phone || 'Belum diisi'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span>{profileData.address || 'Belum diisi'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                <span>Akun terverifikasi</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <KeyIcon className="w-4 h-4 mr-2" />
                Ubah Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Pengaturan Keamanan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Kelola informasi dasar dan profesional Anda
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profil
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Batal
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Simpan
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+62-xxx-xxxx-xxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Alamat lengkap"
                  />
                </div>
              </div>

              {/* Professional Information (for therapists) */}
              {(user?.roles?.includes(UserRoleEnum.Therapist)) && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Informasi Profesional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Nomor Izin Praktik</Label>
                        <Input
                          id="licenseNumber"
                          value={profileData.licenseNumber}
                          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Nomor sertifikat/izin praktik"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Pengalaman (Tahun)</Label>
                        <Input
                          id="experience"
                          value={profileData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Jumlah tahun pengalaman"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="specializations">Spesialisasi</Label>
                      <Textarea
                        id="specializations"
                        value={profileData.specializations}
                        onChange={(e) => handleInputChange('specializations', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Daftar area spesialisasi (contoh: Anxiety, Depression, PTSD, dll.)"
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Bio Section */}
              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Deskripsi Singkat</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Ceritakan tentang diri Anda, background, atau filosofi dalam praktik..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalPageWrapper>
  );
}

export default function ProfilePage() {
  return <ProfilePageContent />;
}