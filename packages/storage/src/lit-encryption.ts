import { LitNodeClient } from "@lit-protocol/lit-node-client";
import {
  encryptString,
  decryptToString,
  encryptFile,
  decryptToFile,
} from "@lit-protocol/encryption";
import { EncryptedData } from "@evolve/core";
import type { AccessControlConditions } from "@lit-protocol/types";

export interface LitConfig {
  litNetwork?: "cayenne" | "manzano" | "habanero" | "custom";
}

export interface AuthSig {
  sig: string;
  derivedVia: string;
  signedMessage: string;
  address: string;
}

export class LitEncryption {
  private client: LitNodeClient;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(config: LitConfig = {}) {
    this.client = new LitNodeClient({
      litNetwork: config.litNetwork || "cayenne",
    });
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise === null) {
      this.initPromise = this.client.connect().then(() => {
        this.initialized = true;
      });
    }
    return this.initPromise;
  }

  async encryptString(
    str: string,
    accessControlConditions: AccessControlConditions,
  ): Promise<EncryptedData> {
    await this.initialize();

    try {
      const result = await encryptString(
        {
          dataToEncrypt: str,
          accessControlConditions,
        },
        this.client,
      );

      const encryptedData: EncryptedData = {
        encryptedString: result.ciphertext,
        accessControlConditions,
      };

      return encryptedData;
    } catch (error) {
      console.error("Lit encryption error:", error);
      const err = new Error("Failed to encrypt data with Lit Protocol");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async decryptString(
    encryptedData: EncryptedData,
    authSig: AuthSig,
    chain: string = "ethereum",
  ): Promise<string> {
    await this.initialize();

    try {
      const decrypted = await decryptToString(
        {
          ciphertext: encryptedData.encryptedString,
          dataToEncryptHash: "",
          accessControlConditions:
            encryptedData.accessControlConditions as unknown as AccessControlConditions,
          authSig,
          chain,
        },
        this.client,
      );

      return decrypted;
    } catch (error) {
      console.error("Lit decryption error:", error);
      const err = new Error("Failed to decrypt data with Lit Protocol");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async encryptFile(
    file: File | Blob,
    accessControlConditions: AccessControlConditions,
    authSig: AuthSig,
    chain: string = "ethereum",
  ): Promise<EncryptedData> {
    await this.initialize();

    try {
      const result = await encryptFile(
        {
          file,
          accessControlConditions,
          authSig,
          chain,
        },
        this.client,
      );

      return {
        encryptedString: result.ciphertext,
        accessControlConditions,
      };
    } catch (error) {
      console.error("Lit file encryption error:", error);
      const err = new Error("Failed to encrypt file with Lit Protocol");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  async decryptFile(
    encryptedData: EncryptedData,
    authSig: AuthSig,
    chain: string = "ethereum",
  ): Promise<Uint8Array> {
    await this.initialize();

    try {
      const decrypted = await decryptToFile(
        {
          ciphertext: encryptedData.encryptedString,
          dataToEncryptHash: "",
          accessControlConditions:
            encryptedData.accessControlConditions as unknown as AccessControlConditions,
          authSig,
          chain,
        },
        this.client,
      );

      return decrypted;
    } catch (error) {
      console.error("Lit file decryption error:", error);
      const err = new Error("Failed to decrypt file with Lit Protocol");
      Object.defineProperty(err, "cause", { value: error, configurable: true });
      throw err;
    }
  }

  createAddressAccessCondition(address: string): AccessControlConditions {
    return [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "getBalanceOf",
        parameters: [":userAddress", address],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
  }

  createNFTAccessCondition(
    contractAddress: string,
    tokenId: string,
  ): AccessControlConditions {
    return [
      {
        contractAddress,
        standardContractType: "ERC721",
        chain: "ethereum",
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
  }

  createTokenAccessCondition(
    contractAddress: string,
    minBalance: string,
  ): AccessControlConditions {
    return [
      {
        contractAddress,
        standardContractType: "ERC20",
        chain: "ethereum",
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">=",
          value: minBalance,
        },
      },
    ];
  }
}

// Singleton instance
let litEncryptionInstance: LitEncryption | null = null;

export function getLitEncryption(config?: LitConfig): LitEncryption {
  if (!litEncryptionInstance) {
    litEncryptionInstance = new LitEncryption(config);
  }
  return litEncryptionInstance;
}

export function resetLitEncryption(): void {
  litEncryptionInstance = null;
}
