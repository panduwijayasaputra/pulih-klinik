import { useState } from 'react';

interface TherapistRegistrationData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  
  // Professional Information
  licenseNumber: string;
  specialization: string;
  yearsExperience: number;
  education: string;
  certifications?: string;
  
  // Password
  password: string;
  confirmPassword: string;
  
  // System fields
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
}

interface TherapistRegistrationResponse {
  success: boolean;
  therapist_id?: string;
  message?: string;
}

interface EmailConfirmationResponse {
  success: boolean;
  message?: string;
}

export const useTherapist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerTherapist = async (therapistData: TherapistRegistrationData): Promise<TherapistRegistrationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (!therapistData.email || !therapistData.password) {
        throw new Error('Email dan password wajib diisi');
      }

      // Mock email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(therapistData.email)) {
        throw new Error('Format email tidak valid');
      }

      // Mock password validation
      if (therapistData.password.length < 8) {
        throw new Error('Password minimal 8 karakter');
      }

      // Generate unique therapist ID
      const therapistId = 'th-' + Date.now();
      
      // Mock saving to system
      console.log('Saving therapist to system:', {
        ...therapistData,
        id: therapistId,
        clinicId: 'clinic-default', // Default clinic ID
        status: therapistData.status || 'pending',
        createdAt: therapistData.createdAt || new Date().toISOString(),
        // Convert certifications string to array
        certifications: therapistData.certifications 
          ? therapistData.certifications.split(',').map(cert => cert.trim())
          : []
      });
      
      // Mock sending confirmation email
      console.log('Sending confirmation email to:', therapistData.email);
      
      return {
        success: true,
        therapist_id: therapistId,
        message: 'Therapist berhasil didaftarkan. Email konfirmasi telah dikirim.'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendaftarkan therapist';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (email: string, therapistName: string): Promise<EmailConfirmationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Format email tidak valid');
      }

      // Mock sending confirmation email
      console.log('Sending confirmation email:', {
        to: email,
        subject: 'Selamat Datang di TeraPin.tar - Akun Therapist Anda',
        content: `Halo ${therapistName}, akun therapist Anda telah berhasil dibuat...`
      });

      return {
        success: true,
        message: 'Email konfirmasi berhasil dikirim'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim email konfirmasi';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const getTherapists = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock therapists data
      return {
        success: true,
        therapists: [
          {
            id: 'th-1',
            name: 'Dr. Budi Santoso',
            email: 'budi@kliniksehat.com',
            specialization: 'Anxiety Disorders',
            status: 'active' as const,
            sessions_completed: 45,
            client_satisfaction: 4.8
          },
          {
            id: 'th-2',
            name: 'Dr. Siti Rahayu',
            email: 'siti@kliniksehat.com',
            specialization: 'Depression',
            status: 'active' as const,
            sessions_completed: 32,
            client_satisfaction: 4.9
          },
          {
            id: 'th-3',
            name: 'Dr. Ahmad Pratama',
            email: 'ahmad@kliniksehat.com',
            specialization: 'PTSD',
            status: 'pending' as const,
            sessions_completed: 0,
            client_satisfaction: 0
          }
        ]
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data therapist';
      setError(errorMessage);
      return {
        success: false,
        therapists: [],
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const updateTherapistStatus = async (therapistId: string, status: 'active' | 'inactive') => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        message: `Status therapist berhasil diubah menjadi ${status}`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengubah status therapist';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const updateTherapist = async (therapistId: string, updateData: Partial<TherapistRegistrationData>) => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation
      if (updateData.email && !updateData.email.includes('@')) {
        throw new Error('Format email tidak valid');
      }

      console.log('Updating therapist:', therapistId, updateData);
      
      return {
        success: true,
        message: 'Data therapist berhasil diperbarui',
        therapist: { ...updateData, id: therapistId }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memperbarui data therapist';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    registerTherapist,
    sendConfirmationEmail,
    getTherapists,
    updateTherapistStatus,
    updateTherapist,
    loading,
    error,
    clearError: () => setError(null)
  };
};
