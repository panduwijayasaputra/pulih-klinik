import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { Clinic } from '../entities/clinic.entity';
import { Therapist } from '../entities/therapist.entity';
import { TherapistSpecialization } from '../entities/therapist-specialization.entity';
import { Client } from '../entities/client.entity';
import { ClientTherapistAssignment } from '../entities/client-therapist-assignment.entity';
import { TherapySession } from '../entities/therapy-session.entity';
import { Consultation } from '../entities/consultation.entity';
import * as bcrypt from 'bcryptjs';
import { UserRole as UserRoleEnum } from '../../common/enums';
import {
  TherapistStatus,
  EmploymentType,
  LicenseType,
} from '../entities/therapist.entity';
import {
  Gender,
  Religion,
  Education,
  MaritalStatus,
  ClientStatus,
} from '../entities/client.entity';
import {
  AssignmentStatus,
} from '../entities/client-therapist-assignment.entity';
import {
  FormType,
  ConsultationStatus,
} from '../entities/consultation.entity';
import { SessionStatus } from '../entities/therapy-session.entity';

export class DemoDataSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting demo data seeding...');

    // Get the default clinic
    const clinic = await em.findOne(Clinic, { name: 'Smart Therapy Clinic' });
    if (!clinic) {
      console.log('❌ Clinic not found. Please run the complete admin seeder first.');
      return;
    }

    // Create demo therapist users
    const therapistData: Array<{
      email: string;
      name: string;
      phone: string;
      licenseNumber: string;
      licenseType: LicenseType;
      yearsOfExperience: number;
      specializations: string[];
    }> = [
      {
        email: 'dr.sarah@smarttherapy.id',
        name: 'Dr. Sarah Putri Sari, M.Psi',
        phone: '+62-812-1111-1111',
        licenseNumber: 'HT-2020-001',
        licenseType: LicenseType.HYPNOTHERAPIST,
        yearsOfExperience: 8,
        specializations: ['Anxiety & Stress', 'Depression', 'Trauma & PTSD']
      },
      {
        email: 'dr.budi@smarttherapy.id',
        name: 'Dr. Budi Santoso, S.Psi., M.Psi',
        phone: '+62-812-2222-2222',
        licenseNumber: 'HT-2019-005',
        licenseType: LicenseType.HYPNOTHERAPIST,
        yearsOfExperience: 12,
        specializations: ['Addiction Recovery', 'Weight Management', 'Smoking Cessation']
      },
      {
        email: 'dr.maya@smarttherapy.id',
        name: 'Dr. Maya Indah Lestari, M.Psi',
        phone: '+62-812-3333-3333',
        licenseNumber: 'HT-2021-003',
        licenseType: LicenseType.HYPNOTHERAPIST,
        yearsOfExperience: 5,
        specializations: ['Phobias & Fears', 'Sleep Disorders', 'Performance Enhancement']
      }
    ];

    const therapists: Therapist[] = [];

    for (const therapistInfo of therapistData) {
      // Check if therapist user exists
      let therapistUser = await em.findOne(User, { email: therapistInfo.email });

      if (!therapistUser) {
        // Create therapist user
        therapistUser = new User();
        therapistUser.email = therapistInfo.email;
        therapistUser.passwordHash = await bcrypt.hash('Therapist123!', 12);
        therapistUser.emailVerified = true;
        therapistUser.isActive = true;

        await em.persistAndFlush(therapistUser);

        // Create therapist profile
        const therapistProfile = new UserProfile();
        therapistProfile.userId = therapistUser.id;
        therapistProfile.name = therapistInfo.name;
        therapistProfile.phone = therapistInfo.phone;
        therapistProfile.bio = `Professional hypnotherapist with ${therapistInfo.yearsOfExperience} years of experience`;
        therapistProfile.user = therapistUser;

        await em.persistAndFlush(therapistProfile);

        // Create therapist role
        const therapistRole = new UserRole();
        therapistRole.userId = therapistUser.id;
        therapistRole.role = UserRoleEnum.THERAPIST;
        therapistRole.clinicId = clinic.id;
        therapistRole.user = therapistUser;
        therapistRole.clinic = clinic;

        await em.persistAndFlush(therapistRole);

        // Create therapist entity
        const therapist = new Therapist();
        therapist.clinic = clinic;
        therapist.user = therapistUser;
        therapist.fullName = therapistInfo.name;
        therapist.phone = therapistInfo.phone;
        therapist.licenseNumber = therapistInfo.licenseNumber;
        therapist.licenseType = therapistInfo.licenseType;
        therapist.yearsOfExperience = therapistInfo.yearsOfExperience;
        therapist.status = TherapistStatus.ACTIVE;
        therapist.employmentType = EmploymentType.FULL_TIME;
        therapist.joinDate = new Date();

        await em.persistAndFlush(therapist);

        // Create specializations
        for (const spec of therapistInfo.specializations) {
          const specialization = new TherapistSpecialization();
          specialization.therapist = therapist;
          specialization.specialization = spec;

          await em.persistAndFlush(specialization);
        }

        therapists.push(therapist);
        console.log(`✅ Created therapist: ${therapistInfo.name}`);
      }
    }

    // Create demo clients
    const clientData: Array<{
      fullName: string;
      gender: Gender;
      birthPlace: string;
      birthDate: Date;
      religion: Religion;
      occupation: string;
      education: Education;
      educationMajor?: string;
      address: string;
      phone: string;
      email: string;
      maritalStatus: MaritalStatus;
      province: string;
    }> = [
      {
        fullName: 'Andi Wijaya',
        gender: Gender.MALE,
        birthPlace: 'Jakarta',
        birthDate: new Date('1990-05-15'),
        religion: Religion.ISLAM,
        occupation: 'Software Engineer',
        education: Education.BACHELOR,
        educationMajor: 'Teknik Informatika',
        address: 'Jl. Merdeka No. 45, Jakarta Selatan',
        phone: '+62-812-9999-0001',
        email: 'andi.wijaya@email.com',
        maritalStatus: MaritalStatus.MARRIED,
        province: 'DKI Jakarta'
      },
      {
        fullName: 'Sari Dewi Lestari',
        gender: Gender.FEMALE,
        birthPlace: 'Surabaya',
        birthDate: new Date('1985-08-20'),
        religion: Religion.CHRISTIANITY,
        occupation: 'Marketing Manager',
        education: Education.BACHELOR,
        educationMajor: 'Manajemen',
        address: 'Jl. Pahlawan No. 123, Surabaya',
        phone: '+62-812-9999-0002',
        email: 'sari.dewi@email.com',
        maritalStatus: MaritalStatus.MARRIED,
        province: 'Jawa Timur'
      },
      {
        fullName: 'Budi Hartono',
        gender: Gender.MALE,
        birthPlace: 'Bandung',
        birthDate: new Date('1992-12-10'),
        religion: Religion.ISLAM,
        occupation: 'Teacher',
        education: Education.BACHELOR,
        educationMajor: 'Pendidikan',
        address: 'Jl. Asia Afrika No. 67, Bandung',
        phone: '+62-812-9999-0003',
        email: 'budi.hartono@email.com',
        maritalStatus: MaritalStatus.SINGLE,
        province: 'Jawa Barat'
      },
      {
        fullName: 'Nina Kartika Sari',
        gender: Gender.FEMALE,
        birthPlace: 'Yogyakarta',
        birthDate: new Date('1988-03-25'),
        religion: Religion.HINDUISM,
        occupation: 'Graphic Designer',
        education: Education.BACHELOR,
        educationMajor: 'Desain Komunikasi Visual',
        address: 'Jl. Malioboro No. 89, Yogyakarta',
        phone: '+62-812-9999-0004',
        email: 'nina.kartika@email.com',
        maritalStatus: MaritalStatus.WIDOWED,
        province: 'DI Yogyakarta'
      },
      {
        fullName: 'Rudi Setiawan',
        gender: Gender.MALE,
        birthPlace: 'Medan',
        birthDate: new Date('1995-07-18'),
        religion: Religion.CHRISTIANITY,
        occupation: 'Sales Executive',
        education: Education.HIGH_SCHOOL,
        address: 'Jl. Gatot Subroto No. 234, Medan',
        phone: '+62-812-9999-0005',
        email: 'rudi.setiawan@email.com',
        maritalStatus: MaritalStatus.SINGLE,
        province: 'Sumatera Utara'
      }
    ];

    const clients: Client[] = [];

    for (const clientInfo of clientData) {
      // Check if client exists
      let client = await em.findOne(Client, { phone: clientInfo.phone });

      if (!client) {
        client = new Client();
        client.clinic = clinic;
        client.fullName = clientInfo.fullName;
        client.gender = clientInfo.gender;
        client.birthPlace = clientInfo.birthPlace;
        client.birthDate = clientInfo.birthDate;
        client.religion = clientInfo.religion;
        client.occupation = clientInfo.occupation;
        client.education = clientInfo.education;
        client.educationMajor = clientInfo.educationMajor;
        client.address = clientInfo.address;
        client.phone = clientInfo.phone;
        client.email = clientInfo.email;
        client.maritalStatus = clientInfo.maritalStatus;
        client.province = clientInfo.province;
        client.status = ClientStatus.ASSIGNED;
        client.joinDate = new Date();

        // Calculate age
        const today = new Date();
        const age = today.getFullYear() - clientInfo.birthDate.getFullYear();
        client.age = age;

        await em.persistAndFlush(client);
        clients.push(client);
        console.log(`✅ Created client: ${clientInfo.fullName}`);
      }
    }

    // Create assignments between clients and therapists
    if (therapists.length > 0 && clients.length > 0) {
      const adminUser = await em.findOne(User, { email: 'admin@smarttherapy.id' });
      
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        const therapist = therapists[i % therapists.length]; // Round-robin assignment

        // Check if assignment exists
        const existingAssignment = await em.findOne(ClientTherapistAssignment, {
          client: client.id,
          therapist: therapist.id
        });

        if (!existingAssignment) {
          const assignment = new ClientTherapistAssignment();
          assignment.client = client;
          assignment.therapist = therapist;
          assignment.assignedBy = adminUser!;
          assignment.assignedDate = new Date();
          assignment.status = AssignmentStatus.ACTIVE;
          assignment.notes = 'Initial assignment for therapy sessions';

          await em.persistAndFlush(assignment);

          // Update therapist current load
          therapist.currentLoad += 1;
          await em.flush();

          console.log(`✅ Assigned ${client.fullName} to ${therapist.fullName}`);
        }
      }
    }

    // Create sample consultation for first client
    if (clients.length > 0 && therapists.length > 0) {
      const client = clients[0];
      const therapist = therapists[0];

      const consultation = new Consultation();
      consultation.client = client;
      consultation.therapist = therapist;
      consultation.formType = FormType.GENERAL;
      consultation.status = ConsultationStatus.COMPLETED;
      consultation.sessionDate = new Date();
      consultation.sessionDuration = 90;
      consultation.previousTherapyExperience = false;
      consultation.currentMedications = false;
      consultation.primaryConcern = 'Anxiety and stress related to work performance';
      consultation.secondaryConcerns = ['Sleep problems', 'Relationship issues'];
      consultation.symptomSeverity = 3;
      consultation.symptomDuration = '3-6 months';
      consultation.treatmentGoals = ['Reduce anxiety levels', 'Improve sleep quality', 'Better work-life balance'];
      consultation.clientExpectations = 'Hope to feel more relaxed and confident in work situations';
      consultation.initialAssessment = 'Client shows signs of work-related stress and anxiety. Recommended weekly sessions for 8-10 weeks.';
      consultation.recommendedTreatmentPlan = 'Progressive muscle relaxation, cognitive restructuring, and stress management techniques';
      consultation.consultationNotes = 'Client is motivated and open to hypnotherapy treatment';

      await em.persistAndFlush(consultation);
      console.log(`✅ Created consultation for ${client.fullName}`);
    }

    // Create sample therapy sessions
    if (clients.length > 0 && therapists.length > 0) {
      const client = clients[0];
      const therapist = therapists[0];

      const sessions = [
        {
          sessionNumber: 1,
          title: 'Initial Assessment & Goal Setting',
          description: 'Introduction to hypnotherapy and setting treatment goals',
          sessionDate: new Date('2024-01-15'),
          sessionTime: '10:00',
          status: SessionStatus.COMPLETED,
          notes: 'Client was receptive to hypnosis. Good rapport established.',
          techniques: ['Progressive Relaxation', 'Safe Place Visualization'],
          issues: ['Work Anxiety', 'Sleep Problems']
        },
        {
          sessionNumber: 2,
          title: 'Stress Management Techniques',
          description: 'Learning coping strategies for workplace stress',
          sessionDate: new Date('2024-01-22'),
          sessionTime: '10:00',
          status: SessionStatus.COMPLETED,
          notes: 'Client practiced breathing exercises. Showed improvement in relaxation response.',
          techniques: ['Breathing Techniques', 'Anchoring', 'Positive Suggestions'],
          issues: ['Work Anxiety', 'Time Management']
        },
        {
          sessionNumber: 3,
          title: 'Confidence Building',
          description: 'Building self-confidence and assertiveness',
          sessionDate: new Date('2024-01-29'),
          sessionTime: '10:00',
          status: SessionStatus.SCHEDULED,
          notes: null,
          techniques: ['Self-Hypnosis Training', 'Visualization'],
          issues: ['Self-Confidence', 'Communication Skills']
        }
      ];

      for (const sessionData of sessions) {
        const session = new TherapySession();
        session.client = client;
        session.therapist = therapist;
        session.sessionNumber = sessionData.sessionNumber;
        session.title = sessionData.title;
        session.description = sessionData.description;
        session.sessionDate = sessionData.sessionDate;
        session.sessionTime = sessionData.sessionTime;
        session.status = sessionData.status;
        session.notes = sessionData.notes || undefined;
        session.techniques = sessionData.techniques;
        session.issues = sessionData.issues;

        await em.persistAndFlush(session);
      }

      // Update client progress and session count
      client.totalSessions = 2;
      client.lastSessionDate = new Date('2024-01-22');
      client.progress = 35;
      client.status = ClientStatus.THERAPY;
      
      await em.flush();
      console.log(`✅ Created ${sessions.length} therapy sessions for ${client.fullName}`);
    }

    console.log('🎉 Demo data seeding completed successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('👨‍⚕️ Therapists:');
    console.log('  - dr.sarah@smarttherapy.id (Password: Therapist123!)');
    console.log('  - dr.budi@smarttherapy.id (Password: Therapist123!)');
    console.log('  - dr.maya@smarttherapy.id (Password: Therapist123!)');
    console.log('\n👥 Created 5 demo clients with various backgrounds');
    console.log('📅 Created sample therapy sessions and consultation');
    console.log('🔗 Created client-therapist assignments');
  }
}