'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormModal } from '@/components/ui/form-modal';
import { EmploymentTypeEnum, TherapistLicenseTypeEnum } from '@/types/enums';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  UserIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useTherapist } from '@/hooks/useTherapist';
import { useAuth } from '@/hooks/useAuth';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';

// Validation schema (NO PASSWORD FIELDS)
const TherapistRegistrationSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().regex(/^(\+62|0)[0-9]{9,13}$/, 'Format nomor telepon tidak valid'),

  // Professional Information
  licenseNumber: z.string().min(1, 'Nomor SIP wajib diisi'),
  specialization: z.string().min(1, 'Spesialisasi wajib diisi'),
  yearsExperience: z.number().min(0, 'Pengalaman tidak boleh negatif').max(50, 'Pengalaman maksimal 50 tahun'),
  education: z.string().min(1, 'Pendidikan wajib diisi'),
  certifications: z.string().optional(),

  // Enums (required)
  licenseType: z.nativeEnum(TherapistLicenseTypeEnum, {
    required_error: 'Tipe lisensi wajib dipilih',
    invalid_type_error: 'Tipe lisensi tidak valid'
  }),
  employmentType: z.nativeEnum(EmploymentTypeEnum, {
    required_error: 'Tipe pekerjaan wajib dipilih',
    invalid_type_error: 'Tipe pekerjaan tidak valid'
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
  const [emailValidationState, setEmailValidationState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [isLoadingTherapist, setIsLoadingTherapist] = useState(mode === 'edit');
  const { createTherapistAccount, loading } = useTherapist();
  const { user } = useAuth();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, touchedFields },
    reset,
    setError,
    watch,
    clearErrors
  } = useForm<TherapistRegistrationForm>({
    resolver: zodResolver(TherapistRegistrationSchema),
    mode: 'onChange'
  });

  const watchedEmail = watch('email');
  const watchedFormData = watch();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && therapistId) {
        // Load therapist data for edit mode
        const loadTherapistData = async () => {
          setIsLoadingTherapist(true);
          try {
            // Mock API call to get therapist data
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock therapist data - in real app, this would come from API
            const mockTherapistData = {
              name: 'Dr. Budi Santoso',
              email: 'budi@kliniksehat.com',
              phone: '+62-812-3456-7890',
              licenseNumber: 'SIP-123456',
              specialization: 'Anxiety Disorders',
              yearsExperience: 8,
              education: 'S1 Psikologi, Universitas Indonesia',
              certifications: 'Certified Hypnotherapist, CBT Practitioner',
              adminNotes: 'Excellent therapist with strong client relationships',
              licenseType: TherapistLicenseTypeEnum.Psychologist,
              employmentType: EmploymentTypeEnum.FullTime,
            };

            reset(mockTherapistData);
            setEmailValidationState('valid');
          } catch (error) {
            console.error('Failed to load therapist data:', error);
          } finally {
            setIsLoadingTherapist(false);
          }
        };

        loadTherapistData();
      } else {
        // Reset form for create mode
        reset({
          name: '',
          email: '',
          phone: '',
          licenseNumber: '',
          specialization: '',
          yearsExperience: 0,
          education: '',
          certifications: '',
          adminNotes: '',
          licenseType: TherapistLicenseTypeEnum.Psychologist,
          employmentType: EmploymentTypeEnum.FullTime,
          ...defaultValues,
        });
        setEmailValidationState('idle');
        setIsLoadingTherapist(false);
      }
    }
  }, [open, mode, therapistId, defaultValues, reset]);

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'PTSD (Post-Traumatic Stress Disorder)',
    'Phobias',
    'Addiction',
    'Stress Management',
    'Self-Esteem Issues',
    'Relationship Problems',
    'Grief and Loss',
    'Sleep Disorders',
    'Performance Enhancement',
    'Pain Management',
    'Weight Management',
    'Smoking Cessation',
    'Other'
  ];

  const validateEmailAvailability = useCallback(async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    setEmailValidationState('checking');

    try {
      // Mock API call to check email availability
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock logic - simulate email already exists check
      if (email === 'existing@example.com' || email === 'taken@clinic.com') {
        setEmailValidationState('invalid');
        setEmailErrorMessage('Email sudah terdaftar dalam sistem');
        setError('email', {
          type: 'manual',
          message: 'Email sudah terdaftar dalam sistem'
        });
      } else {
        setEmailValidationState('valid');
        setEmailErrorMessage('');
        clearErrors('email');
      }
    } catch (error) {
      setEmailValidationState('idle');
      setEmailErrorMessage('');
      console.error('Email validation error:', error);
    }
  }, [setError, clearErrors]);

  // Debounced email validation - disabled in edit mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedEmail && watchedEmail.length > 0 && !errors.email) {
        if (mode === 'edit') {
          setEmailValidationState('valid');
          setEmailErrorMessage('');
          clearErrors('email');
        } else {
          validateEmailAvailability(watchedEmail);
        }
      } else {
        setEmailValidationState('idle');
        setEmailErrorMessage('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedEmail, errors.email, validateEmailAvailability, mode, clearErrors]);

  const handleFormSubmit = (data: TherapistRegistrationForm) => {
    if (!user || !user.roles.includes('clinic_admin')) {
      addToast({
        type: 'error',
        title: 'Access Denied',
        message: `Only clinic administrators can ${mode === 'edit' ? 'edit' : 'register'} therapists`
      });
      return;
    }

    const actionText = mode === 'edit' ? 'update' : 'create';
    const titleText = mode === 'edit' ? 'Update Therapist Account' : 'Create Therapist Account';
    const confirmText = mode === 'edit' ? 'Update Account' : 'Create Account';

    showConfirmation({
      type: 'info',
      title: titleText,
      message: `Are you sure you want to ${actionText} the therapist account for ${data.name}?\n\n• Email: ${data.email}\n• Specialization: ${data.specialization}\n• License: ${data.licenseNumber}\n\n${mode === 'edit' ? 'Changes will be applied immediately.' : `A registration email will be sent to ${data.email} with a secure link to complete their password setup.`}`,
      confirmText: confirmText,
      cancelText: 'Review Details'
    }, () => submitForm(data));
  };

  const submitForm = async (data: TherapistRegistrationForm) => {
    if (!user) {
      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: 'User session not found. Please login again.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'edit') {
        // Mock update API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        addToast({
          type: 'success',
          title: 'Therapist Updated!',
          message: `Therapist information for ${data.name} has been updated successfully.`,
          duration: 8000,
        });

        onSubmitSuccess?.(data);
        onOpenChange(false);
      } else {
        // Create new therapist
        const result = await createTherapistAccount({
          ...data,
          createdBy: user.id,
          clinicId: user.clinicId || 'default-clinic',
          status: 'pending_setup'
        });

        if (result.success) {
          addToast({
            type: 'success',
            title: 'Therapist Account Created!',
            message: `Registration email sent to ${data.email}. The therapist will receive a secure link to complete their registration.`,
            duration: 8000,
          });

          onSubmitSuccess?.(data);
          onOpenChange(false);
        } else {
          addToast({
            type: 'error',
            title: 'Creation Failed',
            message: result.message || 'Failed to create therapist account. Please try again.'
          });
          setError('root', { message: result.message || 'Failed to create therapist account' });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      addToast({
        type: 'error',
        title: 'System Error',
        message: `An unexpected error occurred while ${mode === 'edit' ? 'updating' : 'creating'} the therapist account`
      });
      setError('root', { message: `An error occurred while ${mode === 'edit' ? 'updating' : 'creating'} the therapist account` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const title = mode === 'edit' ? 'Edit Therapist' : 'Register New Therapist';
  const description = mode === 'edit' 
    ? 'Update therapist information. Changes will be reflected immediately.'
    : 'Create a new therapist account. The therapist will receive an email to set their password.';

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
          <span className="ml-2 text-gray-600">Loading therapist data...</span>
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <div className="relative">
                    <Input
                      {...register('name')}
                      id="name"
                      placeholder="contoh: Dr. Budi Santoso"
                      className={`
                        ${errors.name ? 'border-red-500 focus:border-red-500' : ''}
                        ${touchedFields.name && !errors.name && watchedFormData.name ? 'border-green-500 focus:border-green-500' : ''}
                      `}
                    />
                    {touchedFields.name && !errors.name && watchedFormData.name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">
                    Alamat Email * {mode === 'edit' && <span className="text-gray-500 text-xs">(Tidak dapat diubah)</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('email')}
                      id="email"
                      type="email"
                      placeholder="therapist@contoh.com"
                      disabled={mode === 'edit'}
                      className={`
                        ${errors.email || emailValidationState === 'invalid' ? 'border-red-500' : ''}
                        ${emailValidationState === 'valid' ? 'border-green-500' : ''}
                        ${emailValidationState === 'checking' ? 'pr-10' : ''}
                        ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}
                      `}
                    />
                    {emailValidationState === 'checking' && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      </div>
                    )}
                    {emailValidationState === 'valid' && !errors.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  {(errors.email || emailErrorMessage) && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email?.message || emailErrorMessage}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <div className="relative">
                    <Input
                      {...register('phone')}
                      id="phone"
                      placeholder="+62-812-3456-7890"
                      className={`
                        ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                        ${touchedFields.phone && !errors.phone && watchedFormData.phone ? 'border-green-500 focus:border-green-500' : ''}
                      `}
                    />
                    {touchedFields.phone && !errors.phone && watchedFormData.phone && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

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
                    placeholder="SIP-123456"
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
                <Label htmlFor="specialization">Spesialisasi *</Label>
                <div className="relative">
                  <Select
                    value={watch('specialization')}
                    onValueChange={(value) => {
                      const event = { target: { value } };
                      register('specialization').onChange(event);
                    }}
                  >
                    <SelectTrigger
                      className={`
                        ${errors.specialization ? 'border-red-500 focus:border-red-500' : ''}
                        ${touchedFields.specialization && !errors.specialization && watchedFormData.specialization ? 'border-green-500 focus:border-green-500' : ''}
                      `}
                    >
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touchedFields.specialization && !errors.specialization && watchedFormData.specialization && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label>Tipe Lisensi *</Label>
                  <Select
                    value={watch('licenseType')}
                    onValueChange={(value) => {
                      const event = { target: { value } } as any;
                      register('licenseType').onChange(event);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe lisensi" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TherapistLicenseTypeEnum).map((val) => (
                        <SelectItem key={val} value={val}>{val}</SelectItem>
                      ))}
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
                  <Label>Tipe Pekerjaan *</Label>
                  <Select
                    value={watch('employmentType')}
                    onValueChange={(value) => {
                      const event = { target: { value } } as any;
                      register('employmentType').onChange(event);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EmploymentTypeEnum).map((val) => (
                        <SelectItem key={val} value={val}>{val}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employmentType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      {errors.employmentType.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="yearsExperience">Tahun Pengalaman *</Label>
                <div className="relative">
                  <Input
                    {...register('yearsExperience', { valueAsNumber: true })}
                    id="yearsExperience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="5"
                    className={`
                      ${errors.yearsExperience ? 'border-red-500 focus:border-red-500' : ''}
                      ${touchedFields.yearsExperience && !errors.yearsExperience && watchedFormData.yearsExperience ? 'border-green-500 focus:border-green-500' : ''}
                    `}
                  />
                  {touchedFields.yearsExperience && !errors.yearsExperience && watchedFormData.yearsExperience && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.yearsExperience && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.yearsExperience.message}
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
                <Label htmlFor="certifications">Certifications (Optional)</Label>
                <Textarea
                  {...register('certifications')}
                  id="certifications"
                  rows={3}
                  placeholder="contoh: Certified Hypnotherapist, CBT Practitioner, EMDR Certified"
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple certifications with commas
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
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Batal
            </Button>
            <Button
              type="submit"
              className="px-8"
              disabled={
                loading ||
                isSubmitting ||
                !isValid ||
                !isDirty ||
                emailValidationState === 'checking' ||
                emailValidationState === 'invalid'
              }
            >
              {loading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === 'edit' ? 'Updating...' : 'Creating Account...'}
                </>
              ) : emailValidationState === 'checking' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Validating Email...
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
      {ConfirmationDialog}
    </>
  );
};

export default TherapistFormModal;
