import { LoginFormData, LoginResponse, User } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';
import { ItemResponse } from './types';
import { mockCredentials, mockUsers } from '@/lib/mocks/auth';

export class AuthAPI {
  static async login(credentials: LoginFormData): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { email, password } = credentials;
    
    // Check if credentials match our mock data
    if (mockCredentials[email as keyof typeof mockCredentials] === password) {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        return {
          success: true,
          user,
          message: 'Login berhasil'
        };
      }
    }
    
    return {
      success: false,
      message: 'Email atau password tidak valid'
    };
  }

  static async logout(): Promise<void> {
    // TODO: Implement actual API call
    console.log('AuthAPI.logout called');
  }

  static async getCurrentUser(): Promise<ItemResponse<any>> {
    // TODO: Implement actual API call
    console.log('AuthAPI.getCurrentUser called');
    return {
      success: false,
      message: 'API not implemented yet'
    };
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