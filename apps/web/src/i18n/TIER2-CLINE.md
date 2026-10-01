# Cline — Tier‑2 Locale Update Report

## Overview

Updated **8 Tier‑2 locale files** with English text and local-language descriptions for all missing keys.

## Updated Files

| #   | Locale                    | File                                | Status     |
| --- | ------------------------- | ----------------------------------- | ---------- |
| 1   | **nb** (Norwegian Bokmål) | `apps/web/src/i18n/locales/nb.json` | ✅ Updated |
| 2   | **ne** (Nepali)           | `apps/web/src/i18n/locales/ne.json` | ✅ Updated |
| 3   | **ro** (Romanian)         | `apps/web/src/i18n/locales/ro.json` | ✅ Updated |
| 4   | **sk** (Slovak)           | `apps/web/src/i18n/locales/sk.json` | ✅ Updated |
| 5   | **sl** (Slovenian)        | `apps/web/src/i18n/locales/sl.json` | ✅ Updated |
| 6   | **sv** (Swedish)          | `apps/web/src/i18n/locales/sv.json` | ✅ Updated |
| 7   | **sw** (Swahili)          | `apps/web/src/i18n/locales/sw.json` | ✅ Updated |
| 8   | **vi** (Vietnamese)       | `apps/web/src/i18n/locales/vi.json` | ✅ Updated |

## New Keys Added

### Auth Recovery (`auth.recovery.*`)

- `title`: Account Recovery
- `description`: Recover access to your account via social guarantees
- `email.*`: Recovery via Email (title, description, email, sendCode, codeSent, verify, codePlaceholder)
- `phone.*`: Recovery via Phone (title, description, phone, phonePlaceholder, sendCode, codeSent, verify, codePlaceholder)

### Filters/Modes (`home.filters.mode*`)

- `mode`: Mode
- `modeNormal`: Dating
- `modePregnancyBond`: Conception
- `modeCrypticChoice`: Postcopulation
- `validation.modeRequired`: Select a mode to continue
- `validation.walletRequired`: This mode requires a wallet
- `validation.emailRequired`: This mode requires email or phone

### DNA Frontend (`dna.*`)

- `title`: DNA Verification
- `description`: Upload and verify your DNA tests for increased trust
- `upload.*`: Upload DNA Test (title, description, selectFile, fileSelected, uploading, success, error)
- `profile.*`: DNA Profile (title, description, verified, notVerified, pending, viewReport, downloadReport)

## Translation Rules Applied

- **Technical terms** (e.g., "EVM", "libp2p", "IPFS", "Arweave", "Lit Protocol", "ERC-20", "ERC-721", "ERC-4337", "SIWE", "STD", "DNA", "EVOLVE") — left in English.
- **Brand/product names** (e.g., "Evolve", "RainbowKit", "WalletConnect", "MetaMask") — left in English.
- **User-facing UI strings** — English text with local-language description in parentheses.
- **Placeholders** (`{name}`, `{amount}`, `{count}`, etc.) — preserved as-is.
- **Consistency** — same English source text used across all 8 locales for identical keys.

## Status

✅ **PASS** — All 8 Tier‑2 locale files updated and verified.
