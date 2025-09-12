import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Therapist } from '../database/entities/therapist.entity';
import { User } from '../database/entities/user.entity';
import { UserProfile } from '../database/entities/user-profile.entity';
import { Clinic } from '../database/entities/clinic.entity';
import { Client } from '../database/entities/client.entity';
import {
  ClientTherapistAssignment,
  AssignmentStatus,
} from '../database/entities/client-therapist-assignment.entity';
import { UserRole as UserRoleEntity } from '../database/entities/user-role.entity';
import { UserRole, UserStatus } from '../common/enums';
import {
  CreateTherapistDto,
  UpdateTherapistDto,
  UpdateTherapistStatusDto,
  UpdateTherapistCapacityDto,
  TherapistQueryDto,
} from './dto';
import { EmailService } from '../lib/email/email.service';

export interface TherapistResponse {
  id: string;
  clinicId: string;
  clinicName: string;
  userId: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  licenseNumber: string;
  licenseType: string;
  status: UserStatus;
  joinDate: Date;
  currentLoad: number;
  timezone: string;
  education?: string;
  certifications?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TherapistsService {
  private readonly logger = new Logger(TherapistsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Check if email is available for therapist creation
   */
  async checkEmailAvailability(email: string): Promise<User | null> {
    return await this.em.findOne(User, { email });
  }

  /**
   * Send email verification to therapist
   */
  async sendEmailVerification(
    therapistId: string,
    clinicId?: string,
  ): Promise<{ message: string }> {
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions, {
      populate: ['user', 'user.profile', 'clinic'],
    });

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    if (therapist.user.emailVerified) {
      throw new BadRequestException('Therapist email is already verified');
    }

    // Check if user has reached max resend attempts
    const MAX_RESEND_ATTEMPTS = 3;
    if (therapist.user.emailResendAttempts >= MAX_RESEND_ATTEMPTS) {
      throw new BadRequestException(
        'Maximum email resend attempts reached. Please contact system administrator.',
      );
    }

    // Check if user is in cooldown period
    if (
      therapist.user.emailResendCooldownUntil &&
      therapist.user.emailResendCooldownUntil > new Date()
    ) {
      const remainingMs =
        therapist.user.emailResendCooldownUntil.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
      throw new BadRequestException(
        `Please wait ${remainingMinutes} minute(s) before sending another email.`,
      );
    }

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with verification code and increment resend attempts
    therapist.user.emailVerificationCode = verificationCode;
    therapist.user.emailVerificationExpires = verificationExpires;
    therapist.user.emailResendAttempts += 1;

    // Set cooldown based on attempt number
    const RESEND_COOLDOWNS = {
      1: 1 * 60 * 1000, // 1 minute for first retry
      2: 5 * 60 * 1000, // 5 minutes for second retry
      3: 0, // No cooldown for third retry (max reached)
    };

    const cooldownMs =
      RESEND_COOLDOWNS[
        therapist.user.emailResendAttempts as keyof typeof RESEND_COOLDOWNS
      ] || 0;
    if (cooldownMs > 0) {
      therapist.user.emailResendCooldownUntil = new Date(
        Date.now() + cooldownMs,
      );
    }

    await this.em.persistAndFlush(therapist.user);

    // For therapists, send setup email instead of verification code
    if (therapist.user.status === UserStatus.PENDING) {
      console.log('Generating setup token for therapist:', therapist.id);
      // Generate new setup token and link
      const setupToken = crypto.randomBytes(32).toString('hex');
      const setupExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      console.log('Generated token:', setupToken.substring(0, 10) + '...');
      console.log('Token expires at:', setupExpires.toISOString());

      // Update user with new setup token
      therapist.user.passwordResetToken = setupToken;
      therapist.user.passwordResetExpires = setupExpires;
      await this.em.persistAndFlush(therapist.user);

      console.log('Token saved to database for user:', therapist.user.email);

      // Generate setup link
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const setupLink = `${frontendUrl}/therapist/setup?token=${setupToken}`;

      // Send therapist setup email
      await this.emailService.sendTherapistSetupEmail({
        email: therapist.user.email,
        name: therapist.user.profile?.name || 'Therapist',
        setupLink: setupLink,
        clinicName: therapist.clinic.name,
      });

      return {
        message: `Setup email sent to ${therapist.user.email}. Please check your email for the setup link.`,
      };
    } else {
      // For other cases, send verification email
      await this.emailService.sendVerificationEmail({
        email: therapist.user.email,
        name: therapist.user.profile?.name || 'Therapist',
        code: verificationCode,
      });

      return {
        message: `Verification code sent to ${therapist.user.email}. Code: ${verificationCode} (This is for development only)`,
      };
    }
  }

  /**
   * Create a new therapist with user creation and rollback system
   */
  async createTherapistWithUser(
    clinicId: string,
    createTherapistDto: CreateTherapistDto,
    _createdByUserId: string,
  ): Promise<TherapistResponse> {
    // Start transaction for rollback capability
    await this.em.begin();

    try {
      // Validate clinic exists
      const clinic = await this.em.findOne(Clinic, { id: clinicId });
      if (!clinic) {
        throw new NotFoundException('Clinic not found');
      }

      // Check if email already exists
      const existingUser = await this.em.findOne(User, {
        email: createTherapistDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
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

      // Generate verification code for email verification
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Create user with therapist role
      const user = new User();
      user.email = createTherapistDto.email;
      user.status = UserStatus.PENDING; // Pending setup until email verified
      user.emailVerified = false; // Not verified yet
      user.passwordHash = 'temp-password-hash'; // Temporary password hash
      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = verificationExpires;

      await this.em.persistAndFlush(user);

      // Create user profile
      const userProfile = new UserProfile();
      userProfile.userId = user.id;
      userProfile.name = createTherapistDto.fullName;
      userProfile.phone = createTherapistDto.phone;
      userProfile.avatarUrl = createTherapistDto.avatarUrl;
      userProfile.user = user;

      await this.em.persistAndFlush(userProfile);

      // Create therapist role for the user
      const role = new UserRoleEntity();
      role.role = UserRole.THERAPIST;
      role.user = user;
      role.userId = user.id;

      await this.em.persistAndFlush(role);

      // Create therapist profile
      const therapist = new Therapist();
      therapist.clinic = clinic;
      therapist.user = user;
      therapist.licenseNumber = createTherapistDto.licenseNumber;
      therapist.licenseType = createTherapistDto.licenseType;
      therapist.joinDate = new Date(createTherapistDto.joinDate);
      therapist.timezone = createTherapistDto.timezone || 'Asia/Jakarta';
      therapist.education = createTherapistDto.education;
      therapist.certifications = createTherapistDto.certifications;
      therapist.adminNotes = createTherapistDto.adminNotes;
      // Status is now managed by User.status field

      await this.em.persistAndFlush(therapist);

      // Commit transaction
      await this.em.commit();

      // Generate password setup token and link
      const setupToken = crypto.randomBytes(32).toString('hex');
      const setupExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with setup token
      user.passwordResetToken = setupToken;
      user.passwordResetExpires = setupExpires;
      await this.em.persistAndFlush(user);

      // Generate setup link
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const setupLink = `${frontendUrl}/therapist/setup?token=${setupToken}`;

      // Send therapist setup email
      await this.emailService.sendTherapistSetupEmail({
        email: createTherapistDto.email,
        name: userProfile.name,
        setupLink: setupLink,
        clinicName: clinic.name,
      });

      // Return the created therapist
      return this.mapToResponse(therapist);
    } catch (error) {
      // Rollback transaction on any error
      await this.em.rollback();
      console.error('Error creating therapist:', error);
      throw error;
    }
  }

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
    const user = await this.em.findOne(User, {
      email: createTherapistDto.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a therapist in any clinic
    const existingTherapist = await this.em.findOne(Therapist, {
      user: user.id,
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
    therapist.licenseNumber = createTherapistDto.licenseNumber;
    therapist.licenseType = createTherapistDto.licenseType;
    therapist.joinDate = new Date(createTherapistDto.joinDate);

    // Optional fields with defaults
    if (createTherapistDto.timezone) {
      therapist.timezone = createTherapistDto.timezone;
    }
    if (createTherapistDto.education !== undefined) {
      therapist.education = createTherapistDto.education;
    }
    if (createTherapistDto.certifications !== undefined) {
      therapist.certifications = createTherapistDto.certifications;
    }
    if (createTherapistDto.adminNotes !== undefined) {
      therapist.adminNotes = createTherapistDto.adminNotes;
    }

    await this.em.persistAndFlush(therapist);

    // Set user's clinic
    user.clinic = clinic;
    await this.em.persistAndFlush(user);

    // Create therapist role for user
    const therapistRole = new UserRoleEntity();
    therapistRole.userId = user.id;
    therapistRole.role = UserRole.THERAPIST;
    therapistRole.user = user;

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
      populate: ['clinic', 'user', 'user.profile'],
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
      sortBy = 'name',
      sortDirection = 'ASC',
    } = query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = { clinic: clinicId };

    if (query.search) {
      whereConditions.$or = [
        { 'user.profile.name': { $ilike: `%${query.search}%` } },
        { 'user.profile.phone': { $ilike: `%${query.search}%` } },
        { licenseNumber: { $ilike: `%${query.search}%` } },
      ];
    }

    if (query.status) {
      whereConditions.status = query.status;
    }

    if (query.licenseType) {
      whereConditions.licenseType = query.licenseType;
    }

    if (query.minExperience !== undefined) {
      whereConditions.yearsOfExperience = { $gte: query.minExperience };
    }

    // Note: hasAvailableCapacity filtering will be done post-query due to MikroORM limitations

    // Handle sorting - map simplified field names to actual database fields
    let orderBy: any = {};
    if (sortBy === 'name') {
      // For name sorting, we'll sort by therapist ID and then sort in memory
      orderBy = { id: sortDirection };
    } else {
      orderBy = { [sortBy]: sortDirection };
    }

    // Standard query
    const [therapists, totalCount] = await this.em.findAndCount(
      Therapist,
      whereConditions,
      {
        populate: ['clinic', 'user', 'user.profile'],
        orderBy,
        limit,
        offset,
      },
    );

    // Apply hasAvailableCapacity filter if specified
    let filteredTherapists = therapists;
    const total = totalCount;

    // Apply in-memory sorting for name if needed
    if (sortBy === 'name') {
      filteredTherapists = therapists.sort((a, b) => {
        const nameA = a.user.profile?.name || '';
        const nameB = b.user.profile?.name || '';
        const comparison = nameA.localeCompare(nameB);
        return sortDirection === 'ASC' ? comparison : -comparison;
      });
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
      populate: ['user', 'user.profile'],
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

    // Update user profile fields
    if (updateTherapistDto.fullName !== undefined) {
      if (therapist.user.profile) {
        therapist.user.profile.name = updateTherapistDto.fullName;
      }
    }
    if (updateTherapistDto.phone !== undefined) {
      if (therapist.user.profile) {
        therapist.user.profile.phone = updateTherapistDto.phone;
      }
    }
    if (updateTherapistDto.avatarUrl !== undefined) {
      if (therapist.user.profile) {
        therapist.user.profile.avatarUrl = updateTherapistDto.avatarUrl;
      }
    }
    if (updateTherapistDto.licenseNumber !== undefined) {
      therapist.licenseNumber = updateTherapistDto.licenseNumber;
    }
    if (updateTherapistDto.licenseType !== undefined) {
      therapist.licenseType = updateTherapistDto.licenseType;
    }
    if (updateTherapistDto.status !== undefined) {
      therapist.user.status = updateTherapistDto.status;
    }
    if (updateTherapistDto.joinDate !== undefined) {
      therapist.joinDate = new Date(updateTherapistDto.joinDate);
    }
    if (updateTherapistDto.currentLoad !== undefined) {
      therapist.currentLoad = updateTherapistDto.currentLoad;
    }
    if (updateTherapistDto.timezone !== undefined) {
      therapist.timezone = updateTherapistDto.timezone;
    }
    if (updateTherapistDto.education !== undefined) {
      therapist.education = updateTherapistDto.education;
    }
    if (updateTherapistDto.certifications !== undefined) {
      therapist.certifications = updateTherapistDto.certifications;
    }
    if (updateTherapistDto.adminNotes !== undefined) {
      therapist.adminNotes = updateTherapistDto.adminNotes;
    }

    therapist.updatedAt = new Date();

    // Persist both therapist and user profile if profile was updated
    if (
      updateTherapistDto.fullName !== undefined ||
      updateTherapistDto.phone !== undefined ||
      updateTherapistDto.avatarUrl !== undefined
    ) {
      await this.em.persistAndFlush([therapist, therapist.user.profile]);
    } else {
      await this.em.persistAndFlush(therapist);
    }

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

    const oldStatus = therapist.user.status;
    therapist.user.status = updateStatusDto.status;

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

    // Add capacity change to admin notes
    if (updateCapacityDto.notes) {
      const timestamp = new Date().toISOString();
      const capacityChangeNote = `\n[${timestamp}] Capacity notes: ${updateCapacityDto.notes}`;
      therapist.adminNotes = (therapist.adminNotes || '') + capacityChangeNote;
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

    // Soft delete by setting user status to inactive
    therapist.user.status = UserStatus.INACTIVE;
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

    // Since we removed maxClients, always return true for now
    // This can be modified later if needed
    return true;
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

    if (therapist.user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('Therapist is not active');
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
      {
        populate: [
          'client',
          'therapist',
          'therapist.user',
          'therapist.user.profile',
        ],
      },
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

    if (newTherapist.user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('New therapist is not active');
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
      `Transferred from therapist ${currentAssignment.therapist.user.profile?.name || 'Unknown'}: ${transferReason}`;
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

    // Get active therapists
    const therapists = await this.em.find(
      Therapist,
      {
        clinic: clinicId,
        user: { status: UserStatus.ACTIVE },
      },
      {
        orderBy: { currentLoad: 'ASC' },
        populate: ['user'],
      },
    );

    // Return all active therapists since we removed maxClients
    return therapists;
  }

  // === THERAPIST PORTAL METHODS ===

  /**
   * Get therapist's assigned clients with filtering and pagination
   */
  async getTherapistClients(
    therapistId: string,
    options: {
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
      clinicId?: string;
    },
  ) {
    // Validate therapist exists and clinic access
    const whereConditions: any = { id: therapistId };
    if (options.clinicId) {
      whereConditions.clinic = options.clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions);
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    // Build query for therapist's clients
    const clientQuery: any = {};

    // Get active assignments for this therapist
    const assignments = await this.em.find(
      ClientTherapistAssignment,
      {
        therapist: therapistId,
        status: AssignmentStatus.ACTIVE,
      },
      {
        populate: ['client'],
      },
    );

    const clientIds = assignments.map((a) => a.client.id);
    if (clientIds.length === 0) {
      return {
        items: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 10,
        totalPages: 0,
      };
    }

    clientQuery.id = { $in: clientIds };

    // Apply filters
    if (options.status) {
      clientQuery.status = options.status;
    }

    if (options.search) {
      clientQuery.$or = [
        { fullName: { $ilike: `%${options.search}%` } },
        { email: { $ilike: `%${options.search}%` } },
        { phone: { $ilike: `%${options.search}%` } },
      ];
    }

    // Get total count
    const total = await this.em.count(Client, clientQuery);

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const clients = await this.em.find(Client, clientQuery, {
      limit,
      offset,
      orderBy: { updatedAt: 'DESC' },
    });

    // Map clients with assignment data
    const items = clients.map((client) => {
      const assignment = assignments.find((a) => a.client.id === client.id);
      return {
        id: client.id,
        fullName: client.fullName,
        status: client.status,
        assignedDate: assignment?.assignedDate,
        lastSessionDate: client.lastSessionDate,
        sessionCount: client.totalSessions,
        progress: client.progress,
        notes: assignment?.notes,
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get specific client for therapist with detailed information
   */
  async getTherapistClient(
    therapistId: string,
    clientId: string,
    clinicId?: string,
  ) {
    // Validate therapist
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions);
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    // Check if client is assigned to this therapist
    const assignment = await this.em.findOne(
      ClientTherapistAssignment,
      {
        therapist: therapistId,
        client: clientId,
        status: AssignmentStatus.ACTIVE,
      },
      {
        populate: ['client'],
      },
    );

    if (!assignment) {
      throw new NotFoundException('Client not assigned to this therapist');
    }

    const client = assignment.client;

    return {
      id: client.id,
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      gender: client.gender,
      birthDate: client.birthDate,
      status: client.status,
      assignedDate: assignment.assignedDate,
      lastSessionDate: client.lastSessionDate,
      sessionCount: client.totalSessions,
      progress: client.progress,
      notes: assignment.notes,
      // Add more client details as needed
    };
  }

  /**
   * Update client notes for therapist
   */
  async updateClientNotes(
    therapistId: string,
    clientId: string,
    notes: string,
  ) {
    // Find the assignment
    const assignment = await this.em.findOne(ClientTherapistAssignment, {
      therapist: therapistId,
      client: clientId,
      status: AssignmentStatus.ACTIVE,
    });

    if (!assignment) {
      throw new NotFoundException('Client assignment not found');
    }

    assignment.notes = notes;
    await this.em.persistAndFlush(assignment);

    return { success: true, message: 'Client notes updated successfully' };
  }

  /**
   * Get comprehensive therapist statistics
   */
  async getTherapistStats(therapistId: string, clinicId?: string) {
    // Validate therapist
    const whereConditions: any = { id: therapistId };
    if (clinicId) {
      whereConditions.clinic = clinicId;
    }

    const therapist = await this.em.findOne(Therapist, whereConditions);
    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    // Get all assignments for this therapist
    const assignments = await this.em.find(
      ClientTherapistAssignment,
      {
        therapist: therapistId,
      },
      {
        populate: ['client'],
      },
    );

    // Calculate statistics
    const totalClients = assignments.length;
    const activeClients = assignments.filter(
      (a) => a.status === AssignmentStatus.ACTIVE,
    ).length;
    const completedClients = assignments.filter(
      (a) => a.status === AssignmentStatus.COMPLETED,
    ).length;

    // Get session statistics (this would need to be implemented based on your session tracking)
    // For now, using mock data
    const totalSessions = assignments.reduce(
      (sum, a) => sum + (a.client?.totalSessions || 0),
      0,
    );
    const thisWeekSessions = Math.floor(totalSessions * 0.15); // Mock calculation

    // Calculate average progress
    const clientsWithProgress = assignments.filter(
      (a) => a.client?.progress && a.client.progress > 0,
    );
    const averageProgress =
      clientsWithProgress.length > 0
        ? clientsWithProgress.reduce(
            (sum, a) => sum + (a.client?.progress || 0),
            0,
          ) / clientsWithProgress.length
        : 0;

    // Client distribution by status
    const clientDistribution = assignments.reduce(
      (dist, a) => {
        const status = a.client?.status || 'new';
        dist[status] = (dist[status] || 0) + 1;
        return dist;
      },
      {} as Record<string, number>,
    );

    // Mock monthly stats (would need real implementation)
    const monthlyStats = [
      {
        month: 'Nov',
        sessions: Math.floor(totalSessions * 0.4),
        newClients: Math.floor(totalClients * 0.3),
      },
      {
        month: 'Dec',
        sessions: Math.floor(totalSessions * 0.6),
        newClients: Math.floor(totalClients * 0.4),
      },
    ];

    return {
      totalClients,
      activeClients,
      completedClients,
      totalSessions,
      thisWeekSessions,
      averageProgress: Math.round(averageProgress),
      clientDistribution,
      monthlyStats,
    };
  }

  /**
   * Schedule a session for a client
   */
  async scheduleClientSession(
    therapistId: string,
    clientId: string,
    scheduledAt: Date,
    duration?: number,
    notes?: string,
  ) {
    // Validate assignment exists
    const assignment = await this.em.findOne(ClientTherapistAssignment, {
      therapist: therapistId,
      client: clientId,
      status: AssignmentStatus.ACTIVE,
    });

    if (!assignment) {
      throw new NotFoundException('Client assignment not found');
    }

    // This would integrate with your session scheduling system
    // For now, return a mock response
    return {
      success: true,
      sessionId: `session-${Date.now()}`,
      scheduledAt,
      duration: duration || 60,
      notes,
      message: 'Session scheduled successfully',
    };
  }

  /**
   * Map Therapist entity to response format
   */
  private mapToResponse(therapist: Therapist): TherapistResponse {
    return {
      id: therapist.id,
      clinicId: therapist.clinic.id,
      clinicName: therapist.clinic.name,
      userId: therapist.user.id,
      email: therapist.user.email,
      name: therapist.user.profile?.name || 'Unknown User',
      phone: therapist.user.profile?.phone,
      avatarUrl: therapist.user.profile?.avatarUrl,
      licenseNumber: therapist.licenseNumber,
      licenseType: therapist.licenseType,
      status: therapist.user.status,
      joinDate: therapist.joinDate,
      currentLoad: therapist.currentLoad,
      timezone: therapist.timezone,
      education: therapist.education,
      certifications: therapist.certifications,
      adminNotes: therapist.adminNotes,
      createdAt: therapist.createdAt,
      updatedAt: therapist.updatedAt,
    };
  }

  /**
   * Verify therapist setup token
   */
  async verifySetupToken(token: string): Promise<{
    valid: boolean;
    therapist?: {
      id: string;
      name: string;
      email: string;
      clinicName: string;
    };
    error?: string;
  }> {
    try {
      console.log('Verifying setup token:', token.substring(0, 10) + '...');
      console.log('Current time:', new Date().toISOString());

      // Find user with setup token (without expiration check first)
      // Note: Therapist users are created with PENDING status until setup is completed
      const user = await this.em.findOne(User, {
        passwordResetToken: token,
        status: UserStatus.PENDING, // Therapists are in pending setup until completed
      });

      console.log('Found user:', user ? user.email : 'null');
      if (user) {
        console.log(
          'Token expires at:',
          user.passwordResetExpires?.toISOString(),
        );
        console.log(
          'Token is valid:',
          user.passwordResetExpires && user.passwordResetExpires > new Date(),
        );

        // Check expiration manually
        if (
          user.passwordResetExpires &&
          user.passwordResetExpires <= new Date()
        ) {
          console.log('Token is expired');
          return {
            valid: false,
            error: 'Setup token has expired',
          };
        }
      }

      if (!user) {
        return {
          valid: false,
          error: 'Invalid setup token',
        };
      }

      // Find therapist profile for this user
      const therapist = await this.em.findOne(
        Therapist,
        {
          user: user.id,
        },
        {
          populate: ['clinic', 'user', 'user.profile'],
        },
      );

      if (!therapist) {
        return {
          valid: false,
          error: 'No therapist profile found for this user',
        };
      }

      // Check if therapist is in pending setup status
      if (therapist.user.status !== UserStatus.PENDING) {
        return {
          valid: false,
          error: 'Therapist account is not in setup mode',
        };
      }

      return {
        valid: true,
        therapist: {
          id: therapist.id,
          name: therapist.user.profile?.name || 'Unknown User',
          email: user.email,
          clinicName: therapist.clinic.name,
        },
      };
    } catch (error) {
      this.logger.error('Error verifying setup token:', error);
      return {
        valid: false,
        error: 'Token verification failed',
      };
    }
  }

  /**
   * Get email resend status for a therapist
   */
  async getEmailResendStatus(therapistId: string): Promise<{
    attempts: number;
    maxAttempts: number;
    cooldownUntil?: Date;
    canResend: boolean;
    remainingCooldownMs?: number;
  }> {
    const therapist = await this.em.findOne(
      Therapist,
      { id: therapistId },
      {
        populate: ['user'],
      },
    );

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    const MAX_RESEND_ATTEMPTS = 3;
    const now = new Date();
    const cooldownUntil = therapist.user.emailResendCooldownUntil;
    const isInCooldown = cooldownUntil && cooldownUntil > now;
    const remainingCooldownMs = isInCooldown
      ? cooldownUntil.getTime() - now.getTime()
      : 0;

    return {
      attempts: therapist.user.emailResendAttempts,
      maxAttempts: MAX_RESEND_ATTEMPTS,
      cooldownUntil: isInCooldown ? cooldownUntil : undefined,
      canResend:
        therapist.user.emailResendAttempts < MAX_RESEND_ATTEMPTS &&
        !isInCooldown,
      remainingCooldownMs:
        remainingCooldownMs > 0 ? remainingCooldownMs : undefined,
    };
  }

  /**
   * Complete therapist setup with password
   */
  async completeSetup(
    token: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ message: string; therapistId: string }> {
    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find user with valid setup token
    // Note: Therapist users are created with PENDING status until setup is completed
    const user = await this.em.findOne(User, {
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
      status: UserStatus.PENDING, // Therapists are in pending setup until completed
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired setup token');
    }

    // Find therapist profile for this user
    const therapist = await this.em.findOne(
      Therapist,
      {
        user: user.id,
      },
      {
        populate: ['user', 'user.profile'],
      },
    );

    if (!therapist) {
      throw new BadRequestException('No therapist profile found for this user');
    }

    // Check if therapist is in pending setup status
    if (therapist.user.status !== UserStatus.PENDING) {
      throw new BadRequestException('Therapist account is not in setup mode');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password, clear reset token, verify email, and activate user and therapist
    await this.em.transactional(async (em) => {
      // Update user password, clear reset token, verify email, and activate user
      await em.nativeUpdate(
        User,
        { id: user.id },
        {
          passwordHash: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: UserStatus.ACTIVE, // Activate the user account
          emailResendAttempts: 0, // Reset resend attempts
          emailResendCooldownUntil: null, // Clear cooldown
        },
      );

      // User status is already updated to ACTIVE above, no need to update therapist
    });

    this.logger.log(
      `Therapist setup completed for user ${user.email} (therapist ID: ${therapist.id}) - email verified and account activated`,
    );

    return {
      message:
        'Therapist account setup completed successfully. You can now login.',
      therapistId: therapist.id,
    };
  }
}
