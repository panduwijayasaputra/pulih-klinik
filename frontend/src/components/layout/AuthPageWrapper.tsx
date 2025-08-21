'use client';

import React from 'react';
import { PageWrapper } from './PageWrapper';
import { cn } from '@/lib/utils';

interface AuthPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  showLogo?: boolean;
  centerContent?: boolean;
}

export const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({
  children,
  className = '',
  title,
  description,
  showLogo = true,
  centerContent = true
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PageWrapper 
        className={cn(centerContent && 'sm:mx-auto sm:w-full sm:max-w-md', className)}
      >
        {/* Logo and Header */}
        {(showLogo || title) && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {showLogo && (
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ST</span>
                </div>
              </div>
            )}
            
            {title && (
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                {title}
              </h2>
            )}
            
            {description && (
              <p className="mt-2 text-center text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};