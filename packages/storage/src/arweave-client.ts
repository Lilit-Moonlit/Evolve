import Arweave from "arweave";
import { StoredData, ARWEAVE_GATEWAY } from "@evolve/core";

export interface ArweaveConfig {
  gateway?: string;
  port?: number;
  protocol?: string;
}

export class ArweaveClient {
  private client: Arweave;
  private gateway: string;

  constructor(config: ArweaveConfig = {}) {
    this.client = Arweave.init({
      host: config.gateway || "arweave.net",
      port: config.port || 443,
      protocol: config.protocol || "https",
    });
    this.gateway = ARWEAVE_GATEWAY;
  }

  async upload(data: string | Buffer | object): Promise<StoredData> {
    try {
      const content = typeof data === "object" ? JSON.stringify(data) : data;
      const transaction = await this.client.createTransaction({
        data: content,
      });

      transaction.addTag("Content-Type", "application/json");
      transaction.addTag("App", "Evolve");
      transaction.addTag("Timestamp", Date.now().toString());

      await this.client.transactions.sign(transaction);
      await this.client.transactions.post(transaction);

      return {
        cid: transaction.id,
        size: Number(transaction.data_size),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Arweave upload error:", error);
      const err = new Error("Failed to upload data to Arweave");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async uploadJSON(data: object): Promise<StoredData> {
    return this.upload(JSON.stringify(data));
  }

  async download(txId: string): Promise<Buffer> {
    try {
      const data = await this.client.transactions.getData(txId, {
        decode: true,
        string: false,
      });
      return Buffer.from(data as Uint8Array);
    } catch (error) {
      console.error("Arweave download error:", error);
      const err = new Error("Failed to download data from Arweave");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async downloadJSON<T>(txId: string): Promise<T> {
    try {
      const buffer = await this.download(txId);
      return JSON.parse(buffer.toString());
    } catch (error) {
      console.error("Arweave downloadJSON error:", error);
      const err = new Error("Failed to parse JSON data from Arweave");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  getGatewayUrl(txId: string): string {
    return `${this.gateway}${txId}`;
  }

  async getTransactionStatus(txId: string): Promise<{
    confirmed: boolean;
    blockHeight?: number;
    blockTimestamp?: number;
  }> {
    try {
      const status = await this.client.transactions.getStatus(txId);
      return {
        confirmed: status.confirmed !== null,
        blockHeight: status.confirmed?.block_height,
      };
    } catch (error) {
      console.error(`Arweave status check error for ${txId}:`, error);
      const err = new Error(`Failed to check transaction status for ${txId}`);
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async waitForConfirmation(
    txId: string,
    timeout: number = 300000,
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getTransactionStatus(txId);
      if (status.confirmed) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error("Transaction confirmation timeout");
  }
}

// Singleton instance
let arweaveClientInstance: ArweaveClient | null = null;

export function getArweaveClient(config?: ArweaveConfig): ArweaveClient {
  if (!arweaveClientInstance) {
    arweaveClientInstance = new ArweaveClient(config);
  }
  return arweaveClientInstance;
}

export function resetArweaveClient(): void {
  arweaveClientInstance = null;
}
