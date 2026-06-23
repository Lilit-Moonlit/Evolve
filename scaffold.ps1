$dirs = @(
    ".github/workflows",
    ".github/ISSUE_TEMPLATE",
    "apps/web/public",
    "apps/web/src/components",
    "apps/web/src/pages",
    "apps/web/src/hooks",
    "apps/web/src/lib",
    "apps/web/src/store",
    "apps/web/src/assets",
    "apps/mobile",
    "packages/contracts/src",
    "packages/contracts/script",
    "packages/contracts/test",
    "packages/core/src",
    "packages/p2p/src/protocols",
    "packages/storage/src",
    "packages/matching/src",
    "packages/ui/src",
    "docs",
    "scripts",
    "config"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$files = @(
    ".github/workflows/ci.yml",
    ".github/workflows/deploy-contracts.yml",
    ".github/workflows/ipfs-deploy.yml",
    ".github/ISSUE_TEMPLATE/bug_report.md",
    ".github/ISSUE_TEMPLATE/feature_request.md",
    ".github/PULL_REQUEST_TEMPLATE.md",
    "apps/web/src/App.tsx",
    "apps/web/index.html",
    "apps/web/vite.config.ts",
    "apps/web/tsconfig.json",
    "apps/web/package.json",
    "packages/contracts/src/LoveToken.sol",
    "packages/contracts/src/ProfileNFT.sol",
    "packages/contracts/src/TrustScore.sol",
    "packages/contracts/src/Love2Earn.sol",
    "packages/contracts/src/Governance.sol",
    "packages/contracts/foundry.toml",
    "packages/contracts/README.md",
    "packages/core/src/types.ts",
    "packages/core/src/constants.ts",
    "packages/core/src/utils.ts",
    "packages/core/package.json",
    "packages/p2p/src/libp2p-node.ts",
    "packages/p2p/src/nostr-client.ts",
    "packages/p2p/src/chat-manager.ts",
    "packages/p2p/package.json",
    "packages/storage/src/ipfs-client.ts",
    "packages/storage/src/lit-encryption.ts",
    "packages/storage/src/arweave-client.ts",
    "packages/storage/package.json",
    "packages/matching/src/matcher.ts",
    "packages/matching/src/embeddings.ts",
    "packages/matching/package.json",
    "docs/ARCHITECTURE.md",
    "docs/ROADMAP.md",
    "docs/TOKENOMICS.md",
    "docs/CONTRIBUTING.md",
    "docs/PRD-MVP.md",
    "scripts/deploy-all.ts",
    "scripts/generate-ens.ts",
    "scripts/update-ipfs-hash.ts",
    "config/tailwind.config.ts",
    ".env.example",
    ".gitignore",
    ".prettierrc",
    ".eslintrc.json",
    "turbo.json",
    "package.json",
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md"
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

Write-Output "Scaffolding completed successfully."
