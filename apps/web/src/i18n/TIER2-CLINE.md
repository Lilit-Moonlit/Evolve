# Tier-2 Locale Updates Report (Cline)

## Overview

Updated 7 Tier-2 locale files with missing keys from the English baseline. These locales were not covered by Devin's batch.

## Updated Files

- `apps/web/src/i18n/locales/lt.json` (Lithuanian)
- `apps/web/src/i18n/locales/lv.json` (Latvian)
- `apps/web/src/i18n/locales/ne.json` (Nepali)
- `apps/web/src/i18n/locales/ro.json` (Romanian)
- `apps/web/src/i18n/locales/sk.json` (Slovak)
- `apps/web/src/i18n/locales/sl.json` (Slovenian)
- `apps/web/src/i18n/locales/vi.json` (Vietnamese)

## Keys Added Per Locale

| Key                                   | English                                                        | Purpose           |
| ------------------------------------- | -------------------------------------------------------------- | ----------------- |
| `chat.hiddenProfile`                  | "Hidden profile"                                               | Privacy indicator |
| `chat.hiddenContent`                  | "This profile is hidden by the user. Rating is still visible." | Privacy notice    |
| `settings.hideProfileFromLowerLevels` | "Hide profile from lower levels (content & photos)"            | Privacy setting   |
| `settings.privacy`                    | "Privacy"                                                      | Settings label    |
| `auth.landing.wallet`                 | "💳 Sign in with Wallet"                                       | Auth button       |

## Translation Rules

- Technical terms (CFC, EVOLVE, Web3, P2P, Ethereum, RainbowKit, STD, DNA) remain unchanged
- Mode names (Dating, Conception, Postcopulation) translated
- Statuses (Verified, Uploaded, Pending) translated
- UI elements (Settings, Profile, Chat) translated
- JSON structure preserved with 2-space indentation
- Privacy-related strings fully translated for each locale

## Status

✅ PASS - All 7 Tier-2 locale files updated with 5 missing keys each
