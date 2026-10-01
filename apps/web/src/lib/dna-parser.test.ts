import { parseDNATest, validateDNAProfile, generateDNAHash, STRProfile } from "./dna-parser";
import { describe, it, expect } from "vitest";

describe("parseDNATest", () => {
  it("should parse a valid JSON DNA test", () => {
    const jsonText = JSON.stringify({
      markers: {
        D5S818: 11,
        D13S317: 12,
      },
      haplogroup: "H1a",
      metadata: { lab: "ExampleLab" },
    });
    const result = parseDNATest(jsonText);
    expect(result.valid).toBe(true);
    expect(result.strProfile).toEqual({
      markers: {
        D5S818: 11,
        D13S317: 12,
      },
      haplogroup: "H1a",
      metadata: { lab: "ExampleLab" },
    });
    expect(result.errors).toEqual([]);
  });

  it("should parse a valid plain text DNA test", () => {
    const plainText = "STR D5S818: 11\nD13S317=12\nHaplogroup: H1a";
    const result = parseDNATest(plainText);
    expect(result.valid).toBe(true);
    expect(result.strProfile).toEqual({
      markers: {
        D5S818: 11,
        D13S317: 12,
      },
      haplogroup: "H1A",
    });
    expect(result.errors).toEqual([]);
  });

  it("should handle mixed case markers and haplogroup in plain text", () => {
    const plainText = "d5s818: 11\nd13S317=12\nHAPLOGROUP: h1a";
    const result = parseDNATest(plainText);
    expect(result.valid).toBe(true);
    expect(result.strProfile).toEqual({
      markers: {
        D5S818: 11,
        D13S317: 12,
      },
      haplogroup: "H1A",
    });
    expect(result.errors).toEqual([]);
  });

  it("should return invalid for empty text", () => {
    const result = parseDNATest("");
    expect(result.valid).toBe(false);
    expect(result.strProfile).toBeUndefined();
    expect(result.errors).toContain("Could not parse any STR markers or haplogroup from text/CSV.");
  });

  it("should return invalid for JSON with missing markers", () => {
    const jsonText = JSON.stringify({
      haplogroup: "H1a",
    });
    const result = parseDNATest(jsonText);
    expect(result.valid).toBe(false);
    expect(result.strProfile).toBeUndefined();
    expect(result.errors).toContain(
      "Invalid JSON format: missing 'markers' field or it's not an object.",
    );
  });

  it("should parse multiple markers from different lines", () => {
    const text = "Marker1: 10\nMarker2: 20\nMarker3 = 30";
    const result = parseDNATest(text);
    expect(result.valid).toBe(true);
    expect(result.strProfile?.markers).toEqual({
      MARKER1: 10,
      MARKER2: 20,
      MARKER3: 30,
    });
  });

  it("should prioritize JSON over plain text if both are present", () => {
    const jsonText = JSON.stringify({
      markers: { D1S1656: 10 },
    });
    const mixedText = jsonText + "\nD5S818: 11";
    const result = parseDNATest(mixedText);
    expect(result.valid).toBe(true);
    expect(result.strProfile?.markers).toEqual({ D1S1656: 10 });
  });

  it("should handle CSV-like format", () => {
    const csvText = "Marker,Value\nD5S818,11\nD13S317,12";
    const result = parseDNATest(csvText);
    expect(result.valid).toBe(true);
    // The current parser is basic and will just extract "D5S818" and "D13S317" as markers if they are followed by numbers.
    // A more robust CSV parser would be needed for perfect column-based parsing.
    expect(result.strProfile?.markers).toEqual({
      D5S818: 11,
      D13S317: 12,
    });
  });

  it("should handle invalid marker values in text", () => {
    const text = "D5S818: invalid\nD13S317: 12";
    const result = parseDNATest(text);
    expect(result.valid).toBe(true); // Still parses D13S317
    expect(result.strProfile?.markers).toEqual({ D13S317: 12 });
  });

  it("should handle multiple haplogroup mentions, taking the last one", () => {
    const text = "Haplogroup: H1a\nAnother Haplogroup: J1b\nHaplogroup is K";
    const result = parseDNATest(text);
    expect(result.valid).toBe(true);
    expect(result.strProfile?.haplogroup).toBe("K");
  });
});

describe("validateDNAProfile", () => {
  it("should validate a profile with valid markers", () => {
    const profile: STRProfile = {
      markers: { D5S818: 11, D13S317: 12 },
    };
    expect(validateDNAProfile(profile)).toBe(true);
  });

  it("should invalidate a profile with empty markers", () => {
    const profile: STRProfile = {
      markers: {},
    };
    expect(validateDNAProfile(profile)).toBe(false);
  });

  it("should invalidate a profile with null markers", () => {
    const profile: STRProfile = {
      // @ts-ignore
      markers: null,
    };
    expect(validateDNAProfile(profile)).toBe(false);
  });

  it("should invalidate a profile with non-numeric marker values", () => {
    const profile: STRProfile = {
      // @ts-ignore
      markers: { D5S818: "invalid" },
    };
    expect(validateDNAProfile(profile)).toBe(false);
  });

  it("should invalidate a profile with zero or negative marker values", () => {
    const profile1: STRProfile = { markers: { D5S818: 0 } };
    const profile2: STRProfile = { markers: { D5S818: -5 } };
    expect(validateDNAProfile(profile1)).toBe(false);
    expect(validateDNAProfile(profile2)).toBe(false);
  });

  it("should validate with haplogroup present", () => {
    const profile: STRProfile = {
      markers: { D5S818: 11 },
      haplogroup: "H1a",
    };
    expect(validateDNAProfile(profile)).toBe(true);
  });

  it("should invalidate null profile", () => {
    // @ts-ignore
    expect(validateDNAProfile(null)).toBe(false);
  });
});

describe("generateDNAHash", () => {
  it("should generate a consistent hash for the same profile", async () => {
    const profile1: STRProfile = {
      markers: { D5S818: 11, D13S317: 12 },
      haplogroup: "H1a",
    };
    const profile2: STRProfile = {
      markers: { D13S317: 12, D5S818: 11 }, // Marker order should not affect hash
      haplogroup: "H1a",
    };
    expect(await generateDNAHash(profile1)).toEqual(await generateDNAHash(profile2));
  });

  it("should generate different hashes for different profiles", async () => {
    const profile1: STRProfile = {
      markers: { D5S818: 11, D13S317: 12 },
    };
    const profile2: STRProfile = {
      markers: { D5S818: 11, D13S317: 13 },
    };
    expect(await generateDNAHash(profile1)).not.toEqual(await generateDNAHash(profile2));
  });

  it("should generate different hashes for different haplogroups", async () => {
    const profile1: STRProfile = {
      markers: { D5S818: 11 },
      haplogroup: "H1a",
    };
    const profile2: STRProfile = {
      markers: { D5S818: 11 },
      haplogroup: "J1b",
    };
    expect(await generateDNAHash(profile1)).not.toEqual(await generateDNAHash(profile2));
  });

  it("should generate a valid bytes32 hex string", async () => {
    const profile: STRProfile = {
      markers: { D5S818: 11 },
    };
    const hash = await generateDNAHash(profile);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("should match the known-answer SHA-256 vector", async () => {
    // Canonical input: {"markers":{"D13S317":12,"D5S818":11},"haplogroup":"H1a"}
    // Expected digest independently verified via Node crypto:
    // sha256(canonicalInput) = 193d937f6c2e196a2991a2b3b7bddb01dd61cc8c7b26e9091c948bc1e4c4b60f
    const profile: STRProfile = { markers: { D5S818: 11, D13S317: 12 }, haplogroup: "H1a" };
    expect(await generateDNAHash(profile)).toBe(
      "0x193d937f6c2e196a2991a2b3b7bddb01dd61cc8c7b26e9091c948bc1e4c4b60f",
    );
  });
});
