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
- **Verify compilation**: run `npx tsc --noEmit** after changes (ignore `db.ts:270` pre-existing error)
- **PowerShell**: do NOT use `&&` for chaining commands — use `;` instead
- **Mobile testing**: test mobile via `npm run web` (Android SDK not installed on dev machine)
- **User communication language**: all responses to the USER must be in Ukrainian. Internal documentation may remain English.

---

---

## 3. Agent Chat Coordination

**File location**: `.agent-chat/` (peer-to-peer, no privileged agents)

### Protocol

1. **Before starting a task**: check `.agent-chat/messages/` for incoming messages addressed to you (`to: YOUR_NAME` or `to: all`)
2. **Before editing files**: update your `status/YOUR_NAME.md` → set `lock_files:` to the files you're editing
3. **When done**: update `status/YOUR_NAME.md` → `status: done` or `status: idle`, clear `lock_files:`
4. **To communicate with another agent**: create a `.md` file in `messages/` with `from:/to:/status:` frontmatter
5. **After reading a message**: change `status: unread` → `status: read`

### Availability (handover support)

Agents can become unavailable (model limits, timeouts, etc.). When this happens, another agent MUST take over.

- `availability: online` — working normally
- `availability: limited` — slow, handover recommended for urgent tasks
- `availability: offline` — cannot continue, task MUST be reassigned

When going `offline`, agent MUST write `to: all` with:

- What was done
- What remains
- Files touched
- Any context needed

When seeing an offline agent with unfinished work → take it over, write `to: all` that you're picking it up.

### Status values

- `idle` — free, ready for next task
- `working` — executing a task
- `blocked` — need help / waiting for another agent
- `done` — task complete, awaiting next

### Agent aliases

| Alias         | Role                         |
| ------------- | ---------------------------- |
| `opencode`    | Frontend, Config, Infra      |
| `antigravity` | Audit, QA, Code Review       |
| `devin`       | Mobile, Profile, Camera, STD |
| `cline`       | Settings, Wallet, Language   |
| `aider`       | Backup (local Ollama)        |

Full details in `.agent-chat/README.md`. Per-agent prompts in `.agent-chat/prompts/`.

---

---

## 4. Localization

- **33 locales total** in `apps/web/src/i18n/locales/`
- When adding translation keys to ONE locale, add to ALL 33 locales
- **Tier 1 languages** (natural translations):
  - `uk`, `de`, `fr`, `es`, `pt`, `ja`, `ko`, `zh`, `ar`, `vi`, `hi`, `tr`, `th`, `id`, `ms`, `ru`
- **Tier 2 languages** (English with local description):
  - All others: `en`, `bg`, `cs`, `da`, `el`, `et`, `fi`, `hu`, `ga`, `it`, `lt`, `lv`, `mt`, `nl`, `pl`, `ro`, `sk`, `sl`, `sv`
- **Tier 2 Update Reports**:
  - Devin (8 locales): `apps/web/src/i18n/TIER2-DEVIN.md`
  - Cline (7 locales): `apps/web/src/i18n/TIER2-CLINE.md`
- **RainbowKit localization**: set `locale` prop on `RainbowKitProvider` using mapping from i18n language codes to RainbowKit locale strings
- All user-facing strings must use `t()` — no hardcoded text

---

## 5. Development

- **Vite dev server**: port `3000` (configured in `apps/web/vite.config.ts`, NOT default 5173)
- **Prisma connection retry on startup**: expected behavior, app uses `fallback-db.json`
- **Pre-existing type error** in `db.ts:270` — unrelated to our changes, ignore it
- **Test command**: `cd apps/web && npm test`
- **Build command**: `cd apps/web && npm run build`

### Known Issues

| File              | Line | Status          | Description                                              | Resolution                                                                                                               |
| ----------------- | ---- | --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `db.ts`           | 270  | ✅ Ignored      | Pre-existing type error (Prisma `any` cast)              | Not our code; do not touch                                                                                               |
| `apiServer.ts`    | 87   | ✅ Working      | OTP send/verify stubs — logs to console only             | Replace with real SMS provider                                                                                           |
| Web build timeout | —    | ✅ Fixed        | `vite build` exceeded 120s timeout                       | CI timeout → 30min + `--max-old-space-size=4096`                                                                         |
| ESLint config     | —    | ⚠️ Pre-existing | `.eslintrc.json` empty, packages missing config          | Not our code; needs migration to flat config                                                                             |
| Mobile web render | —    | ✅ Fixed        | `useState` null — dual React instance (18.2.0 vs 18.3.1) | Removed nested `react` from `apps/mobile/node_modules`; aligned versions to 18.3.1; removed `ssr:true` from wagmi config |

---

## 6. Architecture

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

### Privacy Levels

- **Level 1 (normal)**: Full profile visibility
- **Level 2 (pregnancy-bond)**: Can hide content from Level 1
- **Level 3 (cryptic-choice)**: Can hide content from Level 1 & 2
- **Rating**: Always visible regardless of privacy level
- **STD compatibility**: Always anonymous — only Safe/Compatible/Caution/Risk shown, never individual pathogen status

### Color Scheme

- **Level 1**: `#3b82f6` (blue)
- **Level 2**: `#4338ca` (indigo)
- **Level 3**: `#0f172a` (dark navy)
- **Auth buttons**: Blue gradient (not pink/purple)

### Multi-network

Ми залишаємо **Arbitrum** як основну L2 мережу та додаємо **Avalanche** для розширення можливостей користувачів.

- **Arbitrum**:
  - _Чому залишаємо_: Висока безпека (наслідувана від Ethereum), дуже низькі комісії, величезна ліквідність та екосистема.
  - _Популярні DEX_: Uniswap V3, SushiSwap, 1inch.
  - _Мостові провайдери_: Arbitrum Bridge, Hop Protocol, Connext.
- **Avalanche**:
  - _Чому додаємо_: Субсекундна швидкість транзакцій (фіналізація), надзвичайно низька вартість газу, велика база користувачів та стабільність.
  - _Популярні DEX_: Trader Joe, Pangolin, SushiSwap.
  - _Мостові провайдери_: Avalanche Bridge, LayerZero Bridge (OFT), Multichain.

**Переваги мульти-мережевого підходу**:

- Гнучкість та свобода вибору для користувача.
- Зниження ризиків збоїв однієї з мереж.
- Підвищена ліквідність завдяки інтеграції з топовими DEX.

**Недоліки (ризики)**:

- Необхідність синхронізації станів контрактів між мережами.
- Фрагментація ліквідності токенів.

### Communication

- Всі відповіді користувачеві – українською.
- Внутрішня технічна документація – англійською.

---

## 7. Tokenomics (EVOLVE)

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

## 8. Smart Contracts

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

## 9. STD Compatibility System

### Core Principles

- **Parser**: `apps/web/src/lib/std-parser.ts` — parses free-text STD test results (EN/UK/RU), extracts 8 pathogens
- **Tests**: `apps/web/src/lib/std-parser.test.ts` — 70 comprehensive tests (MUST pass before any changes)
- **Compatibility**: `checkStdCompatibility()` compares two parsed results for safe matching

### Pathogens Tracked

| ID          | Name        | Aliases (EN/UK/RU)              |
| ----------- | ----------- | ------------------------------- |
| hiv         | HIV-1/2     | hiv, віл, вич                   |
| syphilis    | Syphilis    | syphilis, сифіліс, сифилис      |
| chlamydia   | Chlamydia   | chlamydia, хламідіоз, хламидиоз |
| gonorrhea   | Gonorrhea   | gonorrhea, гонорея              |
| hsv1        | HSV-1       | hsv-1, herpes-1, герпес-1       |
| hsv2        | HSV-2       | hsv-2, herpes-2, герпес-2       |
| hepatitis_b | Hepatitis B | hep b, hbv, гепатит б           |
| hepatitis_c | Hepatitis C | hep c, hcv, гепатит с           |

### Compatibility Rules

| Scenario                       | Risk Level       | Safe to Match              |
| ------------------------------ | ---------------- | -------------------------- |
| Both all negative              | `none`           | Yes                        |
| Same pathogen positive in both | `same_strain`    | Yes (they already have it) |
| One positive, one negative     | `high_risk`      | No                         |
| One unknown (not tested)       | `potential_risk` | No (insufficient data)     |
| Both unknown                   | `potential_risk` | No                         |

### Parsing Rules

- **Context window**: Status is extracted from text AFTER the colon on the same line only (no cross-line contamination)
- **Keyword priority**: Negative keywords checked FIRST ("not detected" beats "detected")
- **Word boundary**: Alphabetic keywords (≥4 chars) use word-boundary matching ("unclear" does NOT match "clear")
- **Alias dedup**: Longest alias match kept at each position ("hiv-1/2" preferred over "hiv")
- **"All negative" pattern**: Detected via phrases like "all negative", "негативний для всіх" — forces all pathogens to negative unless explicit positive found

### UI Integration

- **Home.tsx**: Profile cards show compatibility indicator ONLY (Safe/Compatible/Caution/Risk)
- **Chat.tsx**: Chat list shows compatibility badge per matched profile
- **Colors**: green=Safe, blue=Compatible, yellow=Caution, red=Risk Detected
- **AppContext**: `checkCompatibility(profile)` method, `parsedStd` field auto-populated on load
- **Privacy**: Individual pathogen status (positive/negative) is NEVER shown to other users — only anonymous compatibility result

### IMPORTANT: Never Change Without Running Tests

```bash
cd apps/web && npx vitest run src/lib/std-parser.test.ts
```

All 70 tests must pass. If you change parsing logic, add tests for new edge cases.

---

## 10. Data Flow

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

## 11. Rules Update Protocol

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

### Auto-Update Rules

**When ANY agent makes a fundamental change, they MUST update AGENTS.md immediately:**

1. **New features with tests**: Add section with file paths, test count, and `NEVER CHANGE WITHOUT RUNNING TESTS` warning
2. **Privacy/security changes**: Add to Privacy Levels or Code Rules section
3. **New pathogens or compatibility rules**: Update STD Compatibility System section
4. **UI pattern changes**: Update relevant component documentation
5. **Architecture changes**: Update Architecture section
6. **New commands or tools**: Update Development section

**Auto-update checklist for every agent session:**

- [ ] Did I add a new feature with tests? → Update AGENTS.md
- [ ] Did I change privacy/security behavior? → Update AGENTS.md
- [ ] Did I add new file paths or components? → Update AGENTS.md
- [ ] Did I discover a new pattern or convention? → Update AGENTS.md
- [ ] Did I fix a bug that reveals a rule gap? → Update AGENTS.md

**After ANY significant change, run:**

```bash
npx prettier --write AGENTS.md
```

---

## 12. Additional Rules

- **New files**: check existing code conventions before creating
- **Imports**: use `@evolve/*` workspace aliases
- **Testing**: tests exist in `packages/contracts/test/` and `packages/*/src/**/*.test.ts`
- **Prettier**: run before any commit
- **Git**: never commit secrets, API keys, or `.env` files
- **Cross-tool sync**: AGENTS.md is source of truth; tool-specific files extend it

### Table-Link Policy

**When to use tables:**

- Comparing 2+ options, versions, or configurations
- Documenting API endpoints, file paths, or data structures
- Listing rules with multiple attributes (file, line, status, description)
- Showing test results or QA metrics

**When to use lists:**

- Sequential steps or workflows
- Simple enumerations without attributes
- Bullet-point rules or principles

**Cross-reference rules:**

- Tables in AGENTS.md MUST be kept in sync with related docs (e.g., `docs/OTP-backend.md`, `QA-REPORT.md`)
- When updating a table row in AGENTS.md, check if the same data appears in other docs and update them too
- Use file path + line number references (e.g., `db.ts:270`) for traceability
- If a table row becomes stale, update it or add a `Status: Stale` column

---

## 13. QA Procedure

- **Test command**: `cd apps/web && npm test` — run before any commit
- **Type check**: `cd apps/web && npx tsc --noEmit` — ignore `db.ts:270`
- **Lint**: `npm run lint` from project root — store log in `apps/web/LINT-LOG.txt`
- **Build**: `cd apps/web && npm run build` — verify no errors
- **Prettier**: `npx prettier --write` on all changed files before commit
- **Results**: append to `AGENTS-QA-RESULTS.md`

---

## 14. Security Requirements

- **OTP backend**: implemented in `apps/web/src/lib/phoneAuth.ts` + `otp-store.ts`
- **Rate-limiting**: 30 req/min global, 5 req/10min per phone for OTP
- **Session management**: in-memory (dev); use Redis in production
- **Secrets**: never commit API keys, `.env` files, or private keys
- **STD compatibility**: anonymous — individual pathogen status never shown to other users
- **Privacy levels**: Level 3 can hide from Level 1 & 2; Level 2 can hide from Level 1

---

## 15. Milestones

| Milestone                    | Target Date | Status         | Owner         |
| ---------------------------- | ----------- | -------------- | ------------- |
| Full Production Build        | 2026-06-25  | 🔄 In Progress | OpenCode      |
| OTP Backend Integration      | 2026-06-22  | ✅ Done        | OpenCode      |
| Mobile Auth Complete         | 2026-06-18  | ✅ Done        | Devin         |
| Tier-2 Localization Complete | 2026-06-18  | ✅ Done        | Cline + Devin |
| All Tests Pass (84/84)       | 2026-06-22  | ✅ Done        | OpenCode      |
| Final QA (Antigravity)       | 2026-06-22  | ⏳ Pending     | Antigravity   |

---

## Мова спілкування

- Всі відповіді користувачеві – українською.
- Внутрішня документація – англійською.

---

# 15. Розширення на кілька мереж

Проект буде розгорнуто на **11** сумісних з EVM мережах, щоб максимізувати охоплення, ліквідність та стійкість.

| Мережа         | Чому ми її використовуємо?                             | Популярні DEX / інфраструктура       | Підтримка мостів до EVM (головна) |
| -------------- | ------------------------------------------------------ | ------------------------------------ | --------------------------------- |
| **Arbitrum**   | Низька плата, близькість до безпеки Ethereum           | Uniswap V3, SushiSwap, 1inch         | Arbitrum Bridge, Hop, Connext     |
| **Avalanche**  | Дуже низькі гази, висока пропускна здатність           | Trader Joe, Pangolin, SushiSwap      | Avalanche Bridge, Hop, Multichain |
| **Polygon**    | Найбільше використання серед L2, дешеві транзакції     | QuickSwap, SushiSwap, Aave           | Polygon Bridge, Hop, Connext      |
| **Optimism**   | Швидка фіналізація, досвід розробки схожий на Arbitrum | Uniswap V3, Velodrome, Sushiswap     | Optimism Gateway, Hop, Connext    |
| **zkSync Era** | Майже нульові комісії, безпека zk‑Rollup               | zkSync Swap, SyncSwap, 1inch         | zkSync Bridge, Hop (планується)   |
| **Base**       | Сильна підтримка Coinbase, зростаючий DeFi             | Base Uniswap V3, Aerodrome, BaseSwap | Base Bridge, Hop, Connext         |
| **BNB Chain**  | Масивна азійська користувацька база, високий TVL       | PancakeSwap, Biswap, ApeSwap         | BNB Bridge, Multichain, cBridge   |
| **Fantom**     | Субсекундна блокова час, низькі гази                   | SpiritSwap, SpookySwap, Curve‑Fantom | Fantom Bridge, Multichain         |
| **Aurora**     | Доступ до екосистеми NEAR, швидка фіналізація          | Ref Finance, Trisolaris              | Aurora Bridge, Wormhole           |
| **Celo**       | Mobile‑first, адреси за номером телефону               | Ubeswap, Moola, CeloSwap             | Celo Bridge, Multichain           |
| **Cronos**     | Інтеграція з Crypto.com екосистемою                    | CronaSwap, VVS Finance               | Cronos Bridge, Multichain         |

**Переваги такого підходу**

- **Вибір користувачем** – користувачі можуть обирати найдешевшу або найшвидшу мережу для кожної дії.
- **Агрегація ліквідності** – пулі на багатьох DEX збільшують глибину та знижують прослизання.
- **Стійкість** – якщо одна мережа зазнає навантаження або простою, трафік можна перенаправити на іншу.
- **Ширше ринкове охоплення** – доступ до різних регіональних користувачів (BNB Chain в Азії, Celo для мобільних ринків тощо).

**Нотатки щодо впровадження**

1. Додати конфігурації мереж у `hardhat.config.ts` (RPC‑URL, chainId).
2. Деплоїти ERC‑20 `EVOLVE` у кожну мережу, використовуючи один і той же код, і верифікувати на відповідних провайдерах блокчейнів.
3. Використовувати **мост‑агностичний обгортка** (наприклад, LayerZero OFT або Hop Bridge) для безшовних крос‑чейн переводів.
4. Розширити `src/lib/networks.ts` у фронтенді, щоб експортувати нові мережі та адреси DEX‑роутерів.
5. Написати інтеграційні тести для кожної мережі (використовувати тестові мережі: Arbitrum Sepolia, Avalanche Fuji, Polygon Mumbai, Optimism Goerli, zkSync Era Testnet, Base Sepolia, BNB Chain Testnet, Fantom Testnet, Aurora Testnet, Celo Alfajores, Cronos Testnet).

---

_Last updated: 2026-06-22_
_This constitution is version‑controlled. All agents must follow it._
_See RULES_PROTOCOL.md for how to propose and apply rule changes._

The project will be deployed on **11** EVM‑compatible networks to maximize reach, liquidity and resilience.

| Network        | Why we use it?                                 | Popular DEX / Infrastructure         | Bridge support to EVM (main)      |
| -------------- | ---------------------------------------------- | ------------------------------------ | --------------------------------- |
| **Arbitrum**   | Low‑fee L2, close to Ethereum security         | Uniswap V3, SushiSwap, 1inch         | Arbitrum Bridge, Hop, Connext     |
| **Avalanche**  | Very low gas, high throughput                  | Trader Joe, Pangolin, SushiSwap      | Avalanche Bridge, Hop, Multichain |
| **Polygon**    | Widest adoption among L2s, cheap tx            | QuickSwap, SushiSwap, Aave           | Polygon Bridge, Hop, Connext      |
| **Optimism**   | Fast finality, same dev experience as Arbitrum | Uniswap V3, Velodrome, Sushiswap     | Optimism Gateway, Hop, Connext    |
| **zkSync Era** | Near‑zero fees, zk‑Rollup security             | zkSync Swap, SyncSwap, 1inch         | zkSync Bridge, Hop (planned)      |
| **Base**       | Strong backing by Coinbase, growing DeFi       | Base Uniswap V3, Aerodrome, BaseSwap | Base Bridge, Hop, Connext         |
| **BNB Chain**  | Massive Asian user base, high TVL              | PancakeSwap, Biswap, ApeSwap         | BNB Bridge, Multichain, cBridge   |
| **Fantom**     | Sub‑second blocks, low cost                    | SpiritSwap, SpookySwap, Curve‑Fantom | Fantom Bridge, Multichain         |
| **Aurora**     | Access to NEAR ecosystem, fast finality        | Ref Finance, Trisolaris              | Aurora Bridge, Wormhole           |
| **Celo**       | Mobile‑first, phone‑number addresses           | Ubeswap, Moola, CeloSwap             | Celo Bridge, Multichain           |
| **Cronos**     | Integration with Crypto.com ecosystem          | CronaSwap, VVS Finance               | Cronos Bridge, Multichain         |

**Benefits of this multi‑chain approach**

- **User choice** – users can pick the cheapest or fastest network for each action.
- **Liquidity aggregation** – pools on many DEXes increase depth and reduce slippage.
- **Resilience** – if one chain experiences congestion or downtime, traffic can be shifted to another.
- **Broader market exposure** – tapping into distinct regional user bases (BNB Chain in Asia, Celo for mobile‑first markets, etc.).

**Implementation notes**

1. Add network configurations to `hardhat.config.ts` (RPC URLs, chain IDs).
2. Deploy `EVOLVE` ERC‑20 on each network using the same source code; verify on respective explorers.
3. Use a **bridge‑agnostic token wrapper** (e.g., LayerZero OFT or Hop Bridge) to enable seamless cross‑chain transfers.
4. Extend the front‑end `src/lib/networks.ts` to expose the new networks and DEX router addresses.
5. Write integration tests for each network (use testnets: Arbitrum Sepolia, Avalanche Fuji, Polygon Mumbai, Optimism Goerli, zkSync Era Testnet, Base Sepolia, BNB Chain Testnet, Fantom Testnet, Aurora Testnet, Celo Alfajores, Cronos Testnet).

---

_Last updated: 2026-06-22_
_This constitution is version‑controlled. All agents must follow it._
_See RULES_PROTOCOL.md for how to propose and apply rule changes._
