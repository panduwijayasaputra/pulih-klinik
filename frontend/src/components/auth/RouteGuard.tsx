'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getDefaultRouteForUser } from '@/lib/route-protection';

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle redirects for authenticated users accessing auth pages
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const authPages = ['/login', '/register', '/thankyou'];
      if (authPages.includes(pathname)) {
        const defaultRoute = getDefaultRouteForUser(user);
        router.push(defaultRoute as any);
        return;
      }
    }

    // Handle redirects for unauthenticated users accessing landing page
    if (!isLoading && !isAuthenticated) {
      if (pathname === '/') {
        // Stay on landing page if not authenticated
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
  }, [isAuthenticated, isLoading, user, pathname, router]);

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