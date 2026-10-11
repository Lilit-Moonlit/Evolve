import { describe, it, expect } from "vitest";
import {
  cityKeyOf,
  parseCityKey,
  isValidCityKey,
  cityKeyToTag,
  tagToCityKey,
  createCityTag,
  extractCityKeyFromTags,
} from "./city-tagging";

describe("city-tagging", () => {
  describe("cityKeyOf", () => {
    it("should create a canonical city key", () => {
      expect(cityKeyOf("Ukraine", "Kyiv")).toBe("Ukraine::Kyiv");
      expect(cityKeyOf("USA", "New York")).toBe("USA::New York");
    });

    it("should trim whitespace", () => {
      expect(cityKeyOf("  Ukraine  ", "  Kyiv  ")).toBe("Ukraine::Kyiv");
    });
  });

  describe("parseCityKey", () => {
    it("should parse a valid city key", () => {
      expect(parseCityKey("Ukraine::Kyiv")).toEqual({
        country: "Ukraine",
        city: "Kyiv",
      });
    });

    it("should handle malformed keys gracefully", () => {
      expect(parseCityKey("Kyiv")).toEqual({ country: "", city: "Kyiv" });
      expect(parseCityKey("")).toEqual({ country: "", city: "" });
    });
  });

  describe("isValidCityKey", () => {
    it("should validate correct city keys", () => {
      expect(isValidCityKey("Ukraine::Kyiv")).toBe(true);
      expect(isValidCityKey("USA::New York")).toBe(true);
    });

    it("should reject malformed keys", () => {
      expect(isValidCityKey("Kyiv")).toBe(false);
      expect(isValidCityKey("Ukraine::")).toBe(false);
      expect(isValidCityKey("::Kyiv")).toBe(false);
      expect(isValidCityKey("")).toBe(false);
    });

    it("should reject keys with control characters", () => {
      expect(isValidCityKey("Ukraine::Kyiv\n")).toBe(false);
      expect(isValidCityKey("Ukraine::Kyiv\r")).toBe(false);
      expect(isValidCityKey("Ukraine::Kyiv\t")).toBe(false);
    });
  });

  describe("cityKeyToTag", () => {
    it("should convert city key to tag value", () => {
      expect(cityKeyToTag("Ukraine::Kyiv")).toBe("Ukraine::Kyiv");
    });

    it("should throw for invalid city keys", () => {
      expect(() => cityKeyToTag("Kyiv")).toThrow("Invalid city key");
      expect(() => cityKeyToTag("")).toThrow("Invalid city key");
    });
  });

  describe("tagToCityKey", () => {
    it("should convert tag value to city key", () => {
      expect(tagToCityKey("Ukraine::Kyiv")).toBe("Ukraine::Kyiv");
    });

    it("should throw for invalid tag values", () => {
      expect(() => tagToCityKey("Kyiv")).toThrow("Invalid tag value");
      expect(() => tagToCityKey("")).toThrow("Invalid tag value");
    });
  });

  describe("createCityTag", () => {
    it("should create a Nostr t tag array", () => {
      expect(createCityTag("Ukraine::Kyiv")).toEqual(["t", "Ukraine::Kyiv"]);
    });

    it("should throw for invalid city keys", () => {
      expect(() => createCityTag("Kyiv")).toThrow("Invalid city key");
    });
  });

  describe("extractCityKeyFromTags", () => {
    it("should extract city key from tags", () => {
      const tags = [
        ["p", "some-pubkey"],
        ["t", "Ukraine::Kyiv"],
        ["e", "some-event"],
      ];
      expect(extractCityKeyFromTags(tags)).toBe("Ukraine::Kyiv");
    });

    it("should return null if no city tag found", () => {
      const tags = [
        ["p", "some-pubkey"],
        ["e", "some-event"],
      ];
      expect(extractCityKeyFromTags(tags)).toBeNull();
    });

    it("should return null if t tag is not a valid city key", () => {
      const tags = [["t", "invalid"]];
      expect(extractCityKeyFromTags(tags)).toBeNull();
    });

    it("should return the first valid city tag", () => {
      const tags = [
        ["t", "Ukraine::Kyiv"],
        ["t", "USA::New York"],
      ];
      expect(extractCityKeyFromTags(tags)).toBe("Ukraine::Kyiv");
    });
  });
});
