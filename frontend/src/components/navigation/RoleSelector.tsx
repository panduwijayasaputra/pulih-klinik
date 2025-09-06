'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRole } from '@/types/auth';
import { UserRoleEnum } from '@/types/enums';

// Helper function to get role-based path with robust role matching
const getRoleBasedPath = (role: UserRole): string => {
  // Normalize role to lowercase string for comparison
  const normalizedRole = String(role).toLowerCase().trim();
  
  // Create a comprehensive role mapping
  const rolePathMap: Record<string, string> = {
    // Administrator variations
    'administrator': '/portal/admin',
    'admin': '/portal/admin',
    
    // Clinic Admin variations
    'clinic_admin': '/portal/clinic',
    'clinicadmin': '/portal/clinic',
    'clinic': '/portal/clinic',
    
    // Therapist variations
    'therapist': '/portal/therapist',
    'therapists': '/portal/therapist',
  };
  
  // Add enum values to the map
  rolePathMap[UserRoleEnum.Administrator] = '/portal/admin';
  rolePathMap[UserRoleEnum.ClinicAdmin] = '/portal/clinic';
  rolePathMap[UserRoleEnum.Therapist] = '/portal/therapist';
  
  // Try exact match first
  if (rolePathMap[normalizedRole]) {
    return rolePathMap[normalizedRole];
  }
  
  // Try partial matching for edge cases
  if (normalizedRole.includes('admin') && !normalizedRole.includes('clinic')) {
    return '/portal/admin';
  } else if (normalizedRole.includes('clinic')) {
    return '/portal/clinic';
  } else if (normalizedRole.includes('therapist')) {
    return '/portal/therapist';
  }
  
  // Fallback to generic portal
  return '/portal';
};

interface RoleSelectorProps {
  className?: string;
  onRoleChange?: (role: UserRole | null) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  className = '',
  onRoleChange 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    activeRole,
    availableRoles,
    switchToRole,
    getRoleDisplayInfo,
    isMultiRole,
    isRoleSwitching,
  } = useNavigation();

  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleRoleSwitch = useCallback(async (role: string) => {
    if (isRoleSwitching) return; // Prevent rapid switching
    
    setShowRoleSelector(false);
    
    try {
      const selectedRole = role as UserRole;
      
      // Set loading state FIRST, then navigate
      switchToRole(selectedRole);
      
      // Small delay to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to role-specific page
      const roleBasedPath = getRoleBasedPath(selectedRole);
      
      // Ensure the path is a valid string before navigation
      if (typeof roleBasedPath === 'string' && roleBasedPath.startsWith('/')) {
        router.push(roleBasedPath as any);
      } else {
        // Fallback to generic portal
        router.push('/portal' as any);
      }
      
      // Call the role change callback if provided
      onRoleChange?.(selectedRole);
      
    } catch (error) {
      console.error('Error switching role:', error);
    }
  }, [isRoleSwitching, switchToRole, onRoleChange, router, availableRoles, activeRole, user?.roles]);

  // Early return after all hooks are called
  if (!user?.roles || !isMultiRole) {
    return null;
  }

  // Use active role or default to first role
  const currentRole = activeRole || user.roles[0];
  const currentRoleInfo = getRoleDisplayInfo(currentRole as UserRole);

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setShowRoleSelector(!showRoleSelector)}
        variant="outline"
        className="w-full justify-between text-left shadow-none min-w-0"
        size="sm"
        disabled={isRoleSwitching}
      >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
          {currentRoleInfo?.icon ? (
            <currentRoleInfo.icon className="h-4 w-4 flex-shrink-0" />
          ) : null}
          <span className="text-xs truncate">
            {currentRoleInfo.label}
          </span>
        </div>
        {showRoleSelector ? (
          <ChevronUpIcon className="h-4 w-4 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 flex-shrink-0 ml-2" />
        )}
      </Button>

      {showRoleSelector && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-10 shadow-lg min-w-full">
          <div className="p-2 space-y-1">
            {availableRoles.map((role) => {
              const roleInfo = getRoleDisplayInfo(role);
              
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  disabled={isRoleSwitching}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-2 min-w-0 ${
                    currentRole === role 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  } ${isRoleSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {roleInfo?.icon ? (
                    <roleInfo.icon className="h-4 w-4 flex-shrink-0" />
                  ) : null}
                  <span className="text-xs font-medium truncate">
                    {roleInfo.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
