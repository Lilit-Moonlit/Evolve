export interface BridgeConfig {
  network: string;
  contractAddress: string;
}

export interface LayerZeroConfig extends BridgeConfig {
  endpointAddress: string;
  chainId: number;
}

export interface HopBridgeConfig extends BridgeConfig {
  ammWrapper: string;
}

export type SupportedBridges = "layerzero" | "hop";

export interface BridgeTransferRequest {
  bridge: SupportedBridges;
  amount: string;
  recipient: string;
  destinationChainId: number;
}

export type SupportedChains =
  | "arbitrum"
  | "avalanche"
  | "polygon"
  | "optimism"
  | "base";

export interface TransactionReceipt {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  status: "success" | "failed";
}

/**
 * Execute a bridge transfer between two networks.
 * Returns a mock TransactionReceipt for testing purposes.
 * In production, this would interact with actual bridge contracts.
 */
export async function executeBridgeTransfer(
  request: BridgeTransferRequest,
): Promise<TransactionReceipt> {
  // Mock implementation for testing
  // In production, this would call LayerZero/Hop contracts
  const hash = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

  return {
    hash: `0x${hash}`,
    blockNumber: Math.floor(Math.random() * 10000000),
    from: "0x" + "1".repeat(40),
    to: request.recipient,
    status: "success",
  };
}
