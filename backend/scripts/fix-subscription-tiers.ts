import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../src/config/mikro-orm.config';
import { SubscriptionTier } from '../src/database/entities/subscription-tier.entity';

async function fixSubscriptionTiers() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  const em = orm.em.fork();

  try {
    console.log('🔧 Fixing subscription tier pricing...');

    // Delete existing subscription tiers
    await em.nativeDelete(SubscriptionTier, {});

    // Create correct subscription tiers to match frontend
    const betaSubscription = em.create(SubscriptionTier, {
      name: 'Beta',
      code: 'beta',
      description: 'Paket dasar untuk klinik yang baru memulai dengan fitur terbaik',
      monthlyPrice: 50000, // 50k IDR
      yearlyPrice: 550000, // 550k IDR  
      therapistLimit: 1,
      newClientsPerDayLimit: 1,
      isRecommended: false,
      isActive: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const alphaSubscription = em.create(SubscriptionTier, {
      name: 'Alpha',
      code: 'alpha',
      description: 'Paket terbaik untuk klinik yang ingin memiliki fitur lengkap',
      monthlyPrice: 100000, // 100k IDR
      yearlyPrice: 1000000, // 1M IDR
      therapistLimit: 3,
      newClientsPerDayLimit: 3,
      isRecommended: true,
      isActive: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const thetaSubscription = em.create(SubscriptionTier, {
      name: 'Theta',
      code: 'theta',
      description: 'Paket untuk klinik yang ingin memiliki kapasitas maksimal',
      monthlyPrice: 150000, // 150k IDR
      yearlyPrice: 1500000, // 1.5M IDR
      therapistLimit: 5,
      newClientsPerDayLimit: 5,
      isRecommended: false,
      isActive: true,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush([betaSubscription, alphaSubscription, thetaSubscription]);

    console.log('✅ Subscription tiers fixed successfully!');
    console.log('📊 Updated subscription tiers:');
    console.log('   - Beta: 50,000 IDR monthly / 550,000 IDR yearly');
    console.log('   - Alpha: 100,000 IDR monthly / 1,000,000 IDR yearly');
    console.log('   - Theta: 150,000 IDR monthly / 1,500,000 IDR yearly');

  } catch (error) {
    console.error('❌ Error fixing subscription tiers:', error);
  } finally {
    await orm.close();
  }
}

fixSubscriptionTiers();