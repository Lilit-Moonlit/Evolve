import { NostrCityRelay } from "./relay";

const port = Number(process.env.PORT ?? 7000);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(`Invalid PORT: ${String(process.env.PORT)}`);
  process.exit(1);
}

const relay = new NostrCityRelay({
  port,
  host: "0.0.0.0",
  onError: (error) => {
    console.error(`[nostr-relay] server error: ${error.message}`);
    process.exit(1);
  },
});

relay.server.on("listening", () => {
  console.log(`EVOLVE Nostr city relay listening on ws://localhost:${port}`);
});

function shutdown(): void {
  console.log("EVOLVE Nostr city relay shutting down");
  relay.close(() => process.exit(0));
  // Fallback if open sockets refuse to drain.
  setTimeout(() => process.exit(0), 2000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
