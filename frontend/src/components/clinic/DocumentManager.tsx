'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClinic } from '@/hooks/useClinic';
import { ClinicDocument } from '@/types/clinic';
import { 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface DocumentManagerProps {
  onDeleteDocument?: (documentId: string) => void;
  onDownloadDocument?: (document: ClinicDocument) => void;
  className?: string;
}

const DOCUMENT_TYPE_LABELS = {
  license: 'Izin Praktik',
  certificate: 'Sertifikat', 
  insurance: 'Asuransi',
  tax: 'Dokumen Pajak',
  other: 'Lainnya',
} as const;

const STATUS_CONFIG = {
  pending: {
    label: 'Menunggu',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: ClockIcon
  },
  approved: {
    label: 'Disetujui',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon
  },
  rejected: {
    label: 'Ditolak',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircleIcon
  }
} as const;

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  onDeleteDocument,
  onDownloadDocument,
  className = ''
}) => {
  const { documents, isDocumentsLoading, documentsError, deleteDocument, downloadDocument } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      onDeleteDocument?.(documentId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleDownload = async (document: ClinicDocument) => {
    try {
      await downloadDocument(document.id, document.fileName);
      onDownloadDocument?.(document);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / 1024 / 1024)} MB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDocumentIcon = (document: ClinicDocument) => {
    if (document.fileName.endsWith('.pdf')) {
      return <DocumentIcon className="w-6 h-6 text-red-500" />;
    }
    if (document.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <DocumentIcon className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    return <DocumentIcon className="w-6 h-6 text-gray-500" />;
  };

  if (isDocumentsLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-2 text-gray-600">Memuat dokumen...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documentsError) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {documentsError}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Manajemen Dokumen
            </CardTitle>
            <CardDescription>
              Kelola dokumen klinik yang telah diunggah ({documents.length} dokumen)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documents.length === 0 ? 'Belum ada dokumen' : 'Tidak ada dokumen yang sesuai'}
            </h3>
            <p className="text-gray-500 mb-4">
              {documents.length === 0 
                ? 'Upload dokumen pertama Anda untuk memulai'
                : 'Coba ubah pencarian atau filter'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => {
              const statusConfig = STATUS_CONFIG[document.status];
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={document.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Document Icon */}
                  <div className="flex-shrink-0">
                    {getDocumentIcon(document)}
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {document.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {document.fileName}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {DOCUMENT_TYPE_LABELS[document.type]}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(document.fileSize)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(document.uploadedAt)}
                          </span>
                        </div>
                        {document.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {document.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="flex items-center gap-1"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download
                    </Button>

                    {deleteConfirmId === document.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                        >
                          Hapus
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmId(document.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {documents.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'approved').length}
                </div>
                <div className="text-xs text-gray-600">Disetujui</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'pending').length}
                </div>
                <div className="text-xs text-gray-600">Menunggu</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {documents.filter(d => d.status === 'rejected').length}
                </div>
                <div className="text-xs text-gray-600">Ditolak</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(documents.reduce((sum, d) => sum + d.fileSize, 0) / 1024 / 1024)}MB
                </div>
                <div className="text-xs text-gray-600">Total Size</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};