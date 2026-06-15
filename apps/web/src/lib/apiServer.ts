import { IncomingMessage, ServerResponse } from "http";
import { dbService } from "./db";
import { generateNonce, SiweMessage } from "siwe";
import { parse as parseUrl } from "url";
import { otpStore } from "./otp-store";

// Simple in-memory session store
const sessions: Record<
  string,
  { userId: string; ethAddress?: string; email?: string; phoneNumber?: string }
> = {};
// Simple nonce store
const nonces: Record<string, { nonce: string; expires: number }> = {};

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Helper to parse JSON body from request
function getJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

// Helper to parse cookies
function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts[0].trim()] = decodeURIComponent((parts[1] || "").trim());
    });
  }
  return list;
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const parsedUrl = parseUrl(req.url || "", true);
  const pathname = parsedUrl.pathname || "";

  if (!pathname.startsWith("/api")) {
    return false;
  }

  // Set default CORS and JSON headers
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return true;
  }

  try {
    const cookies = parseCookies(req);
    let sessionId = cookies["siwe_session"] || cookies["email_session"];

    // Support Session ID in Authorization header as well
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      sessionId = authHeader.substring(7);
    }

    const session = sessionId ? sessions[sessionId] : null;

    // --- 1. SIWE AUTH ENDPOINTS ---

    // GET /api/auth/siwe/nonce
    if (pathname === "/api/auth/siwe/nonce" && req.method === "GET") {
      const nonce = generateNonce();
      const id = Math.random().toString(36).substring(2, 11);
      nonces[id] = { nonce, expires: Date.now() + 5 * 60 * 1000 };

      res.setHeader(
        "Set-Cookie",
        `siwe_nonce_id=${id}; Path=/; HttpOnly; SameSite=Lax`,
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ nonce }));
      return true;
    }

    // POST /api/auth/siwe/verify
    if (pathname === "/api/auth/siwe/verify" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { message, signature } = body;

      const siweMessage = new SiweMessage(message);
      const verification = await siweMessage.verify({ signature });

      if (verification.success) {
        const ethAddress = verification.data.address.toLowerCase();

        let user = await dbService.getUserByAddress(ethAddress);
        if (!user) {
          user = await dbService.createUser(ethAddress);
          await dbService.upsertProfile(user.id, {
            name: `EthUser-${ethAddress.substring(2, 6)}`,
            age: 25,
            bio: "Vouched match user.",
            interests: ["Ethereum", "Web3"],
            verifiedStd: false,
            verifiedDna: false,
            reputationScore: 5.0,
            voters: [],
          });
          user = await dbService.getUserByAddress(ethAddress);
        }

        const newSessionId =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        sessions[newSessionId] = { userId: user!.id, ethAddress };

        res.setHeader(
          "Set-Cookie",
          `siwe_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`,
        );
        res.statusCode = 200;
        res.end(
          JSON.stringify({ success: true, user, sessionId: newSessionId }),
        );
      } else {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ success: false, error: "Verification failed" }),
        );
      }
      return true;
    }

    // GET /api/auth/siwe/session
    if (pathname === "/api/auth/siwe/session" && req.method === "GET") {
      if (session && session.ethAddress) {
        const user = await dbService.getUserByAddress(session.ethAddress);
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: true, session, user }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: false }));
      }
      return true;
    }

    // POST /api/auth/siwe/logout
    if (pathname === "/api/auth/siwe/logout" && req.method === "POST") {
      if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
      }
      res.setHeader(
        "Set-Cookie",
        "siwe_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }

    // --- PHONE OTP AUTH ENDPOINTS ---

    // POST /api/auth/phone/request-otp
    if (pathname === "/api/auth/phone/request-otp" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { phoneNumber } = body;
      if (!phoneNumber) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Phone number required" }));
        return true;
      }

      // Validate phone number format (basic validation)
      if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: "Invalid phone number format. Use format: +380XXXXXXXXX",
          }),
        );
        return true;
      }

      // Generate OTP using the OTP store
      const otp = otpStore.generateOTP();
      otpStore.storeOTP(phoneNumber, otp);

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, expiresIn: 600 }));
      return true;
    }

    // POST /api/auth/phone/verify-otp
    if (pathname === "/api/auth/phone/verify-otp" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { phoneNumber, otp } = body;
      if (!phoneNumber || !otp) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Phone number and OTP required" }));
        return true;
      }

      // Verify OTP using the OTP store
      const isValid = otpStore.verifyOTP(phoneNumber, otp);
      if (!isValid) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ success: false, error: "Invalid or expired OTP" }),
        );
        return true;
      }

      // Valid OTP - create or update user
      let user = await dbService.getUserByPhone(phoneNumber);
      if (!user) {
        user = await dbService.createUserWithPhone(phoneNumber);
        // Auto-create profile on first login
        await dbService.upsertProfile(user.id, {
          name: `User-${phoneNumber.slice(-4)}`,
          age: 25,
          bio: "New Evolve member",
          interests: [],
          verifiedStd: false,
          verifiedDna: false,
          reputationScore: 5.0,
          voters: [],
        });
        user = (await dbService.getUserByPhone(phoneNumber)) || user;
      }

      const newSessionId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, phoneNumber };

      res.setHeader(
        "Set-Cookie",
        `phone_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`,
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, sessionId: newSessionId, user }));
      return true;
    }

    // GET /api/auth/phone/session
    if (pathname === "/api/auth/phone/session" && req.method === "GET") {
      const pSessionId = cookies["phone_session"] || sessionId;
      const pSession = pSessionId ? sessions[pSessionId] : null;

      if (pSession && pSession.phoneNumber) {
        const user = await dbService.getUserByPhone(pSession.phoneNumber);
        res.statusCode = 200;
        res.end(
          JSON.stringify({ authenticated: true, session: pSession, user }),
        );
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: false }));
      }
      return true;
    }

    // POST /api/auth/phone/logout
    if (pathname === "/api/auth/phone/logout" && req.method === "POST") {
      const pSessionId = cookies["phone_session"] || sessionId;
      if (pSessionId && sessions[pSessionId]) {
        delete sessions[pSessionId];
      }
      res.setHeader(
        "Set-Cookie",
        "phone_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }

    // --- 2. EMAIL AUTH ENDPOINTS ---

    // POST /api/auth/email/register
    if (pathname === "/api/auth/email/register" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { email, password } = body;
      if (!email || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Email and password required" }));
        return true;
      }

      const existing = await dbService.getUserByEmail(email);
      if (existing) {
        res.statusCode = 409;
        res.end(JSON.stringify({ error: "User already exists" }));
        return true;
      }

      const passwordHash = simpleHash(password);
      let user = await dbService.createUserWithEmail(email, passwordHash);
      await dbService.upsertProfile(user.id, {
        name: email.split("@")[0],
        age: 25,
        bio: "New Evolve member.",
        interests: [],
        verifiedStd: false,
        verifiedDna: false,
        reputationScore: 5.0,
        voters: [],
      });

      user = (await dbService.getUserByEmail(email)) || user;

      const newSessionId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };

      res.setHeader(
        "Set-Cookie",
        `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`,
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      return true;
    }

    // POST /api/auth/email/login
    if (pathname === "/api/auth/email/login" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { email, password } = body;
      if (!email || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Email and password required" }));
        return true;
      }

      const user = await dbService.getUserByEmail(email);
      if (!user) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid credentials" }));
        return true;
      }

      const passwordHash = simpleHash(password);
      if (user.passwordHash !== passwordHash) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid credentials" }));
        return true;
      }

      const newSessionId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };

      res.setHeader(
        "Set-Cookie",
        `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`,
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      return true;
    }

    // POST /api/auth/email/logout
    if (pathname === "/api/auth/email/logout" && req.method === "POST") {
      if (sessionId && sessions[sessionId] && sessions[sessionId].email) {
        delete sessions[sessionId];
      }
      res.setHeader(
        "Set-Cookie",
        "email_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }

    // GET /api/auth/email/session
    if (pathname === "/api/auth/email/session" && req.method === "GET") {
      if (session && session.email) {
        const user = await dbService.getUserByEmail(session.email);
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: true, session, user }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: false }));
      }
      return true;
    }

    // --- 3. USERS & PROFILES ENDPOINTS ---

    // GET /api/users
    if (pathname === "/api/users" && req.method === "GET") {
      const users = await dbService.getUsers();
      res.statusCode = 200;
      res.end(JSON.stringify(users));
      return true;
    }

    // GET /api/profiles
    if (pathname === "/api/profiles" && req.method === "GET") {
      const profiles = await dbService.getProfiles();
      res.statusCode = 200;
      res.end(JSON.stringify(profiles));
      return true;
    }

    // GET /api/search/profiles
    if (pathname === "/api/search/profiles" && req.method === "GET") {
      const { mode, limit, offset } = parsedUrl.query;
      const limitNum = limit ? parseInt(limit as string) : 10;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      // Get all profiles with users
      const users = await dbService.getUsers();
      const allProfiles = users
        .filter((u: any) => u.profile)
        .map((u: any) => ({
          ...u.profile,
          user: {
            id: u.id,
            ethAddress: u.ethAddress,
            email: u.email,
            phoneNumber: u.phoneNumber,
          },
        }));

      // Filter by mode (basic implementation)
      let filteredProfiles = allProfiles;
      if (mode === "normal") {
        // Normal mode: filter by basic criteria
        filteredProfiles = allProfiles.filter((p: any) => {
          // Basic filtering - can be enhanced with actual criteria
          return p.reputationScore >= 0;
        });
      } else if (mode === "pregnancy-bond") {
        // Pregnancy bond mode: filter for family-oriented profiles
        filteredProfiles = allProfiles.filter((p: any) => {
          return (
            p.interests &&
            p.interests.some(
              (i: string) =>
                i.toLowerCase().includes("family") ||
                i.toLowerCase().includes("children") ||
                i.toLowerCase().includes("parent"),
            )
          );
        });
      } else if (mode === "cryptic-choice") {
        // Cryptic choice mode: filter for anonymous/privacy-focused profiles
        filteredProfiles = allProfiles.filter((p: any) => {
          return (
            p.interests &&
            p.interests.some(
              (i: string) =>
                i.toLowerCase().includes("privacy") ||
                i.toLowerCase().includes("anonymous") ||
                i.toLowerCase().includes("crypto"),
            )
          );
        });
      }

      // Sort by reputation score DESC
      filteredProfiles.sort(
        (a: any, b: any) => b.reputationScore - a.reputationScore,
      );

      // Apply pagination
      const paginatedProfiles = filteredProfiles.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          profiles: paginatedProfiles,
          total: filteredProfiles.length,
          limit: limitNum,
          offset: offsetNum,
        }),
      );
      return true;
    }

    // POST /api/profiles/upsert
    if (pathname === "/api/profiles/upsert" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const profile = await dbService.upsertProfile(session.userId, body);
      res.statusCode = 200;
      res.end(JSON.stringify(profile));
      return true;
    }

    // --- 4. MATCHES ENDPOINTS ---

    // GET /api/matches
    if (pathname === "/api/matches" && req.method === "GET") {
      const matches = await dbService.getMatches();
      res.statusCode = 200;
      res.end(JSON.stringify(matches));
      return true;
    }

    // POST /api/matches
    if (pathname === "/api/matches" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const { matchedUserId } = body;
      const match = await dbService.createMatch(session.userId, matchedUserId);
      res.statusCode = 200;
      res.end(JSON.stringify(match));
      return true;
    }

    // --- 5. MESSAGES ENDPOINTS ---

    // GET /api/messages
    if (pathname === "/api/messages" && req.method === "GET") {
      const { senderId, receiverId } = parsedUrl.query;
      if (!senderId || !receiverId) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ error: "senderId and receiverId are required" }),
        );
        return true;
      }
      const messages = await dbService.getMessages(
        senderId as string,
        receiverId as string,
      );
      res.statusCode = 200;
      res.end(JSON.stringify(messages));
      return true;
    }

    // POST /api/messages
    if (pathname === "/api/messages" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      if (body.senderId !== session.userId) {
        res.statusCode = 403;
        res.end(
          JSON.stringify({ error: "Forbidden: senderId must match session" }),
        );
        return true;
      }
      const message = await dbService.createMessage(body);
      res.statusCode = 200;
      res.end(JSON.stringify(message));
      return true;
    }

    // POST /api/messages/status
    if (pathname === "/api/messages/status" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const { messageId, status } = body;
      const message = await dbService.updateMessageRequestStatus(
        messageId,
        status,
      );
      res.statusCode = 200;
      res.end(JSON.stringify(message));
      return true;
    }

    // --- 6. DOCUMENTS ENDPOINTS ---

    // GET /api/documents
    if (pathname === "/api/documents" && req.method === "GET") {
      const { userId } = parsedUrl.query;
      if (!userId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "userId is required" }));
        return true;
      }
      const documents = await dbService.getDocuments(userId as string);
      res.statusCode = 200;
      res.end(JSON.stringify(documents));
      return true;
    }

    // POST /api/documents
    if (pathname === "/api/documents" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      if (body.userId !== session.userId) {
        res.statusCode = 403;
        res.end(
          JSON.stringify({ error: "Forbidden: userId must match session" }),
        );
        return true;
      }
      const document = await dbService.createDocument(body);
      res.statusCode = 200;
      res.end(JSON.stringify(document));
      return true;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
    return true;
  } catch (error: any) {
    console.error("API Error:", error);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    );
    return true;
  }
}
