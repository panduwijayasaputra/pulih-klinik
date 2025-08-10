type EnumValue<T> = T[keyof T];

// Client Status Enum - updated to match consultation feature requirements
export enum ClientStatusEnum {
  New = 'new',
  Assigned = 'assigned', 
  Consultation = 'consultation',
  Therapy = 'therapy',
  Done = 'done',
}

// Status labels in Bahasa Indonesia for UI display
export const ClientStatusLabels: Record<ClientStatusEnum, string> = {
  [ClientStatusEnum.New]: 'Baru',
  [ClientStatusEnum.Assigned]: 'Telah Ditugaskan',
  [ClientStatusEnum.Consultation]: 'Konsultasi',
  [ClientStatusEnum.Therapy]: 'Terapi',
  [ClientStatusEnum.Done]: 'Selesai',
};

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
  [ClientStatusEnum.New]: [ClientStatusEnum.Assigned],
  [ClientStatusEnum.Assigned]: [ClientStatusEnum.Consultation, ClientStatusEnum.New], 
  [ClientStatusEnum.Consultation]: [ClientStatusEnum.Therapy, ClientStatusEnum.Assigned],
  [ClientStatusEnum.Therapy]: [ClientStatusEnum.Done, ClientStatusEnum.Consultation],
  [ClientStatusEnum.Done]: [], // Final state - no transitions allowed
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