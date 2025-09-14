'use client';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';

interface ClinicInfoProps {
  className?: string;
}

export const ClinicInfo: React.FC<ClinicInfoProps> = ({ 
  className = '' 
}) => {
  const { user } = useAuth();
  const { activeRole } = useNavigation();

  if (!user?.roles) {
    return null;
  }

  // Find the clinic info for the current active role
  const currentRole = activeRole || user.roles[0];
  
  // Get clinic info from any role that has clinic data
  // Since user belongs to one clinic, we can get clinic info from any role
  const clinicRole = user.roleDetails?.find(role => 
    role.clinicId && role.clinicName
  );

  if (!clinicRole || !clinicRole.clinicName) {
    // Show a placeholder to indicate the component is working
    return (
      <div className={`${className}`}>
        <div className="flex items-center space-x-2 px-2 py-1 bg-muted/30 rounded-md">
          <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">
              Clinic Info Not Available
            </p>
            <p className="text-xs text-muted-foreground/70 truncate">
              Debug Mode
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2 px-2 py-1 bg-muted/30 rounded-md">
        <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">
            {typeof clinicRole.clinicName === 'string' ? clinicRole.clinicName : 'Clinic Name'}
          </p>
          <p className="text-xs text-muted-foreground/70 truncate">
            Klinik
          </p>
        </div>
      </div>
    </div>
  );
};
