import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService, UploadResult } from './upload.service';
import { JwtAuthGuard } from '../auth/guards';
import { ApiResponse as CustomApiResponse } from '../common/dto/api-response.dto';

@ApiTags('File Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('users/:userId/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload user avatar',
    description: 'Upload or update user profile avatar image',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (JPEG, PNG, GIF, WebP, max 10MB)',
        },
      },
      required: ['avatar'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Avatar uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          fileId: '12345678-1234-1234-1234-123456789abc',
          fileName: '12345678-1234-1234-1234-123456789abc.jpg',
          originalName: 'avatar.jpg',
          mimeType: 'image/jpeg',
          size: 154876,
          url: 'http://localhost:3000/uploads/avatars/12345678-1234-1234-1234-123456789abc.jpg',
          uploadedAt: '2023-12-01T10:00:00.000Z',
        },
        message: 'Avatar uploaded successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file type or size',
    schema: {
      example: {
        statusCode: 400,
        message: 'File size exceeds 10MB limit',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async uploadUserAvatar(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CustomApiResponse<UploadResult>> {
    const result = await this.uploadService.uploadUserAvatar(userId, file);
    return CustomApiResponse.success(result, 'Avatar uploaded successfully');
  }

  @Post('clinics/:clinicId/logo')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload clinic logo',
    description: 'Upload or update clinic logo image',
  })
  @ApiParam({
    name: 'clinicId',
    description: 'Clinic ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file (JPEG, PNG, GIF, WebP, max 10MB)',
        },
      },
      required: ['logo'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logo uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          fileId: '87654321-4321-4321-4321-876543210def',
          fileName: '87654321-4321-4321-4321-876543210def.png',
          originalName: 'clinic-logo.png',
          mimeType: 'image/png',
          size: 89234,
          url: 'http://localhost:3000/uploads/logos/87654321-4321-4321-4321-876543210def.png',
          uploadedAt: '2023-12-01T10:00:00.000Z',
        },
        message: 'Logo uploaded successfully',
      },
    },
  })
  async uploadClinicLogo(
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CustomApiResponse<UploadResult>> {
    const result = await this.uploadService.uploadClinicLogo(clinicId, file);
    return CustomApiResponse.success(result, 'Logo uploaded successfully');
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('document'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload single document',
    description: 'Upload a single document file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
          description: 'Document file (PDF, DOC, DOCX, JPEG, PNG, max 10MB)',
        },
      },
      required: ['document'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document uploaded successfully',
  })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CustomApiResponse<UploadResult>> {
    const result = await this.uploadService.uploadDocument(file);
    return CustomApiResponse.success(result, 'Document uploaded successfully');
  }

  @Post('documents/multiple')
  @UseInterceptors(FilesInterceptor('documents', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload multiple documents',
    description: 'Upload multiple document files (max 10 files)',
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
          description:
            'Document files (PDF, DOC, DOCX, JPEG, PNG, max 10MB each)',
        },
      },
      required: ['documents'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documents uploaded successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            fileId: '11111111-1111-1111-1111-111111111111',
            fileName: '11111111-1111-1111-1111-111111111111.pdf',
            originalName: 'license.pdf',
            mimeType: 'application/pdf',
            size: 234567,
            url: 'http://localhost:3000/uploads/documents/11111111-1111-1111-1111-111111111111.pdf',
            uploadedAt: '2023-12-01T10:00:00.000Z',
          },
          {
            fileId: '22222222-2222-2222-2222-222222222222',
            fileName: '22222222-2222-2222-2222-222222222222.jpg',
            originalName: 'certificate.jpg',
            mimeType: 'image/jpeg',
            size: 345678,
            url: 'http://localhost:3000/uploads/documents/22222222-2222-2222-2222-222222222222.jpg',
            uploadedAt: '2023-12-01T10:00:00.000Z',
          },
        ],
        message: 'Documents uploaded successfully',
      },
    },
  })
  async uploadDocuments(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CustomApiResponse<UploadResult[]>> {
    const results = await this.uploadService.uploadDocuments(files);
    return CustomApiResponse.success(
      results,
      'Documents uploaded successfully',
    );
  }

  @Post('registration/:registrationId/documents')
  @UseInterceptors(FilesInterceptor('documents', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload registration documents',
    description: 'Upload verification documents for registration process',
  })
  @ApiParam({
    name: 'registrationId',
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
          description:
            'Registration documents (PDF, DOC, DOCX, JPEG, PNG, max 10MB each)',
        },
      },
      required: ['documents'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registration documents uploaded successfully',
  })
  async uploadRegistrationDocuments(
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CustomApiResponse<UploadResult[]>> {
    const results = await this.uploadService.uploadDocuments(
      files,
      `registration/${registrationId}`,
    );
    return CustomApiResponse.success(
      results,
      'Registration documents uploaded successfully',
    );
  }

  @Delete('files/:fileId')
  @ApiOperation({
    summary: 'Delete uploaded file',
    description: 'Delete a previously uploaded file',
  })
  @ApiParam({
    name: 'fileId',
    description: 'File ID to delete',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'File deleted successfully',
      },
    },
  })
  async deleteFile(
    @Param('fileId') fileId: string,
  ): Promise<CustomApiResponse<void>> {
    await this.uploadService.deleteFile(fileId);
    return CustomApiResponse.success(undefined, 'File deleted successfully');
  }
}
