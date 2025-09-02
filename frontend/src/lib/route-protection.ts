import { User, UserRole } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';
import { RouteConfig } from '@/types/navigation';

// Route configurations with role requirements
export const routeConfigs: RouteConfig[] = [
  // Public routes (no authentication required)
  { path: '/', allowPublic: true, requiredRoles: [] },
  { path: '/login', allowPublic: true, requiredRoles: [] },
  { path: '/register', allowPublic: true, requiredRoles: [] },
  { path: '/thankyou', allowPublic: true, requiredRoles: [] },

  // Authenticated routes (require login but no specific role)
  { 
    path: '/onboarding', 
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist]
  },


  // Portal routes - Clinic Admin only
  { 
    path: '/portal/clinic/manage', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic'
  },
  { 
    path: '/portal/clinic/therapists', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic'
  },
  { 
    path: '/portal/clinic/therapists/new', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic/therapists'
  },
  { 
    path: '/portal/clinic/therapists/edit/[id]', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic/therapists'
  },
  { 
    path: '/portal/clinic/clients', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic'
  },
  { 
    path: '/portal/clinic/clients/[code]', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic/clients'
  },

  // Portal routes - Therapist specific
  { 
    path: '/portal/therapist/clients', 
    requiredRoles: [UserRoleEnum.Therapist],
    redirectTo: '/portal/therapist'
  },
  { 
    path: '/portal/therapist/clients/[id]', 
    requiredRoles: [UserRoleEnum.Therapist],
    redirectTo: '/portal/therapist/clients'
  },
  { 
    path: '/portal/therapist/therapy/[client-id]', 
    requiredRoles: [UserRoleEnum.Therapist],
    redirectTo: '/portal/therapist'
  },
  { 
    path: '/portal/therapist/sessions/[session-id]', 
    requiredRoles: [UserRoleEnum.Therapist],
    redirectTo: '/portal/therapist/sessions'
  },


  // Portal routes - All authenticated users
  { 
    path: '/portal', 
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist]
  },
  { 
    path: '/portal/profile', 
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist]
  },
  { 
    path: '/portal/settings', 
    requiredRoles: [UserRoleEnum.Administrator, UserRoleEnum.ClinicAdmin, UserRoleEnum.Therapist]
  },

  // Role-specific dashboard routes
  { 
    path: '/portal/admin', 
    requiredRoles: [UserRoleEnum.Administrator],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/clinic', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/therapist', 
    requiredRoles: [UserRoleEnum.Therapist],
    redirectTo: '/portal'
  },

  // Admin routes
  { 
    path: '/portal/admin/clinics', 
    requiredRoles: [UserRoleEnum.Administrator],
    redirectTo: '/portal/admin'
  },
  { 
    path: '/portal/admin/clinics/[id]', 
    requiredRoles: [UserRoleEnum.Administrator],
    redirectTo: '/portal/admin/clinics'
  },

  // Legacy clinic profile route (keep for backward compatibility)
  { 
    path: '/portal/clinic/profile', 
    requiredRoles: [UserRoleEnum.ClinicAdmin],
    redirectTo: '/portal/clinic'
  },
];

// Check if user has required role
export const hasRequiredRole = (user: User | null, requiredRoles: UserRole[]): boolean => {
  if (!user || !user.roles) return false;
  if (requiredRoles.length === 0) return true; // No roles required

  // Normalize legacy roles in case persisted data uses old strings
  const legacyToEnumMap: Record<string, UserRole> = {
    administrator: UserRoleEnum.Administrator,
    clinic_admin: UserRoleEnum.ClinicAdmin,
    therapist: UserRoleEnum.Therapist,
  } as const as Record<string, UserRole>;

  const normalizedUserRoles: UserRole[] = user.roles.map((role) => {
    const key = String(role).toLowerCase();
    return legacyToEnumMap[key] ?? (role as UserRole);
  });

  // Check if user has any of the required roles
  return requiredRoles.some((requiredRole) => normalizedUserRoles.includes(requiredRole));
};

// Check if user can access a specific route
export const canAccessRoute = (user: User | null, pathname: string): { 
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
} => {
  // Find the most specific route config
  const matchedConfig = routeConfigs
    .filter(config => {
      if (config.exactMatch) {
        return config.path === pathname;
      } else {
        // Handle dynamic routes like /clients/[code]
        const configPathPattern = config.path.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${configPathPattern}(/|$)`);
        return regex.test(pathname);
      }
    })
    .sort((a, b) => b.path.length - a.path.length)[0]; // Get most specific match

  // If no config found, default to requiring authentication
  if (!matchedConfig) {
    if (!user) {
      return {
        allowed: false,
        redirectTo: '/login',
        reason: 'Authentication required'
      };
    }
    return { allowed: true };
  }

  // Public route - always allow
  if (matchedConfig.allowPublic) {
    return { allowed: true };
  }

  // Check authentication
  if (!user) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'Authentication required'
    };
  }

  // Check role requirements
  if (!hasRequiredRole(user, matchedConfig.requiredRoles)) {
    return {
      allowed: false,
      redirectTo: matchedConfig.redirectTo || '/dashboard',
      reason: 'Insufficient permissions'
    };
  }

  return { allowed: true };
};

// Get default route for user based on their primary role
export const getDefaultRouteForUser = (user: User | null): string => {
  if (!user || !user.roles || user.roles.length === 0) {
    return '/login';
  }

  // All authenticated users now go to the unified portal page
  return '/portal';
};

// Get available routes for user based on their roles
export const getAvailableRoutesForUser = (user: User | null): string[] => {
  if (!user || !user.roles) return [];

  return routeConfigs
    .filter(config => !config.allowPublic && hasRequiredRole(user, config.requiredRoles))
    .map(config => config.path);
};

// Route guard hook utility
export interface RouteGuardResult {
  isLoading: boolean;
  isAuthenticated: boolean;
  canAccess: boolean;
  shouldRedirect: boolean;
  redirectTo?: string | undefined;
  reason?: string | undefined;
}

// Helper to determine if route requires authentication
export const isProtectedRoute = (pathname: string): boolean => {
  const config = routeConfigs.find(config => {
    if (config.exactMatch) {
      return config.path === pathname;
    } else {
      const configPathPattern = config.path.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${configPathPattern}(/|$)`);
      return regex.test(pathname);
    }
  });

  return config ? !config.allowPublic : true; // Default to protected if no config found
};