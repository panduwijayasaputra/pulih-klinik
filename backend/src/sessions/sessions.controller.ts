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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  SessionsService,
  SessionResponse,
  SessionStatsResponse,
} from './sessions.service';
import { SessionStatus } from '../database/entities/therapy-session.entity';
import {
  CreateSessionDto,
  CreateSessionWithPredictionDto,
  UpdateSessionDto,
  SessionStatusUpdateDto,
  SessionQueryDto,
  SessionStatsQueryDto,
} from './dto';
import {
  RequireAdminOrClinicAdmin,
  RequireAuth,
  RequireClinicAccess,
} from '../auth/decorators/require-role.decorator';

@ApiTags('Therapy Sessions')
@ApiBearerAuth()
@Controller('sessions')
@RequireAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Create a new therapy session' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session created successfully',
    type: Object, // Would be SessionResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid session data or business rule violation',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Session number already exists or scheduling conflict',
  })
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Request() req: any,
  ): Promise<SessionResponse> {
    return this.sessionsService.create(createSessionDto, req.user.clinicId);
  }

  @Post('with-predictions')
  @RequireClinicAccess()
  @ApiOperation({
    summary: 'Create a new therapy session with AI predictions',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session with AI predictions created successfully',
    type: Object, // Would be SessionResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid session data or business rule violation',
  })
  async createWithPredictions(
    @Body() createSessionDto: CreateSessionWithPredictionDto,
    @Request() req: any,
  ): Promise<SessionResponse> {
    return this.sessionsService.create(createSessionDto, req.user.clinicId);
  }

  @Get()
  @RequireAuth()
  @ApiOperation({ summary: 'Get all therapy sessions with filtering' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, example: 'anxiety' })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'therapistId', required: false })
  @ApiQuery({ name: 'status', required: false, example: 'scheduled,completed' })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2024-12-31' })
  @ApiQuery({ name: 'sessionNumberFrom', required: false, example: 1 })
  @ApiQuery({ name: 'sessionNumberTo', required: false, example: 10 })
  @ApiQuery({ name: 'techniques', required: false, example: 'CBT,Mindfulness' })
  @ApiQuery({ name: 'issues', required: false, example: 'anxiety,depression' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'sessionDate' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
  @ApiQuery({ name: 'includePredictions', required: false, example: false })
  @ApiQuery({ name: 'includeStats', required: false, example: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions retrieved successfully',
    type: Object, // Would be paginated SessionResponse in a real app
  })
  async findAll(
    @Query() query: SessionQueryDto,
    @Request() req: any,
  ): Promise<{
    sessions: SessionResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.sessionsService.findAll(
      query,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get('statistics')
  @RequireAuth()
  @ApiOperation({ summary: 'Get therapy session statistics' })
  @ApiQuery({ name: 'therapistId', required: false })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2024-12-31' })
  @ApiQuery({ name: 'groupBy', required: false, example: 'month' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session statistics retrieved successfully',
    type: Object, // Would be SessionStatsResponse in a real app
  })
  async getStatistics(
    @Query() query: SessionStatsQueryDto,
    @Request() req: any,
  ): Promise<SessionStatsResponse> {
    return this.sessionsService.getStatistics(
      query,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get(':id')
  @RequireAuth()
  @ApiOperation({ summary: 'Get a specific therapy session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session retrieved successfully',
    type: Object, // Would be SessionResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<SessionResponse> {
    return this.sessionsService.findOne(id, req.user.clinicId);
  }

  @Put(':id')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Update a therapy session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session updated successfully',
    type: Object, // Would be SessionResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data or business rule violation',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSessionDto: UpdateSessionDto,
    @Request() req: any,
  ): Promise<SessionResponse> {
    return this.sessionsService.update(id, updateSessionDto, req.user.clinicId);
  }

  @Patch(':id/status')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Update session status' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session status updated successfully',
    type: Object, // Would be SessionResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusUpdateDto: SessionStatusUpdateDto,
    @Request() req: any,
  ): Promise<SessionResponse> {
    return this.sessionsService.updateStatus(
      id,
      statusUpdateDto,
      req.user.clinicId,
    );
  }

  @Delete(':id')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Delete a therapy session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Session deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete in-progress or completed sessions',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<void> {
    return this.sessionsService.remove(id, req.user.clinicId);
  }

  // Additional endpoints for session management

  @Get('client/:clientId')
  @RequireAuth()
  @ApiOperation({ summary: 'Get all sessions for a specific client' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'includePredictions', required: false, example: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client sessions retrieved successfully',
    type: Object,
  })
  async findByClient(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Query() query: Partial<SessionQueryDto>,
    @Request() req: any,
  ): Promise<{
    sessions: SessionResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryWithClient: SessionQueryDto = {
      ...query,
      clientId,
      page: query.page || 1,
      limit: query.limit || 20,
    };

    return this.sessionsService.findAll(
      queryWithClient,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get('therapist/:therapistId')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({ summary: 'Get all sessions for a specific therapist' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2024-12-31' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist sessions retrieved successfully',
    type: Object,
  })
  async findByTherapist(
    @Param('therapistId', ParseUUIDPipe) therapistId: string,
    @Query() query: Partial<SessionQueryDto>,
    @Request() req: any,
  ): Promise<{
    sessions: SessionResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryWithTherapist: SessionQueryDto = {
      ...query,
      therapistId,
      page: query.page || 1,
      limit: query.limit || 20,
    };

    return this.sessionsService.findAll(
      queryWithTherapist,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get(':id/predictions')
  @RequireAuth()
  @ApiOperation({ summary: 'Get AI predictions for a specific session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session AI predictions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  async getSessionPredictions(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ predictions: Record<string, any> | null }> {
    const session = await this.sessionsService.findOne(id, req.user.clinicId);
    return { predictions: session.aiPredictions || null };
  }

  @Post(':id/predictions')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Update AI predictions for a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session AI predictions updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  async updateSessionPredictions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() predictions: Record<string, any>,
    @Request() req: any,
  ): Promise<SessionResponse> {
    return this.sessionsService.update(
      id,
      { aiPredictions: predictions },
      req.user.clinicId,
    );
  }

  @Get('upcoming/count')
  @RequireAuth()
  @ApiOperation({ summary: 'Get count of upcoming sessions' })
  @ApiQuery({ name: 'therapistId', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upcoming sessions count retrieved successfully',
    type: Object,
  })
  async getUpcomingCount(
    @Query('therapistId') therapistId?: string,
    @Request() req?: any,
  ): Promise<{ count: number }> {
    const query: SessionQueryDto = {
      status: [SessionStatus.PLANNED, SessionStatus.SCHEDULED],
      therapistId: therapistId,
      page: 1,
      limit: 1,
    };

    const result = await this.sessionsService.findAll(
      query,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );

    return { count: result.total };
  }
}
