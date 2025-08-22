'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClinicDocument, type DocumentUploadFormData } from '@/types/clinic';
import { documentUploadSchema } from '@/schemas/clinicSchema';
import { useClinic } from '@/hooks/useClinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ClinicDocumentTypeEnum } from '@/types/enums';

interface DocumentUploadProps {
  onUploadSuccess?: (document: ClinicDocument) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  disabled?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'ready' | 'uploading' | 'success' | 'error';
  error?: string | undefined;
  id: string;
}

const DOCUMENT_TYPES = [
  { value: ClinicDocumentTypeEnum.License, label: 'Izin Praktik' },
  { value: ClinicDocumentTypeEnum.Certificate, label: 'Sertifikat' },
  { value: ClinicDocumentTypeEnum.Insurance, label: 'Asuransi' },
  { value: ClinicDocumentTypeEnum.Tax, label: 'Dokumen Pajak' },
  { value: ClinicDocumentTypeEnum.Other, label: 'Lainnya' },
] as const;

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  disabled = false
}) => {
  const { uploadDocument, documentsError, clearDocumentsError, fetchDocuments } = useClinic();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      name: '',
      type: 'other',
      description: ''
    }
  });


  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File ${file.name} terlalu besar. Maksimal ${Math.round(maxFileSize / 1024 / 1024)}MB`;
    }

    if (!acceptedFileTypes.includes(file.type)) {
      return `Format file ${file.name} tidak didukung. Gunakan PDF, JPG, atau PNG`;
    }

    return null;
  }, [maxFileSize, acceptedFileTypes]);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || disabled) return;

    const newFiles = Array.from(files);
    
    // Check max files limit
    if (uploadingFiles.length + newFiles.length > maxFiles) {
      onUploadError?.(`Maksimal ${maxFiles} file dapat diunggah sekaligus`);
      return;
    }

    // Validate and prepare files
    const validFiles: File[] = [];
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        onUploadError?.(error);
        continue;
      }
      validFiles.push(file);
    }

    // Add valid files to uploading list
    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'ready',
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Auto-fill form if only one file
    if (validFiles.length === 1) {
      const file = validFiles[0];
      if (file) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setValue('name', nameWithoutExt);
      }
    }

    // Files are now ready for upload on form submission
  }, [uploadingFiles.length, maxFiles, disabled, onUploadError, validateFile, setValue, uploadDocument]);


  // Remove file from upload list
  const removeFile = useCallback((fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  // Form submission
  const onSubmit = async (data: DocumentUploadFormData) => {
    const readyFiles = uploadingFiles.filter(f => f.status === 'ready');
    
    if (readyFiles.length === 0) {
      onUploadError?.('Tidak ada file yang siap diunggah');
      return;
    }

    // Clear any previous errors
    clearDocumentsError();

    // Process each file with proper metadata and progress tracking
    for (const uploadFile of readyFiles) {
      try {
        // Update status to uploading
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'uploading', progress: 0 }
              : f
          )
        );

        // Upload with progress tracking
        const result = await uploadDocument(uploadFile.file, data.type as ClinicDocumentTypeEnum, {
          name: data.name || uploadFile.file.name.replace(/\.[^/.]+$/, ''),
          description: data.description || '',
          onProgress: (progress) => {
            setUploadingFiles(prev => 
              prev.map(f => 
                f.id === uploadFile.id 
                  ? { ...f, progress }
                  : f
              )
            );
          }
        });

        if (result) {
          // Mark as successful
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, status: 'success', progress: 100 }
                : f
            )
          );
          onUploadSuccess?.(result);
          // Refresh the document list to show the new document
          fetchDocuments();
        } else {
          // Mark as error
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, status: 'error', error: 'Upload gagal' }
                : f
            )
          );
          onUploadError?.(`Gagal menyimpan ${uploadFile.file.name}`);
        }
      } catch (error) {
        // Mark as error
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'error', error: 'Upload gagal' }
              : f
          )
        );
        onUploadError?.(`Gagal menyimpan ${uploadFile.file.name}`);
      }
    }

    // Only reset if all uploads were successful
    const allSuccessful = uploadingFiles.every(f => f.status === 'success');
    if (allSuccessful) {
      reset();
      setUploadingFiles([]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / 1024 / 1024)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <DocumentIcon className="w-8 h-8 text-red-500" />;
    }
    if (file.type.startsWith('image/')) {
      return <img 
        src={URL.createObjectURL(file)} 
        alt={file.name}
        className="w-8 h-8 object-cover rounded"
      />;
    }
    return <DocumentIcon className="w-8 h-8 text-gray-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DocumentArrowUpIcon className="w-5 h-5" />
          Upload Dokumen
        </CardTitle>
        <CardDescription>
          Upload dokumen klinik seperti izin praktik, sertifikat, atau dokumen lainnya
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Document Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Dokumen *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Masukkan nama dokumen"
                className={errors.name ? 'border-red-500' : ''}
                disabled={disabled}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Jenis Dokumen *</Label>
              <Select
                value={watch('type')}
                onValueChange={(value) => setValue('type', value as any)}
                disabled={disabled}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Pilih jenis dokumen" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Tambahkan deskripsi atau catatan untuk dokumen ini"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
              disabled={disabled}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <div
              ref={dropZoneRef}
              className={`
                relative border-2 border-dashed rounded-lg p-6 transition-colors
                ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
              `}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    disabled={disabled}
                  >
                    Pilih File
                  </Button>
                  <p className="mt-2 text-sm text-gray-600">
                    atau drag & drop file ke sini
                  </p>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Format: PDF, JPG, PNG • Maksimal {Math.round(maxFileSize / 1024 / 1024)}MB per file
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes.join(',')}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={disabled}
              />
            </div>

            {/* File List */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-2">
                <Label>File yang akan diunggah:</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {uploadingFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getFileIcon(uploadFile.file)}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                        
                        {uploadFile.status === 'uploading' && (
                          <div className="mt-2">
                            <Progress value={uploadFile.progress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {uploadFile.progress}% selesai
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {uploadFile.status === 'ready' && (
                          <ClockIcon className="w-5 h-5 text-blue-500" />
                        )}
                        {uploadFile.status === 'success' && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                        {uploadFile.status === 'error' && (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                        )}
                        
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Messages */}
            {(documentsError || uploadingFiles.some(f => f.status === 'error')) && (
              <Alert className="border-red-200 bg-red-50">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                <div className="text-red-800">
                  {documentsError && (
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{documentsError}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDocumentsError}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                  {uploadingFiles.some(f => f.status === 'error') && (
                    <>
                      <p className="font-medium">Beberapa file gagal diunggah:</p>
                      <ul className="mt-1 list-disc list-inside text-sm">
                        {uploadingFiles
                          .filter(f => f.status === 'error')
                          .map(f => (
                            <li key={f.id}>{f.file.name}: {f.error}</li>
                          ))}
                      </ul>
                    </>
                  )}
                </div>
              </Alert>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setUploadingFiles([]);
              }}
              disabled={disabled}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={
                disabled || 
                uploadingFiles.length === 0 || 
                uploadingFiles.some(f => f.status === 'uploading') ||
                !uploadingFiles.some(f => f.status === 'ready')
              }
            >
              Simpan Dokumen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};