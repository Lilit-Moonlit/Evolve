# Agent Prompts for Evolve Mobile Integration

## AGENT 1: Antigravity — Auditor Only

### Task 1: Code Review of Mobile Changes

```
You are a code auditor for the Evolve project. Your ONLY job is to review code, NOT to write or edit files.

Review the following files that were recently created/modified in apps/mobile/:

1. store/AuthContext.tsx — Auth state and API integration
2. store/AppContext.tsx — App data state and API integration
3. app/auth.tsx — Auth screen (email + phone)
4. app/_layout.tsx — Root layout with providers
5. app/index.tsx — Entry point with auth check
6. app/home.tsx — Home screen with real data
7. app/chat.tsx — Chat screen with real data
8. app/profile.tsx — Profile screen with real data
9. app/settings.tsx — Settings screen

For each file, check:
- TypeScript types are correct
- Error handling is proper
- API calls match the backend (apiServer.ts)
- No hardcoded values that should be configurable
- Security: no secrets logged, proper session handling
- Code style matches existing patterns

Create a code review report at apps/mobile/CODE-REVIEW.md with:
- List of issues found (Critical, Warning, Info)
- Specific file:line references
- Recommendations for fixes
- Overall assessment: APPROVED / CHANGES REQUESTED

Do NOT edit any files. Only report findings.
```

### Task 2: Translation Audit (Tier 1)

```
You are a translation auditor for the Evolve project. Your job is to verify quality of Tier 1 translations.

Audit these 16 locale files in apps/web/src/i18n/locales/:
uk.json, de.json, fr.json, es.json, pt.json, ja.json, ko.json, zh.json, ar.json, vi.json, hi.json, tr.json, th.json, id.json, ms.json, ru.json

For each file:
1. Read the file
2. Count total keys (should be ~140)
3. Check if keys are translated (not just English copy-paste)
4. Find natural vs unnatural translations
5. Find missing or incorrect translations

Create a report at apps/web/src/i18n/TIER1-AUDIT.md with:
- For each language: key count, quality score (1-10), issues found
- List of specific keys that need fixing
- Overall assessment

You MAY fix obvious typos or errors in translations, but do NOT rewrite entire files.
```

---

## AGENT 2: Devin — Mobile i18n + Translations

### Task 1: Mobile i18n Integration

```
Add i18n (internationalization) to the mobile app screens.

Current state:
- apps/mobile/i18n/config.ts exists with i18next setup
- 33 locale JSON files exist in apps/mobile/i18n/locales/
- None of the screens currently use t() translation function

Your task:
1. Update ALL screens to use useTranslation() hook from react-i18next:
   - app/home.tsx: replace "Find Your Match" → t("home.hero.title")
   - app/chat.tsx: replace "Messages" → t("chat.title")
   - app/profile.tsx: replace "Profile" → t("navigation.profile")
   - app/settings.tsx: replace "Settings" → t("navigation.settings")
   - app/auth.tsx: already uses t() — verify all keys work

2. Verify locale files have the required keys by checking en.json

3. Do NOT modify i18n/config.ts — it's already correct

Use the Edit tool to make changes. Preserve existing code style.
```

### Task 2: Wallet Config Fix

```
Fix the wallet configuration in apps/mobile/lib/wagmi.tsx.

Current issues:
1. Uses Ethereum Mainnet (should be Arbitrum for L2)
2. Has placeholder WalletConnect project ID: "YOUR_WALLETCONNECT_PROJECT_ID"
3. No SIWE (Sign-In with Ethereum) implementation

Your task:
1. Read the current wagmi.tsx file
2. Update to use Arbitrum chain (import from wagmi/chains)
3. Add a TODO comment for the WalletConnect project ID
4. Do NOT implement SIWE yet (complex, needs separate task)

Use the Edit tool to make changes.
```

### Task 3: Tier 2 Translations (8 languages)

```
Update translations for 8 Tier 2 languages in apps/web/src/i18n/locales/.

Languages: bg.json, cs.json, el.json, et.json, he.json, hr.json, hu.json, is.json

For each file:
1. Read en.json as baseline (reference)
2. Read the target locale file
3. Find keys where value = English text (these need translation)
4. Translate each key to the target language naturally
5. Write the updated file

Translation rules:
- Technical terms (CFC, EVOLVE, Web3, P2P) stay as-is
- Mode names (Dating, Conception, Postcopulation) translate naturally
- Status terms (Verified, Uploaded, Pending) translate
- UI elements (Settings, Profile, Chat) translate

Use the Write tool for each file. Work through them one by one.
```

---

## AGENT 3: Cline — Web QA + Documentation + Translations

### Task 1: Tier 2 Translations (7 languages)

```
Update translations for 7 Tier 2 languages in apps/web/src/i18n/locales/.

Languages: lt.json, lv.json, ne.json, ro.json, sk.json, sl.json, vi.json

For each file:
1. Read en.json as baseline (reference)
2. Read the target locale file
3. Find keys where value = English text (these need translation)
4. Translate each key to the target language naturally
5. Write the updated file

Translation rules:
- Technical terms (CFC, EVOLVE, Web3, P2P) stay as-is
- Mode names translate naturally
- Status terms translate
- UI elements translate

Use the Write tool for each file. Work through them one by one.
```

### Task 2: Web Regression Testing

```
Run regression tests on the web app to ensure nothing is broken.

1. Run tests:
   cd apps/web && npm test

2. Run build:
   cd apps/web && npm run build

3. Run type-check:
   npx tsc --noEmit

Document results in apps/web/QA-REPORT.md:
- Test results (pass/fail counts)
- Build success/failure
- Type errors found
- Any issues discovered

If there are failures, investigate but do NOT fix them — just report.
```

### Task 3: Documentation Update

```
Update project documentation to reflect current state.

Files to update:

1. README.md:
   - Add "Mobile App Status" section:
     * Auth: Email + Phone implemented
     * API integration: Complete
     * State management: React Context
     * i18n: In progress (Devin working on it)
   - Update "Translation Status":
     * Tier 1: 16 languages, ~78% complete
     * Tier 2: 15 languages, ~28% complete (being updated)

2. docs/MOBILE_STATUS.md (create new):
   - Current mobile app status
   - What works: Auth, API, State, Profile, Chat, Settings
   - What doesn't: Wallet (placeholder), Real-time messaging, P2P
   - Next steps

Use the Edit tool for existing files, Write tool for new files.
```

---

## Execution Notes

### Dependencies

- Antigravity starts AFTER OpenCode commits mobile changes
- Devin starts AFTER OpenCode commits mobile changes
- Cline starts AFTER Devin finishes i18n work
- Antigravity final QA starts AFTER all agents finish

### Git Workflow

- OpenCode commits to branch `agent/opencode`
- Devin commits to branch `agent/devin`
- Cline commits to branch `agent/cline`
- Antigravity does NOT commit — only reports

### Communication

- Each agent should check git status before starting
- If merge conflicts occur, escalate to user
- Each agent should commit their work when done
