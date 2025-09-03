import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { AuthUser } from '../auth/jwt.strategy';
import {
  OnboardingService,
  OnboardingStatusResponse,
  UserWithClinicResponse,
} from './onboarding.service';
import {
  ClinicOnboardingDto,
  SubscriptionOnboardingDto,
  PaymentOnboardingDto,
} from './dto';
import { ApiResponse as CustomApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Onboarding')
@Controller('onboarding')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Check onboarding status',
    description: 'Get current onboarding status for authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Onboarding status retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          needsOnboarding: true,
          hasClinic: false,
          currentStep: 'clinic_info',
        },
        message: 'Onboarding status retrieved successfully',
      },
    },
  })
  async getOnboardingStatus(
    @CurrentUser() user: AuthUser,
  ): Promise<CustomApiResponse<OnboardingStatusResponse>> {
    const result = await this.onboardingService.checkOnboardingStatus(user.id);

    return CustomApiResponse.success(
      result,
      'Onboarding status retrieved successfully',
    );
  }

  @Post('clinic')
  @ApiOperation({
    summary: 'Submit clinic information',
    description: 'Submit clinic details for onboarding process',
  })
  @ApiBody({ type: ClinicOnboardingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clinic data submitted successfully',
    schema: {
      example: {
        success: true,
        data: {
          success: true,
          message: 'Clinic data submitted successfully',
        },
        message: 'Clinic data submitted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already has a clinic assigned or invalid data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Clinic with same name or email already exists',
  })
  async submitClinicData(
    @CurrentUser() user: AuthUser,
    @Body() clinicData: ClinicOnboardingDto,
  ): Promise<CustomApiResponse<{ success: boolean; message: string; user?: any }>> {
    const result = await this.onboardingService.submitClinicData(
      user.id,
      clinicData,
    );

    return CustomApiResponse.success(
      result,
      'Clinic data submitted successfully',
    );
  }

  @Post('subscription')
  @ApiOperation({
    summary: 'Submit subscription selection',
    description: 'Select subscription tier and billing cycle for onboarding',
  })
  @ApiBody({ type: SubscriptionOnboardingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription selected successfully',
    schema: {
      example: {
        success: true,
        data: {
          success: true,
          message: 'Subscription selected successfully',
        },
        message: 'Subscription selected successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Must complete clinic setup first or invalid subscription data',
  })
  async submitSubscription(
    @CurrentUser() user: AuthUser,
    @Body() subscriptionData: SubscriptionOnboardingDto,
  ): Promise<
    CustomApiResponse<{ success: boolean; message: string; user?: any }>
  > {
    const result = await this.onboardingService.submitSubscription(
      user.id,
      subscriptionData,
    );

    return CustomApiResponse.success(
      result,
      'Subscription selected successfully',
    );
  }

  @Post('payment')
  @ApiOperation({
    summary: 'Submit payment information',
    description: 'Process payment for selected subscription',
  })
  @ApiBody({ type: PaymentOnboardingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment processed successfully',
    schema: {
      example: {
        success: true,
        data: {
          success: true,
          message: 'Payment processed successfully',
        },
        message: 'Payment processed successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Must complete previous steps first or invalid payment data',
  })
  async submitPayment(
    @CurrentUser() user: AuthUser,
    @Body() paymentData: PaymentOnboardingDto,
  ): Promise<CustomApiResponse<{ success: boolean; message: string }>> {
    const result = await this.onboardingService.submitPayment(
      user.id,
      paymentData,
    );

    return CustomApiResponse.success(result, 'Payment processed successfully');
  }

  @Post('complete')
  @ApiOperation({
    summary: 'Complete onboarding process',
    description: 'Finalize the onboarding process and activate user account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Onboarding completed successfully',
    schema: {
      example: {
        success: true,
        data: {
          success: true,
          message: 'Onboarding completed successfully',
          user: {
            id: 'f580a4f6-c1d3-4d02-b920-f6994a102442',
            email: 'admin@terapintar.com',
            name: 'System Administrator',
            isActive: true,
            roles: [
              {
                id: 'cd491676-02a7-4ab5-a6e9-c86fcb5a77b3',
                role: 'administrator',
              },
            ],
            clinicId: '789e0123-e89b-12d3-a456-426614174002',
            clinicName: 'Terapintar Clinic',
          },
        },
        message: 'Onboarding completed successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Must complete all onboarding steps first',
  })
  async completeOnboarding(@CurrentUser() user: AuthUser): Promise<
    CustomApiResponse<{
      success: boolean;
      message: string;
      user: UserWithClinicResponse;
    }>
  > {
    const result = await this.onboardingService.completeOnboarding(user.id);

    return CustomApiResponse.success(
      result,
      'Onboarding completed successfully',
    );
  }
}
