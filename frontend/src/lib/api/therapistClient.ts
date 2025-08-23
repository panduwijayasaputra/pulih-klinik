import { TherapistClient, TherapistClientStats, TherapistClientSession, TherapistClientProgress, TherapistClientFilters } from '@/types/therapistClient';
import { ApiResponse, PaginatedResponse } from './types';
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let clients = getTherapistClients(therapistId, {
        status: filters?.status,
        search: filters?.search,
        sortBy: filters?.sortBy,
        sortOrder: filters?.sortOrder
      });

      // Apply date filters if provided
      if (filters?.assignedDate) {
        clients = clients.filter(client => {
          const assignedDate = new Date(client.assignedDate);
          const fromDate = new Date(filters.assignedDate.from);
          const toDate = new Date(filters.assignedDate.to);
          return assignedDate >= fromDate && assignedDate <= toDate;
        });
      }

      if (filters?.lastSessionDate) {
        clients = clients.filter(client => {
          if (!client.lastSessionDate) return false;
          const lastSessionDate = new Date(client.lastSessionDate);
          const fromDate = new Date(filters.lastSessionDate.from);
          const toDate = new Date(filters.lastSessionDate.to);
          return lastSessionDate >= fromDate && lastSessionDate <= toDate;
        });
      }

      if (filters?.sessionCount) {
        clients = clients.filter(client => 
          client.sessionCount >= filters.sessionCount!.min && 
          client.sessionCount <= filters.sessionCount!.max
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedClients = clients.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          items: paginatedClients,
          total: clients.length,
          page,
          pageSize,
          totalPages: Math.ceil(clients.length / pageSize)
        }
      };
    } catch (error) {
      console.error('Error fetching therapist clients:', error);
      throw new TherapistClientAPIError('Failed to fetch therapist clients');
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const client = getTherapistClientById(therapistId, clientId);
      
      if (!client) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }

      return {
        success: true,
        data: client
      };
    } catch (error) {
      console.error('Error fetching therapist client:', error);
      throw new TherapistClientAPIError('Failed to fetch therapist client');
    }
  },

  /**
   * Get therapist client statistics
   */
  getTherapistClientStats: async (therapistId: string): Promise<ApiResponse<TherapistClientStats>> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const stats = getTherapistClientStats(therapistId);

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching therapist client stats:', error);
      throw new TherapistClientAPIError('Failed to fetch therapist client statistics');
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const client = getTherapistClientById(therapistId, clientId);
      
      if (!client) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }

      // In a real implementation, this would update the database
      const updatedClient: TherapistClient = {
        ...client,
        progressNotes: notes.progressNotes || client.progressNotes,
        therapistNotes: notes.therapistNotes || client.therapistNotes,
      };

      return {
        success: true,
        data: updatedClient
      };
    } catch (error) {
      console.error('Error updating therapist client notes:', error);
      throw new TherapistClientAPIError('Failed to update therapist client notes');
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const client = getTherapistClientById(therapistId, clientId);
      
      if (!client) {
        return {
          success: false,
          message: 'Client not found or not assigned to this therapist'
        };
      }

      // In a real implementation, this would update the database
      const updatedClient: TherapistClient = {
        ...client,
        nextSessionDate: sessionDate,
      };

      return {
        success: true,
        data: updatedClient
      };
    } catch (error) {
      console.error('Error scheduling next session:', error);
      throw new TherapistClientAPIError('Failed to schedule next session');
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

      // In a real implementation, this would update the database
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
