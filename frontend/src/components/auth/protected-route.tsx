'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Route } from 'next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireVerification = true,
  redirectTo = '/masuk',
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (requireAuth && !session) {
      router.push(redirectTo as Route);
      return;
    }

    if (
      requireVerification &&
      session?.user &&
      !session.user.isVerified
    ) {
      // Redirect to verification page or show verification notice
      console.warn('User not verified:', session.user.email);
      // In a real app, you might redirect to a verification page
      return;
    }
  }, [session, status, requireAuth, requireVerification, redirectTo, router]);

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

  if (requireAuth && !session) {
    return null; // Will redirect
  }

  if (requireVerification && session?.user && !session.user.isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass rounded-lg p-8 max-w-md">
          <div className="text-center space-form">
            <h2 className="text-lg font-semibold mb-2">
              Verifikasi Diperlukan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Akun Anda sedang dalam proses verifikasi lisensi terapis. 
              Silakan hubungi administrator untuk informasi lebih lanjut.
            </p>
            <div className="text-xs text-muted-foreground">
              Email: {session.user.email}<br />
              License: {session.user.licenseNumber}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}