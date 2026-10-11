/**
 * Standalone EVOLVE gossipsub relay runner.
 *
 * Loads (or creates) a persistent Ed25519 identity so the relay's PeerId is
 * deterministic across restarts, then starts the relay node and keeps the
 * process alive until SIGINT/SIGTERM.
 *
 * Run with: npm run relay
 *
 * Runtime note: all libp2p v3 packages are ESM-only (`"type": "module"`,
 * no `require` export condition) while this package is a CJS context, so
 * `tsx` compiles static imports to `require()` which fails with
 * ERR_PACKAGE_PATH_NOT_EXPORTED. Value imports therefore use native
 * `import()` (preserved by tsx), and types use erased `import type`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Ed25519PrivateKey } from "@libp2p/interface";
import {
  createRelayNode,
  relayMultiaddr,
  DEFAULT_RELAY_PORT,
  DEFAULT_RELAY_TOPIC,
} from "../src/relay-node";

/** Directory holding the persistent relay identity, relative to this script. */
const RELAY_DIR = fileURLToPath(new URL("../relay", import.meta.url));
const PEER_ID_FILE = path.join(RELAY_DIR, "relay-peer-id.json");

/** On-disk identity format: protobuf key bytes as base64 strings. */
interface PersistedPeerId {
  /** Base64 of the protobuf-encoded private key bytes. */
  privateKey: string;
  /** Base64 of the raw public key bytes. */
  publicKey: string;
}

/** Reads and decodes the persisted identity, or null when none exists yet. */
async function loadPersistedPrivateKey(): Promise<Ed25519PrivateKey | null> {
  let raw: string;
  try {
    raw = readFileSync(PEER_ID_FILE, "utf8");
  } catch {
    return null;
  }

  const { privateKeyFromProtobuf } = await import("@libp2p/crypto/keys");
  const parsed = JSON.parse(raw) as PersistedPeerId;
  const privateKey = privateKeyFromProtobuf(Buffer.from(parsed.privateKey, "base64"));

  // We always persist Ed25519 keys; anything else means a corrupted file.
  if (privateKey.type !== "Ed25519") {
    throw new Error(`Unsupported persisted relay key type: ${privateKey.type}`);
  }

  // Sanity check: the stored public key must match the private key.
  const publicKeyB64 = Buffer.from(privateKey.publicKey.raw).toString("base64");
  if (parsed.publicKey !== undefined && parsed.publicKey !== publicKeyB64) {
    throw new Error("Persisted relay identity is corrupted: public key mismatch");
  }

  return privateKey;
}

/** Loads the persisted Ed25519 identity, generating and persisting one on first run. */
async function createOrLoadPrivateKey(): Promise<Ed25519PrivateKey> {
  const existing = await loadPersistedPrivateKey();
  if (existing !== null) {
    return existing;
  }

  // First run: generate a fresh Ed25519 identity and persist it.
  const { generateKeyPair, privateKeyToProtobuf } = await import("@libp2p/crypto/keys");
  const privateKey = await generateKeyPair("Ed25519");
  const persisted: PersistedPeerId = {
    privateKey: Buffer.from(privateKeyToProtobuf(privateKey)).toString("base64"),
    publicKey: Buffer.from(privateKey.publicKey.raw).toString("base64"),
  };

  mkdirSync(RELAY_DIR, { recursive: true });
  writeFileSync(PEER_ID_FILE, `${JSON.stringify(persisted, null, 2)}\n`, "utf8");

  return privateKey;
}

async function main(): Promise<void> {
  const port = Number(process.env.EVOLVE_RELAY_PORT ?? DEFAULT_RELAY_PORT);
  const topic = process.env.EVOLVE_RELAY_TOPIC ?? DEFAULT_RELAY_TOPIC;

  const privateKey = await createOrLoadPrivateKey();
  const node = await createRelayNode({ port, topic, privateKey });

  const { peerIdFromPrivateKey } = await import("@libp2p/peer-id");
  const peerId = peerIdFromPrivateKey(privateKey).toString();
  console.log("EVOLVE relay listening");
  console.log(`Multiaddr: ${relayMultiaddr(peerId, port)}`);
  console.log(`PeerId: ${peerId}`);

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`\nReceived ${signal}, stopping relay...`);
    void Promise.resolve(node.stop()).then(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void main().catch((err: unknown) => {
  console.error("Relay failed to start:", err);
  process.exit(1);
});
