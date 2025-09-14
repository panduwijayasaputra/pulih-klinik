'use client';
import { UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';

interface UserInfoProps {
  className?: string;
  showRole?: boolean;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  className = '',
  showRole = true
}) => {
  const { user } = useAuth();
  const { getRoleDisplayInfo, activeRole } = useNavigation();

  if (!user) {
    return null;
  }

  const primaryRole = user.roles?.[0];
  const currentRole = activeRole || primaryRole;
  const currentRoleInfo = currentRole ? getRoleDisplayInfo(currentRole) : null;

  // Get clinic info from user level
  const clinicName = user.clinicName;

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Current Role Display */}
      {showRole && currentRoleInfo && (
        <div className="space-y-1">
          <div className="flex items-center space-x-3 py-1">
            <currentRoleInfo.icon className="h-8 w-8 text-muted-foreground" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-muted-foreground">
                {currentRoleInfo.label}
              </span>
              {/* Clinic Info Display */}
              {clinicName && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground/70 truncate">
                    {clinicName}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
