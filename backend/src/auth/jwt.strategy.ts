import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EntityManager } from '@mikro-orm/core';
import { environmentConfig } from '../config/environment.config';
import { User } from '../database/entities/user.entity';
import { UserRoleType } from '../common/enums';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: Array<{
    id: string;
    role: UserRoleType;
    clinicId?: string;
  }>;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  isActive: boolean;
  roles: Array<{
    id: string;
    role: UserRoleType;
    clinicId?: string;
    clinicName?: string;
  }>;
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
      { populate: ['roles', 'roles.clinic'] },
    );

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Validate that JWT roles still match current database roles
    const currentRoleIds = user.roles.map((role) => role.id).sort();
    const jwtRoleIds = roles.map((role) => role.id).sort();

    if (JSON.stringify(currentRoleIds) !== JSON.stringify(jwtRoleIds)) {
      throw new UnauthorizedException(
        'User roles have changed, please re-login',
      );
    }

    // Return validated user with current database role information
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles.map((role) => ({
        id: role.id,
        role: role.role,
        clinicId: role.clinicId,
        clinicName: role.clinic?.name,
      })),
    };

    return authUser;
  }
}
