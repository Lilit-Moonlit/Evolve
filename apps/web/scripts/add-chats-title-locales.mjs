/**
 * Adds the plural `chat.chats` key (the Communications left-column title)
 * to every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, idempotent: deep-merges the single key into `chat`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

const natural = {
  uk: "Чати",
  ru: "Чаты",
  de: "Chats",
  fr: "Discussions",
  es: "Chats",
  pt: "Conversas",
  ja: "チャット",
  ko: "채팅",
  zh: "聊天",
  "zh-TW": "聊天",
  ar: "المحادثات",
  vi: "Trò chuyện",
  hi: "चैट",
  tr: "Sohbetler",
  th: "แชท",
  id: "Chat",
  ms: "Sembang",
};

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  existing.chat = { ...(existing.chat || {}), chats: natural[locale] || "Chats" };
  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}
console.log(`Updated ${changed} locale files.`);

let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    if (!j.chat?.chats) bad.push(f);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`);
