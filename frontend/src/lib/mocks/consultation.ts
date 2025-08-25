import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '../../types/enums';
import { GeneralConsultationFormData } from '../../schemas/consultationSchema';

// Mock consultation data for client-002 (Budi Hartono)
export const mockConsultations: (GeneralConsultationFormData & { id: string })[] = [
  {
    // Basic consultation info
    id: 'consultation-client-002-001',
    clientId: 'client-002',
    therapistId: 'th-002',
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
    symptomSeverity: 4,
    symptomDuration: '6 bulan',
    
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
    recentMoodState: 'bad',
    recentMoodStateDetails: 'Mood cenderung rendah terutama di weekdays. Lebih baik di weekend saat tidak berpikir tentang pekerjaan. Sering merasa anxious di pagi hari sebelum berangkat kerja.',
    frequentEmotions: ['cemas', 'khawatir', 'stress', 'lelah mental', 'tidak percaya diri'],
    
    // Self-harm and stress assessment
    selfHarmThoughts: 'never',
    dailyStressFrequency: 'often',
    
    // Goals and expectations
    treatmentGoals: [
      'Mengurangi tingkat kecemasan dalam situasi kerja',
      'Meningkatkan kepercayaan diri sebagai technical leader', 
      'Memperbaiki kualitas tidur',
      'Mengembangkan strategi coping untuk mengelola stress',
      'Mencapai work-life balance yang lebih sehat'
    ],
    clientExpectations: 'Berharap dapat menemukan teknik relaksasi yang praktis dan mudah diterapkan dalam rutinitas sehari-hari. Ingin memahami root cause dari kecemasan dan mendapatkan tools yang konkret untuk mengatasinya.',
    
    // Assessment results
    initialAssessment: 'Klien menunjukkan gejala Generalized Anxiety Disorder ringan hingga sedang dengan fokus pada workplace anxiety dan imposter syndrome. Tidak ada indikasi gangguan mood mayor. Memiliki insight yang baik dan motivasi tinggi untuk perubahan. Fungsi sosial dan relasi pernikahan tetap baik. Respons terhadap hypnotherapy kemungkinan baik mengingat kepribadian yang analitis dan kooperatif.',
    recommendedTreatmentPlan: 'Hipnoterapi dengan fokus pada: 1) Progressive muscle relaxation untuk mengurangi physical symptoms, 2) Confidence building dan self-efficacy enhancement, 3) Cognitive restructuring untuk mengatasi negative self-talk, 4) Time management dan work-life balance techniques, 5) Sleep hygiene dan bedtime relaxation routine. Estimasi 6-8 sesi dengan evaluasi setiap 3 sesi.',
    
    // General consultation specific fields
    currentLifeStressors: [
      'Tanggung jawab baru sebagai tech lead',
      'Project deadline yang tight',
      'Mentoring junior developers',
      'Performance review yang akan datang',
      'Technology upgrade di perusahaan'
    ],
    supportSystem: 'Istri sangat supportive dan understanding. Memiliki beberapa teman dekat di lingkungan kerja dan komunitas gaming online. Keluarga besar juga mendukung meskipun tinggal di kota berbeda.',
    workLifeBalance: 2, // Skala 1-5, 2 = kurang baik
    
    // Mental health history
    familyMentalHealthHistory: true,
    familyMentalHealthDetails: 'Ayah pernah mengalami burnout dan depresi ringan sekitar 10 tahun lalu saat menghadapi tekanan pekerjaan. Sudah recovery dengan bantuan konseling dan perubahan lifestyle. Ibu tidak ada riwayat gangguan mental.',
    previousMentalHealthDiagnosis: false,
    
    // Lifestyle factors
    sleepPatterns: 'Tidur sekitar pukul 00:30-01:00, bangun pukul 06:30. Sering terbangun tengah malam karena overthinking tentang pekerjaan. Kualitas tidur menurun sejak menjadi tech lead. Weekend lebih baik karena tidak ada pressure pekerjaan.',
    exerciseFrequency: '2-3x per minggu jogging ringan dan occasional badminton dengan teman. Sempat berhenti olahraga selama 2 bulan terakhir karena terlalu fokus dengan pekerjaan.',
    dietaryHabits: 'Pola makan cukup teratur. Sarapan di rumah, makan siang di kantor atau pesan online. Konsumsi kopi meningkat menjadi 3-4 cups per hari sejak promosi. Jarang skip meals tapi kadang makan terburu-buru saat deadline.',
    socialConnections: 'Memiliki circle pertemanan yang solid di kantor dan komunitas gaming. Relationship dengan istri sangat baik dan supportive. Aktif di beberapa grup Telegram tentang programming dan teknologi. Sesekali hangout dengan college friends.',
    
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
    ]
  }
];

// Export individual consultation by ID for easy access
export const getConsultationById = (id: string): (GeneralConsultationFormData & { id: string }) | undefined => {
  return mockConsultations.find(consultation => consultation.id === id);
};

// Export consultation by client ID (single consultation per client)
export const getConsultationByClientId = (clientId: string): (GeneralConsultationFormData & { id: string }) | undefined => {
  return mockConsultations.find(consultation => consultation.clientId === clientId);
};

// Default export
export default mockConsultations;