# Shared Packages Architecture Guide

## Overview

This document outlines the browser-safe architecture for `@evolve/core` and `@evolve/p2p` packages, ensuring compatibility across web, mobile, and server environments.

## Browser-Safe Architecture

### Core Package (@evolve/core)

#### Browser-Unsafe Dependencies (Server-Only)

- `express` - HTTP server framework
- `@prisma/client` - ORM for database access
- `pg` - PostgreSQL client
- `@types/express`, `@types/pg` - TypeScript definitions for Node.js

#### Browser-Safe Modules

- **types** - All TypeScript type definitions
- **constants** - Application constants (with browser-compatible env handling)
- **utils/crypto** - Web Crypto API (works in browser and Node.js)
- **utils/formatting** - Pure formatting functions
- **utils/validation** - Pure validation functions
- **utils/reputation** - Pure reputation calculation
- **utils/web3** - Browser-specific Web3 utilities (window.ethereum)
- **utils/common** - Common utilities (debounce, throttle, etc.)
- **middleware/errorHandler** - Error classes (not Express handlers)
- **middleware/auth** - Auth helper functions (not Express middleware)
- **middleware/logger** - Logger class (not Express middleware)

#### Entry Points

**Default Entry (`.`)** - Full API for server-side:

```typescript
import * as core from "@evolve/core";
// Includes Express middleware, Prisma, etc.
```

**Browser Entry (`./browser`)** - Browser-safe API:

```typescript
import * as core from "@evolve/core/browser";
// Excludes Express middleware, Prisma, PG
```

**Server Entry (`./server`)** - Server-only API:

```typescript
import * as core from "@evolve/core/server";
// Includes everything including Express middleware
```

### P2P Package (@evolve/p2p)

#### Browser Compatibility

- **Libp2p v3** - Has browser support with WebSocket/WebTransport
- **Nostr** - Works in browsers with WebSocket support
- **WebRTC** - May require polyfills in older browsers

#### Required Polyfills

```bash
npm install webrtc-adapter @fails-components/webtransport
```

#### Browser-Specific Configuration

- Disabled DHT (doesn't work well in browsers)
- WebSocket/WebTransport transports only
- Longer peer timeouts for browser environments
- UPnP disabled (doesn't work in browsers)

#### Entry Points

**Default Entry (`.`)** - Full API:

```typescript
import { ChatManager } from "@evolve/p2p";
```

**Browser Entry (`./browser`)** - Browser-compatible API with defaults:

```typescript
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";
```

## Mode-Specific Architecture

### Mode 1: Optional Wallet Support (Web/Mobile)

**Characteristics:**

- Users can browse without wallet
- Wallet connection is optional
- P2P features should work without wallet
- Fallback to server-side APIs when wallet not connected

**Core Usage:**

```typescript
import { sha256Hash, validateEmail, Logger } from "@evolve/core/browser";
// Use browser-safe utilities only
```

**P2P Usage:**

```typescript
// P2P should be optional in Mode 1
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";

// Lazy load P2P only when wallet is connected
if (walletConnected) {
  const chatManager = new ChatManager(defaultBrowserConfig);
  await chatManager.initialize();
}
```

**API Stability Requirements:**

- All browser-safe core APIs must work without wallet
- P2P APIs should gracefully handle missing wallet
- Server-side APIs should be available as fallback

### Mode 2: Wallet-First Flow (Web/Mobile)

**Characteristics:**

- Wallet connection required for core features
- P2P features enabled by default
- Enhanced privacy and decentralization

**Core Usage:**

```typescript
import {
  sha256Hash,
  generateAuthToken,
  verifyWalletSignature,
} from "@evolve/core/browser";
import { connectWallet, signMessage } from "@evolve/core/browser";
```

**P2P Usage:**

```typescript
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";

// P2P loaded immediately
const chatManager = new ChatManager(defaultBrowserConfig);
await chatManager.initialize();
```

**API Stability Requirements:**

- All wallet-related APIs must be stable
- P2P APIs must work reliably
- Fallback to server APIs if P2P fails

### Mode 3: Wallet-Only Flow (Mobile/Web)

**Characteristics:**

- Wallet connection mandatory
- Full P2P functionality
- No server-side fallbacks

**Core Usage:**

```typescript
import {
  connectWallet,
  signMessage,
  verifyWalletSignature,
  generateAuthToken,
} from "@evolve/core/browser";
```

**P2P Usage:**

```typescript
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";

// P2P is primary communication layer
const chatManager = new ChatManager(defaultBrowserConfig);
await chatManager.initialize();
```

**API Stability Requirements:**

- All APIs must work without server dependencies
- P2P must be reliable
- Error handling must be robust

## P2P Loading Recommendation

### Recommendation: **P2P Should Load Conditionally Based on Mode**

**Rationale:**

1. **Mode 1 (Optional Wallet):** P2P should be lazy-loaded only when wallet is connected
2. **Mode 2 (Wallet-First):** P2P should load immediately but with graceful degradation
3. **Mode 3 (Wallet-Only):** P2P should load immediately and be required

### Implementation Pattern

```typescript
// Mode-aware P2P loading
async function initializeP2P(
  mode: "mode1" | "mode2" | "mode3",
  walletConnected?: boolean,
) {
  switch (mode) {
    case "mode1":
      // Lazy load only when wallet connected
      if (walletConnected) {
        const { ChatManager, defaultBrowserConfig } =
          await import("@evolve/p2p/browser");
        return new ChatManager(defaultBrowserConfig);
      }
      return null;

    case "mode2":
      // Load immediately but handle failures gracefully
      try {
        const { ChatManager, defaultBrowserConfig } =
          await import("@evolve/p2p/browser");
        return new ChatManager(defaultBrowserConfig);
      } catch (error) {
        console.warn("P2P initialization failed, falling back to server APIs");
        return null;
      }

    case "mode3":
      // Load immediately, fail if not available
      const { ChatManager, defaultBrowserConfig } =
        await import("@evolve/p2p/browser");
      const manager = new ChatManager(defaultBrowserConfig);
      await manager.initialize();
      return manager;
  }
}
```

## API Stability Guarantees

### Core Package Browser API

**Stable APIs (Guaranteed across all modes):**

```typescript
// Types
import type { User, UserProfile, Message, Match } from "@evolve/core/browser";

// Constants
import { APP_NAME, APP_VERSION, MATCH_MIN_SCORE } from "@evolve/core/browser";

// Crypto
import { sha256Hash, base64Encode, base64Decode } from "@evolve/core/browser";

// Validation
import { isValidEmail, isValidAge, isValidUrl } from "@evolve/core/browser";

// Formatting
import { formatAddress, formatEther } from "@evolve/core/browser";

// Error Handling
import { ValidationError, AuthenticationError } from "@evolve/core/browser";

// Logger
import { Logger, LogLevel } from "@evolve/core/browser";
```

**Wallet-Dependent APIs (Mode 2/3 only):**

```typescript
// Web3
import {
  connectWallet,
  signMessage,
  getWalletAddress,
} from "@evolve/core/browser";

// Auth
import { generateAuthToken, verifyWalletSignature } from "@evolve/core/browser";
```

### P2P Package Browser API

**Stable APIs (When P2P is loaded):**

```typescript
import { ChatManager } from "@evolve/p2p/browser";

// Core functionality
await manager.sendMessage(from, to, content);
await manager.getChat(user1, user2);
manager.onMessage(user1, user2, callback);
```

**Optional APIs (May not work in all browsers):**

```typescript
// WebRTC calls
await manager.offerCall(to);
await manager.acceptCall(callId);

// Media sharing
await manager.sendMedia(from, to, cid, mimeType, fileName, size);
```

## Migration Guide

### For Web Applications

**Before (Server-Only):**

```typescript
import { createAuthMiddleware } from "@evolve/core";
import { ChatManager } from "@evolve/p2p";
```

**After (Browser-Safe):**

```typescript
import { generateAuthToken, Logger } from "@evolve/core/browser";
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";
```

### For Mobile Applications

**Before (Mixed):**

```typescript
import * as core from "@evolve/core";
import { ChatManager } from "@evolve/p2p";
```

**After (Browser-Safe):**

```typescript
import * as core from "@evolve/core/browser";
import { ChatManager, defaultBrowserConfig } from "@evolve/p2p/browser";
```

### For Server Applications

**No Changes Required:**

```typescript
import * as core from "@evolve/core";
import { ChatManager } from "@evolve/p2p";
```

## Testing Strategy

### Browser Testing

- Test all browser-safe APIs in Chrome, Firefox, Safari, Edge
- Test P2P functionality with polyfills
- Test lazy loading of P2P in Mode 1
- Test graceful degradation in Mode 2

### Mobile Testing

- Test in React Native environment
- Test WebRTC polyfills on mobile browsers
- Test P2P connectivity in mobile networks

### Server Testing

- Ensure server entry point still works
- Test Express middleware functionality
- Test database operations

## Security Considerations

### Content Security Policy (CSP)

Ensure CSP allows:

- `connect-src` for WebSocket connections
- `script-src` for polyfills

### Browser Security

- P2P connections respect same-origin policy
- WebRTC requires proper STUN/TURN configuration
- Wallet operations require user approval

## Performance Considerations

### Bundle Size

- Browser entry point reduces bundle size by excluding Express/Prisma
- Lazy loading P2P in Mode 1 reduces initial bundle
- Tree-shaking works with conditional exports

### Runtime Performance

- Browser-safe utilities are pure functions (fast)
- P2P initialization is asynchronous (non-blocking)
- WebRTC adds minimal overhead when not used

## Troubleshooting

### Issue: Import errors in browser

**Solution:** Use `@evolve/core/browser` instead of `@evolve/core`

### Issue: P2P fails to initialize

**Solution:** Install polyfills: `npm install webrtc-adapter @fails-components/webtransport`

### Issue: Wallet not detected

**Solution:** Ensure window.ethereum is available (MetaMask, WalletConnect, etc.)

### Issue: P2P not working in Safari

**Solution:** Use WebTransport polyfill and configure STUN/TURN servers

## Future Improvements

1. **Separate Packages:** Consider splitting core into `@evolve/core-types`, `@evolve/core-utils`, `@evolve/core-server`
2. **Build Optimization:** Add separate build outputs for browser and server
3. **Polyfill Auto-Detection:** Automatically load polyfills based on browser capabilities
4. **Mode Detection:** Auto-detect mode and load appropriate APIs
5. **Enhanced Testing:** Add E2E tests for all modes

## Conclusion

The browser-safe architecture ensures:

- ✅ Core package works in browser, mobile, and server environments
- ✅ P2P package works in browsers with proper polyfills
- ✅ Mode-specific API stability across all use cases
- ✅ Conditional loading of P2P based on wallet connection
- ✅ Clear separation between browser-safe and server-only code
- ✅ Backward compatibility for existing server applications
