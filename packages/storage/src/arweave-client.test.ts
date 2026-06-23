import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockTransaction, mockArweaveClient } = vi.hoisted(() => ({
  mockTransaction: {
    id: "test-tx-id-123",
    data_size: "100",
    addTag: vi.fn(),
  },
  mockArweaveClient: {
    createTransaction: vi.fn(),
    transactions: {
      sign: vi.fn().mockResolvedValue(undefined),
      post: vi.fn().mockResolvedValue(undefined),
      getData: vi.fn(),
      getStatus: vi.fn(),
    },
  },
}));

vi.mock("arweave", () => ({
  default: {
    init: vi.fn().mockReturnValue(mockArweaveClient),
  },
}));

vi.mock("@evolve/core", () => ({
  ARWEAVE_GATEWAY: "https://arweave.net/",
}));

import { ArweaveClient, getArweaveClient } from "./arweave-client";

describe("ArweaveClient", () => {
  let client: ArweaveClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockArweaveClient.createTransaction = vi
      .fn()
      .mockResolvedValue(mockTransaction);
    mockArweaveClient.transactions.getData = vi
      .fn()
      .mockResolvedValue(new Uint8Array(Buffer.from("test data")));
    mockArweaveClient.transactions.getStatus = vi.fn().mockResolvedValue({
      confirmed: { block_height: 12345, block_timestamp: 1700000000 },
    });
    mockArweaveClient.transactions.sign = vi.fn().mockResolvedValue(undefined);
    mockArweaveClient.transactions.post = vi.fn().mockResolvedValue(undefined);
    mockTransaction.addTag = vi.fn();
    client = new ArweaveClient();
  });

  describe("upload", () => {
    it("should upload string data", async () => {
      const result = await client.upload("hello world");
      expect(result.cid).toBe("test-tx-id-123");
      expect(result.size).toBe(100);
      expect(result.timestamp).toBeTypeOf("number");
    });

    it("should upload object data as JSON", async () => {
      const data = { key: "value" };
      await client.upload(data);
      expect(mockTransaction.addTag).toHaveBeenCalledWith(
        "Content-Type",
        "application/json",
      );
      expect(mockTransaction.addTag).toHaveBeenCalledWith("App", "Evolve");
      expect(mockTransaction.addTag).toHaveBeenCalledWith(
        "Timestamp",
        expect.any(String),
      );
    });

    it("should upload Buffer data", async () => {
      const buffer = Buffer.from("test");
      const result = await client.upload(buffer);
      expect(result.cid).toBe("test-tx-id-123");
    });

    it("should throw on upload failure", async () => {
      mockArweaveClient.createTransaction.mockRejectedValueOnce(
        new Error("Arweave error"),
      );
      await expect(client.upload("test")).rejects.toThrow(
        "Failed to upload data to Arweave",
      );
    });
  });

  describe("uploadJSON", () => {
    it("should upload JSON object", async () => {
      const data = { foo: "bar" };
      const result = await client.uploadJSON(data);
      expect(result.cid).toBe("test-tx-id-123");
    });
  });

  describe("download", () => {
    it("should download data by transaction ID", async () => {
      const result = await client.download("test-tx-id-123");
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe("test data");
    });

    it("should throw on download failure", async () => {
      mockArweaveClient.transactions.getData.mockRejectedValueOnce(
        new Error("Download error"),
      );
      await expect(client.download("bad-tx")).rejects.toThrow(
        "Failed to download data from Arweave",
      );
    });
  });

  describe("downloadJSON", () => {
    it("should download and parse JSON", async () => {
      const data = { nested: { value: 42 } };
      mockArweaveClient.transactions.getData.mockResolvedValueOnce(
        new Uint8Array(Buffer.from(JSON.stringify(data))),
      );
      const result = await client.downloadJSON<typeof data>("test-tx");
      expect(result).toEqual(data);
    });

    it("should throw on invalid JSON", async () => {
      mockArweaveClient.transactions.getData.mockResolvedValueOnce(
        new Uint8Array(Buffer.from("not json")),
      );
      await expect(client.downloadJSON("bad-tx")).rejects.toThrow();
    });
  });

  describe("getGatewayUrl", () => {
    it("should return gateway URL for transaction ID", () => {
      const url = client.getGatewayUrl("test-tx-id");
      expect(url).toBe("https://arweave.net/test-tx-id");
    });
  });

  describe("getTransactionStatus", () => {
    it("should return confirmed status", async () => {
      const status = await client.getTransactionStatus("test-tx-id");
      expect(status.confirmed).toBe(true);
      expect(status.blockHeight).toBe(12345);
    });

    it("should return unconfirmed status", async () => {
      mockArweaveClient.transactions.getStatus.mockResolvedValueOnce({
        confirmed: null,
      });
      const status = await client.getTransactionStatus("pending-tx");
      expect(status.confirmed).toBe(false);
    });

    it("should throw on status check failure", async () => {
      mockArweaveClient.transactions.getStatus.mockRejectedValueOnce(
        new Error("Status error"),
      );
      await expect(client.getTransactionStatus("bad-tx")).rejects.toThrow(
        "Failed to check transaction status",
      );
    });
  });

  describe("waitForConfirmation", () => {
    it("should resolve when confirmed", async () => {
      await expect(
        client.waitForConfirmation("test-tx-id", 10000),
      ).resolves.toBeUndefined();
    });

    it("should throw on timeout", async () => {
      mockArweaveClient.transactions.getStatus.mockResolvedValue({
        confirmed: null,
      });
      await expect(
        client.waitForConfirmation("pending-tx", 100),
      ).rejects.toThrow("Transaction confirmation timeout");
    }, 10000);
  });
});

describe("getArweaveClient", () => {
  it("should return same instance on multiple calls", () => {
    const client1 = getArweaveClient();
    const client2 = getArweaveClient();
    expect(client1).toBe(client2);
  });

  it("should return an ArweaveClient instance", () => {
    const client = getArweaveClient();
    expect(client).toBeInstanceOf(ArweaveClient);
  });
});
