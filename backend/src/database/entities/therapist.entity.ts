import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';

export enum LicenseType {
  PSYCHOLOGIST = 'psychologist',
  PSYCHIATRIST = 'psychiatrist',
  COUNSELOR = 'counselor',
  HYPNOTHERAPIST = 'hypnotherapist',
}

// TherapistStatus enum moved to UserStatus in common/enums/user-status.enum.ts

@Entity({ tableName: 'therapists' })
@Unique({ properties: ['clinic', 'licenseNumber'] })
export class Therapist {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Clinic, { onDelete: 'cascade' })
  clinic!: Clinic;

  @ManyToOne(() => User, { onDelete: 'cascade' })
  user!: User;

  // Basic info is now stored in UserProfile

  // Professional info
  @Property({ type: 'varchar', length: 100 })
  licenseNumber!: string;

  @Property({ type: 'varchar', length: 50 })
  licenseType!: LicenseType;

  // Status is now managed by User.status field

  @Property({ type: 'date' })
  joinDate!: Date;

  @Property({ type: 'integer', default: 0 })
  currentLoad: number = 0;

  // Schedule preferences
  @Property({ type: 'varchar', length: 50, default: 'Asia/Jakarta' })
  timezone: string = 'Asia/Jakarta';

  // Education and certifications (stored as text)
  @Property({ type: 'text', nullable: true })
  education?: string;

  @Property({ type: 'text', nullable: true })
  certifications?: string;

  // Session scheduling preferences
  @Property({
    type: 'integer',
    default: 15,
    comment: 'Break between sessions in minutes',
  })
  breakBetweenSessions: number = 15;

  @Property({ type: 'integer', default: 8 })
  maxSessionsPerDay: number = 8;

  @Property({
    type: 'json',
    defaultRaw: "'[1,2,3,4,5]'",
    comment: 'Working days (1=Monday to 7=Sunday)',
  })
  workingDays: number[] = [1, 2, 3, 4, 5];

  // Admin notes
  @Property({ type: 'text', nullable: true })
  adminNotes?: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
