import { Therapist, TherapistAssignment, TherapistFilters, TherapistFormData } from '@/types/therapist';
import { ItemResponse, ListResponse, PaginatedResponse, StatusResponse } from './types';
import { getMockTherapists, getMockTherapistById } from '@/lib/mocks/therapist';
import { apiClient } from '../http-client';

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
        if (filters.employmentType) {
          queryParams.append('employmentType', filters.employmentType);
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
      
      // Convert backend response to frontend format
      const frontendTherapists: Therapist[] = backendData.therapists.map((backendTherapist: any) => ({
        id: backendTherapist.id,
        clinicId: backendTherapist.clinic.id,
        fullName: backendTherapist.fullName,
        email: backendTherapist.user.email,
        phone: backendTherapist.phone,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status,
        employmentType: backendTherapist.employmentType,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          breakBetweenSessions: backendTherapist.breakBetweenSessions,
          languages: ['Indonesian']
        },
        assignedClients: [],
        schedule: [],
        education: [],
        certifications: [],
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

  static async getTherapist(therapistId: string): Promise<ItemResponse<Therapist>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const therapist = getMockTherapistById(therapistId);
      
      if (!therapist) {
        return {
          success: false,
          message: 'Therapist not found'
        };
      }

      return {
        success: true,
        data: therapist
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch therapist'
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
        employmentType: data.employmentType,
        joinDate: new Date().toISOString().split('T')[0]!,
        timezone: 'Asia/Jakarta',
        breakBetweenSessions: data.preferences?.breakBetweenSessions || 15,
        adminNotes: undefined
      };

      const response = await apiClient.post('/therapists', createTherapistDto);
      
      // Convert backend response to frontend format
      // The response is wrapped by ResponseInterceptor: { success: true, data: therapist, message: "..." }
      const backendTherapist = response.data.data;
      const frontendTherapist: Therapist = {
        id: backendTherapist.id,
        clinicId: backendTherapist.clinic.id,
        fullName: backendTherapist.fullName,
        email: backendTherapist.user.email,
        phone: backendTherapist.phone,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status,
        employmentType: backendTherapist.employmentType,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          breakBetweenSessions: backendTherapist.breakBetweenSessions,
          languages: ['Indonesian']
        },
        assignedClients: [],
        schedule: [],
        education: [],
        certifications: [],
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
      if (data.employmentType !== undefined) updateTherapistDto.employmentType = data.employmentType;
      if (data.preferences?.breakBetweenSessions !== undefined) updateTherapistDto.breakBetweenSessions = data.preferences.breakBetweenSessions;
      if (data.timezone !== undefined) updateTherapistDto.timezone = data.timezone;
      if (data.adminNotes !== undefined) updateTherapistDto.adminNotes = data.adminNotes;

      const response = await apiClient.put(`/therapists/${therapistId}`, updateTherapistDto);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: therapist, message: "..." }
      const backendTherapist = response.data.data;
      
      // Convert backend response to frontend format
      const frontendTherapist: Therapist = {
        id: backendTherapist.id,
        clinicId: backendTherapist.clinic.id,
        fullName: backendTherapist.fullName,
        email: backendTherapist.user.email,
        phone: backendTherapist.phone,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status,
        employmentType: backendTherapist.employmentType,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          breakBetweenSessions: backendTherapist.breakBetweenSessions,
          languages: ['Indonesian']
        },
        assignedClients: [],
        schedule: [],
        education: [],
        certifications: [],
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


  static async assignClientToTherapist(therapistId: string, clientId: string): Promise<ItemResponse<TherapistAssignment>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async removeClientFromTherapist(therapistId: string, clientId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
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
        clinicId: backendTherapist.clinic.id,
        fullName: backendTherapist.fullName,
        email: backendTherapist.user.email,
        phone: backendTherapist.phone,
        licenseNumber: backendTherapist.licenseNumber,
        licenseType: backendTherapist.licenseType,
        status: backendTherapist.status,
        employmentType: backendTherapist.employmentType,
        joinDate: backendTherapist.joinDate,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          breakBetweenSessions: backendTherapist.breakBetweenSessions,
          languages: ['Indonesian']
        },
        assignedClients: [],
        schedule: [],
        education: [],
        certifications: [],
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