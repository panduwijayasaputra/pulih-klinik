import type { SessionSummary } from '@/types/client';
import { ClientEducationEnum } from '@/types/enums';

// Mock therapist data for session history
export const mockTherapists = {
  'therapist-001': 'Dr. Ahmad Pratama, M.Psi',
  'therapist-002': 'Dr. Sari Wulandari, M.Psi',
  'therapist-003': 'Dr. Budi Santoso, M.Psi',
  'therapist-004': 'Dr. Rina Kartika, M.Psi',
  'therapist-005': 'Dr. Hendra Wijaya, M.Psi',
};

// Assessment tools and their descriptions
export const assessmentTools = {
  'GAD-7': 'Generalized Anxiety Disorder Assessment',
  'PHQ-9': 'Patient Health Questionnaire for Depression',
  'ISI': 'Insomnia Severity Index',
  'LSAS': 'Liebowitz Social Anxiety Scale',
  'PCL-5': 'PTSD Checklist for DSM-5',
  'BDI-II': 'Beck Depression Inventory-II',
  'STAI': 'State-Trait Anxiety Inventory',
  'PSQI': 'Pittsburgh Sleep Quality Index',
};

// Comprehensive mock session data
export const mockSessionData: Record<string, SessionSummary[]> = {
  CLT001: [
    {
      id: 'sess-001',
      clientId: 'CLT001',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-05T09:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Anamnesis awal dan penetapan tujuan. Klien melaporkan gejala kecemasan yang mengganggu aktivitas sehari-hari. Riwayat keluarga positif untuk gangguan kecemasan. Gejala utama: kekhawatiran berlebihan, kesulitan konsentrasi, gangguan tidur.',
      assessment: { 
        tool: 'GAD-7', 
        preScore: 14, 
        scoreUnit: 'points', 
        notes: 'Skor tinggi menunjukkan kecemasan sedang-berat. Gejala klinis yang signifikan.' 
      },
    },
    {
      id: 'sess-002',
      clientId: 'CLT001',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-12T09:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Induksi ringan, latihan relaksasi progresif. Klien merespons baik terhadap teknik pernapasan. Mulai memperkenalkan konsep mindfulness. Latihan grounding techniques untuk mengatasi serangan panik.',
    },
    {
      id: 'sess-003',
      clientId: 'CLT001',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-19T09:00:00Z',
      phase: 'therapy',
      status: 'completed',
      durationMinutes: 75,
      notes: 'Intervensi kognitif, reframing pikiran negatif. Latihan identifikasi dan tantangan cognitive distortions. Klien menunjukkan kemajuan dalam mengenali pola pikir. Latihan thought record untuk monitoring pikiran otomatis.',
    },
    {
      id: 'sess-004',
      clientId: 'CLT001',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-26T09:00:00Z',
      phase: 'post',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Evaluasi kemajuan, rencana tindak lanjut. Klien melaporkan penurunan gejala kecemasan yang signifikan. Direncanakan follow-up 3 bulan. Reinforcement teknik coping dan relapse prevention.',
      assessment: { 
        tool: 'GAD-7', 
        postScore: 8, 
        scoreUnit: 'points', 
        notes: 'Penurunan 6 poin menunjukkan perbaikan klinis yang signifikan. Gejala dalam rentang normal.' 
      },
    },
    {
      id: 'sess-005',
      clientId: 'CLT001',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-02-02T09:00:00Z',
      phase: 'therapy',
      status: 'scheduled',
      durationMinutes: 60,
      notes: 'Sesi follow-up untuk evaluasi kemajuan dan reinforcement teknik coping. Fokus pada maintenance dan pencegahan kekambuhan.',
    },
  ],
  CLT002: [
    {
      id: 'sess-101',
      clientId: 'CLT002',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-10T10:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Screening awal dan penilaian gejala depresi. Klien melaporkan mood rendah, kehilangan minat, dan gangguan tidur selama 3 bulan terakhir. Riwayat episode depresi sebelumnya.',
      assessment: { 
        tool: 'PHQ-9', 
        preScore: 12, 
        scoreUnit: 'points', 
        notes: 'Skor menunjukkan depresi ringan-sedang. Gejala klinis yang memerlukan intervensi.' 
      },
    },
    {
      id: 'sess-102',
      clientId: 'CLT002',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-17T10:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 45,
      notes: 'Induksi hipnosis untuk relaksasi dan pengurangan gejala. Klien merespons baik terhadap sugesti relaksasi. Latihan self-hypnosis untuk mood regulation.',
    },
    {
      id: 'sess-103',
      clientId: 'CLT002',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-24T10:00:00Z',
      phase: 'therapy',
      status: 'cancelled',
      durationMinutes: 0,
      notes: 'Sesi dibatalkan karena klien sakit. Dijadwalkan ulang untuk minggu depan. Klien akan menghubungi untuk konfirmasi.',
    },
    {
      id: 'sess-104',
      clientId: 'CLT002',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-31T10:00:00Z',
      phase: 'therapy',
      status: 'scheduled',
      durationMinutes: 60,
      notes: 'Terapi CBT untuk depresi. Fokus pada behavioral activation dan cognitive restructuring.',
    },
  ],
  CLT003: [
    {
      id: 'sess-201',
      clientId: 'CLT003',
      therapistId: 'therapist-003',
      therapistName: mockTherapists['therapist-003'],
      date: '2024-01-15T14:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 90,
      notes: 'Konsultasi awal untuk masalah insomnia. Klien mengalami kesulitan tidur selama 6 bulan dengan riwayat stres kerja. Gejala: kesulitan tidur, terbangun dini, kualitas tidur buruk.',
      assessment: { 
        tool: 'ISI', 
        preScore: 18, 
        scoreUnit: 'points', 
        notes: 'Skor tinggi menunjukkan insomnia klinis. Dampak signifikan pada fungsi sehari-hari.' 
      },
    },
    {
      id: 'sess-202',
      clientId: 'CLT003',
      therapistId: 'therapist-003',
      therapistName: mockTherapists['therapist-003'],
      date: '2024-01-22T14:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Induksi hipnosis untuk sleep hygiene dan relaksasi. Latihan teknik self-hypnosis untuk tidur. Edukasi tentang sleep hygiene dan stimulus control.',
    },
    {
      id: 'sess-203',
      clientId: 'CLT003',
      therapistId: 'therapist-003',
      therapistName: mockTherapists['therapist-003'],
      date: '2024-01-29T14:00:00Z',
      phase: 'therapy',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Terapi CBT untuk insomnia. Latihan stimulus control dan sleep restriction. Klien melaporkan perbaikan kualitas tidur. Latihan relaxation techniques.',
      assessment: { 
        tool: 'ISI', 
        postScore: 12, 
        scoreUnit: 'points', 
        notes: 'Penurunan 6 poin menunjukkan perbaikan signifikan. Gejala insomnia berkurang.' 
      },
    },
  ],
  CLT004: [
    {
      id: 'sess-301',
      clientId: 'CLT004',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-08T11:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Konsultasi untuk fobia sosial. Klien mengalami kecemasan berlebihan dalam situasi sosial. Gejala: takut dinilai, menghindari situasi sosial, gejala fisik saat cemas.',
      assessment: { 
        tool: 'LSAS', 
        preScore: 65, 
        scoreUnit: 'points', 
        notes: 'Skor tinggi menunjukkan fobia sosial berat. Dampak signifikan pada fungsi sosial.' 
      },
    },
    {
      id: 'sess-302',
      clientId: 'CLT004',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-15T11:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Induksi hipnosis untuk desensitisasi. Latihan relaksasi dan visualisasi situasi sosial. Latihan breathing techniques untuk mengatasi gejala fisik.',
    },
    {
      id: 'sess-303',
      clientId: 'CLT004',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-22T11:00:00Z',
      phase: 'therapy',
      status: 'completed',
      durationMinutes: 75,
      notes: 'Terapi exposure dan cognitive restructuring. Latihan gradual exposure ke situasi sosial. Latihan challenging negative thoughts tentang evaluasi sosial.',
    },
    {
      id: 'sess-304',
      clientId: 'CLT004',
      therapistId: 'therapist-001',
      therapistName: mockTherapists['therapist-001'],
      date: '2024-01-29T11:00:00Z',
      phase: 'post',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Evaluasi kemajuan dan reinforcement teknik coping. Klien melaporkan penurunan kecemasan sosial. Latihan maintenance dan relapse prevention.',
      assessment: { 
        tool: 'LSAS', 
        postScore: 42, 
        scoreUnit: 'points', 
        notes: 'Penurunan 23 poin menunjukkan perbaikan klinis. Gejala fobia sosial berkurang signifikan.' 
      },
    },
  ],
  CLT005: [
    {
      id: 'sess-401',
      clientId: 'CLT005',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-12T13:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Konsultasi untuk trauma masa kecil. Klien mengalami gejala PTSD ringan. Gejala: flashback, hypervigilance, gangguan tidur, mood swings.',
      assessment: { 
        tool: 'PCL-5', 
        preScore: 28, 
        scoreUnit: 'points', 
        notes: 'Skor menunjukkan gejala PTSD ringan. Gejala klinis yang memerlukan intervensi trauma-informed.' 
      },
    },
    {
      id: 'sess-402',
      clientId: 'CLT005',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-19T13:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Induksi hipnosis untuk safe place dan resource installation. Latihan grounding techniques. Latihan containment untuk mengelola flashback.',
    },
    {
      id: 'sess-403',
      clientId: 'CLT005',
      therapistId: 'therapist-002',
      therapistName: mockTherapists['therapist-002'],
      date: '2024-01-26T13:00:00Z',
      phase: 'therapy',
      status: 'scheduled',
      durationMinutes: 60,
      notes: 'Terapi EMDR untuk pemrosesan trauma. Sesi akan dilanjutkan minggu depan. Persiapan untuk trauma processing.',
    },
  ],
  CLT006: [
    {
      id: 'sess-501',
      clientId: 'CLT006',
      therapistId: 'therapist-004',
      therapistName: mockTherapists['therapist-004'],
      date: '2024-01-20T15:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Konsultasi untuk masalah stres kerja. Klien mengalami burnout dan kesulitan mengelola stres. Gejala: kelelahan, irritability, kesulitan konsentrasi.',
      assessment: { 
        tool: 'STAI', 
        preScore: 52, 
        scoreUnit: 'points', 
        notes: 'Skor tinggi menunjukkan kecemasan state yang signifikan terkait stres kerja.' 
      },
    },
    {
      id: 'sess-502',
      clientId: 'CLT006',
      therapistId: 'therapist-004',
      therapistName: mockTherapists['therapist-004'],
      date: '2024-01-27T15:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Induksi hipnosis untuk stress management. Latihan progressive muscle relaxation. Latihan mindfulness untuk workplace stress.',
    },
  ],
  CLT007: [
    {
      id: 'sess-601',
      clientId: 'CLT007',
      therapistId: 'therapist-005',
      therapistName: mockTherapists['therapist-005'],
      date: '2024-01-18T16:00:00Z',
      phase: 'intake',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Konsultasi untuk masalah kepercayaan diri. Klien mengalami low self-esteem dan kesulitan dalam pengambilan keputusan. Gejala: self-doubt, perfectionism, fear of failure.',
      assessment: { 
        tool: 'BDI-II', 
        preScore: 15, 
        scoreUnit: 'points', 
        notes: 'Skor menunjukkan gejala depresi ringan terkait masalah kepercayaan diri.' 
      },
    },
    {
      id: 'sess-602',
      clientId: 'CLT007',
      therapistId: 'therapist-005',
      therapistName: mockTherapists['therapist-005'],
      date: '2024-01-25T16:00:00Z',
      phase: 'induction',
      status: 'completed',
      durationMinutes: 60,
      notes: 'Induksi hipnosis untuk self-esteem building. Latihan positive self-talk dan self-compassion. Latihan visualization untuk confidence building.',
    },
    {
      id: 'sess-603',
      clientId: 'CLT007',
      therapistId: 'therapist-005',
      therapistName: mockTherapists['therapist-005'],
      date: '2024-02-01T16:00:00Z',
      phase: 'therapy',
      status: 'scheduled',
      durationMinutes: 60,
      notes: 'Terapi CBT untuk self-esteem. Fokus pada challenging negative core beliefs dan building self-efficacy.',
    },
  ],
};

// Helper function to get session data for a client
export const getClientSessions = (clientId: string): SessionSummary[] => {
  return mockSessionData[clientId] || [];
};

// Helper function to get therapist name
export const getTherapistName = (therapistId: string): string => {
  return mockTherapists[therapistId] || 'Unknown Therapist';
};

// Helper function to get assessment tool description
export const getAssessmentToolDescription = (tool: string): string => {
  return assessmentTools[tool as keyof typeof assessmentTools] || tool;
};

// Utility function to generate mock session data for testing
export const generateMockSessions = (
  clientId: string,
  therapistId: string,
  therapistName: string,
  count: number = 5,
  startDate: Date = new Date('2024-01-01')
): SessionSummary[] => {
  const sessions: SessionSummary[] = [];
  const phases: Array<'intake' | 'induction' | 'therapy' | 'post'> = ['intake', 'induction', 'therapy', 'post'];
  const statuses: Array<'completed' | 'scheduled' | 'cancelled'> = ['completed', 'scheduled', 'cancelled'];
  const assessmentTools = ['GAD-7', 'PHQ-9', 'ISI', 'LSAS', 'PCL-5', 'BDI-II', 'STAI'];
  
  for (let i = 0; i < count; i++) {
    const sessionDate = new Date(startDate);
    sessionDate.setDate(startDate.getDate() + (i * 7)); // Weekly sessions
    
    const phase = phases[Math.min(i, phases.length - 1)];
    const status = i === count - 1 ? 'scheduled' : statuses[Math.floor(Math.random() * 2)]; // Last session is scheduled
    const durationMinutes = Math.random() > 0.8 ? 90 : Math.random() > 0.5 ? 75 : 60;
    
    const session: SessionSummary = {
      id: `sess-${clientId}-${String(i + 1).padStart(3, '0')}`,
      clientId,
      therapistId,
      therapistName,
      date: sessionDate.toISOString(),
      phase,
      status,
      durationMinutes,
      notes: generateSessionNotes(phase, status),
    };
    
    // Add assessment for intake and post sessions
    if (phase === 'intake' || phase === 'post') {
      const tool = assessmentTools[Math.floor(Math.random() * assessmentTools.length)];
      const score = Math.floor(Math.random() * 20) + 5; // Random score between 5-25
      
      session.assessment = {
        tool,
        [phase === 'intake' ? 'preScore' : 'postScore']: score,
        scoreUnit: 'points',
        notes: generateAssessmentNotes(tool, score, phase),
      };
    }
    
    sessions.push(session);
  }
  
  return sessions;
};

// Helper function to generate realistic session notes
const generateSessionNotes = (phase: string, status: string): string => {
  const notesByPhase = {
    intake: [
      'Anamnesis awal dan penetapan tujuan terapi. Klien melaporkan gejala yang mengganggu aktivitas sehari-hari.',
      'Screening awal dan penilaian gejala. Evaluasi riwayat kesehatan mental dan faktor risiko.',
      'Konsultasi awal untuk masalah yang dialami. Penetapan rencana terapi dan ekspektasi klien.',
    ],
    induction: [
      'Induksi hipnosis untuk relaksasi dan pengurangan gejala. Klien merespons baik terhadap teknik pernapasan.',
      'Latihan relaksasi progresif dan grounding techniques. Mulai memperkenalkan konsep mindfulness.',
      'Induksi ringan untuk desensitisasi. Latihan visualisasi dan self-hypnosis.',
    ],
    therapy: [
      'Intervensi kognitif dan behavioral. Latihan identifikasi dan tantangan cognitive distortions.',
      'Terapi exposure dan cognitive restructuring. Latihan gradual exposure ke situasi yang ditakuti.',
      'Pemrosesan trauma dan resource installation. Latihan containment dan grounding techniques.',
    ],
    post: [
      'Evaluasi kemajuan dan rencana tindak lanjut. Reinforcement teknik coping dan relapse prevention.',
      'Penilaian hasil terapi dan maintenance plan. Direncanakan follow-up untuk monitoring.',
      'Konsolidasi kemajuan dan strategi pencegahan kekambuhan. Latihan maintenance techniques.',
    ],
  };
  
  const baseNotes = notesByPhase[phase as keyof typeof notesByPhase] || ['Sesi terapi berlangsung dengan baik.'];
  const selectedNote = baseNotes[Math.floor(Math.random() * baseNotes.length)];
  
  if (status === 'cancelled') {
    return `Sesi dibatalkan karena ${Math.random() > 0.5 ? 'klien sakit' : 'jadwal konflik'}. Dijadwalkan ulang untuk minggu depan.`;
  }
  
  return selectedNote;
};

// Helper function to generate assessment notes
const generateAssessmentNotes = (tool: string, score: number, phase: string): string => {
  const toolDescriptions = {
    'GAD-7': 'Generalized Anxiety Disorder Assessment',
    'PHQ-9': 'Patient Health Questionnaire for Depression',
    'ISI': 'Insomnia Severity Index',
    'LSAS': 'Liebowitz Social Anxiety Scale',
    'PCL-5': 'PTSD Checklist for DSM-5',
    'BDI-II': 'Beck Depression Inventory-II',
    'STAI': 'State-Trait Anxiety Inventory',
  };
  
  const severity = score > 15 ? 'berat' : score > 10 ? 'sedang' : 'ringan';
  const improvement = phase === 'post' ? 'Penurunan skor menunjukkan perbaikan klinis yang signifikan.' : '';
  
  return `Skor ${score} menunjukkan gejala ${severity}. ${improvement}`;
};

// Function to add mock sessions to existing data
export const addMockSessionsToClient = (clientId: string, count: number = 3): void => {
  const therapistId = 'therapist-001';
  const therapistName = mockTherapists[therapistId];
  
  const newSessions = generateMockSessions(clientId, therapistId, therapistName, count);
  
  if (!mockSessionData[clientId]) {
    mockSessionData[clientId] = [];
  }
  
  mockSessionData[clientId].push(...newSessions);
};

// Function to get session statistics for a client
export const getSessionStats = (clientId: string) => {
  const sessions = getClientSessions(clientId);
  
  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
    totalDuration: sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
    phases: {
      intake: sessions.filter(s => s.phase === 'intake').length,
      induction: sessions.filter(s => s.phase === 'induction').length,
      therapy: sessions.filter(s => s.phase === 'therapy').length,
      post: sessions.filter(s => s.phase === 'post').length,
    },
    assessments: sessions.filter(s => s.assessment).length,
  };
  
  return stats;
};

// Comprehensive mock client data with new fields
export const mockClients = [
  {
    id: 'CLT001',
    fullName: 'Ahmad Rizki Pratama',
    gender: 'Male' as const,
    birthPlace: 'Jakarta',
    birthDate: '1990-05-15',
    religion: 'Islam' as const,
    occupation: 'Software Engineer',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Teknik Informatika',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+6281234567890',
    email: 'ahmad.rizki@email.com',
    hobbies: 'Membaca, Olahraga, Traveling',
    maritalStatus: 'Married' as const,
    spouseName: 'Siti Nurhaliza',
    relationshipWithSpouse: 'Good' as const,
    emergencyContact: 'Siti Nurhaliza - +6281234567891 (Istri)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-001',
    status: 'active' as const,
    joinDate: '2024-01-01',
    totalSessions: 5,
    lastSession: '2024-02-02',
    progress: 75,
    notes: 'Klien menunjukkan kemajuan yang signifikan dalam mengatasi kecemasan. Responsif terhadap teknik relaksasi dan cognitive restructuring.',
    province: 'DKI Jakarta',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Ahmad Rizki Pratama',
    age: 33,
    primaryIssue: 'Gangguan Kecemasan',
    emergencyContactDetails: {
      name: 'Siti Nurhaliza',
      phone: '+6281234567891',
      relationship: 'Istri'
    }
  },
  {
    id: 'CLT002',
    fullName: 'Sarah Amanda Putri',
    gender: 'Female' as const,
    birthPlace: 'Bandung',
    birthDate: '1988-12-20',
    religion: 'Christianity' as const,
    occupation: 'Marketing Manager',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Manajemen',
    address: 'Jl. Asia Afrika No. 456, Bandung',
    phone: '+6282345678901',
    email: 'sarah.amanda@email.com',
    hobbies: 'Yoga, Menulis, Musik',
    maritalStatus: 'Single' as const,
    spouseName: '',
    relationshipWithSpouse: undefined,
    emergencyContact: 'Budi Santoso - +6282345678902 (Ayah)',
    firstVisit: false,
    previousVisitDetails: 'Pernah berkonsultasi dengan psikolog untuk masalah stres kerja selama 6 bulan. Mengalami gejala depresi ringan dan kesulitan tidur.',
    assignedTherapist: 'therapist-002',
    status: 'active' as const,
    joinDate: '2024-01-10',
    totalSessions: 4,
    lastSession: '2024-01-31',
    progress: 60,
    notes: 'Klien mengalami gejala depresi ringan, sedang dalam proses terapi. Responsif terhadap behavioral activation dan cognitive restructuring.',
    province: 'Jawa Barat',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Sarah Amanda Putri',
    age: 35,
    primaryIssue: 'Depresi',
    emergencyContactDetails: {
      name: 'Budi Santoso',
      phone: '+6282345678902',
      relationship: 'Ayah'
    }
  },
  {
    id: 'CLT003',
    fullName: 'Budi Santoso',
    gender: 'Male' as const,
    birthPlace: 'Surabaya',
    birthDate: '1975-08-10',
    religion: 'Islam' as const,
    occupation: 'Dokter Spesialis Jantung',
    education: ClientEducationEnum.Master,
    educationMajor: 'Kedokteran',
    address: 'Jl. Pemuda No. 789, Surabaya',
    phone: '+6283456789012',
    email: 'budi.santoso@email.com',
    hobbies: 'Golf, Membaca, Fotografi',
    maritalStatus: 'Married' as const,
    spouseName: 'Rina Kartika',
    relationshipWithSpouse: 'Average' as const,
    emergencyContact: 'Rina Kartika - +6283456789013 (Istri)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-003',
    status: 'active' as const,
    joinDate: '2024-01-15',
    totalSessions: 3,
    lastSession: '2024-01-29',
    progress: 40,
    notes: 'Klien mengalami insomnia kronis selama 2 tahun, sedang dalam tahap induksi hipnosis. Responsif terhadap teknik relaksasi progresif.',
    province: 'Jawa Timur',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Budi Santoso',
    age: 48,
    primaryIssue: 'Insomnia',
    emergencyContactDetails: {
      name: 'Rina Kartika',
      phone: '+6283456789013',
      relationship: 'Istri'
    }
  },
  {
    id: 'CLT004',
    fullName: 'Dewi Sartika',
    gender: 'Female' as const,
    birthPlace: 'Yogyakarta',
    birthDate: '1992-03-25',
    religion: 'Islam' as const,
    occupation: 'Guru SMA',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Pendidikan Bahasa Indonesia',
    address: 'Jl. Malioboro No. 321, Yogyakarta',
    phone: '+6284567890123',
    email: 'dewi.sartika@email.com',
    hobbies: 'Membaca, Menulis, Berkebun',
    maritalStatus: 'Single' as const,
    spouseName: '',
    relationshipWithSpouse: undefined,
    emergencyContact: 'Siti Aminah - +6284567890124 (Ibu)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-001',
    status: 'active' as const,
    joinDate: '2024-01-08',
    totalSessions: 4,
    lastSession: '2024-01-29',
    progress: 80,
    notes: 'Klien mengalami fobia sosial, menunjukkan kemajuan dalam terapi exposure. Berhasil mengatasi kecemasan dalam situasi sosial.',
    province: 'DI Yogyakarta',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Dewi Sartika',
    age: 31,
    primaryIssue: 'Fobia Sosial',
    emergencyContactDetails: {
      name: 'Siti Aminah',
      phone: '+6284567890124',
      relationship: 'Ibu'
    }
  },
  {
    id: 'CLT005',
    fullName: 'Eko Prasetyo',
    gender: 'Male' as const,
    birthPlace: 'Semarang',
    birthDate: '1985-11-05',
    religion: 'Islam' as const,
    occupation: 'Pengacara',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Hukum',
    address: 'Jl. Pandanaran No. 654, Semarang',
    phone: '+6285678901234',
    email: 'eko.prasetyo@email.com',
    hobbies: 'Membaca, Berenang, Musik',
    maritalStatus: 'Widowed' as const,
    spouseName: '',
    relationshipWithSpouse: undefined,
    emergencyContact: 'Sri Wahyuni - +6285678901235 (Saudara)',
    firstVisit: false,
    previousVisitDetails: 'Pernah menjalani terapi untuk trauma kehilangan pasangan selama 1 tahun. Mengalami gejala PTSD ringan dan kesulitan tidur.',
    assignedTherapist: 'therapist-002',
    status: 'active' as const,
    joinDate: '2024-01-12',
    totalSessions: 3,
    lastSession: '2024-01-26',
    progress: 50,
    notes: 'Klien mengalami trauma kehilangan pasangan, sedang dalam proses pemulihan. Responsif terhadap teknik grounding dan containment.',
    province: 'Jawa Tengah',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Eko Prasetyo',
    age: 38,
    primaryIssue: 'Trauma',
    emergencyContactDetails: {
      name: 'Sri Wahyuni',
      phone: '+6285678901235',
      relationship: 'Saudara'
    }
  },
  {
    id: 'CLT006',
    fullName: 'Fitri Handayani',
    gender: 'Female' as const,
    birthPlace: 'Medan',
    birthDate: '1995-07-18',
    religion: 'Islam' as const,
    occupation: 'Akuntan Senior',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Akuntansi',
    address: 'Jl. Diponegoro No. 987, Medan',
    phone: '+6286789012345',
    email: 'fitri.handayani@email.com',
    hobbies: 'Menari, Memasak, Traveling',
    maritalStatus: 'Single' as const,
    spouseName: '',
    relationshipWithSpouse: undefined,
    emergencyContact: 'Ahmad Hidayat - +6286789012346 (Ayah)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-004',
    status: 'active' as const,
    joinDate: '2024-01-20',
    totalSessions: 2,
    lastSession: '2024-01-27',
    progress: 30,
    notes: 'Klien mengalami stres kerja yang tinggi, sedang belajar teknik manajemen stres. Responsif terhadap progressive muscle relaxation.',
    province: 'Sumatera Utara',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Fitri Handayani',
    age: 28,
    primaryIssue: 'Stres Kerja',
    emergencyContactDetails: {
      name: 'Ahmad Hidayat',
      phone: '+6286789012346',
      relationship: 'Ayah'
    }
  },
  {
    id: 'CLT007',
    fullName: 'Gunawan Setiawan',
    gender: 'Male' as const,
    birthPlace: 'Palembang',
    birthDate: '1980-04-12',
    religion: 'Islam' as const,
    occupation: 'Pengusaha Restoran',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Ekonomi',
    address: 'Jl. Jenderal Sudirman No. 147, Palembang',
    phone: '+6287890123456',
    email: 'gunawan.setiawan@email.com',
    hobbies: 'Fitness, Golf, Membaca',
    maritalStatus: 'Married' as const,
    spouseName: 'Nurul Hidayah',
    relationshipWithSpouse: 'Good' as const,
    emergencyContact: 'Nurul Hidayah - +6287890123457 (Istri)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-005',
    status: 'active' as const,
    joinDate: '2024-01-18',
    totalSessions: 3,
    lastSession: '2024-02-01',
    progress: 45,
    notes: 'Klien mengalami masalah kepercayaan diri, sedang dalam proses building self-esteem. Responsif terhadap positive self-talk dan visualization.',
    province: 'Sumatera Selatan',
    // Minor-specific fields
    isMinor: false,
    school: undefined,
    grade: undefined,
    guardianFullName: undefined,
    guardianRelationship: undefined,
    guardianPhone: undefined,
    guardianAddress: undefined,
    guardianOccupation: undefined,
    guardianMaritalStatus: undefined,
    guardianLegalCustody: undefined,
    guardianCustodyDocsAttached: undefined,
    // Legacy fields
    name: 'Gunawan Setiawan',
    age: 43,
    primaryIssue: 'Masalah Kepercayaan Diri',
    emergencyContactDetails: {
      name: 'Nurul Hidayah',
      phone: '+6287890123457',
      relationship: 'Istri'
    }
  },
  {
    id: 'CLT008',
    fullName: 'Siti Nurhaliza',
    gender: 'Female' as const,
    birthPlace: 'Jakarta',
    birthDate: '2010-08-15',
    religion: 'Islam' as const,
    occupation: 'Pelajar',
    education: ClientEducationEnum.Middle,
    educationMajor: '',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+6281234567890',
    email: 'siti.nurhaliza@email.com',
    hobbies: 'Membaca, Menulis, Menggambar',
    maritalStatus: 'Single' as const,
    spouseName: '',
    relationshipWithSpouse: undefined,
    emergencyContact: 'Ahmad Rizki - +6281234567891 (Ayah)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-001',
    status: 'active' as const,
    joinDate: '2024-01-25',
    totalSessions: 2,
    lastSession: '2024-01-30',
    progress: 30,
    notes: 'Klien mengalami kecemasan sosial di sekolah. Responsif terhadap teknik relaksasi dan exposure therapy.',
    province: 'DKI Jakarta',
    // Minor-specific fields
    isMinor: true,
    school: 'SMP Negeri 1 Jakarta',
    grade: 'Kelas 2',
    guardianFullName: 'Ahmad Rizki Pratama',
    guardianRelationship: 'Father' as const,
    guardianPhone: '+6281234567891',
    guardianAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
    guardianOccupation: 'Software Engineer',
    guardianMaritalStatus: 'Married' as const,
    guardianLegalCustody: true,
    guardianCustodyDocsAttached: true,
    // Legacy fields
    name: 'Siti Nurhaliza',
    age: 13,
    primaryIssue: 'Kecemasan Sosial',
    emergencyContactDetails: {
      name: 'Ahmad Rizki Pratama',
      phone: '+6281234567891',
      relationship: 'Ayah'
    }
  },
  {
    id: 'CLT009',
    fullName: 'Rizki Pratama',
    gender: 'Male' as const,
    birthPlace: 'Bandung',
    birthDate: '2012-03-10',
    religion: 'Islam' as const,
    occupation: 'Pelajar',
    education: ClientEducationEnum.Elementary,
    educationMajor: '',
    address: 'Jl. Asia Afrika No. 789, Bandung',
    phone: '+6282345678903',
    email: 'rizki.pratama@email.com',
    hobbies: 'Sepak Bola, Menggambar, Bermain Game',
    maritalStatus: 'Single' as const,
    spouseName: '',
    relationshipWithSpouse: undefined,
    emergencyContact: 'Siti Aminah - +6282345678904 (Ibu)',
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: 'therapist-002',
    status: 'active' as const,
    joinDate: '2024-01-28',
    totalSessions: 1,
    lastSession: '2024-02-01',
    progress: 20,
    notes: 'Klien mengalami kesulitan konsentrasi di sekolah dan sering mengalami kecemasan saat ujian. Responsif terhadap teknik relaksasi dan breathing exercises.',
    province: 'Jawa Barat',
    // Minor-specific fields
    isMinor: true,
    school: 'SD Negeri 5 Bandung',
    grade: 'Kelas 5',
    guardianFullName: 'Siti Aminah',
    guardianRelationship: 'Mother' as const,
    guardianPhone: '+6282345678904',
    guardianAddress: 'Jl. Asia Afrika No. 789, Bandung',
    guardianOccupation: 'Guru SD',
    guardianMaritalStatus: 'Married' as const,
    guardianLegalCustody: true,
    guardianCustodyDocsAttached: true,
    // Legacy fields
    name: 'Rizki Pratama',
    age: 11,
    primaryIssue: 'Kesulitan Konsentrasi',
    emergencyContactDetails: {
      name: 'Siti Aminah',
      phone: '+6282345678904',
      relationship: 'Ibu'
    }
  }
];

// Helper function to get client by ID
export const getClientById = (clientId: string) => {
  return mockClients.find(client => client.id === clientId);
};

// Helper function to get all clients
export const getAllClients = () => {
  return mockClients;
};

// Helper function to filter clients
export const filterClients = (filters: {
  search?: string;
  status?: string;
  therapist?: string;
  province?: string;
}) => {
  let filteredClients = [...mockClients];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredClients = filteredClients.filter(client =>
      client.fullName.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status) {
    filteredClients = filteredClients.filter(client => client.status === filters.status);
  }

  if (filters.therapist) {
    filteredClients = filteredClients.filter(client => client.assignedTherapist === filters.therapist);
  }

  if (filters.province) {
    filteredClients = filteredClients.filter(client => client.province === filters.province);
  }

  return filteredClients;
};
