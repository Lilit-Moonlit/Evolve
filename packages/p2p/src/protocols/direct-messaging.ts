import type { ILogger } from "../types";

export interface DirectMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  signature?: string;
}

export interface DirectMessageHandler {
  (message: DirectMessage): void;
}

export class DirectMessagingProtocol {
  private handler: DirectMessageHandler | null = null;
  private logger: ILogger;
  private messageHistory: Map<string, DirectMessage> = new Map();

  constructor(logger?: ILogger) {
    this.logger = logger ?? consoleLogger;
  }

  setHandler(handler: DirectMessageHandler): void {
    this.handler = handler;
  }

  async send(
    sendMessage: (to: string, data: unknown) => Promise<void>,
    message: Omit<DirectMessage, "timestamp" | "signature">,
  ): Promise<void> {
    const fullMessage: DirectMessage = {
      ...message,
      timestamp: Date.now(),
    };

    this.messageHistory.set(fullMessage.id, fullMessage);

    try {
      await sendMessage(fullMessage.to, {
        type: "direct-message",
        payload: fullMessage,
      });
      this.logger.debug(
        `Sent direct message ${fullMessage.id} to ${fullMessage.to}`,
      );
    } catch (error) {
      this.messageHistory.delete(fullMessage.id);
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        `Failed to send direct message ${fullMessage.id}: ${errMessage}`,
      );
      throw error;
    }
  }

  async receive(data: unknown): Promise<void> {
    if (!this.isDirectMessage(data)) return;

    const message = data.payload as DirectMessage;

    if (this.handler !== null) {
      this.handler(message);
    }

    this.messageHistory.set(message.id, message);
    this.logger.debug(
      `Received direct message ${message.id} from ${message.from}`,
    );
  }

  getMessageHistory(peerId: string): DirectMessage[] {
    return Array.from(this.messageHistory.values()).filter(
      (msg) => msg.from === peerId || msg.to === peerId,
    );
  }

  clearHistory(): void {
    this.messageHistory.clear();
  }

  private isDirectMessage(
    data: unknown,
  ): data is { type: string; payload: DirectMessage } {
    return (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      (data as Record<string, unknown>).type === "direct-message" &&
      "payload" in data
    );
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) =>
    console.log(`[DirectMessaging] ${message}`, ...args),
  warn: (message, ...args) =>
    console.warn(`[DirectMessaging] ${message}`, ...args),
  error: (message, ...args) =>
    console.error(`[DirectMessaging] ${message}`, ...args),
  debug: (message, ...args) =>
    console.debug(`[DirectMessaging] ${message}`, ...args),
};
