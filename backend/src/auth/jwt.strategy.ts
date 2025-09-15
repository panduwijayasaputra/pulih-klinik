import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EntityManager } from '@mikro-orm/core';
import { environmentConfig } from '../config/environment.config';
import { User } from '../database/entities/user.entity';
import { UserStatus } from '../common/enums';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  clinicId?: string;
  clinicName?: string;
  subscriptionTier?: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  roles: string[];
  clinicId?: string;
  clinicName?: string;
  subscriptionTier?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly em: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environmentConfig.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const { sub: userId, email, roles } = payload;

    // Basic validation of payload
    if (!userId || !email || !Array.isArray(roles)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Validate user exists and is still active in database
    const user = await this.em.findOne(
      User,
      { id: userId, email, status: UserStatus.ACTIVE },
      {
        populate: ['roles', 'clinic', 'profile', 'therapist'],
      },
    );

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Validate that JWT roles are still valid (database can have additional roles)
    const currentRoles = user.roles.map((role) => role.role).sort();
    const jwtRoles = roles.sort();

    // Check if JWT roles are a subset of current database roles
    // This allows for role additions (like adding therapist role) without requiring re-login
    const jwtRolesValid = jwtRoles.every((jwtRole) =>
      currentRoles.includes(jwtRole as any),
    );

    if (!jwtRolesValid) {
      throw new UnauthorizedException(
        'User roles have been removed, please re-login',
      );
    }

    // Get clinic info from user.clinic
    const clinic = user.clinic;

    // Return validated user with current database role information
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.profile?.name || user.email.split('@')[0] || 'User',
      status: user.status,
      roles: user.roles.map((role) => role.role),
      clinicId: clinic?.id,
      clinicName: clinic?.name,
      subscriptionTier: clinic?.subscriptionTier?.code,
    };

    return authUser;
  }
}
