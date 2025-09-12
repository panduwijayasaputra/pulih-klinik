/**
 * Unified user status enum that covers all user types
 * This replaces both user.isActive and therapist.status
 */
export enum UserStatus {
  // Active states
  ACTIVE = 'active', // User can login and is fully functional
  ON_LEAVE = 'on_leave', // User is temporarily unavailable (therapist specific)

  // Inactive states
  INACTIVE = 'inactive', // User cannot login (replaces isActive: false)
  SUSPENDED = 'suspended', // User account is suspended (disciplinary)

  // Setup states
  PENDING_SETUP = 'pending_setup', // User needs to complete setup (therapist specific)
  PENDING_VERIFICATION = 'pending_verification', // User needs to verify email

  // System states
  DISABLED = 'disabled', // User account is disabled by admin
  DELETED = 'deleted', // User account is soft deleted
}

/**
 * Helper functions for status management
 */
export class UserStatusHelper {
  /**
   * Check if user can login with this status
   */
  static canLogin(status: UserStatus): boolean {
    return status === UserStatus.ACTIVE;
  }

  /**
   * Check if user is considered "active" (can perform their role)
   */
  static isActive(status: UserStatus): boolean {
    return status === UserStatus.ACTIVE || status === UserStatus.ON_LEAVE;
  }

  /**
   * Check if user is in a setup/verification state
   */
  static needsSetup(status: UserStatus): boolean {
    return (
      status === UserStatus.PENDING_SETUP ||
      status === UserStatus.PENDING_VERIFICATION
    );
  }

  /**
   * Check if user is completely inactive
   */
  static isInactive(status: UserStatus): boolean {
    return (
      status === UserStatus.INACTIVE ||
      status === UserStatus.SUSPENDED ||
      status === UserStatus.DISABLED
    );
  }

  /**
   * Get display label for status
   */
  static getDisplayLabel(status: UserStatus): string {
    const labels: Record<UserStatus, string> = {
      [UserStatus.ACTIVE]: 'Aktif',
      [UserStatus.ON_LEAVE]: 'Cuti',
      [UserStatus.INACTIVE]: 'Tidak Aktif',
      [UserStatus.SUSPENDED]: 'Ditahan',
      [UserStatus.PENDING_SETUP]: 'Menunggu Setup',
      [UserStatus.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
      [UserStatus.DISABLED]: 'Dinonaktifkan',
      [UserStatus.DELETED]: 'Dihapus',
    };
    return labels[status] || status;
  }

  /**
   * Get badge variant for status
   */
  static getBadgeVariant(
    status: UserStatus,
  ): 'success' | 'warning' | 'destructive' | 'info' | 'secondary' {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'success';
      case UserStatus.ON_LEAVE:
        return 'info';
      case UserStatus.PENDING_SETUP:
      case UserStatus.PENDING_VERIFICATION:
        return 'warning';
      case UserStatus.INACTIVE:
      case UserStatus.SUSPENDED:
      case UserStatus.DISABLED:
      case UserStatus.DELETED:
        return 'destructive';
      default:
        return 'secondary';
    }
  }
}
