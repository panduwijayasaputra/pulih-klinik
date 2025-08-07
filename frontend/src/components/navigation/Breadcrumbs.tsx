'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useNavigation } from '@/hooks/useNavigation';

interface BreadcrumbsProps {
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const { breadcrumbs } = useNavigation();

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;

        return (
          <div key={breadcrumb.id} className="flex items-center">
            {/* Separator */}
            {!isFirst && (
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground mx-2" />
            )}

            {/* Breadcrumb Item */}
            {breadcrumb.href && !isLast ? (
              <Link
                href={breadcrumb.href as any}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {isFirst && <HomeIcon className="h-4 w-4 mr-1" />}
                <span>{breadcrumb.label}</span>
              </Link>
            ) : (
              <span className={`flex items-center ${
                isLast 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground'
              }`}>
                {isFirst && <HomeIcon className="h-4 w-4 mr-1" />}
                {breadcrumb.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};