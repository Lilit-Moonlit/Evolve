import { describe, it, expect } from "vitest";
import { sanitizeRoseRecord, type RoseRecord } from "../private-gift";

// Simulates the Profile `roses` JSON column round-trip: the db serializes the
// array via JSON.stringify (upsertProfile) and parses it back via
// deserializeProfileRow. The invariant under test: an "anon" record never
// carries a sender identity across that boundary.
function roundtrip(records: unknown[]): unknown[] {
  return JSON.parse(JSON.stringify(records));
}

describe("roses JSON round-trip (Profile column)", () => {
  it("strips senderName from an anon record and survives stringify/parse", () => {
    const clean = sanitizeRoseRecord({
      kind: "rose",
      mode: "anon",
      senderName: "Гоша",
      receivedAt: "2026-10-04T12:00:00.000Z",
      claimed: false,
    });
    const [after] = roundtrip([clean]) as RoseRecord[];
    expect(after).not.toHaveProperty("senderName");
    expect(after.mode).toBe("anon");
    expect(after.claimed).toBe(false);
  });

  it("keeps senderName for public and anon-except-recipient", () => {
    for (const mode of ["public", "anon-except-recipient"] as const) {
      const clean = sanitizeRoseRecord({
        kind: "rose",
        mode,
        senderName: "Гоша",
        receivedAt: "2026-10-04T12:00:00.000Z",
      });
      const [after] = roundtrip([clean]) as RoseRecord[];
      expect(after.senderName).toBe("Гоша");
    }
  });

  it("defaults claimed to false and drops unknown fields", () => {
    const clean = sanitizeRoseRecord({
      kind: "cactus",
      mode: "public",
      receivedAt: "2026-10-04T12:00:00.000Z",
      extra: "hacked",
    });
    expect(clean.claimed).toBe(false);
    expect(clean).not.toHaveProperty("extra");
  });
});
