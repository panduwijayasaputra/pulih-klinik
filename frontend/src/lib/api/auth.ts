import { LoginApiData, LoginResponse, User } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';
import { ItemResponse } from './types';
import { httpClient, handleApiResponse, handleApiError } from '@/lib/http-client';
import { 
  LoginApiResponse, 
  RefreshTokenApiResponse, 
  CurrentUserApiResponse,
  ChangePasswordApiResponse,
  ForgotPasswordApiResponse,
  ResetPasswordApiResponse
} from './auth-types';

// Store token in a way that's accessible to the http client
let authToken: string | null = null;

export class AuthAPI {
  static async login(credentials: LoginApiData): Promise<LoginResponse> {
    try {
      const response = await httpClient.post('/auth/login', credentials);
      const data = handleApiResponse<LoginApiResponse>(response);
      
      console.log('🔍 Auth API Debug - Raw backend response:', {
        data: data.data,
        user: data.data?.user,
        userRoles: data.data?.user?.roles,
        userRolesType: typeof data.data?.user?.roles,
      });
      
      // Store the token
      if (data.success && data.data?.accessToken) {
        authToken = data.data.accessToken;
        
        // Store token in localStorage for persistence
        if (typeof window !== 'undefined') {
          const authStorage = {
            state: {
              token: authToken,
              user: data.data.user,
              isAuthenticated: true,
            },
          };
          localStorage.setItem('auth-storage', JSON.stringify(authStorage));
        }
        
        // Map the user data to match frontend interface
        const mappedUser: User = {
          ...data.data.user,
          roles: Array.isArray(data.data.user.roles) 
            ? data.data.user.roles.map((role: any) => {
                // Handle both string roles and role objects
                if (typeof role === 'string') {
                  return role;
                } else if (role && typeof role === 'object' && role.role) {
                  return role.role;
                } else if (role && typeof role === 'object' && role.name) {
                  return role.name;
                }
                return String(role);
              })
            : [],
          ...(data.data.user.clinicId && { clinicId: data.data.user.clinicId }),
          ...(data.data.user.clinicName && { clinicName: data.data.user.clinicName }),
        };

        console.log('🔍 Auth API Debug - Mapped user:', {
          mappedUser,
          mappedUserRoles: mappedUser.roles,
          mappedUserRolesType: typeof mappedUser.roles,
        });

        return {
          success: true,
          user: mappedUser,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          message: data.message || 'Login berhasil'
        };
      }
      
      return {
        success: false,
        message: data.message || 'Login gagal'
      };
    } catch (error) {
      handleApiError(error);
      // This line will never be reached due to handleApiError throwing
      return { success: false, message: 'Login failed' };
    }
  }

  static async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
      
      // Clear stored token
      authToken = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
      }
    } catch (error) {
      // Even if logout fails on server, clear local storage
      authToken = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
      }
      console.warn('Logout API call failed:', error);
    }
  }

  static async getCurrentUser(): Promise<ItemResponse<User>> {
    try {
      const response = await httpClient.get('/auth/me');
      const data = handleApiResponse<CurrentUserApiResponse>(response);
      
      // Map the user data to match frontend interface  
      const mappedUser: User = {
        ...data.data,
        roles: data.data.roles?.map((roleObj: any) => roleObj.role) || [],
        ...(data.data.clinicId && { clinicId: data.data.clinicId }),
        ...(data.data.clinicName && { clinicName: data.data.clinicName }),
      };

      return {
        success: true,
        data: mappedUser,
        message: data.message || 'User data retrieved successfully'
      };
    } catch (error) {
      // Don't use localStorage fallback - let auth hooks handle the error
      throw error;
    }
  }

  static async refreshToken(): Promise<{ success: boolean; data?: { accessToken: string; refreshToken: string }; message?: string }> {
    try {
      // Get refresh token from storage
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const refreshToken = parsed.state?.refreshToken;
          
          if (refreshToken) {
            const response = await httpClient.post('/auth/refresh', { refreshToken });
            const data = handleApiResponse<RefreshTokenApiResponse>(response);
            
            if (data.success && data.data) {
              // Update stored tokens
              authToken = data.data.accessToken;
              const newAuthStorage = {
                ...parsed,
                state: {
                  ...parsed.state,
                  token: data.data.accessToken,
                  refreshToken: data.data.refreshToken,
                },
              };
              localStorage.setItem('auth-storage', JSON.stringify(newAuthStorage));
              
              return {
                success: true,
                data: data.data,
                message: 'Token refreshed successfully'
              };
            }
          }
        }
      }
      
      return {
        success: false,
        message: 'No refresh token available'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to refresh token'
      };
    }
  }

  static async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<ItemResponse<{ message: string }>> {
    try {
      const response = await httpClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      const data = handleApiResponse<ChangePasswordApiResponse>(response);
      
      return {
        success: true,
        data: data.data || { message: 'Password changed successfully' },
        message: data.message || 'Password changed successfully'
      };
    } catch (error) {
      handleApiError(error);
      // This line will never be reached due to handleApiError throwing
      return { success: false, data: { message: 'Password change failed' }, message: 'Password change failed' };
    }
  }

  static async forgotPassword(email: string): Promise<ItemResponse<{ message: string }>> {
    try {
      const response = await httpClient.post('/auth/forgot-password', { email });
      const data = handleApiResponse<ForgotPasswordApiResponse>(response);
      
      return {
        success: true,
        data: data.data || { message: 'Password reset email sent' },
        message: data.message || 'Password reset email sent'
      };
    } catch (error) {
      handleApiError(error);
      // This line will never be reached due to handleApiError throwing
      return { success: false, data: { message: 'Forgot password failed' }, message: 'Forgot password failed' };
    }
  }

  static async resetPassword(token: string, password: string, confirmPassword: string): Promise<ItemResponse<{ message: string }>> {
    try {
      const response = await httpClient.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      const data = handleApiResponse<ResetPasswordApiResponse>(response);
      
      return {
        success: true,
        data: data.data || { message: 'Password reset successfully' },
        message: data.message || 'Password reset successfully'
      };
    } catch (error) {
      handleApiError(error);
      // This line will never be reached due to handleApiError throwing
      return { success: false, data: { message: 'Password reset failed' }, message: 'Password reset failed' };
    }
  }

  static async verifyResetToken(token: string): Promise<ItemResponse<{ valid: boolean; email?: string }>> {
    try {
      const response = await httpClient.post('/auth/verify-reset-token', { token });
      const data = handleApiResponse<{ success: boolean; data: { valid: boolean; email?: string }; message?: string }>(response);
      
      return {
        success: true,
        data: data.data || { valid: false },
        message: data.message || 'Token verification completed'
      };
    } catch (error) {
      handleApiError(error);
      // This line will never be reached due to handleApiError throwing
      return { success: false, data: { valid: false }, message: 'Token verification failed' };
    }
  }

  // Helper method to get current token
  static getToken(): string | null {
    if (authToken) return authToken;
    
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          return parsed.state?.token || null;
        } catch (error) {
          console.warn('Failed to parse token from storage:', error);
        }
      }
    }
    
    return null;
  }
}

// Helper functions
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role as any);
};

export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !user.roles) return false;
  return roles.some(role => user.roles.includes(role as any));
};

export const getPrimaryRole = (user: User | null): string | null => {
  if (!user || !user.roles || user.roles.length === 0) return null;
  
  // Return the first role as primary role
  // Priority order: Administrator > ClinicAdmin > Therapist
  const rolePriority = [
    UserRoleEnum.Administrator,
    UserRoleEnum.ClinicAdmin,
    UserRoleEnum.Therapist,
  ];
  
  for (const priorityRole of rolePriority) {
    if (user.roles.includes(priorityRole)) {
      return priorityRole;
    }
  }
  
  return user.roles[0] || null;
};