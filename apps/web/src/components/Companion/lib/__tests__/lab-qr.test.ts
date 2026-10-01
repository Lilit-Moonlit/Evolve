import { describe, it, expect } from "vitest";
import { parseLabPatientPayload } from "../lab-qr";

describe("parseLabPatientPayload", () => {
  it("parses canonical evolve://lab-patient/<userId> payload", () => {
    expect(parseLabPatientPayload("evolve://lab-patient/abc123")).toBe("abc123");
  });

  it("decodes URL-encoded userId", () => {
    expect(parseLabPatientPayload("evolve://lab-patient/user%20with%20space")).toBe(
      "user with space",
    );
  });

  it("accepts a raw userId as fallback", () => {
    expect(parseLabPatientPayload("abc123")).toBe("abc123");
  });

  it("returns null for empty string", () => {
    expect(parseLabPatientPayload("")).toBeNull();
  });

  it("returns null for whitespace-only input", () => {
    expect(parseLabPatientPayload("   ")).toBeNull();
  });

  it("does not match person payloads", () => {
    expect(parseLabPatientPayload("evolve://person/p1")).toBe("evolve://person/p1");
  });
});
