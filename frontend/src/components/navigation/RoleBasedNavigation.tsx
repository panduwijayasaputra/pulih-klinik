'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';

interface RoleBasedNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({ 
  className = '',
  onItemClick 
}) => {
  const { user, isLoading } = useAuth();
  const {
    navigationItems,
    filteredNavigationItems,
    activeRole,
    isActiveItem,
  } = useNavigation();

  if (isLoading) {
    return (
      <nav className={`space-y-2 ${className}`}>
        <div className="text-xs text-muted-foreground px-3 py-2">Memuat menu...</div>
      </nav>
    );
  }

  if (!user?.roles) {
    return (
      <nav className={`space-y-2 ${className}`}>
        <div className="text-xs text-muted-foreground px-3 py-2">Tidak ada menu.</div>
      </nav>
    );
  }

  // Use filtered items if a specific role is active, otherwise use all navigation items
  const displayItems = activeRole ? filteredNavigationItems : navigationItems;

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const hasItems = displayItems.length > 0;

  return (
    <nav className={`space-y-2 ${className}`}>
      {!hasItems && (
        <div className="text-xs text-muted-foreground px-3 py-2">
          Tidak ada menu yang tersedia untuk peran ini.
        </div>
      )}
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
