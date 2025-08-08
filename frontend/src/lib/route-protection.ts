import { User, UserRole } from '@/types/auth';
import { RouteConfig } from '@/types/navigation';

// Route configurations with role requirements
export const routeConfigs: RouteConfig[] = [
  // Public routes (no authentication required)
  { path: '/', allowPublic: true, requiredRoles: [] },
  { path: '/login', allowPublic: true, requiredRoles: [] },
  { path: '/register', allowPublic: true, requiredRoles: [] },
  { path: '/thankyou', allowPublic: true, requiredRoles: [] },


  // Portal routes - Clinic Admin only
  { 
    path: '/portal/clinic/settings', 
    requiredRoles: ['clinic_admin'],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/clinic/therapists', 
    requiredRoles: ['clinic_admin'],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/clinic/billing', 
    requiredRoles: ['clinic_admin'],
    redirectTo: '/portal'
  },

  // Portal routes - Clinic Admin or Therapist
  { 
    path: '/portal/clients', 
    requiredRoles: ['clinic_admin', 'therapist'],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/clients/[code]', 
    requiredRoles: ['clinic_admin', 'therapist'],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/scripts', 
    requiredRoles: ['clinic_admin', 'therapist'],
    redirectTo: '/portal'
  },
  { 
    path: '/portal/sessions', 
    requiredRoles: ['clinic_admin', 'therapist'],
    redirectTo: '/portal'
  },

  // Portal routes - All authenticated users
  { 
    path: '/portal', 
    requiredRoles: ['administrator', 'clinic_admin', 'therapist']
  },
  { 
    path: '/portal/profile', 
    requiredRoles: ['administrator', 'clinic_admin', 'therapist']
  },
];

// Check if user has required role
export const hasRequiredRole = (user: User | null, requiredRoles: UserRole[]): boolean => {
  if (!user || !user.roles) return false;
  if (requiredRoles.length === 0) return true; // No roles required

  // Check if user has any of the required roles
  return requiredRoles.some(requiredRole => 
    user.roles.includes(requiredRole)
  );
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