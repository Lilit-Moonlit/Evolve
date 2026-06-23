/**
 * Error handling middleware for Evolve
 */
/**
 * Custom error class for application errors
 */
export declare class AppError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, unknown> | undefined;
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: Record<string, unknown> | undefined,
  );
}
/**
 * Validation error
 */
export declare class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>);
}
/**
 * Authentication error
 */
export declare class AuthenticationError extends AppError {
  constructor(message?: string);
}
/**
 * Authorization error
 */
export declare class AuthorizationError extends AppError {
  constructor(message?: string);
}
/**
 * Not found error
 */
export declare class NotFoundError extends AppError {
  constructor(message?: string);
}
/**
 * Conflict error
 */
export declare class ConflictError extends AppError {
  constructor(message?: string);
}
/**
 * Rate limit error
 */
export declare class RateLimitError extends AppError {
  constructor(message?: string);
}
/**
 * Error response format
 */
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, unknown>;
    timestamp: string;
  };
}
/**
 * Create error response
 */
export declare function createErrorResponse(error: AppError): ErrorResponse;
/**
 * Handle async errors in route handlers
 */
export declare function asyncHandler<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T): (...args: Parameters<T>) => Promise<unknown>;
/**
 * Wrap function with error handling
 */
export declare function withErrorHandler<
  T extends (...args: unknown[]) => unknown,
>(fn: T, errorHandler?: (error: Error) => void): T;
/**
 * Log error
 */
export declare function logError(
  error: Error,
  context?: Record<string, unknown>,
): void;
/**
 * Format error for display
 */
export declare function formatError(error: Error): string;
/**
 * Check if error is network error
 */
export declare function isNetworkError(error: Error): boolean;
/**
 * Check if error is timeout error
 */
export declare function isTimeoutError(error: Error): boolean;
/**
 * Check if error is validation error
 */
export declare function isValidationError(error: Error): boolean;
/**
 * Check if error is authentication error
 */
export declare function isAuthenticationError(error: Error): boolean;
/**
 * Check if error is authorization error
 */
export declare function isAuthorizationError(error: Error): boolean;
/**
 * Check if error is not found error
 */
export declare function isNotFoundError(error: Error): boolean;
/**
 * Retry function with error handling
 */
export declare function retryWithErrorHandling<T>(
  fn: () => Promise<T>,
  maxRetries?: number,
  shouldRetry?: (error: Error) => boolean,
): Promise<T>;
//# sourceMappingURL=errorHandler.d.ts.map
