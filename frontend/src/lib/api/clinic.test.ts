import { 
  getClinicProfile,
  updateClinicProfile,
  uploadClinicLogo,
  updateClinicBranding,
  updateClinicSettings,
  getClinicDocuments,
  uploadClinicDocument,
  deleteClinicDocument,
  downloadClinicDocument,
  ClinicApiError
} from './clinic';

import { ClinicProfile, ClinicProfileFormData } from '@/types/clinic';

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('Clinic API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Reset URL.createObjectURL and revokeObjectURL mocks
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
  });

  describe('getClinicProfile', () => {
    it('should fetch clinic profile successfully', async () => {
      const mockClinicProfile: ClinicProfile = {
        id: 'clinic-001',
        name: 'Test Clinic',
        address: 'Test Address',
        phone: '+62123456789',
        email: 'test@clinic.com',
        website: 'https://test.com',
        description: 'Test description',
        workingHours: '08:00 - 17:00',
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
        updatedAt: '2023-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockClinicProfile })
      } as Response);

      const result = await getClinicProfile();

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      expect(result).toEqual(mockClinicProfile);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Clinic not found' })
      } as Response);

      await expect(getClinicProfile()).rejects.toThrow(ClinicApiError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getClinicProfile()).rejects.toThrow('Gagal mengambil data profil klinik');
    });
  });

  describe('updateClinicProfile', () => {
    it('should update clinic profile successfully', async () => {
      const formData: ClinicProfileFormData = {
        name: 'Updated Clinic',
        address: 'Updated Address',
        phone: '+62987654321',
        email: 'updated@clinic.com',
        website: 'https://updated.com',
        description: 'Updated description',
        workingHours: '09:00 - 18:00'
      };

      const mockUpdatedProfile: ClinicProfile = {
        id: 'clinic-001',
        ...formData,
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockUpdatedProfile })
      } as Response);

      const result = await updateClinicProfile(formData);

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/profile', {
        method: 'PUT',
        headers: {},
        body: expect.any(FormData)
      });
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should handle file upload in profile update', async () => {
      const mockFile = new File(['mock content'], 'logo.png', { type: 'image/png' });
      const formData: ClinicProfileFormData = {
        name: 'Test Clinic',
        address: 'Test Address',
        phone: '+62123456789',
        email: 'test@clinic.com',
        website: 'https://test.com',
        description: 'Test description',
        workingHours: '08:00 - 17:00',
        logo: mockFile
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} })
      } as Response);

      await updateClinicProfile(formData);

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/profile', {
        method: 'PUT',
        headers: {},
        body: expect.any(FormData)
      });
    });
  });

  describe('uploadClinicLogo', () => {
    it('should upload logo successfully', async () => {
      const mockFile = new File(['mock content'], 'logo.png', { type: 'image/png' });
      const mockLogoUrl = 'https://example.com/logo.png';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { logoUrl: mockLogoUrl } })
      } as Response);

      const result = await uploadClinicLogo(mockFile);

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/logo', {
        method: 'POST',
        headers: {},
        body: expect.any(FormData)
      });
      expect(result).toBe(mockLogoUrl);
    });
  });

  describe('uploadClinicDocument', () => {
    it('should upload document successfully', async () => {
      const mockFile = new File(['mock content'], 'license.pdf', { type: 'application/pdf' });
      const mockDocument = {
        id: 'doc-001',
        name: 'License',
        type: 'license' as const,
        fileName: 'license.pdf',
        fileSize: 1024,
        uploadedAt: '2023-01-01T00:00:00Z',
        status: 'pending' as const,
        url: 'https://example.com/license.pdf',
        description: 'Clinic license'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockDocument })
      } as Response);

      const result = await uploadClinicDocument(mockFile, 'license', 'Clinic license');

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/documents', {
        method: 'POST',
        headers: {},
        body: expect.any(FormData)
      });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('deleteClinicDocument', () => {
    it('should delete document successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: null })
      } as Response);

      await deleteClinicDocument('doc-001');

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/documents/doc-001', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('downloadClinicDocument', () => {
    it('should download document successfully', async () => {
      const mockBlob = new Blob(['mock content'], { type: 'application/pdf' });
      
      // Mock document.createElement and related methods
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn()
      };
      
      document.createElement = jest.fn(() => mockLink as any);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      } as Response);

      await downloadClinicDocument('doc-001', 'test.pdf');

      expect(mockFetch).toHaveBeenCalledWith('/api/clinic/documents/doc-001/download', {
        method: 'GET',
        headers: {}
      });
      expect(mockLink.download).toBe('test.pdf');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle download error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response);

      await expect(downloadClinicDocument('doc-001', 'test.pdf')).rejects.toThrow('Gagal mengunduh dokumen');
    });
  });

  describe('Error Handling', () => {
    it('should create ClinicApiError with proper message', () => {
      const error = new ClinicApiError('Test error', '404', { detail: 'Not found' });
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('404');
      expect(error.details).toEqual({ detail: 'Not found' });
      expect(error.name).toBe('ClinicApiError');
    });

    it('should handle API response with error flag', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: 'Custom error message' })
      } as Response);

      await expect(getClinicProfile()).rejects.toThrow('Custom error message');
    });

    it('should handle API response with missing data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: null })
      } as Response);

      await expect(getClinicProfile()).rejects.toThrow('Data tidak ditemukan');
    });
  });
});