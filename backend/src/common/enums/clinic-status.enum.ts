/**
 * Unified clinic status enum that covers both business and system access control
 * This replaces both clinic.status and clinic.isActive
 */
export enum ClinicStatus {
  // Active states
  ACTIVE = 'active', // Clinic is operational and can access system
  PENDING = 'pending', // New clinic awaiting approval (can't access system yet)

  // Inactive states
  SUSPENDED = 'suspended', // Clinic temporarily suspended (payment issues, etc.)
  INACTIVE = 'inactive', // Clinic permanently closed or disabled

  // System states
  DISABLED = 'disabled', // Clinic completely disabled from system access
}

/**
 * Helper functions for clinic status management
 */
export class ClinicStatusHelper {
  /**
   * Check if clinic can access the system
   */
  static canAccessSystem(status: ClinicStatus): boolean {
    return status === ClinicStatus.ACTIVE;
  }

  /**
   * Check if clinic is considered "active" (operational)
   */
  static isOperational(status: ClinicStatus): boolean {
    return status === ClinicStatus.ACTIVE;
  }

  /**
   * Check if clinic is in a pending/approval state
   */
  static isPending(status: ClinicStatus): boolean {
    return status === ClinicStatus.PENDING;
  }

  /**
   * Check if clinic is completely inactive
   */
  static isInactive(status: ClinicStatus): boolean {
    return (
      status === ClinicStatus.INACTIVE ||
      status === ClinicStatus.SUSPENDED ||
      status === ClinicStatus.DISABLED
    );
  }

  /**
   * Check if clinic is suspended (temporary)
   */
  static isSuspended(status: ClinicStatus): boolean {
    return status === ClinicStatus.SUSPENDED;
  }

  /**
   * Get display label for status
   */
  static getDisplayLabel(status: ClinicStatus): string {
    const labels: Record<ClinicStatus, string> = {
      [ClinicStatus.ACTIVE]: 'Aktif',
      [ClinicStatus.PENDING]: 'Menunggu Persetujuan',
      [ClinicStatus.SUSPENDED]: 'Ditahan',
      [ClinicStatus.INACTIVE]: 'Tidak Aktif',
      [ClinicStatus.DISABLED]: 'Dinonaktifkan',
    };
    return labels[status] || status;
  }

  /**
   * Get badge variant for status
   */
  static getBadgeVariant(
    status: ClinicStatus,
  ): 'success' | 'warning' | 'destructive' | 'info' | 'secondary' {
    switch (status) {
      case ClinicStatus.ACTIVE:
        return 'success';
      case ClinicStatus.PENDING:
        return 'warning';
      case ClinicStatus.SUSPENDED:
        return 'info';
      case ClinicStatus.INACTIVE:
      case ClinicStatus.DISABLED:
        return 'destructive';
      default:
        return 'secondary';
    }
  }
}
