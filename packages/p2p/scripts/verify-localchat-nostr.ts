/**
 * Phase 2 verification: local chat over a Nostr city relay.
 *
 * Proves, against the in-repo relay (`relay/nostr/relay.ts`, NIP-01 store):
 *  (a) a city-tagged kind-1 message published from one subscriber appears in a
 *      second subscriber to the same city+group (live broadcast — served by the
 *      relay, NOT the Node HTTP server);
 *  (b) the NIP-29 group event flow used by the client for closed groups +
 *      admin join-approval round-trips (createGroup 9007, groupMetadata 39000,
 *      joinRequest 9021, putUser 9000, with `#h` group scoping);
 *  (c) [covered elsewhere] HTTP `/api/localchat*` fallback — exercised by the
 *      `local-chat.test.ts` suite, unchanged.
 *
 * Uses only `ws` (already a dependency). Run: `npm run verify:localchat`.
 */
import { WebSocket } from "ws";
import { NostrCityRelay } from "../relay/nostr/relay";

const PORT = 7002; // distinct from the standalone relay (7000) to avoid clashes
const CITY = "Ukraine::Kyiv";
const GROUP = "closed-group-1";

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Client {
  ws: WebSocket;
  inbox: unknown[][];
  waitFor(predicate: (m: unknown[]) => boolean, label: string): Promise<unknown[]>;
}

function connect(url: string): Promise<Client> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const client: Client = {
      ws,
      inbox: [],
      waitFor: (predicate, label) =>
        new Promise((res, rej) => {
          const deadline = Date.now() + 10_000;
          const poll = () => {
            const hit = client.inbox.find(predicate);
            if (hit) return res(hit);
            if (Date.now() > deadline) return rej(new Error(`timeout waiting for ${label}`));
            setTimeout(poll, 50);
          };
          poll();
        }),
    };
    ws.on("open", () => resolve(client));
    ws.on("error", reject);
    ws.on("message", (data) => client.inbox.push(JSON.parse(String(data))));
  });
}

function event(id: string, kind: number, tags: string[][], content = ""): Record<string, unknown> {
  return {
    id,
    pubkey: "pk-" + id,
    created_at: Math.floor(Date.now() / 1000),
    kind,
    tags,
    content,
    sig: "",
  };
}

async function main(): Promise<void> {
  const relay = new NostrCityRelay({ port: PORT });
  console.log(`[verify] relay started on ws://localhost:${PORT}`);

  const a = await connect(`ws://localhost:${PORT}`);
  const b = await connect(`ws://localhost:${PORT}`);
  console.log("[verify] two subscribers connected");

  // (a) city-tagged kind-1 message: B subscribes, A publishes, B receives live.
  b.ws.send(JSON.stringify(["REQ", "sub-city", { kinds: [1], "#t": [CITY], "#g": [GROUP] }]));
  await b.waitFor((m) => m[0] === "EOSE" && m[1] === "sub-city", "B EOSE (city)");

  const msg = event(
    "msg-1",
    1,
    [
      ["t", CITY],
      ["g", GROUP],
      ["h", GROUP],
    ],
    "Hello Kyiv",
  );
  a.ws.send(JSON.stringify(["EVENT", msg]));
  await a.waitFor((m) => m[0] === "OK" && m[1] === "msg-1", "A OK (message)");
  const delivered = await b.waitFor(
    (m) =>
      m[0] === "EVENT" &&
      m[1] === "sub-city" &&
      (m[2] as { id?: string } | undefined)?.id === "msg-1",
    "B receives city message via relay",
  );
  console.log(
    "[verify] (a) city-tagged message round-tripped via relay:",
    (delivered[2] as { content: string }).content,
  );

  // (b) NIP-29 closed group + admin approval flow round-trip.
  const createGroup = event("grp-create", 9007, [
    ["h", GROUP],
    ["t", CITY],
  ]);
  const metadata = event("grp-meta", 39000, [
    ["h", GROUP],
    ["name", "Parents"],
    ["about", CITY],
    ["private"],
  ]);
  const joinRequest = event("grp-join", 9021, [
    ["h", GROUP],
    ["evolve-user", "member-1"],
  ]);
  const approval = event("grp-put", 9000, [
    ["h", GROUP],
    ["p", "pk-member-1"],
    ["evolve-user", "member-1"],
  ]);

  for (const e of [createGroup, metadata, joinRequest, approval]) {
    a.ws.send(JSON.stringify(["EVENT", e]));
    await a.waitFor((m) => m[0] === "OK" && m[1] === e.id, `A OK (${e.id})`);
  }

  a.ws.send(
    JSON.stringify(["REQ", "sub-group", { kinds: [9007, 39000, 9021, 9000], "#h": [GROUP] }]),
  );
  const groupEvents: unknown[][] = [];
  await a.waitFor((m) => m[0] === "EOSE" && m[1] === "sub-group", "A EOSE (group)");
  for (const m of a.inbox) {
    if (m[0] === "EVENT" && m[1] === "sub-group") groupEvents.push(m);
  }
  const kinds = groupEvents.map((m) => (m[2] as { kind: number }).kind).sort((x, y) => x - y);
  const expected = [9000, 9007, 9021, 39000].sort((x, y) => x - y);
  if (JSON.stringify(kinds) !== JSON.stringify(expected)) {
    fail(`NIP-29 group events did not round-trip: got ${JSON.stringify(kinds)}`);
  }
  console.log(
    "[verify] (b) NIP-29 closed-group + join-approval events round-tripped:",
    kinds.join(", "),
  );

  // Teardown.
  a.ws.close();
  b.ws.close();
  relay.close(() => process.exit(0));
  console.log("PASS: local chat city message + NIP-29 group flow verified against the city relay.");
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
