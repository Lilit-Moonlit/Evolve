import { create } from "ipfs-http-client";
import { StoredData, IPFS_GATEWAY } from "@evolve/core";

export interface IPFSConfig {
  url?: string;
  gateway?: string;
}

export class IPFSClient {
  private client: any;
  private gateway: string;

  constructor(config: IPFSConfig = {}) {
    const url = config.url || "http://localhost:5001";
    this.client = create({ url });
    this.gateway = config.gateway || IPFS_GATEWAY;
  }

  async upload(data: string | Buffer | object): Promise<StoredData> {
    try {
      const content = typeof data === "object" ? JSON.stringify(data) : data;
      const result = await this.client.add(content);

      return {
        cid: result.cid.toString(),
        size: result.size,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("IPFS upload error:", error);
      const err = new Error("Failed to upload data to IPFS");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async uploadJSON(data: object): Promise<StoredData> {
    return this.upload(JSON.stringify(data));
  }

  async download(cid: string): Promise<Buffer> {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error("IPFS download error:", error);
      const err = new Error("Failed to download data from IPFS");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async downloadJSON<T>(cid: string): Promise<T> {
    try {
      const buffer = await this.download(cid);
      return JSON.parse(buffer.toString());
    } catch (error) {
      console.error("IPFS downloadJSON error:", error);
      const err = new Error("Failed to parse JSON data from IPFS");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async uploadFile(file: File): Promise<StoredData> {
    try {
      const result = await this.client.add(file);

      return {
        cid: result.cid.toString(),
        size: result.size,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("IPFS file upload error:", error);
      const err = new Error("Failed to upload file to IPFS");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  getGatewayUrl(cid: string): string {
    return `${this.gateway}${cid}`;
  }

  async pin(cid: string): Promise<void> {
    try {
      await this.client.pin.add(cid);
    } catch (error) {
      console.error("IPFS pin error:", error);
      const err = new Error("Failed to pin data to IPFS");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async unpin(cid: string): Promise<void> {
    try {
      await this.client.pin.rm(cid);
    } catch (error) {
      console.error("IPFS unpin error:", error);
      const err = new Error("Failed to unpin data from IPFS");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }
}

// Singleton instance
let ipfsClientInstance: IPFSClient | null = null;

export function getIPFSClient(config?: IPFSConfig): IPFSClient {
  if (!ipfsClientInstance) {
    ipfsClientInstance = new IPFSClient(config);
  }
  return ipfsClientInstance;
}

export function resetIPFSClient(): void {
  ipfsClientInstance = null;
}
