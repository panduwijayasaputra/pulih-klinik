'use client';

import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { RouteGuard } from '@/components/auth/RouteGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Header */}
          <header className="bg-card border-b border-border sticky top-0 z-30">
            <div className="px-6 py-4">
              <Breadcrumbs />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            <div className="px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
};