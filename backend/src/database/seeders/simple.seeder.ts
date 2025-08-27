import { EntityManager } from '@mikro-orm/core';

export class SimpleSeeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Simple seeder running...');
    console.log('✅ Simple seeder completed!');
  }
}
