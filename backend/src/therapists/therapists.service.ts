import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import {
  Therapist,
  TherapistStatus,
} from '../database/entities/therapist.entity';
import { TherapistSpecialization } from '../database/entities/therapist-specialization.entity';
import { User } from '../database/entities/user.entity';
import { Clinic } from '../database/entities/clinic.entity';
import { Client } from '../database/entities/client.entity';
import {
  ClientTherapistAssignment,
  AssignmentStatus,
} from '../database/entities/client-therapist-assignment.entity';
import { UserRole as UserRoleEntity } from '../database/entities/user-role.entity';
import { UserRole } from '../common/enums';
import {
  CreateTherapistDto,
  UpdateTherapistDto,
  UpdateTherapistStatusDto,
  UpdateTherapistCapacityDto,
  TherapistQueryDto,
} from './dto';

export interface TherapistResponse {
  id: string;
  clinic: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
  };
  fullName: string;
  phone: string;
  avatarUrl?: string;
  licenseNumber: string;
  licenseType: string;
  yearsOfExperience: number;
  status: string;
  employmentType: string;
  joinDate: Date;
  maxClients: number;
  currentLoad: number;
  timezone: string;
  sessionDuration: number;
  breakBetweenSessions: number;
  maxSessionsPerDay: number;
  workingDays: number[];
  adminNotes?: string;
  specializations: Array<{
    id: string;
    specialization: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TherapistsService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Create a new therapist
   */
  async createTherapist(
    clinicId: string,
    createTherapistDto: CreateTherapistDto,
    _createdByUserId: string,
  ): Promise<TherapistResponse> {
    // Validate clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Validate user exists and is not already a therapist
    const user = await this.em.findOne(User, { id: createTherapistDto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a therapist in any clinic
    const existingTherapist = await this.em.findOne(Therapist, {
      user: createTherapistDto.userId,
    });
    if (existingTherapist) {
      throw new ConflictException('User is already registered as a therapist');
    }

    // Check license number uniqueness within clinic
    const existingLicense = await this.em.findOne(Therapist, {
      clinic: clinicId,
      licenseNumber: createTherapistDto.licenseNumber,
    });
    if (existingLicense) {
      throw new ConflictException(
        'License number already exists in this clinic',
      );
    }

    // Create therapist
    const therapist = new Therapist();
    therapist.clinic = clinic;
    therapist.user = user;
    therapist.fullName = createTherapistDto.fullName;
    therapist.phone = createTherapistDto.phone;
    therapist.avatarUrl = createTherapistDto.avatarUrl;
    therapist.licenseNumber = createTherapistDto.licenseNumber;
    therapist.licenseType = createTherapistDto.licenseType;
    therapist.yearsOfExperience = createTherapistDto.yearsOfExperience;
    therapist.employmentType = createTherapistDto.employmentType;
    therapist.joinDate = new Date(createTherapistDto.joinDate);

    // Optional fields with defaults
    if (createTherapistDto.maxClients !== undefined) {
      therapist.maxClients = createTherapistDto.maxClients;
    }
    if (createTherapistDto.timezone) {
      therapist.timezone = createTherapistDto.timezone;
    }
    if (createTherapistDto.sessionDuration !== undefined) {
      therapist.sessionDuration = createTherapistDto.sessionDuration;
    }
    if (createTherapistDto.breakBetweenSessions !== undefined) {
      therapist.breakBetweenSessions = createTherapistDto.breakBetweenSessions;
    }
    if (createTherapistDto.maxSessionsPerDay !== undefined) {
      therapist.maxSessionsPerDay = createTherapistDto.maxSessionsPerDay;
    }
    if (createTherapistDto.workingDays) {
      therapist.workingDays = createTherapistDto.workingDays;
    }
    if (createTherapistDto.adminNotes) {
      therapist.adminNotes = createTherapistDto.adminNotes;
    }

    await this.em.persistAndFlush(therapist);

    // Create specializations if provided
    if (createTherapistDto.specializations?.length) {
      for (const spec of createTherapistDto.specializations) {
        const specialization = new TherapistSpecialization();
        specialization.therapist = therapist;
        specialization.specialization = spec;
        this.em.persist(specialization);
      }
      await this.em.flush();
    }

    // Create therapist role for user
    const therapistRole = new UserRoleEntity();
    therapistRole.userId = user.id;
    therapistRole.role = UserRole.THERAPIST;
    therapistRole.clinicId = clinicId;
    therapistRole.user = user;
    therapistRole.clinic = clinic;

    await this.em.persistAndFlush(therapistRole);

    return this.getTherapistById(therapist.id);
  }

  /**
   * Get therapist by ID with clinic access validation
   */
  async getTherapistById(
    therapistId: string,
    clinicId?: string,
  ): Promise<TherapistResponse> {
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions, {
      populate: ['clinic', 'user', 'specializations'],
    });

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return this.mapToResponse(therapist);
  }

  /**
   * Get paginated list of therapists with filtering
   */
  async getTherapists(
    clinicId: string,
    query: TherapistQueryDto,
  ): Promise<{
    therapists: TherapistResponse[];
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
        { licenseNumber: { $ilike: `%${query.search}%` } },
      ];
    }

    if (query.status) {
      whereConditions.status = query.status;
    }

    if (query.licenseType) {
      whereConditions.licenseType = query.licenseType;
    }

    if (query.employmentType) {
      whereConditions.employmentType = query.employmentType;
    }

    if (query.minExperience !== undefined) {
      whereConditions.yearsOfExperience = { $gte: query.minExperience };
    }

    // Note: hasAvailableCapacity filtering will be done post-query due to MikroORM limitations

    let therapists: Therapist[];
    let total: number;

    if (query.specialization) {
      // When filtering by specialization, we need a more complex query
      // Use raw query or join approach with MikroORM
      const specializationFilter = {
        specializations: {
          specialization: { $ilike: `%${query.specialization}%` },
        },
      };

      // Add specialization filter to where conditions
      Object.assign(whereConditions, specializationFilter);

      [therapists, total] = await this.em.findAndCount(
        Therapist,
        whereConditions,
        {
          populate: ['clinic', 'user', 'specializations'],
          orderBy: { [sortBy]: sortDirection },
          limit,
          offset,
        },
      );
    } else {
      // Standard query without specialization filtering
      [therapists, total] = await this.em.findAndCount(
        Therapist,
        whereConditions,
        {
          populate: ['clinic', 'user', 'specializations'],
          orderBy: { [sortBy]: sortDirection },
          limit,
          offset,
        },
      );
    }

    // Apply hasAvailableCapacity filter if specified
    let filteredTherapists = therapists;
    if (query.hasAvailableCapacity) {
      filteredTherapists = therapists.filter(
        (t) => t.currentLoad < t.maxClients,
      );
      total = filteredTherapists.length; // Update total count
    }

    const therapistResponses = filteredTherapists.map((therapist) =>
      this.mapToResponse(therapist),
    );

    return {
      therapists: therapistResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update therapist profile
   */
  async updateTherapist(
    therapistId: string,
    updateTherapistDto: UpdateTherapistDto,
    clinicId?: string,
  ): Promise<TherapistResponse> {
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions, {
      populate: ['specializations'],
    });

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    // Check license number uniqueness if being updated
    if (updateTherapistDto.licenseNumber) {
      const existingLicense = await this.em.findOne(Therapist, {
        clinic: therapist.clinic,
        licenseNumber: updateTherapistDto.licenseNumber,
        id: { $ne: therapistId },
      });
      if (existingLicense) {
        throw new ConflictException(
          'License number already exists in this clinic',
        );
      }
    }

    // Update fields
    if (updateTherapistDto.fullName !== undefined) {
      therapist.fullName = updateTherapistDto.fullName;
    }
    if (updateTherapistDto.phone !== undefined) {
      therapist.phone = updateTherapistDto.phone;
    }
    if (updateTherapistDto.avatarUrl !== undefined) {
      therapist.avatarUrl = updateTherapistDto.avatarUrl;
    }
    if (updateTherapistDto.licenseNumber !== undefined) {
      therapist.licenseNumber = updateTherapistDto.licenseNumber;
    }
    if (updateTherapistDto.licenseType !== undefined) {
      therapist.licenseType = updateTherapistDto.licenseType;
    }
    if (updateTherapistDto.yearsOfExperience !== undefined) {
      therapist.yearsOfExperience = updateTherapistDto.yearsOfExperience;
    }
    if (updateTherapistDto.status !== undefined) {
      therapist.status = updateTherapistDto.status;
    }
    if (updateTherapistDto.employmentType !== undefined) {
      therapist.employmentType = updateTherapistDto.employmentType;
    }
    if (updateTherapistDto.joinDate !== undefined) {
      therapist.joinDate = new Date(updateTherapistDto.joinDate);
    }
    if (updateTherapistDto.maxClients !== undefined) {
      therapist.maxClients = updateTherapistDto.maxClients;
    }
    if (updateTherapistDto.currentLoad !== undefined) {
      therapist.currentLoad = updateTherapistDto.currentLoad;
    }
    if (updateTherapistDto.timezone !== undefined) {
      therapist.timezone = updateTherapistDto.timezone;
    }
    if (updateTherapistDto.sessionDuration !== undefined) {
      therapist.sessionDuration = updateTherapistDto.sessionDuration;
    }
    if (updateTherapistDto.breakBetweenSessions !== undefined) {
      therapist.breakBetweenSessions = updateTherapistDto.breakBetweenSessions;
    }
    if (updateTherapistDto.maxSessionsPerDay !== undefined) {
      therapist.maxSessionsPerDay = updateTherapistDto.maxSessionsPerDay;
    }
    if (updateTherapistDto.workingDays !== undefined) {
      therapist.workingDays = updateTherapistDto.workingDays;
    }
    if (updateTherapistDto.adminNotes !== undefined) {
      therapist.adminNotes = updateTherapistDto.adminNotes;
    }

    // Update specializations if provided
    if (updateTherapistDto.specializations !== undefined) {
      // Remove existing specializations
      await this.em.nativeDelete(TherapistSpecialization, {
        therapist: therapistId,
      });

      // Add new specializations
      for (const spec of updateTherapistDto.specializations) {
        const specialization = new TherapistSpecialization();
        specialization.therapist = therapist;
        specialization.specialization = spec;
        this.em.persist(specialization);
      }
    }

    therapist.updatedAt = new Date();
    await this.em.persistAndFlush(therapist);

    return this.getTherapistById(therapistId, clinicId);
  }

  /**
   * Update therapist status
   */
  async updateTherapistStatus(
    therapistId: string,
    updateStatusDto: UpdateTherapistStatusDto,
    clinicId?: string,
  ): Promise<TherapistResponse> {
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions);

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    const oldStatus = therapist.status;
    therapist.status = updateStatusDto.status;

    // Add status change to admin notes if reason provided
    if (updateStatusDto.reason) {
      const timestamp = new Date().toISOString();
      const statusChangeNote = `\n[${timestamp}] Status changed from ${oldStatus} to ${updateStatusDto.status}: ${updateStatusDto.reason}`;
      therapist.adminNotes = (therapist.adminNotes || '') + statusChangeNote;
    }

    therapist.updatedAt = new Date();
    await this.em.persistAndFlush(therapist);

    return this.getTherapistById(therapistId, clinicId);
  }

  /**
   * Update therapist capacity
   */
  async updateTherapistCapacity(
    therapistId: string,
    updateCapacityDto: UpdateTherapistCapacityDto,
    clinicId?: string,
  ): Promise<TherapistResponse> {
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions);

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    if (updateCapacityDto.maxClients !== undefined) {
      // Validate that new capacity is not less than current load
      if (updateCapacityDto.maxClients < therapist.currentLoad) {
        throw new BadRequestException(
          `Cannot set max clients (${updateCapacityDto.maxClients}) below current load (${therapist.currentLoad})`,
        );
      }

      const oldMaxClients = therapist.maxClients;
      therapist.maxClients = updateCapacityDto.maxClients;

      // Add capacity change to admin notes
      if (updateCapacityDto.notes) {
        const timestamp = new Date().toISOString();
        const capacityChangeNote = `\n[${timestamp}] Max clients changed from ${oldMaxClients} to ${updateCapacityDto.maxClients}: ${updateCapacityDto.notes}`;
        therapist.adminNotes =
          (therapist.adminNotes || '') + capacityChangeNote;
      }
    }

    therapist.updatedAt = new Date();
    await this.em.persistAndFlush(therapist);

    return this.getTherapistById(therapistId, clinicId);
  }

  /**
   * Delete therapist (soft delete by setting status to inactive)
   */
  async deleteTherapist(
    therapistId: string,
    clinicId?: string,
  ): Promise<{ message: string }> {
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions);

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    // Check if therapist has active assignments
    if (therapist.currentLoad > 0) {
      throw new BadRequestException(
        'Cannot delete therapist with active client assignments',
      );
    }

    // Soft delete by setting status to inactive
    therapist.status = TherapistStatus.INACTIVE;
    therapist.updatedAt = new Date();

    // Add deletion note
    const timestamp = new Date().toISOString();
    const deletionNote = `\n[${timestamp}] Therapist profile deactivated (soft delete)`;
    therapist.adminNotes = (therapist.adminNotes || '') + deletionNote;

    await this.em.persistAndFlush(therapist);

    return { message: 'Therapist successfully deactivated' };
  }

  /**
   * Check if therapist has available capacity
   */
  async hasAvailableCapacity(therapistId: string): Promise<boolean> {
    const therapist = await this.em.findOne(Therapist, { id: therapistId });
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return therapist.currentLoad < therapist.maxClients;
  }

  /**
   * Update therapist current load (used when assigning/unassigning clients)
   */
  async updateCurrentLoad(
    therapistId: string,
    increment: number,
  ): Promise<void> {
    const therapist = await this.em.findOne(Therapist, { id: therapistId });
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    const newLoad = therapist.currentLoad + increment;
    if (newLoad < 0) {
      throw new BadRequestException('Current load cannot be negative');
    }
    if (newLoad > therapist.maxClients) {
      throw new BadRequestException('Cannot exceed maximum client capacity');
    }

    therapist.currentLoad = newLoad;
    therapist.updatedAt = new Date();
    await this.em.persistAndFlush(therapist);
  }

  /**
   * Assign client to therapist
   */
  async assignClientToTherapist(
    therapistId: string,
    clientId: string,
    assignedByUserId: string,
    notes?: string,
  ): Promise<ClientTherapistAssignment> {
    // Validate therapist exists and has capacity
    const therapist = await this.em.findOne(Therapist, { id: therapistId });
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    if (therapist.status !== TherapistStatus.ACTIVE) {
      throw new BadRequestException('Therapist is not active');
    }

    if (therapist.currentLoad >= therapist.maxClients) {
      throw new BadRequestException(
        'Therapist has reached maximum client capacity',
      );
    }

    // Validate client exists
    const client = await this.em.findOne(Client, { id: clientId });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Check if client is already assigned to an active therapist
    const existingAssignment = await this.em.findOne(
      ClientTherapistAssignment,
      {
        client: clientId,
        status: AssignmentStatus.ACTIVE,
      },
    );

    if (existingAssignment) {
      throw new ConflictException(
        'Client is already assigned to an active therapist',
      );
    }

    // Validate assigned by user exists
    const assignedByUser = await this.em.findOne(User, {
      id: assignedByUserId,
    });
    if (!assignedByUser) {
      throw new NotFoundException('Assigning user not found');
    }

    // Create assignment
    const assignment = new ClientTherapistAssignment();
    assignment.client = client;
    assignment.therapist = therapist;
    assignment.assignedBy = assignedByUser;
    assignment.notes = notes;
    assignment.status = AssignmentStatus.ACTIVE;

    await this.em.persistAndFlush(assignment);

    // Update therapist's current load
    await this.updateCurrentLoad(therapistId, 1);

    return assignment;
  }

  /**
   * Transfer client to another therapist
   */
  async transferClient(
    currentAssignmentId: string,
    newTherapistId: string,
    transferredByUserId: string,
    transferReason: string,
    notes?: string,
  ): Promise<ClientTherapistAssignment> {
    // Get current assignment
    const currentAssignment = await this.em.findOne(
      ClientTherapistAssignment,
      { id: currentAssignmentId },
      { populate: ['client', 'therapist'] },
    );

    if (!currentAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (currentAssignment.status !== AssignmentStatus.ACTIVE) {
      throw new BadRequestException('Assignment is not active');
    }

    // Validate new therapist
    const newTherapist = await this.em.findOne(Therapist, {
      id: newTherapistId,
    });
    if (!newTherapist) {
      throw new NotFoundException('New therapist not found');
    }

    if (newTherapist.status !== TherapistStatus.ACTIVE) {
      throw new BadRequestException('New therapist is not active');
    }

    if (newTherapist.currentLoad >= newTherapist.maxClients) {
      throw new BadRequestException(
        'New therapist has reached maximum client capacity',
      );
    }

    // Validate transferred by user
    const transferredByUser = await this.em.findOne(User, {
      id: transferredByUserId,
    });
    if (!transferredByUser) {
      throw new NotFoundException('Transferring user not found');
    }

    // End current assignment
    currentAssignment.status = AssignmentStatus.TRANSFERRED;
    currentAssignment.endDate = new Date();
    currentAssignment.transferReason = transferReason;

    // Create new assignment
    const newAssignment = new ClientTherapistAssignment();
    newAssignment.client = currentAssignment.client;
    newAssignment.therapist = newTherapist;
    newAssignment.assignedBy = transferredByUser;
    newAssignment.notes =
      notes ||
      `Transferred from therapist ${currentAssignment.therapist.fullName}: ${transferReason}`;
    newAssignment.status = AssignmentStatus.ACTIVE;

    await this.em.persistAndFlush([currentAssignment, newAssignment]);

    // Update current loads
    await this.updateCurrentLoad(currentAssignment.therapist.id, -1);
    await this.updateCurrentLoad(newTherapistId, 1);

    return newAssignment;
  }

  /**
   * Complete client assignment (therapy completed)
   */
  async completeClientAssignment(
    assignmentId: string,
    completedByUserId: string,
    completionNotes?: string,
  ): Promise<ClientTherapistAssignment> {
    const assignment = await this.em.findOne(
      ClientTherapistAssignment,
      { id: assignmentId },
      { populate: ['therapist'] },
    );

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.ACTIVE) {
      throw new BadRequestException('Assignment is not active');
    }

    // Validate completed by user
    const completedByUser = await this.em.findOne(User, {
      id: completedByUserId,
    });
    if (!completedByUser) {
      throw new NotFoundException('Completing user not found');
    }

    // Update assignment
    assignment.status = AssignmentStatus.COMPLETED;
    assignment.endDate = new Date();
    if (completionNotes) {
      assignment.notes =
        (assignment.notes || '') + `\n[Completion] ${completionNotes}`;
    }

    await this.em.persistAndFlush(assignment);

    // Update therapist's current load
    await this.updateCurrentLoad(assignment.therapist.id, -1);

    return assignment;
  }

  /**
   * Cancel client assignment
   */
  async cancelClientAssignment(
    assignmentId: string,
    cancelledByUserId: string,
    cancellationReason: string,
  ): Promise<ClientTherapistAssignment> {
    const assignment = await this.em.findOne(
      ClientTherapistAssignment,
      { id: assignmentId },
      { populate: ['therapist'] },
    );

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.ACTIVE) {
      throw new BadRequestException('Assignment is not active');
    }

    // Validate cancelled by user
    const cancelledByUser = await this.em.findOne(User, {
      id: cancelledByUserId,
    });
    if (!cancelledByUser) {
      throw new NotFoundException('Cancelling user not found');
    }

    // Update assignment
    assignment.status = AssignmentStatus.CANCELLED;
    assignment.endDate = new Date();
    assignment.transferReason = cancellationReason;

    await this.em.persistAndFlush(assignment);

    // Update therapist's current load
    await this.updateCurrentLoad(assignment.therapist.id, -1);

    return assignment;
  }

  /**
   * Get therapist's client assignments
   */
  async getTherapistAssignments(
    therapistId: string,
    status?: AssignmentStatus,
    clinicId?: string,
  ): Promise<ClientTherapistAssignment[]> {
    const whereConditions: any = { therapist: therapistId };

    if (status) {
      whereConditions.status = status;
    }

    // Validate therapist exists and clinic access if provided
    if (clinicId) {
      const therapist = await this.em.findOne(Therapist, {
        id: therapistId,
        clinic: clinicId,
      });
      if (!therapist) {
        throw new NotFoundException('Therapist not found in specified clinic');
      }
    }

    return this.em.find(ClientTherapistAssignment, whereConditions, {
      populate: ['client', 'therapist', 'assignedBy'],
      orderBy: { assignedDate: 'DESC' },
    });
  }

  /**
   * Get client's assignment history
   */
  async getClientAssignmentHistory(
    clientId: string,
    clinicId?: string,
  ): Promise<ClientTherapistAssignment[]> {
    const whereConditions: any = { client: clientId };

    // If clinic is specified, ensure client belongs to the clinic
    if (clinicId) {
      const client = await this.em.findOne(Client, {
        id: clientId,
        clinic: clinicId,
      });
      if (!client) {
        throw new NotFoundException('Client not found in specified clinic');
      }
    }

    return this.em.find(ClientTherapistAssignment, whereConditions, {
      populate: ['client', 'therapist', 'assignedBy'],
      orderBy: { assignedDate: 'DESC' },
    });
  }

  /**
   * Get available therapists for client assignment
   */
  async getAvailableTherapistsForAssignment(
    clientId: string,
    clinicId: string,
  ): Promise<Therapist[]> {
    // Validate client exists in clinic
    const client = await this.em.findOne(Client, {
      id: clientId,
      clinic: clinicId,
    });
    if (!client) {
      throw new NotFoundException('Client not found in specified clinic');
    }

    // Get active therapists with available capacity
    const therapists = await this.em.find(
      Therapist,
      {
        clinic: clinicId,
        status: TherapistStatus.ACTIVE,
      },
      {
        populate: ['specializations'],
        orderBy: { currentLoad: 'ASC', yearsOfExperience: 'DESC' },
      },
    );

    // Filter therapists with available capacity
    return therapists.filter((t) => t.currentLoad < t.maxClients);
  }

  /**
   * Map Therapist entity to response format
   */
  private mapToResponse(therapist: Therapist): TherapistResponse {
    return {
      id: therapist.id,
      clinic: {
        id: therapist.clinic.id,
        name: therapist.clinic.name,
      },
      user: {
        id: therapist.user.id,
        email: therapist.user.email,
      },
      fullName: therapist.fullName,
      phone: therapist.phone,
      avatarUrl: therapist.avatarUrl,
      licenseNumber: therapist.licenseNumber,
      licenseType: therapist.licenseType,
      yearsOfExperience: therapist.yearsOfExperience,
      status: therapist.status,
      employmentType: therapist.employmentType,
      joinDate: therapist.joinDate,
      maxClients: therapist.maxClients,
      currentLoad: therapist.currentLoad,
      timezone: therapist.timezone,
      sessionDuration: therapist.sessionDuration,
      breakBetweenSessions: therapist.breakBetweenSessions,
      maxSessionsPerDay: therapist.maxSessionsPerDay,
      workingDays: therapist.workingDays,
      adminNotes: therapist.adminNotes,
      specializations: therapist.specializations.toArray().map((spec) => ({
        id: spec.id,
        specialization: spec.specialization,
      })),
      createdAt: therapist.createdAt,
      updatedAt: therapist.updatedAt,
    };
  }
}
