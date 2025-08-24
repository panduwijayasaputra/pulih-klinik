import { ApiResponse, PaginatedResponse, ItemResponse, StatusResponse, ListResponse } from './types';
import { Client, ClientFormData, ClientFilters } from '@/types/client';
import { getMockClients, getMockClientById } from '@/lib/mocks/client';

export const ClientAPI = {
  async getClients(
    page: number = 1,
    pageSize: number = 10,
    filters?: ClientFilters
  ): Promise<PaginatedResponse<Client>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let clients = getMockClients();

      // Apply filters
      if (filters) {
        if (filters.status) {
          clients = clients.filter(c => c.status === filters.status);
        }
        if (filters.therapist) {
          clients = clients.filter(c => c.assignedTherapist === filters.therapist);
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          clients = clients.filter(c => 
            c.fullName.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm) ||
            c.phone.includes(searchTerm)
          );
        }
        if (filters.province) {
          clients = clients.filter(c => c.province === filters.province);
        }
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedClients = clients.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          items: paginatedClients,
          total: clients.length,
          page,
          pageSize,
          totalPages: Math.ceil(clients.length / pageSize)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch clients'
      };
    }
  },

  async getClient(clientId: string): Promise<ItemResponse<Client>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const client = getMockClientById(clientId);
      
      if (!client) {
        return {
          success: false,
          message: 'Client not found'
        };
      }

      return {
        success: true,
        data: client
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch client'
      };
    }
  },

  async createClient(data: ClientFormData): Promise<ItemResponse<Client>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate new client ID
      const newId = `client-${String(Date.now()).slice(-6)}`;

      // Create new client object
      const newClient: Client = {
        id: newId,
        fullName: data.fullName,
        gender: data.gender,
        birthPlace: data.birthPlace,
        birthDate: data.birthDate,
        religion: data.religion,
        occupation: data.occupation,
        education: data.education,
        educationMajor: data.educationMajor || '',
        address: data.address,
        phone: data.phone,
        email: data.email,
        hobbies: data.hobbies || '',
        maritalStatus: data.maritalStatus,
        spouseName: data.spouseName || '',
        relationshipWithSpouse: data.relationshipWithSpouse,

        firstVisit: data.firstVisit,
        previousVisitDetails: data.previousVisitDetails,
        
        // Auto-assigned fields
        status: 'new' as any,
        joinDate: new Date().toISOString().split('T')[0]!,
        totalSessions: 0,
        progress: 0,
        notes: data.notes,
        province: data.province,
        
        // Minor-specific fields
        isMinor: data.isMinor,
        school: data.school,
        grade: data.grade,
        guardianFullName: data.guardianFullName,
        guardianRelationship: data.guardianRelationship,
        guardianPhone: data.guardianPhone,
        guardianAddress: data.guardianAddress,
        guardianOccupation: data.guardianOccupation,
        guardianMaritalStatus: data.guardianMaritalStatus,
        guardianLegalCustody: data.guardianLegalCustody,
        guardianCustodyDocsAttached: data.guardianCustodyDocsAttached,
      };

      // In a real implementation, this would save to the database
      // For mock purposes, we'll just return the new client without modifying the original data
      // const currentClients = getMockClients();
      // currentClients.push(newClient);

      return {
        success: true,
        data: newClient
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create client'
      };
    }
  },

  async updateClient(clientId: string, data: Partial<ClientFormData>): Promise<ItemResponse<Client>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  },

  async deleteClient(clientId: string): Promise<StatusResponse> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  },
  async assignClientToTherapist(clientId: string, therapistId: string): Promise<ApiResponse<{ clientId: string; therapistId: string }>> {
    // Mock API call with success response
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // In a real implementation, this would make an API call to update the database
    // For now, we'll simulate success since mock data is read-only
    const client = getMockClientById(clientId);
    if (!client) {
      return {
        success: false,
        message: 'Klien tidak ditemukan'
      };
    }

    // Get therapist name from therapist mock data
    const { mockTherapists } = await import('@/lib/mocks/therapist');
    const therapist = mockTherapists.find((t: any) => t.id === therapistId);
    
    if (!therapist) {
      return {
        success: false,
        message: 'Therapist tidak ditemukan'
      };
    }
    
    return {
      success: true,
      message: `Therapist ${therapist.fullName} berhasil ditugaskan ke klien ${client.fullName}`,
      data: { clientId, therapistId }
    };
  },

  async unassignClient(clientId: string): Promise<ApiResponse<{ clientId: string }>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  },

  async getTherapistCapacity(therapistId: string): Promise<ApiResponse<{ currentLoad: number; maxClients: number }>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  },

  async getClientSessions(clientId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    // TODO: Implement actual API call
    return {
      success: false,
      message: 'API not implemented yet'
    };
  }
};