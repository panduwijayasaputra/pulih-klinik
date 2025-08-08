import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentUpload } from './DocumentUpload';
import { ClinicDocument } from '@/types/clinic';

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  DocumentArrowUpIcon: ({ className }: any) => <div className={className} data-testid="document-arrow-up-icon" />,
  XMarkIcon: ({ className }: any) => <div className={className} data-testid="x-mark-icon" />,
  CheckCircleIcon: ({ className }: any) => <div className={className} data-testid="check-circle-icon" />,
  ExclamationTriangleIcon: ({ className }: any) => <div className={className} data-testid="exclamation-triangle-icon" />,
  DocumentIcon: ({ className }: any) => <div className={className} data-testid="document-icon" />
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, variant, size, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`btn ${variant} ${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ className, ...props }: any) => (
    <input className={`input ${className}`} {...props} />
  )
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ className, ...props }: any) => (
    <textarea className={`textarea ${className}`} {...props} />
  )
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className, ...props }: any) => (
    <label htmlFor={htmlFor} className={`label ${className}`} {...props}>
      {children}
    </label>
  )
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, defaultValue, value, ...props }: any) => (
    <div className="select-mock" data-testid="select" {...props}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className, ...props }: any) => (
    <div className={`select-trigger ${className}`} data-testid="select-trigger" {...props}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder, className, ...props }: any) => (
    <div className={`select-value ${className}`} data-testid="select-value" {...props}>
      {placeholder}
    </div>
  ),
  SelectContent: ({ children, className, ...props }: any) => (
    <div className={`select-content ${className}`} data-testid="select-content" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({ children, value, className, ...props }: any) => (
    <div className={`select-item ${className}`} data-testid="select-item" data-value={value} {...props}>
      {children}
    </div>
  )
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className, ...props }: any) => (
    <div className={`card-description ${className}`} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h3 className={`card-title ${className}`} {...props}>
      {children}
    </h3>
  )
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, className, ...props }: any) => (
    <div className={`alert ${className}`} {...props}>
      {children}
    </div>
  )
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className, ...props }: any) => (
    <div className={`progress ${className}`} data-value={value} {...props} />
  )
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

describe('DocumentUpload', () => {
  const mockOnUploadSuccess = jest.fn();
  const mockOnUploadError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createMockFile = (name: string, type: string, size: number = 1024) => {
    return new File(['mock content'], name, { type, size });
  };

  it('renders the document upload component correctly', () => {
    render(<DocumentUpload />);

    expect(screen.getByText('Upload Dokumen')).toBeInTheDocument();
    expect(screen.getByText('Upload dokumen klinik seperti izin praktik, sertifikat, atau dokumen lainnya')).toBeInTheDocument();
    expect(screen.getByLabelText('Nama Dokumen *')).toBeInTheDocument();
    expect(screen.getByLabelText('Jenis Dokumen *')).toBeInTheDocument();
    expect(screen.getByText('Pilih File')).toBeInTheDocument();
  });

  it('displays form fields with correct labels', () => {
    render(<DocumentUpload />);

    expect(screen.getByLabelText('Nama Dokumen *')).toBeInTheDocument();
    expect(screen.getByLabelText('Jenis Dokumen *')).toBeInTheDocument();
    expect(screen.getByLabelText('Deskripsi (Opsional)')).toBeInTheDocument();
  });

  it('shows document type options', () => {
    render(<DocumentUpload />);

    const typeSelect = screen.getByLabelText('Jenis Dokumen *');
    expect(typeSelect).toBeInTheDocument();
    
    expect(screen.getByText('Izin Praktik')).toBeInTheDocument();
    expect(screen.getByText('Sertifikat')).toBeInTheDocument();
    expect(screen.getByText('Asuransi')).toBeInTheDocument();
    expect(screen.getByText('Dokumen Pajak')).toBeInTheDocument();
    expect(screen.getByText('Lainnya')).toBeInTheDocument();
  });

  it('handles file selection through input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DocumentUpload onUploadSuccess={mockOnUploadSuccess} />);

    const file = createMockFile('test.pdf', 'application/pdf');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test')).toBeInTheDocument(); // Name field auto-filled

      // Fast-forward timers to complete upload simulation
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }
  });

  it('validates file size', async () => {
    render(<DocumentUpload onUploadError={mockOnUploadError} maxFileSize={1024} />);

    const largeFile = createMockFile('large.pdf', 'application/pdf', 2048);
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [largeFile] } });
      });

      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.stringContaining('terlalu besar')
      );
    }
  });

  it('validates file type', async () => {
    render(<DocumentUpload onUploadError={mockOnUploadError} />);

    const invalidFile = createMockFile('test.txt', 'text/plain');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [invalidFile] } });
      });

      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.stringContaining('tidak didukung')
      );
    }
  });

  it('limits number of files', async () => {
    render(<DocumentUpload onUploadError={mockOnUploadError} maxFiles={2} />);

    const files = [
      createMockFile('file1.pdf', 'application/pdf'),
      createMockFile('file2.pdf', 'application/pdf'),
      createMockFile('file3.pdf', 'application/pdf')
    ];

    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } });
      });

      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.stringContaining('Maksimal 2 file')
      );
    }
  });

  it('handles drag and drop', async () => {
    render(<DocumentUpload />);

    const dropZone = screen.getByText(/drag & drop file ke sini/).closest('div');
    const file = createMockFile('test.pdf', 'application/pdf');

    // Simulate drag enter
    fireEvent.dragEnter(dropZone!, {
      dataTransfer: { files: [file] }
    });

    // Simulate drop
    await act(async () => {
      fireEvent.drop(dropZone!, {
        dataTransfer: { files: [file] }
      });
    });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('shows upload progress', async () => {
    render(<DocumentUpload />);

    const file = createMockFile('test.pdf', 'application/pdf');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      // Check initial progress
      expect(screen.getByText('0% selesai')).toBeInTheDocument();

      // Advance timers partially
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Should show progress
      expect(screen.getByText(/selesai/)).toBeInTheDocument();
    }
  });

  it('allows removing files from upload list', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DocumentUpload />);

    const file = createMockFile('test.pdf', 'application/pdf');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      expect(screen.getByText('test.pdf')).toBeInTheDocument();

      // Find and click remove button
      const removeButton = screen.getByTestId('x-mark-icon').closest('button');
      if (removeButton) {
        await user.click(removeButton);
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      }
    }
  });

  it('submits form with uploaded files', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DocumentUpload onUploadSuccess={mockOnUploadSuccess} />);

    // Fill form
    await user.type(screen.getByLabelText('Nama Dokumen *'), 'Test Document');
    await user.selectOptions(screen.getByLabelText('Jenis Dokumen *'), 'license');

    // Add file
    const file = createMockFile('test.pdf', 'application/pdf');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      // Complete upload
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      // Submit form
      const submitButton = screen.getByText('Simpan Dokumen');
      await user.click(submitButton);

      expect(mockOnUploadSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Document',
          type: 'license',
          fileName: 'test.pdf'
        })
      );
    }
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<DocumentUpload />);

    // Try to submit without required fields
    const submitButton = screen.getByText('Simpan Dokumen');
    await user.click(submitButton);

    expect(screen.getByText('Nama dokumen wajib diisi')).toBeInTheDocument();
  });

  it('resets form and files', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DocumentUpload />);

    // Fill form and add file
    await user.type(screen.getByLabelText('Nama Dokumen *'), 'Test');
    
    const file = createMockFile('test.pdf', 'application/pdf');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
      expect(screen.getByText('test.pdf')).toBeInTheDocument();

      // Reset
      const resetButton = screen.getByText('Reset');
      await user.click(resetButton);

      expect(screen.queryByDisplayValue('Test')).not.toBeInTheDocument();
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    }
  });

  it('disables interaction when disabled prop is true', () => {
    render(<DocumentUpload disabled={true} />);

    expect(screen.getByLabelText('Nama Dokumen *')).toBeDisabled();
    expect(screen.getByLabelText('Jenis Dokumen *')).toBeDisabled();
    expect(screen.getByText('Pilih File')).toBeDisabled();
    expect(screen.getByText('Reset')).toBeDisabled();
    expect(screen.getByText('Simpan Dokumen')).toBeDisabled();
  });

  it('shows file size in human readable format', async () => {
    render(<DocumentUpload />);

    const file = createMockFile('test.pdf', 'application/pdf', 1536); // 1.5 KB
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      expect(screen.getByText('2 KB')).toBeInTheDocument(); // Rounded up
    }
  });

  it('shows success icon for completed uploads', async () => {
    render(<DocumentUpload />);

    const file = createMockFile('test.pdf', 'application/pdf');
    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      // Complete upload
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    }
  });

  it('shows different icons for different file types', async () => {
    render(<DocumentUpload />);

    const pdfFile = createMockFile('test.pdf', 'application/pdf');
    const imageFile = createMockFile('test.jpg', 'image/jpeg');

    const fileInput = screen.getByRole('button', { name: /pilih file/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [pdfFile, imageFile] } });
      });

      expect(screen.getAllByTestId('document-icon')).toHaveLength(1); // PDF file
      expect(screen.getByAltText('test.jpg')).toBeInTheDocument(); // Image file
    }
  });
});