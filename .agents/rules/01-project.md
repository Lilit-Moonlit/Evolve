---
trigger: always_on
description: "Universal project rules for Evolve dating platform"
---

# Evolve Project Rules

## Working Directory

- Path: C:\CFC
- NEVER: C:\Users\Surface\Desktop\CFC

## Code Rules

- Never break ProtectedRoute — only extend existing logic
- All changes must pass prettier before committing
- Don't hardcode strings — use t() for all user-facing text
- Verify compilation: run npx tsc --noEmit after changes (ignore db.ts:270)

## Localization

- 33 locales total in apps/web/src/i18n/locales/
- When adding translation keys to ONE locale, add to ALL 33 locales
- Tier 1 (natural): uk, de, fr, es, pt, ja, ko, zh, ar, vi, hi, tr, th, id, ms, ru
- Tier 2 (English + local desc): all others

## Development

- Vite dev server: port 3000 (NOT default 5173)
- Prisma connection retry on startup is expected
- Pre-existing type error in db.ts:270 — ignore it

## Architecture

- Monorepo: apps/_ + packages/_
- Packages: contracts, core, matching, p2p, storage, ui
- Auth is decoupled from mode selection
- Phone auth uses API stubs (no real OTP yet)
