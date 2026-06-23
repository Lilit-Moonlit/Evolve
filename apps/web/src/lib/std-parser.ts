/**
 * STD Test Result Parser
 *
 * Parses free-text STD test results and extracts pathogen information.
 * Supports multiple languages and test result formats.
 */

// Standard pathogen definitions with aliases in multiple languages
export const PATHOGENS = {
  HIV: {
    id: "hiv",
    name: "HIV-1/2",
    aliases: [
      "hiv",
      "hiv-1",
      "hiv-1/2",
      "hiv-2",
      "hiv 1/2",
      "віл",
      "віл-1",
      "віл-1/2",
      "вич",
      "вич-1",
      "vihs",
      "vihs-1",
      "вирус иммунодефицита человека",
    ],
  },
  SYPHILIS: {
    id: "syphilis",
    name: "Syphilis",
    aliases: ["syphilis", "syph", "сифіліс", "сиф", "сифилис", "lues"],
  },
  CHLAMYDIA: {
    id: "chlamydia",
    name: "Chlamydia",
    aliases: [
      "chlamydia",
      "chl",
      "хламідіоз",
      "хламідії",
      "хламидиоз",
      "хламидии",
      "chlamydia trachomatis",
    ],
  },
  GONORRHEA: {
    id: "gonorrhea",
    name: "Gonorrhea",
    aliases: [
      "gonorrhea",
      "gonorrhoea",
      "gon",
      "гонорея",
      "гонорея",
      "гонорея",
      "neisseria gonorrhoeae",
    ],
  },
  HSV1: {
    id: "hsv1",
    name: "HSV-1 (Herpes Simplex 1)",
    aliases: [
      "hsv-1",
      "hsv1",
      "herpes-1",
      "herpes 1",
      "herpes simplex 1",
      "герпес-1",
      "герпес 1",
      "герпес типу 1",
      "простой герпес 1",
      "oral herpes",
    ],
  },
  HSV2: {
    id: "hsv2",
    name: "HSV-2 (Herpes Simplex 2)",
    aliases: [
      "hsv-2",
      "hsv2",
      "herpes-2",
      "herpes 2",
      "herpes simplex 2",
      "герпес-2",
      "герпес 2",
      "герпес типу 2",
      "простой герпес 2",
      "genital herpes",
    ],
  },
  HEPATITIS_B: {
    id: "hepatitis_b",
    name: "Hepatitis B",
    aliases: [
      "hepatitis b",
      "hep b",
      "hbv",
      "гепатит б",
      "гепатит в",
      "гепатит b",
      "вірус гепатиту б",
    ],
  },
  HEPATITIS_C: {
    id: "hepatitis_c",
    name: "Hepatitis C",
    aliases: [
      "hepatitis c",
      "hep c",
      "hcv",
      "гепатит с",
      "гепатит c",
      "вірус гепатиту с",
    ],
  },
} as const;

export type PathogenId = (typeof PATHOGENS)[keyof typeof PATHOGENS]["id"];

export interface PathogenResult {
  pathogenId: PathogenId;
  pathogenName: string;
  status: "positive" | "negative" | "unknown";
}

export interface StdTestParseResult {
  pathogens: PathogenResult[];
  isAllNegative: boolean;
  hasPositive: boolean;
  positiveList: string[];
  rawText: string;
}

// Status keywords by language
const POSITIVE_KEYWORDS = [
  "positive",
  "reactive",
  "detected",
  "found",
  "present",
  "позитивний",
  "позитивно",
  "реактивний",
  "виявлено",
  "знайдено",
  "положительный",
  "положительно",
  "реактивный",
  "обнаружен",
  "+",
  "++",
  "+++",
];

const NEGATIVE_KEYWORDS = [
  "negative",
  "non-reactive",
  "not detected",
  "absent",
  "clear",
  "негативний",
  "негативно",
  "не реактивний",
  "не виявлено",
  "відсутній",
  "отрицательный",
  "отрицательно",
  "не обнаружен",
  "отсутствует",
  "-",
  "norm",
  "normal",
  "норма",
];

/**
 * Check if a keyword appears in text.
 * Uses word-boundary matching for alphabetic keywords to prevent
 * "clear" matching inside "unclear", "norm" inside "normalize", etc.
 * Uses plain includes() for symbol keywords (+, -, ++, etc.)
 */
function containsKeyword(text: string, keyword: string): boolean {
  const isAlphabetic = /^[a-zа-яіїєґ]+$/i.test(keyword);
  if (isAlphabetic && keyword.length >= 4) {
    // Word-boundary match for longer alphabetic keywords
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(^|[\\s,;:()\\-])${escaped}([\\s,;:()\\-]|$)`,
      "i",
    );
    return regex.test(text);
  }
  // Plain includes for short keywords and symbols
  return text.includes(keyword);
}

/**
 * Detect status of a pathogen from surrounding text.
 * Negative keywords checked FIRST to handle "not detected" / "non-reactive" correctly.
 */
function detectStatus(text: string): "positive" | "negative" | "unknown" {
  const lower = text.toLowerCase();

  // Check negative first — "not detected" must beat "detected"
  for (const keyword of NEGATIVE_KEYWORDS) {
    if (containsKeyword(lower, keyword.toLowerCase())) {
      return "negative";
    }
  }

  for (const keyword of POSITIVE_KEYWORDS) {
    if (containsKeyword(lower, keyword.toLowerCase())) {
      return "positive";
    }
  }

  return "unknown";
}

/**
 * Extract pathogen mentions from text
 */
function findPathogenMentions(
  text: string,
): { pathogenId: PathogenId; startIndex: number; endIndex: number }[] {
  const lower = text.toLowerCase();
  const mentions: {
    pathogenId: PathogenId;
    startIndex: number;
    endIndex: number;
  }[] = [];

  for (const [, pathogen] of Object.entries(PATHOGENS)) {
    for (const alias of pathogen.aliases) {
      const aliasLower = alias.toLowerCase();
      let startIndex = 0;

      while (startIndex < lower.length) {
        const found = lower.indexOf(aliasLower, startIndex);
        if (found === -1) break;

        mentions.push({
          pathogenId: pathogen.id as PathogenId,
          startIndex: found,
          endIndex: found + aliasLower.length,
        });

        startIndex = found + 1;
      }
    }
  }

  // Sort by position, then by length (longest first for same position)
  mentions.sort((a, b) =>
    a.startIndex !== b.startIndex
      ? a.startIndex - b.startIndex
      : b.endIndex - a.endIndex,
  );

  // Remove overlapping mentions (keep longest at each position)
  const filtered: typeof mentions = [];
  for (const mention of mentions) {
    const last = filtered[filtered.length - 1];
    if (!last || mention.startIndex >= last.endIndex) {
      filtered.push(mention);
    }
  }

  return filtered;
}

/**
 * Parse STD test result text and extract pathogen information
 */
export function parseStdTestResult(rawText: string): StdTestParseResult {
  if (!rawText || rawText.trim().length === 0) {
    return {
      pathogens: [],
      isAllNegative: false,
      hasPositive: false,
      positiveList: [],
      rawText: "",
    };
  }

  const mentions = findPathogenMentions(rawText);
  const pathogens: PathogenResult[] = [];
  const seen = new Set<PathogenId>();

  for (const mention of mentions) {
    if (seen.has(mention.pathogenId)) continue;
    seen.add(mention.pathogenId);

    // Find the colon after the pathogen name — status always follows ":"
    const colonIndex = rawText.indexOf(":", mention.endIndex);
    const contextStart =
      colonIndex !== -1 && colonIndex < mention.endIndex + 20
        ? colonIndex
        : mention.endIndex;
    // Get context after the colon, stop at the next line
    const nextNewline = rawText.indexOf("\n", contextStart);
    const contextEnd =
      nextNewline !== -1
        ? nextNewline
        : Math.min(rawText.length, contextStart + 50);
    const context = rawText.substring(contextStart, contextEnd);

    const status = detectStatus(context);
    const pathogen = Object.values(PATHOGENS).find(
      (p) => p.id === mention.pathogenId,
    );

    pathogens.push({
      pathogenId: mention.pathogenId,
      pathogenName: pathogen?.name || mention.pathogenId,
      status,
    });
  }

  // Check for "all negative" pattern
  const lower = rawText.toLowerCase();
  const allNegativePatterns = [
    "negative for all",
    "негативний для всіх",
    "негативно для всех",
    "not detected for all",
    "відсутній для всіх",
    "all negative",
    "все негативні",
    "все отрицательные",
  ];

  const isAllNegative = allNegativePatterns.some((pattern) =>
    lower.includes(pattern),
  );

  // If all negative pattern found and no specific positives, mark all as negative
  if (isAllNegative && pathogens.every((p) => p.status !== "positive")) {
    for (const p of pathogens) {
      p.status = "negative";
    }
  }

  const hasPositive = pathogens.some((p) => p.status === "positive");
  const positiveList = pathogens
    .filter((p) => p.status === "positive")
    .map((p) => p.pathogenName);

  return {
    pathogens,
    isAllNegative: isAllNegative && !hasPositive,
    hasPositive,
    positiveList,
    rawText,
  };
}

/**
 * Check if two people can safely match based on STD results
 *
 * Returns:
 * - safe: true if they can match without risk
 * - reason: explanation of why it's safe/unsafe
 */
export interface StdCompatibilityResult {
  safe: boolean;
  riskLevel: "none" | "same_strain" | "potential_risk" | "high_risk";
  reason: string;
  sharedPathogens: string[];
  riskyPathogens: string[];
}

/**
 * Compare two STD profiles for compatibility
 */
export function checkStdCompatibility(
  parseResult1: StdTestParseResult,
  parseResult2: StdTestParseResult,
): StdCompatibilityResult {
  // If either has no test data, treat as unknown
  if (
    parseResult1.pathogens.length === 0 ||
    parseResult2.pathogens.length === 0
  ) {
    return {
      safe: false,
      riskLevel: "potential_risk",
      reason: "One or both partners have no STD test data",
      sharedPathogens: [],
      riskyPathogens: [],
    };
  }

  // Both all negative → safe
  if (parseResult1.isAllNegative && parseResult2.isAllNegative) {
    return {
      safe: true,
      riskLevel: "none",
      reason: "Both partners are STD-negative",
      sharedPathogens: [],
      riskyPathogens: [],
    };
  }

  const sharedPathogens: string[] = [];
  const riskyPathogens: string[] = [];
  const highRiskPathogens: string[] = [];

  // Compare each pathogen
  const allPathogenIds = new Set<PathogenId>([
    ...parseResult1.pathogens.map((p) => p.pathogenId),
    ...parseResult2.pathogens.map((p) => p.pathogenId),
  ]);

  for (const pathogenId of allPathogenIds) {
    const result1 = parseResult1.pathogens.find(
      (p) => p.pathogenId === pathogenId,
    );
    const result2 = parseResult2.pathogens.find(
      (p) => p.pathogenId === pathogenId,
    );

    const status1 = result1?.status || "unknown";
    const status2 = result2?.status || "unknown";

    const pathogen = Object.values(PATHOGENS).find((p) => p.id === pathogenId);
    const pathogenName = pathogen?.name || pathogenId;

    // Case 1: Both negative → safe for this pathogen
    if (status1 === "negative" && status2 === "negative") {
      continue;
    }

    // Case 2: Both positive → same strain, safe (they already have it)
    if (status1 === "positive" && status2 === "positive") {
      sharedPathogens.push(pathogenName);
      continue;
    }

    // Case 3: One positive, one negative → high risk (explicit conflict)
    if (
      (status1 === "positive" && status2 === "negative") ||
      (status1 === "negative" && status2 === "positive")
    ) {
      highRiskPathogens.push(pathogenName);
      continue;
    }

    // Case 4: At least one unknown → potential risk (we just don't know)
    if (status1 === "unknown" || status2 === "unknown") {
      riskyPathogens.push(pathogenName);
    }
  }

  // Determine overall safety (reason is anonymous — no pathogen names)
  if (
    riskyPathogens.length === 0 &&
    highRiskPathogens.length === 0 &&
    sharedPathogens.length > 0
  ) {
    return {
      safe: true,
      riskLevel: "same_strain",
      reason: "Both partners have compatible health profiles",
      sharedPathogens,
      riskyPathogens,
    };
  }

  if (riskyPathogens.length === 0 && highRiskPathogens.length === 0) {
    return {
      safe: true,
      riskLevel: "none",
      reason: "Both partners are health-compatible",
      sharedPathogens,
      riskyPathogens,
    };
  }

  // Explicit mismatch → high risk
  if (highRiskPathogens.length > 0) {
    return {
      safe: false,
      riskLevel: "high_risk",
      reason: "Health data indicates a risk — review recommended",
      sharedPathogens,
      riskyPathogens: [...highRiskPathogens, ...riskyPathogens],
    };
  }

  // Only unknowns → potential risk
  return {
    safe: false,
    riskLevel: "potential_risk",
    reason:
      sharedPathogens.length > 0
        ? "Partial health data available — some tests missing"
        : "Insufficient health data for compatibility assessment",
    sharedPathogens,
    riskyPathogens,
  };
}

/**
 * Get compatibility label for UI display
 */
export function getCompatibilityLabel(result: StdCompatibilityResult): {
  label: string;
  color: string;
  icon: string;
} {
  switch (result.riskLevel) {
    case "none":
      return {
        label: "Safe Match",
        color: "green",
        icon: "✅",
      };
    case "same_strain":
      return {
        label: "Compatible",
        color: "blue",
        icon: "💙",
      };
    case "potential_risk":
      return {
        label: "Caution",
        color: "yellow",
        icon: "⚠️",
      };
    case "high_risk":
      return {
        label: "Risk Detected",
        color: "red",
        icon: "🚫",
      };
  }
}
