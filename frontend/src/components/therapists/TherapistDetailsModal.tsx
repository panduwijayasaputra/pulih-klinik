'use client';

import React, { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ClockIcon, EnvelopeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Therapist } from '@/types/therapist';
import { THERAPIST_SPECIALIZATIONS } from '@/types/therapist';
import { TherapistStatusEnum, UserRoleEnum } from '@/types/enums';
import { TherapistAPI } from '@/lib/api/therapist';

interface TherapistDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistId?: string | undefined; // Use ID instead of full therapist object
  hasRole: (role: UserRoleEnum) => boolean;
  actionLoading: string | null;
  resendCooldowns: Record<string, number>;
  onEdit: (therapistId: string) => void;
  onStatusChange: (therapistId: string, status: 'active' | 'inactive') => void;
  onResendEmail: (therapistId: string) => void;
  formatCountdown: (seconds: number) => string;
}

// Helper functions to convert between specialization IDs and names
const getSpecializationNameById = (id: string): string => {
  const spec = THERAPIST_SPECIALIZATIONS.find(s => s.id === id);
  return spec ? spec.name : id; // Return id as fallback
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case TherapistStatusEnum.Active:
      return (
        <Badge variant="success">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Aktif
        </Badge>
      );
    case TherapistStatusEnum.PendingSetup:
      return (
        <Badge variant="warning">
          <ClockIcon className="w-3 h-3 mr-1" />
          Menunggu Setup
        </Badge>
      );
    case TherapistStatusEnum.Inactive:
      return (
        <Badge variant="destructive">
          <XMarkIcon className="w-3 h-3 mr-1" />
          Tidak Aktif
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const TherapistDetailsModal: React.FC<TherapistDetailsModalProps> = ({
  isOpen,
  onClose,
  therapistId,
  hasRole,
  actionLoading,
  resendCooldowns,
  onEdit,
  onStatusChange,
  onResendEmail,
  formatCountdown,
}) => {
  const [loading, setLoading] = useState(false);
  const [therapistData, setTherapistData] = useState<Therapist | null>(null);
  const { openDialog, isOpen: dialogIsOpen, config: dialogConfig, closeDialog } = useConfirmationDialog();

  // Fetch therapist data when modal opens
  useEffect(() => {
    if (isOpen && therapistId) {
      setLoading(true);
      
      const fetchTherapistData = async () => {
        try {
          const response = await TherapistAPI.getTherapist(therapistId);
          if (response.success && response.data) {
            setTherapistData(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch therapist details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTherapistData();
    } else {
      setTherapistData(null);
      setLoading(false);
    }
  }, [isOpen, therapistId]);

  const handleResendEmailConfirm = () => {
    if (!therapistData) return;
    
    openDialog({
      title: 'Kirim Ulang Email Registrasi',
      description: `Yakin ingin mengirim ulang email registrasi ke ${therapistData.email}? Therapist akan menerima link setup yang baru.`,
      confirmText: 'Kirim Ulang',
      cancelText: 'Batal',
      variant: 'info',
      onConfirm: () => onResendEmail(therapistData.id)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] min-h-[60vh] overflow-y-auto mx-4">
        <div className="p-6">
          {/* Modal Header */}
          <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Detail Therapist
              </h2>
              <p className="text-sm text-gray-600 mt-1">Informasi lengkap therapist</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Memuat detail therapist...</span>
              </div>
            </div>
          )}

          {/* Therapist Information - Only show when not loading and data is available */}
          {!loading && therapistData && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Dasar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <p className="mt-1 text-sm text-gray-900">{therapistData.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                    <p className="mt-1 text-sm text-gray-900">{therapistData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <p className="mt-1 text-sm text-gray-900">{therapistData.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status Akun</label>
                    <div className="mt-1">
                      {getStatusBadge(therapistData.status)}
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
                    <p className="mt-1 text-sm text-gray-900">{therapistData.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Spesialisasi</label>
                    <p className="mt-1 text-sm text-gray-900">{therapistData.specializations.map(id => getSpecializationNameById(id)).join(', ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tahun Pengalaman</label>
                    <p className="mt-1 text-sm text-gray-900">{therapistData.yearsOfExperience} tahun</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {therapistData.education.map((edu, index) => (
                        <div key={index} className="mb-1">
                          {edu.degree} {edu.field} - {edu.institution} ({edu.year})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {therapistData.certifications && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Sertifikasi</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {therapistData.certifications.map((cert, index) => (
                        <div key={index} className="mb-1">
                          {cert.name} - {cert.issuingOrganization} ({cert.certificateNumber})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Kerja</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Klien Aktif</span>
                      <span className="text-2xl font-bold text-blue-600">{therapistData.currentLoad}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Maksimal Klien</span>
                      <span className="text-2xl font-bold text-green-600">{therapistData.maxClients}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          {!loading && therapistData && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              {/* Left side - Close button */}
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
              >
                <XMarkIcon className="w-4 h-4" />
                Tutup
              </Button>

              {/* Right side - Action buttons */}
              <div className="flex space-x-3">
                {/* Clinic Admin Actions */}
                {hasRole(UserRoleEnum.ClinicAdmin) && (
                  <>
                    {/* Edit Button */}
                    <Button
                      onClick={() => onEdit(therapistData.id)}
                      variant="info"
                      size="sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit Therapist
                    </Button>

                    {/* Status Management Buttons */}
                    {therapistData.status === 'active' && (
                      <Button
                        onClick={() => {
                          onClose();
                          onStatusChange(therapistData.id, 'inactive');
                        }}
                        disabled={actionLoading === therapistData.id}
                        variant="destructive"
                        size="sm"
                      >
                        {actionLoading === therapistData.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <XMarkIcon className="w-4 h-4" />
                            Nonaktifkan Akun
                          </>
                        )}
                      </Button>
                    )}

                    {therapistData.status === 'inactive' && (
                      <Button
                        onClick={() => {
                          onClose();
                          onStatusChange(therapistData.id, 'active');
                        }}
                        disabled={actionLoading === therapistData.id}
                        variant="success"
                        size="sm"
                      >
                        {actionLoading === therapistData.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Aktifkan Akun
                          </>
                        )}
                      </Button>
                    )}

                    {/* Resend Email Button for Pending Setup */}
                    {therapistData.status === TherapistStatusEnum.PendingSetup && (() => {
                      const cooldown = resendCooldowns[therapistData.id];
                      const isInCooldown = Boolean(cooldown && cooldown > 0);

                      return (
                        <Button
                          onClick={handleResendEmailConfirm}
                          disabled={actionLoading === therapistData.id || isInCooldown}
                          variant="softInfo"
                          size="sm"
                        >
                          {actionLoading === therapistData.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Mengirim...
                            </>
                          ) : isInCooldown ? (
                            <>
                              <ClockIcon className="w-4 h-4" />
                              Kirim Ulang Email dalam {formatCountdown(cooldown || 0)}
                            </>
                          ) : (
                            <>
                              <EnvelopeIcon className="w-4 h-4" />
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
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogIsOpen}
        onClose={closeDialog}
        {...dialogConfig}
      />
    </div>
  );
};
