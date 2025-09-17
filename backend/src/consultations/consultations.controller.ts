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
  ConsultationsService,
  ConsultationResponse,
  ConsultationStatsResponse,
} from './consultations.service';
import {
  CreateConsultationDto,
  CreateGeneralConsultationDto,
  CreateDrugAddictionConsultationDto,
  CreateMinorConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
} from './dto/create-consultation.dto';
import {
  RequireAdminOrClinicAdmin,
  RequireAuth,
  RequireClinicAccess,
} from '../auth/decorators/require-role.decorator';
import {
  FormType,
  ConsultationStatus,
} from '../database/entities/consultation.entity';

@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
@RequireAuth()
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Create a new consultation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Consultation created successfully',
    type: Object, // Would be ConsultationResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid consultation data or business rule violation',
  })
  async create(
    @Body() createConsultationDto: CreateConsultationDto,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.create(
      createConsultationDto,
      req.user.clinicId,
    );
  }

  @Post('general')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Create a new general consultation form' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'General consultation created successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid consultation data',
  })
  async createGeneral(
    @Body() createGeneralDto: CreateGeneralConsultationDto,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.create(
      createGeneralDto,
      req.user.clinicId,
    );
  }

  @Post('drug-addiction')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Create a new drug addiction consultation form' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Drug addiction consultation created successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid consultation data',
  })
  async createDrugAddiction(
    @Body() createDrugAddictionDto: CreateDrugAddictionConsultationDto,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.create(
      createDrugAddictionDto,
      req.user.clinicId,
    );
  }

  @Post('minor')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Create a new minor consultation form' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Minor consultation created successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid consultation data',
  })
  async createMinor(
    @Body() createMinorDto: CreateMinorConsultationDto,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.create(createMinorDto, req.user.clinicId);
  }

  @Get()
  @RequireAuth()
  @ApiOperation({ summary: 'Get all consultations with filtering' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, example: 'anxiety' })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'therapistId', required: false })
  @ApiQuery({
    name: 'formTypes',
    required: false,
    enum: FormType,
    isArray: true,
  })
  @ApiQuery({ name: 'status', required: false, enum: ConsultationStatus })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2024-12-31' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultations retrieved successfully',
    type: Object, // Would be paginated ConsultationResponse in a real app
  })
  async findAll(
    @Query() query: ConsultationQueryDto,
    @Request() req: any,
  ): Promise<{
    consultations: ConsultationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.consultationsService.findAll(
      query,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get('statistics')
  @RequireAuth()
  @ApiOperation({ summary: 'Get consultation statistics' })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2024-12-31' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultation statistics retrieved successfully',
    type: Object, // Would be ConsultationStatsResponse in a real app
  })
  async getStatistics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Request() req?: any,
  ): Promise<ConsultationStatsResponse> {
    return this.consultationsService.getStatistics(
      req.user.clinicId,
      req.user.role,
      req.user.id,
      dateFrom,
      dateTo,
    );
  }

  @Get('form-types')
  @RequireAuth()
  @ApiOperation({ summary: 'Get available consultation form types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Form types retrieved successfully',
    type: Object,
  })
  getFormTypes(): {
    formTypes: FormType[];
    descriptions: Record<string, string>;
  } {
    return {
      formTypes: Object.values(FormType),
      descriptions: {
        [FormType.GENERAL]:
          'General consultation form for standard assessments',
        [FormType.DRUG_ADDICTION]: 'Specialized form for drug addiction cases',
        [FormType.MINOR]:
          'Consultation form specifically designed for minor clients',
      },
    };
  }

  @Get('statuses')
  @RequireAuth()
  @ApiOperation({ summary: 'Get available consultation statuses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statuses retrieved successfully',
    type: Object,
  })
  getStatuses(): {
    statuses: ConsultationStatus[];
    descriptions: Record<string, string>;
  } {
    return {
      statuses: Object.values(ConsultationStatus),
      descriptions: {
        [ConsultationStatus.DRAFT]: 'Consultation is being prepared',
        [ConsultationStatus.IN_PROGRESS]: 'Consultation is currently active',
        [ConsultationStatus.COMPLETED]: 'Consultation has been finished',
        [ConsultationStatus.ARCHIVED]: 'Consultation has been archived',
      },
    };
  }

  @Get(':id')
  @RequireAuth()
  @ApiOperation({ summary: 'Get a specific consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultation retrieved successfully',
    type: Object, // Would be ConsultationResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Consultation not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.findOne(id, req.user.clinicId);
  }

  @Put(':id')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Update a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultation updated successfully',
    type: Object, // Would be ConsultationResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Consultation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data or business rule violation',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.update(
      id,
      updateConsultationDto,
      req.user.clinicId,
    );
  }

  @Patch(':id/status')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Update consultation status' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultation status updated successfully',
    type: Object, // Would be ConsultationResponse in a real app
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Consultation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ConsultationStatus,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.updateStatus(
      id,
      status,
      req.user.clinicId,
    );
  }

  @Delete(':id')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Delete a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Consultation deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Consultation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete completed consultations',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<void> {
    return this.consultationsService.remove(id, req.user.clinicId);
  }

  // Additional endpoints for specific operations

  @Get('client/:clientId')
  @RequireAuth()
  @ApiOperation({ summary: 'Get all consultations for a specific client' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'formTypes',
    required: false,
    enum: FormType,
    isArray: true,
  })
  @ApiQuery({ name: 'status', required: false, enum: ConsultationStatus })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client consultations retrieved successfully',
    type: Object,
  })
  async findByClient(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Query() query: Partial<ConsultationQueryDto>,
    @Request() req: any,
  ): Promise<{
    consultations: ConsultationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryWithClient: ConsultationQueryDto = {
      ...query,
      clientId,
      page: query.page || 1,
      limit: query.limit || 20,
    };

    return this.consultationsService.findAll(
      queryWithClient,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get('therapist/:therapistId')
  @RequireAdminOrClinicAdmin()
  @ApiOperation({ summary: 'Get all consultations for a specific therapist' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'formTypes',
    required: false,
    enum: FormType,
    isArray: true,
  })
  @ApiQuery({ name: 'status', required: false, enum: ConsultationStatus })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2024-12-31' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Therapist consultations retrieved successfully',
    type: Object,
  })
  async findByTherapist(
    @Param('therapistId', ParseUUIDPipe) therapistId: string,
    @Query() query: Partial<ConsultationQueryDto>,
    @Request() req: any,
  ): Promise<{
    consultations: ConsultationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryWithTherapist: ConsultationQueryDto = {
      ...query,
      therapistId,
      page: query.page || 1,
      limit: query.limit || 20,
    };

    return this.consultationsService.findAll(
      queryWithTherapist,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get('form-type/:formType')
  @RequireAuth()
  @ApiOperation({ summary: 'Get consultations by form type' })
  @ApiParam({ name: 'formType', description: 'Form Type', enum: FormType })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false, enum: ConsultationStatus })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultations by form type retrieved successfully',
    type: Object,
  })
  async findByFormType(
    @Param('formType') formType: FormType,
    @Query() query: Partial<ConsultationQueryDto>,
    @Request() req: any,
  ): Promise<{
    consultations: ConsultationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryWithFormTypes: ConsultationQueryDto = {
      ...query,
      formTypes: [formType],
      page: query.page || 1,
      limit: query.limit || 20,
    };

    return this.consultationsService.findAll(
      queryWithFormTypes,
      req.user.clinicId,
      req.user.role,
      req.user.id,
    );
  }

  @Get(':id/form-data')
  @RequireAuth()
  @ApiOperation({ summary: 'Get form-specific data for a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultation form data retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Consultation not found',
  })
  async getFormData(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ formTypes: FormType[]; formData: Record<string, any> | null }> {
    const consultation = await this.consultationsService.findOne(
      id,
      req.user.clinicId,
    );
    return {
      formTypes: consultation.formTypes,
      formData: consultation.formData || null,
    };
  }

  @Put(':id/form-data')
  @RequireClinicAccess()
  @ApiOperation({ summary: 'Update form-specific data for a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consultation form data updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Consultation not found',
  })
  async updateFormData(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() formData: Record<string, any>,
    @Request() req: any,
  ): Promise<ConsultationResponse> {
    return this.consultationsService.update(
      id,
      { formData },
      req.user.clinicId,
    );
  }
}
