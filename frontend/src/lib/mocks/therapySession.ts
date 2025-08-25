import { TherapySession, AIPredictions, TherapySessionStatusEnum } from '@/types/therapySession';

// Mock therapy sessions data
export const mockTherapySessions: TherapySession[] = [
  {
    id: 'session-001',
    sessionNumber: 1,
    title: 'Assessment Awal dan Progressive Relaxation',
    description: 'Sesi pertama untuk assessment mendalam dan pengenalan teknik relaksasi progresif',
    date: '2024-08-20',
    time: '14:00',
    duration: 90,
    status: TherapySessionStatusEnum.Completed,
    notes: 'Sesi berjalan dengan baik. Klien merespons positif terhadap teknik relaksasi progresif.',
    techniques: ['Progressive Relaxation', 'Anchoring'],
    issues: ['Workplace Anxiety', 'Imposter Syndrome'],
    progress: 'Baik',
    clientId: 'client-002',
    therapistId: 'th-002',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-20T16:00:00Z'
  },
  {
    id: 'session-002',
    sessionNumber: 2,
    title: 'Cognitive Restructuring dan Confidence Building',
    description: 'Fokus pada restrukturisasi kognitif untuk mengatasi imposter syndrome',
    date: '2024-08-27',
    time: '14:00',
    duration: 90,
    status: TherapySessionStatusEnum.Scheduled,
    techniques: ['Cognitive Restructuring', 'Confidence Building'],
    issues: ['Imposter Syndrome', 'Performance Pressure'],
    clientId: 'client-002',
    therapistId: 'th-002',
    createdAt: '2024-08-20T16:00:00Z',
    updatedAt: '2024-08-20T16:00:00Z'
  },
  {
    id: 'session-003',
    sessionNumber: 3,
    title: 'Work-Life Balance dan Stress Management',
    description: 'Sesi untuk mengembangkan strategi work-life balance dan manajemen stress',
    date: '',
    time: '',
    duration: 90,
    status: TherapySessionStatusEnum.Planned,
    techniques: ['Stress Management', 'Time Management'],
    issues: ['Work-Life Balance', 'Stress Management'],
    clientId: 'client-002',
    therapistId: 'th-002',
    createdAt: '2024-08-25T10:00:00Z',
    updatedAt: '2024-08-25T10:00:00Z'
  },
  {
    id: 'session-004',
    sessionNumber: 4,
    title: 'Advanced Confidence Building dan Public Speaking',
    description: 'Sesi lanjutan untuk membangun kepercayaan diri dan keterampilan public speaking',
    date: '2024-09-03',
    time: '15:00',
    duration: 90,
    status: TherapySessionStatusEnum.InProgress,
    notes: 'Sesi sedang berlangsung. Klien menunjukkan kemajuan dalam kepercayaan diri.',
    techniques: ['Confidence Building', 'Public Speaking Training'],
    issues: ['Imposter Syndrome', 'Public Speaking Anxiety'],
    progress: 'Sangat Baik',
    clientId: 'client-002',
    therapistId: 'th-002',
    createdAt: '2024-08-30T14:00:00Z',
    updatedAt: '2024-09-03T15:30:00Z'
  },
  {
    id: 'session-005',
    sessionNumber: 5,
    title: 'Sleep Hygiene dan Relaxation Techniques',
    description: 'Sesi untuk memperbaiki kualitas tidur dan teknik relaksasi lanjutan',
    date: '2024-09-10',
    time: '14:00',
    duration: 90,
    status: TherapySessionStatusEnum.Cancelled,
    notes: 'Sesi dibatalkan karena klien sakit. Akan dijadwalkan ulang.',
    techniques: ['Sleep Hygiene', 'Advanced Relaxation'],
    issues: ['Sleep Disturbance', 'Anxiety'],
    clientId: 'client-002',
    therapistId: 'th-002',
    createdAt: '2024-09-05T11:00:00Z',
    updatedAt: '2024-09-08T16:00:00Z'
  }
];

// Mock session history for summary tab
export const mockSessionHistory = [
  {
    id: '1',
    type: 'Konsultasi',
    date: '2024-08-15',
    time: '10:00',
    duration: 60,
    notes: 'Assessment awal klien. Mengidentifikasi masalah workplace anxiety dan imposter syndrome.',
    techniques: ['Assessment', 'Interview'],
    progress: 'Sangat Baik',
    status: 'completed'
  },
  {
    id: '2',
    type: 'Sesi Terapi',
    date: '2024-08-20',
    time: '14:00',
    duration: 90,
    notes: 'Sesi pertama terapi. Pengenalan teknik relaksasi progresif dan anchoring.',
    techniques: ['Progressive Relaxation', 'Anchoring'],
    progress: 'Baik',
    status: 'completed'
  }
];

// Mock AI predictions
export const mockAIPredictions: AIPredictions = {
  issues: [
    { id: '1', name: 'Workplace Anxiety', confidence: 92 },
    { id: '2', name: 'Imposter Syndrome', confidence: 88 },
    { id: '3', name: 'Sleep Disturbance', confidence: 76 },
    { id: '4', name: 'Performance Pressure', confidence: 71 },
    { id: '5', name: 'Work-Life Balance Issues', confidence: 65 }
  ],
  techniques: [
    { id: '1', name: 'Progressive Muscle Relaxation', effectiveness: 89 },
    { id: '2', name: 'Cognitive Restructuring', effectiveness: 84 },
    { id: '3', name: 'Confidence Building', effectiveness: 81 },
    { id: '4', name: 'Stress Management Techniques', effectiveness: 78 },
    { id: '5', name: 'Sleep Hygiene Training', effectiveness: 74 },
    { id: '6', name: 'Anchoring Techniques', effectiveness: 69 }
  ]
};

// Helper functions
export const getTherapySessionsByClientId = (clientId: string): TherapySession[] => {
  return mockTherapySessions.filter(session => session.clientId === clientId);
};

export const getTherapySessionById = (sessionId: string): TherapySession | undefined => {
  return mockTherapySessions.find(session => session.id === sessionId);
};

export const getNextSessionNumber = (clientId: string): number => {
  const clientSessions = getTherapySessionsByClientId(clientId);
  return Math.max(...clientSessions.map(s => s.sessionNumber), 0) + 1;
};

export const generateAIPredictions = async (clientId: string): Promise<AIPredictions> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return mockAIPredictions;
};

// Default export
export default mockTherapySessions;
