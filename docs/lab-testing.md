# Lab Testing Flow (DAO-oriented "date-to-lab")

This doc covers the provider-agnostic lab STD/DNA testing flow and the
`testingPreference` profile field. It is **deliberately DAO-oriented**: there is
no single central inbox — each user gets a **unique per-user lab email** so a
report arriving at that address is deterministically routed to its owner.

## Routing model

- Unique lab email: `lola+<userId>@evolve.eth`
  - local part `lola`, `+` alias = routing key, domain `evolve.eth`
  - helpers in `apps/web/src/lib/lab-report.ts`:
    `generateLabEmail(userId)` / `parseUserIdFromLabEmail(email)`
- Provider-agnostic: any mail provider (IMAP/Gmail/Mailgun) or API can map the
  `+alias` back to a user and forward the raw report text to
  `POST /api/lab/report`.

## Implemented (2026-09)

### Pure helpers + tests (PASS)

| File                                 | Exports                                                                                                        | Tests   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------- |
| `apps/web/src/lib/lab-report.ts`     | `generateLabEmail`, `parseUserIdFromLabEmail`, `SUPPORTED_REPORT_TYPES`, `LabReport`, `ingestLabReport`        | 10 PASS |
| `apps/web/src/lib/lab-preference.ts` | `TESTING_PREFERENCE_OPTIONS=["lab","portable","both","none"]`, `TestingPreference`, `matchesTestingPreference` | 9 PASS  |
| `apps/web/src/lib/looking-for.ts`    | `LOOKING_FOR_OPTIONS`, `matchesLookingFor`                                                                     | 5 PASS  |

- `ingestLabReport` parses free-text STD results with the existing
  `parseStdTestResult` (std-parser) and returns a pending `LabReport`.
- `matchesTestingPreference`: unset filter → match all; profile `none` → match
  any; otherwise exact match.

### Backend (apiServer.ts + db.ts)

- `GET  /api/lab/email?userId=` — resolves the lab email for a user (session + ownership scoped).
- `GET  /api/lab/pending?userId=` — pending lab reports for the session user.
- `POST /api/lab/accept` `{ reportId, accept }` — accept attaches a verified
  STD document + sets `verifiedStd:true` on the profile (feeds STD compatibility);
  reject marks the report rejected.
- `POST /api/lab/report` `{ to, rawText }` — provider-agnostic ingestion; parses
  `to` (lab email) → resolves user → stores a pending `LabReport` via
  `ingestLabReport`.
- `db.ts`: `labReports: []` seed key, `getLabReports` / `createLabReport` /
  `updateLabReportStatus`, and varied `testingPreference` on the 8 seed profiles.

### UI

- **Home.tsx** — "Testing preference" filter (`SelectFilter`) wired through
  `matchesTestingPreference` in `filteredProfiles`, alongside the restored
  `skinColor` / `lookingFor` filters.
- **Profile.tsx** — "Testing preference" editors (gender / looking for / skin
  color / testing preference) persist into `searchDetails`; a **Lab testing**
  panel shows the unique lab email and lets the user accept/reject pending
  reports.
- **AppContext.tsx** — `testingPreference` added to `SearchDetails`, `FilterState`,
  `ProfilePatch`, the `filters`/`setFilters` types, `myProfile`, `refreshData`,
  and `persistProfile` (serialized into `searchDetails` JSON).

### i18n

- `scripts/add-lab-locales.mjs` — deterministic, deep-merge, idempotent.
  Keys: `filters.testingPreference`, `filters.testingPreferences.{lab,portable,both,none}`,
  `profile.edit.testingPreference`, `profile.lab.*`. Validates **ALL 33 LOCALES VALID**.

## Deferred (NOT implemented — intentional for a later milestone)

1. **`LabRegistry.sol` / `TestCertification.sol` contracts** — on-chain registry
   of per-user lab email → wallet and certified test results. Out of scope here;
   the current flow persists reports in the local DB only.
2. **Real mail provider adapter** — an actual IMAP/Gmail/Mailgun service that
   polls `lola+*@evolve.eth` and calls `POST /api/lab/report`. The
   provider-agnostic contract is defined; no concrete mailbox is provisioned.
3. **Email verification / HMAC signing** of the source email — reports are
   trusted from whatever calls `POST /api/lab/report` (dev posture).
4. **On-chain verified result attestations** surfaced in the profile (would use
   the deferred contracts above).

## Verification commands

```bash
cd apps/web
npx tsc --noEmit            # clean (ignore pre-existing db.ts:270 / mediapipe)
npx vitest run src/lib/__tests__/lab-report.test.ts src/lib/__tests__/lab-preference.test.ts src/lib/std-parser.test.ts src/lib/__tests__/looking-for.test.ts
```
