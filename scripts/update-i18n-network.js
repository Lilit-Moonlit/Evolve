const fs = require("fs");
const path = require("path");

const localesDir = path.join(
  __dirname,
  "..",
  "apps",
  "web",
  "src",
  "i18n",
  "locales",
);
const requiredKeys = [
  "arbitrum",
  "avalanche",
  "polygon",
  "optimism",
  "zkSyncEra",
  "base",
  "bnbChain",
  "fantom",
  "aurora",
  "celo",
  "cronos",
];

const files = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith(".json"));

files.forEach((file) => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  let json;
  try {
    json = JSON.parse(content);
  } catch (e) {
    console.error(`Error parsing ${file}: ${e}`);
    return;
  }

  if (!json.network) {
    json.network = {};
  }

  let changed = false;
  requiredKeys.forEach((key) => {
    if (!json.network.hasOwnProperty(key)) {
      json.network[key] = "";
      changed = true;
    }
  });

  if (changed) {
    const updatedContent = JSON.stringify(json, null, 2);
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated ${file}`);
  } else {
    console.log(`${file} already has all required keys`);
  }
});

console.log("Done");
