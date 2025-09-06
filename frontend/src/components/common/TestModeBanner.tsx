'use client';

import { useState, useEffect } from 'react';

export const TestModeBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner in development or staging environments
    const isDev = process.env.NODE_ENV === 'development';
    const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging' || 
                     process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
    
    setIsVisible(isDev || isStaging);
  }, []);

  if (!isVisible) {
    return null;
  }

  const getEnvironmentText = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'Development Mode';
    }
    if (process.env.NEXT_PUBLIC_APP_ENV === 'staging' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      return 'Staging Mode';
    }
    return 'Test Mode';
  };

  const getEnvironmentColor = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'bg-blue-600';
    }
    if (process.env.NEXT_PUBLIC_APP_ENV === 'staging' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      return 'bg-orange-600';
    }
    return 'bg-yellow-600';
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${getEnvironmentColor()} text-white px-3 py-1 rounded-md shadow-lg text-sm font-medium`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        {getEnvironmentText()}
      </div>
    </div>
  );
};
