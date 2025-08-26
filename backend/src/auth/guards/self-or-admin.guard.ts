import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthUser } from '../jwt.strategy';
import { UserRole } from '../../common/enums';

/**
 * Guard that allows users to access their own resources or admins to access any resources
 * Expects a 'userId' parameter in the route params
 */
@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;
    const requestedUserId = request.params?.userId;

    if (!user) {
      return false;
    }

    // Admin can access any user's data
    if (user.roles.some((role) => role.role === UserRole.ADMINISTRATOR)) {
      return true;
    }

    // Regular users can only access their own data
    if (user.id === requestedUserId) {
      return true;
    }

    throw new ForbiddenException('You can only access your own resources');
  }
}

/**
 * Guard that only allows users to access their own resources (no admin override)
 * Used for sensitive operations like password changes
 * Expects a 'userId' parameter in the route params
 */
@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;
    const requestedUserId = request.params?.userId;

    if (!user) {
      return false;
    }

    // Only allow access to own resources
    if (user.id === requestedUserId) {
      return true;
    }

    throw new ForbiddenException('You can only access your own resources');
  }
}

/**
 * Guard that allows users to access their own resources or clinic admins to access resources in their clinic
 * Expects both 'userId' and optionally 'clinicId' parameters in the route
 */
@Injectable()
export class SelfOrClinicAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;
    const requestedUserId = request.params?.userId;
    const requestedClinicId =
      request.params?.clinicId || request.query?.clinicId;

    if (!user) {
      return false;
    }

    // Admin can access any user's data
    if (user.roles.some((role) => role.role === UserRole.ADMINISTRATOR)) {
      return true;
    }

    // Users can access their own data
    if (user.id === requestedUserId) {
      return true;
    }

    // Clinic admin can access data within their clinic
    if (requestedClinicId) {
      const hasClinicAdminAccess = user.roles.some(
        (role) =>
          role.role === UserRole.CLINIC_ADMIN &&
          role.clinicId === requestedClinicId,
      );
      if (hasClinicAdminAccess) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You can only access your own resources or resources within your clinic',
    );
  }
}
