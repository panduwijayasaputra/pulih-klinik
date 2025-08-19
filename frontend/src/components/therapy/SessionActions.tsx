'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  Session,
  SessionStatusEnum,
  SessionStatusLabels,
  VALID_STATUS_TRANSITIONS,
} from '@/types/therapy';
import { SessionScheduleModal } from './SessionScheduleModal';
import { ConfirmationModal } from './ConfirmationModal';
import { SessionFormModal } from './SessionFormModal';
import {
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface SessionActionsProps {
  session: Session;
  sessions: Session[]; // All sessions for continuity checking
  onStatusChange?: (sessionId: string, newStatus: SessionStatusEnum) => Promise<void>;
  onUpdateSession?: (sessionId: string, data: any) => Promise<void>;
  onCreateSession?: (data: any) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  clientId?: string;
  therapyId?: string;
  therapistId?: string;
  nextSessionNumber?: number;
}

interface ActionButtonConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'outline' | 'destructive' | 'secondary';
  action: () => void;
  disabled?: boolean;
  disabledReason?: string;
  confirmMessage?: string;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  session,
  sessions = [],
  onStatusChange,
  onUpdateSession,
  onCreateSession,
  isLoading = false,
  className = '',
  clientId,
  therapyId,
  therapistId,
  nextSessionNumber = 1,
}) => {
  const { addToast } = useToast();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'start' | 'complete' | 'cancel' | 'reschedule'>('start');

  // Session continuity validation
  const checkSessionContinuity = (): { canStart: boolean; reason?: string } => {
    // Get all sessions for the same therapy, sorted by session number
    const therapySessions = sessions
      .filter(s => s.therapyId === session.therapyId)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);

    // Find current session index
    const currentIndex = therapySessions.findIndex(s => s.id === session.id);
    
    if (currentIndex === 0) {
      // First session can always be started
      return { canStart: true };
    }

    // Check if all previous sessions are completed
    for (let i = 0; i < currentIndex; i++) {
      const prevSession = therapySessions[i];
      if (prevSession.status !== SessionStatusEnum.Completed) {
        return {
          canStart: false,
          reason: `Sesi ${prevSession.sessionNumber} harus diselesaikan terlebih dahulu sebelum memulai sesi ini.`
        };
      }
    }

    return { canStart: true };
  };

  // Check if status transition is valid
  const isValidTransition = (newStatus: SessionStatusEnum): boolean => {
    const validTransitions = VALID_STATUS_TRANSITIONS[session.status] || [];
    return validTransitions.includes(newStatus);
  };

  // Modal handlers
  const handleScheduleSession = () => {
    setShowScheduleModal(true);
  };

  const handleEditSession = () => {
    setShowEditModal(true);
  };

  const handleStartSession = () => {
    setConfirmationType('start');
    setShowConfirmationModal(true);
  };

  const handleCompleteSession = () => {
    setConfirmationType('complete');
    setShowConfirmationModal(true);
  };

  const handleCancelSession = () => {
    setConfirmationType('cancel');
    setShowConfirmationModal(true);
  };

  const handleRescheduleSession = () => {
    setConfirmationType('reschedule');
    setShowConfirmationModal(true);
  };

  // Handle scheduling submission
  const handleScheduleSubmit = async (sessionId: string, data: any) => {
    if (onUpdateSession) {
      await onUpdateSession(sessionId, data);
    }
  };

  // Handle edit submission
  const handleEditSubmit = async (data: any) => {
    if (onUpdateSession) {
      await onUpdateSession(session.id, data);
    }
  };

  // Handle confirmation modal actions
  const handleConfirmationAction = async () => {
    if (!onStatusChange) return;

    let newStatus: SessionStatusEnum;
    let shouldNavigate = false;

    switch (confirmationType) {
      case 'start':
        newStatus = SessionStatusEnum.Started;
        shouldNavigate = true;
        break;
      case 'complete':
        newStatus = SessionStatusEnum.Completed;
        break;
      case 'cancel':
        newStatus = SessionStatusEnum.Cancelled;
        break;
      case 'reschedule':
        // For reschedule, we just open the schedule modal
        setShowConfirmationModal(false);
        setShowScheduleModal(true);
        return;
      default:
        return;
    }

    try {
      await onStatusChange(session.id, newStatus);
      
      // Navigate to session page after starting session
      if (shouldNavigate && confirmationType === 'start') {
        router.push(`/portal/therapist/sessions/${session.id}`);
      }
    } catch (error) {
      // Error is already handled in the hook
      throw error;
    }
  };

  // Generate action buttons based on session status
  const getActionButtons = (): ActionButtonConfig[] => {
    const buttons: ActionButtonConfig[] = [];

    switch (session.status) {
      case SessionStatusEnum.New:
        // New sessions can be scheduled or edited
        buttons.push({
          key: 'schedule',
          label: 'Jadwalkan',
          icon: CalendarIcon,
          variant: 'default',
          action: handleScheduleSession,
        });
        
        buttons.push({
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          variant: 'outline',
          action: handleEditSession,
        });

        // Can also start directly if continuity allows
        const continuityCheck = checkSessionContinuity();
        buttons.push({
          key: 'start',
          label: 'Mulai Sesi',
          icon: PlayIcon,
          variant: 'secondary',
          action: handleStartSession,
          disabled: !continuityCheck.canStart,
          disabledReason: continuityCheck.reason,
        });
        break;

      case SessionStatusEnum.Scheduled:
        // Scheduled sessions can be started, rescheduled, or cancelled
        const scheduledContinuityCheck = checkSessionContinuity();
        buttons.push({
          key: 'start',
          label: 'Mulai Sesi',
          icon: PlayIcon,
          variant: 'default',
          action: handleStartSession,
          disabled: !scheduledContinuityCheck.canStart,
          disabledReason: scheduledContinuityCheck.reason,
        });

        buttons.push({
          key: 'reschedule',
          label: 'Jadwal Ulang',
          icon: ArrowPathIcon,
          variant: 'outline',
          action: handleRescheduleSession,
        });

        buttons.push({
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          variant: 'outline',
          action: handleEditSession,
        });

        buttons.push({
          key: 'cancel',
          label: 'Batalkan',
          icon: XMarkIcon,
          variant: 'destructive',
          action: handleCancelSession,
        });
        break;

      case SessionStatusEnum.Started:
        // Started sessions can only be completed
        buttons.push({
          key: 'complete',
          label: 'Selesaikan',
          icon: CheckIcon,
          variant: 'default',
          action: handleCompleteSession,
        });

        buttons.push({
          key: 'cancel',
          label: 'Batalkan',
          icon: XMarkIcon,
          variant: 'destructive',
          action: handleCancelSession,
        });
        break;

      case SessionStatusEnum.Completed:
        // Completed sessions can only be edited (for notes/outcomes)
        buttons.push({
          key: 'edit',
          label: 'Edit Catatan',
          icon: PencilIcon,
          variant: 'outline',
          action: handleEditSession,
        });
        break;

      case SessionStatusEnum.Cancelled:
        // Cancelled sessions can be rescheduled
        buttons.push({
          key: 'reschedule',
          label: 'Jadwal Ulang',
          icon: ArrowPathIcon,
          variant: 'default',
          action: handleRescheduleSession,
        });

        buttons.push({
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          variant: 'outline',
          action: handleEditSession,
        });
        break;

      case SessionStatusEnum.NoShow:
        // No-show sessions can be rescheduled
        buttons.push({
          key: 'reschedule',
          label: 'Jadwal Ulang',
          icon: ArrowPathIcon,
          variant: 'default',
          action: handleRescheduleSession,
        });

        buttons.push({
          key: 'edit',
          label: 'Edit',
          icon: PencilIcon,
          variant: 'outline',
          action: handleEditSession,
        });
        break;

      default:
        break;
    }

    return buttons;
  };

  const actionButtons = getActionButtons();

  if (actionButtons.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {actionButtons.map((button) => {
          const Icon = button.icon;
          const isButtonLoading = actionLoading === button.key;
          const isDisabled = isLoading || isButtonLoading || button.disabled;

          return (
            <div key={button.key} className="relative group">
              <Button
                variant={button.variant}
                size="sm"
                onClick={button.action}
                disabled={isDisabled}
                className="gap-2"
              >
                {isButtonLoading ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {button.label}
              </Button>
              
              {/* Tooltip for disabled buttons */}
              {button.disabled && button.disabledReason && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {button.disabledReason}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      <SessionScheduleModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        onSchedule={handleScheduleSubmit}
        session={session}
        allSessions={sessions}
        isLoading={isLoading}
      />

      {/* Edit Modal */}
      {(showEditModal && clientId && therapyId && therapistId) && (
        <SessionFormModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSubmit={handleEditSubmit}
          session={session}
          clientId={clientId}
          therapyId={therapyId}
          therapistId={therapistId}
          nextSessionNumber={nextSessionNumber}
          isLoading={isLoading}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
        onConfirm={handleConfirmationAction}
        session={session}
        type={confirmationType}
        isLoading={isLoading}
      />
    </>
  );
};

// Session status indicator with continuity information
export const SessionStatusIndicator: React.FC<{
  session: Session;
  sessions: Session[];
  className?: string;
}> = ({ session, sessions, className = '' }) => {
  const checkContinuity = (): { canProceed: boolean; message?: string } => {
    const therapySessions = sessions
      .filter(s => s.therapyId === session.therapyId)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);

    const currentIndex = therapySessions.findIndex(s => s.id === session.id);
    
    if (currentIndex === 0) {
      return { canProceed: true };
    }

    for (let i = 0; i < currentIndex; i++) {
      const prevSession = therapySessions[i];
      if (prevSession.status !== SessionStatusEnum.Completed) {
        return {
          canProceed: false,
          message: `Menunggu sesi ${prevSession.sessionNumber} selesai`
        };
      }
    }

    return { canProceed: true };
  };

  const continuity = checkContinuity();
  
  if (continuity.canProceed || session.status === SessionStatusEnum.Completed) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 ${className}`}>
      <ExclamationTriangleIcon className="w-4 h-4" />
      <span>{continuity.message}</span>
    </div>
  );
};

export default SessionActions;