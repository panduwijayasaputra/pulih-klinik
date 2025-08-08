'use client';
import { UserCircleIcon } from '@heroicons/react/24/outline';
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
        <div className="flex items-center space-x-2 px-2 py-1">
          <currentRoleInfo.icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {currentRoleInfo.label}
          </span>
        </div>
      )}
    </div>
  );
};
