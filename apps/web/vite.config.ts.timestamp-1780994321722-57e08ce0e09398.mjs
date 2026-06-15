// vite.config.ts
import { defineConfig } from "file:///C:/CFC/apps/web/node_modules/vite/dist/node/index.js";
import react from "file:///C:/CFC/node_modules/@vitejs/plugin-react/dist/index.js";
import path2 from "path";

// src/lib/db.ts
import { PrismaClient } from "file:///C:/CFC/apps/web/node_modules/@prisma/client/default.js";
import fs from "fs";
import path from "path";
var prisma = null;
var useFallback = false;
try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/evolve_db?schema=public"
      }
    }
  });
} catch (e) {
  console.warn("Prisma Client initialization failed. Using JSON fallback database.", e);
  useFallback = true;
}
var FALLBACK_FILE = path.join(process.cwd(), "fallback-db.json");
var initialFallbackData = {
  users: [
    { id: "1", ethAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "2", ethAddress: "0x3AcA7bbf08F6D6cf92ED9C5B7FDE7b944208a0e8", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "3", ethAddress: "0x90F8bf6A479f320ced073E824F25135bc93C7a4e", createdAt: (/* @__PURE__ */ new Date()).toISOString() }
  ],
  profiles: [
    {
      id: "1",
      userId: "1",
      name: "Alice",
      age: 28,
      bio: "Passionate about blockchain and decentralized apps. Looking for meaningful connections.",
      interests: ["Web3", "Crypto", "Gaming", "Travel"],
      imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      verifiedStd: true,
      verifiedDna: false,
      reputationScore: 8.7,
      voters: [
        { name: "Bob", weight: 8.2, relation: "Peer" },
        { name: "Charlie", weight: 6.5, relation: "Colleague" },
        { name: "Diana", weight: 9.1, relation: "Vouched match" }
      ],
      dnaProfile: {
        "D3S1358": [15, 18],
        "vWA": [16, 17],
        "FGA": [21, 24],
        "D8S1179": [13, 14],
        "D21S11": [29, 31.2],
        "D18S51": [12, 15],
        "D5S818": [11, 12],
        "D13S317": [8, 12],
        "D7S820": [10, 11]
      },
      stdTestResult: "NEGATIVE for all common pathogens (HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1/2)",
      accessPermissions: {
        stdRequested: false,
        stdApproved: false,
        dnaRequested: false,
        dnaApproved: false,
        myStdApprovedToThem: false,
        myDnaApprovedToThem: false
      }
    },
    {
      id: "2",
      userId: "2",
      name: "Bob",
      age: 32,
      bio: "Early crypto adopter and a big fan of open-source. Enjoy hiking and coding.",
      interests: ["Hiking", "Coding", "Ethereum", "DeFi"],
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      verifiedStd: true,
      verifiedDna: true,
      reputationScore: 9.4,
      voters: [
        { name: "Alice", weight: 8.7, relation: "Developer Partner" },
        { name: "Elena", weight: 9.5, relation: "Verified Partner" },
        { name: "Frank", weight: 7.8, relation: "Node Operator" }
      ],
      dnaProfile: {
        "D3S1358": [14, 15],
        "vWA": [14, 16],
        "FGA": [20, 22],
        "D8S1179": [12, 13],
        "D21S11": [28, 30],
        "D18S51": [14, 16],
        "D5S818": [11, 13],
        "D13S317": [9, 11],
        "D7S820": [8, 10]
      },
      stdTestResult: "NEGATIVE for all common pathogens (HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1/2)",
      accessPermissions: {
        stdRequested: false,
        stdApproved: false,
        dnaRequested: false,
        dnaApproved: false,
        myStdApprovedToThem: false,
        myDnaApprovedToThem: false
      }
    },
    {
      id: "3",
      userId: "3",
      name: "Charlie",
      age: 25,
      bio: "Loves exploring new technologies and meeting like-minded people. Coffee enthusiast.",
      interests: ["Coffee", "AI", "Startups", "Art"],
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      verifiedStd: false,
      verifiedDna: false,
      reputationScore: 6.2,
      voters: [
        { name: "Bob", weight: 8.2, relation: "Hackathon Teammate" }
      ],
      accessPermissions: {
        stdRequested: false,
        stdApproved: false,
        dnaRequested: false,
        dnaApproved: false,
        myStdApprovedToThem: false,
        myDnaApprovedToThem: false
      }
    }
  ],
  matches: [],
  messages: [],
  documents: []
};
function readFallback() {
  if (!fs.existsSync(FALLBACK_FILE)) {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(initialFallbackData, null, 2));
    return initialFallbackData;
  }
  try {
    return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"));
  } catch (e) {
    return initialFallbackData;
  }
}
function writeFallback(data) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}
async function runWithDb(dbQuery, fallbackQuery) {
  if (useFallback || !prisma) {
    return fallbackQuery();
  }
  try {
    return await dbQuery(prisma);
  } catch (e) {
    if (e.code === "P1001" || e.message?.includes("Can't reach database") || e.message?.includes("initialization")) {
      console.warn("PostgreSQL not reachable. Falling back to JSON database.");
      useFallback = true;
      return fallbackQuery();
    }
    throw e;
  }
}
var dbService = {
  // --- USERS ---
  async getUsers() {
    return runWithDb(
      async (p) => p.user.findMany({ include: { profile: true } }),
      () => {
        const data = readFallback();
        return data.users.map((u) => ({
          ...u,
          profile: data.profiles.find((p) => p.userId === u.id) || null
        }));
      }
    );
  },
  async getUserByAddress(ethAddress) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) => p.user.findFirst({ where: { ethAddress: { equals: formattedAddr, mode: "insensitive" } }, include: { profile: true } }),
      () => {
        const data = readFallback();
        const user = data.users.find((u) => u.ethAddress.toLowerCase() === formattedAddr);
        if (!user) return null;
        return {
          ...user,
          profile: data.profiles.find((p) => p.userId === user.id) || null
        };
      }
    );
  },
  async createUser(ethAddress) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) => p.user.create({ data: { ethAddress: formattedAddr } }),
      () => {
        const data = readFallback();
        const existing = data.users.find((u) => u.ethAddress.toLowerCase() === formattedAddr);
        if (existing) return existing;
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          ethAddress: formattedAddr,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.users.push(newUser);
        writeFallback(data);
        return newUser;
      }
    );
  },
  // --- PROFILES ---
  async getProfiles() {
    return runWithDb(
      async (p) => p.profile.findMany(),
      () => readFallback().profiles
    );
  },
  async upsertProfile(userId, profileData) {
    return runWithDb(
      async (p) => p.profile.upsert({
        where: { userId },
        update: profileData,
        create: { userId, ...profileData }
      }),
      () => {
        const data = readFallback();
        let profile = data.profiles.find((p) => p.userId === userId);
        if (profile) {
          Object.assign(profile, profileData);
        } else {
          profile = {
            id: Math.random().toString(36).substring(2, 11),
            userId,
            ...profileData
          };
          data.profiles.push(profile);
        }
        writeFallback(data);
        return profile;
      }
    );
  },
  // --- MATCHES ---
  async getMatches() {
    return runWithDb(
      async (p) => p.match.findMany(),
      () => readFallback().matches
    );
  },
  async createMatch(userId, matchedUserId) {
    return runWithDb(
      async (p) => p.match.create({ data: { userId, matchedUserId } }),
      () => {
        const data = readFallback();
        const existing = data.matches.find(
          (m) => m.userId === userId && m.matchedUserId === matchedUserId || m.userId === matchedUserId && m.matchedUserId === userId
        );
        if (existing) return existing;
        const newMatch = {
          id: Math.random().toString(36).substring(2, 11),
          userId,
          matchedUserId,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.matches.push(newMatch);
        writeFallback(data);
        return newMatch;
      }
    );
  },
  // --- MESSAGES ---
  async getMessages(senderId, receiverId) {
    return runWithDb(
      async (p) => p.message.findMany({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        },
        orderBy: { createdAt: "asc" }
      }),
      () => {
        const data = readFallback();
        return data.messages.filter(
          (m) => m.senderId === senderId && m.receiverId === receiverId || m.senderId === receiverId && m.receiverId === senderId
        );
      }
    );
  },
  async createMessage(msg) {
    return runWithDb(
      async (p) => p.message.create({ data: msg }),
      () => {
        const data = readFallback();
        const newMsg = {
          id: Math.random().toString(36).substring(2, 11),
          ...msg,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.messages.push(newMsg);
        writeFallback(data);
        return newMsg;
      }
    );
  },
  async updateMessageRequestStatus(messageId, status) {
    return runWithDb(
      async (p) => p.message.update({ where: { id: messageId }, data: { requestStatus: status } }),
      () => {
        const data = readFallback();
        const msg = data.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.requestStatus = status;
          writeFallback(data);
        }
        return msg;
      }
    );
  },
  // --- DOCUMENTS ---
  async getDocuments(userId) {
    return runWithDb(
      async (p) => p.document.findMany({ where: { userId } }),
      () => readFallback().documents.filter((d) => d.userId === userId)
    );
  },
  async createDocument(doc) {
    return runWithDb(
      async (p) => p.document.create({ data: doc }),
      () => {
        const data = readFallback();
        const newDoc = {
          id: Math.random().toString(36).substring(2, 11),
          ...doc,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.documents.push(newDoc);
        writeFallback(data);
        return newDoc;
      }
    );
  }
};

// src/lib/apiServer.ts
import { generateNonce, SiweMessage } from "file:///C:/CFC/node_modules/siwe/dist/siwe.js";
import { parse as parseUrl } from "url";
var sessions = {};
var nonces = {};
function getJsonBody(req) {
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
function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      list[parts[0].trim()] = decodeURIComponent((parts[1] || "").trim());
    });
  }
  return list;
}
async function handleApiRequest(req, res) {
  const parsedUrl = parseUrl(req.url || "", true);
  const pathname = parsedUrl.pathname || "";
  if (!pathname.startsWith("/api")) {
    return false;
  }
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return true;
  }
  try {
    const cookies = parseCookies(req);
    let sessionId = cookies["siwe_session"];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      sessionId = authHeader.substring(7);
    }
    const session = sessionId ? sessions[sessionId] : null;
    if (pathname === "/api/auth/siwe/nonce" && req.method === "GET") {
      const nonce = generateNonce();
      const id = Math.random().toString(36).substring(2, 11);
      nonces[id] = { nonce, expires: Date.now() + 5 * 60 * 1e3 };
      res.setHeader("Set-Cookie", `siwe_nonce_id=${id}; Path=/; HttpOnly; SameSite=Lax`);
      res.statusCode = 200;
      res.end(JSON.stringify({ nonce }));
      return true;
    }
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
            reputationScore: 5,
            voters: []
          });
          user = await dbService.getUserByAddress(ethAddress);
        }
        const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessions[newSessionId] = { userId: user.id, ethAddress };
        res.setHeader("Set-Cookie", `siwe_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Verification failed" }));
      }
      return true;
    }
    if (pathname === "/api/auth/siwe/session" && req.method === "GET") {
      if (session) {
        const user = await dbService.getUserByAddress(session.ethAddress);
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: true, session, user }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: false }));
      }
      return true;
    }
    if (pathname === "/api/auth/siwe/logout" && req.method === "POST") {
      if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
      }
      res.setHeader("Set-Cookie", "siwe_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }
    if (pathname === "/api/users" && req.method === "GET") {
      const users = await dbService.getUsers();
      res.statusCode = 200;
      res.end(JSON.stringify(users));
      return true;
    }
    if (pathname === "/api/profiles" && req.method === "GET") {
      const profiles = await dbService.getProfiles();
      res.statusCode = 200;
      res.end(JSON.stringify(profiles));
      return true;
    }
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
    if (pathname === "/api/matches" && req.method === "GET") {
      const matches = await dbService.getMatches();
      res.statusCode = 200;
      res.end(JSON.stringify(matches));
      return true;
    }
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
    if (pathname === "/api/messages" && req.method === "GET") {
      const { senderId, receiverId } = parsedUrl.query;
      if (!senderId || !receiverId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "senderId and receiverId are required" }));
        return true;
      }
      const messages = await dbService.getMessages(senderId, receiverId);
      res.statusCode = 200;
      res.end(JSON.stringify(messages));
      return true;
    }
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
    if (pathname === "/api/documents" && req.method === "GET") {
      const { userId } = parsedUrl.query;
      if (!userId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "userId is required" }));
        return true;
      }
      const documents = await dbService.getDocuments(userId);
      res.statusCode = 200;
      res.end(JSON.stringify(documents));
      return true;
    }
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
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
    return true;
  } catch (error) {
    console.error("API Error:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error", message: error.message }));
    return true;
  }
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\CFC\\apps\\web";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const handled = await handleApiRequest(req, res);
          if (!handled) {
            next();
          }
        });
      }
    }
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  },
  resolve: {
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname, "./src"),
      "@core": path2.resolve(__vite_injected_original_dirname, "../../packages/core/src"),
      "@storage": path2.resolve(__vite_injected_original_dirname, "../../packages/storage/src"),
      "@p2p": path2.resolve(__vite_injected_original_dirname, "../../packages/p2p/src"),
      "@evolve/ui": path2.resolve(__vite_injected_original_dirname, "../../packages/ui/src"),
      "react-native": "react-native-web"
    }
  },
  server: {
    port: 3e3,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL2xpYi9kYi50cyIsICJzcmMvbGliL2FwaVNlcnZlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXENGQ1xcXFxhcHBzXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgaGFuZGxlQXBpUmVxdWVzdCB9IGZyb20gJy4vc3JjL2xpYi9hcGlTZXJ2ZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYXBpLXNlcnZlcicsXHJcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXI6IGFueSkge1xyXG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBoYW5kbGVkID0gYXdhaXQgaGFuZGxlQXBpUmVxdWVzdChyZXEsIHJlcyk7XHJcbiAgICAgICAgICBpZiAoIWhhbmRsZWQpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGFzIGFueVxyXG4gIF0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgc2V0dXBGaWxlczogJy4vc3JjL3Rlc3Qvc2V0dXAudHMnLFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgJ0Bjb3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjJyksXHJcbiAgICAgICdAc3RvcmFnZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9zdG9yYWdlL3NyYycpLFxyXG4gICAgICAnQHAycCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9wMnAvc3JjJyksXHJcbiAgICAgICdAZXZvbHZlL3VpJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL3VpL3NyYycpLFxyXG4gICAgICAncmVhY3QtbmF0aXZlJzogJ3JlYWN0LW5hdGl2ZS13ZWInLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIGhvc3Q6IHRydWUsXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgfSxcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHNyY1xcXFxsaWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENGQ1xcXFxhcHBzXFxcXHdlYlxcXFxzcmNcXFxcbGliXFxcXGRiLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvc3JjL2xpYi9kYi50c1wiO2ltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG4vLyBEdWFsLW1vZGUgREIgaGFuZGxlcjogdXNlcyBQcmlzbWEvUG9zdGdyZVNRTCBpZiBhdmFpbGFibGUsIGZhbGxzIGJhY2sgdG8gbG9jYWwgSlNPTiBmaWxlIG9yIG1lbW9yeS5cclxubGV0IHByaXNtYTogUHJpc21hQ2xpZW50IHwgbnVsbCA9IG51bGw7XHJcbmxldCB1c2VGYWxsYmFjayA9IGZhbHNlO1xyXG5cclxudHJ5IHtcclxuICBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KHtcclxuICAgIGRhdGFzb3VyY2VzOiB7XHJcbiAgICAgIGRiOiB7XHJcbiAgICAgICAgdXJsOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwgfHwgXCJwb3N0Z3Jlc3FsOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjU0MzIvZXZvbHZlX2RiP3NjaGVtYT1wdWJsaWNcIixcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn0gY2F0Y2ggKGUpIHtcclxuICBjb25zb2xlLndhcm4oXCJQcmlzbWEgQ2xpZW50IGluaXRpYWxpemF0aW9uIGZhaWxlZC4gVXNpbmcgSlNPTiBmYWxsYmFjayBkYXRhYmFzZS5cIiwgZSk7XHJcbiAgdXNlRmFsbGJhY2sgPSB0cnVlO1xyXG59XHJcblxyXG5jb25zdCBGQUxMQkFDS19GSUxFID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdmYWxsYmFjay1kYi5qc29uJyk7XHJcblxyXG4vLyBNb2NrIGRhdGEgdG8gaW5pdGlhbGl6ZSBpZiBmYWxsYmFjay1kYi5qc29uIGRvZXNuJ3QgZXhpc3RcclxuY29uc3QgaW5pdGlhbEZhbGxiYWNrRGF0YSA9IHtcclxuICB1c2VyczogW1xyXG4gICAgeyBpZDogJzEnLCBldGhBZGRyZXNzOiAnMHg3MUM3NjU2RUM3YWI4OGIwOThkZWZCNzUxQjc0MDFCNWY2ZDE0NzZCJywgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSxcclxuICAgIHsgaWQ6ICcyJywgZXRoQWRkcmVzczogJzB4M0FjQTdiYmYwOEY2RDZjZjkyRUQ5QzVCN0ZERTdiOTQ0MjA4YTBlOCcsIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sXHJcbiAgICB7IGlkOiAnMycsIGV0aEFkZHJlc3M6ICcweDkwRjhiZjZBNDc5ZjMyMGNlZDA3M0U4MjRGMjUxMzViYzkzQzdhNGUnLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9XHJcbiAgXSxcclxuICBwcm9maWxlczogW1xyXG4gICAge1xyXG4gICAgICBpZDogJzEnLFxyXG4gICAgICB1c2VySWQ6ICcxJyxcclxuICAgICAgbmFtZTogJ0FsaWNlJyxcclxuICAgICAgYWdlOiAyOCxcclxuICAgICAgYmlvOiAnUGFzc2lvbmF0ZSBhYm91dCBibG9ja2NoYWluIGFuZCBkZWNlbnRyYWxpemVkIGFwcHMuIExvb2tpbmcgZm9yIG1lYW5pbmdmdWwgY29ubmVjdGlvbnMuJyxcclxuICAgICAgaW50ZXJlc3RzOiBbJ1dlYjMnLCAnQ3J5cHRvJywgJ0dhbWluZycsICdUcmF2ZWwnXSxcclxuICAgICAgaW1hZ2VVcmw6ICdodHRwczovL3JhbmRvbXVzZXIubWUvYXBpL3BvcnRyYWl0cy93b21lbi8xLmpwZycsXHJcbiAgICAgIHZlcmlmaWVkU3RkOiB0cnVlLFxyXG4gICAgICB2ZXJpZmllZERuYTogZmFsc2UsXHJcbiAgICAgIHJlcHV0YXRpb25TY29yZTogOC43LFxyXG4gICAgICB2b3RlcnM6IFtcclxuICAgICAgICB7IG5hbWU6ICdCb2InLCB3ZWlnaHQ6IDguMiwgcmVsYXRpb246ICdQZWVyJyB9LFxyXG4gICAgICAgIHsgbmFtZTogJ0NoYXJsaWUnLCB3ZWlnaHQ6IDYuNSwgcmVsYXRpb246ICdDb2xsZWFndWUnIH0sXHJcbiAgICAgICAgeyBuYW1lOiAnRGlhbmEnLCB3ZWlnaHQ6IDkuMSwgcmVsYXRpb246ICdWb3VjaGVkIG1hdGNoJyB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGRuYVByb2ZpbGU6IHtcclxuICAgICAgICAnRDNTMTM1OCc6IFsxNSwgMThdLFxyXG4gICAgICAgICd2V0EnOiBbMTYsIDE3XSxcclxuICAgICAgICAnRkdBJzogWzIxLCAyNF0sXHJcbiAgICAgICAgJ0Q4UzExNzknOiBbMTMsIDE0XSxcclxuICAgICAgICAnRDIxUzExJzogWzI5LCAzMS4yXSxcclxuICAgICAgICAnRDE4UzUxJzogWzEyLCAxNV0sXHJcbiAgICAgICAgJ0Q1UzgxOCc6IFsxMSwgMTJdLFxyXG4gICAgICAgICdEMTNTMzE3JzogWzgsIDEyXSxcclxuICAgICAgICAnRDdTODIwJzogWzEwLCAxMV1cclxuICAgICAgfSxcclxuICAgICAgc3RkVGVzdFJlc3VsdDogJ05FR0FUSVZFIGZvciBhbGwgY29tbW9uIHBhdGhvZ2VucyAoSElWLTEvMiwgU3lwaGlsaXMsIENobGFteWRpYSwgR29ub3JyaGVhLCBIU1YtMS8yKScsXHJcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XHJcbiAgICAgICAgc3RkUmVxdWVzdGVkOiBmYWxzZSxcclxuICAgICAgICBzdGRBcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcclxuICAgICAgICBkbmFBcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgbXlTdGRBcHByb3ZlZFRvVGhlbTogZmFsc2UsXHJcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICcyJyxcclxuICAgICAgdXNlcklkOiAnMicsXHJcbiAgICAgIG5hbWU6ICdCb2InLFxyXG4gICAgICBhZ2U6IDMyLFxyXG4gICAgICBiaW86ICdFYXJseSBjcnlwdG8gYWRvcHRlciBhbmQgYSBiaWcgZmFuIG9mIG9wZW4tc291cmNlLiBFbmpveSBoaWtpbmcgYW5kIGNvZGluZy4nLFxyXG4gICAgICBpbnRlcmVzdHM6IFsnSGlraW5nJywgJ0NvZGluZycsICdFdGhlcmV1bScsICdEZUZpJ10sXHJcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9yYW5kb211c2VyLm1lL2FwaS9wb3J0cmFpdHMvbWVuLzEuanBnJyxcclxuICAgICAgdmVyaWZpZWRTdGQ6IHRydWUsXHJcbiAgICAgIHZlcmlmaWVkRG5hOiB0cnVlLFxyXG4gICAgICByZXB1dGF0aW9uU2NvcmU6IDkuNCxcclxuICAgICAgdm90ZXJzOiBbXHJcbiAgICAgICAgeyBuYW1lOiAnQWxpY2UnLCB3ZWlnaHQ6IDguNywgcmVsYXRpb246ICdEZXZlbG9wZXIgUGFydG5lcicgfSxcclxuICAgICAgICB7IG5hbWU6ICdFbGVuYScsIHdlaWdodDogOS41LCByZWxhdGlvbjogJ1ZlcmlmaWVkIFBhcnRuZXInIH0sXHJcbiAgICAgICAgeyBuYW1lOiAnRnJhbmsnLCB3ZWlnaHQ6IDcuOCwgcmVsYXRpb246ICdOb2RlIE9wZXJhdG9yJyB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGRuYVByb2ZpbGU6IHtcclxuICAgICAgICAnRDNTMTM1OCc6IFsxNCwgMTVdLFxyXG4gICAgICAgICd2V0EnOiBbMTQsIDE2XSxcclxuICAgICAgICAnRkdBJzogWzIwLCAyMl0sXHJcbiAgICAgICAgJ0Q4UzExNzknOiBbMTIsIDEzXSxcclxuICAgICAgICAnRDIxUzExJzogWzI4LCAzMF0sXHJcbiAgICAgICAgJ0QxOFM1MSc6IFsxNCwgMTZdLFxyXG4gICAgICAgICdENVM4MTgnOiBbMTEsIDEzXSxcclxuICAgICAgICAnRDEzUzMxNyc6IFs5LCAxMV0sXHJcbiAgICAgICAgJ0Q3UzgyMCc6IFs4LCAxMF1cclxuICAgICAgfSxcclxuICAgICAgc3RkVGVzdFJlc3VsdDogJ05FR0FUSVZFIGZvciBhbGwgY29tbW9uIHBhdGhvZ2VucyAoSElWLTEvMiwgU3lwaGlsaXMsIENobGFteWRpYSwgR29ub3JyaGVhLCBIU1YtMS8yKScsXHJcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XHJcbiAgICAgICAgc3RkUmVxdWVzdGVkOiBmYWxzZSxcclxuICAgICAgICBzdGRBcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcclxuICAgICAgICBkbmFBcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgbXlTdGRBcHByb3ZlZFRvVGhlbTogZmFsc2UsXHJcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICczJyxcclxuICAgICAgdXNlcklkOiAnMycsXHJcbiAgICAgIG5hbWU6ICdDaGFybGllJyxcclxuICAgICAgYWdlOiAyNSxcclxuICAgICAgYmlvOiAnTG92ZXMgZXhwbG9yaW5nIG5ldyB0ZWNobm9sb2dpZXMgYW5kIG1lZXRpbmcgbGlrZS1taW5kZWQgcGVvcGxlLiBDb2ZmZWUgZW50aHVzaWFzdC4nLFxyXG4gICAgICBpbnRlcmVzdHM6IFsnQ29mZmVlJywgJ0FJJywgJ1N0YXJ0dXBzJywgJ0FydCddLFxyXG4gICAgICBpbWFnZVVybDogJ2h0dHBzOi8vcmFuZG9tdXNlci5tZS9hcGkvcG9ydHJhaXRzL21lbi8yLmpwZycsXHJcbiAgICAgIHZlcmlmaWVkU3RkOiBmYWxzZSxcclxuICAgICAgdmVyaWZpZWREbmE6IGZhbHNlLFxyXG4gICAgICByZXB1dGF0aW9uU2NvcmU6IDYuMixcclxuICAgICAgdm90ZXJzOiBbXHJcbiAgICAgICAgeyBuYW1lOiAnQm9iJywgd2VpZ2h0OiA4LjIsIHJlbGF0aW9uOiAnSGFja2F0aG9uIFRlYW1tYXRlJyB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XHJcbiAgICAgICAgc3RkUmVxdWVzdGVkOiBmYWxzZSxcclxuICAgICAgICBzdGRBcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcclxuICAgICAgICBkbmFBcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgbXlTdGRBcHByb3ZlZFRvVGhlbTogZmFsc2UsXHJcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgbWF0Y2hlczogW10gYXMgYW55W10sXHJcbiAgbWVzc2FnZXM6IFtdIGFzIGFueVtdLFxyXG4gIGRvY3VtZW50czogW10gYXMgYW55W11cclxufTtcclxuXHJcbmZ1bmN0aW9uIHJlYWRGYWxsYmFjaygpIHtcclxuICBpZiAoIWZzLmV4aXN0c1N5bmMoRkFMTEJBQ0tfRklMRSkpIHtcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoRkFMTEJBQ0tfRklMRSwgSlNPTi5zdHJpbmdpZnkoaW5pdGlhbEZhbGxiYWNrRGF0YSwgbnVsbCwgMikpO1xyXG4gICAgcmV0dXJuIGluaXRpYWxGYWxsYmFja0RhdGE7XHJcbiAgfVxyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoRkFMTEJBQ0tfRklMRSwgJ3V0Zi04JykpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJldHVybiBpbml0aWFsRmFsbGJhY2tEYXRhO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVGYWxsYmFjayhkYXRhOiBhbnkpIHtcclxuICBmcy53cml0ZUZpbGVTeW5jKEZBTExCQUNLX0ZJTEUsIEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpKTtcclxufVxyXG5cclxuLy8gV3JhcHBlciB0byB0cnkgUHJpc21hIGFuZCBmYWxsYmFjayBpZiBpdCBjYW4ndCBjb25uZWN0XHJcbmFzeW5jIGZ1bmN0aW9uIHJ1bldpdGhEYjxUPihkYlF1ZXJ5OiAocDogUHJpc21hQ2xpZW50KSA9PiBQcm9taXNlPFQ+LCBmYWxsYmFja1F1ZXJ5OiAoKSA9PiBUKTogUHJvbWlzZTxUPiB7XHJcbiAgaWYgKHVzZUZhbGxiYWNrIHx8ICFwcmlzbWEpIHtcclxuICAgIHJldHVybiBmYWxsYmFja1F1ZXJ5KCk7XHJcbiAgfVxyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gYXdhaXQgZGJRdWVyeShwcmlzbWEpO1xyXG4gIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgLy8gSWYgaXQncyBhIGNvbm5lY3Rpb24gb3IgaW5pdGlhbGl6YXRpb24gZXJyb3IsIHRvZ2dsZSBmYWxsYmFjayBhbmQgcnVuIGZhbGxiYWNrIHF1ZXJ5XHJcbiAgICBpZiAoZS5jb2RlID09PSAnUDEwMDEnIHx8IGUubWVzc2FnZT8uaW5jbHVkZXMoJ0NhblxcJ3QgcmVhY2ggZGF0YWJhc2UnKSB8fCBlLm1lc3NhZ2U/LmluY2x1ZGVzKCdpbml0aWFsaXphdGlvbicpKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIlBvc3RncmVTUUwgbm90IHJlYWNoYWJsZS4gRmFsbGluZyBiYWNrIHRvIEpTT04gZGF0YWJhc2UuXCIpO1xyXG4gICAgICB1c2VGYWxsYmFjayA9IHRydWU7XHJcbiAgICAgIHJldHVybiBmYWxsYmFja1F1ZXJ5KCk7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRiU2VydmljZSA9IHtcclxuICAvLyAtLS0gVVNFUlMgLS0tXHJcbiAgYXN5bmMgZ2V0VXNlcnMoKSB7XHJcbiAgICByZXR1cm4gcnVuV2l0aERiKFxyXG4gICAgICBhc3luYyAocCkgPT4gcC51c2VyLmZpbmRNYW55KHsgaW5jbHVkZTogeyBwcm9maWxlOiB0cnVlIH0gfSksXHJcbiAgICAgICgpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEudXNlcnMubWFwKCh1OiBhbnkpID0+ICh7XHJcbiAgICAgICAgICAuLi51LFxyXG4gICAgICAgICAgcHJvZmlsZTogZGF0YS5wcm9maWxlcy5maW5kKChwOiBhbnkpID0+IHAudXNlcklkID09PSB1LmlkKSB8fCBudWxsXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0sXHJcblxyXG4gIGFzeW5jIGdldFVzZXJCeUFkZHJlc3MoZXRoQWRkcmVzczogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBmb3JtYXR0ZWRBZGRyID0gZXRoQWRkcmVzcy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIHJ1bldpdGhEYihcclxuICAgICAgYXN5bmMgKHApID0+IHAudXNlci5maW5kRmlyc3QoeyB3aGVyZTogeyBldGhBZGRyZXNzOiB7IGVxdWFsczogZm9ybWF0dGVkQWRkciwgbW9kZTogJ2luc2Vuc2l0aXZlJyB9IH0sIGluY2x1ZGU6IHsgcHJvZmlsZTogdHJ1ZSB9IH0pLFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBkYXRhLnVzZXJzLmZpbmQoKHU6IGFueSkgPT4gdS5ldGhBZGRyZXNzLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdHRlZEFkZHIpO1xyXG4gICAgICAgIGlmICghdXNlcikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIC4uLnVzZXIsXHJcbiAgICAgICAgICBwcm9maWxlOiBkYXRhLnByb2ZpbGVzLmZpbmQoKHA6IGFueSkgPT4gcC51c2VySWQgPT09IHVzZXIuaWQpIHx8IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0sXHJcblxyXG4gIGFzeW5jIGNyZWF0ZVVzZXIoZXRoQWRkcmVzczogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBmb3JtYXR0ZWRBZGRyID0gZXRoQWRkcmVzcy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgcmV0dXJuIHJ1bldpdGhEYihcclxuICAgICAgYXN5bmMgKHApID0+IHAudXNlci5jcmVhdGUoeyBkYXRhOiB7IGV0aEFkZHJlc3M6IGZvcm1hdHRlZEFkZHIgfSB9KSxcclxuICAgICAgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcclxuICAgICAgICBjb25zdCBleGlzdGluZyA9IGRhdGEudXNlcnMuZmluZCgodTogYW55KSA9PiB1LmV0aEFkZHJlc3MudG9Mb3dlckNhc2UoKSA9PT0gZm9ybWF0dGVkQWRkcik7XHJcbiAgICAgICAgaWYgKGV4aXN0aW5nKSByZXR1cm4gZXhpc3Rpbmc7XHJcbiAgICAgICAgY29uc3QgbmV3VXNlciA9IHtcclxuICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpLFxyXG4gICAgICAgICAgZXRoQWRkcmVzczogZm9ybWF0dGVkQWRkcixcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkYXRhLnVzZXJzLnB1c2gobmV3VXNlcik7XHJcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3VXNlcjtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9LFxyXG5cclxuICAvLyAtLS0gUFJPRklMRVMgLS0tXHJcbiAgYXN5bmMgZ2V0UHJvZmlsZXMoKSB7XHJcbiAgICByZXR1cm4gcnVuV2l0aERiKFxyXG4gICAgICBhc3luYyAocCkgPT4gcC5wcm9maWxlLmZpbmRNYW55KCksXHJcbiAgICAgICgpID0+IHJlYWRGYWxsYmFjaygpLnByb2ZpbGVzXHJcbiAgICApO1xyXG4gIH0sXHJcblxyXG4gIGFzeW5jIHVwc2VydFByb2ZpbGUodXNlcklkOiBzdHJpbmcsIHByb2ZpbGVEYXRhOiBhbnkpIHtcclxuICAgIHJldHVybiBydW5XaXRoRGIoXHJcbiAgICAgIGFzeW5jIChwKSA9PiBwLnByb2ZpbGUudXBzZXJ0KHtcclxuICAgICAgICB3aGVyZTogeyB1c2VySWQgfSxcclxuICAgICAgICB1cGRhdGU6IHByb2ZpbGVEYXRhLFxyXG4gICAgICAgIGNyZWF0ZTogeyB1c2VySWQsIC4uLnByb2ZpbGVEYXRhIH1cclxuICAgICAgfSksXHJcbiAgICAgICgpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XHJcbiAgICAgICAgbGV0IHByb2ZpbGUgPSBkYXRhLnByb2ZpbGVzLmZpbmQoKHA6IGFueSkgPT4gcC51c2VySWQgPT09IHVzZXJJZCk7XHJcbiAgICAgICAgaWYgKHByb2ZpbGUpIHtcclxuICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJvZmlsZSwgcHJvZmlsZURhdGEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9maWxlID0ge1xyXG4gICAgICAgICAgICBpZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDExKSxcclxuICAgICAgICAgICAgdXNlcklkLFxyXG4gICAgICAgICAgICAuLi5wcm9maWxlRGF0YVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGRhdGEucHJvZmlsZXMucHVzaChwcm9maWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcclxuICAgICAgICByZXR1cm4gcHJvZmlsZTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9LFxyXG5cclxuICAvLyAtLS0gTUFUQ0hFUyAtLS1cclxuICBhc3luYyBnZXRNYXRjaGVzKCkge1xyXG4gICAgcmV0dXJuIHJ1bldpdGhEYihcclxuICAgICAgYXN5bmMgKHApID0+IHAubWF0Y2guZmluZE1hbnkoKSxcclxuICAgICAgKCkgPT4gcmVhZEZhbGxiYWNrKCkubWF0Y2hlc1xyXG4gICAgKTtcclxuICB9LFxyXG5cclxuICBhc3luYyBjcmVhdGVNYXRjaCh1c2VySWQ6IHN0cmluZywgbWF0Y2hlZFVzZXJJZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gcnVuV2l0aERiKFxyXG4gICAgICBhc3luYyAocCkgPT4gcC5tYXRjaC5jcmVhdGUoeyBkYXRhOiB7IHVzZXJJZCwgbWF0Y2hlZFVzZXJJZCB9IH0pLFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gZGF0YS5tYXRjaGVzLmZpbmQoKG06IGFueSkgPT4gXHJcbiAgICAgICAgICAobS51c2VySWQgPT09IHVzZXJJZCAmJiBtLm1hdGNoZWRVc2VySWQgPT09IG1hdGNoZWRVc2VySWQpIHx8XHJcbiAgICAgICAgICAobS51c2VySWQgPT09IG1hdGNoZWRVc2VySWQgJiYgbS5tYXRjaGVkVXNlcklkID09PSB1c2VySWQpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoZXhpc3RpbmcpIHJldHVybiBleGlzdGluZztcclxuICAgICAgICBjb25zdCBuZXdNYXRjaCA9IHtcclxuICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpLFxyXG4gICAgICAgICAgdXNlcklkLFxyXG4gICAgICAgICAgbWF0Y2hlZFVzZXJJZCxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkYXRhLm1hdGNoZXMucHVzaChuZXdNYXRjaCk7XHJcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3TWF0Y2g7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgLy8gLS0tIE1FU1NBR0VTIC0tLVxyXG4gIGFzeW5jIGdldE1lc3NhZ2VzKHNlbmRlcklkOiBzdHJpbmcsIHJlY2VpdmVySWQ6IHN0cmluZyk6IFByb21pc2U8YW55W10+IHtcclxuICAgIHJldHVybiBydW5XaXRoRGIoXHJcbiAgICAgIGFzeW5jIChwKSA9PiBwLm1lc3NhZ2UuZmluZE1hbnkoe1xyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICBPUjogW1xyXG4gICAgICAgICAgICB7IHNlbmRlcklkLCByZWNlaXZlcklkIH0sXHJcbiAgICAgICAgICAgIHsgc2VuZGVySWQ6IHJlY2VpdmVySWQsIHJlY2VpdmVySWQ6IHNlbmRlcklkIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiAnYXNjJyB9XHJcbiAgICAgIH0pIGFzIFByb21pc2U8YW55W10+LFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xyXG4gICAgICAgIHJldHVybiBkYXRhLm1lc3NhZ2VzLmZpbHRlcigobTogYW55KSA9PiBcclxuICAgICAgICAgIChtLnNlbmRlcklkID09PSBzZW5kZXJJZCAmJiBtLnJlY2VpdmVySWQgPT09IHJlY2VpdmVySWQpIHx8XHJcbiAgICAgICAgICAobS5zZW5kZXJJZCA9PT0gcmVjZWl2ZXJJZCAmJiBtLnJlY2VpdmVySWQgPT09IHNlbmRlcklkKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgYXN5bmMgY3JlYXRlTWVzc2FnZShtc2c6IHsgc2VuZGVySWQ6IHN0cmluZzsgcmVjZWl2ZXJJZDogc3RyaW5nOyB0ZXh0OiBzdHJpbmc7IHRpbWU6IHN0cmluZzsgaXNSZXF1ZXN0PzogYm9vbGVhbjsgcmVxdWVzdFR5cGU/OiBzdHJpbmc7IHJlcXVlc3RTdGF0dXM/OiBzdHJpbmcgfSk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gcnVuV2l0aERiKFxyXG4gICAgICBhc3luYyAocCkgPT4gcC5tZXNzYWdlLmNyZWF0ZSh7IGRhdGE6IG1zZyB9KSBhcyBQcm9taXNlPGFueT4sXHJcbiAgICAgICgpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XHJcbiAgICAgICAgY29uc3QgbmV3TXNnID0ge1xyXG4gICAgICAgICAgaWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMSksXHJcbiAgICAgICAgICAuLi5tc2csXHJcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGF0YS5tZXNzYWdlcy5wdXNoKG5ld01zZyk7XHJcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3TXNnO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0sXHJcblxyXG4gIGFzeW5jIHVwZGF0ZU1lc3NhZ2VSZXF1ZXN0U3RhdHVzKG1lc3NhZ2VJZDogc3RyaW5nLCBzdGF0dXM6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gcnVuV2l0aERiKFxyXG4gICAgICBhc3luYyAocCkgPT4gcC5tZXNzYWdlLnVwZGF0ZSh7IHdoZXJlOiB7IGlkOiBtZXNzYWdlSWQgfSwgZGF0YTogeyByZXF1ZXN0U3RhdHVzOiBzdGF0dXMgfSB9KSBhcyBQcm9taXNlPGFueT4sXHJcbiAgICAgICgpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XHJcbiAgICAgICAgY29uc3QgbXNnID0gZGF0YS5tZXNzYWdlcy5maW5kKChtOiBhbnkpID0+IG0uaWQgPT09IG1lc3NhZ2VJZCk7XHJcbiAgICAgICAgaWYgKG1zZykge1xyXG4gICAgICAgICAgbXNnLnJlcXVlc3RTdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgICAgICB3cml0ZUZhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbXNnO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH0sXHJcblxyXG4gIC8vIC0tLSBET0NVTUVOVFMgLS0tXHJcbiAgYXN5bmMgZ2V0RG9jdW1lbnRzKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xyXG4gICAgcmV0dXJuIHJ1bldpdGhEYihcclxuICAgICAgYXN5bmMgKHApID0+IHAuZG9jdW1lbnQuZmluZE1hbnkoeyB3aGVyZTogeyB1c2VySWQgfSB9KSBhcyBQcm9taXNlPGFueVtdPixcclxuICAgICAgKCkgPT4gcmVhZEZhbGxiYWNrKCkuZG9jdW1lbnRzLmZpbHRlcigoZDogYW55KSA9PiBkLnVzZXJJZCA9PT0gdXNlcklkKVxyXG4gICAgKTtcclxuICB9LFxyXG5cclxuICBhc3luYyBjcmVhdGVEb2N1bWVudChkb2M6IHsgdXNlcklkOiBzdHJpbmc7IG5hbWU6IHN0cmluZzsgc2l6ZTogc3RyaW5nOyB0eXBlOiBzdHJpbmc7IHVwbG9hZERhdGU6IHN0cmluZzsgaXNSZWRhY3RlZDogYm9vbGVhbjsgcmVkYWN0ZWRGaWVsZHM6IHN0cmluZ1tdOyBzdGF0dXM6IHN0cmluZzsgcmVzdWx0VGV4dDogc3RyaW5nOyBkbmFQcm9maWxlPzogYW55IH0pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIHJ1bldpdGhEYihcclxuICAgICAgYXN5bmMgKHApID0+IHAuZG9jdW1lbnQuY3JlYXRlKHsgZGF0YTogZG9jIH0pIGFzIFByb21pc2U8YW55PixcclxuICAgICAgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcclxuICAgICAgICBjb25zdCBuZXdEb2MgPSB7XHJcbiAgICAgICAgICBpZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDExKSxcclxuICAgICAgICAgIC4uLmRvYyxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkYXRhLmRvY3VtZW50cy5wdXNoKG5ld0RvYyk7XHJcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcclxuICAgICAgICByZXR1cm4gbmV3RG9jO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGxpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHNyY1xcXFxsaWJcXFxcYXBpU2VydmVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvc3JjL2xpYi9hcGlTZXJ2ZXIudHNcIjtpbXBvcnQgeyBJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlIH0gZnJvbSAnaHR0cCc7XHJcbmltcG9ydCB7IGRiU2VydmljZSB9IGZyb20gJy4vZGInO1xyXG5pbXBvcnQgeyBnZW5lcmF0ZU5vbmNlLCBTaXdlTWVzc2FnZSB9IGZyb20gJ3Npd2UnO1xyXG5pbXBvcnQgeyBwYXJzZSBhcyBwYXJzZVVybCB9IGZyb20gJ3VybCc7XHJcblxyXG4vLyBTaW1wbGUgaW4tbWVtb3J5IHNlc3Npb24gc3RvcmVcclxuY29uc3Qgc2Vzc2lvbnM6IFJlY29yZDxzdHJpbmcsIHsgdXNlcklkOiBzdHJpbmc7IGV0aEFkZHJlc3M6IHN0cmluZyB9PiA9IHt9O1xyXG4vLyBTaW1wbGUgbm9uY2Ugc3RvcmVcclxuY29uc3Qgbm9uY2VzOiBSZWNvcmQ8c3RyaW5nLCB7IG5vbmNlOiBzdHJpbmc7IGV4cGlyZXM6IG51bWJlciB9PiA9IHt9O1xyXG5cclxuLy8gSGVscGVyIHRvIHBhcnNlIEpTT04gYm9keSBmcm9tIHJlcXVlc3RcclxuZnVuY3Rpb24gZ2V0SnNvbkJvZHkocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBQcm9taXNlPGFueT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgcmVxLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xyXG4gICAgICBib2R5ICs9IGNodW5rO1xyXG4gICAgfSk7XHJcbiAgICByZXEub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXNvbHZlKGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge30pO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJlcS5vbignZXJyb3InLCBlcnIgPT4ge1xyXG4gICAgICByZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBIZWxwZXIgdG8gcGFyc2UgY29va2llc1xyXG5mdW5jdGlvbiBwYXJzZUNvb2tpZXMocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcclxuICBjb25zdCBsaXN0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcbiAgY29uc3QgY29va2llSGVhZGVyID0gcmVxLmhlYWRlcnMuY29va2llO1xyXG4gIGlmIChjb29raWVIZWFkZXIpIHtcclxuICAgIGNvb2tpZUhlYWRlci5zcGxpdCgnOycpLmZvckVhY2goY29va2llID0+IHtcclxuICAgICAgY29uc3QgcGFydHMgPSBjb29raWUuc3BsaXQoJz0nKTtcclxuICAgICAgbGlzdFtwYXJ0c1swXS50cmltKCldID0gZGVjb2RlVVJJQ29tcG9uZW50KChwYXJ0c1sxXSB8fCAnJykudHJpbSgpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZXR1cm4gbGlzdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUFwaVJlcXVlc3QocmVxOiBJbmNvbWluZ01lc3NhZ2UsIHJlczogU2VydmVyUmVzcG9uc2UpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICBjb25zdCBwYXJzZWRVcmwgPSBwYXJzZVVybChyZXEudXJsIHx8ICcnLCB0cnVlKTtcclxuICBjb25zdCBwYXRobmFtZSA9IHBhcnNlZFVybC5wYXRobmFtZSB8fCAnJztcclxuXHJcbiAgaWYgKCFwYXRobmFtZS5zdGFydHNXaXRoKCcvYXBpJykpIHtcclxuICAgIHJldHVybiBmYWxzZTsgLy8gTm90IGFuIEFQSSByZXF1ZXN0LCBsZXQgVml0ZSBoYW5kbGUgaXRcclxuICB9XHJcblxyXG4gIC8vIFNldCBkZWZhdWx0IENPUlMgYW5kIEpTT04gaGVhZGVyc1xyXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcclxuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIE9QVElPTlMnKTtcclxuICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJywgJ0NvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvbicpO1xyXG5cclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ09QVElPTlMnKSB7XHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgIHJlcy5lbmQoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNvb2tpZXMgPSBwYXJzZUNvb2tpZXMocmVxKTtcclxuICAgIGxldCBzZXNzaW9uSWQgPSBjb29raWVzWydzaXdlX3Nlc3Npb24nXTtcclxuICAgIFxyXG4gICAgLy8gU3VwcG9ydCBTZXNzaW9uIElEIGluIEF1dGhvcml6YXRpb24gaGVhZGVyIGFzIHdlbGxcclxuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xyXG4gICAgaWYgKGF1dGhIZWFkZXIgJiYgYXV0aEhlYWRlci5zdGFydHNXaXRoKCdCZWFyZXIgJykpIHtcclxuICAgICAgc2Vzc2lvbklkID0gYXV0aEhlYWRlci5zdWJzdHJpbmcoNyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IHNlc3Npb25JZCA/IHNlc3Npb25zW3Nlc3Npb25JZF0gOiBudWxsO1xyXG5cclxuICAgIC8vIC0tLSAxLiBTSVdFIEFVVEggRU5EUE9JTlRTIC0tLVxyXG5cclxuICAgIC8vIEdFVCAvYXBpL2F1dGgvc2l3ZS9ub25jZVxyXG4gICAgaWYgKHBhdGhuYW1lID09PSAnL2FwaS9hdXRoL3Npd2Uvbm9uY2UnICYmIHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICAgIGNvbnN0IG5vbmNlID0gZ2VuZXJhdGVOb25jZSgpO1xyXG4gICAgICBjb25zdCBpZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMSk7XHJcbiAgICAgIC8vIEV4cGlyZXMgaW4gNSBtaW51dGVzXHJcbiAgICAgIG5vbmNlc1tpZF0gPSB7IG5vbmNlLCBleHBpcmVzOiBEYXRlLm5vdygpICsgNSAqIDYwICogMTAwMCB9O1xyXG5cclxuICAgICAgcmVzLnNldEhlYWRlcignU2V0LUNvb2tpZScsIGBzaXdlX25vbmNlX2lkPSR7aWR9OyBQYXRoPS87IEh0dHBPbmx5OyBTYW1lU2l0ZT1MYXhgKTtcclxuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBub25jZSB9KSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBPU1QgL2FwaS9hdXRoL3Npd2UvdmVyaWZ5XHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL2F1dGgvc2l3ZS92ZXJpZnknICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcclxuICAgICAgY29uc3QgeyBtZXNzYWdlLCBzaWduYXR1cmUgfSA9IGJvZHk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBzaXdlTWVzc2FnZSA9IG5ldyBTaXdlTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgY29uc3QgdmVyaWZpY2F0aW9uID0gYXdhaXQgc2l3ZU1lc3NhZ2UudmVyaWZ5KHsgc2lnbmF0dXJlIH0pO1xyXG5cclxuICAgICAgaWYgKHZlcmlmaWNhdGlvbi5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3QgZXRoQWRkcmVzcyA9IHZlcmlmaWNhdGlvbi5kYXRhLmFkZHJlc3MudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBVcHNlcnQgVXNlclxyXG4gICAgICAgIGxldCB1c2VyID0gYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJCeUFkZHJlc3MoZXRoQWRkcmVzcyk7XHJcbiAgICAgICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgICB1c2VyID0gYXdhaXQgZGJTZXJ2aWNlLmNyZWF0ZVVzZXIoZXRoQWRkcmVzcyk7XHJcbiAgICAgICAgICAvLyBDcmVhdGUgZGVmYXVsdCBwcm9maWxlIGZvciBuZXcgdXNlclxyXG4gICAgICAgICAgYXdhaXQgZGJTZXJ2aWNlLnVwc2VydFByb2ZpbGUodXNlci5pZCwge1xyXG4gICAgICAgICAgICBuYW1lOiBgRXRoVXNlci0ke2V0aEFkZHJlc3Muc3Vic3RyaW5nKDIsIDYpfWAsXHJcbiAgICAgICAgICAgIGFnZTogMjUsXHJcbiAgICAgICAgICAgIGJpbzogJ1ZvdWNoZWQgbWF0Y2ggdXNlci4nLFxyXG4gICAgICAgICAgICBpbnRlcmVzdHM6IFsnRXRoZXJldW0nLCAnV2ViMyddLFxyXG4gICAgICAgICAgICB2ZXJpZmllZFN0ZDogZmFsc2UsXHJcbiAgICAgICAgICAgIHZlcmlmaWVkRG5hOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVwdXRhdGlvblNjb3JlOiA1LjAsXHJcbiAgICAgICAgICAgIHZvdGVyczogW11cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdXNlciA9IGF3YWl0IGRiU2VydmljZS5nZXRVc2VyQnlBZGRyZXNzKGV0aEFkZHJlc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIFNlc3Npb25cclxuICAgICAgICBjb25zdCBuZXdTZXNzaW9uSWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcclxuICAgICAgICBzZXNzaW9uc1tuZXdTZXNzaW9uSWRdID0geyB1c2VySWQ6IHVzZXIhLmlkLCBldGhBZGRyZXNzIH07XHJcblxyXG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ1NldC1Db29raWUnLCBgc2l3ZV9zZXNzaW9uPSR7bmV3U2Vzc2lvbklkfTsgUGF0aD0vOyBIdHRwT25seTsgU2FtZVNpdGU9TGF4YCk7XHJcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIHVzZXIsIHNlc3Npb25JZDogbmV3U2Vzc2lvbklkIH0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnVmVyaWZpY2F0aW9uIGZhaWxlZCcgfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdFVCAvYXBpL2F1dGgvc2l3ZS9zZXNzaW9uXHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL2F1dGgvc2l3ZS9zZXNzaW9uJyAmJiByZXEubWV0aG9kID09PSAnR0VUJykge1xyXG4gICAgICBpZiAoc2Vzc2lvbikge1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0VXNlckJ5QWRkcmVzcyhzZXNzaW9uLmV0aEFkZHJlc3MpO1xyXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBhdXRoZW50aWNhdGVkOiB0cnVlLCBzZXNzaW9uLCB1c2VyIH0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgYXV0aGVudGljYXRlZDogZmFsc2UgfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBPU1QgL2FwaS9hdXRoL3Npd2UvbG9nb3V0XHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL2F1dGgvc2l3ZS9sb2dvdXQnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgICBpZiAoc2Vzc2lvbklkICYmIHNlc3Npb25zW3Nlc3Npb25JZF0pIHtcclxuICAgICAgICBkZWxldGUgc2Vzc2lvbnNbc2Vzc2lvbklkXTtcclxuICAgICAgfVxyXG4gICAgICByZXMuc2V0SGVhZGVyKCdTZXQtQ29va2llJywgJ3Npd2Vfc2Vzc2lvbj07IFBhdGg9LzsgRXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVCcpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUgfSkpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0gMi4gVVNFUlMgJiBQUk9GSUxFUyBFTkRQT0lOVFMgLS0tXHJcblxyXG4gICAgLy8gR0VUIC9hcGkvdXNlcnNcclxuICAgIGlmIChwYXRobmFtZSA9PT0gJy9hcGkvdXNlcnMnICYmIHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJzKCk7XHJcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHVzZXJzKSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEdFVCAvYXBpL3Byb2ZpbGVzXHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL3Byb2ZpbGVzJyAmJiByZXEubWV0aG9kID09PSAnR0VUJykge1xyXG4gICAgICBjb25zdCBwcm9maWxlcyA9IGF3YWl0IGRiU2VydmljZS5nZXRQcm9maWxlcygpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShwcm9maWxlcykpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQT1NUIC9hcGkvcHJvZmlsZXMvdXBzZXJ0XHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL3Byb2ZpbGVzL3Vwc2VydCcgJiYgcmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XHJcbiAgICAgIGlmICghc2Vzc2lvbikge1xyXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAxO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBnZXRKc29uQm9keShyZXEpO1xyXG4gICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgZGJTZXJ2aWNlLnVwc2VydFByb2ZpbGUoc2Vzc2lvbi51c2VySWQsIGJvZHkpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShwcm9maWxlKSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLSAzLiBNQVRDSEVTIEVORFBPSU5UUyAtLS1cclxuXHJcbiAgICAvLyBHRVQgL2FwaS9tYXRjaGVzXHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL21hdGNoZXMnICYmIHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0TWF0Y2hlcygpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShtYXRjaGVzKSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBPU1QgL2FwaS9tYXRjaGVzXHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL21hdGNoZXMnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgICBpZiAoIXNlc3Npb24pIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcclxuICAgICAgY29uc3QgeyBtYXRjaGVkVXNlcklkIH0gPSBib2R5O1xyXG4gICAgICBjb25zdCBtYXRjaCA9IGF3YWl0IGRiU2VydmljZS5jcmVhdGVNYXRjaChzZXNzaW9uLnVzZXJJZCwgbWF0Y2hlZFVzZXJJZCk7XHJcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KG1hdGNoKSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLSA0LiBNRVNTQUdFUyBFTkRQT0lOVFMgLS0tXHJcblxyXG4gICAgLy8gR0VUIC9hcGkvbWVzc2FnZXNcclxuICAgIGlmIChwYXRobmFtZSA9PT0gJy9hcGkvbWVzc2FnZXMnICYmIHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XHJcbiAgICAgIGNvbnN0IHsgc2VuZGVySWQsIHJlY2VpdmVySWQgfSA9IHBhcnNlZFVybC5xdWVyeTtcclxuICAgICAgaWYgKCFzZW5kZXJJZCB8fCAhcmVjZWl2ZXJJZCkge1xyXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ3NlbmRlcklkIGFuZCByZWNlaXZlcklkIGFyZSByZXF1aXJlZCcgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgZGJTZXJ2aWNlLmdldE1lc3NhZ2VzKHNlbmRlcklkIGFzIHN0cmluZywgcmVjZWl2ZXJJZCBhcyBzdHJpbmcpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQT1NUIC9hcGkvbWVzc2FnZXNcclxuICAgIGlmIChwYXRobmFtZSA9PT0gJy9hcGkvbWVzc2FnZXMnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgICBpZiAoIXNlc3Npb24pIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcclxuICAgICAgaWYgKGJvZHkuc2VuZGVySWQgIT09IHNlc3Npb24udXNlcklkKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDM7XHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnRm9yYmlkZGVuOiBzZW5kZXJJZCBtdXN0IG1hdGNoIHNlc3Npb24nIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZGJTZXJ2aWNlLmNyZWF0ZU1lc3NhZ2UoYm9keSk7XHJcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUE9TVCAvYXBpL21lc3NhZ2VzL3N0YXR1c1xyXG4gICAgaWYgKHBhdGhuYW1lID09PSAnL2FwaS9tZXNzYWdlcy9zdGF0dXMnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgICBpZiAoIXNlc3Npb24pIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcclxuICAgICAgY29uc3QgeyBtZXNzYWdlSWQsIHN0YXR1cyB9ID0gYm9keTtcclxuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGRiU2VydmljZS51cGRhdGVNZXNzYWdlUmVxdWVzdFN0YXR1cyhtZXNzYWdlSWQsIHN0YXR1cyk7XHJcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLS0tIDUuIERPQ1VNRU5UUyBFTkRQT0lOVFMgLS0tXHJcblxyXG4gICAgLy8gR0VUIC9hcGkvZG9jdW1lbnRzXHJcbiAgICBpZiAocGF0aG5hbWUgPT09ICcvYXBpL2RvY3VtZW50cycgJiYgcmVxLm1ldGhvZCA9PT0gJ0dFVCcpIHtcclxuICAgICAgY29uc3QgeyB1c2VySWQgfSA9IHBhcnNlZFVybC5xdWVyeTtcclxuICAgICAgaWYgKCF1c2VySWQpIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICd1c2VySWQgaXMgcmVxdWlyZWQnIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBkb2N1bWVudHMgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0RG9jdW1lbnRzKHVzZXJJZCBhcyBzdHJpbmcpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkb2N1bWVudHMpKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUE9TVCAvYXBpL2RvY3VtZW50c1xyXG4gICAgaWYgKHBhdGhuYW1lID09PSAnL2FwaS9kb2N1bWVudHMnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xyXG4gICAgICBpZiAoIXNlc3Npb24pIHtcclxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcclxuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0pKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcclxuICAgICAgaWYgKGJvZHkudXNlcklkICE9PSBzZXNzaW9uLnVzZXJJZCkge1xyXG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAzO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ZvcmJpZGRlbjogdXNlcklkIG11c3QgbWF0Y2ggc2Vzc2lvbicgfSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGRvY3VtZW50ID0gYXdhaXQgZGJTZXJ2aWNlLmNyZWF0ZURvY3VtZW50KGJvZHkpO1xyXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkb2N1bWVudCkpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcclxuICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0VuZHBvaW50IG5vdCBmb3VuZCcgfSkpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSBFcnJvcjonLCBlcnJvcik7XHJcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcclxuICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSkpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBT0EsV0FBVTs7O0FDSGdPLFNBQVMsb0JBQW9CO0FBQzlRLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUdqQixJQUFJLFNBQThCO0FBQ2xDLElBQUksY0FBYztBQUVsQixJQUFJO0FBQ0YsV0FBUyxJQUFJLGFBQWE7QUFBQSxJQUN4QixhQUFhO0FBQUEsTUFDWCxJQUFJO0FBQUEsUUFDRixLQUFLLFFBQVEsSUFBSSxnQkFBZ0I7QUFBQSxNQUNuQztBQUFBLElBQ0Y7QUFBQSxFQUNGLENB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
