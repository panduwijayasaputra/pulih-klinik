// Shared API response interfaces for consistent API structure across all domains

/**
 * Base API response interface for all API operations
 * @template T - The data type returned in successful responses
 */
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

/**
 * Standard error response interface
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Paginated list response interface
 * @template T - The item type in the list
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data?: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  message?: string;
  errorCode?: string;
}

/**
 * Simple list response interface (without pagination)
 * @template T - The item type in the list
 */
export interface ListResponse<T> {
  success: boolean;
  data?: T[];
  message?: string;
  errorCode?: string;
}

/**
 * Single item response interface
 * @template T - The item type
 */
export interface ItemResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

/**
 * Status response interface for operations that don't return data
 */
export interface StatusResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
}

/**
 * File upload response interface
 */
export interface UploadResponse {
  success: boolean;
  data?: {
    fileId: string;
    fileName: string;
    fileSize: number;
    url: string;
    mimeType: string;
  };
  message?: string;
  errorCode?: string;
}

/**
 * Validation response interface
 */
export interface ValidationResponse {
  success: boolean;
  data?: {
    isValid: boolean;
    errors?: ValidationError[];
  };
  message?: string;
  errorCode?: string;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Statistics response interface
 */
export interface StatsResponse<T = Record<string, number>> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  message?: string;
  errorCode?: string;
}

/**
 * Search response interface with filters and sorting
 * @template T - The item type in search results
 */
export interface SearchResponse<T> {
  success: boolean;
  data?: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    query?: string;
    filters?: Record<string, any>;
    sort?: {
      field: string;
      order: 'asc' | 'desc';
    };
  };
  message?: string;
  errorCode?: string;
}

/**
 * Bulk operation response interface
 * @template T - The item type being processed
 */
export interface BulkResponse<T = any> {
  success: boolean;
  data?: {
    processed: number;
    succeeded: number;
    failed: number;
    errors?: Array<{
      item: T;
      error: string;
      code?: string;
    }>;
  };
  message?: string;
  errorCode?: string;
}

/**
 * Progress response interface for long-running operations
 */
export interface ProgressResponse {
  success: boolean;
  data?: {
    progress: number; // 0-100 percentage
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    message?: string;
    estimatedTimeRemaining?: number; // in milliseconds
  };
  message?: string;
  errorCode?: string;
}

/**
 * Health check response interface
 */
export interface HealthResponse {
  success: boolean;
  data?: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version?: string;
    uptime?: number;
    dependencies?: Record<string, 'healthy' | 'unhealthy'>;
  };
  message?: string;
  errorCode?: string;
}

// Common HTTP status codes for better error handling
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// Common error codes for consistent error handling
export enum ApiErrorCode {
  // Authentication & Authorization
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Business Logic
  INSUFFICIENT_CAPACITY = 'INSUFFICIENT_CAPACITY',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // File Upload
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  
  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CARD_VERIFICATION_FAILED = 'CARD_VERIFICATION_FAILED',
  
  // Email
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
}

/**
 * Standard pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

/**
 * Standard sorting parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Standard filter parameters base interface
 */
export interface FilterParams {
  search?: string;
  [key: string]: any;
}

/**
 * Combined query parameters interface
 */
export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

/**
 * API request options interface
 */
export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

/**
 * Generic type helpers for API responses
 */
export type ResponseData<T extends ApiResponse<any>> = T extends ApiResponse<infer U> ? U : never;
export type ResponseSuccess<T> = ApiResponse<T> & { success: true; data: T };
export type ResponseError = ApiResponse<never> & { success: false };
export type ResponseResult<T> = ResponseSuccess<T> | ResponseError;