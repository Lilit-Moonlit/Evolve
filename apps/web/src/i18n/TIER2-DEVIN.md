# Tier-2 Locale Updates Report

## Overview

Updated 15 Tier-2 locale files with missing keys from the English baseline.

## Updated Files

- `apps/web/src/i18n/locales/bg.json` (Bulgarian)
- `apps/web/src/i18n/locales/cs.json` (Czech)
- `apps/web/src/i18n/locales/el.json` (Greek)
- `apps/web/src/i18n/locales/et.json` (Estonian)
- `apps/web/src/i18n/locales/fi.json` (Finnish)
- `apps/web/src/i18n/locales/fil.json` (Filipino)
- `apps/web/src/i18n/locales/he.json` (Hebrew)
- `apps/web/src/i18n/locales/hr.json` (Croatian)
- `apps/web/src/i18n/locales/hu.json` (Hungarian)
- `apps/web/src/i18n/locales/is.json` (Icelandic)
- `apps/web/src/i18n/locales/it.json` (Italian)
- `apps/web/src/i18n/locales/lt.json` (Lithuanian)
- `apps/web/src/i18n/locales/lv.json` (Latvian)
- `apps/web/src/i18n/locales/nl.json` (Dutch)
- `apps/web/src/i18n/locales/pl.json` (Polish)

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

## Translation Rules

- Technical terms (CFC, EVOLVE, Web3, P2P, Ethereum, RainbowKit, STD, DNA) remain unchanged
- Mode names (Dating, Conception, Postcopulation) translated
- Statuses (Verified, Uploaded, Pending) translated
- UI elements (Settings, Profile, Chat) translated
- JSON structure preserved with 2-space indentation

## Status

✅ PASS - All 15 Tier-2 locale files updated with missing keys
