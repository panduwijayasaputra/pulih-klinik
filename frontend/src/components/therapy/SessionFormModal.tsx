'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Calendar, Clock, Target, BookOpen, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESPONSIVE_MODAL, responsiveUtils } from '@/lib/responsive-utils';
import { sessionValidationSchemas } from '@/lib/validation';

import {
  Session,
  SessionStatusEnum,
  SessionTypeEnum,
  SessionStatusLabels,
  SessionTypeLabels,
} from '@/types/therapy';

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormData) => Promise<void>;
  session?: Session;
  isLoading?: boolean;
  clientId?: string;
  therapyId?: string;
}

interface SessionFormData {
  title: string;
  description?: string;
  type: SessionTypeEnum;
  scheduledDate?: string;
  duration?: number;
  objectives: string[];
  techniques?: string[];
  notes?: string;
}

const sessionFormSchema = sessionValidationSchemas.createSession;

export const SessionFormModal: React.FC<SessionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  session,
  isLoading = false,
  clientId,
  therapyId,
}) => {
  const [objectives, setObjectives] = useState<string[]>(session?.objectives || []);
  const [newObjective, setNewObjective] = useState('');
  const [techniques, setTechniques] = useState<string[]>(session?.techniques || []);
  const [newTechnique, setNewTechnique] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      title: session?.title || '',
      description: session?.description || '',
      type: session?.type || SessionTypeEnum.Regular,
      scheduledDate: session?.scheduledDate ? new Date(session.scheduledDate).toISOString().slice(0, 16) : '',
      duration: session?.duration || 60,
      objectives: session?.objectives || [],
      techniques: session?.techniques || [],
      notes: session?.notes || '',
    },
  });

  const watchedValues = watch();

  // Reset form when session changes
  useEffect(() => {
    if (session) {
      reset({
        title: session.title,
        description: session.description,
        type: session.type,
        scheduledDate: session.scheduledDate ? new Date(session.scheduledDate).toISOString().slice(0, 16) : '',
        duration: session.duration,
        objectives: session.objectives || [],
        techniques: session.techniques || [],
        notes: session.notes,
      });
      setObjectives(session.objectives || []);
      setTechniques(session.techniques || []);
    } else {
      reset({
        title: '',
        description: '',
        type: SessionTypeEnum.Regular,
        scheduledDate: '',
        duration: 60,
        objectives: [],
        techniques: [],
        notes: '',
      });
      setObjectives([]);
      setTechniques([]);
    }
  }, [session, reset]);

  const handleFormSubmit = async (data: SessionFormData) => {
    const formData = {
      ...data,
      objectives,
      techniques,
    };
    await onSubmit(formData);
  };

  const addObjective = () => {
    if (newObjective.trim() && objectives.length < 10) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const addTechnique = () => {
    if (newTechnique.trim() && techniques.length < 15) {
      setTechniques([...techniques, newTechnique.trim()]);
      setNewTechnique('');
    }
  };

  const removeTechnique = (index: number) => {
    setTechniques(techniques.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(RESPONSIVE_MODAL['modal-lg'], 'max-h-[90vh] overflow-y-auto')}>
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {session ? 'Edit Sesi Terapi' : 'Buat Sesi Terapi Baru'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {session 
              ? 'Perbarui informasi sesi terapi untuk klien ini.'
              : 'Buat sesi terapi baru dengan informasi lengkap.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Judul Sesi *
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      placeholder="Masukkan judul sesi"
                      className="min-h-[44px]"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Jenis Sesi *
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Pilih jenis sesi" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SessionTypeEnum).map((type) => (
                          <SelectItem key={type} value={type}>
                            {SessionTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-xs text-red-600">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Deskripsi
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Deskripsi singkat tentang sesi ini"
                    className="min-h-[80px] resize-none"
                    disabled={isLoading}
                  />
                )}
              />
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Schedule Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Jadwal & Durasi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate" className="text-sm font-medium">
                  Tanggal & Waktu
                </Label>
                <Controller
                  name="scheduledDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="scheduledDate"
                      type="datetime-local"
                      className="min-h-[44px]"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.scheduledDate && (
                  <p className="text-xs text-red-600">{errors.scheduledDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Durasi (menit)
                </Label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="duration"
                      type="number"
                      min="15"
                      max="240"
                      placeholder="60"
                      className="min-h-[44px]"
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.duration && (
                  <p className="text-xs text-red-600">{errors.duration.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Tujuan Sesi *
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Tambahkan tujuan sesi"
                  className="flex-1 min-h-[44px]"
                  disabled={isLoading || objectives.length >= 10}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                />
                <Button
                  type="button"
                  onClick={addObjective}
                  disabled={!newObjective.trim() || objectives.length >= 10 || isLoading}
                  className="min-h-[44px] min-w-[44px] p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {objectives.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {objectives.map((objective, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      {objective}
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="ml-1 hover:text-red-600"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {objectives.length === 0 && (
                <p className="text-xs text-gray-500">Belum ada tujuan yang ditambahkan</p>
              )}

              {objectives.length >= 10 && (
                <p className="text-xs text-orange-600">Maksimal 10 tujuan sesi</p>
              )}
            </div>
          </div>

          {/* Techniques */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Teknik Terapi
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  placeholder="Tambahkan teknik terapi"
                  className="flex-1 min-h-[44px]"
                  disabled={isLoading || techniques.length >= 15}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnique())}
                />
                <Button
                  type="button"
                  onClick={addTechnique}
                  disabled={!newTechnique.trim() || techniques.length >= 15 || isLoading}
                  className="min-h-[44px] min-w-[44px] p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {techniques.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techniques.map((technique, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      {technique}
                      <button
                        type="button"
                        onClick={() => removeTechnique(index)}
                        className="ml-1 hover:text-red-600"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {techniques.length === 0 && (
                <p className="text-xs text-gray-500">Belum ada teknik yang ditambahkan</p>
              )}

              {techniques.length >= 15 && (
                <p className="text-xs text-orange-600">Maksimal 15 teknik terapi</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Catatan Tambahan
            </h3>

            <div className="space-y-2">
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Catatan tambahan untuk sesi ini"
                    className="min-h-[100px] resize-none"
                    disabled={isLoading}
                  />
                )}
              />
              {errors.notes && (
                <p className="text-xs text-red-600">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 sm:flex-none min-h-[44px]"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading || objectives.length === 0}
                className="flex-1 sm:flex-none min-h-[44px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {session ? 'Perbarui Sesi' : 'Buat Sesi'}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionFormModal;