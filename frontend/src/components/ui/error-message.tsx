import React from 'react';
import { AlertTriangle, XCircle, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info' | 'critical';
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const errorTypeConfig = {
  error: {
    icon: XCircle,
    variant: 'destructive' as const,
    title: 'Kesalahan',
    className: 'border-red-200 bg-red-50 text-red-800',
  },
  warning: {
    icon: AlertTriangle,
    variant: 'warning' as const,
    title: 'Peringatan',
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  },
  info: {
    icon: Info,
    variant: 'info' as const,
    title: 'Informasi',
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  critical: {
    icon: AlertCircle,
    variant: 'destructive' as const,
    title: 'Kesalahan Kritis',
    className: 'border-red-300 bg-red-100 text-red-900',
  },
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
  showIcon = true,
  dismissible = false,
  onDismiss,
  className,
  children,
}) => {
  const config = errorTypeConfig[type];
  const IconComponent = config.icon;

  return (
    <Alert 
      variant={config.variant}
      className={cn(config.className, className)}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          {(title || config.title) && (
            <AlertTitle className="font-medium">
              {title || config.title}
            </AlertTitle>
          )}
          
          <AlertDescription className="mt-1">
            {message}
            {children && <div className="mt-2">{children}</div>}
          </AlertDescription>
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
            aria-label="Tutup pesan"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
};

// Convenience components for specific error types
export const ErrorAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage type="error" {...props} />
);

export const WarningAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage type="warning" {...props} />
);

export const InfoAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage type="info" {...props} />
);

export const CriticalErrorAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage type="critical" {...props} />
);

// Field-level error message component
export interface FieldErrorProps {
  error?: string;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div className={cn("text-sm text-red-600 mt-1 flex items-center gap-1", className)}>
      <XCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

// Network error component
export interface NetworkErrorProps {
  error?: Error;
  onRetry?: () => void;
  className?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ 
  error, 
  onRetry, 
  className 
}) => {
  if (!error) return null;

  const isNetworkError = error.message.includes('fetch') || 
                        error.message.includes('network') ||
                        error.message.includes('Failed to fetch');

  return (
    <ErrorMessage
      type={isNetworkError ? 'warning' : 'error'}
      title={isNetworkError ? 'Kesalahan Jaringan' : 'Kesalahan Koneksi'}
      message={
        isNetworkError 
          ? 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
          : error.message
      }
      className={className}
      children={
        onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Coba lagi
          </button>
        )
      }
    />
  );
};

// Validation error component
export interface ValidationErrorProps {
  errors?: string[];
  className?: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ 
  errors, 
  className 
}) => {
  if (!errors || errors.length === 0) return null;

  return (
    <ErrorMessage
      type="warning"
      title="Kesalahan Validasi"
      message={errors.length === 1 ? errors[0] : 'Beberapa kesalahan validasi ditemukan:'}
      className={className}
      children={
        errors.length > 1 && (
          <ul className="mt-2 list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        )
      }
    />
  );
};

export default ErrorMessage;
