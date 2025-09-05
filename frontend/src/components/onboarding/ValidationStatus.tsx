'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface ValidationStatusProps {
  className?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ className = '' }) => {
  const { isValidating, lastValidated, isDataStale, error } = useAuthStore();
  const [showStatus, setShowStatus] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Show status when validation is in progress, data is stale, or there's an error
  useEffect(() => {
    if (isValidating || isDataStale() || error) {
      setShowStatus(true);
    } else {
      // Hide status after 3 seconds if validation is complete
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isValidating, lastValidated, error]);

  const handleManualRefresh = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).forceAuthValidation) {
      setLastRefresh(new Date());
      (window as any).forceAuthValidation();
    }
  }, []);

  const statusConfig = useMemo(() => {
    if (error) {
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        text: error,
        color: 'bg-red-50 border-red-200 text-red-800',
      };
    } else if (isValidating) {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />,
        text: 'Validating data...',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
      };
    } else if (isDataStale()) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
        text: 'Data may be outdated',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      };
    } else {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        text: 'Data is current',
        color: 'bg-green-50 border-green-200 text-green-800',
      };
    }
  }, [error, isValidating, isDataStale]);

  const formatLastValidated = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
  }, []);

  if (!showStatus) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border shadow-lg ${statusConfig.color}`}>
        <div className="flex items-center gap-2">
          {statusConfig.icon}
          <span className="text-sm font-medium">{statusConfig.text}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {lastValidated && (
            <div className="flex items-center gap-1 text-xs opacity-75">
              <Clock className="h-3 w-3" />
              <span>{formatLastValidated(lastValidated)}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isValidating}
            className="h-6 px-2 text-xs hover:bg-white/20"
          >
            <RefreshCw className={`h-3 w-3 ${isValidating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};
