import { ConsultationFormTypeEnum, ConsultationStatusEnum } from '../../types/enums';
import { GeneralConsultationFormData } from '../../schemas/consultationSchema';

// Mock consultation data for clients
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
  },
  {
    // Basic consultation info
    id: 'consultation-client-004-001',
    clientId: 'client-004',
    therapistId: 'th-001',
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
    familyPsychologicalHistory: false,
    familyPsychologicalHistoryDetails: '',
    
    // Presenting concerns
    primaryConcern: 'Mengalami kesulitan dalam membangun hubungan interpersonal yang sehat. Sering merasa tidak percaya diri dalam situasi sosial, takut ditolak atau dihakimi oleh orang lain. Kesulitan dalam mengekspresikan perasaan dan kebutuhan secara asertif. Gejala fisik berupa gemetar, berkeringat, dan jantung berdebar saat harus berbicara di depan umum atau bertemu orang baru.',
    secondaryConcerns: [
      'Kesulitan dalam mempertahankan pertemanan jangka panjang',
      'Takut akan penolakan dan kritik dari orang lain',
      'Kesulitan dalam mengekspresikan pendapat di kelas',
      'Merasa tidak cukup baik untuk diterima oleh teman-teman',
      'Kesulitan dalam membangun hubungan romantis'
    ],
    symptomSeverity: 5,
    symptomDuration: '2 tahun',
    
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
    recentMoodState: 'bad',
    recentMoodStateDetails: 'Mood cenderung rendah terutama saat harus menghadapi situasi sosial. Lebih baik saat sendirian atau dengan keluarga. Sering merasa lonely meskipun dikelilingi teman.',
    frequentEmotions: ['cemas', 'tidak percaya diri', 'kesepian', 'takut', 'malu'],
    
    // Self-harm and stress assessment
    selfHarmThoughts: 'never',
    dailyStressFrequency: 'often',
    
    // Goals and expectations
    treatmentGoals: [
      'Meningkatkan kepercayaan diri dalam situasi sosial',
      'Mengembangkan keterampilan komunikasi yang lebih baik',
      'Mengatasi social anxiety dan ketakutan akan penolakan',
      'Membangun hubungan interpersonal yang lebih sehat',
      'Meningkatkan self-esteem dan self-worth'
    ],
    clientExpectations: 'Berharap dapat menemukan cara untuk mengatasi ketakutan sosial dan membangun kepercayaan diri. Ingin belajar teknik untuk mengelola anxiety dan mengembangkan keterampilan sosial yang lebih baik.',
    
    // Assessment results
    initialAssessment: 'Klien menunjukkan gejala Social Anxiety Disorder dengan komponen low self-esteem dan kesulitan dalam interpersonal relationships. Tidak ada indikasi gangguan mood mayor. Memiliki insight yang baik dan motivasi tinggi untuk perubahan. Fungsi akademik tetap baik meskipun mengalami kesulitan dalam partisipasi kelas. Respons terhadap hypnotherapy kemungkinan baik mengingat kepribadian yang kreatif dan reflektif.',
    recommendedTreatmentPlan: 'Hipnoterapi dengan fokus pada: 1) Confidence building dan self-esteem enhancement, 2) Social skills training dan communication techniques, 3) Anxiety management dan relaxation techniques, 4) Cognitive restructuring untuk mengatasi negative self-talk, 5) Exposure therapy untuk social situations. Estimasi 8-10 sesi dengan evaluasi setiap 3 sesi.',
    
    // General consultation specific fields
    currentLifeStressors: [
      'Tugas kuliah dan presentasi di depan kelas',
      'Pertemanan dan hubungan interpersonal',
      'Ekspektasi keluarga terhadap prestasi akademik',
      'Kesulitan dalam mengekspresikan diri',
      'Perbandingan dengan teman-teman yang lebih percaya diri'
    ],
    supportSystem: 'Keluarga sangat supportive meskipun tidak sepenuhnya memahami kondisi klien. Memiliki beberapa teman dekat yang supportive. Aktif di komunitas online untuk hobi musik dan seni.',
    workLifeBalance: 3, // Skala 1-5, 3 = sedang
    
    // Mental health history
    familyMentalHealthHistory: false,
    familyMentalHealthDetails: '',
    previousMentalHealthDiagnosis: false,
    
    // Lifestyle factors
    sleepPatterns: 'Tidur sekitar pukul 23:00-00:00, bangun pukul 07:00. Kualitas tidur bervariasi tergantung tingkat stress. Sering mengalami insomnia saat ada tugas atau presentasi keesokan harinya.',
    exerciseFrequency: '1-2x per minggu yoga atau jalan-jalan santai. Lebih sering berolahraga saat mood sedang baik.',
    dietaryHabits: 'Pola makan cukup teratur tapi kadang skip meals saat stress atau cemas. Lebih suka makan sendiri daripada dengan teman. Konsumsi kopi 1-2 cups per hari.',
    socialConnections: 'Memiliki circle pertemanan kecil tapi dekat. Lebih nyaman berkomunikasi melalui text atau online. Kesulitan dalam situasi sosial yang melibatkan banyak orang.',
    
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