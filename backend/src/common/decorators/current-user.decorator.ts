import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../../auth/jwt.strategy';

/**
 * Enhanced decorator to extract the current authenticated user from the request
 * This is a common version that can be used throughout the application
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
 * Extract the current user's ID
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Extract the current user's email
 */
export const CurrentUserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.email;
  },
);

/**
 * Extract the current user's clinic IDs
 * Returns empty array for administrators (no restriction)
 */
export const CurrentUserClinicIds = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user || !user.roles) {
      return [];
    }

    // Administrators can access all clinics, return empty array to indicate no restriction
    if (user.roles.some((role) => role.role === 'administrator')) {
      return [];
    }

    // Extract unique clinic IDs from user roles
    const clinicIds = user.roles
      .map((role) => role.clinicId)
      .filter((id): id is string => id !== undefined);

    return [...new Set(clinicIds)];
  },
);

/**
 * Check if current user has a specific role
 */
export const HasRole = createParamDecorator(
  (requiredRole: string, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some((role) => role.role === requiredRole);
  },
);

/**
 * Check if current user is an administrator
 */
export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some((role) => role.role === 'administrator');
  },
);

/**
 * Check if current user has access to a specific clinic
 */
export const CanAccessClinic = createParamDecorator(
  (clinicId: string, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user || !user.roles) {
      return false;
    }

    // Administrators can access all clinics
    if (user.roles.some((role) => role.role === 'administrator')) {
      return true;
    }

    // Check if user has a role in the specific clinic
    return user.roles.some((role) => role.clinicId === clinicId);
  },
);
