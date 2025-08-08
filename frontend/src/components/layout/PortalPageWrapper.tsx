'use client';

import React from 'react';
import { PageWrapper } from './PageWrapper';

interface PortalPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBackClick?: () => void;
}

export const PortalPageWrapper: React.FC<PortalPageWrapperProps> = (props) => {
  return <PageWrapper {...props} />;
};