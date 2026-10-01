# Evolve — Ban Resistance & Self-Hosting Guide

Evolve is designed to survive platform bans, app-store removal, domain
seizure, DNS blocking, and geo-blocking. This document is the operational
counterpart to the constitutional rules in `AGENTS.md` §23 — it explains
**how** to keep the app available when the stores or a single host are
compromised.

## 1. Threat model

| Threat                          | Counter-measure                                                         |
| ------------------------------- | ----------------------------------------------------------------------- |
| Google Play / App Store removal | PWA install from any web mirror (no store involved)                     |
| Domain seizure / DNS blocking   | No absolute domain in the build — it runs from any domain/IP            |
| Single-server takedown          | One-process server, trivially mirrorable to any VPS / CDN / static host |
| Geo-blocking                    | Self-host behind any reverse proxy; no vendor lock-in                   |
| Wallet/SSO vendor blocking      | Self-custodial SIWE is the escape hatch (never replaced)                |

## 2. Why the web version is the always-available channel

The production build is **domain-independent**:

- All API calls use **relative paths** (`/api/…`) on the same origin as the
  page — no hardcoded host.
- WebSocket chat uses `window.location.host` (`/ws`) — works on any origin.
- SIWE domain/URI are derived from `window.location` at runtime.
- Config is env-driven: `VITE_PRODUCT_MODE` (safety/full facade),
  `VITE_WALLETCONNECT_PROJECT_ID`, contract addresses via `VITE_*`/`addresses.ts`.

The web build is a **PWA**: `manifest.json` + `sw.js` + icons, all referenced
by relative paths. A persistent floating **"Install"** button
(`PwaInstallPrompt`) appears on any origin and installs the app to the home
screen — Chromium via `beforeinstallprompt`, iOS via "Add to Home Screen".
This is the store-independent install path.

## 3. Self-hosting / mirroring

The app ships as a **single Node process** that serves the SPA, the API, and
the WebSocket on the same port (`apps/web/src/server/prod-server.ts`).

```bash
cd apps/web
npm run build                 # outputs dist/
PORT=3000 npm run serve       # binds 0.0.0.0, works behind any proxy
```

Deploy the process (or the static `dist/` + the Node API) to **any** of:

- A VPS / container (`docker`, `systemd`, `pm2`) behind nginx/Caddy/Traefik.
- Any PaaS (Fly, Render, Railway, etc.) — set `PORT`, `DATABASE_URL` optional.
- IPFS/Arweave for the **static assets** (`dist/` + `public/`) — note the API
  and WebSocket still require the Node process (see §5).

The app has **no single-domain dependency**: the same build works from
`https://mirror-1.example`, `https://mirror-2.onion`, an IP, or a local network
address with zero code changes.

## 4. Install without the stores

1. Open any mirror in the browser.
2. Tap the floating download button (bottom-right):
   - **Android/Chrome/Edge** → "Install".
   - **iOS Safari** → Share → "Add to Home Screen".
3. The installed PWA launches full-screen and behaves like a native app.

The service worker precaches the app shell, so an already-installed copy keeps
opening even if the origin later becomes unreachable (offline shell).

## 5. Remaining hardening (roadmap)

These are architectural, tracked in `packages/p2p` + `packages/storage`:

- **P2P-first messaging**: chat currently uses the `/ws` API fallback; the
  libp2p gossipsub + Nostr path in `packages/p2p` must be wired as the default
  so messaging survives API takedown.
- **Decentralized content**: user content (photos, documents) should be
  written to IPFS/Arweave first, with the server copy as a mirror only.
- **Static full-mirror**: serving the entire app (including data layer) from
  IPFS requires moving the API to an external/decentralized backend.

Until then, the _distribution_ and _access_ layers are already ban-resistant:
any mirror + PWA install keeps the app downloadable and usable without the
stores.

## 6. Checklist for a new mirror

- [ ] `cd apps/web && npm run build`
- [ ] Serve `dist/` + the Node API (`npm run serve`) behind any reverse proxy.
- [ ] Set `VITE_PRODUCT_MODE` and `VITE_WALLETCONNECT_PROJECT_ID` at build time.
- [ ] Confirm `manifest.json`, `sw.js`, and icons resolve via relative paths.
- [ ] Verify `/api/health` returns 200 and the install button appears.
