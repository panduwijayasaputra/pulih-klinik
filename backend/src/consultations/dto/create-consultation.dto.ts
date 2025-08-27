import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  Length,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FormType,
  ConsultationStatus,
} from '../../database/entities/consultation.entity';

export class CreateConsultationDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'Client ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Client ID is required' })
  clientId!: string;

  @ApiProperty({
    description: 'Therapist ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID(4, { message: 'Therapist ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Therapist ID is required' })
  therapistId!: string;

  @ApiProperty({
    description: 'Type of consultation form',
    enum: FormType,
    example: FormType.GENERAL,
  })
  @IsEnum(FormType, {
    message: 'Form type must be a valid consultation form type',
  })
  formType!: FormType;

  @ApiPropertyOptional({
    description: 'Initial consultation status',
    enum: ConsultationStatus,
    default: ConsultationStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ConsultationStatus, {
    message: 'Status must be a valid consultation status',
  })
  status?: ConsultationStatus = ConsultationStatus.DRAFT;

  @ApiProperty({
    description: 'Session date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @IsDateString(
    {},
    { message: 'Session date must be a valid date string (YYYY-MM-DD)' },
  )
  sessionDate!: string;

  @ApiProperty({
    description: 'Session duration in minutes',
    example: 90,
    minimum: 30,
    maximum: 300,
  })
  @IsInt({ message: 'Session duration must be an integer' })
  @Min(30, { message: 'Session duration must be at least 30 minutes' })
  @Max(300, { message: 'Session duration cannot exceed 300 minutes (5 hours)' })
  sessionDuration!: number;

  @ApiPropertyOptional({
    description: 'General consultation notes',
    example:
      'Initial consultation to assess client needs and establish therapeutic goals',
  })
  @IsOptional()
  @IsString({ message: 'Consultation notes must be a string' })
  @Length(0, 2000, {
    message: 'Consultation notes cannot exceed 2000 characters',
  })
  consultationNotes?: string;

  // Client Background
  @ApiPropertyOptional({
    description: 'Whether client has previous therapy experience',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Previous therapy experience must be a boolean' })
  previousTherapyExperience?: boolean = false;

  @ApiPropertyOptional({
    description: 'Details about previous therapy experience',
    example: 'Attended CBT sessions for 6 months in 2022',
  })
  @IsOptional()
  @IsString({ message: 'Previous therapy details must be a string' })
  @Length(0, 1000, {
    message: 'Previous therapy details cannot exceed 1000 characters',
  })
  previousTherapyDetails?: string;

  @ApiPropertyOptional({
    description: 'Whether client is currently taking medications',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Current medications must be a boolean' })
  currentMedications?: boolean = false;

  @ApiPropertyOptional({
    description: 'Details about current medications',
    example: 'Taking sertraline 50mg daily for anxiety',
  })
  @IsOptional()
  @IsString({ message: 'Current medications details must be a string' })
  @Length(0, 1000, {
    message: 'Current medications details cannot exceed 1000 characters',
  })
  currentMedicationsDetails?: string;

  // Presenting Concerns
  @ApiProperty({
    description: 'Primary concern or issue',
    example: 'Experiencing severe anxiety and panic attacks',
  })
  @IsString({ message: 'Primary concern must be a string' })
  @IsNotEmpty({ message: 'Primary concern is required' })
  @Length(10, 1000, {
    message: 'Primary concern must be between 10 and 1000 characters',
  })
  primaryConcern!: string;

  @ApiPropertyOptional({
    description: 'Secondary concerns or issues',
    example: [
      'Sleep difficulties',
      'Work-related stress',
      'Relationship conflicts',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Secondary concerns must be an array' })
  @IsString({ each: true, message: 'Each secondary concern must be a string' })
  @ArrayMinSize(0, {
    message: 'Secondary concerns array cannot be empty if provided',
  })
  secondaryConcerns?: string[];

  @ApiPropertyOptional({
    description: 'Severity of symptoms on a scale of 1-5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt({ message: 'Symptom severity must be an integer' })
  @Min(1, { message: 'Symptom severity must be at least 1' })
  @Max(5, { message: 'Symptom severity cannot exceed 5' })
  symptomSeverity?: number;

  @ApiPropertyOptional({
    description: 'Duration of symptoms',
    example: '6 months',
  })
  @IsOptional()
  @IsString({ message: 'Symptom duration must be a string' })
  @Length(0, 100, { message: 'Symptom duration cannot exceed 100 characters' })
  symptomDuration?: string;

  // Goals and Expectations
  @ApiPropertyOptional({
    description: 'Treatment goals',
    example: [
      'Reduce anxiety levels',
      'Improve sleep quality',
      'Develop coping strategies',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Treatment goals must be an array' })
  @IsString({ each: true, message: 'Each treatment goal must be a string' })
  @ArrayMinSize(0, {
    message: 'Treatment goals array cannot be empty if provided',
  })
  treatmentGoals?: string[];

  @ApiPropertyOptional({
    description: 'Client expectations from therapy',
    example:
      'I hope to learn techniques to manage my anxiety and feel more confident in social situations',
  })
  @IsOptional()
  @IsString({ message: 'Client expectations must be a string' })
  @Length(0, 1000, {
    message: 'Client expectations cannot exceed 1000 characters',
  })
  clientExpectations?: string;

  // Assessment Results
  @ApiPropertyOptional({
    description: 'Initial assessment findings',
    example:
      'Client shows signs of generalized anxiety disorder with mild depression symptoms',
  })
  @IsOptional()
  @IsString({ message: 'Initial assessment must be a string' })
  @Length(0, 2000, {
    message: 'Initial assessment cannot exceed 2000 characters',
  })
  initialAssessment?: string;

  @ApiPropertyOptional({
    description: 'Recommended treatment plan',
    example:
      'Weekly CBT sessions for 12 weeks, combined with mindfulness techniques and homework assignments',
  })
  @IsOptional()
  @IsString({ message: 'Recommended treatment plan must be a string' })
  @Length(0, 2000, {
    message: 'Recommended treatment plan cannot exceed 2000 characters',
  })
  recommendedTreatmentPlan?: string;

  @ApiPropertyOptional({
    description: 'Form-specific data in JSON format',
    example: { specialField: 'value', customData: true },
  })
  @IsOptional()
  formData?: Record<string, any>;
}

// Specialized DTOs for different form types

export class CreateGeneralConsultationDto extends CreateConsultationDto {
  @ApiProperty({
    description: 'Form type (automatically set to GENERAL)',
    enum: [FormType.GENERAL],
  })
  formType: FormType.GENERAL = FormType.GENERAL;

  @ApiPropertyOptional({
    description: 'General consultation specific data',
  })
  @IsOptional()
  declare formData?: {
    stressLevel?: number;
    primaryStressors?: string[];
    supportSystem?: string;
    dailyRoutine?: string;
    exerciseHabits?: string;
    sleepPatterns?: string;
    nutritionHabits?: string;
    hobbiesInterests?: string[];
    spiritualBeliefs?: string;
    culturalFactors?: string;
  };
}

export class CreateDrugAddictionConsultationDto extends CreateConsultationDto {
  @ApiProperty({
    description: 'Form type (automatically set to DRUG_ADDICTION)',
    enum: [FormType.DRUG_ADDICTION],
  })
  formType: FormType.DRUG_ADDICTION = FormType.DRUG_ADDICTION;

  @ApiPropertyOptional({
    description: 'Drug addiction specific data',
  })
  @IsOptional()
  declare formData?: {
    substanceTypes?: string[];
    firstUseAge?: number;
    usageFrequency?: string;
    lastUseDate?: string;
    triggersRelapse?: string[];
    previousTreatments?: string[];
    withdrawalSymptoms?: string[];
    motivationToQuit?: number;
    supportSystemAvailability?: string;
    legalIssues?: boolean;
    occupationalImpact?: string;
    healthComplications?: string[];
  };
}

export class CreateMinorConsultationDto extends CreateConsultationDto {
  @ApiProperty({
    description: 'Form type (automatically set to MINOR)',
    enum: [FormType.MINOR],
  })
  formType: FormType.MINOR = FormType.MINOR;

  @ApiPropertyOptional({
    description: 'Minor-specific consultation data',
  })
  @IsOptional()
  declare formData?: {
    guardianName?: string;
    guardianRelationship?: string;
    guardianPhone?: string;
    schoolName?: string;
    grade?: string;
    schoolPerformance?: string;
    behaviorAtSchool?: string;
    behaviorAtHome?: string;
    friendsRelationships?: string;
    developmentalMilestones?: string;
    familyDynamics?: string;
    parentalConcerns?: string[];
    previousProfessionalHelp?: boolean;
    medicationsSupplements?: string[];
    specialNeeds?: string[];
  };
}

export class UpdateConsultationDto {
  @ApiPropertyOptional({
    description: 'Updated consultation status',
    enum: ConsultationStatus,
  })
  @IsOptional()
  @IsEnum(ConsultationStatus, {
    message: 'Status must be a valid consultation status',
  })
  status?: ConsultationStatus;

  @ApiPropertyOptional({
    description: 'Updated session date',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Session date must be a valid date string (YYYY-MM-DD)' },
  )
  sessionDate?: string;

  @ApiPropertyOptional({
    description: 'Updated session duration',
  })
  @IsOptional()
  @IsInt({ message: 'Session duration must be an integer' })
  @Min(30, { message: 'Session duration must be at least 30 minutes' })
  @Max(300, { message: 'Session duration cannot exceed 300 minutes' })
  sessionDuration?: number;

  @ApiPropertyOptional({
    description: 'Updated consultation notes',
  })
  @IsOptional()
  @IsString({ message: 'Consultation notes must be a string' })
  @Length(0, 2000, {
    message: 'Consultation notes cannot exceed 2000 characters',
  })
  consultationNotes?: string;

  @ApiPropertyOptional({
    description: 'Updated client background - previous therapy experience',
  })
  @IsOptional()
  @IsBoolean({ message: 'Previous therapy experience must be a boolean' })
  previousTherapyExperience?: boolean;

  @ApiPropertyOptional({
    description: 'Updated previous therapy details',
  })
  @IsOptional()
  @IsString({ message: 'Previous therapy details must be a string' })
  @Length(0, 1000, {
    message: 'Previous therapy details cannot exceed 1000 characters',
  })
  previousTherapyDetails?: string;

  @ApiPropertyOptional({
    description: 'Updated current medications status',
  })
  @IsOptional()
  @IsBoolean({ message: 'Current medications must be a boolean' })
  currentMedications?: boolean;

  @ApiPropertyOptional({
    description: 'Updated current medications details',
  })
  @IsOptional()
  @IsString({ message: 'Current medications details must be a string' })
  @Length(0, 1000, {
    message: 'Current medications details cannot exceed 1000 characters',
  })
  currentMedicationsDetails?: string;

  @ApiPropertyOptional({
    description: 'Updated primary concern',
  })
  @IsOptional()
  @IsString({ message: 'Primary concern must be a string' })
  @Length(10, 1000, {
    message: 'Primary concern must be between 10 and 1000 characters',
  })
  primaryConcern?: string;

  @ApiPropertyOptional({
    description: 'Updated secondary concerns',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Secondary concerns must be an array' })
  @IsString({ each: true, message: 'Each secondary concern must be a string' })
  secondaryConcerns?: string[];

  @ApiPropertyOptional({
    description: 'Updated symptom severity',
  })
  @IsOptional()
  @IsInt({ message: 'Symptom severity must be an integer' })
  @Min(1, { message: 'Symptom severity must be at least 1' })
  @Max(5, { message: 'Symptom severity cannot exceed 5' })
  symptomSeverity?: number;

  @ApiPropertyOptional({
    description: 'Updated symptom duration',
  })
  @IsOptional()
  @IsString({ message: 'Symptom duration must be a string' })
  @Length(0, 100, { message: 'Symptom duration cannot exceed 100 characters' })
  symptomDuration?: string;

  @ApiPropertyOptional({
    description: 'Updated treatment goals',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Treatment goals must be an array' })
  @IsString({ each: true, message: 'Each treatment goal must be a string' })
  treatmentGoals?: string[];

  @ApiPropertyOptional({
    description: 'Updated client expectations',
  })
  @IsOptional()
  @IsString({ message: 'Client expectations must be a string' })
  @Length(0, 1000, {
    message: 'Client expectations cannot exceed 1000 characters',
  })
  clientExpectations?: string;

  @ApiPropertyOptional({
    description: 'Updated initial assessment',
  })
  @IsOptional()
  @IsString({ message: 'Initial assessment must be a string' })
  @Length(0, 2000, {
    message: 'Initial assessment cannot exceed 2000 characters',
  })
  initialAssessment?: string;

  @ApiPropertyOptional({
    description: 'Updated recommended treatment plan',
  })
  @IsOptional()
  @IsString({ message: 'Recommended treatment plan must be a string' })
  @Length(0, 2000, {
    message: 'Recommended treatment plan cannot exceed 2000 characters',
  })
  recommendedTreatmentPlan?: string;

  @ApiPropertyOptional({
    description: 'Updated form-specific data',
  })
  @IsOptional()
  formData?: Record<string, any>;
}

export class ConsultationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Search term for consultation notes or concerns',
    example: 'anxiety',
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by client ID',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Client ID must be a valid UUID' })
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Filter by therapist ID',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Therapist ID must be a valid UUID' })
  therapistId?: string;

  @ApiPropertyOptional({
    description: 'Filter by form type',
    enum: FormType,
  })
  @IsOptional()
  @IsEnum(FormType, {
    message: 'Form type must be a valid consultation form type',
  })
  formType?: FormType;

  @ApiPropertyOptional({
    description: 'Filter by consultation status',
    enum: ConsultationStatus,
  })
  @IsOptional()
  @IsEnum(ConsultationStatus, {
    message: 'Status must be a valid consultation status',
  })
  status?: ConsultationStatus;

  @ApiPropertyOptional({
    description: 'Filter consultations from date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'From date must be a valid date string (YYYY-MM-DD)' },
  )
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter consultations to date (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'To date must be a valid date string (YYYY-MM-DD)' },
  )
  dateTo?: string;
}
