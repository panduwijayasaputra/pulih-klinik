'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/ui/toast';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { UserRoleEnum } from '@/types/enums';
import { profileSchema, type ProfileFormData } from '@/schemas/profileSchema';
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
  const { profile, loading, error, updateProfile, uploadAvatar } = useProfile(user?.id);
  const { addToast } = useToast();
  const { isOpen: confirmDialogOpen, config: confirmConfig, openDialog: openConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmationDialog();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: undefined,
      address: undefined,
      bio: undefined
    }
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || ''
      } as ProfileFormData);
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    // Show confirmation dialog before submitting
    openConfirmDialog({
      title: 'Konfirmasi Perubahan Profil',
      description: 'Apakah Anda yakin ingin menyimpan perubahan profil?',
      variant: 'info',
      confirmText: 'Ya, Simpan Perubahan',
      cancelText: 'Batal',
      children: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Perubahan yang akan disimpan:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Lengkap:</span>
                <span className="text-gray-900 font-medium">{data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{data.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telepon:</span>
                <span className="text-gray-900">{data.phone || 'Tidak diisi'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alamat:</span>
                <span className="text-gray-900">{data.address || 'Tidak diisi'}</span>
              </div>
              {data.bio && (
                <div className="border-t border-gray-200 pt-2">
                  <span className="text-sm font-medium text-gray-600">Bio:</span>
                  <p className="text-sm text-gray-800 mt-1 bg-white rounded p-2 border max-h-20 overflow-y-auto">
                    {data.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
            ℹ️ Perubahan akan langsung terlihat di profil Anda di seluruh sistem.
          </div>
        </div>
      ),
      onConfirm: () => performSubmit(data)
    });
  };

  const performSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      // Filter out undefined values
      const cleanData = {
        name: data.name,
        email: data.email,
        ...(data.phone && { phone: data.phone }),
        ...(data.address && { address: data.address }),
        ...(data.bio && { bio: data.bio }),
      };
      await updateProfile(cleanData);
      addToast({
        type: 'success',
        title: "Profil Berhasil Diperbarui",
        message: "Informasi profil Anda telah disimpan dan akan terlihat di seluruh sistem.",
        duration: 5000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: "Gagal memperbarui profil",
        message: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || ''
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      await uploadAvatar(file);
      addToast({
        type: 'success',
        title: "Avatar berhasil diperbarui",
        message: "Foto profil Anda telah diperbarui.",
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: "Gagal memperbarui avatar",
        message: error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah foto.",
      });
    }
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
    <PageWrapper
      title="Profil Saya"
      description="Kelola informasi profil dan pengaturan akun Anda"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat profil...</span>
                </div>
              ) : error ? (
                <div className="text-red-600 mb-4">
                  <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Gagal memuat profil</h3>
                  <p className="text-sm">{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-2">
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile?.avatar || ''} alt={profile?.name || 'User'} />
                      <AvatarFallback className="text-lg">
                        {profile?.name ? getInitials(profile.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        asChild
                      >
                        <div>
                          <CameraIcon className="w-4 h-4" />
                        </div>
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <CardTitle>{profile?.name || 'Nama User'}</CardTitle>
                  <CardDescription>
                    {user?.roles ? getUserRoleLabel(user.roles) : 'User'}
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? null : error ? null : (
                <>
                  <div className="flex items-center space-x-3 text-sm">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                    <span>{profile?.email || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span>{profile?.phone || 'Belum diisi'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <span>{profile?.address || 'Belum diisi'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                    <span>Akun terverifikasi</span>
                  </div>
                </>
              )}
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
              <div>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Kelola informasi dasar dan profesional Anda
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat form profil...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">
                    <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Gagal memuat profil</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                  <Button onClick={() => window.location.reload()}>
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Masukkan nama lengkap"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="user@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="+62-xxx-xxxx-xxxx"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Input
                        id="address"
                        {...register('address')}
                        placeholder="Alamat lengkap"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="border-t pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / Deskripsi Singkat</Label>
                      <Textarea
                        id="bio"
                        {...register('bio')}
                        placeholder="Ceritakan tentang diri Anda, background, atau filosofi dalam praktik..."
                        rows={4}
                      />
                      {errors.bio && (
                        <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="border-t pt-6">
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Reset
                      </Button>
                      <Button type="submit" disabled={isSaving || !isDirty}>
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Menyimpan...
                          </>
                        ) : !isDirty ? (
                          'Tidak Ada Perubahan'
                        ) : (
                          'Simpan Perubahan'
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={closeConfirmDialog}
        {...confirmConfig}
      />
    </PageWrapper>
  );
}

export default function ProfilePage() {
  return <ProfilePageContent />;
}