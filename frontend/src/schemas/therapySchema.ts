import { z } from 'zod';
import { 
  TherapyStatusEnum,
  TherapyTypeEnum,
  TherapyPriorityEnum,
  MentalHealthIssueEnum,
  SessionStatusEnum,
  SessionTypeEnum,
  VALID_STATUS_TRANSITIONS
} from '@/types/therapy';

// Enum validation helpers
const therapyStatusEnumSchema = z.nativeEnum(TherapyStatusEnum);
const therapyTypeEnumSchema = z.nativeEnum(TherapyTypeEnum);
const therapyPriorityEnumSchema = z.nativeEnum(TherapyPriorityEnum);
const mentalHealthIssueEnumSchema = z.nativeEnum(MentalHealthIssueEnum);
const sessionStatusEnumSchema = z.nativeEnum(SessionStatusEnum);
const sessionTypeEnumSchema = z.nativeEnum(SessionTypeEnum);

// Basic validation schemas
const idSchema = z.string().min(1, 'ID is required');
const dateStringSchema = z.string().datetime('Invalid date format');
const nonEmptyStringSchema = z.string().min(1, 'This field is required');
const optionalStringSchema = z.string().optional();

// Confidence percentage schema (0-100)
const confidenceSchema = z
  .number()
  .min(0, 'Confidence must be at least 0%')
  .max(100, 'Confidence cannot exceed 100%')
  .int('Confidence must be a whole number');

// Severity schema
const severitySchema = z.enum(['mild', 'moderate', 'severe'], {
  message: 'Severity must be mild, moderate, or severe',
});

// Symptom severity rating (1-5)
const symptomSeveritySchema = z
  .number()
  .min(1, 'Severity must be at least 1')
  .max(5, 'Severity cannot exceed 5')
  .int('Severity must be a whole number');

// Session duration validation (15-180 minutes)
const sessionDurationSchema = z
  .number()
  .min(15, 'Session duration must be at least 15 minutes')
  .max(180, 'Session duration cannot exceed 3 hours')
  .int('Session duration must be a whole number');

// Mental Health Prediction schema
export const mentalHealthPredictionSchema = z.object({
  issue: mentalHealthIssueEnumSchema,
  confidence: confidenceSchema,
  severity: severitySchema,
  description: nonEmptyStringSchema.max(500, 'Description cannot exceed 500 characters'),
  recommendedTreatment: z
    .array(nonEmptyStringSchema)
    .min(1, 'At least one recommended treatment is required')
    .max(10, 'Cannot have more than 10 recommended treatments'),
  estimatedSessionsNeeded: z
    .number()
    .min(1, 'Must need at least 1 session')
    .max(50, 'Cannot exceed 50 sessions')
    .int('Sessions must be a whole number'),
  urgencyLevel: therapyPriorityEnumSchema,
});

// Consultation AI Predictions schema
export const consultationAIPredictionsSchema = z.object({
  consultationId: idSchema,
  generatedAt: dateStringSchema,
  primaryPrediction: mentalHealthPredictionSchema,
  secondaryPredictions: z
    .array(mentalHealthPredictionSchema)
    .max(5, 'Cannot have more than 5 secondary predictions'),
  overallRiskLevel: z.enum(['low', 'medium', 'high'], {
    message: 'Risk level must be low, medium, or high',
  }),
  recommendedTherapyType: therapyTypeEnumSchema,
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

// Consultation summary data schema
export const consultationSummaryDataSchema = z.object({
  consultation: z.object({
    id: idSchema,
    sessionDate: dateStringSchema,
    sessionDuration: sessionDurationSchema,
    primaryConcern: nonEmptyStringSchema.max(1000, 'Primary concern cannot exceed 1000 characters'),
    secondaryConcerns: z
      .array(nonEmptyStringSchema)
      .max(10, 'Cannot have more than 10 secondary concerns')
      .optional(),
    symptomSeverity: symptomSeveritySchema,
    symptomDuration: nonEmptyStringSchema.max(100, 'Symptom duration cannot exceed 100 characters'),
    treatmentGoals: z
      .array(nonEmptyStringSchema)
      .min(1, 'At least one treatment goal is required')
      .max(10, 'Cannot have more than 10 treatment goals'),
    initialAssessment: z
      .string()
      .max(2000, 'Initial assessment cannot exceed 2000 characters')
      .optional(),
    consultationNotes: z
      .string()
      .max(2000, 'Consultation notes cannot exceed 2000 characters')
      .optional(),
  }),
  aiPredictions: consultationAIPredictionsSchema.optional(),
  client: z.object({
    id: idSchema,
    fullName: nonEmptyStringSchema.max(100, 'Full name cannot exceed 100 characters'),
    age: z
      .number()
      .min(0, 'Age cannot be negative')
      .max(150, 'Invalid age')
      .int('Age must be a whole number'),
  }),
  therapist: z.object({
    id: idSchema,
    fullName: nonEmptyStringSchema.max(100, 'Full name cannot exceed 100 characters'),
  }),
});

// Therapy schema
export const therapySchema = z.object({
  id: idSchema,
  clientId: idSchema,
  therapistId: idSchema,
  clientName: nonEmptyStringSchema,
  therapistName: nonEmptyStringSchema,
  type: therapyTypeEnumSchema,
  status: therapyStatusEnumSchema,
  priority: therapyPriorityEnumSchema,
  primaryIssue: mentalHealthIssueEnumSchema,
  secondaryIssues: z.array(mentalHealthIssueEnumSchema).optional(),
  description: optionalStringSchema,
  goals: z
    .array(nonEmptyStringSchema)
    .min(1, 'At least one goal is required')
    .max(10, 'Cannot have more than 10 goals'),
  startDate: dateStringSchema,
  endDate: z.string().datetime().optional(),
  estimatedSessions: z
    .number()
    .min(1, 'Must have at least 1 estimated session')
    .max(100, 'Cannot exceed 100 sessions')
    .int('Estimated sessions must be a whole number'),
  completedSessions: z
    .number()
    .min(0, 'Completed sessions cannot be negative')
    .int('Completed sessions must be a whole number'),
  totalSessionsPlanned: z
    .number()
    .min(1, 'Must plan at least 1 session')
    .max(100, 'Cannot plan more than 100 sessions')
    .int('Planned sessions must be a whole number'),
  progress: z
    .number()
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100%')
    .int('Progress must be a whole number'),
  notes: optionalStringSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  lastSessionDate: z.string().datetime().optional(),
  nextSessionDate: z.string().datetime().optional(),
});

// Therapy form data schema
export const therapyFormDataSchema = z.object({
  type: therapyTypeEnumSchema,
  priority: therapyPriorityEnumSchema,
  primaryIssue: mentalHealthIssueEnumSchema,
  secondaryIssues: z.array(mentalHealthIssueEnumSchema).optional(),
  description: optionalStringSchema,
  goals: z
    .array(nonEmptyStringSchema)
    .min(1, 'At least one goal is required')
    .max(10, 'Cannot have more than 10 goals'),
  estimatedSessions: z
    .number()
    .min(1, 'Must estimate at least 1 session')
    .max(100, 'Cannot exceed 100 sessions')
    .int('Estimated sessions must be a whole number'),
  totalSessionsPlanned: z
    .number()
    .min(1, 'Must plan at least 1 session')
    .max(100, 'Cannot plan more than 100 sessions')
    .int('Planned sessions must be a whole number'),
  notes: optionalStringSchema,
});

// Therapy progress schema
export const therapyProgressSchema = z.object({
  id: idSchema,
  therapyId: idSchema,
  sessionId: idSchema,
  date: dateStringSchema,
  progressScore: z
    .number()
    .min(1, 'Progress score must be at least 1')
    .max(10, 'Progress score cannot exceed 10')
    .int('Progress score must be a whole number'),
  improvementAreas: z
    .array(nonEmptyStringSchema)
    .max(10, 'Cannot have more than 10 improvement areas'),
  challenges: z
    .array(nonEmptyStringSchema)
    .max(10, 'Cannot have more than 10 challenges'),
  notes: nonEmptyStringSchema.max(2000, 'Notes cannot exceed 2000 characters'),
  nextSteps: z
    .array(nonEmptyStringSchema)
    .min(1, 'At least one next step is required')
    .max(10, 'Cannot have more than 10 next steps'),
  therapistNotes: z
    .string()
    .max(2000, 'Therapist notes cannot exceed 2000 characters')
    .optional(),
  clientFeedback: z
    .string()
    .max(1000, 'Client feedback cannot exceed 1000 characters')
    .optional(),
});

// Therapy statistics schema
export const therapyStatisticsSchema = z.object({
  totalTherapies: z.number().min(0, 'Total therapies cannot be negative').int(),
  activeTherapies: z.number().min(0, 'Active therapies cannot be negative').int(),
  completedTherapies: z.number().min(0, 'Completed therapies cannot be negative').int(),
  averageSessionsPerTherapy: z.number().min(0, 'Average sessions cannot be negative'),
  successRate: z.number().min(0, 'Success rate cannot be negative').max(100, 'Success rate cannot exceed 100%'),
  byStatus: z.record(therapyStatusEnumSchema, z.number().min(0).int()),
  byType: z.record(therapyTypeEnumSchema, z.number().min(0).int()),
  byPriority: z.record(therapyPriorityEnumSchema, z.number().min(0).int()),
  byIssue: z.record(mentalHealthIssueEnumSchema, z.number().min(0).int()),
});

// Validation functions
export const validateConsultationSummaryData = (data: unknown) => {
  try {
    return {
      success: true,
      data: consultationSummaryDataSchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: 'Unknown validation error' }],
    };
  }
};

export const validateAIPredictions = (data: unknown) => {
  try {
    return {
      success: true,
      data: consultationAIPredictionsSchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: 'Unknown validation error' }],
    };
  }
};

export const validateTherapyData = (data: unknown) => {
  try {
    return {
      success: true,
      data: therapySchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: 'Unknown validation error' }],
    };
  }
};

// Safe parsing helpers with fallbacks
export const safeParseConsultationSummary = (data: unknown) => {
  const result = consultationSummaryDataSchema.safeParse(data);
  if (result.success) {
    return { data: result.data, error: null };
  }
  
  // Provide fallback data for UI consistency
  const fallbackData = {
    consultation: {
      id: 'unknown',
      sessionDate: new Date().toISOString(),
      sessionDuration: 60,
      primaryConcern: 'Data tidak valid atau rusak',
      symptomSeverity: 3 as const,
      symptomDuration: 'Tidak diketahui',
      treatmentGoals: ['Data perlu diperbaiki'],
    },
    client: {
      id: 'unknown',
      fullName: 'Klien Tidak Dikenal',
      age: 0,
    },
    therapist: {
      id: 'unknown',
      fullName: 'Terapis Tidak Dikenal',
    },
  };
  
  return { data: fallbackData, error: result.error };
};

// Type inference from schemas
export type ConsultationSummaryData = z.infer<typeof consultationSummaryDataSchema>;
export type ConsultationAIPredictions = z.infer<typeof consultationAIPredictionsSchema>;
export type MentalHealthPrediction = z.infer<typeof mentalHealthPredictionSchema>;
export type TherapyData = z.infer<typeof therapySchema>;
export type TherapyFormData = z.infer<typeof therapyFormDataSchema>;
export type TherapyProgress = z.infer<typeof therapyProgressSchema>;
export type TherapyStatistics = z.infer<typeof therapyStatisticsSchema>;

// Validation error type
export type ValidationError = {
  path: string;
  message: string;
};

export type ValidationResult<T> = {
  success: boolean;
  data: T | null;
  errors: ValidationError[] | null;
};

// Session validation schemas
const sessionTitleSchema = z
  .string()
  .min(1, 'Judul sesi wajib diisi')
  .max(100, 'Judul sesi maksimal 100 karakter');

const sessionDescriptionSchema = z
  .string()
  .max(500, 'Deskripsi sesi maksimal 500 karakter')
  .optional();

// const sessionDurationSchema = z
//   .number()
//   .min(15, 'Durasi sesi minimal 15 menit')
//   .max(240, 'Durasi sesi maksimal 4 jam')
//   .int('Durasi sesi harus berupa angka bulat')
//   .optional();

const sessionNumberSchema = z
  .number()
  .min(1, 'Nomor sesi minimal 1')
  .max(999, 'Nomor sesi maksimal 999')
  .int('Nomor sesi harus berupa angka bulat');

const progressScoreSchema = z
  .number()
  .min(1, 'Skor progress minimal 1')
  .max(10, 'Skor progress maksimal 10')
  .int('Skor progress harus berupa angka bulat')
  .optional();

// Session attachment schema
export const sessionAttachmentSchema = z.object({
  id: idSchema,
  sessionId: idSchema,
  fileName: nonEmptyStringSchema.max(255, 'Nama file maksimal 255 karakter'),
  fileType: nonEmptyStringSchema.max(50, 'Tipe file maksimal 50 karakter'),
  fileSize: z.number().min(1, 'Ukuran file minimal 1 byte').max(10 * 1024 * 1024, 'Ukuran file maksimal 10MB'),
  fileUrl: z.string().url('URL file tidak valid'),
  uploadedBy: idSchema,
  uploadedAt: dateStringSchema,
});

// Main session schema
export const sessionSchema = z.object({
  id: idSchema,
  therapyId: idSchema,
  clientId: idSchema,
  therapistId: idSchema,
  sessionNumber: sessionNumberSchema,
  title: sessionTitleSchema,
  description: sessionDescriptionSchema,
  type: sessionTypeEnumSchema,
  status: sessionStatusEnumSchema,
  scheduledDate: z.string().datetime().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  duration: sessionDurationSchema,
  notes: z.string().max(2000, 'Catatan sesi maksimal 2000 karakter').optional(),
  objectives: z
    .array(nonEmptyStringSchema)
    .min(1, 'Minimal satu tujuan sesi diperlukan')
    .max(10, 'Maksimal 10 tujuan per sesi'),
  techniques: z
    .array(nonEmptyStringSchema)
    .max(15, 'Maksimal 15 teknik per sesi'),
  outcomes: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 hasil per sesi')
    .optional(),
  progressScore: progressScoreSchema,
  clientFeedback: z.string().max(1000, 'Feedback klien maksimal 1000 karakter').optional(),
  therapistNotes: z.string().max(2000, 'Catatan terapis maksimal 2000 karakter').optional(),
  nextSteps: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 langkah selanjutnya')
    .optional(),
  assignedHomework: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 tugas rumah')
    .optional(),
  attachments: z.array(sessionAttachmentSchema).max(20, 'Maksimal 20 lampiran per sesi').optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

// Session form data schema
export const sessionFormDataSchema = z.object({
  title: sessionTitleSchema,
  description: sessionDescriptionSchema,
  type: sessionTypeEnumSchema,
  scheduledDate: z.string().datetime().optional(),
  duration: sessionDurationSchema,
  objectives: z
    .array(nonEmptyStringSchema)
    .min(1, 'Minimal satu tujuan sesi diperlukan')
    .max(10, 'Maksimal 10 tujuan per sesi'),
  techniques: z
    .array(nonEmptyStringSchema)
    .max(15, 'Maksimal 15 teknik per sesi'),
  notes: z.string().max(2000, 'Catatan sesi maksimal 2000 karakter').optional(),
});

// Session creation data schema
export const createSessionDataSchema = sessionFormDataSchema.extend({
  therapyId: idSchema,
  clientId: idSchema,
  therapistId: idSchema,
});

// Session update data schema
export const updateSessionDataSchema = z.object({
  id: idSchema.optional(),
  title: sessionTitleSchema.optional(),
  description: sessionDescriptionSchema,
  type: sessionTypeEnumSchema.optional(),
  status: sessionStatusEnumSchema.optional(),
  scheduledDate: z.string().datetime().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  duration: sessionDurationSchema,
  objectives: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 tujuan per sesi')
    .optional(),
  techniques: z
    .array(nonEmptyStringSchema)
    .max(15, 'Maksimal 15 teknik per sesi')
    .optional(),
  outcomes: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 hasil per sesi')
    .optional(),
  progressScore: progressScoreSchema,
  clientFeedback: z.string().max(1000, 'Feedback klien maksimal 1000 karakter').optional(),
  therapistNotes: z.string().max(2000, 'Catatan terapis maksimal 2000 karakter').optional(),
  nextSteps: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 langkah selanjutnya')
    .optional(),
  assignedHomework: z
    .array(nonEmptyStringSchema)
    .max(10, 'Maksimal 10 tugas rumah')
    .optional(),
  notes: z.string().max(2000, 'Catatan sesi maksimal 2000 karakter').optional(),
});

// Session statistics schema
export const sessionStatisticsSchema = z.object({
  totalSessions: z.number().min(0, 'Total sesi tidak boleh negatif').int(),
  completedSessions: z.number().min(0, 'Sesi selesai tidak boleh negatif').int(),
  scheduledSessions: z.number().min(0, 'Sesi terjadwal tidak boleh negatif').int(),
  cancelledSessions: z.number().min(0, 'Sesi dibatalkan tidak boleh negatif').int(),
  averageSessionDuration: z.number().min(0, 'Rata-rata durasi sesi tidak boleh negatif'),
  averageProgressScore: z.number().min(0, 'Rata-rata skor progress tidak boleh negatif').max(10),
  byStatus: z.record(sessionStatusEnumSchema, z.number().min(0).int()),
  byType: z.record(sessionTypeEnumSchema, z.number().min(0).int()),
  completionRate: z.number().min(0, 'Tingkat penyelesaian tidak boleh negatif').max(100, 'Tingkat penyelesaian tidak boleh lebih dari 100%'),
});

// Session validation functions
export const validateSessionData = (data: unknown) => {
  try {
    return {
      success: true,
      data: sessionSchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: 'Kesalahan validasi yang tidak dikenal' }],
    };
  }
};

export const validateSessionFormData = (data: unknown) => {
  try {
    return {
      success: true,
      data: sessionFormDataSchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: 'Kesalahan validasi yang tidak dikenal' }],
    };
  }
};

export const validateCreateSessionData = (data: unknown) => {
  try {
    return {
      success: true,
      data: createSessionDataSchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ path: 'unknown', message: 'Kesalahan validasi yang tidak dikenal' }],
    };
  }
};

// Session status transition validation
export const validateStatusTransition = (currentStatus: SessionStatusEnum, newStatus: SessionStatusEnum): ValidationResult<boolean> => {
  const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  const isValid = validTransitions.includes(newStatus);
  
  if (isValid) {
    return {
      success: true,
      data: true,
      errors: null,
    };
  }
  
  return {
    success: false,
    data: false,
    errors: [{
      path: 'status',
      message: `Transisi status dari "${currentStatus}" ke "${newStatus}" tidak diperbolehkan`,
    }],
  };
};

// Safe parsing helper for sessions
export const safeParseSession = (data: unknown) => {
  const result = sessionSchema.safeParse(data);
  if (result.success) {
    return { data: result.data, error: null };
  }
  
  // Provide fallback data for UI consistency
  const fallbackData = {
    id: 'unknown',
    therapyId: 'unknown',
    clientId: 'unknown',
    therapistId: 'unknown',
    sessionNumber: 1,
    title: 'Data Sesi Tidak Valid',
    type: SessionTypeEnum.Regular,
    status: SessionStatusEnum.New,
    objectives: ['Data perlu diperbaiki'],
    techniques: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return { data: fallbackData, error: result.error };
};

// Type inference from session schemas
export type SessionData = z.infer<typeof sessionSchema>;
export type SessionFormData = z.infer<typeof sessionFormDataSchema>;
export type CreateSessionData = z.infer<typeof createSessionDataSchema>;
export type UpdateSessionData = z.infer<typeof updateSessionDataSchema>;
export type SessionAttachment = z.infer<typeof sessionAttachmentSchema>;
export type SessionStatistics = z.infer<typeof sessionStatisticsSchema>;