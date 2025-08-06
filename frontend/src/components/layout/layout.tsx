'use client';

import { cn } from '@/lib/utils';
import { Header } from './header';
import { Main } from './main';
import { Sidebar } from './sidebar';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Layout({
  children,
  className,
  showSidebar = true,
  sidebarCollapsed = false,
  header,
  sidebar,
}: LayoutProps) {
  return (
    <div className={cn('flex h-screen flex-col', className)}>
      {header && <Header>{header}</Header>}
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar collapsed={sidebarCollapsed}>
            {sidebar}
          </Sidebar>
        )}
        
        <Main className="flex-1">
          {children}
        </Main>
      </div>
    </div>
  );
}

// Re-export components for convenience
export { Header } from './header';
export { Main, MainHeader } from './main';
export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from './sidebar';
export { PageContainer } from './page-container';