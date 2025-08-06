'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: Route | string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  collapsed?: boolean;
  className?: string;
}

export function Navigation({ items, collapsed = false, className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('space-y-1 px-2', className)}>
      {items.map((item) => {
        const isActive = item.isActive ?? pathname === item.href;
        
        if (item.disabled) {
          return (
            <div
              key={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'pointer-events-none opacity-50 text-muted-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              {item.icon && (
                <span className={cn('shrink-0', collapsed && 'mx-0')}>
                  {item.icon}
                </span>
              )}
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </div>
          );
        }
        
        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground',
              collapsed && 'justify-center px-2'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon && (
              <span className={cn('shrink-0', collapsed && 'mx-0')}>
                {item.icon}
              </span>
            )}
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

interface NavigationGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function NavigationGroup({
  title,
  children,
  collapsed = false,
  className,
}: NavigationGroupProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {!collapsed && (
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}