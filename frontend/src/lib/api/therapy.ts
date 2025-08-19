import {
  Session,
  SessionStatusEnum,
  SessionTypeEnum,
  CreateSessionData,
  UpdateSessionData,
  SessionFilters,
  SessionListResponse,
  SessionResponse,
  SessionSort,
  SessionStatistics,
  SessionListData,
  ConsultationSummary,
} from '@/types/therapy';
import { validateCreateSessionData, validateSessionData } from '@/schemas/therapySchema';

// Enhanced error types
export class TherapyAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'TherapyAPIError';
  }
}

// Network error detection
const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('fetch') ||
         error?.message?.includes('network');
};

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Exponential backoff retry helper
const withRetry = async <T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const { maxRetries, baseDelay, maxDelay } = { ...DEFAULT_RETRY_CONFIG, ...config };
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on final attempt or for certain error types
      if (attempt === maxRetries || !isNetworkError(error)) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError!;
};

// Request interceptor for authentication and logging
const withAuth = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    // Add authentication headers if needed
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   // Add to request headers
    // }
    
    const startTime = performance.now();
    const result = await request();
    const endTime = performance.now();
    
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`API Request completed in ${endTime - startTime}ms`);
    }
    
    return result;
  } catch (error) {
    // Log errors
    console.error('API Request failed:', error);
    
    // Transform errors to consistent format
    if (error instanceof TherapyAPIError) {
      throw error;
    }
    
    if (isNetworkError(error)) {
      throw new TherapyAPIError(
        'Network error occurred',
        'NETWORK_ERROR',
        0,
        { originalError: error }
      );
    }
    
    throw new TherapyAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR',
      500,
      { originalError: error }
    );
  }
};

// Response validation helper
const validateResponse = <T>(response: any, validator?: (data: any) => boolean): T => {
  if (!response) {
    throw new TherapyAPIError('Empty response received', 'EMPTY_RESPONSE');
  }
  
  if (!response.success && response.message) {
    throw new TherapyAPIError(
      response.message,
      response.code || 'API_ERROR',
      response.statusCode
    );
  }
  
  if (validator && response.data && !validator(response.data)) {
    throw new TherapyAPIError('Invalid response data format', 'VALIDATION_ERROR');
  }
  
  return response;
};

// Simulated latency helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// In-memory session storage (mock database)
const sessionStorage: Map<string, Session> = new Map();

// Mock session data generator
const createMockSessions = (): Session[] => {
  const now = new Date();
  const sessions: Session[] = [];
  
  // Mock sessions for different clients
  const mockSessionsData = [
    {
      clientId: 'CLT001',
      therapyId: 'therapy-001',
      therapistId: 'therapist-001',
      baseTitle: 'Sesi Terapi Kecemasan',
      type: SessionTypeEnum.Initial,
      status: SessionStatusEnum.Completed,
    },
    {
      clientId: 'CLT001', 
      therapyId: 'therapy-001',
      therapistId: 'therapist-001',
      baseTitle: 'Lanjutan Terapi Kecemasan',
      type: SessionTypeEnum.Regular,
      status: SessionStatusEnum.Completed,
    },
    {
      clientId: 'CLT001',
      therapyId: 'therapy-001', 
      therapistId: 'therapist-001',
      baseTitle: 'Evaluasi Progress',
      type: SessionTypeEnum.Progress,
      status: SessionStatusEnum.Scheduled,
    },
    {
      clientId: 'CLT008',
      therapyId: 'therapy-002',
      therapistId: 'therapist-001',
      baseTitle: 'Sesi Awal - Detoks Alkohol',
      type: SessionTypeEnum.Initial,
      status: SessionStatusEnum.Completed,
    },
    {
      clientId: 'CLT008',
      therapyId: 'therapy-002',
      therapistId: 'therapist-001', 
      baseTitle: 'Terapi Kognitif Perilaku',
      type: SessionTypeEnum.Regular,
      status: SessionStatusEnum.Started,
    },
    {
      clientId: 'CLT010',
      therapyId: 'therapy-003',
      therapistId: 'therapist-001',
      baseTitle: 'Sesi Play Therapy',
      type: SessionTypeEnum.Initial,
      status: SessionStatusEnum.New,
    },
    {
      clientId: 'CLT003',
      therapyId: 'therapy-004', 
      therapistId: 'multi-001',
      baseTitle: 'CBT-I untuk Insomnia',
      type: SessionTypeEnum.Initial,
      status: SessionStatusEnum.Completed,
    },
    {
      clientId: 'CLT003',
      therapyId: 'therapy-004',
      therapistId: 'multi-001',
      baseTitle: 'Hipnosis untuk Relaksasi',
      type: SessionTypeEnum.Regular,
      status: SessionStatusEnum.Completed,
    },
  ];

  mockSessionsData.forEach((sessionData, index) => {
    const sessionDate = new Date(now.getTime() - (7 - index) * 24 * 60 * 60 * 1000);
    const session: Session = {
      id: `session-${String(index + 1).padStart(3, '0')}`,
      therapyId: sessionData.therapyId,
      clientId: sessionData.clientId,
      therapistId: sessionData.therapistId,
      sessionNumber: (index % 3) + 1,
      title: `${sessionData.baseTitle} #${(index % 3) + 1}`,
      description: `Deskripsi untuk ${sessionData.baseTitle.toLowerCase()} sesi ke-${(index % 3) + 1}`,
      type: sessionData.type,
      status: sessionData.status,
      scheduledDate: sessionDate.toISOString(),
      startTime: sessionData.status === SessionStatusEnum.Completed ? sessionDate.toISOString() : undefined,
      endTime: sessionData.status === SessionStatusEnum.Completed 
        ? new Date(sessionDate.getTime() + 60 * 60 * 1000).toISOString() 
        : undefined,
      duration: 60,
      notes: `Catatan untuk sesi ${sessionData.baseTitle.toLowerCase()}`,
      objectives: [
        'Mengurangi tingkat kecemasan klien',
        'Mengajarkan teknik relaksasi',
        'Membangun coping mechanism yang sehat'
      ],
      techniques: [
        'Teknik pernapasan dalam',
        'Progressive muscle relaxation',
        'Cognitive restructuring'
      ],
      outcomes: sessionData.status === SessionStatusEnum.Completed ? [
        'Klien menunjukkan penurunan tingkat kecemasan',
        'Klien berhasil menerapkan teknik relaksasi',
        'Progress positif dalam mengelola stress'
      ] : undefined,
      progressScore: sessionData.status === SessionStatusEnum.Completed ? Math.floor(Math.random() * 3) + 7 : undefined,
      clientFeedback: sessionData.status === SessionStatusEnum.Completed 
        ? 'Sesi ini sangat membantu. Saya merasa lebih tenang dan memiliki tools untuk mengelola kecemasan.'
        : undefined,
      therapistNotes: sessionData.status === SessionStatusEnum.Completed
        ? 'Klien menunjukkan engagement yang baik. Responsive terhadap intervensi CBT. Disarankan untuk melanjutkan dengan teknik exposure therapy pada sesi berikutnya.'
        : undefined,
      nextSteps: [
        'Praktek teknik relaksasi di rumah',
        'Journaling untuk mengidentifikasi trigger',
        'Konsultasi dengan psikiater jika diperlukan'
      ],
      assignedHomework: [
        'Latihan pernapasan 3x sehari',
        'Isi anxiety diary setiap hari',
        'Baca materi edukasi tentang anxiety'
      ],
      createdAt: new Date(sessionDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: sessionDate.toISOString(),
    };
    
    sessions.push(session);
  });

  return sessions;
};

// Initialize mock data
const initializeMockData = () => {
  const mockSessions = createMockSessions();
  mockSessions.forEach(session => {
    sessionStorage.set(session.id, session);
  });
};

// Initialize on first load
if (sessionStorage.size === 0) {
  initializeMockData();
}

// Auto-numbering helper
const getNextSessionNumber = (therapyId: string): number => {
  const sessions = Array.from(sessionStorage.values())
    .filter(s => s.therapyId === therapyId)
    .sort((a, b) => b.sessionNumber - a.sessionNumber);
  
  return sessions.length > 0 ? sessions[0].sessionNumber + 1 : 1;
};

// Validation helpers
const validateSessionDataForCreation = (data: CreateSessionData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic validation
  if (!data.therapyId?.trim()) errors.push('Therapy ID is required');
  if (!data.clientId?.trim()) errors.push('Client ID is required');  
  if (!data.therapistId?.trim()) errors.push('Therapist ID is required');
  if (!data.title?.trim() || data.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (data.title && data.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  if (data.description && data.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  if (!data.objectives || data.objectives.length === 0) {
    errors.push('At least one objective is required');
  }
  if (data.objectives && data.objectives.length > 10) {
    errors.push('Cannot have more than 10 objectives');
  }
  if (data.techniques && data.techniques.length > 15) {
    errors.push('Cannot have more than 15 techniques');
  }
  if (data.duration && (data.duration < 15 || data.duration > 240)) {
    errors.push('Duration must be between 15-240 minutes');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Filtering and sorting helpers
const applyFilters = (sessions: Session[], filters?: SessionFilters): Session[] => {
  if (!filters) return sessions;
  
  let filteredSessions = [...sessions];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredSessions = filteredSessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm) ||
      session.description?.toLowerCase().includes(searchTerm) ||
      session.notes?.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.status) {
    filteredSessions = filteredSessions.filter(session => session.status === filters.status);
  }
  
  if (filters.type) {
    filteredSessions = filteredSessions.filter(session => session.type === filters.type);
  }
  
  if (filters.therapyId) {
    filteredSessions = filteredSessions.filter(session => session.therapyId === filters.therapyId);
  }
  
  if (filters.clientId) {
    filteredSessions = filteredSessions.filter(session => session.clientId === filters.clientId);
  }
  
  if (filters.therapistId) {
    filteredSessions = filteredSessions.filter(session => session.therapistId === filters.therapistId);
  }
  
  if (filters.dateRange) {
    const fromDate = new Date(filters.dateRange.from);
    const toDate = new Date(filters.dateRange.to);
    
    filteredSessions = filteredSessions.filter(session => {
      const sessionDate = new Date(session.scheduledDate || session.createdAt);
      return sessionDate >= fromDate && sessionDate <= toDate;
    });
  }
  
  return filteredSessions;
};

const applySorting = (sessions: Session[], sort?: SessionSort): Session[] => {
  if (!sort) {
    // Default sort by session number ascending
    return sessions.sort((a, b) => a.sessionNumber - b.sessionNumber);
  }
  
  const { field, order } = sort;
  const multiplier = order === 'asc' ? 1 : -1;
  
  return sessions.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (field) {
      case 'sessionNumber':
        aValue = a.sessionNumber;
        bValue = b.sessionNumber;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'scheduledDate':
        aValue = new Date(a.scheduledDate || a.createdAt);
        bValue = new Date(b.scheduledDate || b.createdAt);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });
};

// API Functions
export const TherapyAPI = {
  // Get sessions with filtering and sorting
  async getSessions(
    filters?: SessionFilters, 
    sort?: SessionSort, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<SessionListResponse> {
    await delay(300 + Math.random() * 200);

    try {
      let sessions = Array.from(sessionStorage.values());
      
      // Apply filters
      sessions = applyFilters(sessions, filters);
      
      // Apply sorting
      sessions = applySorting(sessions, sort);
      
      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedSessions = sessions.slice(startIndex, endIndex);

      const responseData: SessionListData = {
        items: paginatedSessions,
        total: sessions.length,
        page,
        pageSize
      };

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch sessions'
      };
    }
  },

  // Get single session
  async getSession(sessionId: string): Promise<SessionResponse> {
    await delay(200 + Math.random() * 100);

    try {
      const session = sessionStorage.get(sessionId);
      
      if (!session) {
        return {
          success: false,
          message: 'Session not found'
        };
      }

      return {
        success: true,
        data: session
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch session'
      };
    }
  },

  // Create new session with auto-numbering
  async createSession(data: CreateSessionData): Promise<SessionResponse> {
    await delay(400 + Math.random() * 300);

    try {
      // Validate data
      const validation = validateSessionDataForCreation(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Additional validation with Zod schema
      const schemaValidation = validateCreateSessionData(data);
      if (!schemaValidation.success) {
        return {
          success: false,
          message: `Schema validation failed: ${schemaValidation.errors?.map(e => e.message).join(', ')}`
        };
      }

      // Generate session number automatically
      const sessionNumber = getNextSessionNumber(data.therapyId);

      // Create new session
      const now = new Date().toISOString();
      const session: Session = {
        id: generateId(),
        therapyId: data.therapyId,
        clientId: data.clientId,
        therapistId: data.therapistId,
        sessionNumber,
        title: data.title,
        description: data.description,
        type: data.type,
        status: SessionStatusEnum.New,
        scheduledDate: data.scheduledDate,
        duration: data.duration || 60,
        notes: data.notes,
        objectives: data.objectives,
        techniques: data.techniques,
        createdAt: now,
        updatedAt: now
      };

      // Store session
      sessionStorage.set(session.id, session);

      return {
        success: true,
        data: session,
        message: 'Session created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create session'
      };
    }
  },

  // Update session
  async updateSession(sessionId: string, data: UpdateSessionData): Promise<SessionResponse> {
    await delay(350 + Math.random() * 250);

    try {
      const existing = sessionStorage.get(sessionId);
      
      if (!existing) {
        return {
          success: false,
          message: 'Session not found'
        };
      }

      // Merge updates
      const updated: Session = {
        ...existing,
        ...data,
        id: sessionId, // Ensure ID doesn't change
        createdAt: existing.createdAt, // Preserve creation date
        updatedAt: new Date().toISOString()
      };

      // Validate updated session
      const validation = validateSessionData(updated);
      if (!validation.success) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors?.map(e => e.message).join(', ')}`
        };
      }

      // Store updated session
      sessionStorage.set(sessionId, updated);

      return {
        success: true,
        data: updated,
        message: 'Session updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update session'
      };
    }
  },

  // Delete session
  async deleteSession(sessionId: string): Promise<SessionResponse> {
    await delay(300 + Math.random() * 200);

    try {
      const existing = sessionStorage.get(sessionId);
      
      if (!existing) {
        return {
          success: false,
          message: 'Session not found'
        };
      }

      // Check if session can be deleted
      if (existing.status === SessionStatusEnum.Started) {
        return {
          success: false,
          message: 'Cannot delete session that is currently in progress'
        };
      }

      // Remove session
      sessionStorage.delete(sessionId);

      return {
        success: true,
        message: 'Session deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete session'
      };
    }
  },

  // Get session statistics
  async getSessionStatistics(filters?: Omit<SessionFilters, 'search'>): Promise<SessionResponse & { data?: SessionStatistics }> {
    await delay(250 + Math.random() * 150);

    try {
      let sessions = Array.from(sessionStorage.values());
      
      // Apply filters (excluding search)
      if (filters) {
        sessions = applyFilters(sessions, filters);
      }

      const stats: SessionStatistics = {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === SessionStatusEnum.Completed).length,
        scheduledSessions: sessions.filter(s => s.status === SessionStatusEnum.Scheduled).length,
        cancelledSessions: sessions.filter(s => s.status === SessionStatusEnum.Cancelled).length,
        averageSessionDuration: sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
          : 0,
        averageProgressScore: (() => {
          const completedWithScore = sessions.filter(s => s.progressScore !== undefined);
          return completedWithScore.length > 0
            ? completedWithScore.reduce((sum, s) => sum + (s.progressScore || 0), 0) / completedWithScore.length
            : 0;
        })(),
        byStatus: {
          [SessionStatusEnum.New]: sessions.filter(s => s.status === SessionStatusEnum.New).length,
          [SessionStatusEnum.Scheduled]: sessions.filter(s => s.status === SessionStatusEnum.Scheduled).length,
          [SessionStatusEnum.Started]: sessions.filter(s => s.status === SessionStatusEnum.Started).length,
          [SessionStatusEnum.Completed]: sessions.filter(s => s.status === SessionStatusEnum.Completed).length,
          [SessionStatusEnum.Cancelled]: sessions.filter(s => s.status === SessionStatusEnum.Cancelled).length,
          [SessionStatusEnum.NoShow]: sessions.filter(s => s.status === SessionStatusEnum.NoShow).length,
        },
        byType: {
          [SessionTypeEnum.Initial]: sessions.filter(s => s.type === SessionTypeEnum.Initial).length,
          [SessionTypeEnum.Regular]: sessions.filter(s => s.type === SessionTypeEnum.Regular).length,
          [SessionTypeEnum.Progress]: sessions.filter(s => s.type === SessionTypeEnum.Progress).length,
          [SessionTypeEnum.Final]: sessions.filter(s => s.type === SessionTypeEnum.Final).length,
          [SessionTypeEnum.Emergency]: sessions.filter(s => s.type === SessionTypeEnum.Emergency).length,
        },
        completionRate: sessions.length > 0
          ? Math.round((sessions.filter(s => s.status === SessionStatusEnum.Completed).length / sessions.length) * 100)
          : 0
      };

      return {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get session statistics'
      };
    }
  },

  // Reset mock data (for testing/development)
  async resetMockData(): Promise<SessionResponse> {
    await delay(100);

    try {
      sessionStorage.clear();
      initializeMockData();

      return {
        success: true,
        message: 'Mock data reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset mock data'
      };
    }
  },

  // Get consultation summaries for a client and therapy
  async getConsultationSummaries(clientId: string, therapyId: string): Promise<{ success: boolean; data?: ConsultationSummary[]; message?: string }> {
    await delay(200 + Math.random() * 100);

    try {
      // Mock consultation summaries data
      const mockConsultationSummaries: ConsultationSummary[] = [
        {
          id: 'consultation-001',
          clientId,
          therapyId,
          consultationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          primaryConcern: 'Kecemasan berlebihan dalam situasi sosial',
          secondaryConcerns: ['Kesulitan tidur', 'Konsentrasi menurun'],
          symptomSeverity: 4,
          symptomDuration: '3 bulan',
          treatmentGoals: [
            'Mengurangi tingkat kecemasan sosial',
            'Meningkatkan kualitas tidur',
            'Membangun coping mechanism yang sehat'
          ],
          initialAssessment: 'Klien menunjukkan gejala anxiety disorder dengan komponen sosial yang dominan. Perlu intervensi CBT dan teknik relaksasi.',
          consultationNotes: 'Klien sangat kooperatif dan memiliki motivasi tinggi untuk sembuh. Disarankan untuk memulai dengan 8-12 sesi terapi.',
          aiPredictions: {
            primaryIssue: MentalHealthIssueEnum.Anxiety,
            confidence: 85,
            severity: 'moderate',
            recommendedTreatment: ['CBT', 'Exposure Therapy', 'Relaxation Techniques'],
            estimatedSessionsNeeded: 10,
            urgencyLevel: TherapyPriorityEnum.Medium
          }
        },
        {
          id: 'consultation-002',
          clientId,
          therapyId,
          consultationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          primaryConcern: 'Depresi pasca kehilangan pekerjaan',
          secondaryConcerns: ['Kehilangan motivasi', 'Perubahan pola makan'],
          symptomSeverity: 3,
          symptomDuration: '2 bulan',
          treatmentGoals: [
            'Mengatasi gejala depresi',
            'Membangun kembali kepercayaan diri',
            'Mengembangkan strategi pencarian kerja'
          ],
          initialAssessment: 'Klien mengalami adjustment disorder dengan mood depresif. Gejala ringan hingga sedang, responsif terhadap intervensi.',
          consultationNotes: 'Klien menunjukkan insight yang baik tentang kondisinya. Disarankan kombinasi terapi individual dan dukungan kelompok.',
          aiPredictions: {
            primaryIssue: MentalHealthIssueEnum.Depression,
            confidence: 78,
            severity: 'mild',
            recommendedTreatment: ['CBT', 'Supportive Therapy', 'Career Counseling'],
            estimatedSessionsNeeded: 8,
            urgencyLevel: TherapyPriorityEnum.Low
          }
        }
      ];

      return {
        success: true,
        data: mockConsultationSummaries,
        message: 'Consultation summaries retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch consultation summaries'
      };
    }
  },

  // Helper function to get next session number
  getNextSessionNumber
};

export default TherapyAPI;