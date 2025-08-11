'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles,
  fallback 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Normalize roles to handle legacy data
  const normalizeUserRoles = (userRoles: UserRole[]): UserRole[] => {
    const legacyToEnumMap: Record<string, UserRole> = {
      administrator: UserRoleEnum.Administrator,
      clinic_admin: UserRoleEnum.ClinicAdmin,
      therapist: UserRoleEnum.Therapist,
    } as const as Record<string, UserRole>;

    return userRoles.map((role) => {
      const key = String(role).toLowerCase();
      return legacyToEnumMap[key] ?? (role as UserRole);
    });
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Normalize user roles and check if user has any of the allowed roles
      const normalizedUserRoles = user.roles ? normalizeUserRoles(user.roles) : [];
      const hasRequiredRole = normalizedUserRoles.some(role => allowedRoles.includes(role));
      
      if (!hasRequiredRole) {
        // Redirect to dashboard if user doesn't have required role
        router.push('/portal');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

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

  // Check if user has required role
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Anda harus login untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  // Normalize user roles and check permissions
  const normalizedUserRoles = user.roles ? normalizeUserRoles(user.roles) : [];
  const hasRequiredRole = normalizedUserRoles.some(role => allowedRoles.includes(role));
  
  if (!hasRequiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  // User has required role, render children
  return <>{children}</>;
};

// HOC for protecting specific routes with role requirements
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  fallback?: React.ReactNode
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
        <Component {...props} />
      </RoleGuard>
    );
  };

  WrappedComponent.displayName = `withRoleGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
