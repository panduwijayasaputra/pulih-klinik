'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRoleEnum } from '@/types/enums';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';

export default function PortalPage() {
  const { user } = useAuth();
  const { activeRole } = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log('🚫 Portal: No user found, RouteGuard will handle');
      return; // RouteGuard will handle this
    }   

    // Use active role if set, otherwise fall back to primary role
    const currentRole = activeRole || user.roles[0];
    console.log('🎭 Portal: User roles:', user.roles);
    console.log('🎭 Portal: Active role:', activeRole);
    console.log('🎭 Portal: Current role:', currentRole);
    console.log('🎭 Portal: Administrator enum:', UserRoleEnum.Administrator);

    // Redirect to role-specific dashboard
    switch (currentRole) {
      case UserRoleEnum.Administrator:
        console.log('🔀 Portal: Redirecting to /portal/admin');
        router.replace('/portal/admin');
        break;
      case UserRoleEnum.ClinicAdmin:
        console.log('🔀 Portal: Redirecting to /portal/clinic');
        router.replace('/portal/clinic');
        break;
      case UserRoleEnum.Therapist:
        console.log('🔀 Portal: Redirecting to /portal/therapist');
        router.replace('/portal/therapist');
        break;
      default:
        console.log('🔀 Portal: Unknown role, redirecting to /portal/clinic (fallback)');
        router.replace('/portal/clinic'); // Default fallback
        break;
    }
  }, [user, activeRole, router]);

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