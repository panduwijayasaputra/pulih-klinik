'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRoleEnum } from '@/types/enums';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';

export default function PortalPage() {
  const { user } = useAuth();
  const { activeRole } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    if (!user) {
      return; // RouteGuard will handle authentication
    }   

    // Only redirect if we're exactly on /portal path
    if (pathname === '/portal') {
      const currentRole = activeRole || user.roles[0];
      
      // Redirect to role-specific dashboard based on role string
      switch (currentRole) {
        case UserRoleEnum.Administrator:
          router.replace('/portal/admin');
          break;
        case UserRoleEnum.ClinicAdmin:
          router.replace('/portal/clinic');
          break;
        case UserRoleEnum.Therapist:
          router.replace('/portal/therapist');
          break;
        default:
          router.replace('/portal/clinic');
          break;
      }
    } else {
    }
  }, [user, activeRole, router, pathname]);

  // Show loading state while redirecting
  return (
          <PageWrapper
      title="Mengalihkan..."
      description="Mengarahkan ke dashboard yang sesuai"
    >
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Mengalihkan ke dashboard Anda...</p>
        </CardContent>
      </Card>
          </PageWrapper>
  );
}