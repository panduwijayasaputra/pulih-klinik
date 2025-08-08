import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentManager } from './DocumentManager';
import { useClinic } from '@/hooks/useClinic';
import { ClinicDocument } from '@/types/clinic';

// Mock the useClinic hook
jest.mock('@/hooks/useClinic');
const mockUseClinic = useClinic as jest.MockedFunction<typeof useClinic>;

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, disabled, ...props }: any) => (
    <button
      onClick={onClick}
      className={`btn ${variant} ${size} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={`card ${className}`} {...props}>{children}</div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={`card-content ${className}`} {...props}>{children}</div>
  ),
  CardDescription: ({ children, className, ...props }: any) => (
    <div className={`card-description ${className}`} {...props}>{children}</div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={`card-header ${className}`} {...props}>{children}</div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h3 className={`card-title ${className}`} {...props}>{children}</h3>
  )
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className, ...props }: any) => (
    <span className={`badge ${variant} ${className}`} {...props}>{children}</span>
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, value, onChange, className, ...props }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input ${className}`}
      {...props}
    />
  )
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, className, ...props }: any) => (
    <div className={`alert ${className}`} {...props}>{children}</div>
  ),
  AlertDescription: ({ children, className, ...props }: any) => (
    <div className={`alert-description ${className}`} {...props}>{children}</div>
  )
}));

const mockDocuments: ClinicDocument[] = [
  {
    id: 'doc-001',
    name: 'Izin Praktik',
    type: 'license',
    fileName: 'izin-praktik.pdf',
    fileSize: 1024000,
    uploadedAt: '2023-01-01T00:00:00Z',
    status: 'approved',
    url: '/documents/izin-praktik.pdf',
    description: 'Dokumen izin praktik klinik'
  },
  {
    id: 'doc-002',
    name: 'Sertifikat Akreditasi',
    type: 'certificate',
    fileName: 'sertifikat.pdf',
    fileSize: 2048000,
    uploadedAt: '2023-01-02T00:00:00Z',
    status: 'pending',
    url: '/documents/sertifikat.pdf'
  },
  {
    id: 'doc-003',
    name: 'Asuransi Klinik',
    type: 'insurance',
    fileName: 'asuransi.jpg',
    fileSize: 512000,
    uploadedAt: '2023-01-03T00:00:00Z',
    status: 'rejected',
    url: '/documents/asuransi.jpg',
    description: 'Dokumen polis asuransi'
  }
];

describe('DocumentManager', () => {
  const mockDeleteDocument = jest.fn();
  const mockDownloadDocument = jest.fn();
  const mockOnDeleteDocument = jest.fn();
  const mockOnDownloadDocument = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseClinic.mockReturnValue({
      clinic: null,
      documents: mockDocuments,
      isLoading: false,
      isDocumentsLoading: false,
      error: null,
      documentsError: null,
      fetchClinic: jest.fn(),
      updateClinic: jest.fn(),
      uploadLogo: jest.fn(),
      updateBranding: jest.fn(),
      updateSettings: jest.fn(),
      fetchDocuments: jest.fn(),
      uploadDocument: jest.fn(),
      deleteDocument: mockDeleteDocument,
      downloadDocument: mockDownloadDocument,
      clearError: jest.fn(),
      clearDocumentsError: jest.fn()
    });
  });

  it('renders document manager with document list', () => {
    render(<DocumentManager />);

    expect(screen.getByText('Manajemen Dokumen')).toBeInTheDocument();
    expect(screen.getByText('Kelola dokumen klinik yang telah diunggah (3 dokumen)')).toBeInTheDocument();
    expect(screen.getByText('Izin Praktik')).toBeInTheDocument();
    expect(screen.getByText('Sertifikat Akreditasi')).toBeInTheDocument();
    expect(screen.getByText('Asuransi Klinik')).toBeInTheDocument();
  });

  it('displays document status badges correctly', () => {
    render(<DocumentManager />);

    expect(screen.getByText('Disetujui')).toBeInTheDocument();
    expect(screen.getByText('Menunggu')).toBeInTheDocument();
    expect(screen.getByText('Ditolak')).toBeInTheDocument();
  });

  it('filters documents by search term', async () => {
    const user = userEvent.setup();
    render(<DocumentManager />);

    const searchInput = screen.getByPlaceholderText('Cari dokumen...');
    await user.type(searchInput, 'izin');

    expect(screen.getByText('Izin Praktik')).toBeInTheDocument();
    expect(screen.queryByText('Sertifikat Akreditasi')).not.toBeInTheDocument();
    expect(screen.queryByText('Asuransi Klinik')).not.toBeInTheDocument();
  });

  it('filters documents by type', async () => {
    const user = userEvent.setup();
    render(<DocumentManager />);

    const typeSelect = screen.getByDisplayValue('Semua Jenis');
    await user.selectOptions(typeSelect, 'certificate');

    expect(screen.queryByText('Izin Praktik')).not.toBeInTheDocument();
    expect(screen.getByText('Sertifikat Akreditasi')).toBeInTheDocument();
    expect(screen.queryByText('Asuransi Klinik')).not.toBeInTheDocument();
  });

  it('filters documents by status', async () => {
    const user = userEvent.setup();
    render(<DocumentManager />);

    const statusSelect = screen.getByDisplayValue('Semua Status');
    await user.selectOptions(statusSelect, 'approved');

    expect(screen.getByText('Izin Praktik')).toBeInTheDocument();
    expect(screen.queryByText('Sertifikat Akreditasi')).not.toBeInTheDocument();
    expect(screen.queryByText('Asuransi Klinik')).not.toBeInTheDocument();
  });

  it('handles document download', async () => {
    const user = userEvent.setup();
    mockDownloadDocument.mockResolvedValue(true);
    
    render(<DocumentManager onDownloadDocument={mockOnDownloadDocument} />);

    const downloadButtons = screen.getAllByText('Download');
    await user.click(downloadButtons[0]);

    expect(mockDownloadDocument).toHaveBeenCalledWith('doc-001');
    expect(mockOnDownloadDocument).toHaveBeenCalledWith(mockDocuments[0]);
  });

  it('handles document deletion with confirmation', async () => {
    const user = userEvent.setup();
    mockDeleteDocument.mockResolvedValue(true);
    
    render(<DocumentManager onDeleteDocument={mockOnDeleteDocument} />);

    // Click delete button to show confirmation
    const deleteButtons = screen.getAllByRole('button', { name: '' }); // TrashIcon buttons
    await user.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByText('Hapus');
    await user.click(confirmButton);

    expect(mockDeleteDocument).toHaveBeenCalledWith('doc-001');
    expect(mockOnDeleteDocument).toHaveBeenCalledWith('doc-001');
  });

  it('can cancel document deletion', async () => {
    const user = userEvent.setup();
    render(<DocumentManager />);

    // Click delete button to show confirmation
    const deleteButtons = screen.getAllByRole('button', { name: '' });
    await user.click(deleteButtons[0]);

    // Cancel deletion
    const cancelButton = screen.getByText('Batal');
    await user.click(cancelButton);

    expect(mockDeleteDocument).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    mockUseClinic.mockReturnValue({
      clinic: null,
      documents: [],
      isLoading: false,
      isDocumentsLoading: true,
      error: null,
      documentsError: null,
      fetchClinic: jest.fn(),
      updateClinic: jest.fn(),
      uploadLogo: jest.fn(),
      updateBranding: jest.fn(),
      updateSettings: jest.fn(),
      fetchDocuments: jest.fn(),
      uploadDocument: jest.fn(),
      deleteDocument: jest.fn(),
      downloadDocument: jest.fn(),
      clearError: jest.fn(),
      clearDocumentsError: jest.fn()
    });

    render(<DocumentManager />);

    expect(screen.getByText('Memuat dokumen...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Failed to load documents';
    mockUseClinic.mockReturnValue({
      clinic: null,
      documents: [],
      isLoading: false,
      isDocumentsLoading: false,
      error: null,
      documentsError: errorMessage,
      fetchClinic: jest.fn(),
      updateClinic: jest.fn(),
      uploadLogo: jest.fn(),
      updateBranding: jest.fn(),
      updateSettings: jest.fn(),
      fetchDocuments: jest.fn(),
      uploadDocument: jest.fn(),
      deleteDocument: jest.fn(),
      downloadDocument: jest.fn(),
      clearError: jest.fn(),
      clearDocumentsError: jest.fn()
    });

    render(<DocumentManager />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows empty state when no documents', () => {
    mockUseClinic.mockReturnValue({
      clinic: null,
      documents: [],
      isLoading: false,
      isDocumentsLoading: false,
      error: null,
      documentsError: null,
      fetchClinic: jest.fn(),
      updateClinic: jest.fn(),
      uploadLogo: jest.fn(),
      updateBranding: jest.fn(),
      updateSettings: jest.fn(),
      fetchDocuments: jest.fn(),
      uploadDocument: jest.fn(),
      deleteDocument: jest.fn(),
      downloadDocument: jest.fn(),
      clearError: jest.fn(),
      clearDocumentsError: jest.fn()
    });

    render(<DocumentManager />);

    expect(screen.getByText('Belum ada dokumen')).toBeInTheDocument();
    expect(screen.getByText('Upload dokumen pertama Anda untuk memulai')).toBeInTheDocument();
  });

  it('displays summary stats correctly', () => {
    render(<DocumentManager />);

    // Check stats counts
    expect(screen.getByText('1')).toBeInTheDocument(); // Approved count
    expect(screen.getByText('1')).toBeInTheDocument(); // Pending count  
    expect(screen.getByText('1')).toBeInTheDocument(); // Rejected count
    expect(screen.getByText('3MB')).toBeInTheDocument(); // Total size
  });

  it('formats file sizes correctly', () => {
    render(<DocumentManager />);

    expect(screen.getByText('1000 KB')).toBeInTheDocument(); // 1024000 bytes
    expect(screen.getByText('2000 KB')).toBeInTheDocument(); // 2048000 bytes  
    expect(screen.getByText('500 KB')).toBeInTheDocument(); // 512000 bytes
  });

  it('formats dates correctly', () => {
    render(<DocumentManager />);

    expect(screen.getByText('1 Januari 2023')).toBeInTheDocument();
    expect(screen.getByText('2 Januari 2023')).toBeInTheDocument();
    expect(screen.getByText('3 Januari 2023')).toBeInTheDocument();
  });

  it('handles combined search and filter', async () => {
    const user = userEvent.setup();
    render(<DocumentManager />);

    // Search for "praktik" and filter by license type
    const searchInput = screen.getByPlaceholderText('Cari dokumen...');
    await user.type(searchInput, 'praktik');

    const typeSelect = screen.getByDisplayValue('Semua Jenis');
    await user.selectOptions(typeSelect, 'license');

    expect(screen.getByText('Izin Praktik')).toBeInTheDocument();
    expect(screen.queryByText('Sertifikat Akreditasi')).not.toBeInTheDocument();
    expect(screen.queryByText('Asuransi Klinik')).not.toBeInTheDocument();
  });
});