import { 
  Consultation,
  CreateConsultationData,
  UpdateConsultationData
} from '@/types/consultation';
import { ItemResponse, PaginatedResponse } from './types';
import { apiClient } from '../http-client';

// Helper function to map backend consultation to frontend format
const mapBackendConsultationToFrontend = (backendConsultation: any): Consultation => ({
  id: backendConsultation.id,
  clientId: backendConsultation.client.id,
  therapistId: backendConsultation.therapist.id,
  formTypes: backendConsultation.formTypes,
  status: backendConsultation.status,
  createdAt: backendConsultation.createdAt,
  updatedAt: backendConsultation.updatedAt,
  
  // Session information
  sessionDate: backendConsultation.sessionDate,
  sessionDuration: backendConsultation.sessionDuration,
  consultationNotes: backendConsultation.consultationNotes,
  
  // Client background
  previousTherapyExperience: backendConsultation.previousTherapyExperience,
  previousTherapyDetails: backendConsultation.previousTherapyDetails,
  currentMedications: backendConsultation.currentMedications,
  currentMedicationsDetails: backendConsultation.currentMedicationsDetails,
  
  // Presenting concerns
  primaryConcern: backendConsultation.primaryConcern,
  secondaryConcerns: backendConsultation.secondaryConcerns,
  symptomSeverity: backendConsultation.symptomSeverity,
  symptomDuration: backendConsultation.symptomDuration,
  
  // Goals and expectations
  treatmentGoals: backendConsultation.treatmentGoals || [],
  clientExpectations: backendConsultation.clientExpectations,
  
  // Assessment results
  initialAssessment: backendConsultation.initialAssessment,
  recommendedTreatmentPlan: backendConsultation.recommendedTreatmentPlan,
  
  // Additional psychological history fields
  previousPsychologicalDiagnosis: backendConsultation.previousPsychologicalDiagnosis,
  previousPsychologicalDiagnosisDetails: backendConsultation.previousPsychologicalDiagnosisDetails,
  significantPhysicalIllness: backendConsultation.significantPhysicalIllness,
  significantPhysicalIllnessDetails: backendConsultation.significantPhysicalIllnessDetails,
  traumaticExperience: backendConsultation.traumaticExperience,
  traumaticExperienceDetails: backendConsultation.traumaticExperienceDetails,
  familyPsychologicalHistory: backendConsultation.familyPsychologicalHistory,
  familyPsychologicalHistoryDetails: backendConsultation.familyPsychologicalHistoryDetails,
  scriptGenerationPreferences: backendConsultation.scriptGenerationPreferences,
  
  // Form-specific data (will be handled by specialized interfaces)
  ...backendConsultation.formData
});

export class ConsultationAPI {
  static async getConsultations(
    filters?: {
      clientId?: string;
      therapistId?: string;
      formTypes?: string[];
      status?: string;
      search?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Consultation>> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      // Add filters to query params
      if (filters) {
        if (filters.clientId) {
          queryParams.append('clientId', filters.clientId);
        }
        if (filters.therapistId) {
          queryParams.append('therapistId', filters.therapistId);
        }
        if (filters.formTypes && filters.formTypes.length > 0) {
          filters.formTypes.forEach(type => queryParams.append('formTypes', type));
        }
        if (filters.status) {
          queryParams.append('status', filters.status);
        }
        if (filters.search) {
          queryParams.append('search', filters.search);
        }
        if (filters.dateFrom) {
          queryParams.append('dateFrom', filters.dateFrom);
        }
        if (filters.dateTo) {
          queryParams.append('dateTo', filters.dateTo);
        }
      }

      const response = await apiClient.get(`/consultations?${queryParams.toString()}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: { consultations, total, page, limit, totalPages }, message: "..." }
      const backendData = response.data.data;
      
      return {
        success: true,
        data: {
          items: backendData.consultations.map(mapBackendConsultationToFrontend),
          total: backendData.total,
          page: backendData.page,
          pageSize: backendData.limit,
          totalPages: backendData.totalPages,
        },
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error fetching consultations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch consultations',
      };
    }
  }

  static async getConsultation(consultationId: string): Promise<ItemResponse<Consultation>> {
    try {
      const response = await apiClient.get(`/consultations/${consultationId}`);
      
      return {
        success: true,
        data: mapBackendConsultationToFrontend(response.data.data),
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error fetching consultation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch consultation',
      };
    }
  }

  static async createConsultation(data: CreateConsultationData): Promise<ItemResponse<Consultation>> {
    try {
      const response = await apiClient.post('/consultations', data);
      
      return {
        success: true,
        data: mapBackendConsultationToFrontend(response.data.data),
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error creating consultation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create consultation',
      };
    }
  }

  static async updateConsultation(
    consultationId: string, 
    data: UpdateConsultationData
  ): Promise<ItemResponse<Consultation>> {
    try {
      const response = await apiClient.put(`/consultations/${consultationId}`, data);
      
      return {
        success: true,
        data: mapBackendConsultationToFrontend(response.data.data),
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error updating consultation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update consultation',
      };
    }
  }

  static async deleteConsultation(consultationId: string): Promise<ItemResponse<void>> {
    try {
      const response = await apiClient.delete(`/consultations/${consultationId}`);
      
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error deleting consultation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete consultation',
      };
    }
  }

  static async getConsultationStatistics(): Promise<any> {
    try {
      const response = await apiClient.get('/consultations/statistics');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Error fetching consultation statistics:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch consultation statistics',
      };
    }
  }
}