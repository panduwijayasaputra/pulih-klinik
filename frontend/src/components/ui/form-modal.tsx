'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

export const FormModal: React.FC<FormModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = '2xl',
  showCloseButton = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] min-h-[60vh] overflow-y-auto`}>
        <DialogHeader className="pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {title}
              </DialogTitle>
              {description && (
                <p className="text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={() => onOpenChange(false)}
                className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </DialogHeader>
        
        <div className="py-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
