import {
  ConsultationAIPredictions,
  MentalHealthIssueEnum,
  TherapyPriorityEnum,
  TherapyTypeEnum,
} from '@/types/therapy';

// Mock AI predictions for consultations
export const mockAIPredictions: Record<string, ConsultationAIPredictions> = {
  'consultation-004': {
    consultationId: 'consultation-004',
    generatedAt: new Date('2024-01-29T16:00:00Z').toISOString(),
    primaryPrediction: {
      issue: MentalHealthIssueEnum.SleepDisorder,
      confidence: 92,
      severity: 'severe',
      description: 'Berdasarkan analisis gejala dan pola tidur, klien menunjukkan karakteristik insomnia kronis yang parah. Pola tidur yang terganggu selama 2 tahun dengan dampak signifikan pada fungsi kognitif dan performa kerja sebagai dokter spesialis jantung menunjukkan tingkat keparahan yang tinggi.',
      recommendedTreatment: [
        'Cognitive Behavioral Therapy for Insomnia (CBT-I)',
        'Sleep Hygiene Education',
        'Stimulus Control Therapy',
        'Sleep Restriction Therapy',
        'Progressive Muscle Relaxation',
        'Mindfulness-based stress reduction'
      ],
      estimatedSessionsNeeded: 8,
      urgencyLevel: TherapyPriorityEnum.High,
    },
    secondaryPredictions: [
      {
        issue: MentalHealthIssueEnum.Stress,
        confidence: 85,
        severity: 'severe',
        description: 'Tingkat stress kerja yang sangat tinggi sebagai dokter spesialis jantung dengan tanggung jawab hidup-mati pasien. Stress ini berkontribusi signifikan terhadap gangguan tidur dan dapat mempengaruhi keselamatan pasien.',
        recommendedTreatment: [
          'Stress Management Training',
          'Time Management Techniques',
          'Professional Boundary Setting',
          'Burnout Prevention Strategies',
          'Work-Life Balance Coaching'
        ],
        estimatedSessionsNeeded: 6,
        urgencyLevel: TherapyPriorityEnum.High,
      },
      {
        issue: MentalHealthIssueEnum.Anxiety,
        confidence: 78,
        severity: 'moderate',
        description: 'Kecemasan terkait performa kerja dan keselamatan pasien. Gejala anxiety muncul sebagai konsekuensi dari kurang tidur dan tekanan pekerjaan yang tinggi, menciptakan siklus yang memperburuk kondisi insomnia.',
        recommendedTreatment: [
          'Anxiety Management Techniques',
          'Breathing Exercises',
          'Grounding Techniques',
          'Cognitive Restructuring',
          'Professional Confidence Building'
        ],
        estimatedSessionsNeeded: 5,
        urgencyLevel: TherapyPriorityEnum.Medium,
      }
    ],
    overallRiskLevel: 'high',
    recommendedTherapyType: TherapyTypeEnum.Individual,
    notes: 'Kasus ini memerlukan pendekatan terapi yang komprehensif dan urgent mengingat profesi klien sebagai dokter spesialis jantung. Gangguan tidur dan stress yang dialami dapat berdampak pada keselamatan pasien. Rekomendasi untuk terapi individual intensif dengan fokus utama pada CBT-I, diikuti dengan manajemen stress dan anxiety. Koordinasi dengan dokter untuk evaluasi medication tapering juga diperlukan.',
  },
  'consultation-001': {
    consultationId: 'consultation-001',
    generatedAt: new Date('2024-01-19T10:00:00Z').toISOString(),
    primaryPrediction: {
      issue: MentalHealthIssueEnum.Anxiety,
      confidence: 88,
      severity: 'moderate',
      description: 'Klien menunjukkan gejala Generalized Anxiety Disorder dengan tingkat sedang-berat. Kecemasan yang berlebihan terkait pekerjaan software engineering dengan dampak pada tidur dan konsentrasi.',
      recommendedTreatment: [
        'Cognitive Behavioral Therapy (CBT)',
        'Relaxation Training',
        'Mindfulness-Based Stress Reduction',
        'Cognitive Restructuring',
        'Exposure Therapy for work-related anxiety'
      ],
      estimatedSessionsNeeded: 10,
      urgencyLevel: TherapyPriorityEnum.Medium,
    },
    secondaryPredictions: [
      {
        issue: MentalHealthIssueEnum.Stress,
        confidence: 75,
        severity: 'moderate',
        description: 'Stress kerja yang tinggi dalam industri teknologi dengan deadline ketat dan target yang menantang.',
        recommendedTreatment: [
          'Stress Management Techniques',
          'Time Management Skills',
          'Work-Life Balance Strategies',
          'Assertiveness Training'
        ],
        estimatedSessionsNeeded: 6,
        urgencyLevel: TherapyPriorityEnum.Medium,
      }
    ],
    overallRiskLevel: 'medium',
    recommendedTherapyType: TherapyTypeEnum.Individual,
    notes: 'Klien menunjukkan respons positif terhadap intervensi kognitif. Prognosis baik dengan terapi CBT yang konsisten.',
  },
  'consultation-002': {
    consultationId: 'consultation-002',
    generatedAt: new Date('2024-01-14T11:00:00Z').toISOString(),
    primaryPrediction: {
      issue: MentalHealthIssueEnum.AddictionRecovery,
      confidence: 95,
      severity: 'severe',
      description: 'Alcohol Use Disorder tingkat berat dengan pola konsumsi harian dan dampak signifikan pada fungsi sosial, pekerjaan, dan keluarga. Riwayat relapse menunjukkan perlunya pendekatan komprehensif.',
      recommendedTreatment: [
        'Motivational Enhancement Therapy',
        'Cognitive Behavioral Therapy for Addiction',
        'Relapse Prevention Training',
        'Family Therapy',
        'Support Group Participation',
        'Medical Management'
      ],
      estimatedSessionsNeeded: 16,
      urgencyLevel: TherapyPriorityEnum.Urgent,
    },
    secondaryPredictions: [
      {
        issue: MentalHealthIssueEnum.Depression,
        confidence: 70,
        severity: 'moderate',
        description: 'Gejala depresi sekunder akibat dampak kecanduan alkohol pada kehidupan sosial dan finansial.',
        recommendedTreatment: [
          'Depression-focused CBT',
          'Behavioral Activation',
          'Social Skills Training',
          'Mood Monitoring'
        ],
        estimatedSessionsNeeded: 8,
        urgencyLevel: TherapyPriorityEnum.Medium,
      },
      {
        issue: MentalHealthIssueEnum.Relationship,
        confidence: 82,
        severity: 'severe',
        description: 'Masalah hubungan pernikahan yang serius akibat dampak kecanduan alkohol.',
        recommendedTreatment: [
          'Couple Therapy',
          'Communication Skills Training',
          'Trust Rebuilding Exercises',
          'Family Systems Therapy'
        ],
        estimatedSessionsNeeded: 12,
        urgencyLevel: TherapyPriorityEnum.High,
      }
    ],
    overallRiskLevel: 'high',
    recommendedTherapyType: TherapyTypeEnum.Individual,
    notes: 'Kasus addiction yang kompleks memerlukan pendekatan multi-modal. Kombinasi terapi individual, family therapy, dan dukungan medis diperlukan untuk recovery yang sustainable.',
  },
  'consultation-003': {
    consultationId: 'consultation-003',
    generatedAt: new Date().toISOString(),
    primaryPrediction: {
      issue: MentalHealthIssueEnum.Anxiety,
      confidence: 85,
      severity: 'moderate',
      description: 'Kecemasan sosial pada anak usia sekolah dengan kemungkinan ADHD. Kesulitan konsentrasi dan perilaku hiperaktif mengganggu fungsi akademik dan sosial.',
      recommendedTreatment: [
        'Play Therapy',
        'Behavioral Intervention',
        'Parent Training',
        'School Consultation',
        'Social Skills Training'
      ],
      estimatedSessionsNeeded: 12,
      urgencyLevel: TherapyPriorityEnum.Medium,
    },
    secondaryPredictions: [
      {
        issue: MentalHealthIssueEnum.Career,
        confidence: 65,
        severity: 'mild',
        description: 'Masalah akademik yang dapat mempengaruhi perkembangan karir masa depan anak.',
        recommendedTreatment: [
          'Academic Support Strategies',
          'Study Skills Training',
          'Goal Setting for Children',
          'Achievement Motivation Enhancement'
        ],
        estimatedSessionsNeeded: 6,
        urgencyLevel: TherapyPriorityEnum.Low,
      }
    ],
    overallRiskLevel: 'medium',
    recommendedTherapyType: TherapyTypeEnum.Family,
    notes: 'Pendekatan family therapy diperlukan untuk melibatkan orangtua dalam proses terapi. Koordinasi dengan sekolah juga penting untuk konsistensi intervensi.',
  }
};

// Function to get AI predictions for a consultation
export const getAIPredictionsForConsultation = (consultationId: string): ConsultationAIPredictions | undefined => {
  return mockAIPredictions[consultationId];
};

// Function to get all AI predictions
export const getAllAIPredictions = (): ConsultationAIPredictions[] => {
  return Object.values(mockAIPredictions);
};