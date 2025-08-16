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