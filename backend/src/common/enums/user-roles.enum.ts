/**
 * User roles enum for type safety and consistency across the application
 *
 * @enum {string}
 */
export enum UserRole {
  /** System administrator with full access */
  ADMINISTRATOR = 'administrator',

  /** Clinic administrator with clinic-specific management permissions */
  CLINIC_ADMIN = 'clinic_admin',

  /** Therapist with client and session management permissions within assigned clinics */
  THERAPIST = 'therapist',
}

/**
 * Type alias for user role values
 */
export type UserRoleType = `${UserRole}`;

/**
 * Array of all available user roles for validation
 */
export const USER_ROLES = Object.values(UserRole) as UserRoleType[];

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY = {
  [UserRole.ADMINISTRATOR]: 3,
  [UserRole.CLINIC_ADMIN]: 2,
  [UserRole.THERAPIST]: 1,
} as const;

/**
 * Check if a role has at least the required level
 */
export function hasRoleLevel(
  userRole: UserRoleType,
  requiredRole: UserRoleType,
): boolean {
  return (
    ROLE_HIERARCHY[userRole as UserRole] >=
    ROLE_HIERARCHY[requiredRole as UserRole]
  );
}

/**
 * Get all roles that have at least the specified level
 */
export function getRolesWithMinLevel(minRole: UserRoleType): UserRoleType[] {
  const minLevel = ROLE_HIERARCHY[minRole as UserRole];
  return USER_ROLES.filter(
    (role) => ROLE_HIERARCHY[role as UserRole] >= minLevel,
  );
}
