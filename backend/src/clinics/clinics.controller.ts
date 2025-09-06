import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  RequireClinicAccess,
  RequireAdminOrClinicAdmin,
  RequireAdminOrClinicAdminForCreation,
  RequireAdmin,
} from '../auth/decorators';
import { ParseUuidPipe } from '../common/pipes';
import {
  ClinicsService,
  ClinicProfileResponse,
  ClinicDocumentPlaceholder,
} from './clinics.service';
import {
  UpdateClinicDto,
  UpdateBrandingDto,
  UpdateSettingsDto,
  CreateClinicDto,
} from './dto';
import type { AuthUser } from '../auth/jwt.strategy';

@ApiTags('Clinics')
@Controller('clinics')
@ApiBearerAuth()
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @RequireAdminOrClinicAdminForCreation()
  @ApiOperation({
    summary: 'Create a new clinic',
    description:
      'Create a new clinic profile. Only clinic admins and system admins can create clinics.',
  })
  @ApiBody({
    type: CreateClinicDto,
    description: 'Clinic creation data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Clinic created successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Wellness Therapy Center',
          address: 'Jl. Sudirman No. 123, Jakarta',
          phone: '+628123456789',
          email: 'contact@wellness.com',
          status: 'pending',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        message: 'Clinic created successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or missing required fields',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Clinic with same name or email already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async createClinic(
    @Body() createClinicDto: CreateClinicDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: ClinicProfileResponse;
    message: string;
  }> {
    const clinic = await this.clinicsService.createClinic(
      createClinicDto,
      currentUser.id,
    );
    return {
      success: true,
      data: clinic,
      message: 'Clinic created successfully',
    };
  }

  @Get()
  @RequireAdmin()
  @ApiOperation({
    summary: 'Get all clinics (admin only)',
    description:
      'Get paginated list of all clinics with optional filtering by search, status, and subscription tier',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of items per page (1-100, default: 20)',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search clinics by name, email, or address',
    example: 'wellness jakarta',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'suspended'],
    description: 'Filter clinics by status',
    example: 'active',
  })
  @ApiQuery({
    name: 'subscriptionTier',
    required: false,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    description: 'Filter clinics by subscription tier',
    example: 'premium',
  })
  @ApiResponse({
    status: 200,
    description: 'Clinics retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          clinics: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Wellness Clinic Jakarta',
              address: 'Jl. Sudirman No. 123, Jakarta Pusat',
              phone: '+62-21-1234567',
              email: 'info@wellnessclinic.id',
              website: 'https://wellnessclinic.id',
              description: 'Premium wellness and therapy clinic',
              workingHours: 'Mon-Fri: 08:00-20:00, Sat: 09:00-17:00',
              logoUrl: null,
              primaryColor: '#3B82F6',
              secondaryColor: '#F3F4F6',
              fontFamily: 'Inter',
              timezone: 'Asia/Jakarta',
              language: 'id',
              emailNotifications: true,
              smsNotifications: false,
              pushNotifications: true,
              status: 'active',
              subscriptionTier: 'premium',
              subscriptionExpires: '2024-12-31T00:00:00.000Z',
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-15T00:00:00.000Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
        message: 'Clinics retrieved successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid query parameters',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({ description: 'Administrator access required' })
  async getAllClinics(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('subscriptionTier') subscriptionTier?: string,
  ): Promise<{
    success: boolean;
    data: {
      clinics: ClinicProfileResponse[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message: string;
  }> {
    // Parse and validate query parameters
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;

    if (pageNum && (pageNum < 1 || isNaN(pageNum))) {
      throw new BadRequestException('Page must be a positive integer');
    }

    if (limitNum && (limitNum < 1 || limitNum > 100 || isNaN(limitNum))) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      throw new BadRequestException('Invalid status filter');
    }

    if (
      subscriptionTier &&
      !['free', 'basic', 'premium', 'enterprise'].includes(subscriptionTier)
    ) {
      throw new BadRequestException('Invalid subscription tier filter');
    }

    const result = await this.clinicsService.getAllClinics({
      page: pageNum,
      limit: limitNum,
      search,
      status,
      subscriptionTier,
    });

    return {
      success: true,
      data: result,
      message: 'Clinics retrieved successfully',
    };
  }

  @Get(':clinicId/stats')
  @RequireClinicAccess()
  @ApiOperation({
    summary: 'Get clinic statistics',
    description:
      'Get clinic statistics including therapists, clients, sessions, and documents count',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Clinic statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          therapists: 5,
          clients: 120,
          sessions: 450,
          documents: 8,
          activeTherapists: 4,
          activeClients: 95,
          thisMonthSessions: 45,
          thisMonthDocuments: 2,
        },
        message: 'Clinic statistics retrieved successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to access this clinic',
  })
  @ApiNotFoundResponse({ description: 'Clinic not found' })
  async getClinicStats(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: {
      therapists: number;
      clients: number;
      sessions: number;
      documents: number;
      activeTherapists: number;
      activeClients: number;
      thisMonthSessions: number;
      thisMonthDocuments: number;
    };
    message: string;
  }> {
    // Validate user has access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    const stats = await this.clinicsService.getClinicStats(clinicId);

    return {
      success: true,
      data: stats,
      message: 'Clinic statistics retrieved successfully',
    };
  }

  @Get(':clinicId')
  @RequireClinicAccess()
  @ApiOperation({
    summary: 'Get clinic profile',
    description:
      'Get detailed clinic profile information including branding and settings',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Clinic profile retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Wellness Therapy Center Jakarta',
          address: 'Jl. Sudirman No. 123, Jakarta Pusat',
          phone: '+6221123456789',
          email: 'contact@wellnesstherapy.co.id',
          website: 'https://www.wellnesstherapy.co.id',
          description: 'Modern therapy center specializing in mental health',
          workingHours: 'Senin - Jumat: 08:00 - 17:00',
          logoUrl: 'https://example.com/logo.png',
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          fontFamily: 'Inter',
          timezone: 'Asia/Jakarta',
          language: 'id',
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: false,
          status: 'active',
          subscriptionTier: 'beta',
          subscriptionExpires: '2024-12-31T23:59:59.000Z',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-15T00:00:00.000Z',
        },
        message: 'Clinic profile retrieved successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to access this clinic',
  })
  @ApiNotFoundResponse({ description: 'Clinic not found' })
  async getClinicProfile(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: ClinicProfileResponse;
    message: string;
  }> {
    // Validate user has access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    const clinic = await this.clinicsService.getClinicProfile(clinicId);

    return {
      success: true,
      data: clinic,
      message: 'Clinic profile retrieved successfully',
    };
  }

  @Put(':clinicId')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update clinic profile',
    description:
      'Update basic clinic information such as name, address, contact details',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateClinicDto })
  @ApiResponse({
    status: 200,
    description: 'Clinic profile updated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Wellness Therapy Center Jakarta',
          address: 'Jl. Sudirman No. 123, Jakarta Pusat',
          phone: '+6221123456789',
          email: 'contact@wellnesstherapy.co.id',
          website: 'https://www.wellnesstherapy.co.id',
          // ... other fields
        },
        message: 'Clinic profile updated successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to modify this clinic',
  })
  @ApiNotFoundResponse({ description: 'Clinic not found' })
  async updateClinicProfile(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @Body() updateClinicDto: UpdateClinicDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: ClinicProfileResponse;
    message: string;
  }> {
    // Validate user has admin access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    const result = await this.clinicsService.updateClinicProfile(
      clinicId,
      updateClinicDto,
    );

    return {
      success: true,
      data: result.clinic,
      message: result.message,
    };
  }

  @Put(':clinicId/branding')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update clinic branding',
    description:
      'Update clinic branding settings including colors, fonts, and logo',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateBrandingDto })
  @ApiResponse({
    status: 200,
    description: 'Clinic branding updated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          fontFamily: 'Inter',
          logoUrl: 'https://example.com/logo.png',
          // ... other fields
        },
        message: 'Clinic branding updated successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to modify this clinic',
  })
  @ApiNotFoundResponse({ description: 'Clinic not found' })
  async updateClinicBranding(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @Body() updateBrandingDto: UpdateBrandingDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: ClinicProfileResponse;
    message: string;
  }> {
    // Validate user has admin access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    const result = await this.clinicsService.updateClinicBranding(
      clinicId,
      updateBrandingDto,
    );

    return {
      success: true,
      data: result.clinic,
      message: result.message,
    };
  }

  @Put(':clinicId/settings')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update clinic settings',
    description:
      'Update clinic operational settings including timezone, language, and notifications',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Clinic settings updated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          timezone: 'Asia/Jakarta',
          language: 'id',
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: false,
          // ... other fields
        },
        message: 'Clinic settings updated successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to modify this clinic',
  })
  @ApiNotFoundResponse({ description: 'Clinic not found' })
  async updateClinicSettings(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: ClinicProfileResponse;
    message: string;
  }> {
    // Validate user has admin access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    const result = await this.clinicsService.updateClinicSettings(
      clinicId,
      updateSettingsDto,
    );

    return {
      success: true,
      data: result.clinic,
      message: result.message,
    };
  }

  @Get(':clinicId/documents')
  @RequireClinicAccess()
  @ApiOperation({
    summary: 'Get clinic documents (placeholder)',
    description:
      'Get all clinic documents - placeholder endpoint for future document management',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 400,
    description: 'Document management not yet implemented',
    schema: {
      example: {
        success: false,
        message: 'Document management functionality is not yet implemented',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to access this clinic',
  })
  async getClinicDocuments(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data?: ClinicDocumentPlaceholder[];
    message: string;
  }> {
    // Validate user has access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    try {
      const documents = await this.clinicsService.getClinicDocuments(clinicId);
      return {
        success: true,
        data: documents,
        message: 'Clinic documents retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post(':clinicId/logo')
  @RequireClinicAccess()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload clinic logo',
    description: 'Upload or update clinic logo image',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Logo file upload',
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file (PNG, JPG, JPEG, max 5MB)',
        },
      },
      required: ['logo'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logo uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          logoUrl: 'https://example.com/uploads/logos/clinic-123-logo.png',
        },
        message: 'Logo uploaded successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to access this clinic',
  })
  @ApiNotFoundResponse({ description: 'Clinic not found' })
  async uploadClinicLogo(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() body: { logo: any },
  ): Promise<{
    success: boolean;
    data: { logoUrl: string };
    message: string;
  }> {
    // Validate user has access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    const result = await this.clinicsService.uploadClinicLogo(
      clinicId,
      body.logo,
    );

    return {
      success: true,
      data: { logoUrl: result.logoUrl },
      message: 'Logo uploaded successfully',
    };
  }

  @Post(':clinicId/documents')
  @RequireAdminOrClinicAdmin()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload clinic document (placeholder)',
    description:
      'Upload clinic document - placeholder endpoint for future file upload',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document file and metadata',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (pdf, jpg, png, max 10MB)',
        },
        documentType: {
          type: 'string',
          enum: ['license', 'certificate', 'insurance', 'tax', 'other'],
          description: 'Type of document being uploaded',
        },
        name: {
          type: 'string',
          description: 'Document name/title',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Document upload not yet implemented',
    schema: {
      example: {
        success: false,
        message: 'Document upload functionality is not yet implemented',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to modify this clinic',
  })
  async uploadClinicDocument(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data?: ClinicDocumentPlaceholder;
    message: string;
  }> {
    // Validate user has admin access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    try {
      const document = await this.clinicsService.uploadClinicDocument(
        clinicId,
        null, // Placeholder for file
        'license', // Placeholder for document type
      );

      return {
        success: true,
        data: document,
        message: 'Document uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Delete(':clinicId/documents/:documentId')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Delete clinic document (placeholder)',
    description:
      'Delete clinic document - placeholder endpoint for future document management',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'documentId',
    description: 'Document ID (UUID)',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 400,
    description: 'Document deletion not yet implemented',
    schema: {
      example: {
        success: false,
        message: 'Document deletion functionality is not yet implemented',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions to modify this clinic',
  })
  async deleteClinicDocument(
    @Param('clinicId', ParseUuidPipe) clinicId: string,
    @Param('documentId', ParseUuidPipe) documentId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    // Validate user has admin access to this clinic
    await this.clinicsService.validateClinicAdminAccess(
      currentUser.id,
      clinicId,
    );

    try {
      const result = await this.clinicsService.deleteClinicDocument(
        clinicId,
        documentId,
      );

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }
}
