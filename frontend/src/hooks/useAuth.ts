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

  // Only check auth if explicitly needed (not on every mount)
  // The persistence layer will handle initial state
  useEffect(() => {
    // Only check if we have no user data and we're not authenticated 
    // This prevents the loader from showing unnecessarily
    if (!user && !isAuthenticated && !isLoading) {
      const timer = setTimeout(() => {
        checkAuth();
      }, 100); // Small delay to let persistence hydrate first
      
      return () => clearTimeout(timer);
    }
    // Return empty cleanup function if condition not met
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
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