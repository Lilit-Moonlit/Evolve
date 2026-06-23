import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("ipfs-http-client", () => ({
  create: vi.fn().mockReturnValue({
    add: vi.fn().mockResolvedValue({
      cid: { toString: () => "QmTest123" },
      size: 100,
    }),
    cat: vi.fn().mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from("test data");
      },
    }),
    pin: {
      add: vi.fn().mockResolvedValue(undefined),
      rm: vi.fn().mockResolvedValue(undefined),
    },
  }),
}));

vi.mock("@evolve/core", () => ({
  IPFS_GATEWAY: "https://ipfs.io/ipfs/",
}));

import { IPFSClient, getIPFSClient } from "./ipfs-client";

describe("IPFSClient", () => {
  let client: IPFSClient;
  let mockClient: any;

  beforeEach(async () => {
    client = new IPFSClient();
    const { create } = await import("ipfs-http-client");
    mockClient = (create as any)();
  });

  describe("upload", () => {
    it("should upload string data", async () => {
      const result = await client.upload("hello world");
      expect(result.cid).toBe("QmTest123");
      expect(result.size).toBe(100);
      expect(result.timestamp).toBeTypeOf("number");
      expect(mockClient.add).toHaveBeenCalledWith("hello world");
    });

    it("should upload object data as JSON", async () => {
      const data = { key: "value" };
      await client.upload(data);
      expect(mockClient.add).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it("should upload Buffer data", async () => {
      const buffer = Buffer.from("test");
      const prevCalls = mockClient.add.mock.calls.length;
      await client.upload(buffer);
      expect(mockClient.add).toHaveBeenCalledTimes(prevCalls + 1);
      const lastCall =
        mockClient.add.mock.calls[mockClient.add.mock.calls.length - 1][0];
      expect(lastCall).toBeDefined();
    });

    it("should throw on upload failure", async () => {
      mockClient.add.mockRejectedValueOnce(new Error("IPFS error"));
      try {
        await client.upload("test");
        expect.fail("Should have thrown");
      } catch (e: any) {
        expect(e.message).toBe("Failed to upload data to IPFS");
        expect(e.cause).toBeInstanceOf(Error);
        expect(e.cause.message).toBe("IPFS error");
      }
    });
  });

  describe("uploadJSON", () => {
    it("should upload JSON object", async () => {
      const data = { foo: "bar" };
      const result = await client.uploadJSON(data);
      expect(result.cid).toBe("QmTest123");
      expect(mockClient.add).toHaveBeenCalledWith(JSON.stringify(data));
    });
  });

  describe("download", () => {
    it("should download data by CID", async () => {
      const result = await client.download("QmTest123");
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString()).toBe("test data");
      expect(mockClient.cat).toHaveBeenCalledWith("QmTest123");
    });

    it("should throw on download failure", async () => {
      mockClient.cat.mockReturnValueOnce({
        [Symbol.asyncIterator]: async function* () {
          throw new Error("Download failed");
        },
      });
      try {
        await client.download("QmBad");
        expect.fail("Should have thrown");
      } catch (e: any) {
        expect(e.message).toBe("Failed to download data from IPFS");
        expect(e.cause).toBeDefined();
      }
    });
  });

  describe("downloadJSON", () => {
    it("should download and parse JSON", async () => {
      const data = { nested: { value: 42 } };
      mockClient.cat.mockReturnValueOnce({
        [Symbol.asyncIterator]: async function* () {
          yield Buffer.from(JSON.stringify(data));
        },
      });
      const result = await client.downloadJSON<typeof data>("QmJson");
      expect(result).toEqual(data);
    });

    it("should throw on invalid JSON", async () => {
      mockClient.cat.mockReturnValueOnce({
        [Symbol.asyncIterator]: async function* () {
          yield Buffer.from("not json");
        },
      });
      await expect(client.downloadJSON("QmBad")).rejects.toThrow();
    });
  });

  describe("uploadFile", () => {
    it("should upload a File object", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const result = await client.uploadFile(file);
      expect(result.cid).toBe("QmTest123");
      expect(mockClient.add).toHaveBeenCalledWith(file);
    });

    it("should throw on file upload failure", async () => {
      mockClient.add.mockRejectedValueOnce(new Error("File error"));
      const file = new File(["content"], "test.txt");
      await expect(client.uploadFile(file)).rejects.toThrow(
        "Failed to upload file to IPFS",
      );
    });
  });

  describe("getGatewayUrl", () => {
    it("should return gateway URL for CID", () => {
      const url = client.getGatewayUrl("QmTest123");
      expect(url).toBe("https://ipfs.io/ipfs/QmTest123");
    });
  });

  describe("pin", () => {
    it("should pin data by CID", async () => {
      await client.pin("QmTest123");
      expect(mockClient.pin.add).toHaveBeenCalledWith("QmTest123");
    });

    it("should throw on pin failure", async () => {
      mockClient.pin.add.mockRejectedValueOnce(new Error("Pin error"));
      await expect(client.pin("QmBad")).rejects.toThrow(
        "Failed to pin data to IPFS",
      );
    });
  });

  describe("unpin", () => {
    it("should unpin data by CID", async () => {
      await client.unpin("QmTest123");
      expect(mockClient.pin.rm).toHaveBeenCalledWith("QmTest123");
    });

    it("should throw on unpin failure", async () => {
      mockClient.pin.rm.mockRejectedValueOnce(new Error("Unpin error"));
      await expect(client.unpin("QmBad")).rejects.toThrow(
        "Failed to unpin data from IPFS",
      );
    });
  });
});

describe("getIPFSClient", () => {
  it("should return same instance on multiple calls", () => {
    const client1 = getIPFSClient();
    const client2 = getIPFSClient();
    expect(client1).toBe(client2);
  });

  it("should return an IPFSClient instance", () => {
    const client = getIPFSClient();
    expect(client).toBeInstanceOf(IPFSClient);
  });
});
