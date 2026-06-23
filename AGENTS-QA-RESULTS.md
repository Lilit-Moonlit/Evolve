# QA Results

## Test Results

**84/84 tests PASS** after fixes (Home.test.tsx + Chat.test.tsx fixed).

### Fixed Tests

| File            | Issue                               | Fix                                                                 |
| --------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `Home.test.tsx` | Missing `<Router>` wrapper          | Added `<MemoryRouter>`                                              |
| `Chat.test.tsx` | Missing `<Router>` + wrong selector | Added `<MemoryRouter>`, fixed selector to match `chat.title` button |

## Lint

**Status**: ❌ FAIL — pre-existing configuration issues

```
ESLint config issues:
1. .eslintrc.json is empty (0 bytes)
2. apps/web has no eslint config file
3. Some packages use ESLint v10 which requires eslint.config.js

npm run lint output:
- evolve-web#lint: FAILED (cannot read .eslintrc.json)
- @evolve/storage#lint: FAILED (no eslint.config.js)
- @evolve/p2p#lint: FAILED (no eslint.config.js)
- evolve-mobile#lint: FAILED (no eslint.config.js)
- @evolve/ui#lint: FAILED (no eslint.config.js)
- @evolve/core#lint: FAILED (no eslint.config.js)
- @evolve/matching#lint: FAILED (no eslint.config.js)
```

**Resolution needed**: Add proper ESLint configuration files to each package.

## Phone Auth Tests

```
✓ src/lib/phoneAuth.test.ts (7 tests)
  ✓ requestPhoneOtp - sends POST to /api/auth/phone/request-otp
  ✓ requestPhoneOtp - returns error on failure
  ✓ verifyPhoneOtp - sends POST to /api/auth/phone/verify-otp
  ✓ verifyPhoneOtp - returns error on invalid OTP
  ✓ getPhoneSession - sends GET to /api/auth/phone/session
  ✓ getPhoneSession - returns unauthenticated when no session
  ✓ logoutPhone - sends POST to /api/auth/phone/logout
```

## TypeScript Compile

**PASSED** — `npx tsc --noEmit` clean (excluding pre-existing `db.ts:270` error).

## Build

**PASSED** — `npm run build` succeeds.

## Back-end QA (OpenCode)

| Check             | Status | Notes                                                  |
| ----------------- | ------ | ------------------------------------------------------ |
| CI/CD pipeline    | ✅     | `.github/workflows/ci.yml` with test, tsc, lint, build |
| Rate-limiting     | ✅     | Global 30 req/min + OTP-specific 5 req/10min           |
| Phone auth client | ✅     | `phoneAuth.ts` + 7 unit tests                          |
| OTP backend docs  | ✅     | `docs/OTP-backend.md`                                  |
| AGENTS.md updated | ✅     | Known Issues table + Table-Link Policy                 |
| AGENT_PROMPTS.md  | ✅     | BE-OTP-IMPLEMENT row added                             |
| Lint              | ❌     | Pre-existing ESLint config issues (not our code)       |
| Home.test.tsx     | ✅     | Fixed: added MemoryRouter wrapper                      |
| Chat.test.tsx     | ✅     | Fixed: added MemoryRouter, fixed selector              |

## Files Created/Modified

| File                                 | Action                                      |
| ------------------------------------ | ------------------------------------------- |
| `apps/web/src/lib/phoneAuth.ts`      | Created                                     |
| `apps/web/src/lib/phoneAuth.test.ts` | Created                                     |
| `apps/web/src/lib/apiServer.ts`      | Modified (rate-limiting added)              |
| `.github/workflows/ci.yml`           | Modified (test + tsc steps)                 |
| `docs/OTP-backend.md`                | Created                                     |
| `AGENTS.md`                          | Modified (Known Issues + Table-Link Policy) |
| `AGENT_PROMPTS.md`                   | Modified (BE-OTP-IMPLEMENT row)             |

## Pre-existing Issues

| File           | Line | Status     | Description                      |
| -------------- | ---- | ---------- | -------------------------------- |
| `db.ts`        | 270  | ✅ Ignored | Prisma type error — not our code |
| `apiServer.ts` | 87   | ✅ Working | OTP stubs — logs to console only |

## Devin – Mobile & Tier‑2

- Mobile i18n – ✅ PASS
- Wallet config – ✅ DONE
- Tier-2 locales (8) – ✅ PASS
- Tests (Home, Chat) – ✅ PASS after fix

## Lint (Cline)

**Status**: ❌ FAIL — pre-existing ESLint configuration issue (`.eslintrc.json` is empty)

```
npm run lint output:
- evolve-web#lint: FAILED (cannot read .eslintrc.json — Unexpected end of JSON input)
```

**Note**: This is a pre-existing issue documented in AGENTS.md (Known Issues table). Not caused by Cline's changes.

## Cline – QA & Docs

### Tier-2 Locale Updates (7 languages)

| Language   | File      | Status  | Notes        |
| ---------- | --------- | ------- | ------------ |
| Lithuanian | `lt.json` | ✅ PASS | 5 keys added |
| Latvian    | `lv.json` | ✅ PASS | 5 keys added |
| Nepali     | `ne.json` | ✅ PASS | 5 keys added |
| Romanian   | `ro.json` | ✅ PASS | 5 keys added |
| Slovak     | `sk.json` | ✅ PASS | 5 keys added |
| Slovenian  | `sl.json` | ✅ PASS | 5 keys added |
| Vietnamese | `vi.json` | ✅ PASS | 5 keys added |

**Keys added per locale:**

- `chat.hiddenProfile`
- `chat.hiddenContent`
- `settings.hideProfileFromLowerLevels`
- `settings.privacy`
- `auth.landing.wallet`

### Web Regression QA

| Suite              | Tests  | Passed | Failed | Status        |
| ------------------ | ------ | ------ | ------ | ------------- |
| std-parser.test.ts | 70     | 70     | 0      | ✅ PASS       |
| phoneAuth.test.ts  | 7      | 7      | 0      | ✅ PASS       |
| dnaUtils.test.ts   | 4      | 4      | 0      | ✅ PASS       |
| Profile.test.tsx   | 1      | 1      | 0      | ✅ PASS       |
| Home.test.tsx      | 1      | 1      | 0      | ✅ PASS       |
| Chat.test.tsx      | 1      | 1      | 0      | ✅ PASS       |
| **Total**          | **84** | **84** | **0**  | **100% PASS** |

### Documentation Updated

| File                    | Status | Notes                                 |
| ----------------------- | ------ | ------------------------------------- |
| `README.md`             | ✅ OK  | Mobile App Status section expanded    |
| `docs/MOBILE_STATUS.md` | ✅ OK  | Created with full status + next steps |

### AGENT_PROMPTS.md Updated

| Row     | Status  | Link               |
| ------- | ------- | ------------------ |
| CLINE-1 | ✅ DONE | `TIER2-CLINE.md`   |
| CLINE-2 | ✅ DONE | `QA-REPORT.md`     |
| CLINE-3 | ✅ DONE | `MOBILE_STATUS.md` |

### Cline – Final Summary

- Tier‑2 locales (7) → ✅ PASS
- QA report → ✅ DONE (see QA-REPORT.md)
- Docs updated → ✅ DONE
- Lint → ❌ FAIL (pre-existing ESLint config issue — see Lint (Cline) section)
