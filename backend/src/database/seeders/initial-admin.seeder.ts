import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import * as bcrypt from 'bcryptjs';

export class InitialAdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create a default clinic
    const clinic = new Clinic();
    clinic.name = 'Smart Therapy Clinic';
    clinic.address = 'Jl. Sudirman No. 123, Jakarta Pusat';
    clinic.phone = '+62-21-1234-5678';
    clinic.email = 'admin@smarttherapy.id';
    clinic.website = 'https://smarttherapy.id';
    clinic.description = 'Leading hypnotherapy clinic in Indonesia';
    clinic.workingHours = 'Monday - Friday: 9:00 AM - 6:00 PM';
    clinic.status = 'active';
    clinic.subscriptionTier = 'alpha';

    await em.persistAndFlush(clinic);

    // Create admin user
    const adminUser = new User();
    adminUser.email = 'admin@smarttherapy.id';
    adminUser.passwordHash = await bcrypt.hash('Admin123!', 12);
    adminUser.emailVerified = true;
    adminUser.isActive = true;

    await em.persistAndFlush(adminUser);

    // Create admin profile
    const adminProfile = new UserProfile();
    adminProfile.userId = adminUser.id;
    adminProfile.name = 'System Administrator';
    adminProfile.phone = '+62-812-3456-7890';
    adminProfile.bio = 'System administrator for Smart Therapy platform';
    adminProfile.user = adminUser;

    await em.persistAndFlush(adminProfile);

    // Create admin role
    const adminRole = new UserRole();
    adminRole.userId = adminUser.id;
    adminRole.role = 'administrator';
    adminRole.user = adminUser;

    await em.persistAndFlush(adminRole);

    // Create a clinic admin user
    const clinicAdminUser = new User();
    clinicAdminUser.email = 'clinic@smarttherapy.id';
    clinicAdminUser.passwordHash = await bcrypt.hash('Clinic123!', 12);
    clinicAdminUser.emailVerified = true;
    clinicAdminUser.isActive = true;

    await em.persistAndFlush(clinicAdminUser);

    // Create clinic admin profile
    const clinicAdminProfile = new UserProfile();
    clinicAdminProfile.userId = clinicAdminUser.id;
    clinicAdminProfile.name = 'Clinic Administrator';
    clinicAdminProfile.phone = '+62-812-3456-7891';
    clinicAdminProfile.bio = 'Clinic administrator for Smart Therapy';
    clinicAdminProfile.user = clinicAdminUser;

    await em.persistAndFlush(clinicAdminProfile);

    // Create clinic admin role
    const clinicAdminRole = new UserRole();
    clinicAdminRole.userId = clinicAdminUser.id;
    clinicAdminRole.role = 'clinic_admin';
    clinicAdminRole.clinicId = clinic.id;
    clinicAdminRole.user = clinicAdminUser;
    clinicAdminRole.clinic = clinic;

    await em.persistAndFlush(clinicAdminRole);

    console.log('✅ Initial admin and clinic data seeded successfully!');
    console.log('📧 Admin email: admin@smarttherapy.id');
    console.log('🔑 Admin password: Admin123!');
    console.log('📧 Clinic admin email: clinic@smarttherapy.id');
    console.log('🔑 Clinic admin password: Clinic123!');
  }
}
