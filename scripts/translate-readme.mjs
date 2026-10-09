#!/usr/bin/env node
/**
 * README translation sync — single source of truth is README.md (English).
 *
 * Every translated file README.<code>.md carries a machine-readable marker on
 * line 2 right after the language-switcher line:
 *
 *     <!-- evolve-readme-sync: <16-hex source hash> -->
 *
 * The hash is a SHA-256 of README.md's translatable body (everything after the
 * first line, CRLF-normalised). When README.md changes, its hash changes and
 * every translation whose marker does not match becomes "stale".
 *
 * Usage:
 *   node scripts/translate-readme.mjs            # check (exit 1 if any stale)
 *   node scripts/translate-readme.mjs --check    # same, explicit
 *   node scripts/translate-readme.mjs --stamp    # (re)write markers from README.md
 *   node scripts/translate-readme.mjs --manifest # write scripts/.readme-translation-manifest.json
 *   node scripts/translate-readme.mjs --translate  # translate stale files (needs EVOLVE_TRANSLATE_API_*)
 *   node scripts/translate-readme.mjs --lang uk --stamp  # stamp one language only
 *
 * "Translate" is a pluggable hook: set EVOLVE_TRANSLATE_API_URL + EVOLVE_TRANSLATE_API_KEY
 * and the script POSTs { code, source } for each stale language. Without those
 * variables it only reports the stale list — the actual natural-language
 * translation is normally produced by the project's AI agent (see AGENTS.md).
 *
 * Zero runtime dependencies (node:crypto / node:fs only).
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Canonical language list — mirrors site/locales/index.json (native names).
// All 34 are translated naturally (per the project's "most human language" rule),
// so `tier` here is informational only.
const LANGUAGES = [
  { code: "ar", name: "العربية", tier: 1 },
  { code: "bg", name: "Български", tier: 2 },
  { code: "cs", name: "Čeština", tier: 2 },
  { code: "da", name: "Dansk", tier: 2 },
  { code: "de", name: "Deutsch", tier: 1 },
  { code: "el", name: "Ελληνικά", tier: 2 },
  { code: "en", name: "English", tier: 1 },
  { code: "es", name: "Español", tier: 1 },
  { code: "et", name: "Eesti", tier: 2 },
  { code: "fi", name: "Suomi", tier: 2 },
  { code: "fil", name: "Filipino", tier: 2 },
  { code: "fr", name: "Français", tier: 1 },
  { code: "he", name: "עברית", tier: 2 },
  { code: "hr", name: "Hrvatski", tier: 2 },
  { code: "hu", name: "Magyar", tier: 2 },
  { code: "is", name: "Íslenska", tier: 2 },
  { code: "it", name: "Italiano", tier: 2 },
  { code: "ja", name: "日本語", tier: 1 },
  { code: "lt", name: "Lietuvių", tier: 2 },
  { code: "lv", name: "Latviešu", tier: 2 },
  { code: "nb", name: "Norsk bokmål", tier: 2 },
  { code: "ne", name: "नेपाली", tier: 2 },
  { code: "nl", name: "Nederlands", tier: 2 },
  { code: "pl", name: "Polski", tier: 2 },
  { code: "pt", name: "Português", tier: 1 },
  { code: "ro", name: "Română", tier: 2 },
  { code: "ru", name: "Русский", tier: 1 },
  { code: "sk", name: "Slovenčina", tier: 2 },
  { code: "sl", name: "Slovenščina", tier: 2 },
  { code: "sv", name: "Svenska", tier: 2 },
  { code: "sw", name: "Kiswahili", tier: 2 },
  { code: "uk", name: "Українська", tier: 1 },
  { code: "vi", name: "Tiếng Việt", tier: 1 },
  { code: "zh-TW", name: "繁體中文", tier: 1 },
];

const MARKER_PREFIX = "<!-- evolve-readme-sync:";
const MARKER_SUFFIX = "-->";
const MANIFEST_PATH = join(__dirname, ".readme-translation-manifest.json");

const sourcePath = (code) => join(ROOT, code === "en" ? "README.md" : `README.${code}.md`);

function normalize(text) {
  return text.replace(/\r\n/g, "\n");
}

/** The translatable body of the English source = everything after line 1. */
function sourceBody() {
  const lines = normalize(readFileSync(sourcePath("en"), "utf8")).split("\n");
  return lines.slice(1).join("\n");
}

function sourceHash() {
  return createHash("sha256").update(sourceBody()).digest("hex").slice(0, 16);
}

function markerLine(hash) {
  return `${MARKER_PREFIX} ${hash} ${MARKER_SUFFIX}`;
}

function readHash(file) {
  if (!existsSync(file)) return null;
  const lines = normalize(readFileSync(file, "utf8")).split("\n");
  for (const line of lines.slice(0, 5)) {
    const m = line.match(/^<!-- evolve-readme-sync:\s*([0-9a-f]{16})\s*-->\s*$/);
    if (m) return m[1];
  }
  return null;
}

function stampFile(code, hash) {
  if (code === "en") return false;
  const file = sourcePath(code);
  if (!existsSync(file)) return false;
  const lines = normalize(readFileSync(file, "utf8")).split("\n");

  // Rebuild the file with the marker as line 2 (index 1), right after the switcher.
  const body = lines.filter(
    (l) => !/^<!-- evolve-readme-sync:\s*[0-9a-f]{16}\s*-->/.test(l.trim()),
  );
  // body[0] is the switcher line (kept verbatim). Insert marker at index 1.
  const out = [body[0], markerLine(hash), ...body.slice(1)].join("\n");
  if (out !== normalize(readFileSync(file, "utf8"))) {
    writeFileSync(file, out, "utf8");
    return true;
  }
  return false;
}

function staleLanguages(hash) {
  const stale = [];
  for (const { code } of LANGUAGES) {
    if (code === "en") continue;
    const file = sourcePath(code);
    if (!existsSync(file)) {
      stale.push({ code, reason: "missing" });
      continue;
    }
    const stored = readHash(file);
    if (stored !== hash) {
      stale.push({ code, reason: stored ? "stale" : "no-marker" });
    }
  }
  return stale;
}

function parseArgs(argv) {
  const args = { flags: new Set(), lang: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--lang" && argv[i + 1]) {
      args.lang = argv[++i];
    } else if (a.startsWith("--")) {
      args.flags.add(a.slice(2));
    }
  }
  return args;
}

async function translate(stale, hash) {
  const url = process.env.EVOLVE_TRANSLATE_API_URL;
  const key = process.env.EVOLVE_TRANSLATE_API_KEY;
  if (!url || !key) {
    console.error(
      "No translator configured. Set EVOLVE_TRANSLATE_API_URL + EVOLVE_TRANSLATE_API_KEY,\n" +
        "or translate manually (the project's AI agent does this — see AGENTS.md).",
    );
    return 1;
  }
  const source = readFileSync(sourcePath("en"), "utf8");
  let failed = 0;
  for (const { code } of stale) {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ code, name: LANGUAGES.find((l) => l.code === code)?.name, source }),
    });
    if (!res.ok) {
      console.error(`translate ${code}: HTTP ${res.status}`);
      failed++;
      continue;
    }
    const text = await res.text();
    writeFileSync(sourcePath(code), text, "utf8");
    stampFile(code, hash);
    console.log(`translated ${code}`);
  }
  return failed ? 1 : 0;
}

async function main() {
  const { flags, lang } = parseArgs(process.argv.slice(2));
  const hash = sourceHash();

  if (lang) {
    const codes = LANGUAGES.map((l) => l.code);
    if (!codes.includes(lang)) {
      console.error(`unknown language "${lang}" — valid: ${codes.join(", ")}`);
      return 1;
    }
    if (lang === "en") {
      console.log(`source hash: ${hash}`);
      return 0;
    }
    const changed = stampFile(lang, hash);
    console.log(`${changed ? "stamped" : "unchanged"} ${lang} (${sourcePath(lang)})`);
    return 0;
  }

  if (flags.has("stamp")) {
    let n = 0;
    for (const { code } of LANGUAGES) {
      if (code === "en") continue;
      if (stampFile(code, hash)) n++;
    }
    console.log(`stamped ${n} file(s) with hash ${hash}`);
    return 0;
  }

  const stale = staleLanguages(hash);

  if (flags.has("manifest") || flags.has("translate")) {
    const manifest = {
      generatedAt: new Date().toISOString(),
      source: "README.md",
      sourceHash: hash,
      total: LANGUAGES.length,
      staleCount: stale.length,
      stale: stale.map((s) => s.code),
      languages: LANGUAGES,
    };
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
    if (flags.has("translate")) {
      return translate(stale, hash);
    }
    console.log(`manifest written: ${MANIFEST_PATH}`);
  }

  if (stale.length === 0) {
    console.log(`OK — all ${LANGUAGES.length - 1} translations in sync (hash ${hash}).`);
    return 0;
  }
  console.error(`OUT OF SYNC — ${stale.length} translation(s) stale (hash ${hash}):`);
  for (const s of stale) {
    console.error(`  - ${s.code} (${s.reason})`);
  }
  return 1;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
