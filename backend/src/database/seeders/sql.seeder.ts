import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

/**
 * SQL Seeder - Creates demo users using raw SQL to avoid entity discovery issues
 */
export class SqlSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting SQL seeder...');

    // Step 1: Create subscription tiers
    const subscriptionTiers = await this.createSubscriptionTiers(em);

    // Step 2: Create clinics with subscription tiers
    const pulihKlinikId = await this.createClinic(em, {
      name: 'Pulih Klinik',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta',
      phone: '+62-21-1234-5678',
      email: 'info@pulihklinik.com',
      website: 'https://pulihklinik.com',
      description:
        'Klinik kesehatan mental yang menyediakan layanan psikologi dan psikiatri berkualitas tinggi.',
      workingHours: 'Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 12:00',
      subscriptionTierId: subscriptionTiers.enterprise.id,
    });

    const klinikSehatId = await this.createClinic(em, {
      name: 'Klinik Sehat',
      address: 'Jl. Thamrin No. 456, Jakarta Selatan, DKI Jakarta',
      phone: '+62-21-2345-6789',
      email: 'info@kliniksehat.com',
      website: 'https://kliniksehat.com',
      description:
        'Klinik kesehatan mental modern dengan layanan terpadu untuk semua usia.',
      workingHours: 'Senin - Jumat: 07:00 - 18:00, Sabtu: 08:00 - 14:00',
      subscriptionTierId: subscriptionTiers.professional.id,
    });

    const klinikBaruId = await this.createClinic(em, {
      name: 'Klinik Baru',
      address: 'Jl. Kemang Raya No. 654, Jakarta Selatan, DKI Jakarta',
      phone: '+62-21-3456-7890',
      email: 'info@klinikbaru.com',
      website: 'https://klinikbaru.com',
      description:
        'Klinik kesehatan mental baru yang fokus pada terapi modern dan inovatif.',
      workingHours: 'Senin - Jumat: 08:00 - 16:00, Sabtu: 09:00 - 13:00',
      subscriptionTierId: subscriptionTiers.starter.id,
    });

    // Step 3: Create demo users
    await this.createDemoUsers(em, {
      pulihKlinikId,
      klinikSehatId,
      klinikBaruId,
    });

    console.log('✅ SQL seeder completed successfully!');
  }

  private async createSubscriptionTiers(em: EntityManager): Promise<{
    starter: { id: string };
    professional: { id: string };
    enterprise: { id: string };
  }> {
    console.log('💳 Creating subscription tiers...');

    const subscriptionTiers = [
      {
        name: 'Starter',
        code: 'starter',
        description: 'Paket untuk klinik kecil dengan kebutuhan dasar',
        monthlyPrice: 299000, // 299k IDR
        yearlyPrice: 2990000, // 2.99M IDR
        therapistLimit: 2,
        newClientsPerDayLimit: 5,
        isRecommended: false,
        sortOrder: 1,
      },
      {
        name: 'Professional',
        code: 'professional',
        description: 'Paket untuk klinik menengah dengan fitur lengkap',
        monthlyPrice: 599000, // 599k IDR
        yearlyPrice: 5990000, // 5.99M IDR
        therapistLimit: 10,
        newClientsPerDayLimit: 20,
        isRecommended: true,
        sortOrder: 2,
      },
      {
        name: 'Enterprise',
        code: 'enterprise',
        description: 'Paket untuk klinik besar dengan fitur premium',
        monthlyPrice: 999000, // 999k IDR
        yearlyPrice: 9990000, // 9.99M IDR
        therapistLimit: 50,
        newClientsPerDayLimit: 100,
        isRecommended: false,
        sortOrder: 3,
      },
    ];

    const createdTiers: any = {};

    for (const tierData of subscriptionTiers) {
      // Check if tier already exists
      const existingTier = await em
        .getConnection()
        .execute(
          `SELECT id FROM subscription_tiers WHERE code = '${tierData.code}'`,
        );

      let tierId: string;

      if (existingTier.length > 0) {
        tierId = existingTier[0].id;
        console.log(`✅ Using existing subscription tier: ${tierData.name}`);
      } else {
        // Create subscription tier
        const result = await em.getConnection().execute(`
          INSERT INTO subscription_tiers (
            name, code, description, monthly_price, yearly_price,
            therapist_limit, new_clients_per_day_limit, is_recommended,
            is_active, sort_order
          ) VALUES (
            '${tierData.name}',
            '${tierData.code}',
            '${tierData.description}',
            ${tierData.monthlyPrice},
            ${tierData.yearlyPrice},
            ${tierData.therapistLimit},
            ${tierData.newClientsPerDayLimit},
            ${tierData.isRecommended},
            true,
            ${tierData.sortOrder}
          ) RETURNING id
        `);

        tierId = result[0].id;
        console.log(
          `✅ Created subscription tier: ${tierData.name} (${tierData.code})`,
        );
      }

      createdTiers[tierData.code] = { id: tierId };
    }

    return createdTiers;
  }

  private async createClinic(
    em: EntityManager,
    clinicData: {
      name: string;
      address: string;
      phone: string;
      email: string;
      website: string;
      description: string;
      workingHours: string;
      subscriptionTierId?: string;
    },
  ): Promise<string> {
    console.log(`🏥 Creating clinic: ${clinicData.name}...`);

    // Check if clinic already exists
    const existingClinic = await em
      .getConnection()
      .execute(`SELECT id FROM clinics WHERE name = '${clinicData.name}'`);

    if (existingClinic.length > 0) {
      console.log(`✅ Using existing clinic: ${existingClinic[0].id}`);
      return existingClinic[0].id;
    }

    // Create clinic using raw SQL
    const subscriptionTierClause = clinicData.subscriptionTierId
      ? `'${clinicData.subscriptionTierId}'`
      : 'NULL';

    const result = await em.getConnection().execute(`
      INSERT INTO clinics (
        name, address, phone, email, website, description, working_hours, 
        status, primary_color, secondary_color, font_family, timezone, 
        language, email_notifications, sms_notifications, push_notifications,
        subscription_tier_id, subscription_expires
      ) VALUES (
        '${clinicData.name}',
        '${clinicData.address}',
        '${clinicData.phone}',
        '${clinicData.email}',
        '${clinicData.website}',
        '${clinicData.description}',
        '${clinicData.workingHours}',
        'active',
        '#3B82F6',
        '#1F2937',
        'Inter',
        'Asia/Jakarta',
        'id',
        true,
        false,
        false,
        ${subscriptionTierClause},
        ${clinicData.subscriptionTierId ? "NOW() + INTERVAL '1 year'" : 'NULL'}
      ) RETURNING id
    `);

    const clinicId = result[0].id;
    console.log(`✅ Created clinic "${clinicData.name}" with ID: ${clinicId}`);
    return clinicId;
  }

  private async createDemoUsers(
    em: EntityManager,
    clinicIds: {
      pulihKlinikId: string;
      klinikSehatId: string;
      klinikBaruId: string;
    },
  ): Promise<void> {
    const demoUsers = [
      {
        email: 'admin@pulihklinik.com',
        password: 'admin123',
        name: 'Dr. Sarah Johnson',
        phone: '+62-812-3456-7890',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta',
        bio: 'Psikolog klinis dengan pengalaman 8 tahun dalam menangani gangguan kecemasan dan depresi.',
        roles: ['administrator'],
        isTherapist: true,
        licenseNumber: 'SIP-123456',
        licenseType: 'psychologist',
        education:
          'S1 Psikologi Universitas Indonesia, S2 Psikologi Klinis Universitas Gadjah Mada',
        certifications:
          'Certified CBT Therapist, ACT Practitioner, Licensed Clinical Psychologist',
        clinicId: clinicIds.pulihKlinikId,
      },
      {
        email: 'admin@kliniksehat.com',
        password: 'clinic123',
        name: 'Admin Klinik Sehat',
        phone: '+62-813-9876-5432',
        address: 'Jl. Thamrin No. 456, Jakarta Selatan, DKI Jakarta',
        bio: 'Administrator klinik dengan pengalaman 5 tahun dalam manajemen fasilitas kesehatan mental.',
        roles: ['clinic_admin'],
        isTherapist: false,
        clinicId: clinicIds.klinikSehatId,
      },
      {
        email: 'therapist@kliniksehat.com',
        password: 'therapist123',
        name: 'Dr. Sarah Wijaya',
        phone: '+62-814-5678-9012',
        address: 'Jl. Gatot Subroto No. 789, Jakarta Barat, DKI Jakarta',
        bio: 'Psikiater dengan spesialisasi dalam gangguan mood dan psikosis.',
        roles: ['therapist'],
        isTherapist: true,
        licenseNumber: 'SIP-789012',
        licenseType: 'psychiatrist',
        education:
          'S1 Kedokteran Universitas Indonesia, Spesialis Psikiatri Universitas Gadjah Mada',
        certifications:
          'Board Certified Psychiatrist, Psychopharmacology Specialist',
        clinicId: clinicIds.klinikSehatId,
      },
      {
        email: 'dr.ahmad@kliniksehat.com',
        password: 'multi123',
        name: 'Dr. Ahmad Rizki',
        phone: '+62-815-1234-5678',
        address: 'Jl. Diponegoro No. 321, Jakarta Timur, DKI Jakarta',
        bio: 'Psikolog klinis dan administrator dengan pengalaman 10 tahun.',
        roles: ['clinic_admin', 'therapist'],
        isTherapist: true,
        licenseNumber: 'SIP-456789',
        licenseType: 'psychologist',
        education:
          'S1 Psikologi Universitas Airlangga, S2 Psikologi Klinis Universitas Indonesia',
        certifications:
          'Family Therapy Specialist, Clinical Supervisor, Healthcare Management',
        clinicId: clinicIds.klinikSehatId,
      },
      {
        email: 'newadmin@klinikbaru.com',
        password: 'onboard123',
        name: 'Admin Baru',
        phone: '+62-816-9876-5432',
        address: 'Jl. Kemang Raya No. 654, Jakarta Selatan, DKI Jakarta',
        bio: 'Administrator baru yang sedang dalam proses onboarding.',
        roles: ['clinic_admin'],
        isTherapist: false,
        clinicId: clinicIds.klinikBaruId,
      },
    ];

    for (const userData of demoUsers) {
      await this.createDemoUser(em, userData.clinicId, userData);
    }
  }

  private async createDemoUser(
    em: EntityManager,
    clinicId: string,
    userData: any,
  ): Promise<void> {
    console.log(`👤 Creating user: ${userData.email}`);

    // Create user
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const userResult = await em.getConnection().execute(`
      INSERT INTO users (
        email, password_hash, email_verified, status, clinic_id
      ) VALUES (
        '${userData.email}', '${passwordHash}', true, 'active', '${clinicId}'
      ) RETURNING id
    `);

    const userId = userResult[0].id;

    // Create user profile
    await em.getConnection().execute(`
      INSERT INTO user_profiles (
        user_id, name, phone, address, bio
      ) VALUES (
        '${userId}', '${userData.name}', '${userData.phone}', '${userData.address}', '${userData.bio}'
      )
    `);

    // Create user roles
    for (const roleName of userData.roles) {
      await em.getConnection().execute(`
        INSERT INTO user_roles (
          user_id, role
        ) VALUES (
          '${userId}', '${roleName}'
        )
      `);
      console.log(`  📋 Added role: ${roleName}`);
    }

    // Create therapist if applicable
    if (userData.isTherapist) {
      await em.getConnection().execute(`
        INSERT INTO therapists (
          user_id, license_number, license_type, join_date,
          education, certifications, current_load, timezone
        ) VALUES (
          '${userId}', '${userData.licenseNumber}', '${userData.licenseType}', NOW(),
          '${userData.education}', '${userData.certifications}', 0, 'Asia/Jakarta'
        )
      `);
      console.log(
        `  🩺 Created therapist with license: ${userData.licenseNumber}`,
      );
    }

    console.log(`✅ Created user: ${userData.name} (${userData.email})`);
  }
}
