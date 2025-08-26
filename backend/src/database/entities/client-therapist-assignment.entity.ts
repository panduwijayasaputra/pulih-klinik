import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Client } from './client.entity';
import { Therapist } from './therapist.entity';
import { User } from './user.entity';

export enum AssignmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  TRANSFERRED = 'transferred',
  CANCELLED = 'cancelled',
}

@Entity({ tableName: 'client_therapist_assignments' })
@Index({
  properties: ['client', 'therapist', 'status'],
  options: { where: "status = 'active'", unique: true },
})
export class ClientTherapistAssignment {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Client, { onDelete: 'cascade' })
  client!: Client;

  @ManyToOne(() => Therapist, { onDelete: 'cascade' })
  therapist!: Therapist;

  @Property({ type: 'date', defaultRaw: 'CURRENT_DATE' })
  assignedDate: Date = new Date();

  @ManyToOne(() => User)
  assignedBy!: User;

  @Property({ type: 'varchar', length: 20, default: AssignmentStatus.ACTIVE })
  status: AssignmentStatus = AssignmentStatus.ACTIVE;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'date', nullable: true })
  endDate?: Date;

  @Property({ type: 'text', nullable: true })
  transferReason?: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
