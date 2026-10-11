# EVOLVE Nostr City Relay (in-repo, local dev)

A minimal in-repo Node.js Nostr relay for EVOLVE's city-scoped local chat («Місцевий чат»), serving the web client transport in [`apps/web/src/lib/local-chat-nostr.ts`](../../../../apps/web/src/lib/local-chat-nostr.ts).

## Why in-repo (and why so minimal)

- **Docker is not available** on the current dev machine, so the reference `nostr-rs-relay` setup ([`../docker-compose.yml`](../docker-compose.yml), [`../config.toml`](../config.toml)) cannot be run locally.
- The EVOLVE client implements NIP-29 group logic **client-side**: `local-chat-nostr.ts` tracks admins/members/pending joins (`ingestGroupEvent` / `resolveJoin`) and enforces group access itself. The relay therefore only needs to be a **dumb NIP-01 store**: accept `EVENT`, store it, answer `REQ` with matching events, and push new events to active subscriptions.
- **No new npm dependencies** — only `ws`, already a dependency of `@evolve/p2p`.

## Run

```bash
cd packages/p2p
npm run relay:nostr             # ws://localhost:7000 (binds 0.0.0.0)
PORT=7001 npm run relay:nostr   # custom port via env
```

Point the web client at it (apps/web `.env`):

```
VITE_NOSTR_CITY_RELAY_URL=ws://localhost:7000
```

## NIP-01 subset implemented

| Client → relay                 | Behavior                                                                                                                                                                                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `["EVENT", event]`             | Shape-validated, stored (deduped by `id`), reply `["OK", id, true, ""]`; already-stored ids get `["OK", id, true, "duplicate: ..."]` and are **not** re-broadcast; then broadcast to all active matching subscriptions                                |
| `["REQ", subId, filter, ...]`  | For each stored event matching **any** filter: `["EVENT", subId, event]` — deduped by id across filters, ascending `created_at`, each filter's `limit` applied to that filter — then `["EOSE", subId]`. The subscription stays active for live events |
| `["CLOSE", subId]`             | Removes the subscription (stops live delivery)                                                                                                                                                                                                        |
| anything else / malformed JSON | `["NOTICE", ...]` / logged and ignored — never crashes                                                                                                                                                                                                |

Filter fields: `kinds`, `authors`, `ids`, `limit`, `since` (`created_at > since`), `until` (`created_at <= until`), and `#<tag-name>` arrays — **any** tag name, not just single letters (NIP-01 only defines single-letter tags; this relay generalizes): `#t` (city key `Country::City`), `#d`/`#g`/`#h` (group id), `#about` (city key on group metadata), `#p`, `#e`.

Kinds are **not** validated or interpreted — the relay stores and matches whatever the client sends. For reference, EVOLVE uses kind `1` (city-tagged messages) and NIP-29 kinds `9000`/`9001`/`9002`/`9005`/`9007`/`9021`/`9022` plus `39000`/`39001`/`39002` (group metadata/admins/members).

## Limitations — READ THIS

- **LOCAL-DEV REFERENCE ONLY.** Production city relays should run a full Nostr relay (`nostr-rs-relay` with `nip29=true`) operated by a volunteer per [`docs/DECENTRALIZED-SCALING.md`](../../../../docs/DECENTRALIZED-SCALING.md).
- **No server-side NIP-29 moderation (production gap):** any client that connects can store any event. Closed-group access control, admin approval and member removal are enforced only by the EVOLVE client; a malicious client can bypass them against this relay.
- **No persistence:** events live in an in-memory `Map` (id → event, insertion-ordered) and are lost on restart. Beyond 100 000 stored events the oldest are evicted.
- **No signature or id-format verification:** `sig` is stored as sent, never checked.

## Files

- `relay.ts` — relay implementation (`NostrCityRelay` + pure `parseEvent`/`parseFilter`/`eventMatchesFilter` helpers)
- `run.ts` — entrypoint (`PORT` env, default 7000, binds `0.0.0.0`, SIGINT/SIGTERM shutdown)
- `tsconfig.json` — standalone typecheck project: the package `tsconfig.json` only includes `src/**/*`, so the relay files are checked with `npx tsc --noEmit -p relay/nostr/tsconfig.json`
