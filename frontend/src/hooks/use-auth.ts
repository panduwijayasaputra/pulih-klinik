'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;
  const isVerified = session?.user?.isVerified ?? false;
  const user = session?.user;

  const login = (redirectTo: string = '/dashboard') => {
    router.push(`/masuk?callbackUrl=${encodeURIComponent(redirectTo)}` as Route);
  };

  const logout = async (redirectTo: string = '/') => {
    await signOut({
      redirect: false,
    });
    router.push(redirectTo as Route);
  };

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      login();
      return false;
    }
    return true;
  };

  const requireVerification = () => {
    if (isAuthenticated && !isVerified) {
      console.warn('User not verified');
      return false;
    }
    return true;
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isVerified,
    login,
    logout,
    requireAuth,
    requireVerification,
  };
}

export function useRequireAuth() {
  const auth = useAuth();

  if (!auth.isLoading && !auth.isAuthenticated) {
    auth.login();
  }

  return auth;
}

export function useRequireVerification() {
  const auth = useRequireAuth();

  if (auth.isAuthenticated && !auth.isVerified) {
    // In a real app, you might redirect to verification page
    console.warn('User requires verification');
  }

  return auth;
}