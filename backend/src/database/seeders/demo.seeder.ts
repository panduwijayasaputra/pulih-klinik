import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcryptjs';

import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import { SubscriptionTier } from '../entities/subscription-tier.entity';
import {
  UserRole as UserRoleEnum,
  UserRoleType,
} from '../../common/enums/user-roles.enum';
import { UserStatus, ClinicStatus } from 'src/common/enums';

export class DemoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // 1. Create subscription tiers
    console.log('📊 Creating subscription tiers...');
    const subscriptionTiers = await this.createSubscriptionTiers(em);

    // 2. Create clinics
    console.log('🏥 Creating clinics...');
    const clinics = await this.createClinics(em, subscriptionTiers);

    // 3. Create users
    console.log('👥 Creating users...');
    await this.createUsers(em, clinics);

    console.log('✅ Database seeding completed successfully!');
    console.log('📝 Demo credentials:');
    console.log(
      '   - admin@pulihklinik.com (password: admin123) - System Administrator',
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
  }

  private async createSubscriptionTiers(
    em: EntityManager,
  ): Promise<SubscriptionTier[]> {
    const tiers = [
      {
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
      },
      {
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
      },
      {
        name: 'Theta',
        code: 'theta',
        description:
          'Paket untuk klinik yang ingin memiliki kapasitas maksimal',
        monthlyPrice: 150000, // 150k IDR
        yearlyPrice: 1500000, // 1.5M IDR
        therapistLimit: 5,
        newClientsPerDayLimit: 5,
        isRecommended: false,
        isActive: true,
        sortOrder: 3,
      },
    ];

    const subscriptionTiers: SubscriptionTier[] = [];
    for (const tierData of tiers) {
      const tier = em.create(SubscriptionTier, {
        ...tierData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      subscriptionTiers.push(tier);
    }

    await em.persistAndFlush(subscriptionTiers);
    return subscriptionTiers;
  }

  private async createClinics(
    em: EntityManager,
    subscriptionTiers: SubscriptionTier[],
  ): Promise<Clinic[]> {
    const alphaTier = subscriptionTiers.find((tier) => tier.code === 'alpha');
    const betaTier = subscriptionTiers.find((tier) => tier.code === 'beta');

    const clinics = [
      {
        name: 'Klinik Sehat Sejahtera',
        address: 'Jl. Kesehatan No. 123, Jakarta Pusat',
        phone: '+62-21-1234567',
        email: 'info@kliniksehat.com',
        website: 'https://kliniksehat.com',
        description: 'Klinik hipnoterapi terpercaya di Jakarta Pusat',
        workingHours: 'Senin-Jumat: 08:00-17:00',
        subscriptionTier: alphaTier,
        subscriptionExpires: new Date('2025-12-31'),
        status: ClinicStatus.ACTIVE,
        primaryColor: '#3B82F6',
        secondaryColor: '#1F2937',
        fontFamily: 'Inter',
        timezone: 'Asia/Jakarta',
        language: 'id',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: false,
        logoUrl: 'https://kliniksehat.com/logo.png',
      },
      {
        name: 'Klinik Baru',
        address: 'Jl. Baru No. 456, Bandung',
        phone: '+62-22-7654321',
        email: 'info@klinikbaru.com',
        website: 'https://klinikbaru.com',
        description: 'Klinik terapi mental modern di Bandung',
        workingHours: 'Senin-Sabtu: 09:00-18:00',
        subscriptionTier: betaTier,
        subscriptionExpires: new Date('2025-06-30'),
        status: ClinicStatus.ACTIVE,
        primaryColor: '#10B981',
        secondaryColor: '#065F46',
        fontFamily: 'Inter',
        timezone: 'Asia/Jakarta',
        language: 'id',
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        logoUrl: 'https://klinikbaru.com/logo.png',
      },
    ];

    const clinicEntities: Clinic[] = [];
    for (const clinicData of clinics) {
      const clinic = em.create(Clinic, {
        ...clinicData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      clinicEntities.push(clinic);
    }

    await em.persistAndFlush(clinicEntities);
    return clinicEntities;
  }

  private async createUsers(
    em: EntityManager,
    clinics: Clinic[],
  ): Promise<void> {
    const klinikSehat =
      clinics.find((clinic) => clinic.name === 'Klinik Sehat Sejahtera') ||
      null;
    const klinikBaru =
      clinics.find((clinic) => clinic.name === 'Klinik Baru') || null;

    // Demo users based on frontend/src/lib/mocks/auth.ts
    const users: Array<{
      email: string;
      password: string;
      name: string;
      roles: UserRoleType[];
      clinic: Clinic | null;
      profile: {
        phone: string;
        address: string;
      };
    }> = [
      {
        email: 'admin@pulihklinik.com',
        password: 'admin123',
        name: 'Administrator Sistem',
        roles: [UserRoleEnum.ADMINISTRATOR],
        clinic: null, // System admin has no specific clinic
        profile: {
          phone: '+62-812-3456789',
          address: 'Jakarta, Indonesia',
        },
      },
      {
        email: 'admin@kliniksehat.com',
        password: 'clinic123',
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
        password: 'therapist123',
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
        password: 'multi123',
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
        password: 'onboard123',
        name: 'Admin Klinik Baru',
        roles: [UserRoleEnum.CLINIC_ADMIN],
        clinic: klinikBaru,
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
        passwordHash: await bcrypt.hash(userData.password, 10),
        emailVerified: true, // Demo users are pre-verified
        status: UserStatus.ACTIVE,
        clinic: userData.clinic || undefined,
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
  }
}
