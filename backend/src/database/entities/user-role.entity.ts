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
@Index({ properties: ['user'] })
@Unique({ properties: ['user', 'role'] })
export class UserRole {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'varchar', length: 50 })
  role!: UserRoleType;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @ManyToOne(() => User, { joinColumn: 'user_id' })
  user!: User;
}
