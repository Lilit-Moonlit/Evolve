import { describe, it, expect } from "vitest";
import {
  parseStdTestResult,
  checkStdCompatibility,
  getCompatibilityLabel,
  PATHOGENS,
  StdCompatibilityResult,
} from "./std-parser";

// ============================================================
// parseStdTestResult
// ============================================================
describe("parseStdTestResult", () => {
  // --- Empty / missing input ---
  it("returns empty result for empty string", () => {
    const r = parseStdTestResult("");
    expect(r.pathogens).toHaveLength(0);
    expect(r.isAllNegative).toBe(false);
    expect(r.hasPositive).toBe(false);
    expect(r.positiveList).toHaveLength(0);
  });

  it("returns empty result for whitespace-only string", () => {
    const r = parseStdTestResult("   \n\t  ");
    expect(r.pathogens).toHaveLength(0);
    expect(r.rawText).toBe("");
  });

  it("returns empty result for null-ish input", () => {
    const r = parseStdTestResult(undefined as unknown as string);
    expect(r.pathogens).toHaveLength(0);
  });

  // --- Single pathogen detection ---
  it("detects HIV positive in English", () => {
    const r = parseStdTestResult("HIV: positive");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hiv");
    expect(r.pathogens[0].status).toBe("positive");
    expect(r.hasPositive).toBe(true);
    expect(r.positiveList).toContain("HIV-1/2");
  });

  it("detects HIV negative in English", () => {
    const r = parseStdTestResult("HIV: negative");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
    expect(r.hasPositive).toBe(false);
  });

  it("detects Syphilis positive (reactive)", () => {
    const r = parseStdTestResult("Syphilis: reactive");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("syphilis");
    expect(r.pathogens[0].status).toBe("positive");
  });

  it("detects Chlamydia negative (not detected)", () => {
    const r = parseStdTestResult("Chlamydia: not detected");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
  });

  it("detects Gonorrhea positive via symbol +", () => {
    const r = parseStdTestResult("Gonorrhea: +");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("gonorrhea");
    expect(r.pathogens[0].status).toBe("positive");
  });

  it("detects HSV-1 negative via 'norm'", () => {
    const r = parseStdTestResult("HSV-1: norm");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
  });

  it("detects Hepatitis B positive via 'detected'", () => {
    const r = parseStdTestResult("Hepatitis B: detected");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hepatitis_b");
    expect(r.pathogens[0].status).toBe("positive");
  });

  it("detects Hepatitis C negative via 'clear'", () => {
    const r = parseStdTestResult("Hepatitis C: clear");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
  });

  it("detects non-reactive as negative", () => {
    const r = parseStdTestResult("HIV: non-reactive");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
  });

  it("detects absent as negative", () => {
    const r = parseStdTestResult("Syphilis: absent");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
  });

  // --- Multiple pathogens (each on separate line) ---
  it("detects multiple pathogens in one text", () => {
    const r = parseStdTestResult(
      "HIV: negative\nSyphilis: positive\nChlamydia: not detected\nGonorrhea: negative",
    );
    expect(r.pathogens).toHaveLength(4);
    expect(r.hasPositive).toBe(true);
    expect(r.positiveList).toEqual(["Syphilis"]);
  });

  it("detects all negative across multiple pathogens", () => {
    const r = parseStdTestResult(
      "HIV: negative\nSyphilis: negative\nChlamydia: negative\nGonorrhea: negative",
    );
    expect(r.pathogens).toHaveLength(4);
    expect(r.hasPositive).toBe(false);
    expect(r.positiveList).toHaveLength(0);
  });

  // --- "All negative" pattern detection ---
  it("detects 'negative for all' pattern (English)", () => {
    const r = parseStdTestResult(
      "HIV: negative, Syphilis: negative, Chlamydia: negative. All negative.",
    );
    expect(r.isAllNegative).toBe(true);
    expect(r.hasPositive).toBe(false);
  });

  it("detects 'негативний для всіх' pattern (Ukrainian)", () => {
    const r = parseStdTestResult(
      "ВІЛ: негативний, Сифіліс: негативний. Негативний для всіх.",
    );
    expect(r.isAllNegative).toBe(true);
  });

  it("detects 'все отрицательные' pattern (Russian)", () => {
    const r = parseStdTestResult(
      "ВИЧ: отрицательный, Сифилис: отрицательный. Все отрицательные.",
    );
    expect(r.isAllNegative).toBe(true);
  });

  it("detects 'all negative' pattern", () => {
    const r = parseStdTestResult("HIV: negative. all negative");
    expect(r.isAllNegative).toBe(true);
  });

  it("does not mark isAllNegative when there is a positive", () => {
    const r = parseStdTestResult(
      "HIV: positive\nSyphilis: negative. all negative",
    );
    expect(r.isAllNegative).toBe(false);
    expect(r.hasPositive).toBe(true);
  });

  // --- Ukrainian language ---
  it("detects ВІЛ (HIV) positive in Ukrainian", () => {
    const r = parseStdTestResult("Аналіз: ВІЛ позитивний");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hiv");
    expect(r.pathogens[0].status).toBe("positive");
  });

  it("detects Сифіліс negative in Ukrainian", () => {
    const r = parseStdTestResult("Сифіліс: негативний");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("syphilis");
    expect(r.pathogens[0].status).toBe("negative");
  });

  it("detects Хламідії positive in Ukrainian", () => {
    const r = parseStdTestResult("Хламідії: виявлено");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("chlamydia");
    expect(r.pathogens[0].status).toBe("positive");
  });

  it("detects Герпес типу 1 negative in Ukrainian", () => {
    const r = parseStdTestResult("Герпес типу 1: відсутній");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hsv1");
    expect(r.pathogens[0].status).toBe("negative");
  });

  // --- Russian language ---
  it("detects ВИЧ (HIV) positive in Russian", () => {
    const r = parseStdTestResult("Анализ: ВИЧ положительный");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hiv");
    expect(r.pathogens[0].status).toBe("positive");
  });

  it("detects Сифилис negative in Russian", () => {
    const r = parseStdTestResult("Сифилис: отрицательный");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("syphilis");
    expect(r.pathogens[0].status).toBe("negative");
  });

  it("detects Хламидиоз positive in Russian", () => {
    const r = parseStdTestResult("Хламидиоз: обнаружен");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("chlamydia");
    expect(r.pathogens[0].status).toBe("positive");
  });

  // --- Alias variants ---
  it("detects 'hiv-1/2' alias", () => {
    const r = parseStdTestResult("hiv-1/2: negative");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hiv");
  });

  it("detects 'hbv' alias for Hepatitis B", () => {
    const r = parseStdTestResult("hbv: positive");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hepatitis_b");
  });

  it("detects 'hcv' alias for Hepatitis C", () => {
    const r = parseStdTestResult("hcv: negative");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hepatitis_c");
  });

  it("detects 'herpes simplex 2' alias", () => {
    const r = parseStdTestResult("herpes simplex 2: positive");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hsv2");
  });

  it("detects 'neisseria gonorrhoeae' alias", () => {
    const r = parseStdTestResult("neisseria gonorrhoeae: detected");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("gonorrhea");
  });

  it("detects 'lues' alias for Syphilis", () => {
    const r = parseStdTestResult("lues: negative");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("syphilis");
  });

  it("detects 'oral herpes' alias for HSV-1", () => {
    const r = parseStdTestResult("oral herpes: not detected");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hsv1");
  });

  it("detects 'genital herpes' alias for HSV-2", () => {
    const r = parseStdTestResult("genital herpes: positive");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].pathogenId).toBe("hsv2");
  });

  // --- Unknown status ---
  it("returns unknown when no status keyword found", () => {
    const r = parseStdTestResult("HIV: ???");
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("unknown");
  });

  // --- Overlapping mentions ---
  it("deduplicates overlapping pathogen mentions", () => {
    const r = parseStdTestResult("хламідіоз: позитивний");
    const chlamydiaResults = r.pathogens.filter(
      (p) => p.pathogenId === "chlamydia",
    );
    expect(chlamydiaResults).toHaveLength(1);
  });

  // --- Context window (tight — 50 before, 80 after) ---
  it("detects status within tight context window", () => {
    const prefix = "A".repeat(40);
    const r = parseStdTestResult(`${prefix} HIV negative`);
    expect(r.pathogens).toHaveLength(1);
    expect(r.pathogens[0].status).toBe("negative");
  });

  // --- Complex real-world format ---
  it("parses a realistic lab report", () => {
    const report = `
      MEDICAL CENTER - STD Panel Results
      Date: 2026-01-15

      HIV-1/2 Ab/Ag: Non-reactive
      Syphilis (RPR): Non-reactive
      Chlamydia trachomatis: Not Detected
      Neisseria gonorrhoeae: Not Detected
      HSV-1 IgG: Positive
      HSV-2 IgG: Negative
      Hepatitis B (HBsAg): Non-reactive
      Hepatitis C Antibody: Non-reactive

      ALL NEGATIVE FOR ALL
    `;
    const r = parseStdTestResult(report);
    expect(r.pathogens.length).toBeGreaterThanOrEqual(6);
    expect(r.hasPositive).toBe(true);
    expect(r.positiveList).toContain("HSV-1 (Herpes Simplex 1)");
    expect(r.pathogens.find((p) => p.pathogenId === "hsv2")?.status).toBe(
      "negative",
    );
  });

  // --- Duplicate pathogen names ---
  it("does not duplicate pathogen entries for repeated mentions", () => {
    const r = parseStdTestResult(
      "HIV: negative. HIV test was clear. No HIV found.",
    );
    const hivResults = r.pathogens.filter((p) => p.pathogenId === "hiv");
    expect(hivResults).toHaveLength(1);
  });

  // --- Cross-contamination regression ---
  it("does not cross-contaminate between adjacent pathogens", () => {
    const r = parseStdTestResult(
      "HIV: negative\nSyphilis: positive\nChlamydia: negative",
    );
    expect(r.pathogens.find((p) => p.pathogenId === "hiv")?.status).toBe(
      "negative",
    );
    expect(r.pathogens.find((p) => p.pathogenId === "syphilis")?.status).toBe(
      "positive",
    );
    expect(r.pathogens.find((p) => p.pathogenId === "chlamydia")?.status).toBe(
      "negative",
    );
  });

  it("does not cross-contaminate 'not detected' with 'detected'", () => {
    const r = parseStdTestResult(
      "Chlamydia: not detected\nGonorrhea: detected",
    );
    expect(r.pathogens.find((p) => p.pathogenId === "chlamydia")?.status).toBe(
      "negative",
    );
    expect(r.pathogens.find((p) => p.pathogenId === "gonorrhea")?.status).toBe(
      "positive",
    );
  });
});

// ============================================================
// checkStdCompatibility
// ============================================================
describe("checkStdCompatibility", () => {
  const makeResult = parseStdTestResult;

  // --- No data ---
  it("returns potential_risk when both have no data", () => {
    const r = checkStdCompatibility(makeResult(""), makeResult(""));
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
    expect(r.reason).toContain("no STD test data");
  });

  it("returns potential_risk when one has no data", () => {
    const neg = makeResult("HIV: negative");
    const r = checkStdCompatibility(neg, makeResult(""));
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
  });

  // --- Both negative ---
  it("returns potential_risk when panels differ (different pathogens tested)", () => {
    // A tested for HIV+Syphilis, B tested for HIV+Chlamydia
    // Syphilis unknown for B, Chlamydia unknown for A → potential_risk
    const a = makeResult("HIV: negative\nSyphilis: negative");
    const b = makeResult("HIV: negative\nChlamydia: negative");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
    expect(r.sharedPathogens).toHaveLength(0);
    expect(r.riskyPathogens).toContain("Syphilis");
    expect(r.riskyPathogens).toContain("Chlamydia");
  });

  it("returns safe when both have identical all-negative panels", () => {
    const a = makeResult("HIV: negative\nSyphilis: negative");
    const b = makeResult("HIV: negative\nSyphilis: negative");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("none");
  });

  // --- Same strain (both positive for same pathogen) ---
  it("returns safe same_strain when both positive for HIV", () => {
    const a = makeResult("HIV: positive");
    const b = makeResult("HIV: positive");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("same_strain");
    expect(r.sharedPathogens).toContain("HIV-1/2");
    expect(r.riskyPathogens).toHaveLength(0);
  });

  it("returns safe same_strain for multiple shared positives", () => {
    const a = makeResult("HIV: positive\nHSV-1: positive");
    const b = makeResult("HIV: positive\nHSV-1: positive");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("same_strain");
    expect(r.sharedPathogens).toHaveLength(2);
  });

  // --- High risk (explicit positive vs explicit negative on same pathogen) ---
  it("returns high_risk when one is HIV+ and other is HIV-", () => {
    const a = makeResult("HIV: positive");
    const b = makeResult("HIV: negative");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("high_risk");
    expect(r.riskyPathogens).toContain("HIV-1/2");
  });

  it("returns high_risk when Syphilis is positive/negative mismatch", () => {
    const a = makeResult("Syphilis: positive");
    const b = makeResult("Syphilis: negative");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("high_risk");
    expect(r.riskyPathogens).toContain("Syphilis");
  });

  // --- Potential risk (unknown status — only one has data) ---
  it("returns potential_risk when one pathogen is unknown", () => {
    const a = makeResult("HIV: positive");
    const b = makeResult("HIV: something unclear");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
    expect(r.riskyPathogens).toContain("HIV-1/2");
  });

  // --- Mixed scenario: shared + unknown ---
  it("returns potential_risk when sharing one but unknown on another", () => {
    const a = makeResult("HIV: positive\nSyphilis: positive");
    const b = makeResult("HIV: positive\nSyphilis: unknown");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
    expect(r.sharedPathogens).toContain("HIV-1/2");
    expect(r.riskyPathogens).toContain("Syphilis");
  });

  // --- Different pathogens tested ---
  it("returns potential_risk when one person lacks data for pathogen", () => {
    const a = makeResult("HIV: positive");
    const b = makeResult("Syphilis: negative");
    // HIV: A=positive, B=unknown → risky
    // Syphilis: A=unknown, B=negative → risky
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
    expect(r.riskyPathogens.length).toBeGreaterThanOrEqual(1);
  });

  // --- Both all negative via "all negative" pattern ---
  it("recognizes both all-negative via pattern", () => {
    const a = makeResult("HIV: negative. All negative.");
    const b = makeResult("Syphilis: negative. All negative.");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("none");
  });

  // --- Multi-pathogen complex scenario ---
  it("handles complex multi-pathogen comparison", () => {
    const a = makeResult(
      "HIV: negative\nSyphilis: positive\nChlamydia: negative\nHSV-1: positive\nHepatitis B: negative",
    );
    const b = makeResult(
      "HIV: negative\nSyphilis: positive\nChlamydia: positive\nHSV-1: positive\nHepatitis C: negative",
    );
    const r = checkStdCompatibility(a, b);
    // HIV: both neg → safe
    // Syphilis: both pos → shared
    // Chlamydia: A neg, B pos → high_risk
    // HSV-1: both pos → shared
    // Hep B: only A → unknown → risky
    // Hep C: only B → unknown → risky
    expect(r.safe).toBe(false);
    expect(r.sharedPathogens).toContain("Syphilis");
    expect(r.sharedPathogens).toContain("HSV-1 (Herpes Simplex 1)");
    expect(r.riskyPathogens).toContain("Chlamydia");
    expect(r.riskyPathogens).toContain("Hepatitis B");
    expect(r.riskyPathogens).toContain("Hepatitis C");
    expect(r.riskyPathogens.length).toBeGreaterThanOrEqual(2);
  });

  // --- Edge: same pathogens, different set sizes ---
  it("returns potential_risk when one person lacks data for pathogen", () => {
    // A tested HIV only, B tested HIV+Syphilis
    // Syphilis is unknown for A → potential_risk
    const a = makeResult("HIV: negative");
    const b = makeResult("HIV: negative\nSyphilis: negative");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("potential_risk");
    expect(r.riskyPathogens).toContain("Syphilis");
  });
});

// ============================================================
// getCompatibilityLabel
// ============================================================
describe("getCompatibilityLabel", () => {
  const makeLabel = (riskLevel: StdCompatibilityResult["riskLevel"]) =>
    getCompatibilityLabel({
      safe: riskLevel === "none" || riskLevel === "same_strain",
      riskLevel,
      reason: "",
      sharedPathogens: [],
      riskyPathogens: [],
    });

  it("returns green Safe Match for none", () => {
    const l = makeLabel("none");
    expect(l.label).toBe("Safe Match");
    expect(l.color).toBe("green");
    expect(l.icon).toBe("✅");
  });

  it("returns blue Compatible for same_strain", () => {
    const l = makeLabel("same_strain");
    expect(l.label).toBe("Compatible");
    expect(l.color).toBe("blue");
    expect(l.icon).toBe("💙");
  });

  it("returns yellow Caution for potential_risk", () => {
    const l = makeLabel("potential_risk");
    expect(l.label).toBe("Caution");
    expect(l.color).toBe("yellow");
    expect(l.icon).toContain("⚠");
  });

  it("returns red Risk Detected for high_risk", () => {
    const l = makeLabel("high_risk");
    expect(l.label).toBe("Risk Detected");
    expect(l.color).toBe("red");
    expect(l.icon).toBe("🚫");
  });
});

// ============================================================
// PATHOGENS constant
// ============================================================
describe("PATHOGENS", () => {
  it("defines exactly 8 pathogens", () => {
    expect(Object.keys(PATHOGENS)).toHaveLength(8);
  });

  it("each pathogen has id, name, and aliases", () => {
    for (const [, p] of Object.entries(PATHOGENS)) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(Array.isArray(p.aliases)).toBe(true);
      expect(p.aliases.length).toBeGreaterThan(0);
    }
  });

  it("all pathogen ids are unique", () => {
    const ids = Object.values(PATHOGENS).map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each pathogen has aliases in at least 2 languages", () => {
    for (const [key, p] of Object.entries(PATHOGENS)) {
      const hasLatin = p.aliases.some((a) => /^[a-z0-9\s\-\/]+$/i.test(a));
      const hasCyrillic = p.aliases.some((a) => /[а-яіїєґ]/i.test(a));
      expect(hasLatin).toBe(true);
      expect(hasCyrillic).toBe(true);
    }
  });
});

// ============================================================
// Integration: parse → compatibility
// ============================================================
describe("Integration: parse → compatibility", () => {
  it("two clean users match as safe", () => {
    const a = parseStdTestResult(
      "HIV: negative\nSyphilis: negative\nChlamydia: negative\nGonorrhea: negative\nHSV-1: negative\nHSV-2: negative\nHepatitis B: negative\nHepatitis C: negative. All negative.",
    );
    const b = parseStdTestResult(
      "HIV: negative\nSyphilis: negative\nChlamydia: negative\nGonorrhea: negative\nHSV-1: negative\nHSV-2: negative\nHepatitis B: negative\nHepatitis C: negative. All negative.",
    );
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("none");
  });

  it("HIV+ with HIV- is high risk", () => {
    const a = parseStdTestResult("HIV-1/2: positive (detected)");
    const b = parseStdTestResult("HIV-1/2: negative (not detected)");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("high_risk");
  });

  it("two HIV+ users are same_strain (safe to match)", () => {
    const a = parseStdTestResult("HIV-1/2: reactive");
    const b = parseStdTestResult("ВІЛ-1: позитивний");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("same_strain");
  });

  it("Ukrainian and English results are compared correctly", () => {
    const a = parseStdTestResult("Сифіліс: позитивний");
    const b = parseStdTestResult("Syphilis: positive");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("same_strain");
  });

  it("Russian and English results are compared correctly", () => {
    const a = parseStdTestResult("ВИЧ: положительный");
    const b = parseStdTestResult("HIV: positive");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(true);
    expect(r.riskLevel).toBe("same_strain");
  });

  it("mixed Ukrainian negative + English positive = high risk", () => {
    const a = parseStdTestResult("ВІЛ: негативний");
    const b = parseStdTestResult("HIV: positive");
    const r = checkStdCompatibility(a, b);
    expect(r.safe).toBe(false);
    expect(r.riskLevel).toBe("high_risk");
  });
});
