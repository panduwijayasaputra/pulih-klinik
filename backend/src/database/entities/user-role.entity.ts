import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  Unique,
} from '@mikro-orm/core';
import { User } from './user.entity';
import type { UserRoleType } from '../../common/enums';

@Entity({ tableName: 'user_roles' })
@Index({ properties: ['userId'] })
@Unique({ properties: ['userId', 'role'] })
export class UserRole {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'uuid' })
  userId!: string;

  @Property({ type: 'varchar', length: 50 })
  role!: UserRoleType;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @ManyToOne(() => User, { joinColumn: 'userId' })
  user!: User;
}
