import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity({ tableName: 'user_profiles' })
export class UserProfile {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'varchar', length: 255 })
  name!: string;

  @Property({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Property({ type: 'text', nullable: true })
  address?: string;

  @Property({ type: 'text', nullable: true })
  bio?: string;

  @Property({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @OneToOne(() => User, { joinColumn: 'user_id' })
  user!: User;
}
