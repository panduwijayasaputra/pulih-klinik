type EnumValue<T> = T[keyof T];

// Therapy-related enums
export enum TherapyStatusEnum {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
  OnHold = 'on_hold',
  Cancelled = 'cancelled',
}

export const TherapyStatusLabels: Record<TherapyStatusEnum, string> = {
  [TherapyStatusEnum.NotStarted]: 'Belum Dimulai',
  [TherapyStatusEnum.InProgress]: 'Sedang Berlangsung',
  [TherapyStatusEnum.Completed]: 'Selesai',
  [TherapyStatusEnum.OnHold]: 'Tertunda',
  [TherapyStatusEnum.Cancelled]: 'Dibatalkan',
};

export enum TherapyTypeEnum {
  Individual = 'individual',
  Group = 'group',
  Family = 'family',
  Couple = 'couple',
}

export const TherapyTypeLabels: Record<TherapyTypeEnum, string> = {
  [TherapyTypeEnum.Individual]: 'Individu',
  [TherapyTypeEnum.Group]: 'Kelompok',
  [TherapyTypeEnum.Family]: 'Keluarga',
  [TherapyTypeEnum.Couple]: 'Pasangan',
};

export enum TherapyPriorityEnum {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent',
}

export const TherapyPriorityLabels: Record<TherapyPriorityEnum, string> = {
  [TherapyPriorityEnum.Low]: 'Rendah',
  [TherapyPriorityEnum.Medium]: 'Sedang',
  [TherapyPriorityEnum.High]: 'Tinggi',
  [TherapyPriorityEnum.Urgent]: 'Mendesak',
};

export enum MentalHealthIssueEnum {
  Anxiety = 'anxiety',
  Depression = 'depression',
  Stress = 'stress',
  Trauma = 'trauma',
  Phobia = 'phobia',
  SleepDisorder = 'sleep_disorder',
  AddictionRecovery = 'addiction_recovery',
  SelfConfidence = 'self_confidence',
  Relationship = 'relationship',
  Career = 'career',
  Other = 'other',
}

export const MentalHealthIssueLabels: Record<MentalHealthIssueEnum, string> = {
  [MentalHealthIssueEnum.Anxiety]: 'Kecemasan',
  [MentalHealthIssueEnum.Depression]: 'Depresi',
  [MentalHealthIssueEnum.Stress]: 'Stres',
  [MentalHealthIssueEnum.Trauma]: 'Trauma',
  [MentalHealthIssueEnum.Phobia]: 'Fobia',
  [MentalHealthIssueEnum.SleepDisorder]: 'Gangguan Tidur',
  [MentalHealthIssueEnum.AddictionRecovery]: 'Pemulihan Kecanduan',
  [MentalHealthIssueEnum.SelfConfidence]: 'Kepercayaan Diri',
  [MentalHealthIssueEnum.Relationship]: 'Hubungan',
  [MentalHealthIssueEnum.Career]: 'Karir',
  [MentalHealthIssueEnum.Other]: 'Lainnya',
};

// Main therapy interface
export interface Therapy {
  id: string;
  clientId: string;
  therapistId: string;
  clientName: string;
  therapistName: string;
  type: EnumValue<typeof TherapyTypeEnum>;
  status: EnumValue<typeof TherapyStatusEnum>;
  priority: EnumValue<typeof TherapyPriorityEnum>;
  primaryIssue: EnumValue<typeof MentalHealthIssueEnum>;
  secondaryIssues?: EnumValue<typeof MentalHealthIssueEnum>[];
  description?: string;
  goals: string[];
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  estimatedSessions: number;
  completedSessions: number;
  totalSessionsPlanned: number;
  progress: number; // 0-100 percentage
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastSessionDate?: string; // ISO date string
  nextSessionDate?: string; // ISO date string
}

// Therapy plan interface
export interface TherapyPlan {
  id: string;
  therapyId: string;
  phase: string; // e.g., "Assessment", "Initial Therapy", "Maintenance"
  objectives: string[];
  techniques: string[];
  expectedOutcomes: string[];
  timeframe: string; // e.g., "2-4 weeks"
  status: 'pending' | 'active' | 'completed';
  sessions: string[]; // Array of session IDs
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Therapy progress tracking
export interface TherapyProgress {
  id: string;
  therapyId: string;
  sessionId: string;
  date: string; // ISO date string
  progressScore: number; // 1-10 scale
  improvementAreas: string[];
  challenges: string[];
  notes: string;
  nextSteps: string[];
  therapistNotes?: string;
  clientFeedback?: string;
}

// Therapy form data
export interface TherapyFormData {
  type: Therapy['type'];
  priority: Therapy['priority'];
  primaryIssue: Therapy['primaryIssue'];
  secondaryIssues?: Therapy['secondaryIssues'];
  description?: string;
  goals: string[];
  estimatedSessions: number;
  totalSessionsPlanned: number;
  notes?: string;
}

// Therapy filters
export interface TherapyFilters {
  search?: string;
  status?: Therapy['status'];
  type?: Therapy['type'];
  priority?: Therapy['priority'];
  primaryIssue?: Therapy['primaryIssue'];
  therapist?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Therapy statistics
export interface TherapyStatistics {
  totalTherapies: number;
  activeTherapies: number;
  completedTherapies: number;
  averageSessionsPerTherapy: number;
  successRate: number; // percentage
  byStatus: Record<TherapyStatusEnum, number>;
  byType: Record<TherapyTypeEnum, number>;
  byPriority: Record<TherapyPriorityEnum, number>;
  byIssue: Record<MentalHealthIssueEnum, number>;
}

// AI Mental Health Prediction interfaces
export interface MentalHealthPrediction {
  issue: MentalHealthIssueEnum;
  confidence: number; // 0-100 percentage
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendedTreatment: string[];
  estimatedSessionsNeeded: number;
  urgencyLevel: TherapyPriorityEnum;
}

export interface ConsultationAIPredictions {
  consultationId: string;
  generatedAt: string; // ISO date string
  primaryPrediction: MentalHealthPrediction;
  secondaryPredictions: MentalHealthPrediction[];
  overallRiskLevel: 'low' | 'medium' | 'high';
  recommendedTherapyType: TherapyTypeEnum;
  notes?: string;
}

// Consultation summary display interface
export interface ConsultationSummaryData {
  consultation: {
    id: string;
    sessionDate: string;
    sessionDuration: number;
    primaryConcern: string;
    secondaryConcerns?: string[];
    symptomSeverity: 1 | 2 | 3 | 4 | 5;
    symptomDuration: string;
    treatmentGoals: string[];
    initialAssessment?: string;
    consultationNotes?: string;
  };
  aiPredictions?: ConsultationAIPredictions;
  client: {
    id: string;
    fullName: string;
    age: number;
  };
  therapist: {
    id: string;
    fullName: string;
  };
}

// Session management types
export enum SessionStatusEnum {
  New = 'new',
  Scheduled = 'scheduled',
  Started = 'started',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
}

export const SessionStatusLabels: Record<SessionStatusEnum, string> = {
  [SessionStatusEnum.New]: 'Baru',
  [SessionStatusEnum.Scheduled]: 'Dijadwalkan',
  [SessionStatusEnum.Started]: 'Sedang Berlangsung',
  [SessionStatusEnum.Completed]: 'Selesai',
  [SessionStatusEnum.Cancelled]: 'Dibatalkan',
  [SessionStatusEnum.NoShow]: 'Tidak Hadir',
};

export enum SessionTypeEnum {
  Initial = 'initial',
  Regular = 'regular',
  Progress = 'progress',
  Final = 'final',
  Emergency = 'emergency',
}

export const SessionTypeLabels: Record<SessionTypeEnum, string> = {
  [SessionTypeEnum.Initial]: 'Sesi Awal',
  [SessionTypeEnum.Regular]: 'Sesi Reguler',
  [SessionTypeEnum.Progress]: 'Evaluasi Progress',
  [SessionTypeEnum.Final]: 'Sesi Akhir',
  [SessionTypeEnum.Emergency]: 'Sesi Darurat',
};

// Main session interface
export interface Session {
  id: string;
  therapyId: string;
  clientId: string;
  therapistId: string;
  sessionNumber: number;
  title: string;
  description?: string;
  type: SessionTypeEnum;
  status: SessionStatusEnum;
  scheduledDate?: string; // ISO date string
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  duration?: number; // in minutes
  notes?: string;
  objectives: string[];
  techniques: string[];
  outcomes?: string[];
  progressScore?: number; // 1-10 scale
  clientFeedback?: string;
  therapistNotes?: string;
  nextSteps?: string[];
  assignedHomework?: string[];
  attachments?: SessionAttachment[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Session attachment interface
export interface SessionAttachment {
  id: string;
  sessionId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string; // ISO date string
}

// Session form data interface
export interface SessionFormData {
  title: string;
  description?: string;
  type: SessionTypeEnum;
  scheduledDate?: string;
  duration?: number;
  objectives: string[];
  techniques: string[];
  notes?: string;
}

// Session creation data interface
export interface CreateSessionData extends SessionFormData {
  therapyId: string;
  clientId: string;
  therapistId: string;
}

// Session update data interface
export interface UpdateSessionData extends Partial<SessionFormData> {
  id?: string;
  status?: SessionStatusEnum;
  startTime?: string;
  endTime?: string;
  progressScore?: number;
  outcomes?: string[];
  clientFeedback?: string;
  therapistNotes?: string;
  nextSteps?: string[];
  assignedHomework?: string[];
}

// Session filters interface
export interface SessionFilters {
  search?: string;
  status?: SessionStatusEnum;
  type?: SessionTypeEnum;
  therapyId?: string;
  clientId?: string;
  therapistId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Session statistics interface
export interface SessionStatistics {
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  cancelledSessions: number;
  averageSessionDuration: number;
  averageProgressScore: number;
  byStatus: Record<SessionStatusEnum, number>;
  byType: Record<SessionTypeEnum, number>;
  completionRate: number; // percentage
}

// Session list response interface
export interface SessionListData {
  items: Session[];
  total: number;
  page: number;
  pageSize: number;
}

// Session response interfaces for API
export interface SessionResponse {
  success: boolean;
  data?: Session;
  message?: string;
}

export interface SessionListResponse {
  success: boolean;
  data?: SessionListData;
  message?: string;
}

// Utility types for session operations
export type SessionSortField = 'sessionNumber' | 'title' | 'scheduledDate' | 'status' | 'createdAt';
export type SessionSortOrder = 'asc' | 'desc';

export interface SessionSort {
  field: SessionSortField;
  order: SessionSortOrder;
}

// Consultation summary interface
export interface ConsultationSummary {
  id: string;
  clientId: string;
  therapyId: string;
  consultationDate: string; // ISO date string
  primaryConcern: string;
  secondaryConcerns?: string[];
  symptomSeverity: 1 | 2 | 3 | 4 | 5;
  symptomDuration: string;
  treatmentGoals: string[];
  initialAssessment?: string;
  consultationNotes?: string;
  aiPredictions?: {
    primaryIssue: MentalHealthIssueEnum;
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe';
    recommendedTreatment: string[];
    estimatedSessionsNeeded: number;
    urgencyLevel: TherapyPriorityEnum;
  };
}

// Session validation types
export interface SessionValidationError {
  field: string;
  message: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  errors: SessionValidationError[];
}

// Session status transition validation
export const VALID_STATUS_TRANSITIONS: Record<SessionStatusEnum, SessionStatusEnum[]> = {
  [SessionStatusEnum.New]: [
    SessionStatusEnum.Scheduled, 
    SessionStatusEnum.Started, 
    SessionStatusEnum.Cancelled
  ],
  [SessionStatusEnum.Scheduled]: [
    SessionStatusEnum.Started, 
    SessionStatusEnum.Completed, 
    SessionStatusEnum.Cancelled, 
    SessionStatusEnum.NoShow
  ],
  [SessionStatusEnum.Started]: [
    SessionStatusEnum.Completed, 
    SessionStatusEnum.Cancelled
  ],
  [SessionStatusEnum.Completed]: [], // Final state
  [SessionStatusEnum.Cancelled]: [
    SessionStatusEnum.Scheduled
  ], // Can be rescheduled
  [SessionStatusEnum.NoShow]: [
    SessionStatusEnum.Scheduled
  ], // Can be rescheduled
};