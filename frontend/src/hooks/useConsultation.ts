import { useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import { 
  ConsultationFormData,
  DrugAddictionConsultationFormData,
  GeneralConsultationFormData,
  MinorConsultationFormData,
  UpdateConsultationFormData,
  consultationSchema,
  consultationStepSchemas,
  drugAddictionConsultationSchema,
  generalConsultationSchema,
  minorConsultationSchema,
  updateConsultationSchema
} from '@/schemas/consultationSchema';
import { useConsultation as useConsultationStore } from '@/store/consultation';
import { 
  Consultation,
  ConsultationFormTypeEnum,
  ConsultationStatusEnum,
  CreateConsultationData,
  UpdateConsultationData
} from '@/types/consultation';
import { ValidationError } from '@/types/consultation';
import { ConsultationAPI } from '@/lib/api/consultation';

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
    resolver: zodResolver(consultationSchema),
    defaultValues: consultation || {
      formTypes: [formType || ConsultationFormTypeEnum.General],
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

  // Reset form when consultation data changes
  useEffect(() => {
    if (consultation) {
      // Reset form with consultation data
      form.reset({
        ...consultation,
        // Ensure formTypes is set properly from consultation data
        formTypes: [consultation.formType || ConsultationFormTypeEnum.General],
      });
    }
  }, [consultation, form]);

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

// React Query based hooks for consultation data fetching
export function useConsultationQuery(consultationId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: async () => {
      const response = await ConsultationAPI.getConsultation(consultationId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch consultation');
      }
      return response.data!;
    },
    enabled: options?.enabled !== false && !!consultationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if consultation not found
      if (error?.message?.includes('not found')) return false;
      return failureCount < 2;
    },
  });
}



export function useConsultationsQuery(filters?: {
  clientId?: string;
  therapistId?: string;
  status?: ConsultationStatusEnum;
}) {
  return useQuery({
    queryKey: ['consultations', filters],
    queryFn: async () => {
      const response = await ConsultationAPI.getConsultations(
        filters?.clientId,
        filters?.therapistId,
        filters?.status
      );
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch consultations');
      }
      return response.data!;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
}

// Consultation mutations with React Query
export function useCreateConsultationMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateConsultationData) => {
      const response = await ConsultationAPI.createConsultation(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create consultation');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['consultation', data.id] });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil dibuat'
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal membuat konsultasi'
      });
    },
  });
}

export function useUpdateConsultationMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateConsultationData }) => {
      const response = await ConsultationAPI.updateConsultation(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update consultation');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Update specific consultation in cache
      queryClient.setQueryData(['consultation', data.id], data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['consultation-summary', data.id] });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil diperbarui'
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal memperbarui konsultasi'
      });
    },
  });
}

export function useDeleteConsultationMutation() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (consultationId: string) => {
      const response = await ConsultationAPI.deleteConsultation(consultationId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete consultation');
      }
      return consultationId;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['consultation', deletedId] });
      queryClient.removeQueries({ queryKey: ['consultation-summary', deletedId] });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil dihapus'
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error.message || 'Gagal menghapus konsultasi'
      });
    },
  });
}





// Export default hook for general use
export default useConsultationData;