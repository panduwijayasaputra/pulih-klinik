/**
 * Unified status enums that mirror the backend status system
 */

// User Status (replaces both user.isActive and therapist.status)
export enum UserStatusEnum {
  // Active states
  ACTIVE = 'active',                    // User can login and is fully functional
  ON_LEAVE = 'on_leave',               // User is temporarily unavailable (therapist specific)
  
  // Inactive states
  INACTIVE = 'inactive',               // User cannot login (replaces isActive: false)
  SUSPENDED = 'suspended',             // User account is suspended (disciplinary)
  
  // Setup states
  PENDING_SETUP = 'pending_setup',     // User needs to complete setup (therapist specific)
  PENDING_VERIFICATION = 'pending_verification', // User needs to verify email
  
  // System states
  DISABLED = 'disabled',               // User account is disabled by admin
  DELETED = 'deleted',                 // User account is soft deleted
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
    return status === UserStatusEnum.ACTIVE || status === UserStatusEnum.ON_LEAVE;
  }

  /**
   * Check if user is in a setup/verification state
   */
  static needsSetup(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.PENDING_SETUP || status === UserStatusEnum.PENDING_VERIFICATION;
  }

  /**
   * Check if user is completely inactive
   */
  static isInactive(status: UserStatusEnum): boolean {
    return status === UserStatusEnum.INACTIVE || 
           status === UserStatusEnum.SUSPENDED || 
           status === UserStatusEnum.DISABLED;
  }

  /**
   * Get display label for status
   */
  static getDisplayLabel(status: UserStatusEnum): string {
    const labels: Record<UserStatusEnum, string> = {
      [UserStatusEnum.ACTIVE]: 'Aktif',
      [UserStatusEnum.ON_LEAVE]: 'Cuti',
      [UserStatusEnum.INACTIVE]: 'Tidak Aktif',
      [UserStatusEnum.SUSPENDED]: 'Ditahan',
      [UserStatusEnum.PENDING_SETUP]: 'Menunggu Setup',
      [UserStatusEnum.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
      [UserStatusEnum.DISABLED]: 'Dinonaktifkan',
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
      case UserStatusEnum.ON_LEAVE:
        return 'info';
      case UserStatusEnum.PENDING_SETUP:
      case UserStatusEnum.PENDING_VERIFICATION:
        return 'warning';
      case UserStatusEnum.INACTIVE:
      case UserStatusEnum.SUSPENDED:
      case UserStatusEnum.DISABLED:
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
  { value: UserStatusEnum.ACTIVE, label: 'Aktif', color: 'green' },
  { value: UserStatusEnum.ON_LEAVE, label: 'Cuti', color: 'blue' },
  { value: UserStatusEnum.INACTIVE, label: 'Tidak Aktif', color: 'gray' },
  { value: UserStatusEnum.SUSPENDED, label: 'Ditahan', color: 'red' },
  { value: UserStatusEnum.PENDING_SETUP, label: 'Menunggu Setup', color: 'yellow' },
  { value: UserStatusEnum.PENDING_VERIFICATION, label: 'Menunggu Verifikasi', color: 'yellow' },
  { value: UserStatusEnum.DISABLED, label: 'Dinonaktifkan', color: 'red' },
] as const;

export const CLINIC_STATUS_OPTIONS = [
  { value: ClinicStatusEnum.ACTIVE, label: 'Aktif', color: 'green' },
  { value: ClinicStatusEnum.PENDING, label: 'Menunggu Persetujuan', color: 'yellow' },
  { value: ClinicStatusEnum.SUSPENDED, label: 'Ditahan', color: 'blue' },
  { value: ClinicStatusEnum.INACTIVE, label: 'Tidak Aktif', color: 'gray' },
  { value: ClinicStatusEnum.DISABLED, label: 'Dinonaktifkan', color: 'red' },
] as const;
