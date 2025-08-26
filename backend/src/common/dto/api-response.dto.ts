import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { PaginationMeta } from './pagination.dto';

export class ApiResponse<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Pagination metadata (for paginated responses)',
  })
  meta?: PaginationMeta;

  constructor(
    success: boolean,
    data?: T,
    message?: string,
    meta?: PaginationMeta,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.meta = meta;
  }

  static success<T>(
    data?: T,
    message?: string,
    meta?: PaginationMeta,
  ): ApiResponse<T> {
    return new ApiResponse(true, data, message, meta);
  }

  static error(message: string, data?: any): ApiResponse {
    return new ApiResponse(false, data, message);
  }
}

export class ErrorResponse {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiPropertyOptional({
    description: 'Request timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'Request path',
    example: '/api/v1/users',
  })
  path?: string;

  @ApiPropertyOptional({
    description: 'Validation errors (for validation failures)',
    example: [
      {
        field: 'email',
        message: 'Email must be a valid email address',
      },
    ],
  })
  details?: Array<{
    field: string;
    message: string;
  }>;

  constructor(
    statusCode: number,
    message: string | string[],
    error: string,
    timestamp?: string,
    path?: string,
    details?: Array<{ field: string; message: string }>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.timestamp = timestamp;
    this.path = path;
    this.details = details;
  }
}
