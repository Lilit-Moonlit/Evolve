import { describe, expect, it, vi } from "vitest";
import { grantRegistrationReward } from "../registration-reward";

describe("grantRegistrationReward", () => {
  const REWARD_WEI = 1000000000000000000n;

  it("claim=true + user ethAddress + labWallet → rewarded:true, 2 mints", async () => {
    const deps = {
      getUserById: vi.fn().mockResolvedValue({ ethAddress: "0xUser" }),
      claimRegistrationReward: vi.fn().mockResolvedValue(true),
      mintEvolveAmount: vi.fn().mockResolvedValue("txHash"),
    };
    const result = await grantRegistrationReward({ userId: "u1", labWallet: "0xLab" }, deps);
    expect(result).toEqual({ rewarded: true, userTx: "txHash", labTx: "txHash" });
    expect(deps.mintEvolveAmount).toHaveBeenCalledTimes(2);
    expect(deps.mintEvolveAmount).toHaveBeenCalledWith("0xUser", REWARD_WEI);
    expect(deps.mintEvolveAmount).toHaveBeenCalledWith("0xLab", REWARD_WEI);
  });

  it("claim=false → rewarded:false, 0 mints", async () => {
    const deps = {
      getUserById: vi.fn(),
      claimRegistrationReward: vi.fn().mockResolvedValue(false),
      mintEvolveAmount: vi.fn(),
    };
    const result = await grantRegistrationReward({ userId: "u1" }, deps);
    expect(result).toEqual({ rewarded: false });
    expect(deps.mintEvolveAmount).not.toHaveBeenCalled();
  });

  it("claim=true, user WITHOUT ethAddress, labWallet present → 1 mint (lab only)", async () => {
    const deps = {
      getUserById: vi.fn().mockResolvedValue({ ethAddress: null }),
      claimRegistrationReward: vi.fn().mockResolvedValue(true),
      mintEvolveAmount: vi.fn().mockResolvedValue("txLab"),
    };
    const result = await grantRegistrationReward({ userId: "u1", labWallet: "0xLab" }, deps);
    expect(result).toEqual({ rewarded: true, labTx: "txLab" });
    expect(deps.mintEvolveAmount).toHaveBeenCalledTimes(1);
    expect(deps.mintEvolveAmount).toHaveBeenCalledWith("0xLab", REWARD_WEI);
  });

  it("claim=true, user has ethAddress, labWallet null → 1 mint (user only)", async () => {
    const deps = {
      getUserById: vi.fn().mockResolvedValue({ ethAddress: "0xUser" }),
      claimRegistrationReward: vi.fn().mockResolvedValue(true),
      mintEvolveAmount: vi.fn().mockResolvedValue("txUser"),
    };
    const result = await grantRegistrationReward({ userId: "u1", labWallet: null }, deps);
    expect(result).toEqual({ rewarded: true, userTx: "txUser" });
    expect(deps.mintEvolveAmount).toHaveBeenCalledTimes(1);
    expect(deps.mintEvolveAmount).toHaveBeenCalledWith("0xUser", REWARD_WEI);
  });

  it("claim=true, neither address → rewarded:true, 0 mints", async () => {
    const deps = {
      getUserById: vi.fn().mockResolvedValue({ ethAddress: null }),
      claimRegistrationReward: vi.fn().mockResolvedValue(true),
      mintEvolveAmount: vi.fn(),
    };
    const result = await grantRegistrationReward({ userId: "u1", labWallet: null }, deps);
    expect(result).toEqual({ rewarded: true });
    expect(deps.mintEvolveAmount).not.toHaveBeenCalled();
  });

  it("a mint rejecting → promise rejects, claim called once", async () => {
    const deps = {
      getUserById: vi.fn().mockResolvedValue({ ethAddress: "0xUser" }),
      claimRegistrationReward: vi.fn().mockResolvedValue(true),
      mintEvolveAmount: vi.fn().mockRejectedValue(new Error("Mint failed")),
    };
    await expect(grantRegistrationReward({ userId: "u1" }, deps)).rejects.toThrow("Mint failed");
    expect(deps.claimRegistrationReward).toHaveBeenCalledTimes(1);
  });
});
