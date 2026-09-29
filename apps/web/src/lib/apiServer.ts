import { IncomingMessage, ServerResponse } from "http";
import { createHash } from "crypto";
import { dbService } from "./db";
import { generateNonce, SiweMessage } from "siwe";
import { parse as parseUrl } from "url";

import { WebSocketServer, WebSocket } from "ws";
import { kv } from "./kv";
import {
  FAUCET_AMOUNT_TOKENS,
  isAdminConfigured,
  mintEvolve,
  mintEvolveAmount,
  relayDnaRevoke,
  relayDnaVerify,
} from "./adminChain";
import { checkStdCompatibility, parseStdTestResult } from "./std-parser";
import { generateLabEmail, parseUserIdFromLabEmail } from "./lab-report";
import { CHECK_TTL_MS, canonicalUsername, riskLevelToVerdict, validateUsername } from "./checks";
import { extractPdfText } from "./pdf-text";
import { grantRegistrationReward } from "./registration-reward";

// --- WebSocket Chat Server ---
interface WsClient {
  ws: WebSocket;
  userId: string;
  username: string;
}

const wsClients = new Map<string, WsClient[]>(); // channelId -> clients

function createChannelId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join(":");
}

export function setupWebSocketServer(server: any) {
  // noServer:true + manual upgrade-dispatch. Attaching a path-scoped
  // WebSocketServer directly to the shared HTTP server (as prior versions
  // did with `{ server, path: "/ws" }`) hijacked/conflicted with Vite's own
  // HMR websocket on the same httpServer, producing "Invalid frame header"
  // and an endless full-page reload loop (white screen in dev). Here we only
  // claim `/ws` upgrade requests and let Vite handle everything else.
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req: any, socket: any, head: any) => {
    if (!req.url || !req.url.startsWith("/ws")) {
      return; // not ours — leave it for Vite's HMR websocket
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocket) => {
    let userId: string | null = null;
    let username: string | null = null;
    let channelId: string | null = null;
    let targetUserId: string | null = null;

    ws.on("message", async (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "join") {
          userId = msg.userId;
          username = msg.username || "Anonymous";
          targetUserId = msg.targetUserId;
          if (!userId || !targetUserId || userId === targetUserId) {
            ws.close(1008, "Invalid chat participants");
            return;
          }
          channelId = createChannelId(userId, targetUserId);

          if (!wsClients.has(channelId)) {
            wsClients.set(channelId, []);
          }
          wsClients.get(channelId)!.push({ ws, userId: userId!, username: username! });

          ws.send(JSON.stringify({ type: "joined", channelId }));
          const history = await dbService.getMessages(userId, targetUserId);
          ws.send(
            JSON.stringify({
              type: "history",
              messages: history.map((message: any) => ({
                type: "message",
                id: message.id,
                senderId: message.senderId,
                senderName: message.senderName || "",
                text: message.text,
                timestamp: message.timestamp || message.time || message.createdAt,
              })),
            }),
          );
          broadcastToChannel(
            channelId,
            {
              type: "user_joined",
              userId,
              username,
            },
            ws,
          );
        }

        if (msg.type === "message" && channelId && userId && targetUserId) {
          const text = typeof msg.text === "string" ? msg.text.trim() : "";
          if (!text) return;
          const chatMsg = {
            type: "message",
            id: Date.now().toString(),
            senderId: userId,
            senderName: username,
            text,
            timestamp: new Date().toISOString(),
          };

          // Persist to database
          dbService.createMessage({
            senderId: userId,
            receiverId: targetUserId,
            text,
            time: new Date().toISOString(),
            isRequest: false,
          });

          broadcastToChannel(channelId, chatMsg);
        }

        if (msg.type === "typing" && channelId && userId) {
          broadcastToChannel(
            channelId,
            {
              type: "typing",
              userId,
              username,
            },
            ws,
          );
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    });

    ws.on("close", () => {
      if (channelId && userId) {
        const clients = wsClients.get(channelId);
        if (clients) {
          const idx = clients.findIndex((c) => c.userId === userId);
          if (idx !== -1) {
            broadcastToChannel(
              channelId,
              {
                type: "user_left",
                userId,
                username,
              },
              clients[idx].ws,
            );
            clients.splice(idx, 1);
          }
          if (clients.length === 0) {
            wsClients.delete(channelId);
          }
        }
      }
    });
  });

  return wss;
}

function broadcastToChannel(channelId: string, message: any, exclude?: WebSocket) {
  const clients = wsClients.get(channelId);
  if (clients) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN && client.ws !== exclude) {
        client.ws.send(data);
      }
    });
  }
}

// --- Rate Limiter (in-memory) ---
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // per window

function getClientIp(req: IncomingMessage): string {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "127.0.0.1";
}

function isRateLimited(req: IncomingMessage): boolean {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  return false;
}

// Clean up expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
);

// Simple in-memory session store. Regular user sessions have a real `userId`
// (+ `ethAddress` for SIWE, `email` for email auth). Partner (lab) sessions
// are distinguished by `kind: "partner"` and carry `partnerId`; their
// `userId` is left empty — every existing route that checks `session.userId`
// must also verify `session.kind !== "partner"` (see partner endpoints below).
const sessions: Record<string, SessionData> = {};

interface SessionData {
  userId: string;
  ethAddress?: string;
  email?: string;
  kind?: "partner";
  partnerId?: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// SHA-256 password hashing for partner (lab) accounts. Partners use
// email + password auth because they do not have a crypto wallet.
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function createSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function setSessionCookie(res: ServerResponse, cookieName: string, sessionId: string): void {
  res.setHeader("Set-Cookie", `${cookieName}=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
}

function clearSessionCookie(res: ServerResponse, cookieName: string): void {
  res.setHeader("Set-Cookie", `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
}

// Returns the STD result text for the given userId: the manually supplied
// `stdTestResult` first, then a lab report's rawText as verified fallback.
async function getVerifiedStdText(userId: string): Promise<string | null> {
  const profile = await dbService.getProfileByUserId(userId);
  if (profile?.stdTestResult) return profile.stdTestResult;
  const reports = await dbService.getLabReports(userId);
  const accepted = reports.find((r: any) => r.status === "accepted");
  if (accepted?.rawText) return accepted.rawText;
  return null;
}

// Minimal public card for another person/lab — see the config below on why
// only the STD-facing subset is exposed.
function userPublicCard(userId: string, profile: any) {
  return {
    userId,
    username: profile?.username || null,
    name: profile?.name || null,
    imageUrl: profile?.imageUrl || null,
    verifiedStd: Boolean(profile?.verifiedStd),
    verifiedDna: Boolean(profile?.verifiedDna),
    rating: typeof profile?.reputationScore === "number" ? profile.reputationScore : null,
  };
}

// Face-match threshold for lab partner verification (same as
// SIMILARITY_THRESHOLD in face-verification.ts, kept local because that
// module is browser-only via MediaPipe).
const FACE_SIMILARITY_THRESHOLD = 0.75;

// Cosine similarity between two equal-length numeric vectors, in [0, 1].
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return Math.max(0, Math.min(1, dot / denominator));
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return true;
  }

  // Rate limiting
  if (isRateLimited(req)) {
    res.statusCode = 429;
    res.end(JSON.stringify({ error: "Too many requests. Please try again later." }));
    return true;
  }

  try {
    const cookies = parseCookies(req);
    let sessionId =
      cookies["siwe_session"] || cookies["email_session"] || cookies["partner_session"];

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
      const address =
        (parsedUrl.query.address as string) || "0x0000000000000000000000000000000000000000";
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await dbService.createNonce(nonce, address.toLowerCase(), expiresAt);

      res.statusCode = 200;
      res.end(JSON.stringify({ nonce }));
      return true;
    }

    // POST /api/auth/siwe/verify
    if (pathname === "/api/auth/siwe/verify" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { message, signature } = body;

      const siweMessage = new SiweMessage(message);

      // Verify nonce is valid and not expired
      const nonceRecord = await dbService.getNonce(siweMessage.nonce);
      if (!nonceRecord || nonceRecord.used || new Date(nonceRecord.expiresAt) < new Date()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Nonce is invalid or expired" }));
        return true;
      }

      const verification = await siweMessage.verify({ signature });

      if (verification.success) {
        // Mark nonce as used
        await dbService.markNonceUsed(siweMessage.nonce);

        const ethAddress = verification.data.address.toLowerCase();

        let user = await dbService.getUserByAddress(ethAddress);
        if (!user) {
          user = await dbService.createUser(ethAddress);
          await dbService.upsertProfile(user.id, {
            name: `EthUser-${ethAddress.substring(2, 6)}`,
            age: 25,
            bio: "Vouched match user.",
            interests: ["Ethereum", "Web3"],
            imageUrl: "",
            ageHidden: false,
            languages: [],
            photoBlurred: false,
            photoGrants: {},
            onboardingComplete: false,
            verifiedStd: false,
            verifiedDna: false,
            reputationScore: 5.0,
            voters: [],
          });
          // Welcome faucet: fund new wallet users so they can use gifts/EvolveFund.
          // Fire-and-forget: never blocks login.
          if (isAdminConfigured()) {
            mintEvolve(ethAddress)
              .then(() => console.log(`[faucet] Welcome mint to ${ethAddress}`))
              .catch((err) =>
                console.error(`[faucet] Welcome mint failed for ${ethAddress}:`, err),
              );
          }
          user = await dbService.getUserByAddress(ethAddress);
        }

        const newSessionId =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessions[newSessionId] = { userId: user!.id, ethAddress };

        res.setHeader("Set-Cookie", `siwe_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Verification failed" }));
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
      res.setHeader("Set-Cookie", "siwe_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }

    // --- 2. EMAIL AUTH ENDPOINTS ---

    // POST /api/auth/email/send-verification
    if (pathname === "/api/auth/email/send-verification" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { email } = body;
      if (!email) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Email required" }));
        return true;
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await kv.set(
        `emailotp:${email.toLowerCase()}`,
        JSON.stringify({ code, expires: Date.now() + 10 * 60 * 1000 }),
        10 * 60 * 1000,
      );

      // In production, send email here (e.g., via SendGrid, Resend, etc.)
      console.log(`[DEV] Email verification code for ${email}: ${code}`);

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, expiresIn: 600 }));
      return true;
    }

    // POST /api/auth/email/verify-code
    if (pathname === "/api/auth/email/verify-code" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { email, code } = body;
      if (!email || !code) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Email and code required" }));
        return true;
      }

      const raw = await kv.get(`emailotp:${email.toLowerCase()}`);
      let entry: { code: string; expires: number } | null = null;
      if (raw) {
        try {
          entry = JSON.parse(raw) as { code: string; expires: number };
        } catch {
          entry = null;
        }
      }
      if (!entry || entry.code !== code || Date.now() > entry.expires) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "INVALID_CODE" }));
        return true;
      }

      // Delete used code
      await kv.del(`emailotp:${email.toLowerCase()}`);

      // Find or create user
      let user = await dbService.getUserByEmail(email);
      if (!user) {
        user = await dbService.createUserWithEmail(email, "");
        await dbService.upsertProfile(user.id, {
          name: email.split("@")[0],
          age: 25,
          bio: "New Evolve member.",
          interests: [],
          imageUrl: "",
          ageHidden: false,
          languages: [],
          photoBlurred: false,
          photoGrants: {},
          onboardingComplete: false,
          verifiedStd: false,
          verifiedDna: false,
          reputationScore: 5.0,
          voters: [],
        });
        user = await dbService.getUserByEmail(email);
      }

      const newSessionId =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user!.id, email };

      res.setHeader(
        "Set-Cookie",
        `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      return true;
    }

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
        imageUrl: "",
        ageHidden: false,
        languages: [],
        photoBlurred: false,
        photoGrants: {},
        onboardingComplete: false,
        verifiedStd: false,
        verifiedDna: false,
        reputationScore: 5.0,
        voters: [],
      });

      user = (await dbService.getUserByEmail(email)) || user;

      const newSessionId =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };

      res.setHeader(
        "Set-Cookie",
        `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
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
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };

      res.setHeader(
        "Set-Cookie",
        `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
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
      res.setHeader("Set-Cookie", "email_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
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

    // POST /api/auth/set-security-question — save/update the security question
    // + hashed answer used for account recovery (authenticated).
    if (pathname === "/api/auth/set-security-question" && req.method === "POST") {
      if (!session || !session.email) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      try {
        const { createHash } = await import("crypto");
        const body = await getJsonBody(req);
        const { question, answer } = body;
        if (!question || !String(question).trim() || !answer || !String(answer).trim()) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "question and answer are required" }));
          return true;
        }
        const answerHash = createHash("sha256")
          .update(String(answer).toLowerCase().trim())
          .digest("hex");
        await dbService.setSecurityQuestion(session.email, String(question).trim(), answerHash);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error("[set-security-question] Error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Failed to save security question" }));
      }
      return true;
    }

    // --- 2.5 PARTNER (LAB) AUTH ENDPOINTS ---

    // POST /api/partner/register
    if (pathname === "/api/partner/register" && req.method === "POST") {
      const body = await getJsonBody(req);
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";
      if (!name || !email || password.length < 6) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "name, email and password (min 6 chars) required" }));
        return true;
      }
      const existingPartner = await dbService.getPartnerByEmail(email);
      if (existingPartner) {
        res.statusCode = 409;
        res.end(JSON.stringify({ error: "Partner with this email already exists" }));
        return true;
      }
      const partner = await dbService.createPartner("lab", name, email, hashPassword(password));
      const newPartnerSessionId = createSessionId();
      sessions[newPartnerSessionId] = { kind: "partner", partnerId: partner.id, userId: "" };
      setSessionCookie(res, "partner_session", newPartnerSessionId);
      res.statusCode = 200;
      res.end(
        JSON.stringify({ ok: true, id: partner.id, name: partner.name, apiKey: partner.apiKey }),
      );
      return true;
    }

    // POST /api/partner/login
    if (pathname === "/api/partner/login" && req.method === "POST") {
      const body = await getJsonBody(req);
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";
      if (!email || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "email and password are required" }));
        return true;
      }
      const loginPartner = await dbService.getPartnerByEmail(email);
      if (!loginPartner || loginPartner.passwordHash !== hashPassword(password)) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid credentials" }));
        return true;
      }
      const loginSessionId = createSessionId();
      sessions[loginSessionId] = { kind: "partner", partnerId: loginPartner.id, userId: "" };
      setSessionCookie(res, "partner_session", loginSessionId);
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, id: loginPartner.id, name: loginPartner.name }));
      return true;
    }

    // POST /api/partner/logout
    if (pathname === "/api/partner/logout" && req.method === "POST") {
      if (sessionId && sessions[sessionId]?.kind === "partner") {
        delete sessions[sessionId];
      }
      clearSessionCookie(res, "partner_session");
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return true;
    }

    // GET /api/partner/me
    if (pathname === "/api/partner/me" && req.method === "GET") {
      const partnerSession = session?.kind === "partner" ? session : null;
      if (!partnerSession?.partnerId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ authenticated: false }));
        return true;
      }
      const mePartner = await dbService.getPartnerById(partnerSession.partnerId);
      if (!mePartner) {
        res.statusCode = 401;
        res.end(JSON.stringify({ authenticated: false }));
        return true;
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ authenticated: true, id: mePartner.id, name: mePartner.name }));
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
      filteredProfiles.sort((a: any, b: any) => b.reputationScore - a.reputationScore);

      // Apply pagination
      const paginatedProfiles = filteredProfiles.slice(offsetNum, offsetNum + limitNum);

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
      // Persist the parsed STD result ("fast-search format") whenever a raw
      // stdTestResult arrives, so /api/profiles serves it ready-made and the
      // client no longer re-parses raw text per profile on every load.
      if (typeof body.stdTestResult === "string" && body.stdTestResult.trim() !== "") {
        body.parsedStd = parseStdTestResult(body.stdTestResult);
      }
      const profile = await dbService.upsertProfile(session.userId, body);
      res.statusCode = 200;
      res.end(JSON.stringify(profile));
      return true;
    }

    // --- 3.5 PUBLIC SAFE-SEX PAGE (evolve.eth/<username>) ---
    // Public page exposes ONLY the photo + a "Check" button. The username is
    // taken from the URL path: /api/public/profile/<username>.

    // GET /api/public/profile/:username
    const publicProfileMatch = pathname.match(/^\/api\/public\/profile\/([^/]+)$/);
    if (publicProfileMatch && req.method === "GET") {
      const username = decodeURIComponent(publicProfileMatch[1]);
      const publicProfile = await dbService.getPublicProfileByUsername(username);
      if (!publicProfile) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Profile not found or not public" }));
        return true;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(publicProfile));
      return true;
    }

    // GET /api/public-link/me — my own public-link state { username, publicLinkEnabled }
    if (pathname === "/api/public-link/me" && req.method === "GET") {
      if (!session || session.kind === "partner" || !session.userId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const link = await dbService.getPublicLinkByUserId(session.userId);
      res.statusCode = 200;
      res.end(JSON.stringify(link || { username: null, publicLinkEnabled: false }));
      return true;
    }

    // POST /api/public-link/update — { username?, enabled? } → set my public page.
    // Username is validated (validateUsername) and uniqueness-checked against
    // every profile (getUsernameOwner) before enabling.
    if (pathname === "/api/public-link/update" && req.method === "POST") {
      if (!session || session.kind === "partner" || !session.userId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const hasUsernameInput = typeof body.username === "string" && body.username.trim().length > 0;
      const current = await dbService.getPublicLinkByUserId(session.userId);
      // Keep the existing username when disabling/updating without a new one, so a
      // later re-enable doesn't force the user to reclaim (possibly taken) name.
      const rawUsername = hasUsernameInput
        ? body.username!.trim().toLowerCase()
        : (current?.username ?? "");
      const enabled = Boolean(body.enabled);
      if (enabled && !rawUsername) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Username is required to enable a public page" }));
        return true;
      }
      if (rawUsername) {
        const validationError = validateUsername(rawUsername);
        if (validationError) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: `Invalid username (${validationError})` }));
          return true;
        }
        const owner = await dbService.getUsernameOwner(rawUsername);
        if (owner && owner !== session.userId) {
          res.statusCode = 409;
          res.end(JSON.stringify({ error: "Username is already taken" }));
          return true;
        }
      }
      const canonical = canonicalUsername(rawUsername);
      const updated = await dbService.setPublicLink(session.userId, canonical || null, enabled);
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          ok: true,
          username: updated?.username ?? canonical ?? null,
          publicLinkEnabled: updated ? Boolean(updated.publicLinkEnabled) : enabled,
        }),
      );
      return true;
    }

    // --- 3.6 COMPATIBILITY CHECKS (person→person safe-sex verdict) ---
    // Flow: user A requests a check against user B → B approves (after seeing
    // A's photo) → both sides receive the anonymous verdict. Individual
    // pathogen status is NEVER disclosed. Requires an authenticated user
    // session (kind !== "partner").

    // POST /api/checks/request — { targetId } → creates a pending check
    if (pathname === "/api/checks/request" && req.method === "POST") {
      if (!session || session.kind === "partner" || !session.userId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const targetId = typeof body.targetId === "string" ? body.targetId.trim() : "";
      if (!targetId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "targetId is required" }));
        return true;
      }
      if (targetId === session.userId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Cannot request a check against yourself" }));
        return true;
      }
      const targetProfile = await dbService.getProfileByUserId(targetId);
      if (!targetProfile) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Target user not found" }));
        return true;
      }
      const pendingExists = await dbService.hasPendingCompatibilityCheckBetween(
        session.userId,
        targetId,
      );
      if (pendingExists) {
        res.statusCode = 409;
        res.end(JSON.stringify({ error: "A pending check already exists between you" }));
        return true;
      }
      const expiresAt = new Date(Date.now() + CHECK_TTL_MS);
      const check = await dbService.createCompatibilityCheck(session.userId, targetId, expiresAt);
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, checkId: check.id, expiresAt: expiresAt.toISOString() }));
      return true;
    }

    // GET /api/checks/pending — incoming checks awaiting my approval
    if (pathname === "/api/checks/pending" && req.method === "GET") {
      if (!session || session.kind === "partner" || !session.userId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const rows = await dbService.getPendingCompatibilityChecksForUser(session.userId);
      // Enrich each row with the requester's public card, never the STD data.
      const enriched = [];
      for (const row of rows) {
        const requesterProfile = await dbService.getProfileByUserId(row.requesterId);
        enriched.push({
          id: row.id,
          status: row.status,
          createdAt: row.createdAt,
          expiresAt: row.expiresAt,
          requester: userPublicCard(row.requesterId, requesterProfile),
        });
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ checks: enriched }));
      return true;
    }

    // GET /api/checks/inbox — full history (both directions), newest first
    if (pathname === "/api/checks/inbox" && req.method === "GET") {
      if (!session || session.kind === "partner" || !session.userId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const rows = await dbService.getCompatibilityChecksForUser(session.userId);
      const enriched = [];
      for (const row of rows) {
        const otherId = row.requesterId === session.userId ? row.targetId : row.requesterId;
        const otherProfile = await dbService.getProfileByUserId(otherId);
        enriched.push({
          id: row.id,
          direction: row.requesterId === session.userId ? "outgoing" : "incoming",
          status: row.status,
          verdict: row.verdict ?? null,
          createdAt: row.createdAt,
          expiresAt: row.expiresAt,
          other: userPublicCard(otherId, otherProfile),
        });
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ checks: enriched }));
      return true;
    }

    // POST /api/checks/:id/respond — { approve: boolean } → target approves
    // (approve=true) or denies. On approval, both STD results are read and a
    // compatibility verdict is computed server-side.
    const checkRespondMatch = pathname.match(/^\/api\/checks\/([^/]+)\/respond$/);
    if (checkRespondMatch && req.method === "POST") {
      if (!session || session.kind === "partner" || !session.userId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const checkId = checkRespondMatch[1];
      const body = await getJsonBody(req);
      const approve = Boolean(body.approve);
      const check = await dbService.getCompatibilityCheckById(checkId);
      if (!check) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Check not found" }));
        return true;
      }
      if (check.targetId !== session.userId) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Only the target may respond" }));
        return true;
      }
      if (check.status !== "pending") {
        res.statusCode = 409;
        res.end(JSON.stringify({ error: "Check already finalised" }));
        return true;
      }
      if (approve) {
        // Read both STD results — if either is missing, the verdict is
        // "incomplete" (the UI shows the requester needs to complete their test).
        const requesterText = await getVerifiedStdText(check.requesterId);
        const targetText = await getVerifiedStdText(check.targetId);
        let verdict: string;
        if (!requesterText || !targetText) {
          verdict = "incomplete";
        } else {
          verdict = riskLevelToVerdict(
            checkStdCompatibility(parseStdTestResult(requesterText), parseStdTestResult(targetText))
              .riskLevel,
          );
        }
        await dbService.updateCompatibilityCheck(checkId, { status: "approved", verdict });
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true, status: "approved", verdict }));
        return true;
      } else {
        await dbService.updateCompatibilityCheck(checkId, { status: "denied", verdict: null });
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true, status: "denied" }));
        return true;
      }
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

    // GET /api/messages/peers — distinct conversation partner IDs for a user.
    // Single lightweight call replacing the per-profile `/api/messages` N+1
    // (which previously caused rate-limit 429 spam on profile load).
    if (pathname === "/api/messages/peers" && req.method === "GET") {
      const { userId } = parsedUrl.query;
      if (!userId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "userId is required" }));
        return true;
      }
      const peers = await dbService.getConversationPeers(userId as string);
      res.statusCode = 200;
      res.end(JSON.stringify(peers));
      return true;
    }

    // GET /api/messages
    if (pathname === "/api/messages" && req.method === "GET") {
      const { senderId, receiverId } = parsedUrl.query;
      if (!senderId || !receiverId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "senderId and receiverId are required" }));
        return true;
      }
      const messages = await dbService.getMessages(senderId as string, receiverId as string);
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
        res.end(JSON.stringify({ error: "Forbidden: senderId must match session" }));
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
      const message = await dbService.updateMessageRequestStatus(messageId, status);
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
        res.end(JSON.stringify({ error: "Forbidden: userId must match session" }));
        return true;
      }
      const document = await dbService.createDocument(body);
      res.statusCode = 200;
      res.end(JSON.stringify(document));
      return true;
    }

    // --- LAB REPORTS ENDPOINTS (provider-agnostic testing flow) ---

    // GET /api/lab/email?userId=...
    if (pathname === "/api/lab/email" && req.method === "GET") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const { userId } = parsedUrl.query;
      if (!userId || String(userId) !== session.userId) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Forbidden: userId must match session" }));
        return true;
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ email: generateLabEmail(String(userId)) }));
      return true;
    }

    // GET /api/lab/pending?userId=...
    if (pathname === "/api/lab/pending" && req.method === "GET") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const { userId } = parsedUrl.query;
      if (!userId || String(userId) !== session.userId) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Forbidden: userId must match session" }));
        return true;
      }
      const reports = await dbService.getLabReports(String(userId));
      const pending = reports.filter((r: any) => r.status === "pending");
      res.statusCode = 200;
      res.end(JSON.stringify(pending));
      return true;
    }

    // POST /api/lab/accept — accept a pending lab report (attach STD result)
    if (pathname === "/api/lab/accept" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      if (!body.reportId || body.accept === undefined) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "reportId and accept are required" }));
        return true;
      }
      const reports = await dbService.getLabReports(session.userId);
      const report = reports.find((r: any) => r.id === body.reportId);
      if (!report) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Report not found" }));
        return true;
      }
      if (body.accept === true) {
        await dbService.updateLabReportStatus(report.id, "accepted");
        // Attach a verified STD document to the profile (for compatibility checks)
        await dbService.createDocument({
          userId: session.userId,
          name: "Lab STD Report",
          size: `${(report.rawText || "").length}`,
          type: "STD",
          uploadDate: new Date().toISOString(),
          isRedacted: false,
          redactedFields: [],
          status: "verified",
          resultText: report.rawText || "",
        });
        // Verified STD text now powers server-side compatibility checks
        // (the /api/checks/* flow reads it via getVerifiedStdText).
        await dbService.upsertProfile(session.userId, {
          verifiedStd: true,
          stdTestResult: report.rawText || undefined,
          parsedStd: parseStdTestResult(report.rawText || ""),
        });
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true, status: "accepted" }));
        return true;
      } else {
        await dbService.updateLabReportStatus(report.id, "rejected");
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true, status: "rejected" }));
        return true;
      }
    }

    // POST /api/lab/report — ingest a lab report by source email (provider-agnostic)
    // Accepts either `rawText` (plain lab result text) or `pdfBase64` (base64-encoded
    // PDF or image). PDFs are run through extractPdfText (text layer, then OCR fallback)
    // so scanned reports land in the same parsing pipeline as pasted text.
    if (pathname === "/api/lab/report" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const { to, rawText } = body;
      if (!to || (!rawText && !body.pdfBase64)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "to and rawText (or pdfBase64) are required" }));
        return true;
      }
      // Resolve the per-user unique lab email alias back to the owning userId.
      const ownerUserId = parseUserIdFromLabEmail(String(to));
      if (!ownerUserId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Unrecognized lab email alias" }));
        return true;
      }
      // Only the session user (or the report owner) may submit; keep it simple:
      // require the resolved owner to be the session user.
      if (ownerUserId !== session.userId) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Forbidden" }));
        return true;
      }

      let text = rawText !== undefined ? String(rawText) : "";
      let attachSource: "email" | "pdf" = "email";
      if (!text && typeof body.pdfBase64 === "string" && body.pdfBase64) {
        const buf = Buffer.from(body.pdfBase64, "base64");
        const extracted = await extractPdfText(new Uint8Array(buf));
        text = extracted.text;
        attachSource = "pdf";
        if (!text) {
          res.statusCode = 422;
          res.end(JSON.stringify({ error: "No readable text found in the uploaded PDF" }));
          return true;
        }
      }
      const parsed = parseStdTestResult(text);
      const report = await dbService.createLabReport({
        userId: ownerUserId,
        source: attachSource,
        rawText: text,
        parsed,
        status: "pending",
      });
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, report }));
      return true;
    }

    // --- LAB PARTNER ENDPOINTS (on-site lab portal, authenticated by API key) ---
    // Privacy: the lab NEVER receives the user's name, photo, or profile data.
    // It only gets {matched, similarity} back from /verify and may attach a
    // report to a userId it successfully face-matched.

    // POST /api/lab/partner/wallet — { apiKey, walletAddress }
    if (pathname === "/api/lab/partner/wallet" && req.method === "POST") {
      const body = await getJsonBody(req);
      const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
      const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
      const lab = await dbService.getLabPartnerByApiKey(apiKey);
      if (!lab) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid API key" }));
        return true;
      }
      if (!/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid wallet address" }));
        return true;
      }
      await dbService.setLabPartnerWallet(lab.id, walletAddress);
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return true;
    }

    // POST /api/lab/partner/register — create a lab partner, returns its API key
    if (pathname === "/api/lab/partner/register" && req.method === "POST") {
      const body = await getJsonBody(req);
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
      if (!name || !email) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "name and email are required" }));
        return true;
      }
      const lab = await dbService.createLabPartner(name, email);
      if (/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
        await dbService.setLabPartnerWallet(lab.id, walletAddress);
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, id: lab.id, name: lab.name, apiKey: lab.apiKey }));
      return true;
    }

    // POST /api/lab/partner/verify — compare a lab-captured face embedding against
    // the patient's stored embedding. Returns ONLY {matched, similarity}.
    if (pathname === "/api/lab/partner/verify" && req.method === "POST") {
      const body = await getJsonBody(req);
      const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
      const userId = typeof body.userId === "string" ? body.userId.trim() : "";
      const embedding = Array.isArray(body.embedding) ? (body.embedding as number[]) : null;
      if (!apiKey || !userId || !embedding) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "apiKey, userId and embedding are required" }));
        return true;
      }
      const lab = await dbService.getLabPartnerByApiKey(apiKey);
      if (!lab) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid API key" }));
        return true;
      }
      const profile = await dbService.getProfileByUserId(userId);
      const storedEmbedding: number[] | null = Array.isArray(profile?.faceEmbedding)
        ? (profile.faceEmbedding as number[])
        : null;
      if (!storedEmbedding) {
        res.statusCode = 200;
        res.end(JSON.stringify({ matched: false, similarity: 0, reason: "no_embedded_face" }));
        return true;
      }
      if (storedEmbedding.length !== embedding.length) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({ matched: false, similarity: 0, reason: "embedding_dimension_mismatch" }),
        );
        return true;
      }
      const similarity = cosineSimilarity(storedEmbedding, embedding);
      res.statusCode = 200;
      res.end(JSON.stringify({ matched: similarity >= FACE_SIMILARITY_THRESHOLD, similarity }));
      return true;
    }

    // POST /api/lab/partner/report — lab attaches a parsed STD report to a patient.
    // Requires a valid API key; face-match status reflects that the lab verified
    // the patient's identity via the on-site camera.
    if (pathname === "/api/lab/partner/report" && req.method === "POST") {
      const body = await getJsonBody(req);
      const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
      const userId = typeof body.userId === "string" ? body.userId.trim() : "";
      const rawText = typeof body.rawText === "string" ? body.rawText.trim() : "";
      const faceMatchStatus =
        typeof body.faceMatchStatus === "string" ? body.faceMatchStatus : "matched";
      if (!apiKey || !userId || !rawText) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "apiKey, userId and rawText are required" }));
        return true;
      }
      const lab = await dbService.getLabPartnerByApiKey(apiKey);
      if (!lab) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid API key" }));
        return true;
      }
      // Do not leak the user's identity/profile to the lab; we only check existence.
      const profile = await dbService.getProfileByUserId(userId);
      if (!profile) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Patient not found" }));
        return true;
      }
      const parsed = parseStdTestResult(rawText);
      const report = await dbService.createLabReport({
        userId,
        source: "lab",
        rawText,
        parsed,
        status: "pending",
        faceMatchStatus,
        labPartnerName: lab.name,
      });
      // Product decision: the lab already verified the patient (API key +
      // face-match), so the parsed result attaches to the profile IMMEDIATELY
      // (verifiedStd) instead of waiting for a user-side accept step.
      await dbService.upsertProfile(userId, {
        verifiedStd: true,
        stdTestResult: rawText,
        parsedStd: parsed,
      });

      // Registration reward
      try {
        const rewardRes = await grantRegistrationReward(
          { userId, labWallet: lab.walletAddress ?? null },
          {
            getUserById: dbService.getUserById,
            claimRegistrationReward: dbService.claimRegistrationReward,
            mintEvolveAmount,
          },
        );
        console.log("[lab-report] registration reward:", JSON.stringify(rewardRes));
      } catch (rewardErr) {
        console.error("[lab-report] registration reward failed:", rewardErr);
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, reportId: report.id }));
      return true;
    }

    // --- 6.5 LAB ACCOUNT ENDPOINTS (session-based lab flow) ---
    // Unlike the API-key flow above, these endpoints use the partner session
    // (kind === "partner"). Flow: scan patient QR → verify face → attach
    // results later. Reuses LabReport rows as "visits".

    // GET /api/lab/account/scan?userId=... — partner "scans" a patient; returns
    // only the minimal public card (no STD data, no profile details).
    if (pathname === "/api/lab/account/scan" && req.method === "GET") {
      if (!session || session.kind !== "partner" || !session.partnerId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const partner = await dbService.getPartnerById(session.partnerId);
      if (!partner) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const userId = typeof parsedUrl.query.userId === "string" ? parsedUrl.query.userId : "";
      if (!userId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "userId is required" }));
        return true;
      }
      const profile = await dbService.getProfileByUserId(userId);
      if (!profile) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Patient not found" }));
        return true;
      }
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          userId,
          username: profile.username || null,
          name: profile.name || null,
          imageUrl: profile.imageUrl || null,
        }),
      );
      return true;
    }

    // POST /api/lab/account/begin — partner starts a visit for a scanned patient.
    // Creates a LabReport row in "sample_received" state.
    if (pathname === "/api/lab/account/begin" && req.method === "POST") {
      if (!session || session.kind !== "partner" || !session.partnerId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const partner = await dbService.getPartnerById(session.partnerId);
      if (!partner) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const userId = typeof body.userId === "string" ? body.userId.trim() : "";
      if (!userId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "userId is required" }));
        return true;
      }
      const profile = await dbService.getProfileByUserId(userId);
      if (!profile) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Patient not found" }));
        return true;
      }
      const visit = await dbService.createLabVisit(userId, partner.name, "none");
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, visitId: visit.id, status: visit.status }));
      return true;
    }

    // POST /api/lab/account/visit/:id/face — attach face-match result to a visit.
    const labVisitFaceMatch = pathname.match(/^\/api\/lab\/account\/visit\/([^/]+)\/face$/);
    if (labVisitFaceMatch && req.method === "POST") {
      if (!session || session.kind !== "partner" || !session.partnerId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const faceMatchStatus =
        typeof body.faceMatchStatus === "string" ? body.faceMatchStatus : "matched";
      const updated = await dbService.updateLabReportFace(labVisitFaceMatch[1], faceMatchStatus);
      if (!updated) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Visit not found" }));
        return true;
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return true;
    }

    // POST /api/lab/account/visit/:id/report — lab attaches parsed STD results.
    const labVisitReportMatch = pathname.match(/^\/api\/lab\/account\/visit\/([^/]+)\/report$/);
    if (labVisitReportMatch && req.method === "POST") {
      if (!session || session.kind !== "partner" || !session.partnerId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const body = await getJsonBody(req);
      const rawText = typeof body.rawText === "string" ? body.rawText : "";
      if (!rawText.trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "rawText is required" }));
        return true;
      }
      const parsed = parseStdTestResult(rawText);
      const updated = await dbService.updateLabReportContent(
        labVisitReportMatch[1],
        rawText,
        parsed,
        "pending",
      );
      if (!updated) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Visit not found" }));
        return true;
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, visitId: updated.id, status: updated.status }));
      return true;
    }

    // GET /api/lab/account/visits — all visits created by this partner.
    if (pathname === "/api/lab/account/visits" && req.method === "GET") {
      if (!session || session.kind !== "partner" || !session.partnerId) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const partner = await dbService.getPartnerById(session.partnerId);
      if (!partner) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const visits = await dbService.getLabVisitsByPartner(partner.name);
      res.statusCode = 200;
      res.end(JSON.stringify({ visits }));
      return true;
    }

    // --- TOKEN FAUCET (admin relay) ---
    if (pathname === "/api/faucet" && req.method === "POST") {
      const body = await getJsonBody(req);
      const address = typeof body.address === "string" ? body.address.toLowerCase() : "";
      if (!/^0x[0-9a-f]{40}$/.test(address)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Valid wallet address required" }));
        return true;
      }
      if (!isAdminConfigured()) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: "Faucet not configured (ADMIN_PRIVATE_KEY missing)" }));
        return true;
      }
      // One claim per address, ever.
      const existingClaim = await kv.get(`faucet:${address}`);
      if (existingClaim) {
        res.statusCode = 429;
        res.end(JSON.stringify({ error: "Faucet already claimed", txHash: existingClaim }));
        return true;
      }
      try {
        const txHash = await mintEvolve(address);
        await kv.set(`faucet:${address}`, txHash);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, amount: FAUCET_AMOUNT_TOKENS, txHash }));
      } catch (err) {
        console.error(`[faucet] Mint to ${address} failed:`, err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Faucet mint failed" }));
      }
      return true;
    }

    // --- DNA VERIFICATION RELAY ---
    // verifyDNA/revokeDNA are onlyVerifier on-chain; users request through this
    // authenticated endpoint and the admin key signs for them.
    if (pathname === "/api/verification/dna/request" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const ethAddress = session.ethAddress?.toLowerCase();
      if (!ethAddress) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Wallet-linked session required" }));
        return true;
      }
      const body = await getJsonBody(req);
      const dnaHash = typeof body.dnaHash === "string" ? body.dnaHash : "";
      if (!/^0x[0-9a-fA-F]{64}$/.test(dnaHash)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "dnaHash must be a bytes32 hex string" }));
        return true;
      }
      if (!isAdminConfigured()) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: "DNA relay not configured (ADMIN_PRIVATE_KEY missing)" }));
        return true;
      }
      try {
        const txHash = await relayDnaVerify(ethAddress, dnaHash as `0x${string}`);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, txHash }));
      } catch (err) {
        console.error(`[dna-relay] Verify for ${ethAddress} failed:`, err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "DNA verification failed" }));
      }
      return true;
    }

    if (pathname === "/api/verification/dna/revoke" && req.method === "POST") {
      if (!session) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return true;
      }
      const ethAddress = session.ethAddress?.toLowerCase();
      if (!ethAddress) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Wallet-linked session required" }));
        return true;
      }
      if (!isAdminConfigured()) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: "DNA relay not configured (ADMIN_PRIVATE_KEY missing)" }));
        return true;
      }
      try {
        const txHash = await relayDnaRevoke(ethAddress);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, txHash }));
      } catch (err) {
        console.error(`[dna-relay] Revoke for ${ethAddress} failed:`, err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "DNA revocation failed" }));
      }
      return true;
    }

    // --- DNA Account Recovery ---
    // POST /api/auth/dna-recover — verify DNA hash against on-chain record
    // and issue a session for account recovery (no wallet needed).
    if (pathname === "/api/auth/dna-recover" && req.method === "POST") {
      try {
        const { email, dnaHash } = (await getJsonBody(req)) as {
          email?: string;
          dnaHash?: string;
        };
        if (!email || !dnaHash) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "email and dnaHash are required" }));
          return true;
        }

        // Look up user by email
        const user = await dbService.getUserByEmail(email.toLowerCase().trim());
        if (!user) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "No account found for this email" }));
          return true;
        }

        const ethAddress = user.ethAddress?.toLowerCase();
        if (!ethAddress) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Account has no linked wallet address" }));
          return true;
        }

        // Fetch on-chain DNA profile via publicClient
        let onChainDnaHash: string | null = null;
        try {
          const { createPublicClient, http } = await import("viem");
          const { sepolia } = await import("viem/chains");
          const { DNAVerificationABI } = await import("./abi/DNAVerificationABI");
          const { CONTRACTS } = await import("./addresses");

          const RPC_URL =
            process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
          const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(RPC_URL),
          });
          const profile = await publicClient.readContract({
            address: CONTRACTS.DNA_VERIFICATION,
            abi: DNAVerificationABI,
            functionName: "getDNAProfile",
            args: [ethAddress as `0x${string}`],
          });

          // profile is [dnaHash, timestamp, verified, verifier, metadata]
          const verified = (profile as any)[2];
          const rawHash = (profile as any)[0] as `0x${string}`;
          if (verified && rawHash && rawHash !== "0x".padEnd(66, "0")) {
            // Convert bytes32 to hex string (strip 0x and leading zeros,
            // matching generateDNAHash output)
            onChainDnaHash = parseInt(rawHash, 16).toString(16);
          }
        } catch (chainErr) {
          console.error("[dna-recover] On-chain read failed:", chainErr);
          res.statusCode = 503;
          res.end(
            JSON.stringify({
              error: "On-chain DNA verification unavailable",
            }),
          );
          return true;
        }

        if (!onChainDnaHash) {
          res.statusCode = 404;
          res.end(
            JSON.stringify({
              error:
                "No verified DNA profile found for this account. Please verify your DNA first.",
            }),
          );
          return true;
        }

        // Compare hashes
        if (onChainDnaHash.toLowerCase() !== dnaHash.toLowerCase().trim()) {
          res.statusCode = 403;
          res.end(
            JSON.stringify({
              error: "DNA hash does not match the on-chain record for this account",
            }),
          );
          return true;
        }

        // Match — issue session cookie
        const newSessionId =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessions[newSessionId] = { userId: user.id, ethAddress, email: user.email };

        res.setHeader(
          "Set-Cookie",
          `siwe_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
        );
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            user: {
              id: user.id,
              email: user.email,
              ethAddress: user.ethAddress,
            },
          }),
        );
      } catch (err) {
        console.error("[dna-recover] Error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "DNA recovery failed" }));
      }
      return true;
    }

    // --- Security Question Account Recovery ---
    // GET /api/auth/question?email=... — fetch the stored security question
    // (the answer hash is NEVER exposed).
    if (pathname === "/api/auth/question" && req.method === "GET") {
      try {
        const { email } = parsedUrl.query;
        if (!email) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "email is required" }));
          return true;
        }
        const formattedEmail = String(email).toLowerCase().trim();
        const user = await dbService.getUserByEmail(formattedEmail);
        if (!user) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "No account found for this email" }));
          return true;
        }
        const sec = await dbService.getSecurityQuestion(formattedEmail);
        if (!sec || !sec.securityQuestion) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              success: false,
              error: "This account has no security question set",
            }),
          );
          return true;
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, question: sec.securityQuestion }));
      } catch (err) {
        console.error("[question] Error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Failed to load security question" }));
      }
      return true;
    }

    // POST /api/auth/question-recover — verify the user's security answer
    // (SHA-256 hash) and issue a session for account recovery.
    if (pathname === "/api/auth/question-recover" && req.method === "POST") {
      try {
        const { createHash } = await import("crypto");
        const { email, answer } = (await getJsonBody(req)) as {
          email?: string;
          answer?: string;
        };
        if (!email || !answer) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "email and answer are required" }));
          return true;
        }

        // Look up user by email
        const user = await dbService.getUserByEmail(email.toLowerCase().trim());
        if (!user) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "No account found for this email" }));
          return true;
        }

        const sec = await dbService.getSecurityQuestion(email.toLowerCase().trim());
        if (!sec || !sec.securityAnswerHash || !sec.securityQuestion) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              error: "This account has no security question set",
            }),
          );
          return true;
        }

        // Hash the submitted answer the same way it was stored client-side.
        const submittedHash = createHash("sha256")
          .update(String(answer).toLowerCase().trim())
          .digest("hex");

        if (submittedHash !== sec.securityAnswerHash.toLowerCase()) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: "Answer does not match" }));
          return true;
        }

        // Match — issue session cookie
        const newSessionId =
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessions[newSessionId] = {
          userId: user.id,
          email: user.email,
          ethAddress: user.ethAddress,
        };

        res.setHeader(
          "Set-Cookie",
          `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
        );
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            user: {
              id: user.id,
              email: user.email,
              ethAddress: user.ethAddress,
            },
          }),
        );
      } catch (err) {
        console.error("[question-recover] Error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Recovery failed" }));
      }
      return true;
    }

    // --- COMPANION MODE PATIENTS (cross-device) ---
    // Companion-mode patients register with a client-generated id (no SIWE).
    // The lab fetches the same record from any device by that id, and Search
    // lists every registered patient. No auth required — access is by id alone,
    // mirroring how a physical QR code is the bearer credential.

    // GET /api/companion/patients — list all registered patients.
    if (pathname === "/api/companion/patients" && req.method === "GET") {
      const patients = await dbService.listCompanionPatients();
      res.statusCode = 200;
      res.end(JSON.stringify({ patients }));
      return true;
    }

    // POST /api/companion/patients — register/upsert a patient profile.
    if (pathname === "/api/companion/patients" && req.method === "POST") {
      const body = await getJsonBody(req);
      const id = String(body.id || "").trim();
      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Patient id is required" }));
        return true;
      }
      const patient = await dbService.upsertCompanionPatient({
        id,
        name: body.name ?? null,
        photo: body.photo ?? null,
        additionalPhotos: Array.isArray(body.additionalPhotos) ? body.additionalPhotos : null,
        location: body.location ?? null,
        stdCompatible: Boolean(body.stdCompatible),
      });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, patient }));
      return true;
    }

    // GET /api/companion/patients/:id — fetch a single patient by QR id.
    const companionPatientMatch = pathname.match(/^\/api\/companion\/patients\/([^/]+)$/);
    if (companionPatientMatch && req.method === "GET") {
      const id = decodeURIComponent(companionPatientMatch[1]);
      const patient = await dbService.getCompanionPatient(id);
      if (!patient) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Patient not found" }));
        return true;
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ patient }));
      return true;
    }

    // GET /api/companion/labs?country=&city= — searchable lab directory.
    if (pathname === "/api/companion/labs" && req.method === "GET") {
      const labs = await dbService.listCompanionLabs(
        (parsedUrl.query.country as string) || undefined,
        (parsedUrl.query.city as string) || undefined,
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ labs }));
      return true;
    }

    // POST /api/companion/labs — register/update a lab in the directory.
    if (pathname === "/api/companion/labs" && req.method === "POST") {
      const body = await getJsonBody(req);
      const id = String(body.id || "").trim();
      const name = String(body.name || "").trim();
      if (!id || !name) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Lab id and name are required" }));
        return true;
      }
      const lab = await dbService.upsertCompanionLab({
        id,
        name,
        description: body.description ?? null,
        address: body.address ?? null,
        phone: body.phone ?? null,
        country: body.country ?? null,
        city: body.city ?? null,
      });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, lab }));
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
