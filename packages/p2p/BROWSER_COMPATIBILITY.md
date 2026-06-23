# P2P Browser Compatibility Plan

## Overview

This document outlines the browser compatibility considerations and polyfill requirements for `@evolve/p2p`.

## Current Status

- **Libp2p v3:** Has browser support but requires specific configuration
- **Nostr:** Works in browsers with WebSocket support
- **WebRTC:** May require polyfills in older browsers

## Browser Compatibility Matrix

| Feature        | Chrome    | Firefox           | Safari | Edge      | Polyfill Required           |
| -------------- | --------- | ----------------- | ------ | --------- | --------------------------- |
| WebSockets     | ✅        | ✅                | ✅     | ✅        | No                          |
| WebTransport   | ✅ (111+) | ⚠️ (experimental) | ❌     | ✅ (111+) | Yes (for Safari)            |
| WebRTC         | ✅        | ✅                | ✅     | ✅        | No (adapter.js recommended) |
| Web Crypto API | ✅        | ✅                | ✅     | ✅        | No                          |

## Required Polyfills

### 1. WebRTC Adapter

```bash
npm install webrtc-adapter
```

**Usage:**

```typescript
import "webrtc-adapter";
```

### 2. WebTransport Polyfill (for Safari)

```bash
npm install @fails-components/webtransport
```

**Usage:**

```typescript
import { WebTransportPolyfill } from "@fails-components/webtransport";

// Conditionally load polyfill
if (!("WebTransport" in window)) {
  // Load polyfill
}
```

### 3. TextEncoder/TextDecoder Polyfill (for very old browsers)

```bash
npm install text-encoding
```

**Note:** Most modern browsers support TextEncoder/TextDecoder natively.

## Configuration Recommendations

### Browser-Specific Libp2p Configuration

```typescript
const browserConfig = {
  // Disable DHT in browsers (doesn't work well)
  enableDHT: false,

  // Enable GossipSub for pub/sub
  enableGossipsub: true,

  // Use WebSocket transports only
  listenAddresses: ["/ip4/0.0.0.0/tcp/0/ws", "/ip4/0.0.0.0/tcp/0/wss"],

  // Disable UPnP (doesn't work in browsers)
  disableUpnp: true,
};
```

### Service Worker Considerations

For better P2P functionality in browsers, consider using a Service Worker:

```typescript
// sw.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("p2p-v1").then((cache) => {
      return cache.addAll([
        // Cache necessary resources
      ]);
    }),
  );
});

// Keep P2P connection alive in background
self.addEventListener("fetch", (event) => {
  // Handle P2P messages
});
```

## Browser-Specific Limitations

### 1. No Direct TCP/UDP

Browsers cannot make direct TCP/UDP connections. All P2P communication must go through:

- WebSockets
- WebRTC Data Channels
- WebTransport

### 2. NAT Traversal

Browsers have limited NAT traversal capabilities:

- STUN/TURN servers are required for WebRTC
- libp2p's UPnP doesn't work in browsers
- Consider using public bootstrap peers

### 3. Resource Limits

Browsers impose limits on:

- Number of concurrent connections
- Memory usage
- CPU usage in background tabs

### 4. Background Execution

Browsers may throttle or stop background tabs:

- Use Service Workers for background P2P activity
- Implement heartbeat mechanisms
- Handle reconnection gracefully

## Implementation Guide

### Step 1: Install Polyfills

```bash
npm install webrtc-adapter @fails-components/webtransport
```

### Step 2: Import Browser Entry Point

```typescript
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";

// Load polyfills
import "webrtc-adapter";

// Initialize with browser config
const manager = new ChatManager(defaultBrowserConfig);
await manager.initialize();
```

### Step 3: Handle Browser-Specific Errors

```typescript
try {
  await manager.initialize();
} catch (error) {
  if (error.message.includes("WebTransport")) {
    console.warn("WebTransport not supported, falling back to WebSockets");
    // Fallback configuration
  }
}
```

### Step 4: Test in Target Browsers

Test the P2P functionality in:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing Checklist

- [ ] WebSockets connect successfully
- [ ] WebRTC data channels work
- [ ] Message sending/receiving works
- [ ] Peer discovery works
- [ ] Reconnection after network failure works
- [ ] Background tab execution works
- [ ] Memory usage is acceptable
- [ ] No console errors in production mode

## Performance Considerations

### Memory Management

- Limit peer connections in browsers (max 20-30)
- Implement message queue size limits
- Clean up unused resources

### CPU Usage

- Throttle intensive operations
- Use Web Workers for heavy computations
- Implement requestAnimationFrame for UI updates

### Battery Life

- Reduce heartbeat frequency on mobile
- Implement adaptive polling
- Pause non-essential P2P activity when battery is low

## Security Considerations

### Content Security Policy (CSP)

Ensure your CSP allows:

- `connect-src` for WebSocket connections
- `script-src` for polyfills

Example CSP:

```
connect-src wss: 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
```

### Origin Considerations

- P2P connections respect same-origin policy
- Use CORS for cross-origin WebRTC
- Implement proper authentication

## Troubleshooting

### Issue: WebSockets fail to connect

**Solution:** Check if WebSocket URLs are correct and server supports WSS

### Issue: WebRTC fails in Safari

**Solution:** Ensure STUN/TURN servers are configured correctly

### Issue: P2P stops in background tab

**Solution:** Implement Service Worker for background activity

### Issue: High memory usage

**Solution:** Limit peer connections and implement cleanup

### Issue: Connection drops frequently

**Solution:** Increase heartbeat interval and implement exponential backoff

## References

- [libp2p Browser Guide](https://docs.libp2p.io/introduction/getting-started/browser/)
- [WebRTC Adapter](https://github.com/webrtc/adapter)
- [WebTransport Polyfill](https://github.com/fails-components/webtransport)
