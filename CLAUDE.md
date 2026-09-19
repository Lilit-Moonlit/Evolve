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

## Ban Resistance (see AGENTS.md §23)

- SIWE/MetaMask login is the escape hatch — never replace with email/phone-only auth, extend it
- Chat must work P2P-first (libp2p + Nostr); HTTP fallback is a convenience, not a dependency
- User content: IPFS/Arweave first; server copies are mirrors
- Keep multi-network configs; no single RPC/chain dependency
- No hardcoded production domain — builds must run from any domain/IP (env-driven)
- Individual STD/DNA status is never centralized — only anonymous verdicts
- Safety Mode (`VITE_PRODUCT_MODE=safety`) must keep working; never break it while adding dating features
- No mandatory KYC/phone/email gate for login, recovery, or core usage

## Test Commands

```bash
cd apps/web && npm test          # Run tests
cd apps/web && npm run build     # Build
npx prettier --write "file.ts"   # Format
npx tsc --noEmit                 # Type-check
```
