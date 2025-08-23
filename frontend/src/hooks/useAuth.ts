import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { getPrimaryRole, hasAnyRole, hasRole } from '@/lib/api/auth';

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

  // Let Zustand persistence handle the initial state
  // Only call checkAuth if we need to validate the session with the server
  useEffect(() => {
    // Don't call checkAuth on mount - let persistence handle it
    // checkAuth should only be called when we need to validate with the server
  }, []);

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