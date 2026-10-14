/**
 * Syncs the birth-rose keys (dashboard.roses.* + dashboard.mode3.deposit.*)
 * from the WEB locale files into the corresponding MOBILE locale files.
 *
 * Keeps web as the single source of translations — no drift. Preserves all
 * existing mobile keys via deep merge. Idempotent.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileDir = path.join(__dirname, "..", "i18n", "locales");
const webDir = path.join(__dirname, "..", "..", "web", "src", "i18n", "locales");

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

const files = fs.readdirSync(mobileDir).filter((f) => f.endsWith(".json"));
let changed = 0;
for (const f of files) {
  const webFile = path.join(webDir, f);
  if (!fs.existsSync(webFile)) {
    console.log(`SKIP ${f}: no web counterpart`);
    continue;
  }
  const web = JSON.parse(fs.readFileSync(webFile, "utf8"));
  const roses = web?.dashboard?.roses;
  const deposit = web?.dashboard?.mode3?.deposit;
  if (!roses || !deposit) {
    console.log(`SKIP ${f}: web file lacks dashboard.roses / dashboard.mode3.deposit`);
    continue;
  }
  const mobileFile = path.join(mobileDir, f);
  const mobile = JSON.parse(fs.readFileSync(mobileFile, "utf8"));
  mobile.dashboard = deepMerge(mobile.dashboard || {}, { roses });
  mobile.dashboard = deepMerge(mobile.dashboard, {
    mode3: deepMerge(mobile.dashboard.mode3 || {}, { deposit }),
  });
  fs.writeFileSync(mobileFile, JSON.stringify(mobile, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} mobile locale files.`);

// Validate
let bad = [];
const required = ["title", "hint", "cost", "total", "fixed", "escrowed", "withdraw"];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(mobileDir, f), "utf8"));
    const r = (j.dashboard || {}).roses || {};
    const d = ((j.dashboard || {}).mode3 || {}).deposit || {};
    const missing = required.filter((k) => !(k in r)).concat(!("prompt" in d) ? ["prompt"] : []);
    if (missing.length) bad.push(`${f}: ${missing.join(",")}`);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} MOBILE LOCALES VALID`,
);
