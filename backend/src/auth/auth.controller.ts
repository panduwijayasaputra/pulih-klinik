import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService, LoginResult, RefreshResult } from './auth.service';
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyResetTokenDto,
  ChangePasswordDto,
} from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators';
import type { AuthUser } from './jwt.strategy';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password to receive JWT tokens',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        success: true,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            name: 'John Doe',
            isActive: true,
            roles: [
              {
                id: '456e7890-e89b-12d3-a456-426614174001',
                role: 'clinic_admin',
                clinicId: '789e0123-e89b-12d3-a456-426614174002',
                clinicName: 'Example Clinic',
              },
            ],
          },
        },
        message: 'Login successful',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<{
    success: boolean;
    data: LoginResult;
    message: string;
  }> {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      success: true,
      data: result,
      message: 'Login successful',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh JWT tokens',
    description: 'Exchange refresh token for new access and refresh tokens',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        success: true,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        message: 'Token refreshed successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Unauthorized',
      },
    },
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<{
    success: boolean;
    data: RefreshResult;
    message: string;
  }> {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );

    return {
      success: true,
      data: result,
      message: 'Token refreshed successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the authenticated user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          isActive: true,
          roles: [
            {
              id: '456e7890-e89b-12d3-a456-426614174001',
              role: 'clinic_admin',
              clinicId: '789e0123-e89b-12d3-a456-426614174002',
            },
          ],
        },
        message: 'User profile retrieved successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired token',
        error: 'Unauthorized',
      },
    },
  })
  getProfile(@CurrentUser() user: AuthUser): {
    success: boolean;
    data: AuthUser;
    message: string;
  } {
    return {
      success: true,
      data: user,
      message: 'User profile retrieved successfully',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout the authenticated user (client-side token removal)',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        success: true,
        message: 'Logout successful',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired token',
        error: 'Unauthorized',
      },
    },
  })
  logout(): {
    success: boolean;
    message: string;
  } {
    // Note: In a complete implementation, you would invalidate the token
    // by storing it in a blacklist (Redis) or by implementing short-lived tokens
    // with a refresh token rotation strategy

    return {
      success: true,
      message: 'Logout successful',
    };
  }



  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validate JWT token',
    description:
      'Check if the provided JWT token is valid and return user info',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      example: {
        success: true,
        data: {
          isValid: true,
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            isActive: true,
            roles: [
              {
                id: '456e7890-e89b-12d3-a456-426614174001',
                role: 'clinic_admin',
                clinicId: '789e0123-e89b-12d3-a456-426614174002',
              },
            ],
          },
        },
        message: 'Token is valid',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired token',
        error: 'Unauthorized',
      },
    },
  })
  validateToken(@CurrentUser() user: AuthUser): {
    success: boolean;
    data: {
      isValid: boolean;
      user: AuthUser;
    };
    message: string;
  } {
    return {
      success: true,
      data: {
        isValid: true,
        user,
      },
      message: 'Token is valid',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset token to user email address',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset request processed',
    schema: {
      example: {
        success: true,
        data: {
          message:
            'If an account with that email exists, a password reset link has been sent.',
        },
        message: 'Password reset request processed successfully',
      },
    },
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{
    success: boolean;
    data: { message: string };
    message: string;
  }> {
    const result = await this.authService.forgotPassword(
      forgotPasswordDto.email,
    );

    return {
      success: true,
      data: result,
      message: 'Password reset request processed successfully',
    };
  }

  @Post('verify-reset-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify password reset token',
    description: 'Check if password reset token is valid and not expired',
  })
  @ApiBody({ type: VerifyResetTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token verification result',
    schema: {
      example: {
        success: true,
        data: {
          valid: true,
          email: 'user@example.com',
        },
        message: 'Token verification completed',
      },
    },
  })
  async verifyResetToken(
    @Body() verifyResetTokenDto: VerifyResetTokenDto,
  ): Promise<{
    success: boolean;
    data: { valid: boolean; email?: string };
    message: string;
  }> {
    const result = await this.authService.verifyResetToken(
      verifyResetTokenDto.token,
    );

    return {
      success: true,
      data: result,
      message: 'Token verification completed',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password with token',
    description: 'Reset user password using valid reset token',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      example: {
        success: true,
        data: {
          message:
            'Password has been reset successfully. You can now log in with your new password.',
        },
        message: 'Password reset completed successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or passwords do not match',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid or expired reset token',
        error: 'Bad Request',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/v1/auth/reset-password',
      },
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{
    success: boolean;
    data: { message: string };
    message: string;
  }> {
    const result = await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
      resetPasswordDto.confirmPassword,
    );

    return {
      success: true,
      data: result,
      message: 'Password reset completed successfully',
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password for authenticated user',
    description: 'Change password for currently logged-in user',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      example: {
        success: true,
        data: {
          message: 'Password has been changed successfully.',
        },
        message: 'Password change completed successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid or expired token',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Current password incorrect or validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Current password is incorrect',
        error: 'Bad Request',
      },
    },
  })
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{
    success: boolean;
    data: { message: string };
    message: string;
  }> {
    const result = await this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
      changePasswordDto.confirmPassword,
    );

    return {
      success: true,
      data: result,
      message: 'Password change completed successfully',
    };
  }
}
