import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';
import { PaginationMeta } from '../dto/pagination.dto';

export interface ResponseData<T = any> {
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Skip transformation for raw responses (like file downloads)
        const response = context.switchToHttp().getResponse();
        if (
          response
            .getHeader('Content-Type')
            ?.startsWith('application/octet-stream')
        ) {
          return data;
        }

        // Handle different response types
        if (data === null || data === undefined) {
          return ApiResponse.success(null, 'Operation completed successfully');
        }

        // If data is already wrapped in ApiResponse format, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Handle paginated responses
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return ApiResponse.success(
            data.data,
            data.message || 'Data retrieved successfully',
            data.meta,
          );
        }

        // Handle objects with message property
        if (data && typeof data === 'object' && 'message' in data) {
          const { message, ...rest } = data;
          const responseData = Object.keys(rest).length === 0 ? null : rest;
          return ApiResponse.success(responseData, message);
        }

        // Handle arrays and objects
        if (Array.isArray(data)) {
          return ApiResponse.success(data, 'Data retrieved successfully');
        }

        if (typeof data === 'object') {
          return ApiResponse.success(data, 'Operation completed successfully');
        }

        // Handle primitives
        return ApiResponse.success(data, 'Operation completed successfully');
      }),
    );
  }
}
