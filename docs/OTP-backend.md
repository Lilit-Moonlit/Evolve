# OTP Backend

## Overview

Phone-based OTP authentication for Evolve. Currently uses in-memory store (dev mode). Production should use Redis or a database.

## Endpoints

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| POST   | `/api/auth/phone/request-otp` | Send OTP to phone number       |
| POST   | `/api/auth/phone/verify-otp`  | Verify OTP code                |
| GET    | `/api/auth/phone/session`     | Get current phone auth session |
| POST   | `/api/auth/phone/logout`      | Logout phone auth session      |

## Request OTP

```http
POST /api/auth/phone/request-otp
Content-Type: application/json

{
  "phoneNumber": "+380501234567"
}
```

**Response (200):**

```json
{
  "success": true,
  "expiresIn": 600
}
```

**Validation:**

- Phone number must match E.164 format: `+[1-9]\d{1,14}`
- Example: `+380501234567`

## Verify OTP

```http
POST /api/auth/phone/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+380501234567",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "sessionId": "abc123xyz",
  "user": {
    "id": "u1",
    "phoneNumber": "+380501234567"
  }
}
```

## OTP Store

- **Code**: 6-digit numeric
- **Expiry**: 10 minutes
- **Max attempts**: 3
- **Storage**: In-memory (`otp-store.ts`)
- **Dev mode**: OTP logged to console (no SMS)

## Client Module

```typescript
import { requestPhoneOtp, verifyPhoneOtp } from "./lib/phoneAuth";

// Request OTP
const result = await requestPhoneOtp("+380501234567");
if (!result.success) throw new Error(result.error);

// Verify OTP
const verify = await verifyPhoneOtp("+380501234567", "123456");
if (verify.success) {
  console.log("Logged in as", verify.user);
}
```

## Production TODO

- [ ] Replace in-memory store with Redis
- [ ] Integrate real SMS provider (Twilio, MessageBird)
- [ ] Add rate limiting (per phone number)
- [ ] Add SMS delivery status tracking
