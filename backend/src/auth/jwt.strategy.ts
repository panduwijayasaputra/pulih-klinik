import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EntityManager } from '@mikro-orm/core';
import { environmentConfig } from '../config/environment.config';
import { User } from '../database/entities/user.entity';
import { Therapist } from '../database/entities/therapist.entity';
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
      { populate: ['roles', 'clinic', 'profile', 'therapist', 'therapist.clinic', 'therapist.clinic.subscriptionTier'] },
    );

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Validate that JWT roles still match current database roles
    const currentRoles = user.roles.map((role) => role.role).sort();
    const jwtRoles = roles.sort();

    if (JSON.stringify(currentRoles) !== JSON.stringify(jwtRoles)) {
      throw new UnauthorizedException(
        'User roles have changed, please re-login',
      );
    }

    // Get clinic info from user.clinic or fallback to therapist.clinic
    const clinic = user.clinic || user.therapist.getItems()[0]?.clinic;

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
