'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormModal } from '@/components/ui/form-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  Session,
  SessionStatusEnum,
  SessionStatusLabels,
  UpdateSessionData,
} from '@/types/therapy';
import {
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Schedule form validation schema
const scheduleFormSchema = z.object({
  scheduledDate: z.string()
    .min(1, 'Tanggal dan waktu harus diisi')
    .refine((date) => {
      const scheduledTime = new Date(date);
      const now = new Date();
      return scheduledTime > now;
    }, 'Tidak dapat menjadwalkan sesi di waktu yang sudah lewat'),
  duration: z.number()
    .min(15, 'Durasi minimum adalah 15 menit')
    .max(240, 'Durasi maksimum adalah 240 menit'),
  notes: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

interface SessionScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (sessionId: string, data: UpdateSessionData) => Promise<void>;
  session: Session;
  allSessions: Session[]; // For conflict detection
  isLoading?: boolean;
}

interface ConflictSession {
  session: Session;
  overlapType: 'full' | 'start' | 'end' | 'contains';
}

// Helper function to format date for display
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Time slot suggestions (in 24-hour format)
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '19:00', '19:30', '20:00', '20:30',
];

// Duration options (in minutes)
const durationOptions = [
  { value: 30, label: '30 menit' },
  { value: 45, label: '45 menit' },
  { value: 60, label: '60 menit (standar)' },
  { value: 90, label: '90 menit' },
  { value: 120, label: '120 menit' },
];

export const SessionScheduleModal: React.FC<SessionScheduleModalProps> = ({
  open,
  onOpenChange,
  onSchedule,
  session,
  allSessions = [],
  isLoading = false,
}) => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      scheduledDate: '',
      duration: session.duration || 60,
      notes: session.notes || '',
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      const existingDate = session.scheduledDate ? new Date(session.scheduledDate) : null;
      
      if (existingDate) {
        // Pre-fill with existing scheduled date
        const dateStr = existingDate.toISOString().slice(0, 10);
        const timeStr = existingDate.toTimeString().slice(0, 5);
        const dateTimeStr = existingDate.toISOString().slice(0, 16);
        
        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        form.reset({
          scheduledDate: dateTimeStr,
          duration: session.duration || 60,
          notes: session.notes || '',
        });
      } else {
        // Default to tomorrow at 10:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().slice(0, 10);
        const timeStr = '10:00';
        const dateTimeStr = `${dateStr}T${timeStr}`;
        
        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        form.reset({
          scheduledDate: dateTimeStr,
          duration: session.duration || 60,
          notes: '',
        });
      }
    }
  }, [open, session, form]);

  // Update combined datetime when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const combinedDateTime = `${selectedDate}T${selectedTime}`;
      form.setValue('scheduledDate', combinedDateTime, { shouldValidate: true });
    }
  }, [selectedDate, selectedTime, form]);

  // Detect scheduling conflicts
  const conflictDetection = useMemo((): {
    hasConflicts: boolean;
    conflicts: ConflictSession[];
  } => {
    const scheduledDate = form.watch('scheduledDate');
    const duration = form.watch('duration');

    if (!scheduledDate || !duration) {
      return { hasConflicts: false, conflicts: [] };
    }

    const newStart = new Date(scheduledDate);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    const conflicts: ConflictSession[] = [];

    allSessions.forEach((otherSession) => {
      // Skip the current session and non-scheduled sessions
      if (
        otherSession.id === session.id ||
        !otherSession.scheduledDate ||
        otherSession.status === SessionStatusEnum.Cancelled ||
        otherSession.status === SessionStatusEnum.Completed ||
        otherSession.status === SessionStatusEnum.NoShow
      ) {
        return;
      }

      const sessionStart = new Date(otherSession.scheduledDate);
      const sessionEnd = new Date(sessionStart.getTime() + (otherSession.duration || 60) * 60 * 1000);

      // Check for overlap
      if (newStart < sessionEnd && newEnd > sessionStart) {
        let overlapType: ConflictSession['overlapType'] = 'full';

        if (newStart >= sessionStart && newEnd <= sessionEnd) {
          overlapType = 'contains';
        } else if (newStart < sessionStart && newEnd > sessionEnd) {
          overlapType = 'full';
        } else if (newStart < sessionEnd && newStart >= sessionStart) {
          overlapType = 'start';
        } else if (newEnd > sessionStart && newEnd <= sessionEnd) {
          overlapType = 'end';
        }

        conflicts.push({
          session: otherSession,
          overlapType,
        });
      }
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
    };
  }, [form.watch('scheduledDate'), form.watch('duration'), allSessions, session.id]);

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return timeSlots;

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    const isToday = selectedDateObj.toDateString() === today.toDateString();

    return timeSlots.filter((timeSlot) => {
      if (isToday) {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTime = new Date(selectedDateObj);
        slotTime.setHours(hours, minutes, 0, 0);
        return slotTime > today;
      }
      return true;
    });
  }, [selectedDate]);

  const handleSubmit = async (data: ScheduleFormData) => {
    // Check for conflicts before submitting
    if (conflictDetection.hasConflicts) {
      addToast({
        type: 'error',
        title: 'Konflik Jadwal',
        message: 'Tidak dapat menjadwalkan sesi karena ada konflik dengan sesi lain. Silakan pilih waktu yang berbeda.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdateSessionData = {
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        duration: data.duration,
        notes: data.notes,
        status: SessionStatusEnum.Scheduled,
      };

      await onSchedule(session.id, updateData);

      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Sesi berhasil dijadwalkan',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Schedule submission error:', error);
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Gagal menjadwalkan sesi',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedDate('');
    setSelectedTime('');
    onOpenChange(false);
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 3 months ahead

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Jadwalkan Sesi"
      description={`Tentukan waktu untuk ${session.title}`}
      size="2xl"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Session Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Informasi Sesi</h3>
              <p className="text-sm text-blue-700 mt-1">
                Sesi #{session.sessionNumber}: {session.title}
              </p>
              {session.description && (
                <p className="text-sm text-blue-600 mt-1">{session.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 border-b pb-2">
            <CalendarIcon className="w-4 h-4" />
            Pilih Tanggal & Waktu
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal *</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                required
              />
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time">Waktu *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((timeSlot) => (
                    <SelectItem key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              Durasi Sesi *
            </Label>
            <Select
              value={form.watch('duration')?.toString()}
              onValueChange={(value) => form.setValue('duration', parseInt(value), { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih durasi" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.duration && (
              <p className="text-sm text-red-600">{form.formState.errors.duration.message}</p>
            )}
          </div>
        </div>

        {/* Schedule Preview */}
        {form.watch('scheduledDate') && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Ringkasan Jadwal</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Waktu:</strong> {formatDateTime(form.watch('scheduledDate'))}</p>
              <p><strong>Durasi:</strong> {form.watch('duration')} menit</p>
              <p><strong>Berakhir pada:</strong> {
                new Date(new Date(form.watch('scheduledDate')).getTime() + form.watch('duration') * 60 * 1000)
                  .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              }</p>
            </div>
          </div>
        )}

        {/* Conflict Detection */}
        {conflictDetection.hasConflicts && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Konflik Jadwal Ditemukan</h3>
                <p className="text-sm text-red-700 mt-1">
                  Waktu yang dipilih bertabrakan dengan sesi lain:
                </p>
                <div className="mt-3 space-y-2">
                  {conflictDetection.conflicts.map((conflict) => (
                    <div key={conflict.session.id} className="flex items-center justify-between bg-white rounded border border-red-200 p-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Sesi #{conflict.session.sessionNumber}: {conflict.session.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(conflict.session.scheduledDate!)} 
                          ({conflict.session.duration || 60} menit)
                        </p>
                      </div>
                      <Badge variant="destructive" className="ml-3">
                        <XMarkIcon className="w-3 h-3 mr-1" />
                        Konflik
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Catatan Jadwal</Label>
          <Input
            id="notes"
            {...form.register('notes')}
            placeholder="Catatan khusus untuk jadwal ini..."
            error={form.formState.errors.notes?.message}
          />
        </div>

        {/* Validation Errors */}
        {form.formState.errors.scheduledDate && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{form.formState.errors.scheduledDate.message}</p>
          </div>
        )}

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
            disabled={isSubmitting || isLoading || conflictDetection.hasConflicts || !form.watch('scheduledDate')}
            className="min-w-[140px]"
          >
            {(isSubmitting || isLoading) ? 'Menjadwalkan...' : 'Jadwalkan Sesi'}
          </Button>
        </div>
      </form>
    </FormModal>
  );
};

export default SessionScheduleModal;