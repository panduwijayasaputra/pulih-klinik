'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon,
  StarIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
  education: string;
  certifications?: string;
  adminNotes?: string;
  status: 'active' | 'pending_setup' | 'inactive';
  sessions_completed: number;
  client_satisfaction: number;
  registrationDate: string;
  lastActive?: string;
}

export const TherapistList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [resendCooldowns, setResendCooldowns] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { addToast } = useToast();
  const router = useRouter();

  // Handle resend cooldown countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setResendCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] && updated[key] > 0) {
            updated[key] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load therapists data directly in the component
  useEffect(() => {
    const loadTherapists = async () => {
      console.log('🔄 TherapistList: Starting to load therapist data...');
      setLoading(true);
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock therapists data
        const mockTherapists = [
          {
            id: 'th-1',
            name: 'Dr. Budi Santoso',
            email: 'budi@kliniksehat.com',
            phone: '+62-812-3456-7890',
            specialization: 'Anxiety Disorders',
            licenseNumber: 'SIP-123456',
            yearsExperience: 8,
            education: 'S1 Psikologi, Universitas Indonesia',
            certifications: 'Certified Hypnotherapist, CBT Practitioner',
            adminNotes: 'Excellent therapist with strong client relationships',
            status: 'active' as const,
            sessions_completed: 45,
            client_satisfaction: 4.8,
            registrationDate: '2024-01-10',
            lastActive: '2 hours ago'
          },
          {
            id: 'th-2',
            name: 'Dr. Siti Rahayu',
            email: 'siti@kliniksehat.com',
            phone: '+62-813-4567-8901',
            specialization: 'Depression',
            licenseNumber: 'SIP-123457',
            yearsExperience: 12,
            education: 'S2 Psikologi Klinis, Universitas Gadjah Mada',
            certifications: 'EMDR Certified, Trauma Specialist',
            adminNotes: 'Specializes in trauma and depression cases',
            status: 'active' as const,
            sessions_completed: 32,
            client_satisfaction: 4.9,
            registrationDate: '2024-01-08',
            lastActive: '4 hours ago'
          },
          {
            id: 'th-3',
            name: 'Dr. Ahmad Pratama',
            email: 'ahmad@kliniksehat.com',
            phone: '+62-814-5678-9012',
            specialization: 'PTSD',
            licenseNumber: 'SIP-123458',
            yearsExperience: 5,
            education: 'S1 Psikologi, Universitas Airlangga',
            certifications: 'PTSD Specialist, Military Trauma Certified',
            adminNotes: 'New therapist, strong background in military trauma',
            status: 'pending_setup' as const,
            sessions_completed: 0,
            client_satisfaction: 0,
            registrationDate: '2024-01-12',
            lastActive: 'Never'
          },
          {
            id: 'th-4',
            name: 'Dr. Maya Sari',
            email: 'maya@kliniksehat.com',
            phone: '+62-815-6789-0123',
            specialization: 'Anxiety Disorders',
            licenseNumber: 'SIP-123459',
            yearsExperience: 6,
            education: 'S1 Psikologi, Universitas Padjadjaran',
            certifications: 'Anxiety Specialist, Mindfulness Practitioner',
            adminNotes: 'Experienced in anxiety and stress management',
            status: 'pending_setup' as const,
            sessions_completed: 0,
            client_satisfaction: 0,
            registrationDate: '2024-01-14',
            lastActive: 'Never'
          }
        ];
        
        setTherapists(mockTherapists);
        console.log('✅ TherapistList: Therapist data loaded successfully');
      } catch (error) {
        console.error('Failed to load therapists:', error);
        addToast({
          type: 'error',
                  title: 'Kesalahan Koneksi',
        message: 'Gagal terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadTherapists();
  }, []); // Only run once on mount

  // Refresh function
  const refreshTherapists = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock therapists data
      const mockTherapists = [
        {
          id: 'th-1',
          name: 'Dr. Budi Santoso',
          email: 'budi@kliniksehat.com',
          phone: '+62-812-3456-7890',
          specialization: 'Anxiety Disorders',
          licenseNumber: 'SIP-123456',
          yearsExperience: 8,
          education: 'S1 Psikologi, Universitas Indonesia',
          certifications: 'Certified Hypnotherapist, CBT Practitioner',
          adminNotes: 'Excellent therapist with strong client relationships',
          status: 'active' as const,
          sessions_completed: 45,
          client_satisfaction: 4.8,
          registrationDate: '2024-01-10',
          lastActive: '2 hours ago'
        },
        {
          id: 'th-2',
          name: 'Dr. Siti Rahayu',
          email: 'siti@kliniksehat.com',
          phone: '+62-813-4567-8901',
          specialization: 'Depression',
          licenseNumber: 'SIP-123457',
          yearsExperience: 12,
          education: 'S2 Psikologi Klinis, Universitas Gadjah Mada',
          certifications: 'EMDR Certified, Trauma Specialist',
          adminNotes: 'Specializes in trauma and depression cases',
          status: 'active' as const,
          sessions_completed: 32,
          client_satisfaction: 4.9,
          registrationDate: '2024-01-08',
          lastActive: '4 hours ago'
        },
        {
          id: 'th-3',
          name: 'Dr. Ahmad Pratama',
          email: 'ahmad@kliniksehat.com',
          phone: '+62-814-5678-9012',
          specialization: 'PTSD',
          licenseNumber: 'SIP-123458',
          yearsExperience: 5,
          education: 'S1 Psikologi, Universitas Airlangga',
          certifications: 'PTSD Specialist, Military Trauma Certified',
          adminNotes: 'New therapist, strong background in military trauma',
          status: 'pending_setup' as const,
          sessions_completed: 0,
          client_satisfaction: 0,
          registrationDate: '2024-01-12',
          lastActive: 'Never'
        },
        {
          id: 'th-4',
          name: 'Dr. Maya Sari',
          email: 'maya@kliniksehat.com',
          phone: '+62-815-6789-0123',
          specialization: 'Anxiety Disorders',
          licenseNumber: 'SIP-123459',
          yearsExperience: 6,
          education: 'S1 Psikologi, Universitas Padjadjaran',
          certifications: 'Anxiety Specialist, Mindfulness Practitioner',
          adminNotes: 'Experienced in anxiety and stress management',
          status: 'pending_setup' as const,
          sessions_completed: 0,
          client_satisfaction: 0,
          registrationDate: '2024-01-14',
          lastActive: 'Never'
        }
      ];
      
      setTherapists(mockTherapists);
    } catch (error) {
      console.error('Failed to refresh therapists:', error);
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh therapist data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }, []); // Remove addToast dependency

  const handleViewDetails = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedTherapist(null);
    setShowDetailsModal(false);
  };

  const handleEditTherapist = (therapistId: string) => {
    handleCloseDetails();
    window.location.href = `/portal/therapists/edit/${therapistId}`;
  };

  const handleResendEmail = async (therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
      addToast({
        type: 'error',
        title: 'Therapist Not Found',
        message: 'Therapist tidak ditemukan. Silakan segarkan halaman dan coba lagi.'
      });
      return;
    }

    setActionLoading(therapistId);
    try {
      // Mock API call to resend email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set cooldown timer (60 seconds)
      setResendCooldowns(prev => ({
        ...prev,
        [therapistId]: 60
      }));
      
      addToast({
        type: 'success',
        title: 'Email Berhasil Dikirim Ulang',
        message: `Email registrasi telah dikirim ulang ke ${therapist.email}. Therapist akan menerima link setup yang baru.`
      });
    } catch (error) {
      console.error('Resend email error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: 'Gagal mengirim ulang email registrasi. Silakan coba lagi.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChangeRequest = (therapistId: string, newStatus: 'active' | 'inactive') => {
    if (!user || !user.roles.includes('clinic_admin')) {
      addToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Only clinic administrators can change therapist status'
      });
      return;
    }

    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
      addToast({
        type: 'error',
        title: 'Therapist Not Found',
        message: 'The selected therapist could not be found. Please refresh the page and try again.'
      });
      return;
    }

    const actionTextId = newStatus === 'active' ? 'aktifkan' : 'nonaktifkan';
    const actionTitleId = newStatus === 'active' ? 'Aktifkan Akun Therapist' : 'Nonaktifkan Akun Therapist';
    const actionColor = newStatus === 'active' ? 'success' : 'warning';

    // Konfirmasi sederhana dalam Bahasa Indonesia
    showConfirmation({
      type: actionColor,
      title: actionTitleId,
      message: `Yakin ingin ${actionTextId} akun ${therapist.name}? ${newStatus === 'active' ? 'Mereka akan dapat mengakses akun kembali.' : 'Mereka tidak akan dapat mengakses akun hingga diaktifkan lagi.'}`,
      confirmText: actionTextId.charAt(0).toUpperCase() + actionTextId.slice(1),
      cancelText: 'Batal'
    }, () => executeStatusChange(therapistId, newStatus));
  };

  const executeStatusChange = async (therapistId: string, newStatus: 'active' | 'inactive') => {
    if (!user) {
      addToast({
        type: 'error',
        title: 'Kesalahan Autentikasi',
        message: 'Sesi pengguna tidak ditemukan. Silakan login kembali.'
      });
      return;
    }

    setActionLoading(therapistId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const therapist = therapists.find(t => t.id === therapistId);
      
      // Update local state
      setTherapists(prev => 
        prev.map(therapist => 
          therapist.id === therapistId 
            ? { ...therapist, status: newStatus }
            : therapist
        )
      );
      
      // Log clinic admin action for audit
      console.warn('Clinic Admin Action:', {
        adminId: user.id,
        adminName: user.name,
        action: `Changed therapist status to ${newStatus}`,
        therapistId,
        therapistName: therapist?.name,
        timestamp: new Date().toISOString()
      });

      addToast({
        type: 'success',
        title: 'Status Berhasil Diperbarui',
        message: `Akun ${therapist?.name} telah ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}. ${newStatus === 'active' ? 'Mereka sekarang dapat mengakses akun dan melakukan sesi.' : 'Mereka tidak akan dapat mengakses akun lagi.'}`
      });
    } catch (error) {
      console.error('Status update error:', error);
      addToast({
        type: 'error',
        title: 'Kesalahan Sistem',
        message: 'Terjadi kesalahan tak terduga saat memperbarui status therapist. Silakan coba lagi.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        );
      case 'pending_setup':
        return (
          <Badge variant="warning">
            <ClockIcon className="w-3 h-3 mr-1" />
            Menunggu Setup
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="destructive">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Tidak Aktif
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-2 text-gray-600">Memuat therapist...</span>
      </div>
    );
  }

  if (therapists.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Therapist</h3>
        <p className="text-gray-600 mb-4">
          Mulai dengan menambahkan therapist pertama ke klinik.
        </p>
        <Button 
          onClick={refreshTherapists} 
          disabled={loading}
          variant="outline"
          className="mt-4"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
              Memperbarui...
            </>
          ) : (
            <>
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Segarkan
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={refreshTherapists} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                Memperbarui...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Segarkan
              </>
            )}
          </Button>
        </div>
      </div>

      {therapists.map((therapist) => (
        <div
          key={therapist.id}
          className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {therapist.name}
                  </h3>
                  {getStatusBadge(therapist.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <p><span className="font-medium">Email:</span> {therapist.email}</p>
                    <p><span className="font-medium">Specialization:</span> {therapist.specialization}</p>
                  </div>
                  
                  <div>
                    <p><span className="font-medium">Sessions:</span> {therapist.sessions_completed}</p>
                    <div className="flex items-center">
                      <span className="font-medium">Rating:</span>
                      <StarIcon className="w-4 h-4 text-yellow-500 ml-2 mr-1" />
                      <span>{formatRating(therapist.client_satisfaction)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Status-specific information */}
                    {therapist.status === 'pending_setup' && (
                      <p className="text-yellow-600 text-xs">
                        Menunggu setup password
                      </p>
                    )}
                    {therapist.status === 'active' && therapist.sessions_completed > 0 && (
                      <p className="text-green-600 text-xs">
                        Aktif dengan {therapist.sessions_completed} sesi
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {/* View Details Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(therapist)}
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                Lihat
              </Button>

              {/* Edit Button (Clinic Admin Only) */}
              {user?.roles.includes('clinic_admin') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditTherapist(therapist.id)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}

              {/* Status Action Buttons (Clinic Admin Only) */}
              {user?.roles.includes('clinic_admin') && (
                <>
                  {therapist.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChangeRequest(therapist.id, 'inactive')}
                      disabled={actionLoading === therapist.id}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {actionLoading === therapist.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      ) : (
                        'Nonaktifkan'
                      )}
                    </Button>
                  )}
                  
                  {therapist.status === 'inactive' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChangeRequest(therapist.id, 'active')}
                      disabled={actionLoading === therapist.id}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      {actionLoading === therapist.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                      ) : (
                        'Aktifkan'
                      )}
                    </Button>
                  )}
                  
                  {therapist.status === 'pending_setup' && (() => {
                    const cooldown = resendCooldowns[therapist.id];
                    const isInCooldown = Boolean(cooldown && cooldown > 0);
                    
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResendEmail(therapist.id)}
                        disabled={actionLoading === therapist.id || isInCooldown}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                      >
                        {actionLoading === therapist.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                        ) : isInCooldown ? (
                          <>
                            <ClockIcon className="w-4 h-4 mr-1" />
                            Kirim Ulang Email dalam {formatCountdown(cooldown || 0)}
                          </>
                        ) : (
                          <>
                            <EnvelopeIcon className="w-4 h-4 mr-1" />
                            Kirim Ulang Email
                          </>
                        )}
                      </Button>
                    );
                  })()}
                </>
              )}
            </div>
          </div>

          {/* Additional Info for Pending Setup */}
          {therapist.status === 'pending_setup' && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <p className="text-yellow-800">
                <strong>Registrasi sedang berlangsung:</strong> Therapist ini dibuat oleh admin klinik dan sedang menunggu untuk menyelesaikan setup password melalui link email.
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Clinic Admin Action Log Note */}
      {user?.roles.includes('clinic_admin') && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <p>
            <strong>Admin Note:</strong> All therapist management actions are logged with your admin ID and timestamp for audit purposes.
          </p>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {ConfirmationDialog}

              {/* Therapist Details Modal */}
        {showDetailsModal && selectedTherapist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTherapist.name}
                  </h2>
                  <p className="text-gray-600 mt-1">Detail Therapist</p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Therapist Information */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Dasar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Akun</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedTherapist.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Profesional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Lisensi (SIP)</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.licenseNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Spesialisasi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.specialization}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tahun Pengalaman</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.yearsExperience} tahun</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.education}</p>
                    </div>
                  </div>
                  {selectedTherapist.certifications && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Sertifikasi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.certifications}</p>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Akun</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Registrasi</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.registrationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Terakhir Aktif</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTherapist.lastActive}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Metrik Kinerja</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Sesi Selesai</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedTherapist.sessions_completed}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Kepuasan Klien</span>
                        <div className="flex items-center">
                          <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-2xl font-bold text-yellow-600">
                            {formatRating(selectedTherapist.client_satisfaction)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedTherapist.adminNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan Admin</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedTherapist.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Status Information */}
                {selectedTherapist.status === 'pending_setup' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Status Registrasi</h4>
                    <p className="text-sm text-yellow-700">
                      Akun therapist ini sedang menunggu pengaturan password. Therapist akan menerima email dengan link aman untuk menyelesaikan registrasi.
                    </p>
                    <p className="text-xs text-yellow-600 mt-2">
                      💡 <strong>Tip:</strong> Jika therapist belum menerima email, Anda dapat mengirim ulang email registrasi menggunakan tombol di bawah.
                    </p>
                  </div>
                )}

                {selectedTherapist.status === 'active' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Status Akun</h4>
                    <p className="text-sm text-green-700">
                      Akun therapist ini aktif dan dapat melakukan sesi. Mereka telah menyelesaikan {selectedTherapist.sessions_completed} sesi dengan rating kepuasan rata-rata {formatRating(selectedTherapist.client_satisfaction)}.
                    </p>
                  </div>
                )}

                {selectedTherapist.status === 'inactive' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Status Akun</h4>
                    <p className="text-sm text-red-700">
                      Akun therapist ini saat ini tidak aktif dan tidak dapat melakukan sesi. Hubungi administrator klinik untuk mengaktifkan kembali akun.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                {/* Temporarily bypass role check for testing */}
                <Button 
                  variant="outline"
                  onClick={() => handleEditTherapist(selectedTherapist.id)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Edit Therapist
                </Button>
                {user?.roles.includes('clinic_admin') && selectedTherapist.status === 'pending_setup' && (() => {
                  const cooldown = resendCooldowns[selectedTherapist.id];
                  const isInCooldown = Boolean(cooldown && cooldown > 0);
                  
                  return (
                    <Button 
                      variant="outline"
                      onClick={() => handleResendEmail(selectedTherapist.id)}
                      disabled={actionLoading === selectedTherapist.id || isInCooldown}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                    >
                      {actionLoading === selectedTherapist.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                          Mengirim...
                        </>
                      ) : isInCooldown ? (
                        <>
                          <ClockIcon className="w-4 h-4 mr-2" />
                          Kirim Ulang Email dalam {formatCountdown(cooldown || 0)}
                        </>
                      ) : (
                        <>
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          Kirim Ulang Email
                        </>
                      )}
                    </Button>
                  );
                })()}
                <Button variant="outline" onClick={handleCloseDetails}>
                  Tutup
                </Button>
                {user?.roles.includes('clinic_admin') && selectedTherapist.status === 'active' && (
                                      <Button 
                      variant="outline" 
                      onClick={() => {
                        handleCloseDetails();
                        handleStatusChangeRequest(selectedTherapist.id, 'inactive');
                      }}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Nonaktifkan Akun
                    </Button>
                )}
                {user?.roles.includes('clinic_admin') && selectedTherapist.status === 'inactive' && (
                                      <Button 
                      variant="outline" 
                      onClick={() => {
                        handleCloseDetails();
                        handleStatusChangeRequest(selectedTherapist.id, 'active');
                      }}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Aktifkan Akun
                    </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};