import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  SelfOrAdminGuard,
  SelfOnlyGuard,
  SelfOrClinicAdminGuard,
} from '../guards';
import { Roles } from './roles.decorator';
import { RequiredRole } from '../guards/roles.guard';
import { UserRole } from '../../common/enums';

/**
 * Combined decorator that applies JWT authentication and role authorization
 * This decorator automatically applies both JwtAuthGuard and RolesGuard
 *
 * @param roles Required roles for the endpoint
 * @example
 * @RequireRole({ role: UserRole.ADMINISTRATOR })
 * @RequireRole({ role: UserRole.CLINIC_ADMIN, requireClinicScope: true })
 */
export const RequireRole = (...roles: RequiredRole[]) =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));

/**
 * Decorator that requires the user to be an administrator
 * Combines JWT auth + admin role validation
 */
export const RequireAdmin = () => RequireRole({ role: UserRole.ADMINISTRATOR });

/**
 * Decorator that requires the user to be a clinic admin with clinic scope
 * Combines JWT auth + clinic admin role validation + clinic scope check
 */
export const RequireClinicAdmin = () =>
  RequireRole({ role: UserRole.CLINIC_ADMIN, requireClinicScope: true });

/**
 * Decorator that requires the user to be a therapist with clinic scope
 * Combines JWT auth + therapist role validation + clinic scope check
 */
export const RequireTherapist = () =>
  RequireRole({ role: UserRole.THERAPIST, requireClinicScope: true });

/**
 * Decorator that allows clinic admin or therapist access (both with clinic scope)
 * Combines JWT auth + role validation for clinic staff
 */
export const RequireClinicStaff = () =>
  RequireRole(
    { role: UserRole.CLINIC_ADMIN, requireClinicScope: true },
    { role: UserRole.THERAPIST, requireClinicScope: true },
  );

/**
 * Decorator that allows any clinic role access
 * Admin can access without scope, others need clinic scope
 */
export const RequireClinicAccess = () =>
  RequireRole(
    { role: UserRole.ADMINISTRATOR },
    { role: UserRole.CLINIC_ADMIN, requireClinicScope: true },
    { role: UserRole.THERAPIST, requireClinicScope: true },
  );

/**
 * Decorator that allows admin or clinic admin access
 * Admin has global access, clinic admin needs clinic scope
 */
export const RequireAdminOrClinicAdmin = () =>
  RequireRole(
    { role: UserRole.ADMINISTRATOR },
    { role: UserRole.CLINIC_ADMIN, requireClinicScope: true },
  );

/**
 * Decorator that allows access to own resources or admin override
 * Used for endpoints where users can access their own data or admins can access any
 * Note: Additional logic needed in controller to check if user is accessing own data
 */
export const RequireSelfOrAdmin = () =>
  RequireRole(
    { role: UserRole.ADMINISTRATOR },
    { role: UserRole.CLINIC_ADMIN },
    { role: UserRole.THERAPIST },
  );

/**
 * Decorator that requires any authenticated user (any role)
 * Just applies JWT authentication without role restrictions
 */
export const RequireAuth = () => applyDecorators(UseGuards(JwtAuthGuard));

/**
 * Decorator that allows users to access their own resources or admins to access any
 * Expects a 'userId' parameter in the route
 * Combines JWT auth + self-or-admin access validation
 */
export const RequireSelfOrAdminAccess = () =>
  applyDecorators(UseGuards(JwtAuthGuard, SelfOrAdminGuard));

/**
 * Decorator that only allows users to access their own resources (no admin override)
 * Used for sensitive operations like password changes
 * Expects a 'userId' parameter in the route
 * Combines JWT auth + self-only access validation
 */
export const RequireSelfOnlyAccess = () =>
  applyDecorators(UseGuards(JwtAuthGuard, SelfOnlyGuard));

/**
 * Decorator that allows users to access their own resources or clinic admins to access resources in their clinic
 * Expects 'userId' and optionally 'clinicId' parameters in the route
 * Combines JWT auth + self-or-clinic-admin access validation
 */
export const RequireSelfOrClinicAdminAccess = () =>
  applyDecorators(UseGuards(JwtAuthGuard, SelfOrClinicAdminGuard));
