import { describe, expect, it } from "vitest";
import { matchesCanTravel } from "../can-travel";

describe("matchesCanTravel", () => {
  it("returns false when profile does not declare canTravel", () => {
    expect(matchesCanTravel({ canTravel: false }, "Ukraine")).toBe(false);
    expect(matchesCanTravel({}, "Ukraine")).toBe(false);
  });

  it("returns true when declared with empty list (legacy anywhere semantics)", () => {
    expect(matchesCanTravel({ canTravel: true }, "Ukraine")).toBe(true);
    expect(matchesCanTravel({ canTravel: true, canTravelCountries: [] }, "Germany")).toBe(true);
  });

  it("returns true when searcher country is in the declared list", () => {
    expect(
      matchesCanTravel({ canTravel: true, canTravelCountries: ["Germany", "Ukraine"] }, "Ukraine"),
    ).toBe(true);
  });

  it("returns false when searcher country is NOT in the declared list", () => {
    expect(matchesCanTravel({ canTravel: true, canTravelCountries: ["Germany"] }, "Ukraine")).toBe(
      false,
    );
  });

  it("keeps every traveler when searcher has no country set", () => {
    expect(matchesCanTravel({ canTravel: true, canTravelCountries: ["Germany"] }, undefined)).toBe(
      true,
    );
    expect(matchesCanTravel({ canTravel: true, canTravelCountries: ["Germany"] }, "")).toBe(true);
  });
});
