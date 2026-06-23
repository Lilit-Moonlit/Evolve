/**
 * Phone OTP Authentication Client
 *
 * Standalone module for phone-based OTP authentication.
 * In web app, prefer using AppContext methods (requestPhoneOtp/verifyPhoneOtp)
 * which handle session state. This module is for direct API access.
 */

export interface PhoneOtpResponse {
  success: boolean;
  expiresIn?: number;
  error?: string;
}

export interface PhoneVerifyResponse {
  success: boolean;
  sessionId?: string;
  user?: { id: string; phoneNumber: string };
  error?: string;
}

/**
 * Request OTP to be sent to a phone number.
 * In dev mode, OTP is logged to console (no real SMS).
 */
export async function requestPhoneOtp(
  phoneNumber: string,
): Promise<PhoneOtpResponse> {
  const res = await fetch("/api/auth/phone/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phoneNumber }),
  });
  return res.json();
}

/**
 * Verify OTP code for a phone number.
 * Returns session ID and user on success.
 */
export async function verifyPhoneOtp(
  phoneNumber: string,
  otp: string,
): Promise<PhoneVerifyResponse> {
  const res = await fetch("/api/auth/phone/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phoneNumber, otp }),
  });
  return res.json();
}

/**
 * Get current phone auth session.
 */
export async function getPhoneSession(): Promise<{
  authenticated: boolean;
  session?: { userId: string; phoneNumber: string };
  user?: { id: string; phoneNumber: string };
}> {
  const res = await fetch("/api/auth/phone/session", {
    credentials: "include",
  });
  return res.json();
}

/**
 * Logout phone auth session.
 */
export async function logoutPhone(): Promise<{ success: boolean }> {
  const res = await fetch("/api/auth/phone/logout", {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
