const fs = require("fs");
const path = require("path");

const files = [
  {
    name: "README.md",
    content: `# CFC Project\n\nWelcome to the CFC monorepo. This project is organized as a turborepo with multiple apps and packages.\n\n## Packages\n- **apps/** – UI applications\n- **packages/** – core libraries and contracts\n\n## Development\n\n\`\`\`bash\n# Install dependencies\nnpm install\n# Run dev server\nnpm run dev\n\`\`\`\n`,
  },
  {
    name: "CONTRIBUTING.md",
    content: `# Contributing Guide\n\nThank you for considering contributing! Please follow these steps:\n\n1. Fork the repository.\n2. Create a feature branch.\n3. Make your changes.\n4. Ensure lint and tests pass (\`npm run lint\`).\n5. Open a Pull Request.\n`,
  },
  {
    name: "CODE_OF_CONDUCT.md",
    content: `# Code of Conduct\n\nAll participants are expected to act in a respectful and inclusive manner.\n\nPlease read the full text at https://www.contributor-covenant.org/version/2/1/code_of_conduct/`,
  },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

files.forEach((file) => {
  const filePath = path.join(process.cwd(), file.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.content, "utf8");
    console.log(`Created ${file.name}`);
  } else {
    console.log(`${file.name} already exists, skipping.`);
  }
});
