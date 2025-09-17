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
import {
  CreateConsultationDto,
  CreateGeneralConsultationDto,
  CreateDrugAddictionConsultationDto,
  CreateMinorConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
} from './dto/create-consultation.dto';

export interface ConsultationResponse {
  id: string;
  client: {
    id: string;
    fullName: string;
    age?: number;
    gender: string;
  };
  formTypes: FormType[];
  status: ConsultationStatus;
  sessionDate: Date;
  sessionDuration: number;
  consultationNotes?: string;
  previousTherapyExperience: boolean;
  currentMedications: boolean;
  primaryConcern: string;
  symptomSeverity?: number;
  symptomDuration?: string;
  treatmentGoals?: string[];
  clientExpectations?: string;
  previousPsychologicalDiagnosis: boolean;
  significantPhysicalIllness: boolean;
  traumaticExperience: boolean;
  familyPsychologicalHistory: boolean;
  scriptGenerationPreferences?: string;
  generalFormData?: Record<string, any>;
  drugAddictionFormData?: Record<string, any>;
  minorFormData?: Record<string, any>;
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

    // Check if client already has a consultation (1:1 relationship)
    const existingConsultation = await this.em.findOne(Consultation, {
      client: createConsultationDto.clientId,
    });

    if (existingConsultation) {
      throw new BadRequestException(
        'Client already has a consultation. Only one consultation per client is allowed.',
      );
    }

    // Validate client status allows consultations
    if (client.status === ClientStatus.NEW) {
      throw new BadRequestException(
        'Client must be in ASSIGNED, CONSULTATION, or THERAPY status to create consultations',
      );
    }

    // Validate session date
    if (createConsultationDto.sessionDate) {
      const sessionDate = new Date(createConsultationDto.sessionDate);
      if (sessionDate > new Date()) {
        // If session is in the future, we can allow it
      } else if (sessionDate < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        // Don't allow consultations more than 7 days in the past
        throw new BadRequestException(
          'Session date cannot be more than 7 days in the past',
        );
      }
    }

    // Validate form-specific data based on form types
    // Validate form data based on form types
    this.validateFormDataByType(createConsultationDto);

    // Create consultation
    const consultation = new Consultation();
    consultation.client = client;
    consultation.formTypes = createConsultationDto.formTypes;
    consultation.status =
      createConsultationDto.status || ConsultationStatus.DRAFT;
    if (createConsultationDto.sessionDate) {
      consultation.sessionDate = new Date(createConsultationDto.sessionDate);
    }
    if (createConsultationDto.sessionDuration) {
      consultation.sessionDuration = createConsultationDto.sessionDuration;
    }
    consultation.consultationNotes = createConsultationDto.consultationNotes;
    consultation.previousTherapyExperience =
      createConsultationDto.previousTherapyExperience || false;
    consultation.currentMedications =
      createConsultationDto.currentMedications || false;
    if (createConsultationDto.primaryConcern) {
      consultation.primaryConcern = createConsultationDto.primaryConcern;
    }
    consultation.symptomSeverity = createConsultationDto.symptomSeverity;
    consultation.symptomDuration = createConsultationDto.symptomDuration;
    consultation.treatmentGoals = createConsultationDto.treatmentGoals;
    consultation.clientExpectations = createConsultationDto.clientExpectations;
    consultation.previousPsychologicalDiagnosis =
      createConsultationDto.previousPsychologicalDiagnosis || false;
    consultation.significantPhysicalIllness =
      createConsultationDto.significantPhysicalIllness || false;
    consultation.traumaticExperience =
      createConsultationDto.traumaticExperience || false;
    consultation.familyPsychologicalHistory =
      createConsultationDto.familyPsychologicalHistory || false;
    consultation.scriptGenerationPreferences =
      createConsultationDto.scriptGenerationPreferences;

    // Set separate form data columns
    consultation.generalFormData = createConsultationDto.generalFormData;
    consultation.drugAddictionFormData =
      createConsultationDto.drugAddictionFormData;
    consultation.minorFormData = createConsultationDto.minorFormData;

    await this.em.persistAndFlush(consultation);

    // Update client status to CONSULTATION if not already
    if (client.status === ClientStatus.ASSIGNED) {
      client.status = ClientStatus.CONSULTATION;
      await this.em.flush();
    }

    return this.formatConsultationResponse(consultation, client);
  }

  async findAll(
    query: ConsultationQueryDto,
    clinicId: string,
    userRole?: string,
    userId?: string,
  ): Promise<{
    consultations: ConsultationResponse[];
  }> {
    // Special case: if querying by clientId, return single consultation (1:1 relationship)
    if (query.clientId) {
      const consultation = await this.em.findOne(
        Consultation,
        {
          client: { id: query.clientId, clinic: { id: clinicId } },
        },
        {
          populate: ['client'],
        },
      );

      if (consultation) {
        return {
          consultations: [
            this.formatConsultationResponse(
              consultation,
              consultation.client,
            ),
          ],
        };
      } else {
        return {
          consultations: [],
        };
      }
    }

    // Build filter conditions
    const whereConditions: any = { client: { clinic: { id: clinicId } } };

    // Role-based filtering - no longer needed since we removed therapist relationships

    // Apply filters - only clientId is supported now
    if (query.clientId) {
      whereConditions.client = query.clientId;
    }

    // Apply sorting (no pagination needed for 1:1 relationship)
    const orderBy = {
      sessionDate: QueryOrder.DESC,
      createdAt: QueryOrder.DESC,
    };

    const consultations = await this.em.find(
      Consultation,
      whereConditions,
      {
        populate: ['client'],
        orderBy,
      },
    );

    const formattedConsultations = consultations.map((consultation) => {
      return this.formatConsultationResponse(
        consultation,
        consultation.client,
      );
    });

    return {
      consultations: formattedConsultations,
    };
  }

  async findOne(id: string, clinicId: string): Promise<ConsultationResponse> {
    const consultation = await this.em.findOne(
      Consultation,
      { id, client: { clinic: { id: clinicId } } },
      {
        populate: ['client'],
      },
    );

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }

    return this.formatConsultationResponse(
      consultation,
      consultation.client,
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
        populate: ['client'],
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
    if (
      updateConsultationDto.generalFormData ||
      updateConsultationDto.drugAddictionFormData ||
      updateConsultationDto.minorFormData
    ) {
      this.validateFormDataByType(updateConsultationDto);
    }

    // Update consultation
    wrap(consultation).assign(updateConsultationDto);
    await this.em.flush();

    return this.formatConsultationResponse(
      consultation,
      consultation.client,
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
        populate: ['client'],
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

    // Role-based filtering - no longer needed since we removed therapist relationships

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
        consultation.formTypes.forEach((formType) => {
          acc[formType] = (acc[formType] || 0) + 1;
        });
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

  private validateFormDataByType(
    dto:
      | CreateConsultationDto
      | CreateGeneralConsultationDto
      | CreateDrugAddictionConsultationDto
      | CreateMinorConsultationDto
      | UpdateConsultationDto,
  ): void {
    // Validate form data based on form types
    const formTypes = 'formTypes' in dto ? dto.formTypes : [];
    for (const formType of formTypes) {
      switch (formType) {
        case FormType.DRUG_ADDICTION:
          // Validate drug addiction specific fields
          if (dto.drugAddictionFormData) {
            const data = dto.drugAddictionFormData;
            if (
              data.firstUseAge &&
              (data.firstUseAge < 5 || data.firstUseAge > 80)
            ) {
              throw new BadRequestException(
                'First use age must be between 5 and 80',
              );
            }
            if (
              data.motivationToQuit &&
              (data.motivationToQuit < 1 || data.motivationToQuit > 10)
            ) {
              throw new BadRequestException(
                'Motivation to quit must be between 1 and 10',
              );
            }
          }
          break;
        case FormType.MINOR:
          // Validate minor-specific fields
          if (dto.minorFormData) {
            const data = dto.minorFormData;
            // Add minor-specific validations here if needed
          }
          break;
        case FormType.GENERAL:
          // Validate general form fields
          if (dto.generalFormData) {
            const data = dto.generalFormData;
            if (
              data.stressLevel &&
              (data.stressLevel < 1 || data.stressLevel > 10)
            ) {
              throw new BadRequestException(
                'Stress level must be between 1 and 10',
              );
            }
          }
          break;
      }
    }
  }

  private formatConsultationResponse(
    consultation: Consultation,
    client: Client,
  ): ConsultationResponse {
    return {
      id: consultation.id,
      client: {
        id: client.id,
        fullName: client.fullName,
        age: client.age,
        gender: client.gender,
      },
      formTypes: consultation.formTypes,
      status: consultation.status,
      sessionDate: consultation.sessionDate,
      sessionDuration: consultation.sessionDuration,
      consultationNotes: consultation.consultationNotes,
      previousTherapyExperience: consultation.previousTherapyExperience,
      currentMedications: consultation.currentMedications,
      primaryConcern: consultation.primaryConcern,
      symptomSeverity: consultation.symptomSeverity,
      symptomDuration: consultation.symptomDuration,
      treatmentGoals: consultation.treatmentGoals,
      clientExpectations: consultation.clientExpectations,
      previousPsychologicalDiagnosis:
        consultation.previousPsychologicalDiagnosis,
      significantPhysicalIllness: consultation.significantPhysicalIllness,
      traumaticExperience: consultation.traumaticExperience,
      familyPsychologicalHistory: consultation.familyPsychologicalHistory,
      scriptGenerationPreferences: consultation.scriptGenerationPreferences,
      generalFormData: consultation.generalFormData,
      drugAddictionFormData: consultation.drugAddictionFormData,
      minorFormData: consultation.minorFormData,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
    };
  }
}
