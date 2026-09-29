import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const FAKE_TX_HASH = "0xfake0000000000000000000000000000000000000000000000000000000000000";
const FAKE_ADMIN = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const FAKE_TO = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const mockWriteContract = vi.fn().mockResolvedValue(FAKE_TX_HASH);
const mockWaitForTx = vi.fn().mockResolvedValue({ transactionHash: FAKE_TX_HASH });

const mockPublicClient = { waitForTransactionReceipt: mockWaitForTx } as any;
const mockWalletClient = {
  writeContract: mockWriteContract,
  account: { address: FAKE_ADMIN },
} as any;

vi.mock("viem", async (importOriginal) => {
  const actual = await importOriginal<typeof import("viem")>();
  return {
    ...actual,
    createPublicClient: vi.fn(() => mockPublicClient),
    createWalletClient: vi.fn(() => mockWalletClient),
  };
});

vi.mock("viem/accounts", () => ({
  privateKeyToAccount: vi.fn(() => ({ address: FAKE_ADMIN })),
}));

describe("adminChain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.ADMIN_PRIVATE_KEY = "0x" + "a".repeat(64);
    delete process.env.CHAIN_ID;
    delete process.env.ADMIN_RPC_URL;
  });

  afterEach(() => {
    delete process.env.ADMIN_PRIVATE_KEY;
    delete process.env.CHAIN_ID;
    delete process.env.ADMIN_RPC_URL;
  });

  it("(a) mintEvolveAmount without ADMIN_PRIVATE_KEY throws", async () => {
    delete process.env.ADMIN_PRIVATE_KEY;
    const { mintEvolveAmount } = await import("../adminChain");
    await expect(mintEvolveAmount(FAKE_TO, 1n * 10n ** 18n)).rejects.toThrow(
      "Admin relay not configured",
    );
  });

  it("(b) mintEvolveAmount routes to RewardMinter.mintReward with the to-address", async () => {
    const { mintEvolveAmount } = await import("../adminChain");
    const hash = await mintEvolveAmount(FAKE_TO, 1n * 10n ** 18n);
    expect(hash).toBe(FAKE_TX_HASH);
    expect(mockWriteContract).toHaveBeenCalledOnce();
    const call = mockWriteContract.mock.calls[0][0];
    expect(call.functionName).toBe("mintReward");
    expect(call.address).toBe("0x0000000000000000000000000000000000000000"); // REWARD_MINTER placeholder
    expect(call.args).toEqual([FAKE_TO]);
  });

  it("(c) mintEvolve routes to mintFaucet", async () => {
    const { mintEvolve } = await import("../adminChain");
    const hash = await mintEvolve(FAKE_TO);
    expect(hash).toBe(FAKE_TX_HASH);
    expect(mockWriteContract).toHaveBeenCalledOnce();
    const call = mockWriteContract.mock.calls[0][0];
    expect(call.functionName).toBe("mintFaucet");
    expect(call.args).toEqual([FAKE_TO]);
  });

  it("(d) mintEvolveAmount rejects amount mismatch (not 1e18)", async () => {
    const { mintEvolveAmount } = await import("../adminChain");
    const badAmount = 2n * 10n ** 18n;
    await expect(mintEvolveAmount(FAKE_TO, badAmount)).rejects.toThrow(/amount mismatch/);
    await expect(mintEvolveAmount(FAKE_TO, 0n)).rejects.toThrow(/amount mismatch/);
    expect(mockWriteContract).not.toHaveBeenCalled();
  });

  it("(e) env CHAIN_ID and ADMIN_RPC_URL override the defaults", async () => {
    process.env.CHAIN_ID = "11155111";
    process.env.ADMIN_RPC_URL = "https://custom-rpc.example.com";
    const { mintEvolve } = await import("../adminChain");
    const hash = await mintEvolve(FAKE_TO);
    expect(hash).toBe(FAKE_TX_HASH);
    expect(mockWriteContract).toHaveBeenCalledOnce();
  });
});
