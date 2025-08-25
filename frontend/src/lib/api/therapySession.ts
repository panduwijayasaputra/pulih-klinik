import { 
  PaginatedResponse, 
  ApiResponse 
} from '@/lib/api/types';
import { 
  mockTherapySessions 
} from '@/lib/mocks/therapySession';
import { 
  mockTherapistClients 
} from '@/lib/mocks/therapistClient';
import { 
  TherapySessionStatusEnum,
  TherapySession,
  CreateTherapySessionData,
  UpdateTherapySessionData,
  AIPredictions
} from '@/types/therapySession';
import { TherapistClient } from '@/types/therapistClient';

export interface SessionWithClient {
  id: string;
  sessionNumber: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  status: TherapySessionStatusEnum;
  notes?: string;
  techniques?: string[];
  issues?: string[];
  progress?: string;
  clientId: string;
  therapistId: string;
  createdAt: string;
  updatedAt: string;
  client: TherapistClient;
}

export interface TherapySessionFilters {
  status?: TherapySessionStatusEnum | 'all';
  search?: string;
  sortBy?: 'date' | 'client' | 'sessionNumber';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export class TherapySessionAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TherapySessionAPIError';
  }
}

export const TherapySessionAPI = {
  async getTherapySessions(
    therapistId: string,
    page = 1,
    pageSize = 10,
    filters?: TherapySessionFilters
  ): Promise<PaginatedResponse<SessionWithClient>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get sessions for the therapist
      let therapistSessions = mockTherapySessions.filter(session => 
        session.therapistId === therapistId
      );

      // Add client data to sessions
      let sessionsWithClients = therapistSessions.map(session => {
        const client = mockTherapistClients.find(c => c.id === session.clientId);
        return {
          ...session,
          client: client!
        };
      }).filter(session => session.client !== undefined);

      // Apply filters
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          sessionsWithClients = sessionsWithClients.filter(session => 
            session.status === filters.status
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          sessionsWithClients = sessionsWithClients.filter(session => 
            session.client.fullName.toLowerCase().includes(searchTerm) ||
            session.title.toLowerCase().includes(searchTerm) ||
            session.description?.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.dateFrom) {
          sessionsWithClients = sessionsWithClients.filter(session => 
            new Date(session.date) >= new Date(filters.dateFrom!)
          );
        }

        if (filters.dateTo) {
          sessionsWithClients = sessionsWithClients.filter(session => 
            new Date(session.date) <= new Date(filters.dateTo!)
          );
        }
      }

      // Apply sorting - default to date sorting with closest to today first
      const sortBy = filters?.sortBy || 'date';
      const sortOrder = filters?.sortOrder || 'asc';
      
      sessionsWithClients.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'date':
            // For date sorting, we want closest to today first
            const today = new Date();
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            
            // Calculate days difference from today
            const aDaysDiff = Math.abs((aDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const bDaysDiff = Math.abs((bDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            aValue = aDaysDiff;
            bValue = bDaysDiff;
            break;
          case 'client':
            aValue = a.client.fullName;
            bValue = b.client.fullName;
            break;
          case 'sessionNumber':
            aValue = a.sessionNumber;
            bValue = b.sessionNumber;
            break;
          default:
            // Default to date sorting with closest to today first
            const defaultToday = new Date();
            const defaultADate = new Date(a.date);
            const defaultBDate = new Date(b.date);
            
            const defaultADaysDiff = Math.abs((defaultADate.getTime() - defaultToday.getTime()) / (1000 * 60 * 60 * 24));
            const defaultBDaysDiff = Math.abs((defaultBDate.getTime() - defaultToday.getTime()) / (1000 * 60 * 60 * 24));
            
            aValue = defaultADaysDiff;
            bValue = defaultBDaysDiff;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const total = sessionsWithClients.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const items = sessionsWithClients.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          items,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        },
        message: 'Therapist sessions retrieved successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to fetch therapy sessions');
    }
  },

  async getTherapySessionStats(
    therapistId: string
  ): Promise<ApiResponse<{
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    plannedSessions: number;
    inProgressSessions: number;
    cancelledSessions: number;
    upcomingSessions: number;
  }>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const therapistSessions = mockTherapySessions.filter(session => 
        session.therapistId === therapistId
      );

      const now = new Date();
      const upcomingSessions = therapistSessions.filter(session => 
        session.status === TherapySessionStatusEnum.Scheduled &&
        new Date(session.date) > now
      ).length;

      const stats = {
        totalSessions: therapistSessions.length,
        completedSessions: therapistSessions.filter(s => s.status === TherapySessionStatusEnum.Completed).length,
        scheduledSessions: therapistSessions.filter(s => s.status === TherapySessionStatusEnum.Scheduled).length,
        plannedSessions: therapistSessions.filter(s => s.status === TherapySessionStatusEnum.Planned).length,
        inProgressSessions: therapistSessions.filter(s => s.status === TherapySessionStatusEnum.InProgress).length,
        cancelledSessions: therapistSessions.filter(s => s.status === TherapySessionStatusEnum.Cancelled).length,
        upcomingSessions
      };

      return {
        success: true,
        data: stats,
        message: 'Therapist session stats retrieved successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to fetch therapy session stats');
    }
  },

  async updateSessionStatus(
    sessionId: string,
    status: TherapySessionStatusEnum,
    notes?: string
  ): Promise<ApiResponse<SessionWithClient>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sessionIndex = mockTherapySessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        return {
          success: false,
          message: 'Session not found'
        };
      }

      // Update session
      mockTherapySessions[sessionIndex] = {
        ...mockTherapySessions[sessionIndex],
        status,
        notes: notes || mockTherapySessions[sessionIndex].notes,
        updatedAt: new Date().toISOString()
      };

      // Get updated session with client data
      const updatedSession = mockTherapySessions[sessionIndex];
      const client = mockTherapistClients.find(c => c.id === updatedSession.clientId);
      
      const sessionWithClient: SessionWithClient = {
        ...updatedSession,
        client: client!
      };

      return {
        success: true,
        data: sessionWithClient,
        message: 'Session status updated successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to update session status');
    }
  },

  async getTherapySession(
    sessionId: string
  ): Promise<ApiResponse<TherapySession>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const session = mockTherapySessions.find(s => s.id === sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Session not found'
        };
      }

      return {
        success: true,
        data: session,
        message: 'Therapy session retrieved successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to fetch therapy session');
    }
  },

  async createTherapySession(
    data: CreateTherapySessionData
  ): Promise<ApiResponse<TherapySession>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSession: TherapySession = {
        id: `session-${Date.now()}`,
        sessionNumber: mockTherapySessions.filter(s => s.clientId === data.clientId).length + 1,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        duration: data.duration,
        status: data.status || TherapySessionStatusEnum.Planned,
        techniques: data.techniques || [],
        issues: data.issues || [],
        clientId: data.clientId,
        therapistId: data.therapistId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockTherapySessions.push(newSession);

      return {
        success: true,
        data: newSession,
        message: 'Therapy session created successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to create therapy session');
    }
  },

  async updateTherapySession(
    sessionId: string,
    data: UpdateTherapySessionData
  ): Promise<ApiResponse<TherapySession>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sessionIndex = mockTherapySessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        return {
          success: false,
          message: 'Session not found'
        };
      }

      // Update session
      mockTherapySessions[sessionIndex] = {
        ...mockTherapySessions[sessionIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: mockTherapySessions[sessionIndex],
        message: 'Therapy session updated successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to update therapy session');
    }
  },

  async deleteTherapySession(
    sessionId: string
  ): Promise<ApiResponse<void>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const sessionIndex = mockTherapySessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        return {
          success: false,
          message: 'Session not found'
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

  async generateAIPredictions(
    clientId: string
  ): Promise<ApiResponse<AIPredictions>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI predictions
      const predictions: AIPredictions = {
        recommendedTechniques: [
          { id: '1', name: 'Cognitive Behavioral Therapy', effectiveness: 0.85 },
          { id: '2', name: 'Mindfulness', effectiveness: 0.78 },
          { id: '3', name: 'Exposure Therapy', effectiveness: 0.72 }
        ],
        predictedIssues: [
          { id: '1', name: 'Anxiety', confidence: 0.92 },
          { id: '2', name: 'Stress Management', confidence: 0.88 },
          { id: '3', name: 'Self-Esteem', confidence: 0.75 }
        ],
        sessionRecommendations: [
          { id: '1', title: 'Assessment Session', description: 'Initial evaluation and goal setting', priority: 'high' },
          { id: '2', title: 'CBT Introduction', description: 'Learn basic CBT techniques', priority: 'medium' },
          { id: '3', title: 'Relaxation Training', description: 'Practice relaxation techniques', priority: 'medium' }
        ]
      };

      return {
        success: true,
        data: predictions,
        message: 'AI predictions generated successfully'
      };
    } catch (error) {
      throw new TherapySessionAPIError('Failed to generate AI predictions');
    }
  }
};
