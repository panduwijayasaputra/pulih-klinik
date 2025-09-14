/**
 * Unified user status enum that covers all user types
 * This replaces both user.isActive and therapist.status
 */
export enum UserStatus {
  PENDING = 'pending', // User registered but email not verified or setup not completed
  ACTIVE = 'active', // User can login and access the system
  INACTIVE = 'inactive', // User access is blocked by clinic admin
  DELETED = 'deleted', // User account is deleted (system admin only)
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
    return status === UserStatus.ACTIVE;
  }

  /**
   * Check if user is in a pending state (needs action)
   */
  static isPending(status: UserStatus): boolean {
    return status === UserStatus.PENDING;
  }

  /**
   * Check if user is inactive (blocked by clinic admin)
   */
  static isInactive(status: UserStatus): boolean {
    return status === UserStatus.INACTIVE;
  }

  /**
   * Check if user is deleted (system admin only)
   */
  static isDeleted(status: UserStatus): boolean {
    return status === UserStatus.DELETED;
  }

  /**
   * Get display label for status
   */
  static getDisplayLabel(status: UserStatus): string {
    const labels: Record<UserStatus, string> = {
      [UserStatus.PENDING]: 'Menunggu',
      [UserStatus.ACTIVE]: 'Aktif',
      [UserStatus.INACTIVE]: 'Tidak Aktif',
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
      case UserStatus.PENDING:
        return 'warning';
      case UserStatus.INACTIVE:
      case UserStatus.DELETED:
        return 'destructive';
      default:
        return 'secondary';
    }
  }
}
