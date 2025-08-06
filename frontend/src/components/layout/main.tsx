'use client';

import { cn } from '@/lib/utils';

interface MainProps {
  children?: React.ReactNode;
  className?: string;
}

export function Main({ children, className }: MainProps) {
  return (
    <main
      className={cn(
        'flex-1 overflow-auto bg-background p-6',
        className
      )}
    >
      {children}
    </main>
  );
}

interface MainHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function MainHeader({
  title,
  description,
  children,
  className,
}: MainHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center space-x-2">{children}</div>}
      </div>
    </div>
  );
}