import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;
    let details: Array<{ field: string; message: string }> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;

        // Handle validation errors
        if (responseObj.message && Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          details = this.parseValidationErrors(responseObj.message);
        } else {
          message = responseObj.message || exception.message;
        }

        error = responseObj.error || this.getHttpStatusText(status);
      } else {
        message = exceptionResponse;
        error = this.getHttpStatusText(status);
      }
    } else if (exception instanceof Error) {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';

      // Log the full error for debugging
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );
    } else {
      // Handle unknown exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      error = 'Internal Server Error';

      this.logger.error(
        'Unknown exception occurred',
        JSON.stringify(exception),
        `${request.method} ${request.url}`,
      );
    }

    const timestamp = new Date().toISOString();
    const path = request.url;

    const errorResponse = new ErrorResponse(
      status,
      message,
      error,
      timestamp,
      path,
      details,
    );

    // Log error for monitoring (except for client errors like 400, 401, 403, 404)
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error`,
        JSON.stringify(errorResponse),
        `${request.method} ${request.url}`,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `HTTP ${status} Error`,
        JSON.stringify({ message, path }),
        `${request.method} ${request.url}`,
      );
    }

    response.status(status).json(errorResponse);
  }

  private parseValidationErrors(
    errors: string[],
  ): Array<{ field: string; message: string }> {
    return errors.map((error) => {
      // Try to extract field name from validation error messages
      // Format: "fieldName must be ..." or "fieldName should not be empty"
      const fieldMatch = error.match(/^(\w+)\s+(must|should|cannot)/);
      const field = fieldMatch ? fieldMatch[1] : 'unknown';

      return {
        field,
        message: error,
      };
    });
  }

  private getHttpStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };

    return statusTexts[status] || 'Unknown Error';
  }
}
