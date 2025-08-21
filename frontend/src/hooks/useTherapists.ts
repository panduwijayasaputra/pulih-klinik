import { useCallback, useEffect, useState } from 'react';
import { Therapist, TherapistAssignment, TherapistFilters, TherapistFormData } from '@/types/therapist';
import { EmploymentTypeEnum, TherapistAssignmentStatusEnum, TherapistLicenseTypeEnum, TherapistStatusEnum } from '@/types/enums';
import { TherapistAPI } from '@/lib/api/therapist';

export const useTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [assignments, setAssignments] = useState<TherapistAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTherapists = useCallback(async (filters?: TherapistFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.getTherapists(1, 50, filters);
      if (response.success && response.data) {
        setTherapists(response.data.items);
      } else {
        setError(response.message || 'Gagal mengambil data therapist');
      }
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
      const response = await TherapistAPI.getTherapist(therapistId);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Therapist tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal mengambil data therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTherapist = useCallback(async (therapistData: TherapistFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.createTherapist(therapistData);
      if (response.success && response.data) {
        setTherapists(prev => [...prev, response.data as Therapist]);
        return response.data;
      } else {
        throw new Error(response.message || 'Gagal membuat therapist baru');
      }
    } catch (err) {
      setError('Gagal membuat therapist baru');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTherapist = useCallback(async (therapistId: string, therapistData: Partial<TherapistFormData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.updateTherapist(therapistId, therapistData);
      if (response.success && response.data) {
        setTherapists(prev => prev.map(t => 
          t.id === therapistId ? response.data as Therapist : t
        ));
        return true;
      } else {
        throw new Error(response.message || 'Gagal memperbarui data therapist');
      }
    } catch (err) {
      setError('Gagal memperbarui data therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTherapist = useCallback(async (therapistId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.deleteTherapist(therapistId);
      if (response.success) {
        setTherapists(prev => prev.filter(t => t.id !== therapistId));
        return true;
      } else {
        throw new Error(response.message || 'Gagal menghapus therapist');
      }
    } catch (err) {
      setError('Gagal menghapus therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTherapistStatus = useCallback(async (therapistId: string, status: TherapistStatusEnum) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.updateTherapistStatus(therapistId, status);
      if (response.success && response.data) {
        setTherapists(prev => prev.map(t => 
          t.id === therapistId ? response.data as Therapist : t
        ));
        return true;
      } else {
        throw new Error(response.message || 'Gagal memperbarui status therapist');
      }
    } catch (err) {
      setError('Gagal memperbarui status therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignClientToTherapist = useCallback(async (therapistId: string, clientId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.assignClientToTherapist(therapistId, clientId);
      if (response.success && response.data) {
        setAssignments(prev => [...prev, response.data as TherapistAssignment]);
        // Update therapist's assigned clients
        setTherapists(prev => prev.map(t => 
          t.id === therapistId 
            ? { 
                ...t, 
                assignedClients: [...t.assignedClients, clientId],
                currentLoad: t.currentLoad + 1,
                updatedAt: new Date().toISOString()
              }
            : t
        ));
        return response.data;
      } else {
        throw new Error(response.message || 'Gagal menugaskan klien ke therapist');
      }
    } catch (err) {
      setError('Gagal menugaskan klien ke therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeClientFromTherapist = useCallback(async (therapistId: string, clientId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.removeClientFromTherapist(therapistId, clientId);
      if (response.success) {
        // Update assignment status
        setAssignments(prev => prev.map(a => 
          a.therapistId === therapistId && a.clientId === clientId
            ? { ...a, status: TherapistAssignmentStatusEnum.Active }
            : a
        ));
        // Update therapist's assigned clients
        setTherapists(prev => prev.map(t => 
          t.id === therapistId 
            ? { 
                ...t, 
                assignedClients: t.assignedClients.filter(id => id !== clientId),
                currentLoad: Math.max(0, t.currentLoad - 1),
                updatedAt: new Date().toISOString()
              }
            : t
        ));
        return true;
      } else {
        throw new Error(response.message || 'Gagal menghapus klien dari therapist');
      }
    } catch (err) {
      setError('Gagal menghapus klien dari therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTherapistAssignments = useCallback(async (therapistId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TherapistAPI.getTherapistAssignments(therapistId || '');
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Gagal mengambil data penugasan therapist');
      }
    } catch (err) {
      setError('Gagal mengambil data penugasan therapist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
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
    updateTherapistStatus,
    assignClientToTherapist,
    removeClientFromTherapist,
    getTherapistAssignments
  };
};
