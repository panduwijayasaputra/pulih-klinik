'use client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { AdminDashboard, ClinicDashboard, TherapistDashboard } from '@/components/portal';

export default function PortalPage() {
  const { user } = useAuth();
  const { activeRole } = useNavigation();

  if (!user) {
    return null; // RouteGuard will handle this
  }

  // Use active role if set, otherwise fall back to primary role
  const currentRole = activeRole || user.roles[0];

  // Render role-specific dashboard component
  const renderRoleSpecificDashboard = () => {
    switch (currentRole) {
      case 'administrator':
        return <AdminDashboard />;
      case 'clinic_admin':
        return <ClinicDashboard />;
      case 'therapist':
        return <TherapistDashboard />;
      default:
        return <ClinicDashboard />; // Default fallback
    }
  };

  return renderRoleSpecificDashboard();
}