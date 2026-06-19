# Cline — Tier‑2 Locale Update Report

## Overview

Updated **7 Tier‑2 locale files** with English text and local-language descriptions for all missing keys.

## Updated Files

| #   | Locale              | File                                | Status     |
| --- | ------------------- | ----------------------------------- | ---------- |
| 1   | **lt** (Lithuanian) | `apps/web/src/i18n/locales/lt.json` | ✅ Updated |
| 2   | **lv** (Latvian)    | `apps/web/src/i18n/locales/lv.json` | ✅ Updated |
| 3   | **ne** (Nepali)     | `apps/web/src/i18n/locales/ne.json` | ✅ Updated |
| 4   | **ro** (Romanian)   | `apps/web/src/i18n/locales/ro.json` | ✅ Updated |
| 5   | **sk** (Slovak)     | `apps/web/src/i18n/locales/sk.json` | ✅ Updated |
| 6   | **sl** (Slovenian)  | `apps/web/src/i18n/locales/sl.json` | ✅ Updated |
| 7   | **vi** (Vietnamese) | `apps/web/src/i18n/locales/vi.json` | ✅ Updated |

## Translation Rules Applied

- **Technical terms** (e.g., "EVM", "libp2p", "IPFS", "Arweave", "Lit Protocol", "ERC-20", "ERC-721", "ERC-4337", "SIWE", "STD", "DNA", "EVOLVE") — left in English.
- **Brand/product names** (e.g., "Evolve", "RainbowKit", "WalletConnect", "MetaMask") — left in English.
- **User-facing UI strings** — English text with local-language description in parentheses.
- **Placeholders** (`{name}`, `{amount}`, `{count}`, etc.) — preserved as-is.
- **Consistency** — same English source text used across all 7 locales for identical keys.

## Status

✅ **PASS** — All 7 Tier‑2 locale files updated and verified.
