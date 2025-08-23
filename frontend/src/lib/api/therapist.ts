import { Therapist, TherapistAssignment, TherapistFilters, TherapistFormData } from '@/types/therapist';
import { ItemResponse, ListResponse, PaginatedResponse, StatusResponse } from './types';
import { getMockTherapists, getMockTherapistById } from '@/lib/mocks/therapist';

export class TherapistAPI {
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
      console.error('Error fetching therapists:', error);
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
      console.error('Error fetching therapist:', error);
      return {
        success: false,
        message: 'Failed to fetch therapist'
      };
    }
  }

  static async createTherapist(data: TherapistFormData): Promise<ItemResponse<Therapist>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate new therapist ID
      const newId = `th-${String(Date.now()).slice(-6)}`;
      const clinicId = 'clinic-001'; // TODO: Get from auth context

      // Create new therapist object
      const newTherapist: Therapist = {
        id: newId,
        clinicId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        
        // Professional Info
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        specializations: data.specializations,
        education: data.education,
        certifications: data.certifications.map((cert, index) => ({
          ...cert,
          id: `cert-${newId}-${index + 1}`,
          status: 'active' as const
        })),
        yearsOfExperience: data.yearsOfExperience,
        
        // Status & Availability
        status: 'pending_setup' as any,
        employmentType: data.employmentType,
        joinDate: new Date().toISOString().split('T')[0]!,
        
        // Assignment Info
        assignedClients: [],
        maxClients: data.maxClients,
        currentLoad: 0,
        
        // Schedule - empty initially, will be set up later
        schedule: [],
        timezone: 'Asia/Jakarta',
        
        // Settings
        preferences: data.preferences,
        
        // Audit
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // In a real implementation, this would save to the database
      // For mock purposes, we'll add to the mock data
      const { getMockTherapists } = await import('@/lib/mocks/therapist');
      const currentTherapists = getMockTherapists();
      currentTherapists.push(newTherapist);

      return {
        success: true,
        data: newTherapist
      };
    } catch (error) {
      console.error('Error creating therapist:', error);
      return {
        success: false,
        message: 'Failed to create therapist'
      };
    }
  }

  static async updateTherapist(therapistId: string, data: Partial<TherapistFormData>): Promise<ItemResponse<Therapist>> {
    // TODO: Implement actual API call
    console.log('TherapistAPI.updateTherapist called with:', { therapistId, data });
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async deleteTherapist(therapistId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    console.log('TherapistAPI.deleteTherapist called with:', { therapistId });
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async getTherapistAssignments(therapistId: string): Promise<ListResponse<TherapistAssignment>> {
    // TODO: Implement actual API call
    console.log('TherapistAPI.getTherapistAssignments called with:', { therapistId });
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
      console.error('Error updating therapist status:', error);
      return {
        success: false,
        message: 'Failed to update therapist status'
      };
    }
  }

  static async assignClientToTherapist(therapistId: string, clientId: string): Promise<ItemResponse<TherapistAssignment>> {
    // TODO: Implement actual API call
    console.log('TherapistAPI.assignClientToTherapist called with:', { therapistId, clientId });
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }

  static async removeClientFromTherapist(therapistId: string, clientId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    console.log('TherapistAPI.removeClientFromTherapist called with:', { therapistId, clientId });
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }
}