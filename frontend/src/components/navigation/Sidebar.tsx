'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const {
    navigationItems,
    filteredNavigationItems,
    activeRole,
    availableRoles,
    menuCollapsed,
    isMultiRole,
    toggleMenu,
    switchToRole,
    clearActiveRole,
    getRoleDisplayInfo,
    isActiveItem,
  } = useNavigation();

  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleRoleSwitch = (role: string) => {
    if (role === 'all') {
      clearActiveRole();
    } else {
      switchToRole(role as any);
    }
    setShowRoleSelector(false);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const displayItems = activeRole ? filteredNavigationItems : navigationItems;
  const currentRoleInfo = activeRole ? getRoleDisplayInfo(activeRole) : null;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={toggleMenu}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0"
        >
          {menuCollapsed ? (
            <Bars3Icon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {!menuCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${className}
          ${menuCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r border-border
          transform transition-transform duration-200 ease-in-out
          lg:transform-none
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Terapintar
            </h1>
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Info & Role Selector */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3 mb-3">
            <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Role Selector for Multi-Role Users */}
          {isMultiRole && (
            <div className="relative">
              <Button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                variant="outline"
                className="w-full justify-between text-left"
                size="sm"
              >
                <div className="flex items-center space-x-2">
                  {currentRoleInfo && (
                    <currentRoleInfo.icon className="h-4 w-4" />
                  )}
                  <span className="text-xs">
                    {currentRoleInfo ? currentRoleInfo.label : 'Semua Role'}
                  </span>
                </div>
                {showRoleSelector ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </Button>

              {showRoleSelector && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-10 shadow-lg">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleRoleSwitch('all')}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        !activeRole 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      Tampilkan Semua
                    </button>
                    {availableRoles.map((role) => {
                      const roleInfo = getRoleDisplayInfo(role);
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center space-x-2 ${
                            activeRole === role 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <roleInfo.icon className="h-4 w-4" />
                          <span>{roleInfo.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {displayItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);
            
            return (
              <Link
                key={item.id}
                href={item.href as any}
                onClick={() => toggleMenu()} // Close mobile menu
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                  ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={() => setShowLogoutConfirm(true)}
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            size="sm"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Konfirmasi Keluar
              </h3>
              <p className="text-muted-foreground mb-4">
                Apakah Anda yakin ingin keluar dari sistem?
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex-1"
                >
                  Keluar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};