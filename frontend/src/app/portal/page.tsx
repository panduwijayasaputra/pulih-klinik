'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRoleEnum } from '@/types/enums';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Card, CardContent } from '@/components/ui/card';

export default function PortalPage() {
  const { user } = useAuth();
  const { activeRole } = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return; // RouteGuard will handle this
    }   

    // Use active role if set, otherwise fall back to primary role
    const currentRole = activeRole || user.roles[0];

    // Redirect to role-specific dashboard
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
        router.replace('/portal/clinic'); // Default fallback
        break;
    }
  }, [user, activeRole, router]);

  // Show loading state while redirecting
  return (
    <PortalPageWrapper
      title="Mengalihkan..."
      description="Mengarahkan ke dashboard yang sesuai"
    >
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Mengalihkan ke dashboard Anda...</p>
        </CardContent>
      </Card>
    </PortalPageWrapper>
  );
}