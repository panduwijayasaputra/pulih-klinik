// Test script to verify primaryConcern fix
const { z } = require('zod');

// Mock enums for testing
const ConsultationFormTypeEnum = {
  General: 'general',
  DrugAddiction: 'drugAddiction', 
  Minor: 'minor'
};

const ConsultationStatusEnum = {
  Draft: 'draft',
  Completed: 'completed'
};

// Basic consultation schema - only basic fields required
const BaseConsultationSchema = z.object({
  clientId: z.string().min(1, 'ID klien tidak boleh kosong'),
  formTypes: z.array(z.nativeEnum(ConsultationFormTypeEnum)).min(1, 'Pilih minimal satu jenis konsultasi'),
  status: z.nativeEnum(ConsultationStatusEnum, {
    message: 'Pilih status konsultasi yang sesuai'
  }),
  // Basic required fields - always shown in form
  consultationNotes: z.string().min(1, 'Tuliskan catatan konsultasi'),
  scriptGenerationPreferences: z.string().min(1, 'Jelaskan preferensi untuk generasi script'),
  initialAssessment: z.string().min(1, 'Tuliskan penilaian awal kondisi klien'),
  recommendedTreatmentPlan: z.string().min(1, 'Tuliskan rencana terapi yang direkomendasikan'),
  // Optional fields
  symptomSeverity: z.enum(['1', '2', '3', '4', '5'], {
    message: 'Pilih tingkat keparahan gejala yang sesuai'
  }).optional(),
  symptomDuration: z.string().optional(),
  treatmentGoals: z.array(z.string().min(1, 'Tujuan terapi tidak boleh kosong')).optional(),
  clientExpectations: z.string().optional(),
});

const GeneralConsultationSchema = z.object({
  // Primary concern - required for General consultation
  primaryConcern: z.string().optional(),
  currentLifeStressors: z.array(z.string().min(1, 'Stresor tidak boleh kosong')).min(1, 'Pilih minimal satu stresor kehidupan saat ini').optional(),
  supportSystem: z.string().min(1, 'Jelaskan sistem dukungan yang tersedia').optional(),
  workLifeBalance: z.number().min(1, 'Beri penilaian keseimbangan kerja-hidup (1-10)').max(10, 'Penilaian maksimal 10').optional(),
});

const DrugAddictionConsultationSchema = z.object({
  substanceHistory: z.array(z.string().min(1, 'Jenis zat tidak boleh kosong')).min(1, 'Pilih minimal satu jenis zat yang pernah digunakan').optional(),
  primarySubstance: z.string().min(1, 'Jelaskan zat utama yang digunakan').optional(),
  ageOfFirstUse: z.number().min(5, 'Usia pertama kali menggunakan minimal 5').max(100, 'Usia maksimal 100').optional(),
});

const MinorConsultationSchema = z.object({
  guardianName: z.string().min(1, 'Masukkan nama lengkap wali').optional(),
  guardianRelationship: z.string().min(1, 'Jelaskan hubungan dengan wali').optional(),
  guardianPhone: z.string().min(1, 'Masukkan nomor telepon wali').optional(),
  currentGradeLevel: z.string().min(1, 'Masukkan tingkat kelas saat ini').optional(),
  academicPerformance: z.enum(['poor', 'fair', 'good', 'excellent'], {
    message: 'Pilih tingkat prestasi akademik yang sesuai'
  }).optional(),
});

const consultationFormSchema = BaseConsultationSchema
  .merge(GeneralConsultationSchema)
  .merge(DrugAddictionConsultationSchema)
  .merge(MinorConsultationSchema)
  .superRefine((data, ctx) => {
    // Validate fields when any consultation type is selected
    if (data.formTypes && data.formTypes.length > 0) {
      if (!data.symptomSeverity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih tingkat keparahan gejala yang sesuai',
          path: ['symptomSeverity'],
        });
      }
      if (!data.symptomDuration || data.symptomDuration.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih berapa lama gejala berlangsung',
          path: ['symptomDuration'],
        });
      }
      if (!data.treatmentGoals || data.treatmentGoals.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih minimal satu tujuan terapi',
          path: ['treatmentGoals'],
        });
      }
      if (!data.clientExpectations || data.clientExpectations.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan harapan Anda dari terapi',
          path: ['clientExpectations'],
        });
      }
    }

    // If General form type is selected, validate general fields
    if (data.formTypes && data.formTypes.includes(ConsultationFormTypeEnum.General)) {
      if (!data.primaryConcern || data.primaryConcern.trim() === '' || data.primaryConcern.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan keluhan utama minimal 10 karakter',
          path: ['primaryConcern'],
        });
      }
      if (!data.currentLifeStressors || data.currentLifeStressors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih minimal satu stresor kehidupan saat ini',
          path: ['currentLifeStressors'],
        });
      }
      if (!data.supportSystem || data.supportSystem.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan sistem dukungan yang tersedia',
          path: ['supportSystem'],
        });
      }
      if (!data.workLifeBalance || data.workLifeBalance < 1 || data.workLifeBalance > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Beri penilaian keseimbangan kerja-hidup (1-10)',
          path: ['workLifeBalance'],
        });
      }
    }

    // If DrugAddiction form type is selected, validate drug addiction fields
    if (data.formTypes && data.formTypes.includes(ConsultationFormTypeEnum.DrugAddiction)) {
      if (!data.substanceHistory || data.substanceHistory.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih minimal satu jenis zat yang pernah digunakan',
          path: ['substanceHistory'],
        });
      }
      if (!data.primarySubstance || data.primarySubstance.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan zat utama yang digunakan',
          path: ['primarySubstance'],
        });
      }
      if (!data.ageOfFirstUse || data.ageOfFirstUse < 5 || data.ageOfFirstUse > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Usia pertama kali menggunakan harus antara 5-100 tahun',
          path: ['ageOfFirstUse'],
        });
      }
    }

    // If Minor form type is selected, validate minor fields
    if (data.formTypes && data.formTypes.includes(ConsultationFormTypeEnum.Minor)) {
      if (!data.guardianName || data.guardianName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nama lengkap wali wajib diisi',
          path: ['guardianName'],
        });
      }
      if (!data.guardianRelationship || data.guardianRelationship.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Hubungan dengan wali wajib diisi',
          path: ['guardianRelationship'],
        });
      }
      if (!data.guardianPhone || data.guardianPhone.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nomor telepon wali wajib diisi',
          path: ['guardianPhone'],
        });
      }
      if (!data.currentGradeLevel || data.currentGradeLevel.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tingkat kelas saat ini wajib diisi',
          path: ['currentGradeLevel'],
        });
      }
      if (!data.academicPerformance) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Prestasi akademik wajib diisi',
          path: ['academicPerformance'],
        });
      }
    }
  });

// Test 1: No consultation type selected - should only show 5 basic errors
console.log('=== Test 1: No consultation type selected ===');
const test1Data = {
  clientId: 'test-client',
  formTypes: [],
  status: 'draft',
  consultationNotes: '',
  scriptGenerationPreferences: '',
  initialAssessment: '',
  recommendedTreatmentPlan: '',
  // primaryConcern not included - should not be required
};

const result1 = consultationFormSchema.safeParse(test1Data);
console.log('Success:', result1.success);
console.log('Errors count:', result1.success ? 0 : result1.error.issues.length);
if (!result1.success) {
  console.log('Errors:');
  result1.error.issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.path.join('.')}: ${issue.message}`);
  });
}

console.log('\n=== Test 2: General consultation selected - should require primaryConcern ===');
const test2Data = {
  clientId: 'test-client',
  formTypes: ['general'],
  status: 'draft',
  consultationNotes: '',
  scriptGenerationPreferences: '',
  initialAssessment: '',
  recommendedTreatmentPlan: '',
  primaryConcern: 'short', // Too short - should trigger validation
  currentLifeStressors: [],
  supportSystem: '',
  workLifeBalance: undefined,
};

const result2 = consultationFormSchema.safeParse(test2Data);
console.log('Success:', result2.success);
console.log('Errors count:', result2.success ? 0 : result2.error.issues.length);
if (!result2.success) {
  console.log('Errors:');
  result2.error.issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.path.join('.')}: ${issue.message}`);
  });
}

console.log('\nTest completed!');
