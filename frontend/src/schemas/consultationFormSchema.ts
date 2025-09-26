import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum, SymptomSeverityValues, TherapyPreferenceEnum, SleepQualityEnum, SelfHarmFrequencyEnum, RecentMoodStateEnum, SelfHarmThoughtsEnum, DailyStressFrequencyEnum, DesireToQuitEnum, ProblemFrequencyEnum } from '@/types/enums';

// Comprehensive consultation form schema with all fields required
export const consultationFormSchema = z.object({
  clientId: z.string().min(1, 'ID klien tidak boleh kosong'),
  formTypes: z.array(z.nativeEnum(ConsultationFormTypeEnum)).min(1, 'Pilih minimal satu jenis konsultasi'),
  status: z.nativeEnum(ConsultationStatusEnum, {
    message: 'Pilih status konsultasi yang sesuai'
  }),
  
  // Session information
  sessionDate: z.string().min(1, 'Pilih tanggal sesi konsultasi'),
  sessionDuration: z.number()
    .min(15, 'Durasi sesi minimal 15 menit')
    .max(180, 'Durasi sesi maksimal 180 menit'),
  consultationNotes: z.string().min(1, 'Tuliskan catatan konsultasi'),
  scriptGenerationPreferences: z.string().min(1, 'Jelaskan preferensi untuk generasi script'),
  
  // Client background information
  previousTherapyExperience: z.boolean({
    message: 'Pilih apakah pernah mengalami terapi sebelumnya'
  }),
  previousTherapyDetails: z.string().min(1, 'Jelaskan detail pengalaman terapi sebelumnya'),
  currentMedications: z.boolean({
    message: 'Pilih apakah sedang mengonsumsi obat'
  }),
  currentMedicationsDetails: z.string().min(1, 'Sebutkan obat yang sedang dikonsumsi'),
  
  // Additional psychological history
  previousPsychologicalDiagnosis: z.boolean({
    message: 'Pilih apakah pernah mendapat diagnosis psikologi'
  }),
  previousPsychologicalDiagnosisDetails: z.string().min(1, 'Jelaskan diagnosis psikologi yang pernah diterima'),
  significantPhysicalIllness: z.boolean({
    message: 'Pilih apakah memiliki riwayat penyakit fisik yang signifikan'
  }),
  significantPhysicalIllnessDetails: z.string().min(1, 'Jelaskan riwayat penyakit fisik yang signifikan'),
  traumaticExperience: z.boolean({
    message: 'Pilih apakah pernah mengalami kejadian traumatis'
  }),
  traumaticExperienceDetails: z.string().min(1, 'Jelaskan kejadian traumatis yang pernah dialami'),
  familyPsychologicalHistory: z.boolean({
    message: 'Pilih apakah ada riwayat gangguan psikologis dalam keluarga'
  }),
  familyPsychologicalHistoryDetails: z.string().min(1, 'Jelaskan riwayat gangguan psikologis dalam keluarga'),
  
  // Presenting concerns
  primaryConcern: z.string().min(10, 'Jelaskan keluhan utama minimal 10 karakter'),
  secondaryConcerns: z.array(z.string().min(1, 'Keluhan tidak boleh kosong')).min(1, 'Pilih minimal satu keluhan tambahan'),
  symptomSeverity: z.enum(SymptomSeverityValues, {
    message: 'Pilih tingkat keparahan gejala yang sesuai'
  }),
  symptomDuration: z.string().min(1, 'Pilih berapa lama gejala berlangsung'),
  problemFrequency: z.enum(ProblemFrequencyEnum, {
    message: 'Pilih seberapa sering masalah terjadi'
  }),
  sleepQuality: z.enum(SleepQualityEnum, {
    message: 'Pilih kualitas tidur Anda'
  }),
  selfHarmFrequency: z.enum(SelfHarmFrequencyEnum, {
    message: 'Pilih frekuensi pikiran menyakiti diri'
  }),
  
  // Emotion scale
  emotionScale: z.record(z.string(), z.number().min(0).max(10)).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Beri penilaian untuk minimal satu emosi' }
  ),
  
  // Recent mood and emotions
  recentMoodState: z.enum(RecentMoodStateEnum, {
    message: 'Pilih kondisi mood Anda dalam sebulan terakhir'
  }),
  recentMoodStateDetails: z.string().min(1, 'Jelaskan kondisi mood Anda secara detail'),
  frequentEmotions: z.array(z.string().min(1, 'Emosi tidak boleh kosong')).min(1, 'Pilih minimal satu emosi yang sering Anda alami'),
  
  // Self-harm and stress assessment
  selfHarmThoughts: z.enum(SelfHarmThoughtsEnum, {
    message: 'Pilih frekuensi pikiran menyakiti diri'
  }),
  selfHarmDetails: z.string().min(1, 'Jelaskan detail tentang pikiran menyakiti diri'),
  dailyStressFrequency: z.enum(DailyStressFrequencyEnum, {
    message: 'Pilih seberapa sering Anda merasa stres'
  }),
  
  // Goals and expectations
  treatmentGoals: z.array(z.string().min(1, 'Tujuan terapi tidak boleh kosong'))
    .min(1, 'Pilih minimal satu tujuan terapi'),
  clientExpectations: z.string().min(1, 'Jelaskan harapan Anda dari terapi ini'),
  therapyPreference: z.enum(TherapyPreferenceEnum, {
    message: 'Pilih preferensi jenis terapi'
  }),
  
  // Assessment results
  initialAssessment: z.string().min(1, 'Tuliskan penilaian awal kondisi klien'),
  recommendedTreatmentPlan: z.string().min(1, 'Buatkan rencana terapi yang direkomendasikan'),
  
  // Consent and signature
  consentAgreement: z.boolean().refine(val => val === true, {
    message: 'Centang persetujuan untuk melanjutkan'
  }),
  clientSignatureName: z.string().min(1, 'Tuliskan nama lengkap untuk tanda tangan'),
  clientSignatureDate: z.string().min(1, 'Pilih tanggal tanda tangan'),
  therapistName: z.string().min(1, 'Masukkan nama terapis yang menangani'),
  registrationDate: z.string().min(1, 'Pilih tanggal registrasi'),
  initialRecommendation: z.array(z.string().min(1, 'Rekomendasi tidak boleh kosong')).min(1, 'Buatkan minimal satu rekomendasi awal'),
  
  // Additional fields for comprehensive schema compatibility
  currentLifeStressors: z.array(z.string().min(1, 'Stresor tidak boleh kosong')).min(1, 'Pilih minimal satu stresor kehidupan saat ini').optional(),
  supportSystem: z.string().min(1, 'Jelaskan sistem dukungan yang tersedia').optional(),
  workLifeBalance: z.coerce.number()
    .min(1, 'Beri penilaian keseimbangan kerja-hidup (1-10)')
    .max(10, 'Penilaian maksimal 10')
    .optional(),
  
  // General form fields at root level for form compatibility
  stressLevel: z.coerce.number()
    .min(1, 'Beri penilaian tingkat stres (1-10)')
    .max(10, 'Tingkat stres maksimal 10')
    .optional(),
  primaryStressors: z.array(z.string().min(1, 'Stresor tidak boleh kosong')).min(1, 'Pilih minimal satu stresor utama').optional(),
  dailyRoutine: z.string().min(1, 'Jelaskan rutinitas harian Anda').optional(),
  exerciseHabits: z.string().min(1, 'Jelaskan kebiasaan olahraga Anda').optional(),
  nutritionHabits: z.string().min(1, 'Jelaskan kebiasaan nutrisi Anda').optional(),
  hobbiesInterests: z.array(z.string().min(1, 'Hobi tidak boleh kosong')).min(1, 'Pilih minimal satu hobi atau ketertarikan').optional(),
  spiritualBeliefs: z.string().min(1, 'Jelaskan keyakinan spiritual Anda').optional(),
  culturalFactors: z.string().min(1, 'Jelaskan faktor budaya yang mempengaruhi').optional(),
  
  // Drug addiction form fields - root level (used directly in form) - optional at root level, validated conditionally
  lastUseDate: z.string().min(1, 'Pilih tanggal terakhir menggunakan').optional(),
  impactOnDailyLife: z.string().min(1, 'Jelaskan dampak pada kehidupan sehari-hari').optional(),
  financialImpact: z.string().min(1, 'Jelaskan dampak finansial').optional(),
  previousTreatmentPrograms: z.boolean({
    message: 'Pilih apakah pernah mengikuti program perawatan'
  }).optional(),
  previousTreatmentDetails: z.string().min(1, 'Jelaskan detail program perawatan sebelumnya').optional(),
  legalIssuesRelated: z.boolean({
    message: 'Pilih apakah ada masalah hukum terkait'
  }).optional(),
  legalIssuesDetails: z.string().min(1, 'Jelaskan detail masalah hukum').optional(),
  currentSobrietyPeriod: z.string().min(1, 'Jelaskan periode sobriety saat ini').optional(),
  desireToQuit: z.string().min(1, 'Jelaskan keinginan untuk berhenti').optional(),
  recoveryGoals: z.string().min(1, 'Jelaskan dampak finansial').optional(),
  withdrawalSymptoms: z.string().min(1, 'Tujuan pemulihan tidak boleh kosong').optional(),
  triggerSituations: z.string().min(1, 'Situasi pemicu tidak boleh kosong').optional(),
  
  // Additional drug addiction fields at root level - with proper validation - optional at root level, validated conditionally
  substanceHistory: z.array(z.string().min(1, 'Jenis zat tidak boleh kosong')).min(1, 'Pilih minimal satu jenis zat yang pernah digunakan').optional(),
  otherSubstancesDetails: z.string().min(1, 'Jelaskan zat lain yang pernah digunakan').optional(),
  primarySubstance: z.string().min(1, 'Jelaskan zat utama yang digunakan').optional(),
  ageOfFirstUse: z.coerce.number()
    .min(5, 'Usia pertama kali menggunakan tidak valid')
    .max(100, 'Usia pertama kali menggunakan tidak valid')
    .optional(),
  frequencyOfUse: z.string().min(1, 'Jelaskan frekuensi penggunaan').optional(),
  quantityPerUse: z.string().min(1, 'Jelaskan jumlah yang digunakan').optional(),
  attemptsToQuit: z.coerce.number()
    .min(0, 'Jumlah percobaan berhenti tidak boleh negatif')
    .max(50, 'Jumlah percobaan berhenti tidak realistis')
    .optional(),
  toleranceLevel: z.union([
    z.number()
      .min(1, 'Tingkat toleransi minimal 1')
      .max(5, 'Tingkat toleransi maksimal 5') as z.ZodType<1 | 2 | 3 | 4 | 5>,
  ]).optional(),
  
  otherConsultationReason: z.string().min(1, 'Jelaskan alasan konsultasi lainnya').optional(),
  problemOnset: z.string().min(1, 'Jelaskan kapan masalah muncul').optional(),
  previousPsychologicalHelpDetails: z.string().min(1, 'Jelaskan detail bantuan psikologis sebelumnya').optional(),
  currentGradeLevel: z.string().min(1, 'Masukkan tingkat kelas saat ini').optional(),
  schoolBehaviorDetails: z.string().min(1, 'Jelaskan detail masalah perilaku di sekolah').optional(),
  teacherConcerns: z.string().min(1, 'Jelaskan kekhawatiran guru').optional(),
  familyStructure: z.string().min(1, 'Jelaskan struktur keluarga').optional(),
  siblingRelationships: z.string().min(1, 'Jelaskan hubungan dengan saudara').optional(),
  peerRelationships: z.string().min(1, 'Jelaskan hubungan dengan teman sebaya').optional(),
  socialDifficultiesDetails: z.string().min(1, 'Jelaskan detail kesulitan sosial').optional(),
  developmentalMilestones: z.string().min(1, 'Jelaskan milestone perkembangan').optional(),
  attentionDetails: z.string().min(1, 'Jelaskan detail masalah perhatian').optional(),
  behavioralDetails: z.string().min(1, 'Jelaskan detail masalah perilaku').optional(),
  
  // Separate form data sections - conditionally required based on formTypes
  generalFormData: z.object({
    stressLevel: z.number().min(1, 'Beri penilaian tingkat stres (1-10)').max(10, 'Tingkat stres maksimal 10'),
    primaryStressors: z.array(z.string().min(1, 'Stresor tidak boleh kosong')).min(1, 'Pilih minimal satu stresor utama'),
    supportSystem: z.string().min(1, 'Jelaskan sistem dukungan yang tersedia'),
    dailyRoutine: z.string().min(1, 'Jelaskan rutinitas harian Anda'),
    exerciseHabits: z.string().min(1, 'Jelaskan kebiasaan olahraga Anda'),
    sleepPatterns: z.string().min(1, 'Jelaskan pola tidur Anda'),
    nutritionHabits: z.string().min(1, 'Jelaskan kebiasaan nutrisi Anda'),
    hobbiesInterests: z.array(z.string().min(1, 'Hobi tidak boleh kosong')).min(1, 'Pilih minimal satu hobi atau ketertarikan'),
    spiritualBeliefs: z.string().min(1, 'Jelaskan keyakinan spiritual Anda'),
    culturalFactors: z.string().min(1, 'Jelaskan faktor budaya yang mempengaruhi'),
    recentMoodState: z.enum(RecentMoodStateEnum, {
      message: 'Pilih kondisi mood terbaru Anda'
    }),
    recentMoodStateDetails: z.string().min(1, 'Jelaskan kondisi mood terbaru secara detail'),
    frequentEmotions: z.array(z.string().min(1, 'Emosi tidak boleh kosong')).min(1, 'Pilih minimal satu emosi yang sering dialami'),
    selfHarmThoughts: z.enum(SelfHarmThoughtsEnum, {
      message: 'Pilih frekuensi pikiran menyakiti diri'
    }),
    selfHarmDetails: z.string().min(1, 'Jelaskan detail tentang pikiran menyakiti diri'),
    dailyStressFrequency: z.enum(DailyStressFrequencyEnum, {
      message: 'Pilih frekuensi stres harian'
    }),
    emotionScale: z.record(z.string(), z.number().min(0).max(10)).refine(
      (data) => Object.keys(data).length > 0,
      { message: 'Beri penilaian untuk minimal satu emosi' }
    ),
  }).optional(),

  drugAddictionFormData: z.object({
    firstUseAge: z.number().min(1, 'Masukkan usia pertama kali menggunakan').max(100, 'Usia maksimal 100'),
    usageFrequency: z.string().min(1, 'Jelaskan frekuensi penggunaan'),
    lastUseDate: z.string().min(1, 'Pilih tanggal terakhir menggunakan'),
    triggersRelapse: z.union([
      z.string().min(1, 'Situasi pemicu tidak boleh kosong'),
      z.literal(''),
      z.undefined()
    ]).optional(),
    previousTreatments: z.array(z.string().min(1, 'Perawatan tidak boleh kosong')).min(1, 'Pilih minimal satu perawatan sebelumnya'),
    withdrawalSymptoms: z.string().min(1, 'Jelaskan gejala withdrawal yang dialami'),
    motivationToQuit: z.number().min(1, 'Beri penilaian motivasi berhenti (1-10)').max(10, 'Motivasi maksimal 10'),
    supportSystemAvailability: z.string().min(1, 'Jelaskan ketersediaan sistem dukungan'),
    legalIssues: z.boolean({
      message: 'Pilih apakah ada masalah hukum terkait penggunaan zat'
    }),
    occupationalImpact: z.string().min(1, 'Jelaskan dampak pada pekerjaan'),
    healthComplications: z.array(z.string().min(1, 'Komplikasi tidak boleh kosong')).min(1, 'Pilih minimal satu komplikasi kesehatan'),
    // Fields used in nested structure by the form
    socialCircleSubstanceUse: z.boolean({
      message: 'Pilih apakah lingkungan sosial juga menggunakan zat'
    }),
    environmentalFactors: z.array(z.string().min(1, 'Faktor lingkungan tidak boleh kosong')).min(1, 'Pilih minimal satu faktor lingkungan'),
  }).optional(),

  minorFormData: z.object({
    guardianName: z.string().min(1, 'Masukkan nama lengkap wali'),
    guardianRelationship: z.string().min(1, 'Jelaskan hubungan dengan wali'),
    guardianPhone: z.string().min(1, 'Masukkan nomor telepon wali'),
    schoolName: z.string().min(1, 'Masukkan nama sekolah'),
    grade: z.string().min(1, 'Masukkan kelas saat ini'),
    schoolPerformance: z.string().min(1, 'Jelaskan prestasi sekolah'),
    behaviorAtSchool: z.string().min(1, 'Jelaskan perilaku di sekolah'),
    behaviorAtHome: z.string().min(1, 'Jelaskan perilaku di rumah'),
    friendsRelationships: z.string().min(1, 'Jelaskan hubungan dengan teman'),
    developmentalMilestones: z.string().min(1, 'Jelaskan milestone perkembangan'),
    familyDynamics: z.string().min(1, 'Jelaskan dinamika keluarga'),
    parentalConcerns: z.array(z.string().min(1, 'Kekhawatiran tidak boleh kosong')).min(1, 'Pilih minimal satu kekhawatiran orang tua'),
    previousProfessionalHelp: z.boolean({
      message: 'Pilih apakah pernah mendapat bantuan profesional sebelumnya'
    }),
    medicationsSupplements: z.array(z.string().min(1, 'Obat/suplemen tidak boleh kosong')).min(1, 'Pilih minimal satu obat/suplemen'),
    specialNeeds: z.array(z.string().min(1, 'Kebutuhan khusus tidak boleh kosong')).min(1, 'Pilih minimal satu kebutuhan khusus'),
    // Removed duplicate fields - these are now defined at root level
  }).optional(),

  // Additional drug addiction fields - moved to nested structure
  
  // Additional minor consultation fields
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
  }),
  consultationReasons: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(value => value === true),
      { message: 'Pilih minimal satu alasan konsultasi' }
    )
    .optional()
    .or(z.record(z.string(), z.boolean()))
    .or(z.undefined()),
  academicPerformance: z.union([
    z.number().min(1, 'Beri penilaian prestasi akademik (1-5)').max(5, 'Prestasi maksimal 5'),
    z.literal(''),
    z.undefined()
  ]).optional(),
  previousPsychologicalHelp: z.boolean({
    message: 'Pilih apakah pernah mendapat bantuan psikologis'
  }).optional(),
  schoolBehaviorIssues: z.boolean({
    message: 'Pilih apakah ada masalah perilaku di sekolah'
  }).optional(),
  bullyingHistory: z.boolean({
    message: 'Pilih apakah pernah mengalami bullying'
  }).optional(),
  bullyingDetails: z.string().min(1, 'Jelaskan detail riwayat bullying').optional(),
  familyConflicts: z.boolean({
    message: 'Pilih apakah ada konflik dalam keluarga'
  }).optional(),
  familyConflictsDetails: z.string().min(1, 'Jelaskan detail konflik keluarga').optional(),
  socialDifficulties: z.boolean({
    message: 'Pilih apakah ada kesulitan dalam bersosialisasi'
  }).optional(),
  attentionConcerns: z.boolean({
    message: 'Pilih apakah ada masalah perhatian'
  }).optional(),
  behavioralConcerns: z.boolean({
    message: 'Pilih apakah ada masalah perilaku'
  }).optional(),
}).superRefine((data, ctx) => {
  // If General form type is selected, generalFormData must be provided
  if (data.formTypes.includes(ConsultationFormTypeEnum.General)) {
    if (!data.generalFormData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data form umum wajib diisi',
        path: ['generalFormData'],
      });
    }
  }
  
  // If DrugAddiction form type is selected, validate all drug addiction fields
  if (data.formTypes.includes(ConsultationFormTypeEnum.DrugAddiction)) {
    if (!data.drugAddictionFormData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data form ketergantungan zat wajib diisi',
        path: ['drugAddictionFormData'],
      });
    }
    
    // Validate required drug addiction fields when DrugAddiction form type is selected
    if (!data.ageOfFirstUse || data.ageOfFirstUse === 0 || isNaN(data.ageOfFirstUse)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Usia pertama kali menggunakan wajib diisi',
        path: ['ageOfFirstUse'],
      });
    }
    
    if (!data.attemptsToQuit || data.attemptsToQuit === 0 || isNaN(data.attemptsToQuit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jumlah percobaan berhenti wajib diisi',
        path: ['attemptsToQuit'],
      });
    }
    
    if (!data.toleranceLevel || data.toleranceLevel === undefined || (typeof data.toleranceLevel === 'string' && data.toleranceLevel === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tingkat toleransi wajib diisi',
        path: ['toleranceLevel'],
      });
    }
    
    if (!data.triggerSituations || data.triggerSituations.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Situasi pemicu wajib diisi',
        path: ['triggerSituations'],
      });
    }
    
    if (!data.recoveryGoals || data.recoveryGoals.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tujuan pemulihan wajib diisi',
        path: ['recoveryGoals'],
      });
    }
  }
  
  // If Minor form type is selected, minorFormData must be provided
  if (data.formTypes.includes(ConsultationFormTypeEnum.Minor)) {
    if (!data.minorFormData) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data form anak dan remaja wajib diisi',
        path: ['minorFormData'],
      });
    }
  }
});

// Export the type
export type ConsultationFormSchemaType = z.infer<typeof consultationFormSchema>;