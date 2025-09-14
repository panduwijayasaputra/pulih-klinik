import { TherapistClient, TherapistClientStats, TherapistClientSession, TherapistClientProgress } from '@/types/therapistClient';
import { 
  ClientStatusEnum, 
  ClientGenderEnum, 
  ClientReligionEnum, 
  ClientEducationEnum, 
  ClientMaritalStatusEnum, 
  ClientRelationshipWithSpouseEnum 
} from '@/types/enums';

// Mock therapist client data
export const mockTherapistClients: TherapistClient[] = [
  {
    id: 'client-001',
    fullName: 'Sarah Johnson',
    gender: ClientGenderEnum.Female,
    birthPlace: 'Jakarta',
    birthDate: '1990-05-15',
    religion: ClientReligionEnum.Christianity,
    occupation: 'Marketing Manager',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Business Administration',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+6281234567890',
    email: 'sarah.johnson@email.com',
    hobbies: 'Reading, Yoga, Traveling',
    maritalStatus: ClientMaritalStatusEnum.Married,
    spouseName: 'Michael Johnson',
    relationshipWithSpouse: ClientRelationshipWithSpouseEnum.Good,
    firstVisit: false,
    previousVisitDetails: 'Previously consulted for work-related stress',
    assignedTherapist: '4',
    status: ClientStatusEnum.Therapy,
    joinDate: '2024-01-15',
    totalSessions: 8,
    lastSession: '2024-02-20',
    progress: 75,
    notes: 'Showing good progress in managing work stress',
    // Therapist-specific fields
    assignedDate: '2024-01-15',
    lastSessionDate: '2024-02-20',
    nextSessionDate: '2024-02-27',
    sessionCount: 8,
    progressNotes: 'Client has shown significant improvement in stress management techniques. CBT exercises are working well.',
    therapistNotes: 'Continue with current approach. Consider adding mindfulness exercises.',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '+6281234567891',
    emergencyContactRelationship: 'Husband',
    emergencyContactAddress: 'Jl. Sudirman No. 123, Jakarta Pusat'
  },
  {
    id: 'client-002',
    fullName: 'Ahmad Rahman',
    gender: ClientGenderEnum.Male,
    birthPlace: 'Bandung',
    birthDate: '1985-08-22',
    religion: ClientReligionEnum.Islam,
    occupation: 'Software Engineer',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Computer Science',
    address: 'Jl. Asia Afrika No. 456, Bandung',
    phone: '+6282345678901',
    email: 'ahmad.rahman@email.com',
    hobbies: 'Gaming, Programming, Music',
    maritalStatus: ClientMaritalStatusEnum.Single,
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: '4',
    status: ClientStatusEnum.Consultation,
    joinDate: '2024-02-01',
    totalSessions: 2,
    lastSession: '2024-02-15',
    progress: 30,
    notes: 'New client, initial consultation completed',
    // Therapist-specific fields
    assignedDate: '2024-02-01',
    lastSessionDate: '2024-02-15',
    nextSessionDate: '2024-02-22',
    sessionCount: 2,
    progressNotes: 'Client is dealing with social anxiety and work pressure. Initial assessment shows good potential for improvement.',
    therapistNotes: 'Focus on social skills training and stress management. Consider group therapy sessions.',
    emergencyContactName: 'Siti Rahman',
    emergencyContactPhone: '+6282345678902',
    emergencyContactRelationship: 'Mother',
    emergencyContactAddress: 'Jl. Asia Afrika No. 456, Bandung'
  },
  {
    id: 'client-003',
    fullName: 'Maria Garcia',
    gender: ClientGenderEnum.Female,
    birthPlace: 'Surabaya',
    birthDate: '1992-03-10',
    religion: ClientReligionEnum.Catholicism,
    occupation: 'Teacher',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Education',
    address: 'Jl. Tunjungan No. 789, Surabaya',
    phone: '+6283456789012',
    email: 'maria.garcia@email.com',
    hobbies: 'Teaching, Cooking, Gardening',
    maritalStatus: ClientMaritalStatusEnum.Married,
    spouseName: 'Carlos Garcia',
    relationshipWithSpouse: ClientRelationshipWithSpouseEnum.Good,
    firstVisit: false,
    previousVisitDetails: 'Previous therapy for anxiety',
    assignedTherapist: '4',
    status: ClientStatusEnum.Done,
    joinDate: '2023-11-01',
    totalSessions: 12,
    lastSession: '2024-01-30',
    progress: 100,
    notes: 'Successfully completed therapy program',
    // Therapist-specific fields
    assignedDate: '2023-11-01',
    lastSessionDate: '2024-01-30',
    sessionCount: 12,
    progressNotes: 'Client has successfully overcome anxiety issues. All treatment goals achieved.',
    therapistNotes: 'Client is ready for discharge. Recommend follow-up in 6 months.',
    emergencyContactName: 'Carlos Garcia',
    emergencyContactPhone: '+6283456789013',
    emergencyContactRelationship: 'Husband',
    emergencyContactAddress: 'Jl. Tunjungan No. 789, Surabaya'
  },
  {
    id: 'client-004',
    fullName: 'David Chen',
    gender: ClientGenderEnum.Male,
    birthPlace: 'Medan',
    birthDate: '1988-12-05',
    religion: ClientReligionEnum.Buddhism,
    occupation: 'Accountant',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Accounting',
    address: 'Jl. Diponegoro No. 321, Medan',
    phone: '+6284567890123',
    email: 'david.chen@email.com',
    hobbies: 'Photography, Hiking, Reading',
    maritalStatus: ClientMaritalStatusEnum.Single,
    firstVisit: true,
    previousVisitDetails: '',
    assignedTherapist: '4',
    status: ClientStatusEnum.Assigned,
    joinDate: '2024-02-10',
    totalSessions: 0,
    progress: 0,
    notes: 'New client, awaiting first session',
    // Therapist-specific fields
    assignedDate: '2024-02-10',
    nextSessionDate: '2024-02-25',
    sessionCount: 0,
    progressNotes: 'Client referred for depression. Initial assessment scheduled.',
    therapistNotes: 'Prepare for initial consultation. Focus on understanding client background and symptoms.',
    emergencyContactName: 'Linda Chen',
    emergencyContactPhone: '+6284567890124',
    emergencyContactRelationship: 'Sister',
    emergencyContactAddress: 'Jl. Diponegoro No. 321, Medan'
  },
  {
    id: 'client-005',
    fullName: 'Lisa Wong',
    gender: ClientGenderEnum.Female,
    birthPlace: 'Semarang',
    birthDate: '1995-07-18',
    religion: ClientReligionEnum.Christianity,
    occupation: 'Graphic Designer',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Design',
    address: 'Jl. Pandanaran No. 654, Semarang',
    phone: '+6285678901234',
    email: 'lisa.wong@email.com',
    hobbies: 'Design, Art, Traveling',
    maritalStatus: ClientMaritalStatusEnum.Single,
    firstVisit: false,
    previousVisitDetails: 'Previous therapy for self-esteem issues',
    assignedTherapist: '4',
    status: ClientStatusEnum.Therapy,
    joinDate: '2024-01-20',
    totalSessions: 6,
    lastSession: '2024-02-18',
    progress: 60,
    notes: 'Making steady progress in self-confidence building',
    // Therapist-specific fields
    assignedDate: '2024-01-20',
    lastSessionDate: '2024-02-18',
    nextSessionDate: '2024-02-25',
    sessionCount: 6,
    progressNotes: 'Client is showing improvement in self-confidence. Creative therapy approaches are effective.',
    therapistNotes: 'Continue with confidence-building exercises. Consider art therapy techniques.',
    emergencyContactName: 'Robert Wong',
    emergencyContactPhone: '+6285678901235',
    emergencyContactRelationship: 'Father',
    emergencyContactAddress: 'Jl. Pandanaran No. 654, Semarang'
  },
  // Clients assigned to th-001 therapist (User ID: 4 - Dr. Ahmad Rahman)
  {
    id: 'client-001',
    fullName: 'Sarah Johnson',
    gender: ClientGenderEnum.Female,
    birthPlace: 'Jakarta',
    birthDate: '1990-05-15',
    religion: ClientReligionEnum.Christianity,
    occupation: 'Marketing Manager',
    education: ClientEducationEnum.Bachelor,
    educationMajor: 'Business Administration',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+6281234567890',
    email: 'sarah.johnson@email.com',
    hobbies: 'Reading, Yoga, Traveling',
    maritalStatus: ClientMaritalStatusEnum.Married,
    spouseName: 'Michael Johnson',
    relationshipWithSpouse: ClientRelationshipWithSpouseEnum.Good,
    firstVisit: false,
    previousVisitDetails: 'Previously consulted for work-related stress',
    assignedTherapist: '4',
    status: ClientStatusEnum.Therapy,
    joinDate: '2024-01-15',
    totalSessions: 8,
    lastSession: '2024-08-18',
    progress: 75,
    notes: 'Showing good progress in managing work stress',
    // Therapist-specific fields
    assignedDate: '2024-01-15',
    lastSessionDate: '2024-08-18',
    nextSessionDate: '2024-08-29',
    sessionCount: 8,
    progressNotes: 'Client has shown significant improvement in stress management techniques. CBT exercises are working well.',
    therapistNotes: 'Continue with current approach. Consider adding mindfulness exercises.',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '+6281234567891',
    emergencyContactRelationship: 'Husband',
    emergencyContactAddress: 'Jl. Sudirman No. 123, Jakarta Pusat'
  },
  {
    id: 'client-005',
    fullName: 'Dr. Siti Nurhaliza',
    gender: ClientGenderEnum.Female,
    birthPlace: 'Yogyakarta',
    birthDate: '1980-03-25',
    religion: ClientReligionEnum.Islam,
    occupation: 'Dokter Spesialis',
    education: ClientEducationEnum.Master,
    educationMajor: 'Kedokteran',
    address: 'Jl. Malioboro No. 156, Yogyakarta',
    phone: '+628567890123',
    email: 'siti.nurhaliza@email.com',
    hobbies: 'Membaca, Menulis, Mengajar',
    maritalStatus: ClientMaritalStatusEnum.Married,
    spouseName: 'Dr. Andi Wijaya',
    relationshipWithSpouse: ClientRelationshipWithSpouseEnum.Average,
    emergencyContactName: 'Dr. Andi Wijaya',
    emergencyContactPhone: '08567890127',
    emergencyContactRelationship: 'Suami',
    emergencyContactAddress: 'Jl. Malioboro No. 156, Yogyakarta',
    firstVisit: false,
    previousVisitDetails: 'Konsultasi burnout syndrome di RS. Sardjito tahun 2023',
    assignedTherapist: '4',
    status: ClientStatusEnum.Done,
    joinDate: '2024-02-10',
    totalSessions: 12,
    lastSession: '2024-07-15',
    progress: 100,
    notes: 'Terapi selesai dengan hasil memuaskan. Follow-up setiap 3 bulan.',
    // Therapist-specific fields
    assignedDate: '2024-02-10',
    lastSessionDate: '2024-07-15',
    nextSessionDate: '2024-10-15',
    sessionCount: 12,
    progressNotes: 'Client has successfully completed therapy for burnout syndrome. All goals achieved.',
    therapistNotes: 'Client is ready for maintenance phase. Schedule follow-up in 3 months.'
  },
  {
    id: 'client-007',
    fullName: 'Doni Prasetyo',
    gender: ClientGenderEnum.Male,
    birthPlace: 'Palembang',
    birthDate: '1998-04-18',
    religion: ClientReligionEnum.Islam,
    occupation: 'Wiraswasta',
    education: ClientEducationEnum.HighSchool,
    address: 'Jl. Jendral Sudirman No. 89, Palembang',
    phone: '+628789012345',
    email: 'doni.prasetyo@email.com',
    hobbies: 'Fotografi, Traveling, Musik',
    maritalStatus: ClientMaritalStatusEnum.Single,
    emergencyContactName: 'Ibu Prasetyo',
    emergencyContactPhone: '08567890129',
    emergencyContactRelationship: 'Ibu',
    emergencyContactAddress: 'Jl. Jendral Sudirman No. 89, Palembang',
    firstVisit: false,
    previousVisitDetails: 'Pernah konsultasi di RS. Charitas tahun 2023',
    assignedTherapist: '4',
    status: ClientStatusEnum.Consultation,
    joinDate: '2024-07-20',
    totalSessions: 3,
    lastSession: '2024-08-12',
    progress: 45,
    notes: 'Klien dengan isu kecemasan sosial, menunjukkan kemajuan',
    // Therapist-specific fields
    assignedDate: '2024-07-20',
    lastSessionDate: '2024-08-12',
    nextSessionDate: '2024-08-19',
    sessionCount: 3,
    progressNotes: 'Client is dealing with social anxiety and work pressure. Initial assessment shows good potential for improvement.',
    therapistNotes: 'Focus on social skills training and stress management. Consider group therapy sessions.'
  }
];

// Mock therapist client sessions
export const mockTherapistClientSessions: TherapistClientSession[] = [
  {
    id: 'session-001',
    clientId: 'client-001',
    sessionDate: '2024-02-20',
    sessionType: 'therapy',
    duration: 60,
    status: 'completed',
    notes: 'Discussed work stress management techniques. Client practiced breathing exercises.',
    progress: 75,
    nextSessionDate: '2024-02-27'
  },
  {
    id: 'session-002',
    clientId: 'client-002',
    sessionDate: '2024-02-15',
    sessionType: 'consultation',
    duration: 45,
    status: 'completed',
    notes: 'Initial consultation. Assessed social anxiety symptoms.',
    progress: 30,
    nextSessionDate: '2024-02-22'
  },
  {
    id: 'session-003',
    clientId: 'client-003',
    sessionDate: '2024-01-30',
    sessionType: 'follow_up',
    duration: 30,
    status: 'completed',
    notes: 'Final session. Client has achieved all treatment goals.',
    progress: 100
  },
  {
    id: 'session-004',
    clientId: 'client-005',
    sessionDate: '2024-02-18',
    sessionType: 'therapy',
    duration: 60,
    status: 'completed',
    notes: 'Self-confidence building session. Client showed improvement in self-expression.',
    progress: 60,
    nextSessionDate: '2024-02-25'
  }
];

// Mock therapist client progress data
export const mockTherapistClientProgress: TherapistClientProgress[] = [
  {
    clientId: 'client-001',
    clientName: 'Sarah Johnson',
    startDate: '2024-01-15',
    currentStatus: ClientStatusEnum.Therapy,
    totalSessions: 8,
    completedSessions: 8,
    progressPercentage: 75,
    milestones: [
      {
        id: 'milestone-001',
        title: 'Stress Assessment',
        description: 'Complete initial stress assessment',
        achieved: true,
        achievedDate: '2024-01-15'
      },
      {
        id: 'milestone-002',
        title: 'CBT Introduction',
        description: 'Learn basic CBT techniques',
        achieved: true,
        achievedDate: '2024-01-22'
      },
      {
        id: 'milestone-003',
        title: 'Stress Management',
        description: 'Master stress management techniques',
        achieved: true,
        achievedDate: '2024-02-06'
      },
      {
        id: 'milestone-004',
        title: 'Work-Life Balance',
        description: 'Establish healthy work-life balance',
        achieved: false
      }
    ],
    recentNotes: [
      {
        id: 'note-001',
        date: '2024-02-20',
        content: 'Client demonstrated excellent progress in applying stress management techniques at work.',
        type: 'session'
      },
      {
        id: 'note-002',
        date: '2024-02-13',
        content: 'Client reported reduced anxiety levels and improved sleep quality.',
        type: 'progress'
      }
    ]
  },
  {
    clientId: 'client-002',
    clientName: 'Ahmad Rahman',
    startDate: '2024-02-01',
    currentStatus: ClientStatusEnum.Consultation,
    totalSessions: 2,
    completedSessions: 2,
    progressPercentage: 30,
    milestones: [
      {
        id: 'milestone-005',
        title: 'Initial Assessment',
        description: 'Complete social anxiety assessment',
        achieved: true,
        achievedDate: '2024-02-01'
      },
      {
        id: 'milestone-006',
        title: 'Treatment Plan',
        description: 'Develop personalized treatment plan',
        achieved: true,
        achievedDate: '2024-02-08'
      },
      {
        id: 'milestone-007',
        title: 'Social Skills Training',
        description: 'Begin social skills training',
        achieved: false
      }
    ],
    recentNotes: [
      {
        id: 'note-003',
        date: '2024-02-15',
        content: 'Client shows willingness to work on social anxiety. Good rapport established.',
        type: 'session'
      },
      {
        id: 'note-004',
        date: '2024-02-08',
        content: 'Treatment plan developed focusing on gradual exposure and social skills training.',
        type: 'progress'
      }
    ]
  }
];

// Calculate therapist client stats
export const getTherapistClientStats = (therapistId: string): TherapistClientStats => {
  const therapistClients = mockTherapistClients.filter(client => client.assignedTherapist === therapistId);
  
  const total = therapistClients.length;
  const assigned = therapistClients.filter(c => c.status === ClientStatusEnum.Assigned).length;
  const consultation = therapistClients.filter(c => c.status === ClientStatusEnum.Consultation).length;
  const therapy = therapistClients.filter(c => c.status === ClientStatusEnum.Therapy).length;
  const done = therapistClients.filter(c => c.status === ClientStatusEnum.Done).length;
  
  // Calculate upcoming sessions (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingSessions = therapistClients.filter(client => {
    if (!client.nextSessionDate) return false;
    const sessionDate = new Date(client.nextSessionDate);
    return sessionDate >= today && sessionDate <= nextWeek;
  }).length;
  
  // Calculate overdue sessions (past due dates)
  const overdueSessions = therapistClients.filter(client => {
    if (!client.nextSessionDate) return false;
    const sessionDate = new Date(client.nextSessionDate);
    return sessionDate < today;
  }).length;

  return {
    total,
    assigned,
    consultation,
    therapy,
    done,
    upcomingSessions,
    overdueSessions
  };
};

// Get therapist client by ID
export const getTherapistClientById = (therapistId: string, clientId: string): TherapistClient | undefined => {
  return mockTherapistClients.find(client => 
    client.assignedTherapist === therapistId && client.id === clientId
  );
};

// Get therapist clients with filters
export const getTherapistClients = (
  therapistId: string,
  filters?: {
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): TherapistClient[] => {
  let clients = mockTherapistClients.filter(client => client.assignedTherapist === therapistId);

  // Apply status filter
  if (filters?.status && filters.status !== 'all') {
    clients = clients.filter(client => client.status === filters.status);
  }

  // Apply search filter
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    clients = clients.filter(client =>
      client.fullName.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.phone.includes(searchTerm)
    );
  }

  // Apply sorting
  if (filters?.sortBy) {
    clients.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case 'assignedDate':
          aValue = new Date(a.assignedDate);
          bValue = new Date(b.assignedDate);
          break;
        case 'lastSessionDate':
          aValue = a.lastSessionDate ? new Date(a.lastSessionDate) : new Date(0);
          bValue = b.lastSessionDate ? new Date(b.lastSessionDate) : new Date(0);
          break;
        case 'sessionCount':
          aValue = a.sessionCount;
          bValue = b.sessionCount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
      if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }

  return clients;
};
