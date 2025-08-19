'use client';

import * as React from 'react';
import { ConsultationSummary } from './ConsultationSummary';
import { useConsultationSummary } from '@/hooks/useConsultation';

interface ConsultationSummaryWithValidationProps {
  consultationId: string;
  className?: string;
  enabled?: boolean;
}

export const ConsultationSummaryWithValidation: React.FC<ConsultationSummaryWithValidationProps> = ({
  consultationId,
  className,
  enabled = true,
}) => {
  const {
    summaryData,
    isLoading,
    error,
    validationErrors,
    hasValidationIssues,
    isDataValid,
    retry,
  } = useConsultationSummary(consultationId, { enabled });

  return (
    <ConsultationSummary
      data={summaryData}
      isLoading={isLoading}
      error={error?.message || null}
      validationErrors={validationErrors}
      hasValidationIssues={hasValidationIssues}
      isDataValid={isDataValid}
      onRetry={retry}
      className={className}
    />
  );
};

export default ConsultationSummaryWithValidation;