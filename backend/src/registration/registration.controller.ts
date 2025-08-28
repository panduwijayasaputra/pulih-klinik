import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  RegistrationService,
  RegistrationResponse,
} from './registration.service';
import {
  StartRegistrationDto,
  ClinicDataDto,
  VerifyEmailDto,
  SubscriptionDataDto,
  PaymentDataDto,
  CompleteRegistrationDto,
} from './dto';
import { ApiResponse as CustomApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('start')
  @ApiOperation({
    summary: 'Start registration process',
    description: 'Create a new clinic registration with admin user data and email verification',
  })
  @ApiBody({ type: StartRegistrationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration started successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'admin@clinic.com',
          status: 'user_created',
          currentStep: 'user_form',
          completedSteps: ['user_form'],
          createdAt: '2023-12-01T10:00:00.000Z',
          expiresAt: '2023-12-08T10:00:00.000Z',
          emailVerified: false,
        },
        message:
          'Registration started successfully. Please check your email for verification code.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered',
  })
  async startRegistration(
    @Body() startRegistrationDto: StartRegistrationDto,
    @Request() req: any,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    };

    const result = await this.registrationService.startRegistration(
      startRegistrationDto,
      metadata,
    );

    return CustomApiResponse.success(
      result,
      'Registration started successfully. Please check your email for verification code.',
    );
  }

  @Post(':id/verify-email')
  @ApiOperation({
    summary: 'Verify email with code',
    description: 'Verify email address using verification code',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'admin@clinic.com',
          status: 'email_verified',
          currentStep: 'email_verification',
          completedSteps: ['user_form', 'email_verification'],
          emailVerified: true,
          emailVerifiedAt: '2023-12-01T10:05:00.000Z',
        },
        message: 'Email verified successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid verification code or email already verified',
  })
  async verifyEmail(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result = await this.registrationService.verifyEmail(
      registrationId,
      verifyEmailDto,
    );

    return CustomApiResponse.success(result, 'Email verified successfully');
  }

  @Put(':id/clinic-data')
  @ApiOperation({
    summary: 'Submit clinic information',
    description: 'Submit clinic details for registration',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: ClinicDataDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic data submitted successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'admin@clinic.com',
          status: 'clinic_created',
          currentStep: 'clinic_info',
          completedSteps: ['user_form', 'email_verification', 'clinic_info'],
          clinicData: {
            name: 'Klinik Hipnoterapi Sehat',
            address: 'Jl. Sudirman No. 123',
            phone: '+628123456789',
            email: 'info@kliniksehat.com',
          },
          emailVerified: true,
        },
        message: 'Clinic data submitted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email not verified or cannot proceed to clinic info step',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Clinic with same name or email already exists',
  })
  async submitClinicData(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @Body() clinicDataDto: ClinicDataDto,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result = await this.registrationService.submitClinicData(
      registrationId,
      clinicDataDto,
    );

    return CustomApiResponse.success(
      result,
      'Clinic data submitted successfully',
    );
  }

  @Post(':id/subscription')
  @ApiOperation({
    summary: 'Select subscription plan',
    description: 'Choose subscription tier and billing cycle',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: SubscriptionDataDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription selected successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'admin@clinic.com',
          status: 'subscription_selected',
          currentStep: 'subscription',
          completedSteps: ['user_form', 'email_verification', 'clinic_info', 'subscription'],
          subscriptionData: {
            tierCode: 'alpha',
            tierName: 'Alpha',
            billingCycle: 'monthly',
            amount: 100000,
            currency: 'IDR',
          },
          emailVerified: true,
        },
        message: 'Subscription selected successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot proceed to subscription step or invalid tier',
  })
  async selectSubscription(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @Body() subscriptionDataDto: SubscriptionDataDto,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result = await this.registrationService.selectSubscription(
      registrationId,
      subscriptionDataDto,
    );

    return CustomApiResponse.success(
      result,
      'Subscription selected successfully',
    );
  }

  @Post(':id/payment')
  @ApiOperation({
    summary: 'Process payment',
    description: 'Process payment for selected subscription',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: PaymentDataDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment processed successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'admin@clinic.com',
          status: 'payment_completed',
          currentStep: 'payment',
          completedSteps: ['user_form', 'email_verification', 'clinic_info', 'subscription', 'payment'],
          paymentData: {
            paymentMethod: 'credit_card',
            amount: 100000,
            currency: 'IDR',
            status: 'completed',
          },
          paymentStatus: 'completed',
          emailVerified: true,
        },
        message: 'Payment processed successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot proceed to payment step or amount mismatch',
  })
  async processPayment(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @Body() paymentDataDto: PaymentDataDto,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result = await this.registrationService.processPayment(
      registrationId,
      paymentDataDto,
    );

    return CustomApiResponse.success(result, 'Payment processed successfully');
  }

  @Post(':id/complete')
  @ApiOperation({
    summary: 'Complete registration',
    description:
      'Complete the registration process and create user/clinic accounts',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: CompleteRegistrationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registration completed successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          status: 'completed',
          currentStep: 'complete',
          completedSteps: [
            'user_form',
            'email_verification',
            'clinic_info',
            'subscription',
            'payment',
            'complete',
          ],
          emailVerified: true,
          paymentStatus: 'completed',
        },
        message:
          'Registration completed successfully. Welcome to Smart Therapy!',
      },
    },
  })
  async completeRegistration(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @Body() completeRegistrationDto: CompleteRegistrationDto,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result = await this.registrationService.completeRegistration(
      registrationId,
      completeRegistrationDto,
    );

    return CustomApiResponse.success(
      result,
      'Registration completed successfully. Welcome to Smart Therapy!',
    );
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Get registration status',
    description: 'Get current status and progress of registration',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registration status retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          email: 'admin@clinic.com',
          status: 'email_verified',
          currentStep: 'email_verification',
          completedSteps: ['user_form', 'email_verification'],
          createdAt: '2023-12-01T10:00:00.000Z',
          expiresAt: '2023-12-08T10:00:00.000Z',
          emailVerified: true,
        },
        message: 'Registration status retrieved successfully',
      },
    },
  })
  async getRegistrationStatus(
    @Param('id', ParseUUIDPipe) registrationId: string,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result =
      await this.registrationService.getRegistrationStatus(registrationId);

    return CustomApiResponse.success(
      result,
      'Registration status retrieved successfully',
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel registration',
    description: 'Cancel an ongoing registration process',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registration cancelled successfully',
  })
  async cancelRegistration(
    @Param('id', ParseUUIDPipe) registrationId: string,
  ): Promise<CustomApiResponse<void>> {
    await this.registrationService.cancelRegistration(registrationId);

    return CustomApiResponse.success(
      undefined,
      'Registration cancelled successfully',
    );
  }

  @Post('resend-verification')
  @ApiOperation({
    summary: 'Resend verification code',
    description: 'Resend email verification code',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'admin@clinic.com',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification code sent successfully',
  })
  async resendVerificationCode(
    @Body('email') email: string,
  ): Promise<CustomApiResponse<void>> {
    await this.registrationService.resendVerificationCode(email);

    return CustomApiResponse.success(
      undefined,
      'Verification code sent successfully',
    );
  }
}
