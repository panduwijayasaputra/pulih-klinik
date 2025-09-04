import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcryptjs';

import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import { SubscriptionTier } from '../entities/subscription-tier.entity';
import { UserRole as UserRoleEnum } from '../../common/enums/user-roles.enum';

export class DemoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create subscription tiers to match frontend pricing
    const betaSubscription = em.create(SubscriptionTier, {
      name: 'Beta',
      code: 'beta',
      description:
        'Paket dasar untuk klinik yang baru memulai dengan fitur terbaik',
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
      description:
        'Paket terbaik untuk klinik yang ingin memiliki fitur lengkap',
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

    await em.persistAndFlush([
      betaSubscription,
      alphaSubscription,
      thetaSubscription,
    ]);

    // Create clinic for kliniksehat users
    const klinikSehat = em.create(Clinic, {
      name: 'Klinik Sehat Sejahtera',
      address: 'Jl. Kesehatan No. 123, Jakarta Pusat',
      phone: '+62-21-1234567',
      email: 'info@kliniksehat.com',
      website: 'https://kliniksehat.com',
      description: 'Klinik hipnoterapi terpercaya di Jakarta Pusat',
      workingHours: 'Senin-Jumat: 08:00-17:00',
      status: 'active' as const,
      subscriptionTier: alphaSubscription,
      subscriptionExpires: new Date('2025-01-01'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      primaryColor: '#000000',
      secondaryColor: '#000000',
      fontFamily: 'Arial',
      timezone: 'Asia/Jakarta',
      language: 'id',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      logoUrl: 'https://kliniksehat.com/logo.png',
    });

    await em.persistAndFlush(klinikSehat);

    // Create users based on frontend demo data
    const users = [
      // 1. System Administrator
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
      // 2. Clinic Admin for Klinik Sehat
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
      // 3. Therapist at Klinik Sehat
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
      // 4. Multi-role user (Admin + Therapist) at Klinik Sehat
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
      // 5. New admin for onboarding (no clinic yet)
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
      const user = em.create(User, {
        email: userData.email,
        passwordHash: userData.passwordHash,
        isActive: true,
        clinic: userData.clinic || undefined,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(user);

      // Create user profile
      const profile = em.create(UserProfile, {
        userId: user.id,
        user,
        name: userData.name,
        phone: userData.profile.phone,
        address: userData.profile.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create user roles
      const userRoles = userData.roles.map((roleName) =>
        em.create(UserRole, {
          userId: user.id,
          user,
          role: roleName,
          createdAt: new Date(),
        }),
      );

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
      '   - newadmin@klinikbaru.com (password: onboard123) - Needs Onboarding',
    );
  }
}
