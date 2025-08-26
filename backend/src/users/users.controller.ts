import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
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
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CurrentUser,
  RequireSelfOrAdminAccess,
  RequireSelfOnlyAccess,
} from '../auth/decorators';
import { ParseUuidPipe } from '../common/pipes';
import { UsersService, UserProfileResponse } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import type { AuthUser } from '../auth/jwt.strategy';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/profile')
  @RequireSelfOrAdminAccess()
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'Get detailed user profile information including roles and clinic data',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'therapist@example.com',
          isActive: true,
          profile: {
            id: '456e7890-e89b-12d3-a456-426614174001',
            name: 'Dr. Jane Smith',
            phone: '+628123456789',
            address: 'Jl. Sudirman No. 123, Jakarta',
            bio: 'Licensed clinical psychologist with 10+ years experience',
            avatarUrl: 'https://example.com/avatars/jane.jpg',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-15T00:00:00.000Z',
          },
          roles: [
            {
              id: '789e0123-e89b-12d3-a456-426614174002',
              role: 'therapist',
              clinicId: 'abc1234-e89b-12d3-a456-426614174003',
              clinicName: 'Wellness Clinic Jakarta',
              createdAt: '2023-01-01T00:00:00.000Z',
            },
          ],
        },
        message: 'User profile retrieved successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'User or profile not found' })
  async getUserProfile(
    @Param('userId', ParseUuidPipe) userId: string,
    @CurrentUser() _currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: UserProfileResponse;
    message: string;
  }> {
    const profile = await this.usersService.getUserProfile(userId);

    return {
      success: true,
      data: profile,
      message: 'User profile retrieved successfully',
    };
  }

  @Put(':userId/profile')
  @RequireSelfOrAdminAccess()
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Update user profile information such as name, phone, address, and bio',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '456e7890-e89b-12d3-a456-426614174001',
          name: 'Dr. Jane Smith',
          phone: '+628123456789',
          address: 'Jl. Sudirman No. 123, Jakarta',
          bio: 'Licensed clinical psychologist with 10+ years experience',
          avatarUrl: 'https://example.com/avatars/jane.jpg',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-15T00:00:00.000Z',
        },
        message: 'Profile updated successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'User or profile not found' })
  async updateProfile(
    @Param('userId', ParseUuidPipe) userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() _currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    data: UserProfileResponse['profile'];
    message: string;
  }> {
    const result = await this.usersService.updateProfile(
      userId,
      updateProfileDto,
    );

    return {
      success: true,
      data: result.profile,
      message: result.message,
    };
  }

  @Post(':userId/change-password')
  @RequireSelfOnlyAccess()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description: 'Change user password with current password verification',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      example: {
        success: true,
        message: 'Password has been changed successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - invalid current password or password requirements not met',
    schema: {
      example: {
        statusCode: 400,
        message: 'Current password is incorrect',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async changePassword(
    @Param('userId', ParseUuidPipe) userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() _currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const result = await this.usersService.changePassword(
      userId,
      changePasswordDto,
    );

    return {
      success: true,
      message: result.message,
    };
  }

  @Post(':userId/avatar')
  @RequireSelfOrAdminAccess()
  @ApiOperation({
    summary: 'Upload avatar (placeholder)',
    description:
      'Upload user avatar image - placeholder endpoint for future file upload implementation',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (jpg, png, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar upload placeholder response',
    schema: {
      example: {
        success: false,
        message: 'Avatar upload functionality is not yet implemented',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  uploadAvatar(
    @Param('userId', ParseUuidPipe) _userId: string,
    @CurrentUser() _currentUser: AuthUser,
  ): {
    success: boolean;
    message: string;
  } {
    // Placeholder implementation
    throw new BadRequestException(
      'Avatar upload functionality is not yet implemented. Please update the avatarUrl field in your profile for now.',
    );
  }
}
