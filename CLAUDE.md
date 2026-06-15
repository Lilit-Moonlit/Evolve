# Evolve Project — Claude Code Rules

> This file provides Claude Code-specific instructions. Universal rules are in AGENTS.md.

## Session Behavior

- Always read `AGENTS.md` at project root for universal rules
- Use `t()` for all user-facing strings — never hardcode text
- Run `npx prettier --write` on changed files before finishing
- Run `npx tsc --noEmit` to verify compilation (ignore `db.ts:270`)

## Code Patterns

- **ProtectedRoute**: Only extend, never break existing auth logic
- **Localization**: When adding keys to ONE locale, add to ALL 33 locales
- **Imports**: Use `@evolve/*` workspace aliases
- **Port**: Dev server runs on 3000 (not 5173)

## Architecture

- Monorepo: `apps/*` + `packages/*`
- Web: Vite + React (`apps/web`)
- Mobile: Expo + React Native (`apps/mobile`)
- Auth is decoupled from mode selection

## Test Commands

```bash
cd apps/web && npm test          # Run tests
cd apps/web && npm run build     # Build
npx prettier --write "file.ts"   # Format
npx tsc --noEmit                 # Type-check
```
