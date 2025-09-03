import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class ClinicOnboardingDto {
  @ApiProperty({
    description: 'Clinic name',
    example: 'Klinik Hipnoterapi Sehat',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name!: string;

  @ApiProperty({
    description: 'Clinic address',
    example: 'Jl. Sudirman No. 123, Jakarta, DKI Jakarta, 12190, Indonesia',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  address!: string;

  @ApiProperty({
    description: 'Clinic phone number',
    example: '+62-21-1234-5678',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: 'Clinic email address',
    example: 'info@kliniksehat.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({
    description: 'Clinic website URL',
    example: 'https://kliniksehat.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    description: 'Clinic description',
    example: 'Leading mental health clinic specializing in cognitive behavioral therapy and trauma treatment.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Province where clinic is located',
    example: 'DKI Jakarta',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Clinic working hours',
    example: 'Mon-Fri: 08:00-17:00, Sat: 09:00-15:00, Sun: Closed',
  })
  @IsOptional()
  @IsString()
  workingHours?: string;
}