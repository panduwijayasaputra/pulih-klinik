import { 
  ClinicBranding, 
  ClinicDocument, 
  ClinicProfile,
  ClinicProfileFormData,
  ClinicSettings 
} from '@/types/clinic';
import { ItemResponse, ListResponse, StatusResponse } from './types';
import { httpClient, handleApiResponse, handleApiError } from '@/lib/http-client';

export class ClinicAPI {
  static async createClinic(data: ClinicProfileFormData): Promise<ItemResponse<ClinicProfile>> {
    try {
      const response = await httpClient.post('/clinics', data);
      const result = handleApiResponse(response) as { data: ClinicProfile; message?: string };
      return {
        success: true,
        message: result.message || 'Clinic created successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async getClinicProfile(clinicId: string): Promise<ItemResponse<ClinicProfile>> {
    try {
      const response = await httpClient.get(`/clinics/${clinicId}`);
      const result = handleApiResponse(response) as { data: ClinicProfile; message?: string };
      return {
        success: true,
        message: result.message || 'Clinic profile retrieved successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async updateClinicProfile(clinicId: string, data: ClinicProfileFormData): Promise<ItemResponse<ClinicProfile>> {
    try {
      const response = await httpClient.put(`/clinics/${clinicId}`, data);
      const result = handleApiResponse(response) as { data: ClinicProfile; message?: string };
      return {
        success: true,
        message: result.message || 'Clinic profile updated successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
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
      throw new Error('Upload gagal. Silakan coba lagi.');
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
    try {
      const response = await httpClient.get(`/clinics/${clinicId}/documents`);
      const result = handleApiResponse(response) as { data: ClinicDocument[]; message?: string };
      return {
        success: true,
        message: result.message || 'Documents retrieved successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async deleteDocument(clinicId: string, documentId: string): Promise<StatusResponse> {
    try {
      const response = await httpClient.delete(`/clinics/${clinicId}/documents/${documentId}`);
      const result = handleApiResponse(response) as { message?: string };
      return {
        success: true,
        message: result.message || 'Document deleted successfully'
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async updateClinicBranding(clinicId: string, branding: ClinicBranding): Promise<ItemResponse<ClinicProfile>> {
    try {
      const response = await httpClient.put(`/clinics/${clinicId}/branding`, branding);
      const result = handleApiResponse(response) as { data: ClinicProfile; message?: string };
      return {
        success: true,
        message: result.message || 'Clinic branding updated successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async updateClinicSettings(clinicId: string, settings: ClinicSettings): Promise<ItemResponse<ClinicProfile>> {
    try {
      const response = await httpClient.put(`/clinics/${clinicId}/settings`, settings);
      const result = handleApiResponse(response) as { data: ClinicProfile; message?: string };
      return {
        success: true,
        message: result.message || 'Clinic settings updated successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Upload clinic logo
  static async uploadLogo(clinicId: string, file: File): Promise<ItemResponse<{ logoUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await httpClient.post(`/clinics/${clinicId}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = handleApiResponse(response) as { data: { logoUrl: string }; message?: string };
      return {
        success: true,
        message: result.message || 'Logo uploaded successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get clinic statistics
  static async getClinicStats(clinicId: string): Promise<ItemResponse<{
    therapists: number;
    clients: number;
    sessions: number;
    documents: number;
    activeTherapists: number;
    activeClients: number;
    thisMonthSessions: number;
    thisMonthDocuments: number;
  }>> {
    try {
      const response = await httpClient.get(`/clinics/${clinicId}/stats`);
      const result = handleApiResponse(response) as { 
        data: {
          therapists: number;
          clients: number;
          sessions: number;
          documents: number;
          activeTherapists: number;
          activeClients: number;
          thisMonthSessions: number;
          thisMonthDocuments: number;
        }; 
        message?: string 
      };
      return {
        success: true,
        message: result.message || 'Clinic statistics retrieved successfully',
        data: result.data
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get available subscription tiers
   */
  static async getSubscriptionTiers(): Promise<{
    success: boolean;
    data: SubscriptionTierData[];
    message: string;
  }> {
    try {
      const response = await httpClient.get('/registration/subscription-tiers');
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Update clinic subscription
   */
  static async updateSubscription(
    clinicId: string, 
    subscriptionTier: string
  ): Promise<{
    success: boolean;
    data: { id: string; subscriptionTier: string; subscriptionExpires: string };
    message: string;
  }> {
    try {
      const response = await httpClient.put(`/clinics/${clinicId}/subscription`, {
        subscriptionTier
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export interface SubscriptionTierData {
  id: string;
  name: string;
  code: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  therapistLimit: number;
  newClientsPerDayLimit: number;
  isRecommended: boolean;
  isActive: boolean;
  sortOrder: number;
}