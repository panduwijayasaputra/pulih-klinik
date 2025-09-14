import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { SubscriptionTier } from './subscription-tier.entity';
import { ClinicStatus } from '../../common/enums/clinic-status.enum';

@Entity({ tableName: 'clinics' })
export class Clinic {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'varchar', length: 255 })
  name!: string;

  @Property({ type: 'text' })
  address!: string;

  @Property({ type: 'varchar', length: 20 })
  phone!: string;

  @Property({ type: 'varchar', length: 255 })
  email!: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Property({ type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'text', nullable: true })
  workingHours?: string;

  // Branding
  @Property({ type: 'varchar', length: 7, default: '#3B82F6' })
  primaryColor: string = '#3B82F6';

  @Property({ type: 'varchar', length: 7, default: '#1F2937' })
  secondaryColor: string = '#1F2937';

  @Property({ type: 'varchar', length: 100, default: 'Inter' })
  fontFamily: string = 'Inter';

  // Settings
  @Property({ type: 'varchar', length: 50, default: 'Asia/Jakarta' })
  timezone: string = 'Asia/Jakarta';

  @Property({ type: 'varchar', length: 10, default: 'id' })
  language: string = 'id';

  @Property({ type: 'boolean', default: true })
  emailNotifications: boolean = true;

  @Property({ type: 'boolean', default: false })
  smsNotifications: boolean = false;

  @Property({ type: 'boolean', default: false })
  pushNotifications: boolean = false;

  // Status & Subscription
  @Property({
    type: 'varchar',
    length: 20,
    default: ClinicStatus.PENDING,
  })
  status: ClinicStatus = ClinicStatus.PENDING;

  @ManyToOne(() => SubscriptionTier, { nullable: true })
  subscriptionTier?: SubscriptionTier;

  @Property({ type: 'timestamp', nullable: true })
  subscriptionExpires?: Date;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
