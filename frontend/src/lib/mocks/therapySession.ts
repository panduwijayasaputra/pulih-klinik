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
  },
  // Sessions for th-001 therapist (User ID: 4 - Dr. Ahmad Rahman)
  {
    id: 'session-006',
    sessionNumber: 1,
    title: 'Assessment Awal dan Anxiety Management',
    description: 'Sesi pertama untuk assessment mendalam dan pengenalan teknik manajemen kecemasan',
    date: '2024-08-15',
    time: '10:00',
    duration: 90,
    status: TherapySessionStatusEnum.Completed,
    notes: 'Sesi berjalan dengan baik. Klien terbuka dan kooperatif dalam assessment.',
    techniques: ['Assessment', 'Anxiety Management'],
    issues: ['Workplace Anxiety', 'Stress Management'],
    progress: 'Baik',
    clientId: 'client-001',
    therapistId: '4',
    createdAt: '2024-08-10T09:00:00Z',
    updatedAt: '2024-08-15T11:00:00Z'
  },
  {
    id: 'session-007',
    sessionNumber: 2,
    title: 'Cognitive Behavioral Therapy dan Stress Relief',
    description: 'Fokus pada CBT untuk mengatasi kecemasan dan teknik relaksasi',
    date: '2024-08-22',
    time: '10:00',
    duration: 90,
    status: TherapySessionStatusEnum.Completed,
    notes: 'Klien menunjukkan kemajuan dalam teknik relaksasi.',
    techniques: ['CBT', 'Relaxation Techniques'],
    issues: ['Workplace Anxiety', 'Stress Management'],
    progress: 'Sangat Baik',
    clientId: 'client-001',
    therapistId: '4',
    createdAt: '2024-08-15T11:00:00Z',
    updatedAt: '2024-08-22T11:00:00Z'
  },
  {
    id: 'session-008',
    sessionNumber: 3,
    title: 'Advanced Stress Management dan Work-Life Balance',
    description: 'Sesi lanjutan untuk manajemen stress dan keseimbangan kerja-hidup',
    date: '2024-08-29',
    time: '10:00',
    duration: 90,
    status: TherapySessionStatusEnum.Scheduled,
    techniques: ['Stress Management', 'Work-Life Balance'],
    issues: ['Workplace Anxiety', 'Stress Management'],
    clientId: 'client-001',
    therapistId: '4',
    createdAt: '2024-08-22T11:00:00Z',
    updatedAt: '2024-08-22T11:00:00Z'
  },
  {
    id: 'session-009',
    sessionNumber: 1,
    title: 'Burnout Recovery dan Self-Care',
    description: 'Sesi untuk pemulihan burnout dan pengembangan self-care routine',
    date: '2024-08-20',
    time: '14:00',
    duration: 90,
    status: TherapySessionStatusEnum.Completed,
    notes: 'Klien menunjukkan pemahaman yang baik tentang self-care.',
    techniques: ['Burnout Recovery', 'Self-Care'],
    issues: ['Burnout Syndrome', 'Work Stress'],
    progress: 'Baik',
    clientId: 'client-005',
    therapistId: '4',
    createdAt: '2024-08-15T13:00:00Z',
    updatedAt: '2024-08-20T15:00:00Z'
  },
  {
    id: 'session-010',
    sessionNumber: 2,
    title: 'Mindfulness dan Stress Reduction',
    description: 'Pengenalan mindfulness dan teknik pengurangan stress',
    date: '2024-08-27',
    time: '14:00',
    duration: 90,
    status: TherapySessionStatusEnum.Scheduled,
    techniques: ['Mindfulness', 'Stress Reduction'],
    issues: ['Burnout Syndrome', 'Work Stress'],
    clientId: 'client-005',
    therapistId: '4',
    createdAt: '2024-08-20T15:00:00Z',
    updatedAt: '2024-08-20T15:00:00Z'
  },
  {
    id: 'session-011',
    sessionNumber: 1,
    title: 'Social Anxiety Assessment dan Exposure Therapy',
    description: 'Assessment kecemasan sosial dan pengenalan exposure therapy',
    date: '2024-08-12',
    time: '16:00',
    duration: 90,
    status: TherapySessionStatusEnum.Completed,
    notes: 'Klien terbuka tentang kecemasan sosialnya.',
    techniques: ['Assessment', 'Exposure Therapy'],
    issues: ['Social Anxiety', 'Communication Skills'],
    progress: 'Baik',
    clientId: 'client-007',
    therapistId: '4',
    createdAt: '2024-08-10T15:00:00Z',
    updatedAt: '2024-08-12T17:00:00Z'
  },
  {
    id: 'session-012',
    sessionNumber: 2,
    title: 'Communication Skills dan Confidence Building',
    description: 'Pengembangan keterampilan komunikasi dan membangun kepercayaan diri',
    date: '2024-08-19',
    time: '16:00',
    duration: 90,
    status: TherapySessionStatusEnum.Scheduled,
    techniques: ['Communication Skills', 'Confidence Building'],
    issues: ['Social Anxiety', 'Communication Skills'],
    clientId: 'client-007',
    therapistId: '4',
    createdAt: '2024-08-12T17:00:00Z',
    updatedAt: '2024-08-12T17:00:00Z'
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
