'use client';

import React, { useState } from 'react';
import { 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { RoleBasedNavigation, UserInfo } from './index';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { logout } = useAuth();
  const { menuCollapsed, toggleMenu } = useNavigation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Button
          onClick={toggleMenu}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 bg-background shadow-lg"
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
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-card border-r border-border
          transform transition-transform duration-200 ease-in-out
          lg:transform-none
          flex flex-col h-screen lg:h-auto
        `}
      >
        {/* Header */}
        <div className="px-6 h-12 flex items-center border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              TERA
              <span className="text-primary-500">PINTAR</span>
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

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <UserInfo />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 overflow-y-auto">
          <RoleBasedNavigation 
            onItemClick={toggleMenu} // Close mobile menu on item click
          />
        </div>

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