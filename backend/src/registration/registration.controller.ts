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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  RegistrationService,
  RegistrationResponse,
} from './registration.service';
import {
  StartRegistrationDto,
  ClinicDataDto,
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
    description: 'Initialize a new clinic registration with email verification',
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
          status: 'started',
          currentStep: 'start',
          completedSteps: ['start'],
          createdAt: '2023-12-01T10:00:00.000Z',
          expiresAt: '2023-12-08T10:00:00.000Z',
          paymentStatus: 'pending',
        },
        message:
          'Registration started successfully. Please check your email for verification code.',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already registered',
        error: 'Conflict',
      },
    },
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
          status: 'clinic_data_submitted',
          currentStep: 'clinic_data',
          completedSteps: ['start', 'clinic_data'],
          clinicData: {
            name: 'Klinik Hipnoterapi Sehat',
            address: 'Jl. Sudirman No. 123',
            phone: '+628123456789',
            email: 'info@kliniksehat.com',
          },
          paymentStatus: 'pending',
        },
        message: 'Clinic data submitted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Registration not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot proceed to clinic data step',
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

  @Post(':id/documents')
  @UseInterceptors(FilesInterceptor('documents', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload verification documents',
    description: 'Upload required verification documents for registration',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documents uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '12345678-1234-1234-1234-123456789abc',
          status: 'documents_uploaded',
          currentStep: 'documents',
          completedSteps: ['start', 'clinic_data', 'documents'],
          paymentStatus: 'pending',
        },
        message: 'Documents uploaded successfully',
      },
    },
  })
  async uploadDocuments(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    // TODO: Implement file upload to cloud storage
    const documents = files.map((file) => ({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    }));

    const result = await this.registrationService.uploadDocuments(
      registrationId,
      documents,
    );

    return CustomApiResponse.success(result, 'Documents uploaded successfully');
  }

  @Post(':id/payment')
  @ApiOperation({
    summary: 'Process payment',
    description: 'Process payment for registration',
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
          status: 'payment_completed',
          currentStep: 'payment',
          completedSteps: ['start', 'clinic_data', 'documents', 'payment'],
          paymentStatus: 'completed',
        },
        message: 'Payment processed successfully',
      },
    },
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
            'start',
            'clinic_data',
            'documents',
            'payment',
            'complete',
          ],
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
          status: 'clinic_data_submitted',
          currentStep: 'clinic_data',
          completedSteps: ['start', 'clinic_data'],
          createdAt: '2023-12-01T10:00:00.000Z',
          expiresAt: '2023-12-08T10:00:00.000Z',
          paymentStatus: 'pending',
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
    schema: {
      example: {
        success: true,
        message: 'Registration cancelled successfully',
      },
    },
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        verificationCode: {
          type: 'string',
          example: 'ABC123',
        },
      },
      required: ['verificationCode'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
  })
  async verifyEmail(
    @Param('id', ParseUUIDPipe) registrationId: string,
    @Body('verificationCode') verificationCode: string,
  ): Promise<CustomApiResponse<RegistrationResponse>> {
    const result = await this.registrationService.verifyEmail(
      registrationId,
      verificationCode,
    );

    return CustomApiResponse.success(result, 'Email verified successfully');
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
