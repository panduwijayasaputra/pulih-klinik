'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClinic } from '@/hooks/useClinic';
import { ClinicDocument } from '@/types/clinic';
import { formatFileSize, formatDate } from '@/lib/utils';
import {
  ArrowDownTrayIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { ClinicDocumentTypeEnum } from '@/types/enums';

interface DocumentManagerProps {
  onDeleteDocument?: (documentId: string) => void;
  onDownloadDocument?: (document: ClinicDocument) => void;
  className?: string;
}

const DOCUMENT_TYPE_LABELS = {
  [ClinicDocumentTypeEnum.License]: 'Izin Praktik',
  [ClinicDocumentTypeEnum.Certificate]: 'Sertifikat',
  [ClinicDocumentTypeEnum.Insurance]: 'Asuransi',
  [ClinicDocumentTypeEnum.Tax]: 'Dokumen Pajak',
  [ClinicDocumentTypeEnum.Other]: 'Lainnya',
} as const;


export const DocumentManager: React.FC<DocumentManagerProps> = ({
  onDeleteDocument,
  onDownloadDocument,
  className = ''
}) => {
  const {
    documents,
    isDocumentsLoading,
    documentsError,
    fetchDocuments,
    deleteDocument,
    downloadDocument,
    clearDocumentsError
  } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleDelete = async (documentId: string) => {
    setDeletingId(documentId);
    try {
      const success = await deleteDocument(documentId);
      if (success) {
        onDeleteDocument?.(documentId);
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      // Error is handled by the useClinic hook and will show in documentsError
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (document: ClinicDocument) => {
    setDownloadingId(document.id);
    try {
      const success = await downloadDocument(document.id, document.fileName);
      if (success) {
        onDownloadDocument?.(document);
      }
    } catch (error) {
      console.error('Failed to download document:', error);
      // Error is handled by the useClinic hook and will show in documentsError
    } finally {
      setDownloadingId(null);
    }
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



  if (documentsError) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 flex items-center justify-between">
              <span>{documentsError}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearDocumentsError();
                    fetchDocuments();
                  }}
                  className="ml-4"
                >
                  Coba Lagi
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDocumentsError}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </Button>
              </div>
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

          </div>
        </div>

        {isDocumentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-2 text-gray-600">Memuat dokumen...</span>
          </div>
        ) : (
          <>
            {/* Search and Filters */}


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


                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(document)}
                          disabled={downloadingId === document.id}
                          className="flex items-center gap-1"
                        >
                          {downloadingId === document.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                          ) : (
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          )}
                          {downloadingId === document.id ? 'Downloading...' : 'Download'}
                        </Button>

                        {deleteConfirmId === document.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(document.id)}
                              disabled={deletingId === document.id}
                            >
                              {deletingId === document.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Menghapus...
                                </>
                              ) : (
                                'Hapus'
                              )}
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
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600">
                      {documents.length}
                    </div>
                    <div className="text-xs text-gray-600">Total Dokumen</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(documents.reduce((sum, d) => sum + d.fileSize, 0) / 1024 / 1024)}MB
                    </div>
                    <div className="text-xs text-gray-600">Total Size</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};