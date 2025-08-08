'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  
  // Page header props
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode | false;
  
  // Back button props
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBackClick?: () => void;
}



export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  center = false,
  title,
  subtitle,
  description,
  actions = false,
  showBackButton = false,
  backButtonLabel = 'Back',
  onBackClick
}) => {
  const router = useRouter();
  const wrapperClasses = cn(
    // Base container styles
    'w-full',
    
    // Fixed max width constraint
    'max-w-8xl',
    
    // Centering
    center && 'mx-auto',
    
    // Custom classes
    className
  );

  const hasHeader = title || subtitle || description || actions;
  const hasBackButton = showBackButton;

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className={wrapperClasses}>
      <div className="space-y-6">
        {/* Back Button */}
        {hasBackButton && (
          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {backButtonLabel}
            </Button>
          </div>
        )}

        {/* Page Header */}
        {hasHeader && (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
              )}
              
              {subtitle && (
                <h2 className="mt-1 text-xl font-medium text-gray-700">
                  {subtitle}
                </h2>
              )}
              
              {description && (
                <p className="mt-2 text-base text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {actions && (
              <div className="flex-shrink-0 flex items-center">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="min-h-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};