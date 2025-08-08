'use client';

import { useState } from 'react';
import { ClientFormData } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ClientFormData>;
}

const indonesianProvinces = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Sumatra Utara',
  'Sumatra Barat',
  'Riau',
  'Jambi',
  'Sumatra Selatan',
  'Bengkulu',
  'Lampung',
  'Kepulauan Bangka Belitung',
  'Kepulauan Riau',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan'
];

const primaryIssues = [
  'Kecemasan (Anxiety)',
  'Depresi (Depression)',
  'Manajemen Stres',
  'Keseimbangan Hidup Kerja',
  'Kecanduan',
  'Trauma',
  'Fobia',
  'Gangguan Tidur',
  'Kepercayaan Diri',
  'Hubungan Interpersonal',
  'Manajemen Emosi',
  'Lainnya'
];

export function ClientForm({ onSubmit, onCancel, initialData = {} }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    age: 0,
    gender: 'male',
    phone: '',
    email: '',
    occupation: '',
    education: 'High School',
    address: '',
    primaryIssue: '',
    religion: undefined,
    province: undefined,
    emergencyContact: undefined,
    notes: '',
    ...initialData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Usia harus antara 1-120 tahun';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Pekerjaan wajib diisi';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    if (!formData.primaryIssue.trim()) {
      newErrors.primaryIssue = 'Masalah utama wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof ClientFormData, value: string | number | undefined | ClientFormData['gender'] | ClientFormData['education'] | ClientFormData['religion'] | ClientFormData['emergencyContact']) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Usia *</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age || ''}
                onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                placeholder="Masukkan usia"
                className={errors.age ? 'border-red-500' : ''}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Jenis Kelamin *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => updateField('gender', value)}
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="other">Lainnya</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="religion">Agama</Label>
              <Select
                value={formData.religion || ''}
                onValueChange={(value) => updateField('religion', value || undefined)}
              >
                <option value="">Pilih agama (opsional)</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Kristen</option>
                <option value="Catholicism">Katolik</option>
                <option value="Hinduism">Hindu</option>
                <option value="Buddhism">Buddha</option>
                <option value="Other">Lainnya</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+62-812-3456-7890"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="nama@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Alamat *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Masukkan alamat lengkap"
                className={errors.address ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Select
                value={formData.province || ''}
                onValueChange={(value) => updateField('province', value || undefined)}
              >
                <option value="">Pilih provinsi (opsional)</option>
                {indonesianProvinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Profesi & Pendidikan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occupation">Pekerjaan *</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => updateField('occupation', e.target.value)}
                placeholder="Masukkan pekerjaan"
                className={errors.occupation ? 'border-red-500' : ''}
              />
              {errors.occupation && (
                <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
              )}
            </div>

            <div>
              <Label htmlFor="education">Pendidikan Terakhir *</Label>
              <Select
                value={formData.education}
                onValueChange={(value) => updateField('education', value)}
              >
                <option value="Elementary">SD</option>
                <option value="Middle">SMP</option>
                <option value="High School">SMA/SMK</option>
                <option value="Associate">Diploma</option>
                <option value="Bachelor">Sarjana (S1)</option>
                <option value="Master">Magister (S2)</option>
                <option value="Doctorate">Doktor (S3)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapy Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Terapi</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="primaryIssue">Masalah Utama *</Label>
              <Select
                value={formData.primaryIssue}
                onValueChange={(value) => updateField('primaryIssue', value)}
              >
                <option value="">Pilih masalah utama</option>
                {primaryIssues.map(issue => (
                  <option key={issue} value={issue}>{issue}</option>
                ))}
              </Select>
              {errors.primaryIssue && (
                <p className="text-red-500 text-sm mt-1">{errors.primaryIssue}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Catatan atau informasi tambahan tentang klien..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact (Optional) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Kontak Darurat (Opsional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyName">Nama</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => updateField('emergencyContact', {
                  name: e.target.value,
                  phone: formData.emergencyContact?.phone || '',
                  relationship: formData.emergencyContact?.relationship || ''
                })}
                placeholder="Nama kontak darurat"
              />
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Nomor Telepon</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyContact?.phone || ''}
                onChange={(e) => updateField('emergencyContact', {
                  name: formData.emergencyContact?.name || '',
                  phone: e.target.value,
                  relationship: formData.emergencyContact?.relationship || ''
                })}
                placeholder="+62-812-3456-7890"
              />
            </div>

            <div>
              <Label htmlFor="emergencyRelationship">Hubungan</Label>
              <Input
                id="emergencyRelationship"
                value={formData.emergencyContact?.relationship || ''}
                onChange={(e) => updateField('emergencyContact', {
                  name: formData.emergencyContact?.name || '',
                  phone: formData.emergencyContact?.phone || '',
                  relationship: e.target.value
                })}
                placeholder="Keluarga, teman, dll."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Simpan Klien
        </Button>
      </div>
    </form>
  );
}