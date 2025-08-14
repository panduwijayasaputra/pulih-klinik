import { useCallback, useState } from 'react';

// New interface for therapist account creation (NO password fields)
interface TherapistAccountCreationData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  
  // Professional Information
  licenseNumber: string;
  specialization: string;
  yearsExperience: number;
  education: string;
  certifications?: string | undefined;
  
  // Admin fields
  adminNotes?: string | undefined;
  createdBy: string;
  clinicId: string;
  status: 'pending_setup' | 'active' | 'inactive';
}

interface TherapistAccountCreationResponse {
  success: boolean;
  therapist_id?: string;
  registration_token?: string;
  email_sent?: boolean;
  message?: string;
}

interface EmailConfirmationResponse {
  success: boolean;
  message?: string;
}

export const useTherapist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTherapistAccount = useCallback(async (therapistData: TherapistAccountCreationData): Promise<TherapistAccountCreationResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (!therapistData.email || !therapistData.name) {
        throw new Error('Email dan nama wajib diisi');
      }

      // Mock email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(therapistData.email)) {
        throw new Error('Format email tidak valid');
      }

      // Check for duplicate email (mock)
      if (therapistData.email === 'existing@example.com') {
        throw new Error('Email sudah terdaftar');
      }

      // Generate unique therapist ID and registration token
      const therapistId = 'th-' + Date.now();
      const registrationToken = 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      // Mock saving to system with pending_setup status
      const savedTherapist = {
        ...therapistData,
        id: therapistId,
        status: 'pending_setup' as const, // Waiting for password setup
        createdAt: new Date().toISOString(),
        registrationToken,
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        // Convert certifications string to array
        certifications: therapistData.certifications 
          ? therapistData.certifications.split(',').map(cert => cert.trim())
          : []
      };
      
      console.warn('Creating therapist account:', savedTherapist);
      
      // Mock sending registration email with setup link
      const registrationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/therapist/setup?token=${registrationToken}`;
      
      console.warn('Sending therapist registration email:', {
        to: therapistData.email,
        subject: '🔐 Complete Your Therapist Registration - TeraPin.tar',
        emailTemplate: {
          greeting: `Selamat datang, ${therapistData.name}!`,
          introduction: 'Anda telah berhasil didaftarkan sebagai therapist di TeraPin.tar.',
          clinicInfo: 'Klinik Sehat Jiwa Jakarta', // Would come from therapistData.clinicId lookup
          instructions: [
            'Klik tautan di bawah untuk mengatur password Anda',
            'Tautan ini akan berlaku selama 24 jam',
            'Setelah mengatur password, Anda dapat langsung login'
          ],
          registrationLink,
          securityNote: 'Untuk keamanan, tautan ini hanya dapat digunakan sekali.',
          supportInfo: {
            helpText: 'Jika Anda memerlukan bantuan, silakan hubungi administrator klinik Anda.',
            supportEmail: 'admin@kliniksehatjiwa.com'
          }
        },
        expiresIn: '24 hours',
        timestamp: new Date().toISOString()
      });
      
      // Mock clinic admin notification with detailed info
      console.warn('Notifying clinic admin of therapist registration:', {
        adminId: therapistData.createdBy,
        notificationType: 'therapist_registration_created',
        therapistDetails: {
          name: therapistData.name,
          email: therapistData.email,
          specialization: therapistData.specialization,
          licenseNumber: therapistData.licenseNumber
        },
        systemMessage: `New therapist account created for ${therapistData.name}`,
        actions: {
          emailSent: true,
          registrationEmailTo: therapistData.email,
          tokenGenerated: true,
          tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        adminNotificationEmail: {
          subject: '✅ New Therapist Account Created - Action Required',
          message: `A new therapist account has been created for ${therapistData.name} (${therapistData.email}). The therapist has been sent a registration email to complete their password setup.`,
          nextSteps: [
            'Therapist will receive registration email with secure setup link',
            'Monitor therapist activation status in the management dashboard',
            'Contact therapist if they don\'t complete setup within 24 hours'
          ]
        },
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        therapist_id: therapistId,
        registration_token: registrationToken,
        email_sent: true,
        message: 'Akun therapist berhasil dibuat. Email registrasi telah dikirim.'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat akun therapist';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendConfirmationEmail = useCallback(async (email: string, therapistName: string): Promise<EmailConfirmationResponse> => {
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

      // Mock sending enhanced confirmation email
      console.warn('Sending therapist account activation confirmation:', {
        to: email,
        subject: '🎉 Welcome to TeraPin.tar - Your Account is Now Active!',
        emailTemplate: {
          greeting: `Selamat datang, ${therapistName}!`,
          message: 'Akun therapist Anda di TeraPin.tar telah berhasil diaktivasi.',
          accountDetails: {
            status: 'Active',
            loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portal`
          },
          features: [
            'Akses ke dashboard therapist lengkap',
            'Manajemen klien dan sesi terapi',
            'Sistem AI untuk rekomendasi teknik hipnoterapi',
            'Pembuatan skrip otomatis',
            'Analytics dan reporting'
          ],
          nextSteps: [
            'Login dengan email dan password yang sudah Anda buat',
            'Lengkapi profil therapist Anda',
            'Mulai mengelola klien dan sesi terapi',
            'Eksplorasi fitur-fitur AI yang tersedia'
          ],
          supportInfo: {
            helpText: 'Tim support kami siap membantu Anda memulai perjalanan sebagai therapist digital.',
            supportEmail: 'support@terapintar.com',
            documentationUrl: 'https://docs.terapintar.com/therapist-guide'
          },
          clinicInfo: 'Klinik Sehat Jiwa Jakarta'
        },
        timestamp: new Date().toISOString()
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
  }, []);

  const getTherapists = useCallback(async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock therapists data with pending_setup status
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
            status: 'pending_setup' as const, // Waiting for password setup
            sessions_completed: 0,
            client_satisfaction: 0
          },
          {
            id: 'th-4',
            name: 'Dr. Maya Sari',
            email: 'maya@kliniksehat.com',
            specialization: 'Anxiety Disorders',
            status: 'pending_setup' as const, // Just created, waiting for password setup
            sessions_completed: 0,
            client_satisfaction: 0
          }
        ]
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data therapist';
      return {
        success: false,
        therapists: [],
        message: errorMessage
      };
    }
  }, []);

  const updateTherapistStatus = useCallback(async (therapistId: string, status: 'active' | 'inactive') => {
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
  }, []);


  return {
    createTherapistAccount, // New function for two-step registration
    sendConfirmationEmail,
    getTherapists,
    updateTherapistStatus,
    loading,
    error,
    clearError: () => setError(null)
  };
};
