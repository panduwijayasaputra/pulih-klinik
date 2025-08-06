'use client';

import { useSession } from 'next-auth/react';
import { Navigation, NavigationGroup } from './navigation';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from './sidebar';
import { dashboardNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export function DashboardSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-semibold">ST</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Smart Therapy</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavigationGroup title="Menu Utama">
          <Navigation items={dashboardNavigation} />
        </NavigationGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-2">
          {session?.user && (
            <div className="px-3 py-2">
              <div className="text-sm font-medium">
                {session.user.name || session.user.email}
              </div>
              <div className="text-xs text-muted-foreground">
                {session.user.licenseNumber ? `Lisensi: ${session.user.licenseNumber}` : 'Terapis'}
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => signOut({ callbackUrl: '/masuk' })}
          >
            Keluar
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 