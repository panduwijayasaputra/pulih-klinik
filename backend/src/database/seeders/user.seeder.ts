import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import { UserRole as UserRoleEnum } from '../../common/enums/user-roles.enum';
import { SecurityUtils } from '../../lib/security/security-utils';

interface UserDataItem {
  email: string;
  password: string;
  name: string;
  roles: UserRoleEnum[];
  clinic: Clinic;
  profile: {
    phone: string;
    address: string;
    bio: string;
  };
}

export class UserSeeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Seeding users...');

    // Create or find clinics first
    const terapintarClinic = await this.createOrFindClinic(em, {
      name: 'Terapintar Clinic',
      address: 'Jl. Sudirman No. 123, Jakarta, DKI Jakarta, 12190, Indonesia',
      phone: '+62-21-1234-5678',
      email: 'info@terapintar.com',
      website: 'https://terapintar.com',
      description:
        'Leading mental health clinic specializing in cognitive behavioral therapy and trauma treatment.',
      capacity: 50,
      isActive: true,
    });

    const klinikSehatClinic = await this.createOrFindClinic(em, {
      name: 'Klinik Sehat',
      address: 'Jl. Thamrin No. 456, Jakarta, DKI Jakarta, 10350, Indonesia',
      phone: '+62-21-2345-6789',
      email: 'info@kliniksehat.com',
      website: 'https://kliniksehat.com',
      description:
        'Comprehensive mental health clinic offering individual, group, and family therapy services.',
      capacity: 75,
      isActive: true,
    });

    const userData: UserDataItem[] = [
      // Administrator
      {
        email: 'admin@terapintar.com',
        password: 'admin123',
        name: 'System Administrator',
        roles: [UserRoleEnum.ADMINISTRATOR],
        clinic: terapintarClinic,
        profile: {
          phone: '+62-812-3456-7890',
          address:
            'Jl. Sudirman No. 123, Jakarta, DKI Jakarta, 12190, Indonesia',
          bio: 'System administrator with full access to all features and data.',
        },
      },
      // Clinic Admin
      {
        email: 'admin@kliniksehat.com',
        password: 'clinic123',
        name: 'Clinic Administrator',
        roles: [UserRoleEnum.CLINIC_ADMIN],
        clinic: klinikSehatClinic,
        profile: {
          phone: '+62-812-3456-7891',
          address:
            'Jl. Thamrin No. 456, Jakarta, DKI Jakarta, 10350, Indonesia',
          bio: 'Clinic administrator managing daily operations and staff coordination.',
        },
      },
      // Therapist
      {
        email: 'therapist@kliniksehat.com',
        password: 'therapist123',
        name: 'Sarah Johnson',
        roles: [UserRoleEnum.THERAPIST],
        clinic: klinikSehatClinic,
        profile: {
          phone: '+62-812-3456-7892',
          address:
            'Jl. Kebayoran No. 789, Jakarta, DKI Jakarta, 12120, Indonesia',
          bio: 'Licensed clinical psychologist specializing in anxiety disorders and depression.',
        },
      },
      // Multi Role (Admin + Therapist)
      {
        email: 'dr.ahmad@kliniksehat.com',
        password: 'multi123',
        name: 'Ahmad Rizki',
        roles: [UserRoleEnum.THERAPIST, UserRoleEnum.CLINIC_ADMIN],
        clinic: klinikSehatClinic,
        profile: {
          phone: '+62-812-3456-7893',
          address:
            'Jl. Senayan No. 321, Jakarta, DKI Jakarta, 12190, Indonesia',
          bio: 'Senior psychiatrist and clinic director with dual expertise in clinical practice and healthcare administration.',
        },
      },
    ];

    for (const userDataItem of userData) {
      // Check if user already exists
      const existingUser = await em.findOne(User, {
        email: userDataItem.email,
      });
      if (existingUser) {
        console.log(`User ${userDataItem.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await SecurityUtils.hashPassword(
        userDataItem.password,
      );

      // Create user
      const user = em.create(User, {
        email: userDataItem.email,
        passwordHash: hashedPassword,
        isActive: true,
        emailVerified: true,
        lastLogin: new Date(),
        clinic: userDataItem.clinic,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(user);

      // Create user profile
      const userProfile = em.create(UserProfile, {
        userId: user.id,
        user: user,
        name: userDataItem.name,
        phone: userDataItem.profile.phone,
        address: userDataItem.profile.address,
        bio: userDataItem.profile.bio,
        avatarUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(userProfile);

      // Create user roles
      for (const role of userDataItem.roles) {
        const userRole = em.create(UserRole, {
          userId: user.id,
          user: user,
          role: role,
          createdAt: new Date(),
        });

        await em.persistAndFlush(userRole);
      }

      const rolesText = userDataItem.roles.join(', ');

      console.log(`✅ Created user: ${userDataItem.email} (${rolesText})`);
    }

    // Create additional demo users for testing
    await this.createAdditionalDemoUsers(
      em,
      terapintarClinic,
      klinikSehatClinic,
    );

    console.log('✅ User seeding completed!');
  }

  private async createOrFindClinic(
    em: EntityManager,
    clinicData: any,
  ): Promise<Clinic> {
    let clinic = await em.findOne(Clinic, { name: clinicData.name });

    if (!clinic) {
      clinic = em.create(Clinic, {
        ...clinicData,
        operatingHours: {
          monday: { open: '08:00', close: '17:00', closed: false },
          tuesday: { open: '08:00', close: '17:00', closed: false },
          wednesday: { open: '08:00', close: '17:00', closed: false },
          thursday: { open: '08:00', close: '17:00', closed: false },
          friday: { open: '08:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '15:00', closed: false },
          sunday: { open: null, close: null, closed: true },
        },
        services: [
          'Individual Therapy',
          'Group Therapy',
          'Family Therapy',
          'Assessment',
        ],
        specialties: ['Anxiety Disorders', 'Depression', 'Trauma', 'Addiction'],
        insuranceAccepted: ['BPJS', 'Allianz', 'Axa'],
        languages: ['Indonesian', 'English'],
        amenities: ['Parking', 'Wheelchair Access', 'Private Rooms'],
        logo: null,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(clinic);
      console.log(`✅ Created clinic: ${clinicData.name}`);
    }

    return clinic;
  }

  private async createAdditionalDemoUsers(
    em: EntityManager,
    terapintarClinic: Clinic,
    klinikSehatClinic: Clinic,
  ): Promise<void> {
    const additionalUsers: UserDataItem[] = [
      // Additional therapists for Klinik Sehat
      {
        email: 'dr.maya@kliniksehat.com',
        password: 'therapist123',
        name: 'Maya Sari',
        roles: [UserRoleEnum.THERAPIST],
        clinic: klinikSehatClinic,
        profile: {
          phone: '+62-812-3456-7894',
          address:
            'Jl. Senayan No. 654, Jakarta, DKI Jakarta, 12190, Indonesia',
          bio: 'Child and adolescent psychologist with 8 years of experience in developmental disorders',
        },
      },
      {
        email: 'dr.budi@kliniksehat.com',
        password: 'therapist123',
        name: 'Budi Santoso',
        roles: [UserRoleEnum.THERAPIST],
        clinic: klinikSehatClinic,
        profile: {
          phone: '+62-812-3456-7895',
          address:
            'Jl. Kebayoran No. 987, Jakarta, DKI Jakarta, 12120, Indonesia',
          bio: 'Marriage and family therapist specializing in relationship counseling and conflict resolution',
        },
      },
      // Additional therapists for Terapintar
      {
        email: 'dr.lisa@terapintar.com',
        password: 'therapist123',
        name: 'Lisa Wijaya',
        roles: [UserRoleEnum.THERAPIST],
        clinic: terapintarClinic,
        profile: {
          phone: '+62-812-3456-7896',
          address:
            'Jl. Sudirman No. 456, Jakarta, DKI Jakarta, 12190, Indonesia',
          bio: 'Cognitive behavioral therapist with expertise in anxiety and stress management',
        },
      },
      {
        email: 'dr.hendra@terapintar.com',
        password: 'therapist123',
        name: 'Hendra Prasetyo',
        roles: [UserRoleEnum.THERAPIST],
        clinic: terapintarClinic,
        profile: {
          phone: '+62-812-3456-7897',
          address:
            'Jl. Gatot Subroto No. 789, Jakarta, DKI Jakarta, 12930, Indonesia',
          bio: 'Addiction specialist with 7 years of experience in substance abuse treatment and recovery programs',
        },
      },
    ];

    for (const userData of additionalUsers) {
      // Check if user already exists
      const existingUser = await em.findOne(User, { email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await SecurityUtils.hashPassword(
        userData.password,
      );

      // Create user
      const user = em.create(User, {
        email: userData.email,
        passwordHash: hashedPassword,
        isActive: true,
        emailVerified: true,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(user);

      // Create user profile
      const userProfile = em.create(UserProfile, {
        userId: user.id,
        user: user,
        name: userData.name,
        phone: userData.profile.phone,
        address: userData.profile.address,
        bio: userData.profile.bio,
        avatarUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(userProfile);

      // Create user roles
      for (const role of userData.roles) {
        const userRole = em.create(UserRole, {
          userId: user.id,
          user: user,
          role: role,
          createdAt: new Date(),
        });

        await em.persistAndFlush(userRole);
      }

      const rolesText = userData.roles.join(', ');

      console.log(`✅ Created user: ${userData.email} (${rolesText})`);
    }
  }
}
