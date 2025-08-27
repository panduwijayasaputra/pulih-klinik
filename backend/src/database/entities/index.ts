import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UserRole } from './user-role.entity';
import { Clinic } from './clinic.entity';
import { Therapist } from './therapist.entity';
import { TherapistSpecialization } from './therapist-specialization.entity';
import { Client } from './client.entity';
import { Consultation } from './consultation.entity';
import { TherapySession } from './therapy-session.entity';
import { ClientTherapistAssignment } from './client-therapist-assignment.entity';
import { ClientStatusTransition } from './client-status-transition.entity';
import { AuditLog } from './audit-log.entity';

// Re-export entities
export { User } from './user.entity';
export { UserProfile } from './user-profile.entity';
export { UserRole } from './user-role.entity';
export { Clinic } from './clinic.entity';
export { Therapist } from './therapist.entity';
export { TherapistSpecialization } from './therapist-specialization.entity';
export { Client } from './client.entity';
export { Consultation } from './consultation.entity';
export { TherapySession } from './therapy-session.entity';
export { ClientTherapistAssignment } from './client-therapist-assignment.entity';
export { ClientStatusTransition } from './client-status-transition.entity';
export { AuditLog } from './audit-log.entity';

// Export all entities as an array for easy registration
export const entities = [
  User,
  UserProfile,
  UserRole,
  Clinic,
  Therapist,
  TherapistSpecialization,
  Client,
  Consultation,
  TherapySession,
  ClientTherapistAssignment,
  ClientStatusTransition,
  AuditLog,
];
