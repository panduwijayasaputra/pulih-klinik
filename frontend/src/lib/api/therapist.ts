import { Therapist, TherapistAssignment, TherapistFilters, TherapistFormData } from '@/types/therapist';
import { UserStatusEnum } from '@/types/status';
import { ItemResponse, ListResponse, PaginatedResponse, StatusResponse } from './types';
import { getMockTherapists, getMockTherapistById } from '@/lib/mocks/therapist';
import { apiClient } from '../http-client';
import { AuthAPI } from './auth';

// Helper function to map backend therapist to frontend format
const mapBackendTherapistToFrontend = (backendTherapist: any): Therapist => ({
  id: backendTherapist.id,
  clinicId: backendTherapist.clinicId,
  clinicName: backendTherapist.clinicName,
  userId: backendTherapist.userId,
  name: backendTherapist.name,
  email: backendTherapist.email,
  phone: backendTherapist.phone,
  avatarUrl: backendTherapist.avatarUrl,
  licenseNumber: backendTherapist.licenseNumber,
  licenseType: backendTherapist.licenseType,
  status: backendTherapist.status as UserStatusEnum, // Backend now returns unified status
  joinDate: backendTherapist.joinDate,
  currentLoad: backendTherapist.currentLoad,
  timezone: backendTherapist.timezone,
  preferences: {
    languages: ['Indonesian']
  },
  assignedClients: [],
  schedule: [],
  education: backendTherapist.education,
  certifications: backendTherapist.certifications,
  adminNotes: backendTherapist.adminNotes,
  hasClinicAdminRole: backendTherapist.hasClinicAdminRole || false,
  createdAt: backendTherapist.createdAt,
  updatedAt: backendTherapist.updatedAt
});

// Helper function to get raw backend therapist data (for form editing)
const getRawBackendTherapist = async (therapistId: string): Promise<any> => {
  const response = await apiClient.get(`/therapists/${therapistId}`);
  return response.data.data;
};

export class TherapistAPI {
  static async checkEmailAvailability(email: string): Promise<{ available: boolean; message: string }> {
    try {
      const response = await apiClient.post('/therapists/check-email', { email });
      return response.data;
    } catch (error: any) {
      return {
        available: false,
        message: error.response?.data?.message || 'Failed to check email availability'
      };
    }
  }

  static async getTherapists(
    page: number = 1,
    pageSize: number = 10,
    filters?: TherapistFilters
  ): Promise<PaginatedResponse<Therapist>> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      // Add filters to query params
      if (filters) {
        if (filters.status) {
          queryParams.append('status', filters.status);
        }
        if (filters.licenseType) {
          queryParams.append('licenseType', filters.licenseType);
        }
        if (filters.search || filters.searchQuery) {
          const searchTerm = filters.search || filters.searchQuery || '';
          queryParams.append('search', searchTerm);
        }
        if (filters.hasAvailableCapacity) {
          queryParams.append('hasAvailableCapacity', 'true');
        }
        if (filters.sortBy) {
          queryParams.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
          queryParams.append('sortOrder', filters.sortOrder);
        }
      }

      const response = await apiClient.get(`/therapists?${queryParams.toString()}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: { therapists, total, page, limit, totalPages }, message: "..." }
      const backendData = response.data.data;
      
      // Debug: Log backend response to see what data we're receiving
      console.log('🔍 Backend therapist data:', backendData.therapists.map((t: any) => ({
        name: t.name,
        email: t.email,
        hasClinicAdminRole: t.hasClinicAdminRole,
        status: t.status
      })));
      
      // Convert backend response to frontend format
      const frontendTherapists: Therapist[] = backendData.therapists.map((backendTherapist: any) => ({
        id: backendTherapist.id,
        clinicId: backendTherapist.clinicId,
        clinicName: backendTherapist.clinicName,
        userId: backendTherapist.userId,
        name: backendTherapist.name,
        email: backendTherapist.email,
        phone: backendTherapist.phone,
        avatarUrl: backendTherapist.avatarUrl,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status as UserStatusEnum,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          languages: ['Indonesian']
        },
        hasClinicAdminRole: backendTherapist.hasClinicAdminRole || false,
        assignedClients: [],
        schedule: [],
        education: backendTherapist.education,
        certifications: backendTherapist.certifications,
        adminNotes: backendTherapist.adminNotes,
        createdAt: backendTherapist.createdAt,
        updatedAt: backendTherapist.updatedAt
      }));

      return {
        success: true,
        data: {
          items: frontendTherapists,
          total: backendData.total,
          page: backendData.page,
          pageSize: backendData.limit,
          totalPages: backendData.totalPages
        }
      };
    } catch (error: any) {
      console.error('Failed to fetch therapists:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch therapists',
        data: {
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0
        }
      };
    }
  }

  static async getRawTherapist(therapistId: string): Promise<any> {
    try {
      return await getRawBackendTherapist(therapistId);
    } catch (error: any) {
      console.error('Failed to fetch raw therapist data:', error);
      throw error;
    }
  }

  static async createTherapistForExistingUser(
    userId: string,
    licenseNumber: string,
    licenseType: string,
    joinDate?: string,
    education?: string,
    certifications?: string,
    adminNotes?: string
  ): Promise<ItemResponse<Therapist>> {
    try {
      const response = await apiClient.post('/therapists/create-for-existing-user', {
        userId,
        licenseNumber,
        licenseType,
        joinDate,
        education,
        certifications,
        adminNotes
      });
      
      return {
        success: true,
        data: mapBackendTherapistToFrontend(response.data.data)
      };
    } catch (error: any) {
      console.error('Failed to create therapist for existing user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create therapist record'
      };
    }
  }

  static async getCurrentTherapist(): Promise<ItemResponse<Therapist>> {
    try {
      // Get all therapists and find the one that matches current user
      const response = await apiClient.get('/therapists');
      
      if (response.data.success && response.data.data) {
        const therapists = response.data.data.therapists || response.data.data;
        
        // Get current user ID from the auth context
        // We need to find the therapist record that belongs to the current user
        // Since we don't have currentUserId in the response, we'll need to get it from the auth context
        const currentUserResponse = await AuthAPI.getCurrentUser();
        if (!currentUserResponse.success || !currentUserResponse.data) {
          console.error('Failed to get current user:', currentUserResponse);
          return {
            success: false,
            message: 'Unable to get current user information'
          };
        }
        
        console.log('Current user ID:', currentUserResponse.data.id);
        console.log('Available therapists:', therapists.map((t: any) => ({ id: t.id, userId: t.userId, name: t.name })));
        
        // Find therapist that matches current user ID
        const currentTherapist = Array.isArray(therapists) 
          ? therapists.find((t: any) => t.userId === currentUserResponse.data!.id)
          : null;
          
        if (currentTherapist) {
          // Convert backend response to frontend format
          const frontendTherapist: Therapist = {
            id: currentTherapist.id,
            clinicId: currentTherapist.clinicId,
            clinicName: currentTherapist.clinicName,
            userId: currentTherapist.userId,
            name: currentTherapist.name,
            email: currentTherapist.email,
            phone: currentTherapist.phone,
            avatarUrl: currentTherapist.avatarUrl,
            licenseNumber: currentTherapist.licenseNumber,
            licenseType: currentTherapist.licenseType,
            status: currentTherapist.status as UserStatusEnum,
            joinDate: currentTherapist.joinDate,
            currentLoad: currentTherapist.currentLoad,
            timezone: currentTherapist.timezone,
            preferences: {
              languages: ['Indonesian']
            },
            assignedClients: [],
            schedule: [],
            education: currentTherapist.education,
            certifications: currentTherapist.certifications,
            adminNotes: currentTherapist.adminNotes,
            hasClinicAdminRole: currentTherapist.hasClinicAdminRole || false,
            createdAt: currentTherapist.createdAt,
            updatedAt: currentTherapist.updatedAt
          };

          return {
            success: true,
            data: frontendTherapist
          };
        } else {
          return {
            success: false,
            message: 'Current user is not set up as a therapist'
          };
        }
      } else {
        return {
          success: false,
          message: 'Failed to load therapist data'
        };
      }
    } catch (error: any) {
      console.error('Failed to fetch current therapist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch current therapist'
      };
    }
  }

  static async getTherapist(therapistId: string): Promise<ItemResponse<Therapist>> {
    try {
      const response = await apiClient.get(`/therapists/${therapistId}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: therapist, message: "..." }
      const backendTherapist = response.data.data;
      
      // Convert backend response to frontend format
      const frontendTherapist: Therapist = {
        id: backendTherapist.id,
        clinicId: backendTherapist.clinicId,
        clinicName: backendTherapist.clinicName,
        userId: backendTherapist.userId,
        name: backendTherapist.name,
        email: backendTherapist.email,
        phone: backendTherapist.phone,
        avatarUrl: backendTherapist.avatarUrl,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status as UserStatusEnum,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          languages: ['Indonesian']
        },
        assignedClients: [],
        schedule: [],
        education: backendTherapist.education,
        certifications: backendTherapist.certifications,
        adminNotes: backendTherapist.adminNotes,
        hasClinicAdminRole: backendTherapist.hasClinicAdminRole || false,
        createdAt: backendTherapist.createdAt,
        updatedAt: backendTherapist.updatedAt
      };

      return {
        success: true,
        data: frontendTherapist
      };
    } catch (error: any) {
      console.error('Failed to fetch therapist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch therapist'
      };
    }
  }

  static async createTherapist(data: TherapistFormData): Promise<ItemResponse<Therapist>> {
    try {
      // Convert frontend data to backend DTO format
      const createTherapistDto = {
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        joinDate: new Date().toISOString().split('T')[0]!,
        timezone: 'Asia/Jakarta',
        education: data.education,
        certifications: data.certifications,
        adminNotes: data.adminNotes
      };

      const response = await apiClient.post('/therapists', createTherapistDto);
      
      // Convert backend response to frontend format
      // The response is wrapped by ResponseInterceptor: { success: true, data: therapist, message: "..." }
      const backendTherapist = response.data.data;
      const frontendTherapist: Therapist = {
        id: backendTherapist.id,
        clinicId: backendTherapist.clinicId,
        clinicName: backendTherapist.clinicName,
        userId: backendTherapist.userId,
        name: backendTherapist.name,
        email: backendTherapist.email,
        phone: backendTherapist.phone,
        avatarUrl: backendTherapist.avatarUrl,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status as UserStatusEnum,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          languages: ['Indonesian']
        },
        hasClinicAdminRole: backendTherapist.hasClinicAdminRole || false,
        assignedClients: [],
        schedule: [],
        education: backendTherapist.education,
        certifications: backendTherapist.certifications,
        createdAt: backendTherapist.createdAt,
        updatedAt: backendTherapist.updatedAt
      };

      return {
        success: true,
        data: frontendTherapist
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create therapist'
      };
    }
  }

  static async updateTherapist(therapistId: string, data: Partial<TherapistFormData>): Promise<ItemResponse<Therapist>> {
    try {
      // Map frontend data to backend DTO format
      const updateTherapistDto: any = {};
      
      if (data.fullName !== undefined) updateTherapistDto.fullName = data.fullName;
      if (data.phone !== undefined) updateTherapistDto.phone = data.phone;
      if (data.licenseNumber !== undefined) updateTherapistDto.licenseNumber = data.licenseNumber;
      if (data.licenseType !== undefined) updateTherapistDto.licenseType = data.licenseType;
      if (data.timezone !== undefined) updateTherapistDto.timezone = data.timezone;
      if (data.education !== undefined) updateTherapistDto.education = data.education;
      if (data.certifications !== undefined) updateTherapistDto.certifications = data.certifications;
      if (data.adminNotes !== undefined) updateTherapistDto.adminNotes = data.adminNotes;

      const response = await apiClient.put(`/therapists/${therapistId}`, updateTherapistDto);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: therapist, message: "..." }
      const backendTherapist = response.data.data;
      
      // Convert backend response to frontend format
      const frontendTherapist: Therapist = {
        id: backendTherapist.id,
        clinicId: backendTherapist.clinicId,
        clinicName: backendTherapist.clinicName,
        userId: backendTherapist.userId,
        name: backendTherapist.name,
        email: backendTherapist.email,
        phone: backendTherapist.phone,
        avatarUrl: backendTherapist.avatarUrl,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status as UserStatusEnum,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          languages: ['Indonesian']
        },
        hasClinicAdminRole: backendTherapist.hasClinicAdminRole || false,
        assignedClients: [],
        schedule: [],
        education: backendTherapist.education,
        certifications: backendTherapist.certifications,
        createdAt: backendTherapist.createdAt,
        updatedAt: backendTherapist.updatedAt
      };

      return {
        success: true,
        data: frontendTherapist
      };
    } catch (error: any) {
      console.error('Failed to update therapist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update therapist'
      };
    }
  }

  static async deleteTherapist(therapistId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async getTherapistAssignments(therapistId: string): Promise<ListResponse<TherapistAssignment>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }


  static async assignClientToTherapist(therapistId: string, clientId: string, notes?: string): Promise<ItemResponse<TherapistAssignment>> {
    try {
      const response = await apiClient.post(`/therapists/assignments/${therapistId}/clients/${clientId}`, {
        notes: notes || 'Assigned via therapist management interface'
      });
      
      return {
        success: true,
        message: response.data.message || 'Client successfully assigned to therapist',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Failed to assign client to therapist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign client to therapist'
      };
    }
  }

  static async getClientAssignment(clientId: string): Promise<ItemResponse<TherapistAssignment>> {
    try {
      const response = await apiClient.get(`/therapists/clients/${clientId}/assignments`);
      
      // The response returns an array of assignments, we need the active one
      const assignments = response.data.data || response.data;
      const activeAssignment = assignments.find((assignment: any) => assignment.status === 'active');
      
      if (!activeAssignment) {
        return {
          success: false,
          message: 'No active assignment found for this client'
        };
      }
      
      return {
        success: true,
        message: response.data.message || 'Client assignment retrieved successfully',
        data: activeAssignment
      };
    } catch (error: any) {
      console.error('Failed to get client assignment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get client assignment'
      };
    }
  }

  static async transferClient(assignmentId: string, newTherapistId: string, reason: string, notes?: string): Promise<ItemResponse<TherapistAssignment>> {
    try {
      const response = await apiClient.put(`/therapists/assignments/${assignmentId}/transfer/${newTherapistId}`, {
        reason,
        notes: notes || 'Transferred via client management interface'
      });
      
      return {
        success: true,
        message: response.data.message || 'Client successfully transferred to new therapist',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Failed to transfer client to new therapist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to transfer client to new therapist'
      };
    }
  }

  static async removeClientFromTherapist(therapistId: string, clientId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  /**
   * Get email resend status for therapist
   */
  static async getEmailResendStatus(therapistId: string): Promise<{
    success: boolean;
    data?: {
      attempts: number;
      maxAttempts: number;
      cooldownUntil?: Date;
      canResend: boolean;
      remainingCooldownMs?: number;
    };
    message?: string;
  }> {
    try {
      const response = await apiClient.get(`/therapists/${therapistId}/email-resend-status`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get email resend status'
      };
    }
  }

  static async sendEmailVerification(therapistId: string): Promise<StatusResponse> {
    try {
      const response = await apiClient.post(`/therapists/${therapistId}/send-verification`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send email verification'
      };
    }
  }


  static async updateTherapistStatus(therapistId: string, status: string, reason?: string): Promise<ItemResponse<Therapist>> {
    try {
      const response = await apiClient.patch(`/therapists/${therapistId}/status`, {
        status,
        reason
      });
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: therapist, message: "..." }
      const backendTherapist = response.data.data;
      
      // Convert backend response to frontend format
      const frontendTherapist: Therapist = {
        id: backendTherapist.id,
        clinicId: backendTherapist.clinicId,
        clinicName: backendTherapist.clinicName,
        userId: backendTherapist.userId,
        name: backendTherapist.name,
        email: backendTherapist.email,
        phone: backendTherapist.phone,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status as UserStatusEnum,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          languages: ['Indonesian']
        },
        hasClinicAdminRole: backendTherapist.hasClinicAdminRole || false,
        assignedClients: [],
        schedule: [],
        education: backendTherapist.education,
        certifications: backendTherapist.certifications,
        createdAt: backendTherapist.createdAt,
        updatedAt: backendTherapist.updatedAt
      };

      return {
        success: true,
        data: frontendTherapist
      };
    } catch (error: any) {
      console.error('Failed to update therapist status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update therapist status'
      };
    }
  }
}