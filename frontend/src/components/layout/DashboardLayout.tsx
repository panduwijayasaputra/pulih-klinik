'use client';

import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { RoleSelector } from '@/components/navigation/RoleSelector';
import { RouteGuard } from '@/components/auth/RouteGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar className="flex-shrink-0" />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-card border-b border-border sticky top-0 z-30 flex-shrink-0">
            <div className="px-6 py-6 lg:pl-6 pl-16 flex items-center justify-between">
              {/* Left: Breadcrumbs */}
              <div className="flex-1">
                <Breadcrumbs />
              </div>
              
              {/* Right: Role Selector */}
              <div className="ml-4">
                <RoleSelector />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
};