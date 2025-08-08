'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-8 h-8 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />;
      default:
        return <InformationCircleIcon className="w-8 h-8 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" style={{ margin: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card className={`max-w-md w-full ${colors.bg} ${colors.border}`} style={{ margin: 0, transform: 'translateY(0)' }}>
        <CardHeader className="relative pb-4" style={{ margin: 0 }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-4" style={{ margin: 0 }}>
          <p className="text-gray-700 mb-4">{message}</p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 ${colors.button} text-white`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Memproses...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for using confirmation dialogs
export const useConfirmationDialog = () => {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    props: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>;
    onConfirm: () => void;
  } | null>(null);

  const showConfirmation = (
    props: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>,
    onConfirm: () => void
  ) => {
    setDialog({
      isOpen: true,
      props,
      onConfirm
    });
  };

  const closeDialog = () => {
    setDialog(null);
  };

  const handleConfirm = () => {
    if (dialog) {
      dialog.onConfirm();
      closeDialog(); // Close the dialog after confirmation
    }
  };

  const ConfirmationDialogComponent = dialog ? (
    <ConfirmationDialog
      {...dialog.props}
      isOpen={dialog.isOpen}
      onClose={closeDialog}
      onConfirm={handleConfirm}
    />
  ) : null;

  return {
    showConfirmation,
    closeDialog,
    ConfirmationDialog: ConfirmationDialogComponent
  };
};