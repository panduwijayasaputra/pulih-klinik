import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EntityManager } from '@mikro-orm/core';
import { environmentConfig } from '../config/environment.config';
import { User } from '../database/entities/user.entity';

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
  isActive: boolean;
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
      { id: userId, email, isActive: true },
      { populate: ['roles', 'clinic', 'profile'] },
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

    // Return validated user with current database role information
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.profile?.name || user.email.split('@')[0] || 'User',
      isActive: user.isActive,
      roles: user.roles.map((role) => role.role),
      clinicId: user.clinic?.id,
      clinicName: user.clinic?.name,
      subscriptionTier: user.clinic?.subscriptionTier?.code,
    };

    return authUser;
  }
}
