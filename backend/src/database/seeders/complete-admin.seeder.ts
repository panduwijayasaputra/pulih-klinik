import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import * as bcrypt from 'bcryptjs';
import { UserRole as UserRoleEnum } from '../../common/enums';

export class CompleteAdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if admin user exists
    const existingAdmin = await em.findOne(User, {
      email: 'admin@smarttherapy.id',
    });

    if (!existingAdmin) {
      console.log(
        '❌ Admin user not found. Please run the initial seeder first.',
      );
      return;
    }

    // Check if clinic exists, if not create one
    let clinic = await em.findOne(Clinic, { name: 'Smart Therapy Clinic' });

    if (!clinic) {
      clinic = new Clinic();
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
      console.log('✅ Created default clinic');
    }

    // Check if admin profile exists
    const existingProfile = await em.findOne(UserProfile, {
      userId: existingAdmin.id,
    });

    if (!existingProfile) {
      const adminProfile = new UserProfile();
      adminProfile.userId = existingAdmin.id;
      adminProfile.name = 'System Administrator';
      adminProfile.phone = '+62-812-3456-7890';
      adminProfile.bio = 'System administrator for Smart Therapy platform';
      adminProfile.user = existingAdmin;

      await em.persistAndFlush(adminProfile);
      console.log('✅ Created admin profile');
    }

    // Check if admin role exists
    const existingRole = await em.findOne(UserRole, {
      userId: existingAdmin.id,
      role: UserRoleEnum.ADMINISTRATOR,
    });

    if (!existingRole) {
      const adminRole = new UserRole();
      adminRole.userId = existingAdmin.id;
      adminRole.role = UserRoleEnum.ADMINISTRATOR;
      adminRole.user = existingAdmin;

      await em.persistAndFlush(adminRole);
      console.log('✅ Created admin role');
    }

    // Create a clinic admin user if it doesn't exist
    const existingClinicAdmin = await em.findOne(User, {
      email: 'clinic@smarttherapy.id',
    });

    if (!existingClinicAdmin) {
      const clinicAdminUser = new User();
      clinicAdminUser.email = 'clinic@smarttherapy.id';
      clinicAdminUser.passwordHash = await bcrypt.hash('Clinic123!', 12);
      clinicAdminUser.emailVerified = true;
      clinicAdminUser.isActive = true;

      await em.persistAndFlush(clinicAdminUser);

      const clinicAdminProfile = new UserProfile();
      clinicAdminProfile.userId = clinicAdminUser.id;
      clinicAdminProfile.name = 'Clinic Administrator';
      clinicAdminProfile.phone = '+62-812-3456-7891';
      clinicAdminProfile.bio = 'Clinic administrator for Smart Therapy';
      clinicAdminProfile.user = clinicAdminUser;

      await em.persistAndFlush(clinicAdminProfile);

      const clinicAdminRole = new UserRole();
      clinicAdminRole.userId = clinicAdminUser.id;
      clinicAdminRole.role = UserRoleEnum.CLINIC_ADMIN;
      clinicAdminRole.clinicId = clinic.id;
      clinicAdminRole.user = clinicAdminUser;
      clinicAdminRole.clinic = clinic;

      await em.persistAndFlush(clinicAdminRole);
      console.log('✅ Created clinic admin user');
    }

    console.log('✅ Database setup completed successfully!');
    console.log('📧 Admin email: admin@smarttherapy.id');
    console.log('🔑 Admin password: Admin123!');
    console.log('📧 Clinic admin email: clinic@smarttherapy.id');
    console.log('🔑 Clinic admin password: Clinic123!');
  }
}
