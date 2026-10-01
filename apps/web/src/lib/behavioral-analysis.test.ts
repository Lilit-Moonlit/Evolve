import { describe, it, expect } from "vitest";
import {
  assessCatfishRisk,
  getRiskLabel,
  BehaviorProfile,
  RiskAssessment,
} from "./behavioral-analysis";

// ─── Helper: build a profile with defaults ───────────────────────────────────
function makeProfile(overrides: Partial<BehaviorProfile> = {}): BehaviorProfile {
  const now = Date.now();
  return {
    id: "p1",
    createdAt: now - 30 * 24 * 60 * 60 * 1000, // 30 days old
    photoUploadedAt: now - 30 * 24 * 60 * 60 * 1000, // uploaded with profile
    faceVerified: true,
    stdVerified: true,
    dnaVerified: true,
    messages: [],
    ...overrides,
  };
}

// ─── assessCatfishRisk ───────────────────────────────────────────────────────
describe("assessCatfishRisk", () => {
  it("returns low risk for a fully verified, old profile", () => {
    const result = assessCatfishRisk(makeProfile());
    expect(result.level).toBe("low");
    expect(result.score).toBeLessThan(31);
    expect(result.flagged).toBe(false);
  });

  it("returns zero signals for a perfect profile", () => {
    const result = assessCatfishRisk(makeProfile());
    expect(result.signals).toHaveLength(0);
    expect(result.reasons).toHaveLength(0);
  });

  it("flags brand-new profiles with no verification", () => {
    const now = Date.now();
    const result = assessCatfishRisk(
      makeProfile({
        createdAt: now - 60 * 1000, // 1 minute old
        photoUploadedAt: now - 60 * 1000,
        faceVerified: false,
        stdVerified: false,
        dnaVerified: false,
      }),
    );
    expect(result.score).toBeGreaterThanOrEqual(31);
    expect(result.level).toBe("moderate");
  });

  it("flags profiles with very old photos (stolen photo risk)", () => {
    const now = Date.now();
    const result = assessCatfishRisk(
      makeProfile({
        createdAt: now - 24 * 60 * 60 * 1000, // 1 day ago
        photoUploadedAt: now - 200 * 24 * 60 * 60 * 1000, // 200 days ago
      }),
    );
    // Photo age signal should fire
    const photoAgeSignal = result.signals.find((s) => s.id === "photo_age");
    expect(photoAgeSignal).toBeDefined();
    expect(photoAgeSignal!.weight).toBe(30);
  });

  it("does NOT flag recent photos", () => {
    const now = Date.now();
    const result = assessCatfishRisk(
      makeProfile({
        photoUploadedAt: now - 20 * 24 * 60 * 60 * 1000, // 20 days ago
      }),
    );
    const photoAgeSignal = result.signals.find((s) => s.id === "photo_age");
    expect(photoAgeSignal).toBeUndefined();
  });

  it("flags bot-like constant reply intervals", () => {
    const now = Date.now();
    const messages = [
      { timestamp: now - 10000, sender: "me" as const, text: "hi there" },
      { timestamp: now - 5000, sender: "them" as const, text: "hello" },
      { timestamp: now - 4000, sender: "them" as const, text: "how are you" },
      { timestamp: now - 3000, sender: "them" as const, text: "nice to meet you" },
      { timestamp: now - 2000, sender: "them" as const, text: "what's up" },
    ];
    const result = assessCatfishRisk(makeProfile({ messages }));
    const timingSignal = result.signals.find((s) => s.id === "timing");
    expect(timingSignal).toBeDefined();
    expect(timingSignal!.weight).toBeGreaterThan(0);
  });

  it("does NOT flag normal conversation patterns", () => {
    const now = Date.now();
    const messages = [
      { timestamp: now - 100000, sender: "me" as const, text: "hi" },
      { timestamp: now - 95000, sender: "them" as const, text: "hello!" },
      { timestamp: now - 60000, sender: "me" as const, text: "how was your day?" },
      { timestamp: now - 55000, sender: "them" as const, text: "pretty good, thanks!" },
    ];
    const result = assessCatfishRisk(makeProfile({ messages }));
    const timingSignal = result.signals.find((s) => s.id === "timing");
    // Variations in response time should NOT trigger bot flag
    expect(timingSignal).toBeUndefined();
  });

  it("flags scam content phrases", () => {
    const now = Date.now();
    const messages = [
      { timestamp: now - 1000, sender: "them" as const, text: "Please send money to unlock" },
      { timestamp: now - 2000, sender: "them" as const, text: "It's urgent, wire transfer" },
    ];
    const result = assessCatfishRisk(makeProfile({ messages }));
    const scamSignal = result.signals.find((s) => s.id === "scam");
    expect(scamSignal).toBeDefined();
    expect(scamSignal!.weight).toBeGreaterThan(0);
  });

  it("flags profiles that are high risk overall", () => {
    const now = Date.now();
    const messages = [
      { timestamp: now - 5000, sender: "me" as const, text: "hi" },
      { timestamp: now - 4900, sender: "them" as const, text: "hello, please send money" },
      { timestamp: now - 4800, sender: "them" as const, text: "wire transfer urgent" },
      { timestamp: now - 4700, sender: "me" as const, text: "why?" },
      { timestamp: now - 4600, sender: "them" as const, text: "western union now" },
    ];
    // New profile, no verification, scam content, fast replies
    const result = assessCatfishRisk(
      makeProfile({
        createdAt: now - 60 * 1000,
        photoUploadedAt: now - 200 * 24 * 60 * 60 * 1000,
        faceVerified: false,
        stdVerified: false,
        dnaVerified: false,
        messages,
      }),
    );
    expect(result.level).toBe("high");
    expect(result.flagged).toBe(true);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("covers scam phrases in Ukrainian", () => {
    const now = Date.now();
    const messages = [
      { timestamp: now - 1000, sender: "them" as const, text: "Терміново перекажи гроші" },
    ];
    const result = assessCatfishRisk(makeProfile({ messages }));
    const scamSignal = result.signals.find((s) => s.id === "scam");
    expect(scamSignal).toBeDefined();
  });

  it("covers scam phrases in Russian", () => {
    const now = Date.now();
    const messages = [
      { timestamp: now - 1000, sender: "them" as const, text: "Срочно, отправь деньги" },
    ];
    const result = assessCatfishRisk(makeProfile({ messages }));
    const scamSignal = result.signals.find((s) => s.id === "scam");
    expect(scamSignal).toBeDefined();
  });
});

// ─── getRiskLabel ────────────────────────────────────────────────────────────
describe("getRiskLabel", () => {
  it("returns correct labels for each level", () => {
    expect(getRiskLabel("low")).toBe("riskLow");
    expect(getRiskLabel("moderate")).toBe("riskModerate");
    expect(getRiskLabel("high")).toBe("riskHigh");
  });
});
