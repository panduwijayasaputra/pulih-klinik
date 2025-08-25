export enum TherapySessionStatusEnum {
  Planned = 'planned',
  Scheduled = 'scheduled',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface TherapySession {
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
}

export interface TherapySessionFormData {
  sessionNumber: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: number;
}

export interface AIPrediction {
  id: string;
  name: string;
  confidence?: number;
  effectiveness?: number;
}

export interface AIPredictions {
  issues: AIPrediction[];
  techniques: AIPrediction[];
}

export interface TherapySessionStats {
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  averageSessionDuration: number;
  mostUsedTechniques: string[];
  commonIssues: string[];
}

export interface TherapySessionFilters {
  status?: TherapySessionStatusEnum | 'all';
  search?: string;
  sortBy?: 'date' | 'client' | 'sessionNumber';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

// API Response Types
export interface TherapySessionResponse {
  success: boolean;
  message: string;
  data?: TherapySession;
}

export interface TherapySessionListResponse {
  success: boolean;
  message: string;
  data?: {
    items: TherapySession[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface TherapySessionStatsResponse {
  success: boolean;
  message: string;
  data?: TherapySessionStats;
}

export interface CreateTherapySessionData {
  clientId: string;
  therapistId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: number;
  status?: TherapySessionStatusEnum;
  techniques?: string[];
  issues?: string[];
}

export interface UpdateTherapySessionData {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number | undefined;
  status?: TherapySessionStatusEnum;
  notes?: string;
  techniques?: string[];
  issues?: string[];
  progress?: string;
}
