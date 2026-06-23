/**
 * Logging middleware for Evolve
 */

export enum LogLevel {
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

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const consoleMethod =
      level === LogLevel.ERROR
        ? "error"
        : level === LogLevel.WARN
          ? "warn"
          : "log";
    console[consoleMethod](
      `[${level.toUpperCase()}] ${message}`,
      context || "",
    );
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }
}

export const logger = Logger.getInstance();

/**
 * Create a logging middleware
 */
export function createLoggingMiddleware(level: LogLevel = LogLevel.INFO) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const startTime = Date.now();
      logger.debug(`Starting ${propertyKey}`, { args });

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;
        logger.info(`Completed ${propertyKey}`, { duration });
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`Failed ${propertyKey}`, { error, duration });
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Log function execution time
 */
export function logExecutionTime(
  fn: () => unknown,
  label: string = "Function",
): void {
  const startTime = Date.now();
  fn();
  const duration = Date.now() - startTime;
  logger.debug(`${label} execution time`, { duration: `${duration}ms` });
}

/**
 * Log API request
 */
export function logApiRequest(
  method: string,
  url: string,
  context?: Record<string, unknown>,
): void {
  logger.info(`API Request: ${method} ${url}`, context);
}

/**
 * Log API response
 */
export function logApiResponse(
  method: string,
  url: string,
  statusCode: number,
  duration: number,
): void {
  logger.info(`API Response: ${method} ${url}`, { statusCode, duration });
}

/**
 * Log user action
 */
export function logUserAction(
  userId: string,
  action: string,
  context?: Record<string, unknown>,
): void {
  logger.info(`User Action: ${action}`, { userId, ...context });
}

/**
 * Log error with context
 */
export function logErrorWithContext(
  error: Error,
  context?: Record<string, unknown>,
): void {
  logger.error(error.message, {
    name: error.name,
    stack: error.stack,
    ...context,
  });
}

/**
 * Create a context-aware logger
 */
export function createContextLogger(context: Record<string, unknown>) {
  return {
    debug: (message: string, additionalContext?: Record<string, unknown>) =>
      logger.debug(message, { ...context, ...additionalContext }),
    info: (message: string, additionalContext?: Record<string, unknown>) =>
      logger.info(message, { ...context, ...additionalContext }),
    warn: (message: string, additionalContext?: Record<string, unknown>) =>
      logger.warn(message, { ...context, ...additionalContext }),
    error: (message: string, additionalContext?: Record<string, unknown>) =>
      logger.error(message, { ...context, ...additionalContext }),
  };
}
