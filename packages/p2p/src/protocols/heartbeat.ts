import type { ILogger } from "../types";

export interface HeartbeatMessage {
  peerId: string;
  timestamp: number;
  sequence: number;
}

export interface PeerStatus {
  id: string;
  lastHeartbeat: number;
  latency: number;
  isAlive: boolean;
  sequence: number;
}

export class HeartbeatProtocol {
  private peers: Map<string, PeerStatus> = new Map();
  private logger: ILogger;
  private interval: number;
  private timeout: number;
  private sequence = 0;
  private intervalTimer: ReturnType<typeof setInterval> | null = null;
  private localPeerId: string;

  constructor(
    localPeerId: string,
    config: { interval?: number; timeout?: number } = {},
    logger?: ILogger,
  ) {
    this.localPeerId = localPeerId;
    this.logger = logger ?? consoleLogger;
    this.interval = config.interval ?? 5000;
    this.timeout = config.timeout ?? 15000;
  }

  start(onPeerDown?: (peerId: string) => void): void {
    if (this.intervalTimer !== null) {
      this.logger.warn(
        "Heartbeat already started, ignoring duplicate start call",
      );
      return;
    }

    this.intervalTimer = setInterval(() => {
      this.sequence++;
      this.checkStalePeers(onPeerDown);
    }, this.interval);

    this.logger.info(`Heartbeat started with interval ${this.interval}ms`);
  }

  stop(): void {
    if (this.intervalTimer !== null) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    this.logger.info("Heartbeat stopped");
  }

  async send(
    sendMessage: (topic: string, data: unknown) => Promise<void>,
  ): Promise<void> {
    const heartbeat: HeartbeatMessage = {
      peerId: this.localPeerId,
      timestamp: Date.now(),
      sequence: this.sequence,
    };

    await sendMessage("heartbeat", {
      type: "heartbeat",
      payload: heartbeat,
    });
  }

  async receive(data: unknown): Promise<PeerStatus | null> {
    if (!this.isHeartbeatMessage(data)) return null;

    const payload = data.payload as HeartbeatMessage;
    const now = Date.now();
    const latency = now - payload.timestamp;

    const status: PeerStatus = {
      id: payload.peerId,
      lastHeartbeat: now,
      latency,
      isAlive: true,
      sequence: payload.sequence,
    };

    this.peers.set(payload.peerId, status);

    return status;
  }

  async handleResponse(data: unknown): Promise<PeerStatus | null> {
    if (!this.isHeartbeatResponse(data)) return null;

    const payload = data.payload as HeartbeatMessage;
    const now = Date.now();
    const latency = now - payload.timestamp;

    const existing = this.peers.get(payload.peerId);
    if (existing !== undefined) {
      existing.lastHeartbeat = now;
      existing.latency = latency;
      existing.isAlive = true;
      existing.sequence = payload.sequence;
      return existing;
    }

    const status: PeerStatus = {
      id: payload.peerId,
      lastHeartbeat: now,
      latency,
      isAlive: true,
      sequence: payload.sequence,
    };

    this.peers.set(payload.peerId, status);
    return status;
  }

  getPeerStatus(peerId: string): PeerStatus | undefined {
    return this.peers.get(peerId);
  }

  getAllPeerStatuses(): PeerStatus[] {
    return Array.from(this.peers.values());
  }

  private checkStalePeers(onPeerDown?: (peerId: string) => void): void {
    const now = Date.now();
    const stalePeers: string[] = [];
    for (const [id, peer] of this.peers) {
      if (now - peer.lastHeartbeat > this.timeout) {
        peer.isAlive = false;
        this.logger.debug(`Peer ${id} is stale`);
        stalePeers.push(id);
      }
    }
    for (const id of stalePeers) {
      this.peers.delete(id);
      onPeerDown?.(id);
    }
  }

  private isHeartbeatMessage(
    data: unknown,
  ): data is { type: string; payload: HeartbeatMessage } {
    return (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      (data as Record<string, unknown>).type === "heartbeat" &&
      "payload" in data
    );
  }

  private isHeartbeatResponse(
    data: unknown,
  ): data is { type: string; payload: HeartbeatMessage } {
    return (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      (data as Record<string, unknown>).type === "heartbeat-response" &&
      "payload" in data
    );
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) => console.log(`[Heartbeat] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[Heartbeat] ${message}`, ...args),
  error: (message, ...args) => console.error(`[Heartbeat] ${message}`, ...args),
  debug: (message, ...args) => console.debug(`[Heartbeat] ${message}`, ...args),
};
