import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConsultationAPI } from '@/lib/api/consultation';
import { 
  Consultation, 
  ConsultationFormTypeEnum,
  ConsultationStatusEnum,
  CreateConsultationData,
  UpdateConsultationData,
  ConsultationResponse,
  ConsultationListResponse
} from '@/types/consultation';

interface ConsultationState {
  // State
  consultations: Consultation[];
  consultationsByClientId: Record<string, Consultation[]>;
  currentConsultation: Consultation | null;
  loading: boolean;
  error: string | null;
  
  // Derived state
  totalConsultations: number;
  
  // Actions - CRUD operations
  loadConsultations: (clientId?: string, force?: boolean) => Promise<void>;
  loadConsultation: (consultationId: string) => Promise<void>;
  createConsultation: (data: CreateConsultationData) => Promise<Consultation>;
  updateConsultation: (consultationId: string, data: UpdateConsultationData) => Promise<Consultation>;
  deleteConsultation: (consultationId: string) => Promise<void>;
  
  // Consultation management actions
  setCurrentConsultation: (consultation: Consultation | null) => void;
  updateConsultationStatus: (consultationId: string, status: ConsultationStatusEnum) => Promise<void>;
  duplicateConsultation: (consultationId: string) => Promise<Consultation>;
  
  // Filtering and searching
  getConsultationsByClient: (clientId: string) => Consultation[];
  getConsultationsByStatus: (status: ConsultationStatusEnum) => Consultation[];
  getConsultationsByType: (formType: ConsultationFormTypeEnum) => Consultation[];
  searchConsultations: (query: string) => Consultation[];
  
  // History and analytics
  getConsultationHistory: (clientId: string) => Consultation[];
  getConsultationStats: () => {
    total: number;
    byStatus: Record<ConsultationStatusEnum, number>;
    byType: Record<ConsultationFormTypeEnum, number>;
    completionRate: number;
  };
  
  // Utility actions
  clearError: () => void;
  resetStore: () => void;
}

const initialState = {
  consultations: [],
  consultationsByClientId: {},
  currentConsultation: null,
  loading: false,
  error: null,
  totalConsultations: 0,
};

export const useConsultation = create<ConsultationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // CRUD Operations
      loadConsultations: async (clientId?: string, force = false) => {
        const state = get();
        
        // Skip loading if data exists and not forced
        if (!force && state.consultations.length > 0 && !clientId) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const response: ConsultationListResponse = await ConsultationAPI.getConsultations(clientId);
          
          if (response.success && response.data) {
            const consultations = response.data.items;
            
            // Update consultations by client ID mapping
            const consultationsByClientId = { ...state.consultationsByClientId };
            consultations.forEach(consultation => {
              if (!consultationsByClientId[consultation.clientId]) {
                consultationsByClientId[consultation.clientId] = [];
              }
              // Remove existing consultation with same ID
              consultationsByClientId[consultation.clientId] = 
                consultationsByClientId[consultation.clientId].filter(c => c.id !== consultation.id);
              // Add updated consultation
              consultationsByClientId[consultation.clientId].push(consultation);
              // Sort by created date (newest first)
              consultationsByClientId[consultation.clientId].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            });

            set({
              consultations: clientId 
                ? [...state.consultations.filter(c => c.clientId !== clientId), ...consultations]
                : consultations,
              consultationsByClientId,
              totalConsultations: clientId ? state.totalConsultations : response.data.total,
              loading: false,
            });
          } else {
            set({ 
              error: response.message || 'Gagal memuat data konsultasi',
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat konsultasi',
            loading: false 
          });
        }
      },

      loadConsultation: async (consultationId: string) => {
        set({ loading: true, error: null });

        try {
          const response: ConsultationResponse = await ConsultationAPI.getConsultation(consultationId);
          
          if (response.success && response.data) {
            const consultation = response.data;
            const state = get();

            // Update consultations array
            const consultations = state.consultations.map(c => 
              c.id === consultation.id ? consultation : c
            );

            // If not found in array, add it
            if (!consultations.find(c => c.id === consultation.id)) {
              consultations.push(consultation);
            }

            // Update consultations by client ID mapping
            const consultationsByClientId = { ...state.consultationsByClientId };
            if (!consultationsByClientId[consultation.clientId]) {
              consultationsByClientId[consultation.clientId] = [];
            }
            consultationsByClientId[consultation.clientId] = 
              consultationsByClientId[consultation.clientId].filter(c => c.id !== consultation.id);
            consultationsByClientId[consultation.clientId].push(consultation);

            set({
              consultations,
              consultationsByClientId,
              currentConsultation: consultation,
              loading: false,
            });
          } else {
            set({ 
              error: response.message || 'Gagal memuat data konsultasi',
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat konsultasi',
            loading: false 
          });
        }
      },

      createConsultation: async (data: CreateConsultationData): Promise<Consultation> => {
        set({ loading: true, error: null });

        try {
          const response: ConsultationResponse = await ConsultationAPI.createConsultation(data);
          
          if (response.success && response.data) {
            const newConsultation = response.data;
            const state = get();

            // Add to consultations array
            const consultations = [newConsultation, ...state.consultations];

            // Update consultations by client ID mapping
            const consultationsByClientId = { ...state.consultationsByClientId };
            if (!consultationsByClientId[newConsultation.clientId]) {
              consultationsByClientId[newConsultation.clientId] = [];
            }
            consultationsByClientId[newConsultation.clientId].unshift(newConsultation);

            set({
              consultations,
              consultationsByClientId,
              totalConsultations: state.totalConsultations + 1,
              loading: false,
            });

            return newConsultation;
          } else {
            const error = response.message || 'Gagal membuat konsultasi';
            set({ error, loading: false });
            throw new Error(error);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat konsultasi';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      updateConsultation: async (consultationId: string, data: UpdateConsultationData): Promise<Consultation> => {
        set({ loading: true, error: null });

        try {
          const response: ConsultationResponse = await ConsultationAPI.updateConsultation(consultationId, data);
          
          if (response.success && response.data) {
            const updatedConsultation = response.data;
            const state = get();

            // Update consultations array
            const consultations = state.consultations.map(c => 
              c.id === consultationId ? updatedConsultation : c
            );

            // Update consultations by client ID mapping
            const consultationsByClientId = { ...state.consultationsByClientId };
            if (consultationsByClientId[updatedConsultation.clientId]) {
              consultationsByClientId[updatedConsultation.clientId] = 
                consultationsByClientId[updatedConsultation.clientId].map(c => 
                  c.id === consultationId ? updatedConsultation : c
                );
            }

            set({
              consultations,
              consultationsByClientId,
              currentConsultation: state.currentConsultation?.id === consultationId 
                ? updatedConsultation 
                : state.currentConsultation,
              loading: false,
            });

            return updatedConsultation;
          } else {
            const error = response.message || 'Gagal memperbarui konsultasi';
            set({ error, loading: false });
            throw new Error(error);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui konsultasi';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      deleteConsultation: async (consultationId: string): Promise<void> => {
        set({ loading: true, error: null });

        try {
          const response = await ConsultationAPI.deleteConsultation(consultationId);
          
          if (response.success) {
            const state = get();
            const consultationToDelete = state.consultations.find(c => c.id === consultationId);

            // Remove from consultations array
            const consultations = state.consultations.filter(c => c.id !== consultationId);

            // Update consultations by client ID mapping
            const consultationsByClientId = { ...state.consultationsByClientId };
            if (consultationToDelete && consultationsByClientId[consultationToDelete.clientId]) {
              consultationsByClientId[consultationToDelete.clientId] = 
                consultationsByClientId[consultationToDelete.clientId].filter(c => c.id !== consultationId);
            }

            set({
              consultations,
              consultationsByClientId,
              totalConsultations: Math.max(0, state.totalConsultations - 1),
              currentConsultation: state.currentConsultation?.id === consultationId 
                ? null 
                : state.currentConsultation,
              loading: false,
            });
          } else {
            const error = response.message || 'Gagal menghapus konsultasi';
            set({ error, loading: false });
            throw new Error(error);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus konsultasi';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Consultation Management Actions
      setCurrentConsultation: (consultation: Consultation | null) => {
        set({ currentConsultation: consultation });
      },

      updateConsultationStatus: async (consultationId: string, status: ConsultationStatusEnum): Promise<void> => {
        const { updateConsultation } = get();
        await updateConsultation(consultationId, { id: consultationId, status });
      },

      duplicateConsultation: async (consultationId: string): Promise<Consultation> => {
        const state = get();
        const originalConsultation = state.consultations.find(c => c.id === consultationId);
        
        if (!originalConsultation) {
          throw new Error('Konsultasi tidak ditemukan');
        }

        // Create duplicate data without id, createdAt, updatedAt
        const { id, createdAt, updatedAt, ...duplicateData } = originalConsultation;
        const newConsultationData: CreateConsultationData = {
          ...duplicateData,
          status: ConsultationStatusEnum.Draft,
        };

        return await get().createConsultation(newConsultationData);
      },

      // Filtering and Searching
      getConsultationsByClient: (clientId: string): Consultation[] => {
        const state = get();
        return state.consultationsByClientId[clientId] || [];
      },

      getConsultationsByStatus: (status: ConsultationStatusEnum): Consultation[] => {
        const state = get();
        return state.consultations.filter(c => c.status === status);
      },

      getConsultationsByType: (formType: ConsultationFormTypeEnum): Consultation[] => {
        const state = get();
        return state.consultations.filter(c => c.formType === formType);
      },

      searchConsultations: (query: string): Consultation[] => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        
        return state.consultations.filter(consultation => 
          consultation.primaryConcern.toLowerCase().includes(lowercaseQuery) ||
          consultation.consultationNotes?.toLowerCase().includes(lowercaseQuery) ||
          consultation.initialAssessment?.toLowerCase().includes(lowercaseQuery) ||
          consultation.recommendedTreatmentPlan?.toLowerCase().includes(lowercaseQuery)
        );
      },

      // History and Analytics
      getConsultationHistory: (clientId: string): Consultation[] => {
        const state = get();
        return (state.consultationsByClientId[clientId] || [])
          .filter(c => c.status === ConsultationStatusEnum.Completed)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getConsultationStats: () => {
        const state = get();
        const total = state.consultations.length;
        
        const byStatus: Record<ConsultationStatusEnum, number> = {
          [ConsultationStatusEnum.Draft]: 0,
          [ConsultationStatusEnum.InProgress]: 0,
          [ConsultationStatusEnum.Completed]: 0,
          [ConsultationStatusEnum.Archived]: 0,
        };
        
        const byType: Record<ConsultationFormTypeEnum, number> = {
          [ConsultationFormTypeEnum.General]: 0,
          [ConsultationFormTypeEnum.DrugAddiction]: 0,
          [ConsultationFormTypeEnum.Minor]: 0,
        };

        state.consultations.forEach(consultation => {
          byStatus[consultation.status]++;
          byType[consultation.formType]++;
        });

        const completionRate = total > 0 
          ? Math.round((byStatus[ConsultationStatusEnum.Completed] / total) * 100)
          : 0;

        return {
          total,
          byStatus,
          byType,
          completionRate,
        };
      },

      // Utility Actions
      clearError: () => {
        set({ error: null });
      },

      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'consultation-store',
      partialize: (state) => ({
        consultations: state.consultations,
        consultationsByClientId: state.consultationsByClientId,
        // Don't persist loading states or errors
      }),
    }
  )
);