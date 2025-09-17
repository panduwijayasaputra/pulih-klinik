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

// Form Data Classes
export class GeneralFormData {
  @ApiPropertyOptional({
    description: 'Current stress level (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Stress level must be an integer' })
  @Min(1, { message: 'Stress level must be at least 1' })
  @Max(10, { message: 'Stress level cannot exceed 10' })
  stressLevel?: number;

  @ApiPropertyOptional({
    description: 'Primary stressors',
    example: ['Work pressure', 'Financial concerns'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Primary stressors must be an array' })
  @IsString({ each: true, message: 'Each stressor must be a string' })
  primaryStressors?: string[];

  @ApiPropertyOptional({
    description: 'Support system description',
    example: 'Family and close friends provide emotional support',
  })
  @IsOptional()
  @IsString({ message: 'Support system must be a string' })
  @Length(0, 500, { message: 'Support system cannot exceed 500 characters' })
  supportSystem?: string;

  @ApiPropertyOptional({
    description: 'Daily routine description',
    example: 'Works 9-5, exercises 3x per week, spends evenings with family',
  })
  @IsOptional()
  @IsString({ message: 'Daily routine must be a string' })
  @Length(0, 1000, { message: 'Daily routine cannot exceed 1000 characters' })
  dailyRoutine?: string;

  @ApiPropertyOptional({
    description: 'Exercise habits',
    example: 'Gym 3 times per week, morning walks on weekends',
  })
  @IsOptional()
  @IsString({ message: 'Exercise habits must be a string' })
  @Length(0, 500, { message: 'Exercise habits cannot exceed 500 characters' })
  exerciseHabits?: string;

  @ApiPropertyOptional({
    description: 'Sleep patterns',
    example: 'Sleeps 7-8 hours, occasional insomnia due to stress',
  })
  @IsOptional()
  @IsString({ message: 'Sleep patterns must be a string' })
  @Length(0, 500, { message: 'Sleep patterns cannot exceed 500 characters' })
  sleepPatterns?: string;

  @ApiPropertyOptional({
    description: 'Nutrition habits',
    example: 'Balanced diet, occasional fast food, drinks 2L water daily',
  })
  @IsOptional()
  @IsString({ message: 'Nutrition habits must be a string' })
  @Length(0, 500, { message: 'Nutrition habits cannot exceed 500 characters' })
  nutritionHabits?: string;

  @ApiPropertyOptional({
    description: 'Hobbies and interests',
    example: ['Reading', 'Photography', 'Cooking'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Hobbies and interests must be an array' })
  @IsString({ each: true, message: 'Each hobby must be a string' })
  hobbiesInterests?: string[];

  @ApiPropertyOptional({
    description: 'Spiritual beliefs',
    example: 'Practices meditation daily, attends religious services weekly',
  })
  @IsOptional()
  @IsString({ message: 'Spiritual beliefs must be a string' })
  @Length(0, 500, { message: 'Spiritual beliefs cannot exceed 500 characters' })
  spiritualBeliefs?: string;

  @ApiPropertyOptional({
    description: 'Cultural factors',
    example: 'First-generation immigrant, values family traditions',
  })
  @IsOptional()
  @IsString({ message: 'Cultural factors must be a string' })
  @Length(0, 500, { message: 'Cultural factors cannot exceed 500 characters' })
  culturalFactors?: string;

  @ApiPropertyOptional({
    description: 'Recent mood state',
    example: 'neutral',
    enum: ['excellent', 'good', 'neutral', 'bad', 'very_bad'],
  })
  @IsOptional()
  @IsEnum(['excellent', 'good', 'neutral', 'bad', 'very_bad'], {
    message: 'Recent mood state must be a valid option',
  })
  recentMoodState?: string;

  @ApiPropertyOptional({
    description: 'Recent mood state details',
    example: 'Feeling optimistic about new job opportunity',
  })
  @IsOptional()
  @IsString({ message: 'Recent mood state details must be a string' })
  @Length(0, 1000, {
    message: 'Recent mood state details cannot exceed 1000 characters',
  })
  recentMoodStateDetails?: string;

  @ApiPropertyOptional({
    description: 'Frequent emotions',
    example: ['anxiety', 'sadness', 'irritability'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Frequent emotions must be an array' })
  @IsString({ each: true, message: 'Each emotion must be a string' })
  frequentEmotions?: string[];

  @ApiPropertyOptional({
    description: 'Self-harm thoughts frequency',
    example: 'never',
    enum: ['never', 'rarely', 'sometimes', 'often', 'very_often'],
  })
  @IsOptional()
  @IsEnum(['never', 'rarely', 'sometimes', 'often', 'very_often'], {
    message: 'Self-harm thoughts must be a valid option',
  })
  selfHarmThoughts?: string;

  @ApiPropertyOptional({
    description: 'Self-harm details',
    example: 'Never had thoughts of self-harm',
  })
  @IsOptional()
  @IsString({ message: 'Self-harm details must be a string' })
  @Length(0, 1000, {
    message: 'Self-harm details cannot exceed 1000 characters',
  })
  selfHarmDetails?: string;

  @ApiPropertyOptional({
    description: 'Daily stress frequency',
    example: 'sometimes',
    enum: ['never', 'rarely', 'sometimes', 'often', 'very_often'],
  })
  @IsOptional()
  @IsEnum(['never', 'rarely', 'sometimes', 'often', 'very_often'], {
    message: 'Daily stress frequency must be a valid option',
  })
  dailyStressFrequency?: string;

  @ApiPropertyOptional({
    description: 'Emotion scale ratings (0-10 for each emotion)',
    example: {
      happiness: 7,
      sadness: 2,
      anger: 3,
      fear: 4,
      anxiety: 5,
      worry: 3,
      stress: 6,
      depression: 2,
      frustration: 4,
      disappointment: 3,
      guilt: 2,
      shame: 1,
      envy: 2,
      jealousy: 3,
      hatred: 1,
      loneliness: 4,
      calmness: 6,
      confidence: 5,
      optimism: 7,
      despair: 2,
    },
  })
  @IsOptional()
  emotionScale?: Record<string, number>;
}

export class DrugAddictionFormData {
  @ApiPropertyOptional({
    description: 'Types of substances used',
    example: ['Alcohol', 'Cannabis', 'Prescription drugs'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Substance types must be an array' })
  @IsString({ each: true, message: 'Each substance type must be a string' })
  substanceTypes?: string[];

  @ApiPropertyOptional({
    description: 'Age of first use',
    example: 16,
    minimum: 5,
    maximum: 80,
  })
  @IsOptional()
  @IsInt({ message: 'First use age must be an integer' })
  @Min(5, { message: 'First use age must be at least 5' })
  @Max(80, { message: 'First use age cannot exceed 80' })
  firstUseAge?: number;

  @ApiPropertyOptional({
    description: 'Usage frequency',
    example: 'Daily',
  })
  @IsOptional()
  @IsString({ message: 'Usage frequency must be a string' })
  @Length(0, 100, { message: 'Usage frequency cannot exceed 100 characters' })
  usageFrequency?: string;

  @ApiPropertyOptional({
    description: 'Last use date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString({ message: 'Last use date must be a string' })
  lastUseDate?: string;

  @ApiPropertyOptional({
    description: 'Triggers and relapse factors',
    example: ['Stress', 'Social situations', 'Work pressure'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Triggers must be an array' })
  @IsString({ each: true, message: 'Each trigger must be a string' })
  triggersRelapse?: string[];

  @ApiPropertyOptional({
    description: 'Previous treatments',
    example: ['Rehabilitation center', 'Outpatient therapy'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Previous treatments must be an array' })
  @IsString({ each: true, message: 'Each treatment must be a string' })
  previousTreatments?: string[];

  @ApiPropertyOptional({
    description: 'Withdrawal symptoms experienced',
    example: ['Anxiety', 'Insomnia', 'Nausea'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Withdrawal symptoms must be an array' })
  @IsString({ each: true, message: 'Each symptom must be a string' })
  withdrawalSymptoms?: string[];

  @ApiPropertyOptional({
    description: 'Motivation to quit (1-10)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Motivation to quit must be an integer' })
  @Min(1, { message: 'Motivation to quit must be at least 1' })
  @Max(10, { message: 'Motivation to quit cannot exceed 10' })
  motivationToQuit?: number;

  @ApiPropertyOptional({
    description: 'Support system availability',
    example: 'Family is supportive, friends are understanding',
  })
  @IsOptional()
  @IsString({ message: 'Support system availability must be a string' })
  @Length(0, 500, {
    message: 'Support system availability cannot exceed 500 characters',
  })
  supportSystemAvailability?: string;

  @ApiPropertyOptional({
    description: 'Legal issues related to substance use',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Legal issues must be a boolean' })
  legalIssues?: boolean;

  @ApiPropertyOptional({
    description: 'Occupational impact',
    example: 'Has affected work performance and attendance',
  })
  @IsOptional()
  @IsString({ message: 'Occupational impact must be a string' })
  @Length(0, 500, {
    message: 'Occupational impact cannot exceed 500 characters',
  })
  occupationalImpact?: string;

  @ApiPropertyOptional({
    description: 'Health complications',
    example: ['Liver problems', 'Depression', 'Anxiety'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Health complications must be an array' })
  @IsString({ each: true, message: 'Each complication must be a string' })
  healthComplications?: string[];

  @ApiPropertyOptional({
    description: 'Primary substance of concern',
    example: 'Alcohol',
  })
  @IsOptional()
  @IsString({ message: 'Primary substance must be a string' })
  @Length(0, 100, { message: 'Primary substance cannot exceed 100 characters' })
  primarySubstance?: string;

  @ApiPropertyOptional({
    description: 'Quantity per use',
    example: '2-3 drinks per session',
  })
  @IsOptional()
  @IsString({ message: 'Quantity per use must be a string' })
  @Length(0, 200, { message: 'Quantity per use cannot exceed 200 characters' })
  quantityPerUse?: string;

  @ApiPropertyOptional({
    description: 'Number of attempts to quit',
    example: 3,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Attempts to quit must be an integer' })
  @Min(0, { message: 'Attempts to quit cannot be negative' })
  attemptsToQuit?: number;

  @ApiPropertyOptional({
    description: 'Current sobriety period',
    example: '2 weeks',
  })
  @IsOptional()
  @IsString({ message: 'Current sobriety period must be a string' })
  @Length(0, 100, {
    message: 'Current sobriety period cannot exceed 100 characters',
  })
  currentSobrietyPeriod?: string;

  @ApiPropertyOptional({
    description: 'Financial impact',
    example: 'Spends $200-300 per week on substances',
  })
  @IsOptional()
  @IsString({ message: 'Financial impact must be a string' })
  @Length(0, 500, { message: 'Financial impact cannot exceed 500 characters' })
  financialImpact?: string;

  @ApiPropertyOptional({
    description: 'Desire to quit',
    example: 'Yes',
    enum: ['Yes', 'Yes, but unsure', 'No'],
  })
  @IsOptional()
  @IsEnum(['Yes', 'Yes, but unsure', 'No'], {
    message: 'Desire to quit must be a valid option',
  })
  desireToQuit?: string;

  @ApiPropertyOptional({
    description: 'Recovery goals',
    example: ['Complete sobriety', 'Better relationships', 'Career stability'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Recovery goals must be an array' })
  @IsString({ each: true, message: 'Each goal must be a string' })
  recoveryGoals?: string[];

  @ApiPropertyOptional({
    description: 'Willingness for follow-up',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Willingness for follow-up must be a boolean' })
  willingForFollowUp?: boolean;
}

export class MinorFormData {
  @ApiPropertyOptional({
    description: 'Parent/guardian consent',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Parent/guardian consent must be a boolean' })
  parentGuardianConsent?: boolean;

  @ApiPropertyOptional({
    description: 'Parent/guardian contact information',
    example: 'parent@example.com, +1234567890',
  })
  @IsOptional()
  @IsString({ message: 'Parent/guardian contact must be a string' })
  @Length(0, 500, {
    message: 'Parent/guardian contact cannot exceed 500 characters',
  })
  parentGuardianContact?: string;

  @ApiPropertyOptional({
    description: 'School information',
    example: 'ABC High School, Grade 10',
  })
  @IsOptional()
  @IsString({ message: 'School information must be a string' })
  @Length(0, 500, { message: 'School information cannot exceed 500 characters' })
  schoolInformation?: string;

  @ApiPropertyOptional({
    description: 'Academic performance',
    example: 'Good grades, occasional struggles with math',
  })
  @IsOptional()
  @IsString({ message: 'Academic performance must be a string' })
  @Length(0, 1000, {
    message: 'Academic performance cannot exceed 1000 characters',
  })
  academicPerformance?: string;

  @ApiPropertyOptional({
    description: 'Social relationships',
    example: 'Has close friends, sometimes feels left out',
  })
  @IsOptional()
  @IsString({ message: 'Social relationships must be a string' })
  @Length(0, 1000, {
    message: 'Social relationships cannot exceed 1000 characters',
  })
  socialRelationships?: string;

  @ApiPropertyOptional({
    description: 'Family dynamics',
    example: 'Lives with both parents, has one sibling',
  })
  @IsOptional()
  @IsString({ message: 'Family dynamics must be a string' })
  @Length(0, 1000, {
    message: 'Family dynamics cannot exceed 1000 characters',
  })
  familyDynamics?: string;

  @ApiPropertyOptional({
    description: 'Behavioral concerns',
    example: ['Mood swings', 'Difficulty concentrating'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Behavioral concerns must be an array' })
  @IsString({ each: true, message: 'Each concern must be a string' })
  behavioralConcerns?: string[];

  @ApiPropertyOptional({
    description: 'Developmental milestones',
    example: 'Normal development, slight delay in social skills',
  })
  @IsOptional()
  @IsString({ message: 'Developmental milestones must be a string' })
  @Length(0, 1000, {
    message: 'Developmental milestones cannot exceed 1000 characters',
  })
  developmentalMilestones?: string;

  @ApiPropertyOptional({
    description: 'Hobbies and interests',
    example: ['Sports', 'Music', 'Art'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Hobbies and interests must be an array' })
  @IsString({ each: true, message: 'Each hobby must be a string' })
  hobbiesInterests?: string[];

  @ApiPropertyOptional({
    description: 'Screen time habits',
    example: '2-3 hours per day, mostly social media and games',
  })
  @IsOptional()
  @IsString({ message: 'Screen time habits must be a string' })
  @Length(0, 500, {
    message: 'Screen time habits cannot exceed 500 characters',
  })
  screenTimeHabits?: string;

  @ApiPropertyOptional({
    description: 'Sleep patterns',
    example: 'Goes to bed at 10 PM, wakes up at 7 AM',
  })
  @IsOptional()
  @IsString({ message: 'Sleep patterns must be a string' })
  @Length(0, 500, { message: 'Sleep patterns cannot exceed 500 characters' })
  sleepPatterns?: string;

  @ApiPropertyOptional({
    description: 'Eating habits',
    example: 'Regular meals, sometimes skips breakfast',
  })
  @IsOptional()
  @IsString({ message: 'Eating habits must be a string' })
  @Length(0, 500, { message: 'Eating habits cannot exceed 500 characters' })
  eatingHabits?: string;

  @ApiPropertyOptional({
    description: 'Physical activity',
    example: 'Plays soccer twice a week, walks to school',
  })
  @IsOptional()
  @IsString({ message: 'Physical activity must be a string' })
  @Length(0, 500, {
    message: 'Physical activity cannot exceed 500 characters',
  })
  physicalActivity?: string;

  @ApiPropertyOptional({
    description: 'Emotional regulation',
    example: 'Sometimes has difficulty managing anger',
  })
  @IsOptional()
  @IsString({ message: 'Emotional regulation must be a string' })
  @Length(0, 1000, {
    message: 'Emotional regulation cannot exceed 1000 characters',
  })
  emotionalRegulation?: string;

  @ApiPropertyOptional({
    description: 'Coping strategies',
    example: ['Listening to music', 'Talking to friends', 'Playing sports'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Coping strategies must be an array' })
  @IsString({ each: true, message: 'Each strategy must be a string' })
  copingStrategies?: string[];

  @ApiPropertyOptional({
    description: 'Future goals',
    example: 'Wants to become a doctor, interested in helping people',
  })
  @IsOptional()
  @IsString({ message: 'Future goals must be a string' })
  @Length(0, 1000, { message: 'Future goals cannot exceed 1000 characters' })
  futureGoals?: string;

  @ApiPropertyOptional({
    description: 'Willingness for follow-up',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Willingness for follow-up must be a boolean' })
  willingForFollowUp?: boolean;
}

// Base DTO for creating consultations
export class CreateConsultationDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Client ID is required' })
  @IsUUID('4', { message: 'Client ID must be a valid UUID' })
  clientId: string;

  @ApiProperty({
    description: 'Form types for the consultation',
    example: ['general', 'drug_addiction'],
    enum: FormType,
    isArray: true,
  })
  @IsArray({ message: 'Form types must be an array' })
  @ArrayMinSize(1, { message: 'At least one form type is required' })
  @IsEnum(FormType, { each: true, message: 'Invalid form type' })
  formTypes: FormType[];

  @ApiPropertyOptional({
    description: 'Consultation status',
    example: 'draft',
    enum: ConsultationStatus,
    default: ConsultationStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ConsultationStatus, { message: 'Invalid consultation status' })
  status?: ConsultationStatus;

  @ApiPropertyOptional({
    description: 'Session date',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Session date must be a valid date' })
  sessionDate?: string;

  @ApiPropertyOptional({
    description: 'Session duration in minutes',
    example: 60,
    minimum: 15,
    maximum: 300,
  })
  @IsOptional()
  @IsInt({ message: 'Session duration must be an integer' })
  @Min(15, { message: 'Session duration must be at least 15 minutes' })
  @Max(300, { message: 'Session duration cannot exceed 300 minutes' })
  sessionDuration?: number;

  @ApiPropertyOptional({
    description: 'Consultation notes',
    example: 'Client discussed anxiety and stress management techniques',
  })
  @IsOptional()
  @IsString({ message: 'Consultation notes must be a string' })
  @Length(0, 5000, {
    message: 'Consultation notes cannot exceed 5000 characters',
  })
  consultationNotes?: string;

  @ApiPropertyOptional({
    description: 'Script generation preferences',
    example: 'Focus on CBT techniques and mindfulness exercises',
  })
  @IsOptional()
  @IsString({ message: 'Script generation preferences must be a string' })
  @Length(0, 1000, {
    message: 'Script generation preferences cannot exceed 1000 characters',
  })
  scriptGenerationPreferences?: string;

  @ApiPropertyOptional({
    description: 'Previous therapy experience',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Previous therapy experience must be a boolean' })
  previousTherapyExperience?: boolean;

  @ApiPropertyOptional({
    description: 'Current medications',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Current medications must be a boolean' })
  currentMedications?: boolean;

  @ApiPropertyOptional({
    description: 'Previous psychological diagnosis',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Previous psychological diagnosis must be a boolean' })
  previousPsychologicalDiagnosis?: boolean;

  @ApiPropertyOptional({
    description: 'Significant physical illness',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Significant physical illness must be a boolean' })
  significantPhysicalIllness?: boolean;

  @ApiPropertyOptional({
    description: 'Traumatic experience',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Traumatic experience must be a boolean' })
  traumaticExperience?: boolean;

  @ApiPropertyOptional({
    description: 'Family psychological history',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Family psychological history must be a boolean' })
  familyPsychologicalHistory?: boolean;

  @ApiPropertyOptional({
    description: 'Primary concern',
    example: 'Anxiety and stress management',
  })
  @IsOptional()
  @IsString({ message: 'Primary concern must be a string' })
  @Length(0, 1000, { message: 'Primary concern cannot exceed 1000 characters' })
  primaryConcern?: string;

  @ApiPropertyOptional({
    description: 'Symptom severity (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Symptom severity must be an integer' })
  @Min(1, { message: 'Symptom severity must be at least 1' })
  @Max(10, { message: 'Symptom severity cannot exceed 10' })
  symptomSeverity?: number;

  @ApiPropertyOptional({
    description: 'Symptom duration',
    example: '3-6 months',
  })
  @IsOptional()
  @IsString({ message: 'Symptom duration must be a string' })
  @Length(0, 100, { message: 'Symptom duration cannot exceed 100 characters' })
  symptomDuration?: string;

  @ApiPropertyOptional({
    description: 'Treatment goals',
    example: ['Reduce anxiety', 'Improve sleep quality'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Treatment goals must be an array' })
  @IsString({ each: true, message: 'Each treatment goal must be a string' })
  treatmentGoals?: string[];

  @ApiPropertyOptional({
    description: 'Client expectations',
    example: 'Learn coping strategies for anxiety',
  })
  @IsOptional()
  @IsString({ message: 'Client expectations must be a string' })
  @Length(0, 1000, {
    message: 'Client expectations cannot exceed 1000 characters',
  })
  clientExpectations?: string;

  // Form-specific data (separate columns for each form type)
  @ApiPropertyOptional({
    description: 'General consultation form data',
    type: GeneralFormData,
  })
  @IsOptional()
  @Type(() => GeneralFormData)
  generalFormData?: GeneralFormData;

  @ApiPropertyOptional({
    description: 'Drug addiction consultation form data',
    type: DrugAddictionFormData,
  })
  @IsOptional()
  @Type(() => DrugAddictionFormData)
  drugAddictionFormData?: DrugAddictionFormData;

  @ApiPropertyOptional({
    description: 'Minor consultation form data',
    type: MinorFormData,
  })
  @IsOptional()
  @Type(() => MinorFormData)
  minorFormData?: MinorFormData;
}

// Specialized DTOs for different form types
export class CreateGeneralConsultationDto extends CreateConsultationDto {
  @ApiProperty({
    description: 'Form types (automatically set to GENERAL)',
    example: ['general'],
    enum: FormType,
    isArray: true,
  })
  formTypes: [FormType.GENERAL] = [FormType.GENERAL];
}

export class CreateDrugAddictionConsultationDto extends CreateConsultationDto {
  @ApiProperty({
    description: 'Form types (automatically set to DRUG_ADDICTION)',
    example: ['drug_addiction'],
    enum: FormType,
    isArray: true,
  })
  formTypes: [FormType.DRUG_ADDICTION] = [FormType.DRUG_ADDICTION];
}

export class CreateMinorConsultationDto extends CreateConsultationDto {
  @ApiProperty({
    description: 'Form types (automatically set to MINOR)',
    example: ['minor'],
    enum: FormType,
    isArray: true,
  })
  formTypes: [FormType.MINOR] = [FormType.MINOR];
}

// Update DTO
export class UpdateConsultationDto {
  @ApiPropertyOptional({
    description: 'Updated consultation status',
    example: 'completed',
    enum: ConsultationStatus,
  })
  @IsOptional()
  @IsEnum(ConsultationStatus, { message: 'Invalid consultation status' })
  status?: ConsultationStatus;

  @ApiPropertyOptional({
    description: 'Updated session date',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Session date must be a valid date' })
  sessionDate?: string;

  @ApiPropertyOptional({
    description: 'Updated session duration in minutes',
    example: 60,
    minimum: 15,
    maximum: 300,
  })
  @IsOptional()
  @IsInt({ message: 'Session duration must be an integer' })
  @Min(15, { message: 'Session duration must be at least 15 minutes' })
  @Max(300, { message: 'Session duration cannot exceed 300 minutes' })
  sessionDuration?: number;

  @ApiPropertyOptional({
    description: 'Updated consultation notes',
    example: 'Client discussed anxiety and stress management techniques',
  })
  @IsOptional()
  @IsString({ message: 'Consultation notes must be a string' })
  @Length(0, 5000, {
    message: 'Consultation notes cannot exceed 5000 characters',
  })
  consultationNotes?: string;

  @ApiPropertyOptional({
    description: 'Updated script generation preferences',
    example: 'Focus on CBT techniques and mindfulness exercises',
  })
  @IsOptional()
  @IsString({ message: 'Script generation preferences must be a string' })
  @Length(0, 1000, {
    message: 'Script generation preferences cannot exceed 1000 characters',
  })
  scriptGenerationPreferences?: string;

  @ApiPropertyOptional({
    description: 'Updated previous therapy experience',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Previous therapy experience must be a boolean' })
  previousTherapyExperience?: boolean;

  @ApiPropertyOptional({
    description: 'Updated current medications',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Current medications must be a boolean' })
  currentMedications?: boolean;

  @ApiPropertyOptional({
    description: 'Updated previous psychological diagnosis',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Previous psychological diagnosis must be a boolean' })
  previousPsychologicalDiagnosis?: boolean;

  @ApiPropertyOptional({
    description: 'Updated significant physical illness',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Significant physical illness must be a boolean' })
  significantPhysicalIllness?: boolean;

  @ApiPropertyOptional({
    description: 'Updated traumatic experience',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Traumatic experience must be a boolean' })
  traumaticExperience?: boolean;

  @ApiPropertyOptional({
    description: 'Updated family psychological history',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Family psychological history must be a boolean' })
  familyPsychologicalHistory?: boolean;

  @ApiPropertyOptional({
    description: 'Updated primary concern',
    example: 'Anxiety and stress management',
  })
  @IsOptional()
  @IsString({ message: 'Primary concern must be a string' })
  @Length(0, 1000, { message: 'Primary concern cannot exceed 1000 characters' })
  primaryConcern?: string;

  @ApiPropertyOptional({
    description: 'Updated symptom severity (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Symptom severity must be an integer' })
  @Min(1, { message: 'Symptom severity must be at least 1' })
  @Max(10, { message: 'Symptom severity cannot exceed 10' })
  symptomSeverity?: number;

  @ApiPropertyOptional({
    description: 'Updated symptom duration',
    example: '3-6 months',
  })
  @IsOptional()
  @IsString({ message: 'Symptom duration must be a string' })
  @Length(0, 100, { message: 'Symptom duration cannot exceed 100 characters' })
  symptomDuration?: string;

  @ApiPropertyOptional({
    description: 'Updated treatment goals',
    example: ['Reduce anxiety', 'Improve sleep quality'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Treatment goals must be an array' })
  @IsString({ each: true, message: 'Each treatment goal must be a string' })
  treatmentGoals?: string[];

  @ApiPropertyOptional({
    description: 'Updated client expectations',
    example: 'Learn coping strategies for anxiety',
  })
  @IsOptional()
  @IsString({ message: 'Client expectations must be a string' })
  @Length(0, 1000, {
    message: 'Client expectations cannot exceed 1000 characters',
  })
  clientExpectations?: string;

  // Form-specific data (separate columns for each form type)
  @ApiPropertyOptional({
    description: 'Updated general consultation form data',
    type: GeneralFormData,
  })
  @IsOptional()
  @Type(() => GeneralFormData)
  generalFormData?: GeneralFormData;

  @ApiPropertyOptional({
    description: 'Updated drug addiction consultation form data',
    type: DrugAddictionFormData,
  })
  @IsOptional()
  @Type(() => DrugAddictionFormData)
  drugAddictionFormData?: DrugAddictionFormData;

  @ApiPropertyOptional({
    description: 'Updated minor consultation form data',
    type: MinorFormData,
  })
  @IsOptional()
  @Type(() => MinorFormData)
  minorFormData?: MinorFormData;
}

// Query DTO
export class ConsultationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Client ID must be a valid UUID' })
  clientId?: string;
}
