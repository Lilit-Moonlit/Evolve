# Shared Packages Integration Guide

This guide provides an overview of the shared packages (`@evolve/core`, `@evolve/matching`, `@evolve/p2p`) and their readiness for integration into web and mobile applications.

## Overview

| Package            | Purpose                                 | Tests | Web Ready  | Notes                              |
| ------------------ | --------------------------------------- | ----- | ---------- | ---------------------------------- |
| `@evolve/core`     | Types, constants, utilities, middleware | 34    | ⚠️ Partial | Has Node.js specific dependencies  |
| `@evolve/matching` | Matching algorithms, filters, ranking   | 67    | ✅ Yes     | Pure TypeScript, platform-agnostic |
| `@evolve/p2p`      | P2P networking (libp2p, Nostr)          | 123   | ⚠️ Partial | May need polyfills                 |

## Package Details

### @evolve/core

**Purpose:** Shared types, constants, utilities, and middleware for Evolve.

**Modules:**

- `types` — User, Match, Message, and profile type definitions
- `constants` — App-wide constants and configuration
- `utils` — Validation, crypto, formatting, reputation scoring, web3 helpers
- `middleware` — Auth, logging, error handling

**API Clarity:** ✅ Excellent

- Well-defined TypeScript interfaces
- Comprehensive JSDoc comments
- Clear function signatures

**Type Compatibility:** ✅ Excellent

- Strict TypeScript configuration
- No type errors
- Proper type exports

**Web Import Readiness:** ⚠️ Partial

- **Ready for web:** Types, constants, crypto utils, formatting utils, validation utils, error handling
- **Not ready for web:**
  - `middleware/auth.ts` — Express dependencies
  - `middleware/logger.ts` — Express dependencies
  - `utils/web3.ts` — Browser-specific (window.ethereum)
  - Dependencies: `@prisma/client`, `express`, `pg` (Node.js specific)

**Recommendations:**

1. Extract browser-safe utilities into a separate sub-package
2. Create conditional exports for browser vs Node.js
3. Provide polyfills for Node.js specific features in browser

**Usage Example (Web-Safe):**

```typescript
import {
  // Types - safe for all platforms
  User,
  UserProfile,
  Message,
  Match,
  // Constants - safe for all platforms
  NETWORK_CONFIG,
  // Utils - safe for all platforms
  sha256Hash,
  base64Encode,
  validateEmail,
  // Error handling - safe for all platforms
  ValidationError,
  AuthenticationError,
} from "@evolve/core";

// Avoid in browser:
// - middleware/* (Express specific)
// - utils/web3.ts (browser specific, but may need polyfills)
```

### @evolve/matching

**Purpose:** Matching algorithms, filters, ranking, and analytics for Evolve.

**Modules:**

- `algorithms` — `calculateMatchScore`, `findBestMatches`, `preferenceMatch`, `batchCalculateMatchScores`
- `filters` — Profile filtering by age, location, interests, gender, verification status
- `ranking` — `rankByScore`, `rankByWeightedFactors`, `rankByDistance`, `rankByInterests`, `rankByRecency`, `hybridRank`, `rerankByFeedback`
- `analytics` — `calculateMatchStatistics`, `calculateUserBehavior`, `calculateUserRetention`, `calculateMatchConversionRate`, `calculateFactorImportance`

**API Clarity:** ✅ Excellent

- Clear function names and signatures
- Comprehensive JSDoc comments
- Well-structured types

**Type Compatibility:** ✅ Excellent

- Uses types from `@evolve/core`
- No type conflicts
- Proper type exports

**Web Import Readiness:** ✅ Yes

- Pure TypeScript with no runtime dependencies
- Platform-agnostic algorithms
- No Node.js or browser specific code
- Safe to import in web, mobile, and Node.js environments

**Recommendations:**

- None - package is ready for all platforms

**Usage Example:**

```typescript
import {
  calculateMatchScore,
  findBestMatches,
  filterByDistance,
  rankByScore
} from '@evolve/matching';

const profile: MatchingProfile = {
  userId: 'user-1',
  age: 28,
  interests: ['music', 'travel'],
  location: { lat: 37.7749, lon: -122.4194 },
  preferences: {
    minAge: 25,
    maxAge: 35,
    maxDistance: 50
  }
};

const candidates: MatchingProfile[] = [...];
const matches = findBestMatches(profile, candidates, 10);
```

### @evolve/p2p

**Purpose:** P2P networking layer for Evolve dating platform. Built on libp2p (v3) and Nostr.

**Modules:**

- `libp2p-node` — Libp2p node wrapper with WebSockets, WebTransport, Noise encryption, mplex, GossipSub
- `nostr-client` — Nostr client for NIP-04 encrypted direct messages
- `chat-manager` — Main orchestrator for chat functionality
- `chat-storage` — Storage adapter for chat persistence
- `protocols` — Heartbeat, peer discovery, direct messaging, call management
- `types` — P2P specific types
- `errors` — Custom error classes

**API Clarity:** ✅ Excellent

- Comprehensive README with examples
- Clear class and method signatures
- Good error handling

**Type Compatibility:** ✅ Excellent

- Extends types from `@evolve/core`
- Well-defined custom types
- Proper type exports

**Web Import Readiness:** ⚠️ Partial

- **Libp2p:** Has browser and Node.js support, but may need polyfills
- **Nostr:** Works in both environments
- **Dependencies:** `@evolve/core`, libp2p packages, nostr-tools
- **Potential issues:**
  - WebRTC may need polyfills in some browsers
  - WebSockets generally supported, but may need fallbacks
  - Some libp2p transports may not work in all browser environments

**Recommendations:**

1. Test libp2p in target browser environments
2. Provide fallback transports for browsers with limited support
3. Consider using service workers for better browser support
4. Add browser compatibility checks

**Usage Example:**

```typescript
import { ChatManager } from "@evolve/p2p";

const manager = new ChatManager({
  useLibp2p: true,
  useNostr: true,
  heartbeat: { enabled: true, interval: 5000, timeout: 15000 },
  peerDiscovery: { enabled: true, peerTimeout: 60000 },
});

await manager.initialize();

// Send a message
const message = await manager.sendMessage("alice", "bob", "Hello!");

// Subscribe to incoming messages
manager.onMessage("alice", "bob", (msg) => {
  console.log(`Received: ${msg.content}`);
});

await manager.stop();
```

## Critical Issues

### Core Package

1. **Node.js Dependencies:** Express, Prisma, and PostgreSQL dependencies prevent full web usage
2. **Browser-Specific Code:** `web3.ts` assumes browser environment but may need Node.js polyfills
3. **Middleware:** Express middleware cannot be used in browser environments

### P2P Package

1. **Libp2p Browser Support:** Some libp2p transports may not work in all browsers
2. **WebRTC:** Call management features may need WebRTC polyfills
3. **Service Workers:** May need service workers for background P2P functionality in browsers

## Recommendations for Web Integration

### Immediate Actions

1. **Extract Browser-Safe Core:** Create `@evolve/core-browser` with only browser-safe utilities
2. **Conditional Exports:** Use package.json conditional exports for browser vs Node.js
3. **Polyfills:** Provide polyfill instructions for P2P features

### Long-term Improvements

1. **Split Core Package:** Separate into `@evolve/core-types`, `@evolve/core-utils`, `@evolve/core-middleware`
2. **Browser Testing:** Add browser-specific tests for P2P functionality
3. **Documentation:** Add platform-specific usage examples

## Testing Results

All packages have comprehensive test suites:

- **@evolve/core:** 34 tests passed ✅
- **@evolve/matching:** 67 tests passed ✅
- **@evolve/p2p:** 123 tests passed ✅

Total: 224 tests passed

## Conclusion

**@evolve/matching** is fully ready for web import without any modifications.

**@evolve/core** requires refactoring to separate browser-safe code from Node.js specific code.

**@evolve/p2p** is mostly ready but may need polyfills and browser-specific testing for full functionality.

For immediate web integration, use:

- `@evolve/matching` — full functionality
- `@evolve/core` — types, constants, crypto, formatting, validation, error handling only
- `@evolve/p2p` — with caution, test thoroughly in target browsers
