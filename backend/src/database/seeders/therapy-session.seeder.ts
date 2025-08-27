import { EntityManager } from '@mikro-orm/core';
import { TherapySession, SessionStatus } from '../entities/therapy-session.entity';
import { Client } from '../entities/client.entity';
import { Therapist } from '../entities/therapist.entity';
import { Clinic } from '../entities/clinic.entity';

export class TherapySessionSeeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Seeding therapy sessions...');

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

    const sessionData = [
      // Sari Dewi - Anxiety Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'Sari Dewi'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2023-001'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'individual',
        modality: 'cbt',
        status: 'completed',
        scheduledAt: new Date('2024-01-22T10:00:00Z'),
        duration: 60,
        notes: 'CBT session focusing on anxiety management techniques. Client practiced breathing exercises and cognitive restructuring.',
        progress: 25,
        homework: 'Practice breathing exercises daily. Complete thought record worksheet.',
        nextSessionDate: new Date('2024-01-29T10:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Sari Dewi'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2023-001'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'individual',
        modality: 'cbt',
        status: 'completed',
        scheduledAt: new Date('2024-01-29T10:00:00Z'),
        duration: 60,
        notes: 'Second CBT session. Client showing improvement in anxiety management. Introduced exposure therapy techniques.',
        progress: 40,
        homework: 'Continue exposure exercises. Practice relaxation techniques.',
        nextSessionDate: new Date('2024-02-05T10:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Sari Dewi'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2023-001'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'individual',
        modality: 'cbt',
        status: 'scheduled',
        scheduledAt: new Date('2024-02-05T10:00:00Z'),
        duration: 60,
        notes: 'Scheduled CBT session to continue anxiety treatment and progress review.',
        progress: null,
        homework: null,
        nextSessionDate: new Date('2024-02-12T10:00:00Z')
      },
      // Andi Kusuma - Stress Management Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'Andi Kusuma'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'individual',
        modality: 'stress_management',
        status: 'completed',
        scheduledAt: new Date('2024-02-08T14:00:00Z'),
        duration: 60,
        notes: 'Stress management session focusing on work-life balance and time management techniques.',
        progress: 30,
        homework: 'Implement time management strategies. Practice mindfulness exercises.',
        nextSessionDate: new Date('2024-02-15T14:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Andi Kusuma'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'individual',
        modality: 'stress_management',
        status: 'scheduled',
        scheduledAt: new Date('2024-02-15T14:00:00Z'),
        duration: 60,
        notes: 'Scheduled stress management session to review progress and continue treatment.',
        progress: null,
        homework: null,
        nextSessionDate: new Date('2024-02-22T14:00:00Z')
      },
      // Rina Putri - Family Therapy Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'Rina Putri'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2014-008'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'family',
        modality: 'family_therapy',
        status: 'completed',
        scheduledAt: new Date('2024-01-27T11:00:00Z'),
        duration: 90,
        notes: 'Family therapy session with spouse present. Focused on communication and conflict resolution.',
        progress: 20,
        homework: 'Practice active listening techniques. Schedule family meetings.',
        nextSessionDate: new Date('2024-02-03T11:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Rina Putri'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2014-008'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'family',
        modality: 'family_therapy',
        status: 'scheduled',
        scheduledAt: new Date('2024-02-03T11:00:00Z'),
        duration: 90,
        notes: 'Scheduled family therapy session to continue work on family dynamics.',
        progress: null,
        homework: null,
        nextSessionDate: new Date('2024-02-10T11:00:00Z')
      },
      // David Chen - Addiction Recovery Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'David Chen'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2010-005'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'individual',
        modality: 'addiction_recovery',
        status: 'completed',
        scheduledAt: new Date('2024-03-02T15:00:00Z'),
        duration: 60,
        notes: 'Addiction recovery session following relapse. Focused on relapse prevention strategies.',
        progress: 15,
        homework: 'Attend daily support group meetings. Practice coping skills.',
        nextSessionDate: new Date('2024-03-09T15:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'David Chen'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2010-005'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'individual',
        modality: 'addiction_recovery',
        status: 'scheduled',
        scheduledAt: new Date('2024-03-09T15:00:00Z'),
        duration: 60,
        notes: 'Scheduled addiction recovery session to continue treatment and support.',
        progress: null,
        homework: null,
        nextSessionDate: new Date('2024-03-16T15:00:00Z')
      },
      // Nina Wijaya - ADHD Support Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'Nina Wijaya'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2016-012'; }),
        clinic: clinics.find(function(c) { return c.name === 'Klinik Sehat'; }),
        type: 'individual',
        modality: 'adhd_support',
        status: 'completed',
        scheduledAt: new Date('2024-02-15T13:00:00Z'),
        duration: 60,
        notes: 'ADHD support session focusing on academic strategies and organization skills.',
        progress: 35,
        homework: 'Use organizational tools. Practice time management techniques.',
        nextSessionDate: new Date('2024-02-22T13:00:00Z')
      },
      // Budi Santoso - Gambling Addiction Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'Budi Santoso'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2018-015'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'individual',
        modality: 'addiction_recovery',
        status: 'completed',
        scheduledAt: new Date('2024-03-10T15:00:00Z'),
        duration: 60,
        notes: 'Gambling addiction treatment session. Client showing commitment to recovery program.',
        progress: 35,
        homework: 'Avoid gambling triggers. Practice financial management skills.',
        nextSessionDate: new Date('2024-03-17T15:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Budi Santoso'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2018-015'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'individual',
        modality: 'addiction_recovery',
        status: 'scheduled',
        scheduledAt: new Date('2024-03-17T15:00:00Z'),
        duration: 60,
        notes: 'Scheduled gambling addiction treatment progress review session.',
        progress: null,
        homework: null,
        nextSessionDate: new Date('2024-03-24T15:00:00Z')
      },
      // Maya Sari - Panic Disorder Sessions
      {
        client: clients.find(function(c) { return c.fullName === 'Maya Sari'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'individual',
        modality: 'exposure_therapy',
        status: 'completed',
        scheduledAt: new Date('2024-02-20T11:00:00Z'),
        duration: 60,
        notes: 'Exposure therapy session for panic disorder and agoraphobia. Client practiced gradual exposure techniques.',
        progress: 20,
        homework: 'Practice exposure exercises daily. Use breathing techniques during panic attacks.',
        nextSessionDate: new Date('2024-02-27T11:00:00Z')
      },
      {
        client: clients.find(function(c) { return c.fullName === 'Maya Sari'; }),
        therapist: therapists.find(function(t) { return t.licenseNumber === 'PSI-2020-025'; }),
        clinic: clinics.find(function(c) { return c.name === 'Terapintar Clinic'; }),
        type: 'individual',
        modality: 'exposure_therapy',
        status: 'scheduled',
        scheduledAt: new Date('2024-02-27T11:00:00Z'),
        duration: 60,
        notes: 'Scheduled exposure therapy session to continue work on panic disorder and agoraphobia.',
        progress: null,
        homework: null,
        nextSessionDate: new Date('2024-03-05T11:00:00Z')
      }
    ];

    for (const data of sessionData) {
      if (!data.client || !data.therapist || !data.clinic) {
        console.log(`⚠️ Skipping session data - client, therapist, or clinic not found`);
        continue;
      }

      // Check if session already exists
      const existingSession = await em.findOne(TherapySession, {
        client: data.client,
        therapist: data.therapist,
        sessionDate: data.scheduledAt
      });

      if (existingSession) {
        console.log(`Session for ${data.client.fullName} at ${data.scheduledAt} already exists, skipping...`);
        continue;
      }

      // Create therapy session
      const session = em.create(TherapySession, {
        client: data.client,
        therapist: data.therapist,
        sessionNumber: 1,
        title: `${data.modality} Session`,
        description: data.notes,
        sessionDate: data.scheduledAt,
        sessionTime: '14:00',
        duration: data.duration,
        status: SessionStatus.COMPLETED,
        notes: data.notes,
        progress: data.progress ? data.progress.toString() : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await em.persistAndFlush(session);

      console.log(`✅ Created therapy session: ${data.client.fullName} with ${data.therapist.licenseNumber} (${data.modality})`);
    }

    console.log('✅ Therapy session seeding completed!');
  }
}
