# EVOLVE PROJECT CONSTITUTION

> This file is the authoritative rule set for ALL AI agents working on this project.
> Every agent MUST read and follow these rules. No exceptions.

---

## 1. Working Directory

- **Path**: `C:\CFC`
- **NEVER**: `C:\Users\Surface\Desktop\CFC`
- All relative paths are from project root

---

## 2. Code Rules

- **Never break ProtectedRoute** — only extend existing logic
- **All changes must pass prettier** before committing
- **Don't hardcode strings** — use `t()` for all user-facing text
- **Pre-commit**: run `npx prettier --write` on changed files
- **Verify compilation**: run `npx tsc --noEmit` after changes (ignore `db.ts:270` pre-existing error)

---

## 3. Localization

- **33 locales total** in `apps/web/src/i18n/locales/`
- When adding translation keys to ONE locale, add to ALL 33 locales
- **Tier 1 languages** (natural translations):
  - `uk`, `de`, `fr`, `es`, `pt`, `ja`, `ko`, `zh`, `ar`, `vi`, `hi`, `tr`, `th`, `id`, `ms`, `ru`
- **Tier 2 languages** (English with local description):
  - All others: `en`, `bg`, `cs`, `da`, `el`, `et`, `fi`, `hu`, `ga`, `it`, `lt`, `lv`, `mt`, `nl`, `pl`, `ro`, `sk`, `sl`, `sv`
- **RainbowKit localization**: set `locale` prop on `RainbowKitProvider` using mapping from i18n language codes to RainbowKit locale strings
- All user-facing strings must use `t()` — no hardcoded text

---

## 4. Development

- **Vite dev server**: port `3000` (configured in `apps/web/vite.config.ts`, NOT default 5173)
- **Prisma connection retry on startup**: expected behavior, app uses `fallback-db.json`
- **Pre-existing type error** in `db.ts:270` — unrelated to our changes, ignore it
- **Test command**: `cd apps/web && npm test`
- **Build command**: `cd apps/web && npm run build`

---

## 5. Architecture

### Monorepo Structure

```
C:\CFC\
├── apps/
│   ├── web/          # Vite + React (main app)
│   └── mobile/       # Expo + React Native
├── packages/
│   ├── contracts/    # Solidity 0.8.24, Hardhat, Ignition
│   ├── core/         # Types, utils, middleware, web3
│   ├── matching/     # Algorithms, filters, ranking
│   ├── p2p/          # libp2p v3 + Nostr networking
│   ├── storage/      # IPFS, Arweave, Lit Protocol
│   └── ui/           # React components (web-only)
└── docs/             # Architecture, tokenomics, PRD
```

### Auth Flow

```
AuthLanding → Email | Phone | Wallet
                ↓         ↓        ↓
         EmailForm  PhoneAuth  SIWE
                ↓         ↓        ↓
                ProtectedRoute
                      ↓
              Mode Selected? ──No──→ ProfileSettings
                      ↓
                   Home
```

### Key Design Decisions

- Auth is **decoupled** from mode selection
- Phone auth uses **API stubs** (no real OTP backend yet)
- Mode selection stored in `localStorage` under `evolve_auth_mode`
- `ProtectedRoute` extended (not broken) to handle all auth flows
- **Web3 Architecture (New)**: The project uses Arbitrum/Polygon (L2) for cheap and fast transactions. Account Abstraction (ERC-4337) is used for Gasless (sponsored) transactions and easy Smart Wallet onboarding. However, **MetaMask/SIWE login MUST be retained** as a hardcore escape hatch for true censorship resistance.

---

## 6. Tokenomics (EVOLVE)

| Property   | Value                                  |
| ---------- | -------------------------------------- |
| Contract   | `EVOLVE.sol` (ERC-20)                  |
| Max Supply | 100,000,000 EVOLVE                     |
| Decimals   | 18                                     |
| Network    | Arbitrum / Polygon (EVM-compatible L2) |

### Earning EVOLVE

| Action               | Reward     |
| -------------------- | ---------- |
| Profile verification | 100 EVOLVE |
| Match confirmation   | 50 EVOLVE  |
| Daily active use     | 10 EVOLVE  |

### Spending EVOLVE

| Action                    | Cost          |
| ------------------------- | ------------- |
| Emoji gift (Rose, Cactus) | 1 EVOLVE each |

### Economic Flywheel

```
User Activity → Earn EVOLVE → Buy Gifts → Revenue to Owners → Incentive to Hold
     ↓                                                              ↑
  Reputation ←── Voting ←── EVOLVE staked in Mode 2/3 ←─────────────┘
```

---

## 7. Smart Contracts

| Contract                   | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `EVOLVE.sol`               | ERC-20 token                                                              |
| `ProfileNFT.sol`           | ERC-721 profiles                                                          |
| `TrustScore.sol`           | Base score (50) + reputation                                              |
| `Voting.sol`               | 8 votes max, recursive weight (depth 3)                                   |
| `Evolve2Earn.sol`          | Rewards + emoji gifts                                                     |
| `Governance.sol`           | 4-factor vote weight (recursive 40%, STD 10%, DNA 10%, Staked EVOLVE 40%) |
| `BondManager.sol`          | Mode 2 (pregnancy-bond) + Mode 3 (cryptic-choice)                         |
| `EvolveStaking.sol`        | Token staking (min 100 EVOLVE, 30 days)                                   |
| `VerificationRegistry.sol` | STD + DNA verification                                                    |

---

## 8. Data Flow

### User Onboarding

```
User → Evolve2Earn.verify() → mints ProfileNFT → initializes TrustScore (50)
     → receives EVOLVE tokens (verification reward)
```

### Matching & Communication

```
User A → p2p ChatManager.sendMessage() → libp2p gossipsub → User B
       → matching.calculateMatchScore() → profile ranking
```

### Emoji Gift Economy

```
User A → Evolve2Earn.buyEmojiGift(id) → 1 EVOLVE spent
       → revenue split among existing owners (proportional)
       → gift tradeable via transferEmojiGift()
```

**Important Rule:** The revenue split is perpetual (бессроково) and dilution is by design. The 1 EVOLVE is divided exactly based on the percentage of total gifts owned. If 100 gifts exist, 98 users have 1 gift each (1% each) and 1 user has 2 gifts (2%). The 1 EVOLVE is split exactly as 1% and 2% respectively. Do not implement any burn or expiry mechanisms.

### Voting → Reputation

```
User A votes for User B
  → Voting.sol: weight = 1 + Σ(calculateWeight(voter)) [depth ≤ 3]
  → TrustScore.sol: totalScore = baseScore + reputationScore (capped 100)
  → Governance.sol: voteWeight = (recursiveWeight × 40% + STD × 10% + DNA × 10% + Staked EVOLVE × 40%). Free balance on wallet gives NO weight.
```

### Mode 2: Pregnancy Bond

```
Woman creates bond → Man stakes ≥ 100 EVOLVE → Both confirm → Stake locked
  → Woman reports pregnancy (14-270 days) → Admin confirms paternity
  → Man's stake transfers to Woman
```

### Mode 3: Cryptic Choice

```
Woman creates session → Men join (stake ≥ 100 EVOLVE) → Confirm → Stakes locked
  → 48h window → Woman chooses father
  → Father: stake returned | Others: 90% to Woman, 10% to Father
```

---

## 9. Rules Update Protocol

- **When to propose updates**: new conventions, bug patterns, missing rules, better practices
- **How to propose**: clearly state what to change, why, and which files are affected
- **After approval**: update ALL files (AGENTS.md, CLAUDE.md, .agents/, .windsurf/, .clinerules/, .github/, .hermes.md, opencode.json)
- **Commit**: `git commit -m "docs: update project rules - [description]"`
- **Full protocol**: see `RULES_PROTOCOL.md` in project root

**Agents SHOULD propose rule updates when they discover:**

- Patterns used consistently across 3+ files
- Recurring mistakes that should be prevented
- Situations not covered by existing rules
- New tools or configuration changes
- Architecture shifts

---

## 10. Additional Rules

- **New files**: check existing code conventions before creating
- **Imports**: use `@evolve/*` workspace aliases
- **Testing**: tests exist in `packages/contracts/test/` and `packages/*/src/**/*.test.ts`
- **Prettier**: run before any commit
- **Git**: never commit secrets, API keys, or `.env` files
- **Cross-tool sync**: AGENTS.md is source of truth; tool-specific files extend it

---

_Last updated: 2026-06-11_
_This constitution is version-controlled. All agents must follow it._
_See RULES_PROTOCOL.md for how to propose and apply rule changes._
