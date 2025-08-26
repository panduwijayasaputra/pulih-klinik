import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Client } from './client.entity';
import { Therapist } from './therapist.entity';

export enum SessionStatus {
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity({ tableName: 'therapy_sessions' })
export class TherapySession {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Client, { onDelete: 'cascade' })
  client!: Client;

  @ManyToOne(() => Therapist, { onDelete: 'cascade' })
  therapist!: Therapist;

  // Session info
  @Property({ type: 'integer' })
  sessionNumber!: number;

  @Property({ type: 'varchar', length: 255 })
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'date' })
  sessionDate!: Date;

  @Property({ type: 'time' })
  sessionTime!: string;

  @Property({ type: 'integer', default: 60, comment: 'Duration in minutes' })
  duration: number = 60;

  @Property({ type: 'varchar', length: 20, default: SessionStatus.PLANNED })
  status: SessionStatus = SessionStatus.PLANNED;

  // Session content
  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'json', nullable: true })
  techniques?: string[];

  @Property({ type: 'json', nullable: true })
  issues?: string[];

  @Property({ type: 'text', nullable: true })
  progress?: string;

  // AI predictions
  @Property({ type: 'json', nullable: true })
  aiPredictions?: Record<string, any>;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
