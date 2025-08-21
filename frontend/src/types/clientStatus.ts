import { ClientStatusEnum, ClientStatusLabels } from './enums';

type EnumValue<T> = T[keyof T];

// Re-export for convenience
export { ClientStatusEnum, ClientStatusLabels };

// Status color mapping for UI components
export const ClientStatusColors: Record<ClientStatusEnum, string> = {
  [ClientStatusEnum.New]: 'gray',
  [ClientStatusEnum.Assigned]: 'blue', 
  [ClientStatusEnum.Consultation]: 'orange',
  [ClientStatusEnum.Therapy]: 'green',
  [ClientStatusEnum.Done]: 'purple',
};

// Define valid status transitions
export const ValidStatusTransitions: Record<ClientStatusEnum, ClientStatusEnum[]> = {
  [ClientStatusEnum.New]: [ClientStatusEnum.Consultation], // New client -> Assign therapist (goes to consultation)
  [ClientStatusEnum.Assigned]: [ClientStatusEnum.Consultation, ClientStatusEnum.New], // Legacy support
  [ClientStatusEnum.Consultation]: [ClientStatusEnum.Therapy, ClientStatusEnum.New], // Consultation -> Therapy or back to new
  [ClientStatusEnum.Therapy]: [ClientStatusEnum.Done, ClientStatusEnum.Consultation], // Therapy -> Finish or back to consultation
  [ClientStatusEnum.Done]: [ClientStatusEnum.Consultation], // Start over -> Assign new therapist (goes to consultation)
};

// Status Transition interface for audit trail
export interface StatusTransition {
  id: string;
  clientId: string;
  fromStatus: EnumValue<typeof ClientStatusEnum> | null;
  toStatus: EnumValue<typeof ClientStatusEnum>;
  timestamp: string; // ISO date string
  userId: string; // ID of the user who made the transition
  reason?: string; // Optional reason for the status change
}