import type { Message, PeerInfo } from "@evolve/core";

export interface ILogger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

export enum ConnectionState {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
  Reconnecting = "reconnecting",
}

export enum ChatMessageStatus {
  Pending = "pending",
  Sent = "sent",
  Delivered = "delivered",
  Read = "read",
  Failed = "failed",
}

export interface ExtendedMessage extends Message {
  status: ChatMessageStatus;
  encrypted: boolean;
}

export type MessageHandler = (message: ExtendedMessage) => void;
export type ConnectionStateHandler = (state: ConnectionState) => void;

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface P2pModuleConfig {
  libp2p?: {
    bootstrapPeers?: string[];
    enableDHT?: boolean;
    enableGossipsub?: boolean;
    listenAddresses?: string[];
  };
  nostr?: {
    relays?: string[];
    privateKey?: string;
  };
  chat?: {
    storageBackend?: "ipfs" | "arweave";
    encryptionEnabled?: boolean;
  };
}

export interface MediaMessage {
  id: string;
  from: string;
  to: string;
  cid: string;
  mimeType: string;
  fileName: string;
  size: number;
  duration?: number;
  expiresAt: number;
}

export enum CallState {
  Idle = "idle",
  Calling = "calling",
  Ringing = "ringing",
  Connected = "connected",
  Ended = "ended",
  Failed = "failed",
}

export interface CallOffer {
  type: "offer";
  callId: string;
  from: string;
  to: string;
  sdp: string;
  timestamp: number;
}

export interface CallAccept {
  type: "accept";
  callId: string;
  from: string;
  to: string;
  sdp: string;
  timestamp: number;
}

export interface ICECandidate {
  type: "ice";
  callId: string;
  from: string;
  to: string;
  candidate: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
  timestamp: number;
}

export interface CallHangup {
  type: "hangup";
  callId: string;
  from: string;
  to: string;
  reason?: string;
  timestamp: number;
}

export type CallSignal = CallOffer | CallAccept | ICECandidate | CallHangup;
