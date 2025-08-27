import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import {
  Gender,
  Religion,
  Education,
  MaritalStatus,
  SpouseRelationship,
  GuardianRelationship,
  GuardianMaritalStatus,
} from '../../database/entities/client.entity';

export class CreateClientDto {
  // Basic Information
  @ApiProperty({
    description: 'Full name of the client',
    example: 'Sari Wulandari',
    minLength: 2,
    maxLength: 255,
  })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Full name cannot exceed 255 characters' })
  fullName!: string;

  @ApiProperty({
    description: 'Gender of the client',
    enum: Gender,
    example: Gender.FEMALE,
  })
  @IsEnum(Gender, { message: 'Gender must be Male or Female' })
  gender!: Gender;

  @ApiProperty({
    description: 'Birth place of the client',
    example: 'Jakarta',
    maxLength: 255,
  })
  @IsString({ message: 'Birth place must be a string' })
  @MaxLength(255, { message: 'Birth place cannot exceed 255 characters' })
  birthPlace!: string;

  @ApiProperty({
    description: 'Birth date in ISO format',
    example: '1995-05-15',
  })
  @IsDateString({}, { message: 'Birth date must be a valid date string' })
  birthDate!: string;

  @ApiProperty({
    description: 'Religion of the client',
    enum: Religion,
    example: Religion.ISLAM,
  })
  @IsEnum(Religion, {
    message:
      'Religion must be one of: Islam, Christianity, Catholicism, Hinduism, Buddhism, Konghucu, Other',
  })
  religion!: Religion;

  @ApiProperty({
    description: 'Occupation of the client',
    example: 'Marketing Manager',
    maxLength: 255,
  })
  @IsString({ message: 'Occupation must be a string' })
  @MaxLength(255, { message: 'Occupation cannot exceed 255 characters' })
  occupation!: string;

  @ApiProperty({
    description: 'Education level of the client',
    enum: Education,
    example: Education.BACHELOR,
  })
  @IsEnum(Education, {
    message:
      'Education must be one of: Elementary, Middle, High School, Associate, Bachelor, Master, Doctorate',
  })
  education!: Education;

  @ApiProperty({
    description: 'Education major (required for Associate and above)',
    example: 'Psychology',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @ValidateIf((obj) =>
    [
      Education.ASSOCIATE,
      Education.BACHELOR,
      Education.MASTER,
      Education.DOCTORATE,
    ].includes(obj.education),
  )
  @IsString({ message: 'Education major must be a string' })
  @MaxLength(255, { message: 'Education major cannot exceed 255 characters' })
  educationMajor?: string;

  @ApiProperty({
    description: 'Complete address of the client',
    example: 'Jl. Sudirman No. 123, RT 05/RW 02, Jakarta Pusat 10220',
  })
  @IsString({ message: 'Address must be a string' })
  @MinLength(10, { message: 'Address must be at least 10 characters long' })
  address!: string;

  @ApiProperty({
    description: 'Indonesian phone number',
    example: '+628123456789',
  })
  @IsPhoneNumber('ID', {
    message: 'Please provide a valid Indonesian phone number',
  })
  phone!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'sari.wulandari@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email?: string;

  @ApiProperty({
    description: 'Hobbies and interests',
    example: 'Reading, traveling, photography',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Hobbies must be a string' })
  hobbies?: string;

  // Marital Status Information
  @ApiProperty({
    description: 'Marital status of the client',
    enum: MaritalStatus,
    example: MaritalStatus.MARRIED,
  })
  @IsEnum(MaritalStatus, {
    message: 'Marital status must be one of: Single, Married, Widowed',
  })
  maritalStatus!: MaritalStatus;

  @ApiProperty({
    description: 'Name of spouse (required if married)',
    example: 'Budi Santoso',
    required: false,
    maxLength: 255,
  })
  @ValidateIf((obj) => obj.maritalStatus === MaritalStatus.MARRIED)
  @IsNotEmpty({ message: 'Spouse name is required for married clients' })
  @IsString({ message: 'Spouse name must be a string' })
  @MaxLength(255, { message: 'Spouse name cannot exceed 255 characters' })
  spouseName?: string;

  @ApiProperty({
    description: 'Quality of relationship with spouse (required if married)',
    enum: SpouseRelationship,
    example: SpouseRelationship.GOOD,
    required: false,
  })
  @ValidateIf((obj) => obj.maritalStatus === MaritalStatus.MARRIED)
  @IsNotEmpty({
    message: 'Relationship with spouse is required for married clients',
  })
  @IsEnum(SpouseRelationship, {
    message: 'Relationship with spouse must be one of: Good, Average, Bad',
  })
  relationshipWithSpouse?: SpouseRelationship;

  // Visit Information
  @ApiProperty({
    description: 'Whether this is the first visit',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'First visit must be a boolean' })
  firstVisit?: boolean;

  @ApiProperty({
    description: 'Details of previous visits (required if not first visit)',
    example: 'Previously visited in 2022 for anxiety treatment',
    required: false,
  })
  @ValidateIf((obj) => obj.firstVisit === false)
  @IsNotEmpty({
    message: 'Previous visit details are required for returning clients',
  })
  @IsString({ message: 'Previous visit details must be a string' })
  previousVisitDetails?: string;

  @ApiProperty({
    description: 'Province of the client',
    example: 'DKI Jakarta',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Province must be a string' })
  @MaxLength(100, { message: 'Province cannot exceed 100 characters' })
  province?: string;

  // Emergency Contact Information
  @ApiProperty({
    description: 'Emergency contact full name',
    example: 'Dr. Ahmad Rahman',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Emergency contact name must be a string' })
  @MaxLength(255, {
    message: 'Emergency contact name cannot exceed 255 characters',
  })
  emergencyContactName?: string;

  @ApiProperty({
    description: 'Emergency contact phone number',
    example: '+628987654321',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('ID', {
    message:
      'Please provide a valid Indonesian phone number for emergency contact',
  })
  emergencyContactPhone?: string;

  @ApiProperty({
    description: 'Relationship to emergency contact',
    example: 'Brother',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Emergency contact relationship must be a string' })
  @MaxLength(100, {
    message: 'Emergency contact relationship cannot exceed 100 characters',
  })
  emergencyContactRelationship?: string;

  @ApiProperty({
    description: 'Emergency contact address',
    example: 'Jl. Kebon Jeruk No. 456, Jakarta Barat',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Emergency contact address must be a string' })
  emergencyContactAddress?: string;

  // Minor-specific Information
  @ApiProperty({
    description: 'Whether the client is a minor (under 18)',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Is minor must be a boolean' })
  isMinor?: boolean;

  @ApiProperty({
    description: 'School name (required for minors)',
    example: 'SMA Negeri 1 Jakarta',
    required: false,
    maxLength: 255,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({ message: 'School is required for minor clients' })
  @IsString({ message: 'School must be a string' })
  @MaxLength(255, { message: 'School cannot exceed 255 characters' })
  school?: string;

  @ApiProperty({
    description: 'Grade/class (required for minors)',
    example: '12 IPA 2',
    required: false,
    maxLength: 50,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({ message: 'Grade is required for minor clients' })
  @IsString({ message: 'Grade must be a string' })
  @MaxLength(50, { message: 'Grade cannot exceed 50 characters' })
  grade?: string;

  // Guardian Information (required for minors)
  @ApiProperty({
    description: 'Guardian full name (required for minors)',
    example: 'Ibu Siti Nurhaliza',
    required: false,
    maxLength: 255,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({ message: 'Guardian full name is required for minor clients' })
  @IsString({ message: 'Guardian full name must be a string' })
  @MaxLength(255, {
    message: 'Guardian full name cannot exceed 255 characters',
  })
  guardianFullName?: string;

  @ApiProperty({
    description: 'Relationship to guardian (required for minors)',
    enum: GuardianRelationship,
    example: GuardianRelationship.MOTHER,
    required: false,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({
    message: 'Guardian relationship is required for minor clients',
  })
  @IsEnum(GuardianRelationship, {
    message:
      'Guardian relationship must be one of: Father, Mother, Legal guardian, Other',
  })
  guardianRelationship?: GuardianRelationship;

  @ApiProperty({
    description: 'Guardian phone number (required for minors)',
    example: '+628123456789',
    required: false,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({ message: 'Guardian phone is required for minor clients' })
  @IsPhoneNumber('ID', {
    message: 'Please provide a valid Indonesian phone number for guardian',
  })
  guardianPhone?: string;

  @ApiProperty({
    description: 'Guardian address (required for minors)',
    example: 'Jl. Merdeka No. 789, Jakarta Selatan',
    required: false,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({ message: 'Guardian address is required for minor clients' })
  @IsString({ message: 'Guardian address must be a string' })
  guardianAddress?: string;

  @ApiProperty({
    description: 'Guardian occupation',
    example: 'Teacher',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Guardian occupation must be a string' })
  @MaxLength(255, {
    message: 'Guardian occupation cannot exceed 255 characters',
  })
  guardianOccupation?: string;

  @ApiProperty({
    description: 'Guardian marital status',
    enum: GuardianMaritalStatus,
    example: GuardianMaritalStatus.MARRIED,
    required: false,
  })
  @IsOptional()
  @IsEnum(GuardianMaritalStatus, {
    message:
      'Guardian marital status must be one of: Married, Divorced, Widowed, Other',
  })
  guardianMaritalStatus?: GuardianMaritalStatus;

  @ApiProperty({
    description: 'Whether guardian has legal custody (required for minors)',
    example: true,
    required: false,
  })
  @ValidateIf((obj) => obj.isMinor === true)
  @IsNotEmpty({
    message: 'Guardian legal custody status is required for minor clients',
  })
  @IsBoolean({ message: 'Guardian legal custody must be a boolean' })
  guardianLegalCustody?: boolean;

  @ApiProperty({
    description: 'Whether custody documents are attached',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Guardian custody docs attached must be a boolean' })
  guardianCustodyDocsAttached?: boolean;

  // Additional Information
  @ApiProperty({
    description: 'Total sessions count',
    example: 0,
    minimum: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Total sessions must be an integer' })
  @Min(0, { message: 'Total sessions cannot be negative' })
  totalSessions?: number;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 0,
    minimum: 0,
    maximum: 100,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Progress must be an integer' })
  @Min(0, { message: 'Progress cannot be negative' })
  @Max(100, { message: 'Progress cannot exceed 100' })
  progress?: number;

  @ApiProperty({
    description: 'Additional notes about the client',
    example: 'Client shows anxiety symptoms related to work stress',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  // Legacy fields (for backward compatibility)
  @ApiProperty({
    description: 'Primary issue description',
    example: 'Anxiety and stress management',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Primary issue must be a string' })
  primaryIssue?: string;
}
