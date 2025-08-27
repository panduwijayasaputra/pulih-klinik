import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  OneToMany,
  ManyToOne,
  Collection,
} from '@mikro-orm/core';
import { UserProfile } from './user-profile.entity';
import { UserRole } from './user-role.entity';
import { Clinic } from './clinic.entity';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Property({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Property({ type: 'boolean', default: false })
  emailVerified: boolean = false;

  @Property({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken?: string;

  @Property({ type: 'timestamp', nullable: true })
  emailVerificationExpires?: Date;

  @Property({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Property({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken?: string;

  @Property({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  @Property({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Property({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Property({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile?: UserProfile;

  @ManyToOne(() => Clinic, { nullable: true })
  clinic?: Clinic;

  @OneToMany(() => UserRole, (role) => role.user)
  roles = new Collection<UserRole>(this);
}
