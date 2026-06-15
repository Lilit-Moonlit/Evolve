import { describe, it, expect } from "vitest";
import { compareDNA } from "./dnaUtils";
import { STRProfile } from "../store/AppContext";

describe("compareDNA", () => {
  const profileA: STRProfile = {
    D3S1358: [15, 18],
    vWA: [16, 17],
    FGA: [21, 24],
  };

  const profileB: STRProfile = {
    D3S1358: [15, 16],
    vWA: [17, 18],
    FGA: [22, 23],
  };

  const profileNoMatch: STRProfile = {
    D3S1358: [10, 11],
    vWA: [12, 13],
    FGA: [14, 15],
  };

  it("should return 100% match for identical profiles", () => {
    const result = compareDNA(profileA, profileA);
    expect(result.matchPercentage).toBe(100);
    expect(result.conclusion).toBe("High probability of kinship");
  });

  it("should calculate partial match correctly", () => {
    const result = compareDNA(profileA, profileB);
    expect(result.matchPercentage).toBeCloseTo(66.67, 1);
  });

  it("should return 0% for completely different profiles", () => {
    const result = compareDNA(profileA, profileNoMatch);
    expect(result.matchPercentage).toBe(0);
    expect(result.conclusion).toBe("No kinship detected");
  });

  it("should handle empty profiles", () => {
    const result = compareDNA({}, {});
    expect(result.matchPercentage).toBe(0);
  });
});
