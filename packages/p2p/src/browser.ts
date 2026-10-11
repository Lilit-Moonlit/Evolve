/**
 * Browser entry point for @evolve/p2p
 * Exports P2P functionality with browser-compatible configuration
 */

// Export all types
export * from "./types";

// Export errors
export * from "./errors";

// Export main classes
export { ChatManager } from "./chat-manager";
export { Libp2pNode } from "./libp2p-node";
export { NostrClient } from "./nostr-client";
export { ChatStorage } from "./chat-storage";

// Export protocols
export * from "./protocols";

/**
 * Browser-compatible default configuration for ChatManager
 */
export const defaultBrowserConfig = {
  useLibp2p: true,
  useNostr: true,
  libp2pConfig: {
    // Browser nodes are dial-only (no listen addresses): WebSockets +
    // noise + yamux + gossipsub, no DHT
    enableDHT: false, // accepted as a back-compat no-op
    enableGossipsub: true,
    listenAddresses: [], // browsers cannot listen
  },
  nostrConfig: {
    // Default Nostr relays that work well in browsers
    relays: ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.nostr.band"],
  },
  heartbeat: {
    enabled: true,
    interval: 30000, // 30 seconds
    timeout: 90000, // 90 seconds
  },
  peerDiscovery: {
    enabled: true,
    peerTimeout: 120000, // 2 minutes (longer for browsers)
  },
};
