'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { phoneValidation } from '@/lib/validation/phone';
import { licenseValidation } from '@/lib/validation/license';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormModal } from '@/components/ui/form-modal';
import { TherapistLicenseTypeEnum } from '@/types/enums';
import { TherapistFormData } from '@/types/therapist';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  UserIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth';
import { TherapistAPI } from '@/lib/api/therapist';
import ConfirmationDialog, { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import { UserRole } from '@/types/auth';

// Validation schema (NO PASSWORD FIELDS)
const TherapistRegistrationSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: phoneValidation,
  avatarUrl: z.string().url('Format URL tidak valid').optional().or(z.literal('')),

  // Professional Information
  licenseNumber: licenseValidation,
  education: z.string().min(1, 'Pendidikan wajib diisi'),
  certifications: z.string().optional(),

  // Enums (required)
  licenseType: z.nativeEnum(TherapistLicenseTypeEnum, {
    error: 'Tipe lisensi wajib dipilih'
  }),

  // Clinic admin notes (optional)
  adminNotes: z.string().max(500, 'Catatan maksimal 500 karakter').optional()
});

type TherapistRegistrationForm = z.infer<typeof TherapistRegistrationSchema>;

export interface TherapistFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  therapistId?: string;
  defaultValues?: Partial<TherapistRegistrationForm>;
  onSubmitSuccess?: (data: TherapistRegistrationForm) => void;
  onCancel?: () => void;
}

export const TherapistFormModal: React.FC<TherapistFormModalProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  therapistId,
  defaultValues,
  onSubmitSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTherapist, setIsLoadingTherapist] = useState(mode === 'edit');
  const [loading, setLoading] = useState(false);
  const [createOwnTherapist, setCreateOwnTherapist] = useState(false);
  const [currentTherapistData, setCurrentTherapistData] = useState<any>(null);
  const { user, checkAuth } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, touchedFields },
    reset,
    watch,
    setValue,
    setError,
  } = useForm<TherapistRegistrationForm>({
    resolver: zodResolver(TherapistRegistrationSchema),
    mode: 'onChange'
  });

  const watchedFormData = watch();

  // Check if current user is clinic admin without therapist profile
  const isClinicAdminWithoutTherapist = useMemo(() => {
    if (!user?.roles || !user?.id) return false;
    
    const hasClinicAdminRole = user.roles.some(role => 
      role === 'clinic_admin' || role === 'CLINIC_ADMIN'
    );
    const hasTherapistRole = user.roles.some(role => 
      role === 'therapist' || role === 'THERAPIST'
    );
    
    // User is clinic admin but doesn't have therapist role
    return hasClinicAdminRole && !hasTherapistRole;
  }, [user?.roles, user?.id]);

  // Prefill form data when creating own therapist profile
  useEffect(() => {
    if (createOwnTherapist && isClinicAdminWithoutTherapist && user) {
      console.log('Prefilling form with profile data:', { 
        profile, 
        user, 
        profileLoading,
        profilePhone: profile?.phone,
        userName: user.name,
        userEmail: user.email 
      });
      
      // Prefill form with user's existing data
      const fullName = profile?.name || user.name || user.email?.split('@')[0] || '';
      // For phone, we'll use a placeholder since profile is null
      const phone = profile?.phone || '';
      const email = user.email || '';
      
      console.log('About to set form values:', { fullName, phone, email });
      
      // Use setTimeout to ensure the form is ready
      setTimeout(() => {
        setValue('fullName', fullName, { shouldValidate: true, shouldDirty: true });
        setValue('phone', phone, { shouldValidate: true, shouldDirty: true });
        setValue('email', email, { shouldValidate: true, shouldDirty: true });
        
        console.log('Form values set after timeout:', { fullName, phone, email });
      }, 100);
      
      // Set default values for professional fields if not already set
      if (!watch('licenseNumber')) {
        setValue('licenseNumber', '', { shouldValidate: false });
      }
      if (!watch('education')) {
        setValue('education', '', { shouldValidate: false });
      }
    } else if (!createOwnTherapist && isClinicAdminWithoutTherapist) {
      // Clear prefilled data when unchecking the checkbox
      setValue('fullName', '', { shouldValidate: false });
      setValue('phone', '', { shouldValidate: false });
      setValue('email', '', { shouldValidate: false });
    }
  }, [createOwnTherapist, isClinicAdminWithoutTherapist, user, profile, profileLoading, setValue, watch]);

  // Additional effect to handle profile loading after checkbox is checked
  useEffect(() => {
    if (createOwnTherapist && isClinicAdminWithoutTherapist && profile && !profileLoading) {
      console.log('Profile loaded, updating phone field:', profile.phone);
      if (profile.phone) {
        setValue('phone', profile.phone, { shouldValidate: true, shouldDirty: true });
        console.log('Phone field updated with profile phone:', profile.phone);
      }
    }
  }, [profile, profileLoading, createOwnTherapist, isClinicAdminWithoutTherapist, setValue]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      // Reset createOwnTherapist state and clear therapist data
      setCreateOwnTherapist(false);
      setCurrentTherapistData(null);
      
      if (mode === 'edit' && therapistId) {
        // Load therapist data for edit mode
        const loadTherapistData = async () => {
          setIsLoadingTherapist(true);
          try {
            // Fetch fresh therapist data from API
            const therapistData = await TherapistAPI.getRawTherapist(therapistId);
            
            // Store therapist data for later use
            setCurrentTherapistData(therapistData);
            
            // Reset with fetched therapist data
            reset({
              fullName: therapistData.name || '',
              email: therapistData.email || '',
              phone: therapistData.phone || '',
              licenseNumber: therapistData.licenseNumber || '',
              education: therapistData.education || '',
              certifications: therapistData.certifications || '',
              adminNotes: therapistData.adminNotes || '',
              licenseType: therapistData.licenseType || TherapistLicenseTypeEnum.Psychologist,
            });
          } catch (error: any) {
            console.error('Failed to load therapist data:', error);
            addToast({
              type: 'error',
              title: 'Gagal Memuat Data',
              message: error.response?.data?.message || 'Gagal memuat data therapist. Silakan coba lagi.'
            });
            // Fallback to default values on error
            reset({
              fullName: '',
              email: '',
              phone: '',
              licenseNumber: '',
              education: '',
              certifications: '',
              adminNotes: '',
              licenseType: TherapistLicenseTypeEnum.Psychologist,
            });
          } finally {
            setIsLoadingTherapist(false);
          }
        };

        loadTherapistData();
      } else {
        // Reset form for create mode
        reset({
          fullName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          education: '',
          certifications: '',
          adminNotes: '',
          licenseType: TherapistLicenseTypeEnum.Psychologist,
          ...defaultValues,
        });
        setIsLoadingTherapist(false);
      }
    }
  }, [open, mode, therapistId, defaultValues, reset]);


  // Remove the old specializations mapping since we now use THERAPIST_SPECIALIZATIONS directly



  const handleFormSubmit = (data: TherapistRegistrationForm) => {
    if (!user || !user.roles.includes('clinic_admin' as UserRole)) {
      addToast({
        type: 'error',
        title: 'Akses Ditolak',
        message: `Hanya administrator klinik yang dapat ${mode === 'edit' ? 'mengedit' : 'mendaftarkan'} therapist`
      });
      return;
    }

    const isCreatingOwnProfile = createOwnTherapist && isClinicAdminWithoutTherapist;
    const titleText = mode === 'edit' ? 'Perbarui Akun Therapist' : 
                     isCreatingOwnProfile ? 'Buat Profil Therapist Saya' : 'Buat Akun Therapist';
    const confirmText = mode === 'edit' ? 'Perbarui Akun' : 
                       isCreatingOwnProfile ? 'Buat Profil Saya' : 'Buat Akun';

    openDialog({
      title: titleText,
      description: mode === 'edit' 
        ? `Apakah Anda yakin ingin memperbarui data therapist berikut?`
        : isCreatingOwnProfile
        ? `Apakah Anda yakin ingin membuat profil therapist untuk diri sendiri dengan data berikut?`
        : `Apakah Anda yakin ingin membuat akun therapist baru dengan data berikut?`,
      confirmText: confirmText,
      cancelText: 'Tinjau Kembali',
      variant: mode === 'edit' ? 'info' : 'create',
      children: (
        <div className="space-y-3 py-2">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Nama:</span>
              <span className="text-sm font-semibold text-gray-900">{data.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm font-semibold text-gray-900">{data.email}</span>
            </div>
            {mode === 'create' && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Nomor Lisensi:</span>
                <span className="text-sm font-semibold text-gray-900">{data.licenseNumber}</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            {mode === 'edit' 
              ? '✏️ Perubahan akan diterapkan segera setelah dikonfirmasi.'
              : isCreatingOwnProfile
              ? '👤 Profil therapist akan dibuat untuk akun Anda. Anda akan dapat ditugaskan sebagai therapist untuk klien.'
              : `📧 Email registrasi akan dikirim ke ${data.email} dengan tautan aman untuk menyelesaikan pengaturan kata sandi.`
            }
          </div>
        </div>
      ),
      onConfirm: () => submitForm(data)
    });
  };

  const submitForm = async (data: TherapistRegistrationForm) => {
    if (!user) {
      addToast({
        type: 'error',
        title: 'Kesalahan Autentikasi',
        message: 'Sesi pengguna tidak ditemukan. Silakan masuk kembali.'
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      if (mode === 'edit' && therapistId) {
        // Update existing therapist
        const result = await TherapistAPI.updateTherapist(therapistId, {
          fullName: data.fullName,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          licenseNumber: data.licenseNumber,
          licenseType: data.licenseType,
          timezone: 'Asia/Jakarta',
          education: data.education,
          certifications: data.certifications,
          adminNotes: data.adminNotes,
          preferences: {
            languages: ['Indonesian']
          }
        } as Partial<TherapistFormData>);

        if (result.success) {
          // Check if user is editing their own therapist profile
          const isEditingOwnProfile = currentTherapistData && currentTherapistData.userId === user.id;
          
          if (isEditingOwnProfile) {
            // Update auth store with new user data
            const { setUser } = useAuthStore.getState();
            const updatedUser = {
              ...user,
              name: data.fullName, // Update name in auth store
            };
            setUser(updatedUser);
            
            addToast({
              type: 'success',
              title: 'Data Therapist Berhasil Diperbarui!',
              message: 'Informasi therapist dan profil Anda telah berhasil diperbarui.',
              duration: 5000,
            });
          } else {
            addToast({
              type: 'success',
              title: 'Data Therapist Berhasil Diperbarui!',
              message: 'Informasi therapist telah berhasil diperbarui.',
              duration: 5000,
            });
          }

          onSubmitSuccess?.(data);
          onOpenChange(false);
        } else {
          addToast({
            type: 'error',
            title: 'Pembaruan Gagal',
            message: result.message || 'Gagal memperbarui data therapist. Silakan coba lagi.'
          });
          setError('root', { message: result.message || 'Gagal memperbarui data therapist' });
        }
      } else {
        // Create new therapist
        if (createOwnTherapist && isClinicAdminWithoutTherapist) {
          // Create therapist profile for current user
          const result = await TherapistAPI.createTherapistForExistingUser(
            user.id,
            data.licenseNumber,
            data.licenseType,
            new Date().toISOString(),
            data.education,
            data.certifications,
            data.adminNotes
          );

          if (result.success) {
            console.log('✅ Therapist creation successful');
            console.log('API Response:', result);
            console.log('Roles changed flag:', (result as any).rolesChanged);
            
            addToast({
              type: 'success',
              title: 'Profil Therapist Berhasil Dibuat!',
              message: 'Profil therapist Anda telah berhasil dibuat. Silakan login ulang untuk menggunakan fitur therapist.',
              duration: 8000,
            });

            // Check if roles have changed and update user data
            if ((result as any).rolesChanged) {
              try {
                console.log('🔄 Roles changed detected, updating user roles...');
                console.log('Current user roles:', user?.roles);
                console.log('User has therapist role:', user?.roles.includes('therapist'));
                
                // Update user roles in the store directly
                if (user && !user.roles.includes('therapist')) {
                  const updatedUser = {
                    ...user,
                    roles: [...user.roles, 'therapist']
                  };
                  console.log('Updated user roles:', updatedUser.roles);
                  
                  // Update the user in the auth store
                  const { setUser } = useAuthStore.getState();
                  setUser(updatedUser);
                  
                  console.log('✅ User roles updated in auth store');
                } else {
                  console.log('ℹ️ User already has therapist role or no user found');
                }
                
                addToast({
                  type: 'info',
                  title: 'Peran Diperbarui',
                  message: 'Peran therapist telah ditambahkan ke akun Anda. Silakan login ulang untuk menggunakan fitur therapist.',
                  duration: 6000,
                });
              } catch (error) {
                console.error('❌ Failed to update user roles after therapist creation:', error);
                addToast({
                  type: 'warning',
                  title: 'Perhatian',
                  message: 'Profil therapist berhasil dibuat. Silakan login ulang untuk menggunakan fitur therapist.',
                  duration: 6000,
                });
              }
            } else {
              console.log('ℹ️ No roles changed detected');
            }

            onSubmitSuccess?.(data);
            onOpenChange(false);
          } else {
            addToast({
              type: 'error',
              title: 'Pembuatan Profil Gagal',
              message: result.message || 'Gagal membuat profil therapist. Silakan coba lagi.'
            });
            setError('root', { message: result.message || 'Gagal membuat profil therapist' });
          }
        } else {
          // Create new therapist (normal flow)
          const result = await TherapistAPI.createTherapist({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            avatarUrl: data.avatarUrl,
            licenseNumber: data.licenseNumber,
            licenseType: data.licenseType,
            education: data.education,
            certifications: data.certifications,
            adminNotes: data.adminNotes,
            preferences: {
              languages: ['Indonesian']
            }
          } as TherapistFormData);

          if (result.success) {
            addToast({
              type: 'success',
              title: 'Akun Therapist Berhasil Dibuat!',
              message: `Email registrasi telah dikirim ke ${data.email}. Therapist akan menerima tautan aman untuk menyelesaikan pendaftaran.`,
              duration: 8000,
            });

            onSubmitSuccess?.(data);
            onOpenChange(false);
          } else {
            addToast({
              type: 'error',
              title: 'Pembuatan Gagal',
              message: result.message || 'Gagal membuat akun therapist. Silakan coba lagi.'
            });
            setError('root', { message: result.message || 'Gagal membuat akun therapist' });
          }
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: `Terjadi kesalahan tak terduga saat ${mode === 'edit' ? 'memperbarui' : 'membuat'} akun therapist`
      });
      setError('root', { message: `Terjadi kesalahan saat ${mode === 'edit' ? 'memperbarui' : 'membuat'} akun therapist` });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const title = mode === 'edit' ? 'Edit Therapist' : 'Daftar Therapist Baru';
  const description = mode === 'edit' 
    ? 'Perbarui informasi therapist. Perubahan akan diterapkan segera.'
    : 'Buat akun therapist baru. Therapist akan menerima email untuk mengatur kata sandi mereka.';

  if (isLoadingTherapist) {
    return (
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        size="2xl"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data therapist...</span>
        </div>
      </FormModal>
    );
  }

  return (
    <>
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        size="2xl"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Informasi Pribadi
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">
                  Nama Lengkap *
                  {createOwnTherapist && watchedFormData.fullName && (
                    <span className="ml-2 text-xs text-green-600">(Diisi otomatis)</span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    {...register('fullName')}
                    id="fullName"
                    placeholder="contoh: Dr. Budi Santoso"
                    disabled={createOwnTherapist}
                    className={`
                      ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}
                      ${touchedFields.fullName && !errors.fullName && watchedFormData.fullName ? 'border-green-500 focus:border-green-500' : ''}
                      ${createOwnTherapist ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                  />
                  {touchedFields.fullName && !errors.fullName && watchedFormData.fullName && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Alamat Email {!createOwnTherapist ? '*' : '(Opsional)'}
                </Label>
                <div className="relative">
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder={createOwnTherapist ? "Email akan menggunakan email akun Anda" : "therapist@contoh.com"}
                    disabled={mode === 'edit' || createOwnTherapist}
                    className={mode === 'edit' || createOwnTherapist ? 'bg-gray-100 cursor-not-allowed' : ''}
                  />
                </div>
                {createOwnTherapist && (
                  <p className="mt-1 text-xs text-blue-600">
                    Email akan menggunakan email akun Anda: {user?.email}
                  </p>
                )}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email?.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">
                  Nomor Telepon *
                  {createOwnTherapist && watchedFormData.phone && (
                    <span className="ml-2 text-xs text-green-600">(Diisi otomatis)</span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    {...register('phone')}
                    id="phone"
                    placeholder="+62-812-3456-7890"
                    disabled={!!(createOwnTherapist && profile?.phone)}
                    className={`
                      ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                      ${touchedFields.phone && !errors.phone && watchedFormData.phone ? 'border-green-500 focus:border-green-500' : ''}
                      ${createOwnTherapist && profile?.phone ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                  />
                  {touchedFields.phone && !errors.phone && watchedFormData.phone && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                {createOwnTherapist && profile?.phone && (
                  <p className="mt-1 text-xs text-green-600">
                    📞 Nomor telepon diisi dari profil Anda
                  </p>
                )}
                {createOwnTherapist && !profile?.phone && (
                  <p className="mt-1 text-xs text-blue-600">
                    ℹ️ Silakan isi nomor telepon secara manual
                  </p>
                )}
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Create Own Therapist Checkbox */}
          {isClinicAdminWithoutTherapist && mode === 'create' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="createOwnTherapist"
                  checked={createOwnTherapist}
                  onChange={(e) => setCreateOwnTherapist(e.target.checked)}
                  disabled={profileLoading}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex-1">
                  <label htmlFor="createOwnTherapist" className="text-sm font-medium text-blue-900 cursor-pointer">
                    Buat profil therapist untuk diri saya sendiri
                    {profileLoading && <span className="ml-2 text-xs text-gray-500">(Memuat data profil...)</span>}
                  </label>
                  <p className="text-sm text-blue-700 mt-1">
                    Centang jika Anda ingin membuat profil therapist untuk diri sendiri. 
                    Ini akan memungkinkan Anda untuk ditugaskan sebagai therapist untuk klien.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Professional Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2" />
              Informasi Profesional
            </h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="licenseNumber">Nomor Lisensi (SIP) *</Label>
                <div className="relative">
                  <Input
                    {...register('licenseNumber')}
                    id="licenseNumber"
                    placeholder="SIP-123456 atau PSI-12345678"
                    className={`
                      ${errors.licenseNumber ? 'border-red-500 focus:border-red-500' : ''}
                      ${touchedFields.licenseNumber && !errors.licenseNumber && watchedFormData.licenseNumber ? 'border-green-500 focus:border-green-500' : ''}
                    `}
                  />
                  {touchedFields.licenseNumber && !errors.licenseNumber && watchedFormData.licenseNumber && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>


              <div>
                <Label>Tipe Lisensi *</Label>
                  <Select
                    value={watch('licenseType')}
                    onValueChange={(value) => {
                      setValue('licenseType', value as any, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Tipe Lisensi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TherapistLicenseTypeEnum.Psychologist}>Psikolog</SelectItem>
                      <SelectItem value={TherapistLicenseTypeEnum.Psychiatrist}>Psikiater</SelectItem>
                      <SelectItem value={TherapistLicenseTypeEnum.Counselor}>Konselor</SelectItem>
                      <SelectItem value={TherapistLicenseTypeEnum.Hypnotherapist}>Hipnoterapis</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.licenseType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      {errors.licenseType.message}
                    </p>
                  )}
              </div>


              <div>
                <Label htmlFor="education">Pendidikan *</Label>
                <div className="relative">
                  <Input
                    {...register('education')}
                    id="education"
                    placeholder="S1 Psikologi, Universitas Indonesia"
                    className={`
                      ${errors.education ? 'border-red-500 focus:border-red-500' : ''}
                      ${touchedFields.education && !errors.education && watchedFormData.education ? 'border-green-500 focus:border-green-500' : ''}
                    `}
                  />
                  {touchedFields.education && !errors.education && watchedFormData.education && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.education && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.education.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="certifications">Sertifikasi (Opsional)</Label>
                <Textarea
                  {...register('certifications')}
                  id="certifications"
                  rows={3}
                  placeholder="contoh: Hipnoterapis Tersertifikasi, Praktisi CBT, EMDR Tersertifikasi"
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Pisahkan beberapa sertifikasi dengan koma
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notes Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              Catatan Admin (Opsional)
            </h3>
            <div>
              <Label htmlFor="adminNotes">Catatan Internal</Label>
              <Textarea
                {...register('adminNotes')}
                id="adminNotes"
                rows={3}
                placeholder="Catatan internal tentang registrasi therapist ini..."
                className="resize-none"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                Catatan ini hanya terlihat oleh administrator klinik
              </p>
            </div>
          </div>

          {/* Error Display */}
          {errors.root && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {/* Left side - Cancel button */}
            <Button type="button" variant="outline" onClick={handleCancel}>
              Batal
            </Button>

            {/* Right side - Submit button */}
            <Button
              type="submit"
              variant="default"
              className="px-8"
              disabled={
                loading ||
                isSubmitting ||
                !isValid ||
                !isDirty
              }
            >
              {loading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === 'edit' ? 'Updating...' : 'Creating Account...'}
                </>
              ) : !isValid || !isDirty ? (
                mode === 'edit' ? 'Lengkapi Form untuk Update' : 'Lengkapi Form untuk Melanjutkan'
              ) : (
                mode === 'edit' ? 'Update Therapist' : 'Buat Akun Therapist'
              )}
            </Button>
          </div>
        </form>
      </FormModal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogIsOpen}
        onClose={closeDialog}
        {...dialogConfig}
      />
    </>
  );
};

export default TherapistFormModal;
