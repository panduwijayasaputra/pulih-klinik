import { useState, useCallback, useEffect } from 'react';
import { Therapist, TherapistFormData, TherapistFilters, TherapistAssignment } from '@/types/therapist';

// Mock therapist data for development
const mockTherapists: Therapist[] = [
  {
    id: 'therapist-001',
    clinicId: 'clinic-001',
    name: 'Dr. Ahmad Pratama, M.Psi',
    email: 'ahmad.pratama@kliniksehat.com',
    phone: '+62-812-3456-7890',
    avatar: '/avatars/ahmad-pratama.jpg',
    
    licenseNumber: 'PSI-001234',
    licenseType: 'psychologist',
    specializations: ['anxiety-depression', 'stress-management'],
    education: [
      {
        degree: 'S2 Psikologi Klinis',
        institution: 'Universitas Indonesia',
        year: 2018,
        field: 'Psikologi Klinis'
      },
      {
        degree: 'S1 Psikologi',
        institution: 'Universitas Gadjah Mada',
        year: 2015,
        field: 'Psikologi'
      }
    ],
    certifications: [
      {
        id: 'cert-001',
        name: 'Certified Clinical Hypnotherapist',
        issuingOrganization: 'Indonesian Hypnotherapy Association',
        issueDate: '2019-06-15',
        expiryDate: '2024-06-15',
        certificateNumber: 'IHA-2019-001234',
        status: 'active'
      }
    ],
    yearsOfExperience: 6,
    
    status: 'active',
    employmentType: 'full_time',
    joinDate: '2023-01-15',
    
    assignedClients: ['client-001', 'client-002', 'client-003'],
    maxClients: 20,
    currentLoad: 15,
    

    
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '15:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    preferences: {
      sessionDuration: 60,
      breakBetweenSessions: 15,
      maxSessionsPerDay: 8,
      languages: ['id', 'en'],
      workingDays: [1, 2, 3, 4, 5]
    },
    
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'therapist-002',
    clinicId: 'clinic-001',
    name: 'Dr. Sari Wulandari, M.Psi',
    email: 'sari.wulandari@kliniksehat.com',
    phone: '+62-812-3456-7891',
    avatar: '/avatars/sari-wulandari.jpg',
    
    licenseNumber: 'PSI-001235',
    licenseType: 'psychologist',
    specializations: ['addiction-therapy', 'trauma-ptsd'],
    education: [
      {
        degree: 'S2 Psikologi Klinis',
        institution: 'Universitas Padjadjaran',
        year: 2017,
        field: 'Psikologi Klinis'
      }
    ],
    certifications: [
      {
        id: 'cert-002',
        name: 'Addiction Counseling Certificate',
        issuingOrganization: 'Indonesia Addiction Professional Certification',
        issueDate: '2020-03-10',
        expiryDate: '2025-03-10',
        certificateNumber: 'IAPC-2020-005678',
        status: 'active'
      }
    ],
    yearsOfExperience: 7,
    
    status: 'active',
    employmentType: 'full_time',
    joinDate: '2023-02-01',
    
    assignedClients: ['client-004', 'client-005'],
    maxClients: 15,
    currentLoad: 12,
    

    
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    preferences: {
      sessionDuration: 90,
      breakBetweenSessions: 20,
      maxSessionsPerDay: 6,
      languages: ['id'],
      workingDays: [1, 2, 3, 4, 6]
    },
    
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'therapist-003',
    clinicId: 'clinic-001',
    name: 'Rina Anggraini, M.Psi',
    email: 'rina.anggraini@kliniksehat.com',
    phone: '+62-812-3456-7892',
    
    licenseNumber: 'PSI-001236',
    licenseType: 'counselor',
    specializations: ['child-adolescent', 'couples-family'],
    education: [
      {
        degree: 'S2 Psikologi Keluarga',
        institution: 'Universitas Indonesia',
        year: 2019,
        field: 'Psikologi Keluarga'
      }
    ],
    certifications: [
      {
        id: 'cert-003',
        name: 'Child Psychology Specialist',
        issuingOrganization: 'Indonesian Child Psychology Association',
        issueDate: '2021-08-20',
        expiryDate: '2026-08-20',
        certificateNumber: 'ICPA-2021-009876',
        status: 'active'
      }
    ],
    yearsOfExperience: 4,
    
    status: 'active',
    employmentType: 'part_time',
    joinDate: '2023-06-15',
    
    assignedClients: ['client-006'],
    maxClients: 10,
    currentLoad: 8,
    

    
    schedule: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '14:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '14:00', endTime: '18:00', isAvailable: true }
    ],
    timezone: 'Asia/Jakarta',
    
    preferences: {
      sessionDuration: 45,
      breakBetweenSessions: 10,
      maxSessionsPerDay: 5,
      languages: ['id', 'en'],
      workingDays: [1, 3, 5]
    },
    
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockAssignments: TherapistAssignment[] = [
  {
    id: 'assign-001',
    therapistId: 'therapist-001',
    clientId: 'client-001',
    assignedDate: '2023-11-01',
    assignedBy: 'admin-001',
    status: 'active',
    notes: 'Client dengan kecemasan sosial'
  },
  {
    id: 'assign-002',
    therapistId: 'therapist-002',
    clientId: 'client-004',
    assignedDate: '2023-11-15',
    assignedBy: 'admin-001',
    status: 'active',
    notes: 'Klien dengan masalah kecanduan alkohol'
  }
];

export const useTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [assignments, setAssignments] = useState<TherapistAssignment[]>(mockAssignments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTherapists = useCallback(async (filters?: TherapistFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredTherapists = [...mockTherapists];
      
      if (filters) {
        // Apply filters
        if (filters.status && filters.status.length > 0) {
          filteredTherapists = filteredTherapists.filter(t => 
            filters.status!.includes(t.status)
          );
        }
        
        if (filters.specializations && filters.specializations.length > 0) {
          filteredTherapists = filteredTherapists.filter(t =>
            t.specializations.some(spec => filters.specializations!.includes(spec))
          );
        }
        
        if (filters.employmentType && filters.employmentType.length > 0) {
          filteredTherapists = filteredTherapists.filter(t =>
            filters.employmentType!.includes(t.employmentType)
          );
        }
        
        if (filters.licenseType && filters.licenseType.length > 0) {
          filteredTherapists = filteredTherapists.filter(t =>
            filters.licenseType!.includes(t.licenseType)
          );
        }
        
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredTherapists = filteredTherapists.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.email.toLowerCase().includes(query) ||
            t.licenseNumber.toLowerCase().includes(query)
          );
        }
        

        
        if (filters.maxLoad) {
          filteredTherapists = filteredTherapists.filter(t =>
            t.currentLoad <= filters.maxLoad!
          );
        }
        
        // Apply sorting
        if (filters.sortBy) {
          filteredTherapists.sort((a, b) => {
            let comparison = 0;
            
            switch (filters.sortBy) {
              case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
              case 'joinDate':
                comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
                break;

              case 'clientCount':
                comparison = a.currentLoad - b.currentLoad;
                break;
            }
            
            return filters.sortOrder === 'desc' ? -comparison : comparison;
          });
        }
      }
      
      setTherapists(filteredTherapists);
    } catch (err) {
      setError('Gagal mengambil data therapist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTherapist = useCallback(async (therapistId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const therapist = mockTherapists.find(t => t.id === therapistId);
      return therapist || null;
    } catch (err) {
      setError('Gagal mengambil data therapist');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTherapist = useCallback(async (formData: TherapistFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTherapist: Therapist = {
        id: `therapist-${Date.now()}`,
        clinicId: 'clinic-001', // Would come from context/auth
        ...formData,
        avatar: undefined,
        
        assignedClients: [],
        currentLoad: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        

        
        schedule: [],
        timezone: 'Asia/Jakarta',
        
        certifications: formData.certifications.map((cert, index) => ({
          ...cert,
          id: `cert-${Date.now()}-${index}`,
          status: 'active' as const
        })),
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTherapists(prev => [...prev, newTherapist]);
      return newTherapist;
    } catch (err) {
      setError('Gagal membuat data therapist');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTherapist = useCallback(async (therapistId: string, updates: Partial<Therapist>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTherapists(prev => prev.map(therapist =>
        therapist.id === therapistId
          ? { ...therapist, ...updates, updatedAt: new Date().toISOString() }
          : therapist
      ));
      
      return true;
    } catch (err) {
      setError('Gagal memperbarui data therapist');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTherapist = useCallback(async (therapistId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTherapists(prev => prev.filter(therapist => therapist.id !== therapistId));
      return true;
    } catch (err) {
      setError('Gagal menghapus data therapist');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignTherapistToClient = useCallback(async (
    therapistId: string, 
    clientId: string, 
    assignedBy: string, 
    notes?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAssignment: TherapistAssignment = {
        id: `assign-${Date.now()}`,
        therapistId,
        clientId,
        assignedDate: new Date().toISOString().split('T')[0],
        assignedBy,
        status: 'active',
        notes
      };
      
      setAssignments(prev => [...prev, newAssignment]);
      
      // Update therapist's assigned clients
      setTherapists(prev => prev.map(therapist =>
        therapist.id === therapistId
          ? {
              ...therapist,
              assignedClients: [...therapist.assignedClients, clientId],
              currentLoad: therapist.currentLoad + 1,
              updatedAt: new Date().toISOString()
            }
          : therapist
      ));
      
      return newAssignment;
    } catch (err) {
      setError('Gagal menugaskan therapist ke klien');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unassignTherapistFromClient = useCallback(async (
    assignmentId: string,
    reason?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) {
        throw new Error('Assignment not found');
      }
      
      // Update assignment status
      setAssignments(prev => prev.map(assign =>
        assign.id === assignmentId
          ? {
              ...assign,
              status: 'transferred' as const,
              endDate: new Date().toISOString().split('T')[0],
              transferReason: reason
            }
          : assign
      ));
      
      // Update therapist's assigned clients
      setTherapists(prev => prev.map(therapist =>
        therapist.id === assignment.therapistId
          ? {
              ...therapist,
              assignedClients: therapist.assignedClients.filter(id => id !== assignment.clientId),
              currentLoad: Math.max(0, therapist.currentLoad - 1),
              updatedAt: new Date().toISOString()
            }
          : therapist
      ));
      
      return true;
    } catch (err) {
      setError('Gagal membatalkan penugasan therapist');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [assignments]);

  const getTherapistAssignments = useCallback((therapistId: string) => {
    return assignments.filter(assignment => 
      assignment.therapistId === therapistId && assignment.status === 'active'
    );
  }, [assignments]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  return {
    therapists,
    assignments,
    isLoading,
    error,
    fetchTherapists,
    getTherapist,
    createTherapist,
    updateTherapist,
    deleteTherapist,
    assignTherapistToClient,
    unassignTherapistFromClient,
    getTherapistAssignments,
    clearError
  };
};