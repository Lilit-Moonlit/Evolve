import type { StdCompatibilityResult } from "./std-parser";

/**
 * Person→person safe-sex compatibility check.
 *
 * Pure logic shared by the API server and tests: verdict mapping, expiry
 * handling and username validation. The actual request/approve/deny state
 * machine is stored in `CompatibilityCheck` rows via the db service.
 *
 * Privacy rule: only the anonymous verdict is ever exposed — individual
 * pathogen status is NEVER shown to the other party.
 */

export type Verdict = "safe" | "compatible" | "caution" | "risk";
export type CheckStatus = "pending" | "approved" | "denied" | "expired";

/** Pending checks auto-expire after 7 days. */
export const CHECK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Map the STD-compatibility risk level to the public verdict label. */
export function riskLevelToVerdict(riskLevel: StdCompatibilityResult["riskLevel"]): Verdict {
  switch (riskLevel) {
    case "none":
      return "safe";
    case "same_strain":
      return "compatible";
    case "potential_risk":
      return "caution";
    case "high_risk":
      return "risk";
  }
}

/** A pending check that passed its expiresAt is treated as expired. */
export function isCheckExpired(
  check: { expiresAt: string | Date; status: string },
  now: Date = new Date(),
): boolean {
  return check.status === "pending" && new Date(check.expiresAt) <= now;
}

/** Can this user respond to a check? Only the target of a pending check can. */
export function canRespond(check: { targetId: string; status: string }, userId: string): boolean {
  return check.targetId === userId && check.status === "pending";
}

// ─── Public link username validation (evolve.eth/<username>) ────────────────

export const USERNAME_MAX_LENGTH = 40;
/** lowercase letters/digits, dots and underscores; segments separated by . or _ */
const USERNAME_PATTERN = /^[a-z0-9]+([._][a-z0-9]+)*$/;

/** Returns null when valid, otherwise a machine-readable reason. */
export function validateUsername(username: string): null | "empty" | "too_long" | "invalid_chars" {
  const trimmed = username.trim().toLowerCase();
  if (!trimmed) return "empty";
  if (trimmed.length > USERNAME_MAX_LENGTH) return "too_long";
  if (!USERNAME_PATTERN.test(trimmed)) return "invalid_chars";
  return null;
}

/** Normalize a username for storage (lowercase, trimmed). */
export function canonicalUsername(username: string): string {
  return username.trim().toLowerCase();
}