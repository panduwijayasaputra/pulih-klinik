import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RegistrationService, RegistrationResult, EmailVerificationResult, ResendCodeResult } from './registration.service';
import { StartRegistrationDto, VerifyEmailDto, ResendCodeDto, AdminVerifyDto } from './dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) { }

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 registration attempts per minute
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

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email with verification code',
    description: 'Verify user email using the 6-digit code sent to their email',
  })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      example: {
        success: true,
        data: {
          verified: true,
          message: 'Email verified successfully. You can now login to your account.',
        },
        message: 'Email verification completed',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<{
    success: boolean;
    data: EmailVerificationResult;
    message: string;
  }> {
    const result = await this.registrationService.verifyEmail(verifyEmailDto);

    return {
      success: true,
      data: result,
      message: 'Email verification completed',
    };
  }

  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 resend attempts per 5 minutes
  @ApiOperation({
    summary: 'Resend verification code',
    description: 'Resend email verification code to user',
  })
  @ApiBody({ type: ResendCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
    schema: {
      example: {
        success: true,
        data: {
          message: 'Verification code sent successfully. Please check your email.',
        },
        message: 'Code sent successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already verified or rate limit exceeded',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async resendCode(@Body() resendCodeDto: ResendCodeDto): Promise<{
    success: boolean;
    data: ResendCodeResult;
    message: string;
  }> {
    const result = await this.registrationService.resendVerificationCode(resendCodeDto);

    return {
      success: true,
      data: result,
      message: 'Code sent successfully',
    };
  }

  @Post('admin-verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin verify email',
    description: 'Manually verify user email by admin (requires admin role)',
  })
  @ApiBody({ type: AdminVerifyDto })
  @ApiResponse({
    status: 200,
    description: 'Email verified by admin successfully',
    schema: {
      example: {
        success: true,
        data: {
          verified: true,
          message: 'Email verified by admin successfully.',
        },
        message: 'Admin verification completed',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async adminVerify(@Body() adminVerifyDto: AdminVerifyDto): Promise<{
    success: boolean;
    data: EmailVerificationResult;
    message: string;
  }> {
    const result = await this.registrationService.adminVerifyEmail(adminVerifyDto);

    return {
      success: true,
      data: result,
      message: 'Admin verification completed',
    };
  }
}