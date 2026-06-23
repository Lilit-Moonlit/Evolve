/**
 * Logging middleware for Evolve
 */
export declare enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
}
export declare class Logger {
  private static instance;
  private logs;
  private maxLogs;
  private constructor();
  static getInstance(): Logger;
  private log;
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  getLogs(): LogEntry[];
  clearLogs(): void;
  getLogsByLevel(level: LogLevel): LogEntry[];
}
export declare const logger: Logger;
/**
 * Create a logging middleware
 */
export declare function createLoggingMiddleware(
  level?: LogLevel,
): (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;
/**
 * Log function execution time
 */
export declare function logExecutionTime(
  fn: () => unknown,
  label?: string,
): void;
/**
 * Log API request
 */
export declare function logApiRequest(
  method: string,
  url: string,
  context?: Record<string, unknown>,
): void;
/**
 * Log API response
 */
export declare function logApiResponse(
  method: string,
  url: string,
  statusCode: number,
  duration: number,
): void;
/**
 * Log user action
 */
export declare function logUserAction(
  userId: string,
  action: string,
  context?: Record<string, unknown>,
): void;
/**
 * Log error with context
 */
export declare function logErrorWithContext(
  error: Error,
  context?: Record<string, unknown>,
): void;
/**
 * Create a context-aware logger
 */
export declare function createContextLogger(context: Record<string, unknown>): {
  debug: (message: string, additionalContext?: Record<string, unknown>) => void;
  info: (message: string, additionalContext?: Record<string, unknown>) => void;
  warn: (message: string, additionalContext?: Record<string, unknown>) => void;
  error: (message: string, additionalContext?: Record<string, unknown>) => void;
};
//# sourceMappingURL=logger.d.ts.map
