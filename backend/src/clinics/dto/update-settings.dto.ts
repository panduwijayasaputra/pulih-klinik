import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsIn } from 'class-validator';

const SUPPORTED_TIMEZONES = [
  'Asia/Jakarta', // WIB (UTC+7)
  'Asia/Makassar', // WITA (UTC+8)
  'Asia/Jayapura', // WIT (UTC+9)
  'Asia/Pontianak', // WIB (UTC+7) - West Kalimantan
] as const;

const SUPPORTED_LANGUAGES = [
  'id', // Indonesian
  'en', // English (for international clinics)
] as const;

export class UpdateSettingsDto {
  @ApiProperty({
    description: 'Clinic timezone for scheduling and appointments',
    example: 'Asia/Jakarta',
    enum: SUPPORTED_TIMEZONES,
  })
  @IsString({ message: 'Timezone must be a string' })
  @IsIn(SUPPORTED_TIMEZONES, {
    message: `Timezone must be one of: ${SUPPORTED_TIMEZONES.join(', ')}`,
  })
  timezone!: string;

  @ApiProperty({
    description: 'Clinic default language',
    example: 'id',
    enum: SUPPORTED_LANGUAGES,
  })
  @IsString({ message: 'Language must be a string' })
  @IsIn(SUPPORTED_LANGUAGES, {
    message: `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')} (id=Indonesian, en=English)`,
  })
  language!: string;

  @ApiProperty({
    description: 'Enable email notifications for appointments and updates',
    example: true,
  })
  @IsBoolean({ message: 'Email notifications setting must be a boolean' })
  emailNotifications!: boolean;

  @ApiProperty({
    description: 'Enable SMS notifications for appointments and reminders',
    example: false,
  })
  @IsBoolean({ message: 'SMS notifications setting must be a boolean' })
  smsNotifications!: boolean;

  @ApiProperty({
    description: 'Enable push notifications for mobile applications',
    example: false,
  })
  @IsBoolean({ message: 'Push notifications setting must be a boolean' })
  pushNotifications!: boolean;
}
