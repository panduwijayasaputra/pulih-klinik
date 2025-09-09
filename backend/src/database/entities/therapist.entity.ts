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

export enum TherapistStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  PENDING_SETUP = 'pending_setup',
}

@Entity({ tableName: 'therapists' })
@Unique({ properties: ['clinic', 'licenseNumber'] })
export class Therapist {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Clinic, { onDelete: 'cascade' })
  clinic!: Clinic;

  @ManyToOne(() => User, { onDelete: 'cascade' })
  user!: User;

  // Basic info
  @Property({ type: 'varchar', length: 255 })
  fullName!: string;

  @Property({ type: 'varchar', length: 20 })
  phone!: string;

  @Property({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  // Professional info
  @Property({ type: 'varchar', length: 100 })
  licenseNumber!: string;

  @Property({ type: 'varchar', length: 50 })
  licenseType!: LicenseType;

  // Status
  @Property({
    type: 'varchar',
    length: 20,
    default: TherapistStatus.PENDING_SETUP,
  })
  status: TherapistStatus = TherapistStatus.PENDING_SETUP;

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
