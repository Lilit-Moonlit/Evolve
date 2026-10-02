// Builds the donation page into ONE self-contained HTML file (inline CSS + JS,
// embedded locale/address data with a fetch() shim) so it can be pinned to IPFS
// as a single file (Pinata's free plan does not allow CAR uploads).
//
// Usage: node site/build-ipfs.mjs [output.html]
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || join(SITE, "build", "index.html");
const read = (p) => readFileSync(join(SITE, p), "utf8");

const html = read("index.html");
const css = read("styles.css");
const js = read("app.js");

const data = {
  "addresses.json": JSON.parse(read("addresses.json")),
  "locales/index.json": JSON.parse(read("locales/index.json")),
};
for (const f of readdirSync(join(SITE, "locales")).filter((f) => f.endsWith(".json"))) {
  data["locales/" + f] = JSON.parse(read("locales/" + f));
}

const shim =
  "<script>\n" +
  "window.__EMBED__ = " +
  JSON.stringify(data) +
  ";\n" +
  "(function(){var o=window.fetch;window.fetch=function(i,n){var k=String(i).replace(/^\\.?\\//,'');" +
  "if(Object.prototype.hasOwnProperty.call(window.__EMBED__,k)){return Promise.resolve({ok:true,status:200," +
  "json:function(){return Promise.resolve(window.__EMBED__[k]);}});}return o?o(i,n):Promise.reject(new Error('nf:'+k));};})();\n" +
  "</script>";

let out = html.replace(
  '<link rel="stylesheet" href="styles.css" />',
  "<style>\n" + css + "\n</style>",
);
if (!out.includes("<style>")) throw new Error("CSS placeholder not found in index.html");
out = out.replace('<script src="app.js"></script>', shim + "\n<script>\n" + js + "\n</script>");
if (out.includes('src="app.js"')) throw new Error("JS placeholder not found in index.html");

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out, "utf8");

const locales = Object.keys(data).filter(
  (k) => k.startsWith("locales/") && k !== "locales/index.json",
).length;
console.log("built " + OUT + " (" + out.length + " bytes, " + locales + " locales)");
