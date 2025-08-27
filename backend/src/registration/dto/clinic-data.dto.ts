import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ClinicDataDto {
  @ApiProperty({
    description: 'Clinic name',
    example: 'Klinik Hipnoterapi Sehat',
    minLength: 2,
    maxLength: 255,
  })
  @IsString({ message: 'Clinic name must be a string' })
  @MinLength(2, { message: 'Clinic name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Clinic name cannot exceed 255 characters' })
  name!: string;

  @ApiProperty({
    description: 'Complete clinic address',
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
    description: 'Clinic email address',
    example: 'info@kliniksehat.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email!: string;

  @ApiProperty({
    description: 'Clinic website URL',
    example: 'https://www.kliniksehat.com',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  @MaxLength(255, { message: 'Website URL cannot exceed 255 characters' })
  website?: string;

  @ApiProperty({
    description: 'Clinic description',
    example: 'Klinik hipnoterapi terpercaya dengan pengalaman 10+ tahun',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @ApiProperty({
    description: 'Working hours',
    example: 'Senin - Jumat: 09:00 - 17:00, Sabtu: 09:00 - 15:00',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Working hours must be a string' })
  @MaxLength(255, { message: 'Working hours cannot exceed 255 characters' })
  workingHours?: string;

  @ApiProperty({
    description: 'Province location',
    example: 'DKI Jakarta',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Province must be a string' })
  @MaxLength(100, { message: 'Province cannot exceed 100 characters' })
  province?: string;
}
