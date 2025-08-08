'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useTherapists } from '@/hooks/useTherapists';
import { 
  TherapistFormData, 
  TherapistEducation, 
  TherapistCertification,
  THERAPIST_SPECIALIZATIONS, 
  LICENSE_TYPES, 
  EMPLOYMENT_TYPES 
} from '@/types/therapist';
import { 
  UserPlusIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface TherapistFormProps {
  className?: string;
  therapistId?: string; // For editing existing therapist
  onSuccess?: (therapist: any) => void;
  onCancel?: () => void;
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string) => {
  const re = /^(\+62|62|0)[\s-]?8[1-9][0-9]{6,9}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
};

const validateLicenseNumber = (license: string) => {
  return license.length >= 5 && /^[A-Z]{2,4}-[0-9]{4,8}$/i.test(license);
};

export const TherapistForm: React.FC<TherapistFormProps> = ({ 
  className = '', 
  therapistId,
  onSuccess,
  onCancel 
}) => {
  const { createTherapist, updateTherapist, isLoading, error, clearError } = useTherapists();
  
  const [formData, setFormData] = useState<TherapistFormData>({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseType: 'psychologist',
    specializations: [],
    yearsOfExperience: 1,
    employmentType: 'full_time',
    maxClients: 15,
    education: [],
    certifications: [],
    preferences: {
      sessionDuration: 60,
      breakBetweenSessions: 15,
      maxSessionsPerDay: 8,
      languages: ['id'],
      workingDays: [1, 2, 3, 4, 5]
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Basic Information
      if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
      if (!formData.email.trim()) {
        newErrors.email = 'Email wajib diisi';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Format email tidak valid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Nomor telepon wajib diisi';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Format nomor telepon tidak valid (contoh: +62-812-3456-7890)';
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'Nomor lisensi wajib diisi';
      } else if (!validateLicenseNumber(formData.licenseNumber)) {
        newErrors.licenseNumber = 'Format nomor lisensi tidak valid (contoh: PSI-001234)';
      }
      if (formData.specializations.length === 0) {
        newErrors.specializations = 'Minimal pilih satu spesialisasi';
      }
      if (formData.yearsOfExperience < 1 || formData.yearsOfExperience > 50) {
        newErrors.yearsOfExperience = 'Pengalaman harus antara 1-50 tahun';
      }
      if (formData.maxClients < 1 || formData.maxClients > 50) {
        newErrors.maxClients = 'Maksimal klien harus antara 1-50';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TherapistFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when field is being edited
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSpecializationToggle = (specId: string) => {
    const currentSpecs = formData.specializations;
    const newSpecs = currentSpecs.includes(specId)
      ? currentSpecs.filter(s => s !== specId)
      : [...currentSpecs, specId];
    
    handleInputChange('specializations', newSpecs);
  };

  const handleLanguageToggle = (langCode: string) => {
    const currentLangs = formData.preferences.languages;
    const newLangs = currentLangs.includes(langCode)
      ? currentLangs.filter(l => l !== langCode)
      : [...currentLangs, langCode];
    
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        languages: newLangs
      }
    }));
  };

  const handleWorkingDayToggle = (day: number) => {
    const currentDays = formData.preferences.workingDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        workingDays: newDays
      }
    }));
  };

  const addEducation = (education: TherapistEducation) => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
    setShowAddEducation(false);
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = (certification: Omit<TherapistCertification, 'id' | 'status'>) => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, certification]
    }));
    setShowAddCertification(false);
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    const result = therapistId 
      ? await updateTherapist(therapistId, formData as any)
      : await createTherapist(formData);

    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center space-x-4 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step}
          </div>
          <div className={`ml-2 text-sm ${step <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
            {step === 1 && 'Informasi Dasar'}
            {step === 2 && 'Pendidikan & Sertifikat'}
            {step === 3 && 'Preferensi'}
          </div>
          {step < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Dr. Ahmad Pratama, M.Psi"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="ahmad@kliniksehat.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+62-812-3456-7890"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Nomor Lisensi *</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            placeholder="PSI-001234"
            className={errors.licenseNumber ? 'border-red-500' : ''}
          />
          {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber}</p>}
        </div>

        {/* License Type */}
        <div className="space-y-2">
          <Label>Tipe Lisensi *</Label>
          <Select
            value={formData.licenseType}
            onValueChange={(value) => handleInputChange('licenseType', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LICENSE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label>Tipe Pekerjaan *</Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) => handleInputChange('employmentType', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience">Tahun Pengalaman *</Label>
          <Input
            id="experience"
            type="number"
            min="1"
            max="50"
            value={formData.yearsOfExperience}
            onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 1)}
            className={errors.yearsOfExperience ? 'border-red-500' : ''}
          />
          {errors.yearsOfExperience && <p className="text-sm text-red-600">{errors.yearsOfExperience}</p>}
        </div>

        {/* Max Clients */}
        <div className="space-y-2">
          <Label htmlFor="maxClients">Maksimal Klien *</Label>
          <Input
            id="maxClients"
            type="number"
            min="1"
            max="50"
            value={formData.maxClients}
            onChange={(e) => handleInputChange('maxClients', parseInt(e.target.value) || 15)}
            className={errors.maxClients ? 'border-red-500' : ''}
          />
          {errors.maxClients && <p className="text-sm text-red-600">{errors.maxClients}</p>}
        </div>
      </div>

      {/* Specializations */}
      <div className="space-y-3">
        <Label>Spesialisasi *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THERAPIST_SPECIALIZATIONS.map((spec) => (
            <div key={spec.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={`spec-${spec.id}`}
                checked={formData.specializations.includes(spec.id)}
                onCheckedChange={() => handleSpecializationToggle(spec.id)}
              />
              <div className="flex-1">
                <label 
                  htmlFor={`spec-${spec.id}`} 
                  className="text-sm font-medium cursor-pointer"
                >
                  {spec.name}
                </label>
                <p className="text-xs text-gray-500 mt-1">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors.specializations && <p className="text-sm text-red-600">{errors.specializations}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium">Riwayat Pendidikan</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddEducation(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Tambah Pendidikan
          </Button>
        </div>

        {formData.education.map((edu, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.field} • {edu.year}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {showAddEducation && <EducationForm onAdd={addEducation} onCancel={() => setShowAddEducation(false)} />}
      </div>

      {/* Certification Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium">Sertifikat</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddCertification(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Tambah Sertifikat
          </Button>
        </div>

        {formData.certifications.map((cert, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{cert.name}</h4>
                <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                <p className="text-sm text-gray-500">
                  {cert.certificateNumber} • {new Date(cert.issueDate).getFullYear()}
                  {cert.expiryDate && ` - ${new Date(cert.expiryDate).getFullYear()}`}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(index)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {showAddCertification && <CertificationForm onAdd={addCertification} onCancel={() => setShowAddCertification(false)} />}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Session Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preferensi Sesi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sessionDuration">Durasi Sesi (menit)</Label>
            <Input
              id="sessionDuration"
              type="number"
              min="30"
              max="180"
              value={formData.preferences.sessionDuration}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  sessionDuration: parseInt(e.target.value) || 60
                }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="breakBetween">Jeda Antar Sesi (menit)</Label>
            <Input
              id="breakBetween"
              type="number"
              min="0"
              max="60"
              value={formData.preferences.breakBetweenSessions}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  breakBetweenSessions: parseInt(e.target.value) || 15
                }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSessions">Maksimal Sesi per Hari</Label>
            <Input
              id="maxSessions"
              type="number"
              min="1"
              max="12"
              value={formData.preferences.maxSessionsPerDay}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  maxSessionsPerDay: parseInt(e.target.value) || 8
                }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <Label>Bahasa yang Dikuasai</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { code: 'id', label: 'Bahasa Indonesia' },
            { code: 'en', label: 'English' },
            { code: 'jv', label: 'Bahasa Jawa' },
            { code: 'su', label: 'Bahasa Sunda' }
          ].map((lang) => (
            <div key={lang.code} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang.code}`}
                checked={formData.preferences.languages.includes(lang.code)}
                onCheckedChange={() => handleLanguageToggle(lang.code)}
              />
              <label htmlFor={`lang-${lang.code}`} className="text-sm cursor-pointer">
                {lang.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Working Days */}
      <div className="space-y-3">
        <Label>Hari Kerja</Label>
        <div className="grid grid-cols-7 gap-2">
          {[
            { day: 1, label: 'Sen' },
            { day: 2, label: 'Sel' },
            { day: 3, label: 'Rab' },
            { day: 4, label: 'Kam' },
            { day: 5, label: 'Jum' },
            { day: 6, label: 'Sab' },
            { day: 0, label: 'Min' }
          ].map((dayInfo) => (
            <div key={dayInfo.day} className="text-center">
              <Checkbox
                id={`day-${dayInfo.day}`}
                checked={formData.preferences.workingDays.includes(dayInfo.day)}
                onCheckedChange={() => handleWorkingDayToggle(dayInfo.day)}
                className="mx-auto"
              />
              <label htmlFor={`day-${dayInfo.day}`} className="block text-xs mt-1 cursor-pointer">
                {dayInfo.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <UserPlusIcon className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>
              {therapistId ? 'Edit Therapist' : 'Tambah Therapist Baru'}
            </CardTitle>
            <CardDescription>
              Lengkapi informasi therapist untuk bergabung dengan tim klinik
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  Sebelumnya
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Batal
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                >
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  {isLoading ? 'Menyimpan...' : (therapistId ? 'Update Therapist' : 'Tambah Therapist')}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Helper Components
const EducationForm: React.FC<{
  onAdd: (education: TherapistEducation) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [education, setEducation] = useState<TherapistEducation>({
    degree: '',
    institution: '',
    year: new Date().getFullYear(),
    field: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (education.degree && education.institution && education.field) {
      onAdd(education);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="degree">Gelar *</Label>
          <Input
            id="degree"
            value={education.degree}
            onChange={(e) => setEducation(prev => ({ ...prev, degree: e.target.value }))}
            placeholder="S2 Psikologi Klinis"
            required
          />
        </div>
        <div>
          <Label htmlFor="institution">Institusi *</Label>
          <Input
            id="institution"
            value={education.institution}
            onChange={(e) => setEducation(prev => ({ ...prev, institution: e.target.value }))}
            placeholder="Universitas Indonesia"
            required
          />
        </div>
        <div>
          <Label htmlFor="year">Tahun Lulus *</Label>
          <Input
            id="year"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            value={education.year}
            onChange={(e) => setEducation(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="field">Bidang Studi *</Label>
          <Input
            id="field"
            value={education.field}
            onChange={(e) => setEducation(prev => ({ ...prev, field: e.target.value }))}
            placeholder="Psikologi Klinis"
            required
          />
        </div>
      </div>
      <div className="flex space-x-3">
        <Button type="submit" size="sm">Tambah</Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
};

const CertificationForm: React.FC<{
  onAdd: (certification: Omit<TherapistCertification, 'id' | 'status'>) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [certification, setCertification] = useState<Omit<TherapistCertification, 'id' | 'status'>>({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    certificateNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certification.name && certification.issuingOrganization && certification.issueDate && certification.certificateNumber) {
      onAdd(certification);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="certName">Nama Sertifikat *</Label>
          <Input
            id="certName"
            value={certification.name}
            onChange={(e) => setCertification(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Certified Clinical Hypnotherapist"
            required
          />
        </div>
        <div>
          <Label htmlFor="issuingOrg">Organisasi Penerbit *</Label>
          <Input
            id="issuingOrg"
            value={certification.issuingOrganization}
            onChange={(e) => setCertification(prev => ({ ...prev, issuingOrganization: e.target.value }))}
            placeholder="Indonesian Hypnotherapy Association"
            required
          />
        </div>
        <div>
          <Label htmlFor="issueDate">Tanggal Terbit *</Label>
          <Input
            id="issueDate"
            type="date"
            value={certification.issueDate}
            onChange={(e) => setCertification(prev => ({ ...prev, issueDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Tanggal Kedaluwarsa</Label>
          <Input
            id="expiryDate"
            type="date"
            value={certification.expiryDate}
            onChange={(e) => setCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="certNumber">Nomor Sertifikat *</Label>
          <Input
            id="certNumber"
            value={certification.certificateNumber}
            onChange={(e) => setCertification(prev => ({ ...prev, certificateNumber: e.target.value }))}
            placeholder="IHA-2019-001234"
            required
          />
        </div>
      </div>
      <div className="flex space-x-3">
        <Button type="submit" size="sm">Tambah</Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
};