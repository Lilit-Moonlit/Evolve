/**
 * Error handling middleware for Evolve
 */
/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }
}
/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}
/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}
/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}
/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}
/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT_ERROR");
    this.name = "ConflictError";
  }
}
/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_ERROR");
    this.name = "RateLimitError";
  }
}
/**
 * Create error response
 */
export function createErrorResponse(error) {
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
export function asyncHandler(fn) {
  return (...args) => {
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
export function withErrorHandler(fn, errorHandler) {
  return (...args) => {
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
        errorHandler(error);
      } else {
        console.error("Unhandled error:", error);
      }
      throw error;
    }
  };
}
/**
 * Log error
 */
export function logError(error, context) {
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
export function formatError(error) {
  if (error instanceof AppError) {
    return `${error.code}: ${error.message}`;
  }
  return error.message;
}
/**
 * Check if error is network error
 */
export function isNetworkError(error) {
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
export function isTimeoutError(error) {
  return (
    error.message.includes("timeout") || error.message.includes("ETIMEDOUT")
  );
}
/**
 * Check if error is validation error
 */
export function isValidationError(error) {
  return error instanceof ValidationError;
}
/**
 * Check if error is authentication error
 */
export function isAuthenticationError(error) {
  return error instanceof AuthenticationError;
}
/**
 * Check if error is authorization error
 */
export function isAuthorizationError(error) {
  return error instanceof AuthorizationError;
}
/**
 * Check if error is not found error
 */
export function isNotFoundError(error) {
  return error instanceof NotFoundError;
}
/**
 * Retry function with error handling
 */
export async function retryWithErrorHandling(
  fn,
  maxRetries = 3,
  shouldRetry = () => true,
) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!shouldRetry(lastError) || i === maxRetries - 1) {
        throw lastError;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastError;
}
//# sourceMappingURL=errorHandler.js.map
