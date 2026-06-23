import { resetIPFSClient } from "./ipfs-client";
import { resetArweaveClient } from "./arweave-client";
import { resetLitEncryption } from "./lit-encryption";

// Export IPFS client
export * from "./ipfs-client";

// Export Arweave client
export * from "./arweave-client";

// Export Lit encryption
export * from "./lit-encryption";

export * from "./document-manager";

export function resetAllSingletons(): void {
  resetIPFSClient();
  resetArweaveClient();
  resetLitEncryption();
}
