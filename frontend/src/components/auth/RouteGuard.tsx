'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { getDefaultRouteForUser } from '@/lib/route-protection';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { needsOnboarding, isLoaded } = useOnboarding();
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

      // Don't interfere with onboarding page - let OnboardingFlow handle its own logic
      const isOnboardingPage = pathname === '/onboarding';
      if (isOnboardingPage) {
        return;
      }

      // Check if user needs onboarding when accessing portal routes
      // Use server-side status instead of client-side check to avoid conflicts
      const isPortalRoute = pathname.startsWith('/portal');
      
      if (isPortalRoute && needsOnboarding) {
        router.push('/onboarding');
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
      
      // Redirect to login for protected routes
      const protectedRoutes = ['/portal'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      
      if (isProtectedRoute) {
        router.push('/login');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router, needsOnboarding, isLoaded]);

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