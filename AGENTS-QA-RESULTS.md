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

---

## Sisyphus — Lab Partner E2E + Help Icons (2026-09-05)

### Scope

1. `db.ts` cleanup (LabPartner method dedup, `faceEmbedding` in JSON columns, module-level `generateApiKey`, `getProfileByUserId`, `createLabReport` extended)
2. Lab Partner end-to-end: QR (`LabPatientQR.tsx`) → public portal (`LabPortal.tsx` at `/lab-portal`) → face match → lab report
3. Help Icons (?/!) integration (`InfoProposalIcons` + `help-dictionary`)
4. Final verification of all checks

### Locales

| Check                     | Result |
| ------------------------- | ------ |
| `add-lab-partner-locales.mjs` | ✅ `ALL 33 LOCALES VALID` |
| `add-help-locales.mjs` (rewritten) | ✅ `ALL 33 LOCALES VALID` |

### Test Suite

| Suite                        | Tests  | Passed | Failed | Status  |
| ---------------------------- | ------ | ------ | ------ | ------- |
| std-parser                   | 70     | 70     | 0      | ✅ PASS |
| photo-access                 | 14     | 14     | 0      | ✅ PASS |
| lab-report                   | 10     | 10     | 0      | ✅ PASS |
| lab-preference               | 9      | 9      | 0      | ✅ PASS |
| looking-for                  | 5      | 5      | 0      | ✅ PASS |
| dna-* / other suites         | 73     | 73     | 0      | ✅ PASS |
| **Total (17 files)**         | **181**| **181**| **0**  | **100% PASS** |

### Static Checks

| Check                   | Status |
| ----------------------- | ------ |
| `npx tsc --noEmit`      | ✅ CLEAN |
| `npx prettier --write` (14 changed files) | ✅ CLEAN |
| Prisma generate         | ✅ OK |

### Notes

- `face-verification.ts` has top-level `await import("@mediapipe/tasks-vision")` → **must not** be imported in Node server; `apiServer.ts` uses its own local `cosineSimilarity` + `FACE_SIMILARITY_THRESHOLD = 0.75`.
- Lab never receives profile name/photo — only `{matched, similarity}` + `reportId`; QR encodes only `userId` (`evolve://lab-patient/<userId>`).
- Lint still ❌ FAILs — pre-existing ESLint config issue (documented in AGENTS.md Known Issues).

---

## Sisyphus — Lab Portal Camera Fix (2026-09-12)

### Bug

Camera on `/lab-portal` could never start. `handleStartScan` called `setScanning(true)` and then synchronously constructed `new Html5Qrcode("lab-qr-reader")` — but the `#lab-qr-reader` div only mounts after React re-renders (scanning === true), so `Html5Qrcode`'s constructor threw `HTML Element with id=lab-qr-reader not found`. The user only ever saw the generic "Could not start the camera" error. "New patient" seemed broken because `resetSession` did not stop the scanner nor reset `scanning`.

### Fix (`apps/web/src/pages/LabPortal.tsx`)

- Scanner now starts in a `useEffect([scanning])` — after the div is mounted.
- `handleStartScan` only sets state; extracted shared `stopScanner()`.
- `resetSession` now stops the scanner and clears `scanning` → "New patient" works.
- Camera fallback: `environment` → `user` facingMode (laptop webcams).
- Distinct error messages: `labPortal.scan.noPermission` (NotAllowedError), `labPortal.scan.noCamera` (NotFoundError), generic `startFailed` otherwise — added to all 33 locales via `add-lab-partner-locales.mjs`.

### Verification (Playwright, real browser)

| Check | Result |
| ----- | ------ |
| Camera start → video element created (no `element not found`) | ✅ |
| Stop camera → back to "Start camera", clean state | ✅ |
| "New patient" → resets scanner + state | ✅ |
| Locales script | ✅ `ALL 33 LOCALES VALID` |
| `npx tsc --noEmit` | ✅ clean |
| `prettier --write` (LabPortal.tsx, locales script) | ✅ unchanged |
