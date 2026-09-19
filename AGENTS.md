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

| File              | Line | Status          | Description                                                                                                 | Resolution                                                                                                                                                                                                  |
| ----------------- | ---- | --------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `db.ts`           | 270  | ✅ Ignored      | Pre-existing type error (Prisma `any` cast)                                                                 | Not our code; do not touch                                                                                                                                                                                  |
| Web build timeout | —    | ✅ Fixed        | `vite build` exceeded 120s timeout                                                                          | CI timeout → 30min + `--max-old-space-size=4096`                                                                                                                                                            |
| ESLint config     | —    | ⚠️ Pre-existing | `.eslintrc.json` empty, packages missing config                                                             | Not our code; needs migration to flat config                                                                                                                                                                |
| Mobile web render | —    | ✅ Fixed        | `useState` null — dual React instance (18.2.0 vs 18.3.1)                                                    | Removed nested `react` from `apps/mobile/node_modules`; aligned versions to 18.3.1; removed `ssr:true` from wagmi config                                                                                    |
| Ignition deploy   | —    | ✅ Fixed        | UTF-8 BOM in `ignition-parameters.json` blocked ALL deploys (IGN725); params used pre-0.15 top-level format | Removed BOM, switched to module-scoped params (ignition 0.15 has no `$global`), fixed Governance (1 ctor arg) + EvolveFund/BondManager `m.useModule` wiring; `npm run deploy:local` deploys all 9 contracts |

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
└── docs/             # Architecture, tokenomics, PRD
```

### Auth Flow

```
AuthLanding → Wallet (SIWE) | DNA Recovery
              ↓                    ↓
         ConnectWallet         DNARecovery
              ↓                    ↓
              ProtectedRoute
                    ↓
             Mode Selected? ──No──→ ProfileSettings
                    ↓
                 Home
```

### Key Design Decisions

- Auth is **decoupled** from mode selection
- **Phone/email auth removed** — only SIWE (wallet) and DNA-based account recovery
- DNA recovery: user enters email + DNA test text → parsed client-side → hash compared against on-chain DNAVerification record → session issued on match
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

Єдиний спосіб заробити — **економіка emoji-подарунків**. Немає нагород за верифікацію, матчі чи щоденну активність.

### Spending EVOLVE

| Дія                       | Ціна          | Контракт                     |
| ------------------------- | ------------- | ---------------------------- |
| Emoji gift (Rose, Cactus) | 1 EVOLVE      | `Evolve2Earn.buyEmojiGift()` |
| EvolveFund deposit (чол.) | мін 15 EVOLVE | `EvolveFund.deposit()`       |

### Стейкінг → EvolveFund (замість EvolveStaking)

**EvolveStaking видалено.** Чоловіки використовують `EvolveFund` (депозит, блокування 30+ днів). Жінки тримають токени на балансі гаманця (вільне зняття/переведення).

- **Чоловіки**: депозит у EvolveFund (мін 15 EVOLVE, мін 30 днів) → впливає на Governance як стейк
- **Жінки**: токени на балансі → впливає на Governance як баланс (можна зняти будь-коли, рейтинг впаде)

### Governance — вага голосу

**Жінки:**

1. Баланс гаманця (30%)
2. Рекурсивна репутація — 8 голосів, глибина 3 (30%)
3. % народжених дітей відносно всіх жінок (40%)

**Чоловіки:**

1. EvolveFund баланс (30%)
2. Рекурсивна репутація — 8 голосів, глибина 3 (30%)
3. % батьківства відносно всіх чоловіків (40%)

### Economic Flywheel

```
User Activity → Earn EVOLVE via gifts → Revenue to Owners → Incentive to Hold
     ↓                                                         ↑
  Reputation ←── Voting ←── EvolveFund deposit ←───────────────┘
```

---

## 8. Smart Contracts

| Contract                   | Purpose                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| `EVOLVE.sol`               | ERC-20 token                                                          |
| `ProfileNFT.sol`           | ERC-721 profiles                                                      |
| `TrustScore.sol`           | Base score (1) + reputation                                           |
| `Voting.sol`               | 8 votes max, recursive weight (depth 3)                               |
| `Evolve2Earn.sol`          | Rewards + emoji gifts                                                 |
| `Governance.sol`           | 3-factor vote weight (recursive 30%, children 40%, Staked EVOLVE 30%) |
| `BondManager.sol`          | Mode 2 (pregnancy-bond) + Mode 3 (cryptic-choice) + children tracking |
| `EvolveFund.sol`           | Male token deposit (min 15 EVOLVE, 30 days lock)                      |
| `VerificationRegistry.sol` | STD + DNA verification (queries DNAVerification on-chain)             |
| `DNAVerification.sol`      | On-chain DNA verification (STR markers, haplogroup, revoke)           |

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
User → Evolve2Earn.verify() → mints ProfileNFT → initializes TrustScore (1)
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
  → Governance.sol: voteWeight = (recursiveWeight × 30% + children × 40% + Staked EVOLVE × 30%). Free balance on wallet gives NO weight for men; women use wallet balance.
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

- **DNA recovery**: implemented in `apps/web/src/lib/dna-recovery.ts` (client) + `apiServer.ts` POST `/api/auth/dna-recover` (server)
- **Rate-limiting**: 30 req/min global
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

## 16. DNA Account Recovery

> **Feature**: Account recovery via on-chain DNA verification (no phone/email needed).

- **Files**: `apps/web/src/lib/dna-recovery.ts` (API client), `apps/web/src/components/DNARecovery.tsx` (UI)
- **Server endpoint**: `apps/web/src/lib/apiServer.ts` — `POST /api/auth/dna-recover`
- **Integration**: `AuthLanding.tsx` (recovery link button), `ProtectedRoute.tsx` (dna-recovery view + onSelectDnaRecovery prop)
- **Flow**: User enters email → pastes DNA test result → client parses with `parseDNATest()` + `generateDNAHash()` → hash sent to server → server looks up user by email → fetches on-chain DNA profile via `getDNAProfile()` → compares bytes32 hash → on match issues session cookie
- **i18n keys**: `dnaRecovery.*`, `auth.landing.dnaRecovery`, `auth.landing.questionRecovery` (button label), `auth.landing.securityTitle`, `auth.landing.securityDescription` (landing security notice), `common.or` — present in all 33 locales (added via `scripts/add-security-notice-locales.mjs`)
- **Privacy**: individual pathogen status never shown; only anonymous compatibility result

---

## 17. Search Modes (Filters) + VerificationModal

> **Feature**: Search modes (normal / pregnancy-bond / cryptic-choice) as radio filters on Home; VerificationModal explains verification requirements per mode.

- **Files**: `apps/web/src/store/AppContext.tsx` (`searchMode`/`setSearchMode`, localStorage key `evolve_search_mode`), `apps/web/src/components/VerificationModal.tsx`, `apps/web/src/pages/Home.tsx` (radio filter + "i" info button), `apps/web/src/pages/ProfileSettings.tsx` (mode selector section removed — modes now selected on Home)
- **Mode colors**: normal `#3b82f6` (blue), pregnancy-bond `#4338ca` (indigo), cryptic-choice `#0f172a` (dark navy)
- **Tests**: `apps/web/src/components/__tests__/VerificationModal.test.tsx` (4), `apps/web/src/pages/__tests__/HomeFilters.test.tsx` (4)
- **NEVER CHANGE WITHOUT RUNNING TESTS**:
  ```bash
  cd apps/web && npx vitest run src/components/__tests__/VerificationModal.test.tsx src/pages/__tests__/HomeFilters.test.tsx
  ```
- **i18n keys**: `verificationModal.*` — present in all 33 locales
- **Verification requirements**: women — STD test only; men — STD + DNA + EvolveFund deposit ≥ 15 EVOLVE
- **Privacy logic preserved**: `canSeeProfile` unchanged; `authMode` still used for privacy levels (Level 1/2/3) in ProfileSettings

---

## 18. Photo Blur + Onboarding Wizard

> **Feature**: On registration, users set age (can hide), languages, bio, photo (can blur). Interested users can request a 15-second or permanent photo view; the photo owner can proactively "offer" a view to a chosen user without a request. Photo viewing is **free** (no EVOLVE).

- **Files**: `apps/web/src/lib/photo-access.ts` (pure grant logic), `apps/web/src/lib/photo-access.test.ts`, `apps/web/src/lib/languages.ts` (language list, imported by LanguageSelector), `apps/web/src/lib/image.ts` (`fileToDataUrl(file, maxSize=900)`), `apps/web/src/components/OnboardingWizard.tsx` (4 steps: age→languages→bio→photo), `apps/web/src/components/PhotoView.tsx` (blur/timer component), `apps/web/src/App.tsx` (`OnboardingGate` inside AppInner under AppStateProvider)
- **Pages**: `Home.tsx` (PhotoView in cards), `UserProfile.tsx` (photo request + age hidden + language chips), `Profile.tsx` ("My profile info" edit + "Photo access" grants with revoke), `Chat.tsx` (photo panel: request / approve 15s|permanent / deny / offer / revoked)
- **Data model**: photo stored as **base64/data URL** (downscaled to 900px JPEG 0.85, ~100–300KB); grants stored on the photo OWNER's profile in `photoGrants: Record<viewerUserId, {kind: "temporary"|"permanent", grantedAt, expiresAt?}>`; temporary access = **15 seconds** (`TEMP_PHOTO_VIEW_MS = 15_000`)
- **Chat messages**: request/approval/offer flow via chat messages (STD/DNA pattern) — `requestType: "PHOTO"`, `photoGrantKind`, `photoAction`
- **Registration**: all new signups (SIWE) get `onboardingComplete: false`; legacy seed users — `true`
- **Tests**: `apps/web/src/lib/photo-access.test.ts` (14 tests, PASS), `apps/web/src/pages/__tests__/UserProfile.test.tsx` (3 tests, PASS)
- **NEVER CHANGE WITHOUT RUNNING TESTS**:
  ```bash
  cd apps/web && npx vitest run src/lib/photo-access.test.ts src/pages/__tests__/UserProfile.test.tsx
  ```
- **i18n keys**: `onboarding.*`, `photo.*`, `chat.photo*`, `userProfile.ageHidden`, `profile.edit.*`, `profile.photoGrants.*` — present in all 33 locales (via `scripts/i18n-photo-insert.mjs`)

---

## 19. UI Reorganization (Profiles, Communications, Settings)

> **Feature**: Home filters reorganized (tags/interests moved to the bottom of the extended grid, new "Skin color" filter), "Messages" renamed to "Communications" (left: messages, right: "Proposals" voting panel weighted by user reputation), and "Settings" moved into Profile tabs (separate nav item & `/profile/settings` route removed).

### Skin Color

- **Values**: `fair` / `light` / `medium` / `tan` / `dark` / `deep`
- **Files**: `apps/web/src/pages/Home.tsx` (options array `skinColorOptions`, `SelectFilter`, filtering in `filteredProfiles`), `apps/web/src/pages/Profile.tsx` (editor select + `SKIN_COLOR_OPTIONS` + save), `apps/web/src/store/AppContext.tsx` (`skinColor` added to `SearchDetails`, `FilterState`, and `persistProfile` merge)
- **i18n keys**: `filters.skinColor`, `filters.skinColors.{fair,light,medium,tan,dark,deep}` — all 33 locales (via `scripts/add-skincolor-locales.mjs`)

### Communications + Proposals

- **Files**: `apps/web/src/components/Layout.tsx` (nav label now `navigation.communications`), `apps/web/src/pages/Chat.tsx` (right-hand `ProposalsPanel` column), `apps/web/src/components/ProposalsPanel.tsx` (in-app proposal board)
- **ProposalsPanel**: create proposal (title+desc), vote yes/no, **vote weight = `myProfile.reputationScore`**, tally shown per-proposal and globally. **Deliberately non-blockchain**: state persists to `sessionStorage` (`evolve_proposals_v1`), seeded with 2 defaults.
- **i18n keys**: `communications.*` (`proposalsTitle`, `createProposal`, `votesFor`, `votesAgainst`, `voteWeightHint`, `youVotedWeight`, etc.) — all 33 locales (via `scripts/add-skincolor-locales.mjs`)

### Settings → Profile tabs

- **Files**: `apps/web/src/pages/Profile.tsx` (new `settings` tab in the `activeTab` union + tab bar; embeds Privacy toggle, Mode Dashboard, DNA Recovery, `SmartAccountInfo`, `PaymasterDeposit`), `apps/web/src/App.tsx` (removed `profile/settings` route + `ProfileSettings` import)
- **i18n keys**: `profile.tabs.settings`, `navigation.communications` — all 33 locales (via `scripts/add-skincolor-locales.mjs`)
- **Note**: `ProfileSettings.tsx` page still exists but is no longer routed directly; its content is embedded in the Profile "Settings" tab.

### Nav menu (after change)

`Home · Communications · (mode2/mode3 if active) · Profile · Connect/Logout/🌐`

---

## 20. Gender + "Who Are You Looking For" Filter

> **Feature**: Each profile declares its own `gender` and `lookingFor` (who it seeks). The Home page has a "Looking for" filter that surfaces profiles whose `lookingFor` equals the selected option. Stores in the existing `searchDetails` JSON (no new DB migration).

### Data model

- **`gender`**: `"male" | "female" | "other"` (mirrors `packages/core/src/types.ts`)
- **`lookingFor`**: single-select `"man" | "woman" | "couple_man_woman" | "couple_woman_woman" | "couple_man_man"`
- Both live in `profile.searchDetails` (JSON string in `schema.prisma searchDetails`) — round-trips through `db.ts` without schema change

### Files

- `apps/web/src/lib/looking-for.ts` — **pure helpers**: `matchesLookingFor(profileLookingFor, filterValue)` + `LOOKING_FOR_OPTIONS` constant (unit-testable)
- `apps/web/src/lib/__tests__/looking-for.test.ts` — 5 tests (PASS)
- `apps/web/src/store/AppContext.tsx` — `gender?`/`lookingFor?` in `SearchDetails` (~99-115), `lookingFor?` in `FilterState` (~120)
- `apps/web/src/pages/Home.tsx` — `SelectFilter` "Looking for" (~606-616), filter `if (!matchesLookingFor(sd.lookingFor, filters.lookingFor)) return false;` (~242)
- `apps/web/src/pages/Profile.tsx` — `editGender`/`editLookingFor` state, `GENDER_OPTIONS`/`LOOKING_FOR_OPTIONS`, two editor selects + save into `searchDetails`
- `apps/web/src/components/OnboardingWizard.tsx` — added `"gender"` step (between age and languages): gender buttons + lookingFor select; included in `finish`/`skip` payload
- `apps/web/src/lib/db.ts` — 8 seed profiles get `searchDetails: { gender, lookingFor }`
- `apps/web/scripts/add-gender-locales.mjs` — deterministic i18n adder (natural Tier 1 translations, English fallback), idempotent deep-merge; run → `ALL 33 LOCALES VALID`

### Filter semantics

- Filter unset/empty → keep every profile
- Filter set → keep only profiles whose `searchDetails.lookingFor` equals the selected value
- Existing male/female rules (VerificationModal requirements, Mode2/3, EvolveFund) are **untouched** — `gender` here is a new profile preference field, independent of the man/woman verification rules

### i18n keys

`filters.gender`, `filters.genders.{male,female,other}`, `filters.lookingFor`, `filters.lookingForOptions.{man,woman,couple_man_woman,couple_woman_woman,couple_man_man}`, `onboarding.gender.{title,label,lookingForLabel,lookingForOptions.*}` — all 33 locales (via `scripts/add-gender-locales.mjs`).

### NEVER CHANGE WITHOUT RUNNING TESTS

```bash
cd apps/web && npx vitest run src/lib/__tests__/looking-for.test.ts --pool=threads
```

---

## 21. Safety Mode (Public Facade)

> **Feature**: `VITE_PRODUCT_MODE` env switch. In `safety` mode the app is an **STD-compatibility + lab-integration public facade**: users see their STD status, manage a public profile link, request/approve compatibility checks with anonymous verdicts, and labs operate a partner dashboard. Dating, conception, Governance, DAO, and wallet features are hidden.

### Mode control

- **`apps/web/src/lib/config.ts`**: `PRODUCT_MODE = import.meta.env?.VITE_PRODUCT_MODE` (default `"safety"`); `isSafetyMode()` / `isFullMode()` helpers. Full (dating) mode is dev-only; public builds default to safety.
- **Routing (App.tsx)**: index → `isSafetyMode() ? <SafetyDashboard/> : <Home/>`; `/p/:username` public profile (inside Layout, OUTSIDE ProtectedRoute); `/scan` protected (inside Layout); `/lab-dashboard` partner dashboard (outside Layout + ProtectedRoute); dating pages gated by `!isSafetyMode() &&`.
- **Nav (Layout.tsx)**: safety mode shows Home / Check (`/scan`) / Profile only; chat, mode2, mode3 entries hidden.

### Pages

- **`SafetyDashboard.tsx`** — STD status (`myProfile.stdUploaded`), public link management, incoming/outgoing compatibility checks with approve/deny, patient QR (`LabPatientQR`).
- **`PublicProfile.tsx`** — `/p/:username` minimal card (photo, name, username) + person QR (`evolve://person/<userId>`) + Check button (if authenticated, non-owner).
- **`Scan.tsx`** — scans `evolve://person/<id>` QR (`html5-qrcode`, element id `evolve-scan-reader`), sends check request.
- **`LabDashboard.tsx`** — partner session (email+password via `partner_session` cookie): scan patient QR (`evolve://lab-patient/<userId>`, element id `lab-dash-qr-reader`), begin visit, confirm identity (`matched`/`none`), attach STD report, list visits.

### Backend

- **AUTH**: lab partners are `{{ kind: "partner", partnerId, userId: "" }}` sessions (cookie `partner_session`); user routes reject `kind === "partner"` with 401.
- **Schema**: `Partner` (lab accounts, `apiKey`), `CompatibilityCheck` (requester/target/status/verdict/expiresAt), `Profile.username` + `publicLinkEnabled`.
- **Key endpoints** (`apiServer.ts`):
  - `POST /api/partner/register|login|logout`, `GET /api/partner/me`
  - `POST /api/public-link/update`, `GET /api/public-link/me`
  - `GET /api/public/profile/:username` (public card: no STD data, no profile details)
  - `GET /api/checks/pending|inbox`, `POST /api/checks/request`, `POST /api/checks/:id/respond`
  - `GET /api/lab/account/scan?userId=`, `POST /api/lab/account/begin`, `GET /api/lab/account/visits`, `POST /api/lab/account/visit/:id/face|report`
- **Checks logic** (`apps/web/src/lib/checks.ts` + test, 19 PASS): 1 pending per pair, self-check forbidden, 7-day TTL; server-side anonymous verdicts — `none`→safe, `same_strain`→compatible, `potential_risk`→caution, `high_risk`→risk; missing STD text → `incomplete`. Individual pathogen status NEVER exposed.
- **db.ts**: partner CRUD, public links, checks, lab visits + fallback lazily initializes missing collections in `fallback-db.json` (no seed needed).

### Localization

- i18n namespaces: `safety.*`, `publicProfile.*`, `labDashboard.*`, `scan.*`, `navigation.check` — all 33 locales (via `scripts/add-safety-locales.mjs`). Note: `labPortal.scan.*` (LabPortal, deep key) and top-level `scan.*` (Scan page) coexist — different nesting levels, no conflict.

### NEVER CHANGE WITHOUT RUNNING TESTS

```bash
cd apps/web && npx vitest run src/lib/checks.test.ts
cd apps/web && npx tsc --noEmit   # ignore db.ts:270
```

---

## 22. PDF Lab Report Extraction (pdf-text)

> **Feature**: `POST /api/lab/report` accepts `pdfBase64` (base64 PDF/image, alongside the existing `rawText`). PDFs are parsed via `pdf-parse` v2 (text layer); if extraction yields fewer than `MIN_PDF_TEXT_CHARS` (100) chars the first ≤3 pages are rendered to PNG and OCR'd via `tesseract.js` (`eng`+`ukr`+`rus`); non-PDF images (PNG/JPG) are OCR'd directly. Never throws — any failure returns `{ text: "", source: "none", pages: 0 }`.

- **Files**: `apps/web/src/lib/pdf-text.ts` (server-only `extractPdfText(data, loaders?)` with injectable lazy loaders `loadPdfParse`/`loadTesseract` — DI so vitest/browser never pull pdfjs/tesseract), `apps/web/src/lib/__tests__/pdf-text.test.ts` (9 tests PASS), `apps/web/src/lib/apiServer.ts` (POST /api/lab/report — `to` + `rawText` **or** `pdfBase64` → `Buffer.from(base64)` → `extractPdfText` → 422 if no text → `parseStdTestResult` → `createLabReport({ source: "email"|"pdf" })`), `prisma/schema.prisma` (`source` comment now includes `"pdf"`)
- **Deps**: `pdf-parse ^2.4.5`, `tesseract.js ^7.0.0`
- **Key exports**: `MIN_PDF_TEXT_CHARS = 100`, `PdfTextResult { text, source: "pdf"|"ocr"|"none", pages }`, `PdfParser`, `PdfParseModule`, `OcrModule`, `OcrWorker`, `PdfTextLoaders`, `extractPdfText(data, loaders?)`

### NEVER CHANGE WITHOUT RUNNING TESTS

```bash
cd apps/web && npx vitest run src/lib/std-parser.test.ts src/lib/__tests__/pdf-text.test.ts --pool=threads
cd apps/web && npx tsc --noEmit   # ignore db.ts:270
```

---

## 23. Ban Resistance

> **Constitutional rule set**: EVOLVE is designed to survive platform bans, geo-blocking, store removal, domain seizure, and infrastructure takedowns. All agents MUST preserve the properties below; never remove or weaken them "for convenience".

### Core Principles

1. **Self-custodial auth is the escape hatch**: SIWE (MetaMask) login MUST be retained — never replaced by email/phone-only auth. DNA recovery + seed-phrase recovery provide account access without KYC, phone, or email dependency.
2. **P2P-first messaging**: chat MUST work over libp2p (gossipsub) + Nostr without the central API server. The HTTP fallback is a convenience, never a hard dependency.
3. **Decentralized storage is the source of truth for user content**: IPFS / Arweave first; server-side copies are mirrors, not the only copy.
4. **Multi-network, multi-RPC**: keep all 11 EVM-network configs (`hardhat.config.ts` + `src/lib/networks.ts`); never hardcode a single RPC/chain as the only path.
5. **No absolute domain dependency**: public builds must work from any domain/IP — no hardcoded absolute URLs to a single host in application code (env-driven).
6. **Anonymous-by-default health data**: individual STD/DNA status is NEVER centralized in a form that identifies a user to a third party; only anonymous verdicts (safe/compatible/caution/risk) are shared.
7. **Safety Mode is a survival strategy**: the public facade (`VITE_PRODUCT_MODE=safety`) must keep working even if dating/conception features are banned in a store or jurisdiction. Never break it while adding dating features.
8. **No KYC gate**: login, recovery, and core usage must not require government ID, phone number, or email as a mandatory condition.

### Guardrails for agents

- Do NOT delete SIWE/self-custodial wallet flows when adding social/email login — extend, don't replace.
- Do NOT move chat exclusively to a central HTTP API.
- Do NOT centralize user content to a single VPS; keep IPFS/Arweave upload paths.
- Do NOT introduce a single-chain dependency (e.g., "works only on Arbitrum").
- Do NOT hardcode a production domain in code that prevents running the app from a mirror.
- If a change weakens one of these guardrails, propose a counter-measure in the same PR.

### Related files

- `apps/web/src/lib/config.ts` — `PRODUCT_MODE` / `isSafetyMode()` / `isFullMode()`
- `apps/web/src/pages/SafetyDashboard.tsx` — public facade dashboard
- `apps/web/src/pages/PublicProfile.tsx`, `Scan.tsx`, `LabDashboard.tsx` — safety-mode pages
- `apps/web/src/lib/networks.ts` — 18-network config
- `apps/web/src/lib/dna-recovery.ts` — recovery without phone/email
- `packages/p2p/` — libp2p v3 + Nostr messaging
- `packages/storage/` — IPFS / Arweave / Lit

---

## 24. Session State

> **Перше, що читає кожен агент при старті нової сесії.** Цей трекер показує що вже зроблено, що ні, і хто що робив. Після завершення задачі — оновлюй статус.

| #   | Task                                                                  | Status                                                                                                          | Files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Done by                                                                                                                        |
| --- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | EvolveFund.sol + BondManager.sol                                      | ✅ **Done**                                                                                                     | `packages/contracts/src/EvolveFund.sol`, `BondManager.sol`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | opencode                                                                                                                       |
| 2   | Rating System (3-component)                                           | ⚠️ **Done** (tests not verified — broken tsconfig.json)                                                         | `packages/core/src/rating.ts`, `__tests__/rating.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | antigravity                                                                                                                    |
| 3   | Emoji Gifts UI + STD Profile                                          | ✅ **Done**                                                                                                     | `apps/web/src/components/EmojiGift.tsx`, `pages/Profile.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | opencode                                                                                                                       |
| 4   | Mode2/Mode3 UI                                                        | ⚠️ **Done** (routing added, ProfileSettings not updated)                                                        | `apps/web/src/components/Mode2Dashboard.tsx`, `Mode3Dashboard.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | copilot                                                                                                                        |
| 5   | TOKENOMICS.md + DNA Verification                                      | ⚠️ **Done** (DNA is mock — needs real impl)                                                                     | `docs/TOKENOMICS.md`, `apps/web/src/lib/dna-verification.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | zed                                                                                                                            |
| 6   | Зачаття/Посткопуляція web integration                                 | ✅ **Done** (171 tests, tsc GREEN)                                                                              | `apps/web/src/components/Mode2Dashboard.tsx`, `Mode3Dashboard.tsx`, `apps/web/src/lib/abi/EvolveFundABI.ts`, `EVOLVEABI.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | sisyphus                                                                                                                       |
| 7   | ERC-4337 Account Abstraction                                          | ✅ **Done** (7 new tests, 171 total, tsc GREEN)                                                                 | `packages/contracts/src/SmartAccountFactory.sol`, `Paymaster.sol`, `ignition/modules/SmartAccountFactory.js`, `Paymaster.js`, `test/SmartAccountFactory.test.js`, `Paymaster.test.js`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | sisyphus                                                                                                                       |
| 8   | Full QA Audit (Tasks 1-5)                                             | 📋 **Planned**                                                                                                  | `apps/web/QA-REPORT.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | antigravity                                                                                                                    |
| 9   | Mobile Mode2/Mode3 Screens                                            | ✅ **Done** (mobile tsc clean — no new errors in mode2/mode3, 33 locales valid, no hardcoded strings)           | `apps/mobile/app/mode2.tsx` (992 lines), `mode3.tsx` (612 lines), `apps/mobile/scripts/add-mobile-dashboard-locales.mjs` (incremental i18n adder: new keys + FORCE overrides for stale 15 ETH / 20-day values, natural Tier-1, ALL 33 LOCALES VALID)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | sisyphus                                                                                                                       |
| 10  | Network Infrastructure + Settings                                     | ✅ **Done** (18 networks, helper functions)                                                                     | `apps/web/src/lib/networks.ts`, `NetworkSelector.tsx`, `ChainSelector.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | sisyphus                                                                                                                       |
| 11  | DNA Account Recovery                                                  | ✅ **Done** (tsc GREEN, build GREEN)                                                                            | `dna-recovery.ts`, `DNARecovery.tsx`, `apiServer.ts` POST /api/auth/dna-recover                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | opencode                                                                                                                       |
| 12  | Search Modes + VerificationModal                                      | ✅ **Done** (8 tests PASS, 33 locales)                                                                          | `AppContext.tsx`, `VerificationModal.tsx`, `Home.tsx`, `ProfileSettings.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | opencode                                                                                                                       |
| 13  | TrustScore base 50→1                                                  | ✅ **Done** (hardhat 141 passing)                                                                               | `packages/contracts/src/TrustScore.sol`, tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | opencode                                                                                                                       |
| 14  | DNA WIP (Upload/utils/Profile)                                        | ✅ **Fixed** (tsc clean, build GREEN)                                                                           | `DNAUpload.tsx` (нативний input), `dnaUtils.ts` (markers), `Profile.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | opencode                                                                                                                       |
| 15  | DNA Verification (on-chain)                                           | ✅ **Done** (164 tests, deploy GREEN)                                                                           | `DNAVerification.sol`, `VerificationRegistry.sol` (DNA integration), `ignition/modules/DNAVerification.js`, `test/DNAVerification.test.js` (11)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | opencode                                                                                                                       |
| 16  | Monorepo JIT + Dead Package Audit                                     | ✅ **Done** (795 tests GREEN, build GREEN)                                                                      | `packages/ui` **DELETED** (dead, 0 imports), matching/core/p2p/storage JIT-ready, `docs/monorepo-dead-packages.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | antigravity                                                                                                                    |
| 17  | Tooling Unification (eslint/prettier/turbo)                           | ✅ **Done** (web build 2m26s, all tsc clean)                                                                    | root `overrides: {viem: 2.55.11}`, `vite-env.d.ts`, `core/browser.ts` export-type, p2p `@libp2p/upnp-nat`, `.eslintrc.json` (530B)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | opencode                                                                                                                       |
| 18  | Photo Blur + Onboarding Wizard                                        | ✅ **Done** (17 tests PASS, 33 locales, build GREEN)                                                            | `photo-access.ts`+test, `OnboardingWizard.tsx`, `PhotoView.tsx`, `languages.ts`, `image.ts`, `db.ts`, `apiServer.ts`, `AppContext.tsx`, `Home.tsx`, `UserProfile.tsx`, `Profile.tsx`, `Chat.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | opencode                                                                                                                       |
| 19  | Sepolia Testnet Deploy (9 contracts)                                  | ✅ **Done** (all 9 deployed + wired, tsc GREEN)                                                                 | `script/deploy-sepolia.mjs`, `hardhat.config.js` (dotenv + sepolia network), `apps/web/src/lib/addresses.ts` (Sepolia addresses)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | opencode                                                                                                                       |
| 20  | Prod Server + Faucet + Email OTP Fixes                                | ✅ **Done** (E2E OTP green, tsc clean, 133 tests, build GREEN)                                                  | `apps/web/src/server/prod-server.ts`, `src/lib/apiServer.ts`, `src/lib/kv.ts`, `src/lib/adminChain.ts`, `prisma/schema.prisma` (+5 Profile cols), `src/lib/db.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | sisyphus                                                                                                                       |
| 21  | UI Reorg: Skin Color + Communications/Proposals + Settings-in-Profile | ✅ **Done** (tsc clean, build GREEN, 70 std + 13 integration tests PASS, 33 locales)                            | `Home.tsx` (skinColor filter, tags→bottom), `Profile.tsx` (skinColor editor + Settings tab), `AppContext.tsx` (skinColor), `Layout.tsx` (communications label, settings nav removed), `Chat.tsx` + `ProposalsPanel.tsx`, `App.tsx` (settings route removed), `ProtectedRoute.tsx` (question-recovery wired), `scripts/add-skincolor-locales.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | sisyphus                                                                                                                       |
| 22  | Gender + "Looking For" Filter                                         | ✅ **Done** (tsc clean, build GREEN, 5 looking-for tests PASS, 33 locales)                                      | `Home.tsx` (lookingFor filter + SelectFilter), `Profile.tsx` (gender/lookingFor editor), `OnboardingWizard.tsx` (gender step), `AppContext.tsx` (SearchDetails.gender/lookingFor + FilterState.lookingFor), `lib/looking-for.ts`+test, `lib/db.ts` (8 seed profiles), `scripts/add-gender-locales.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | sisyphus                                                                                                                       |
| 23  | Lab Testing (DAO) + UI Recovery                                       | ✅ **Done** (tsc clean, 105 tests PASS incl. lab-report 10 + lab-preference 9, 33 locales valid)                | `lib/lab-report.ts`+test, `lib/lab-preference.ts`+test, `scripts/add-lab-locales.mjs`, `apiServer.ts` (/api/lab/email, pending, accept, report), `db.ts` (labReports + 3 methods + seed variety), `AppContext.tsx` (testingPreference in SearchDetails/FilterState/ProfilePatch/filters + RECOVERED SearchDetails/FilterState/face/liveness interfaces), `Home.tsx` (testingPreference filter + RECOVERED skinColor/lookingFor filters), `Profile.tsx` (gender/lookingFor/skinColor/testingPreference editors + Lab panel), `docs/lab-testing.md` (deferred LabRegistry/TestCertification + mail adapter)                                                                                                                                                                                                                                                                                 | sisyphus                                                                                                                       |
| 24  | Lab Partner E2E (QR + Face Match + Public Portal)                     | ✅ **Done** (tsc clean, 181 tests PASS / 17 files, 33+33 locales valid, prettier clean)                         | `LabPatientQR.tsx` (QR payload `evolve://lab-patient/<userId>`, `qrcode` pkg, ecLevel M), `LabPortal.tsx` (public route `/lab-portal` — OUTSIDE Layout/ProtectedRoute; register→scan→verify→report wizard, `html5-qrcode` scanner, API key in sessionStorage `evolve_lab_api_key`, report blocked until `matched`), `App.tsx` (route), `apiServer.ts` (`/api/lab/partner/register                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | verify                                                                                                                         | report`; local `cosineSimilarity`+`FACE_SIMILARITY_THRESHOLD = 0.75`— do NOT import`face-verification.ts`in Node, it has top-level`await import("@mediapipe/tasks-vision")`), `db.ts`(LabPartner dedup ~983,`getProfileByUserId`~716,`createLabReport`+`faceMatchStatus`/`labPartnerName`, `PROFILE_JSON_COLUMNS`+=`faceEmbedding`~525, module-level`generateApiKey`), `schema.prisma` (`LabPartner`100-106,`LabReport.faceMatchStatus/labPartnerName`115-116,`Profile.faceEmbedding`29),`AppContext.tsx` (`faceEmbedding`in`ProfilePatch`~197),`Profile.tsx`(QR block + face-match badge`profile.lab.faceVerified`/`faceNotVerified`), `scripts/add-lab-partner-locales.mjs` | sisyphus |
| 25  | Help Icons (?/!) Integration                                          | ✅ **Done** (tsc clean, `add-help-locales.mjs` rewritten → ALL 33 LOCALES VALID)                                | `InfoProposalIcons.tsx`, `lib/help-dictionary.ts`, `Mode2Dashboard.tsx` (`mode2.dashboard` term), `Mode3Dashboard.tsx` (`mode3.dashboard` term), `ProposalsPanel.tsx` (`chat.proposals` term), `Profile.tsx` (3× `profile.sections.modeSelector/profileEdit/lab`), `Home.tsx` (existing integration), `scripts/add-help-locales.mjs` (rewritten: real locale dir via `__dirname`/`fileURLToPath`, nested-object deep-merge — flat string keys broke i18next dot-notation, `zh-TW→zh` Tier-1 inheritance, 18 required keys validated)                                                                                                                                                                                                                                                                                                                                                      | sisyphus                                                                                                                       |
| 26  | Mode 3 Rewards Upgrade (father 2× +1 EVOLVE/participant)              | ✅ **Done** (tsc clean, build GREEN, 33 locales valid, prettier clean)                                          | `addresses.ts` (Evolve2Earn `0xc6268549F24A2658C8c6222242aBd56534b1c3e6` ← RedeployMode3Rewards 2026-09-05, BondManager `0x650FC8033286112Fc0369Da9A1337D856FF7795f`; old `0x0bbEee8…` left as legacy p2p escrow vault — 1M EVOLVE), `Mode2Dashboard.tsx` (19 hardcoded strings → `t()` incl. `minDeposit`), `Mode3Dashboard.tsx` (6 hardcoded strings → `t()`), `scripts/add-dashboard-locales.mjs` (rewritten as INCREMENTAL adder — new `dashboard.mode2.*` keys ONLY, natural Tier-1 translations, ALL 33 LOCALES VALID)                                                                                                                                                                                                                                                                                                                                                              | sisyphus                                                                                                                       |
| 27  | Safety Mode (Public Facade)                                           | ✅ **Done** (tsc EXIT 0, 200 tests PASS / 18 files, safety build GREEN 1m49s, 33 locales valid, prettier clean) | `apps/web/src/lib/config.ts` (PRODUCT_MODE / isSafetyMode, default "safety"), `pages/SafetyDashboard.tsx` (STD status stdUploaded + public link + checks + QR), `pages/PublicProfile.tsx` (`/p/:username`, QR `evolve://person/<id>`, Check), `pages/Scan.tsx` (QR scan, id `evolve-scan-reader`), `pages/LabDashboard.tsx` (partner session auth + scan id `lab-dash-qr-reader` + visit + face + report), `App.tsx` (safety routes), `Layout.tsx` (safety nav), `lib/checks.ts`+test (19 PASS), `lib/apiServer.ts` (partner-auth / public-link / checks / lab-account / public-profile), `lib/db.ts` (partner CRUD, public links, checks, lab visits + fallback lazy init), `prisma/schema.prisma` (Partner, CompatibilityCheck, Profile.username/publicLinkEnabled), `scripts/add-safety-locales.mjs` (safety.* / publicProfile.* / labDashboard.* / scan.* / navigation.check → 33/33) | sisyphus                                                                                                                       |
| 28  | PDF Lab Report Extraction (pdf-text)                                  | ✅ **Done** (9 tests PASS, tsc EXIT 0, 92 total with std-parser, prettier clean)                                | `lib/pdf-text.ts` (server-only `extractPdfText(data, loaders?)` DI: loadPdfParse/loadTesseract lazy, OCR fallback eng+ukr+rus, `MIN_PDF_TEXT_CHARS=100`, never throws), `__tests__/pdf-text.test.ts` (9 PASS), `apiServer.ts` (POST /api/lab/report accepts `pdfBase64` → extract → parseStdTestResult → createLabReport `source: "email"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | "pdf"`, 422 if no text), `prisma/schema.prisma`(source comment + "pdf"),`package.json` (pdf-parse ^2.4.5, tesseract.js ^7.0.0) | sisyphus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 29  | Fix: N+1 `/api/messages` → 429 + lab cookie auth                      | ✅ **Done** (tsc EXIT 0, 222 tests PASS / 19 files, build GREEN, browser-verified 0× 429)                       | **N+1 fix**: `db.ts` (+`getConversationPeers(userId)` — фолбек читає `data.messages` з fallback-db), `apiServer.ts` (+`GET /api/messages/peers` — один легкий запит для списку співрозмовників), `AppContext.tsx` (`refreshData` більше НЕ робить per-profile цикл `/api/messages`; `ProfileData.hasChat`, `loadChatHistory(profileId)` — ліниве завантаження переписки), `Chat.tsx` (фільтр `hasChat \|\| chatHistory.length`, lazy-load при виборі профілю). **Cookie auth fix**: `apiServer.ts` ~358 — lab-ендпоінти тепер читають `cookies["siwe_session"] \|\| cookies["email_session"] \|\| cookies["partner_session"]` (раніше лише siwe → реєстрація/сканер ламались для email/partner юзерів)                                                                                                                                                                                    | sisyphus                                                                                                                       |

### Deployed Addresses — Ethereum Sepolia (2026-08-21, Mode3-rewards redeploy 2026-09-05)

| Contract             | Address                                      |
| -------------------- | -------------------------------------------- |
| EVOLVE               | `0x17b7D47a7A2fEe2999d2DEbb4b29379Cf7481d7d` |
| ProfileNFT           | `0x1A58b3e3f2698a7449D2EB4daf7d09849015d277` |
| DNAVerification      | `0x2d6d770F7e5a8C10dC2B103B4f3Cb0e046Db649f` |
| VerificationRegistry | `0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189` |
| TrustScore           | `0x0Cb18aa859f4A625aD3e8dE5958E577dfD9FEeB9` |
| Evolve2Earn          | `0xc6268549F24A2658C8c6222242aBd56534b1c3e6` |
| EvolveFund           | `0x016F6D873ed4B366098f9BE5C042ef583DC66DeE` |
| Governance           | `0x8f95C852114e0C01B3D722EA9653F5b3e4460000` |
| BondManager          | `0x650FC8033286112Fc0369Da9A1337D856FF7795f` |

Post-deploy wiring: `EvolveFund.setBondManager()`, `VerificationRegistry.setDNAVerification()`, `TrustScore.setVotingContract()`, `EVOLVE.mint(Evolve2Earn, 100M)` (2026-09-05: 99M → new Evolve2Earn reward pool, 1M stays in legacy `0x0bbEee8…` p2p escrow vault).

Explorer: https://sepolia.etherscan.io (✅ verified — `ETHERSCAN_API_KEY` in `.env`)

### Agent Instructions for New Session

1. **Прочитай AGENTS.md повністю** — особливо секції 2 (Code Rules), 6 (Package Integration), 12-17 (бізнес-логіка)
2. **Перевір Session State (секція 24)** — що вже зроблено, що ні
3. **Візьми Pending задачу** — онови статус на `🔄 In Progress`
4. **Після завершення** — онови статус на `✅ Done` + дату + своє ім'я

---

_Last updated: 2026-09-19_
_This constitution is version‑controlled. All agents must follow it._
_See RULES_PROTOCOL.md for how to propose and apply rule changes._
