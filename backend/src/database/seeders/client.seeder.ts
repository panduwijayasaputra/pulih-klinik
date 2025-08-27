import { EntityManager } from '@mikro-orm/core';
import {
  Client,
  ClientStatus,
  Gender,
  Religion,
  Education,
  MaritalStatus,
  SpouseRelationship,
} from '../entities/client.entity';
import { Clinic } from '../entities/clinic.entity';
import { Therapist } from '../entities/therapist.entity';

export class ClientSeeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Seeding clients...');

    const clinics = await em.find(Clinic, {});
    const therapists = await em.find(Therapist, {});

    if (clinics.length === 0) {
      console.log('⚠️ No clinics found. Please run clinic seeder first.');
      return;
    }

    if (therapists.length === 0) {
      console.log('⚠️ No therapists found. Please run therapist seeder first.');
      return;
    }

    const clientData = [
      // Sari Dewi - Klinik Sehat
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Klinik Sehat';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2023-001';
        }), // Sarah Johnson
        fullName: 'Sari Dewi',
        gender: Gender.FEMALE,
        birthPlace: 'Jakarta',
        birthDate: new Date('1995-06-20'),
        religion: Religion.ISLAM,
        occupation: 'Student',
        education: Education.BACHELOR,
        educationMajor: 'Psychology',
        address: 'Jl. Menteng No. 123, Jakarta, DKI Jakarta, 10310, Indonesia',
        phone: '+62-812-3456-7898',
        email: 'sari.dewi@example.com',
        hobbies: 'Reading, Yoga, Music',
        maritalStatus: MaritalStatus.SINGLE,
        emergencyContactName: 'Budi Dewi',
        emergencyContactPhone: '+62-812-3456-7901',
        emergencyContactRelationship: 'Father',
        emergencyContactAddress:
          'Jl. Menteng No. 123, Jakarta, DKI Jakarta, 10310, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Student experiencing academic stress and anxiety. Responding well to CBT sessions.',
      },
      // Andi Kusuma - Terapintar
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Terapintar Clinic';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2020-025';
        }), // Lisa Wijaya
        fullName: 'Andi Kusuma',
        gender: Gender.MALE,
        birthPlace: 'Bandung',
        birthDate: new Date('1992-11-12'),
        religion: Religion.ISLAM,
        occupation: 'Software Engineer',
        education: Education.BACHELOR,
        educationMajor: 'Computer Science',
        address: 'Jl. Sudirman No. 789, Jakarta, DKI Jakarta, 12190, Indonesia',
        phone: '+62-812-3456-7899',
        email: 'andi.kusuma@example.com',
        hobbies: 'Gaming, Programming, Travel',
        maritalStatus: MaritalStatus.MARRIED,
        spouseName: 'Siti Kusuma',
        relationshipWithSpouse: SpouseRelationship.GOOD,
        emergencyContactName: 'Siti Kusuma',
        emergencyContactPhone: '+62-812-3456-7902',
        emergencyContactRelationship: 'Wife',
        emergencyContactAddress:
          'Jl. Sudirman No. 789, Jakarta, DKI Jakarta, 12190, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Working professional dealing with high stress job. Benefiting from stress management techniques.',
      },
      // Rina Putri - Klinik Sehat
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Klinik Sehat';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2014-008';
        }), // Budi Santoso
        fullName: 'Rina Putri',
        gender: Gender.FEMALE,
        birthPlace: 'Surabaya',
        birthDate: new Date('1988-03-08'),
        religion: Religion.ISLAM,
        occupation: 'Housewife',
        education: Education.BACHELOR,
        educationMajor: 'Education',
        address: 'Jl. Thamrin No. 321, Jakarta, DKI Jakarta, 10350, Indonesia',
        phone: '+62-812-3456-7900',
        email: 'rina.putri@example.com',
        hobbies: 'Cooking, Gardening, Reading',
        maritalStatus: MaritalStatus.MARRIED,
        spouseName: 'Ahmad Putri',
        relationshipWithSpouse: SpouseRelationship.AVERAGE,
        emergencyContactName: 'Ahmad Putri',
        emergencyContactPhone: '+62-812-3456-7903',
        emergencyContactRelationship: 'Husband',
        emergencyContactAddress:
          'Jl. Thamrin No. 321, Jakarta, DKI Jakarta, 10350, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Mother seeking help with parenting challenges and family dynamics. Participating in family therapy sessions.',
      },
      // David Chen - Klinik Sehat
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Klinik Sehat';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2010-005';
        }), // Ahmad Rizki
        fullName: 'David Chen',
        gender: Gender.MALE,
        birthPlace: 'Medan',
        birthDate: new Date('1993-08-15'),
        religion: Religion.CHRISTIANITY,
        occupation: 'Business Analyst',
        education: Education.BACHELOR,
        educationMajor: 'Business Administration',
        address: 'Jl. Senayan No. 111, Jakarta, DKI Jakarta, 12190, Indonesia',
        phone: '+62-812-3456-7904',
        email: 'david.chen@example.com',
        hobbies: 'Swimming, Photography, Movies',
        maritalStatus: MaritalStatus.SINGLE,
        emergencyContactName: 'Linda Chen',
        emergencyContactPhone: '+62-812-3456-7905',
        emergencyContactRelationship: 'Sister',
        emergencyContactAddress:
          'Jl. Senayan No. 111, Jakarta, DKI Jakarta, 12190, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Recovering from substance abuse. Participating in group therapy and individual counseling.',
      },
      // Nina Wijaya - Klinik Sehat
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Klinik Sehat';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2016-012';
        }), // Maya Sari
        fullName: 'Nina Wijaya',
        gender: Gender.FEMALE,
        birthPlace: 'Yogyakarta',
        birthDate: new Date('1997-12-03'),
        religion: Religion.ISLAM,
        occupation: 'Student',
        education: Education.BACHELOR,
        educationMajor: 'Psychology',
        address:
          'Jl. Kebayoran No. 222, Jakarta, DKI Jakarta, 12120, Indonesia',
        phone: '+62-812-3456-7906',
        email: 'nina.wijaya@example.com',
        hobbies: 'Art, Music, Writing',
        maritalStatus: MaritalStatus.SINGLE,
        emergencyContactName: 'Rudi Wijaya',
        emergencyContactPhone: '+62-812-3456-7907',
        emergencyContactRelationship: 'Father',
        emergencyContactAddress:
          'Jl. Kebayoran No. 222, Jakarta, DKI Jakarta, 12120, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Young adult dealing with identity issues and social anxiety. Participating in individual therapy and art therapy sessions.',
      },
      // Hendra Kusuma - Terapintar
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Terapintar Clinic';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2018-015';
        }), // Hendra Prasetyo
        fullName: 'Hendra Kusuma',
        gender: Gender.MALE,
        birthPlace: 'Semarang',
        birthDate: new Date('1990-04-25'),
        religion: Religion.ISLAM,
        occupation: 'Teacher',
        education: Education.BACHELOR,
        educationMajor: 'Education',
        address:
          'Jl. Gatot Subroto No. 333, Jakarta, DKI Jakarta, 12930, Indonesia',
        phone: '+62-812-3456-7908',
        email: 'hendra.kusuma@example.com',
        hobbies: 'Teaching, Reading, Travel',
        maritalStatus: MaritalStatus.MARRIED,
        spouseName: 'Dewi Kusuma',
        relationshipWithSpouse: SpouseRelationship.GOOD,
        emergencyContactName: 'Dewi Kusuma',
        emergencyContactPhone: '+62-812-3456-7909',
        emergencyContactRelationship: 'Wife',
        emergencyContactAddress:
          'Jl. Gatot Subroto No. 333, Jakarta, DKI Jakarta, 12930, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Teacher experiencing burnout and work-related stress. Learning stress management and work-life balance techniques.',
      },
      // Lisa Chen - Terapintar
      {
        clinic: clinics.find(function (c) {
          return c.name === 'Terapintar Clinic';
        }),
        therapist: therapists.find(function (t) {
          return t.licenseNumber === 'PSI-2020-025';
        }), // Lisa Wijaya
        fullName: 'Lisa Chen',
        gender: Gender.FEMALE,
        birthPlace: 'Surabaya',
        birthDate: new Date('1994-09-18'),
        religion: Religion.CHRISTIANITY,
        occupation: 'Marketing Manager',
        education: Education.BACHELOR,
        educationMajor: 'Marketing',
        address: 'Jl. Sudirman No. 444, Jakarta, DKI Jakarta, 12190, Indonesia',
        phone: '+62-812-3456-7910',
        email: 'lisa.chen@example.com',
        hobbies: 'Shopping, Travel, Social Media',
        maritalStatus: MaritalStatus.SINGLE,
        emergencyContactName: 'Michael Chen',
        emergencyContactPhone: '+62-812-3456-7911',
        emergencyContactRelationship: 'Brother',
        emergencyContactAddress:
          'Jl. Sudirman No. 444, Jakarta, DKI Jakarta, 12190, Indonesia',
        status: ClientStatus.THERAPY,
        notes:
          'Young professional dealing with relationship issues and self-esteem problems. Participating in individual therapy and confidence-building exercises.',
      },
    ];

    for (const data of clientData) {
      if (!data.clinic || !data.therapist) {
        console.log(`⚠️ Skipping client data - clinic or therapist not found`);
        continue;
      }

      // Check if client already exists
      const existingClient = await em.findOne(Client, {
        fullName: data.fullName,
        email: data.email,
      });
      if (existingClient) {
        console.log(`Client ${data.fullName} already exists, skipping...`);
        continue;
      }

      // Create client
      const client = em.create(Client, {
        clinic: data.clinic,
        fullName: data.fullName,
        gender: data.gender,
        birthPlace: data.birthPlace,
        birthDate: data.birthDate,
        religion: data.religion,
        occupation: data.occupation,
        education: data.education,
        educationMajor: data.educationMajor,
        address: data.address,
        phone: data.phone,
        email: data.email,
        hobbies: data.hobbies,
        maritalStatus: data.maritalStatus,
        spouseName: data.spouseName,
        relationshipWithSpouse: data.relationshipWithSpouse,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelationship: data.emergencyContactRelationship,
        emergencyContactAddress: data.emergencyContactAddress,
        status: data.status,
        firstVisit: true,
        totalSessions: 0,
        progress: 0,
        notes: data.notes,
        isMinor: false,
        joinDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(client);

      console.log(`✅ Created client: ${data.fullName} (${data.email})`);
    }

    console.log('✅ Client seeding completed!');
  }
}
