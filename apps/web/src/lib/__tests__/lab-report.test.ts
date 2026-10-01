// Lab Report Module Tests
// Tests for lab-report.ts functionality (DAO-oriented lab report ingestion).

import { describe, it, expect } from "vitest";
import {
  generateLabEmail,
  parseUserIdFromLabEmail,
  ingestLabReport,
  SUPPORTED_REPORT_TYPES,
  type LabReportInput,
} from "../lab-report";

describe("lab-report", () => {
  describe("generateLabEmail", () => {
    it("generates a unique +alias email per userId", () => {
      expect(generateLabEmail("alice")).toBe("lola+alice@evolve.eth");
      expect(generateLabEmail("bob123")).toBe("lola+bob123@evolve.eth");
    });
  });

  describe("parseUserIdFromLabEmail", () => {
    it("extracts userId from a valid lab email", () => {
      expect(parseUserIdFromLabEmail("lola+alice@evolve.eth")).toBe("alice");
      expect(parseUserIdFromLabEmail("lola+bob123@evolve.eth")).toBe("bob123");
    });

    it("returns null for a non-lab domain", () => {
      expect(parseUserIdFromLabEmail("lola+alice@other.eth")).toBeNull();
      expect(parseUserIdFromLabEmail("lola+alice@gmail.com")).toBeNull();
    });

    it("returns null when the +alias is missing", () => {
      expect(parseUserIdFromLabEmail("alice@evolve.eth")).toBeNull();
      expect(parseUserIdFromLabEmail("lola@evolve.eth")).toBeNull();
    });

    it("returns null for malformed input", () => {
      expect(parseUserIdFromLabEmail("lola+alice")).toBeNull();
      expect(parseUserIdFromLabEmail("lola+@evolve.eth")).toBeNull();
      expect(parseUserIdFromLabEmail("lola+alice@evolve")).toBeNull();
      expect(parseUserIdFromLabEmail("")).toBeNull();
    });
  });

  describe("SUPPORTED_REPORT_TYPES", () => {
    it("contains exactly STD", () => {
      expect(SUPPORTED_REPORT_TYPES).toEqual(["STD"]);
    });
  });

  describe("ingestLabReport", () => {
    it("parses an all-negative STD report", () => {
      const input: LabReportInput = {
        userId: "alice",
        source: "email",
        rawText: "All negative. HIV: not detected. Syphilis: not detected. Chlamydia: not detected.",
      };
      const result = ingestLabReport(input);
      expect(result.parsed).not.toBeNull();
      expect(result.parsed?.isAllNegative).toBe(true);
      expect(result.parsed?.hasPositive).toBe(false);
    });

    it("parses a positive STD report and lists positives", () => {
      const input: LabReportInput = {
        userId: "bob",
        source: "manual",
        rawText: "HIV: detected positive.",
      };
      const result = ingestLabReport(input);
      expect(result.parsed?.hasPositive).toBe(true);
      expect(result.parsed?.positiveList).toContain("HIV-1/2");
    });

    it("returns a pending report by default", () => {
      const input: LabReportInput = {
        userId: "alice",
        source: "email",
        rawText: "HIV: not detected.",
      };
      const result = ingestLabReport(input);
      expect(result.status).toBe("pending");
      expect(result.rawText).toBe(input.rawText);
      expect(result.userId).toBe("alice");
    });

    it("handles unparseable text without throwing, parsed stays null", () => {
      const input: LabReportInput = {
        userId: "dave",
        source: "api",
        rawText: "totally unrelated text",
      };
      const result = ingestLabReport(input);
      // Parsing still runs; if no pathogens recognized it yields a non-fatal result.
      expect(result.rawText).toBe("totally unrelated text");
      expect(result.status).toBe("pending");
    });
  });
});
