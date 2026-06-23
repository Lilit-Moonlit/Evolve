# Mobile App Status

**Last updated**: 2026-06-18  
**Platform**: Expo + React Native

## What Works

| Feature            | Status     | Notes                                              |
| ------------------ | ---------- | -------------------------------------------------- |
| Email auth         | ✅ Working | Register, login, session                           |
| Phone OTP auth     | ✅ Working | Request OTP, verify, session                       |
| Wallet auth (SIWE) | ✅ Working | Ethereum wallet connection                         |
| API integration    | ✅ Working | REST endpoints via Vite middleware                 |
| State management   | ✅ Working | React Context (Auth + App)                         |
| i18n               | ✅ Working | 33 locales                                         |
| Profile screens    | ✅ Working | View, edit profile                                 |
| Chat UI            | ✅ Working | Message list, input                                |
| Settings           | ✅ Working | Mode selection, privacy                            |
| Privacy levels     | ✅ Working | Level 1/2/3 with hide options                      |
| STD compatibility  | ✅ Working | Anonymous indicator (Safe/Compatible/Caution/Risk) |

## What Doesn't Work

| Feature             | Status             | Notes                         |
| ------------------- | ------------------ | ----------------------------- |
| Wallet (crypto)     | ❌ Not implemented | No token balance, no staking  |
| Real-time messaging | ❌ Not implemented | No WebSocket, no live updates |
| P2P networking      | ❌ Not implemented | No libp2p integration         |
| Push notifications  | ❌ Not implemented | No FCM/APNS setup             |
| Camera/photo upload | ❌ Not implemented | No media handling             |
| Location services   | ❌ Not implemented | No geolocation                |

## Next Steps

1. **Wallet integration**: Add token balance display, staking, and gift economy
2. **Real-time messaging**: Implement WebSocket or Nostr for live chat
3. **Push notifications**: Set up FCM (Android) and APNS (iOS)
4. **Media handling**: Camera access, photo upload, image compression
5. **Location services**: Geolocation for nearby matching
6. **Offline support**: SQLite for local data persistence
7. **Performance**: Lazy loading, image caching, bundle optimization

## Architecture

```
apps/mobile/
├── app/              # Expo Router screens
│   ├── auth.tsx      # Login/register
│   ├── home.tsx      # Profile swiping
│   ├── chat.tsx      # Messaging
│   ├── profile.tsx   # User profile
│   └── settings.tsx  # App settings
├── store/            # State management
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── lib/              # Utilities
│   └── wagmi.tsx     # Wallet config
└── i18n/             # Translations (shared with web)
```

## Testing

Mobile is tested via `npm run web` (web browser). Android SDK is not installed on the dev machine, so native testing is not available.
