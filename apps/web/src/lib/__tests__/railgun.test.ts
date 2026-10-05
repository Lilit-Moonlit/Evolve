import { describe, it, expect, vi } from "vitest";
import { getAddress } from "viem";
import {
  initRailgun,
  shieldEVOLVE,
  unshieldEVOLVE,
  privateTransfer,
  getShieldedBalance,
  isRailgunAddress,
  RailgunError,
  type RailgunEngine,
  type RailgunLoaders,
} from "../railgun";

const TOKEN = getAddress(`0x${"aa".repeat(20)}`);
const FROM = getAddress(`0x${"bb".repeat(20)}`);
const RECIPIENT = getAddress(`0x${"cc".repeat(20)}`);
const ZK_RECIPIENT = `0zk:1:${"ab".repeat(20)}`;
const ONE_WEI = "1000000000000000000";

function makeMockEngine(overrides?: Partial<RailgunEngine>): RailgunEngine {
  return {
    shield: vi.fn(async () => "0xhash-shield"),
    unshield: vi.fn(async () => "0xhash-unshield"),
    privateTransfer: vi.fn(async () => "0xhash-transfer"),
    getShieldedBalance: vi.fn(async () => 10n ** 18n),
    ...overrides,
  };
}

function makeLoaders(engine: RailgunEngine): RailgunLoaders {
  return { loadEngine: vi.fn(async () => engine) };
}

describe("railgun DI wrapper", () => {
  it("rejects an invalid token address (field tokenAddress)", async () => {
    initRailgun(makeLoaders(makeMockEngine()));
    await expect(
      shieldEVOLVE({
        tokenAddress: "0x123" as `0x${string}`,
        amountWei: ONE_WEI,
        fromAddress: FROM,
      }),
    ).rejects.toMatchObject({ name: "RailgunError", field: "tokenAddress" });
  });

  it("rejects zero / malformed amounts (field amountWei)", async () => {
    initRailgun(makeLoaders(makeMockEngine()));
    for (const bad of ["0", "-5", "abc", "1.5", ""]) {
      await expect(
        shieldEVOLVE({ tokenAddress: TOKEN, amountWei: bad, fromAddress: FROM }),
      ).rejects.toMatchObject({ name: "RailgunError", field: "amountWei" });
    }
  });

  it("rejects an invalid sender address (field fromAddress)", async () => {
    initRailgun(makeLoaders(makeMockEngine()));
    await expect(
      shieldEVOLVE({
        tokenAddress: TOKEN,
        amountWei: ONE_WEI,
        fromAddress: "nope" as `0x${string}`,
      }),
    ).rejects.toMatchObject({ name: "RailgunError", field: "fromAddress" });
  });

  it("rejects operations before initRailgun (field engine)", async () => {
    vi.resetModules();
    const fresh = await import("../railgun");
    await expect(
      fresh.shieldEVOLVE({ tokenAddress: TOKEN, amountWei: ONE_WEI, fromAddress: FROM }),
    ).rejects.toMatchObject({ name: "RailgunError", field: "engine" });
  });

  it("initRailgun rejects loaders without loadEngine", () => {
    expect(() => initRailgun({} as RailgunLoaders)).toThrow(RailgunError);
  });

  it("shields via the engine lazily and caches it (loadEngine called exactly once)", async () => {
    const engine = makeMockEngine();
    const loaders = makeLoaders(engine);
    initRailgun(loaders);

    const h1 = await shieldEVOLVE({ tokenAddress: TOKEN, amountWei: ONE_WEI, fromAddress: FROM });
    const h2 = await shieldEVOLVE({ tokenAddress: TOKEN, amountWei: ONE_WEI, fromAddress: FROM });

    expect(h1).toBe("0xhash-shield");
    expect(h2).toBe("0xhash-shield");
    expect(loaders.loadEngine).toHaveBeenCalledTimes(1);
    expect(engine.shield).toHaveBeenCalledTimes(2);
  });

  it("unshields: rejects a bad recipient, returns the engine hash on success", async () => {
    initRailgun(makeLoaders(makeMockEngine()));
    await expect(
      unshieldEVOLVE({
        tokenAddress: TOKEN,
        amountWei: ONE_WEI,
        recipientAddress: "0xzz" as `0x${string}`,
      }),
    ).rejects.toMatchObject({ name: "RailgunError", field: "recipientAddress" });
    const hash = await unshieldEVOLVE({
      tokenAddress: TOKEN,
      amountWei: ONE_WEI,
      recipientAddress: RECIPIENT,
    });
    expect(hash).toBe("0xhash-unshield");
  });

  it("privateTransfer rejects a non-0zk recipient (field recipient0zk)", async () => {
    initRailgun(makeLoaders(makeMockEngine()));
    await expect(
      privateTransfer({ tokenAddress: TOKEN, amountWei: ONE_WEI, recipient0zk: RECIPIENT }),
    ).rejects.toMatchObject({ name: "RailgunError", field: "recipient0zk" });
  });

  it("privateTransfer succeeds with a 0zk recipient", async () => {
    const engine = makeMockEngine();
    initRailgun(makeLoaders(engine));
    const hash = await privateTransfer({
      tokenAddress: TOKEN,
      amountWei: ONE_WEI,
      recipient0zk: ZK_RECIPIENT,
    });
    expect(hash).toBe("0xhash-transfer");
    expect(engine.privateTransfer).toHaveBeenCalledWith({
      tokenAddress: TOKEN,
      amountWei: ONE_WEI,
      recipient0zk: ZK_RECIPIENT,
    });
  });

  it("getShieldedBalance returns a bigint from the engine", async () => {
    initRailgun(makeLoaders(makeMockEngine()));
    const balance = await getShieldedBalance(TOKEN);
    expect(balance).toBe(10n ** 18n);
  });

  it("maps engine failures to RailgunError(field='engine') preserving the message", async () => {
    const engine = makeMockEngine({
      shield: vi.fn(async () => {
        throw new Error("wasm blew up");
      }),
    });
    initRailgun(makeLoaders(engine));
    await expect(
      shieldEVOLVE({ tokenAddress: TOKEN, amountWei: ONE_WEI, fromAddress: FROM }),
    ).rejects.toMatchObject({
      name: "RailgunError",
      field: "engine",
      message: expect.stringContaining("wasm blew up"),
    });
  });

  it("isRailgunAddress accepts 0zk… strings and rejects everything else", () => {
    expect(isRailgunAddress(ZK_RECIPIENT)).toBe(true);
    expect(isRailgunAddress("0zk:2:" + "cd".repeat(20))).toBe(true);
    expect(isRailgunAddress(RECIPIENT)).toBe(false);
    expect(isRailgunAddress("0zk")).toBe(false);
    expect(isRailgunAddress(42)).toBe(false);
    expect(isRailgunAddress(null)).toBe(false);
  });
});
