import { z } from 'zod';
import { ConsultationFormTypeEnum, ConsultationStatusEnum, SymptomSeverityValues, TherapyPreferenceEnum, SleepQualityEnum, SelfHarmFrequencyEnum, RecentMoodStateEnum, SelfHarmThoughtsEnum, DailyStressFrequencyEnum, DesireToQuitEnum, ProblemFrequencyEnum } from '@/types/enums';

// Comprehensive consultation form schema with all fields required
export const consultationFormSchema = z.object({
  clientId: z.string().min(1, 'ID klien tidak boleh kosong'),
  formTypes: z.array(z.nativeEnum(ConsultationFormTypeEnum)).min(1, 'Pilih minimal satu jenis konsultasi'),
  status: z.nativeEnum(ConsultationStatusEnum),
  
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
  secondaryConcerns: z.array(z.string()).min(1, 'Pilih minimal satu keluhan tambahan'),
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
  frequentEmotions: z.array(z.string()).min(1, 'Pilih minimal satu emosi yang sering Anda alami'),
  
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
  initialRecommendation: z.array(z.string()).min(1, 'Buatkan minimal satu rekomendasi awal'),
  
  // Additional fields for comprehensive schema compatibility
  currentLifeStressors: z.array(z.string()).min(1, 'Pilih minimal satu stresor kehidupan saat ini'),
  supportSystem: z.string().min(1, 'Jelaskan sistem dukungan yang tersedia'),
  workLifeBalance: z.number().min(1, 'Beri penilaian keseimbangan kerja-hidup (1-10)'),
  
  // Drug addiction form fields - root level to match form usage
  substanceHistory: z.record(z.string(), z.boolean()).refine(
    (data) => Object.values(data).some(value => value === true),
    { message: 'Pilih minimal satu jenis zat yang pernah digunakan' }
  ),
  otherSubstancesDetails: z.string().min(1, 'Jelaskan zat lain yang pernah digunakan'),
  ageOfFirstUse: z.number().min(1, 'Masukkan usia pertama kali menggunakan').max(100, 'Usia maksimal 100'),
  frequencyOfUse: z.string().min(1, 'Jelaskan frekuensi penggunaan'),
  quantityPerUse: z.string().min(1, 'Jelaskan jumlah yang digunakan'),
  lastUseDate: z.string().min(1, 'Pilih tanggal terakhir menggunakan'),
  attemptsToQuit: z.number().min(0, 'Masukkan jumlah percobaan berhenti'),
  impactOnDailyLife: z.string().min(1, 'Jelaskan dampak pada kehidupan sehari-hari'),
  financialImpact: z.string().min(1, 'Jelaskan dampak finansial'),
  
  // Separate form data sections - conditionally required based on formTypes
  generalFormData: z.object({
    stressLevel: z.number().min(1, 'Beri penilaian tingkat stres (1-10)').max(10, 'Tingkat stres maksimal 10'),
    primaryStressors: z.array(z.string()).min(1, 'Pilih minimal satu stresor utama'),
    supportSystem: z.string().min(1, 'Jelaskan sistem dukungan yang tersedia'),
    dailyRoutine: z.string().min(1, 'Jelaskan rutinitas harian Anda'),
    exerciseHabits: z.string().min(1, 'Jelaskan kebiasaan olahraga Anda'),
    sleepPatterns: z.string().min(1, 'Jelaskan pola tidur Anda'),
    nutritionHabits: z.string().min(1, 'Jelaskan kebiasaan nutrisi Anda'),
    hobbiesInterests: z.array(z.string()).min(1, 'Pilih minimal satu hobi atau ketertarikan'),
    spiritualBeliefs: z.string().min(1, 'Jelaskan keyakinan spiritual Anda'),
    culturalFactors: z.string().min(1, 'Jelaskan faktor budaya yang mempengaruhi'),
    recentMoodState: z.enum(RecentMoodStateEnum, {
      message: 'Pilih kondisi mood terbaru Anda'
    }),
    recentMoodStateDetails: z.string().min(1, 'Jelaskan kondisi mood terbaru secara detail'),
    frequentEmotions: z.array(z.string()).min(1, 'Pilih minimal satu emosi yang sering dialami'),
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
    substanceTypes: z.array(z.string()).min(1, 'Pilih minimal satu jenis zat yang pernah digunakan'),
    firstUseAge: z.number().min(1, 'Masukkan usia pertama kali menggunakan').max(100, 'Usia maksimal 100'),
    usageFrequency: z.string().min(1, 'Jelaskan frekuensi penggunaan'),
    lastUseDate: z.string().min(1, 'Pilih tanggal terakhir menggunakan'),
    triggersRelapse: z.array(z.string()).min(1, 'Pilih minimal satu pemicu kambuh'),
    previousTreatments: z.array(z.string()).min(1, 'Pilih minimal satu perawatan sebelumnya'),
    withdrawalSymptoms: z.array(z.string()).min(1, 'Pilih minimal satu gejala withdrawal'),
    motivationToQuit: z.number().min(1, 'Beri penilaian motivasi berhenti (1-10)').max(10, 'Motivasi maksimal 10'),
    supportSystemAvailability: z.string().min(1, 'Jelaskan ketersediaan sistem dukungan'),
    legalIssues: z.boolean({
      message: 'Pilih apakah ada masalah hukum terkait penggunaan zat'
    }),
    occupationalImpact: z.string().min(1, 'Jelaskan dampak pada pekerjaan'),
    healthComplications: z.array(z.string()).min(1, 'Pilih minimal satu komplikasi kesehatan'),
    primarySubstance: z.string().min(1, 'Jelaskan zat utama yang digunakan'),
    quantityPerUse: z.string().min(1, 'Jelaskan jumlah per penggunaan'),
    attemptsToQuit: z.number().min(0, 'Masukkan jumlah percobaan berhenti'),
    currentSobrietyPeriod: z.string().min(1, 'Jelaskan periode sobriety saat ini'),
    financialImpact: z.string().min(1, 'Jelaskan dampak finansial'),
    desireToQuit: z.enum(DesireToQuitEnum, {
      message: 'Pilih keinginan untuk berhenti'
    }),
    recoveryGoals: z.array(z.string()).min(1, 'Pilih minimal satu tujuan pemulihan'),
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
    parentalConcerns: z.array(z.string()).min(1, 'Pilih minimal satu kekhawatiran orang tua'),
    previousProfessionalHelp: z.boolean({
      message: 'Pilih apakah pernah mendapat bantuan profesional sebelumnya'
    }),
    medicationsSupplements: z.array(z.string()).min(1, 'Pilih minimal satu obat/suplemen'),
    specialNeeds: z.array(z.string()).min(1, 'Pilih minimal satu kebutuhan khusus'),
    otherConsultationReason: z.string().min(1, 'Jelaskan alasan konsultasi lainnya'),
    problemOnset: z.string().min(1, 'Jelaskan kapan masalah muncul'),
    previousPsychologicalHelpDetails: z.string().min(1, 'Jelaskan detail bantuan psikologis sebelumnya'),
    currentGradeLevel: z.string().min(1, 'Masukkan tingkat kelas saat ini'),
    academicPerformance: z.number().min(1, 'Beri penilaian prestasi akademik (1-5)').max(5, 'Prestasi maksimal 5'),
    schoolBehaviorIssues: z.boolean({
      message: 'Pilih apakah ada masalah perilaku di sekolah'
    }),
    schoolBehaviorDetails: z.string().min(1, 'Jelaskan detail masalah perilaku di sekolah'),
    teacherConcerns: z.string().min(1, 'Jelaskan kekhawatiran guru'),
    bullyingHistory: z.boolean({
      message: 'Pilih apakah pernah mengalami bullying'
    }),
    familyStructure: z.string().min(1, 'Jelaskan struktur keluarga'),
    siblingRelationships: z.string().min(1, 'Jelaskan hubungan dengan saudara'),
    peerRelationships: z.string().min(1, 'Jelaskan hubungan dengan teman sebaya'),
    familyConflicts: z.boolean({
      message: 'Pilih apakah ada konflik dalam keluarga'
    }),
    socialDifficulties: z.boolean({
      message: 'Pilih apakah ada kesulitan dalam bersosialisasi'
    }),
    socialDifficultiesDetails: z.string().min(1, 'Jelaskan detail kesulitan sosial'),
    attentionConcerns: z.boolean({
      message: 'Pilih apakah ada masalah perhatian'
    }),
    attentionDetails: z.string().min(1, 'Jelaskan detail masalah perhatian'),
    behavioralConcerns: z.boolean({
      message: 'Pilih apakah ada masalah perilaku'
    }),
    behavioralDetails: z.string().min(1, 'Jelaskan detail masalah perilaku'),
  }).optional(),

  // Legacy fields for backward compatibility - all required
  substanceHistory: z.record(z.string(), z.boolean()).refine(
    (data) => Object.values(data).some(value => value === true),
    { message: 'Pilih minimal satu jenis zat yang pernah digunakan' }
  ),
  otherSubstancesDetails: z.string().min(1, 'Jelaskan detail zat lainnya'),
  primarySubstance: z.string().min(1, 'Jelaskan zat utama yang digunakan'),
  additionalSubstances: z.array(z.string()).min(1, 'Pilih minimal satu zat tambahan'),
  ageOfFirstUse: z.number().min(1, 'Masukkan usia pertama kali menggunakan'),
  frequencyOfUse: z.string().min(1, 'Jelaskan frekuensi penggunaan'),
  quantityPerUse: z.string().min(1, 'Jelaskan jumlah per penggunaan'),
  lastUseDate: z.string().min(1, 'Pilih tanggal terakhir menggunakan'),
  withdrawalSymptoms: z.array(z.string()).min(1, 'Pilih minimal satu gejala withdrawal'),
  toleranceLevel: z.number().min(1, 'Beri penilaian tingkat toleransi (1-10)'),
  impactOnDailyLife: z.string().min(1, 'Jelaskan dampak pada kehidupan sehari-hari'),
  attemptsToQuit: z.number().min(0, 'Masukkan jumlah percobaan berhenti'),
  socialCircleSubstanceUse: z.boolean({
    message: 'Pilih apakah lingkungan sosial juga menggunakan zat'
  }),
  triggerSituations: z.array(z.string()).min(1, 'Pilih minimal satu situasi pemicu'),
  environmentalFactors: z.array(z.string()).min(1, 'Pilih minimal satu faktor lingkungan'),
  previousTreatmentPrograms: z.boolean({
    message: 'Pilih apakah pernah mengikuti program perawatan'
  }),
  previousTreatmentDetails: z.string().min(1, 'Jelaskan detail perawatan sebelumnya'),
  currentSobrietyPeriod: z.string().min(1, 'Jelaskan periode sobriety saat ini'),
  legalIssuesRelated: z.boolean({
    message: 'Pilih apakah ada masalah hukum terkait'
  }),
  legalIssuesDetails: z.string().min(1, 'Jelaskan detail masalah hukum'),
  financialImpact: z.string().min(1, 'Jelaskan dampak finansial'),
  desireToQuit: z.string().min(1, 'Jelaskan keinginan untuk berhenti'),
  recoveryGoals: z.array(z.string()).min(1, 'Pilih minimal satu tujuan pemulihan'),
  
  // Minor consultation fields - all required
  guardianName: z.string().min(1, 'Masukkan nama lengkap wali'),
  guardianRelationship: z.string().min(1, 'Jelaskan hubungan dengan wali'),
  guardianPhone: z.string().min(1, 'Masukkan nomor telepon wali'),
  guardianOccupation: z.string().min(1, 'Masukkan pekerjaan wali'),
  parentalMaritalStatus: z.string().min(1, 'Pilih status perkawinan orang tua'),
  legalCustody: z.boolean({
    message: 'Pilih apakah wali memiliki hak asuh legal'
  }),
  guardianAddress: z.string().min(1, 'Masukkan alamat lengkap wali'),
  guardianSignatureName: z.string().min(1, 'Masukkan nama lengkap untuk tanda tangan wali'),
  guardianSignatureDate: z.string().min(1, 'Pilih tanggal tanda tangan wali'),
  clientCanSign: z.boolean({
    message: 'Pilih apakah klien dapat menandatangani sendiri'
  }),
  consultationReasons: z.record(z.string(), z.boolean()).refine(
    (data) => Object.values(data).some(value => value === true),
    { message: 'Pilih minimal satu alasan konsultasi' }
  ),
  otherConsultationReason: z.string().min(1, 'Jelaskan alasan konsultasi lainnya'),
  problemOnset: z.string().min(1, 'Jelaskan kapan masalah muncul'),
  previousPsychologicalHelpDetails: z.string().min(1, 'Jelaskan detail bantuan psikologis sebelumnya'),
  currentGradeLevel: z.string().min(1, 'Masukkan tingkat kelas saat ini'),
  academicPerformance: z.number().min(1, 'Beri penilaian prestasi akademik (1-5)').max(5, 'Prestasi maksimal 5'),
  schoolBehaviorDetails: z.string().min(1, 'Jelaskan detail masalah perilaku di sekolah'),
  teacherConcerns: z.string().min(1, 'Jelaskan kekhawatiran guru'),
  familyStructure: z.string().min(1, 'Jelaskan struktur keluarga'),
  siblingRelationships: z.string().min(1, 'Jelaskan hubungan dengan saudara'),
  peerRelationships: z.string().min(1, 'Jelaskan hubungan dengan teman sebaya'),
  socialDifficultiesDetails: z.string().min(1, 'Jelaskan detail kesulitan sosial'),
  attentionDetails: z.string().min(1, 'Jelaskan detail masalah perhatian'),
  behavioralDetails: z.string().min(1, 'Jelaskan detail masalah perilaku'),
  previousPsychologicalHelp: z.boolean({
    message: 'Pilih apakah pernah mendapat bantuan psikologis'
  }),
  schoolBehaviorIssues: z.boolean({
    message: 'Pilih apakah ada masalah perilaku di sekolah'
  }),
  bullyingHistory: z.boolean({
    message: 'Pilih apakah pernah mengalami bullying'
  }),
  bullyingDetails: z.string().min(1, 'Jelaskan detail riwayat bullying'),
  familyConflicts: z.boolean({
    message: 'Pilih apakah ada konflik dalam keluarga'
  }),
  familyConflictsDetails: z.string().min(1, 'Jelaskan detail konflik keluarga'),
  socialDifficulties: z.boolean({
    message: 'Pilih apakah ada kesulitan dalam bersosialisasi'
  }),
  developmentalMilestones: z.string().min(1, 'Jelaskan milestone perkembangan'),
  attentionConcerns: z.boolean({
    message: 'Pilih apakah ada masalah perhatian'
  }),
  behavioralConcerns: z.boolean({
    message: 'Pilih apakah ada masalah perilaku'
  }),
}).refine((data) => {
  // If General form type is selected, generalFormData must be provided
  if (data.formTypes.includes(ConsultationFormTypeEnum.General)) {
    if (!data.generalFormData) {
      return false;
    }
  }
  
  // If DrugAddiction form type is selected, drugAddictionFormData must be provided
  if (data.formTypes.includes(ConsultationFormTypeEnum.DrugAddiction)) {
    if (!data.drugAddictionFormData) {
      return false;
    }
  }
  
  // If Minor form type is selected, minorFormData must be provided
  if (data.formTypes.includes(ConsultationFormTypeEnum.Minor)) {
    if (!data.minorFormData) {
      return false;
    }
  }
  
  return true;
}, {
  message: 'Data form wajib diisi sesuai dengan jenis konsultasi yang dipilih',
  path: ['generalFormData', 'drugAddictionFormData', 'minorFormData'],
});

// Export the type
export type ConsultationFormSchemaType = z.infer<typeof consultationFormSchema>;
