import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: '6-digit verification code sent to email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 characters' })
  verificationCode!: string;
}
