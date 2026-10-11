# EVOLVE — Decentralized Scaling Strategy

> **Status: canonical plan. Every agent MUST read this before adding features
> that move, store, or index user data.** It is the binding complement to
> `AGENTS.md` §23 (Ban Resistance) and is cross-referenced from the roadmap.

## 1. The one principle

**EVOLVE is a protocol, not a service.** "Free at 1,000,000 concurrent users"
is not achieved by finding a cheap server — it is achieved by **not having a
server to scale, and therefore nothing to pay for.** The protocol is
open-source and static (anyone can run it, cost is zero). Serving is pushed to
the edges of the network — to resources users already own and already
voluntarily provide. This is the proven model of BitTorrent, Nostr, Tor and
Matrix: none of them pays a central company for traffic, and none of them pays
volunteer nodes with a token.

## 2. Why EVOLVE is naturally cheap

Two product properties we already have are, by accident, free load-balancing:

- **Geography is the sharding key.** "1M users" never means "1M in one place" —
  it is 1M spread across thousands of cities. A single city-scoped relay serves
  hundreds–thousands of connections, not a million. One relay per city is a
  **human-scale** commitment — like running a Mastodon instance or a community
  forum. The local chat (`AGENTS.md` §30) already encodes this shape.
- **Privacy reduces infrastructure.** Individual pathogen status is never
  shared (only anonymous verdicts) and photos are blurred until granted, so
  very little data actually crosses relays. Less data = less bandwidth = less
  cost. Privacy-by-default is also a cost-reduction strategy.

## 3. Who serves what (no token involved)

| Layer                 | Who runs it                                                     | Cost                             |
| --------------------- | --------------------------------------------------------------- | -------------------------------- |
| Profile / user data   | The user's own device (local-first, CRDT)                       | $0 (device already owned)        |
| 1:1 chat + media      | WebRTC data channel, phone-to-phone                             | $0 (never touches a relay)       |
| Local chat (city)     | A city-scoped Nostr relay (a volunteer, like an instance admin) | ~$5/mo, voluntary                |
| Discovery / filtering | The same city relay + on-device filtering                       | $0 (client computes)             |
| Permanent storage     | IPFS/Arweave, pinned by the **data owner**                      | cents, one-time (self-sovereign) |
| Core bootstrap        | A few donated always-on nodes + static hosting                  | $0 (donations)                   |

The Arweave pin is not "the platform pays" — it is **self-sovereign data: each
person pays for their own data**, like paying for their own hard drive. This is
the philosophical core of the project, not a compromise.

## 4. The token is NOT infrastructure payment

**Never pay node/relay operators in EVOLVE.** Tying hosting cost to a volatile
token price creates a "mining" economy and rent-seeking, and it couples the
token to infra cost. The clean split is:

- **EVOLVE = governance + stakes + the gift economy** (as `AGENTS.md` §7 states).
- **Infrastructure = free by design** (P2P/local/volunteer) + donations
  (`DONATE.md` already exists) for the tiny core.

The token's only legitimate "hard cost" role is **anti-spam / reputation /
local moderation** — the one cost P2P cannot eliminate — handled via governance
and reputation weight, not via paying for servers.

## 5. Target architecture per layer

| Layer      | Today (centralized)                   | Target (decentralized)                                                           |
| ---------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| Auth       | SIWE nonce via `apiServer`            | ✅ already self-custodial; no central user DB                                    |
| 1:1 chat   | HTTP `/api/messages` + `/ws` fallback | libp2p gossipsub + WebRTC (built in `packages/p2p`); HTTP stays as fallback only |
| Local chat | server DB + `join_local` WS (my code) | Nostr relays, one per city; groups via NIP-29                                    |
| Discovery  | central profile list                  | city relays + on-device filtering                                                |
| Storage    | base64 in profile                     | IPFS/Arweave + Lit, owner-pinned                                                 |
| Moderation | none                                  | reputation + blocklists + local moderation (governance)                          |

## 6. Chat design in detail

### 6.1 1:1 chat (direct messaging)

`packages/p2p` already ships the pieces — `chat-manager.ts` (libp2p gossipsub),
`direct-messaging.ts`, `nostr-client.ts`, `call-manager.ts` (WebRTC),
`chat-storage.ts`. **The work is wiring, not building:**

1. Make the React app (`AppContext`/`Chat.tsx`) use the libp2p/Nostr
   `ChatManager` as the **default** transport.
2. Keep HTTP `/api/messages` as a **fallback mirror only** (Ban Resistance
   §23 rule 2: chat must survive API takedown).
3. Media (photos) move over a WebRTC data channel so large payloads never touch
   a relay.

### 6.2 Local chat → Nostr relays (the "Місцевий чат" migration)

The current server model maps one-to-one onto Nostr primitives:

| Current (server)      | Nostr equivalent                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Message row           | kind-1 event, `t` tag = city key, `d`/`g` tag = group id                                             |
| City scoping          | a dedicated relay per city (published via a kind-10002 relay list), or `#c` filter on a shared relay |
| 4 default groups      | implicit topics (no stored group record)                                                             |
| Custom public group   | NIP-28 public channel / NIP-29 public group                                                          |
| Custom closed group   | NIP-29 group with join requests; admin = group creator                                               |
| Admin join-approval   | NIP-29 membership events                                                                             |
| Private group content | NIP-44 encrypted group messages                                                                      |

The city relay is the unit of volunteering: **one person per city runs a relay**
exactly as they would run a local Mastodon instance. This is the load-balancing
that makes 1M users free: no single relay ever sees 1M users.

## 7. Migration phases (ordered)

1. **Wire the existing P2P chat** as the default transport (largest win, least
   new work — the code already exists).
2. **Local chat → Nostr relays** per city (migrate my `join_local` server model;
   ship a reference relay config so anyone can run a city relay).
3. **Local-first profiles** (CRDT) + on-device filtering against the city relay.
4. **Self-sovereign storage** (IPFS/Arweave owner-pinned, Lit-encrypted).
5. **Reputation / moderation** via governance (anti-spam), not via infra payment.

## 8. Honest hard problems (do not hand-wave)

1. **Moderation & spam** — the cost centralized platforms actually pay. P2P has
   no free moderator; it spreads to reputation, blocklists and local
   moderation. This is governance's real job.
2. **Offline availability** — a profile on Alice's phone is invisible when she
   is offline. Accept "see who is online" (fine for dating) or a tiny
   self-paid pointer pin.
3. **Discovery at scale** — global DHT cannot answer "women 25–35 in Kyiv".
   Solved by **local scope**: search is city-scoped, so N is small per relay.
4. **Bootstrapping** — the first relays/seeds must be run by someone. Fund from
   donations (`DONATE.md`) or the founder's own machine; the network then
   becomes self-sustaining on goodwill, as Nostr is today.

## 9. Normative rules (MUST / MUST NOT)

Agents building on this codebase:

- **MUST** treat P2P/Nostr as the default transport for any new messaging,
  storage, or discovery feature; HTTP/WS/DB are fallbacks/mirrors, never the
  primary path.
- **MUST** prefer city/local scoping for any new index or feed (geography is
  the sharding key).
- **MUST NOT** introduce token payments for infrastructure (relays, hosting,
  bandwidth). Infrastructure is free-by-design + donations.
- **MUST NOT** add a new centralized store for user content; owner-pinned
  IPFS/Arweave first, server copy as a mirror only.
- **MUST NOT** weaken the §23 Ban Resistance guarantees while adding features.
