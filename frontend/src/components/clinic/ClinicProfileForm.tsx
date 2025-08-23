'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClinicProfileFormData, type ClinicProfileFormValidation } from '@/types/clinic';
import { clinicProfileFormSchema } from '@/schemas/clinicSchema';
import { useClinic } from '@/hooks/useClinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ClinicProfileFormProps {
  onSaveSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export const ClinicProfileForm: React.FC<ClinicProfileFormProps> = ({
  onSaveSuccess,
  onCancel,
  showActions = true
}) => {
  const { clinic, isLoading, error, updateClinic, uploadLogo, clearError } = useClinic();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<ClinicProfileFormValidation>({
    resolver: zodResolver(clinicProfileFormSchema),
    defaultValues: {
      name: clinic?.name || '',
      address: clinic?.address || '',
      phone: clinic?.phone || '',
      email: clinic?.email || '',
      website: clinic?.website || '',
      description: clinic?.description || '',
      workingHours: clinic?.workingHours || ''
    }
  });

  // Update form when clinic data loads
  React.useEffect(() => {
    if (clinic) {
      reset({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website || '',
        description: clinic.description || '',
        workingHours: clinic.workingHours || ''
      });
    }
  }, [clinic, reset]);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Format file harus JPG atau PNG');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ClinicProfileFormValidation) => {
    clearError();

    try {
      // Prepare form data
      const formData: ClinicProfileFormData = {
        ...data,
        website: data.website ?? '',
        description: data.description ?? '',
        workingHours: data.workingHours ?? '',
        // Ensure logo is always a File (never undefined) to match ClinicProfileFormData type
        logo: fileInputRef.current?.files?.[0] ?? (clinic?.logo as unknown as File)
      };

      const success = await updateClinic(formData);
      
      if (success) {
        onSaveSuccess?.();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    reset();
    setLogoPreview(null);
    onCancel?.();
  };

  if (isLoading && !clinic) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data klinik...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BuildingOfficeIcon className="w-5 h-5" /> Profil Klinik</CardTitle>
        <CardDescription>
          Kelola informasi dasar klinik Anda. Pastikan data yang diisi akurat dan terkini.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button 
                variant="link" 
                className="text-red-600 p-0" 
                onClick={clearError}
              >
                ✕
              </Button>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Logo Klinik</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={logoPreview || clinic?.logo || '/placeholder-logo.png'}
                  alt="Logo klinik"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100">
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  Pilih Logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500">
                  Format: JPG, PNG. Maksimal 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Klinik *
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Masukkan nama klinik"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Nomor Telepon *
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+628123456789"
                className={errors.phone ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Klinik *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="info@klinik.com"
                className={errors.email ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium">
                Website Klinik
              </Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://www.klinik.com"
                className={errors.website ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.website && (
                <p className="text-sm text-red-600">{errors.website.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Alamat Lengkap *
            </Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Masukkan alamat lengkap klinik"
              className={`min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <Label htmlFor="workingHours" className="text-sm font-medium">
              Jam Operasional
            </Label>
            <Input
              id="workingHours"
              {...register('workingHours')}
              placeholder="Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 14:00"
              className={errors.workingHours ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.workingHours && (
              <p className="text-sm text-red-600">{errors.workingHours.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Deskripsi Klinik
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Ceritakan tentang klinik Anda, layanan yang ditawarkan, dan keunggulan yang dimiliki"
              className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="text-sm text-gray-500">
              {watch('description')?.length || 0}/1000 karakter
            </p>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Batal
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};