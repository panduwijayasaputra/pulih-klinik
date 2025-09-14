import { ApiResponse, PaginatedResponse, ItemResponse, StatusResponse } from './types';
import { Client, ClientFormData, ClientFilters } from '@/types/client';
import { apiClient } from '../http-client';

export const ClientAPI = {
  async getClients(
    page: number = 1,
    pageSize: number = 10,
    filters?: ClientFilters
  ): Promise<PaginatedResponse<Client>> {
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
        if (filters.therapist) {
          queryParams.append('therapistId', filters.therapist);
        }
        if (filters.search) {
          queryParams.append('search', filters.search);
        }
        if (filters.province) {
          queryParams.append('province', filters.province);
        }
        if (filters.gender) {
          queryParams.append('gender', filters.gender);
        }
        if (filters.religion) {
          queryParams.append('religion', filters.religion);
        }
        if (filters.maritalStatus) {
          queryParams.append('maritalStatus', filters.maritalStatus);
        }
      }

      const response = await apiClient.get(`/clients?${queryParams.toString()}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: { clients, total, page, limit, totalPages }, message: "..." }
      const backendData = response.data.data;
      
      // Convert backend response to frontend format
      const frontendClients: Client[] = backendData.clients.map((backendClient: any) => ({
        id: backendClient.id,
        fullName: backendClient.fullName,
        gender: backendClient.gender,
        birthPlace: backendClient.birthPlace,
        birthDate: backendClient.birthDate,
        age: backendClient.age,
        religion: backendClient.religion,
        occupation: backendClient.occupation,
        education: backendClient.education,
        educationMajor: backendClient.educationMajor,
        address: backendClient.address,
        phone: backendClient.phone,
        email: backendClient.email,
        hobbies: backendClient.hobbies,
        maritalStatus: backendClient.maritalStatus,
        spouseName: backendClient.spouseName,
        relationshipWithSpouse: backendClient.relationshipWithSpouse,
        firstVisit: backendClient.firstVisit,
        previousVisitDetails: backendClient.previousVisitDetails,
        province: backendClient.province,
        emergencyContactName: backendClient.emergencyContactName,
        emergencyContactPhone: backendClient.emergencyContactPhone,
        emergencyContactRelationship: backendClient.emergencyContactRelationship,
        emergencyContactAddress: backendClient.emergencyContactAddress,
        isMinor: backendClient.isMinor,
        school: backendClient.school,
        grade: backendClient.grade,
        guardianFullName: backendClient.guardianFullName,
        guardianRelationship: backendClient.guardianRelationship,
        guardianPhone: backendClient.guardianPhone,
        guardianAddress: backendClient.guardianAddress,
        guardianOccupation: backendClient.guardianOccupation,
        guardianMaritalStatus: backendClient.guardianMaritalStatus,
        guardianLegalCustody: backendClient.guardianLegalCustody,
        guardianCustodyDocsAttached: backendClient.guardianCustodyDocsAttached,
        status: backendClient.status,
        joinDate: backendClient.joinDate,
        totalSessions: backendClient.totalSessions,
        progress: backendClient.progress,
        notes: backendClient.notes,
        primaryIssue: backendClient.primaryIssue,
        assignedTherapist: backendClient.assignedTherapistName,
        assignedTherapistId: backendClient.assignedTherapistId,
        assignedTherapistName: backendClient.assignedTherapistName,
        createdAt: backendClient.createdAt,
        updatedAt: backendClient.updatedAt
      }));

      return {
        success: true,
        data: {
          items: frontendClients,
          total: backendData.total,
          page: backendData.page,
          pageSize: backendData.limit,
          totalPages: backendData.totalPages
        }
      };
    } catch (error: any) {
      console.error('Failed to fetch clients:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch clients',
        data: {
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0
        }
      };
    }
  },

  async getClient(clientId: string): Promise<ItemResponse<Client>> {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: client, message: "..." }
      const backendClient = response.data.data;
      
      // Convert backend response to frontend format
      const frontendClient: Client = {
        id: backendClient.id,
        fullName: backendClient.fullName,
        gender: backendClient.gender,
        birthPlace: backendClient.birthPlace,
        birthDate: backendClient.birthDate,
        age: backendClient.age,
        religion: backendClient.religion,
        occupation: backendClient.occupation,
        education: backendClient.education,
        educationMajor: backendClient.educationMajor,
        address: backendClient.address,
        phone: backendClient.phone,
        email: backendClient.email,
        hobbies: backendClient.hobbies,
        maritalStatus: backendClient.maritalStatus,
        spouseName: backendClient.spouseName,
        relationshipWithSpouse: backendClient.relationshipWithSpouse,
        firstVisit: backendClient.firstVisit,
        previousVisitDetails: backendClient.previousVisitDetails,
        province: backendClient.province,
        emergencyContactName: backendClient.emergencyContactName,
        emergencyContactPhone: backendClient.emergencyContactPhone,
        emergencyContactRelationship: backendClient.emergencyContactRelationship,
        emergencyContactAddress: backendClient.emergencyContactAddress,
        isMinor: backendClient.isMinor,
        school: backendClient.school,
        grade: backendClient.grade,
        guardianFullName: backendClient.guardianFullName,
        guardianRelationship: backendClient.guardianRelationship,
        guardianPhone: backendClient.guardianPhone,
        guardianAddress: backendClient.guardianAddress,
        guardianOccupation: backendClient.guardianOccupation,
        guardianMaritalStatus: backendClient.guardianMaritalStatus,
        guardianLegalCustody: backendClient.guardianLegalCustody,
        guardianCustodyDocsAttached: backendClient.guardianCustodyDocsAttached,
        status: backendClient.status,
        joinDate: backendClient.joinDate,
        totalSessions: backendClient.totalSessions,
        progress: backendClient.progress,
        notes: backendClient.notes,
        primaryIssue: backendClient.primaryIssue,
        assignedTherapist: backendClient.assignedTherapistName,
        assignedTherapistId: backendClient.assignedTherapistId,
        assignedTherapistName: backendClient.assignedTherapistName,
        createdAt: backendClient.createdAt,
        updatedAt: backendClient.updatedAt
      };

      return {
        success: true,
        data: frontendClient
      };
    } catch (error: any) {
      console.error('Failed to fetch client:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch client'
      };
    }
  },

  async createClient(data: ClientFormData): Promise<ItemResponse<Client>> {
    try {
      // Convert frontend data to backend DTO format
      const createClientDto = {
        fullName: data.fullName,
        gender: data.gender,
        birthPlace: data.birthPlace,
        birthDate: data.birthDate,
        religion: data.religion,
        occupation: data.occupation,
        education: data.education,
        educationMajor: data.educationMajor,
        address: data.address,
        phone: data.phone,
        email: data.email,
        hobbies: data.hobbies,
        maritalStatus: data.maritalStatus,
        spouseName: data.spouseName,
        relationshipWithSpouse: data.relationshipWithSpouse,
        firstVisit: data.firstVisit,
        previousVisitDetails: data.previousVisitDetails,
        province: data.province,
        // Emergency contact information
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelationship: data.emergencyContactRelationship,
        emergencyContactAddress: data.emergencyContactAddress,
        // Minor-specific fields
        isMinor: data.isMinor,
        school: data.school,
        grade: data.grade,
        // Guardian information
        guardianFullName: data.guardianFullName,
        guardianRelationship: data.guardianRelationship,
        guardianPhone: data.guardianPhone,
        guardianAddress: data.guardianAddress,
        guardianOccupation: data.guardianOccupation,
        guardianMaritalStatus: data.guardianMaritalStatus,
        guardianLegalCustody: data.guardianLegalCustody,
        guardianCustodyDocsAttached: data.guardianCustodyDocsAttached,
        // Additional information
        totalSessions: 0, // Default for new clients
        progress: 0, // Default for new clients
        notes: data.notes,
        primaryIssue: data.primaryIssue
      };

      const response = await apiClient.post('/clients', createClientDto);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: client, message: "..." }
      const backendClient = response.data.data;
      
      // Convert backend response to frontend format
      const frontendClient: Client = {
        id: backendClient.id,
        fullName: backendClient.fullName,
        gender: backendClient.gender,
        birthPlace: backendClient.birthPlace,
        birthDate: backendClient.birthDate,
        age: backendClient.age,
        religion: backendClient.religion,
        occupation: backendClient.occupation,
        education: backendClient.education,
        educationMajor: backendClient.educationMajor,
        address: backendClient.address,
        phone: backendClient.phone,
        email: backendClient.email,
        hobbies: backendClient.hobbies,
        maritalStatus: backendClient.maritalStatus,
        spouseName: backendClient.spouseName,
        relationshipWithSpouse: backendClient.relationshipWithSpouse,
        firstVisit: backendClient.firstVisit,
        previousVisitDetails: backendClient.previousVisitDetails,
        province: backendClient.province,
        emergencyContactName: backendClient.emergencyContactName,
        emergencyContactPhone: backendClient.emergencyContactPhone,
        emergencyContactRelationship: backendClient.emergencyContactRelationship,
        emergencyContactAddress: backendClient.emergencyContactAddress,
        isMinor: backendClient.isMinor,
        school: backendClient.school,
        grade: backendClient.grade,
        guardianFullName: backendClient.guardianFullName,
        guardianRelationship: backendClient.guardianRelationship,
        guardianPhone: backendClient.guardianPhone,
        guardianAddress: backendClient.guardianAddress,
        guardianOccupation: backendClient.guardianOccupation,
        guardianMaritalStatus: backendClient.guardianMaritalStatus,
        guardianLegalCustody: backendClient.guardianLegalCustody,
        guardianCustodyDocsAttached: backendClient.guardianCustodyDocsAttached,
        status: backendClient.status,
        joinDate: backendClient.joinDate,
        totalSessions: backendClient.totalSessions,
        progress: backendClient.progress,
        notes: backendClient.notes,
        primaryIssue: backendClient.primaryIssue,
        assignedTherapist: backendClient.assignedTherapistName,
        assignedTherapistId: backendClient.assignedTherapistId,
        assignedTherapistName: backendClient.assignedTherapistName,
        createdAt: backendClient.createdAt,
        updatedAt: backendClient.updatedAt
      };

      return {
        success: true,
        data: frontendClient
      };
    } catch (error: any) {
      console.error('Failed to create client:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create client'
      };
    }
  },

  async updateClient(clientId: string, data: Partial<ClientFormData>): Promise<ItemResponse<Client>> {
    try {
      // Map frontend data to backend DTO format
      const updateClientDto: any = {};
      
      if (data.fullName !== undefined) updateClientDto.fullName = data.fullName;
      if (data.gender !== undefined) updateClientDto.gender = data.gender;
      if (data.birthPlace !== undefined) updateClientDto.birthPlace = data.birthPlace;
      if (data.birthDate !== undefined) updateClientDto.birthDate = data.birthDate;
      if (data.religion !== undefined) updateClientDto.religion = data.religion;
      if (data.occupation !== undefined) updateClientDto.occupation = data.occupation;
      if (data.education !== undefined) updateClientDto.education = data.education;
      if (data.educationMajor !== undefined) updateClientDto.educationMajor = data.educationMajor;
      if (data.address !== undefined) updateClientDto.address = data.address;
      if (data.phone !== undefined) updateClientDto.phone = data.phone;
      if (data.email !== undefined) updateClientDto.email = data.email;
      if (data.hobbies !== undefined) updateClientDto.hobbies = data.hobbies;
      if (data.maritalStatus !== undefined) updateClientDto.maritalStatus = data.maritalStatus;
      if (data.spouseName !== undefined) updateClientDto.spouseName = data.spouseName;
      if (data.relationshipWithSpouse !== undefined) updateClientDto.relationshipWithSpouse = data.relationshipWithSpouse;
      if (data.firstVisit !== undefined) updateClientDto.firstVisit = data.firstVisit;
      if (data.previousVisitDetails !== undefined) updateClientDto.previousVisitDetails = data.previousVisitDetails;
      if (data.province !== undefined) updateClientDto.province = data.province;
      if (data.emergencyContactName !== undefined) updateClientDto.emergencyContactName = data.emergencyContactName;
      if (data.emergencyContactPhone !== undefined) updateClientDto.emergencyContactPhone = data.emergencyContactPhone;
      if (data.emergencyContactRelationship !== undefined) updateClientDto.emergencyContactRelationship = data.emergencyContactRelationship;
      if (data.emergencyContactAddress !== undefined) updateClientDto.emergencyContactAddress = data.emergencyContactAddress;
      if (data.isMinor !== undefined) updateClientDto.isMinor = data.isMinor;
      if (data.school !== undefined) updateClientDto.school = data.school;
      if (data.grade !== undefined) updateClientDto.grade = data.grade;
      if (data.guardianFullName !== undefined) updateClientDto.guardianFullName = data.guardianFullName;
      if (data.guardianRelationship !== undefined) updateClientDto.guardianRelationship = data.guardianRelationship;
      if (data.guardianPhone !== undefined) updateClientDto.guardianPhone = data.guardianPhone;
      if (data.guardianAddress !== undefined) updateClientDto.guardianAddress = data.guardianAddress;
      if (data.guardianOccupation !== undefined) updateClientDto.guardianOccupation = data.guardianOccupation;
      if (data.guardianMaritalStatus !== undefined) updateClientDto.guardianMaritalStatus = data.guardianMaritalStatus;
      if (data.guardianLegalCustody !== undefined) updateClientDto.guardianLegalCustody = data.guardianLegalCustody;
      if (data.guardianCustodyDocsAttached !== undefined) updateClientDto.guardianCustodyDocsAttached = data.guardianCustodyDocsAttached;
      if (data.notes !== undefined) updateClientDto.notes = data.notes;
      if (data.primaryIssue !== undefined) updateClientDto.primaryIssue = data.primaryIssue;

      const response = await apiClient.put(`/clients/${clientId}`, updateClientDto);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: client, message: "..." }
      const backendClient = response.data.data;
      
      // Convert backend response to frontend format
      const frontendClient: Client = {
        id: backendClient.id,
        fullName: backendClient.fullName,
        gender: backendClient.gender,
        birthPlace: backendClient.birthPlace,
        birthDate: backendClient.birthDate,
        age: backendClient.age,
        religion: backendClient.religion,
        occupation: backendClient.occupation,
        education: backendClient.education,
        educationMajor: backendClient.educationMajor,
        address: backendClient.address,
        phone: backendClient.phone,
        email: backendClient.email,
        hobbies: backendClient.hobbies,
        maritalStatus: backendClient.maritalStatus,
        spouseName: backendClient.spouseName,
        relationshipWithSpouse: backendClient.relationshipWithSpouse,
        firstVisit: backendClient.firstVisit,
        previousVisitDetails: backendClient.previousVisitDetails,
        province: backendClient.province,
        emergencyContactName: backendClient.emergencyContactName,
        emergencyContactPhone: backendClient.emergencyContactPhone,
        emergencyContactRelationship: backendClient.emergencyContactRelationship,
        emergencyContactAddress: backendClient.emergencyContactAddress,
        isMinor: backendClient.isMinor,
        school: backendClient.school,
        grade: backendClient.grade,
        guardianFullName: backendClient.guardianFullName,
        guardianRelationship: backendClient.guardianRelationship,
        guardianPhone: backendClient.guardianPhone,
        guardianAddress: backendClient.guardianAddress,
        guardianOccupation: backendClient.guardianOccupation,
        guardianMaritalStatus: backendClient.guardianMaritalStatus,
        guardianLegalCustody: backendClient.guardianLegalCustody,
        guardianCustodyDocsAttached: backendClient.guardianCustodyDocsAttached,
        status: backendClient.status,
        joinDate: backendClient.joinDate,
        totalSessions: backendClient.totalSessions,
        progress: backendClient.progress,
        notes: backendClient.notes,
        primaryIssue: backendClient.primaryIssue,
        assignedTherapist: backendClient.assignedTherapistName,
        assignedTherapistId: backendClient.assignedTherapistId,
        assignedTherapistName: backendClient.assignedTherapistName,
        createdAt: backendClient.createdAt,
        updatedAt: backendClient.updatedAt
      };

      return {
        success: true,
        data: frontendClient
      };
    } catch (error: any) {
      console.error('Failed to update client:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update client'
      };
    }
  },

  async deleteClient(clientId: string): Promise<StatusResponse> {
    try {
      const response = await apiClient.delete(`/clients/${clientId}`);
      
      return {
        success: true,
        message: response.data.message || 'Client successfully archived'
      };
    } catch (error: any) {
      console.error('Failed to delete client:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete client'
      };
    }
  },
  async assignClientToTherapist(clientId: string, therapistId: string): Promise<ApiResponse<{ clientId: string; therapistId: string }>> {
    try {
      // Use therapist assignment endpoint
      const response = await apiClient.post(`/therapists/assignments/${therapistId}/clients/${clientId}`, {
        notes: 'Assigned via client management interface'
      });
      
      return {
        success: true,
        message: response.data.message || 'Therapist berhasil ditugaskan ke klien',
        data: { clientId, therapistId }
      };
    } catch (error: any) {
      console.error('Failed to assign client to therapist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign client to therapist'
      };
    }
  },

  async unassignClient(clientId: string, reason: string = 'Unassigned via client management interface'): Promise<ApiResponse<{ clientId: string }>> {
    try {
      // Find the current assignment first
      const clientResponse = await this.getClient(clientId);
      if (!clientResponse.success || !clientResponse.data?.assignedTherapist) {
        return {
          success: false,
          message: 'Client tidak memiliki assignment aktif'
        };
      }

      // Get assignment ID from client assignments endpoint
      const assignmentsResponse = await apiClient.get(`/therapists/clients/${clientId}/assignments`);
      const activeAssignment = assignmentsResponse.data.data.find((assignment: any) => assignment.status === 'active');
      
      if (!activeAssignment) {
        return {
          success: false,
          message: 'Tidak ada assignment aktif yang ditemukan'
        };
      }

      // Cancel the assignment
      const response = await apiClient.patch(`/therapists/assignments/${activeAssignment.id}/cancel`, {
        reason
      });
      
      return {
        success: true,
        message: response.data.message || 'Client berhasil dilepaskan dari therapist',
        data: { clientId }
      };
    } catch (error: any) {
      console.error('Failed to unassign client:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unassign client'
      };
    }
  },

  async getTherapistCapacity(therapistId: string): Promise<ApiResponse<{ currentLoad: number }>> {
    try {
      // Get therapist info which includes current load
      const response = await apiClient.get(`/therapists/${therapistId}`);
      
      return {
        success: true,
        data: {
          currentLoad: response.data.data.currentLoad || 0
        }
      };
    } catch (error: any) {
      console.error('Failed to get therapist capacity:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get therapist capacity'
      };
    }
  },

  async getClientSessions(clientId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      const response = await apiClient.get(`/clients/${clientId}/sessions?${queryParams.toString()}`);
      
      // The response is wrapped by ResponseInterceptor: { success: true, data: { sessions, total, page, limit, totalPages }, message: "..." }
      const backendData = response.data.data;
      
      return {
        success: true,
        data: {
          items: backendData.sessions || [],
          total: backendData.total || 0,
          page: backendData.page || 1,
          pageSize: backendData.limit || pageSize,
          totalPages: backendData.totalPages || 0
        }
      };
    } catch (error: any) {
      console.error('Failed to get client sessions:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get client sessions',
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
};