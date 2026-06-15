import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Dual-mode DB handler: uses Prisma/PostgreSQL if available, falls back to local JSON file or memory.
let prisma: PrismaClient | null = null;
let useFallback = false;

// Retry configuration
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000; // 1 second

// Exponential backoff delay calculation
function getRetryDelay(attempt: number): number {
  return BASE_RETRY_DELAY * Math.pow(2, attempt);
}

// Retry wrapper with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error.code === "P2002" || error.code === "P2025") {
        throw error;
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = getRetryDelay(attempt);
        console.info(
          `Retry ${attempt + 1}/${MAX_RETRIES} for ${operationName} after ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Initialize Prisma with retry logic
async function initializePrisma(): Promise<PrismaClient | null> {
  try {
    const client = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            "postgresql://postgres:postgres@localhost:5432/evolve_db?schema=public",
        },
      },
      log: ["error", "warn"],
    });

    // Test connection with retry
    await retryWithBackoff(() => client.$connect(), "Prisma connection");

    console.info("Prisma Client initialized successfully");
    return client;
  } catch (e) {
    console.info("PostgreSQL not available. Using JSON fallback database.");
    return null;
  }
}

// Initialize Prisma asynchronously
initializePrisma()
  .then((client) => {
    prisma = client;
    useFallback = !client;
  })
  .catch(() => {
    useFallback = true;
  });

const FALLBACK_FILE = path.join(process.cwd(), "fallback-db.json");

// Mock data to initialize if fallback-db.json doesn't exist
const initialFallbackData = {
  users: [
    {
      id: "1",
      ethAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      ethAddress: "0x3AcA7bbf08F6D6cf92ED9C5B7FDE7b944208a0e8",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      ethAddress: "0x90F8bf6A479f320ced073E824F25135bc93C7a4e",
      createdAt: new Date().toISOString(),
    },
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
        { name: "Diana", weight: 9.1, relation: "Vouched match" },
      ],
      dnaProfile: {
        D3S1358: [15, 18],
        vWA: [16, 17],
        FGA: [21, 24],
        D8S1179: [13, 14],
        D21S11: [29, 31.2],
        D18S51: [12, 15],
        D5S818: [11, 12],
        D13S317: [8, 12],
        D7S820: [10, 11],
      },
      stdTestResult:
        "NEGATIVE for all common pathogens (HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1/2)",
      accessPermissions: {
        stdRequested: false,
        stdApproved: false,
        dnaRequested: false,
        dnaApproved: false,
        myStdApprovedToThem: false,
        myDnaApprovedToThem: false,
      },
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
        { name: "Frank", weight: 7.8, relation: "Node Operator" },
      ],
      dnaProfile: {
        D3S1358: [14, 15],
        vWA: [14, 16],
        FGA: [20, 22],
        D8S1179: [12, 13],
        D21S11: [28, 30],
        D18S51: [14, 16],
        D5S818: [11, 13],
        D13S317: [9, 11],
        D7S820: [8, 10],
      },
      stdTestResult:
        "NEGATIVE for all common pathogens (HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1/2)",
      accessPermissions: {
        stdRequested: false,
        stdApproved: false,
        dnaRequested: false,
        dnaApproved: false,
        myStdApprovedToThem: false,
        myDnaApprovedToThem: false,
      },
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
      voters: [{ name: "Bob", weight: 8.2, relation: "Hackathon Teammate" }],
      accessPermissions: {
        stdRequested: false,
        stdApproved: false,
        dnaRequested: false,
        dnaApproved: false,
        myStdApprovedToThem: false,
        myDnaApprovedToThem: false,
      },
    },
  ],
  matches: [] as any[],
  messages: [] as any[],
  documents: [] as any[],
};

function readFallback() {
  if (!fs.existsSync(FALLBACK_FILE)) {
    fs.writeFileSync(
      FALLBACK_FILE,
      JSON.stringify(initialFallbackData, null, 2),
    );
    return initialFallbackData;
  }
  try {
    return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"));
  } catch (e) {
    return initialFallbackData;
  }
}

function writeFallback(data: any) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}

// Wrapper to try Prisma with retry and fallback if it can't connect
async function runWithDb<T>(
  dbQuery: (p: PrismaClient) => Promise<T>,
  fallbackQuery: () => T,
  operationName: string = "database operation",
): Promise<T> {
  if (useFallback || !prisma) {
    return fallbackQuery();
  }
  try {
    return await retryWithBackoff(() => dbQuery(prisma!), operationName);
  } catch (e: any) {
    if (
      e.code === "P1001" ||
      e.message?.includes("Can't reach database") ||
      e.message?.includes("initialization")
    ) {
      console.info("PostgreSQL not reachable. Falling back to JSON database.");
      useFallback = true;
      return fallbackQuery();
    }
    throw e;
  }
}

export const dbService = {
  // --- USERS ---
  async getUsers() {
    return runWithDb(
      async (p) => p.user.findMany({ include: { profile: true } }),
      () => {
        const data = readFallback();
        return data.users.map((u: any) => ({
          ...u,
          profile: data.profiles.find((p: any) => p.userId === u.id) || null,
        }));
      },
      "getUsers",
    );
  },

  async getUserByAddress(ethAddress: string) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) =>
        p.user.findFirst({
          where: { ethAddress: { equals: formattedAddr, mode: "insensitive" } },
          include: { profile: true },
        }),
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u: any) =>
            u.ethAddress && u.ethAddress.toLowerCase() === formattedAddr,
        );
        if (!user) return null;
        return {
          ...user,
          profile: data.profiles.find((p: any) => p.userId === user.id) || null,
        };
      },
      "getUserByAddress",
    );
  },

  async getUserByEmail(email: string) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) =>
        p.user.findFirst({
          where: { email: { equals: formattedEmail, mode: "insensitive" } },
          include: { profile: true },
        }),
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u: any) => u.email && u.email.toLowerCase() === formattedEmail,
        );
        if (!user) return null;
        return {
          ...user,
          profile: data.profiles.find((p: any) => p.userId === user.id) || null,
        };
      },
      "getUserByEmail",
    );
  },

  async getUserByPhone(phoneNumber: string) {
    const formattedPhone = phoneNumber.trim();
    return runWithDb(
      async (p) =>
        p.user.findFirst({
          where: {
            phoneNumber: { equals: formattedPhone, mode: "insensitive" },
          },
          include: { profile: true },
        }),
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u: any) => u.phoneNumber && u.phoneNumber === formattedPhone,
        );
        if (!user) return null;
        return {
          ...user,
          profile: data.profiles.find((p: any) => p.userId === user.id) || null,
        };
      },
      "getUserByPhone",
    );
  },

  async createUser(ethAddress: string) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) => p.user.create({ data: { ethAddress: formattedAddr } }),
      () => {
        const data = readFallback();
        const existing = data.users.find(
          (u: any) =>
            u.ethAddress && u.ethAddress.toLowerCase() === formattedAddr,
        );
        if (existing) return existing;
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          ethAddress: formattedAddr,
          createdAt: new Date().toISOString(),
        };
        data.users.push(newUser);
        writeFallback(data);
        return newUser;
      },
      "createUser",
    );
  },

  async createUserWithEmail(email: string, passwordHash: string) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) =>
        p.user.create({ data: { email: formattedEmail, passwordHash } }),
      () => {
        const data = readFallback();
        const existing = data.users.find(
          (u: any) => u.email && u.email.toLowerCase() === formattedEmail,
        );
        if (existing) return existing;
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          email: formattedEmail,
          passwordHash,
          createdAt: new Date().toISOString(),
        };
        data.users.push(newUser);
        writeFallback(data);
        return newUser;
      },
      "createUserWithEmail",
    );
  },

  async createUserWithPhone(phoneNumber: string) {
    const formattedPhone = phoneNumber.trim();
    return runWithDb(
      async (p) => p.user.create({ data: { phoneNumber: formattedPhone } }),
      () => {
        const data = readFallback();
        const existing = data.users.find(
          (u: any) => u.phoneNumber && u.phoneNumber === formattedPhone,
        );
        if (existing) return existing;
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          phoneNumber: formattedPhone,
          createdAt: new Date().toISOString(),
        };
        data.users.push(newUser);
        writeFallback(data);
        return newUser;
      },
      "createUserWithPhone",
    );
  },

  // --- PROFILES ---
  async getProfiles() {
    return runWithDb(
      async (p) => p.profile.findMany(),
      () => readFallback().profiles,
      "getProfiles",
    );
  },

  async upsertProfile(userId: string, profileData: any) {
    return runWithDb(
      async (p) =>
        p.profile.upsert({
          where: { userId },
          update: profileData,
          create: { userId, ...profileData },
        }),
      () => {
        const data = readFallback();
        let profile = data.profiles.find((p: any) => p.userId === userId);
        if (profile) {
          Object.assign(profile, profileData);
        } else {
          profile = {
            id: Math.random().toString(36).substring(2, 11),
            userId,
            ...profileData,
          };
          data.profiles.push(profile);
        }
        writeFallback(data);
        return profile;
      },
      "upsertProfile",
    );
  },

  // --- MATCHES ---
  async getMatches() {
    return runWithDb(
      async (p) => p.match.findMany(),
      () => readFallback().matches,
      "getMatches",
    );
  },

  async createMatch(userId: string, matchedUserId: string) {
    return runWithDb(
      async (p) => p.match.create({ data: { userId, matchedUserId } }),
      () => {
        const data = readFallback();
        const existing = data.matches.find(
          (m: any) =>
            (m.userId === userId && m.matchedUserId === matchedUserId) ||
            (m.userId === matchedUserId && m.matchedUserId === userId),
        );
        if (existing) return existing;
        const newMatch = {
          id: Math.random().toString(36).substring(2, 11),
          userId,
          matchedUserId,
          createdAt: new Date().toISOString(),
        };
        data.matches.push(newMatch);
        writeFallback(data);
        return newMatch;
      },
      "createMatch",
    );
  },

  // --- MESSAGES ---
  async getMessages(senderId: string, receiverId: string): Promise<any[]> {
    return runWithDb(
      async (p) =>
        p.message.findMany({
          where: {
            OR: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
          orderBy: { createdAt: "asc" },
        }) as Promise<any[]>,
      () => {
        const data = readFallback();
        return data.messages.filter(
          (m: any) =>
            (m.senderId === senderId && m.receiverId === receiverId) ||
            (m.senderId === receiverId && m.receiverId === senderId),
        );
      },
      "getMessages",
    );
  },

  async createMessage(msg: {
    senderId: string;
    receiverId: string;
    text: string;
    time: string;
    isRequest?: boolean;
    requestType?: string;
    requestStatus?: string;
  }): Promise<any> {
    return runWithDb(
      async (p) => p.message.create({ data: msg }) as Promise<any>,
      () => {
        const data = readFallback();
        const newMsg = {
          id: Math.random().toString(36).substring(2, 11),
          ...msg,
          createdAt: new Date().toISOString(),
        };
        data.messages.push(newMsg);
        writeFallback(data);
        return newMsg;
      },
      "createMessage",
    );
  },

  async updateMessageRequestStatus(
    messageId: string,
    status: string,
  ): Promise<any> {
    return runWithDb(
      async (p) =>
        p.message.update({
          where: { id: messageId },
          data: { requestStatus: status },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        const msg = data.messages.find((m: any) => m.id === messageId);
        if (msg) {
          msg.requestStatus = status;
          writeFallback(data);
        }
        return msg;
      },
      "updateMessageRequestStatus",
    );
  },

  // --- DOCUMENTS ---
  async getDocuments(userId: string): Promise<any[]> {
    return runWithDb(
      async (p) => p.document.findMany({ where: { userId } }) as Promise<any[]>,
      () => readFallback().documents.filter((d: any) => d.userId === userId),
      "getDocuments",
    );
  },

  async createDocument(doc: {
    userId: string;
    name: string;
    size: string;
    type: string;
    uploadDate: string;
    isRedacted: boolean;
    redactedFields: string[];
    status: string;
    resultText: string;
    dnaProfile?: any;
  }): Promise<any> {
    return runWithDb(
      async (p) => p.document.create({ data: doc }) as Promise<any>,
      () => {
        const data = readFallback();
        const newDoc = {
          id: Math.random().toString(36).substring(2, 11),
          ...doc,
          createdAt: new Date().toISOString(),
        };
        data.documents.push(newDoc);
        writeFallback(data);
        return newDoc;
      },
      "createDocument",
    );
  },
};
