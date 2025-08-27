import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Client, ClientStatus } from './client.entity';
import { User } from './user.entity';

@Entity({ tableName: 'client_status_transitions' })
@Index({ properties: ['client'] })
@Index({ properties: ['fromStatus', 'toStatus'] })
export class ClientStatusTransition {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Client, { onDelete: 'cascade' })
  client!: Client;

  @Property({ type: 'varchar', length: 20, nullable: true })
  fromStatus?: ClientStatus;

  @Property({ type: 'varchar', length: 20 })
  toStatus!: ClientStatus;

  @Property({ type: 'text', nullable: true })
  reason?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => User)
  changedBy!: User;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  changedAt: Date = new Date();

  @Property({ type: 'varchar', length: 50, nullable: true })
  previousTherapistId?: string;

  @Property({ type: 'varchar', length: 50, nullable: true })
  newTherapistId?: string;
}
