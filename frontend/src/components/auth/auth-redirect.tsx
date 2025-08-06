'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Route } from 'next';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Redirects authenticated users away from auth pages
 */
export function AuthRedirect({
  children,
  redirectTo = '/dashboard',
}: AuthRedirectProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session) {
      router.push(redirectTo as Route);
    }
  }, [session, status, redirectTo, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass rounded-lg p-8">
          <div className="animate-fade-in text-center">
            <div className="text-lg font-semibold mb-2">Smart Therapy</div>
            <div className="text-sm text-muted-foreground">
              Memuat sistem...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  return <>{children}</>;
}