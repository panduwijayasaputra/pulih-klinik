'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Consultation, ConsultationFormTypeLabels, ConsultationStatusLabels, SeverityLevelLabels } from '@/types/consultation';
import { ConsultationFormTypeEnum } from '@/types/enums';
import { Client } from '@/types/client';
import { 
  AcademicCapIcon,
  BeakerIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  FaceSmileIcon,
  HeartIcon,
  HomeIcon,
  PencilIcon,
  PhoneIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export interface ConsultationSummaryProps {
  consultation: Consultation & Record<string, any>; // Extended to include all form fields
  client?: Client;
  onEdit: () => void;
}

export const ConsultationSummary: React.FC<ConsultationSummaryProps> = ({
  consultation,
  client: _client,
  onEdit,
}) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to format simple date
  const formatSimpleDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Helper function to get form type icon
  const getFormTypeIcon = (formType: ConsultationFormTypeEnum) => {
    switch (formType) {
      case ConsultationFormTypeEnum.General:
        return <UserIcon className="w-5 h-5" />;
      case ConsultationFormTypeEnum.DrugAddiction:
        return <BeakerIcon className="w-5 h-5" />;
      case ConsultationFormTypeEnum.Minor:
        return <AcademicCapIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Helper function to format arrays
  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'Tidak ada';
    return arr.join(', ');
  };

  // Helper function to format boolean with details
  const formatBooleanWithDetails = (value: boolean, details?: string) => {
    if (value) {
      return details ? `Ya - ${details}` : 'Ya';
    }
    return 'Tidak';
  };

  // Helper function to format emotion scale
  const formatEmotionScale = (emotionScale: any) => {
    if (!emotionScale) return null;
    
    const emotions = Object.entries(emotionScale)
      .filter(([_, value]) => typeof value === 'number' && value > 0)
      .map(([emotion, value]) => `${emotion}: ${value}/10`)
      .join(', ');
    
    return emotions || 'Tidak ada data';
  };

  // Helper function to format substance history
  const formatSubstanceHistory = (substanceHistory: any) => {
    if (!substanceHistory) return 'Tidak ada data';
    
    const substances = Object.entries(substanceHistory)
      .filter(([_, value]) => value === true)
      .map(([substance, _]) => {
        const substanceLabels: Record<string, string> = {
          alcohol: 'Alkohol',
          marijuana: 'Ganja',
          methamphetamine: 'Metamfetamin',
          cocaine: 'Kokain',
          heroin: 'Heroin',
          ecstasy: 'Ekstasi',
          inhalants: 'Inhalan',
          prescription_drugs: 'Obat Resep',
          other_substances: 'Zat Lainnya'
        };
        return substanceLabels[substance] || substance;
      });
    
    return substances.length > 0 ? substances.join(', ') : 'Tidak ada';
  };

  // Helper function to format consultation reasons
  const formatConsultationReasons = (consultationReasons: any) => {
    if (!consultationReasons) return 'Tidak ada data';
    
    const reasons = Object.entries(consultationReasons)
      .filter(([_, value]) => value === true)
      .map(([reason, _]) => {
        const reasonLabels: Record<string, string> = {
          learning_difficulties: 'Kesulitan Belajar',
          emotional_problems: 'Masalah Emosional',
          social_problems: 'Masalah Sosial',
          behavioral_problems: 'Masalah Perilaku',
          trauma: 'Trauma',
          sleep_eating_disorders: 'Gangguan Tidur/Makan'
        };
        return reasonLabels[reason] || reason;
      });
    
    return reasons.length > 0 ? reasons.join(', ') : 'Tidak ada';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {getFormTypeIcon(consultation.formType)}
            {ConsultationFormTypeLabels[consultation.formType]}
          </h2>
          <p className="text-gray-600 mt-1">Ringkasan Konsultasi Lengkap</p>
        </div>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <PencilIcon className="w-4 h-4" />
          Edit Konsultasi
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            Informasi Dasar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(consultation.status)}>
                  {ConsultationStatusLabels[consultation.status]}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Sesi</label>
              <p className="mt-1 text-sm text-gray-900 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                {formatDate(consultation.sessionDate)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Durasi Sesi</label>
              <p className="mt-1 text-sm text-gray-900 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                {consultation.sessionDuration} menit
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Dibuat</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(consultation.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Terakhir Diperbarui</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(consultation.updatedAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Registrasi</label>
              <p className="mt-1 text-sm text-gray-900">{formatSimpleDate(consultation.registrationDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Concern and Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartIcon className="w-5 h-5 text-red-600" />
            Keluhan dan Gejala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keluhan Utama</label>
              <p className="text-gray-900">{consultation.primaryConcern}</p>
            </div>
            
            {consultation.secondaryConcerns && consultation.secondaryConcerns.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keluhan Tambahan</label>
                <ul className="list-disc list-inside space-y-1">
                  {consultation.secondaryConcerns.map((concern, index) => (
                    <li key={index} className="text-sm text-gray-600">{concern}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Gejala</label>
                <p className="text-sm text-gray-900">{consultation.symptomDuration}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Keparahan</label>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <div
                      className="bg-red-600 h-3 rounded-full"
                      style={{ width: `${(consultation.symptomSeverity / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {consultation.symptomSeverity}/5 - {SeverityLevelLabels[consultation.symptomSeverity]}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consultation.recentMoodState && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Mood Terkini</label>
                  <p className="text-sm text-gray-900">{consultation.recentMoodState}</p>
                  {consultation.recentMoodStateDetails && (
                    <p className="text-xs text-gray-600 mt-1">{consultation.recentMoodStateDetails}</p>
                  )}
                </div>
              )}

              {consultation.selfHarmThoughts && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pikiran Menyakiti Diri</label>
                  <p className="text-sm text-gray-900">{consultation.selfHarmThoughts}</p>
                  {consultation.selfHarmDetails && (
                    <p className="text-xs text-gray-600 mt-1">{consultation.selfHarmDetails}</p>
                  )}
                </div>
              )}

              {consultation.dailyStressFrequency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frekuensi Stres Harian</label>
                  <p className="text-sm text-gray-900">{consultation.dailyStressFrequency}</p>
                </div>
              )}
            </div>

            {consultation.frequentEmotions && consultation.frequentEmotions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emosi yang Sering Dirasakan</label>
                <p className="text-sm text-gray-900">{formatArray(consultation.frequentEmotions)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emotion Scale */}
      {consultation.emotionScale && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaceSmileIcon className="w-5 h-5 text-yellow-600" />
              Skala Emosi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emosi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visual
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(consultation.emotionScale)
                    .filter(([_, value]) => Number(value) > 0)
                    .map(([emotion, value]) => (
                    <tr key={emotion}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {emotion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(value as number)}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(Number(value) / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Object.entries(consultation.emotionScale).filter(([_, value]) => Number(value) > 0).length === 0 && (
                <p className="text-center text-gray-500 py-4">Tidak ada data emosi yang tercatat</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Treatment Goals */}
      {consultation.treatmentGoals && consultation.treatmentGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-green-600" />
              Tujuan Terapi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {consultation.treatmentGoals.map((goal, index) => (
                <li key={index} className="text-sm text-gray-900">{goal}</li>
              ))}
            </ul>
            {consultation.clientExpectations && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Harapan Klien</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.clientExpectations}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
            Riwayat Medis dan Psikologis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pengalaman Terapi Sebelumnya</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatBooleanWithDetails(consultation.previousTherapyExperience, consultation.previousTherapyDetails)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sedang Mengonsumsi Obat</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatBooleanWithDetails(consultation.currentMedications, consultation.currentMedicationsDetails)}
              </p>
            </div>
            {consultation.previousPsychologicalDiagnosis !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis Psikologis Sebelumnya</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatBooleanWithDetails(consultation.previousPsychologicalDiagnosis, consultation.previousPsychologicalDiagnosisDetails)}
                </p>
              </div>
            )}
            {consultation.significantPhysicalIllness !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Penyakit Fisik Signifikan</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatBooleanWithDetails(consultation.significantPhysicalIllness, consultation.significantPhysicalIllnessDetails)}
                </p>
              </div>
            )}
            {consultation.traumaticExperience !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Pengalaman Traumatis</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatBooleanWithDetails(consultation.traumaticExperience, consultation.traumaticExperienceDetails)}
                </p>
              </div>
            )}
            {consultation.familyPsychologicalHistory !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Riwayat Psikologis Keluarga</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatBooleanWithDetails(consultation.familyPsychologicalHistory, consultation.familyPsychologicalHistoryDetails)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* General Consultation Specific Fields */}
      {consultation.formType === ConsultationFormTypeEnum.General && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
                Kehidupan Sosial dan Lingkungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {consultation.currentLifeStressors && consultation.currentLifeStressors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stressor Kehidupan Saat Ini</label>
                      <p className="text-sm text-gray-900">{formatArray(consultation.currentLifeStressors)}</p>
                    </div>
                  )}
                  {consultation.supportSystem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sistem Dukungan</label>
                      <p className="text-sm text-gray-900">{consultation.supportSystem}</p>
                    </div>
                  )}
                </div>

                {consultation.workLifeBalance && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keseimbangan Hidup-Kerja</label>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                        <div
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: `${(consultation.workLifeBalance / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{consultation.workLifeBalance}/5</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {consultation.sleepPatterns && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pola Tidur</label>
                      <p className="text-sm text-gray-900">{consultation.sleepPatterns}</p>
                    </div>
                  )}
                  {consultation.exerciseFrequency && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frekuensi Olahraga</label>
                      <p className="text-sm text-gray-900">{consultation.exerciseFrequency}</p>
                    </div>
                  )}
                  {consultation.dietaryHabits && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kebiasaan Makan</label>
                      <p className="text-sm text-gray-900">{consultation.dietaryHabits}</p>
                    </div>
                  )}
                  {consultation.socialConnections && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Koneksi Sosial</label>
                      <p className="text-sm text-gray-900">{consultation.socialConnections}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Drug Addiction Specific Fields */}
      {consultation.formType === ConsultationFormTypeEnum.DrugAddiction && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BeakerIcon className="w-5 h-5 text-orange-600" />
                Riwayat Penggunaan Zat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {consultation.substanceHistory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Zat yang Pernah Digunakan</label>
                    <p className="text-sm text-gray-900">{formatSubstanceHistory(consultation.substanceHistory)}</p>
                    {consultation.otherSubstancesDetails && (
                      <p className="text-xs text-gray-600 mt-1">Lainnya: {consultation.otherSubstancesDetails}</p>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {consultation.primarySubstance && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zat Utama</label>
                      <p className="text-sm text-gray-900">{consultation.primarySubstance}</p>
                    </div>
                  )}
                  {consultation.ageOfFirstUse && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Usia Pertama Kali</label>
                      <p className="text-sm text-gray-900">{consultation.ageOfFirstUse} tahun</p>
                    </div>
                  )}
                  {consultation.frequencyOfUse && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frekuensi Penggunaan</label>
                      <p className="text-sm text-gray-900">{consultation.frequencyOfUse}</p>
                    </div>
                  )}
                  {consultation.quantityPerUse && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah per Penggunaan</label>
                      <p className="text-sm text-gray-900">{consultation.quantityPerUse}</p>
                    </div>
                  )}
                  {consultation.lastUseDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Terakhir Menggunakan</label>
                      <p className="text-sm text-gray-900">{formatSimpleDate(consultation.lastUseDate)}</p>
                    </div>
                  )}
                  {consultation.attemptsToQuit !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Percobaan Berhenti</label>
                      <p className="text-sm text-gray-900">{consultation.attemptsToQuit} kali</p>
                    </div>
                  )}
                </div>

                {consultation.withdrawalSymptoms && consultation.withdrawalSymptoms.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gejala Withdrawal</label>
                    <p className="mt-1 text-sm text-gray-900">{formatArray(consultation.withdrawalSymptoms)}</p>
                  </div>
                )}

                {consultation.toleranceLevel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Toleransi</label>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                        <div
                          className="bg-orange-600 h-3 rounded-full"
                          style={{ width: `${(consultation.toleranceLevel / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{consultation.toleranceLevel}/5</span>
                    </div>
                  </div>
                )}

                {consultation.impactOnDailyLife && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dampak pada Kehidupan Sehari-hari</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.impactOnDailyLife}</p>
                  </div>
                )}

                {consultation.triggerSituations && consultation.triggerSituations.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Situasi Pemicu</label>
                    <p className="mt-1 text-sm text-gray-900">{formatArray(consultation.triggerSituations)}</p>
                  </div>
                )}

                {consultation.financialImpact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dampak Finansial</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.financialImpact}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultation.previousTreatmentPrograms !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Program Rehabilitasi Sebelumnya</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.previousTreatmentPrograms, consultation.previousTreatmentDetails)}
                      </p>
                    </div>
                  )}
                  {consultation.legalIssuesRelated !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Masalah Hukum Terkait</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.legalIssuesRelated, consultation.legalIssuesDetails)}
                      </p>
                    </div>
                  )}
                </div>

                {consultation.currentSobrietyPeriod && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Periode Bebas Zat Saat Ini</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.currentSobrietyPeriod}</p>
                  </div>
                )}

                {consultation.desireToQuit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Keinginan untuk Berhenti</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.desireToQuit}</p>
                  </div>
                )}

                {consultation.recoveryGoals && consultation.recoveryGoals.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tujuan Pemulihan</label>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {consultation.recoveryGoals.map((goal: string, index: number) => (
                        <li key={index} className="text-sm text-gray-900">{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {consultation.willingForFollowUp !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bersedia Follow-up</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.willingForFollowUp ? 'Ya' : 'Tidak'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Minor Consultation Specific Fields */}
      {consultation.formType === ConsultationFormTypeEnum.Minor && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600" />
                Informasi Wali dan Keluarga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consultation.guardianName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wali</label>
                    <p className="text-sm text-gray-900">{consultation.guardianName}</p>
                  </div>
                )}
                {consultation.guardianRelationship && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan dengan Wali</label>
                    <p className="text-sm text-gray-900">{consultation.guardianRelationship}</p>
                  </div>
                )}
                {consultation.guardianPhone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telepon Wali</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {consultation.guardianPhone}
                    </p>
                  </div>
                )}
                {consultation.guardianOccupation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan Wali</label>
                    <p className="text-sm text-gray-900">{consultation.guardianOccupation}</p>
                  </div>
                )}
                {consultation.parentalMaritalStatus && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Perkawinan Orang Tua</label>
                    <p className="text-sm text-gray-900">{consultation.parentalMaritalStatus}</p>
                  </div>
                )}
                {consultation.legalCustody !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hak Asuh Hukum</label>
                    <p className="text-sm text-gray-900">{consultation.legalCustody ? 'Ya' : 'Tidak'}</p>
                  </div>
                )}
              </div>
              
              {consultation.guardianAddress && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Alamat Wali</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-start">
                    <HomeIcon className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    {consultation.guardianAddress}
                  </p>
                </div>
              )}

              {consultation.familyStructure && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Struktur Keluarga</label>
                  <p className="mt-1 text-sm text-gray-900">{consultation.familyStructure}</p>
                </div>
              )}

              {consultation.siblingRelationships && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Hubungan dengan Saudara</label>
                  <p className="mt-1 text-sm text-gray-900">{consultation.siblingRelationships}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                Alasan Konsultasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultation.consultationReasons && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alasan Konsultasi</label>
                    <p className="mt-1 text-sm text-gray-900">{formatConsultationReasons(consultation.consultationReasons)}</p>
                  </div>
                )}
                {consultation.otherConsultationReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alasan Lainnya</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.otherConsultationReason}</p>
                  </div>
                )}
                {consultation.problemOnset && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Onset Masalah</label>
                    <p className="mt-1 text-sm text-gray-900">{consultation.problemOnset}</p>
                  </div>
                )}
                {consultation.previousPsychologicalHelp !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bantuan Psikologis Sebelumnya</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatBooleanWithDetails(consultation.previousPsychologicalHelp, consultation.previousPsychologicalHelpDetails)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5 text-green-600" />
                Informasi Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {consultation.currentGradeLevel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Kelas</label>
                      <p className="text-sm text-gray-900">{consultation.currentGradeLevel}</p>
                    </div>
                  )}
                  {consultation.academicPerformance && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prestasi Akademik</label>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                          <div
                            className="bg-green-600 h-3 rounded-full"
                            style={{ width: `${(consultation.academicPerformance / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{consultation.academicPerformance}/5</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {consultation.schoolBehaviorIssues !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Masalah Perilaku di Sekolah</label>
                      <p className="text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.schoolBehaviorIssues, consultation.schoolBehaviorDetails)}
                      </p>
                    </div>
                  )}
                  {consultation.bullyingHistory !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat Bullying</label>
                      <p className="text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.bullyingHistory, consultation.bullyingDetails)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {consultation.teacherConcerns && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Kekhawatiran Guru</label>
                  <p className="mt-1 text-sm text-gray-900">{consultation.teacherConcerns}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-pink-600" />
                Sosial dan Perkembangan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {consultation.peerRelationships && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hubungan dengan Teman Sebaya</label>
                    <p className="text-sm text-gray-900">{consultation.peerRelationships}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultation.familyConflicts !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konflik Keluarga</label>
                      <p className="text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.familyConflicts, consultation.familyConflictsDetails)}
                      </p>
                    </div>
                  )}
                  {consultation.socialDifficulties !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kesulitan Sosial</label>
                      <p className="text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.socialDifficulties, consultation.socialDifficultiesDetails)}
                      </p>
                    </div>
                  )}
                  {consultation.attentionConcerns !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Masalah Perhatian</label>
                      <p className="text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.attentionConcerns, consultation.attentionDetails)}
                      </p>
                    </div>
                  )}
                  {consultation.behavioralConcerns !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Masalah Perilaku</label>
                      <p className="text-sm text-gray-900">
                        {formatBooleanWithDetails(consultation.behavioralConcerns, consultation.behavioralDetails)}
                      </p>
                    </div>
                  )}
                </div>

                {consultation.developmentalMilestones && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Perkembangan</label>
                    <p className="text-sm text-gray-900">{consultation.developmentalMilestones}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Assessment and Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScaleIcon className="w-5 h-5 text-indigo-600" />
            Penilaian dan Catatan Terapis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consultation.initialAssessment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Penilaian Awal</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-lg">{consultation.initialAssessment}</p>
                </div>
              )}
              
              {consultation.consultationNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Konsultasi</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-lg">{consultation.consultationNotes}</p>
                </div>
              )}
            </div>
            
            {consultation.recommendedTreatmentPlan && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rencana Perawatan yang Direkomendasikan</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap p-4 bg-blue-50 rounded-lg border border-blue-200">{consultation.recommendedTreatmentPlan}</p>
              </div>
            )}

            {consultation.initialRecommendation && consultation.initialRecommendation.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rekomendasi Awal</label>
                <ul className="list-disc list-inside space-y-1 p-3 bg-green-50 rounded-lg">
                  {consultation.initialRecommendation.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-gray-900">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Consent and Signatures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-gray-600" />
            Persetujuan dan Tanda Tangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Persetujuan Klien</label>
              <p className="mt-1 text-sm text-gray-900">{consultation.consentAgreement ? 'Menyetujui' : 'Belum menyetujui'}</p>
            </div>
            {consultation.clientSignatureName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Penandatangan Klien</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.clientSignatureName}</p>
              </div>
            )}
            {consultation.clientSignatureDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Tanda Tangan Klien</label>
                <p className="mt-1 text-sm text-gray-900">{formatSimpleDate(consultation.clientSignatureDate)}</p>
              </div>
            )}
            {consultation.guardianSignatureName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Penandatangan Wali</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.guardianSignatureName}</p>
              </div>
            )}
            {consultation.guardianSignatureDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Tanda Tangan Wali</label>
                <p className="mt-1 text-sm text-gray-900">{formatSimpleDate(consultation.guardianSignatureDate)}</p>
              </div>
            )}
            {consultation.therapistName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Terapis</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.therapistName}</p>
              </div>
            )}
            {consultation.clientCanSign !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Klien Dapat Menandatangani</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.clientCanSign ? 'Ya' : 'Tidak'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationSummary;