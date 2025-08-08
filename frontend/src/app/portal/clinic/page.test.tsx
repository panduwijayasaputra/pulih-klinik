import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import ClinicPage from './page';
import { useClinic } from '@/hooks/useClinic';
import { ClinicProfile } from '@/types/clinic';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the useClinic hook
jest.mock('@/hooks/useClinic');
const mockUseClinic = useClinic as jest.MockedFunction<typeof useClinic>;

// Mock components
jest.mock('@/components/navigation/Breadcrumbs', () => ({
  Breadcrumbs: ({ items }: { items: Array<{ label: string; href: string; current?: boolean }> }) => (
    <nav data-testid="breadcrumbs">
      {items.map((item, index) => (
        <span key={index} className={item.current ? 'current' : ''}>
          {item.label}
        </span>
      ))}
    </nav>
  )
}));

jest.mock('@/components/clinic/ClinicProfileForm', () => ({
  ClinicProfileForm: ({ onSaveSuccess, onCancel }: any) => (
    <div data-testid="clinic-profile-form">
      <button onClick={onSaveSuccess} data-testid="save-success-button">
        Trigger Save Success
      </button>
      <button onClick={onCancel} data-testid="cancel-button">
        Trigger Cancel
      </button>
    </div>
  )
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={`btn ${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
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

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange, className, ...props }: any) => (
    <div className={`tabs ${className}`} {...props}>
      {children}
    </div>
  ),
  TabsList: ({ children, className, ...props }: any) => (
    <div className={`tabs-list ${className}`} {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value, className, ...props }: any) => (
    <button className={`tab-trigger ${className}`} data-value={value} {...props}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value, className, ...props }: any) => (
    <div className={`tab-content ${className}`} data-value={value} {...props}>
      {children}
    </div>
  )
}));

const mockClinic: ClinicProfile = {
  id: 'clinic-001',
  name: 'Test Clinic',
  address: 'Jl. Test No. 123, Jakarta',
  phone: '+6281234567890',
  email: 'test@clinic.com',
  website: 'https://test.com',
  description: 'Test clinic description',
  workingHours: '08:00 - 17:00',
  logo: '/test-logo.png',
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter'
  },
  settings: {
    timezone: 'Asia/Jakarta',
    language: 'id',
    notifications: { email: true, sms: false, push: true }
  },
  subscriptionTier: 'beta',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z'
};

describe('ClinicPage', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockUseClinic.mockReturnValue({
      clinic: mockClinic,
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
  });

  it('renders the clinic profile page correctly', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Profil Klinik')).toBeInTheDocument();
    expect(screen.getByText('Kelola informasi klinik Anda dan pengaturan terkait')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('clinic-profile-form')).toBeInTheDocument();
  });

  it('shows loading state when clinic data is loading', () => {
    mockUseClinic.mockReturnValue({
      clinic: null,
      documents: [],
      isLoading: true,
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

    render(<ClinicPage />);

    // Should show skeleton loading elements
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(7);
  });

  it('displays clinic information in status card', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Status Klinik')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument(); // Created date in Indonesian format
    expect(screen.getByText('1/2/2023')).toBeInTheDocument(); // Updated date in Indonesian format
  });

  it('displays help section with tips', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Bantuan')).toBeInTheDocument();
    expect(screen.getByText('Tips untuk melengkapi profil klinik')).toBeInTheDocument();
    expect(screen.getByText('Pastikan informasi kontak selalu terkini')).toBeInTheDocument();
    expect(screen.getByText('Upload logo dengan resolusi minimal 300x300px')).toBeInTheDocument();
  });

  it('displays quick stats section', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Statistik Cepat')).toBeInTheDocument();
    expect(screen.getByText('Therapist')).toBeInTheDocument();
    expect(screen.getByText('Klien')).toBeInTheDocument();
    expect(screen.getByText('Sesi')).toBeInTheDocument();
    expect(screen.getByText('Dokumen')).toBeInTheDocument();
  });

  it('renders breadcrumbs with correct items', () => {
    render(<ClinicPage />);

    const breadcrumbs = screen.getByTestId('breadcrumbs');
    expect(breadcrumbs).toBeInTheDocument();
    
    // Check breadcrumb content
    expect(screen.getByText('Portal')).toBeInTheDocument();
    expect(screen.getByText('Pengaturan')).toBeInTheDocument();
    expect(screen.getByText('Profil Klinik')).toBeInTheDocument();
  });

  it('navigates to documents page when document button is clicked', async () => {
    const user = userEvent.setup();
    render(<ClinicPage />);

    const documentButton = screen.getByText('Kelola Dokumen');
    await user.click(documentButton);

    expect(mockPush).toHaveBeenCalledWith('/portal/clinic/documents');
  });

  it('navigates to branding page when branding button is clicked', async () => {
    const user = userEvent.setup();
    render(<ClinicPage />);

    const brandingButton = screen.getByText('Pengaturan Branding');
    await user.click(brandingButton);

    expect(mockPush).toHaveBeenCalledWith('/portal/clinic/branding');
  });

  it('handles save success callback', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<ClinicPage />);

    const saveSuccessButton = screen.getByTestId('save-success-button');
    await user.click(saveSuccessButton);

    expect(consoleSpy).toHaveBeenCalledWith('Profile updated successfully');
    
    consoleSpy.mockRestore();
  });

  it('handles cancel callback and navigates to portal', async () => {
    const user = userEvent.setup();
    render(<ClinicPage />);

    const cancelButton = screen.getByTestId('cancel-button');
    await user.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/portal');
  });

  it('renders tabs correctly', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Informasi Dasar')).toBeInTheDocument();
    expect(screen.getByText('Pengaturan')).toBeInTheDocument();
    expect(screen.getByText('Branding')).toBeInTheDocument();
  });

  it('shows placeholder content for settings tab', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Pengaturan klinik akan tersedia segera...')).toBeInTheDocument();
  });

  it('shows placeholder content for branding tab', () => {
    render(<ClinicPage />);

    expect(screen.getByText('Pengaturan branding akan tersedia segera...')).toBeInTheDocument();
  });

  it('uses responsive design classes', () => {
    render(<ClinicPage />);

    const container = document.querySelector('.container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('px-4');
    expect(container).toHaveClass('max-w-7xl');
  });

  it('handles missing clinic data gracefully', () => {
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

    render(<ClinicPage />);

    expect(screen.getByText('Profil Klinik')).toBeInTheDocument();
    // Should still render the page structure even without clinic data
    expect(screen.getByTestId('clinic-profile-form')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<ClinicPage />);

    // Check that dates are formatted in Indonesian locale
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('1/2/2023')).toBeInTheDocument();
  });

  it('displays subscription tier correctly', () => {
    render(<ClinicPage />);

    expect(screen.getByText('beta')).toBeInTheDocument();
  });
});