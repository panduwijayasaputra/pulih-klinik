import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AdminVerifyDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to verify manually by admin',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
