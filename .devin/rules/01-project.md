---
trigger: always_on
description: "Universal project rules for Evolve dating platform"
---

# Evolve Project Rules

## Working Directory

- Path: C:\EVOLVE
- NEVER: C:\Users\Surface\Desktop\EVOLVE

## Code Rules

- Never break ProtectedRoute — only extend existing logic
- All changes must pass prettier before committing
- Don't hardcode strings — use t() for all user-facing text

## Localization

- 33 locales in apps/web/src/i18n/locales/
- When adding keys to ONE locale, add to ALL 33
- Tier 1 (natural): uk, de, fr, es, pt, ja, ko, zh, ar, vi, hi, tr, th, id, ms, ru
- Tier 2 (English + local desc): all others

## Development

- Vite dev server: port 3000
- Prisma retry on startup is expected
- Pre-existing type error in db.ts:270 — ignore it

## Architecture

- Monorepo: apps/_ + packages/_
- Auth is decoupled from mode selection
- Phone auth uses API stubs
