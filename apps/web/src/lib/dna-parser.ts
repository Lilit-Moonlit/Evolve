export interface DNAParseResult {
  valid: boolean;
  strProfile?: STRProfile;
  rawText: string;
  errors: string[];
}

export interface STRProfile {
  markers: {
    [key: string]: number;
  };
  haplogroup?: string;
  metadata?: Record<string, any>;
}

export function parseDNATest(text: string): DNAParseResult {
  const errors: string[] = [];
  let strProfile: STRProfile | undefined;
  let valid = false;

  // Try to extract and parse a JSON object first — JSON takes priority
  // over plain text/CSV when both are present.
  const jsonText = extractJSON(text);
  if (jsonText !== null) {
    const json = JSON.parse(jsonText);
    if (json.markers && typeof json.markers === "object") {
      strProfile = {
        markers: json.markers,
        haplogroup: json.haplogroup,
        metadata: json.metadata,
      };
      valid = true;
    } else {
      errors.push("Invalid JSON format: missing 'markers' field or it's not an object.");
    }
  } else {
    // Not valid JSON — parse as plain text or CSV
    const lines = text.split(/\r?\n/);
    const markers: { [key: string]: number } = {};
    let haplogroup: string | undefined;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Skip CSV header row ("Marker,Value")
      if (/^marker\s*,\s*value$/i.test(trimmed)) return;

      // STR markers: "D5S818: 11", "D13S317=12", or CSV "D5S818,11".
      // Anchored pattern first (whole line is "name:value"), then a
      // non-anchored fallback for lines like "STR D5S818: 11".
      const markerMatch =
        trimmed.match(/^([A-Za-z0-9]+)\s*[:=,]\s*(\d+)$/) ||
        trimmed.match(/([A-Za-z0-9]+)\s*[:=]\s*(\d+)/);
      if (markerMatch) {
        markers[markerMatch[1].toUpperCase()] = parseInt(markerMatch[2], 10);
      }

      // Haplogroup: "Haplogroup: H1a", "HAPLOGROUP: h1a", "Haplogroup is K".
      // Lowercased text is matched with [a-z0-9], then uppercased.
      const lowerLine = trimmed.toLowerCase();
      if (lowerLine.includes("haplogroup")) {
        const haplogroupMatch = lowerLine.match(
          /haplogroup(?:\s*[:=]|\s+is)?\s*[:=]?\s*([a-z0-9]+)/,
        );
        if (haplogroupMatch) {
          haplogroup = haplogroupMatch[1].toUpperCase();
        }
      }
    });

    if (Object.keys(markers).length > 0 || haplogroup) {
      strProfile = { markers, haplogroup };
      valid = true;
    } else {
      errors.push("Could not parse any STR markers or haplogroup from text/CSV.");
    }
  }

  return { valid, strProfile, rawText: text, errors };
}

/**
 * Extracts a JSON object embedded in arbitrary text, or returns null when no
 * valid JSON object is found. The whole text is tried first, then successively
 * shorter suffixes starting from the first "{" so that trailing plain text
 * (e.g. "D5S818: 11") does not defeat JSON priority.
 */
function extractJSON(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  try {
    JSON.parse(text);
    return text;
  } catch {
    // fall through to suffix search
  }

  for (let i = text.length; i > start; i--) {
    const candidate = text.slice(start, i);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // keep shortening the candidate
    }
  }
  return null;
}

export function validateDNAProfile(profile: STRProfile): boolean {
  if (!profile || !profile.markers || Object.keys(profile.markers).length === 0) {
    return false;
  }
  for (const marker in profile.markers) {
    if (typeof profile.markers[marker] !== "number" || profile.markers[marker] <= 0) {
      return false;
    }
  }
  return true;
}

/**
 * Generate a cryptographic commitment for an STR profile.
 *
 * The result is a `bytes32` `0x`-prefixed SHA-256 hex string consumed
 * directly by `DNAVerification.verifyDNA(bytes32)` — no contract change.
 * The canonical input (sorted marker keys + haplogroup) is identical to the
 * previous implementation, so client and server derive the same commitment.
 */
export async function generateDNAHash(profile: STRProfile): Promise<string> {
  const sortedMarkers = Object.keys(profile.markers)
    .sort()
    .reduce(
      (obj, key) => {
        obj[key] = profile.markers[key];
        return obj;
      },
      {} as { [key: string]: number },
    );

  const profileString = JSON.stringify({
    markers: sortedMarkers,
    haplogroup: profile.haplogroup,
  });

  const bytes = new TextEncoder().encode(profileString);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}`;
}
