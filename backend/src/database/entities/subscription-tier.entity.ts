import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'subscription_tiers' })
export class SubscriptionTier {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'varchar', length: 50, unique: true })
  name!: string;

  @Property({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  // Pricing
  @Property({ type: 'integer' })
  monthlyPrice!: number; // Price in Indonesian Rupiah

  @Property({ type: 'integer' })
  yearlyPrice!: number; // Price in Indonesian Rupiah

  // Limits
  @Property({ type: 'integer' })
  therapistLimit!: number;

  @Property({ type: 'integer' })
  newClientsPerDayLimit!: number;

  @Property({ type: 'boolean', default: false })
  isRecommended: boolean = false;

  @Property({ type: 'boolean', default: true })
  isActive: boolean = true;

  @Property({ type: 'integer', default: 0 })
  sortOrder: number = 0;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
