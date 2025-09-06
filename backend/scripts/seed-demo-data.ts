import { MikroORM } from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { databaseConfig } from '../src/config/database.config';
import { User } from '../src/database/entities/user.entity';
import { UserProfile } from '../src/database/entities/user-profile.entity';
import { UserRole } from '../src/database/entities/user-role.entity';
import { Clinic } from '../src/database/entities/clinic.entity';
import { SubscriptionTier } from '../src/database/entities/subscription-tier.entity';
import { UserRole as UserRoleEnum } from '../src/common/enums/user-roles.enum';

async function seedDemoData() {
  const orm = await MikroORM.init(databaseConfig);
  const em = orm.em.fork();

  try {
    // Clear existing data
    await em.nativeDelete(UserRole, {});
    await em.nativeDelete(UserProfile, {});
    await em.nativeDelete(User, {});
    await em.nativeDelete(Clinic, {});
    await em.nativeDelete(SubscriptionTier, {});

    // Create subscription tiers
    const alphaSubscription = new SubscriptionTier();
    alphaSubscription.name = 'Alpha (Unlimited)';
    alphaSubscription.code = 'alpha';
    alphaSubscription.description = 'Unlimited access to all features for alpha users';
    alphaSubscription.monthlyPrice = 0;
    alphaSubscription.yearlyPrice = 0;
    alphaSubscription.therapistLimit = -1;
    alphaSubscription.newClientsPerDayLimit = -1;
    alphaSubscription.isRecommended = false;
    alphaSubscription.isActive = true;
    alphaSubscription.sortOrder = 1;

    const betaSubscription = new SubscriptionTier();
    betaSubscription.name = 'Beta (Pro)';
    betaSubscription.code = 'beta';
    betaSubscription.description = 'Professional features for established clinics';
    betaSubscription.monthlyPrice = 200000;
    betaSubscription.yearlyPrice = 2000000;
    betaSubscription.therapistLimit = 10;
    betaSubscription.newClientsPerDayLimit = 50;
    betaSubscription.isRecommended = true;
    betaSubscription.isActive = true;
    betaSubscription.sortOrder = 2;

    await em.persistAndFlush([alphaSubscription, betaSubscription]);

    // Create clinic
    const klinikSehat = new Clinic();
    klinikSehat.name = 'Klinik Sehat Sejahtera';
    klinikSehat.address = 'Jl. Kesehatan No. 123, Jakarta Pusat';
    klinikSehat.phone = '+62-21-1234567';
    klinikSehat.email = 'info@kliniksehat.com';
    klinikSehat.website = 'https://kliniksehat.com';
    klinikSehat.description = 'Klinik hipnoterapi terpercaya di Jakarta Pusat';
    klinikSehat.workingHours = 'Senin-Jumat: 08:00-17:00';
    klinikSehat.status = 'active';
    klinikSehat.subscriptionTier = betaSubscription;
    klinikSehat.subscriptionExpires = new Date('2025-01-01');
    klinikSehat.isActive = true;

    await em.persistAndFlush(klinikSehat);

    // Create users based on frontend demo data
    const users = [
      {
        email: 'admin@terapintar.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        name: 'Administrator Sistem',
        roles: [UserRoleEnum.ADMINISTRATOR],
        clinic: null,
        profile: {
          phone: '+62-812-3456789',
          address: 'Jakarta, Indonesia',
        },
      },
      {
        email: 'admin@kliniksehat.com',
        passwordHash: await bcrypt.hash('clinic123', 10),
        name: 'Admin Klinik Sehat',
        roles: [UserRoleEnum.CLINIC_ADMIN],
        clinic: klinikSehat,
        profile: {
          phone: '+62-812-1111111',
          address: 'Jakarta Pusat, Indonesia',
        },
      },
      {
        email: 'therapist@kliniksehat.com',
        passwordHash: await bcrypt.hash('therapist123', 10),
        name: 'Dr. Sarah Wijaya',
        roles: [UserRoleEnum.THERAPIST],
        clinic: klinikSehat,
        profile: {
          phone: '+62-812-3333333',
          address: 'Jakarta Selatan, Indonesia',
        },
      },
      {
        email: 'dr.ahmad@kliniksehat.com',
        passwordHash: await bcrypt.hash('multi123', 10),
        name: 'Dr. Ahmad Rahman',
        roles: [UserRoleEnum.CLINIC_ADMIN, UserRoleEnum.THERAPIST],
        clinic: klinikSehat,
        profile: {
          phone: '+62-812-5555555',
          address: 'Jakarta Timur, Indonesia',
        },
      },
      {
        email: 'newadmin@klinikbaru.com',
        passwordHash: await bcrypt.hash('onboard123', 10),
        name: 'Admin Klinik Baru',
        roles: [UserRoleEnum.CLINIC_ADMIN],
        clinic: null,
        profile: {
          phone: '+62-812-7777777',
          address: 'Bandung, Indonesia',
        },
      },
    ];

    for (const userData of users) {
      // Create user
      const user = new User();
      user.email = userData.email;
      user.passwordHash = userData.passwordHash;
      user.emailVerified = false;
      user.isActive = true;
      user.clinic = userData.clinic || undefined;

      await em.persistAndFlush(user);

      // Create user profile
      const profile = new UserProfile();
      profile.userId = user.id;
      profile.user = user;
      profile.name = userData.name;
      profile.phone = userData.profile.phone;
      profile.address = userData.profile.address;

      // Create user roles
      const userRoles = userData.roles.map((roleName) => {
        const userRole = new UserRole();
        userRole.userId = user.id;
        userRole.user = user;
        userRole.role = roleName;
        return userRole;
      });

      await em.persistAndFlush([profile, ...userRoles]);
    }

    console.log('✅ Demo data seeded successfully!');
    console.log('📝 Available demo users:');
    console.log(
      '   - admin@terapintar.com (password: admin123) - System Administrator',
    );
    console.log(
      '   - admin@kliniksehat.com (password: clinic123) - Clinic Admin',
    );
    console.log(
      '   - therapist@kliniksehat.com (password: therapist123) - Therapist',
    );
    console.log(
      '   - dr.ahmad@kliniksehat.com (password: multi123) - Admin + Therapist',
    );
    console.log(
      '   - newadmin@klinikbaru.com (password: onboard123) - New Admin',
    );
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  } finally {
    await orm.close();
  }
}

if (require.main === module) {
  seedDemoData().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { seedDemoData };