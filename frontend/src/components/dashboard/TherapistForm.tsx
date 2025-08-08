'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Clinic admin notes (optional)
  adminNotes: z.string().max(500, 'Catatan maksimal 500 karakter').optional()
});

type TherapistRegistrationForm = z.infer<typeof TherapistRegistrationSchema>;

interface TherapistFormProps {
  therapistId?: string;
  mode?: 'create' | 'edit';
}

export const TherapistForm: React.FC<TherapistFormProps> = ({
  therapistId,
  mode = 'create'
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailValidationState, setEmailValidationState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [isLoadingTherapist, setIsLoadingTherapist] = useState(mode === 'edit');
  const { createTherapistAccount, loading } = useTherapist();
  const { user } = useAuth();
  const router = useRouter();
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
    mode: 'onChange' // Enable real-time validation
  });

  const watchedEmail = watch('email');
  const watchedFormData = watch();

  // Load therapist data for edit mode
  useEffect(() => {
    if (mode === 'edit' && therapistId) {
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
            adminNotes: 'Excellent therapist with strong client relationships'
          };

          // Pre-populate form with existing data
          reset(mockTherapistData);
          setEmailValidationState('valid'); // Email is already valid in edit mode
        } catch (error) {
          console.error('Failed to load therapist data:', error);
          // Remove toast to avoid potential errors
          // addToast({
          //   type: 'error',
          //   title: 'Error',
          //   message: 'Failed to load therapist data. Please try again.'
          // });
        } finally {
          setIsLoadingTherapist(false);
        }
      };

      loadTherapistData();
    } else {
      // If not in edit mode, ensure loading is false
      setIsLoadingTherapist(false);
    }
  }, [mode, therapistId, reset]);

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
        // Skip validation in edit mode since email is disabled
        if (mode === 'edit') {
          setEmailValidationState('valid'); // Keep as valid since it's read-only
          setEmailErrorMessage('');
          clearErrors('email');
        } else {
          validateEmailAvailability(watchedEmail);
        }
      } else {
        setEmailValidationState('idle');
        setEmailErrorMessage('');
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [watchedEmail, errors.email, validateEmailAvailability, mode]);

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

    // Enhanced confirmation dialog with more details
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
          action: {
            label: 'View All Therapists',
            onClick: () => router.push('/portal/therapists')
          }
        });

        // Redirect back to therapist list
        router.push('/portal/therapists');
      } else {
        // Create new therapist
        const result = await createTherapistAccount({
          ...data,
          createdBy: user.id,
          clinicId: user.clinicId || 'default-clinic',
          status: 'pending_setup' // Waiting for therapist to set password
        });

        if (result.success) {
          // Show success toast with action
          addToast({
            type: 'success',
            title: 'Therapist Account Created!',
            message: `Registration email sent to ${data.email}. The therapist will receive a secure link to complete their registration.`,
            duration: 8000,
            action: {
              label: 'View All Therapists',
              onClick: () => router.push('/portal/therapists')
            }
          });

          // Show detailed success information
          showConfirmation({
            type: 'success',
            title: 'Account Created Successfully',
            message: `Therapist account for ${data.name} has been created successfully. Here's what happens next:\n\n1. Registration email sent to ${data.email}\n2. Therapist will receive a secure setup link\n3. They have 24 hours to complete password setup\n4. Account will be activated after setup completion`,
            confirmText: 'Go to Therapist Management',
            cancelText: 'Create Another'
          }, () => {
            router.push('/portal/therapists');
          });

          // Reset form for potential next entry
          reset();
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

  const getFormProgress = () => {
    const requiredFields = ['name', 'email', 'phone', 'licenseNumber', 'specialization', 'yearsExperience', 'education'];
    const completedFields = requiredFields.filter(field => {
      const value = watch(field as keyof TherapistRegistrationForm);
      return value && value !== '' && value !== 0;
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const formProgress = getFormProgress();

  return (
    <div className="w-full space-y-6">
      {/* Temporarily bypass loading state for debugging */}
      {/* {isLoadingTherapist && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">Loading therapist data...</span>
        </div>
      )} */}

      {/* Temporarily show form always */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
          <CardContent className="space-y-8 py-6">
            {/* Personal Information Section */}
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
                  {touchedFields.name && !errors.name && watchedFormData.name && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Nama sudah benar
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
                      disabled={mode === 'edit'} // Disable email editing in edit mode
                      className={`
                      ${errors.email || emailValidationState === 'invalid' ? 'border-red-500' : ''}
                      ${emailValidationState === 'valid' ? 'border-green-500' : ''}
                      ${emailValidationState === 'checking' ? 'pr-10' : ''}
                      ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''} // Visual indication for disabled state
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
                  {emailValidationState === 'valid' && !errors.email && (
                    <p className="mt-1 text-sm text-green-600">
                      Email tersedia dan valid
                    </p>
                  )}
                  {emailValidationState === 'idle' && touchedFields.email && !errors.email && (
                    <p className="mt-1 text-xs text-gray-500">
                      {mode === 'edit' ? 'Email tidak dapat diubah karena sudah terdaftar dalam sistem' : 'Email registrasi akan dikirim ke alamat ini'}
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
                  {touchedFields.phone && !errors.phone && watchedFormData.phone && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Phone number is valid
                    </p>
                  )}
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
                  {touchedFields.licenseNumber && !errors.licenseNumber && watchedFormData.licenseNumber && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Nomor lisensi valid
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="specialization">Spesialisasi *</Label>
                  <div className="relative">
                    <Select
                      value={watch('specialization')}
                      onValueChange={(value) => {
                        // Update the form value
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
                  {touchedFields.specialization && !errors.specialization && watchedFormData.specialization && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Spesialisasi dipilih
                    </p>
                  )}
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
                  {touchedFields.yearsExperience && !errors.yearsExperience && watchedFormData.yearsExperience && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Experience level confirmed
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
                  {touchedFields.education && !errors.education && watchedFormData.education && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Detail pendidikan sudah benar
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
            <div className="flex justify-end pt-4 border-gray-200">
              <div className="space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/portal/therapists')}
                >
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
            </div>
          </CardContent>
        </Card>
      </form>
      {/* )} */}

      {/* Information Panel - Only show in create mode */}
      {mode === 'create' && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Apa yang terjadi selanjutnya?
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Setelah akun dibuat, therapist akan menerima email dengan link registrasi yang aman.
                    Mereka akan menggunakan link tersebut untuk mengatur password dan menyelesaikan registrasi.
                    Tidak ada password yang diperlukan dari Anda sebagai admin.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      {ConfirmationDialog}
    </div>
  );
};