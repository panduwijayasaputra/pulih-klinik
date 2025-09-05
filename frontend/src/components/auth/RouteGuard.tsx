'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRoleEnum } from '@/types/enums';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children,
  fallback
}) => {
  const { user, clinic, isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to determine redirect path based on user role and state
  const getRedirectPath = (user: any, clinic: any): string | null => {
    // System Admin users → redirect to /portal/admin
    if (user.roles.includes(UserRoleEnum.Administrator)) {
      return '/portal/admin';
    }
    
    // Therapist users → redirect to /portal/therapist
    if (user.roles.includes(UserRoleEnum.Therapist)) {
      return '/portal/therapist';
    }
    
    // Clinic Admin users
    if (user.roles.includes(UserRoleEnum.ClinicAdmin)) {
      // If user doesn't have clinic data or subscription → redirect to onboarding
      if (!clinic || !clinic.subscription) {
        return '/onboarding';
      }
      
      // If user has complete clinic and subscription data → redirect to /portal/clinic
      return '/portal/clinic';
    }
    
    // Default fallback
    return '/portal';
  };

  // Handle route protection and redirects
  useEffect(() => {
    if (isLoading) {
      return; // Still loading, don't redirect yet
    }

    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If user is authenticated and trying to access auth pages or landing page
    if (isAuthenticated && user && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
      console.log('🔍 RouteGuard Debug - Redirecting authenticated user:', {
        pathname,
        user: user ? { id: user.id, email: user.email, roles: user.roles } : null,
        clinic: clinic ? { id: clinic.id, name: clinic.name, subscription: clinic.subscription } : null,
      });
      
      // Use smart redirect logic based on user role and state
      const redirectPath = getRedirectPath(user, clinic);
      console.log('🚀 RouteGuard redirect path:', redirectPath);
      router.push(redirectPath || '/portal' as any);
      return;
    }

    // Handle authenticated user route access
    if (isAuthenticated && user) {
      const isSystemAdmin = user.roles.includes(UserRoleEnum.Administrator);
      const isTherapist = user.roles.includes(UserRoleEnum.Therapist);
      const isClinicAdmin = user.roles.includes(UserRoleEnum.ClinicAdmin);
      
      const isPortalRoute = pathname.startsWith('/portal');
      const isOnboardingRoute = pathname.startsWith('/onboarding');

      console.log('🔍 RouteGuard - Authenticated user accessing route:', {
        pathname,
        isSystemAdmin,
        isTherapist,
        isClinicAdmin,
        isPortalRoute,
        isOnboardingRoute,
        user: user ? { id: user.id, email: user.email, roles: user.roles } : null,
        clinic: clinic ? { id: clinic.id, name: clinic.name, subscription: clinic.subscription } : null,
      });

      // System admins and therapists can access portal directly
      if ((isSystemAdmin || isTherapist) && isPortalRoute) {
        return; // Allow access
      }

      // If user has no valid roles but is trying to access portal, force validation
      if (isPortalRoute && (user.roles.length === 0 || user.roles.some(role => role === null))) {
        console.log('🔄 User has invalid roles, forcing auth validation...');
        if ((window as any).forceAuthValidation) {
          (window as any).forceAuthValidation();
        }
        return; // Don't redirect yet, let validation complete
      }

      // Clinic admins need to complete onboarding first
      if (isClinicAdmin) {
        const hasClinic = !!clinic;
        const hasSubscription = !!clinic?.subscription;
        
        console.log('🔍 RouteGuard - Clinic admin check:', {
          hasClinic,
          hasSubscription,
          clinic,
          isPortalRoute,
          isOnboardingRoute,
        });

        if (isPortalRoute) {
          // If trying to access portal but doesn't have clinic/subscription
          if (!hasClinic || !hasSubscription) {
            console.log('🚨 Clinic admin accessing portal without clinic data:', {
              hasClinic,
              hasSubscription,
              clinic,
              pathname,
            });
            router.push('/onboarding');
            return;
          }
          // Has both clinic and subscription, allow portal access
          console.log('✅ Clinic admin has complete data, allowing portal access');
          return;
        }

        if (isOnboardingRoute) {
          // If has both clinic and subscription, redirect to portal
          if (hasClinic && hasSubscription) {
            router.push('/portal');
            return;
          }
          // Needs onboarding, allow access
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, clinic, pathname, router]);

  // Show loading state while checking permissions
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Memeriksa izin akses...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an authentication error
  if (error && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">Terjadi kesalahan autentikasi</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-2 text-primary hover:underline"
          >
            Kembali ke halaman login
          </button>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};