import { describe, it, expect, beforeAll } from "vitest";

/**
 * Baseline characterization for the registration-reward claim seam in db.ts.
 *
 * db.ts imports @prisma/client at module level and kicks off an async
 * Postgres connect on import, so the at-most-once claim decision logic is
 * extracted into the pure helper `claimRegistrationRewardInMemory`
 * (mutates the given profile list in place; no file/DB IO) and unit-tested
 * here against the fallback-store semantics.
 *
 * FORCE_FALLBACK=1 is set BEFORE the dynamic import (inside beforeAll) so
 * initializePrisma() short-circuits: no PrismaClient is constructed, no
 * retry stall.
 */
process.env.FORCE_FALLBACK = "1";

let claimRegistrationRewardInMemory: typeof import("../db").claimRegistrationRewardInMemory;

beforeAll(async () => {
  ({ claimRegistrationRewardInMemory } = await import("../db"));
});

describe("claimRegistrationRewardInMemory", () => {
  const mkProfiles = () => [
    { userId: "u1", verifiedStd: true, registrationRewarded: false },
    { userId: "u2", verifiedStd: false, registrationRewarded: false },
    { userId: "u3", verifiedStd: true, registrationRewarded: true },
    { userId: "u4", verifiedStd: true }, // legacy fallback row, no flag yet
  ];

  it("claims once for a verified, unclaimed profile and flips the flag", () => {
    const profiles = mkProfiles();
    expect(claimRegistrationRewardInMemory(profiles, "u1")).toBe(true);
    expect(profiles[0].registrationRewarded).toBe(true);
  });

  it("returns false on a second claim for the same user (at-most-once)", () => {
    const profiles = mkProfiles();
    expect(claimRegistrationRewardInMemory(profiles, "u1")).toBe(true);
    expect(claimRegistrationRewardInMemory(profiles, "u1")).toBe(false);
    expect(profiles[0].registrationRewarded).toBe(true);
  });

  it("returns false when verifiedStd is false and leaves the flag unset", () => {
    const profiles = mkProfiles();
    expect(claimRegistrationRewardInMemory(profiles, "u2")).toBe(false);
    expect(profiles[1].registrationRewarded).toBe(false);
  });

  it("returns false when the reward was already claimed", () => {
    const profiles = mkProfiles();
    expect(claimRegistrationRewardInMemory(profiles, "u3")).toBe(false);
    expect(profiles[2].registrationRewarded).toBe(true);
  });

  it("returns false for a missing profile", () => {
    const profiles = mkProfiles();
    expect(claimRegistrationRewardInMemory(profiles, "nope")).toBe(false);
  });

  it("treats a legacy row without the flag as unclaimed (Prisma @default(false) parity)", () => {
    const profiles = mkProfiles();
    expect(claimRegistrationRewardInMemory(profiles, "u4")).toBe(true);
    expect(profiles[3].registrationRewarded).toBe(true);
    // and still at-most-once afterwards
    expect(claimRegistrationRewardInMemory(profiles, "u4")).toBe(false);
  });

  it("mutates only the matched profile", () => {
    const profiles = mkProfiles();
    claimRegistrationRewardInMemory(profiles, "u1");
    expect(profiles[1]).toEqual({ userId: "u2", verifiedStd: false, registrationRewarded: false });
    expect(profiles[2]).toEqual({ userId: "u3", verifiedStd: true, registrationRewarded: true });
    expect(profiles[3].registrationRewarded).toBeUndefined();
  });

  it("returns false when verifiedStd is missing entirely", () => {
    const profiles = [{ userId: "u9", registrationRewarded: false }];
    expect(claimRegistrationRewardInMemory(profiles, "u9")).toBe(false);
    expect(profiles[0].registrationRewarded).toBe(false);
  });
});
