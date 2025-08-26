import { SetMetadata } from '@nestjs/common';
import { RequiredRole } from '../guards/roles.guard';
import { UserRole } from '../../common/enums';

export const ROLES_KEY = 'roles';

/**
 * Decorator to set required roles for route handlers
 * @param roles Array of required roles with optional clinic scope
 *
 * @example
 * @Roles([{ role: UserRole.ADMINISTRATOR }])
 *
 * @example
 * @Roles([{ role: UserRole.CLINIC_ADMIN, requireClinicScope: true }])
 *
 * @example
 * @Roles([
 *   { role: UserRole.ADMINISTRATOR },
 *   { role: UserRole.CLINIC_ADMIN, requireClinicScope: true }
 * ])
 */
export const Roles = (...roles: RequiredRole[]) =>
  SetMetadata(ROLES_KEY, roles);

/**
 * Convenience decorator for administrator-only endpoints
 */
export const AdminOnly = () => Roles({ role: UserRole.ADMINISTRATOR });

/**
 * Convenience decorator for clinic admin endpoints with clinic scope
 */
export const ClinicAdminOnly = () =>
  Roles({ role: UserRole.CLINIC_ADMIN, requireClinicScope: true });

/**
 * Convenience decorator for therapist endpoints with clinic scope
 */
export const TherapistOnly = () =>
  Roles({ role: UserRole.THERAPIST, requireClinicScope: true });

/**
 * Convenience decorator for clinic admin or therapist (both with clinic scope)
 */
export const ClinicStaffOnly = () =>
  Roles(
    { role: UserRole.CLINIC_ADMIN, requireClinicScope: true },
    { role: UserRole.THERAPIST, requireClinicScope: true },
  );

/**
 * Convenience decorator for any clinic role (admin can access without scope)
 */
export const ClinicAccess = () =>
  Roles(
    { role: UserRole.ADMINISTRATOR },
    { role: UserRole.CLINIC_ADMIN, requireClinicScope: true },
    { role: UserRole.THERAPIST, requireClinicScope: true },
  );
