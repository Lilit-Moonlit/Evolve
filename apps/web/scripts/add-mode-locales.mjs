/**
 * Adds the search-mode keys (`home.filters.mode*`) which were missing from all
 * locales (the UI was rendering raw keys). Ukrainian natural; others English.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

const en = {
  modeNormal: "Get acquainted",
  modePregnancyBond: "Conception",
  modeCrypticChoice: "Polyandric conception",
};
const uk = {
  modeNormal: "Познайомитись",
  modePregnancyBond: "Зачаття",
  modeCrypticChoice: "Поліандрічне зачаття",
};

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  existing.home = existing.home || {};
  existing.home.filters = existing.home.filters || {};
  Object.assign(existing.home.filters, locale === "uk" ? uk : en);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}
console.log(`Updated ${changed} locale files.`);

let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const h = j.home?.filters || {};
    if (!h.modeNormal || !h.modePregnancyBond || !h.modeCrypticChoice) bad.push(f);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
