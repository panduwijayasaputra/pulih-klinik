import { useState, useCallback, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/toast';
import { 
  consultationSchema,
  generalConsultationSchema,
  drugAddictionConsultationSchema,
  minorConsultationSchema,
  updateConsultationSchema,
  consultationStepSchemas,
  ConsultationFormData,
  GeneralConsultationFormData,
  DrugAddictionConsultationFormData,
  MinorConsultationFormData,
  UpdateConsultationFormData
} from '@/schemas/consultationSchema';
import { useConsultation as useConsultationStore } from '@/store/consultation';
import { 
  Consultation,
  ConsultationFormTypeEnum,
  ConsultationStatusEnum,
  CreateConsultationData,
  UpdateConsultationData
} from '@/types/consultation';

// Generic hook for consultation forms
export function useConsultationForm<T extends ConsultationFormTypeEnum>(
  formType?: T,
  consultation?: Consultation
) {
  const { addToast } = useToast();
  const store = useConsultationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the appropriate schema based on form type
  const getSchemaForType = useCallback((type: ConsultationFormTypeEnum) => {
    switch (type) {
      case ConsultationFormTypeEnum.General:
        return generalConsultationSchema;
      case ConsultationFormTypeEnum.DrugAddiction:
        return drugAddictionConsultationSchema;
      case ConsultationFormTypeEnum.Minor:
        return minorConsultationSchema;
      default:
        return consultationSchema;
    }
  }, []);

  // Initialize form with appropriate schema
  const schema = useMemo(() => {
    if (consultation) {
      return updateConsultationSchema;
    }
    return formType ? getSchemaForType(formType) : consultationSchema;
  }, [formType, consultation, getSchemaForType]);

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(schema),
    defaultValues: consultation || {
      formType: formType || ConsultationFormTypeEnum.General,
      status: ConsultationStatusEnum.Draft,
      sessionDuration: 60,
      previousTherapyExperience: false,
      currentMedications: false,
      symptomSeverity: 3 as const,
      treatmentGoals: [],
      // Type-specific defaults
      ...(formType === ConsultationFormTypeEnum.General && {
        currentLifeStressors: [],
        workLifeBalance: 3 as const,
        familyMentalHealthHistory: false,
        previousMentalHealthDiagnosis: false,
      }),
      ...(formType === ConsultationFormTypeEnum.DrugAddiction && {
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
      ...(formType === ConsultationFormTypeEnum.Minor && {
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
    },
    mode: 'onChange',
  });

  // Handle form submission
  const handleSubmit = useCallback(async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    
    try {
      let result: Consultation;

      if (consultation) {
        // Update existing consultation
        const updateData: UpdateConsultationData = {
          ...data,
          id: consultation.id,
        };
        result = await store.updateConsultation(consultation.id, updateData);
        addToast({
          type: 'success',
          title: 'Berhasil',
          message: 'Konsultasi berhasil diperbarui'
        });
      } else {
        // Create new consultation
        const createData = data as CreateConsultationData;
        result = await store.createConsultation(createData);
        addToast({
          type: 'success',
          title: 'Berhasil',
          message: 'Konsultasi berhasil dibuat'
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      addToast({
        type: 'error',
        title: 'Gagal',
        message: errorMessage
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [consultation, store]);

  // Handle form save (without validation)
  const handleSave = useCallback(async (status: ConsultationStatusEnum = ConsultationStatusEnum.Draft) => {
    const data = form.getValues();
    data.status = status;

    try {
      await handleSubmit(data);
    } catch (error) {
      // Error is already handled in handleSubmit
      throw error;
    }
  }, [form, handleSubmit]);

  // Validate specific step
  const validateStep = useCallback((step: keyof typeof consultationStepSchemas, data: any) => {
    try {
      consultationStepSchemas[step].parse(data);
      return { isValid: true, errors: null };
    } catch (error: any) {
      return {
        isValid: false,
        errors: error.errors || [],
      };
    }
  }, []);

  return {
    form,
    isSubmitting,
    isLoading: store.loading,
    error: store.error,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleSave,
    validateStep,
    clearError: store.clearError,
  };
}

// Specific hooks for each consultation type
export function useGeneralConsultationForm(consultation?: Consultation) {
  return useConsultationForm(ConsultationFormTypeEnum.General, consultation);
}

export function useDrugAddictionConsultationForm(consultation?: Consultation) {
  return useConsultationForm(ConsultationFormTypeEnum.DrugAddiction, consultation);
}

export function useMinorConsultationForm(consultation?: Consultation) {
  return useConsultationForm(ConsultationFormTypeEnum.Minor, consultation);
}

// Hook for consultation data management
export function useConsultationData() {
  const { addToast } = useToast();
  const store = useConsultationStore();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Load consultations with loading state management
  const loadConsultations = useCallback(async (clientId?: string, force?: boolean) => {
    const key = `load-${clientId || 'all'}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await store.loadConsultations(clientId, force);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [store]);

  // Load single consultation with loading state
  const loadConsultation = useCallback(async (consultationId: string) => {
    const key = `load-consultation-${consultationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await store.loadConsultation(consultationId);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [store]);

  // Delete consultation with confirmation and loading state
  const deleteConsultation = useCallback(async (consultationId: string) => {
    const consultation = store.consultations.find(c => c.id === consultationId);
    if (!consultation) {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: 'Konsultasi tidak ditemukan'
      });
      return;
    }

    const key = `delete-${consultationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await store.deleteConsultation(consultationId);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil dihapus'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus konsultasi';
      addToast({
        type: 'error',
        title: 'Gagal',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [store, addToast]);

  // Duplicate consultation with loading state
  const duplicateConsultation = useCallback(async (consultationId: string) => {
    const key = `duplicate-${consultationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      const duplicated = await store.duplicateConsultation(consultationId);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil diduplikasi'
      });
      return duplicated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menduplikasi konsultasi';
      addToast({
        type: 'error',
        title: 'Gagal',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [store, addToast]);

  // Update consultation status with loading state
  const updateConsultationStatus = useCallback(async (consultationId: string, status: ConsultationStatusEnum) => {
    const key = `status-${consultationId}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await store.updateConsultationStatus(consultationId, status);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Status konsultasi berhasil diperbarui'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui status konsultasi';
      addToast({
        type: 'error',
        title: 'Gagal',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, [store, addToast]);

  // Get consultation data with memoization
  const getConsultationsByClient = useCallback((clientId: string) => {
    return store.getConsultationsByClient(clientId);
  }, [store]);

  const getConsultationsByStatus = useCallback((status: ConsultationStatusEnum) => {
    return store.getConsultationsByStatus(status);
  }, [store]);

  const getConsultationsByType = useCallback((formType: ConsultationFormTypeEnum) => {
    return store.getConsultationsByType(formType);
  }, [store]);

  const searchConsultations = useCallback((query: string) => {
    return store.searchConsultations(query);
  }, [store]);

  const getConsultationHistory = useCallback((clientId: string) => {
    return store.getConsultationHistory(clientId);
  }, [store]);

  // Computed values with memoization
  const consultationStats = useMemo(() => {
    return store.getConsultationStats();
  }, [store.consultations]);

  const isLoading = useMemo(() => {
    return store.loading || Object.values(loadingStates).some(Boolean);
  }, [store.loading, loadingStates]);

  const getLoadingState = useCallback((operation: string, id?: string) => {
    const key = id ? `${operation}-${id}` : operation;
    return loadingStates[key] || false;
  }, [loadingStates]);

  return {
    // State
    consultations: store.consultations,
    consultationsByClientId: store.consultationsByClientId,
    currentConsultation: store.currentConsultation,
    isLoading,
    error: store.error,
    consultationStats,

    // Actions
    loadConsultations,
    loadConsultation,
    deleteConsultation,
    duplicateConsultation,
    updateConsultationStatus,
    setCurrentConsultation: store.setCurrentConsultation,

    // Getters
    getConsultationsByClient,
    getConsultationsByStatus,
    getConsultationsByType,
    searchConsultations,
    getConsultationHistory,

    // Utilities
    getLoadingState,
    clearError: store.clearError,
    resetStore: store.resetStore,
  };
}

// Combined hook that provides both form and data management
export function useConsultationManager(
  formType?: ConsultationFormTypeEnum,
  consultation?: Consultation
) {
  const formHook = useConsultationForm(formType, consultation);
  const dataHook = useConsultationData();

  return {
    ...formHook,
    ...dataHook,
    // Avoid naming conflicts
    formLoading: formHook.isLoading,
    dataLoading: dataHook.isLoading,
    isLoading: formHook.isLoading || dataHook.isLoading,
  };
}

// Export default hook for general use
export default useConsultationData;