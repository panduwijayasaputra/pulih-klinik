import { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { AuthAPI } from '@/lib/api/auth';
import { LoginApiData, User, Clinic } from '@/types/auth';

export const useAuth = () => {
  const {
    user,
    clinic,
    error,
    isAuthenticated,
    accessToken,
    refreshToken,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    clearError,
    setLoading,
    setError,
    setUser,
    setClinic,
    setTokens,
    updateTokens,
    isDataStale,
    setLastValidated,
    hasRole: storeHasRole,
    isAdmin: storeIsAdmin,
    isClinicAdmin: storeIsClinicAdmin,
    isTherapist: storeIsTherapist,
    needsOnboarding: storeNeedsOnboarding,
  } = useAuthStore();

  // Local loading states for specific operations
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);

  // Auto-validate auth state on page focus/refresh
  useEffect(() => {
    const validateOnFocus = (): void => {
      if (isAuthenticated && accessToken && isDataStale()) {
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
  }, [isAuthenticated, accessToken, isDataStale]);

  // Login function with direct API call
  const login = useCallback(async (credentials: LoginApiData): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      setError(null);
      
      const response = await AuthAPI.login(credentials);
      
      if (response.success && response.user && response.accessToken && response.refreshToken) {
        // Extract clinic data from user if available
        const clinicData: Clinic | undefined = response.user.clinicId ? {
          id: response.user.clinicId,
          name: response.user.clinicName || '',
          isActive: true,
          subscription: response.user.subscriptionTier,
        } : undefined;

        storeLogin({
          user: response.user,
          clinic: clinicData,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  }, [storeLogin, setError]);

  // Logout function with direct API call
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      setError(null);
      
      await AuthAPI.logout();
    } catch (error: any) {
      // Even if API call fails, we should still logout locally
      console.warn('Logout API call failed:', error);
    } finally {
      storeLogout();
      setIsLoggingOut(false);
    }
  }, [storeLogout, setError]);

  // Change password function
  const changePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsChangingPassword(true);
      setError(null);
      
      const response = await AuthAPI.changePassword(currentPassword, newPassword, confirmPassword);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Password change failed');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsChangingPassword(false);
    }
  }, [setError]);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsSendingForgotPassword(true);
      setError(null);
      
      const response = await AuthAPI.forgotPassword(email);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to send reset email');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsSendingForgotPassword(false);
    }
  }, [setError]);

  // Reset password function
  const resetPassword = useCallback(async (
    token: string, 
    password: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsResettingPassword(true);
      setError(null);
      
      const response = await AuthAPI.resetPassword(token, password, confirmPassword);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Password reset failed');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsResettingPassword(false);
    }
  }, [setError]);

  // Refresh auth token function
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsRefreshingToken(true);
      setError(null);
      
      const response = await AuthAPI.refreshToken();
      
      if (response.success && response.data) {
        updateTokens(response.data.accessToken, response.data.refreshToken);
        return true;
      } else {
        setError('Failed to refresh token');
        return false;
      }
    } catch (error: any) {
      setError('Failed to refresh token');
      return false;
    } finally {
      setIsRefreshingToken(false);
    }
  }, [updateTokens, setError]);

  // Check auth status by fetching current user
  const checkAuth = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !accessToken) return;

    try {
      setLoading(true);
      const response = await AuthAPI.getCurrentUser();
      
      if (response.success && response.data) {
        const serverUser = response.data;
        const storedUser = user;
        
        // Check if critical user data has changed (clinic removed, etc.)
        const clinicChanged = storedUser?.clinicId && !serverUser.clinicId;
        const subscriptionChanged = storedUser?.subscriptionTier && !serverUser.subscriptionTier;
        
        if (clinicChanged || subscriptionChanged) {
          // Critical data removed from server, logout user
          storeLogout();
          return;
        }
        
        // Update user data
        setUser(serverUser);
        
        // Update clinic data if available
        if (serverUser.clinicId) {
          const clinicData: Clinic = {
            id: serverUser.clinicId,
            name: serverUser.clinicName || '',
            isActive: true,
            subscription: serverUser.subscriptionTier,
          };
          setClinic(clinicData);
        } else {
          setClinic(null);
        }
        
        setLastValidated(new Date());
      } else {
        // Server says user is invalid, logout
        storeLogout();
      }
    } catch (error: any) {
      // If auth fails, logout user
      if (error.response?.status === 401 || error.response?.status === 404) {
        storeLogout();
      } else {
        setError('Failed to validate auth status');
      }
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated, 
    accessToken, 
    user, 
    storeLogout, 
    setUser, 
    setClinic, 
    setLastValidated, 
    setLoading, 
    setError
  ]);

  // Helper functions using store methods
  const hasRole = useCallback((role: string): boolean => {
    return storeHasRole(role);
  }, [storeHasRole]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return roles.some(role => storeHasRole(role));
  }, [storeHasRole]);

  const getPrimaryRole = useCallback((): string | null => {
    if (!user?.roles || user.roles.length === 0) return null;
    
    // Priority order: Administrator > ClinicAdmin > Therapist
    const rolePriority = ['administrator', 'clinic_admin', 'therapist'];
    
    for (const priorityRole of rolePriority) {
      if (user.roles.includes(priorityRole as any)) {
        return priorityRole;
      }
    }
    
    return user.roles[0] || null;
  }, [user]);

  const isMultiRole = useCallback((): boolean => {
    return (user?.roles.length ?? 0) > 1;
  }, [user]);

  return {
    // Auth state
    user,
    clinic,
    isLoading: isLoading || isLoggingIn || isLoggingOut || isRefreshingToken,
    error,
    isAuthenticated,
    accessToken,
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
    
    // Loading states for specific operations
    isLoggingIn,
    isLoggingOut,
    isChangingPassword,
    isSendingForgotPassword,
    isResettingPassword,
    isRefreshingToken,
    
    // Helper functions
    hasRole,
    hasAnyRole,
    getPrimaryRole,
    isAdmin: storeIsAdmin,
    isClinicAdmin: storeIsClinicAdmin,
    isTherapist: storeIsTherapist,
    isMultiRole,
    needsOnboarding: storeNeedsOnboarding,
  };
};