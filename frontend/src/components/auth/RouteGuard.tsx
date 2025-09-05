'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getRoutingDecision } from '@/lib/routing-logic';

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


  // Handle route protection and redirects using unified logic
  useEffect(() => {
    const userState = {
      isAuthenticated,
      user,
      clinic,
      isLoading
    };

    const decision = getRoutingDecision(pathname, userState);

    if (decision.shouldRedirect && decision.redirectPath) {
      router.push(decision.redirectPath as any);
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