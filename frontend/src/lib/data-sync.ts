import { User, Clinic } from '@/types/auth';

export interface SyncResult {
  success: boolean;
  hasChanges: boolean;
  changes?: {
    userChanged: boolean;
    clinicChanged: boolean;
    subscriptionChanged: boolean;
  };
  error?: string;
}

export interface DataSyncOptions {
  forceSync: boolean;
  validateCriticalData: boolean;
  onDataChange?: ((changes: any) => void) | undefined;
  onCriticalChange?: ((changes: any) => void) | undefined;
}

/**
 * Compares two user objects and returns what has changed
 */
export const compareUserData = (oldUser: User | null, newUser: User | null) => {
  const defaultChanges = {
    userChanged: false,
    clinicChanged: false,
    subscriptionChanged: false,
  };

  if (!oldUser && !newUser) return { hasChanges: false, changes: defaultChanges };
  if (!oldUser || !newUser) return { hasChanges: true, changes: { ...defaultChanges, userChanged: true } };

  const changes = {
    userChanged: false,
    clinicChanged: false,
    subscriptionChanged: false,
  };

  // Check basic user data changes
  if (
    oldUser.id !== newUser.id ||
    oldUser.email !== newUser.email ||
    oldUser.name !== newUser.name ||
    oldUser.status !== newUser.status ||
    JSON.stringify(oldUser.roles) !== JSON.stringify(newUser.roles)
  ) {
    changes.userChanged = true;
  }

  // Check clinic data changes
  if (oldUser.clinicId !== newUser.clinicId || oldUser.clinicName !== newUser.clinicName) {
    changes.clinicChanged = true;
  }

  // Check subscription changes
  if (oldUser.subscriptionTier !== newUser.subscriptionTier) {
    changes.subscriptionChanged = true;
  }

  return {
    hasChanges: Object.values(changes).some(Boolean),
    changes,
  };
};

/**
 * Compares two clinic objects and returns what has changed
 */
export const compareClinicData = (oldClinic: Clinic | null, newClinic: Clinic | null) => {
  const defaultChanges = {
    clinicChanged: false,
    subscriptionChanged: false,
  };

  if (!oldClinic && !newClinic) return { hasChanges: false, changes: defaultChanges };
  if (!oldClinic || !newClinic) return { hasChanges: true, changes: { ...defaultChanges, clinicChanged: true } };

  const changes = {
    clinicChanged: false,
    subscriptionChanged: false,
  };

  // Check clinic data changes
  if (
    oldClinic.id !== newClinic.id ||
    oldClinic.name !== newClinic.name ||
    oldClinic.status !== newClinic.status
  ) {
    changes.clinicChanged = true;
  }

  // Check subscription changes
  if (oldClinic.subscriptionTier !== newClinic.subscriptionTier) {
    changes.subscriptionChanged = true;
  }

  return {
    hasChanges: Object.values(changes).some(Boolean),
    changes,
  };
};

/**
 * Validates if critical data has been removed (clinic deleted, subscription cancelled, etc.)
 */
export const validateCriticalData = (oldUser: User | null, newUser: User | null): boolean => {
  if (!oldUser || !newUser) return true;

  // Check if clinic was removed
  if (oldUser.clinicId && !newUser.clinicId) {
    console.warn('🚨 Critical data change: Clinic was removed');
    return false;
  }

  // Check if subscription was removed
  if (oldUser.subscriptionTier && !newUser.subscriptionTier) {
    console.warn('🚨 Critical data change: Subscription was removed');
    return false;
  }

  // Check if user was deactivated
  if (oldUser.status === 'active' && newUser.status !== 'active') {
    console.warn('🚨 Critical data change: User was deactivated');
    return false;
  }

  return true;
};

/**
 * Syncs user data with server data and handles changes
 */
export const syncUserData = (
  oldUser: User | null,
  newUser: User | null,
  oldClinic: Clinic | null,
  newClinic: Clinic | null,
  options: DataSyncOptions = { forceSync: false, validateCriticalData: true }
): SyncResult => {
  try {
    // Compare user data
    const userComparison = compareUserData(oldUser, newUser);
    const clinicComparison = compareClinicData(oldClinic, newClinic);

    const hasChanges = userComparison.hasChanges || clinicComparison.hasChanges;

    if (!hasChanges && !options.forceSync) {
      return {
        success: true,
        hasChanges: false,
      };
    }

    // Validate critical data if required
    if (options.validateCriticalData && !validateCriticalData(oldUser, newUser)) {
      return {
        success: false,
        hasChanges: true,
        error: 'Critical data has been removed from server',
      };
    }

    // Combine changes
    const changes = {
      userChanged: userComparison.changes?.userChanged || false,
      clinicChanged: (userComparison.changes?.clinicChanged || false) || (clinicComparison.changes?.clinicChanged || false),
      subscriptionChanged: (userComparison.changes?.subscriptionChanged || false) || (clinicComparison.changes?.subscriptionChanged || false),
    };

    // Notify about changes
    if (options.onDataChange && hasChanges) {
      options.onDataChange(changes);
    }

    // Check for critical changes
    const hasCriticalChanges = changes.clinicChanged || changes.subscriptionChanged;
    if (options.onCriticalChange && hasCriticalChanges) {
      options.onCriticalChange(changes);
    }

    return {
      success: true,
      hasChanges,
      changes,
    };
  } catch (error) {
    console.error('❌ Data sync failed:', error);
    return {
      success: false,
      hasChanges: false,
      error: error instanceof Error ? error.message : 'Unknown sync error',
    };
  }
};

/**
 * Creates a data sync handler for auth state
 */
export const createAuthDataSyncHandler = (
  onCriticalChange: (changes: any) => void,
  onDataChange?: (changes: any) => void
) => {
  return (oldUser: User | null, newUser: User | null, oldClinic: Clinic | null, newClinic: Clinic | null) => {
    return syncUserData(oldUser, newUser, oldClinic, newClinic, {
      forceSync: false,
      validateCriticalData: true,
      onDataChange,
      onCriticalChange,
    });
  };
};

/**
 * Debounces sync operations to prevent excessive API calls
 */
export const createDebouncedSync = (syncFn: () => Promise<void>, delay: number = 1000) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      syncFn();
      timeoutId = null;
    }, delay);
  };
};
