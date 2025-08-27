import { EntityManager } from '@mikro-orm/core';
import {
  Therapist,
  TherapistStatus,
  LicenseType,
  EmploymentType,
} from '../entities/therapist.entity';
import { TherapistSpecialization } from '../entities/therapist-specialization.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import { UserRole as UserRoleEnum } from '../../common/enums/user-roles.enum';

export class TherapistSeeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Seeding therapists...');

    // Get all users with therapist role
    const therapistUserRoles = await em.find(UserRole, {
      role: UserRoleEnum.THERAPIST,
    });
    const therapistUserIds = therapistUserRoles.map(function (role) {
      return role.userId;
    });
    const therapistUsers = await em.find(User, {
      id: { $in: therapistUserIds },
    });
    const clinics = await em.find(Clinic, {});

    if (therapistUsers.length === 0) {
      console.log('⚠️ No therapist users found. Please run user seeder first.');
      return;
    }

    const therapistData = [
      // Sarah Johnson - Klinik Sehat
      {
        user: therapistUsers.find(function (u) {
          return u.email === 'therapist@kliniksehat.com';
        }),
        clinic: clinics.find(function (c) {
          return c.name === 'Klinik Sehat';
        }),
        fullName: 'Sarah Johnson',
        phone: '+62-812-3456-7892',
        licenseNumber: 'PSI-2023-001',
        licenseType: LicenseType.PSYCHOLOGIST,
        yearsOfExperience: 8,
        status: TherapistStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        joinDate: new Date('2023-01-15'),
        maxClients: 20,
        currentLoad: 12,
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        specializations: [
          'Anxiety Disorders',
          'Depression',
          'Cognitive Behavioral Therapy',
        ],
        bio: 'Licensed clinical psychologist with 8 years of experience specializing in anxiety disorders and depression. Trained in Cognitive Behavioral Therapy (CBT) and has helped hundreds of clients overcome their mental health challenges.',
      },
      // Ahmad Rizki - Klinik Sehat (Multi Role)
      {
        user: therapistUsers.find(function (u) {
          return u.email === 'dr.ahmad@kliniksehat.com';
        }),
        clinic: clinics.find(function (c) {
          return c.name === 'Klinik Sehat';
        }),
        fullName: 'Ahmad Rizki',
        phone: '+62-812-3456-7893',
        licenseNumber: 'PSI-2010-005',
        licenseType: LicenseType.PSYCHIATRIST,
        yearsOfExperience: 15,
        status: TherapistStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        joinDate: new Date('2010-06-01'),
        maxClients: 25,
        currentLoad: 18,
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        specializations: [
          'Psychiatry',
          'Addiction Treatment',
          'Trauma Therapy',
          'Family Therapy',
        ],
        bio: 'Senior psychiatrist and clinic director with 15 years of experience in clinical practice and healthcare administration. Specializes in addiction treatment, trauma therapy, and family therapy. Dual expertise in clinical practice and healthcare management.',
      },
      // Maya Sari - Klinik Sehat
      {
        user: therapistUsers.find((u) => u.email === 'dr.maya@kliniksehat.com'),
        clinic: clinics.find((c) => c.name === 'Klinik Sehat'),
        fullName: 'Maya Sari',
        phone: '+62-812-3456-7894',
        licenseNumber: 'PSI-2016-012',
        licenseType: LicenseType.PSYCHOLOGIST,
        yearsOfExperience: 8,
        status: TherapistStatus.ACTIVE,
        employmentType: EmploymentType.PART_TIME,
        joinDate: new Date('2016-09-01'),
        maxClients: 15,
        currentLoad: 10,
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        specializations: [
          'Child Psychology',
          'Adolescent Psychology',
          'Developmental Disorders',
          'Family Therapy',
        ],
        bio: 'Child and adolescent psychologist with 8 years of experience in developmental disorders. Specializes in working with children with autism, ADHD, and other developmental challenges. Passionate about helping families navigate the complexities of child development.',
      },
      // Budi Santoso - Klinik Sehat
      {
        user: therapistUsers.find((u) => u.email === 'dr.budi@kliniksehat.com'),
        clinic: clinics.find((c) => c.name === 'Klinik Sehat'),
        fullName: 'Budi Santoso',
        phone: '+62-812-3456-7895',
        licenseNumber: 'PSI-2014-008',
        licenseType: LicenseType.COUNSELOR,
        yearsOfExperience: 10,
        status: TherapistStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        joinDate: new Date('2014-03-01'),
        maxClients: 18,
        currentLoad: 14,
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        specializations: [
          'Marriage and Family Therapy',
          'Couples Counseling',
          'Conflict Resolution',
          'Communication Skills',
        ],
        bio: 'Marriage and family therapist with 10 years of experience specializing in relationship counseling and conflict resolution. Trained in Gottman Method Couples Therapy and has helped hundreds of couples strengthen their relationships.',
      },
      // Lisa Wijaya - Terapintar
      {
        user: therapistUsers.find((u) => u.email === 'dr.lisa@terapintar.com'),
        clinic: clinics.find((c) => c.name === 'Terapintar Clinic'),
        fullName: 'Lisa Wijaya',
        phone: '+62-812-3456-7896',
        licenseNumber: 'PSI-2020-025',
        licenseType: LicenseType.PSYCHOLOGIST,
        yearsOfExperience: 5,
        status: TherapistStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        joinDate: new Date('2020-08-01'),
        maxClients: 16,
        currentLoad: 11,
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        specializations: [
          'Cognitive Behavioral Therapy',
          'Anxiety Management',
          'Stress Management',
          'Mindfulness',
        ],
        bio: 'Cognitive behavioral therapist with 5 years of experience specializing in anxiety and stress management. Integrates mindfulness techniques with traditional CBT approaches to provide comprehensive mental health care.',
      },
      // Hendra Prasetyo - Terapintar
      {
        user: therapistUsers.find(
          (u) => u.email === 'dr.hendra@terapintar.com',
        ),
        clinic: clinics.find((c) => c.name === 'Terapintar Clinic'),
        fullName: 'Hendra Prasetyo',
        phone: '+62-812-3456-7897',
        licenseNumber: 'PSI-2018-015',
        licenseType: LicenseType.PSYCHOLOGIST,
        yearsOfExperience: 7,
        status: TherapistStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        joinDate: new Date('2018-11-01'),
        maxClients: 20,
        currentLoad: 15,
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        specializations: [
          'Addiction Treatment',
          'Substance Abuse',
          'Recovery Programs',
          'Group Therapy',
        ],
        bio: 'Addiction specialist with 7 years of experience in substance abuse treatment and recovery programs. Leads group therapy sessions and provides individual counseling for clients struggling with addiction.',
      },
    ];

    for (const data of therapistData) {
      if (!data.user || !data.clinic) {
        console.log(`⚠️ Skipping therapist data - user or clinic not found`);
        continue;
      }

      // Check if therapist already exists
      const existingTherapist = await em.findOne(Therapist, {
        user: data.user,
      });
      if (existingTherapist) {
        console.log(
          `Therapist for user ${data.user.email} already exists, skipping...`,
        );
        continue;
      }

      // Create therapist
      const therapist = em.create(Therapist, {
        clinic: data.clinic,
        user: data.user,
        fullName: data.fullName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        yearsOfExperience: data.yearsOfExperience,
        status: data.status,
        employmentType: data.employmentType,
        joinDate: data.joinDate,
        maxClients: data.maxClients,
        currentLoad: data.currentLoad,
        workingDays: data.workingDays,
        adminNotes: data.bio,
        timezone: 'Asia/Jakarta',
        sessionDuration: 60,
        breakBetweenSessions: 15,
        maxSessionsPerDay: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(therapist);

      // Create specializations
      for (const specializationName of data.specializations) {
        const specialization = em.create(TherapistSpecialization, {
          therapist: therapist,
          specialization: specializationName,
          createdAt: new Date(),
        });

        await em.persistAndFlush(specialization);
      }

      console.log(
        `✅ Created therapist: ${data.fullName} (${data.licenseNumber})`,
      );
    }

    console.log('✅ Therapist seeding completed!');
  }
}
