import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  requestPhoneOtp,
  verifyPhoneOtp,
  getPhoneSession,
  logoutPhone,
} from "./phoneAuth";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("phoneAuth", () => {
  describe("requestPhoneOtp", () => {
    it("sends POST to /api/auth/phone/request-otp", async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, expiresIn: 600 }),
      });

      const result = await requestPhoneOtp("+380501234567");

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/phone/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phoneNumber: "+380501234567" }),
      });
      expect(result).toEqual({ success: true, expiresIn: 600 });
    });

    it("returns error on failure", async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({ success: false, error: "Invalid phone number" }),
      });

      const result = await requestPhoneOtp("invalid");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid phone number");
    });
  });

  describe("verifyPhoneOtp", () => {
    it("sends POST to /api/auth/phone/verify-otp", async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            sessionId: "abc123",
            user: { id: "u1", phoneNumber: "+380501234567" },
          }),
      });

      const result = await verifyPhoneOtp("+380501234567", "123456");

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phoneNumber: "+380501234567",
          otp: "123456",
        }),
      });
      expect(result.success).toBe(true);
      expect(result.sessionId).toBe("abc123");
      expect(result.user?.id).toBe("u1");
    });

    it("returns error on invalid OTP", async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({ success: false, error: "Invalid or expired OTP" }),
      });

      const result = await verifyPhoneOtp("+380501234567", "000000");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid or expired OTP");
    });
  });

  describe("getPhoneSession", () => {
    it("sends GET to /api/auth/phone/session", async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            authenticated: true,
            user: { id: "u1", phoneNumber: "+380501234567" },
          }),
      });

      const result = await getPhoneSession();

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/phone/session", {
        credentials: "include",
      });
      expect(result.authenticated).toBe(true);
    });

    it("returns unauthenticated when no session", async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ authenticated: false }),
      });

      const result = await getPhoneSession();

      expect(result.authenticated).toBe(false);
    });
  });

  describe("logoutPhone", () => {
    it("sends POST to /api/auth/phone/logout", async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true }),
      });

      const result = await logoutPhone();

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/phone/logout", {
        method: "POST",
        credentials: "include",
      });
      expect(result.success).toBe(true);
    });
  });
});
