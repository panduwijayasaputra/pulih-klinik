'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
// import { NavigationItem } from '@/types/navigation';

interface RoleBasedNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({ 
  className = '',
  onItemClick 
}) => {
  const { user } = useAuth();
  const {
    navigationItems,
    filteredNavigationItems,
    activeRole,
    isActiveItem,
  } = useNavigation();

  if (!user?.roles) {
    return null;
  }

  // Use filtered items if a specific role is active, otherwise use all navigation items
  const displayItems = activeRole ? filteredNavigationItems : navigationItems;

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className={`space-y-2 ${className}`}>
      {displayItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveItem(item);
        
        return (
          <Link
            key={item.id}
            href={item.href as any}
            onClick={handleItemClick}
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium
              transition-colors duration-200
              ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
              ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
