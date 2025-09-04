'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useOnboardingStore, OnboardingStepEnum } from '@/store/onboarding';
import { getDefaultRouteForUser } from '@/lib/route-protection';
import { UserRoleEnum } from '@/types/enums';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { needsOnboarding, isLoaded, hasActiveSubscription } = useOnboarding();
  const { currentStep, justCompletedSubscription } = useOnboardingStore();
  const router = useRouter();
  const pathname = usePathname();

  // Development mode - bypass auth for client management and edit routes
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isClientRoute = pathname.startsWith('/portal/clients');
  const isEditRoute = pathname.startsWith('/portal/therapists/edit');

  // Handle redirects for authenticated users accessing auth pages
  useEffect(() => {

    if (!isLoading && isAuthenticated && user && isLoaded) {
      const authPages = ['/login', '/register', '/thankyou'];
      if (authPages.includes(pathname)) {
        const defaultRoute = getDefaultRouteForUser(user);
        router.push(defaultRoute as any);
        return;
      }

      // Determine user's clinic and subscription status from auth store directly
      const userHasClinic = !!(user?.clinicId || user?.clinicName);
      const userHasSubscription = !!user?.subscriptionTier || !!hasActiveSubscription;
      const isSystemAdmin = user?.roles?.includes(UserRoleEnum.Administrator);
      
      const isOnboardingPage = pathname === '/onboarding';
      const isPortalRoute = pathname.startsWith('/portal');


      // Handle portal access
      if (isPortalRoute) {
        // System admins can access portal without clinic/subscription requirements
        if (isSystemAdmin) {
          return;
        }
        
        if (!userHasClinic) {
          // Rule 1: No clinic → redirect to onboarding clinic form
          router.push('/onboarding');
          return;
        } else if (!userHasSubscription) {
          // Rule 2: Has clinic but no subscription → redirect to onboarding subscription step
          router.push('/onboarding');
          return;
        }
        // Rule 3: Has both clinic and subscription → allow portal access
        return;
      }

      // Handle onboarding page access
      if (isOnboardingPage) {
        // System admins can always access onboarding for testing/management
        if (isSystemAdmin) {
          return;
        }
        
        // If user has both clinic and subscription, they shouldn't access onboarding
        if (userHasClinic && userHasSubscription) {
          // Exception: Allow Complete step only if user just submitted subscription
          if (currentStep === OnboardingStepEnum.Complete && justCompletedSubscription) {
            return; // Allow thank you page
          }
          
          // Otherwise, redirect completed users to portal
          router.push('/portal');
          return;
        }
        
        // Allow onboarding access if user needs it
        return;
      }
    }

    // Handle redirects for unauthenticated users accessing landing page
    if (!isLoading && !isAuthenticated) {
      if (pathname === '/') {
        // Stay on landing page if not authenticated
        return;
      }
      
      // In development, allow direct access to client routes and edit routes
      if (isDevelopment && (isClientRoute || isEditRoute)) {
        return;
      }
      
      // Redirect to landing page for onboarding if not authenticated
      if (pathname === '/onboarding') {
        router.push('/');
        return;
      }
      
      // Redirect to login for other protected routes
      const protectedRoutes = ['/portal'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      
      if (isProtectedRoute) {
        router.push('/login');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router, needsOnboarding, isLoaded, currentStep]);

  // In development mode, allow client routes and edit routes without auth
  if (isDevelopment && (isClientRoute || isEditRoute)) {
    return <>{children}</>;
  }

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Memeriksa izin akses...</p>
        </div>
      </div>
    );
  }


  // User has access, render children
  return <>{children}</>;
};

// HOC for protecting specific routes
export const withRouteGuard = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <RouteGuard fallback={fallback}>
        <Component {...props} />
      </RouteGuard>
    );
  };

  WrappedComponent.displayName = `withRouteGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};