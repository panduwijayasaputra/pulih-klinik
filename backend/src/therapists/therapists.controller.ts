import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { TherapistsService, TherapistResponse } from './therapists.service';
import {
  CreateTherapistDto,
  UpdateTherapistDto,
  UpdateTherapistStatusDto,
  UpdateTherapistCapacityDto,
  TherapistQueryDto,
} from './dto';
import { VerifyResetTokenDto, ResetPasswordDto } from '../auth/dto';
import {
  RequireAdmin,
  RequireAdminOrClinicAdmin,
  RequireAuth,
} from '../auth/decorators/require-role.decorator';
import { ClientTherapistAssignment } from '../database/entities/client-therapist-assignment.entity';

@ApiTags('Therapists')
@ApiBearerAuth()
@Controller('therapists')
export class TherapistsController {
  constructor(private readonly therapistsService: TherapistsService) {}

  @Post()
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Create a new therapist with user account',
    description:
      'Create a new therapist profile with user account and assign them to a clinic. Only clinic admins and system admins can create therapists.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Therapist created successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists or license number already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found',
  })
  async createTherapist(
    @Body() createTherapistDto: CreateTherapistDto,
    @Request() req: any,
  ): Promise<TherapistResponse> {
    const currentUser = req.user;

    // Get clinic ID from user's role context
    let clinicId: string;
    if (currentUser.roles.includes('administrator')) {
      // System admin needs to specify clinic in body or we use the first available clinic
      // For now, we'll require clinic ID to be passed differently for admins
      throw new Error('System admin must specify target clinic');
    } else {
      // Clinic admin can only create therapists in their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    return await this.therapistsService.createTherapistWithUser(
      clinicId,
      createTherapistDto,
      currentUser.id,
    );
  }

  @Post('check-email')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Check email availability for therapist creation',
    description:
      'Check if email is available for creating a new therapist account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email status checked successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email format',
  })
  async checkEmail(
    @Body() body: { email: string },
    @Request() _req: any,
  ): Promise<{ available: boolean; message: string }> {
    const { email } = body;

    // Check if email already exists
    const existingUser =
      await this.therapistsService.checkEmailAvailability(email);

    if (existingUser) {
      return {
        available: false,
        message: 'Email already exists in the system',
      };
    }

    return {
      available: true,
      message: 'Email is available',
    };
  }

  @Post('create-for-existing-user')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Create therapist record for existing user',
    description:
      'Create a therapist record for an existing user who has therapist role but no therapist record',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Therapist record created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or user not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Therapist record already exists for this user',
  })
  async createTherapistForExistingUser(
    @Body()
    body: {
      userId: string;
      licenseNumber: string;
      licenseType: string;
      joinDate?: string;
      education?: string;
      certifications?: string;
      adminNotes?: string;
    },
    @Request() req: any,
  ): Promise<TherapistResponse> {
    const currentUser = req.user;
    const {
      userId,
      licenseNumber,
      licenseType,
      joinDate,
      education,
      certifications,
      adminNotes,
    } = body;

    // Get clinic ID from user's role context
    let clinicId: string;
    if (currentUser.roles.includes('administrator')) {
      throw new Error('System admin must specify target clinic');
    } else {
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    return await this.therapistsService.createTherapistForExistingUser(
      clinicId,
      userId,
      licenseNumber,
      licenseType,
      joinDate,
      education,
      certifications,
      adminNotes,
    );
  }

  @Get(':id/email-resend-status')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Get email resend status for therapist',
    description:
      'Get current email resend attempts and cooldown status for a therapist',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email resend status retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  async getEmailResendStatus(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
  ): Promise<{
    success: boolean;
    data: {
      attempts: number;
      maxAttempts: number;
      cooldownUntil?: Date;
      canResend: boolean;
      remainingCooldownMs?: number;
    };
    message: string;
  }> {
    const currentUser = req.user;

    // Get clinic ID from user's role context for authorization
    if (!currentUser.roles.includes('administrator')) {
      // Clinic admin can only check status for therapists in their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      // Note: clinicId is used for authorization but not passed to service method
      // as the service method handles its own authorization logic
    }

    const result =
      await this.therapistsService.getEmailResendStatus(therapistId);

    return {
      success: true,
      data: result,
      message: 'Email resend status retrieved successfully',
    };
  }

  @Post(':id/send-verification')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Send email verification to therapist',
    description:
      'Send email verification to a therapist who has not verified their email yet',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification email sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Therapist email already verified',
  })
  async sendEmailVerification(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
  ): Promise<{ success: boolean; message: string }> {
    const currentUser = req.user;

    // Get clinic ID from user's role context
    let clinicId: string | undefined;
    if (currentUser.roles.includes('administrator')) {
      // System admin can send verification to any therapist
      clinicId = undefined;
    } else {
      // Clinic admin can only send verification to therapists in their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    const result = await this.therapistsService.sendEmailVerification(
      therapistId,
      clinicId,
    );

    return {
      success: true,
      message: result.message,
    };
  }

  @Get()
  @RequireAuth()
  @ApiOperation({
    summary: 'Get therapists list',
    description:
      'Get a paginated list of therapists. System admins see all therapists, clinic admins see their clinic therapists, therapists see colleagues.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Items per page (max 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search by name, phone, or license number',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'on_leave', 'suspended', 'pending_setup'],
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'licenseType',
    required: false,
    enum: ['psychologist', 'psychiatrist', 'counselor', 'hypnotherapist'],
    description: 'Filter by license type',
  })
  @ApiQuery({
    name: 'minExperience',
    required: false,
    type: 'number',
    description: 'Minimum years of experience',
  })
  @ApiQuery({
    name: 'hasAvailableCapacity',
    required: false,
    type: 'boolean',
    description: 'Filter by available capacity',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'joinDate', 'yearsOfExperience', 'currentLoad', 'status'],
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'clinicId',
    required: false,
    type: 'string',
    description: 'Filter by clinic (system admin only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapists retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        therapists: {
          type: 'array',
          items: { type: 'object' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async getTherapists(@Query() query: TherapistQueryDto, @Request() req: any) {
    const currentUser = req.user;

    // Determine clinic scope based on user role
    let clinicId: string | undefined;

    if (currentUser.roles.includes('administrator')) {
      // System admin can specify clinic or see all
      clinicId = query.clinicId;
    } else {
      // Non-admin users are restricted to their clinic
      clinicId = currentUser.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
    }

    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    return this.therapistsService.getTherapists(clinicId, query);
  }

  @Get('all')
  @RequireAdmin()
  @ApiOperation({
    summary: 'Get all therapists across all clinics',
    description:
      'System admin endpoint to get therapists from all clinics with filtering and pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiQuery({ name: 'status', required: false, type: 'string' })
  @ApiQuery({ name: 'licenseType', required: false, type: 'string' })
  @ApiQuery({ name: 'minExperience', required: false, type: 'number' })
  @ApiQuery({ name: 'hasAvailableCapacity', required: false, type: 'boolean' })
  @ApiQuery({ name: 'clinicId', required: false, type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All therapists retrieved successfully',
  })
  async getAllTherapists(@Query() query: TherapistQueryDto) {
    // For admin "all" endpoint, we'll need to modify the service to handle no clinic filtering
    // For now, let's use the existing method with undefined clinicId
    const clinicId = query.clinicId; // Can be undefined for all clinics

    if (clinicId) {
      return this.therapistsService.getTherapists(clinicId, query);
    }

    // TODO: Implement getAllTherapistsAcrossClinics method in service
    throw new Error('Cross-clinic therapist retrieval not yet implemented');
  }

  @Get(':id')
  @RequireAuth()
  @ApiOperation({
    summary: 'Get therapist by ID',
    description:
      'Get a specific therapist by their ID. Access is scoped to user permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async getTherapistById(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
  ): Promise<TherapistResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      clinicId = currentUser.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
    }
    // Admin can access any therapist (clinicId remains undefined)

    return this.therapistsService.getTherapistById(therapistId, clinicId);
  }

  @Put(':id')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update therapist profile',
    description:
      'Update therapist profile information. Only clinic admins and system admins can update therapists.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'License number already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateTherapist(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Body() updateTherapistDto: UpdateTherapistDto,
    @Request() req: any,
  ): Promise<TherapistResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }
    // Admin can update any therapist (clinicId remains undefined)

    return this.therapistsService.updateTherapist(
      therapistId,
      updateTherapistDto,
      clinicId,
    );
  }

  @Patch(':id/status')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update therapist status',
    description:
      'Update therapist status (active, inactive, on leave, etc.). Only clinic admins and system admins can update status.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist status updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateTherapistStatus(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Body() updateStatusDto: UpdateTherapistStatusDto,
    @Request() req: any,
  ): Promise<TherapistResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    return this.therapistsService.updateTherapistStatus(
      therapistId,
      updateStatusDto,
      clinicId,
    );
  }

  @Patch(':id/capacity')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update therapist capacity',
    description:
      'Update therapist maximum client capacity. Only clinic admins and system admins can update capacity.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist capacity updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid capacity (cannot be less than current load)',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateTherapistCapacity(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Body() updateCapacityDto: UpdateTherapistCapacityDto,
    @Request() req: any,
  ): Promise<TherapistResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    return this.therapistsService.updateTherapistCapacity(
      therapistId,
      updateCapacityDto,
      clinicId,
    );
  }

  @Delete(':id')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Delete therapist (soft delete)',
    description:
      'Soft delete therapist by setting status to inactive. Only clinic admins and system admins can delete therapists.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete therapist with active client assignments',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async deleteTherapist(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    return this.therapistsService.deleteTherapist(therapistId, clinicId);
  }

  @Get(':id/capacity')
  @RequireAuth()
  @ApiOperation({
    summary: 'Check therapist capacity',
    description: 'Check if therapist has available capacity for new clients.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Capacity status retrieved',
    schema: {
      type: 'object',
      properties: {
        hasAvailableCapacity: { type: 'boolean' },
        currentLoad: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Therapist not found',
  })
  async checkTherapistCapacity(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
  ) {
    const currentUser = req.user;

    // First get the therapist to check clinic access
    let clinicId: string | undefined;
    if (!currentUser.roles.includes('administrator')) {
      clinicId = currentUser.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
    }

    const therapist = await this.therapistsService.getTherapistById(
      therapistId,
      clinicId,
    );
    const hasAvailableCapacity =
      await this.therapistsService.hasAvailableCapacity(therapistId);

    return {
      hasAvailableCapacity,
      currentLoad: therapist.currentLoad,
    };
  }

  // Assignment Management Endpoints

  @Post('assignments/:therapistId/clients/:clientId')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Assign client to therapist',
    description:
      'Assign a client to a therapist. Only clinic admins and system admins can create assignments.',
  })
  @ApiParam({
    name: 'therapistId',
    description: 'Therapist ID',
    type: 'string',
  })
  @ApiParam({ name: 'clientId', description: 'Client ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client assigned to therapist successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Therapist not active or at capacity',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Client already assigned to an active therapist',
  })
  async assignClient(
    @Param('therapistId', ParseUUIDPipe) therapistId: string,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() body: { notes?: string },
    @Request() req: any,
  ): Promise<ClientTherapistAssignment> {
    return this.therapistsService.assignClientToTherapist(
      therapistId,
      clientId,
      req.user.id,
      body.notes,
    );
  }

  @Put('assignments/:assignmentId/transfer/:newTherapistId')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Transfer client to another therapist',
    description: 'Transfer a client from current therapist to a new therapist.',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment ID',
    type: 'string',
  })
  @ApiParam({
    name: 'newTherapistId',
    description: 'New Therapist ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client transferred successfully',
    type: Object,
  })
  async transferClient(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Param('newTherapistId', ParseUUIDPipe) newTherapistId: string,
    @Body() body: { reason: string; notes?: string },
    @Request() req: any,
  ): Promise<ClientTherapistAssignment> {
    return this.therapistsService.transferClient(
      assignmentId,
      newTherapistId,
      req.user.id,
      body.reason,
      body.notes,
    );
  }

  @Patch('assignments/:assignmentId/complete')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Complete client assignment',
    description: 'Mark client assignment as completed (therapy finished).',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignment completed successfully',
    type: Object,
  })
  async completeAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Body() body: { notes?: string },
    @Request() req: any,
  ): Promise<ClientTherapistAssignment> {
    return this.therapistsService.completeClientAssignment(
      assignmentId,
      req.user.id,
      body.notes,
    );
  }

  @Patch('assignments/:assignmentId/cancel')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Cancel client assignment',
    description: 'Cancel an active client assignment.',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignment cancelled successfully',
    type: Object,
  })
  async cancelAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Body() body: { reason: string },
    @Request() req: any,
  ): Promise<ClientTherapistAssignment> {
    return this.therapistsService.cancelClientAssignment(
      assignmentId,
      req.user.id,
      body.reason,
    );
  }

  @Get(':id/assignments')
  @RequireAuth()
  @ApiOperation({
    summary: 'Get therapist assignments',
    description: 'Get client assignments for a specific therapist.',
  })
  @ApiParam({ name: 'id', description: 'Therapist ID', type: 'string' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'completed', 'transferred', 'cancelled'],
    description: 'Filter by assignment status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignments retrieved successfully',
    type: [Object],
  })
  async getTherapistAssignments(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
    @Query('status') status?: string,
  ): Promise<ClientTherapistAssignment[]> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;
    if (!currentUser.roles.includes('administrator')) {
      clinicId = currentUser.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
    }

    return this.therapistsService.getTherapistAssignments(
      therapistId,
      status as any,
      clinicId,
    );
  }

  @Get('clients/:clientId/assignments')
  @RequireAuth()
  @ApiOperation({
    summary: 'Get client assignment history',
    description: 'Get assignment history for a specific client.',
  })
  @ApiParam({ name: 'clientId', description: 'Client ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assignment history retrieved successfully',
    type: [Object],
  })
  async getClientAssignmentHistory(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Request() req: any,
  ): Promise<ClientTherapistAssignment[]> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;
    if (!currentUser.roles.includes('administrator')) {
      clinicId = currentUser.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
    }

    return this.therapistsService.getClientAssignmentHistory(
      clientId,
      clinicId,
    );
  }

  @Get('clients/:clientId/available-therapists')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Get available therapists for client',
    description:
      'Get list of available therapists that can be assigned to a client.',
  })
  @ApiParam({ name: 'clientId', description: 'Client ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Available therapists retrieved successfully',
    type: [Object],
  })
  async getAvailableTherapists(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Request() req: any,
  ) {
    const currentUser = req.user;

    // Get clinic ID from user's role context
    let clinicId: string;
    if (currentUser.roles.includes('administrator')) {
      // For admin, we need to determine client's clinic first
      // This is a simplified approach - in production, you might want to accept clinicId as query param
      throw new Error('System admin must specify clinic ID');
    } else {
      if (!currentUser.clinicId) {
        throw new Error('Clinic admin without clinic ID');
      }
      clinicId = currentUser.clinicId;
    }

    return this.therapistsService.getAvailableTherapistsForAssignment(
      clientId,
      clinicId,
    );
  }

  // === THERAPIST PORTAL ENDPOINTS ===
  // These endpoints provide dedicated views for therapists to manage their assigned clients

  @Get(':id/clients')
  @RequireAuth()
  @ApiOperation({
    summary: "Get therapist's assigned clients",
    description:
      'Get all clients assigned to a specific therapist with detailed information and progress.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['new', 'assigned', 'consultation', 'therapy', 'done'],
    description: 'Filter by client status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search by client name or ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Items per page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist clients retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          items: [
            {
              id: '12345678-1234-1234-1234-123456789abc',
              fullName: 'John Doe',
              status: 'therapy',
              assignedDate: '2023-12-01T10:00:00.000Z',
              lastSessionDate: '2023-12-15T14:30:00.000Z',
              sessionCount: 5,
              progress: 60,
              notes: 'Good progress with anxiety management',
            },
          ],
          total: 12,
          page: 1,
          limit: 10,
          totalPages: 2,
        },
        message: 'Therapist clients retrieved successfully',
      },
    },
  })
  async getTherapistClients(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const currentUser = req.user;

    // Authorization: Only therapists can access their own clients, or clinic admins can access any therapist's clients
    let clinicId: string | undefined;
    if (!currentUser.roles.includes('administrator')) {
      // Check if user has clinic association
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;

      // If user is a therapist, they can only see their own clients
      if (
        currentUser.roles.includes('therapist') &&
        currentUser.id !== therapistId
      ) {
        throw new BadRequestException(
          'Therapists can only access their own clients',
        );
      }
    }

    return this.therapistsService.getTherapistClients(therapistId, {
      status,
      search,
      page,
      limit,
      clinicId,
    });
  }

  @Get(':therapistId/clients/:clientId')
  @RequireAuth()
  @ApiOperation({
    summary: 'Get specific client for therapist',
    description:
      'Get detailed information about a specific client assigned to the therapist.',
  })
  @ApiParam({
    name: 'therapistId',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'clientId',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist client retrieved successfully',
  })
  async getTherapistClient(
    @Param('therapistId', ParseUUIDPipe) therapistId: string,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Request() req: any,
  ) {
    const currentUser = req.user;

    // Authorization check
    let clinicId: string | undefined;
    if (!currentUser.roles.includes('administrator')) {
      // Check if user has clinic association
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;

      // If user is a therapist, they can only access their own clients
      if (
        currentUser.roles.includes('therapist') &&
        currentUser.id !== therapistId
      ) {
        throw new BadRequestException(
          'Therapists can only access their own clients',
        );
      }
    }

    return this.therapistsService.getTherapistClient(
      therapistId,
      clientId,
      clinicId,
    );
  }

  @Put(':therapistId/clients/:clientId/notes')
  @RequireAuth()
  @ApiOperation({
    summary: 'Update client notes',
    description: 'Update therapy notes for a specific client.',
  })
  @ApiParam({
    name: 'therapistId',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'clientId',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client notes updated successfully',
  })
  async updateClientNotes(
    @Param('therapistId', ParseUUIDPipe) therapistId: string,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() body: { notes: string },
    @Request() req: any,
  ) {
    const currentUser = req.user;

    // Authorization: Only the assigned therapist can update their client's notes
    if (!currentUser.roles.includes('administrator')) {
      if (
        currentUser.roles.includes('therapist') &&
        currentUser.id !== therapistId
      ) {
        throw new BadRequestException(
          "Therapists can only update their own clients' notes",
        );
      }
    }

    return this.therapistsService.updateClientNotes(
      therapistId,
      clientId,
      body.notes,
    );
  }

  @Get(':id/stats')
  @RequireAuth()
  @ApiOperation({
    summary: 'Get therapist statistics',
    description:
      'Get comprehensive statistics for a therapist including client counts, session data, and performance metrics.',
  })
  @ApiParam({
    name: 'id',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          totalClients: 25,
          activeClients: 18,
          completedClients: 7,
          totalSessions: 150,
          thisWeekSessions: 12,
          averageProgress: 65,
          clientDistribution: {
            new: 2,
            consultation: 5,
            therapy: 11,
            done: 7,
          },
          monthlyStats: [
            { month: 'Nov', sessions: 45, newClients: 8 },
            { month: 'Dec', sessions: 52, newClients: 6 },
          ],
        },
        message: 'Therapist statistics retrieved successfully',
      },
    },
  })
  async getTherapistStats(
    @Param('id', ParseUUIDPipe) therapistId: string,
    @Request() req: any,
  ) {
    const currentUser = req.user;

    // Authorization
    let clinicId: string | undefined;
    if (!currentUser.roles.includes('administrator')) {
      // Check if user has clinic association
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;

      // If user is a therapist, they can only access their own statistics
      if (
        currentUser.roles.includes('therapist') &&
        currentUser.id !== therapistId
      ) {
        throw new BadRequestException(
          'Therapists can only access their own statistics',
        );
      }
    }

    return this.therapistsService.getTherapistStats(therapistId, clinicId);
  }

  @Post(':therapistId/clients/:clientId/schedule')
  @RequireAuth()
  @ApiOperation({
    summary: 'Schedule session for client',
    description: 'Schedule a new therapy session for a specific client.',
  })
  @ApiParam({
    name: 'therapistId',
    description: 'Therapist ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'clientId',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session scheduled successfully',
  })
  async scheduleSession(
    @Param('therapistId', ParseUUIDPipe) therapistId: string,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body()
    body: {
      scheduledAt: string;
      duration?: number;
      notes?: string;
    },
    @Request() req: any,
  ) {
    const currentUser = req.user;

    // Authorization
    if (!currentUser.roles.includes('administrator')) {
      if (
        currentUser.roles.includes('therapist') &&
        currentUser.id !== therapistId
      ) {
        throw new BadRequestException(
          'Therapists can only schedule sessions for their own clients',
        );
      }
    }

    return this.therapistsService.scheduleClientSession(
      therapistId,
      clientId,
      new Date(body.scheduledAt),
      body.duration,
      body.notes,
    );
  }

  @Post('verify-setup-token')
  @ApiOperation({
    summary: 'Verify therapist setup token',
    description:
      'Verify if a therapist setup token is valid and get therapist information',
  })
  @ApiBody({ type: VerifyResetTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token verification result',
  })
  async verifySetupToken(@Body() verifyTokenDto: VerifyResetTokenDto): Promise<{
    success: boolean;
    data: { valid: boolean; therapist?: any; error?: string };
    message: string;
  }> {
    const result = await this.therapistsService.verifySetupToken(
      verifyTokenDto.token,
    );

    return {
      success: result.valid,
      data: result,
      message: result.valid
        ? 'Token verification completed'
        : 'Token verification failed',
    };
  }

  @Post('complete-setup')
  @ApiOperation({
    summary: 'Complete therapist setup with password',
    description:
      'Complete therapist account setup by setting password using valid setup token',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Therapist setup completed successfully',
  })
  async completeSetup(@Body() resetPasswordDto: ResetPasswordDto): Promise<{
    success: boolean;
    data: { message: string; therapistId?: string };
    message: string;
  }> {
    const result = await this.therapistsService.completeSetup(
      resetPasswordDto.token,
      resetPasswordDto.password,
      resetPasswordDto.confirmPassword,
    );

    return {
      success: true,
      data: result,
      message: 'Setup completed successfully',
    };
  }
}
