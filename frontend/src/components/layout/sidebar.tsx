'use client';

import { cn } from '@/lib/utils';

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
  collapsed?: boolean;
}

export function Sidebar({ children, className, collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'relative flex h-full flex-col bg-background border-r border-border/40',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {children}
    </aside>
  );
}

interface SidebarHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-14 items-center border-b border-border/40 px-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface SidebarContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn('flex-1 overflow-auto py-2', className)}>
      {children}
    </div>
  );
}

interface SidebarFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        'mt-auto border-t border-border/40 p-4',
        className
      )}
    >
      {children}
    </div>
  );
}