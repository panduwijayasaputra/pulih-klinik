import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum, SymptomSeverityValues, TherapyPreferenceEnum, SleepQualityEnum, SelfHarmFrequencyEnum, RecentMoodStateEnum, SelfHarmThoughtsEnum, DailyStressFrequencyEnum, DesireToQuitEnum, ProblemFrequencyEnum, ToleranceLevelEnum, ConsultationReasonEnum, AcademicPerformanceEnum } from '@/types/enums';

// Base consultation schema - only basic fields required
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

  // Optional fields - only required when specific consultation types are selected
  previousTherapyExperience: z.boolean({
    message: 'Pilih apakah pernah mengalami terapi sebelumnya'
  }).optional(),
  previousTherapyDetails: z.string().optional(),
  currentMedications: z.boolean({
    message: 'Pilih apakah sedang mengonsumsi obat'
  }).optional(),
  currentMedicationsDetails: z.string().optional(),
  previousPsychologicalDiagnosis: z.boolean({
    message: 'Pilih apakah pernah mendapat diagnosis psikologi'
  }).optional(),
  previousPsychologicalDiagnosisDetails: z.string().optional(),
  significantPhysicalIllness: z.boolean({
    message: 'Pilih apakah memiliki riwayat penyakit fisik yang signifikan'
  }).optional(),
  significantPhysicalIllnessDetails: z.string().optional(),
  traumaticExperience: z.boolean({
    message: 'Pilih apakah pernah mengalami kejadian traumatis'
  }).optional(),
  traumaticExperienceDetails: z.string().optional(),
  familyPsychologicalHistory: z.boolean({
    message: 'Pilih apakah ada riwayat gangguan psikologis dalam keluarga'
  }).optional(),
  familyPsychologicalHistoryDetails: z.string().optional(),
  symptomSeverity: z.enum(SymptomSeverityValues, {
    message: 'Pilih tingkat keparahan gejala yang sesuai'
  }).optional(),
  symptomDuration: z.string().optional(),
  problemFrequency: z.enum(ProblemFrequencyEnum, {
    message: 'Pilih seberapa sering masalah terjadi'
  }).optional(),
  sleepQuality: z.enum(SleepQualityEnum, {
    message: 'Pilih kualitas tidur Anda'
  }).optional(),
  selfHarmFrequency: z.enum(SelfHarmFrequencyEnum, {
    message: 'Pilih frekuensi pikiran menyakiti diri'
  }).optional(),
  emotionScale: z.record(z.string(), z.number().min(0).max(10)).optional(),
  recentMoodState: z.enum(RecentMoodStateEnum, {
    message: 'Pilih kondisi mood Anda dalam sebulan terakhir'
  }).optional(),
  recentMoodStateDetails: z.string().optional(),
  frequentEmotions: z.array(z.string().min(1, 'Emosi tidak boleh kosong')).optional(),
  selfHarmThoughts: z.enum(SelfHarmThoughtsEnum, {
    message: 'Pilih frekuensi pikiran menyakiti diri'
  }).optional(),
  selfHarmDetails: z.string().optional(),
  dailyStressFrequency: z.enum(DailyStressFrequencyEnum, {
    message: 'Pilih seberapa sering Anda merasa stres'
  }).optional(),
  treatmentGoals: z.array(z.string().min(1, 'Tujuan terapi tidak boleh kosong')).optional(),
  clientExpectations: z.string().optional(),
  therapyPreference: z.enum(TherapyPreferenceEnum, {
    message: 'Pilih preferensi jenis terapi'
  }).optional(),
});

// General consultation schema - required when General form type is selected
const GeneralConsultationSchema = z.object({
  // Primary concern - required for General consultation
  primaryConcern: z.string().optional(),
  
  // Life circumstances
  currentLifeStressors: z.array(z.string().min(1, 'Stresor tidak boleh kosong')).min(1, 'Pilih minimal satu stresor kehidupan saat ini').optional(),
  supportSystem: z.string().min(1, 'Jelaskan sistem dukungan yang tersedia').optional(),
  workLifeBalance: z.number().min(1, 'Beri penilaian keseimbangan kerja-hidup (1-10)').max(10, 'Penilaian maksimal 10').optional(),
  
  // Lifestyle factors
  stressLevel: z.number().min(1, 'Beri penilaian tingkat stres (1-10)').max(10, 'Tingkat stres maksimal 10').optional(),
  primaryStressors: z.array(z.string().min(1, 'Stresor tidak boleh kosong')).min(1, 'Pilih minimal satu stresor utama').optional(),
  dailyRoutine: z.string().min(1, 'Jelaskan rutinitas harian Anda').optional(),
  exerciseHabits: z.string().min(1, 'Jelaskan kebiasaan olahraga Anda').optional(),
  nutritionHabits: z.string().min(1, 'Jelaskan kebiasaan nutrisi Anda').optional(),
  hobbiesInterests: z.array(z.string().min(1, 'Hobi tidak boleh kosong')).min(1, 'Pilih minimal satu hobi atau ketertarikan').optional(),
  spiritualBeliefs: z.string().min(1, 'Jelaskan keyakinan spiritual Anda').optional(),
  culturalFactors: z.string().min(1, 'Jelaskan faktor budaya yang mempengaruhi').optional(),
  sleepPatterns: z.string().min(1, 'Jelaskan pola tidur Anda').optional(),
});

// Drug addiction consultation schema - required when DrugAddiction form type is selected
const DrugAddictionConsultationSchema = z.object({
  // Substance use history
  substanceHistory: z.array(z.string().min(1, 'Jenis zat tidak boleh kosong')).min(1, 'Pilih minimal satu jenis zat yang pernah digunakan').optional(),
  otherSubstancesDetails: z.string().min(1, 'Jelaskan zat lain yang pernah digunakan').optional(),
  primarySubstance: z.string().min(1, 'Jelaskan zat utama yang digunakan').optional(),
  ageOfFirstUse: z.number().min(5, 'Usia pertama kali menggunakan minimal 5').max(100, 'Usia maksimal 100').optional(),
  frequencyOfUse: z.string().min(1, 'Jelaskan frekuensi penggunaan').optional(),
  quantityPerUse: z.string().min(1, 'Jelaskan jumlah yang digunakan').optional(),
  lastUseDate: z.string().min(1, 'Pilih tanggal terakhir menggunakan').optional(),
  
  // Addiction severity
  withdrawalSymptoms: z.string().min(1, 'Jelaskan gejala withdrawal yang dialami').optional(),
  toleranceLevel: z.nativeEnum(ToleranceLevelEnum, {
    message: 'Pilih tingkat toleransi yang sesuai'
  }).optional(),
  impactOnDailyLife: z.string().min(1, 'Jelaskan dampak pada kehidupan sehari-hari').optional(),
  attemptsToQuit: z.number().min(0, 'Jumlah percobaan berhenti tidak boleh negatif').max(50, 'Jumlah percobaan berhenti tidak realistis').optional(),
  
  // Social and environmental factors
  socialCircleSubstanceUse: z.boolean({
    message: 'Pilih apakah lingkungan sosial juga menggunakan zat'
  }).optional(),
  triggerSituations: z.string().min(1, 'Situasi pemicu tidak boleh kosong').optional(),
  environmentalFactors: z.array(z.string().min(1, 'Faktor lingkungan tidak boleh kosong')).min(1, 'Pilih minimal satu faktor lingkungan').optional(),
  
  // Recovery history
  previousTreatmentPrograms: z.boolean({
    message: 'Pilih apakah pernah mengikuti program perawatan'
  }).optional(),
  previousTreatmentDetails: z.string().min(1, 'Jelaskan detail program perawatan sebelumnya').optional(),
  currentSobrietyPeriod: z.string().min(1, 'Jelaskan periode sobriety saat ini').optional(),
  
  // Legal and financial impact
  legalIssuesRelated: z.boolean({
    message: 'Pilih apakah ada masalah hukum terkait'
  }).optional(),
  legalIssuesDetails: z.string().min(1, 'Jelaskan detail masalah hukum').optional(),
  financialImpact: z.string().min(1, 'Jelaskan dampak finansial').optional(),
  desireToQuit: z.string().min(1, 'Jelaskan keinginan untuk berhenti').optional(),
  recoveryGoals: z.string().min(1, 'Tujuan pemulihan tidak boleh kosong').optional(),
});

// Minor consultation schema - required when Minor form type is selected
const MinorConsultationSchema = z.object({
  // Guardian information
  guardianName: z.string().min(1, 'Masukkan nama lengkap wali').optional(),
  guardianRelationship: z.string().min(1, 'Jelaskan hubungan dengan wali').optional(),
  guardianPhone: z.string().min(1, 'Masukkan nomor telepon wali').optional(),
  guardianOccupation: z.string().min(1, 'Masukkan pekerjaan wali').optional(),
  parentalMaritalStatus: z.string().min(1, 'Pilih status perkawinan orang tua').optional(),
  legalCustody: z.boolean({
    message: 'Pilih apakah wali memiliki hak asuh legal'
  }).optional(),
  guardianAddress: z.string().min(1, 'Masukkan alamat lengkap wali').optional(),
  guardianSignatureName: z.string().min(1, 'Masukkan nama lengkap untuk tanda tangan wali').optional(),
  guardianSignatureDate: z.string().min(1, 'Pilih tanggal tanda tangan wali').optional(),
  clientCanSign: z.boolean({
    message: 'Pilih apakah klien dapat menandatangani sendiri'
  }).optional(),
  
  // School and academic information
  currentGradeLevel: z.string().min(1, 'Masukkan tingkat kelas saat ini').optional(),
  academicPerformance: z.nativeEnum(AcademicPerformanceEnum, {
    message: 'Pilih tingkat prestasi akademik yang sesuai'
  }).optional(),
  schoolBehaviorIssues: z.boolean({
    message: 'Pilih apakah ada masalah perilaku di sekolah'
  }).optional(),
  schoolBehaviorDetails: z.string().min(1, 'Jelaskan detail masalah perilaku di sekolah').optional(),
  teacherConcerns: z.string().min(1, 'Jelaskan kekhawatiran guru').optional(),
  
  // Family dynamics
  familyStructure: z.string().min(1, 'Jelaskan struktur keluarga').optional(),
  siblingRelationships: z.string().min(1, 'Jelaskan hubungan dengan saudara').optional(),
  peerRelationships: z.string().min(1, 'Jelaskan hubungan dengan teman sebaya').optional(),
  familyConflicts: z.boolean({
    message: 'Pilih apakah ada konflik dalam keluarga'
  }).optional(),
  familyConflictsDetails: z.string().min(1, 'Jelaskan detail konflik keluarga').optional(),
  
  // Social and peer relationships
  socialDifficulties: z.boolean({
    message: 'Pilih apakah ada kesulitan dalam bersosialisasi'
  }).optional(),
  socialDifficultiesDetails: z.string().min(1, 'Jelaskan detail kesulitan sosial').optional(),
  bullyingHistory: z.boolean({
    message: 'Pilih apakah pernah mengalami bullying'
  }).optional(),
  bullyingDetails: z.string().min(1, 'Jelaskan detail riwayat bullying').optional(),
  
  // Developmental considerations
  developmentalMilestones: z.string().min(1, 'Jelaskan milestone perkembangan').optional(),
  attentionConcerns: z.boolean({
    message: 'Pilih apakah ada masalah perhatian'
  }).optional(),
  attentionDetails: z.string().min(1, 'Jelaskan detail masalah perhatian').optional(),
  behavioralConcerns: z.boolean({
    message: 'Pilih apakah ada masalah perilaku'
  }).optional(),
  behavioralDetails: z.string().min(1, 'Jelaskan detail masalah perilaku').optional(),
  
  // Consultation reasons
  consultationReasons: z.array(z.nativeEnum(ConsultationReasonEnum))
    .min(1, 'Pilih minimal satu alasan konsultasi').optional(),
  otherConsultationReason: z.string().min(1, 'Jelaskan alasan konsultasi lainnya').optional(),
  problemOnset: z.string().min(1, 'Jelaskan kapan masalah muncul').optional(),
  previousPsychologicalHelp: z.boolean({
    message: 'Pilih apakah pernah mendapat bantuan psikologis'
  }).optional(),
  previousPsychologicalHelpDetails: z.string().min(1, 'Jelaskan detail bantuan psikologis sebelumnya').optional(),
});
// Combine all schemas - make conditional schemas truly optional
export const consultationFormSchema = BaseConsultationSchema
  .merge(GeneralConsultationSchema)
  .merge(DrugAddictionConsultationSchema)
  .merge(MinorConsultationSchema)
  .superRefine((data, ctx) => {
    // Validate detail fields when their corresponding boolean fields are true
    if (data.previousTherapyExperience && (!data.previousTherapyDetails || data.previousTherapyDetails.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jelaskan detail pengalaman terapi sebelumnya',
        path: ['previousTherapyDetails'],
      });
    }

    if (data.currentMedications && (!data.currentMedicationsDetails || data.currentMedicationsDetails.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sebutkan obat yang sedang dikonsumsi',
        path: ['currentMedicationsDetails'],
      });
    }

    if (data.previousPsychologicalDiagnosis && (!data.previousPsychologicalDiagnosisDetails || data.previousPsychologicalDiagnosisDetails.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jelaskan diagnosis psikologi yang pernah diterima',
        path: ['previousPsychologicalDiagnosisDetails'],
      });
    }

    if (data.significantPhysicalIllness && (!data.significantPhysicalIllnessDetails || data.significantPhysicalIllnessDetails.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jelaskan riwayat penyakit fisik yang signifikan',
        path: ['significantPhysicalIllnessDetails'],
      });
    }

    if (data.traumaticExperience && (!data.traumaticExperienceDetails || data.traumaticExperienceDetails.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jelaskan kejadian traumatis yang pernah dialami',
        path: ['traumaticExperienceDetails'],
      });
    }

    if (data.familyPsychologicalHistory && (!data.familyPsychologicalHistoryDetails || data.familyPsychologicalHistoryDetails.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jelaskan riwayat gangguan psikologis dalam keluarga',
        path: ['familyPsychologicalHistoryDetails'],
      });
    }

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
    if (data.formTypes.includes(ConsultationFormTypeEnum.General)) {
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
      if (!data.stressLevel || data.stressLevel < 1 || data.stressLevel > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Beri penilaian tingkat stres (1-10)',
          path: ['stressLevel'],
        });
      }
      if (!data.primaryStressors || data.primaryStressors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih minimal satu stresor utama',
          path: ['primaryStressors'],
        });
      }
      if (!data.dailyRoutine || data.dailyRoutine.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan rutinitas harian Anda',
          path: ['dailyRoutine'],
        });
      }
      if (!data.exerciseHabits || data.exerciseHabits.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan kebiasaan olahraga Anda',
          path: ['exerciseHabits'],
        });
      }
      if (!data.nutritionHabits || data.nutritionHabits.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan kebiasaan nutrisi Anda',
          path: ['nutritionHabits'],
        });
      }
      if (!data.hobbiesInterests || data.hobbiesInterests.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pilih minimal satu hobi atau ketertarikan',
          path: ['hobbiesInterests'],
        });
      }
      if (!data.spiritualBeliefs || data.spiritualBeliefs.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan keyakinan spiritual Anda',
          path: ['spiritualBeliefs'],
        });
      }
      if (!data.culturalFactors || data.culturalFactors.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan faktor budaya yang mempengaruhi',
          path: ['culturalFactors'],
        });
      }
      if (!data.sleepPatterns || data.sleepPatterns.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Jelaskan pola tidur Anda',
          path: ['sleepPatterns'],
        });
      }
    }

    // If DrugAddiction form type is selected, validate drug addiction fields
    if (data.formTypes.includes(ConsultationFormTypeEnum.DrugAddiction)) {
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
    if (data.formTypes.includes(ConsultationFormTypeEnum.Minor)) {
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

// Export the type
export type ConsultationFormSchemaType = z.infer<typeof consultationFormSchema>;