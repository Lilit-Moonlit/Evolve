# @evolve/p2p

P2P networking layer for Evolve dating platform. Built on libp2p (v3) and Nostr.

## Features

- **libp2p v3** — WebSockets, WebTransport, Noise encryption, mplex stream muxer, GossipSub pubsub
- **Nostr** — NIP-04 encrypted direct messages, profile events
- **Three protocols** — heartbeat (liveness), peer discovery, direct messaging
- **Storage adapter** — persist chats via in-memory or external adapter
- **TypeScript** — full type safety with strict mode

## Quick Start

```typescript
import { ChatManager } from "@evolve/p2p";

const manager = new ChatManager({
  useLibp2p: true,
  useNostr: true,
  heartbeat: { enabled: true, interval: 5000, timeout: 15000 },
  peerDiscovery: { enabled: true, peerTimeout: 60000 },
});

await manager.initialize();

// Send a message
const message = await manager.sendMessage("alice", "bob", "Hello!");
console.log(`Message status: ${message.status}`);

// Subscribe to incoming messages
manager.onMessage("alice", "bob", (msg) => {
  console.log(`Received: ${msg.content}`);
});

// Listen for peer disconnections
manager.onPeerDown((peerId) => {
  console.log(`Peer ${peerId} disconnected`);
});

await manager.stop();
```

## API

### `ChatManager`

Main orchestrator that ties together libp2p, Nostr, and the protocol stack.

#### Methods

- `initialize()` — start the node, subscribe to topics, announce to the network
- `stop()` — clean shutdown (unsubscribe, disconnect, stop heartbeat)
- `sendMessage(from, to, content, encrypted?)` — send a chat message; throws on failure
- `sendDirectMessage(from, to, content)` — send a protocol-level direct message
- `sendTypingIndicator(from, to)` — best-effort typing notification
- `onMessage(user1, user2, callback)` — subscribe to messages in a chat
- `offMessage(user1, user2)` — unsubscribe
- `markMessageAsRead(messageId)` / `markChatAsRead(user1, user2)` — read receipts
- `getChat(user1, user2)` / `getAllChats()` / `getChatsForUser(address)` — read history
- `deleteChat(user1, user2)` / `deleteMessage(messageId)` — remove data
- `requestPeers()` — ask the network for known peers
- `flushQueue()` — retry messages in the failure queue
- `getQueueSize()` — inspect the queue

#### Protocol accessors

- `getDirectMessageHistory(peerId)` — all DMs with a peer
- `getKnownPeers()` — peers discovered via the gossip mesh
- `getPeerStatus(peerId)` / `getAllPeerStatuses()` — heartbeat liveness
- `onPeerDown(callback)` / `offPeerDown(callback)` — liveness events

### Protocols

Each protocol is independently usable:

```typescript
import {
  HeartbeatProtocol,
  PeerDiscoveryProtocol,
  DirectMessagingProtocol,
} from "@evolve/p2p";
```

#### `HeartbeatProtocol`

Liveness checks with stale-peer detection. Uses a single global listener per `libp2p.pubsub` instance to avoid listener leaks.

```typescript
const hb = new HeartbeatProtocol(peerId, { interval: 5000, timeout: 15000 });
hb.start((stalePeerId) => console.log(`Peer ${stalePeerId} is down`));
await hb.send(sendAdapter);
hb.stop();
```

#### `PeerDiscoveryProtocol`

Announce and discover peers via gossipsub. `cleanupStalePeers()` runs on every read.

```typescript
const pd = new PeerDiscoveryProtocol({ peerTimeout: 60000 });
await pd.announce(sendAdapter, peerId, multiaddrs);
const peers = pd.getKnownPeers();
```

#### `DirectMessagingProtocol`

Send and receive direct messages with a per-peer history. Cleans up the history entry on send failure.

```typescript
const dm = new DirectMessagingProtocol();
dm.setHandler((msg) => console.log(`DM: ${msg.content}`));
await dm.send(sendAdapter, { id, from, to, content });
```

## Architecture

```
ChatManager
├── Libp2pNode (libp2p v3: gossipsub, DHT, noise, mplex, websockets)
├── NostrClient (NIP-04 encrypted DMs, profiles)
├── ChatStorage (in-memory + pluggable adapter)
├── DirectMessagingProtocol
├── PeerDiscoveryProtocol
└── HeartbeatProtocol
```

## Scripts

```bash
npm run build           # Compile to dist/
npm run clean           # Remove dist/
npm run type-check      # tsc --noEmit
npm test                # vitest run
npm run test:watch      # vitest
npm run test:coverage   # vitest run --coverage
```

## Testing

99 unit + integration tests covering protocols, libp2p wiring, Nostr, storage, and end-to-end protocol interactions.

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

Coverage (lines): errors 100%, types 100%, protocols 86%, chat-storage 86%, chat-manager 52%, libp2p-node 40%, nostr-client 50%. Lower coverage in network-bound code is expected — those paths require real libp2p/Nostr connections.

## Configuration

```typescript
interface ChatManagerConfig {
  useLibp2p?: boolean; // default: true
  useNostr?: boolean; // default: true
  libp2pConfig?: Libp2pConfig;
  nostrConfig?: NostrConfig;
  storage?: ChatStorageConfig;
  heartbeat?: { enabled?: boolean; interval?: number; timeout?: number };
  peerDiscovery?: { enabled?: boolean; peerTimeout?: number };
}
```

## Error Handling

All custom errors extend `P2pError` and preserve the original cause:

```typescript
import {
  P2pError,
  InitializationError,
  NotInitializedError,
  ConnectionError,
  PublishError,
  SubscribeError,
} from "@evolve/p2p";

try {
  await manager.sendMessage("a", "b", "x");
} catch (e) {
  if (e instanceof P2pError) {
    console.log(e.code, e.cause);
  }
}
```

## License

UNLICENSED — internal Evolve project.
