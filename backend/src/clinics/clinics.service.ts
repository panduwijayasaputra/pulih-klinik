import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Clinic } from '../database/entities/clinic.entity';
import { UserRole as UserRoleEntity } from '../database/entities/user-role.entity';
import { UpdateClinicDto, UpdateBrandingDto, UpdateSettingsDto } from './dto';
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
  subscriptionTier: 'alpha' | 'beta' | 'theta' | 'delta';
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
    // Check if user has clinic_admin role for this clinic or is system administrator
    const userRole = await this.em.findOne(UserRoleEntity, {
      userId,
      $or: [
        { role: UserRole.ADMINISTRATOR }, // System admin can access any clinic
        { role: UserRole.CLINIC_ADMIN, clinicId }, // Clinic admin for specific clinic
      ],
    });

    if (!userRole) {
      throw new ForbiddenException(
        'You do not have permission to manage this clinic',
      );
    }

    return true;
  }

  /**
   * Get clinics accessible by user (based on roles)
   */
  async getUserAccessibleClinics(userId: string): Promise<string[]> {
    const userRoles = await this.em.find(UserRoleEntity, { userId });

    // System administrator can access all clinics
    const isAdmin = userRoles.some(
      (role) => role.role === UserRole.ADMINISTRATOR,
    );
    if (isAdmin) {
      const allClinics = await this.em.find(Clinic, {});
      return allClinics.map((clinic) => clinic.id);
    }

    // Get clinic IDs for clinic_admin and therapist roles
    const clinicIds = userRoles
      .filter((role) => role.clinicId)
      .map((role) => role.clinicId!)
      .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicates

    return clinicIds;
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
      subscriptionTier: clinic.subscriptionTier,
      subscriptionExpires: clinic.subscriptionExpires,

      // Timestamps
      createdAt: clinic.createdAt,
      updatedAt: clinic.updatedAt,
    };
  }
}
