/**
 * Node-only WebSocket + gossipsub relay for the EVOLVE network.
 *
 * A single relay node listens for WebSocket connections from browser peers
 * and forwards gossipsub messages between them. Browser peers dial the
 * relay's multiaddr and subscribe to the same topic; the relay then acts as
 * the rendezvous point so two browsers can exchange chat messages without a
 * direct connection between them.
 *
 * IMPORTANT: this module is Node-only and MUST NOT be imported from
 * `src/index.ts` or `src/browser.ts`. It pulls the full Node libp2p stack
 * and is only usable inside a Node.js process (see `scripts/run-relay.ts`).
 *
 * Runtime note: all libp2p v3 packages are ESM-only (`"type": "module"`,
 * no `require` export condition) while this package is a CJS context, so
 * `tsx` compiles static imports to `require()` which fails with
 * ERR_PACKAGE_PATH_NOT_EXPORTED. Value imports therefore use native
 * `import()` (preserved by tsx), and types use erased `import type`.
 */
import type { GossipSub } from "@libp2p/gossipsub";
import type { Identify } from "@libp2p/identify";
import type { Libp2p, Libp2pInit } from "libp2p";

/** Default TCP port the WebSocket listener binds to. */
export const DEFAULT_RELAY_PORT = 4001;

/** Default gossipsub topic relayed between browser peers. */
export const DEFAULT_RELAY_TOPIC = "evolve-chat";

/**
 * Services exposed on the relay node.
 * Declared as a type alias (not an interface) so it satisfies the
 * `ServiceMap` index-signature constraint of `createLibp2p`.
 */
export type RelayServices = {
  identify: Identify;
  pubsub: GossipSub;
};

/** A started relay node. */
export type RelayNode = Libp2p<RelayServices>;

export interface RelayNodeOptions {
  /** TCP port the WebSocket listener binds to (default: 4001). */
  port?: number;
  /** Gossipsub topic the relay forwards (default: "evolve-chat"). */
  topic?: string;
  /**
   * Identity of the relay node. Pass a persisted private key to keep a
   * stable PeerId across restarts; omit to generate an ephemeral identity.
   */
  privateKey?: Libp2pInit["privateKey"];
}

/**
 * Returns the multiaddr browser peers should dial to reach the relay.
 * Always uses 127.0.0.1 (loopback), matching the announced address.
 */
export function relayMultiaddr(peerId: string, port: number = DEFAULT_RELAY_PORT): string {
  return `/ip4/127.0.0.1/tcp/${port}/ws/p2p/${peerId}`;
}

/**
 * Creates and starts a WebSocket + gossipsub relay node.
 *
 * The node binds 0.0.0.0 (reachable from other machines) but announces
 * 127.0.0.1 so local browser peers always dial the loopback address. The
 * relay subscribes to the topic itself — without that local subscription
 * gossipsub would never forward messages between the browser peers.
 */
export async function createRelayNode(options: RelayNodeOptions = {}): Promise<RelayNode> {
  const port = options.port ?? DEFAULT_RELAY_PORT;
  const topic = options.topic ?? DEFAULT_RELAY_TOPIC;

  // Load the ESM-only libp2p modules lazily (see the runtime note above).
  const [{ createLibp2p }, { gossipsub }, { identify }, { noise }, { webSockets }, { yamux }] =
    await Promise.all([
      import("libp2p"),
      import("@libp2p/gossipsub"),
      import("@libp2p/identify"),
      import("@libp2p/noise"),
      import("@libp2p/websockets"),
      import("@libp2p/yamux"),
    ]);

  const node = await createLibp2p<RelayServices>({
    start: false,
    privateKey: options.privateKey,
    addresses: {
      listen: [`/ip4/0.0.0.0/tcp/${port}/ws`],
      // Announce 127.0.0.1, NOT 0.0.0.0: browser peers need a dialable address.
      announce: [`/ip4/127.0.0.1/tcp/${port}/ws`],
    },
    transports: [webSockets()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
      pubsub: gossipsub({ emitSelf: false, floodPublish: true }),
    },
  });

  await node.start();

  // Subscribe so gossipsub forwards messages to and from browser peers.
  node.services.pubsub.subscribe(topic);

  return node;
}
