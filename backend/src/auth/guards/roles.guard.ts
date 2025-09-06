import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../jwt.strategy';
import { UserRole, UserRoleType } from '../../common/enums';
import { EntityManager } from '@mikro-orm/core';
import { Clinic } from '../../database/entities';

export interface RequiredRole {
  role: UserRoleType;
  requireClinicScope?: boolean;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private em: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RequiredRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    // Check if user has any of the required roles
    let hasRequiredRole = false;
    for (const requiredRole of requiredRoles) {
      const userRole = user.roles.find(
        (role) => role === requiredRole.role,
      );

      if (!userRole) {
        continue;
      }

      // If clinic scope is required, check if user has clinic access
      if (requiredRole.requireClinicScope) {
        const clinicIdFromParams = request.params?.clinicId;
        const clinicIdFromQuery = request.query?.clinicId;
        const requestedClinicId = clinicIdFromParams || clinicIdFromQuery;

        // Administrator role can access all clinics
        if (userRole === UserRole.ADMINISTRATOR) {
          hasRequiredRole = true;
          break;
        }

        // For clinic_admin and therapist, they must have matching clinicId
        if (requestedClinicId && user.clinicId !== requestedClinicId) {
          continue;
        }

        // If no specific clinic requested, user must have a clinic assigned
        if (!requestedClinicId && !user.clinicId) {
          continue;
        }

        // Check if the clinic actually exists in the database
        if (requestedClinicId) {
          const clinic = await this.em.findOne(Clinic, { id: requestedClinicId });
          if (!clinic) {
            throw new NotFoundException('Clinic not found');
          }
        }
      }

      hasRequiredRole = true;
      break;
    }

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'Insufficient permissions to access this resource',
      );
    }

    return true;
  }
}
