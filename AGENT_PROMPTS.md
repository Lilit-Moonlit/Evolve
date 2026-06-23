# AGENT_PROMPTS.md — Mobile Integration Tasks

Unique task IDs: `ANTI-1`, `ANTI-2`, `DEVIN-1`, `DEVIN-2`, `DEVIN-3`, `CLINE-1`, `CLINE-2`, `CLINE-3`, `BE-OTP-IMPLEMENT`, `LINT-RUN`

---

| ID               | Owner       | Deliverable                      | Status  | Link                                                                      |
| ---------------- | ----------- | -------------------------------- | ------- | ------------------------------------------------------------------------- |
| ANTI-1           | Antigravity | apps/mobile/CODE-REVIEW.md       | ✅ DONE | [CODE-REVIEW.md](file:///c:/CFC/apps/mobile/CODE-REVIEW.md)               |
| ANTI-2           | Antigravity | apps/web/src/i18n/TIER1-AUDIT.md | ✅ DONE | [TIER1-AUDIT.md](file:///c:/CFC/apps/web/src/i18n/TIER1-AUDIT.md)         |
| DEVIN-1          | Devin       | Mobile i18n (t() updates)        | ✅ DONE | [Mobile-i18n.md](file:///c:/CFC/apps/mobile/Mobile-i18n.md)               |
| DEVIN-2          | Devin       | apps/mobile/lib/wagmi.tsx config | ✅ DONE | [Wagmi-config.md](file:///c:/CFC/apps/mobile/Wagmi-config.md)             |
| DEVIN-3          | Devin       | Tier‑2 locale updates (8 langs)  | ✅ DONE | [Tier2-locales-devin.md](file:///c:/CFC/apps/web/src/i18n/TIER2-DEVIN.md) |
| CLINE-1          | Cline       | Tier‑2 locale updates (7 langs)  | ✅ DONE | [Tier2-locales-cline.md](file:///c:/CFC/apps/web/src/i18n/TIER2-CLINE.md) |
| CLINE-2          | Cline       | apps/web/QA-REPORT.md            | ✅ DONE | [QA-REPORT.md](file:///c:/CFC/apps/web/QA-REPORT.md)                      |
| CLINE-3          | Cline       | README & docs/MOBILE_STATUS.md   | ✅ DONE | [Mobile-status.md](file:///c:/CFC/docs/MOBILE_STATUS.md)                  |
| BE-OTP-IMPLEMENT | OpenCode    | phoneAuth.ts + tests + docs      | ✅ DONE | [phoneAuth.ts](file:///c:/CFC/apps/web/src/lib/phoneAuth.ts)              |
| LINT-RUN         | OpenCode    | npm run lint → LINT-LOG.txt      | ✅ DONE | [LINT-LOG.txt](file:///c:/CFC/apps/web/LINT-LOG.txt)                      |
| FINAL‑QA         | Antigravity | AGENTS-QA-RESULTS.md             | ✅ DONE | [AGENTS‑QA‑RESULTS.md](file:///c:/CFC/AGENTS-QA-RESULTS.md)               |

## Antigravity (Auditor Only)

### ANTI-1: Code Review Mobile

```
You are a code auditor. Do NOT edit files — only report.

Review these files in apps/mobile/:
- store/AuthContext.tsx
- store/AppContext.tsx
- app/auth.tsx
- app/_layout.tsx
- app/index.tsx
- app/home.tsx
- app/chat.tsx
- app/profile.tsx
- app/settings.tsx

Check: TypeScript types, error handling, API calls, security, code style.

Create apps/mobile/CODE-REVIEW.md with:
- Issues (Critical/Warning/Info)
- File:line references
- APPROVED / CHANGES REQUESTED
```

### ANTI-2: Tier 1 Translation Audit

```
Audit 16 Tier 1 locale files in apps/web/src/i18n/locales/:
uk.json, de.json, fr.json, es.json, pt.json, ja.json, ko.json, zh.json,
ar.json, vi.json, hi.json, tr.json, th.json, id.json, ms.json, ru.json

For each: count keys, check quality, find issues.
Create apps/web/src/i18n/TIER1-AUDIT.md.

You MAY fix typos but NOT rewrite files.
```

---

## Devin (Mobile i18n + Translations)

### DEVIN-1: Mobile i18n Integration

```
Add t() translations to ALL mobile screens:
- app/home.tsx: "Find Your Match" → t("home.hero.title")
- app/chat.tsx: "Messages" → t("chat.title")
- app/profile.tsx: "Profile" → t("navigation.profile")
- app/settings.tsx: "Settings" → t("navigation.settings")
- app/auth.tsx: verify all keys work

Use useTranslation() from react-i18next.
Do NOT modify i18n/config.ts.
```

### DEVIN-2: Wallet Config Fix

```
Fix apps/mobile/lib/wagmi.tsx:
1. Change chain: mainnet → arbitrum (import from wagmi/chains)
2. Add TODO comment for WalletConnect project ID
3. Do NOT implement SIWE
```

### DEVIN-3: Tier 2 Translations (8 languages)

```
Update in apps/web/src/i18n/locales/:
bg.json, cs.json, el.json, et.json, he.json, hr.json, hu.json, is.json

For each: read en.json baseline, translate missing keys, write file.
Technical terms (CFC, EVOLVE, Web3, P2P) stay as-is.
```

---

## Cline (Web QA + Docs + Translations)

### CLINE-1: Tier 2 Translations (7 languages)

```
Update in apps/web/src/i18n/locales/:
lt.json, lv.json, ne.json, ro.json, sk.json, sl.json, vi.json

For each: read en.json baseline, translate missing keys, write file.
Technical terms stay as-is.
```

### CLINE-2: Web Regression QA

```
Run in apps/web/:
1. npm test
2. npm run build
3. npx tsc --noEmit

Create apps/web/QA-REPORT.md with results.
Do NOT fix failures — only report.
```

### CLINE-3: Documentation Update

```
1. Update README.md:
   - Add "Mobile App Status" section
   - Update "Translation Status"

2. Create docs/MOBILE_STATUS.md:
   - What works: Auth, API, State, Profile, Chat, Settings
   - What doesn't: Wallet, Real-time messaging, P2P
   - Next steps
```

---

## Execution Order

```
1. OpenCode commits mobile changes     ← DONE (5e61991)
2. Antigravity runs ANTI-1 + ANTI-2   ← Can start NOW
3. Devin runs DEVIN-1 + DEVIN-2        ← Can start NOW
4. Cline runs CLINE-1                  ← Can start NOW
5. Devin runs DEVIN-3                  ← After DEVIN-1
6. Cline runs CLINE-2 + CLINE-3        ← After CLINE-1
7. Antigravity final QA                ← After all finish
```

## Git Branches

| Agent       | Branch              |
| ----------- | ------------------- |
| OpenCode    | `agent/opencode`    |
| Antigravity | `agent/antigravity` |
| Devin       | `agent/devin`       |
| Cline       | `agent/cline`       |
