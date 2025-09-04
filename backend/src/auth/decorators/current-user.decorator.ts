import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../jwt.strategy';
import { UserRole } from '../../common/enums';

/**
 * Decorator to extract the current authenticated user from the request
 *
 * @example
 * async getProfile(@CurrentUser() user: AuthUser) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Decorator to extract the current user's ID
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Decorator to extract the current user's clinic IDs
 */
export const CurrentUserClinicIds = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user || !user.roles) {
      return [];
    }

    // Administrators can access all clinics, return empty array to indicate no restriction
    if (user.roles.some((role) => role === UserRole.ADMINISTRATOR)) {
      return [];
    }

    // Return user's clinic ID
    return user.clinicId ? [user.clinicId] : [];
  },
);
