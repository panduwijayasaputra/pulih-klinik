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
} from '@nestjs/swagger';
import { ClientsService, ClientResponse } from './clients.service';
import {
  CreateClientDto,
  UpdateClientDto,
  UpdateClientStatusDto,
  UpdateClientProgressDto,
  ClientQueryDto,
} from './dto';
import {
  RequireAdmin,
  RequireAdminOrClinicAdmin,
  RequireAuth,
} from '../auth/decorators/require-role.decorator';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Create a new client',
    description:
      'Create a new client profile with comprehensive demographic information. Only clinic admins and system admins can create clients.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client created successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or missing required fields',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Client with same name and phone already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Clinic not found',
  })
  async createClient(
    @Body() createClientDto: CreateClientDto,
    @Request() req: any,
  ): Promise<ClientResponse> {
    const currentUser = req.user;

    // Get clinic ID from user's role context
    let clinicId: string;
    if (currentUser.roles.includes('administrator')) {
      // System admin needs to specify clinic in body or we use the first available clinic
      // For now, we'll require clinic ID to be passed differently for admins
      throw new Error('System admin must specify target clinic');
    } else {
      // Clinic admin can only create clients in their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;
    }

    return this.clientsService.createClient(
      clinicId,
      createClientDto,
      currentUser.id,
    );
  }

  @Get()
  @RequireAuth()
  @ApiOperation({
    summary: 'Get clients list',
    description:
      'Get a paginated list of clients with comprehensive filtering options. System admins see all clients, clinic admins see their clinic clients, therapists see their assigned clients.',
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
    description: 'Search by name, phone, or email',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['new', 'assigned', 'consultation', 'therapy', 'done'],
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    enum: ['Male', 'Female'],
    description: 'Filter by gender',
  })
  @ApiQuery({
    name: 'religion',
    required: false,
    enum: [
      'Islam',
      'Christianity',
      'Catholicism',
      'Hinduism',
      'Buddhism',
      'Konghucu',
      'Other',
    ],
    description: 'Filter by religion',
  })
  @ApiQuery({
    name: 'education',
    required: false,
    enum: [
      'Elementary',
      'Middle',
      'High School',
      'Associate',
      'Bachelor',
      'Master',
      'Doctorate',
    ],
    description: 'Filter by education',
  })
  @ApiQuery({
    name: 'maritalStatus',
    required: false,
    enum: ['Single', 'Married', 'Widowed'],
    description: 'Filter by marital status',
  })
  @ApiQuery({
    name: 'province',
    required: false,
    type: 'string',
    description: 'Filter by province',
  })
  @ApiQuery({
    name: 'minAge',
    required: false,
    type: 'number',
    description: 'Minimum age filter',
  })
  @ApiQuery({
    name: 'maxAge',
    required: false,
    type: 'number',
    description: 'Maximum age filter',
  })
  @ApiQuery({
    name: 'isMinor',
    required: false,
    type: 'boolean',
    description: 'Filter by minor status',
  })
  @ApiQuery({
    name: 'firstVisit',
    required: false,
    type: 'boolean',
    description: 'Filter by first visit status',
  })
  @ApiQuery({
    name: 'minProgress',
    required: false,
    type: 'number',
    description: 'Minimum progress percentage',
  })
  @ApiQuery({
    name: 'maxProgress',
    required: false,
    type: 'number',
    description: 'Maximum progress percentage',
  })
  @ApiQuery({
    name: 'minSessions',
    required: false,
    type: 'number',
    description: 'Minimum total sessions',
  })
  @ApiQuery({
    name: 'joinDateFrom',
    required: false,
    type: 'string',
    description: 'Join date from (ISO format)',
  })
  @ApiQuery({
    name: 'joinDateTo',
    required: false,
    type: 'string',
    description: 'Join date to (ISO format)',
  })
  @ApiQuery({
    name: 'lastSessionDateFrom',
    required: false,
    type: 'string',
    description: 'Last session date from (ISO format)',
  })
  @ApiQuery({
    name: 'lastSessionDateTo',
    required: false,
    type: 'string',
    description: 'Last session date to (ISO format)',
  })
  @ApiQuery({
    name: 'therapistId',
    required: false,
    type: 'string',
    description: 'Filter by assigned therapist',
  })
  @ApiQuery({
    name: 'hasEmergencyContact',
    required: false,
    type: 'boolean',
    description: 'Filter by emergency contact presence',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [
      'fullName',
      'joinDate',
      'lastSessionDate',
      'birthDate',
      'status',
      'progress',
      'totalSessions',
    ],
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
    description: 'Clients retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        clients: {
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
  async getClients(@Query() query: ClientQueryDto, @Request() req: any) {
    const currentUser = req.user;

    // Determine clinic scope based on user role
    let clinicId: string | undefined;

    if (currentUser.roles.includes('administrator')) {
      // System admin can specify clinic or see all
      clinicId = query.clinicId;
    } else {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;

      // Therapists can only see their assigned clients
      if (currentUser.roles.includes('therapist')) {
        // TODO: Implement therapist profile lookup
        // For now, therapists see all clients in their clinic
        // query.therapistId = therapistProfile.id;
      }
    }

    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    return this.clientsService.getClients(clinicId, query);
  }

  @Get('all')
  @RequireAdmin()
  @ApiOperation({
    summary: 'Get all clients across all clinics',
    description:
      'System admin endpoint to get clients from all clinics with filtering and pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiQuery({ name: 'status', required: false, type: 'string' })
  @ApiQuery({ name: 'gender', required: false, type: 'string' })
  @ApiQuery({ name: 'religion', required: false, type: 'string' })
  @ApiQuery({ name: 'education', required: false, type: 'string' })
  @ApiQuery({ name: 'maritalStatus', required: false, type: 'string' })
  @ApiQuery({ name: 'province', required: false, type: 'string' })
  @ApiQuery({ name: 'minAge', required: false, type: 'number' })
  @ApiQuery({ name: 'maxAge', required: false, type: 'number' })
  @ApiQuery({ name: 'isMinor', required: false, type: 'boolean' })
  @ApiQuery({ name: 'clinicId', required: false, type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All clients retrieved successfully',
  })
  async getAllClients(@Query() query: ClientQueryDto) {
    // For admin "all" endpoint, we'll need to modify the service to handle no clinic filtering
    // For now, let's use the existing method with undefined clinicId
    const clinicId = query.clinicId; // Can be undefined for all clinics

    if (clinicId) {
      return this.clientsService.getClients(clinicId, query);
    }

    // TODO: Implement getAllClientsAcrossClinics method in service
    throw new Error('Cross-clinic client retrieval not yet implemented');
  }

  @Get(':id')
  @RequireAuth()
  @ApiOperation({
    summary: 'Get client by ID',
    description:
      'Get a specific client by their ID with full demographic information. Access is scoped to user permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async getClientById(
    @Param('id', ParseUUIDPipe) clientId: string,
    @Request() req: any,
  ): Promise<ClientResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;
    }
    // Admin can access any client (clinicId remains undefined)

    return this.clientsService.getClientById(clientId, clinicId);
  }

  @Put(':id')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update client profile',
    description:
      'Update client demographic and profile information. Only clinic admins and system admins can update clients.',
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Client with same name and phone already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateClient(
    @Param('id', ParseUUIDPipe) clientId: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: any,
  ): Promise<ClientResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;
    }
    // Admin can update any client (clinicId remains undefined)

    return this.clientsService.updateClient(
      clientId,
      updateClientDto,
      clinicId,
    );
  }

  @Patch(':id/status')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update client status',
    description:
      'Update client status with transition tracking and validation. Only clinic admins and system admins can update status.',
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client status updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateClientStatus(
    @Param('id', ParseUUIDPipe) clientId: string,
    @Body() updateStatusDto: UpdateClientStatusDto,
    @Request() req: any,
  ): Promise<ClientResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;
    }

    return this.clientsService.updateClientStatus(
      clientId,
      updateStatusDto,
      currentUser.id,
      clinicId,
    );
  }

  @Patch(':id/progress')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Update client progress',
    description:
      'Update client therapy progress and session information. Only clinic admins and system admins can update progress.',
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client progress updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid progress data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async updateClientProgress(
    @Param('id', ParseUUIDPipe) clientId: string,
    @Body() updateProgressDto: UpdateClientProgressDto,
    @Request() req: any,
  ): Promise<ClientResponse> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;
    }

    return this.clientsService.updateClientProgress(
      clientId,
      updateProgressDto,
      clinicId,
    );
  }

  @Delete(':id')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({
    summary: 'Delete client (soft delete)',
    description:
      'Soft delete client by setting status to done. Only clinic admins and system admins can delete clients.',
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete client with active assignments',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async deleteClient(
    @Param('id', ParseUUIDPipe) clientId: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const currentUser = req.user;

    // Determine clinic scope for access control
    let clinicId: string | undefined;

    if (!currentUser.roles.includes('administrator')) {
      // Non-admin users are restricted to their clinic
      if (!currentUser.clinicId) {
        throw new BadRequestException(
          'User not associated with any clinic. Please contact your administrator to assign you to a clinic.',
        );
      }
      clinicId = currentUser.clinicId;
    }

    return this.clientsService.deleteClient(clientId, clinicId);
  }
}
