import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RegistrationService, RegistrationResult } from './registration.service';
import { StartRegistrationDto } from './dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Start user registration process',
    description: 'Create a new user account and begin the clinic onboarding process',
  })
  @ApiBody({ type: StartRegistrationDto })
  @ApiResponse({
    status: 201,
    description: 'Registration started successfully',
    schema: {
      example: {
        success: true,
        data: {
          registrationId: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          name: 'John Doe',
          message: 'Registration started successfully. Please proceed to setup your clinic.',
        },
        message: 'Registration completed successfully',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be a valid email'],
        error: 'Bad Request',
      },
    },
  })
  async startRegistration(@Body() startRegistrationDto: StartRegistrationDto): Promise<{
    success: boolean;
    data: RegistrationResult;
    message: string;
  }> {
    const result = await this.registrationService.startRegistration(startRegistrationDto);

    return {
      success: true,
      data: result,
      message: 'Registration completed successfully',
    };
  }
}