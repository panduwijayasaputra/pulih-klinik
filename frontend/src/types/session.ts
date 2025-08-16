type EnumValue<T> = T[keyof T];

// Session-related enums
export enum SessionStatusEnum {
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
  Rescheduled = 'rescheduled',
}

export const SessionStatusLabels: Record<SessionStatusEnum, string> = {
  [SessionStatusEnum.Scheduled]: 'Dijadwalkan',
  [SessionStatusEnum.InProgress]: 'Sedang Berlangsung',
  [SessionStatusEnum.Completed]: 'Selesai',
  [SessionStatusEnum.Cancelled]: 'Dibatalkan',
  [SessionStatusEnum.NoShow]: 'Tidak Hadir',
  [SessionStatusEnum.Rescheduled]: 'Dijadwal Ulang',
};

export enum SessionTypeEnum {
  Initial = 'initial',
  Regular = 'regular',
  Follow = 'follow_up',
  Emergency = 'emergency',
  Group = 'group',
  Assessment = 'assessment',
}

export const SessionTypeLabels: Record<SessionTypeEnum, string> = {
  [SessionTypeEnum.Initial]: 'Sesi Awal',
  [SessionTypeEnum.Regular]: 'Sesi Reguler',
  [SessionTypeEnum.Follow]: 'Sesi Tindak Lanjut',
  [SessionTypeEnum.Emergency]: 'Sesi Darurat',
  [SessionTypeEnum.Group]: 'Sesi Kelompok',
  [SessionTypeEnum.Assessment]: 'Sesi Penilaian',
};

export enum SessionPhaseEnum {
  PreSession = 'pre_session',
  Intake = 'intake',
  Assessment = 'assessment',
  Induction = 'induction',
  Therapy = 'therapy',
  PostTherapy = 'post_therapy',
  Closure = 'closure',
  PostSession = 'post_session',
}

export const SessionPhaseLabels: Record<SessionPhaseEnum, string> = {
  [SessionPhaseEnum.PreSession]: 'Pra-Sesi',
  [SessionPhaseEnum.Intake]: 'Penerimaan',
  [SessionPhaseEnum.Assessment]: 'Penilaian',
  [SessionPhaseEnum.Induction]: 'Induksi',
  [SessionPhaseEnum.Therapy]: 'Terapi',
  [SessionPhaseEnum.PostTherapy]: 'Pasca Terapi',
  [SessionPhaseEnum.Closure]: 'Penutupan',
  [SessionPhaseEnum.PostSession]: 'Pasca-Sesi',
};

export enum HypnosisDepthEnum {
  Light = 'light',
  Medium = 'medium',
  Deep = 'deep',
  Somnambulistic = 'somnambulistic',
}

export const HypnosisDepthLabels: Record<HypnosisDepthEnum, string> = {
  [HypnosisDepthEnum.Light]: 'Ringan',
  [HypnosisDepthEnum.Medium]: 'Sedang',
  [HypnosisDepthEnum.Deep]: 'Dalam',
  [HypnosisDepthEnum.Somnambulistic]: 'Somnambulistic',
};

export enum SessionOutcomeEnum {
  Excellent = 'excellent',
  Good = 'good',
  Satisfactory = 'satisfactory',
  NeedsImprovement = 'needs_improvement',
  Unsuccessful = 'unsuccessful',
}

export const SessionOutcomeLabels: Record<SessionOutcomeEnum, string> = {
  [SessionOutcomeEnum.Excellent]: 'Sangat Baik',
  [SessionOutcomeEnum.Good]: 'Baik',
  [SessionOutcomeEnum.Satisfactory]: 'Memuaskan',
  [SessionOutcomeEnum.NeedsImprovement]: 'Perlu Perbaikan',
  [SessionOutcomeEnum.Unsuccessful]: 'Tidak Berhasil',
};

// Main session interface
export interface Session {
  id: string;
  therapyId: string;
  clientId: string;
  therapistId: string;
  clientName: string;
  therapistName: string;
  sessionNumber: number;
  type: EnumValue<typeof SessionTypeEnum>;
  status: EnumValue<typeof SessionStatusEnum>;
  phase: EnumValue<typeof SessionPhaseEnum>;
  scheduledDate: string; // ISO date string
  scheduledTime: string; // ISO time string
  actualStartTime?: string; // ISO datetime string
  actualEndTime?: string; // ISO datetime string
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  location?: string; // e.g., "Room 1", "Online", "Client's home"
  objectives: string[];
  techniques: string[];
  hypnosisDepth?: EnumValue<typeof HypnosisDepthEnum>;
  outcome?: EnumValue<typeof SessionOutcomeEnum>;
  notes?: string;
  therapistNotes?: string;
  clientFeedback?: string;
  homeworkAssigned?: string;
  nextSessionPlanned?: boolean;
  nextSessionDate?: string; // ISO date string
  assessmentScores?: AssessmentScore[];
  attachments?: SessionAttachment[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Assessment score tracking
export interface AssessmentScore {
  id: string;
  sessionId: string;
  assessmentType: string; // e.g., "GAD-7", "PHQ-9", "Beck Depression Inventory"
  score: number;
  maxScore: number;
  interpretation: string; // e.g., "Mild anxiety", "Moderate depression"
  administeredAt: string; // "pre-session" | "post-session" | "during-session"
  notes?: string;
}

// Session attachments (recordings, documents, etc.)
export interface SessionAttachment {
  id: string;
  sessionId: string;
  fileName: string;
  fileType: string; // e.g., "audio", "document", "image"
  fileSize: number; // bytes
  uploadedAt: string; // ISO date string
  description?: string;
  isConfidential: boolean;
}

// Session form data
export interface SessionFormData {
  type: Session['type'];
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  location?: string;
  objectives: string[];
  techniques: string[];
  notes?: string;
}

// Session filters
export interface SessionFilters {
  search?: string;
  status?: Session['status'];
  type?: Session['type'];
  phase?: Session['phase'];
  therapist?: string;
  client?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  outcome?: Session['outcome'];
}

// Session statistics
export interface SessionStatistics {
  totalSessions: number;
  scheduledSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  averageDuration: number; // minutes
  successRate: number; // percentage
  byStatus: Record<SessionStatusEnum, number>;
  byType: Record<SessionTypeEnum, number>;
  byOutcome: Record<SessionOutcomeEnum, number>;
  weeklyTrend: Array<{
    week: string;
    completed: number;
    scheduled: number;
    cancelled: number;
  }>;
}

// Session scheduling
export interface SessionSchedule {
  id: string;
  therapistId: string;
  clientId: string;
  date: string; // ISO date string
  timeSlots: TimeSlot[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  notes?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // ISO time string
  endTime: string; // ISO time string
  isAvailable: boolean;
  sessionId?: string; // if booked
  notes?: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number; // e.g., every 2 weeks
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  endDate?: string; // ISO date string
  occurrences?: number; // number of sessions to create
}

// Session reminders
export interface SessionReminder {
  id: string;
  sessionId: string;
  recipientType: 'client' | 'therapist' | 'both';
  reminderType: 'email' | 'sms' | 'push';
  scheduleTime: string; // how long before session (e.g., "24h", "2h", "30m")
  message: string;
  isSent: boolean;
  sentAt?: string; // ISO date string
}