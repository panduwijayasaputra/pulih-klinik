import { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { AuthAPI } from '@/lib/api/auth';
import { LoginApiData, User, Clinic } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';
import { withRetry, classifyNetworkError, createUserFriendlyErrorMessage, setupNetworkStatusListener } from '@/lib/network-error-handler';
import { createAuthDataSyncHandler } from '@/lib/data-sync';

// Helper function to determine redirect path based on user role and state
const getRedirectPath = (user: User, clinic: Clinic | undefined): string | null => {
  // System Admin users → redirect to /portal
  if (user.roles.includes(UserRoleEnum.Administrator)) {
    return '/portal';
  }
  
  // Therapist users → redirect to /portal
  if (user.roles.includes(UserRoleEnum.Therapist)) {
    return '/portal';
  }
  
  // Clinic Admin users
  if (user.roles.includes(UserRoleEnum.ClinicAdmin)) {
    // If user doesn't have clinic data or subscription → redirect to onboarding
    if (!clinic || !clinic.subscription) {
      return '/onboarding';
    }
    
    // If user has complete clinic and subscription data → redirect to /portal
    return '/portal';
  }
  
  // Default fallback
  return '/portal';
};

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
  const [isOnline, setIsOnline] = useState(true);

  // Refresh auth token function with enhanced error handling
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsRefreshingToken(true);
      setError(null);
      
      console.log('🔄 Attempting to refresh auth token...');
      const response = await AuthAPI.refreshToken();
      
      if (response.success && response.data) {
        updateTokens(response.data.accessToken, response.data.refreshToken);
        console.log('✅ Token refresh successful');
        return true;
      } else {
        console.error('❌ Token refresh failed: Invalid response');
        setError('Failed to refresh token');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      
      // Handle different types of refresh token errors
      if (error.response?.status === 401) {
        // Refresh token is invalid or expired - logout user
        console.warn('🚨 Refresh token invalid, logging out');
        storeLogout();
        setError('Session expired. Please log in again.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        // Network error - don't logout, just show error
        setError('Network error: Unable to refresh token');
      } else {
        // Other server errors
        setError('Failed to refresh token');
      }
      return false;
    } finally {
      setIsRefreshingToken(false);
    }
  }, [updateTokens, setError, storeLogout]);

  // Check auth status by fetching current user with enhanced retry logic and data sync
  const checkAuth = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !accessToken) return;

    try {
      setLoading(true);
      
      // Use retry logic for the API call
      const response = await withRetry(
        () => AuthAPI.getCurrentUser(),
        { maxRetries: 3, baseDelay: 1000, maxDelay: 5000, backoffMultiplier: 2 },
        (attempt, error) => {
          console.log(`🔄 Auth validation retry ${attempt}: ${error.message}`);
        }
      );
      
      if (response.success && response.data) {
        const serverUser = response.data;
        const storedUser = user;
        const storedClinic = clinic;
        
        // Create data sync handler
        const syncHandler = createAuthDataSyncHandler(
          (changes) => {
            // Critical data change - logout user
            console.warn('🚨 Critical data change detected, logging out:', changes);
            storeLogout();
          },
          (changes) => {
            // Regular data change - log for debugging
            console.log('📊 User data updated:', changes);
          }
        );
        
        // Sync data and handle changes
        const syncResult = syncHandler(storedUser, serverUser, storedClinic, null);
        
        if (!syncResult.success) {
          console.error('❌ Data sync failed:', syncResult.error);
          setError(syncResult.error || 'Failed to sync user data');
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
            ...(serverUser.subscriptionTier && { subscription: serverUser.subscriptionTier }),
          };
          setClinic(clinicData);
        } else {
          setClinic(null);
        }
        
        setLastValidated(new Date());
        console.log('✅ Auth validation and data sync successful');
      } else {
        // Server says user is invalid, logout
        console.warn('🚨 Server says user is invalid, logging out');
        storeLogout();
      }
    } catch (error: any) {
      console.error('❌ Auth validation failed:', error);
      
      const networkError = classifyNetworkError(error);
      const userMessage = createUserFriendlyErrorMessage(networkError);
      
      // Handle different types of errors
      if (error.response?.status === 401 || error.response?.status === 404) {
        // Unauthorized or not found - user is invalid
        console.warn('🚨 User unauthorized, logging out');
        storeLogout();
      } else {
        // Other errors - show user-friendly message
        setError(userMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated, 
    accessToken, 
    user, 
    clinic,
    storeLogout, 
    setUser, 
    setClinic, 
    setLastValidated, 
    setLoading, 
    setError
  ]);

  // Network status monitoring
  useEffect(() => {
    const cleanup = setupNetworkStatusListener(
      () => {
        setIsOnline(true);
        // Re-validate auth when coming back online
        if (isAuthenticated && accessToken && isDataStale()) {
          checkAuth();
        }
      },
      () => {
        setIsOnline(false);
        setError('Tidak ada koneksi internet. Beberapa fitur mungkin tidak tersedia.');
      }
    );

    return cleanup;
  }, [isAuthenticated, accessToken, isDataStale, checkAuth, setError]);

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
  }, [isAuthenticated, accessToken, isDataStale, checkAuth]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    // Parse JWT token to get expiration time
    const parseJWT = (token: string) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('Invalid JWT token format');
          return null;
        }
        
        const base64Url = parts[1];
        if (!base64Url) {
          console.error('JWT token missing payload');
          return null;
        }
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Failed to parse JWT token:', error);
        return null;
      }
    };

    const tokenData = parseJWT(accessToken);
    if (!tokenData || !tokenData.exp) return;

    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    
    // Refresh token 2 minutes before expiry (more efficient)
    const refreshTime = Math.max(timeUntilExpiry - 2 * 60 * 1000, 0);
    
    if (refreshTime > 0) {
      console.log(`🕐 Token will be refreshed in ${Math.round(refreshTime / 1000 / 60)} minutes`);
      
      const refreshTimer = setTimeout(() => {
        console.log('🔄 Auto-refreshing token before expiry...');
        refreshAuthToken();
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    } else {
      // Token is already expired or about to expire, refresh immediately
      console.log('🚨 Token expired or about to expire, refreshing immediately...');
      refreshAuthToken();
      return undefined;
    }
  }, [isAuthenticated, accessToken, refreshAuthToken]);

  // Login function with direct API call
  const login = useCallback(async (credentials: LoginApiData): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      setError(null);
      
      const response = await AuthAPI.login(credentials);
      
      if (response.success && response.user && response.accessToken && response.refreshToken) {
        console.log('🔍 Login Debug - API Response:', {
          user: response.user,
          userRoles: response.user.roles,
          userRolesType: typeof response.user.roles,
          userRolesLength: response.user.roles?.length,
        });

        // Extract clinic data from user if available
        const clinicData: Clinic | undefined = response.user.clinicId ? {
          id: response.user.clinicId,
          name: response.user.clinicName || '',
          isActive: true,
          ...(response.user.subscriptionTier && { subscription: response.user.subscriptionTier }),
        } : undefined;

        storeLogin({
          user: response.user,
          ...(clinicData && { clinic: clinicData }),
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        
        // Let RouteGuard handle the redirect logic
        // No manual redirect here to avoid conflicts
        
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
        return { success: true, message: response.message || 'Password changed successfully' };
      } else {
        setError(response.message || 'Password change failed');
        return { success: false, message: response.message || 'Password change failed' };
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
        return { success: true, message: response.message || 'Reset email sent successfully' };
      } else {
        setError(response.message || 'Failed to send reset email');
        return { success: false, message: response.message || 'Failed to send reset email' };
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
        return { success: true, message: response.message || 'Password reset successfully' };
      } else {
        setError(response.message || 'Password reset failed');
        return { success: false, message: response.message || 'Password reset failed' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsResettingPassword(false);
    }
  }, [setError]);

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
    isOnline,
    
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