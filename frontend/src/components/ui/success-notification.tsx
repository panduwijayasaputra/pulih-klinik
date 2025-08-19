import React from 'react';
import { CheckCircle, X, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export interface SuccessNotificationProps {
  title?: string;
  message: string;
  type?: 'success' | 'info';
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
}

const notificationTypeConfig = {
  success: {
    icon: CheckCircle,
    variant: 'success' as const,
    title: 'Berhasil',
    className: 'border-green-200 bg-green-50 text-green-800',
  },
  info: {
    icon: Info,
    variant: 'info' as const,
    title: 'Informasi',
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
};

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  title,
  message,
  type = 'success',
  showIcon = true,
  dismissible = false,
  onDismiss,
  className,
  children,
  autoDismiss = false,
  autoDismissDelay = 5000,
}) => {
  const config = notificationTypeConfig[type];
  const IconComponent = config.icon;

  React.useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss, autoDismissDelay]);

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
            aria-label="Tutup notifikasi"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
};

// Convenience components for specific notification types
export const SuccessAlert: React.FC<Omit<SuccessNotificationProps, 'type'>> = (props) => (
  <SuccessNotification type="success" {...props} />
);

export const InfoAlert: React.FC<Omit<SuccessNotificationProps, 'type'>> = (props) => (
  <SuccessNotification type="info" {...props} />
);

// Action success notification with action buttons
export interface ActionSuccessProps {
  title?: string;
  message: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export const ActionSuccess: React.FC<ActionSuccessProps> = ({
  title = 'Berhasil',
  message,
  primaryAction,
  secondaryAction,
  onDismiss,
  className,
}) => {
  return (
    <SuccessNotification
      title={title}
      message={message}
      className={className}
      children={
        (primaryAction || secondaryAction) && (
          <div className="flex gap-2 mt-3">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-3 py-1 text-sm border border-green-300 text-green-700 rounded hover:bg-green-50 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )
      }
    />
  );
};

// Session-specific success notifications
export const SessionCreatedSuccess: React.FC<{
  sessionTitle: string;
  onViewSession?: () => void;
  onCreateAnother?: () => void;
  onDismiss?: () => void;
}> = ({ sessionTitle, onViewSession, onCreateAnother, onDismiss }) => (
  <ActionSuccess
    title="Sesi Berhasil Dibuat"
    message={`Sesi "${sessionTitle}" telah berhasil dibuat dan ditambahkan ke jadwal.`}
    primaryAction={onViewSession ? {
      label: 'Lihat Sesi',
      onClick: onViewSession,
    } : undefined}
    secondaryAction={onCreateAnother ? {
      label: 'Buat Sesi Lain',
      onClick: onCreateAnother,
    } : undefined}
    onDismiss={onDismiss}
  />
);

export const SessionUpdatedSuccess: React.FC<{
  sessionTitle: string;
  onViewSession?: () => void;
  onDismiss?: () => void;
}> = ({ sessionTitle, onViewSession, onDismiss }) => (
  <ActionSuccess
    title="Sesi Berhasil Diperbarui"
    message={`Sesi "${sessionTitle}" telah berhasil diperbarui.`}
    primaryAction={onViewSession ? {
      label: 'Lihat Sesi',
      onClick: onViewSession,
    } : undefined}
    onDismiss={onDismiss}
  />
);

export const SessionDeletedSuccess: React.FC<{
  sessionTitle: string;
  onUndo?: () => void;
  onDismiss?: () => void;
}> = ({ sessionTitle, onUndo, onDismiss }) => (
  <ActionSuccess
    title="Sesi Berhasil Dihapus"
    message={`Sesi "${sessionTitle}" telah berhasil dihapus dari jadwal.`}
    primaryAction={onUndo ? {
      label: 'Batalkan',
      onClick: onUndo,
    } : undefined}
    onDismiss={onDismiss}
  />
);

// Form submission success
export const FormSubmissionSuccess: React.FC<{
  title?: string;
  message: string;
  onContinue?: () => void;
  onReset?: () => void;
  onDismiss?: () => void;
}> = ({ title = 'Form Berhasil Disimpan', message, onContinue, onReset, onDismiss }) => (
  <ActionSuccess
    title={title}
    message={message}
    primaryAction={onContinue ? {
      label: 'Lanjutkan',
      onClick: onContinue,
    } : undefined}
    secondaryAction={onReset ? {
      label: 'Reset Form',
      onClick: onReset,
    } : undefined}
    onDismiss={onDismiss}
  />
);

export default SuccessNotification;
