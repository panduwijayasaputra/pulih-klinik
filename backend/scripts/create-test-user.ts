import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../src/config/mikro-orm.config';
import { User, UserProfile, UserRole } from '../src/database/entities';
import { UserRole as UserRoleEnum } from '../src/common/enums/user-roles.enum';
import * as bcrypt from 'bcryptjs';

async function createTestUser() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);
  const em = orm.em.fork();

  try {
    console.log('🔧 Creating fresh test user for onboarding...');

    const email = 'testuser@needsonboarding.com';
    const password = 'test123';

    // Check if user already exists
    const existingUser = await em.findOne(User, { email });
    if (existingUser) {
      console.log('🗑️ Removing existing test user...');
      await em.removeAndFlush(existingUser);
    }

    // Create new user
    const user = em.create(User, {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      emailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create user role
    const userRole = em.create(UserRole, {
      userId: user.id,
      user: user,
      role: UserRoleEnum.CLINIC_ADMIN,
      createdAt: new Date(),
    });

    // Create user profile
    const userProfile = em.create(UserProfile, {
      userId: user.id,
      user: user,
      name: 'Test User Needs Onboarding',
      phone: '+62-812-9999999',
      address: 'Test Address, Indonesia',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush([user, userRole, userProfile]);

    console.log('✅ Test user created successfully!');
    console.log(`📝 Credentials: ${email} / ${password}`);
    console.log('🎯 This user needs onboarding (no clinic assigned)');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await orm.close();
  }
}

createTestUser();