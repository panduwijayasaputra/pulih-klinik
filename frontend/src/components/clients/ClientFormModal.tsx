'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormModal } from '@/components/ui/form-modal';
import ConfirmationDialog, { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';

import { createClientSchema, clientSchemaWithRefinements, type ClientCreateData } from '@/schemas/clientSchema';
import type { ClientFormData } from '@/types/client';
import { useClient } from '@/hooks/useClient';
import { ClientAPI } from '@/lib/api/client';
import {
  ClientEducationEnum,
  ClientEducationLabels,
  ClientGenderEnum,
  ClientGenderLabels,
  ClientGuardianMaritalStatusEnum,
  ClientGuardianMaritalStatusLabels,
  ClientGuardianRelationshipEnum,
  ClientGuardianRelationshipLabels,
  ClientMaritalStatusEnum,
  ClientMaritalStatusLabels,
  ClientRelationshipWithSpouseEnum,
  ClientRelationshipWithSpouseLabels,
  ClientReligionEnum,
  ClientReligionLabels
} from '@/types/enums';
import {
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  clientId?: string | undefined; // For edit mode
  defaultValues?: Partial<ClientFormData>;
  onSubmitSuccess?: (data: ClientFormData) => void;
  onCancel?: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  open,
  onOpenChange,
  mode = 'create',
  clientId,
  defaultValues,
  onSubmitSuccess,
  onCancel,
}) => {
  const [isLoadingClient, setIsLoadingClient] = useState(mode === 'edit');
  const [useGuardianAsEmergencyContact, setUseGuardianAsEmergencyContact] = useState(false);
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();
  const { addToast } = useToast();
  const { createClient, loading: clientLoading } = useClient();

  // Create dynamic schema based on isMinor value
  const createDynamicSchema = React.useCallback((isMinor: boolean) => {
    if (isMinor) {
      // Use schema with refinements when isMinor is true
      return clientSchemaWithRefinements;
    } else {
      // Use base schema when isMinor is false
      return createClientSchema;
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    trigger,
    setError,
    clearErrors,
  } = useForm<ClientCreateData>({
    resolver: zodResolver(createDynamicSchema(false)), // Initial schema for non-minor
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      gender: 'Male' as const,
      birthPlace: '',
      birthDate: '',
      religion: 'Islam' as const,
      occupation: '',
      education: 'Bachelor' as const,
      educationMajor: '',
      address: '',
      phone: '',
      email: '',
      hobbies: '',
      maritalStatus: ClientMaritalStatusEnum.Single,
      spouseName: '',
      relationshipWithSpouse: null,

      firstVisit: true,
      previousVisitDetails: '',
      isMinor: false,
      school: '',
      grade: '',
      guardianFullName: '',
      guardianRelationship: null,
      guardianPhone: '',
      guardianAddress: '',
      guardianOccupation: '',
      guardianMaritalStatus: null,
      guardianLegalCustody: false,
      guardianCustodyDocsAttached: false,
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      emergencyContactAddress: '',
      primaryIssue: '',
      ...defaultValues,
    },
  });

  // Reset form when modal opens/closes or defaultValues change
  useEffect(() => {
    if (open) {
      // Reset checkbox state
      setUseGuardianAsEmergencyContact(false);
      
      if (mode === 'edit' && clientId) {
        // Load client data for edit mode
        const loadClientData = async () => {
          setIsLoadingClient(true);
          try {
            // Fetch fresh client data from API
            const response = await ClientAPI.getClient(clientId);
            if (response.success && response.data) {
              const clientData = response.data;

              // Reset with fetched client data
              reset({
                fullName: clientData.fullName || clientData.name || '',
                gender: clientData.gender || 'Male' as const,
                birthPlace: clientData.birthPlace || '',
                birthDate: clientData.birthDate ? new Date(clientData.birthDate).toISOString().split('T')[0] : '',
                religion: clientData.religion || 'Islam' as const,
                occupation: clientData.occupation || '',
                education: clientData.education || 'Bachelor' as const,
                educationMajor: clientData.educationMajor || '',
                address: clientData.address || '',
                phone: clientData.phone || '',
                email: clientData.email || '',
                hobbies: clientData.hobbies || '',
                maritalStatus: clientData.maritalStatus || ClientMaritalStatusEnum.Single,
                spouseName: clientData.spouseName || '',
                relationshipWithSpouse: clientData.relationshipWithSpouse,
                firstVisit: clientData.firstVisit ?? true,
                previousVisitDetails: clientData.previousVisitDetails || '',
                isMinor: clientData.isMinor ?? false,
                school: clientData.school || '',
                grade: clientData.grade || '',
                guardianFullName: clientData.guardianFullName || '',
                guardianRelationship: clientData.guardianRelationship,
                guardianPhone: clientData.guardianPhone || '',
                guardianAddress: clientData.guardianAddress || '',
                guardianOccupation: clientData.guardianOccupation || '',
                guardianMaritalStatus: clientData.guardianMaritalStatus,
                guardianLegalCustody: clientData.guardianLegalCustody ?? false,
                guardianCustodyDocsAttached: clientData.guardianCustodyDocsAttached ?? false,
                emergencyContactName: clientData.emergencyContactName || '',
                emergencyContactPhone: clientData.emergencyContactPhone || '',
                emergencyContactRelationship: clientData.emergencyContactRelationship || '',
                emergencyContactAddress: clientData.emergencyContactAddress || '',
                primaryIssue: clientData.primaryIssue || '',
              });
            } else {
              // Fallback to default values if API fails
              reset({
                fullName: '',
                gender: 'Male' as const,
                birthPlace: '',
                birthDate: '',
                religion: 'Islam' as const,
                occupation: '',
                education: 'Bachelor' as const,
                educationMajor: '',
                address: '',
                phone: '',
                email: '',
                hobbies: '',
                maritalStatus: ClientMaritalStatusEnum.Single,
                spouseName: '',
                relationshipWithSpouse: null,

                firstVisit: true,
                previousVisitDetails: '',
                isMinor: false,
                school: '',
                grade: '',
                guardianFullName: '',
                guardianRelationship: null,
                guardianPhone: '',
                guardianAddress: '',
                guardianOccupation: '',
                guardianMaritalStatus: null,
                guardianLegalCustody: false,
                guardianCustodyDocsAttached: false,
                emergencyContactName: '',
                emergencyContactPhone: '',
                emergencyContactRelationship: '',
                emergencyContactAddress: '',
                primaryIssue: '',
                ...defaultValues,
              });
            }
          } catch (error) {
            console.error('Failed to load client data:', error);
            // Fallback to default values on error
            reset({
              fullName: '',
              gender: 'Male' as const,
              birthPlace: '',
              birthDate: '',
              religion: 'Islam' as const,
              occupation: '',
              education: 'Bachelor' as const,
              educationMajor: '',
              address: '',
              phone: '',
              email: '',
              hobbies: '',
              maritalStatus: ClientMaritalStatusEnum.Single,
              spouseName: '',
              relationshipWithSpouse: null,

              firstVisit: true,
              previousVisitDetails: '',
              isMinor: false,
              school: '',
              grade: '',
              guardianFullName: '',
              guardianRelationship: null,
              guardianPhone: '',
              guardianAddress: '',
              guardianOccupation: '',
              guardianMaritalStatus: null,
              guardianLegalCustody: false,
              guardianCustodyDocsAttached: false,
              emergencyContactName: '',
              emergencyContactPhone: '',
              emergencyContactRelationship: '',
              emergencyContactAddress: '',
              primaryIssue: '',
              ...defaultValues,
            });
          } finally {
            setIsLoadingClient(false);
          }
        };

        loadClientData();
      } else {
        // Reset form for create mode
        reset({
          fullName: '',
          gender: 'Male' as const,
          birthPlace: '',
          birthDate: '',
          religion: 'Islam' as const,
          occupation: '',
          education: 'Bachelor' as const,
          educationMajor: '',
          address: '',
          phone: '',
          email: '',
          hobbies: '',
          maritalStatus: ClientMaritalStatusEnum.Single,
          spouseName: '',
          relationshipWithSpouse: null,

          firstVisit: true,
          previousVisitDetails: '',
          isMinor: false,
          school: '',
          grade: '',
          guardianFullName: '',
          guardianRelationship: null,
          guardianPhone: '',
          guardianAddress: '',
          guardianOccupation: '',
          guardianMaritalStatus: null,
          guardianLegalCustody: false,
          guardianCustodyDocsAttached: false,
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelationship: '',
          emergencyContactAddress: '',
          primaryIssue: '',
          ...defaultValues,
        });
        setIsLoadingClient(false);
      }
    }
  }, [open, mode, clientId, defaultValues, reset]);

  const onSubmit = async (data: ClientFormData) => {
    const titleText = mode === 'edit' ? 'Perbarui Data Klien' : 'Tambah Klien Baru';
    const confirmText = mode === 'edit' ? 'Perbarui Data' : 'Tambah Klien';

    openDialog({
      title: titleText,
      description: mode === 'edit'
        ? `Apakah Anda yakin ingin memperbarui data klien berikut?`
        : `Apakah Anda yakin ingin menambahkan klien baru dengan data berikut?`,
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
              <span className="text-sm font-semibold text-gray-900">{data.email || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Telepon:</span>
              <span className="text-sm font-semibold text-gray-900">{data.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Tanggal Lahir:</span>
              <span className="text-sm font-semibold text-gray-900">{data.birthDate}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            {mode === 'edit'
              ? '✏️ Perubahan akan diterapkan segera setelah dikonfirmasi.'
              : '👤 Klien baru akan ditambahkan ke dalam sistem dengan status "Baru".'
            }
          </div>
        </div>
      ),
      onConfirm: () => submitForm(data)
    });
  };

  const submitForm = async (data: ClientFormData) => {
    try {
      if (mode === 'edit' && clientId) {
        // Call actual update API
        const response = await ClientAPI.updateClient(clientId, data);

        if (response.success) {
          addToast({
            type: 'success',
            title: 'Data Klien Berhasil Diperbarui!',
            message: `Data klien ${data.fullName} telah berhasil diperbarui.`,
            duration: 5000,
          });

          onSubmitSuccess?.(data);
          onOpenChange(false);
        } else {
          throw new Error(response.message || 'Gagal memperbarui data klien');
        }
      } else {
        // Create new client using the API
        const result = await createClient(data);

        if (result) {
          addToast({
            type: 'success',
            title: 'Klien Baru Berhasil Ditambahkan!',
            message: `Klien ${data.fullName} telah berhasil ditambahkan ke sistem.`,
            duration: 8000,
          });

          onSubmitSuccess?.(data);
          onOpenChange(false);
        } else {
          addToast({
            type: 'error',
            title: 'Pembuatan Gagal',
            message: 'Gagal menambahkan klien. Silakan coba lagi.'
          });
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: `Terjadi kesalahan tak terduga saat ${mode === 'edit' ? 'memperbarui' : 'menambahkan'} klien`
      });
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const title = mode === 'edit' ? 'Ubah Data Klien' : 'Tambah Klien Baru';
  const description = mode === 'edit'
    ? 'Update informasi klien yang sudah ada'
    : 'Tambahkan klien baru ke dalam sistem';

  // Watch isMinor and firstVisit to conditionally show fields
  const isMinor = watch('isMinor');
  const firstVisit = watch('firstVisit');

  // Update schema resolver when isMinor changes
  React.useEffect(() => {
    // Update the form resolver based on isMinor value
    const newSchema = createDynamicSchema(isMinor);
    // Note: We can't directly update the resolver in react-hook-form, 
    // but the validation will be handled by our custom validation logic
  }, [isMinor, createDynamicSchema]);

  // Clear minor-specific fields when isMinor becomes false
  useEffect(() => {
    if (!isMinor) {
      // Clear school fields
      setValue('school', '', { shouldValidate: true });
      setValue('grade', '', { shouldValidate: true });

      // Clear guardian fields
      setValue('guardianFullName', '', { shouldValidate: true });
      setValue('guardianRelationship', null, { shouldValidate: true });
      setValue('guardianPhone', '', { shouldValidate: true });
      setValue('guardianAddress', '', { shouldValidate: true });
      setValue('guardianOccupation', '', { shouldValidate: true });
      setValue('guardianMaritalStatus', null, { shouldValidate: true });
      setValue('guardianLegalCustody', false, { shouldValidate: true });
      setValue('guardianCustodyDocsAttached', false, { shouldValidate: true });
    }
  }, [isMinor, setValue]);

  // Clear spouse relationship field when marital status is not married
  const maritalStatus = watch('maritalStatus');
  React.useEffect(() => {
    if (maritalStatus !== ClientMaritalStatusEnum.Married) {
      setValue('relationshipWithSpouse', null, { shouldValidate: true });
      setValue('spouseName', '', { shouldValidate: true });
    }
  }, [maritalStatus, setValue]);

  // Sync guardian data with emergency contact when checkbox is checked
  React.useEffect(() => {
    if (useGuardianAsEmergencyContact && isMinor) {
      const guardianFullName = watch('guardianFullName');
      const guardianPhone = watch('guardianPhone');
      const guardianRelationship = watch('guardianRelationship');
      const guardianAddress = watch('guardianAddress');

      // Update emergency contact fields with guardian data
      setValue('emergencyContactName', guardianFullName || '', { shouldValidate: true });
      setValue('emergencyContactPhone', guardianPhone || '', { shouldValidate: true });
      setValue('emergencyContactRelationship', guardianRelationship ? ClientGuardianRelationshipLabels[guardianRelationship as keyof typeof ClientGuardianRelationshipLabels] : '', { shouldValidate: true });
      setValue('emergencyContactAddress', guardianAddress || '', { shouldValidate: true });
    }
  }, [useGuardianAsEmergencyContact, isMinor, watch, setValue]);

  // Custom validation for conditional fields when isMinor changes
  React.useEffect(() => {
    const validateConditionalFields = () => {
      if (isMinor) {
        // Validate required fields for minors
        const schoolValue = watch('school');
        const gradeValue = watch('grade');
        const guardianFullNameValue = watch('guardianFullName');
        const guardianRelationshipValue = watch('guardianRelationship');
        const guardianPhoneValue = watch('guardianPhone');
        const guardianOccupationValue = watch('guardianOccupation');

        // School validation
        if (!schoolValue || schoolValue.trim().length < 2) {
          setError('school', {
            type: 'manual',
            message: 'Nama sekolah minimal 2 karakter'
          });
        } else {
          clearErrors('school');
        }

        // Grade validation
        if (!gradeValue || gradeValue.trim().length < 1) {
          setError('grade', {
            type: 'manual',
            message: 'Kelas harus diisi'
          });
        } else {
          clearErrors('grade');
        }

        // Guardian full name validation
        if (!guardianFullNameValue || guardianFullNameValue.trim().length < 2) {
          setError('guardianFullName', {
            type: 'manual',
            message: 'Nama lengkap wali minimal 2 karakter'
          });
        } else {
          clearErrors('guardianFullName');
        }

        // Guardian relationship validation
        if (!guardianRelationshipValue) {
          setError('guardianRelationship', {
            type: 'manual',
            message: 'Hubungan dengan klien harus dipilih'
          });
        } else {
          clearErrors('guardianRelationship');
        }

        // Guardian phone validation
        if (!guardianPhoneValue || guardianPhoneValue.trim().length < 10) {
          setError('guardianPhone', {
            type: 'manual',
            message: 'Nomor telepon wali minimal 10 digit'
          });
        } else {
          clearErrors('guardianPhone');
        }

        // Guardian occupation validation
        if (!guardianOccupationValue || guardianOccupationValue.trim().length < 2) {
          setError('guardianOccupation', {
            type: 'manual',
            message: 'Pekerjaan wali minimal 2 karakter'
          });
        } else {
          clearErrors('guardianOccupation');
        }

        // Guardian address validation
        const guardianAddressValue = watch('guardianAddress');
        if (!guardianAddressValue || guardianAddressValue.trim().length < 5) {
          setError('guardianAddress', {
            type: 'manual',
            message: 'Alamat wali minimal 5 karakter'
          });
        } else {
          clearErrors('guardianAddress');
        }
      } else {
        // Clear all conditional errors when isMinor is false
        clearErrors(['school', 'grade', 'guardianFullName', 'guardianRelationship', 'guardianPhone', 'guardianOccupation', 'guardianAddress']);
      }

      // Validate spouse fields when married
      if (maritalStatus === ClientMaritalStatusEnum.Married) {
        const spouseNameValue = watch('spouseName');
        const relationshipWithSpouseValue = watch('relationshipWithSpouse');

        // Spouse name validation
        if (!spouseNameValue || spouseNameValue.trim().length < 2) {
          setError('spouseName', {
            type: 'manual',
            message: 'Nama pasangan minimal 2 karakter'
          });
        } else {
          clearErrors('spouseName');
        }

        // Spouse relationship validation
        if (!relationshipWithSpouseValue) {
          setError('relationshipWithSpouse', {
            type: 'manual',
            message: 'Hubungan dengan pasangan harus dipilih'
          });
        } else {
          clearErrors('relationshipWithSpouse');
        }
      } else {
        // Clear spouse errors when not married
        clearErrors(['spouseName', 'relationshipWithSpouse']);
      }

      // Validate emergency contact fields when isMinor is true
      if (isMinor) {
        const emergencyContactPhoneValue = watch('emergencyContactPhone');
        const emergencyContactAddressValue = watch('emergencyContactAddress');

        // Emergency contact phone validation
        if (!emergencyContactPhoneValue || emergencyContactPhoneValue.trim().length < 10) {
          setError('emergencyContactPhone', {
            type: 'manual',
            message: 'Nomor telepon kontak darurat minimal 10 digit'
          });
        } else {
          clearErrors('emergencyContactPhone');
        }

        // Emergency contact address validation
        if (!emergencyContactAddressValue || emergencyContactAddressValue.trim().length < 5) {
          setError('emergencyContactAddress', {
            type: 'manual',
            message: 'Alamat kontak darurat minimal 5 karakter'
          });
        } else {
          clearErrors('emergencyContactAddress');
        }
      } else {
        // Clear emergency contact errors when not minor
        clearErrors(['emergencyContactPhone', 'emergencyContactAddress']);
      }

      // Validate previous visit details when not first visit
      if (!firstVisit) {
        const previousVisitDetailsValue = watch('previousVisitDetails');
        if (!previousVisitDetailsValue || previousVisitDetailsValue.trim().length < 5) {
          setError('previousVisitDetails', {
            type: 'manual',
            message: 'Detail kunjungan sebelumnya minimal 5 karakter'
          });
        } else {
          clearErrors('previousVisitDetails');
        }
      } else {
        // Clear previous visit details errors when first visit
        clearErrors(['previousVisitDetails']);
      }
    };

    validateConditionalFields();
  }, [isMinor, maritalStatus, firstVisit, watch, setError, clearErrors]);

  // Also validate when the actual field values change
  const schoolValue = watch('school');
  const gradeValue = watch('grade');
  const guardianFullNameValue = watch('guardianFullName');
  const guardianRelationshipValue = watch('guardianRelationship');
  const guardianPhoneValue = watch('guardianPhone');
  const guardianOccupationValue = watch('guardianOccupation');
  const guardianAddressValue = watch('guardianAddress');
  const emergencyContactPhoneValue = watch('emergencyContactPhone');
  const emergencyContactAddressValue = watch('emergencyContactAddress');
  const previousVisitDetailsValue = watch('previousVisitDetails');
  const spouseNameValue = watch('spouseName');
  const relationshipWithSpouseValue = watch('relationshipWithSpouse');

  // Watch guardian fields and sync with emergency contact when checkbox is checked
  React.useEffect(() => {
    if (useGuardianAsEmergencyContact && isMinor) {
      // Update emergency contact fields when guardian data changes
      setValue('emergencyContactName', guardianFullNameValue || '', { shouldValidate: true });
      setValue('emergencyContactPhone', guardianPhoneValue || '', { shouldValidate: true });
      setValue('emergencyContactRelationship', guardianRelationshipValue ? ClientGuardianRelationshipLabels[guardianRelationshipValue as keyof typeof ClientGuardianRelationshipLabels] : '', { shouldValidate: true });
      setValue('emergencyContactAddress', guardianAddressValue || '', { shouldValidate: true });
    }
  }, [useGuardianAsEmergencyContact, isMinor, guardianFullNameValue, guardianPhoneValue, guardianRelationshipValue, guardianAddressValue, setValue]);

  React.useEffect(() => {
    if (isMinor) {
      // Re-validate when field values change and isMinor is true
      const validateField = () => {
        // School validation
        if (!schoolValue || schoolValue.trim().length < 2) {
          setError('school', {
            type: 'manual',
            message: 'Nama sekolah minimal 2 karakter'
          });
        } else {
          clearErrors('school');
        }

        // Grade validation
        if (!gradeValue || gradeValue.trim().length < 1) {
          setError('grade', {
            type: 'manual',
            message: 'Kelas harus diisi'
          });
        } else {
          clearErrors('grade');
        }

        // Guardian full name validation
        if (!guardianFullNameValue || guardianFullNameValue.trim().length < 2) {
          setError('guardianFullName', {
            type: 'manual',
            message: 'Nama lengkap wali minimal 2 karakter'
          });
        } else {
          clearErrors('guardianFullName');
        }

        // Guardian relationship validation
        if (!guardianRelationshipValue) {
          setError('guardianRelationship', {
            type: 'manual',
            message: 'Hubungan dengan klien harus dipilih'
          });
        } else {
          clearErrors('guardianRelationship');
        }

        // Guardian phone validation
        if (!guardianPhoneValue || guardianPhoneValue.trim().length < 10) {
          setError('guardianPhone', {
            type: 'manual',
            message: 'Nomor telepon wali minimal 10 digit'
          });
        } else {
          clearErrors('guardianPhone');
        }

        // Guardian occupation validation
        if (!guardianOccupationValue || guardianOccupationValue.trim().length < 2) {
          setError('guardianOccupation', {
            type: 'manual',
            message: 'Pekerjaan wali minimal 2 karakter'
          });
        } else {
          clearErrors('guardianOccupation');
        }

        // Guardian address validation
        if (!guardianAddressValue || guardianAddressValue.trim().length < 5) {
          setError('guardianAddress', {
            type: 'manual',
            message: 'Alamat wali minimal 5 karakter'
          });
        } else {
          clearErrors('guardianAddress');
        }

        // Emergency contact phone validation
        if (!emergencyContactPhoneValue || emergencyContactPhoneValue.trim().length < 10) {
          setError('emergencyContactPhone', {
            type: 'manual',
            message: 'Nomor telepon kontak darurat minimal 10 digit'
          });
        } else {
          clearErrors('emergencyContactPhone');
        }

        // Emergency contact address validation
        if (!emergencyContactAddressValue || emergencyContactAddressValue.trim().length < 5) {
          setError('emergencyContactAddress', {
            type: 'manual',
            message: 'Alamat kontak darurat minimal 5 karakter'
          });
        } else {
          clearErrors('emergencyContactAddress');
        }
      };

      validateField();
    }

    // Validate spouse fields when married and field values change
    if (maritalStatus === ClientMaritalStatusEnum.Married) {
      const validateSpouseFields = () => {
        // Spouse name validation
        if (!spouseNameValue || spouseNameValue.trim().length < 2) {
          setError('spouseName', {
            type: 'manual',
            message: 'Nama pasangan minimal 2 karakter'
          });
        } else {
          clearErrors('spouseName');
        }

        // Spouse relationship validation
        if (!relationshipWithSpouseValue) {
          setError('relationshipWithSpouse', {
            type: 'manual',
            message: 'Hubungan dengan pasangan harus dipilih'
          });
        } else {
          clearErrors('relationshipWithSpouse');
        }
      };

      validateSpouseFields();
    }

    // Validate previous visit details when not first visit and field values change
    if (!firstVisit) {
      const validatePreviousVisitDetails = () => {
        if (!previousVisitDetailsValue || previousVisitDetailsValue.trim().length < 5) {
          setError('previousVisitDetails', {
            type: 'manual',
            message: 'Detail kunjungan sebelumnya minimal 5 karakter'
          });
        } else {
          clearErrors('previousVisitDetails');
        }
      };

      validatePreviousVisitDetails();
    }
  }, [isMinor, maritalStatus, firstVisit, schoolValue, gradeValue, guardianFullNameValue, guardianRelationshipValue, guardianPhoneValue, guardianOccupationValue, guardianAddressValue, emergencyContactPhoneValue, emergencyContactAddressValue, previousVisitDetailsValue, spouseNameValue, relationshipWithSpouseValue, setError, clearErrors]);

  // Custom validation check for button enable/disable
  const isFormValid = React.useMemo(() => {
    // Check base form validation
    if (!isValid) return false;
    
    // If isMinor is true, check if the dynamic validations pass
    if (isMinor) {
      // Check school fields
      if (!schoolValue || schoolValue.trim().length < 2) return false;
      if (!gradeValue || gradeValue.trim().length < 1) return false;
      
      // Check guardian fields
      if (!guardianFullNameValue || guardianFullNameValue.trim().length < 2) return false;
      if (!guardianRelationshipValue) return false;
      if (!guardianPhoneValue || guardianPhoneValue.trim().length < 10) return false;
      if (!guardianOccupationValue || guardianOccupationValue.trim().length < 2) return false;
      if (!guardianAddressValue || guardianAddressValue.trim().length < 5) return false;
      
      // Check emergency contact fields
      if (!emergencyContactPhoneValue || emergencyContactPhoneValue.trim().length < 10) return false;
      if (!emergencyContactAddressValue || emergencyContactAddressValue.trim().length < 5) return false;
    }

    // If married, check spouse fields
    if (maritalStatus === ClientMaritalStatusEnum.Married) {
      if (!spouseNameValue || spouseNameValue.trim().length < 2) return false;
      if (!relationshipWithSpouseValue) return false;
    }

    // If not first visit, check previous visit details
    if (!firstVisit) {
      if (!previousVisitDetailsValue || previousVisitDetailsValue.trim().length < 5) return false;
    }
    
    return true;
  }, [isValid, isMinor, maritalStatus, firstVisit, schoolValue, gradeValue, guardianFullNameValue, guardianRelationshipValue, guardianPhoneValue, guardianOccupationValue, guardianAddressValue, emergencyContactPhoneValue, emergencyContactAddressValue, previousVisitDetailsValue, spouseNameValue, relationshipWithSpouseValue]);

  if (isLoadingClient) {
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
          <span className="ml-2 text-gray-600">Memuat data klien...</span>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Dasar</h3>
            <p className="text-sm text-gray-600 mb-4">Informasi identitas dan data pribadi klien</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input 
                  id="fullName" 
                  placeholder="Nama lengkap klien" 
                  {...register('fullName')}
                  className={errors.fullName ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Jenis Kelamin *</Label>
                <Select
                  value={watch('gender')}
                  onValueChange={val => setValue('gender', val as ClientFormData['gender'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientGenderEnum).map(gender => (
                      <SelectItem key={gender} value={gender}>{ClientGenderLabels[gender]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {(errors.gender as any).message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                <Input 
                  id="birthPlace" 
                  placeholder="Contoh: Jakarta" 
                  {...register('birthPlace')}
                  className={errors.birthPlace ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.birthPlace && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.birthPlace.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                <Input 
                  id="birthDate" 
                  type="date" 
                  {...register('birthDate')}
                  className={errors.birthDate ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Agama *</Label>
                <Select
                  value={watch('religion')}
                  onValueChange={val => setValue('religion', val as ClientFormData['religion'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientReligionEnum).map(religion => (
                      <SelectItem key={religion} value={religion}>{ClientReligionLabels[religion]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.religion && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {(errors.religion as any).message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isMinor"
                  {...register('isMinor')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isMinor" className="text-sm font-medium text-gray-700">
                  Klien adalah anak di bawah umur (di bawah 18 tahun)
                </Label>
              </div>
            </div>
          </div>

          {/* Guardian Information Section */}
          {isMinor && (
            <>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Sekolah</h3>
                <p className="text-sm text-gray-600 mb-4">Data pendidikan untuk klien di bawah umur</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="school">Nama Sekolah *</Label>
                    <Input 
                      id="school" 
                      placeholder="Nama sekolah" 
                      {...register('school')}
                      className={errors.school ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.school && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.school.message}
                  </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="grade">Kelas *</Label>
                    <Input 
                      id="grade" 
                      placeholder="Contoh: Kelas 3 SD, Kelas 1 SMA" 
                      {...register('grade')}
                      className={errors.grade ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.grade && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.grade.message}
                  </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Wali</h3>
                <p className="text-sm text-gray-600 mb-4">Data wali hukum untuk klien di bawah umur</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="guardianFullName">Nama Lengkap Wali *</Label>
                    <Input 
                      id="guardianFullName" 
                      placeholder="Nama lengkap wali" 
                      {...register('guardianFullName')}
                      className={errors.guardianFullName ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.guardianFullName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.guardianFullName.message}
                  </p>
                    )}
                  </div>
                  <div>
                    <Label>Hubungan dengan Klien *</Label>
                    <Select
                      value={watch('guardianRelationship') || ''}
                      onValueChange={val => setValue('guardianRelationship', val as ClientFormData['guardianRelationship'], { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger className={errors.guardianRelationship ? 'border-red-500 focus:border-red-500' : ''}>
                        <SelectValue placeholder="Pilih hubungan" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClientGuardianRelationshipEnum).map(relationship => (
                          <SelectItem key={relationship} value={relationship}>
                            {ClientGuardianRelationshipLabels[relationship]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guardianRelationship && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {(errors.guardianRelationship as any).message}
                  </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <Label htmlFor="guardianPhone">Nomor Telepon Wali *</Label>
                    <Input 
                      id="guardianPhone" 
                      placeholder="+6281234567890" 
                      {...register('guardianPhone')}
                      className={errors.guardianPhone ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.guardianPhone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.guardianPhone.message}
                  </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="guardianOccupation">Pekerjaan Wali *</Label>
                    <Input 
                      id="guardianOccupation" 
                      placeholder="Pekerjaan wali" 
                      {...register('guardianOccupation')}
                      className={errors.guardianOccupation ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.guardianOccupation && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.guardianOccupation.message}
                  </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <Label>Status Pernikahan Wali</Label>
                    <Select
                      value={watch('guardianMaritalStatus') || ''}
                      onValueChange={val => setValue('guardianMaritalStatus', val as ClientFormData['guardianMaritalStatus'], { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger className={errors.guardianMaritalStatus ? 'border-red-500 focus:border-red-500' : ''}>
                        <SelectValue placeholder="Pilih status pernikahan" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClientGuardianMaritalStatusEnum).map(status => (
                          <SelectItem key={status} value={status}>
                            {ClientGuardianMaritalStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guardianMaritalStatus && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {(errors.guardianMaritalStatus as any).message}
                  </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="guardianAddress">Alamat Wali *</Label>
                    <Input 
                      id="guardianAddress" 
                      placeholder="Alamat wali" 
                      {...register('guardianAddress')}
                      className={errors.guardianAddress ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.guardianAddress && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.guardianAddress.message}
                  </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="guardianLegalCustody"
                      {...register('guardianLegalCustody')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="guardianLegalCustody" className="text-sm font-medium text-gray-700">
                      Memiliki hak asuh hukum
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="guardianCustodyDocsAttached"
                      {...register('guardianCustodyDocsAttached')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="guardianCustodyDocsAttached" className="text-sm font-medium text-gray-700">
                      Dokumen hak asuh terlampir
                    </Label>
                  </div>
                </div>

                {/* Use Guardian as Emergency Contact Checkbox */}
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useGuardianAsEmergencyContact"
                      checked={useGuardianAsEmergencyContact}
                      onChange={(e) => {
                        setUseGuardianAsEmergencyContact(e.target.checked);
                        if (e.target.checked) {
                          // Fill emergency contact fields with guardian data
                          setValue('emergencyContactName', watch('guardianFullName') || '', { shouldDirty: true, shouldValidate: true });
                          setValue('emergencyContactPhone', watch('guardianPhone') || '', { shouldDirty: true, shouldValidate: true });
                          setValue('emergencyContactRelationship', watch('guardianRelationship') ? ClientGuardianRelationshipLabels[watch('guardianRelationship') as keyof typeof ClientGuardianRelationshipLabels] : '', { shouldDirty: true, shouldValidate: true });
                          setValue('emergencyContactAddress', watch('guardianAddress') || '', { shouldDirty: true, shouldValidate: true });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="useGuardianAsEmergencyContact" className="text-sm font-medium text-gray-700">
                      Gunakan data wali sebagai kontak darurat
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contact Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Kontak</h3>
            <p className="text-sm text-gray-600 mb-4">Data kontak untuk komunikasi dengan klien</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input 
                  id="phone" 
                  placeholder="+6281234567890" 
                  {...register('phone')}
                  className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Alamat Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  {...register('email')}
                  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea 
                id="address" 
                placeholder="Alamat lengkap klien" 
                {...register('address')}
                className={errors.address ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircleIcon className="w-3 h-3 mr-1" />
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Professional & Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Profesional & Pribadi</h3>
            <p className="text-sm text-gray-600 mb-4">Data pekerjaan, pendidikan, dan informasi pribadi lainnya</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="occupation">Pekerjaan *</Label>
                <Input 
                  id="occupation" 
                  placeholder="Pekerjaan" 
                  {...register('occupation')}
                  className={errors.occupation ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.occupation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.occupation.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Status Pernikahan *</Label>
                <Select
                  value={watch('maritalStatus')}
                  onValueChange={val => setValue('maritalStatus', val as ClientFormData['maritalStatus'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status pernikahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientMaritalStatusEnum).map(status => (
                      <SelectItem key={status} value={status}>{ClientMaritalStatusLabels[status]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maritalStatus && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {(errors.maritalStatus as any).message}
                  </p>
                )}
              </div>
            </div>

            {/* Spouse Information - Only show if married */}
            {watch('maritalStatus') === ClientMaritalStatusEnum.Married && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label htmlFor="spouseName">Nama Pasangan *</Label>
                  <Input 
                    id="spouseName" 
                    placeholder="Nama pasangan" 
                    {...register('spouseName')}
                    className={errors.spouseName ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.spouseName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      {errors.spouseName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Hubungan dengan Pasangan *</Label>
                  <Select
                    value={watch('relationshipWithSpouse') || ''}
                    onValueChange={val => setValue('relationshipWithSpouse', val as ClientFormData['relationshipWithSpouse'], { shouldDirty: true, shouldValidate: true })}
                  >
                    <SelectTrigger className={errors.relationshipWithSpouse ? 'border-red-500 focus:border-red-500' : ''}>
                      <SelectValue placeholder="Pilih hubungan" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ClientRelationshipWithSpouseEnum).map(rel => (
                        <SelectItem key={rel} value={rel}>{ClientRelationshipWithSpouseLabels[rel]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relationshipWithSpouse && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircleIcon className="w-3 h-3 mr-1" />
                      {(errors.relationshipWithSpouse as any).message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Pendidikan *</Label>
                <Select
                  value={watch('education')}
                  onValueChange={val => setValue('education', val as ClientFormData['education'], { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClientEducationEnum).map(education => (
                      <SelectItem key={education} value={education}>{ClientEducationLabels[education]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.education && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {(errors.education as any).message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="educationMajor">Jurusan/Program Studi</Label>
                <Input id="educationMajor" placeholder="Contoh: Teknik Informatika, Manajemen" {...register('educationMajor')} />
                {errors.educationMajor && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.educationMajor.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="hobbies">Hobi</Label>
                <Input id="hobbies" placeholder="Hobi (opsional)" {...register('hobbies')} />
                {errors.hobbies && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.hobbies.message}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Emergency Contact Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Kontak Darurat</h3>
            <p className="text-sm text-gray-600 mb-4">
              {useGuardianAsEmergencyContact && isMinor 
                ? 'Data kontak darurat menggunakan informasi wali (otomatis tersinkronisasi)'
                : 'Data kontak darurat untuk keadaan darurat'
              }
            </p>
            {useGuardianAsEmergencyContact && isMinor && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  ℹ️ Data kontak darurat akan otomatis menggunakan informasi wali yang telah diisi di atas.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergencyContactName">Nama Kontak Darurat *</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Nama lengkap kontak darurat"
                  {...register('emergencyContactName')}
                  readOnly={useGuardianAsEmergencyContact && isMinor}
                  className={useGuardianAsEmergencyContact && isMinor ? 'bg-gray-50 cursor-not-allowed' : ''}
                />
                {errors.emergencyContactName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.emergencyContactName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">
                  Nomor Telepon Kontak Darurat {isMinor ? '*' : ''}
                </Label>
                <Input
                  id="emergencyContactPhone"
                  placeholder="+6281234567890"
                  {...register('emergencyContactPhone')}
                  readOnly={useGuardianAsEmergencyContact && isMinor}
                  className={`${useGuardianAsEmergencyContact && isMinor ? 'bg-gray-50 cursor-not-allowed' : ''} ${errors.emergencyContactPhone ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.emergencyContactPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.emergencyContactPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="emergencyContactRelationship">Hubungan dengan Klien *</Label>
                <Input
                  id="emergencyContactRelationship"
                  placeholder="Contoh: Suami, Istri, Anak, Orang Tua"
                  {...register('emergencyContactRelationship')}
                  readOnly={useGuardianAsEmergencyContact && isMinor}
                  className={useGuardianAsEmergencyContact && isMinor ? 'bg-gray-50 cursor-not-allowed' : ''}
                />
                {errors.emergencyContactRelationship && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.emergencyContactRelationship.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="emergencyContactAddress">
                  Alamat Kontak Darurat {isMinor ? '*' : ''}
                </Label>
                <Input
                  id="emergencyContactAddress"
                  placeholder={isMinor ? "Alamat kontak darurat" : "Alamat kontak darurat (opsional)"}
                  {...register('emergencyContactAddress')}
                  readOnly={useGuardianAsEmergencyContact && isMinor}
                  className={`${useGuardianAsEmergencyContact && isMinor ? 'bg-gray-50 cursor-not-allowed' : ''} ${errors.emergencyContactAddress ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.emergencyContactAddress && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    {errors.emergencyContactAddress.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Kunjungan Pertama *</Label>
              <Select
                value={watch('firstVisit') ? 'true' : 'false'}
                onValueChange={val => setValue('firstVisit', val === 'true', { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status kunjungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ya, kunjungan pertama</SelectItem>
                  <SelectItem value="false">Tidak, sudah pernah berkunjung</SelectItem>
                </SelectContent>
              </Select>
              {errors.firstVisit && (
                <p className="mt-1 text-sm text-red-600">{(errors.firstVisit as any).message}
                  </p>
              )}
            </div>
          </div>

          {!watch('firstVisit') && (
            <div>
              <Label htmlFor="previousVisitDetails">Detail Kunjungan Sebelumnya *</Label>
              <Textarea 
                id="previousVisitDetails" 
                rows={3} 
                placeholder="Jelaskan detail kunjungan sebelumnya" 
                {...register('previousVisitDetails')}
                className={errors.previousVisitDetails ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.previousVisitDetails && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircleIcon className="w-3 h-3 mr-1" />
                {errors.previousVisitDetails.message}
                  </p>
              )}
            </div>
          )}

          {/* Primary Issue Section */}
          <div>
            <Label htmlFor="primaryIssue">Isu Utama / Keluhan Utama *</Label>
            <Textarea
              id="primaryIssue"
              rows={3}
              placeholder="Jelaskan isu utama atau keluhan utama yang ingin dibahas dalam terapi"
              {...register('primaryIssue')}
              className={errors.primaryIssue ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.primaryIssue && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircleIcon className="w-3 h-3 mr-1" />
                {errors.primaryIssue.message}
                  </p>
            )}
          </div>


          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {/* Left side - Cancel button */}
            <Button type="button" variant="outline" onClick={handleCancel}>
              Batal
            </Button>

            {/* Right side - Submit button */}
            <Button
              type="submit"
              variant="default"
              disabled={
                clientLoading ||
                isSubmitting ||
                !isFormValid ||
                (mode === 'create' && !isDirty)
              }
            >
              {clientLoading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {mode === 'edit' ? 'Menyimpan...' : 'Menyimpan...'}
                </>
              ) : !isValid || (mode === 'create' && !isDirty) ? (
                mode === 'edit' ? 'Lengkapi Form untuk Update' : 'Lengkapi Form untuk Melanjutkan'
              ) : (
                mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Klien'
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
}

export default ClientFormModal;