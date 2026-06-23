/**
 * Browser-safe entry point for @evolve/core
 * Exports only code that works in browser environments
 */

// Export all types (platform-agnostic)
export * from "./types";

// Export constants (browser-safe)
export * from "./constants";

// Export browser-safe utilities
export * from "./utils/crypto";
export * from "./utils/formatting";
export * from "./utils/validation";
export * from "./utils/reputation";
export * from "./utils/web3";
export * from "./utils/common";

// Export browser-safe error handling (error classes only)
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  formatError,
  isNetworkError,
  isTimeoutError,
  isValidationError,
  isAuthenticationError,
  isAuthorizationError,
  isNotFoundError,
} from "./middleware/errorHandler";

// Export browser-safe auth helpers (not Express middleware)
export {
  AuthContext,
  AuthToken,
  generateAuthToken,
  verifyAuthToken,
  isAuthenticated,
  hasRole,
  ownsResource,
  requireAuth,
  requireRole,
  requireOwnership,
  hashWalletAddress,
  verifyWalletSignature,
  generateAuthNonce,
  validateWalletAddress,
} from "./middleware/auth";

// Export browser-safe logger (Logger class only, not Express middleware)
export {
  LogLevel,
  LogEntry,
  Logger,
  logger,
  logExecutionTime,
  logUserAction,
  logErrorWithContext,
  createContextLogger,
} from "./middleware/logger";
