/**
 * Behavioral Catfish Detection Engine
 *
 * Analyzes behavioral signals to flag potential catfish profiles
 * (organized scam operations running fake profiles with stolen photos).
 *
 * Score 0-100 where:
 *  - 0-30  = low risk (likely legit)
 *  - 31-60 = moderate risk (needs attention)
 *  - 61-100 = high risk (likely catfish)
 *
 * Signals analyzed:
 *  1. Profile photo age (stolen photos are often older/reused)
 *  2. Message reply patterns (async/suspiciously fast)
 *  3. Message timing variance (bots reply at constant intervals)
 *  4. Content red flags (too eager to move off-platform, asks for money)
 *  5. Verification completeness (lack of STD/DNA/face checks)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single chat message with timing info */
export interface BehaviorMessage {
  /** Unix timestamp (ms) when message was sent */
  timestamp: number;
  /** Sender: "me" or "them" */
  sender: "me" | "them";
  /** Message text content */
  text: string;
}

/** Profile data used for behavioral analysis */
export interface BehaviorProfile {
  /** Profile ID */
  id: string;
  /** Unix timestamp (ms) when profile was created */
  createdAt?: number;
  /** Unix timestamp (ms) of the profile photo upload */
  photoUploadedAt?: number;
  /** Whether face was verified (onboarding selfie check) */
  faceVerified?: boolean;
  /** Whether STD test was uploaded */
  stdVerified?: boolean;
  /** Whether DNA was verified */
  dnaVerified?: boolean;
  /** Chat history for this profile */
  messages?: BehaviorMessage[];
}

/** Risk assessment result */
export interface RiskAssessment {
  /** Overall risk score 0-100 */
  score: number;
  /** Risk level label */
  level: "low" | "moderate" | "high";
  /** Breakdown of each signal's contribution */
  signals: RiskSignal[];
  /** Whether the profile should be flagged for manual review */
  flagged: boolean;
  /** Optional reasons for flagging (localized keys) */
  reasons: string[];
}

/** Individual risk signal */
export interface RiskSignal {
  /** Signal identifier */
  id: string;
  /** Human-readable name (i18n key) */
  label: string;
  /** Contribution to risk score (0-100) */
  weight: number;
  /** Confidence in this signal */
  confidence: number;
  /** Raw value that triggered this signal */
  value: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Flag score threshold — above this, profile needs review */
const FLAG_THRESHOLD = 60;

/** Profiles older than this (30 days) increase trust */
const AGE_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;

/** Photo uploaded more than 90 days before profile creation = suspicious */
const PHOTO_AGE_SUSPICIOUS_MS = 90 * 24 * 60 * 60 * 1000;

/** Reply faster than 500ms = bot-like (unless face verified) */
const FAST_REPLY_THRESHOLD_MS = 500;

/** Constant inter-message interval variation below this = bot pattern */
const CONSTANT_INTERVAL_TOLERANCE = 150;

/** Phrases that trigger money/scam flags (EN) */
const SCAM_PHRASES = [
  "send money",
  "wire transfer",
  "western union",
  "gift card",
  "crypto wallet",
  "bitcoin",
  "verification fee",
  "advance fee",
  "it's urgent",
  "emergency",
  "can't video call",
  "no video",
  "broken camera",
];

/** Phrases that trigger money/scam flags (UK) */
const SCAM_PHRASES_UK = [
  "перекажи гроші",
  "відправ гроші",
  "щоб відкрити",
  "щоб заблокувати",
  "терміново",
  "не можу дзвонити",
  "камера зламана",
  "криптогаманець",
  "подарункова карта",
];

/** Phrases that trigger money/scam flags (RU) */
const SCAM_PHRASES_RU = [
  "переведи деньги",
  "отправь деньги",
  "срочно",
  "не могу позвонить",
  "камера сломана",
  "криптокошелек",
  "подарочная карта",
];

// ─── Analysis Engine ─────────────────────────────────────────────────────────

/**
 * Analyzes a profile for catfish risk based on behavioral signals.
 * Pure function — no side effects. Deterministic given the same inputs.
 */
export function assessCatfishRisk(profile: BehaviorProfile): RiskAssessment {
  const signals: RiskSignal[] = [];

  // ── Signal 1: Photo age (stolen photo check) ──
  if (profile.photoUploadedAt && profile.createdAt) {
    const photoAge = profile.createdAt - profile.photoUploadedAt;
    if (photoAge > PHOTO_AGE_SUSPICIOUS_MS) {
      signals.push({
        id: "photo_age",
        label: "photoPhotographAge",
        weight: 30,
        confidence: 0.7,
        value: photoAge,
      });
    }
  }

  // ── Signal 2: Profile age (new accounts are riskier) ──
  if (profile.createdAt) {
    const profileAge = Date.now() - profile.createdAt;
    if (profileAge < AGE_THRESHOLD_MS) {
      const youthFactor = Math.max(0, 1 - profileAge / AGE_THRESHOLD_MS);
      signals.push({
        id: "profile_age",
        label: "profileAgeNew",
        weight: Math.round(15 * youthFactor),
        confidence: 0.5 + 0.4 * youthFactor,
        value: profileAge,
      });
    }
  }

  // ── Signal 3: Verification completeness ──
  const missingVerifications: string[] = [];
  if (!profile.faceVerified) missingVerifications.push("face");
  if (!profile.stdVerified) missingVerifications.push("std");
  if (!profile.dnaVerified) missingVerifications.push("dna");

  if (missingVerifications.length > 0) {
    signals.push({
      id: "missing_verification",
      label: "missingVerification",
      weight: Math.min(30, missingVerifications.length * 10),
      confidence: 0.7,
      value: missingVerifications.length,
    });
  }

  // ── Signal 4: Message timing analysis ──
  const messages = profile.messages || [];
  if (messages.length >= 4) {
    const timingRisk = analyzeMessageTiming(messages);
    if (timingRisk.weight > 0) {
      signals.push(timingRisk);
    }
  }

  // ── Signal 5: Scam content ──
  const scamRisk = analyzeScamContent(messages);
  if (scamRisk.weight > 0) {
    signals.push(scamRisk);
  }

  // ── Aggregate score (capped at 100) ──
  const total = Math.min(
    100,
    signals.reduce((sum, s) => sum + s.weight, 0),
  );

  // Weight by confidence (lower confidence signals contribute less)
  const confidenceWeighted = signals.reduce((sum, s) => sum + s.weight * s.confidence, 0);
  const score = Math.min(100, Math.round(confidenceWeighted));

  // Derive risk level and flag status
  const level: RiskAssessment["level"] = score >= 61 ? "high" : score >= 31 ? "moderate" : "low";
  const flagged = score >= FLAG_THRESHOLD;

  // Collect reasons for flagging
  const reasons: string[] = [];
  if (flagged) {
    for (const s of signals) {
      reasons.push(s.label);
    }
  }

  return {
    score,
    level,
    signals,
    flagged,
    reasons,
  };
}

/**
 * Analyzes message timing for bot-like patterns.
 * Bots reply with constant intervals or impossibly fast turnaround.
 */
function analyzeMessageTiming(messages: BehaviorMessage[]): RiskSignal {
  const theirMessages = messages
    .filter((m) => m.sender === "them")
    .sort((a, b) => a.timestamp - b.timestamp);

  if (theirMessages.length < 3) {
    return { id: "timing", label: "timing", weight: 0, confidence: 0, value: 0 };
  }

  // Calculate inter-message intervals
  const intervals: number[] = [];
  for (let i = 1; i < theirMessages.length; i++) {
    intervals.push(theirMessages[i].timestamp - theirMessages[i - 1].timestamp);
  }

  // Check for impossibly fast first-response (after our last message)
  const lastOurs = [...messages]
    .filter((m) => m.sender === "me")
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  let fastReplyRisk = 0;
  if (lastOurs) {
    const firstTheirsAfter = theirMessages.find((m) => m.timestamp > lastOurs.timestamp);
    if (firstTheirsAfter) {
      const responseTime = firstTheirsAfter.timestamp - lastOurs.timestamp;
      if (responseTime < FAST_REPLY_THRESHOLD_MS) {
        fastReplyRisk = 20;
      }
    }
  }

  // Check for constant intervals (bot pattern)
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const maxDeviation = Math.max(...intervals.map((i) => Math.abs(i - avgInterval)));
  let constantIntervalRisk = 0;
  if (maxDeviation < CONSTANT_INTERVAL_TOLERANCE && avgInterval > 0) {
    constantIntervalRisk = 25;
  }

  // Combined timing risk
  const combinedWeight = fastReplyRisk + constantIntervalRisk;
  if (combinedWeight === 0) {
    return { id: "timing", label: "timing", weight: 0, confidence: 0, value: 0 };
  }

  return {
    id: "timing",
    label: "timingSuspicious",
    weight: Math.min(30, combinedWeight),
    confidence: 0.75,
    value: combinedWeight,
  };
}

/**
 * Detects scam-content red flags in messages.
 */
function analyzeScamContent(messages: BehaviorMessage[]): RiskSignal {
  const allText = messages.map((m) => m.text.toLowerCase()).join(" ");
  if (!allText) {
    return { id: "scam", label: "scam", weight: 0, confidence: 0, value: 0 };
  }

  const allPhrases = [...SCAM_PHRASES, ...SCAM_PHRASES_UK, ...SCAM_PHRASES_RU];
  const hits = allPhrases.filter((phrase) => allText.includes(phrase));

  if (hits.length === 0) {
    return { id: "scam", label: "scam", weight: 0, confidence: 0, value: 0 };
  }

  // Multiple hits = stronger signal
  const weight = Math.min(40, hits.length * 15);
  return {
    id: "scam",
    label: "scamSuspicious",
    weight,
    confidence: Math.min(0.95, 0.5 + hits.length * 0.15),
    value: hits.length,
  };
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/**
 * Returns the risk level label for display.
 */
export function getRiskLabel(level: RiskAssessment["level"]): string {
  switch (level) {
    case "high":
      return "riskHigh";
    case "moderate":
      return "riskModerate";
    case "low":
      return "riskLow";
    default:
      return "riskLow";
  }
}
