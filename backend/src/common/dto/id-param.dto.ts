import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty({
    description: 'UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'ID must be a valid UUID v4' })
  id!: string;
}

export class ClinicIdParamDto {
  @ApiProperty({
    description: 'Clinic UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Clinic ID must be a valid UUID v4' })
  clinicId!: string;
}

export class UserIdParamDto {
  @ApiProperty({
    description: 'User UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID v4' })
  userId!: string;
}

export class TherapistIdParamDto {
  @ApiProperty({
    description: 'Therapist UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Therapist ID must be a valid UUID v4' })
  therapistId!: string;
}

export class ClientIdParamDto {
  @ApiProperty({
    description: 'Client UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Client ID must be a valid UUID v4' })
  clientId!: string;
}

export class SessionIdParamDto {
  @ApiProperty({
    description: 'Therapy Session UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Session ID must be a valid UUID v4' })
  sessionId!: string;
}
