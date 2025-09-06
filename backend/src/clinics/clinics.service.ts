import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Clinic } from '../database/entities/clinic.entity';
import { User } from '../database/entities/user.entity';
import { SubscriptionTier } from '../database/entities/subscription-tier.entity';
import {
  Therapist,
  TherapistStatus,
} from '../database/entities/therapist.entity';
import { Client, ClientStatus } from '../database/entities/client.entity';
import { TherapySession } from '../database/entities/therapy-session.entity';
import {
  CreateClinicDto,
  UpdateClinicDto,
  UpdateBrandingDto,
  UpdateSettingsDto,
} from './dto';
import { UserRole } from '../common/enums';

export interface ClinicProfileResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  workingHours?: string;
  logoUrl?: string;

  // Branding
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;

  // Settings
  timezone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;

  // Status & Subscription
  status: 'active' | 'suspended' | 'pending' | 'inactive';
  subscriptionTier: 'alpha' | 'beta' | 'theta' | 'delta' | undefined;
  subscriptionExpires?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicDocumentPlaceholder {
  id: string;
  name: string;
  type: 'license' | 'certificate' | 'insurance' | 'tax' | 'other';
  url: string;
  uploadedAt: Date;
}

@Injectable()
export class ClinicsService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Create a new clinic
   */
  async createClinic(
    createClinicDto: CreateClinicDto,
    createdByUserId: string,
  ): Promise<ClinicProfileResponse> {
    // Check if clinic with same name or email already exists
    const existingClinic = await this.em.findOne(Clinic, {
      $or: [{ name: createClinicDto.name }, { email: createClinicDto.email }],
    });

    if (existingClinic) {
      throw new BadRequestException(
        'A clinic with the same name or email already exists',
      );
    }

    // Create new clinic
    const clinic = new Clinic();
    clinic.name = createClinicDto.name;
    clinic.address = createClinicDto.address;
    clinic.phone = createClinicDto.phone;
    clinic.email = createClinicDto.email;
    clinic.website = createClinicDto.website || undefined;
    clinic.description = createClinicDto.description || undefined;
    clinic.workingHours = createClinicDto.workingHours || undefined;
    clinic.status = 'pending'; // New clinics start as pending
    clinic.isActive = true;

    await this.em.persistAndFlush(clinic);

    // Associate the clinic with the user who created it
    const user = await this.em.findOne(User, { id: createdByUserId });
    if (user) {
      user.clinic = clinic;
      await this.em.persistAndFlush(user);
    }

    return this.mapClinicToResponse(clinic);
  }

  /**
   * Get clinic profile by ID
   */
  async getClinicProfile(clinicId: string): Promise<ClinicProfileResponse> {
    const clinic = await this.em.findOne(Clinic, { id: clinicId });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    return this.mapClinicToResponse(clinic);
  }

  /**
   * Update basic clinic profile information
   */
  async updateClinicProfile(
    clinicId: string,
    updateClinicDto: UpdateClinicDto,
  ): Promise<{ message: string; clinic: ClinicProfileResponse }> {
    const clinic = await this.em.findOne(Clinic, { id: clinicId });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Update basic clinic information
    clinic.name = updateClinicDto.name;
    clinic.address = updateClinicDto.address;
    clinic.phone = updateClinicDto.phone;
    clinic.email = updateClinicDto.email;
    clinic.website = updateClinicDto.website || undefined;
    clinic.description = updateClinicDto.description || undefined;
    clinic.workingHours = updateClinicDto.workingHours || undefined;
    clinic.updatedAt = new Date();

    await this.em.persistAndFlush(clinic);

    return {
      message: 'Clinic profile updated successfully',
      clinic: this.mapClinicToResponse(clinic),
    };
  }

  /**
   * Update clinic branding settings
   */
  async updateClinicBranding(
    clinicId: string,
    updateBrandingDto: UpdateBrandingDto,
  ): Promise<{ message: string; clinic: ClinicProfileResponse }> {
    const clinic = await this.em.findOne(Clinic, { id: clinicId });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Update branding settings
    if (updateBrandingDto.logoUrl !== undefined) {
      clinic.logoUrl = updateBrandingDto.logoUrl || undefined;
    }
    clinic.primaryColor = updateBrandingDto.primaryColor;
    clinic.secondaryColor = updateBrandingDto.secondaryColor;
    clinic.fontFamily = updateBrandingDto.fontFamily;
    clinic.updatedAt = new Date();

    await this.em.persistAndFlush(clinic);

    return {
      message: 'Clinic branding updated successfully',
      clinic: this.mapClinicToResponse(clinic),
    };
  }

  /**
   * Update clinic settings
   */
  async updateClinicSettings(
    clinicId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<{ message: string; clinic: ClinicProfileResponse }> {
    const clinic = await this.em.findOne(Clinic, { id: clinicId });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Update settings
    clinic.timezone = updateSettingsDto.timezone;
    clinic.language = updateSettingsDto.language;
    clinic.emailNotifications = updateSettingsDto.emailNotifications;
    clinic.smsNotifications = updateSettingsDto.smsNotifications;
    clinic.pushNotifications = updateSettingsDto.pushNotifications;
    clinic.updatedAt = new Date();

    await this.em.persistAndFlush(clinic);

    return {
      message: 'Clinic settings updated successfully',
      clinic: this.mapClinicToResponse(clinic),
    };
  }

  /**
   * Validate user has clinic admin access to specific clinic
   */
  async validateClinicAdminAccess(
    userId: string,
    clinicId: string,
  ): Promise<boolean> {
    // First check if the clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Check if user has clinic_admin role for this clinic or is system administrator
    const user = await this.em.findOne(
      User,
      {
        id: userId,
        isActive: true,
      },
      { populate: ['roles', 'clinic'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // System administrator can access any clinic
    const isAdmin = user.roles
      .toArray()
      .some((role) => role.role === UserRole.ADMINISTRATOR);
    if (isAdmin) {
      return true;
    }

    // Clinic admin can only access their own clinic
    const hasClinicAdminAccess = user.roles
      .toArray()
      .some(
        (role) =>
          role.role === UserRole.CLINIC_ADMIN && user.clinic?.id === clinicId,
      );

    if (!hasClinicAdminAccess) {
      throw new ForbiddenException(
        'You do not have permission to manage this clinic',
      );
    }

    return true;
  }

  /**
   * Update clinic subscription tier
   */
  async updateClinicSubscription(
    clinicId: string,
    subscriptionTierCode: string,
  ): Promise<{
    id: string;
    subscriptionTier: string;
    subscriptionExpires: string;
  }> {
    const clinic = await this.em.findOne(Clinic, { id: clinicId });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Find the subscription tier by code
    const subscriptionTier = await this.em.findOne(SubscriptionTier, {
      code: subscriptionTierCode,
    });

    if (!subscriptionTier) {
      throw new NotFoundException('Subscription tier not found');
    }

    // Update subscription tier
    clinic.subscriptionTier = subscriptionTier;

    // Set subscription expiration to 1 year from now
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    clinic.subscriptionExpires = expirationDate;

    await this.em.persistAndFlush(clinic);

    return {
      id: clinic.id,
      subscriptionTier: subscriptionTier.code,
      subscriptionExpires: clinic.subscriptionExpires.toISOString(),
    };
  }

  /**
   * Get clinics accessible by user (based on roles)
   */
  async getUserAccessibleClinics(userId: string): Promise<string[]> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['roles', 'clinic'] },
    );

    if (!user) {
      return [];
    }

    // System administrator can access all clinics
    const isAdmin = user.roles
      .toArray()
      .some((role) => role.role === UserRole.ADMINISTRATOR);
    if (isAdmin) {
      const allClinics = await this.em.find(Clinic, {});
      return allClinics.map((clinic) => clinic.id);
    }

    // Return user's clinic ID
    return user.clinic?.id ? [user.clinic.id] : [];
  }

  /**
   * Placeholder: Get clinic documents
   */
  async getClinicDocuments(
    clinicId: string,
  ): Promise<ClinicDocumentPlaceholder[]> {
    // Validate clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Placeholder implementation - in real implementation this would query document entities
    throw new BadRequestException(
      'Document management functionality is not yet implemented. This endpoint is a placeholder for future file management features.',
    );
  }

  /**
   * Placeholder: Upload clinic document
   */
  async uploadClinicDocument(
    clinicId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    file: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    documentType: string,
  ): Promise<ClinicDocumentPlaceholder> {
    // Validate clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Placeholder implementation
    throw new BadRequestException(
      'Document upload functionality is not yet implemented. This endpoint is a placeholder for future file upload features.',
    );
  }

  /**
   * Placeholder: Delete clinic document
   */
  async deleteClinicDocument(
    clinicId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    documentId: string,
  ): Promise<{ message: string }> {
    // Validate clinic exists
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    // Placeholder implementation
    throw new BadRequestException(
      'Document deletion functionality is not yet implemented. This endpoint is a placeholder for future file management features.',
    );
  }

  /**
   * Check if clinic exists
   */
  async clinicExists(clinicId: string): Promise<boolean> {
    const clinic = await this.em.findOne(Clinic, { id: clinicId });
    return !!clinic;
  }

  /**
   * Map clinic entity to response format
   */
  private mapClinicToResponse(clinic: Clinic): ClinicProfileResponse {
    return {
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      email: clinic.email,
      website: clinic.website,
      description: clinic.description,
      workingHours: clinic.workingHours,
      logoUrl: clinic.logoUrl,

      // Branding
      primaryColor: clinic.primaryColor,
      secondaryColor: clinic.secondaryColor,
      fontFamily: clinic.fontFamily,

      // Settings
      timezone: clinic.timezone,
      language: clinic.language,
      emailNotifications: clinic.emailNotifications,
      smsNotifications: clinic.smsNotifications,
      pushNotifications: clinic.pushNotifications,

      // Status & Subscription
      status: clinic.status,
      subscriptionTier: clinic.subscriptionTier?.code as
        | 'alpha'
        | 'beta'
        | 'theta'
        | 'delta'
        | undefined,
      subscriptionExpires: clinic.subscriptionExpires,

      // Timestamps
      createdAt: clinic.createdAt,
      updatedAt: clinic.updatedAt,
    };
  }

  /**
   * Get all clinics with pagination and filtering (admin only)
   */
  async getAllClinics(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      subscriptionTier?: string;
    } = {},
  ): Promise<{
    clinics: ClinicProfileResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 20, search, status, subscriptionTier } = options;
    const offset = (page - 1) * limit;

    // Build filter conditions
    const whereConditions: any = {};

    if (status) {
      whereConditions.status = status;
    }

    if (subscriptionTier) {
      whereConditions.subscriptionTier = subscriptionTier;
    }

    if (search) {
      whereConditions.$or = [
        { name: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
        { address: { $ilike: `%${search}%` } },
      ];
    }

    const [clinics, total] = await this.em.findAndCount(
      Clinic,
      whereConditions,
      {
        orderBy: { createdAt: 'DESC' },
        limit,
        offset,
      },
    );

    // Transform to response format
    const clinicResponses: ClinicProfileResponse[] = clinics.map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      email: clinic.email,
      website: clinic.website,
      description: clinic.description,
      workingHours: clinic.workingHours,

      // Branding
      logoUrl: clinic.logoUrl,
      primaryColor: clinic.primaryColor,
      secondaryColor: clinic.secondaryColor,
      fontFamily: clinic.fontFamily,

      // Settings
      timezone: clinic.timezone,
      language: clinic.language,
      emailNotifications: clinic.emailNotifications,
      smsNotifications: clinic.smsNotifications,
      pushNotifications: clinic.pushNotifications,

      // Status & Subscription
      status: clinic.status,
      subscriptionTier: clinic.subscriptionTier?.code as
        | 'alpha'
        | 'beta'
        | 'theta'
        | 'delta'
        | undefined,
      subscriptionExpires: clinic.subscriptionExpires,

      // Timestamps
      createdAt: clinic.createdAt,
      updatedAt: clinic.updatedAt,
    }));

    return {
      clinics: clinicResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get clinic statistics
   */
  async getClinicStats(clinicId: string): Promise<{
    therapists: number;
    clients: number;
    sessions: number;
    documents: number;
    activeTherapists: number;
    activeClients: number;
    thisMonthSessions: number;
    thisMonthDocuments: number;
  }> {
    // Verify clinic exists
    const clinicExists = await this.clinicExists(clinicId);
    if (!clinicExists) {
      throw new NotFoundException('Clinic not found');
    }

    // Get current date for this month calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Get therapists count
    const [totalTherapists, activeTherapists] = await Promise.all([
      this.em.count(Therapist, { clinic: clinicId }),
      this.em.count(Therapist, {
        clinic: clinicId,
        status: TherapistStatus.ACTIVE,
      }),
    ]);

    // Get clients count
    const [totalClients, activeClients] = await Promise.all([
      this.em.count(Client, { clinic: clinicId }),
      this.em.count(Client, { clinic: clinicId, status: ClientStatus.THERAPY }),
    ]);

    // Get sessions count
    const [totalSessions, thisMonthSessions] = await Promise.all([
      this.em.count(TherapySession, {
        client: { clinic: clinicId },
      }),
      this.em.count(TherapySession, {
        client: { clinic: clinicId },
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      }),
    ]);

    // Get documents count (placeholder - will be implemented when document system is ready)
    const [totalDocuments, thisMonthDocuments] = await Promise.all([
      // TODO: Implement when document system is ready
      Promise.resolve(0),
      Promise.resolve(0),
    ]);

    return {
      therapists: totalTherapists,
      clients: totalClients,
      sessions: totalSessions,
      documents: totalDocuments,
      activeTherapists,
      activeClients,
      thisMonthSessions,
      thisMonthDocuments,
    };
  }

  /**
   * Upload clinic logo
   */
  async uploadClinicLogo(
    clinicId: string,
    _logoFile: any,
  ): Promise<{ logoUrl: string }> {
    // Verify clinic exists
    const clinicExists = await this.clinicExists(clinicId);
    if (!clinicExists) {
      throw new NotFoundException('Clinic not found');
    }

    // TODO: Implement actual file upload logic
    // For now, return a placeholder URL
    const logoUrl = `https://example.com/uploads/logos/clinic-${clinicId}-logo.png`;

    // Update clinic with new logo URL
    await this.em.nativeUpdate('Clinic', { id: clinicId }, { logoUrl });

    return { logoUrl };
  }
}
