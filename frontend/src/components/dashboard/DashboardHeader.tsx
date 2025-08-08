'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigation } from '@/hooks/useNavigation';
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
  showSubscriptionStatus?: boolean;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  showNotifications = true,
  showSubscriptionStatus = true,
  className = ""
}) => {
  const { user, logout } = useAuth();
  const { activeRole, getRoleDisplayInfo } = useNavigation();
  const { currentTierInfo, usageAlerts } = useSubscription();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (!user) return null;

  const currentRole = activeRole || user.roles[0];
  const roleInfo = currentRole ? getRoleDisplayInfo(currentRole) : null;
  const criticalAlerts = usageAlerts.filter(alert => 
    alert.type === 'critical' || alert.type === 'limit_reached'
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left: Title and subtitle */}
        <div className="flex-1">
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-4">
          {/* Subscription Status */}
          {showSubscriptionStatus && currentTierInfo && (
            <div className="hidden sm:flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`${currentTierInfo.color} ${currentTierInfo.bgColor} border-current`}
              >
                {currentTierInfo.name}
              </Badge>
              {criticalAlerts.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {criticalAlerts.length} Alert{criticalAlerts.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}

          {/* Notifications */}
          {showNotifications && (
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <BellIcon className="h-5 w-5" />
                  {usageAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {usageAlerts.length > 9 ? '9+' : usageAlerts.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {usageAlerts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Tidak ada notifikasi
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {usageAlerts.slice(0, 5).map((alert, index) => (
                      <DropdownMenuItem key={index} className="flex items-start p-3">
                        <ExclamationTriangleIcon 
                          className={`h-4 w-4 mr-2 flex-shrink-0 mt-0.5 ${
                            alert.type === 'limit_reached' ? 'text-red-500' :
                            alert.type === 'critical' ? 'text-amber-500' : 'text-blue-500'
                          }`} 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    
                    {usageAlerts.length > 5 && (
                      <div className="p-2 text-center border-t">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Lihat semua ({usageAlerts.length - 5} lainnya)
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Cog6ToothIcon className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{roleInfo.label}</p>
                  </div>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Role Information */}
              {roleInfo && (
                <div className="px-2 py-2">
                  <div className="flex items-center space-x-2">
                    <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                    <span className="text-sm">{roleInfo.label}</span>
                  </div>
                  {user.clinicId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Clinic: {user.clinicId}
                    </p>
                  )}
                </div>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <UserCircleIcon className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Pengaturan
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile subscription status */}
      {showSubscriptionStatus && currentTierInfo && (
        <div className="sm:hidden mt-3 flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`${currentTierInfo.color} ${currentTierInfo.bgColor} border-current`}
          >
            Paket {currentTierInfo.name}
          </Badge>
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {criticalAlerts.length} Peringatan
            </Badge>
          )}
        </div>
      )}
    </header>
  );
};