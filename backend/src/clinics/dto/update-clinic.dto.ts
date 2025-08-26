import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateClinicDto {
  @ApiProperty({
    description: 'Clinic name',
    example: 'Wellness Therapy Center Jakarta',
    maxLength: 255,
  })
  @IsString({ message: 'Clinic name must be a string' })
  @IsNotEmpty({ message: 'Clinic name is required' })
  @MaxLength(255, { message: 'Clinic name must not exceed 255 characters' })
  name!: string;

  @ApiProperty({
    description: 'Complete clinic address',
    example:
      'Jl. Sudirman No. 123, Lantai 5, Gedung Plaza Indonesia, Jakarta Pusat, DKI Jakarta 10220',
  })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address!: string;

  @ApiProperty({
    description: 'Clinic phone number in Indonesian format',
    example: '+6221123456789',
    maxLength: 20,
  })
  @IsPhoneNumber('ID', {
    message: 'Please provide a valid Indonesian phone number',
  })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone!: string;

  @ApiProperty({
    description: 'Clinic email address',
    example: 'contact@wellnesstherapy.co.id',
    maxLength: 255,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email!: string;

  @ApiProperty({
    description: 'Clinic website URL',
    example: 'https://www.wellnesstherapy.co.id',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: 'Website must be a valid URL' },
  )
  @MaxLength(255, { message: 'Website URL must not exceed 255 characters' })
  website?: string;

  @ApiProperty({
    description: 'Detailed clinic description',
    example:
      'A modern therapy center specializing in clinical psychology, cognitive behavioral therapy, and trauma counseling. We provide comprehensive mental health services for individuals, couples, and families.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(2000, {
    message: 'Description must not exceed 2000 characters',
  })
  description?: string;

  @ApiProperty({
    description: 'Clinic working hours information',
    example:
      'Senin - Jumat: 08:00 - 17:00\nSabtu: 09:00 - 15:00\nMinggu: Tutup\n\nAppointment tersedia di luar jam operasional dengan perjanjian khusus.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Working hours must be a string' })
  @MaxLength(1000, {
    message: 'Working hours must not exceed 1000 characters',
  })
  workingHours?: string;
}
