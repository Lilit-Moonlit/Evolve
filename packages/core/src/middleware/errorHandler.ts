/**
 * Error handling middleware for Evolve
 */

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_ERROR",
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT_ERROR");
    this.name = "ConflictError";
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
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
export function createErrorResponse(error: AppError): ErrorResponse {
  return {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Handle async errors in route handlers
 */
export function asyncHandler<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T): (...args: Parameters<T>) => Promise<unknown> {
  return (...args: Parameters<T>) => {
    return Promise.resolve(fn(...args)).catch((error) => {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error.message || "An unexpected error occurred",
        500,
        "INTERNAL_ERROR",
      );
    });
  };
}

/**
 * Wrap function with error handling
 */
export function withErrorHandler<T extends (...args: unknown[]) => unknown>(
  fn: T,
  errorHandler?: (error: Error) => void,
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          if (errorHandler) {
            errorHandler(error);
          } else {
            console.error("Unhandled error:", error);
          }
          throw error;
        });
      }
      return result;
    } catch (error) {
      if (errorHandler) {
        errorHandler(error as Error);
      } else {
        console.error("Unhandled error:", error);
      }
      throw error;
    }
  }) as T;
}

/**
 * Log error
 */
export function logError(
  error: Error,
  context?: Record<string, unknown>,
): void {
  const errorLog = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };
  console.error("Error:", errorLog);
}

/**
 * Format error for display
 */
export function formatError(error: Error): string {
  if (error instanceof AppError) {
    return `${error.code}: ${error.message}`;
  }
  return error.message;
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes("network") ||
    error.message.includes("fetch") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("ENOTFOUND")
  );
}

/**
 * Check if error is timeout error
 */
export function isTimeoutError(error: Error): boolean {
  return (
    error.message.includes("timeout") || error.message.includes("ETIMEDOUT")
  );
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: Error): boolean {
  return error instanceof ValidationError;
}

/**
 * Check if error is authentication error
 */
export function isAuthenticationError(error: Error): boolean {
  return error instanceof AuthenticationError;
}

/**
 * Check if error is authorization error
 */
export function isAuthorizationError(error: Error): boolean {
  return error instanceof AuthorizationError;
}

/**
 * Check if error is not found error
 */
export function isNotFoundError(error: Error): boolean {
  return error instanceof NotFoundError;
}

/**
 * Retry function with error handling
 */
export async function retryWithErrorHandling<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  shouldRetry: (error: Error) => boolean = () => true,
): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (!shouldRetry(lastError) || i === maxRetries - 1) {
        throw lastError;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastError!;
}
