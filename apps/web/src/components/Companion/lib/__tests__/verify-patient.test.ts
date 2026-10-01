import { describe, it, expect } from "vitest";
import { canConfirmPatient } from "../verify-patient";

describe("canConfirmPatient", () => {
  it("returns false when the main photo has no decision", () => {
    expect(canConfirmPatient(true, "none", [])).toBe(false);
  });

  it("returns true when only the main photo exists and is decided", () => {
    expect(canConfirmPatient(true, "verified", [])).toBe(true);
    expect(canConfirmPatient(true, "uncertain", [])).toBe(true);
  });

  it("returns false when any additional photo is undecided", () => {
    expect(
      canConfirmPatient(true, "verified", [
        { url: "a", status: "verified" },
        { url: "b", status: "none" },
      ]),
    ).toBe(false);
  });

  it("returns true when every photo (main + additional) is decided", () => {
    expect(
      canConfirmPatient(true, "uncertain", [
        { url: "a", status: "verified" },
        { url: "b", status: "uncertain" },
      ]),
    ).toBe(true);
  });

  it("ignores the main-photo requirement when there is no main photo", () => {
    expect(canConfirmPatient(false, "none", [{ url: "a", status: "verified" }])).toBe(true);
  });

  it("returns true when there are no photos at all", () => {
    expect(canConfirmPatient(false, "none", [])).toBe(true);
  });
});
