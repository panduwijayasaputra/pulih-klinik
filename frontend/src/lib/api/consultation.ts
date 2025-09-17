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
    }
  ): Promise<{ success: boolean; data?: { consultations: Consultation[] }; message?: string }> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add filters to query params - only clientId is supported now
      if (filters && filters.clientId) {
        queryParams.append('clientId', filters.clientId);
      }

      const response = await apiClient.get(`/consultations?${queryParams.toString()}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: { consultations: [...] }, message: "..." }
      const backendData = response.data.data;
      
      return {
        success: true,
        data: {
          consultations: backendData.consultations.map(mapBackendConsultationToFrontend),
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