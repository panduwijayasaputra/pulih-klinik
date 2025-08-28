import { EntityManager } from '@mikro-orm/core';
import { SubscriptionTier } from '../entities/subscription-tier.entity';

export class SubscriptionTierSeeder {
  static async run(em: EntityManager): Promise<void> {
    console.log('Seeding subscription tiers...');

    // Check if subscription tiers already exist
    const existingCount = await em.count(SubscriptionTier);
    if (existingCount > 0) {
      console.log('Subscription tiers already exist, skipping seeding...');
      return;
    }

    const subscriptionTiers = [
      // Beta Tier
      em.create(SubscriptionTier, {
        name: 'Beta',
        code: 'beta',
        description: 'Paket dasar untuk klinik yang baru memulai dengan fitur terbaik',
        monthlyPrice: 50000, // 50k / month
        yearlyPrice: 550000, // 550k / year
        therapistLimit: 1,
        newClientsPerDayLimit: 1,
        isRecommended: false,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Alpha Tier (Recommended)
      em.create(SubscriptionTier, {
        name: 'Alpha',
        code: 'alpha',
        description: 'Paket terbaik untuk klinik yang ingin memiliki fitur lengkap',
        monthlyPrice: 100000, // 100k / month
        yearlyPrice: 1000000, // 1m / year
        therapistLimit: 3,
        newClientsPerDayLimit: 3,
        isRecommended: true,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Theta Tier
      em.create(SubscriptionTier, {
        name: 'Theta',
        code: 'theta',
        description: 'Paket untuk klinik yang ingin memiliki kapasitas maksimal',
        monthlyPrice: 150000, // 150k / month
        yearlyPrice: 1500000, // 1.5m / year
        therapistLimit: 5,
        newClientsPerDayLimit: 5,
        isRecommended: false,
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    // Persist all subscription tiers
    await em.persistAndFlush(subscriptionTiers);

    console.log(`✅ Successfully seeded ${subscriptionTiers.length} subscription tiers:
    - Beta: ${subscriptionTiers[0].therapistLimit} therapists, ${subscriptionTiers[0].newClientsPerDayLimit} clients/day, Rp ${subscriptionTiers[0].monthlyPrice.toLocaleString('id-ID')}/month
    - Alpha: ${subscriptionTiers[1].therapistLimit} therapists, ${subscriptionTiers[1].newClientsPerDayLimit} clients/day, Rp ${subscriptionTiers[1].monthlyPrice.toLocaleString('id-ID')}/month (recommended)
    - Theta: ${subscriptionTiers[2].therapistLimit} therapists, ${subscriptionTiers[2].newClientsPerDayLimit} clients/day, Rp ${subscriptionTiers[2].monthlyPrice.toLocaleString('id-ID')}/month`);
  }
}