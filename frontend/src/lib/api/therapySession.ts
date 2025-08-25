import { 
  TherapySessionListResponse,
  TherapySessionResponse,
  TherapySessionStatsResponse,
  CreateTherapySessionData,
  UpdateTherapySessionData,
  AIPredictions,
  TherapySession
} from '@/types/therapySession';
import { ItemResponse } from './types';
import { 
  mockTherapySessions, 
  getTherapySessionsByClientId, 
  getTherapySessionById,
  getNextSessionNumber,
  generateAIPredictions,
  mockAIPredictions
} from '@/lib/mocks/therapySession';

export class TherapySessionAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TherapySessionAPIError';
  }
}

export const TherapySessionAPI = {
  async getTherapySessions(
    clientId: string, 
    page = 1, 
    pageSize = 10
  ): Promise<TherapySessionListResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const clientSessions = getTherapySessionsByClientId(clientId);
      const total = clientSessions.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const items = clientSessions.slice(startIndex, endIndex);

      return {
        success: true,
        message: 'Therapy sessions retrieved successfully',
        data: {
          items,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to fetch therapy sessions');
    }
  },

  async getTherapySession(sessionId: string): Promise<TherapySessionResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const session = getTherapySessionById(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Therapy session not found'
        };
      }

      return {
        success: true,
        message: 'Therapy session retrieved successfully',
        data: session
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to fetch therapy session');
    }
  },

  async createTherapySession(data: CreateTherapySessionData): Promise<TherapySessionResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSession = {
        id: `session-${Date.now()}`,
        sessionNumber: getNextSessionNumber(data.clientId),
        title: data.title,
        description: data.description || '',
        date: data.date,
        time: data.time,
        duration: data.duration,
        status: 'scheduled' as const,
        techniques: data.techniques || [],
        issues: data.issues || [],
        clientId: data.clientId,
        therapistId: data.therapistId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // In a real app, this would be saved to the backend
      mockTherapySessions.push(newSession);

      return {
        success: true,
        message: 'Therapy session created successfully',
        data: newSession
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to create therapy session');
    }
  },

  async updateTherapySession(sessionId: string, data: UpdateTherapySessionData): Promise<TherapySessionResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const sessionIndex = mockTherapySessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        return {
          success: false,
          message: 'Therapy session not found'
        };
      }

      const updatedSession = {
        ...mockTherapySessions[sessionIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };

      mockTherapySessions[sessionIndex] = updatedSession as TherapySession;

      return {
        success: true,
        message: 'Therapy session updated successfully',
        data: updatedSession
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to update therapy session');
    }
  },

  async deleteTherapySession(sessionId: string): Promise<ItemResponse<void>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const sessionIndex = mockTherapySessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        return {
          success: false,
          message: 'Therapy session not found'
        };
      }

      mockTherapySessions.splice(sessionIndex, 1);

      return {
        success: true,
        message: 'Therapy session deleted successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to delete therapy session');
    }
  },

  async getTherapySessionStats(clientId: string): Promise<TherapySessionStatsResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const clientSessions = getTherapySessionsByClientId(clientId);
      
      const stats = {
        totalSessions: clientSessions.length,
        completedSessions: clientSessions.filter(s => s.status === 'completed').length,
        scheduledSessions: clientSessions.filter(s => s.status === 'scheduled').length,
        averageSessionDuration: clientSessions.length > 0 
          ? clientSessions.reduce((sum, s) => sum + s.duration, 0) / clientSessions.length 
          : 0,
        mostUsedTechniques: Array.from(
          new Set(clientSessions.flatMap(s => s.techniques || []))
        ).slice(0, 5),
        commonIssues: Array.from(
          new Set(clientSessions.flatMap(s => s.issues || []))
        ).slice(0, 5)
      };

      return {
        success: true,
        message: 'Therapy session stats retrieved successfully',
        data: stats
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to fetch therapy session stats');
    }
  },

  async generateAIPredictions(clientId: string): Promise<{ success: boolean; message: string; data?: AIPredictions }> {
    try {
      const predictions = await generateAIPredictions(clientId);
      
      return {
        success: true,
        message: 'AI predictions generated successfully',
        data: predictions
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to generate AI predictions');
    }
  }
};
