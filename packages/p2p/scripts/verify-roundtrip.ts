/**
 * Two-peer 1:1 gossipsub roundtrip proof (Phase 1 success criterion c).
 *
 * Spins up the WebSocket relay IN-PROCESS, then creates two dial-only
 * "browser-style" peers that bootstrap to the relay, subscribes both to the
 * shared chat topic, and asserts a message flows A→B and B→A — with the central
 * HTTP API server NOT running anywhere in this process.
 *
 * The message addressing (from/to) is carried in the JSON payload exactly as
 * `ChatManager.sendMessage` does; the transport is gossipsub on the single
 * shared topic `evolve-chat`, relayed by the relay node's floodPublish.
 *
 * Runtime note: libp2p v3 is ESM-only and this package is CJS, so every value
 * import below uses native `import()` (preserved by tsx) rather than static
 * imports (which tsx would compile to `require()` → ERR_PACKAGE_PATH_NOT_EXPORTED).
 */

interface ChatMessagePayload {
  type: "chat";
  data: { content: string };
  from: string;
  to: string;
  timestamp: number;
}

const TOPIC = "evolve-chat";
const CONNECT_TIMEOUT_MS = 20_000;
const MESSAGE_TIMEOUT_MS = 15_000;

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  // ESM-only modules loaded lazily (see runtime note above).
  const [
    { createLibp2p },
    { gossipsub },
    { identify },
    { noise },
    { webSockets },
    { yamux },
    { bootstrap },
  ] = await Promise.all([
    import("libp2p"),
    import("@libp2p/gossipsub"),
    import("@libp2p/identify"),
    import("@libp2p/noise"),
    import("@libp2p/websockets"),
    import("@libp2p/yamux"),
    import("@libp2p/bootstrap"),
  ]);

  // 1. Start the relay (its own module uses the same dynamic-import pattern).
  const { createRelayNode, relayMultiaddr } = await import("../src/relay-node");
  const relay = await createRelayNode({ port: 4002 }); // 4002 to avoid the standalone relay default
  const relayAddr = relayMultiaddr(relay.peerId.toString(), 4002);
  console.log(`[verify] relay listening at ${relayAddr}`);

  // 2. Create two dial-only peers that bootstrap to the relay.
  const makePeer = async () =>
    await createLibp2p({
      start: false,
      addresses: { listen: [] },
      transports: [webSockets()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      peerDiscovery: [bootstrap({ list: [relayAddr] })],
      services: {
        identify: identify(),
        pubsub: gossipsub({
          emitSelf: false,
          floodPublish: true,
          allowPublishToZeroTopicPeers: true,
        }),
      },
    });

  const peerA = await makePeer();
  const peerB = await makePeer();
  await peerA.start();
  await peerB.start();
  peerA.services.pubsub.subscribe(TOPIC);
  peerB.services.pubsub.subscribe(TOPIC);
  console.log(
    `[verify] peers started: A=${peerA.peerId.toString().slice(0, 10)}… B=${peerB.peerId.toString().slice(0, 10)}…`,
  );

  // 3. Wait until both peers are connected to the relay.
  const deadline = Date.now() + CONNECT_TIMEOUT_MS;
  for (;;) {
    const peers = relay.getPeers();
    if (peers.length >= 2) break;
    if (Date.now() > deadline)
      fail(`peers did not connect to relay in time (${peers.length}/2 connected)`);
    await sleep(200);
  }
  console.log(`[verify] both peers connected to relay (${relay.getPeers().length} peers)`);

  // 4. Wait one gossipsub heartbeat so the mesh is formed before the first publish.
  await sleep(1500);

  // 5. Wire message listeners (the same "message" event the libp2p-node uses).
  const receivedByB: ChatMessagePayload[] = [];
  const receivedByA: ChatMessagePayload[] = [];
  const onMsg =
    (sink: ChatMessagePayload[]) => (evt: CustomEvent<{ topic: string; data: Uint8Array }>) => {
      if (evt.detail.topic !== TOPIC) return;
      sink.push(JSON.parse(new TextDecoder().decode(evt.detail.data)) as ChatMessagePayload);
    };
  peerB.services.pubsub.addEventListener("message", onMsg(receivedByB));
  peerA.services.pubsub.addEventListener("message", onMsg(receivedByA));

  const encoder = new TextEncoder();

  // 6. A → B
  const msgAToB: ChatMessagePayload = {
    type: "chat",
    data: { content: "hello from A" },
    from: "alice",
    to: "bob",
    timestamp: Date.now(),
  };
  await peerA.services.pubsub.publish(TOPIC, encoder.encode(JSON.stringify(msgAToB)));
  await waitFor(
    () => receivedByB.some((m) => m.from === "alice" && m.to === "bob"),
    MESSAGE_TIMEOUT_MS,
    "A→B message not received",
  );
  console.log("[verify] A→B delivered");

  // 7. B → A
  const msgBToA: ChatMessagePayload = {
    type: "chat",
    data: { content: "hello from B" },
    from: "bob",
    to: "alice",
    timestamp: Date.now(),
  };
  await peerB.services.pubsub.publish(TOPIC, encoder.encode(JSON.stringify(msgBToA)));
  await waitFor(
    () => receivedByA.some((m) => m.from === "bob" && m.to === "alice"),
    MESSAGE_TIMEOUT_MS,
    "B→A message not received",
  );
  console.log("[verify] B→A delivered");

  // 8. Teardown.
  await peerA.stop();
  await peerB.stop();
  await relay.stop();
  console.log(
    "PASS: two peers exchanged 1:1 messages over gossipsub via a shared relay (no HTTP API).",
  );
  process.exit(0);
}

async function waitFor(
  predicate: () => boolean,
  timeoutMs: number,
  message: string,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    if (predicate()) return;
    if (Date.now() > deadline) fail(message);
    await sleep(100);
  }
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
