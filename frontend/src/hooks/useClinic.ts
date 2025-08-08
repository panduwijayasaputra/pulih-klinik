import { useState, useCallback } from 'react';
import { Clinic, ClinicFormData, ClinicBranding, ClinicSettings, ClinicDocument } from '@/types/clinic';

// Mock data for development
const mockClinic: Clinic = {
  id: 'clinic-001',
  name: 'Klinik Sehat Jiwa',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  phone: '+62-21-1234-5678',
  email: 'info@kliniksehat.com',
  website: 'https://kliniksehat.com',
  logo: '/logos/klinik-sehat.png',
  description: 'Klinik hipnoterapi terpercaya dengan tim therapist berpengalaman',
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

export const useClinic = () => {
  const [clinic, setClinic] = useState<Clinic | null>(mockClinic);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinic = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClinic(mockClinic);
    } catch (err) {
      setError('Gagal mengambil data klinik');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateClinic = useCallback(async (formData: ClinicFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (clinic) {
        const updatedClinic: Clinic = {
          ...clinic,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          description: formData.description,
          updatedAt: new Date().toISOString()
        };
        
        setClinic(updatedClinic);
      }
      
      return true;
    } catch (err) {
      setError('Gagal memperbarui data klinik');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clinic]);

  const uploadLogo = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a fake URL for the uploaded logo
      const logoUrl = URL.createObjectURL(file);
      
      if (clinic) {
        const updatedClinic: Clinic = {
          ...clinic,
          logo: logoUrl,
          updatedAt: new Date().toISOString()
        };
        
        setClinic(updatedClinic);
      }
      
      return logoUrl;
    } catch (err) {
      setError('Gagal mengunggah logo');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clinic]);

  const updateBranding = useCallback(async (branding: ClinicBranding) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (clinic) {
        const updatedClinic: Clinic = {
          ...clinic,
          branding,
          updatedAt: new Date().toISOString()
        };
        
        setClinic(updatedClinic);
      }
      
      return true;
    } catch (err) {
      setError('Gagal memperbarui branding klinik');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clinic]);

  const updateSettings = useCallback(async (settings: ClinicSettings) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (clinic) {
        const updatedClinic: Clinic = {
          ...clinic,
          settings,
          updatedAt: new Date().toISOString()
        };
        
        setClinic(updatedClinic);
      }
      
      return true;
    } catch (err) {
      setError('Gagal memperbarui pengaturan klinik');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clinic]);

  const uploadDocument = useCallback(async (file: File, documentType: ClinicDocument['type'], description?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (clinic) {
        const newDocument: ClinicDocument = {
          id: `doc-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: documentType,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'pending',
          url: URL.createObjectURL(file),
          description
        };

        const updatedClinic: Clinic = {
          ...clinic,
          documents: [...(clinic.documents || []), newDocument],
          updatedAt: new Date().toISOString()
        };
        
        setClinic(updatedClinic);
      }
      
      return true;
    } catch (err) {
      setError('Gagal mengunggah dokumen');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clinic]);

  const deleteDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (clinic && clinic.documents) {
        const updatedDocuments = clinic.documents.filter(doc => doc.id !== documentId);
        const updatedClinic: Clinic = {
          ...clinic,
          documents: updatedDocuments,
          updatedAt: new Date().toISOString()
        };
        
        setClinic(updatedClinic);
      }
      
      return true;
    } catch (err) {
      setError('Gagal menghapus dokumen');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clinic]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    clinic,
    isLoading,
    error,
    fetchClinic,
    updateClinic,
    uploadLogo,
    updateBranding,
    updateSettings,
    uploadDocument,
    deleteDocument,
    clearError
  };
};