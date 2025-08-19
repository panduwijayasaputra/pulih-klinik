import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ValidationFeedbackProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message?: string;
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const feedbackConfig = {
  error: {
    icon: XCircle,
    className: 'text-red-600',
    bgClassName: 'bg-red-50 border-red-200',
  },
  success: {
    icon: CheckCircle,
    className: 'text-green-600',
    bgClassName: 'bg-green-50 border-green-200',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-yellow-600',
    bgClassName: 'bg-yellow-50 border-yellow-200',
  },
  info: {
    icon: Info,
    className: 'text-blue-600',
    bgClassName: 'bg-blue-50 border-blue-200',
  },
};

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  type = 'error',
  message,
  showIcon = true,
  className,
  children,
}) => {
  if (!message && !children) return null;

  const config = feedbackConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-2 rounded-md border text-sm',
        config.bgClassName,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <IconComponent className={cn('h-4 w-4 mt-0.5 flex-shrink-0', config.className)} />
      )}
      <div className="flex-1 min-w-0">
        {message && <p className={config.className}>{message}</p>}
        {children && <div className="mt-1">{children}</div>}
      </div>
    </div>
  );
};

// Field-level validation feedback
export interface FieldValidationFeedbackProps {
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  showIcon?: boolean;
  className?: string;
}

export const FieldValidationFeedback: React.FC<FieldValidationFeedbackProps> = ({
  error,
  success,
  warning,
  info,
  showIcon = true,
  className,
}) => {
  if (error) {
    return (
      <ValidationFeedback
        type="error"
        message={error}
        showIcon={showIcon}
        className={cn('mt-1', className)}
      />
    );
  }

  if (success) {
    return (
      <ValidationFeedback
        type="success"
        message={success}
        showIcon={showIcon}
        className={cn('mt-1', className)}
      />
    );
  }

  if (warning) {
    return (
      <ValidationFeedback
        type="warning"
        message={warning}
        showIcon={showIcon}
        className={cn('mt-1', className)}
      />
    );
  }

  if (info) {
    return (
      <ValidationFeedback
        type="info"
        message={info}
        showIcon={showIcon}
        className={cn('mt-1', className)}
      />
    );
  }

  return null;
};

// Form-level validation feedback
export interface FormValidationFeedbackProps {
  errors?: string[];
  warnings?: string[];
  info?: string[];
  className?: string;
}

export const FormValidationFeedback: React.FC<FormValidationFeedbackProps> = ({
  errors,
  warnings,
  info,
  className,
}) => {
  if (!errors?.length && !warnings?.length && !info?.length) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {errors?.map((error, index) => (
        <ValidationFeedback
          key={`error-${index}`}
          type="error"
          message={error}
        />
      ))}
      
      {warnings?.map((warning, index) => (
        <ValidationFeedback
          key={`warning-${index}`}
          type="warning"
          message={warning}
        />
      ))}
      
      {info?.map((infoMessage, index) => (
        <ValidationFeedback
          key={`info-${index}`}
          type="info"
          message={infoMessage}
        />
      ))}
    </div>
  );
};

// Password strength indicator
export interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className,
}) => {
  const getPasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'];
  const strengthBgColors = ['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-blue-100', 'bg-green-100'];

  if (!password) return null;

  return (
    <div className={cn('mt-2', className)}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                'h-1 w-8 rounded-full transition-colors',
                level <= strength ? strengthBgColors[strength - 1] : 'bg-gray-200'
              )}
            />
          ))}
        </div>
        <span className={cn('text-xs font-medium', strengthColors[strength - 1])}>
          {strengthLabels[strength - 1]}
        </span>
      </div>
      
      <div className="text-xs text-gray-600">
        {strength < 3 && (
          <p>Password harus minimal 8 karakter dengan huruf besar, kecil, angka, dan simbol</p>
        )}
      </div>
    </div>
  );
};

// Character counter
export interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  current,
  max,
  className,
}) => {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = current > max;

  return (
    <div className={cn('text-xs text-right mt-1', className)}>
      <span
        className={cn(
          isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'
        )}
      >
        {current}/{max}
      </span>
    </div>
  );
};

// Form submission status
export interface FormSubmissionStatusProps {
  isSubmitting?: boolean;
  isSuccess?: boolean;
  error?: string;
  successMessage?: string;
  className?: string;
}

export const FormSubmissionStatus: React.FC<FormSubmissionStatusProps> = ({
  isSubmitting,
  isSuccess,
  error,
  successMessage,
  className,
}) => {
  if (isSubmitting) {
    return (
      <ValidationFeedback
        type="info"
        message="Menyimpan data..."
        className={className}
      />
    );
  }

  if (isSuccess && successMessage) {
    return (
      <ValidationFeedback
        type="success"
        message={successMessage}
        className={className}
      />
    );
  }

  if (error) {
    return (
      <ValidationFeedback
        type="error"
        message={error}
        className={className}
      />
    );
  }

  return null;
};

export default ValidationFeedback;
