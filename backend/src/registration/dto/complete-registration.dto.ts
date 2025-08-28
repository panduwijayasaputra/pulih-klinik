import { ApiProperty } from '@nestjs/swagger';

export class CompleteRegistrationDto {
  @ApiProperty({
    description: 'Confirmation that user wants to complete registration',
    example: true,
  })
  confirm: boolean = true;
}
