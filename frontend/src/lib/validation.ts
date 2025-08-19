import { z } from 'zod';

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s\u00C0-\u017F\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]+)?$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Field ini wajib diisi',
  EMAIL: 'Format email tidak valid',
  PHONE: 'Format nomor telepon tidak valid',
  PASSWORD: 'Password harus minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol',
  NAME: 'Nama hanya boleh berisi huruf',
  ALPHANUMERIC: 'Hanya boleh berisi huruf dan angka',
  NUMERIC: 'Hanya boleh berisi angka',
  DECIMAL: 'Format angka tidak valid',
  URL: 'Format URL tidak valid',
  MIN_LENGTH: (min: number) => `Minimal ${min} karakter`,
  MAX_LENGTH: (max: number) => `Maksimal ${max} karakter`,
  MIN_VALUE: (min: number) => `Nilai minimal ${min}`,
  MAX_VALUE: (max: number) => `Nilai maksimal ${max}`,
  INVALID_FORMAT: 'Format tidak valid',
  FUTURE_DATE: 'Tanggal harus di masa depan',
  PAST_DATE: 'Tanggal harus di masa lalu',
  DATE_RANGE: 'Tanggal tidak dalam rentang yang valid',
} as const;

// Common validation schemas
export const commonSchemas = {
  email: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL),
  
  phone: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.PHONE, VALIDATION_MESSAGES.PHONE),
  
  password: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .min(8, VALIDATION_MESSAGES.MIN_LENGTH(8))
    .regex(VALIDATION_PATTERNS.PASSWORD, VALIDATION_MESSAGES.PASSWORD),
  
  name: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
    .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
    .regex(VALIDATION_PATTERNS.NAME, VALIDATION_MESSAGES.NAME),
  
  requiredString: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED),
  
  optionalString: z.string().optional(),
  
  numeric: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.NUMERIC, VALIDATION_MESSAGES.NUMERIC),
  
  decimal: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.DECIMAL, VALIDATION_MESSAGES.DECIMAL),
  
  url: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .regex(VALIDATION_PATTERNS.URL, VALIDATION_MESSAGES.URL),
  
  futureDate: z.date()
    .min(new Date(), VALIDATION_MESSAGES.FUTURE_DATE),
  
  pastDate: z.date()
    .max(new Date(), VALIDATION_MESSAGES.PAST_DATE),
  
  dateRange: (startDate: Date, endDate: Date) =>
    z.date()
      .min(startDate, VALIDATION_MESSAGES.DATE_RANGE)
      .max(endDate, VALIDATION_MESSAGES.DATE_RANGE),
} as const;

// Validation helper functions
export const validationHelpers = {
  // Check if a value is empty
  isEmpty: (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  // Check if a value is not empty
  isNotEmpty: (value: any): boolean => !validationHelpers.isEmpty(value),

  // Validate email format
  isValidEmail: (email: string): boolean => {
    return VALIDATION_PATTERNS.EMAIL.test(email);
  },

  // Validate phone format
  isValidPhone: (phone: string): boolean => {
    return VALIDATION_PATTERNS.PHONE.test(phone);
  },

  // Validate password strength
  isValidPassword: (password: string): boolean => {
    return VALIDATION_PATTERNS.PASSWORD.test(password);
  },

  // Get password strength score (0-4)
  getPasswordStrength: (password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  },

  // Validate name format
  isValidName: (name: string): boolean => {
    return VALIDATION_PATTERNS.NAME.test(name);
  },

  // Validate numeric format
  isValidNumeric: (value: string): boolean => {
    return VALIDATION_PATTERNS.NUMERIC.test(value);
  },

  // Validate decimal format
  isValidDecimal: (value: string): boolean => {
    return VALIDATION_PATTERNS.DECIMAL.test(value);
  },

  // Validate URL format
  isValidUrl: (url: string): boolean => {
    return VALIDATION_PATTERNS.URL.test(url);
  },

  // Check if date is in the future
  isFutureDate: (date: Date): boolean => {
    return date > new Date();
  },

  // Check if date is in the past
  isPastDate: (date: Date): boolean => {
    return date < new Date();
  },

  // Check if date is within range
  isDateInRange: (date: Date, startDate: Date, endDate: Date): boolean => {
    return date >= startDate && date <= endDate;
  },

  // Format validation error messages
  formatErrorMessages: (errors: z.ZodError): string[] => {
    return errors.errors.map(error => {
      const field = error.path.join('.');
      return `${field}: ${error.message}`;
    });
  },

  // Get field-specific error
  getFieldError: (errors: z.ZodError, fieldPath: string): string | undefined => {
    const error = errors.errors.find(err => err.path.join('.') === fieldPath);
    return error?.message;
  },

  // Validate form data against schema
  validateFormData: <T>(schema: z.ZodSchema<T>, data: any): { success: boolean; data?: T; errors?: string[] } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          success: false, 
          errors: validationHelpers.formatErrorMessages(error) 
        };
      }
      return { 
        success: false, 
        errors: ['Validation failed'] 
      };
    }
  },

  // Async validation with debouncing
  debouncedValidation: <T>(
    schema: z.ZodSchema<T>,
    data: any,
    delay: number = 300
  ): Promise<{ success: boolean; data?: T; errors?: string[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(validationHelpers.validateFormData(schema, data));
      }, delay);
    });
  },
} as const;

// Form validation utilities
export const formValidation = {
  // Real-time field validation
  validateField: <T>(
    schema: z.ZodSchema<T>,
    fieldPath: string,
    value: any
  ): { isValid: boolean; error?: string } => {
    try {
      // Create a partial schema for the specific field
      const fieldSchema = z.object({ [fieldPath]: schema }).partial();
      fieldSchema.parse({ [fieldPath]: value });
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = validationHelpers.getFieldError(error, fieldPath);
        return { isValid: false, error: fieldError };
      }
      return { isValid: false, error: 'Validation failed' };
    }
  },

  // Validate multiple fields
  validateFields: <T>(
    schema: z.ZodSchema<T>,
    fields: Record<string, any>
  ): Record<string, { isValid: boolean; error?: string }> => {
    const results: Record<string, { isValid: boolean; error?: string }> = {};
    
    Object.keys(fields).forEach(fieldPath => {
      results[fieldPath] = formValidation.validateField(schema, fieldPath, fields[fieldPath]);
    });
    
    return results;
  },

  // Check if form is valid
  isFormValid: (fieldValidations: Record<string, { isValid: boolean }>): boolean => {
    return Object.values(fieldValidations).every(validation => validation.isValid);
  },

  // Get all form errors
  getFormErrors: (fieldValidations: Record<string, { isValid: boolean; error?: string }>): string[] => {
    return Object.values(fieldValidations)
      .filter(validation => !validation.isValid)
      .map(validation => validation.error)
      .filter(Boolean) as string[];
  },
} as const;

// Session-specific validation schemas
export const sessionValidationSchemas = {
  createSession: z.object({
    therapyId: commonSchemas.requiredString,
    clientId: commonSchemas.requiredString,
    therapistId: commonSchemas.requiredString,
    title: z.string()
      .min(1, VALIDATION_MESSAGES.REQUIRED)
      .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100)),
    description: z.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .optional(),
    type: z.enum(['initial', 'regular', 'progress', 'final', 'emergency']),
    scheduledDate: z.date().optional(),
    duration: z.number()
      .min(15, VALIDATION_MESSAGES.MIN_VALUE(15))
      .max(240, VALIDATION_MESSAGES.MAX_VALUE(240))
      .optional(),
    objectives: z.array(z.string())
      .min(1, 'Minimal satu tujuan harus diisi')
      .max(10, 'Maksimal 10 tujuan'),
    techniques: z.array(z.string())
      .max(15, 'Maksimal 15 teknik')
      .optional(),
    notes: z.string()
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .optional(),
  }),

  updateSession: z.object({
    title: z.string()
      .min(1, VALIDATION_MESSAGES.REQUIRED)
      .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
      .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
      .optional(),
    description: z.string()
      .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500))
      .optional(),
    status: z.enum(['new', 'scheduled', 'started', 'completed', 'cancelled', 'no_show'])
      .optional(),
    scheduledDate: z.date().optional(),
    duration: z.number()
      .min(15, VALIDATION_MESSAGES.MIN_VALUE(15))
      .max(240, VALIDATION_MESSAGES.MAX_VALUE(240))
      .optional(),
    objectives: z.array(z.string())
      .min(1, 'Minimal satu tujuan harus diisi')
      .max(10, 'Maksimal 10 tujuan')
      .optional(),
    techniques: z.array(z.string())
      .max(15, 'Maksimal 15 teknik')
      .optional(),
    notes: z.string()
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .optional(),
    progressScore: z.number()
      .min(1, VALIDATION_MESSAGES.MIN_VALUE(1))
      .max(10, VALIDATION_MESSAGES.MAX_VALUE(10))
      .optional(),
    outcomes: z.array(z.string())
      .max(10, 'Maksimal 10 hasil')
      .optional(),
    clientFeedback: z.string()
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .optional(),
    therapistNotes: z.string()
      .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
      .optional(),
    nextSteps: z.array(z.string())
      .max(10, 'Maksimal 10 langkah selanjutnya')
      .optional(),
    assignedHomework: z.array(z.string())
      .max(10, 'Maksimal 10 tugas')
      .optional(),
  }),
} as const;

// Export types
export type ValidationResult<T> = { success: true; data: T } | { success: false; errors: string[] };
export type FieldValidation = { isValid: boolean; error?: string };
export type FormValidation = Record<string, FieldValidation>;

export default {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  commonSchemas,
  validationHelpers,
  formValidation,
  sessionValidationSchemas,
};
