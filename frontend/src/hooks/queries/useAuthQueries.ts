import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthAPI } from '@/lib/api/auth';
import { LoginApiData, User } from '@/types/auth';
import { useAuthStore } from '@/store/auth';

// Query keys for auth-related queries
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  validation: (token: string) => [...authKeys.all, 'validation', token] as const,
} as const;

// Get current user query
export const useCurrentUserQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: AuthAPI.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message.toLowerCase();
        if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
          return false;
        }
      }
      return failureCount < 3;
    },
    ...options,
  });
};

// Login mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginApiData) => {
      const response = await AuthAPI.login(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      return response;
    },
    onSuccess: (data) => {
      // Update auth store
      if (data.user) {
        storeLogin({
          user: data.user,
          token: data.token || undefined,
          refreshToken: data.refreshToken || undefined,
        });
      }
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      
      // Set the user data in the query cache
      queryClient.setQueryData(authKeys.user(), {
        success: true,
        data: data.user,
        message: data.message,
      });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout: storeLogout } = useAuthStore();

  return useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      // Update auth store
      storeLogout();
      
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      storeLogout();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

// Change password mutation
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: ({ 
      currentPassword, 
      newPassword, 
      confirmPassword 
    }: { 
      currentPassword: string; 
      newPassword: string; 
      confirmPassword: string; 
    }) => {
      return AuthAPI.changePassword(currentPassword, newPassword, confirmPassword);
    },
  });
};

// Forgot password mutation
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => AuthAPI.forgotPassword(email),
  });
};

// Reset password mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ 
      token, 
      password, 
      confirmPassword 
    }: { 
      token: string; 
      password: string; 
      confirmPassword: string; 
    }) => {
      return AuthAPI.resetPassword(token, password, confirmPassword);
    },
  });
};

// Verify reset token query
export const useVerifyResetTokenQuery = (token: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: authKeys.validation(token),
    queryFn: () => AuthAPI.verifyResetToken(token),
    staleTime: 0, // Always fresh check
    gcTime: 0, // Don't cache
    retry: false, // Don't retry token validation
    ...options,
  });
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
  const queryClient = useQueryClient();
  const { updateTokens } = useAuthStore();

  return useMutation({
    mutationFn: AuthAPI.refreshToken,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update auth store with new tokens
        updateTokens(data.data.accessToken, data.data.refreshToken);
        
        // Refetch user data with new token
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      // If refresh fails, user needs to log in again
      useAuthStore.getState().logout();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};