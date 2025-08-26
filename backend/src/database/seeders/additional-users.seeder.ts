import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import * as bcrypt from 'bcryptjs';

export class AdditionalUsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Get the default clinic
    const clinic = await em.findOne(Clinic, { name: 'Smart Therapy Clinic' });

    if (!clinic) {
      console.log(
        '❌ Default clinic not found. Please run the CompleteAdminSeeder first.',
      );
      return;
    }

    // Create a therapist user
    const therapistUser = new User();
    therapistUser.email = 'therapist@smarttherapy.id';
    therapistUser.passwordHash = await bcrypt.hash('Therapist123!', 12);
    therapistUser.emailVerified = true;
    therapistUser.isActive = true;

    await em.persistAndFlush(therapistUser);

    // Create therapist profile
    const therapistProfile = new UserProfile();
    therapistProfile.userId = therapistUser.id;
    therapistProfile.name = 'Dr. Sarah Wijaya';
    therapistProfile.phone = '+62-812-3456-7892';
    therapistProfile.bio =
      'Licensed hypnotherapist with 5+ years of experience in anxiety and stress management';
    therapistProfile.user = therapistUser;

    await em.persistAndFlush(therapistProfile);

    // Create therapist role
    const therapistRole = new UserRole();
    therapistRole.userId = therapistUser.id;
    therapistRole.role = 'therapist';
    therapistRole.clinicId = clinic.id;
    therapistRole.user = therapistUser;
    therapistRole.clinic = clinic;

    await em.persistAndFlush(therapistRole);

    // Create a multi-role user (therapist + clinic admin)
    const multiRoleUser = new User();
    multiRoleUser.email = 'multirole@smarttherapy.id';
    multiRoleUser.passwordHash = await bcrypt.hash('MultiRole123!', 12);
    multiRoleUser.emailVerified = true;
    multiRoleUser.isActive = true;

    await em.persistAndFlush(multiRoleUser);

    // Create multi-role profile
    const multiRoleProfile = new UserProfile();
    multiRoleProfile.userId = multiRoleUser.id;
    multiRoleProfile.name = 'Dr. Ahmad Rahman';
    multiRoleProfile.phone = '+62-812-3456-7893';
    multiRoleProfile.bio =
      'Senior therapist and clinic administrator with expertise in addiction therapy';
    multiRoleProfile.user = multiRoleUser;

    await em.persistAndFlush(multiRoleProfile);

    // Create clinic admin role for multi-role user
    const multiRoleClinicAdminRole = new UserRole();
    multiRoleClinicAdminRole.userId = multiRoleUser.id;
    multiRoleClinicAdminRole.role = 'clinic_admin';
    multiRoleClinicAdminRole.clinicId = clinic.id;
    multiRoleClinicAdminRole.user = multiRoleUser;
    multiRoleClinicAdminRole.clinic = clinic;

    await em.persistAndFlush(multiRoleClinicAdminRole);

    // Create therapist role for multi-role user
    const multiRoleTherapistRole = new UserRole();
    multiRoleTherapistRole.userId = multiRoleUser.id;
    multiRoleTherapistRole.role = 'therapist';
    multiRoleTherapistRole.clinicId = clinic.id;
    multiRoleTherapistRole.user = multiRoleUser;
    multiRoleTherapistRole.clinic = clinic;

    await em.persistAndFlush(multiRoleTherapistRole);

    console.log('✅ Additional users created successfully!');
    console.log('📧 Therapist email: therapist@smarttherapy.id');
    console.log('🔑 Therapist password: Therapist123!');
    console.log('📧 Multi-role email: multirole@smarttherapy.id');
    console.log('🔑 Multi-role password: MultiRole123!');
    console.log('👤 Multi-role user has both therapist and clinic_admin roles');
  }
}
