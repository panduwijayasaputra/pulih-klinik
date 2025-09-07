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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let therapists = getMockTherapists();

      // Apply filters
      if (filters) {
        if (filters.status) {
          therapists = therapists.filter(t => t.status === filters.status);
        }
        if (filters.specializations && filters.specializations.length > 0) {
          therapists = therapists.filter(t => 
            t.specializations.some(spec => filters.specializations!.includes(spec))
          );
        }
        if (filters.employmentType) {
          therapists = therapists.filter(t => t.employmentType === filters.employmentType);
        }
        if (filters.licenseType) {
          therapists = therapists.filter(t => t.licenseType === filters.licenseType);
        }
        if (filters.search || filters.searchQuery) {
          const searchTerm = (filters.search || filters.searchQuery || '').toLowerCase();
          therapists = therapists.filter(t => 
            t.fullName.toLowerCase().includes(searchTerm) ||
            t.email.toLowerCase().includes(searchTerm) ||
            t.specializations.some(spec => spec.toLowerCase().includes(searchTerm))
          );
        }
        if (filters.maxLoad) {
          therapists = therapists.filter(t => t.currentLoad <= filters.maxLoad!);
        }
      }

      // Apply sorting
      if (filters?.sortBy) {
        therapists.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case 'name':
              aValue = a.fullName;
              bValue = b.fullName;
              break;
            case 'joinDate':
              aValue = new Date(a.joinDate);
              bValue = new Date(b.joinDate);
              break;
            case 'clientCount':
              aValue = a.currentLoad;
              bValue = b.currentLoad;
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
          if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTherapists = therapists.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          items: paginatedTherapists,
          total: therapists.length,
          page,
          pageSize,
          totalPages: Math.ceil(therapists.length / pageSize)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch therapists'
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
        yearsOfExperience: data.yearsOfExperience,
        employmentType: data.employmentType,
        joinDate: new Date().toISOString().split('T')[0]!,
        maxClients: data.maxClients,
        timezone: 'Asia/Jakarta',
        sessionDuration: data.preferences?.sessionDuration || 60,
        breakBetweenSessions: data.preferences?.breakBetweenSessions || 15,
        maxSessionsPerDay: data.preferences?.maxSessionsPerDay || 8,
        workingDays: data.preferences?.workingDays || [1, 2, 3, 4, 5],
        adminNotes: undefined,
        specializations: data.specializations
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
        specializations: backendTherapist.specializations ? backendTherapist.specializations.split(', ') : [],
        yearsOfExperience: backendTherapist.yearsOfExperience,
        status: backendTherapist.status,
        employmentType: backendTherapist.employmentType,
        joinDate: backendTherapist.joinDate,
        maxClients: backendTherapist.maxClients,
        currentLoad: backendTherapist.currentLoad,
        timezone: backendTherapist.timezone,
        preferences: {
          sessionDuration: backendTherapist.sessionDuration,
          breakBetweenSessions: backendTherapist.breakBetweenSessions,
          maxSessionsPerDay: backendTherapist.maxSessionsPerDay,
          workingDays: backendTherapist.workingDays,
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
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
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

  static async updateTherapistStatus(therapistId: string, status: string): Promise<ItemResponse<Therapist>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const therapist = getMockTherapistById(therapistId);
      
      if (!therapist) {
        return {
          success: false,
          message: 'Therapist not found'
        };
      }

      // In a real implementation, this would update the database
      // For mock purposes, we'll just return the therapist with updated status
      const updatedTherapist = {
        ...therapist,
        status: status as any,
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: updatedTherapist
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update therapist status'
      };
    }
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
}