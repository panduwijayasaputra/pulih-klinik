'use client';

import React, { useCallback, useEffect } from 'react';

import { FormModal } from '@/components/ui/form-modal';
import { ConsultationForm } from './ConsultationForm';
import { useConsultationForm } from '@/hooks/useConsultation';
import { useToast } from '@/components/ui/toast';

import { 
  Consultation, 
  ConsultationFormTypeEnum, 
  ConsultationStatusEnum,
  ConsultationFormTypeLabels,
} from '@/types/consultation';
import { ConsultationFormData } from '@/schemas/consultationSchema';

export interface ConsultationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation?: Consultation;
  clientId: string;
  therapistId: string;
  formType?: ConsultationFormTypeEnum;
  mode?: 'create' | 'edit' | 'view';
  onSuccess?: (consultation: Consultation) => void;
  onCancel?: () => void;
}

export const ConsultationFormModal: React.FC<ConsultationFormModalProps> = ({
  open,
  onOpenChange,
  consultation,
  clientId,
  therapistId,
  formType,
  mode = 'create',
  onSuccess,
  onCancel,
}) => {
  const { addToast } = useToast();
  
  // Determine form type from consultation or props
  const resolvedFormType = consultation?.formType || formType || ConsultationFormTypeEnum.General;
  
  // Initialize form with consultation hook
  const {
    form,
    handleSubmit,
    handleSave,
    isSubmitting,
    isLoading,
    error,
    clearError,
  } = useConsultationForm(resolvedFormType, consultation);

  // Check if editing should be restricted based on status
  const isEditingRestricted = consultation?.status === ConsultationStatusEnum.Completed || 
                             consultation?.status === ConsultationStatusEnum.Archived;
  
  const isViewMode = mode === 'view' || (mode === 'edit' && isEditingRestricted);
  const allowTypeChange = mode === 'create' && !consultation;

  // Set up form defaults when modal opens
  useEffect(() => {
    if (open && !consultation) {
      // Set default values for new consultation
      form.reset({
        clientId,
        therapistId,
        formType: resolvedFormType,
        status: ConsultationStatusEnum.Draft,
        sessionDate: new Date().toISOString().slice(0, 16), // Current date-time in local format
        sessionDuration: 60,
        previousTherapyExperience: false,
        currentMedications: false,
        symptomSeverity: 3 as const,
        treatmentGoals: [],
        // Type-specific defaults
        ...(resolvedFormType === ConsultationFormTypeEnum.General && {
          currentLifeStressors: [],
          workLifeBalance: 3 as const,
          familyMentalHealthHistory: false,
          previousMentalHealthDiagnosis: false,
        }),
        ...(resolvedFormType === ConsultationFormTypeEnum.DrugAddiction && {
          additionalSubstances: [],
          withdrawalSymptoms: [],
          toleranceLevel: 3 as const,
          attemptsToQuit: 0,
          socialCircleSubstanceUse: false,
          triggerSituations: [],
          environmentalFactors: [],
          previousTreatmentPrograms: false,
          legalIssuesRelated: false,
        }),
        ...(resolvedFormType === ConsultationFormTypeEnum.Minor && {
          guardianPresent: true,
          academicPerformance: 3 as const,
          schoolBehaviorIssues: false,
          parentalConcerns: [],
          familyConflicts: false,
          socialDifficulties: false,
          bullyingHistory: false,
          attentionConcerns: false,
          behavioralConcerns: false,
        }),
      });
    } else if (open && consultation) {
      // Reset form with existing consultation data
      form.reset(consultation);
    }
  }, [open, consultation, clientId, therapistId, resolvedFormType, form]);

  // Handle form submission
  const onSubmit = useCallback(async (data: ConsultationFormData) => {
    try {
      const result = await handleSubmit(data);
      if (result) {
        onSuccess?.(result);
        onOpenChange(false);
        addToast({
          type: 'success',
          title: 'Berhasil',
          message: mode === 'edit' ? 'Konsultasi berhasil diperbarui' : 'Konsultasi berhasil dibuat'
        });
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error('Form submission error:', error);
    }
  }, [handleSubmit, onSuccess, onOpenChange, mode]);

  // Handle save actions
  const onSave = useCallback(async (status?: ConsultationStatusEnum) => {
    try {
      const result = await handleSave(status);
      if (result) {
        onSuccess?.(result);
        const statusText = status === ConsultationStatusEnum.Draft ? 'disimpan sebagai draft' : 
                          status === ConsultationStatusEnum.Completed ? 'diselesaikan' : 'disimpan';
        addToast({
          type: 'success',
          title: 'Berhasil',
          message: `Konsultasi berhasil ${statusText}`
        });
        if (status === ConsultationStatusEnum.Completed) {
          onOpenChange(false);
        }
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error('Save error:', error);
    }
  }, [handleSave, onSuccess, onOpenChange]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (form.formState.isDirty) {
      const confirmed = window.confirm(
        'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?'
      );
      if (!confirmed) return;
    }
    
    onCancel?.();
    onOpenChange(false);
    clearError();
  }, [form.formState.isDirty, onCancel, onOpenChange, clearError]);

  // Handle modal close
  const handleModalClose = useCallback((open: boolean) => {
    if (!open) {
      handleCancel();
    } else {
      onOpenChange(open);
    }
  }, [handleCancel, onOpenChange]);

  // Clear error when modal opens
  useEffect(() => {
    if (open) {
      clearError();
    }
  }, [open, clearError]);

  // Generate modal title and description
  const getModalTitle = () => {
    const typeLabel = ConsultationFormTypeLabels[resolvedFormType];
    
    if (mode === 'create') {
      return `Buat ${typeLabel} Baru`;
    } else if (mode === 'edit') {
      if (isEditingRestricted) {
        return `Lihat ${typeLabel}`;
      }
      return `Edit ${typeLabel}`;
    } else {
      return `Lihat ${typeLabel}`;
    }
  };

  const getModalDescription = () => {
    if (mode === 'create') {
      return `Buat konsultasi ${ConsultationFormTypeLabels[resolvedFormType].toLowerCase()} baru untuk klien`;
    } else if (mode === 'edit') {
      if (isEditingRestricted) {
        return `Konsultasi ini tidak dapat diedit karena sudah ${consultation?.status === ConsultationStatusEnum.Completed ? 'selesai' : 'diarsipkan'}`;
      }
      return `Edit data konsultasi ${ConsultationFormTypeLabels[resolvedFormType].toLowerCase()}`;
    } else {
      return `Lihat detail konsultasi ${ConsultationFormTypeLabels[resolvedFormType].toLowerCase()}`;
    }
  };

  // Show loading state
  if (isLoading && !form.formState.isLoaded) {
    return (
      <FormModal
        open={open}
        onOpenChange={handleModalClose}
        title="Memuat..."
        description="Sedang memuat data konsultasi"
        size="2xl"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600">Memuat konsultasi...</span>
        </div>
      </FormModal>
    );
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleModalClose}
      title={getModalTitle()}
      description={getModalDescription()}
      size="2xl"
      showCloseButton={true}
    >
      {/* Display error if any */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Terjadi Kesalahan
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearError}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                <span className="sr-only">Tutup</span>
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show editing restriction notice */}
      {isEditingRestricted && mode === 'edit' && (
        <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Konsultasi Tidak Dapat Diedit
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Konsultasi yang sudah {consultation?.status === ConsultationStatusEnum.Completed ? 'selesai' : 'diarsipkan'} tidak dapat diedit. 
                Anda hanya dapat melihat data konsultasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Form */}
      <ConsultationForm
        form={form}
        onSubmit={onSubmit}
        onSave={onSave}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        mode={mode}
        allowTypeChange={allowTypeChange}
      />

      {/* View Mode Actions */}
      {isViewMode && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between">
            <div>
              {consultation?.status && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  consultation.status === ConsultationStatusEnum.Draft 
                    ? 'bg-gray-100 text-gray-800'
                    : consultation.status === ConsultationStatusEnum.InProgress
                    ? 'bg-yellow-100 text-yellow-800'
                    : consultation.status === ConsultationStatusEnum.Completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  Status: {consultation.status === ConsultationStatusEnum.Draft ? 'Draft' :
                          consultation.status === ConsultationStatusEnum.InProgress ? 'Sedang Berlangsung' :
                          consultation.status === ConsultationStatusEnum.Completed ? 'Selesai' : 'Diarsipkan'}
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              {consultation && consultation.status !== ConsultationStatusEnum.Completed && consultation.status !== ConsultationStatusEnum.Archived && (
                <button
                  onClick={() => {
                    onOpenChange(false);
                    // You could trigger edit mode here if needed
                    // onEditRequest?.(consultation);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isLoading}
                >
                  Edit Konsultasi
                </button>
              )}
              
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </FormModal>
  );
};

export default ConsultationFormModal;