export class P2pError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    cause?: unknown,
  ) {
    super(message);
    if (cause !== undefined) {
      Object.defineProperty(this, "cause", {
        value: cause,
        configurable: true,
      });
    }
    this.name = "P2pError";
  }
}

export class InitializationError extends P2pError {
  constructor(message: string, cause?: unknown) {
    super(message, "INITIALIZATION_ERROR", cause);
    this.name = "InitializationError";
  }
}

export class NotInitializedError extends P2pError {
  constructor(component: string, cause?: unknown) {
    super(`${component} is not initialized`, "NOT_INITIALIZED", cause);
    this.name = "NotInitializedError";
  }
}

export class ConnectionError extends P2pError {
  constructor(message: string, cause?: unknown) {
    super(message, "CONNECTION_ERROR", cause);
    this.name = "ConnectionError";
  }
}

export class PublishError extends P2pError {
  constructor(message: string, cause?: unknown) {
    super(message, "PUBLISH_ERROR", cause);
    this.name = "PublishError";
  }
}

export class SubscribeError extends P2pError {
  constructor(message: string, cause?: unknown) {
    super(message, "SUBSCRIBE_ERROR", cause);
    this.name = "SubscribeError";
  }
}

export class CryptographyError extends P2pError {
  constructor(message: string, cause?: unknown) {
    super(message, "CRYPTOGRAPHY_ERROR", cause);
    this.name = "CryptographyError";
  }
}
