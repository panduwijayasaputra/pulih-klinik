import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity({ tableName: 'audit_logs' })
export class AuditLog {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @Property({ type: 'varchar', length: 100 })
  action!: string;

  @Property({ type: 'varchar', length: 50 })
  entityType!: string;

  @Property({ type: 'uuid', nullable: true })
  entityId?: string;

  @Property({ type: 'json', nullable: true })
  oldValues?: Record<string, any>;

  @Property({ type: 'json', nullable: true })
  newValues?: Record<string, any>;

  @Property({ type: 'string', nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  timestamp: Date = new Date();
}
