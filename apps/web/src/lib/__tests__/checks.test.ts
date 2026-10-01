import { describe, it, expect } from "vitest";
import {
  CHECK_TTL_MS,
  canonicalUsername,
  canRespond,
  isCheckExpired,
  riskLevelToVerdict,
  validateUsername,
  type CheckStatus,
  type Verdict,
} from "../checks";

describe("riskLevelToVerdict", () => {
  it("maps 'none' → safe (both negative)", () => {
    expect(riskLevelToVerdict("none")).toBe("safe");
  });

  it("maps 'same_strain' → compatible (they already share the strain)", () => {
    expect(riskLevelToVerdict("same_strain")).toBe("compatible");
  });

  it("maps 'potential_risk' → caution (insufficient data)", () => {
    expect(riskLevelToVerdict("potential_risk")).toBe("caution");
  });

  it("maps 'high_risk' → risk (one positive, one negative)", () => {
    expect(riskLevelToVerdict("high_risk")).toBe("risk");
  });

  it("covers the full verdict set", () => {
    const verdicts: Verdict[] = ["none", "same_strain", "potential_risk", "high_risk"].map(
      (l) => riskLevelToVerdict(l as never),
    );
    expect(verdicts).toEqual(["safe", "compatible", "caution", "risk"]);
  });
});

describe("isCheckExpired", () => {
  const now = new Date("2026-09-12T12:00:00Z");

  it("expires a pending check past its deadline", () => {
    expect(
      isCheckExpired({ status: "pending", expiresAt: new Date("2026-09-10T12:00:00Z") }, now),
    ).toBe(true);
  });

  it("keeps a pending check alive before the deadline", () => {
    expect(
      isCheckExpired({ status: "pending", expiresAt: new Date("2026-09-20T12:00:00Z") }, now),
    ).toBe(false);
  });

  it("never expires a non-pending check (approved/denied are final)", () => {
    const past = new Date("2026-09-01T12:00:00Z");
    expect(isCheckExpired({ status: "approved", expiresAt: past }, now)).toBe(false);
    expect(isCheckExpired({ status: "denied", expiresAt: past }, now)).toBe(false);
  });

  it("accepts ISO string dates too", () => {
    expect(isCheckExpired({ status: "pending", expiresAt: "2026-09-10T12:00:00.000Z" }, now)).toBe(
      true,
    );
  });
});

describe("canRespond", () => {
  const check = { targetId: "userB", status: "pending" as CheckStatus };

  it("allows the target of a pending check to respond", () => {
    expect(canRespond(check, "userB")).toBe(true);
  });

  it("forbids the requester from responding", () => {
    expect(canRespond(check, "userA")).toBe(false);
  });

  it("forbids responding to a finalised check", () => {
    expect(canRespond({ targetId: "userB", status: "approved" }, "userB")).toBe(false);
    expect(canRespond({ targetId: "userB", status: "denied" }, "userB")).toBe(false);
  });
});

describe("validateUsername", () => {
  it("accepts simple usernames", () => {
    expect(validateUsername("alina")).toBeNull();
    expect(validateUsername("alina.dushka")).toBeNull();
    expect(validateUsername("alina_dushka")).toBeNull();
    expect(validateUsername("alina2")).toBeNull();
    expect(validateUsername("a.b.c")).toBeNull();
  });

  it("lowercases and trims before validating", () => {
    expect(validateUsername("  Alina.Dushka  ")).toBeNull();
  });

  it("rejects empty names", () => {
    expect(validateUsername("")).toBe("empty");
    expect(validateUsername("   ")).toBe("empty");
  });

  it("rejects names over 40 chars", () => {
    expect(validateUsername("a".repeat(41))).toBe("too_long");
    expect(validateUsername("a".repeat(40))).toBeNull();
  });

  it("rejects invalid characters", () => {
    expect(validateUsername("аліна")).toBe("invalid_chars");
    expect(validateUsername("alina dushka")).toBe("invalid_chars");
    expect(validateUsername("alina!" )).toBe("invalid_chars");
    expect(validateUsername(".alina")).toBe("invalid_chars");
    expect(validateUsername("alina..dushka")).toBe("invalid_chars");
    expect(validateUsername("-alina")).toBe("invalid_chars");
  });
});

describe("canonicalUsername", () => {
  it("normalizes case and whitespace", () => {
    expect(canonicalUsername("  Alina.Dushka ")).toBe("alina.dushka");
  });
});

describe("CHECK_TTL_MS", () => {
  it("is exactly 7 days", () => {
    expect(CHECK_TTL_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });
});