import { EntityManager } from '@mikro-orm/core';
import {
  Consultation,
  ConsultationStatus,
  FormType,
} from '../entities/consultation.entity';
import { Client } from '../entities/client.entity';
import { Therapist } from '../entities/therapist.entity';
import { Clinic } from '../entities/clinic.entity';

export class ConsultationSeeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Seeding consultations...');

    const clients = await em.find(Client, {});
    const therapists = await em.find(Therapist, {});
    const clinics = await em.find(Clinic, {});

    if (clients.length === 0) {
      console.log('⚠️ No clients found. Please run client seeder first.');
      return;
    }

    if (therapists.length === 0) {
      console.log('⚠️ No therapists found. Please run therapist seeder first.');
      return;
    }

    const consultationData = [
      // Initial consultations
      {
        client: clients.find(function(c) { return c.fullName === 'Sari Dewi'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2023-001'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'initial',
        status: 'completed',
        scheduledAt: new Date('2024-01-15T10:00:00Z'),
        duration: 60,
        notes:
          'Initial consultation for anxiety and academic stress. Client shows symptoms of generalized anxiety disorder.',
        outcome: 'Recommended CBT sessions twice a week for 8 weeks.',
        followUpDate: new Date('2024-01-22T10:00:00Z'),
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Andi Kusuma'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'initial',
        status: 'completed',
        scheduledAt: new Date('2024-02-01T14:00:00Z'),
        duration: 60,
        notes:
          'Initial consultation for work-related stress and burnout. Client experiencing high levels of stress at work.',
        outcome:
          'Recommended stress management techniques and weekly therapy sessions.',
        followUpDate: new Date('2024-02-08T14:00:00Z'),
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Rina Putri'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2014-008'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'initial',
        status: 'completed',
        scheduledAt: new Date('2024-01-20T11:00:00Z'),
        duration: 60,
        notes:
          'Initial consultation for parenting challenges and family dynamics. Client seeking help with family therapy.',
        outcome: 'Recommended family therapy sessions and parenting support.',
        followUpDate: new Date('2024-01-27T11:00:00Z'),
      },
      // Follow-up consultations
      {
        client: clients.find(function(c) { return c.fullName === 'Sari Dewi'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2023-001'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'follow_up',
        status: 'completed',
        scheduledAt: new Date('2024-01-22T10:00:00Z'),
        duration: 45,
        notes:
          'Follow-up consultation. Client showing improvement with anxiety management techniques.',
        outcome: 'Continue CBT sessions. Client responding well to treatment.',
        followUpDate: new Date('2024-01-29T10:00:00Z'),
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Andi Kusuma'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'follow_up',
        status: 'completed',
        scheduledAt: new Date('2024-02-08T14:00:00Z'),
        duration: 45,
        notes:
          'Follow-up consultation. Client implementing stress management techniques at work.',
        outcome:
          'Good progress. Continue weekly sessions and stress management practice.',
        followUpDate: new Date('2024-02-15T14:00:00Z'),
      },
      // Emergency consultations
      {
        client: clients.find(function(c) { return c.fullName === 'David Chen'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2010-005'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'emergency',
        status: 'completed',
        scheduledAt: new Date('2024-03-01T16:00:00Z'),
        duration: 90,
        notes:
          'Emergency consultation for substance abuse relapse. Client needs immediate support.',
        outcome:
          'Intensive outpatient program recommended. Daily check-ins for first week.',
        followUpDate: new Date('2024-03-02T10:00:00Z'),
      },
      // Scheduled consultations
      {
        client: clients.find(function(c) { return c.fullName === 'Nina Wijaya'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2016-012'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'scheduled',
        status: 'scheduled',
        scheduledAt: new Date('2024-03-20T13:00:00Z'),
        duration: 60,
        notes:
          'Scheduled consultation for ADHD assessment and academic support planning.',
        outcome: null,
        followUpDate: null,
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Budi Santoso'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2018-015'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'scheduled',
        status: 'scheduled',
        scheduledAt: new Date('2024-03-21T15:00:00Z'),
        duration: 60,
        notes:
          'Scheduled consultation for gambling addiction treatment progress review.',
        outcome: null,
        followUpDate: null,
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Maya Sari'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'scheduled',
        status: 'scheduled',
        scheduledAt: new Date('2024-03-22T11:00:00Z'),
        duration: 60,
        notes:
          'Scheduled consultation for panic disorder and agoraphobia treatment.',
        outcome: null,
        followUpDate: null,
      },
    ];

    for (const data of consultationData) {
      if (!data.client || !data.therapist || !data.clinic) {
        console.log(`⚠️ Skipping consultation data - client, therapist, or clinic not found`);
        continue;
      }

      // Check if consultation already exists
      const existingConsultation = await em.findOne(Consultation, {
        client: data.client,
        therapist: data.therapist,
        sessionDate: data.scheduledAt,
      });

      if (existingConsultation) {
        console.log(`Consultation for ${data.client.fullName} at ${data.scheduledAt} already exists, skipping...`);
        continue;
      }

      // Create consultation
      const consultation = em.create(Consultation, {
        client: data.client,
        therapist: data.therapist,
        formType: FormType.GENERAL,
        status: ConsultationStatus.COMPLETED,
        sessionDate: data.scheduledAt,
        sessionDuration: data.duration,
        consultationNotes: data.notes,
        primaryConcern: data.notes || 'General consultation',
        previousTherapyExperience: false,
        currentMedications: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await em.persistAndFlush(consultation);

      console.log(`✅ Created consultation: ${data.client.fullName} with ${data.therapist.licenseNumber} (${data.type})`);
    }

    console.log('✅ Consultation seeding completed!');
  }
}
