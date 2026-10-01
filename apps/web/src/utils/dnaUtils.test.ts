import { describe, it, expect } from "vitest";
import { compareDNA } from "./dnaUtils";
import { STRProfile } from "../store/AppContext";

describe("compareDNA", () => {
  const profileA: STRProfile = {
    markers: { D3S1358: 15, vWA: 16, FGA: 21 },
  };

  const profileB: STRProfile = {
    markers: { D3S1358: 15, vWA: 16, FGA: 22 },
  };

  const profileNoMatch: STRProfile = {
    markers: { D3S1358: 10, vWA: 12, FGA: 14 },
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
    const result = compareDNA({ markers: {} }, { markers: {} });
    expect(result.matchPercentage).toBe(0);
  });
});
