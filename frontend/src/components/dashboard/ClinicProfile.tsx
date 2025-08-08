'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useClinic } from '@/hooks/useClinic';
import { ClinicFormData } from '@/types/clinic';
import { 
  BuildingOfficeIcon,
  CameraIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface ClinicProfileProps {
  className?: string;
}

export const ClinicProfile: React.FC<ClinicProfileProps> = ({ className = '' }) => {
  const { clinic, isLoading, error, updateClinic, uploadLogo, clearError } = useClinic();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<ClinicFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when clinic data is loaded
  useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website || '',
        description: clinic.description || ''
      });
    }
  }, [clinic]);

  const validateForm = (): boolean => {
    const errors: Partial<ClinicFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nama klinik wajib diisi';
    }

    if (!formData.address.trim()) {
      errors.address = 'Alamat klinik wajib diisi';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.phone)) {
      errors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (formData.website && !/^https?:\/\/.+$/.test(formData.website)) {
      errors.website = 'Website harus dimulai dengan http:// atau https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ClinicFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const success = await updateClinic(formData);
    
    if (success) {
      setIsEditing(false);
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (clinic) {
      setFormData({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website || '',
        description: clinic.description || ''
      });
    }
    setFormErrors({});
    setIsEditing(false);
    clearError();
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert('Ukuran file maksimal 2MB');
        return;
      }

      await uploadLogo(file);
    }
  };



  if (!clinic) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Profil Klinik</CardTitle>
              <CardDescription>
                Kelola informasi dasar klinik Anda
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Logo Section */}
        <div className="space-y-3">
          <Label>Logo Klinik</Label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {clinic.logo ? (
                <img
                  src={clinic.logo}
                  alt="Logo klinik"
                  className="w-full h-full object-cover"
                />
              ) : (
                <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isLoading}
              />
              <Label
                htmlFor="logo-upload"
                className={`cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CameraIcon className="w-4 h-4 mr-2" />
                {isLoading ? 'Mengunggah...' : 'Ubah Logo'}
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Max 2MB, format: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Clinic Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Klinik *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing || isSubmitting}
              className={formErrors.name ? 'border-red-500' : ''}
            />
            {formErrors.name && (
              <p className="text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Klinik *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing || isSubmitting}
              className={formErrors.address ? 'border-red-500' : ''}
              rows={3}
            />
            {formErrors.address && (
              <p className="text-sm text-red-600">{formErrors.address}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing || isSubmitting}
                className={formErrors.phone ? 'border-red-500' : ''}
                placeholder="+62-21-1234-5678"
              />
              {formErrors.phone && (
                <p className="text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Klinik *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing || isSubmitting}
                className={formErrors.email ? 'border-red-500' : ''}
                placeholder="info@klinik.com"
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website Klinik</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              disabled={!isEditing || isSubmitting}
              className={formErrors.website ? 'border-red-500' : ''}
              placeholder="https://klinik.com"
            />
            {formErrors.website && (
              <p className="text-sm text-red-600">{formErrors.website}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Klinik</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isEditing || isSubmitting}
              rows={3}
              placeholder="Ceritakan tentang klinik Anda..."
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </div>
          )}
        </form>

        {/* Clinic Stats */}
        {!isEditing && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Bergabung sejak</p>
                <p className="font-medium">
                  {new Date(clinic.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Terakhir diperbarui</p>
                <p className="font-medium">
                  {new Date(clinic.updatedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};