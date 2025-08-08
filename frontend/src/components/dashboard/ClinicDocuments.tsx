'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useClinic } from '@/hooks/useClinic';
import { ClinicDocument } from '@/types/clinic';
import { 
  DocumentTextIcon,
  CloudArrowUpIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  DocumentCheckIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ClinicDocumentsProps {
  className?: string;
}

const DOCUMENT_TYPES = [
  { 
    value: 'license' as const, 
    label: 'Izin Praktik', 
    description: 'Surat izin praktik klinik dari Dinas Kesehatan',
    icon: DocumentCheckIcon,
    required: true
  },
  { 
    value: 'certificate' as const, 
    label: 'Sertifikat', 
    description: 'Sertifikat akreditasi atau kompetensi',
    icon: DocumentTextIcon,
    required: false
  },
  { 
    value: 'insurance' as const, 
    label: 'Asuransi', 
    description: 'Polis asuransi dan dokumen terkait',
    icon: DocumentArrowDownIcon,
    required: false
  },
  { 
    value: 'tax' as const, 
    label: 'Perpajakan', 
    description: 'NPWP, SKT, dan dokumen pajak lainnya',
    icon: DocumentTextIcon,
    required: false
  },
  { 
    value: 'other' as const, 
    label: 'Lainnya', 
    description: 'Dokumen pendukung lainnya',
    icon: DocumentTextIcon,
    required: false
  }
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getStatusBadge = (status: ClinicDocument['status']) => {
  switch (status) {
    case 'approved':
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircleIcon className="w-3 h-3 mr-1" />Disetujui</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircleIcon className="w-3 h-3 mr-1" />Ditolak</Badge>;
    case 'pending':
    default:
      return <Badge variant="secondary"><ClockIcon className="w-3 h-3 mr-1" />Menunggu</Badge>;
  }
};

const getDocumentTypeInfo = (type: ClinicDocument['type']) => {
  return DOCUMENT_TYPES.find(t => t.value === type) || DOCUMENT_TYPES[4];
};

export const ClinicDocuments: React.FC<ClinicDocumentsProps> = ({ className = '' }) => {
  const { clinic, isLoading, error, uploadDocument, deleteDocument, clearError } = useClinic();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    type: 'license' as ClinicDocument['type'],
    description: '',
    file: null as File | null
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan PDF, gambar (JPEG, PNG), atau dokumen Word.');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`Ukuran file terlalu besar. Maksimal ${formatFileSize(MAX_FILE_SIZE)}.`);
      return;
    }
    
    setUploadData(prev => ({ ...prev, file }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!uploadData.file) return;

    const success = await uploadDocument(uploadData.file, uploadData.type, uploadData.description);
    
    if (success) {
      setShowUploadForm(false);
      setUploadData({
        type: 'license',
        description: '',
        file: null
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      await deleteDocument(documentId);
    }
  };

  const handleCancel = () => {
    setShowUploadForm(false);
    setUploadData({
      type: 'license',
      description: '',
      file: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    clearError();
  };

  if (!clinic) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const documents = clinic.documents || [];
  const requiredDocuments = DOCUMENT_TYPES.filter(type => type.required);
  const missingRequired = requiredDocuments.filter(
    reqType => !documents.some(doc => doc.type === reqType.value && doc.status === 'approved')
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Dokumen Klinik</CardTitle>
              <CardDescription>
                Kelola dokumen legal dan sertifikat klinik Anda
              </CardDescription>
            </div>
          </div>
          {!showUploadForm && (
            <Button
              onClick={() => setShowUploadForm(true)}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Tambah Dokumen
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Missing Required Documents Warning */}
        {missingRequired.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start space-x-2">
              <ClockIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Dokumen Wajib Belum Lengkap
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Beberapa dokumen wajib masih belum diunggah atau disetujui:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                  {missingRequired.map(docType => (
                    <li key={docType.value}>{docType.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">Unggah Dokumen Baru</h3>
            
            {/* Document Type */}
            <div className="space-y-2">
              <Label>Jenis Dokumen</Label>
              <Select
                value={uploadData.type}
                onValueChange={(value) => setUploadData(prev => ({ ...prev, type: value as ClinicDocument['type'] }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                        {type.required && (
                          <Badge variant="secondary" className="ml-2 text-xs">Wajib</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>File Dokumen</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : uploadData.file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  disabled={isLoading}
                />
                
                {uploadData.file ? (
                  <div className="space-y-2">
                    <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto" />
                    <p className="font-medium text-green-700">{uploadData.file.name}</p>
                    <p className="text-sm text-green-600">{formatFileSize(uploadData.file.size)}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      Ganti File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600">
                        Drag & drop file ke sini atau{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 underline"
                          disabled={isLoading}
                        >
                          pilih file
                        </button>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, Gambar, atau Word (maks. {formatFileSize(MAX_FILE_SIZE)})
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Deskripsi (Opsional)</Label>
              <Textarea
                placeholder="Tambahkan deskripsi untuk dokumen ini..."
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                disabled={isLoading}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <Button
                onClick={handleUpload}
                disabled={!uploadData.file || isLoading}
                className="flex-1"
              >
                <CloudArrowUpIcon className="w-4 h-4 mr-1" />
                {isLoading ? 'Mengunggah...' : 'Unggah Dokumen'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Dokumen Tersimpan</h3>
            <p className="text-sm text-gray-500">{documents.length} dokumen</p>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Belum ada dokumen yang diunggah</p>
              <p className="text-sm text-gray-400">
                Klik "Tambah Dokumen" untuk mengunggah dokumen pertama
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {documents.map((document) => {
                const typeInfo = getDocumentTypeInfo(document.type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TypeIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{document.name}</h4>
                            {getStatusBadge(document.status)}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">{typeInfo.label}</p>
                          
                          {document.description && (
                            <p className="text-sm text-gray-500 mb-2">{document.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{document.fileName}</span>
                            <span>{formatFileSize(document.fileSize)}</span>
                            <span>{new Date(document.uploadedAt).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.url, '_blank')}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Document Requirements Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <DocumentCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Persyaratan Dokumen</p>
              <div className="mt-2 space-y-1 text-sm text-blue-700">
                <p>• <strong>Dokumen Wajib:</strong> Izin Praktik Klinik harus disetujui untuk verifikasi</p>
                <p>• <strong>Format File:</strong> PDF, JPG, PNG, DOC, atau DOCX</p>
                <p>• <strong>Ukuran Maksimal:</strong> {formatFileSize(MAX_FILE_SIZE)} per file</p>
                <p>• <strong>Proses Review:</strong> Dokumen akan direview dalam 1-3 hari kerja</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};