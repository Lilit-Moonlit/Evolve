import { describe, it, expect } from "vitest";
import { ConnectionState, ChatMessageStatus } from "./types";
import {
  P2pError,
  InitializationError,
  NotInitializedError,
  ConnectionError,
  PublishError,
  SubscribeError,
  CryptographyError,
} from "./errors";

describe("Types", () => {
  it("should have correct ConnectionState values", () => {
    expect(ConnectionState.Disconnected).toBe("disconnected");
    expect(ConnectionState.Connecting).toBe("connecting");
    expect(ConnectionState.Connected).toBe("connected");
    expect(ConnectionState.Reconnecting).toBe("reconnecting");
  });

  it("should have correct ChatMessageStatus values", () => {
    expect(ChatMessageStatus.Pending).toBe("pending");
    expect(ChatMessageStatus.Sent).toBe("sent");
    expect(ChatMessageStatus.Delivered).toBe("delivered");
    expect(ChatMessageStatus.Read).toBe("read");
    expect(ChatMessageStatus.Failed).toBe("failed");
  });
});

describe("Errors", () => {
  it("P2pError should have correct name and code", () => {
    const error = new P2pError("test", "TEST_CODE");
    expect(error.name).toBe("P2pError");
    expect(error.message).toBe("test");
    expect(error.code).toBe("TEST_CODE");
    expect(error instanceof Error).toBe(true);
  });

  it("InitializationError should have correct code", () => {
    const error = new InitializationError("init failed");
    expect(error.name).toBe("InitializationError");
    expect(error.code).toBe("INITIALIZATION_ERROR");
    expect(error instanceof P2pError).toBe(true);
  });

  it("NotInitializedError should include component name", () => {
    const error = new NotInitializedError("Libp2p node");
    expect(error.message).toBe("Libp2p node is not initialized");
    expect(error.code).toBe("NOT_INITIALIZED");
  });

  it("ConnectionError should have correct code", () => {
    const error = new ConnectionError("connection failed");
    expect(error.code).toBe("CONNECTION_ERROR");
  });

  it("PublishError should have correct code", () => {
    const error = new PublishError("publish failed");
    expect(error.code).toBe("PUBLISH_ERROR");
  });

  it("SubscribeError should have correct code", () => {
    const error = new SubscribeError("subscribe failed");
    expect(error.code).toBe("SUBSCRIBE_ERROR");
  });

  it("CryptographyError should have correct code", () => {
    const error = new CryptographyError("crypto failed");
    expect(error.code).toBe("CRYPTOGRAPHY_ERROR");
  });
});
