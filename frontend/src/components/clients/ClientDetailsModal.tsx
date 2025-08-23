'use client';

import React, { useEffect, useState } from 'react';
import { XMarkIcon, UserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, BriefcaseIcon, AcademicCapIcon, CalendarIcon, ChartBarIcon, ChatBubbleLeftRightIcon, PencilIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Client } from '@/types/client';
import { ClientEducationLabels, ClientGuardianMaritalStatusLabels, ClientGuardianRelationshipLabels, ClientMaritalStatusLabels, ClientRelationshipWithSpouseLabels, ClientReligionLabels, ClientStatusEnum, ClientStatusLabels, UserRoleEnum } from '@/types/enums';
import { ClientStatusBadge } from './ClientStatusBadge';
import { ClientAPI } from '@/lib/api/client';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string | undefined; // Use ID instead of full client object
  isTherapist: boolean;
  onEdit: (client: Client) => void;
  onAssign: (clientId: string) => void;
  onConsultation: (clientId: string) => void;
}

const getStatusBadge = (status: Client['status']) => {
  return <ClientStatusBadge status={status as ClientStatusEnum} />;
};

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  clientId,
  isTherapist,
  onEdit,
  onAssign,
  onConsultation,
}) => {
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<Client | null>(null);

  // Fetch client data when modal opens
  useEffect(() => {
    if (isOpen && clientId) {
      setLoading(true);
      
      const fetchClientData = async () => {
        try {
          const response = await ClientAPI.getClient(clientId);
          if (response.success && response.data) {
            setClientData(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch client details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchClientData();
    } else {
      setClientData(null);
      setLoading(false);
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ margin: 0 }}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] min-h-[60vh] overflow-y-auto mx-4">
        <div className="p-6">
          {/* Modal Header */}
          <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-6">
            <div className="flex-1"> 
              <h2 className="text-xl font-semibold text-gray-900">
                Detail Klien
              </h2>
              <p className="text-sm text-gray-600 mt-1">Informasi lengkap klien</p>
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
                <span className="text-gray-600">Memuat detail klien...</span>
              </div>
            </div>
          )}

          {/* Client Information - Only show when not loading and data is available */}
          {!loading && clientData && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Dasar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData!.fullName || clientData!.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.birthPlace}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {clientData.birthDate ? new Date(clientData.birthDate).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status Pernikahan</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {ClientMaritalStatusLabels[clientData.maritalStatus as keyof typeof ClientMaritalStatusLabels] || clientData.maritalStatus}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status Akun</label>
                    <div className="mt-1">
                      {getStatusBadge(clientData.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Minor-specific Information */}
              {clientData.isMinor && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Sekolah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientData.school && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nama Sekolah</label>
                          <p className="mt-1 text-sm text-gray-900">{clientData.school}</p>
                        </div>
                      )}
                      {clientData.grade && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Kelas</label>
                          <p className="mt-1 text-sm text-gray-900">{clientData.grade}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Wali</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientData.guardianFullName && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nama Lengkap Wali</label>
                          <p className="mt-1 text-sm text-gray-900">{clientData.guardianFullName}</p>
                        </div>
                      )}
                      {clientData.guardianRelationship && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hubungan dengan Klien</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {ClientGuardianRelationshipLabels[clientData.guardianRelationship as keyof typeof ClientGuardianRelationshipLabels] || clientData.guardianRelationship}
                          </p>
                        </div>
                      )}
                      {clientData.guardianPhone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nomor Telepon Wali</label>
                          <p className="mt-1 text-sm text-gray-900">{clientData.guardianPhone}</p>
                        </div>
                      )}
                      {clientData.guardianOccupation && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pekerjaan Wali</label>
                          <p className="mt-1 text-sm text-gray-900">{clientData.guardianOccupation}</p>
                        </div>
                      )}
                      {clientData.guardianMaritalStatus && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status Pernikahan Wali</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {ClientGuardianMaritalStatusLabels[clientData.guardianMaritalStatus as keyof typeof ClientGuardianMaritalStatusLabels] || clientData.guardianMaritalStatus}
                          </p>
                        </div>
                      )}
                      {clientData.guardianAddress && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Alamat Wali</label>
                          <p className="mt-1 text-sm text-gray-900">{clientData.guardianAddress}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hak Asuh Hukum</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {clientData.guardianLegalCustody ? 'Ya' : 'Tidak'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dokumen Hak Asuh</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {clientData.guardianCustodyDocsAttached ? 'Terlampir' : 'Belum terlampir'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.phone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.email}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Alamat</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional & Education Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Profesional & Pendidikan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {clientData.occupation}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pendidikan</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {ClientEducationLabels[clientData.education as keyof typeof ClientEducationLabels] || clientData.education}
                      {clientData.educationMajor && (
                        <span className="text-gray-600 ml-1">- {clientData.educationMajor}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agama</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {ClientReligionLabels[clientData.religion as keyof typeof ClientReligionLabels] || clientData.religion}
                    </p>
                  </div>
                  {clientData.hobbies && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hobi</label>
                      <p className="mt-1 text-sm text-gray-900">{clientData.hobbies}</p>
                    </div>
                  )}
                  {clientData.province && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Provinsi</label>
                      <p className="mt-1 text-sm text-gray-900">{clientData.province}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Marital Information */}
              {clientData.maritalStatus === 'Married' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Pernikahan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientData.spouseName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Pasangan</label>
                        <p className="mt-1 text-sm text-gray-900">{clientData.spouseName}</p>
                      </div>
                    )}
                    {clientData.relationshipWithSpouse && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hubungan dengan Pasangan</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {ClientRelationshipWithSpouseLabels[clientData.relationshipWithSpouse as keyof typeof ClientRelationshipWithSpouseLabels] || clientData.relationshipWithSpouse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visit Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Kunjungan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kunjungan Pertama</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {clientData.firstVisit ? 'Ya' : 'Tidak'}
                    </p>
                  </div>
                  {!clientData.firstVisit && clientData.previousVisitDetails && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Detail Kunjungan Sebelumnya</label>
                      <p className="mt-1 text-sm text-gray-900">{clientData.previousVisitDetails}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Therapy Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Terapi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Progress</label>
                    <div className="mt-1 flex items-center">
                      <ChartBarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${clientData.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{clientData.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Sesi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Sesi</span>
                      <span className="text-2xl font-bold text-blue-600">{clientData.totalSessions}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Bergabung</span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(clientData.joinDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  {clientData.lastSession && (
                    <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Sesi Terakhir</span>
                        <span className="text-sm text-gray-600">
                          {new Date(clientData.lastSession).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              {(clientData.emergencyContactName || clientData.emergencyContactPhone) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kontak Darurat</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientData.emergencyContactName && (
                        <div>
                          <label className="block text-xs font-medium text-red-700">Nama</label>
                          <p className="mt-1 text-sm text-red-800">{clientData.emergencyContactName}</p>
                        </div>
                      )}
                      {clientData.emergencyContactPhone && (
                        <div>
                          <label className="block text-xs font-medium text-red-700">Telepon</label>
                          <p className="mt-1 text-sm text-red-800">{clientData.emergencyContactPhone}</p>
                        </div>
                      )}
                      {clientData.emergencyContactRelationship && (
                        <div>
                          <label className="block text-xs font-medium text-red-700">Hubungan</label>
                          <p className="mt-1 text-sm text-red-800">{clientData.emergencyContactRelationship}</p>
                        </div>
                      )}
                      {clientData.emergencyContactAddress && (
                        <div>
                          <label className="block text-xs font-medium text-red-700">Alamat</label>
                          <p className="mt-1 text-sm text-red-800">{clientData.emergencyContactAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {clientData.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Catatan</h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{clientData.notes}</p>
                  </div>
                </div>
              )}

              {/* Session History */}
              <div>
                {/* Session history content will be added here */}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          {!loading && clientData && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {/* Edit Client - show for all except therapists */}
                {!isTherapist && (
                  <button
                    onClick={() => onEdit(clientData)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 flex items-center"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Klien
                  </button>
                )}

                {/* Assign Therapist - only for New clients without therapist */}
                {!isTherapist && clientData.status === ClientStatusEnum.New && !clientData.assignedTherapist && (
                  <button
                    onClick={() => {
                      onClose();
                      onAssign(clientData.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-md hover:bg-green-50 flex items-center"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Tugaskan Therapist
                  </button>
                )}

                {/* Re-assign Therapist - only for clients with therapist but not Done */}
                {!isTherapist && clientData.assignedTherapist && clientData.status !== ClientStatusEnum.Done && (
                  <button
                    onClick={() => {
                      onClose();
                      onAssign(clientData.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-md hover:bg-orange-50 flex items-center"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Ganti Therapist
                  </button>
                )}

                {/* Consultation - for therapists */}
                {isTherapist && (
                  <button
                    onClick={() => {
                      onClose();
                      onConsultation(clientData.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Konsultasi
                  </button>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
