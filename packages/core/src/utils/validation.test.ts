/**
 * Tests for validation utilities
 */

import {
  isValidWalletAddress as validateWalletAddress,
  isValidEmail as validateEmail,
  isValidUrl as validateUrl,
  isValidAge as validateAge,
  isValidName as validateName,
  isValidBio as validateBio,
  isValidLocation as validateLocation,
  isValidMatchScore as validateMatchScore,
  isValidMessage as validateMessage,
  isValidUserId as validateUuid,
  isValidPhoneNumber as validatePhoneNumber,
  isValidDateOfBirth as validateDateOfBirth,
  isValidImageUrl as validateImageUrl,
  isValidDistance as validateDistance,
  isValidInterests as validateInterests,
  isValidGender as validateGender,
} from "./validation";

describe("Validation Utilities", () => {
  describe("validateWalletAddress", () => {
    it("should validate correct wallet addresses", () => {
      expect(
        validateWalletAddress("0x1234567890123456789012345678901234567890"),
      ).toBe(true);
      expect(
        validateWalletAddress("0xA1B2C3D4E5F6A7B8C9D0A1B2C3D4E5F6A7B8C9D0"),
      ).toBe(true);
    });

    it("should reject invalid wallet addresses", () => {
      expect(validateWalletAddress("invalid")).toBe(false);
      expect(validateWalletAddress("0x123")).toBe(false);
      expect(
        validateWalletAddress("1234567890123456789012345678901234567890"),
      ).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("validateUrl", () => {
    it("should validate correct URLs", () => {
      expect(validateUrl("https://example.com")).toBe(true);
      expect(validateUrl("http://example.com/path")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(validateUrl("invalid")).toBe(false);
      expect(validateUrl("example.com")).toBe(false);
    });
  });

  describe("validateAge", () => {
    it("should validate correct ages", () => {
      expect(validateAge(18)).toBe(true);
      expect(validateAge(25)).toBe(true);
      expect(validateAge(120)).toBe(true);
    });

    it("should reject invalid ages", () => {
      expect(validateAge(17)).toBe(false);
      expect(validateAge(121)).toBe(false);
      expect(validateAge(-5)).toBe(false);
    });
  });

  describe("validateName", () => {
    it("should validate correct names", () => {
      expect(validateName("John Doe")).toBe(true);
      expect(validateName("Jane")).toBe(true);
    });

    it("should reject invalid names", () => {
      expect(validateName("J")).toBe(false);
      expect(validateName("A".repeat(51))).toBe(false);
    });
  });

  describe("validateBio", () => {
    it("should validate correct bios", () => {
      expect(validateBio("This is a valid bio")).toBe(true);
      expect(validateBio("")).toBe(true);
    });

    it("should reject invalid bios", () => {
      expect(validateBio("A".repeat(501))).toBe(false);
    });
  });

  describe("validateLocation", () => {
    it("should validate correct locations", () => {
      expect(validateLocation("New York, USA")).toBe(true);
      expect(validateLocation("London")).toBe(true);
    });

    it("should reject invalid locations", () => {
      expect(validateLocation("")).toBe(false);
      expect(validateLocation("A")).toBe(false);
      expect(validateLocation("A".repeat(101))).toBe(false);
    });
  });

  describe("validateMatchScore", () => {
    it("should validate correct match scores", () => {
      expect(validateMatchScore(0)).toBe(true);
      expect(validateMatchScore(50)).toBe(true);
      expect(validateMatchScore(100)).toBe(true);
    });

    it("should reject invalid match scores", () => {
      expect(validateMatchScore(-1)).toBe(false);
      expect(validateMatchScore(101)).toBe(false);
    });
  });

  describe("validateMessage", () => {
    it("should validate correct messages", () => {
      expect(validateMessage("Hello!")).toBe(true);
      expect(validateMessage("A".repeat(1000))).toBe(true);
    });

    it("should reject invalid messages", () => {
      expect(validateMessage("")).toBe(false);
      expect(validateMessage("A".repeat(1001))).toBe(false);
    });
  });

  describe("validateUuid", () => {
    it("should validate correct UUIDs", () => {
      expect(validateUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(validateUuid("invalid")).toBe(false);
      expect(validateUuid("1234567890")).toBe(false);
    });
  });

  describe("validatePhoneNumber", () => {
    it("should validate correct phone numbers", () => {
      expect(validatePhoneNumber("+1234567890")).toBe(true);
      expect(validatePhoneNumber("123-456-7890")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(validatePhoneNumber("invalid")).toBe(false);
      expect(validatePhoneNumber("123")).toBe(false);
    });
  });

  describe("validateDateOfBirth", () => {
    it("should validate correct dates of birth", () => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      eighteenYearsAgo.setHours(0, 0, 0, 0);
      expect(validateDateOfBirth(eighteenYearsAgo)).toBe(true);
    });

    it("should reject invalid dates of birth", () => {
      const seventeenYearsAgo = new Date();
      seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);
      seventeenYearsAgo.setHours(23, 59, 59, 999);
      expect(validateDateOfBirth(seventeenYearsAgo)).toBe(false);
    });
  });

  describe("validateImageUrl", () => {
    it("should validate correct image URLs", () => {
      expect(validateImageUrl("https://example.com/image.jpg")).toBe(true);
      expect(validateImageUrl("https://example.com/image.png")).toBe(true);
    });

    it("should reject invalid image URLs", () => {
      expect(validateImageUrl("https://example.com/image.pdf")).toBe(false);
      expect(validateImageUrl("invalid")).toBe(false);
    });
  });

  describe("validateDistance", () => {
    it("should validate correct distances", () => {
      expect(validateDistance(0)).toBe(true);
      expect(validateDistance(500)).toBe(true);
      expect(validateDistance(1000)).toBe(true);
    });

    it("should reject invalid distances", () => {
      expect(validateDistance(-1)).toBe(false);
      expect(validateDistance(1001)).toBe(false);
    });
  });

  describe("validateInterests", () => {
    it("should validate correct interests", () => {
      expect(validateInterests(["Music", "Sports"])).toBe(true);
      expect(validateInterests([])).toBe(true);
    });

    it("should reject invalid interests", () => {
      expect(
        validateInterests(
          Array.from({ length: 21 }, (_, i) => `Interest ${i}`),
        ),
      ).toBe(false);
    });
  });

  describe("validateGender", () => {
    it("should validate correct genders", () => {
      expect(validateGender("male")).toBe(true);
      expect(validateGender("female")).toBe(true);
      expect(validateGender("non-binary")).toBe(true);
    });

    it("should reject invalid genders", () => {
      expect(validateGender("invalid")).toBe(false);
    });
  });
});
