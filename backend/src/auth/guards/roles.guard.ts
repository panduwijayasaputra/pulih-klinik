import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '../jwt.strategy';
import { UserRole, UserRoleType } from '../../common/enums';

export interface RequiredRole {
  role: UserRoleType;
  requireClinicScope?: boolean;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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
    const hasRequiredRole = requiredRoles.some((requiredRole) => {
      const userRole = user.roles.find(
        (role) => role.role === requiredRole.role,
      );

      if (!userRole) {
        return false;
      }

      // If clinic scope is required, check if user has clinic access
      if (requiredRole.requireClinicScope) {
        const clinicIdFromParams = request.params?.clinicId;
        const clinicIdFromQuery = request.query?.clinicId;
        const requestedClinicId = clinicIdFromParams || clinicIdFromQuery;

        // Administrator role can access all clinics
        if (userRole.role === UserRole.ADMINISTRATOR) {
          return true;
        }

        // For clinic_admin and therapist, they must have matching clinicId
        if (requestedClinicId && userRole.clinicId !== requestedClinicId) {
          return false;
        }

        // If no specific clinic requested, user must have a clinic assigned
        if (!requestedClinicId && !userRole.clinicId) {
          return false;
        }
      }

      return true;
    });

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'Insufficient permissions to access this resource',
      );
    }

    return true;
  }
}
