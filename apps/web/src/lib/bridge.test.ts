import { describe, it, expect } from "vitest";
import {
  executeBridgeTransfer,
  BridgeTransferRequest,
  TransactionReceipt,
  SupportedChains,
} from "./bridge";

describe("bridge", () => {
  describe("executeBridgeTransfer", () => {
    it("returns TransactionReceipt with correct structure", async () => {
      const request: BridgeTransferRequest = {
        bridge: "layerzero",
        amount: "1".repeat(18), // 1 token with 18 decimals
        recipient: "0x" + "a".repeat(40),
        destinationChainId: 42161, // Arbitrum
      };

      const receipt = await executeBridgeTransfer(request);

      expect(receipt).toHaveProperty("hash");
      expect(receipt).toHaveProperty("blockNumber");
      expect(receipt).toHaveProperty("from");
      expect(receipt).toHaveProperty("to");
      expect(receipt).toHaveProperty("status");
      expect(receipt.status).toBe("success");
      expect(receipt.to).toBe(request.recipient);
      expect(receipt.hash).toMatch(/^0x[a-f0-9]{64}$/);
    });

    it("simulates transfer between Arbitrum and Avalanche", async () => {
      const request: BridgeTransferRequest = {
        bridge: "hop",
        amount: "5000000000000000000", // 5 tokens
        recipient: "0x" + "b".repeat(40),
        destinationChainId: 43114, // Avalanche
      };

      const receipt = await executeBridgeTransfer(request);

      expect(receipt.status).toBe("success");
      expect(receipt.to).toBe(request.recipient);
    });

    it("handles different bridge types", async () => {
      const layerZeroRequest: BridgeTransferRequest = {
        bridge: "layerzero",
        amount: "1000000000000000000",
        recipient: "0x" + "c".repeat(40),
        destinationChainId: 137, // Polygon
      };

      const hopRequest: BridgeTransferRequest = {
        bridge: "hop",
        amount: "2000000000000000000",
        recipient: "0x" + "d".repeat(40),
        destinationChainId: 8453, // Base
      };

      const layerZeroReceipt = await executeBridgeTransfer(layerZeroRequest);
      const hopReceipt = await executeBridgeTransfer(hopRequest);

      expect(layerZeroReceipt.status).toBe("success");
      expect(hopReceipt.status).toBe("success");
    });
  });

  describe("type exports", () => {
    it("SupportedChains includes expected networks", () => {
      const chains: SupportedChains[] = [
        "arbitrum",
        "avalanche",
        "polygon",
        "optimism",
        "base",
      ];
      expect(chains.length).toBe(5);
    });
  });
});
