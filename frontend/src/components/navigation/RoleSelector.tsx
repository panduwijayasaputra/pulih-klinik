'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { UserRole } from '@/types/auth';

interface RoleSelectorProps {
  className?: string;
  onRoleChange?: (role: UserRole | null) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  className = '',
  onRoleChange 
}) => {
  const { user } = useAuth();
  const {
    activeRole,
    availableRoles,
    switchToRole,
    clearActiveRole,
    getRoleDisplayInfo,
    isMultiRole,
  } = useNavigation();

  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRoleSwitch = useCallback(async (role: string) => {
    if (isSwitching) return; // Prevent rapid switching
    
    setIsSwitching(true);
    setShowRoleSelector(false);
    
    try {
      switchToRole(role as UserRole);
      onRoleChange?.(role as UserRole);
      
      // Small delay to prevent glitches
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setIsSwitching(false);
    }
  }, [isSwitching, switchToRole, onRoleChange]);

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
        disabled={isSwitching}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <currentRoleInfo.icon className="h-4 w-4 flex-shrink-0" />
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
                  disabled={isSwitching}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-2 min-w-0 ${
                    currentRole === role 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <roleInfo.icon className="h-4 w-4 flex-shrink-0" />
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
