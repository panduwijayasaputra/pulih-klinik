import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../database/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { UserRole, UserRoleType } from '../common/enums';

export interface UserProfileResponse {
  id: string;
  email: string;
  isActive: boolean;
  profile: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  roles: Array<{
    id: string;
    role: string;
    clinicId?: string;
    clinicName?: string;
    createdAt: Date;
  }>;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
  ) {}

  /**
   * Get user profile with roles and clinic information
   */
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['profile', 'roles', 'roles.clinic'] },
    );

    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    if (!user.profile) {
      throw new NotFoundException('User profile not found');
    }

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      profile: {
        id: user.profile.id,
        name: user.profile.name,
        phone: user.profile.phone,
        address: user.profile.address,
        bio: user.profile.bio,
        avatarUrl: user.profile.avatarUrl,
        createdAt: user.profile.createdAt,
        updatedAt: user.profile.updatedAt,
      },
      roles: user.roles.map((role) => ({
        id: role.id,
        role: role.role,
        clinicId: role.clinicId,
        clinicName: role.clinic?.name,
        createdAt: role.createdAt,
      })),
    };
  }

  /**
   * Update user profile information
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ message: string; profile: UserProfileResponse['profile'] }> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['profile'] },
    );

    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    if (!user.profile) {
      throw new NotFoundException('User profile not found');
    }

    // Update profile fields
    const profile = user.profile;
    profile.name = updateProfileDto.name;
    profile.phone = updateProfileDto.phone || undefined;
    profile.address = updateProfileDto.address || undefined;
    profile.bio = updateProfileDto.bio || undefined;
    profile.avatarUrl = updateProfileDto.avatarUrl || undefined;
    profile.updatedAt = new Date();

    await this.em.persistAndFlush(profile);

    return {
      message: 'Profile updated successfully',
      profile: {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  }

  /**
   * Change user password (delegates to AuthService)
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Validate that passwords match
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Delegate to AuthService for password change
    return await this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
      changePasswordDto.confirmPassword,
    );
  }

  /**
   * Validate user has permission to access specific clinic data
   */
  async validateClinicAccess(
    userId: string,
    clinicId: string,
    requiredRoles: UserRoleType[] = [
      UserRole.CLINIC_ADMIN,
      UserRole.ADMINISTRATOR,
    ],
  ): Promise<boolean> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['roles'] },
    );

    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    // Administrator can access any clinic
    const isAdmin = user.roles
      .toArray()
      .some((role) => role.role === UserRole.ADMINISTRATOR);
    if (isAdmin) {
      return true;
    }

    // Check if user has required role for the specific clinic
    const hasAccess = user.roles
      .toArray()
      .some(
        (role) =>
          requiredRoles.includes(role.role) && role.clinicId === clinicId,
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have permission to access this clinic',
      );
    }

    return true;
  }

  /**
   * Validate user has specific role
   */
  async validateUserRole(
    userId: string,
    requiredRoles: UserRoleType[],
  ): Promise<boolean> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['roles'] },
    );

    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    const hasRole = user.roles
      .toArray()
      .some((role) => requiredRoles.includes(role.role));

    if (!hasRole) {
      throw new ForbiddenException(
        `You must have one of these roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }

  /**
   * Get user's clinic IDs (for therapists and clinic admins)
   */
  async getUserClinicIds(userId: string): Promise<string[]> {
    const user = await this.em.findOne(
      User,
      { id: userId, isActive: true },
      { populate: ['roles'] },
    );

    if (!user) {
      throw new NotFoundException('User not found or inactive');
    }

    // Administrator can access all clinics (return empty array to indicate "all")
    const isAdmin = user.roles
      .toArray()
      .some((role) => role.role === UserRole.ADMINISTRATOR);
    if (isAdmin) {
      return [];
    }

    // Return clinic IDs for clinic admin and therapist roles
    const clinicIds = user.roles
      .toArray()
      .filter((role) => role.clinicId)
      .map((role) => role.clinicId!)
      .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicates

    return clinicIds;
  }
}
