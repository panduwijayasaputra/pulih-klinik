'use client';
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
      <div className="h-screen bg-background flex overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar />
        
        {/* Main Content - with left margin for fixed sidebar */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Top Header */}
          <header className="bg-card border-b border-border z-30 flex-shrink-0 px-6 sticky top-0">
            <div className="max-w-8xl w-full h-12 flex items-center justify-between">
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

          {/* Page Content - scrollable */}
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