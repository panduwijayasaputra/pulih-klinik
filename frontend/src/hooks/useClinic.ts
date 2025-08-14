import { useCallback, useEffect, useState } from 'react';
import { 
  ClinicBranding, 
  ClinicDocument, 
  ClinicProfile, 
  ClinicProfileFormData, 
  ClinicSettings 
} from '@/types/clinic';
import {
  ClinicApiError,
  deleteClinicDocument,
  downloadClinicDocument,
  getClinicDocuments,
  getClinicProfile,
  updateClinicBranding,
  updateClinicProfile,
  updateClinicSettings,
  uploadClinicDocument,
  uploadClinicLogo
} from '@/lib/api/clinic';

// Mock data for development/fallback
const mockClinic: ClinicProfile = {
  id: 'clinic-001',
  name: 'Klinik Sehat Jiwa',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  phone: '+62-21-1234-5678',
  email: 'info@kliniksehat.com',
  website: 'https://kliniksehat.com',
  logo: '/logos/klinik-sehat.png',
  description: 'Klinik hipnoterapi terpercaya dengan tim therapist berpengalaman',
  workingHours: 'Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 14:00',
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter'
  },
  settings: {
    timezone: 'Asia/Jakarta',
    language: 'id',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  documents: [
    {
      id: 'doc-001',
      name: 'Izin Praktik Klinik',
      type: 'license',
      fileName: 'izin-praktik-klinik.pdf',
      fileSize: 2048000,
      uploadedAt: '2023-01-20T00:00:00Z',
      status: 'approved',
      url: '/documents/izin-praktik-klinik.pdf',
      description: 'Surat izin praktik klinik dari Dinas Kesehatan'
    },
    {
      id: 'doc-002',
      name: 'Sertifikat Akreditasi',
      type: 'certificate',
      fileName: 'sertifikat-akreditasi.pdf',
      fileSize: 1536000,
      uploadedAt: '2023-02-10T00:00:00Z',
      status: 'approved',
      url: '/documents/sertifikat-akreditasi.pdf'
    }
  ],
  subscriptionTier: 'beta',
  createdAt: '2023-01-15T00:00:00Z',
  updatedAt: '2023-12-01T00:00:00Z'
};

interface UseClinicState {
  clinic: ClinicProfile | null;
  documents: ClinicDocument[];
  isLoading: boolean;
  isDocumentsLoading: boolean;
  error: string | null;
  documentsError: string | null;
}

export const useClinic = () => {
  const [state, setState] = useState<UseClinicState>({
    clinic: process.env.NODE_ENV === 'development' ? mockClinic : null, // Start with mock data in development
    documents: process.env.NODE_ENV === 'development' ? (mockClinic.documents || []) : [],
    isLoading: false,
    isDocumentsLoading: false,
    error: null,
    documentsError: null
  });

  const updateState = useCallback((updates: Partial<UseClinicState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof ClinicApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallbackMessage;
  }, []);

  // Fetch clinic profile
  const fetchClinic = useCallback(async () => {
    // In development, use mock data immediately
    if (process.env.NODE_ENV === 'development') {
      updateState({ 
        clinic: mockClinic, 
        documents: mockClinic.documents || [],
        isLoading: false,
        error: null 
      });
      console.info('Using mock clinic data for development');
      return;
    }

    updateState({ isLoading: true, error: null });
    
    try {
      const clinicData = await getClinicProfile();
      updateState({ clinic: clinicData });
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengambil data klinik');
      updateState({ error: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError]);

  // Update clinic profile
  const updateClinic = useCallback(async (formData: ClinicProfileFormData) => {
    updateState({ isLoading: true, error: null });

    try {
      const updatedClinic = await updateClinicProfile(formData);
      updateState({ clinic: updatedClinic });
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui profil klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError]);

  // Upload clinic logo
  const uploadLogo = useCallback(async (file: File) => {
    updateState({ isLoading: true, error: null });

    try {
      const logoUrl = await uploadClinicLogo(file);
      
      // Update the clinic data with new logo URL
      if (state.clinic) {
        const updatedClinic: ClinicProfile = {
          ...state.clinic,
          logo: logoUrl,
          updatedAt: new Date().toISOString()
        };
        updateState({ clinic: updatedClinic });
      }
      
      return logoUrl;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengunggah logo');
      updateState({ error: errorMessage });
      return null;
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.clinic, updateState, handleError]);

  // Update clinic branding
  const updateBranding = useCallback(async (branding: ClinicBranding) => {
    updateState({ isLoading: true, error: null });

    try {
      const updatedBranding = await updateClinicBranding(branding);
      
      if (state.clinic) {
        const updatedClinic: ClinicProfile = {
          ...state.clinic,
          branding: updatedBranding,
          updatedAt: new Date().toISOString()
        };
        updateState({ clinic: updatedClinic });
      }
      
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui branding klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.clinic, updateState, handleError]);

  // Update clinic settings
  const updateSettings = useCallback(async (settings: ClinicSettings) => {
    updateState({ isLoading: true, error: null });

    try {
      const updatedSettings = await updateClinicSettings(settings);
      
      if (state.clinic) {
        const updatedClinic: ClinicProfile = {
          ...state.clinic,
          settings: updatedSettings,
          updatedAt: new Date().toISOString()
        };
        updateState({ clinic: updatedClinic });
      }
      
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui pengaturan klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.clinic, updateState, handleError]);

  // Fetch clinic documents
  const fetchDocuments = useCallback(async () => {
    updateState({ isDocumentsLoading: true, documentsError: null });
    
    try {
      const documents = await getClinicDocuments();
      updateState({ documents });
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengambil daftar dokumen');
      updateState({ documentsError: errorMessage });
      
      // Fall back to clinic documents or empty array
      if (process.env.NODE_ENV === 'development') {
        const fallbackDocs = state.clinic?.documents || mockClinic.documents || [];
        updateState({ documents: fallbackDocs, documentsError: null });
        console.warn('Using fallback document data due to API error:', errorMessage);
      }
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [state.clinic?.documents, updateState, handleError]);

  // Upload document
  const uploadDocument = useCallback(async (
    file: File, 
    documentType: ClinicDocument['type'], 
    description?: string
  ) => {
    updateState({ isDocumentsLoading: true, documentsError: null });

    try {
      const newDocument = await uploadClinicDocument(file, documentType, description);
      updateState({ 
        documents: [...state.documents, newDocument]
      });
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengunggah dokumen');
      updateState({ documentsError: errorMessage });
      return false;
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [state.documents, updateState, handleError]);

  // Delete document
  const deleteDocument = useCallback(async (documentId: string) => {
    updateState({ isDocumentsLoading: true, documentsError: null });

    try {
      await deleteClinicDocument(documentId);
      const updatedDocuments = state.documents.filter(doc => doc.id !== documentId);
      updateState({ documents: updatedDocuments });
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal menghapus dokumen');
      updateState({ documentsError: errorMessage });
      return false;
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [state.documents, updateState, handleError]);

  // Download document
  const downloadDocument = useCallback(async (documentId: string, fileName: string) => {
    try {
      await downloadClinicDocument(documentId, fileName);
      return true;
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengunduh dokumen');
      updateState({ documentsError: errorMessage });
      return false;
    }
  }, [updateState, handleError]);

  // Clear errors
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const clearDocumentsError = useCallback(() => {
    updateState({ documentsError: null });
  }, [updateState]);

  // Auto-fetch clinic data on mount
  useEffect(() => {
    fetchClinic();
  }, [fetchClinic]);

  return {
    // Data
    clinic: state.clinic,
    documents: state.documents,
    
    // Loading states
    isLoading: state.isLoading,
    isDocumentsLoading: state.isDocumentsLoading,
    
    // Error states
    error: state.error,
    documentsError: state.documentsError,
    
    // Actions
    fetchClinic,
    updateClinic,
    uploadLogo,
    updateBranding,
    updateSettings,
    
    // Document actions
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    
    // Error clearing
    clearError,
    clearDocumentsError
  };
};