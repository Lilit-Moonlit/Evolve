import { describe, it, expect } from "vitest";
import { UserProfile } from "../types";
import { calculatePageRank, calculateCompositeReputation } from "./reputation";

// Helper to create a skeleton profile
function createBaseProfile(id: string, votesGiven: string[] = []): UserProfile {
  return {
    id,
    owner: `0x${id}`,
    name: id.toUpperCase(),
    age: 25,
    gender: "female",
    interestedIn: ["male"],
    photos: [],
    interests: [],
    trustScore: 50,
    evolveTokenBalance: 0,
    reputationScore: 1.0,
    votesReceived: 0,
    votesGiven,
    giftsReceivedCount: 0,
    giftsSentCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe("PageRank Reputation System", () => {
  it("should calculate the exact reputation scores matching the user example", () => {
    const profiles: UserProfile[] = [];

    // --- Scenario Setup ---
    // 1. Yana Setup:
    // - 20 ordinary voters vote for Yana. Each of these voters voted ONLY for Yana.
    const yanaVoters: UserProfile[] = [];
    for (let i = 1; i <= 20; i++) {
      yanaVoters.push(createBaseProfile(`yana_voter_${i}`, ["yana"]));
    }
    const yana = createBaseProfile("yana", ["natasha"]); // Yana votes for Natasha

    // 2. Katya Setup:
    // - 5 voters vote for Katya.
    // - For each of these 5 voters, 3 ordinary voters vote for them.
    const katyaVoters: UserProfile[] = [];
    const ordinaryVotersForKatyaVoters: UserProfile[] = [];
    for (let i = 1; i <= 5; i++) {
      const voterId = `katya_voter_${i}`;
      katyaVoters.push(createBaseProfile(voterId, ["katya"]));

      for (let j = 1; j <= 3; j++) {
        ordinaryVotersForKatyaVoters.push(
          createBaseProfile(`ordinary_for_voter_${i}_${j}`, [voterId]),
        );
      }
    }
    const katya = createBaseProfile("katya");

    // 3. Natasha Setup:
    // - Natasha has 1 voter: Yana (reputation 21).
    const natasha = createBaseProfile("natasha");

    // Gather all profiles into the network
    profiles.push(yana, katya, natasha);
    profiles.push(...yanaVoters);
    profiles.push(...katyaVoters);
    profiles.push(...ordinaryVotersForKatyaVoters);

    // --- Run Calculation ---
    const scores = calculatePageRank(profiles, 10, 0.00001);

    // --- Assertions ---
    // Yana: 1 + 20 * (1.0 / 1) = 21
    const yanaScore = scores.get("yana");
    expect(yanaScore).toBeCloseTo(21.0, 1);

    // Each Katya voter has: 1 + 3 * (1.0 / 1) = 4
    // Katya has: 1 + 5 * (4.0 / 1) = 21
    const katyaScore = scores.get("katya");
    expect(katyaScore).toBeCloseTo(21.0, 1);

    // Natasha has: 1 + YanaScore (21) = 22
    const natashaScore = scores.get("natasha");
    expect(natashaScore).toBeCloseTo(22.0, 1);

    // Verify relative rankings
    expect(natashaScore).toBeGreaterThan(yanaScore!);
    expect(natashaScore).toBeGreaterThan(katyaScore!);
  });

  it("should compute correct composite reputation scores based on PageRank and documents", () => {
    const profile = createBaseProfile("test_user");
    profile.trustScore = 100; // full 20 trust score points (100 * 0.2)

    // Case 1: No verifications, base PageRank
    // PageRank score = 1.0 (minimum). Composite = 50% PageRank + 50% (0 + 20 trust) = 50 + 10 = 60
    let composite = calculateCompositeReputation(profile, 1.0, 1.0);
    expect(composite).toBeCloseTo(60.0, 1);

    // Case 2: DNA Verified only
    // PageRank score = 1.0. DNA verified = 40. STD verified = 0. Trust = 20. Total docs/activity = 60.
    // Composite = 50 + (60 * 0.5) = 80
    profile.dnaDocument = {
      ipfsCid: "cid",
      litAccessControl: [],
      hash: "hash",
      dnaVerified: true,
      strLoci: [],
      updatedAt: Date.now(),
    };
    composite = calculateCompositeReputation(profile, 1.0, 1.0);
    expect(composite).toBeCloseTo(80.0, 1);

    // Case 3: Fully verified (DNA + STD)
    // PageRank score = 1.0. DNA = 40, STD = 40, Trust = 20. Total docs/activity = 100.
    // Composite = 50 + 50 = 100
    profile.medicalDocument = {
      ipfsCid: "cid",
      litAccessControl: [],
      hash: "hash",
      stdVerified: true,
      updatedAt: Date.now(),
    };
    composite = calculateCompositeReputation(profile, 1.0, 1.0);
    expect(composite).toBeCloseTo(100.0, 1);
  });
});
