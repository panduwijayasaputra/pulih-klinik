import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { getPrimaryRole, hasAnyRole, hasRole } from '@/lib/api';

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
    checkAuth,
  } = useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
    checkAuth,
    // Helper functions
    hasRole: (role: string) => hasRole(user, role),
    hasAnyRole: (roles: string[]) => hasAnyRole(user, roles),
    getPrimaryRole: () => getPrimaryRole(user),
    isAdmin: () => hasRole(user, 'administrator'),
    isClinicAdmin: () => hasRole(user, 'clinic_admin'),
    isTherapist: () => hasRole(user, 'therapist'),
    isMultiRole: () => (user?.roles.length ?? 0) > 1,
  };
};