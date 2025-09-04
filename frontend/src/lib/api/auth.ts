import { LoginApiData, LoginResponse, User } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';
import { ItemResponse } from './types';
import { httpClient, handleApiResponse, handleApiError } from '@/lib/http-client';

// Store token in a way that's accessible to the http client
let authToken: string | null = null;

export class AuthAPI {
  static async login(credentials: LoginApiData): Promise<LoginResponse> {
    try {
      const response = await httpClient.post('/auth/login', credentials);
      const data = handleApiResponse(response);
      
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
        const mappedUser = {
          ...data.data.user,
          roles: data.data.user.roles.map((roleObj: any) => roleObj.role), // Extract role string from role objects
          roleDetails: data.data.user.roles, // Keep full role details
          clinicId: data.data.user.clinicId,
          clinicName: data.data.user.clinicName,
        };



        return {
          success: true,
          user: mappedUser,
          token: data.data.accessToken,
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
      const data = handleApiResponse<{ success: boolean; data: any; message: string }>(response);
      
      // Map the user data to match frontend interface  
      const mappedUser = {
        ...data.data,
        roles: data.data.roles?.map((roleObj: any) => roleObj.role) || [],
        roleDetails: data.data.roles || [], // Keep full role details
        clinicId: data.data.clinicId,
        clinicName: data.data.clinicName,
      };

      return {
        success: true,
        data: mappedUser,
        message: data.message
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
            const data = handleApiResponse(response);
            
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
      const data = handleApiResponse(response);
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  static async forgotPassword(email: string): Promise<ItemResponse<{ message: string }>> {
    try {
      const response = await httpClient.post('/auth/forgot-password', { email });
      const data = handleApiResponse(response);
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  static async resetPassword(token: string, password: string, confirmPassword: string): Promise<ItemResponse<{ message: string }>> {
    try {
      const response = await httpClient.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      const data = handleApiResponse(response);
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  static async verifyResetToken(token: string): Promise<ItemResponse<{ valid: boolean; email?: string }>> {
    try {
      const response = await httpClient.post('/auth/verify-reset-token', { token });
      const data = handleApiResponse(response);
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      handleApiError(error);
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