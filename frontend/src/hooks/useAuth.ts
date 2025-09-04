import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { getPrimaryRole, hasAnyRole, hasRole } from '@/lib/api/auth';
import { 
  useCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation 
} from './queries/useAuthQueries';
import { LoginApiData } from '@/types/auth';

export const useAuth = () => {
  const {
    user,
    error,
    isAuthenticated,
    token,
    refreshToken,
    login: storeLogin,
    logout: storeLogout,
    clearError,
    setLoading,
    setError,
  } = useAuthStore();

  // React Query hooks
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const refreshTokenMutation = useRefreshTokenMutation();
  
  // Current user query - only enabled if we have a token and are authenticated
  const currentUserQuery = useCurrentUserQuery({
    enabled: isAuthenticated && !!token,
  });

  // Sync React Query loading state with Zustand store
  useEffect(() => {
    const isLoading = loginMutation.isPending || 
                     logoutMutation.isPending || 
                     currentUserQuery.isLoading ||
                     refreshTokenMutation.isPending;
    setLoading(isLoading);
  }, [
    loginMutation.isPending, 
    logoutMutation.isPending,
    currentUserQuery.isLoading,
    refreshTokenMutation.isPending,
    setLoading
  ]);

  // Sync React Query errors with Zustand store
  useEffect(() => {
    const queryError = loginMutation.error || 
                      logoutMutation.error || 
                      currentUserQuery.error ||
                      changePasswordMutation.error ||
                      forgotPasswordMutation.error ||
                      resetPasswordMutation.error ||
                      refreshTokenMutation.error;
    
    if (queryError) {
      setError(queryError.message);
    }
  }, [
    loginMutation.error,
    logoutMutation.error,
    currentUserQuery.error,
    changePasswordMutation.error,
    forgotPasswordMutation.error,
    resetPasswordMutation.error,
    refreshTokenMutation.error,
    setError
  ]);

  // Auto-validate auth state on page focus/refresh
  useEffect(() => {
    const validateOnFocus = () => {
      if (isAuthenticated && token) {
        checkAuth();
      }
    };

    // Check auth state when page becomes visible
    window.addEventListener('focus', validateOnFocus);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        validateOnFocus();
      }
    });

    // Initial check on mount
    validateOnFocus();

    return () => {
      window.removeEventListener('focus', validateOnFocus);
      window.removeEventListener('visibilitychange', validateOnFocus);
    };
  }, [isAuthenticated, token]);

  // Wrapper functions that use React Query mutations
  const login = async (credentials: LoginApiData): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    return changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
      confirmPassword
    });
  };

  const forgotPassword = async (email: string) => {
    return forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    return resetPasswordMutation.mutateAsync({
      token,
      password,
      confirmPassword
    });
  };

  const refreshAuthToken = async () => {
    return refreshTokenMutation.mutateAsync();
  };

  // Check auth status by refetching current user
  const checkAuth = async (): Promise<void> => {
    if (isAuthenticated && token) {
      try {
        const result = await currentUserQuery.refetch();
        // If server returns user data, compare with stored data
        if (result.data?.data?.user) {
          const serverUser = result.data.data.user;
          const storedUser = user;
          
          // Check if critical user data has changed (clinic removed, etc.)
          const clinicChanged = storedUser?.clinicId && !serverUser.clinicId;
          const subscriptionChanged = storedUser?.subscriptionTier && !serverUser.subscriptionTier;
          
          if (clinicChanged || subscriptionChanged) {
            // Critical data removed from server, logout user
            storeLogout();
            return;
          }
          
          // Update store with fresh server data
          storeLogin({
            user: serverUser,
            token: token,
            refreshToken: refreshToken || undefined,
          });
        } else if (result.data?.success === false) {
          // Server says user is invalid, logout
          storeLogout();
        }
      } catch (error: any) {
        // If auth fails, logout user
        if (error.response?.status === 401 || error.response?.status === 404) {
          storeLogout();
        }
      }
    }
  };

  return {
    // Auth state
    user,
    isLoading: loginMutation.isPending || 
               logoutMutation.isPending || 
               currentUserQuery.isLoading ||
               refreshTokenMutation.isPending,
    error,
    isAuthenticated,
    token,
    refreshToken,
    
    // Auth actions
    login,
    logout,
    clearError,
    checkAuth,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshAuthToken,
    
    // Mutation states for specific operations
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isSendingForgotPassword: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isRefreshingToken: refreshTokenMutation.isPending,
    
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