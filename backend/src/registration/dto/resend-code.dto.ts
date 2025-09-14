import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendCodeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to resend verification code',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
