import { SetMetadata } from '@nestjs/common';
import { RequiredRole } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

/**
 * Decorator to set required roles for route handlers
 * @param roles Array of required roles with optional clinic scope
 *
 * @example
 * @Roles([{ role: 'administrator' }])
 *
 * @example
 * @Roles([{ role: 'clinic_admin', requireClinicScope: true }])
 *
 * @example
 * @Roles([
 *   { role: 'administrator' },
 *   { role: 'clinic_admin', requireClinicScope: true }
 * ])
 */
export const Roles = (...roles: RequiredRole[]) =>
  SetMetadata(ROLES_KEY, roles);

/**
 * Convenience decorator for administrator-only endpoints
 */
export const AdminOnly = () => Roles({ role: 'administrator' });

/**
 * Convenience decorator for clinic admin endpoints with clinic scope
 */
export const ClinicAdminOnly = () =>
  Roles({ role: 'clinic_admin', requireClinicScope: true });

/**
 * Convenience decorator for therapist endpoints with clinic scope
 */
export const TherapistOnly = () =>
  Roles({ role: 'therapist', requireClinicScope: true });

/**
 * Convenience decorator for clinic admin or therapist (both with clinic scope)
 */
export const ClinicStaffOnly = () =>
  Roles(
    { role: 'clinic_admin', requireClinicScope: true },
    { role: 'therapist', requireClinicScope: true },
  );

/**
 * Convenience decorator for any clinic role (admin can access without scope)
 */
export const ClinicAccess = () =>
  Roles(
    { role: 'administrator' },
    { role: 'clinic_admin', requireClinicScope: true },
    { role: 'therapist', requireClinicScope: true },
  );
