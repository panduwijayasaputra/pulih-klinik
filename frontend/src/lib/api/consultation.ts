import { 
  Consultation,
  ConsultationFormTypeEnum, 
  ConsultationListResponse,
  ConsultationResponse,
  ConsultationStatusEnum,
  CreateConsultationData,
  DrugAddictionConsultation,
  GeneralConsultation,
  MinorConsultation,
  UpdateConsultationData
} from '@/types/consultation';
import { ConsultationSummaryData } from '@/types/therapy';
import { getAIPredictionsForConsultation } from './mockAIPredictions';
import { getClientById, getTherapistName } from './mockData';

// Simulated latency helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = () => `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// In-memory consultation storage (mock database)
const consultationStorage: Map<string, Consultation> = new Map();

// Mock consultation data
const createMockConsultations = (): Consultation[] => {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  return [
    // General consultation - Completed
    {
      id: 'consultation-001',
      clientId: 'CLT001',
      therapistId: 'therapist-001',
      formType: ConsultationFormTypeEnum.General,
      status: ConsultationStatusEnum.Completed,
      createdAt: lastWeek,
      updatedAt: yesterday,
      sessionDate: lastWeek,
      sessionDuration: 90,
      consultationNotes: 'Konsultasi umum untuk mengatasi kecemasan dan stress kerja. Klien menunjukkan respons positif terhadap terapi kognitif.',
      
      // Client background
      previousTherapyExperience: false,
      currentMedications: true,
      currentMedicationsDetails: 'Alprazolam 0.5mg per hari untuk kecemasan, diresepkan oleh dokter umum',
      
      // Presenting concerns
      primaryConcern: 'Mengalami kecemasan berlebihan terkait pekerjaan yang mengganggu tidur dan aktivitas sehari-hari. Gejala sudah berlangsung selama 3 bulan terakhir.',
      secondaryConcerns: ['Kesulitan tidur', 'Mudah lelah', 'Sulit konsentrasi'],
      symptomSeverity: 4 as const,
      symptomDuration: '3 bulan',
      
      // Treatment goals
      treatmentGoals: [
        'Mengurangi tingkat kecemasan hingga level yang dapat dikelola',
        'Memperbaiki kualitas tidur',
        'Meningkatkan kemampuan mengelola stress kerja'
      ],
      clientExpectations: 'Ingin bisa kembali bekerja dengan produktif tanpa gangguan kecemasan berlebihan',
      
      // Assessment results
      initialAssessment: 'Klien menunjukkan gejala Generalized Anxiety Disorder dengan tingkat sedang-berat. Fungsi sosial dan pekerjaan terganggu. Tidak ada indikasi gangguan mood mayor.',
      recommendedTreatmentPlan: 'Terapi Kognitif Perilaku (CBT) dengan fokus pada teknik relaksasi, restrukturisasi kognitif, dan manajemen stress. Sesi 8-12 kali dengan evaluasi berkala.',
      
      // General consultation specific fields
      currentLifeStressors: ['Beban kerja berlebihan', 'Target penjualan tinggi', 'Hubungan dengan atasan yang tegang'],
      supportSystem: 'Pasangan dan keluarga inti sangat mendukung, namun kurang memahami kondisi kecemasan',
      workLifeBalance: 2 as const,
      
      familyMentalHealthHistory: true,
      familyMentalHealthDetails: 'Ibu memiliki riwayat depresi mayor yang pernah dirawat inap 10 tahun lalu',
      previousMentalHealthDiagnosis: false,
      
      sleepPatterns: 'Sulit tertidur, sering terbangun tengah malam, tidur hanya 4-5 jam per malam',
      exerciseFrequency: 'Jarang berolahraga, hanya 1x per minggu jalan kaki',
      dietaryHabits: 'Makan tidak teratur karena stress, sering skip sarapan, konsumsi kafein berlebihan',
      socialConnections: 'Cenderung menarik diri dari aktivitas sosial, lebih banyak menghabiskan waktu sendiri'
    } as GeneralConsultation,

    // Drug addiction consultation - In Progress  
    {
      id: 'consultation-002',
      clientId: 'CLT008',
      therapistId: 'therapist-001', 
      formType: ConsultationFormTypeEnum.DrugAddiction,
      status: ConsultationStatusEnum.InProgress,
      createdAt: yesterday,
      updatedAt: now,
      sessionDate: yesterday,
      sessionDuration: 120,
      consultationNotes: 'Sesi konsultasi kedua untuk program rehabilitasi alkohol. Klien menunjukkan motivasi yang baik untuk recovery.',
      
      // Client background
      previousTherapyExperience: true,
      previousTherapyDetails: 'Pernah mengikuti program rehabilitasi rawat jalan selama 3 bulan di RS Cibubur, namun relapse setelah 6 bulan',
      currentMedications: true,
      currentMedicationsDetails: 'Naltrexone 50mg per hari, Vitamin B kompleks, Multivitamin',
      
      // Presenting concerns
      primaryConcern: 'Ketergantungan alkohol dengan pola konsumsi harian yang mengganggu pekerjaan dan hubungan keluarga. Mengalami withdrawal symptoms saat mencoba berhenti.',
      secondaryConcerns: ['Masalah keuangan akibat pembelian alkohol', 'Konflik dengan istri', 'Penurunan performa kerja'],
      symptomSeverity: 4 as const,
      symptomDuration: '2 tahun',
      
      // Treatment goals
      treatmentGoals: [
        'Mencapai sobriety jangka panjang',
        'Memperbaiki hubungan dengan keluarga',
        'Mengembalikan stabilitas finansial',
        'Kembali produktif di tempat kerja'
      ],
      clientExpectations: 'Berharap bisa berhenti minum alkohol sepenuhnya dan memulihkan kepercayaan keluarga',
      
      // Assessment results
      initialAssessment: 'Diagnosis: Alcohol Use Disorder, severe. Klien menunjukkan tolerance dan withdrawal symptoms. Fungsi sosial, pekerjaan, dan keluarga terganggu signifikan.',
      recommendedTreatmentPlan: 'Program rehabilitation intensif dengan CBT, Motivational Enhancement Therapy, dan family therapy. Dukungan medis untuk detoksifikasi dan pencegahan relapse.',
      
      // Drug addiction specific fields
      primarySubstance: 'Alkohol',
      additionalSubstances: ['Rokok'],
      ageOfFirstUse: 18,
      frequencyOfUse: 'Setiap hari',
      quantityPerUse: '6-8 gelas bir atau setara 1 botol whisky',
      lastUseDate: '2024-01-13',
      
      withdrawalSymptoms: ['Tremor tangan', 'Keringat berlebihan', 'Mual dan muntah', 'Insomnia', 'Kecemasan'],
      toleranceLevel: 4 as const,
      impactOnDailyLife: 'Sering terlambat kerja, absent tanpa keterangan, konflik berkelanjutan dengan istri, masalah keuangan serius, isolasi sosial',
      attemptsToQuit: 5,
      
      socialCircleSubstanceUse: true,
      triggerSituations: ['Stress kerja', 'Konflik dengan istri', 'Tekanan finansial', 'Perasaan kesepian'],
      environmentalFactors: ['Bar dekat rumah', 'Rekan kerja yang juga minum', 'Akses mudah ke alkohol'],
      
      previousTreatmentPrograms: true,
      previousTreatmentDetails: 'Program rawat jalan 12 minggu di RS Cibubur (2023), AA meetings selama 2 bulan',
      currentSobrietyPeriod: '5 hari',
      
      legalIssuesRelated: false,
      financialImpact: 'Hutang kartu kredit Rp 50 juta, tabungan habis, istri mengancam bercerai jika tidak berhenti minum'
    } as DrugAddictionConsultation,

    // Minor consultation - Draft
    {
      id: 'consultation-003',
      clientId: 'CLT010',
      therapistId: 'therapist-001',
      formType: ConsultationFormTypeEnum.Minor,
      status: ConsultationStatusEnum.Draft,
      createdAt: now,
      updatedAt: now,
      sessionDate: now,
      sessionDuration: 60,
      consultationNotes: 'Konsultasi awal untuk anak dengan kesulitan belajar dan masalah perilaku di sekolah.',
      
      // Client background
      previousTherapyExperience: false,
      currentMedications: false,
      
      // Presenting concerns
      primaryConcern: 'Kesulitan belajar matematika dan bahasa Indonesia, sering mengganggu teman di kelas, tidak bisa duduk tenang selama pelajaran berlangsung.',
      secondaryConcerns: ['Sulit mengerjakan PR', 'Mudah marah jika frustrasi', 'Susah tidur malam'],
      symptomSeverity: 3 as const,
      symptomDuration: '6 bulan',
      
      // Treatment goals
      treatmentGoals: [
        'Meningkatkan kemampuan konsentrasi di kelas',
        'Mengurangi perilaku mengganggu',
        'Meningkatkan prestasi akademik'
      ],
      clientExpectations: 'Orangtua berharap anak bisa lebih fokus belajar dan tidak mengganggu di kelas',
      
      // Assessment results
      initialAssessment: 'Kemungkinan ADHD dengan gejala predominantly hyperactive-impulsive type. Perlu tes psikologi lebih lanjut.',
      recommendedTreatmentPlan: 'Play therapy, behavioral intervention, parent training, dan koordinasi dengan sekolah untuk strategi pembelajaran yang sesuai.',
      
      // Minor consultation specific fields
      guardianPresent: true,
      guardianRelationship: 'Ibu kandung',
      guardianConcerns: 'Sangat khawatir dengan prestasi sekolah anak yang terus menurun dan keluhan dari guru tentang perilaku yang mengganggu kelas',
      
      currentGradeLevel: 'Kelas 3 SD',
      academicPerformance: 2 as const,
      schoolBehaviorIssues: true,
      schoolBehaviorDetails: 'Sering berdiri saat pelajaran, mengganggu teman dengan bicara atau mencolek, sulit menunggu giliran',
      teacherConcerns: 'Guru melaporkan anak sulit mengikuti instruksi, mudah teralihkan perhatiannya, dan mengganggu konsentrasi teman-teman',
      
      familyStructure: 'Keluarga inti lengkap (ayah, ibu, dan 2 anak)',
      siblingRelationships: 'Hubungan baik dengan adik perempuan yang berusia 5 tahun',
      parentalConcerns: ['Prestasi akademik menurun', 'Perilaku di sekolah', 'Kesulitan mengerjakan tugas rumah'],
      familyConflicts: false,
      
      peerRelationships: 'Mudah berteman tapi sering konflik karena terlalu aktif dan tidak sabaran',
      socialDifficulties: true,
      socialDifficultiesDetails: 'Kesulitan mengikuti aturan permainan, ingin selalu menang, mudah frustrasi jika kalah',
      bullyingHistory: false,
      
      developmentalMilestones: 'Perkembangan motorik dan bahasa normal sesuai usia, namun ada keterlambatan dalam kemampuan atensi dan kontrol impuls',
      attentionConcerns: true,
      attentionDetails: 'Sangat sulit mempertahankan perhatian pada tugas atau aktivitas, mudah teralihkan oleh stimulus eksternal',
      behavioralConcerns: true,
      behavioralDetails: 'Hiperaktif, impulsif, sulit menunggu giliran, sering menyela pembicaraan orang lain'
    } as MinorConsultation,

    // General consultation for CLT003 - Completed
    {
      id: 'consultation-004',
      clientId: 'CLT003',
      therapistId: 'multi-001',
      formType: ConsultationFormTypeEnum.General,
      status: ConsultationStatusEnum.Completed,
      createdAt: new Date('2024-01-15T14:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-29T15:30:00Z').toISOString(),
      sessionDate: new Date('2024-01-15T14:00:00Z').toISOString(),
      sessionDuration: 90,
      consultationNotes: 'Konsultasi komprehensif untuk mengatasi insomnia kronis dan stress kerja sebagai dokter spesialis jantung. Klien menunjukkan respons positif terhadap terapi hipnosis dan CBT-I.',
      
      // Client background
      previousTherapyExperience: false,
      currentMedications: true,
      currentMedicationsDetails: 'Zolpidem 10mg PRN untuk insomnia (maksimal 2x seminggu), Melatonin 3mg setiap malam, Vitamin D3 1000IU',
      
      // Presenting concerns
      primaryConcern: 'Mengalami insomnia kronis selama 2 tahun dengan pola tidur yang sangat buruk. Sulit tertidur, sering terbangun tengah malam, dan bangun terlalu dini. Kondisi ini mempengaruhi konsentrasi saat operasi dan mengancam keselamatan pasien.',
      secondaryConcerns: [
        'Kelelahan ekstrem di siang hari', 
        'Mudah irritable dengan staf dan keluarga', 
        'Penurunan performa kerja sebagai dokter', 
        'Ketergantungan pada obat tidur',
        'Kecemasan terkait keselamatan pasien'
      ],
      symptomSeverity: 5 as const,
      symptomDuration: '2 tahun',
      
      // Treatment goals
      treatmentGoals: [
        'Mencapai pola tidur yang konsisten dan berkualitas (7-8 jam per malam)',
        'Mengurangi ketergantungan pada obat tidur secara bertahap',
        'Meningkatkan kualitas konsentrasi dan performa kerja',
        'Mengembangkan teknik manajemen stress yang efektif',
        'Memperbaiki hubungan dengan keluarga yang terganggu akibat irritability'
      ],
      clientExpectations: 'Berharap bisa tidur normal tanpa obat dan kembali menjalankan tugas sebagai dokter dengan optimal tanpa risiko keselamatan pasien',
      
      // Assessment results
      initialAssessment: 'Diagnosis: Chronic Insomnia Disorder dengan secondary impact pada occupational functioning. Insomnia Severity Index: 18 (severe). Klien menunjukkan pola maladaptive sleep behaviors dan tingkat stress kerja yang tinggi sebagai dokter spesialis jantung. Tidak ada indikasi gangguan mood mayor, namun terdapat gejala anxiety terkait performa kerja.',
      recommendedTreatmentPlan: 'Cognitive Behavioral Therapy for Insomnia (CBT-I) dikombinasikan dengan teknik hipnosis untuk relaksasi. Sleep hygiene education, stimulus control therapy, dan sleep restriction therapy. Koordinasi dengan dokter untuk tapering off medication secara bertahap. Stress management khusus untuk profesi medis.',
      
      // General consultation specific fields
      currentLifeStressors: [
        'Beban kerja sebagai dokter spesialis jantung dengan jadwal operasi yang padat',
        'Tanggung jawab hidup-mati pasien yang sangat tinggi',
        'Pressure dari rumah sakit untuk menangani kasus-kasus kompleks',
        'Kurangnya waktu untuk keluarga dan self-care',
        'Kompetisi dengan sesama dokter spesialis'
      ],
      supportSystem: 'Istri yang sangat supportive namun khawatir dengan kondisi suami. Keluarga besar cukup mendukung namun tidak sepenuhnya memahami tekanan profesi medis. Rekan kerja sesama dokter mengerti kondisi namun terbatas dalam memberikan dukungan emosional.',
      workLifeBalance: 1 as const,
      
      familyMentalHealthHistory: false,
      familyMentalHealthDetails: 'Tidak ada riwayat gangguan mental yang signifikan dalam keluarga',
      previousMentalHealthDiagnosis: false,
      
      sleepPatterns: 'Waktu tidur tidak konsisten (antara 23:00-02:00), sulit tertidur (>60 menit), terbangun 3-4x per malam, bangun final jam 04:00-05:00, total waktu tidur 4-5 jam. Sering microsleep saat istirahat di rumah sakit. Kualitas tidur sangat buruk dengan banyak mimpi yang mengganggu terkait kasus pasien.',
      exerciseFrequency: 'Sangat jarang, hanya 1x per bulan bermain golf. Dahulu rutin gym 3x seminggu sebelum jadwal kerja menjadi sangat padat.',
      dietaryHabits: 'Pola makan tidak teratur, sering skip meal karena operasi, konsumsi kafein berlebihan (6-8 cangkir kopi/hari), makan malam terlalu larut. Sering makan fast food di rumah sakit.',
      socialConnections: 'Sangat terbatas karena jadwal kerja. Jarang bertemu teman di luar pekerjaan. Hubungan dengan kolega baik namun sebatas profesional. Waktu dengan keluarga sangat minimal.'
    } as GeneralConsultation
  ];
};

// Initialize mock data
const initializeMockData = () => {
  const mockConsultations = createMockConsultations();
  mockConsultations.forEach(consultation => {
    consultationStorage.set(consultation.id, consultation);
  });
};

// Initialize on first load
if (consultationStorage.size === 0) {
  initializeMockData();
}

// Validation helpers
const validateConsultationData = (data: CreateConsultationData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic validation
  if (!data.clientId?.trim()) errors.push('Client ID is required');
  if (!data.therapistId?.trim()) errors.push('Therapist ID is required');
  if (!data.formType) errors.push('Form type is required');
  if (!data.sessionDate) errors.push('Session date is required');
  if (!data.sessionDuration || data.sessionDuration < 15 || data.sessionDuration > 180) {
    errors.push('Session duration must be between 15-180 minutes');
  }
  if (!data.primaryConcern?.trim() || data.primaryConcern.length < 10) {
    errors.push('Primary concern must be at least 10 characters');
  }
  if (!data.treatmentGoals || data.treatmentGoals.length === 0) {
    errors.push('At least one treatment goal is required');
  }
  
  // Type-specific validation
  if (data.formType === ConsultationFormTypeEnum.DrugAddiction) {
    const drugData = data as CreateConsultationData & Partial<DrugAddictionConsultation>;
    if (!drugData.primarySubstance?.trim()) errors.push('Primary substance is required for drug addiction consultation');
    if (!drugData.financialImpact?.trim()) errors.push('Financial impact is required for drug addiction consultation');
  }
  
  if (data.formType === ConsultationFormTypeEnum.Minor) {
    const minorData = data as CreateConsultationData & Partial<MinorConsultation>;
    if (!minorData.guardianRelationship?.trim()) errors.push('Guardian relationship is required for minor consultation');
    if (!minorData.guardianConcerns?.trim()) errors.push('Guardian concerns are required for minor consultation');
    if (!minorData.currentGradeLevel?.trim()) errors.push('Current grade level is required for minor consultation');
  }
  
  if (data.formType === ConsultationFormTypeEnum.General) {
    const generalData = data as CreateConsultationData & Partial<GeneralConsultation>;
    if (!generalData.supportSystem?.trim()) errors.push('Support system is required for general consultation');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// API Functions
export const ConsultationAPI = {
  // Get consultations with optional filtering
  async getConsultations(clientId?: string, therapistId?: string, status?: ConsultationStatusEnum): Promise<ConsultationListResponse> {
    await delay(300 + Math.random() * 200);

    try {
      let consultations = Array.from(consultationStorage.values());

      // Apply filters
      if (clientId) {
        consultations = consultations.filter(c => c.clientId === clientId);
      }
      if (therapistId) {
        consultations = consultations.filter(c => c.therapistId === therapistId);
      }
      if (status) {
        consultations = consultations.filter(c => c.status === status);
      }

      // Sort by created date (newest first)
      consultations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        success: true,
        data: {
          items: consultations,
          total: consultations.length,
          page: 1,
          pageSize: consultations.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch consultations'
      };
    }
  },

  // Get single consultation
  async getConsultation(consultationId: string): Promise<ConsultationResponse> {
    await delay(200 + Math.random() * 100);

    try {
      const consultation = consultationStorage.get(consultationId);
      
      if (!consultation) {
        return {
          success: false,
          message: 'Consultation not found'
        };
      }

      return {
        success: true,
        data: consultation
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch consultation'
      };
    }
  },

  // Create new consultation
  async createConsultation(data: CreateConsultationData): Promise<ConsultationResponse> {
    await delay(400 + Math.random() * 300);

    try {
      // Validate data
      const validation = validateConsultationData(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Create new consultation
      const now = new Date().toISOString();
      const consultation: Consultation = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now
      } as Consultation;

      // Store consultation
      consultationStorage.set(consultation.id, consultation);

      return {
        success: true,
        data: consultation,
        message: 'Consultation created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create consultation'
      };
    }
  },

  // Update consultation
  async updateConsultation(consultationId: string, data: UpdateConsultationData): Promise<ConsultationResponse> {
    await delay(350 + Math.random() * 250);

    try {
      const existing = consultationStorage.get(consultationId);
      
      if (!existing) {
        return {
          success: false,
          message: 'Consultation not found'
        };
      }

      // Check if consultation can be edited
      if (existing.status === ConsultationStatusEnum.Archived) {
        return {
          success: false,
          message: 'Cannot edit archived consultation'
        };
      }

      // Merge updates
      const updated: Consultation = {
        ...existing,
        ...data,
        id: consultationId, // Ensure ID doesn't change
        createdAt: existing.createdAt, // Preserve creation date
        updatedAt: new Date().toISOString()
      } as Consultation;

      // Validate if significant changes were made
      if (data.formType || data.primaryConcern || data.treatmentGoals) {
        const validation = validateConsultationData(updated as CreateConsultationData);
        if (!validation.isValid) {
          return {
            success: false,
            message: `Validation failed: ${validation.errors.join(', ')}`
          };
        }
      }

      // Store updated consultation
      consultationStorage.set(consultationId, updated);

      return {
        success: true,
        data: updated,
        message: 'Consultation updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update consultation'
      };
    }
  },

  // Delete consultation
  async deleteConsultation(consultationId: string): Promise<ConsultationResponse> {
    await delay(300 + Math.random() * 200);

    try {
      const existing = consultationStorage.get(consultationId);
      
      if (!existing) {
        return {
          success: false,
          message: 'Consultation not found'
        };
      }

      // Check if consultation can be deleted
      if (existing.status === ConsultationStatusEnum.Completed) {
        return {
          success: false,
          message: 'Cannot delete completed consultation'
        };
      }

      // Remove consultation
      consultationStorage.delete(consultationId);

      return {
        success: true,
        message: 'Consultation deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete consultation'
      };
    }
  },

  // Get consultation statistics
  async getConsultationStats(therapistId?: string): Promise<ConsultationResponse & { data?: any }> {
    await delay(250 + Math.random() * 150);

    try {
      let consultations = Array.from(consultationStorage.values());

      if (therapistId) {
        consultations = consultations.filter(c => c.therapistId === therapistId);
      }

      const stats = {
        total: consultations.length,
        byStatus: {
          [ConsultationStatusEnum.Draft]: consultations.filter(c => c.status === ConsultationStatusEnum.Draft).length,
          [ConsultationStatusEnum.InProgress]: consultations.filter(c => c.status === ConsultationStatusEnum.InProgress).length,
          [ConsultationStatusEnum.Completed]: consultations.filter(c => c.status === ConsultationStatusEnum.Completed).length,
          [ConsultationStatusEnum.Archived]: consultations.filter(c => c.status === ConsultationStatusEnum.Archived).length,
        },
        byType: {
          [ConsultationFormTypeEnum.General]: consultations.filter(c => c.formType === ConsultationFormTypeEnum.General).length,
          [ConsultationFormTypeEnum.DrugAddiction]: consultations.filter(c => c.formType === ConsultationFormTypeEnum.DrugAddiction).length,
          [ConsultationFormTypeEnum.Minor]: consultations.filter(c => c.formType === ConsultationFormTypeEnum.Minor).length,
        },
        completionRate: consultations.length > 0 
          ? Math.round((consultations.filter(c => c.status === ConsultationStatusEnum.Completed).length / consultations.length) * 100)
          : 0
      };

      return {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get consultation statistics'
      };
    }
  },

  // Archive consultation
  async archiveConsultation(consultationId: string): Promise<ConsultationResponse> {
    await delay(300 + Math.random() * 200);

    try {
      const existing = consultationStorage.get(consultationId);
      
      if (!existing) {
        return {
          success: false,
          message: 'Consultation not found'
        };
      }

      if (existing.status === ConsultationStatusEnum.Archived) {
        return {
          success: true,
          data: existing,
          message: 'Consultation already archived'
        };
      }

      const updated: Consultation = {
        ...existing,
        status: ConsultationStatusEnum.Archived,
        updatedAt: new Date().toISOString()
      };

      consultationStorage.set(consultationId, updated);

      return {
        success: true,
        data: updated,
        message: 'Consultation archived successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to archive consultation'
      };
    }
  },

  // Reset mock data (for testing/development)
  async resetMockData(): Promise<ConsultationResponse> {
    await delay(100);

    try {
      consultationStorage.clear();
      initializeMockData();

      return {
        success: true,
        message: 'Mock data reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset mock data'
      };
    }
  },

  // Get consultation summary with AI predictions
  async getConsultationSummary(consultationId: string): Promise<ConsultationResponse & { data?: ConsultationSummaryData }> {
    await delay(250 + Math.random() * 200);

    try {
      const consultation = consultationStorage.get(consultationId);
      
      if (!consultation) {
        return {
          success: false,
          message: 'Consultation not found'
        };
      }

      // Get client data
      const client = getClientById(consultation.clientId);
      if (!client) {
        return {
          success: false,
          message: 'Client data not found'
        };
      }

      // Get therapist name
      const therapistName = getTherapistName(consultation.therapistId);

      // Get AI predictions
      const aiPredictions = getAIPredictionsForConsultation(consultationId);

      // Calculate age from birth date
      const calculateAge = (birthDate: string): number => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      };

      const summaryData: ConsultationSummaryData = {
        consultation: {
          id: consultation.id,
          sessionDate: consultation.sessionDate,
          sessionDuration: consultation.sessionDuration,
          primaryConcern: consultation.primaryConcern,
          secondaryConcerns: consultation.secondaryConcerns,
          symptomSeverity: consultation.symptomSeverity,
          symptomDuration: consultation.symptomDuration,
          treatmentGoals: consultation.treatmentGoals,
          initialAssessment: consultation.initialAssessment,
          consultationNotes: consultation.consultationNotes,
        },
        aiPredictions,
        client: {
          id: client.id,
          fullName: client.fullName || client.name,
          age: calculateAge(client.birthDate || ''),
        },
        therapist: {
          id: consultation.therapistId,
          fullName: therapistName,
        },
      };

      return {
        success: true,
        data: summaryData,
        message: 'Consultation summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get consultation summary'
      };
    }
  }
};

export default ConsultationAPI;