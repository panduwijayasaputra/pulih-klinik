import { 
  ClinicBranding, 
  ClinicDocument, 
  ClinicProfile,
  ClinicProfileFormData,
  ClinicSettings 
} from '@/types/clinic';
import { ItemResponse, ListResponse, StatusResponse } from './types';
import { mockClinicProfile, mockClinicStats } from '@/lib/mocks/clinic';

export class ClinicAPI {
  static async getClinicProfile(clinicId: string): Promise<ItemResponse<ClinicProfile>> {
    console.log('ClinicAPI.getClinicProfile called with:', { clinicId });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Clinic profile retrieved successfully',
      data: mockClinicProfile
    };
  }

  static async updateClinicProfile(clinicId: string, data: ClinicProfileFormData): Promise<ItemResponse<ClinicProfile>> {
    console.log('ClinicAPI.updateClinicProfile called with:', { clinicId, data });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the mock data with form data
    const updatedClinic: ClinicProfile = {
      ...mockClinicProfile,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website || '',
      description: data.description || '',
      workingHours: data.workingHours || '',
      updatedAt: new Date().toISOString()
    };
    
    // Update the mock data for subsequent calls
    Object.assign(mockClinicProfile, updatedClinic);
    
    return {
      success: true,
      message: 'Clinic profile updated successfully',
      data: updatedClinic
    };
  }

  static async uploadDocument(
    clinicId: string, 
    file: File, 
    type: string, 
    options?: {
      name?: string;
      description?: string;
      onProgress?: (progress: number) => void;
    }
  ): Promise<ItemResponse<ClinicDocument>> {
    console.log('ClinicAPI.uploadDocument called with:', { clinicId, file, type, options });
    
    const { name, description, onProgress } = options || {};
    
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        onProgress(i);
      }
    } else {
      // Simulate API delay without progress
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Simulate random upload failure (10% chance)
    if (Math.random() < 0.1) {
      return {
        success: false,
        message: 'Upload gagal. Silakan coba lagi.',
        data: undefined
      };
    }
    
    // Create mock document response
    const newDocument: ClinicDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || file.name.replace(/\.[^/.]+$/, ''),
      type: type as any,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      url: `/documents/${file.name}`,
      description: description || `Uploaded ${type} document`
    };
    
    // If it's a logo upload, return a URL for the logo
    if (type === 'logo') {
      const logoUrl = URL.createObjectURL(file);
      return {
        success: true,
        message: 'Logo uploaded successfully',
        data: {
          ...newDocument,
          url: logoUrl
        }
      };
    }
    
    return {
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    };
  }

  static async getClinicDocuments(clinicId: string): Promise<ListResponse<ClinicDocument>> {
    console.log('ClinicAPI.getClinicDocuments called with:', { clinicId });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: 'Documents retrieved successfully',
      data: mockClinicProfile.documents || []
    };
  }

  static async deleteDocument(clinicId: string, documentId: string): Promise<StatusResponse> {
    console.log('ClinicAPI.deleteDocument called with:', { clinicId, documentId });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Document deleted successfully'
    };
  }

  static async updateClinicBranding(clinicId: string, branding: ClinicBranding): Promise<ItemResponse<ClinicProfile>> {
    console.log('ClinicAPI.updateClinicBranding called with:', { clinicId, branding });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedClinic: ClinicProfile = {
      ...mockClinicProfile,
      branding,
      updatedAt: new Date().toISOString()
    };
    
    Object.assign(mockClinicProfile, updatedClinic);
    
    return {
      success: true,
      message: 'Clinic branding updated successfully',
      data: updatedClinic
    };
  }

  static async updateClinicSettings(clinicId: string, settings: ClinicSettings): Promise<ItemResponse<ClinicProfile>> {
    console.log('ClinicAPI.updateClinicSettings called with:', { clinicId, settings });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedClinic: ClinicProfile = {
      ...mockClinicProfile,
      settings,
      updatedAt: new Date().toISOString()
    };
    
    Object.assign(mockClinicProfile, updatedClinic);
    
    return {
      success: true,
      message: 'Clinic settings updated successfully',
      data: updatedClinic
    };
  }

  // Get clinic statistics
  static async getClinicStats(clinicId: string): Promise<ItemResponse<typeof mockClinicStats>> {
    console.log('ClinicAPI.getClinicStats called with:', { clinicId });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: 'Clinic statistics retrieved successfully',
      data: mockClinicStats
    };
  }
}