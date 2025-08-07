import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { RouteGuardResult, canAccessRoute, isProtectedRoute } from '@/lib/route-protection';

export const useRouteGuard = (): RouteGuardResult => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [guardResult, setGuardResult] = useState<RouteGuardResult>({
    isLoading: true,
    isAuthenticated: false,
    canAccess: false,
    shouldRedirect: false,
  });

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      setGuardResult(prev => ({ ...prev, isLoading: true }));
      return;
    }

    // Check if current route requires protection
    const requiresAuth = isProtectedRoute(pathname);
    
    // If route doesn't require auth, allow access
    if (!requiresAuth) {
      setGuardResult({
        isLoading: false,
        isAuthenticated,
        canAccess: true,
        shouldRedirect: false,
      });
      return;
    }

    // Check access permissions for protected routes
    const accessResult = canAccessRoute(user, pathname);

    if (accessResult.allowed) {
      setGuardResult({
        isLoading: false,
        isAuthenticated,
        canAccess: true,
        shouldRedirect: false,
      });
    } else {
      const newGuardResult: RouteGuardResult = {
        isLoading: false,
        isAuthenticated,
        canAccess: false,
        shouldRedirect: true,
      };
      
      if (accessResult.redirectTo) {
        newGuardResult.redirectTo = accessResult.redirectTo;
      }
      
      if (accessResult.reason) {
        newGuardResult.reason = accessResult.reason;
      }
      
      setGuardResult(newGuardResult);

      // Perform redirect
      if (accessResult.redirectTo) {
        router.push(accessResult.redirectTo as any);
      }
    }
  }, [user, isAuthenticated, isLoading, pathname, router]);

  return guardResult;
};

// Hook for checking specific route access without navigation
export const useCanAccessRoute = (routePath: string) => {
  const { user } = useAuth();
  
  return canAccessRoute(user, routePath);
};

// Hook for role-based conditional rendering
export const useRoleAccess = () => {
  const { user, hasRole, hasAnyRole, getPrimaryRole } = useAuth();

  return {
    user,
    hasRole,
    hasAnyRole,
    getPrimaryRole,
    isAdmin: () => hasRole('administrator'),
    isClinicAdmin: () => hasRole('clinic_admin'),
    isTherapist: () => hasRole('therapist'),
    canManageClinic: () => hasAnyRole(['administrator', 'clinic_admin']),
    canManageClients: () => hasAnyRole(['clinic_admin', 'therapist']),
    canAccessSessions: () => hasAnyRole(['clinic_admin', 'therapist']),
  };
};