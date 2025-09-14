import { TherapistClient, TherapistClientStats, TherapistClientSession, TherapistClientProgress, TherapistClientFilters } from '@/types/therapistClient';
import { ApiResponse, PaginatedResponse } from './types';
import { apiClient } from '../http-client';
import { 
  getTherapistClients, 
  getTherapistClientById, 
  getTherapistClientStats,
  mockTherapistClientSessions,
  mockTherapistClientProgress
} from '@/lib/mocks/therapistClient';

export class TherapistClientAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TherapistClientAPIError';
  }
}

export const TherapistClientAPI = {
  /**
   * Get therapist's clients with pagination and filters
   */
  getTherapistClients: async (
    therapistId: string,
    page: number = 1,
    pageSize: number = 10,
    filters?: TherapistClientFilters
  ): Promise<PaginatedResponse<TherapistClient>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', pageSize.toString());
      
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const response = await apiClient.get(`/therapists/${therapistId}/clients?${params.toString()}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: { items, total, page, limit, totalPages }, message: "..." }
      const backendData = response.data.data;
      
      return {
        success: true,
        data: {
          items: backendData.items,
          total: backendData.total,
          page: backendData.page,
          pageSize: backendData.limit,
          totalPages: backendData.totalPages
        }
      };
    } catch (error: any) {
      console.error('Error fetching therapist clients:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch therapist clients';
      throw new TherapistClientAPIError(errorMessage);
    }
  },

  /**
   * Get a specific therapist client by ID
   */
  getTherapistClient: async (
    therapistId: string,
    clientId: string
  ): Promise<ApiResponse<TherapistClient>> => {
    try {
      // Use the regular client endpoint to get full client data
      // The backend should validate therapist assignment in the future
      const response = await apiClient.get(`/clients/${clientId}`);
      
      // The response is wrapped by ResponseInterceptor
      const clientData = response.data.data;
      
      // Transform the ClientResponse to TherapistClient format
      const therapistClient: TherapistClient = {
        ...clientData,
        // Map any missing fields or add therapist-specific fields
        assignedDate: clientData.assignedDate || new Date().toISOString(),
        lastSessionDate: clientData.lastSessionDate,
        sessionCount: clientData.totalSessions || 0,
        progressNotes: clientData.notes,
        therapistNotes: clientData.notes, // This might need to come from assignment
      };
      
      return {
        success: true,
        data: therapistClient
      };
    } catch (error: any) {
      console.error('Error fetching therapist client:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch therapist client';
      throw new TherapistClientAPIError(errorMessage);
    }
  },

  /**
   * Get therapist client statistics
   */
  getTherapistClientStats: async (therapistId: string): Promise<ApiResponse<TherapistClientStats>> => {
    try {
      const response = await apiClient.get(`/therapists/${therapistId}/stats`);

      // The response is wrapped by ResponseInterceptor  
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error fetching therapist client stats:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch therapist client statistics';
      throw new TherapistClientAPIError(errorMessage);
    }
  },

  /**
   * Get therapist client sessions
   */
  getTherapistClientSessions: async (
    therapistId: string,
    clientId: string
  ): Promise<ApiResponse<TherapistClientSession[]>> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Filter sessions for the specific client
      const sessions = mockTherapistClientSessions.filter(session => session.clientId === clientId);

      return {
        success: true,
        data: sessions
      };
    } catch (error) {
      console.error('Error fetching therapist client sessions:', error);
      throw new TherapistClientAPIError('Failed to fetch therapist client sessions');
    }
  },

  /**
   * Get therapist client progress
   */
  getTherapistClientProgress: async (
    therapistId: string,
    clientId: string
  ): Promise<ApiResponse<TherapistClientProgress>> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const progress = mockTherapistClientProgress.find(p => p.clientId === clientId);
      
      if (!progress) {
        return {
          success: false,
          message: 'Client progress not found'
        };
      }

      return {
        success: true,
        data: progress
      };
    } catch (error) {
      console.error('Error fetching therapist client progress:', error);
      throw new TherapistClientAPIError('Failed to fetch therapist client progress');
    }
  },

  /**
   * Update therapist client notes
   */
  updateTherapistClientNotes: async (
    therapistId: string,
    clientId: string,
    notes: {
      progressNotes?: string;
      therapistNotes?: string;
    }
  ): Promise<ApiResponse<TherapistClient>> => {
    try {
      // Use combined notes field for backend compatibility
      const notesString = [notes.progressNotes, notes.therapistNotes].filter(Boolean).join('\n\n');
      
      const response = await apiClient.put(`/therapists/${therapistId}/clients/${clientId}/notes`, {
        notes: notesString
      });

      // The response is wrapped by ResponseInterceptor
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error updating therapist client notes:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update therapist client notes';
      throw new TherapistClientAPIError(errorMessage);
    }
  },

  /**
   * Schedule next session for therapist client
   */
  scheduleNextSession: async (
    therapistId: string,
    clientId: string,
    sessionDate: string
  ): Promise<ApiResponse<TherapistClient>> => {
    try {
      const response = await apiClient.post(`/therapists/${therapistId}/clients/${clientId}/schedule`, {
        scheduledAt: sessionDate,
        notes: 'Session scheduled via therapist portal'
      });

      // The response is wrapped by ResponseInterceptor
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Error scheduling next session:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to schedule next session';
      throw new TherapistClientAPIError(errorMessage);
    }
  },

  /**
   * Update therapist client status
   */
  updateTherapistClientStatus: async (
    therapistId: string,
    clientId: string,
    status: string
  ): Promise<ApiResponse<TherapistClient>> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const client = getTherapistClientById(therapistId, clientId);
      
      if (!client) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }

      // For the mock implementation, we'll simulate an update
      const updatedClient: TherapistClient = {
        ...client,
        status: status as any,
      };

      return {
        success: true,
        data: updatedClient
      };
    } catch (error) {
      console.error('Error updating therapist client status:', error);
      throw new TherapistClientAPIError('Failed to update therapist client status');
    }
  }
};
