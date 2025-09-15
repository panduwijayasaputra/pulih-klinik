import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, QueryOrder, wrap } from '@mikro-orm/core';
import {
  Consultation,
  ConsultationStatus,
  FormType,
} from '../database/entities/consultation.entity';
import { Client, ClientStatus } from '../database/entities/client.entity';
import { Therapist } from '../database/entities/therapist.entity';
import {
  ClientTherapistAssignment,
  AssignmentStatus,
} from '../database/entities/client-therapist-assignment.entity';
import {
  CreateConsultationDto,
  CreateGeneralConsultationDto,
  CreateDrugAddictionConsultationDto,
  CreateMinorConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
} from './dto/create-consultation.dto';
import { UserStatus } from 'src/common/enums';

export interface ConsultationResponse {
  id: string;
  client: {
    id: string;
    fullName: string;
    age?: number;
    gender: string;
  };
  therapist: {
    id: string;
    user: {
      fullName: string;
      email: string;
    };
  };
  formType: FormType;
  status: ConsultationStatus;
  sessionDate: Date;
  sessionDuration: number;
  consultationNotes?: string;
  previousTherapyExperience: boolean;
  previousTherapyDetails?: string;
  currentMedications: boolean;
  currentMedicationsDetails?: string;
  primaryConcern: string;
  secondaryConcerns?: string[];
  symptomSeverity?: number;
  symptomDuration?: string;
  treatmentGoals?: string[];
  clientExpectations?: string;
  initialAssessment?: string;
  recommendedTreatmentPlan?: string;
  formData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultationStatsResponse {
  totalConsultations: number;
  consultationsByStatus: Record<ConsultationStatus, number>;
  consultationsByFormType: Record<FormType, number>;
  averageDuration: number;
  completionRate: number;
  activeConsultations: number;
  commonConcerns: Array<{
    concern: string;
    count: number;
  }>;
  averageSymptomSeverity: number;
}

@Injectable()
export class ConsultationsService {
  constructor(private readonly em: EntityManager) {}

  async create(
    createConsultationDto:
      | CreateConsultationDto
      | CreateGeneralConsultationDto
      | CreateDrugAddictionConsultationDto
      | CreateMinorConsultationDto,
    clinicId: string,
  ): Promise<ConsultationResponse> {
    // Validate client exists and belongs to clinic
    const client = await this.em.findOne(Client, {
      id: createConsultationDto.clientId,
      clinic: clinicId,
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${createConsultationDto.clientId} not found in your clinic`,
      );
    }

    // Validate therapist exists and belongs to clinic
    const therapist = await this.em.findOne(
      Therapist,
      {
        id: createConsultationDto.therapistId,
        user: { clinic: { id: clinicId }, status: UserStatus.ACTIVE },
      },
      { populate: ['user', 'user.profile'] },
    );

    if (!therapist) {
      throw new NotFoundException(
        `Active therapist with ID ${createConsultationDto.therapistId} not found in your clinic`,
      );
    }

    // Check if client is assigned to therapist
    const assignment = await this.em.findOne(ClientTherapistAssignment, {
      client: createConsultationDto.clientId,
      therapist: createConsultationDto.therapistId,
      status: AssignmentStatus.ACTIVE,
    });

    if (!assignment) {
      throw new BadRequestException(
        'Client must be assigned to therapist before creating consultations',
      );
    }

    // Validate client status allows consultations
    if (client.status === ClientStatus.NEW) {
      throw new BadRequestException(
        'Client must be in ASSIGNED, CONSULTATION, or THERAPY status to create consultations',
      );
    }

    // Validate session date
    const sessionDate = new Date(createConsultationDto.sessionDate);
    if (sessionDate > new Date()) {
      // If session is in the future, we can allow it
    } else if (sessionDate < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      // Don't allow consultations more than 7 days in the past
      throw new BadRequestException(
        'Session date cannot be more than 7 days in the past',
      );
    }

    // Validate form-specific data based on form type
    this.validateFormData(
      createConsultationDto.formType,
      createConsultationDto.formData,
    );

    // Create consultation
    const consultation = new Consultation();
    consultation.client = client;
    consultation.therapist = therapist;
    consultation.formType = createConsultationDto.formType;
    consultation.status =
      createConsultationDto.status || ConsultationStatus.DRAFT;
    consultation.sessionDate = new Date(createConsultationDto.sessionDate);
    consultation.sessionDuration = createConsultationDto.sessionDuration;
    consultation.consultationNotes = createConsultationDto.consultationNotes;
    consultation.previousTherapyExperience =
      createConsultationDto.previousTherapyExperience || false;
    consultation.previousTherapyDetails =
      createConsultationDto.previousTherapyDetails;
    consultation.currentMedications =
      createConsultationDto.currentMedications || false;
    consultation.currentMedicationsDetails =
      createConsultationDto.currentMedicationsDetails;
    consultation.primaryConcern = createConsultationDto.primaryConcern;
    consultation.secondaryConcerns = createConsultationDto.secondaryConcerns;
    consultation.symptomSeverity = createConsultationDto.symptomSeverity;
    consultation.symptomDuration = createConsultationDto.symptomDuration;
    consultation.treatmentGoals = createConsultationDto.treatmentGoals;
    consultation.clientExpectations = createConsultationDto.clientExpectations;
    consultation.initialAssessment = createConsultationDto.initialAssessment;
    consultation.recommendedTreatmentPlan =
      createConsultationDto.recommendedTreatmentPlan;
    consultation.formData = createConsultationDto.formData;

    await this.em.persistAndFlush(consultation);

    // Update client status to CONSULTATION if not already
    if (client.status === ClientStatus.ASSIGNED) {
      client.status = ClientStatus.CONSULTATION;
      await this.em.flush();
    }

    return this.formatConsultationResponse(consultation, client, therapist);
  }

  async findAll(
    query: ConsultationQueryDto,
    clinicId: string,
    userRole?: string,
    userId?: string,
  ): Promise<{
    consultations: ConsultationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build filter conditions
    const whereConditions: any = { client: { clinic: { id: clinicId } } };

    // Role-based filtering
    if (userRole === 'Therapist' && userId) {
      const therapist = await this.em.findOne(Therapist, { user: userId });
      if (therapist) {
        whereConditions.therapist = therapist.id;
      }
    }

    // Apply filters
    if (query.clientId) {
      whereConditions.client = query.clientId;
    }

    if (query.therapistId) {
      whereConditions.therapist = query.therapistId;
    }

    if (query.formType) {
      whereConditions.formType = query.formType;
    }

    if (query.status) {
      whereConditions.status = query.status;
    }

    if (query.dateFrom) {
      whereConditions.sessionDate = { $gte: new Date(query.dateFrom) };
    }

    if (query.dateTo) {
      if (whereConditions.sessionDate) {
        whereConditions.sessionDate.$lte = new Date(query.dateTo);
      } else {
        whereConditions.sessionDate = { $lte: new Date(query.dateTo) };
      }
    }

    if (query.search) {
      whereConditions.$or = [
        { consultationNotes: { $ilike: `%${query.search}%` } },
        { primaryConcern: { $ilike: `%${query.search}%` } },
        { initialAssessment: { $ilike: `%${query.search}%` } },
      ];
    }

    // Apply pagination and sorting
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const orderBy = {
      sessionDate: QueryOrder.DESC,
      createdAt: QueryOrder.DESC,
    };

    const [consultations, total] = await this.em.findAndCount(
      Consultation,
      whereConditions,
      {
        populate: ['client', 'therapist', 'therapist.user'],
        orderBy,
        limit,
        offset,
      },
    );

    const formattedConsultations = consultations.map((consultation) => {
      return this.formatConsultationResponse(
        consultation,
        consultation.client,
        consultation.therapist,
      );
    });

    return {
      consultations: formattedConsultations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, clinicId: string): Promise<ConsultationResponse> {
    const consultation = await this.em.findOne(
      Consultation,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: ['client', 'therapist', 'therapist.user'],
      },
    );

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }

    return this.formatConsultationResponse(
      consultation,
      consultation.client,
      consultation.therapist,
    );
  }

  async update(
    id: string,
    updateConsultationDto: UpdateConsultationDto,
    clinicId: string,
  ): Promise<ConsultationResponse> {
    const consultation = await this.em.findOne(
      Consultation,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: ['client', 'therapist', 'therapist.user'],
      },
    );

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }

    // Don't allow updates to completed/archived consultations
    if (
      consultation.status === ConsultationStatus.COMPLETED ||
      consultation.status === ConsultationStatus.ARCHIVED
    ) {
      throw new BadRequestException(
        'Cannot update completed or archived consultations',
      );
    }

    // Validate status transitions
    if (
      updateConsultationDto.status &&
      updateConsultationDto.status !== consultation.status
    ) {
      this.validateStatusTransition(
        consultation.status,
        updateConsultationDto.status,
      );
    }

    // Validate form data if being updated
    if (updateConsultationDto.formData) {
      this.validateFormData(
        consultation.formType,
        updateConsultationDto.formData,
      );
    }

    // Update consultation
    wrap(consultation).assign(updateConsultationDto);
    await this.em.flush();

    return this.formatConsultationResponse(
      consultation,
      consultation.client,
      consultation.therapist,
    );
  }

  async updateStatus(
    id: string,
    status: ConsultationStatus,
    clinicId: string,
  ): Promise<ConsultationResponse> {
    const consultation = await this.em.findOne(
      Consultation,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: ['client', 'therapist', 'therapist.user'],
      },
    );

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }

    // Validate status transition
    this.validateStatusTransition(consultation.status, status);

    // Update status
    consultation.status = status;
    await this.em.flush();

    return this.formatConsultationResponse(
      consultation,
      consultation.client,
      consultation.therapist,
    );
  }

  async remove(id: string, clinicId: string): Promise<void> {
    const consultation = await this.em.findOne(Consultation, {
      id,
      client: { clinic: { id: clinicId } },
    });

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }

    // Only allow deletion if consultation is not completed
    if (consultation.status === ConsultationStatus.COMPLETED) {
      throw new BadRequestException('Cannot delete completed consultations');
    }

    await this.em.removeAndFlush(consultation);
  }

  async getStatistics(
    clinicId: string,
    userRole?: string,
    userId?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ConsultationStatsResponse> {
    // Build filter conditions
    const whereConditions: any = { client: { clinic: { id: clinicId } } };

    // Role-based filtering
    if (userRole === 'Therapist' && userId) {
      const therapist = await this.em.findOne(Therapist, { user: userId });
      if (therapist) {
        whereConditions.therapist = therapist.id;
      }
    }

    // Apply date filters
    if (dateFrom) {
      whereConditions.sessionDate = { $gte: new Date(dateFrom) };
    }

    if (dateTo) {
      if (whereConditions.sessionDate) {
        whereConditions.sessionDate.$lte = new Date(dateTo);
      } else {
        whereConditions.sessionDate = { $lte: new Date(dateTo) };
      }
    }

    const consultations = await this.em.find(Consultation, whereConditions);

    // Calculate statistics
    const totalConsultations = consultations.length;

    const consultationsByStatus = consultations.reduce(
      (acc, consultation) => {
        acc[consultation.status] = (acc[consultation.status] || 0) + 1;
        return acc;
      },
      {} as Record<ConsultationStatus, number>,
    );

    const consultationsByFormType = consultations.reduce(
      (acc, consultation) => {
        acc[consultation.formType] = (acc[consultation.formType] || 0) + 1;
        return acc;
      },
      {} as Record<FormType, number>,
    );

    const completedConsultations =
      consultationsByStatus[ConsultationStatus.COMPLETED] || 0;
    const averageDuration =
      consultations.length > 0
        ? consultations.reduce((sum, c) => sum + c.sessionDuration, 0) /
          consultations.length
        : 0;

    const completionRate =
      totalConsultations > 0
        ? (completedConsultations / totalConsultations) * 100
        : 0;

    const activeConsultations =
      (consultationsByStatus[ConsultationStatus.DRAFT] || 0) +
      (consultationsByStatus[ConsultationStatus.IN_PROGRESS] || 0);

    // Analyze common concerns
    const concernCount: Record<string, number> = {};
    consultations.forEach((consultation) => {
      if (consultation.primaryConcern) {
        // Extract keywords from primary concern
        const keywords = consultation.primaryConcern
          .toLowerCase()
          .split(/[\s,.-]+/)
          .filter((word) => word.length > 3);

        keywords.forEach((keyword) => {
          concernCount[keyword] = (concernCount[keyword] || 0) + 1;
        });
      }

      consultation.secondaryConcerns?.forEach((concern) => {
        concernCount[concern.toLowerCase()] =
          (concernCount[concern.toLowerCase()] || 0) + 1;
      });
    });

    const commonConcerns = Object.entries(concernCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([concern, count]) => ({ concern, count }));

    // Calculate average symptom severity
    const severitySum = consultations
      .filter((c) => c.symptomSeverity)
      .reduce((sum, c) => sum + (c.symptomSeverity || 0), 0);
    const severityCount = consultations.filter((c) => c.symptomSeverity).length;
    const averageSymptomSeverity =
      severityCount > 0 ? severitySum / severityCount : 0;

    return {
      totalConsultations,
      consultationsByStatus,
      consultationsByFormType,
      averageDuration: Math.round(averageDuration),
      completionRate: Math.round(completionRate * 100) / 100,
      activeConsultations,
      commonConcerns,
      averageSymptomSeverity: Math.round(averageSymptomSeverity * 100) / 100,
    };
  }

  private validateStatusTransition(
    currentStatus: ConsultationStatus,
    newStatus: ConsultationStatus,
  ): void {
    const validTransitions: Record<ConsultationStatus, ConsultationStatus[]> = {
      [ConsultationStatus.DRAFT]: [ConsultationStatus.IN_PROGRESS],
      [ConsultationStatus.IN_PROGRESS]: [
        ConsultationStatus.COMPLETED,
        ConsultationStatus.DRAFT,
      ],
      [ConsultationStatus.COMPLETED]: [ConsultationStatus.ARCHIVED],
      [ConsultationStatus.ARCHIVED]: [], // Cannot change from archived
    };

    const allowedStatuses = validTransitions[currentStatus] || [];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedStatuses.join(', ')}`,
      );
    }
  }

  private validateFormData(
    formType: FormType,
    formData?: Record<string, any>,
  ): void {
    if (!formData) return;

    // Basic validation based on form type
    switch (formType) {
      case FormType.DRUG_ADDICTION:
        // Validate drug addiction specific fields
        if (
          formData.firstUseAge &&
          (formData.firstUseAge < 5 || formData.firstUseAge > 80)
        ) {
          throw new BadRequestException(
            'First use age must be between 5 and 80',
          );
        }
        if (
          formData.motivationToQuit &&
          (formData.motivationToQuit < 1 || formData.motivationToQuit > 10)
        ) {
          throw new BadRequestException(
            'Motivation to quit must be between 1 and 10',
          );
        }
        break;
      case FormType.MINOR:
        // Validate minor-specific fields
        if (formData.grade && typeof formData.grade !== 'string') {
          throw new BadRequestException('Grade must be a string');
        }
        if (
          formData.guardianName &&
          typeof formData.guardianName !== 'string'
        ) {
          throw new BadRequestException('Guardian name must be a string');
        }
        break;
      case FormType.GENERAL:
        // Validate general form fields
        if (
          formData.stressLevel &&
          (formData.stressLevel < 1 || formData.stressLevel > 10)
        ) {
          throw new BadRequestException(
            'Stress level must be between 1 and 10',
          );
        }
        break;
    }
  }

  private formatConsultationResponse(
    consultation: Consultation,
    client: Client,
    therapist: Therapist,
  ): ConsultationResponse {
    return {
      id: consultation.id,
      client: {
        id: client.id,
        fullName: client.fullName,
        age: client.age,
        gender: client.gender,
      },
      therapist: {
        id: therapist.id,
        user: {
          fullName: therapist.user.profile?.name || 'Unknown User',
          email: therapist.user.email,
        },
      },
      formType: consultation.formType,
      status: consultation.status,
      sessionDate: consultation.sessionDate,
      sessionDuration: consultation.sessionDuration,
      consultationNotes: consultation.consultationNotes,
      previousTherapyExperience: consultation.previousTherapyExperience,
      previousTherapyDetails: consultation.previousTherapyDetails,
      currentMedications: consultation.currentMedications,
      currentMedicationsDetails: consultation.currentMedicationsDetails,
      primaryConcern: consultation.primaryConcern,
      secondaryConcerns: consultation.secondaryConcerns,
      symptomSeverity: consultation.symptomSeverity,
      symptomDuration: consultation.symptomDuration,
      treatmentGoals: consultation.treatmentGoals,
      clientExpectations: consultation.clientExpectations,
      initialAssessment: consultation.initialAssessment,
      recommendedTreatmentPlan: consultation.recommendedTreatmentPlan,
      formData: consultation.formData,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
    };
  }
}
