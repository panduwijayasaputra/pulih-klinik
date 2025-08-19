'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormModal } from '@/components/ui/form-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimpleMultiSelect } from '@/components/ui/simple-multi-select';
import { useToast } from '@/components/ui/toast';
import {
  SessionTypeEnum,
  SessionTypeLabels,
  CreateSessionData,
  UpdateSessionData,
  Session,
} from '@/types/therapy';
import { sessionFormDataSchema } from '@/schemas/therapySchema';
import {
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  FlagIcon as TargetIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

interface SessionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSessionData) => Promise<void>;
  session?: Session; // For editing existing session
  clientId: string;
  therapyId: string;
  therapistId: string;
  nextSessionNumber: number;
  isLoading?: boolean;
}

type SessionFormData = {
  title: string;
  description?: string;
  type: SessionTypeEnum;
  scheduledDate?: string;
  duration?: number;
  objectives: string[];
  techniques: string[];
  notes?: string;
};

const defaultObjectives = [
  'Mengurangi tingkat kecemasan klien',
  'Mengajarkan teknik relaksasi',
  'Membangun coping mechanism yang sehat',
  'Meningkatkan self-awareness klien',
  'Mengidentifikasi pola pikir negatif',
  'Mengembangkan strategi problem-solving',
  'Memperbaiki pola tidur',
  'Mengatasi trauma masa lalu',
  'Meningkatkan kepercayaan diri',
  'Membangun hubungan interpersonal yang sehat',
];

const defaultTechniques = [
  'Teknik pernapasan dalam',
  'Progressive muscle relaxation',
  'Cognitive restructuring',
  'Mindfulness meditation',
  'Grounding techniques',
  'Exposure therapy',
  'Behavioral activation',
  'Hypnotherapy',
  'EMDR (Eye Movement Desensitization)',
  'Visualization techniques',
  'Journaling',
  'Role playing',
  'Systematic desensitization',
  'Acceptance and commitment therapy',
  'Dialectical behavior therapy skills',
];

export const SessionFormModal: React.FC<SessionFormModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  session,
  clientId,
  therapyId,
  therapistId,
  nextSessionNumber,
  isLoading = false,
}) => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!session;

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormDataSchema),
    defaultValues: {
      title: '',
      description: '',
      type: SessionTypeEnum.Regular,
      scheduledDate: '',
      duration: 60,
      objectives: [],
      techniques: [],
      notes: '',
    },
  });

  // Reset form when modal opens/closes or session changes
  useEffect(() => {
    if (open) {
      if (session) {
        // Edit mode - populate form with session data
        form.reset({
          title: session.title,
          description: session.description || '',
          type: session.type,
          scheduledDate: session.scheduledDate 
            ? new Date(session.scheduledDate).toISOString().slice(0, 16)
            : '',
          duration: session.duration || 60,
          objectives: session.objectives || [],
          techniques: session.techniques || [],
          notes: session.notes || '',
        });
      } else {
        // Create mode - generate default title based on session number
        const defaultTitle = nextSessionNumber === 1 
          ? 'Sesi Awal - Assessment dan Perencanaan Terapi'
          : `Sesi ${nextSessionNumber} - Lanjutan Terapi`;
          
        form.reset({
          title: defaultTitle,
          description: '',
          type: nextSessionNumber === 1 ? SessionTypeEnum.Initial : SessionTypeEnum.Regular,
          scheduledDate: '',
          duration: 60,
          objectives: [],
          techniques: [],
          notes: '',
        });
      }
    }
  }, [open, session, nextSessionNumber, form]);

  const handleSubmit = async (data: SessionFormData) => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to create/update data
      const submitData: CreateSessionData = {
        ...data,
        clientId,
        therapyId,
        therapistId,
        // Convert scheduled date to ISO string if provided
        scheduledDate: data.scheduledDate 
          ? new Date(data.scheduledDate).toISOString()
          : undefined,
      };

      await onSubmit(submitData);
      
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: isEditing ? 'Sesi berhasil diperbarui' : 'Sesi berhasil dibuat'
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Form submission error:', error);
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan sesi'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // Get current form values for multi-select components
  const watchedObjectives = form.watch('objectives') || [];
  const watchedTechniques = form.watch('techniques') || [];

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Sesi Terapi' : 'Buat Sesi Terapi Baru'}
      description={
        isEditing 
          ? 'Perbarui informasi sesi terapi'
          : `Buat sesi terapi ke-${nextSessionNumber} untuk klien ini`
      }
      size="2xl"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 border-b pb-2">
            <DocumentTextIcon className="w-4 h-4" />
            Informasi Dasar
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Sesi *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Masukkan judul sesi..."
              error={form.formState.errors.title?.message}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Deskripsi singkat tentang sesi ini..."
              rows={3}
              error={form.formState.errors.description?.message}
            />
          </div>

          {/* Type and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Sesi *</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value: SessionTypeEnum) => form.setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe sesi" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SessionTypeEnum).map((type) => (
                    <SelectItem key={type} value={type}>
                      {SessionTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                Durasi (menit)
              </Label>
              <Input
                id="duration"
                type="number"
                {...form.register('duration', { valueAsNumber: true })}
                placeholder="60"
                min={15}
                max={240}
                error={form.formState.errors.duration?.message}
              />
            </div>
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduledDate" className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Tanggal & Waktu Dijadwalkan
            </Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              {...form.register('scheduledDate')}
              error={form.formState.errors.scheduledDate?.message}
            />
          </div>
        </div>

        {/* Session Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 border-b pb-2">
            <TargetIcon className="w-4 h-4" />
            Konten Sesi
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label>Tujuan Sesi *</Label>
            <p className="text-sm text-gray-600">
              Pilih atau tambahkan tujuan yang ingin dicapai dalam sesi ini
            </p>
            <SimpleMultiSelect
              options={defaultObjectives}
              values={watchedObjectives}
              onChange={(values) => form.setValue('objectives', values)}
              placeholder="Pilih tujuan sesi..."
              addNewLabel="Tambah tujuan baru"
              maxSelections={10}
            />
            {form.formState.errors.objectives && (
              <p className="text-sm text-red-600">{form.formState.errors.objectives.message}</p>
            )}
          </div>

          {/* Techniques */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <WrenchScrewdriverIcon className="w-4 h-4" />
              Teknik yang Akan Digunakan
            </Label>
            <p className="text-sm text-gray-600">
              Pilih teknik terapi yang akan diterapkan
            </p>
            <SimpleMultiSelect
              options={defaultTechniques}
              values={watchedTechniques}
              onChange={(values) => form.setValue('techniques', values)}
              placeholder="Pilih teknik terapi..."
              addNewLabel="Tambah teknik baru"
              maxSelections={15}
            />
            {form.formState.errors.techniques && (
              <p className="text-sm text-red-600">{form.formState.errors.techniques.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Persiapan</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Catatan persiapan sesi, hal yang perlu diperhatikan, atau materi yang dibutuhkan..."
              rows={4}
              error={form.formState.errors.notes?.message}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="min-w-[120px]"
          >
            {(isSubmitting || isLoading) ? 'Menyimpan...' : (isEditing ? 'Perbarui Sesi' : 'Buat Sesi')}
          </Button>
        </div>
      </form>
    </FormModal>
  );
};

export default SessionFormModal;