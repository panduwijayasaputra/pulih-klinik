import { useCallback, useEffect, useState } from 'react';
import { 
  ClinicBranding, 
  ClinicDocument, 
  ClinicProfile, 
  ClinicProfileFormData, 
  ClinicSettings 
} from '@/types/clinic';
import { ClinicAPI } from '@/lib/api/clinic';

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
    clinic: null,
    documents: [],
    isLoading: false,
    isDocumentsLoading: false,
    error: null,
    documentsError: null
  });

  const updateState = useCallback((updates: Partial<UseClinicState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof Error) {
      return error.message;
    }
    return fallbackMessage;
  }, []);

  // Fetch clinic profile
  const fetchClinic = useCallback(async () => {
    updateState({ isLoading: true, error: null });
    
    try {
      const response = await ClinicAPI.getClinicProfile('clinic-001');
      if (response.success && response.data) {
        updateState({ clinic: response.data });
      } else {
        updateState({ error: response.message || 'Gagal mengambil data klinik' });
      }
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
      const response = await ClinicAPI.updateClinicProfile('clinic-001', formData);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui profil klinik' });
        return false;
      }
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
      const response = await ClinicAPI.uploadDocument('clinic-001', file, 'logo');
      if (response.success && response.data) {
        // Update the clinic data with new logo URL
        if (state.clinic) {
          const updatedClinic: ClinicProfile = {
            ...state.clinic,
            logo: response.data.url,
            updatedAt: new Date().toISOString()
          };
          updateState({ clinic: updatedClinic });
        }
        return response.data.url;
      } else {
        updateState({ error: response.message || 'Gagal mengunggah logo' });
        return null;
      }
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
      const response = await ClinicAPI.updateClinicBranding('clinic-001', branding);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui branding klinik' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui branding klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError]);

  // Update clinic settings
  const updateSettings = useCallback(async (settings: ClinicSettings) => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await ClinicAPI.updateClinicSettings('clinic-001', settings);
      if (response.success && response.data) {
        updateState({ clinic: response.data });
        return true;
      } else {
        updateState({ error: response.message || 'Gagal memperbarui pengaturan klinik' });
        return false;
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal memperbarui pengaturan klinik');
      updateState({ error: errorMessage });
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError]);

  // Fetch clinic documents
  const fetchDocuments = useCallback(async () => {
    updateState({ isDocumentsLoading: true, documentsError: null });
    
    try {
      const response = await ClinicAPI.getClinicDocuments('clinic-001');
      if (response.success && response.data) {
        updateState({ documents: response.data });
      } else {
        updateState({ documentsError: response.message || 'Gagal mengambil daftar dokumen' });
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Gagal mengambil daftar dokumen');
      updateState({ documentsError: errorMessage });
    } finally {
      updateState({ isDocumentsLoading: false });
    }
  }, [updateState, handleError]);

  // Upload document
  const uploadDocument = useCallback(async (
    file: File, 
    documentType: ClinicDocument['type'], 
    _description?: string
  ) => {
    updateState({ isDocumentsLoading: true, documentsError: null });

    try {
      const response = await ClinicAPI.uploadDocument('clinic-001', file, documentType);
      if (response.success && response.data) {
        updateState({ 
          documents: [...state.documents, response.data]
        });
        return true;
      } else {
        updateState({ documentsError: response.message || 'Gagal mengunggah dokumen' });
        return false;
      }
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
      const response = await ClinicAPI.deleteDocument('clinic-001', documentId);
      if (response.success) {
        const updatedDocuments = state.documents.filter(doc => doc.id !== documentId);
        updateState({ documents: updatedDocuments });
        return true;
      } else {
        updateState({ documentsError: response.message || 'Gagal menghapus dokumen' });
        return false;
      }
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
      // Clinic document download would be handled via direct file download
      console.log('Download document:', documentId, fileName);
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