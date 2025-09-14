'use client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRoleEnum } from '@/types/enums';
import { Card, CardContent } from '@/components/ui/card';

export default function PortalPage() {
  const { user } = useAuth();
  const { activeRole } = useNavigation();

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (!user) return null;

    const currentRole = activeRole || user.roles[0];
    
    switch (currentRole) {
      case UserRoleEnum.Administrator:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Panel Administrator</h1>
              <p className="text-muted-foreground">Kelola sistem Terapintar secara keseluruhan</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Dashboard Administrator - Coming Soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case UserRoleEnum.ClinicAdmin:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Klinik</h1>
              <p className="text-muted-foreground">Kelola klinik dan tim therapist Anda</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Dashboard Klinik - Coming Soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case UserRoleEnum.Therapist:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Therapist</h1>
              <p className="text-muted-foreground">Kelola sesi terapi dan klien Anda</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Dashboard Therapist - Coming Soon</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Selamat datang di Terapintar</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Dashboard - Coming Soon</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return getDashboardComponent();
}