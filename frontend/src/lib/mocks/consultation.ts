import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '../../types/enums';
import { ConsultationFormSchemaType } from '../../schemas/consultationFormSchema';

// Mock consultation data for clients
export const mockConsultations: (ConsultationFormSchemaType & { id: string })[] = [
  {
    // Basic consultation info
    id: 'consultation-client-002-001',
    clientId: 'client-002',
    formTypes: [ConsultationFormTypeEnum.General],
    status: ConsultationStatusEnum.Completed,
    
    // Session information
    sessionDate: '2024-08-10',
    sessionDuration: 90,
    consultationNotes: 'Sesi konsultasi awal berjalan dengan baik. Klien kooperatif dan terbuka dalam berbagi informasi. Teridentifikasi beberapa area yang perlu mendapat perhatian khusus terkait work-life balance dan kecemasan.',
    scriptGenerationPreferences: 'software engineer, tech-savvy, logis, suka gaming, generasi milenial, berorientasi pada solusi praktis',
    
    // Client background information  
    previousTherapyExperience: false,
    currentMedications: false,
    previousPsychologicalDiagnosis: false,
    significantPhysicalIllness: false,
    traumaticExperience: false,
    familyPsychologicalHistory: true,
    familyPsychologicalHistoryDetails: 'Ayah memiliki riwayat depresi ringan, sudah ditangani dengan baik. Tidak ada riwayat gangguan mental serius dalam keluarga.',
    
    // Presenting concerns
    primaryConcern: 'Mengalami kecemasan berlebihan dan kesulitan tidur sejak promosi menjadi tech lead 6 bulan lalu. Merasa overwhelmed dengan tanggung jawab baru dan sering merasa tidak kompeten meskipun secara objektif performa kerja baik. Khawatir akan mengecewakan tim dan atasan. Gejala fisik berupa jantung berdebar, keringat dingin, dan sulit berkonsentrasi saat meeting penting.',
    secondaryConcerns: [
      'Perfectionism yang berlebihan dalam coding dan review',
      'Kesulitan delegasi tugas kepada junior developer',
      'Overthinking sebelum tidur tentang project deadline',
      'Imposter syndrome sebagai technical leader'
    ],
    symptomSeverity: 'moderate' as any,
    symptomDuration: '6 bulan',
    problemFrequency: 'often' as any,
    sleepQuality: 'poor' as any,
    selfHarmFrequency: 'never' as any,
    
    // Emotion scale (0-10)
    emotionScale: {
      happiness: 4,
      sadness: 3,
      anger: 2,
      fear: 7,
      anxiety: 8,
      worry: 9,
      stress: 9,
      depression: 2,
      frustration: 6,
      disappointment: 5,
      guilt: 7,
      shame: 6,
      envy: 1,
      jealousy: 1,
      hatred: 0,
      loneliness: 3,
      calmness: 2,
      confidence: 3,
      optimism: 4,
      despair: 3
    },
    
    // Recent mood and emotions
    recentMoodState: 'bad' as any,
    recentMoodStateDetails: 'Mood cenderung rendah terutama di weekdays. Lebih baik di weekend saat tidak berpikir tentang pekerjaan. Sering merasa anxious di pagi hari sebelum berangkat kerja.',
    frequentEmotions: ['cemas', 'khawatir', 'stress', 'lelah mental', 'tidak percaya diri'],
    
    // Self-harm and stress assessment
    selfHarmThoughts: 'never' as any,
    selfHarmDetails: 'Tidak ada riwayat self-harm',
    dailyStressFrequency: 'often' as any,
    
    // Goals and expectations
    treatmentGoals: [
      'Mengurangi tingkat kecemasan dalam situasi kerja',
      'Meningkatkan kepercayaan diri sebagai technical leader', 
      'Memperbaiki kualitas tidur',
      'Mengembangkan strategi coping untuk mengelola stress',
      'Mencapai work-life balance yang lebih sehat'
    ],
    clientExpectations: 'Berharap dapat menemukan teknik relaksasi yang praktis dan mudah diterapkan dalam rutinitas sehari-hari. Ingin memahami root cause dari kecemasan dan mendapatkan tools yang konkret untuk mengatasinya.',
    therapyPreference: 'hypnotherapy' as any,
    
    // Assessment results
    initialAssessment: 'Klien menunjukkan gejala Generalized Anxiety Disorder ringan hingga sedang dengan fokus pada workplace anxiety dan imposter syndrome. Tidak ada indikasi gangguan mood mayor. Memiliki insight yang baik dan motivasi tinggi untuk perubahan. Fungsi sosial dan relasi pernikahan tetap baik. Respons terhadap hypnotherapy kemungkinan baik mengingat kepribadian yang analitis dan kooperatif.',
    recommendedTreatmentPlan: 'Hipnoterapi dengan fokus pada: 1) Progressive muscle relaxation untuk mengurangi physical symptoms, 2) Confidence building dan self-efficacy enhancement, 3) Cognitive restructuring untuk mengatasi negative self-talk, 4) Time management dan work-life balance techniques, 5) Sleep hygiene dan bedtime relaxation routine. Estimasi 6-8 sesi dengan evaluasi setiap 3 sesi.',
    
    // Consent and signature
    consentAgreement: true,
    clientSignatureName: 'Budi Hartono',
    clientSignatureDate: '2024-08-10',
    therapistName: 'Dr. Sarah Wijaya',
    registrationDate: '2024-08-10',
    initialRecommendation: [
      'Hipnoterapi untuk anxiety management',
      'Progressive muscle relaxation training', 
      'Cognitive behavioral techniques untuk imposter syndrome',
      'Sleep hygiene education',
      'Work-life balance coaching'
    ],
    
    // General consultation specific fields
    currentLifeStressors: [
      'Tanggung jawab baru sebagai tech lead',
      'Project deadline yang tight',
      'Mentoring junior developers',
      'Performance review yang akan datang',
      'Technology upgrade di perusahaan'
    ],
    supportSystem: 'Istri sangat supportive dan understanding. Memiliki beberapa teman dekat di lingkungan kerja dan komunitas gaming online. Keluarga besar juga mendukung meskipun tinggal di kota berbeda.',
    workLifeBalance: 2, // Skala 1-10, 2 = kurang baik
    
    // General form data
    generalFormData: {
      stressLevel: 8,
      primaryStressors: [
        'Tanggung jawab baru sebagai tech lead',
        'Project deadline yang tight',
        'Mentoring junior developers'
      ],
      supportSystem: 'Istri sangat supportive dan understanding',
      dailyRoutine: 'Bangun 06:30, berangkat kerja 07:30, pulang 18:00-19:00',
      exerciseHabits: '2-3x per minggu jogging ringan',
      sleepPatterns: 'Tidur 00:30-01:00, bangun 06:30',
      nutritionHabits: 'Pola makan teratur, konsumsi kopi 3-4 cups per hari',
      hobbiesInterests: ['gaming', 'programming', 'badminton'],
      spiritualBeliefs: 'Agama Islam, rajin shalat',
      culturalFactors: 'Budaya Jawa, menghormati senior',
      recentMoodState: 'bad' as any,
      recentMoodStateDetails: 'Mood cenderung rendah di weekdays',
      frequentEmotions: ['cemas', 'khawatir', 'stress'],
      selfHarmThoughts: 'never' as any,
      selfHarmDetails: 'Tidak ada riwayat self-harm',
      dailyStressFrequency: 'often' as any,
      emotionScale: {
        happiness: 4,
        anxiety: 8,
        stress: 9
      }
    }
  },
  {
    // Basic consultation info
    id: 'consultation-client-004-001',
    clientId: 'client-004',
    formTypes: [ConsultationFormTypeEnum.General],
    status: ConsultationStatusEnum.Completed,
    
    // Session information
    sessionDate: '2024-08-15',
    sessionDuration: 90,
    consultationNotes: 'Sesi konsultasi awal dengan klien yang mengalami kesulitan dalam hubungan interpersonal dan kepercayaan diri. Klien menunjukkan gejala social anxiety dan low self-esteem. Teridentifikasi pola pikir negatif dan kesulitan dalam membangun hubungan yang sehat.',
    scriptGenerationPreferences: 'mahasiswa, introvert, seni, musik, generasi Z, sensitif, kreatif, suka menulis',
    
    // Client background information  
    previousTherapyExperience: false,
    currentMedications: false,
    previousPsychologicalDiagnosis: false,
    significantPhysicalIllness: false,
    traumaticExperience: true,
    traumaticExperienceDetails: 'Pernah mengalami bullying di sekolah menengah yang berdampak pada kepercayaan diri',
    familyPsychologicalHistory: false,
    
    // Presenting concerns
    primaryConcern: 'Mengalami kesulitan dalam membangun hubungan interpersonal yang sehat. Sering merasa tidak percaya diri dalam situasi sosial, takut ditolak atau dihakimi oleh orang lain. Kesulitan dalam mengekspresikan perasaan dan kebutuhan secara asertif. Gejala fisik berupa gemetar, berkeringat, dan jantung berdebar saat harus berbicara di depan umum atau bertemu orang baru.',
    secondaryConcerns: [
      'Kesulitan dalam mempertahankan pertemanan jangka panjang',
      'Takut akan penolakan dan kritik dari orang lain',
      'Kesulitan dalam mengekspresikan pendapat di kelas',
      'Merasa tidak cukup baik untuk diterima oleh teman-teman',
      'Kesulitan dalam membangun hubungan romantis'
    ],
    symptomSeverity: 'severe' as any,
    symptomDuration: '2 tahun',
    problemFrequency: 'often' as any,
    sleepQuality: 'poor' as any,
    selfHarmFrequency: 'never' as any,
    
    // Emotion scale (0-10)
    emotionScale: {
      happiness: 3,
      sadness: 6,
      anger: 2,
      fear: 8,
      anxiety: 9,
      worry: 8,
      stress: 7,
      depression: 4,
      frustration: 5,
      disappointment: 6,
      guilt: 4,
      shame: 7,
      envy: 3,
      jealousy: 4,
      hatred: 1,
      loneliness: 8,
      calmness: 2,
      confidence: 2,
      optimism: 3,
      despair: 5
    },
    
    // Recent mood and emotions
    recentMoodState: 'bad' as any,
    recentMoodStateDetails: 'Mood cenderung rendah terutama saat harus menghadapi situasi sosial. Lebih baik saat sendirian atau dengan keluarga. Sering merasa lonely meskipun dikelilingi teman.',
    frequentEmotions: ['cemas', 'tidak percaya diri', 'kesepian', 'takut', 'malu'],
    
    // Self-harm and stress assessment
    selfHarmThoughts: 'never' as any,
    selfHarmDetails: 'Tidak ada riwayat self-harm',
    dailyStressFrequency: 'often' as any,
    
    // Goals and expectations
    treatmentGoals: [
      'Meningkatkan kepercayaan diri dalam situasi sosial',
      'Mengembangkan keterampilan komunikasi yang lebih baik',
      'Mengatasi social anxiety dan ketakutan akan penolakan',
      'Membangun hubungan interpersonal yang lebih sehat',
      'Meningkatkan self-esteem dan self-worth'
    ],
    clientExpectations: 'Berharap dapat menemukan cara untuk mengatasi ketakutan sosial dan membangun kepercayaan diri. Ingin belajar teknik untuk mengelola anxiety dan mengembangkan keterampilan sosial yang lebih baik.',
    therapyPreference: 'hypnotherapy' as any,
    
    // Assessment results
    initialAssessment: 'Klien menunjukkan gejala Social Anxiety Disorder dengan komponen low self-esteem dan kesulitan dalam interpersonal relationships. Tidak ada indikasi gangguan mood mayor. Memiliki insight yang baik dan motivasi tinggi untuk perubahan. Fungsi akademik tetap baik meskipun mengalami kesulitan dalam partisipasi kelas. Respons terhadap hypnotherapy kemungkinan baik mengingat kepribadian yang kreatif dan reflektif.',
    recommendedTreatmentPlan: 'Hipnoterapi dengan fokus pada: 1) Confidence building dan self-esteem enhancement, 2) Social skills training dan communication techniques, 3) Anxiety management dan relaxation techniques, 4) Cognitive restructuring untuk mengatasi negative self-talk, 5) Exposure therapy untuk social situations. Estimasi 8-10 sesi dengan evaluasi setiap 3 sesi.',
    
    // Consent and signature
    consentAgreement: true,
    clientSignatureName: 'Dewi Sari',
    clientSignatureDate: '2024-08-15',
    therapistName: 'Dr. Ahmad Rahman',
    registrationDate: '2024-08-15',
    initialRecommendation: [
      'Hipnoterapi untuk social anxiety management',
      'Confidence building dan self-esteem enhancement',
      'Social skills training dan communication techniques',
      'Anxiety management dan relaxation techniques',
      'Cognitive behavioral therapy untuk negative self-talk'
    ],
    
    // General consultation specific fields
    currentLifeStressors: [
      'Tugas kuliah dan presentasi di depan kelas',
      'Pertemanan dan hubungan interpersonal',
      'Ekspektasi keluarga terhadap prestasi akademik',
      'Kesulitan dalam mengekspresikan diri',
      'Perbandingan dengan teman-teman yang lebih percaya diri'
    ],
    supportSystem: 'Keluarga sangat supportive meskipun tidak sepenuhnya memahami kondisi klien. Memiliki beberapa teman dekat yang supportive. Aktif di komunitas online untuk hobi musik dan seni.',
    workLifeBalance: 3, // Skala 1-10, 3 = sedang
    
    // General form data
    generalFormData: {
      stressLevel: 7,
      primaryStressors: [
        'Tugas kuliah dan presentasi',
        'Pertemanan dan hubungan interpersonal'
      ],
      supportSystem: 'Keluarga supportive, beberapa teman dekat',
      dailyRoutine: 'Bangun 07:00, kuliah, pulang sore',
      exerciseHabits: '1-2x per minggu yoga atau jalan-jalan',
      sleepPatterns: 'Tidur 23:00-00:00, bangun 07:00',
      nutritionHabits: 'Pola makan teratur, kadang skip meals saat stress',
      hobbiesInterests: ['musik', 'seni', 'menulis'],
      spiritualBeliefs: 'Agama Islam, rajin beribadah',
      culturalFactors: 'Budaya Indonesia, menghormati orang tua',
      recentMoodState: 'bad' as any,
      recentMoodStateDetails: 'Mood rendah saat situasi sosial',
      frequentEmotions: ['cemas', 'tidak percaya diri', 'kesepian'],
      selfHarmThoughts: 'never' as any,
      selfHarmDetails: 'Tidak ada riwayat self-harm',
      dailyStressFrequency: 'often' as any,
      emotionScale: {
        happiness: 3,
        anxiety: 9,
        loneliness: 8
      }
    }
  }
];

// Export individual consultation by ID for easy access
export const getConsultationById = (id: string): (ConsultationFormSchemaType & { id: string }) | undefined => {
  return mockConsultations.find(consultation => consultation.id === id);
};

// Export consultation by client ID (single consultation per client)
export const getConsultationByClientId = (clientId: string): (ConsultationFormSchemaType & { id: string }) | undefined => {
  return mockConsultations.find(consultation => consultation.clientId === clientId);
};

// Default export
export default mockConsultations;