import { z } from 'zod';
import { ClientStatusEnum } from '../types/enums';
import { ValidStatusTransitions } from '../types/clientStatus';

// Zod enum for client status validation
export const clientStatusSchema = z.nativeEnum(ClientStatusEnum);

// Schema for status transition validation
export const statusTransitionSchema = z.object({
  id: z.string().min(1, 'ID diperlukan'),
  clientId: z.string().min(1, 'ID klien diperlukan'),
  fromStatus: z.nativeEnum(ClientStatusEnum).nullable(),
  toStatus: z.nativeEnum(ClientStatusEnum),
  timestamp: z.string().datetime('Timestamp harus dalam format ISO datetime'),
  userId: z.string().min(1, 'ID pengguna diperlukan'),
  reason: z.string().optional(),
});

// Schema for status transition request (without id and timestamp)
export const statusTransitionRequestSchema = z.object({
  clientId: z.string().min(1, 'ID klien diperlukan'),
  fromStatus: z.nativeEnum(ClientStatusEnum).nullable(),
  toStatus: z.nativeEnum(ClientStatusEnum),
  userId: z.string().min(1, 'ID pengguna diperlukan'),
  reason: z.string().optional(),
});

// Validation function for allowed status transitions
export const validateStatusTransition = (
  fromStatus: ClientStatusEnum | null,
  toStatus: ClientStatusEnum
): boolean => {
  // If no previous status (new client), only allow 'new' status
  if (fromStatus === null) {
    return toStatus === ClientStatusEnum.New;
  }

  // Check if the transition is allowed
  const allowedTransitions = ValidStatusTransitions[fromStatus];
  return allowedTransitions.includes(toStatus);
};

// Custom Zod validator for status transitions
export const validateStatusTransitionSchema = statusTransitionRequestSchema.refine(
  (data) => validateStatusTransition(data.fromStatus, data.toStatus),
  {
    message: 'Transisi status tidak valid',
    path: ['toStatus'],
  }
);

// Type exports for TypeScript inference
export type ClientStatusType = z.infer<typeof clientStatusSchema>;
export type StatusTransitionType = z.infer<typeof statusTransitionSchema>;
export type StatusTransitionRequestType = z.infer<typeof statusTransitionRequestSchema>;