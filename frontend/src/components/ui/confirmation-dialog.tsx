import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  confirmButtonProps?: React.ComponentProps<typeof Button>;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    confirmButtonVariant: 'destructive' as const,
    iconClassName: 'text-red-600',
    bgClassName: 'bg-red-50',
  },
  warning: {
    icon: AlertTriangle,
    confirmButtonVariant: 'outline' as const,
    iconClassName: 'text-yellow-600',
    bgClassName: 'bg-yellow-50',
  },
  info: {
    icon: AlertTriangle,
    confirmButtonVariant: 'outline' as const,
    iconClassName: 'text-blue-600',
    bgClassName: 'bg-blue-50',
  },
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  icon,
  children,
  className,
  confirmButtonProps,
  cancelButtonProps,
}) => {
  const config = variantConfig[variant];
  const DefaultIcon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full', config.bgClassName)}>
              {icon || <DefaultIcon className={cn('h-5 w-5', config.iconClassName)} />}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-1 text-gray-600">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {children && (
          <div className="py-4">
            {children}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmButtonVariant}
            onClick={handleConfirm}
            {...confirmButtonProps}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Session-specific confirmation dialogs
export const DeleteSessionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sessionTitle: string;
  sessionId: string;
}> = ({ isOpen, onClose, onConfirm, sessionTitle, sessionId }) => (
  <ConfirmationDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Hapus Sesi"
    description={`Apakah Anda yakin ingin menghapus sesi "${sessionTitle}"? Tindakan ini tidak dapat dibatalkan.`}
    confirmText="Hapus Sesi"
    variant="danger"
  >
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <p className="text-sm text-red-700">
        <strong>Peringatan:</strong> Menghapus sesi akan menghilangkan semua data terkait termasuk:
      </p>
      <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
        <li>Catatan sesi</li>
        <li>Progress tracking</li>
        <li>Feedback klien</li>
        <li>Homework assignments</li>
      </ul>
    </div>
  </ConfirmationDialog>
);

export const CancelSessionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sessionTitle: string;
  sessionId: string;
}> = ({ isOpen, onClose, onConfirm, sessionTitle, sessionId }) => (
  <ConfirmationDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Batalkan Sesi"
    description={`Apakah Anda yakin ingin membatalkan sesi "${sessionTitle}"?`}
    confirmText="Batalkan Sesi"
    variant="warning"
  >
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
      <p className="text-sm text-yellow-700">
        <strong>Informasi:</strong> Sesi yang dibatalkan dapat dijadwalkan ulang di kemudian hari.
      </p>
    </div>
  </ConfirmationDialog>
);

export const UnsavedChangesDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, onClose, onConfirm, onCancel }) => (
  <ConfirmationDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Perubahan Belum Disimpan"
    description="Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?"
    confirmText="Tinggalkan Halaman"
    cancelText="Tetap di Sini"
    variant="warning"
  >
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
      <p className="text-sm text-yellow-700">
        Perubahan yang belum disimpan akan hilang jika Anda meninggalkan halaman ini.
      </p>
    </div>
  </ConfirmationDialog>
);

// Hook for confirmation dialog
export const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>>({
    title: '',
    onConfirm: () => {},
  });

  const openDialog = React.useCallback((dialogConfig: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    config,
    openDialog,
    closeDialog,
  };
};

export default ConfirmationDialog;