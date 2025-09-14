import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Check,
} from '@mikro-orm/core';
import { Clinic } from './clinic.entity';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum Religion {
  ISLAM = 'Islam',
  CHRISTIANITY = 'Christianity',
  CATHOLICISM = 'Catholicism',
  HINDUISM = 'Hinduism',
  BUDDHISM = 'Buddhism',
  KONGHUCU = 'Konghucu',
  OTHER = 'Other',
}

export enum Education {
  ELEMENTARY = 'Elementary',
  MIDDLE = 'Middle',
  HIGH_SCHOOL = 'High School',
  ASSOCIATE = 'Associate',
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
  DOCTORATE = 'Doctorate',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  WIDOWED = 'Widowed',
}

export enum SpouseRelationship {
  GOOD = 'Good',
  AVERAGE = 'Average',
  BAD = 'Bad',
}

export enum GuardianRelationship {
  FATHER = 'Father',
  MOTHER = 'Mother',
  LEGAL_GUARDIAN = 'Legal guardian',
  OTHER = 'Other',
}

export enum GuardianMaritalStatus {
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed',
  OTHER = 'Other',
}

export enum ClientStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  CONSULTATION = 'consultation',
  THERAPY = 'therapy',
  DONE = 'done',
}

@Entity({ tableName: 'clients' })
export class Client {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => Clinic, { onDelete: 'cascade' })
  clinic!: Clinic;

  // Basic info
  @Property({ type: 'varchar', length: 255 })
  fullName!: string;

  @Property({ type: 'varchar', length: 10 })
  gender!: Gender;

  @Property({ type: 'varchar', length: 255 })
  birthPlace!: string;

  @Property({ type: 'date' })
  birthDate!: Date;

  @Property({ type: 'varchar', length: 50 })
  religion!: Religion;

  @Property({ type: 'varchar', length: 255 })
  occupation!: string;

  @Property({ type: 'varchar', length: 50 })
  education!: Education;

  @Property({ type: 'varchar', length: 255, nullable: true })
  educationMajor?: string;

  @Property({ type: 'text' })
  address!: string;

  @Property({ type: 'varchar', length: 20 })
  phone!: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Property({ type: 'text', nullable: true })
  hobbies?: string;

  // Marital status
  @Property({ type: 'varchar', length: 20 })
  maritalStatus!: MaritalStatus;

  @Property({ type: 'varchar', length: 255, nullable: true })
  spouseName?: string;

  @Property({ type: 'varchar', length: 20, nullable: true })
  relationshipWithSpouse?: SpouseRelationship;

  // Visit info
  @Property({ type: 'boolean', default: true })
  firstVisit: boolean = true;

  @Property({ type: 'text', nullable: true })
  previousVisitDetails?: string;


  // Emergency contact
  @Property({ type: 'varchar', length: 255, nullable: true })
  emergencyContactName?: string;

  @Property({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone?: string;

  @Property({ type: 'varchar', length: 100, nullable: true })
  emergencyContactRelationship?: string;

  @Property({ type: 'text', nullable: true })
  emergencyContactAddress?: string;

  // Minor-specific fields
  @Property({ type: 'boolean', default: false })
  isMinor: boolean = false;

  @Property({ type: 'varchar', length: 255, nullable: true })
  school?: string;

  @Property({ type: 'varchar', length: 50, nullable: true })
  grade?: string;

  // Guardian information
  @Property({ type: 'varchar', length: 255, nullable: true })
  guardianFullName?: string;

  @Property({ type: 'varchar', length: 50, nullable: true })
  guardianRelationship?: GuardianRelationship;

  @Property({ type: 'varchar', length: 20, nullable: true })
  guardianPhone?: string;

  @Property({ type: 'text', nullable: true })
  guardianAddress?: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  guardianOccupation?: string;

  @Property({ type: 'varchar', length: 50, nullable: true })
  guardianMaritalStatus?: GuardianMaritalStatus;

  @Property({ type: 'boolean', nullable: true })
  guardianLegalCustody?: boolean;

  @Property({ type: 'boolean', nullable: true })
  guardianCustodyDocsAttached?: boolean;

  // Status tracking
  @Property({ type: 'varchar', length: 20, default: ClientStatus.NEW })
  status: ClientStatus = ClientStatus.NEW;

  @Property({ type: 'date', defaultRaw: 'CURRENT_DATE' })
  joinDate: Date = new Date();

  @Property({ type: 'integer', default: 0 })
  totalSessions: number = 0;

  @Property({ type: 'date', nullable: true })
  lastSessionDate?: Date;

  @Check({ expression: 'progress >= 0 AND progress <= 100' })
  @Property({ type: 'integer', default: 0 })
  progress: number = 0;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  // Legacy fields for backward compatibility
  @Property({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Property({ type: 'integer', nullable: true })
  age?: number;

  @Property({ type: 'text', nullable: true })
  primaryIssue?: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
