/**
 * Unified status enums that mirror the backend status system
 */

// User Status (replaces both user.isActive and therapist.status)
export enum UserStatusEnum {
  PENDING = 'pending',                 // User registered but email not verified or setup not completed
  ACTIVE = 'active',                   // User can login and access the system
  INACTIVE = 'inactive',               // User access is blocked by clinic admin
  DELETED = 'deleted',                 // User account is deleted (system admin only)
}

// Clinic Status (replaces both clinic.status and clinic.isActive)
export enum ClinicStatusEnum {
  // Active states
  ACTIVE = 'active',                    // Clinic is operational and can access system
  PENDING = 'pending',                  // New clinic awaiting approval (can't access system yet)
  
  // Inactive states
  SUSPENDED = 'suspended',              // Clinic temporarily suspended (payment issues, etc.)
  INACTIVE = 'inactive',                // Clinic permanently closed or disabled
  
  // System states
  DISABLED = 'disabled',                // Clinic completely disabled from system access
}

/**
 * Helper functions for status management
 */
export class UserStatusHelper {
  /**
   * Check if user can login with this status
   */
  static canLogin(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.ACTIVE;
  }

  /**
   * Check if user is considered "active" (can perform their role)
   */
  static isActive(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.ACTIVE;
  }

  /**
   * Check if user is in a pending state (needs action)
   */
  static isPending(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.PENDING;
  }

  /**
   * Check if user is inactive (blocked by clinic admin)
   */
  static isInactive(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.INACTIVE;
  }

  /**
   * Check if user is deleted (system admin only)
   */
  static isDeleted(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.DELETED;
  }

  /**
   * Get display label for status
   */
  static getDisplayLabel(status: UserStatusEnum): string {
    const labels: Record<UserStatusEnum, string> = {
      [UserStatusEnum.PENDING]: 'Menunggu',
      [UserStatusEnum.ACTIVE]: 'Aktif',
      [UserStatusEnum.INACTIVE]: 'Tidak Aktif',
      [UserStatusEnum.DELETED]: 'Dihapus',
    };
    return labels[status] || status;
  }

  /**
   * Get badge variant for status
   */
  static getBadgeVariant(status: UserStatusEnum): 'success' | 'warning' | 'destructive' | 'info' | 'secondary' {
    switch (status) {
      case UserStatusEnum.ACTIVE:
        return 'success';
      case UserStatusEnum.PENDING:
        return 'warning';
      case UserStatusEnum.INACTIVE:
      case UserStatusEnum.DELETED:
        return 'destructive';
      default:
        return 'secondary';
    }
  }
}

export class ClinicStatusHelper {
  /**
   * Check if clinic can access the system
   */
  static canAccessSystem(status: ClinicStatusEnum): boolean {
    return status === ClinicStatusEnum.ACTIVE;
  }

  /**
   * Check if clinic is considered "active" (operational)
   */
  static isOperational(status: ClinicStatusEnum): boolean {
    return status === ClinicStatusEnum.ACTIVE;
  }

  /**
   * Check if clinic is in a pending/approval state
   */
  static isPending(status: ClinicStatusEnum): boolean {
    return status === ClinicStatusEnum.PENDING;
  }

  /**
   * Check if clinic is completely inactive
   */
  static isInactive(status: ClinicStatusEnum): boolean {
    return status === ClinicStatusEnum.INACTIVE || 
           status === ClinicStatusEnum.SUSPENDED || 
           status === ClinicStatusEnum.DISABLED;
  }

  /**
   * Check if clinic is suspended (temporary)
   */
  static isSuspended(status: ClinicStatusEnum): boolean {
    return status === ClinicStatusEnum.SUSPENDED;
  }

  /**
   * Get display label for status
   */
  static getDisplayLabel(status: ClinicStatusEnum): string {
    const labels: Record<ClinicStatusEnum, string> = {
      [ClinicStatusEnum.ACTIVE]: 'Aktif',
      [ClinicStatusEnum.PENDING]: 'Menunggu Persetujuan',
      [ClinicStatusEnum.SUSPENDED]: 'Ditahan',
      [ClinicStatusEnum.INACTIVE]: 'Tidak Aktif',
      [ClinicStatusEnum.DISABLED]: 'Dinonaktifkan',
    };
    return labels[status] || status;
  }

  /**
   * Get badge variant for status
   */
  static getBadgeVariant(status: ClinicStatusEnum): 'success' | 'warning' | 'destructive' | 'info' | 'secondary' {
    switch (status) {
      case ClinicStatusEnum.ACTIVE:
        return 'success';
      case ClinicStatusEnum.PENDING:
        return 'warning';
      case ClinicStatusEnum.SUSPENDED:
        return 'info';
      case ClinicStatusEnum.INACTIVE:
      case ClinicStatusEnum.DISABLED:
        return 'destructive';
      default:
        return 'secondary';
    }
  }
}

// Status options for UI components
export const USER_STATUS_OPTIONS = [
  { value: UserStatusEnum.PENDING, label: 'Menunggu', color: 'yellow' },
  { value: UserStatusEnum.ACTIVE, label: 'Aktif', color: 'green' },
  { value: UserStatusEnum.INACTIVE, label: 'Tidak Aktif', color: 'red' },
  { value: UserStatusEnum.DELETED, label: 'Dihapus', color: 'gray' },
] as const;

export const CLINIC_STATUS_OPTIONS = [
  { value: ClinicStatusEnum.ACTIVE, label: 'Aktif', color: 'green' },
  { value: ClinicStatusEnum.PENDING, label: 'Menunggu Persetujuan', color: 'yellow' },
  { value: ClinicStatusEnum.SUSPENDED, label: 'Ditahan', color: 'blue' },
  { value: ClinicStatusEnum.INACTIVE, label: 'Tidak Aktif', color: 'gray' },
  { value: ClinicStatusEnum.DISABLED, label: 'Dinonaktifkan', color: 'red' },
] as const;
