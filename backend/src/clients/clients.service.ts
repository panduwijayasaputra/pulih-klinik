import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import {
  Client,
  ClientStatus,
  MaritalStatus,
} from '../database/entities/client.entity';
import {
  ClientTherapistAssignment,
  AssignmentStatus,
} from '../database/entities/client-therapist-assignment.entity';
import { Clinic } from '../database/entities/clinic.entity';
import { User } from '../database/entities/user.entity';
import {
  CreateClientDto,
  UpdateClientDto,
  UpdateClientStatusDto,
  UpdateClientProgressDto,
  ClientQueryDto,
} from './dto';

export interface ClientResponse {
  id: string;
  clinic: {
    id: string;
    name: string;
  };
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: Date;
  age: number;
  religion: string;
  occupation: string;
  education: string;
  educationMajor?: string;
  address: string;
  phone: string;
  email?: string;
  hobbies?: string;
  maritalStatus: string;
  spouseName?: string;
  relationshipWithSpouse?: string;
  firstVisit: boolean;
  previousVisitDetails?: string;
  province?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  emergencyContactAddress?: string;
  isMinor: boolean;
  school?: string;
  grade?: string;
  guardianFullName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianAddress?: string;
  guardianOccupation?: string;
  guardianMaritalStatus?: string;
  guardianLegalCustody?: boolean;
  guardianCustodyDocsAttached?: boolean;
  status: string;
  joinDate: Date;
  totalSessions: number;
  lastSessionDate?: Date;
  progress: number;
  notes?: string;
  primaryIssue?: string;
  currentAssignment?: {
    id: string;
    therapist: {
      id: string;
      fullName: string;
    };
    assignedDate: Date;
    status: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ClientsService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Create a new client
   */
  async createClient(
    clinicId: string,
    createClientDto: CreateClientDto,
    _createdByUserId: string,
  ): Promise<ClientResponse> {
    // Validate clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Check if client with same name and phone already exists in clinic
    const existingClient = await this.em.findOne(Client, {
      clinic: clinicId,
      fullName: createClientDto.fullName,
      phone: createClientDto.phone,
    });

    if (existingClient) {
      throw new ConflictException(
        'A client with the same name and phone number already exists in this clinic',
      );
    }

    // Calculate age from birth date
    const birthDate = new Date(createClientDto.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Auto-detect minor status if not provided
    const isMinor = createClientDto.isMinor ?? age < 18;

    // Validate minor-specific fields
    if (isMinor && !createClientDto.guardianFullName) {
      throw new BadRequestException(
        'Guardian information is required for minors',
      );
    }

    // Validate marital status dependencies
    if (createClientDto.maritalStatus === MaritalStatus.MARRIED) {
      if (
        !createClientDto.spouseName ||
        !createClientDto.relationshipWithSpouse
      ) {
        throw new BadRequestException(
          'Spouse name and relationship quality are required for married clients',
        );
      }
    }

    // Validate first visit dependencies
    if (
      createClientDto.firstVisit === false &&
      !createClientDto.previousVisitDetails
    ) {
      throw new BadRequestException(
        'Previous visit details are required for returning clients',
      );
    }

    // Create client
    const client = new Client();
    client.clinic = clinic;
    client.fullName = createClientDto.fullName;
    client.gender = createClientDto.gender;
    client.birthPlace = createClientDto.birthPlace;
    client.birthDate = birthDate;
    client.religion = createClientDto.religion;
    client.occupation = createClientDto.occupation;
    client.education = createClientDto.education;
    client.educationMajor = createClientDto.educationMajor;
    client.address = createClientDto.address;
    client.phone = createClientDto.phone;
    client.email = createClientDto.email;
    client.hobbies = createClientDto.hobbies;
    client.maritalStatus = createClientDto.maritalStatus;
    client.spouseName = createClientDto.spouseName;
    client.relationshipWithSpouse = createClientDto.relationshipWithSpouse;
    client.firstVisit = createClientDto.firstVisit ?? true;
    client.previousVisitDetails = createClientDto.previousVisitDetails;
    client.province = createClientDto.province;
    client.emergencyContactName = createClientDto.emergencyContactName;
    client.emergencyContactPhone = createClientDto.emergencyContactPhone;
    client.emergencyContactRelationship =
      createClientDto.emergencyContactRelationship;
    client.emergencyContactAddress = createClientDto.emergencyContactAddress;
    client.isMinor = isMinor;
    client.school = createClientDto.school;
    client.grade = createClientDto.grade;
    client.guardianFullName = createClientDto.guardianFullName;
    client.guardianRelationship = createClientDto.guardianRelationship;
    client.guardianPhone = createClientDto.guardianPhone;
    client.guardianAddress = createClientDto.guardianAddress;
    client.guardianOccupation = createClientDto.guardianOccupation;
    client.guardianMaritalStatus = createClientDto.guardianMaritalStatus;
    client.guardianLegalCustody = createClientDto.guardianLegalCustody;
    client.guardianCustodyDocsAttached =
      createClientDto.guardianCustodyDocsAttached;
    client.totalSessions = createClientDto.totalSessions ?? 0;
    client.progress = createClientDto.progress ?? 0;
    client.notes = createClientDto.notes;
    client.primaryIssue = createClientDto.primaryIssue;

    // Set legacy fields for backward compatibility
    client.name = createClientDto.fullName;
    client.age = age;

    await this.em.persistAndFlush(client);

    return this.getClientById(client.id, clinicId);
  }

  /**
   * Get client by ID with clinic access validation
   */
  async getClientById(
    clientId: string,
    clinicId?: string,
  ): Promise<ClientResponse> {
    const whereConditions: any = { id: clientId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const client = await this.em.findOne(Client, whereConditions, {
      populate: ['clinic'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.mapToResponse(client);
  }

  /**
   * Get paginated list of clients with filtering
   */
  async getClients(
    clinicId: string,
    query: ClientQueryDto,
  ): Promise<{
    clients: ClientResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'fullName',
      sortDirection = 'ASC',
    } = query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = { clinic: clinicId };

    if (query.search) {
      whereConditions.$or = [
        { fullName: { $ilike: `%${query.search}%` } },
        { phone: { $ilike: `%${query.search}%` } },
        { email: { $ilike: `%${query.search}%` } },
      ];
    }

    if (query.status) {
      whereConditions.status = query.status;
    }

    if (query.gender) {
      whereConditions.gender = query.gender;
    }

    if (query.religion) {
      whereConditions.religion = query.religion;
    }

    if (query.education) {
      whereConditions.education = query.education;
    }

    if (query.maritalStatus) {
      whereConditions.maritalStatus = query.maritalStatus;
    }

    if (query.province) {
      whereConditions.province = { $ilike: `%${query.province}%` };
    }

    if (query.isMinor !== undefined) {
      whereConditions.isMinor = query.isMinor;
    }

    if (query.firstVisit !== undefined) {
      whereConditions.firstVisit = query.firstVisit;
    }

    if (query.minProgress !== undefined) {
      whereConditions.progress = { $gte: query.minProgress };
    }

    if (query.maxProgress !== undefined) {
      whereConditions.progress = {
        ...whereConditions.progress,
        $lte: query.maxProgress,
      };
    }

    if (query.minSessions !== undefined) {
      whereConditions.totalSessions = { $gte: query.minSessions };
    }

    if (query.joinDateFrom) {
      whereConditions.joinDate = { $gte: new Date(query.joinDateFrom) };
    }

    if (query.joinDateTo) {
      whereConditions.joinDate = {
        ...whereConditions.joinDate,
        $lte: new Date(query.joinDateTo),
      };
    }

    if (query.lastSessionDateFrom) {
      whereConditions.lastSessionDate = {
        $gte: new Date(query.lastSessionDateFrom),
      };
    }

    if (query.lastSessionDateTo) {
      whereConditions.lastSessionDate = {
        ...whereConditions.lastSessionDate,
        $lte: new Date(query.lastSessionDateTo),
      };
    }

    if (query.hasEmergencyContact !== undefined) {
      if (query.hasEmergencyContact) {
        whereConditions.emergencyContactName = { $ne: null };
      } else {
        whereConditions.emergencyContactName = null;
      }
    }

    // Handle age filtering
    if (query.minAge !== undefined || query.maxAge !== undefined) {
      const today = new Date();
      const currentYear = today.getFullYear();

      if (query.maxAge !== undefined) {
        const minBirthYear = currentYear - query.maxAge - 1;
        whereConditions.birthDate = { $gte: new Date(`${minBirthYear}-01-01`) };
      }

      if (query.minAge !== undefined) {
        const maxBirthYear = currentYear - query.minAge;
        whereConditions.birthDate = {
          ...whereConditions.birthDate,
          $lte: new Date(`${maxBirthYear}-12-31`),
        };
      }
    }

    const [clients, total] = await this.em.findAndCount(
      Client,
      whereConditions,
      {
        populate: ['clinic'],
        orderBy: { [sortBy]: sortDirection },
        limit,
        offset,
      },
    );

    // Post-process for therapist assignment filtering
    let filteredClients = clients;
    if (query.therapistId) {
      const clientsWithTherapist = await this.em.find(
        ClientTherapistAssignment,
        {
          therapist: query.therapistId,
          status: AssignmentStatus.ACTIVE,
        },
        {
          populate: ['client'],
        },
      );

      const clientIds = clientsWithTherapist.map(
        (assignment) => assignment.client.id,
      );
      filteredClients = clients.filter((client) =>
        clientIds.includes(client.id),
      );
    }

    const clientResponses = await Promise.all(
      filteredClients.map((client) => this.mapToResponse(client)),
    );

    return {
      clients: clientResponses,
      total: query.therapistId ? filteredClients.length : total,
      page,
      limit,
      totalPages: Math.ceil(
        (query.therapistId ? filteredClients.length : total) / limit,
      ),
    };
  }

  /**
   * Update client profile
   */
  async updateClient(
    clientId: string,
    updateClientDto: UpdateClientDto,
    clinicId?: string,
  ): Promise<ClientResponse> {
    const whereConditions: any = { id: clientId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const client = await this.em.findOne(Client, whereConditions);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Check for duplicate name and phone if being updated
    if (updateClientDto.fullName || updateClientDto.phone) {
      const newName = updateClientDto.fullName || client.fullName;
      const newPhone = updateClientDto.phone || client.phone;

      const existingClient = await this.em.findOne(Client, {
        clinic: client.clinic,
        fullName: newName,
        phone: newPhone,
        id: { $ne: clientId },
      });

      if (existingClient) {
        throw new ConflictException(
          'A client with the same name and phone number already exists in this clinic',
        );
      }
    }

    // Update fields
    Object.keys(updateClientDto).forEach((key) => {
      if (updateClientDto[key] !== undefined) {
        if (key === 'birthDate') {
          client[key] = new Date(updateClientDto[key]);
        } else if (key === 'lastSessionDate' && updateClientDto[key]) {
          client[key] = new Date(updateClientDto[key]);
        } else {
          client[key] = updateClientDto[key];
        }
      }
    });

    // Update legacy age field if birth date changed
    if (updateClientDto.birthDate) {
      const birthDate = new Date(updateClientDto.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      client.age = age;
    }

    // Update legacy name field
    if (updateClientDto.fullName) {
      client.name = updateClientDto.fullName;
    }

    client.updatedAt = new Date();
    await this.em.persistAndFlush(client);

    return this.getClientById(clientId, clinicId);
  }

  /**
   * Update client status with transition tracking
   */
  async updateClientStatus(
    clientId: string,
    updateStatusDto: UpdateClientStatusDto,
    updatedByUserId: string,
    clinicId?: string,
  ): Promise<ClientResponse> {
    const whereConditions: any = { id: clientId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const client = await this.em.findOne(Client, whereConditions);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const updatedByUser = await this.em.findOne(User, { id: updatedByUserId });
    if (!updatedByUser) {
      throw new NotFoundException('Updating user not found');
    }

    // Simply update the status without transition tracking
    const oldStatus = client.status;

    // Update client status
    client.status = updateStatusDto.status;
    client.updatedAt = new Date();

    await this.em.persistAndFlush(client);

    return this.getClientById(clientId, clinicId);
  }

  /**
   * Update client progress
   */
  async updateClientProgress(
    clientId: string,
    updateProgressDto: UpdateClientProgressDto,
    clinicId?: string,
  ): Promise<ClientResponse> {
    const whereConditions: any = { id: clientId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const client = await this.em.findOne(Client, whereConditions);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.progress = updateProgressDto.progress;

    if (updateProgressDto.notes) {
      const timestamp = new Date().toISOString();
      const progressNote = `\n[${timestamp}] Progress updated to ${updateProgressDto.progress}%: ${updateProgressDto.notes}`;
      client.notes = (client.notes || '') + progressNote;
    }

    if (updateProgressDto.totalSessions !== undefined) {
      client.totalSessions = updateProgressDto.totalSessions;
    }

    if (updateProgressDto.lastSessionDate) {
      client.lastSessionDate = new Date(updateProgressDto.lastSessionDate);
    }

    client.updatedAt = new Date();
    await this.em.persistAndFlush(client);

    return this.getClientById(clientId, clinicId);
  }

  /**
   * Delete client (soft delete by setting status to done)
   */
  async deleteClient(
    clientId: string,
    clinicId?: string,
  ): Promise<{ message: string }> {
    const whereConditions: any = { id: clientId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const client = await this.em.findOne(Client, whereConditions);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Check if client has active assignments
    const activeAssignment = await this.em.findOne(ClientTherapistAssignment, {
      client: clientId,
      status: AssignmentStatus.ACTIVE,
    });

    if (activeAssignment) {
      throw new BadRequestException(
        'Cannot delete client with active therapist assignment. Please complete or cancel the assignment first.',
      );
    }

    // Soft delete by marking as done
    client.status = ClientStatus.DONE;
    client.updatedAt = new Date();

    // Add deletion note
    const timestamp = new Date().toISOString();
    const deletionNote = `\n[${timestamp}] Client record archived (soft delete)`;
    client.notes = (client.notes || '') + deletionNote;

    await this.em.persistAndFlush(client);

    return { message: 'Client successfully archived' };
  }


  /**
   * Map Client entity to response format with current assignment
   */
  private async mapToResponse(client: Client): Promise<ClientResponse> {
    // Calculate age
    const birthDate = new Date(client.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Get current assignment
    const currentAssignment = await this.em.findOne(
      ClientTherapistAssignment,
      {
        client: client.id,
        status: AssignmentStatus.ACTIVE,
      },
      {
        populate: ['therapist'],
      },
    );

    return {
      id: client.id,
      clinic: {
        id: client.clinic.id,
        name: client.clinic.name,
      },
      fullName: client.fullName,
      gender: client.gender,
      birthPlace: client.birthPlace,
      birthDate: client.birthDate,
      age,
      religion: client.religion,
      occupation: client.occupation,
      education: client.education,
      educationMajor: client.educationMajor,
      address: client.address,
      phone: client.phone,
      email: client.email,
      hobbies: client.hobbies,
      maritalStatus: client.maritalStatus,
      spouseName: client.spouseName,
      relationshipWithSpouse: client.relationshipWithSpouse,
      firstVisit: client.firstVisit,
      previousVisitDetails: client.previousVisitDetails,
      province: client.province,
      emergencyContactName: client.emergencyContactName,
      emergencyContactPhone: client.emergencyContactPhone,
      emergencyContactRelationship: client.emergencyContactRelationship,
      emergencyContactAddress: client.emergencyContactAddress,
      isMinor: client.isMinor,
      school: client.school,
      grade: client.grade,
      guardianFullName: client.guardianFullName,
      guardianRelationship: client.guardianRelationship,
      guardianPhone: client.guardianPhone,
      guardianAddress: client.guardianAddress,
      guardianOccupation: client.guardianOccupation,
      guardianMaritalStatus: client.guardianMaritalStatus,
      guardianLegalCustody: client.guardianLegalCustody,
      guardianCustodyDocsAttached: client.guardianCustodyDocsAttached,
      status: client.status,
      joinDate: client.joinDate,
      totalSessions: client.totalSessions,
      lastSessionDate: client.lastSessionDate,
      progress: client.progress,
      notes: client.notes,
      primaryIssue: client.primaryIssue,
      currentAssignment: currentAssignment
        ? {
            id: currentAssignment.id,
            therapist: {
              id: currentAssignment.therapist.id,
              fullName: currentAssignment.therapist.fullName,
            },
            assignedDate: currentAssignment.assignedDate,
            status: currentAssignment.status,
          }
        : undefined,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
