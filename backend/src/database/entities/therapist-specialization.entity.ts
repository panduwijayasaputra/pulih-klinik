import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { Therapist } from './therapist.entity';

@Entity({ tableName: 'therapist_specializations' })
@Unique({ properties: ['therapist', 'specialization'] })
export class TherapistSpecialization {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Therapist, { onDelete: 'cascade' })
  therapist!: Therapist;

  @Property({ type: 'varchar', length: 100 })
  specialization!: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();
}
