/**
 * Logging middleware for Evolve
 */
export var LogLevel;
(function (LogLevel) {
  LogLevel["DEBUG"] = "debug";
  LogLevel["INFO"] = "info";
  LogLevel["WARN"] = "warn";
  LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
export class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  log(level, message, context) {
    const entry = {
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
  debug(message, context) {
    this.log(LogLevel.DEBUG, message, context);
  }
  info(message, context) {
    this.log(LogLevel.INFO, message, context);
  }
  warn(message, context) {
    this.log(LogLevel.WARN, message, context);
  }
  error(message, context) {
    this.log(LogLevel.ERROR, message, context);
  }
  getLogs() {
    return [...this.logs];
  }
  clearLogs() {
    this.logs = [];
  }
  getLogsByLevel(level) {
    return this.logs.filter((log) => log.level === level);
  }
}
export const logger = Logger.getInstance();
/**
 * Create a logging middleware
 */
export function createLoggingMiddleware(level = LogLevel.INFO) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
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
export function logExecutionTime(fn, label = "Function") {
  const startTime = Date.now();
  fn();
  const duration = Date.now() - startTime;
  logger.debug(`${label} execution time`, { duration: `${duration}ms` });
}
/**
 * Log API request
 */
export function logApiRequest(method, url, context) {
  logger.info(`API Request: ${method} ${url}`, context);
}
/**
 * Log API response
 */
export function logApiResponse(method, url, statusCode, duration) {
  logger.info(`API Response: ${method} ${url}`, { statusCode, duration });
}
/**
 * Log user action
 */
export function logUserAction(userId, action, context) {
  logger.info(`User Action: ${action}`, { userId, ...context });
}
/**
 * Log error with context
 */
export function logErrorWithContext(error, context) {
  logger.error(error.message, {
    name: error.name,
    stack: error.stack,
    ...context,
  });
}
/**
 * Create a context-aware logger
 */
export function createContextLogger(context) {
  return {
    debug: (message, additionalContext) =>
      logger.debug(message, { ...context, ...additionalContext }),
    info: (message, additionalContext) =>
      logger.info(message, { ...context, ...additionalContext }),
    warn: (message, additionalContext) =>
      logger.warn(message, { ...context, ...additionalContext }),
    error: (message, additionalContext) =>
      logger.error(message, { ...context, ...additionalContext }),
  };
}
//# sourceMappingURL=logger.js.map
