import { EntityManager } from '@mikro-orm/core';
import { UserSeeder } from './user.seeder';
import { TherapistSeeder } from './therapist.seeder';
import { ClientSeeder } from './client.seeder';
import { ConsultationSeeder } from './consultation.seeder';
import { TherapySessionSeeder } from './therapy-session.seeder';
import { SubscriptionTierSeeder } from './subscription-tier.seeder';

export class DatabaseSeeder {
  constructor(private em: EntityManager) {}

  async run(): Promise<void> {
    console.log('🚀 Starting database seeding...\n');

    try {
      // Run seeders in dependency order
      await this.runSeeder('Subscription Tiers', () =>
        SubscriptionTierSeeder.run(this.em)
      );
      await this.runSeeder('Users', () =>
        new UserSeeder().run(this.em)
      );
      await this.runSeeder('Therapists', () =>
        new TherapistSeeder().run(this.em)
      );
      await this.runSeeder('Clients', () =>
        new ClientSeeder().run(this.em)
      );
      await this.runSeeder('Consultations', () =>
        new ConsultationSeeder().run(this.em)
      );
      await this.runSeeder('Therapy Sessions', () =>
        new TherapySessionSeeder().run(this.em)
      );

      console.log('\n✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('\n❌ Database seeding failed:', error);
      throw error;
    }
  }

  private async runSeeder(
    name: string,
    seederFn: () => Promise<void>,
  ): Promise<void> {
    console.log(`📦 Running ${name} seeder...`);
    const startTime = Date.now();

    try {
      await seederFn();
      const duration = Date.now() - startTime;
      console.log(`✅ ${name} seeder completed in ${duration}ms\n`);
    } catch (error) {
      console.error(`❌ ${name} seeder failed:`, error);
      throw error;
    }
  }
}

// Export individual seeders for selective seeding
export { UserSeeder } from './user.seeder';
export { TherapistSeeder } from './therapist.seeder';
export { ClientSeeder } from './client.seeder';
export { ConsultationSeeder } from './consultation.seeder';
export { TherapySessionSeeder } from './therapy-session.seeder';
export { SubscriptionTierSeeder } from './subscription-tier.seeder';
