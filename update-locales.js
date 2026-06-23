const fs = require("fs");
const path = require("path");

const localesDir = path.join(
  __dirname,
  "apps",
  "web",
  "src",
  "i18n",
  "locales",
);
const files = fs.readdirSync(localesDir);

const newNetworks = {
  polygon: "Polygon",
  optimism: "Optimism",
  zksync: "zkSync Era",
  base: "Base",
  bsc: "BNB Chain",
  fantom: "Fantom",
  aurora: "Aurora",
  celo: "Celo",
  cronos: "Cronos",
};

files.forEach((file) => {
  if (file.endsWith(".json")) {
    const filePath = path.join(localesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!content.network) {
      content.network = {};
    }

    // Add missing networks
    for (const [key, value] of Object.entries(newNetworks)) {
      if (!content.network[key]) {
        content.network[key] = value;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n", "utf8");
  }
});

console.log("Updated all locales successfully.");
