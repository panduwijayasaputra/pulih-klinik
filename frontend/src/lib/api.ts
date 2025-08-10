import { LoginFormData, LoginResponse, User, UserRole, mockUsers } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthAPI {
  static async login(credentials: LoginFormData): Promise<LoginResponse> {
    // Simulate network delay
    await delay(1000);

    const { email, password } = credentials;
    const mockUser = mockUsers[email];

    if (!mockUser || mockUser.password !== password) {
      return {
        success: false,
        message: 'Email atau password salah'
      };
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...user } = mockUser;
    
    return {
      success: true,
      user: user as User
    };
  }

  static async logout(): Promise<void> {
    // Simulate network delay
    await delay(500);
    // In real app, this would invalidate server session
  }

  static async getCurrentUser(): Promise<User | null> {
    // Simulate checking stored session
    await delay(300);
    
    // In real app, this would validate session token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    
    return null;
  }
}

// Helper function to check if user has specific role
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;

  const normalizeRole = (r: string): UserRole | null => {
    const key = r.toLowerCase().replace(/[-\s]/g, '_');
    switch (key) {
      case 'administrator':
        return UserRoleEnum.Administrator;
      case 'clinic_admin':
      case 'clinicadmin':
        return UserRoleEnum.ClinicAdmin;
      case 'therapist':
        return UserRoleEnum.Therapist;
      case String(UserRoleEnum.Administrator).toLowerCase():
        return UserRoleEnum.Administrator;
      case String(UserRoleEnum.ClinicAdmin).toLowerCase():
        return UserRoleEnum.ClinicAdmin;
      case String(UserRoleEnum.Therapist).toLowerCase():
        return UserRoleEnum.Therapist;
      default:
        return null;
    }
  };

  const target = normalizeRole(role);
  if (!target) return false;

  const normalizedUserRoles = user.roles
    .map((r) => normalizeRole(String(r)))
    .filter((r): r is UserRole => r !== null);

  return normalizedUserRoles.includes(target);
};

// Helper function to check if user has any of the specified roles
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  return roles.some((role) => hasRole(user, role));
};

// Helper function to get user's primary role (first in array)
export const getPrimaryRole = (user: User | null): string | null => {
  if (!user || !user.roles || user.roles.length === 0) return null;
  // Return a normalized role string for consistency
  const roles = user.roles as string[];
  const normalized = roles
    .map((r) => {
      const n = (hasRole as any)({ roles }, r) ? r : r; // keep original if already enum
      return n;
    })[0];
  return normalized ?? null;
};