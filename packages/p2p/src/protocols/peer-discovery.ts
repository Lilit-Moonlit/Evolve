import type { ILogger } from "../types";

export interface DiscoveredPeer {
  id: string;
  multiaddrs: string[];
  lastSeen: number;
  metadata?: Record<string, unknown>;
}

export class PeerDiscoveryProtocol {
  private knownPeers: Map<string, DiscoveredPeer> = new Map();
  private logger: ILogger;
  private peerTimeout: number;

  constructor(config: { peerTimeout?: number } = {}, logger?: ILogger) {
    this.logger = logger ?? consoleLogger;
    this.peerTimeout = config.peerTimeout ?? 60000;
  }

  async announce(
    sendMessage: (topic: string, data: unknown) => Promise<void>,
    peerId: string,
    multiaddrs: string[],
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const announcement = {
      type: "peer-announce",
      payload: {
        id: peerId,
        multiaddrs,
        lastSeen: Date.now(),
        metadata,
      },
    };

    await sendMessage("peer-discovery", announcement);
    this.logger.debug(`Announced peer: ${peerId}`);
  }

  async requestPeers(
    sendMessage: (topic: string, data: unknown) => Promise<void>,
    peerId: string,
  ): Promise<void> {
    const request = {
      type: "peer-request",
      payload: {
        from: peerId,
        timestamp: Date.now(),
      },
    };

    await sendMessage("peer-discovery", request);
    this.logger.debug(`Requested peers from network`);
  }

  async receive(data: unknown): Promise<DiscoveredPeer | null> {
    if (!this.isPeerMessage(data)) return null;

    const payload = data.payload as DiscoveredPeer;

    if (data.type === "peer-announce") {
      this.knownPeers.set(payload.id, {
        id: payload.id,
        multiaddrs: payload.multiaddrs,
        lastSeen: payload.lastSeen,
        metadata: payload.metadata,
      });

      this.logger.debug(`Discovered peer: ${payload.id}`);
      return payload;
    }

    return null;
  }

  getKnownPeers(): DiscoveredPeer[] {
    this.cleanupStalePeers();
    return Array.from(this.knownPeers.values());
  }

  getPeer(peerId: string): DiscoveredPeer | undefined {
    this.cleanupStalePeers();
    return this.knownPeers.get(peerId);
  }

  removePeer(peerId: string): void {
    this.knownPeers.delete(peerId);
  }

  private cleanupStalePeers(): void {
    const now = Date.now();
    for (const [id, peer] of this.knownPeers) {
      if (now - peer.lastSeen > this.peerTimeout) {
        this.knownPeers.delete(id);
        this.logger.debug(`Removed stale peer: ${id}`);
      }
    }
  }

  private isPeerMessage(
    data: unknown,
  ): data is { type: string; payload: DiscoveredPeer } {
    return (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      "type" in data &&
      ((data as Record<string, unknown>).type === "peer-announce" ||
        (data as Record<string, unknown>).type === "peer-request") &&
      "payload" in data
    );
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) =>
    console.log(`[PeerDiscovery] ${message}`, ...args),
  warn: (message, ...args) =>
    console.warn(`[PeerDiscovery] ${message}`, ...args),
  error: (message, ...args) =>
    console.error(`[PeerDiscovery] ${message}`, ...args),
  debug: (message, ...args) =>
    console.debug(`[PeerDiscovery] ${message}`, ...args),
};
