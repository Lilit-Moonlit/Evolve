import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Dual-mode DB handler: uses Prisma if available, falls back to local JSON file or memory.
let prisma: PrismaClient | null = null;
let useFallback = false;

// When FORCE_FALLBACK=1 the app always reads/writes fallback-db.json and never
// connects to the Prisma datasource. Useful for dev/testing with seed data in
// the fallback file without a running database. Remove the env var to go back
// to the Prisma-backed store (see AGENTS.md QA procedure).
const FORCE_FALLBACK = process.env.FORCE_FALLBACK === "1";
useFallback = FORCE_FALLBACK;

// Retry configuration
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000; // 1 second

// Exponential backoff delay calculation
function getRetryDelay(attempt: number): number {
  return BASE_RETRY_DELAY * Math.pow(2, attempt);
}

// Retry wrapper with exponential backoff
async function retryWithBackoff<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
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
        console.info(`Retry ${attempt + 1}/${MAX_RETRIES} for ${operationName} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Initialize Prisma with retry logic
async function initializePrisma(): Promise<PrismaClient | null> {
  if (FORCE_FALLBACK) {
    console.info("FORCE_FALLBACK=1. Using JSON fallback database.");
    return null;
  }
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
    useFallback = FORCE_FALLBACK || !client;
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
      searchDetails: {
        kind: "woman",
        gender: "female",
        lookingFor: "man",
        testingPreference: "both",
      },
      bio: "Passionate about blockchain and decentralized apps. Looking for meaningful connections.",
      interests: ["Web3", "Crypto", "Gaming", "Travel"],
      imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      ageHidden: false,
      languages: ["en", "de"],
      photoBlurred: true,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: true,
      verifiedDna: false,
      reputationScore: 8.7,
      authMode: "normal",
      hideProfileFromLowerLevels: false,
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
      searchDetails: { kind: "man", gender: "male", lookingFor: "woman", testingPreference: "lab" },
      bio: "Early crypto adopter and a big fan of open-source. Enjoy hiking and coding.",
      interests: ["Hiking", "Coding", "Ethereum", "DeFi"],
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      ageHidden: false,
      languages: ["en", "es"],
      photoBlurred: true,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: true,
      verifiedDna: true,
      reputationScore: 9.4,
      authMode: "pregnancy-bond",
      hideProfileFromLowerLevels: true,
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
      searchDetails: {
        kind: "man",
        gender: "male",
        lookingFor: "woman",
        testingPreference: "none",
      },
      bio: "Loves exploring new technologies and meeting like-minded people. Coffee enthusiast.",
      interests: ["Coffee", "AI", "Startups", "Art"],
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      ageHidden: true,
      languages: ["en", "fr"],
      photoBlurred: false,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: false,
      verifiedDna: false,
      reputationScore: 6.2,
      authMode: "normal",
      hideProfileFromLowerLevels: false,
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
    {
      id: "4",
      userId: "4",
      name: "Diana",
      age: 30,
      searchDetails: {
        kind: "woman",
        gender: "female",
        lookingFor: "man",
        testingPreference: "portable",
      },
      bio: "Digital nomad and crypto enthusiast. Love exploring new cultures and technologies.",
      interests: ["Travel", "Crypto", "Photography", "Yoga"],
      imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      ageHidden: false,
      languages: ["uk", "pl"],
      photoBlurred: false,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: true,
      verifiedDna: true,
      reputationScore: 9.1,
      authMode: "cryptic-choice",
      hideProfileFromLowerLevels: true,
      voters: [
        { name: "Alice", weight: 8.7, relation: "Travel buddy" },
        { name: "Bob", weight: 9.4, relation: "Crypto partner" },
      ],
      dnaProfile: {
        D3S1358: [13, 16],
        vWA: [15, 18],
        FGA: [19, 23],
        D8S1179: [11, 14],
        D21S11: [27, 31],
        D18S51: [13, 16],
        D5S818: [10, 12],
        D13S317: [7, 11],
        D7S820: [9, 12],
      },
      stdTestResult: "NEGATIVE for all common pathogens",
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
      id: "5",
      userId: "5",
      name: "Elena",
      age: 27,
      searchDetails: {
        kind: "woman",
        gender: "female",
        lookingFor: "man",
        testingPreference: "lab",
      },
      bio: "Software engineer by day, artist by night. Believer in decentralized future.",
      interests: ["Art", "Coding", "Music", "DeFi"],
      imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
      ageHidden: false,
      languages: ["en", "ja"],
      photoBlurred: false,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: true,
      verifiedDna: false,
      reputationScore: 8.9,
      authMode: "pregnancy-bond",
      hideProfileFromLowerLevels: false,
      voters: [
        { name: "Bob", weight: 9.4, relation: "Colleague" },
        { name: "Diana", weight: 9.1, relation: "Friend" },
      ],
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
      id: "6",
      userId: "6",
      name: "Frank",
      age: 35,
      searchDetails: {
        kind: "man",
        gender: "male",
        lookingFor: "woman",
        testingPreference: "portable",
      },
      bio: "Blockchain node operator and open-source contributor. Dog person.",
      interests: ["Dogs", "Ethereum", "Rust", "Hiking"],
      imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
      ageHidden: false,
      languages: ["en", "pt"],
      photoBlurred: false,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: true,
      verifiedDna: true,
      reputationScore: 9.6,
      authMode: "cryptic-choice",
      hideProfileFromLowerLevels: true,
      voters: [
        { name: "Bob", weight: 9.4, relation: "Node partner" },
        { name: "Diana", weight: 9.1, relation: "Verified match" },
      ],
      dnaProfile: {
        D3S1358: [14, 17],
        vWA: [13, 15],
        FGA: [22, 25],
        D8S1179: [10, 13],
        D21S11: [29, 30],
        D18S51: [15, 17],
        D5S818: [12, 13],
        D13S317: [8, 10],
        D7S820: [7, 11],
      },
      stdTestResult: "NEGATIVE for all common pathogens",
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
      id: "7",
      userId: "7",
      name: "Grace",
      age: 24,
      searchDetails: {
        kind: "woman",
        gender: "female",
        lookingFor: "man",
        testingPreference: "none",
      },
      bio: "Crypto newbe learning about DeFi and Web3. Love cats and books.",
      interests: ["Books", "Cats", "Learning", "Crypto"],
      imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
      verifiedStd: false,
      verifiedDna: false,
      reputationScore: 5.8,
      authMode: "normal",
      hideProfileFromLowerLevels: false,
      voters: [],
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
      id: "8",
      userId: "8",
      name: "Henry",
      age: 31,
      searchDetails: {
        kind: "man",
        gender: "male",
        lookingFor: "woman",
        testingPreference: "both",
      },
      bio: "Tech entrepreneur and angel investor. Looking for genuine connections.",
      interests: ["Startups", "AI", "Wine", "Tennis"],
      imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
      verifiedStd: true,
      verifiedDna: true,
      reputationScore: 9.2,
      authMode: "pregnancy-bond",
      hideProfileFromLowerLevels: true,
      voters: [
        { name: "Frank", weight: 9.6, relation: "Business partner" },
        { name: "Diana", weight: 9.1, relation: "Investor" },
      ],
      dnaProfile: {
        D3S1358: [16, 19],
        vWA: [14, 17],
        FGA: [20, 24],
        D8S1179: [12, 15],
        D21S11: [28, 31],
        D18S51: [13, 14],
        D5S818: [11, 12],
        D13S317: [9, 12],
        D7S820: [8, 10],
      },
      stdTestResult: "NEGATIVE for all common pathogens",
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
      id: "9",
      userId: "9",
      name: "Olya & Max",
      age: 29,
      searchDetails: {
        kind: "couple_man_woman",
        gender: "other",
        testingPreference: "lab",
      },
      bio: "A couple open to new acquaintances. Honesty and openness first.",
      interests: ["Travel", "Board games", "Web3"],
      imageUrl: "",
      ageHidden: false,
      languages: ["uk", "en"],
      photoBlurred: false,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: true,
      verifiedDna: false,
      reputationScore: 7.4,
      authMode: "normal",
      hideProfileFromLowerLevels: false,
      voters: [{ name: "Alice", weight: 7.2, relation: "Friend" }],
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
      id: "10",
      userId: "10",
      name: "Evolve Lab",
      age: 1,
      searchDetails: { kind: "laboratory", gender: "other", country: "Ukraine", city: "Kyiv" },
      bio: "Partner laboratory: STD/DNA testing with patient QR verification and results chat.",
      interests: ["Diagnostics", "STD", "DNA"],
      imageUrl: "",
      ageHidden: true,
      languages: ["uk", "en"],
      photoBlurred: false,
      photoGrants: {},
      onboardingComplete: true,
      verifiedStd: false,
      verifiedDna: false,
      reputationScore: 9.9,
      authMode: "normal",
      hideProfileFromLowerLevels: false,
      voters: [],
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
  messages: [
    {
      id: "m1",
      senderId: "0fxxttsis",
      receiverId: "1",
      text: "Hey Alice! Love your Web3 projects.",
      time: "2026-06-10T10:30:00.000Z",
      isRequest: false,
    },
    {
      id: "m2",
      senderId: "1",
      receiverId: "0fxxttsis",
      text: "Thanks! I saw you're into crypto too. What chains do you use?",
      time: "2026-06-10T10:35:00.000Z",
      isRequest: false,
    },
    {
      id: "m3",
      senderId: "0fxxttsis",
      receiverId: "1",
      text: "Mostly Arbitrum and Polygon. Love the low fees!",
      time: "2026-06-10T10:40:00.000Z",
      isRequest: false,
    },
    {
      id: "m4",
      senderId: "0fxxttsis",
      receiverId: "4",
      text: "Hi Diana! Fellow digital nomad here.",
      time: "2026-06-10T11:00:00.000Z",
      isRequest: false,
    },
    {
      id: "m5",
      senderId: "4",
      receiverId: "0fxxttsis",
      text: "Hey! Where are you based right now?",
      time: "2026-06-10T11:05:00.000Z",
      isRequest: false,
    },
    {
      id: "m6",
      senderId: "0fxxttsis",
      receiverId: "4",
      text: "Currently in Lisbon. You?",
      time: "2026-06-10T11:10:00.000Z",
      isRequest: false,
    },
    {
      id: "m7",
      senderId: "4",
      receiverId: "0fxxttsis",
      text: "Bali! We should connect at a crypto conference sometime.",
      time: "2026-06-10T11:15:00.000Z",
      isRequest: false,
    },
  ],
  documents: [] as any[],
  labReports: [] as any[],
  partners: [] as any[],
  compatibilityChecks: [] as any[],
  companionPatients: [] as any[],
  companionLabs: [] as any[],
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

function writeFallback(data: any) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
}

// Parse a JSON-stringified array (e.g. CompanionPatient.additionalPhotos).
function safeParseJsonArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

// Several Profile columns (dnaProfile, accessPermissions, interests, voters)
// are NOT NULL String columns holding serialized JSON. Prisma reads return the
// raw strings; expose them to consumers as objects/arrays so the Postgres path
// matches the shape the file-based fallback store provides.
const PROFILE_JSON_COLUMNS = [
  "dnaProfile",
  "accessPermissions",
  "interests",
  "voters",
  "languages",
  "photoGrants",
  "searchDetails",
  "faceEmbedding",
  "parsedStd",
];

function deserializeProfileRow(profile: any) {
  if (!profile || typeof profile !== "object") return profile;
  const parsed: Record<string, unknown> = { ...profile };
  for (const key of PROFILE_JSON_COLUMNS) {
    const value = parsed[key];
    if (typeof value === "string") {
      try {
        parsed[key] = JSON.parse(value);
      } catch {
        parsed[key] = key === "interests" || key === "voters" ? [] : null;
      }
    }
  }
  return parsed;
}

/**
 * At-most-once registration-reward claim over an in-memory profile list
 * (the fallback store). Pure decision+apply seam so the semantics can be
 * unit-tested without a database: returns true only when the profile is
 * STD-verified and not yet rewarded, in which case the flag is flipped on
 * the matched object in place. A missing `registrationRewarded` field
 * (legacy fallback rows) counts as unclaimed, mirroring the Prisma column
 * default (`Boolean @default(false)`).
 */
export function claimRegistrationRewardInMemory(profiles: any[], userId: string): boolean {
  const profile = profiles.find((p: any) => p.userId === userId);
  if (!profile) return false;
  if (profile.verifiedStd === true && profile.registrationRewarded !== true) {
    profile.registrationRewarded = true;
    return true;
  }
  return false;
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
      async (p) => {
        const user = await p.user.findFirst({
          where: { ethAddress: { equals: formattedAddr } },
          include: { profile: true },
        });
        return user ? { ...user, profile: deserializeProfileRow(user.profile) } : null;
      },
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u: any) => u.ethAddress && u.ethAddress.toLowerCase() === formattedAddr,
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
      async (p) => {
        const user = await p.user.findFirst({
          where: { email: { equals: formattedEmail } },
          include: { profile: true },
        });
        return user ? { ...user, profile: deserializeProfileRow(user.profile) } : null;
      },
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

  async getUserById(id: string) {
    return runWithDb(
      async (p) => p.user.findUnique({ where: { id } }),
      () => {
        const data = readFallback();
        return data.users.find((u: any) => u.id === id) || null;
      },
      "getUserById",
    );
  },

  async createUser(ethAddress: string) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) => p.user.create({ data: { ethAddress: formattedAddr } }),
      () => {
        const data = readFallback();
        const existing = data.users.find(
          (u: any) => u.ethAddress && u.ethAddress.toLowerCase() === formattedAddr,
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
      async (p) => p.user.create({ data: { email: formattedEmail, passwordHash } }),
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

  // --- SECURITY QUESTION (account recovery) ---
  // Stores (or updates) the user's security question + SHA-256 answer hash.
  // Works in both Prisma and fallback modes.
  async setSecurityQuestion(email: string, question: string, answerHash: string) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) =>
        p.user.update({
          where: { email: formattedEmail },
          data: { securityQuestion: question, securityAnswerHash: answerHash },
        }),
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u: any) => u.email && u.email.toLowerCase() === formattedEmail,
        );
        if (!user) return null;
        user.securityQuestion = question;
        user.securityAnswerHash = answerHash;
        writeFallback(data);
        return user;
      },
      "setSecurityQuestion",
    );
  },

  async getSecurityQuestion(email: string) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) => {
        const user = await p.user.findFirst({
          where: { email: { equals: formattedEmail } },
          select: { securityQuestion: true, securityAnswerHash: true },
        });
        return user
          ? { securityQuestion: user.securityQuestion, securityAnswerHash: user.securityAnswerHash }
          : null;
      },
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u: any) => u.email && u.email.toLowerCase() === formattedEmail,
        );
        if (!user) return null;
        return {
          securityQuestion: user.securityQuestion ?? null,
          securityAnswerHash: user.securityAnswerHash ?? null,
        };
      },
      "getSecurityQuestion",
    );
  },

  // --- PROFILES ---
  async getProfiles() {
    return runWithDb(
      async (p) => (await p.profile.findMany()).map((row) => deserializeProfileRow(row)),
      () => readFallback().profiles,
      "getProfiles",
    );
  },

  /** Fetch a single profile by userId (face embedding included, already parsed). */
  async getProfileByUserId(userId: string) {
    return runWithDb(
      async (p) => {
        const row = await (p as any).profile.findUnique({ where: { userId } });
        return row ? deserializeProfileRow(row) : null;
      },
      () => {
        const data = readFallback();
        return data.profiles.find((x: any) => x.userId === userId) || null;
      },
      "getProfileByUserId",
    );
  },

  async upsertProfile(userId: string, profileData: any) {
    // Several Profile columns (interests, voters, accessPermissions,
    // dnaProfile, languages, photoGrants) are NOT NULL String columns holding
    // serialized JSON while callers work with plain arrays/objects. Serialize
    // on write; parse back on read via deserializeProfileRow. The create
    // branch defaults omitted fields; the update branch touches a column only
    // when explicitly provided.
    const {
      interests,
      voters,
      accessPermissions,
      dnaProfile,
      languages,
      photoGrants,
      searchDetails,
      faceEmbedding,
      parsedStd,
      ...rest
    } = profileData ?? {};
    const updatePatch: Record<string, unknown> = { ...rest };
    if (interests !== undefined) updatePatch.interests = JSON.stringify(interests);
    if (voters !== undefined) updatePatch.voters = JSON.stringify(voters);
    if (accessPermissions !== undefined) {
      updatePatch.accessPermissions = JSON.stringify(accessPermissions ?? null);
    }
    if (dnaProfile !== undefined) {
      updatePatch.dnaProfile = JSON.stringify(dnaProfile ?? null);
    }
    if (languages !== undefined) {
      updatePatch.languages = JSON.stringify(languages);
    }
    if (photoGrants !== undefined) {
      updatePatch.photoGrants = JSON.stringify(photoGrants ?? {});
    }
    if (searchDetails !== undefined) {
      updatePatch.searchDetails = JSON.stringify(searchDetails ?? {});
    }
    if (faceEmbedding !== undefined) {
      // 1404-dim normalized vector stored as a JSON string (or null).
      updatePatch.faceEmbedding = JSON.stringify(faceEmbedding ?? null);
    }
    if (parsedStd !== undefined) {
      // Parsed STD result (StdTestParseResult) stored as a JSON string (or null).
      updatePatch.parsedStd = JSON.stringify(parsedStd ?? null);
    }
    const createData = {
      userId,
      ...rest,
      interests: interests !== undefined ? JSON.stringify(interests) : "[]",
      voters: voters !== undefined ? JSON.stringify(voters) : "[]",
      accessPermissions:
        accessPermissions !== undefined ? JSON.stringify(accessPermissions ?? null) : "null",
      dnaProfile: dnaProfile !== undefined ? JSON.stringify(dnaProfile ?? null) : "null",
      languages: languages !== undefined ? JSON.stringify(languages) : "[]",
      photoGrants: photoGrants !== undefined ? JSON.stringify(photoGrants ?? {}) : "{}",
      searchDetails: searchDetails !== undefined ? JSON.stringify(searchDetails ?? {}) : "{}",
      faceEmbedding: faceEmbedding !== undefined ? JSON.stringify(faceEmbedding ?? null) : null,
      parsedStd: parsedStd !== undefined ? JSON.stringify(parsedStd ?? null) : null,
    };
    return runWithDb(
      async (p) =>
        p.profile.upsert({
          where: { userId },
          update: updatePatch,
          create: createData,
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

  /**
   * At-most-once registration reward claim. Returns true exactly once per
   * user, and only while the profile is STD-verified. The Prisma updateMany
   * filters on BOTH conditions (registrationRewarded: false AND verifiedStd:
   * true) so concurrent/duplicate calls can never both report success; the
   * fallback path is atomic within the single-threaded Node process via
   * claimRegistrationRewardInMemory.
   */
  async claimRegistrationReward(userId: string): Promise<boolean> {
    return runWithDb(
      async (p) => {
        const result = await p.profile.updateMany({
          where: { userId, registrationRewarded: false, verifiedStd: true },
          data: { registrationRewarded: true },
        });
        return result.count === 1;
      },
      () => {
        const data = readFallback();
        const claimed = claimRegistrationRewardInMemory(data.profiles, userId);
        if (claimed) writeFallback(data);
        return claimed;
      },
      "claimRegistrationReward",
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

  /** Distinct conversation partner IDs for a user — one lightweight call
   * instead of N `/api/messages` fetches (avoids the per-profile N+1 that
   * blew the global rate limit). */
  async getConversationPeers(userId: string): Promise<string[]> {
    return runWithDb(
      async (p) => {
        const rows = await p.message.findMany({
          where: { OR: [{ senderId: userId }, { receiverId: userId }] },
          select: { senderId: true, receiverId: true },
        });
        const peers = new Set<string>();
        for (const r of rows) {
          peers.add(r.senderId === userId ? r.receiverId : r.senderId);
        }
        return [...peers];
      },
      () => {
        const data = readFallback();
        const peers = new Set<string>();
        for (const m of data.messages ?? []) {
          if (m.senderId === userId) peers.add(m.receiverId);
          if (m.receiverId === userId) peers.add(m.senderId);
        }
        return [...peers];
      },
      "getConversationPeers",
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
    photoGrantKind?: string;
    photoAction?: string;
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

  async updateMessageRequestStatus(messageId: string, status: string): Promise<any> {
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
    const parseRedacted = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };
    const parseJsonField = (value: any): any => {
      if (value === null || value === undefined || typeof value !== "string") {
        return value ?? null;
      }
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };
    return runWithDb(
      async (p) => {
        const docs = (await p.document.findMany({ where: { userId } })) as any[];
        return docs.map((d) => ({
          ...d,
          redactedFields: parseRedacted(d.redactedFields),
          // Stored as a JSON string scalar in Postgres; object in fallback.
          dnaProfile: parseJsonField(d.dnaProfile),
        }));
      },
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
      async (p) =>
        p.document.create({
          data: {
            ...doc,
            // Prisma schema stores redactedFields as a JSON string scalar.
            redactedFields: JSON.stringify(doc.redactedFields),
            // `dnaProfile` is a required String column holding JSON (or "null").
            dnaProfile: JSON.stringify(doc.dnaProfile ?? null),
          },
        }) as Promise<any>,
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

  // --- LAB PARTNERS ---
  async getLabPartners(): Promise<any[]> {
    return runWithDb(
      async (p) =>
        (await (p as any).labPartner.findMany()).map((lp: any) => ({
          ...lp,
          apiKey: lp.apiKey,
          name: lp.name,
          email: lp.email,
          createdAt: lp.createdAt,
        })),
      () => readFallback().labPartners || [],
      "getLabPartners",
    );
  },

  async getLabPartnerByApiKey(apiKey: string): Promise<any | null> {
    const formattedKey = apiKey.trim();
    return runWithDb(
      async (p) => {
        const lp = await (p as any).labPartner.findFirst({
          where: { apiKey: { equals: formattedKey } },
        });
        return lp ? { ...lp, apiKey: lp.apiKey, walletAddress: lp.walletAddress ?? null } : null;
      },
      () => {
        const data = readFallback();
        if (!data.labPartners) return null;
        const lp = data.labPartners.find((lp: any) => lp.apiKey === formattedKey) || null;
        return lp ? { ...lp, walletAddress: lp.walletAddress ?? null } : null;
      },
      "getLabPartnerByApiKey",
    );
  },

  async createLabPartner(name: string, email: string, walletAddress?: string): Promise<any> {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) => {
        const existing = await (p as any).labPartner.findFirst({
          where: { email: { equals: formattedEmail } },
        });
        if (existing) return existing;
        const lp = await (p as any).labPartner.create({
          data: {
            name,
            email: formattedEmail,
            apiKey: generateApiKey(),
            ...(walletAddress !== undefined ? { walletAddress } : {}),
          },
        });
        return { ...lp, apiKey: lp.apiKey };
      },
      () => {
        const data = readFallback();
        if (!data.labPartners) data.labPartners = [];
        const existing = data.labPartners.find(
          (lp: any) => lp.email && lp.email.toLowerCase() === formattedEmail,
        );
        if (existing) return existing;
        const newLp = {
          id: Math.random().toString(36).substring(2, 11),
          name,
          email: formattedEmail,
          apiKey: generateApiKey(),
          createdAt: new Date().toISOString(),
          ...(walletAddress !== undefined ? { walletAddress } : {}),
        };
        data.labPartners.push(newLp);
        writeFallback(data);
        return newLp;
      },
      "createLabPartner",
    );
  },

  /** Set/update a lab partner's payout wallet address (registration reward). */
  async setLabPartnerWallet(id: string, wallet: string): Promise<any> {
    return runWithDb(
      async (p) =>
        (p as any).labPartner.update({
          where: { id },
          data: { walletAddress: wallet },
        }),
      () => {
        const data = readFallback();
        if (!data.labPartners) return null;
        const lp = data.labPartners.find((x: any) => x.id === id);
        if (!lp) return null;
        lp.walletAddress = wallet;
        writeFallback(data);
        return lp;
      },
      "setLabPartnerWallet",
    );
  },

  // --- LAB REPORTS ---
  async getLabReports(userId: string): Promise<any[]> {
    return runWithDb(
      async (p) => {
        const rows = await (p as any).labReport.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        return (rows || []).map((r: any) => ({ ...r, labReports: undefined }));
      },
      () => {
        const data = readFallback();
        if (!data.labReports) return [];
        return data.labReports.filter((r: any) => r.userId === userId);
      },
      "getLabReports",
    );
  },

  async createLabReport(report: {
    userId: string;
    source: string;
    rawText: string;
    parsed: any;
    status: string;
    faceMatchStatus?: string;
    labPartnerName?: string | null;
  }): Promise<any> {
    return runWithDb(
      async (p) =>
        (p as any).labReport.create({
          data: {
            userId: report.userId,
            source: report.source,
            rawText: report.rawText,
            parsed: JSON.stringify(report.parsed),
            status: report.status,
            faceMatchStatus: report.faceMatchStatus ?? "none",
            labPartnerName: report.labPartnerName ?? null,
            createdAt: new Date(),
          },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.labReports) data.labReports = [];
        const newReport = {
          id: Math.random().toString(36).substring(2, 11),
          userId: report.userId,
          source: report.source,
          rawText: report.rawText,
          parsed: report.parsed,
          status: report.status,
          faceMatchStatus: report.faceMatchStatus ?? "none",
          labPartnerName: report.labPartnerName ?? null,
          createdAt: new Date().toISOString(),
        };
        data.labReports.push(newReport);
        writeFallback(data);
        return newReport;
      },
      "createLabReport",
    );
  },

  async updateLabReportStatus(reportId: string, status: string): Promise<any> {
    return runWithDb(
      async (p) => {
        const existing = await (p as any).labReport.findUnique({ where: { id: reportId } });
        if (!existing) return null;
        return (p as any).labReport.update({
          where: { id: reportId },
          data: { status, updatedAt: new Date() },
        }) as Promise<any>;
      },
      () => {
        const data = readFallback();
        if (!data.labReports) data.labReports = [];
        const idx = data.labReports.findIndex((r: any) => r.id === reportId);
        if (idx === -1) return null;
        const updated = { ...data.labReports[idx], status, updatedAt: new Date().toISOString() };
        data.labReports[idx] = updated;
        writeFallback(data);
        return updated;
      },
      "updateLabReportStatus",
    );
  },

  async createNonce(nonce: string, address: string, expiresAt: Date): Promise<any> {
    return runWithDb(
      async (p) => (p as any).nonce.create({ data: { nonce, address, expiresAt } }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.nonces) data.nonces = [];
        const newNonce = {
          id: Math.random().toString(36).substring(2, 11),
          nonce,
          address,
          expiresAt: expiresAt.toISOString(),
          used: false,
          createdAt: new Date().toISOString(),
        };
        data.nonces.push(newNonce);
        writeFallback(data);
        return newNonce;
      },
      "createNonce",
    );
  },

  async getNonce(nonce: string): Promise<any> {
    return runWithDb(
      async (p) => (p as any).nonce.findFirst({ where: { nonce } }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.nonces) return null;
        return data.nonces.find((n: any) => n.nonce === nonce) || null;
      },
      "getNonce",
    );
  },

  async markNonceUsed(nonce: string): Promise<void> {
    await runWithDb(
      async (p) => (p as any).nonce.update({ where: { nonce }, data: { used: true } }),
      () => {
        const data = readFallback();
        if (!data.nonces) return;
        const n = data.nonces.find((n: any) => n.nonce === nonce);
        if (n) {
          n.used = true;
          writeFallback(data);
        }
      },
      "markNonceUsed",
    );
  },

  // --- PARTNER ACCOUNTS (labs, dating sites, etc.) ---
  // Partner organizations authenticate with email+password sessions
  // (unlike users, who use SIWE wallet auth).

  async createPartner(type: string, name: string, email: string, passwordHash: string) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) =>
        (p as any).partner.create({
          data: { type, name, email: formattedEmail, passwordHash, apiKey: generateApiKey() },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.partners) data.partners = [];
        const existing = data.partners.find(
          (x: any) => x.email && x.email.toLowerCase() === formattedEmail,
        );
        if (existing) return existing;
        const partner = {
          id: Math.random().toString(36).substring(2, 11),
          type,
          name,
          email: formattedEmail,
          passwordHash,
          apiKey: generateApiKey(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.partners.push(partner);
        writeFallback(data);
        return partner;
      },
      "createPartner",
    );
  },

  async getPartnerByEmail(email: string) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) =>
        (p as any).partner.findFirst({
          where: { email: { equals: formattedEmail } },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.partners) return null;
        return (
          data.partners.find((x: any) => x.email && x.email.toLowerCase() === formattedEmail) ||
          null
        );
      },
      "getPartnerByEmail",
    );
  },

  async getPartnerById(id: string) {
    return runWithDb(
      async (p) => (p as any).partner.findUnique({ where: { id } }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.partners) return null;
        return data.partners.find((x: any) => x.id === id) || null;
      },
      "getPartnerById",
    );
  },

  async getPartnerByApiKey(apiKey: string) {
    const formattedKey = apiKey.trim();
    return runWithDb(
      async (p) =>
        (p as any).partner.findFirst({
          where: { apiKey: { equals: formattedKey } },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.partners) return null;
        return data.partners.find((x: any) => x.apiKey === formattedKey) || null;
      },
      "getPartnerByApiKey",
    );
  },

  // --- PUBLIC SAFE-SEX LINK (evolve.eth/<username>) ---
  // The public page exposes ONLY the photo + a "Check" button. Everything else
  // stays private. `username` is unique across the app.

  async setPublicLink(userId: string, username: string | null, enabled: boolean) {
    const canonical = username ? username.trim().toLowerCase() : null;
    return runWithDb(
      async (p) =>
        (p as any).profile.update({
          where: { userId },
          data: { username: canonical, publicLinkEnabled: enabled },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        const profile = data.profiles.find((x: any) => x.userId === userId);
        if (!profile) return null;
        profile.username = canonical;
        profile.publicLinkEnabled = enabled;
        writeFallback(data);
        return profile;
      },
      "setPublicLink",
    );
  },

  /** Who owns a username (for uniqueness checks). Returns userId or null. */
  async getUsernameOwner(username: string) {
    const canonical = username.trim().toLowerCase();
    return runWithDb(
      async (p) => {
        const row = await (p as any).profile.findFirst({
          where: { username: { equals: canonical } },
        });
        return row ? row.userId : null;
      },
      () => {
        const data = readFallback();
        const profile = data.profiles.find(
          (x: any) => x.username && x.username.toLowerCase() === canonical,
        );
        return profile ? profile.userId : null;
      },
      "getUsernameOwner",
    );
  },

  /** My own public-link state. Returns { username, publicLinkEnabled } or null. */
  async getPublicLinkByUserId(userId: string) {
    return runWithDb(
      async (p) => {
        const row = await (p as any).profile.findUnique({ where: { userId } });
        if (!row) return null;
        return { username: row.username ?? null, publicLinkEnabled: !!row.publicLinkEnabled };
      },
      () => {
        const data = readFallback();
        const profile = data.profiles.find((x: any) => x.userId === userId);
        if (!profile) return null;
        return {
          username: profile.username ?? null,
          publicLinkEnabled: !!profile.publicLinkEnabled,
        };
      },
      "getPublicLinkByUserId",
    );
  },

  /** Public page data — ONLY { userId, username, imageUrl } and only when enabled. */
  async getPublicProfileByUsername(username: string) {
    const canonical = username.trim().toLowerCase();
    return runWithDb(
      async (p) => {
        const row = await (p as any).profile.findFirst({
          where: { username: { equals: canonical }, publicLinkEnabled: true },
        });
        if (!row) return null;
        return { userId: row.userId, username: row.username, imageUrl: row.imageUrl ?? null };
      },
      () => {
        const data = readFallback();
        const profile = data.profiles.find(
          (x: any) => x.username && x.username.toLowerCase() === canonical && x.publicLinkEnabled,
        );
        if (!profile) return null;
        return {
          userId: profile.userId,
          username: profile.username,
          imageUrl: profile.imageUrl ?? null,
        };
      },
      "getPublicProfileByUsername",
    );
  },

  // --- COMPATIBILITY CHECKS (person→person safe-sex verdict) ---
  // Both sides see only the anonymous verdict; individual pathogen status is
  // never disclosed. Pending checks expire after 7 days.

  async createCompatibilityCheck(requesterId: string, targetId: string, expiresAt: Date) {
    return runWithDb(
      async (p) =>
        (p as any).compatibilityCheck.create({
          data: { requesterId, targetId, status: "pending", expiresAt },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.compatibilityChecks) data.compatibilityChecks = [];
        const check = {
          id: Math.random().toString(36).substring(2, 11),
          requesterId,
          targetId,
          status: "pending",
          verdict: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString(),
        };
        data.compatibilityChecks.push(check);
        writeFallback(data);
        return check;
      },
      "createCompatibilityCheck",
    );
  },

  async getCompatibilityCheckById(id: string) {
    return runWithDb(
      async (p) => (p as any).compatibilityCheck.findUnique({ where: { id } }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.compatibilityChecks) return null;
        return data.compatibilityChecks.find((x: any) => x.id === id) || null;
      },
      "getCompatibilityCheckById",
    );
  },

  /** True when an unresolved (non-expired) pending check already exists between the pair. */
  async hasPendingCompatibilityCheckBetween(requesterId: string, targetId: string) {
    const now = new Date();
    return runWithDb(
      async (p) => {
        const row = await (p as any).compatibilityCheck.findFirst({
          where: {
            status: "pending",
            expiresAt: { gt: now },
            OR: [
              { requesterId, targetId },
              { requesterId: targetId, targetId: requesterId },
            ],
          },
        });
        return !!row;
      },
      () => {
        const data = readFallback();
        if (!data.compatibilityChecks) return false;
        return data.compatibilityChecks.some(
          (x: any) =>
            x.status === "pending" &&
            new Date(x.expiresAt) > now &&
            ((x.requesterId === requesterId && x.targetId === targetId) ||
              (x.requesterId === targetId && x.targetId === requesterId)),
        );
      },
      "hasPendingCompatibilityCheckBetween",
    );
  },

  /** Incoming pending checks for a user (target side), expired ones excluded. */
  async getPendingCompatibilityChecksForUser(userId: string) {
    const now = new Date();
    return runWithDb(
      async (p) => {
        const rows = await (p as any).compatibilityCheck.findMany({
          where: { targetId: userId, status: "pending", expiresAt: { gt: now } },
          orderBy: { createdAt: "desc" },
        });
        return (rows || []) as any[];
      },
      () => {
        const data = readFallback();
        if (!data.compatibilityChecks) return [];
        return data.compatibilityChecks
          .filter(
            (x: any) =>
              x.targetId === userId && x.status === "pending" && new Date(x.expiresAt) > now,
          )
          .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)));
      },
      "getPendingCompatibilityChecksForUser",
    );
  },

  /** Full history for a user (both directions), newest first, capped at 50. */
  async getCompatibilityChecksForUser(userId: string) {
    return runWithDb(
      async (p) => {
        const rows = await (p as any).compatibilityCheck.findMany({
          where: { OR: [{ requesterId: userId }, { targetId: userId }] },
          orderBy: { createdAt: "desc" },
          take: 50,
        });
        return (rows || []) as any[];
      },
      () => {
        const data = readFallback();
        if (!data.compatibilityChecks) return [];
        return data.compatibilityChecks
          .filter((x: any) => x.requesterId === userId || x.targetId === userId)
          .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)))
          .slice(0, 50);
      },
      "getCompatibilityChecksForUser",
    );
  },

  async updateCompatibilityCheck(id: string, patch: { status?: string; verdict?: string | null }) {
    return runWithDb(
      async (p) =>
        (p as any).compatibilityCheck.update({
          where: { id },
          data: { ...patch, updatedAt: new Date() },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.compatibilityChecks) return null;
        const idx = data.compatibilityChecks.findIndex((x: any) => x.id === id);
        if (idx === -1) return null;
        const updated = {
          ...data.compatibilityChecks[idx],
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        data.compatibilityChecks[idx] = updated;
        writeFallback(data);
        return updated;
      },
      "updateCompatibilityCheck",
    );
  },

  // --- LAB VISITS (account-based lab flow) ---
  // Reuses LabReport rows: a visit starts as status "sample_received" (scanned
  // + photo taken), then the lab attaches results → status "pending" (awaiting
  // the user's approval) → user accepts → "accepted" (verifiedStd).

  async createLabVisit(userId: string, labPartnerName: string, faceMatchStatus: string) {
    return runWithDb(
      async (p) =>
        (p as any).labReport.create({
          data: {
            userId,
            source: "lab",
            rawText: "",
            parsed: JSON.stringify({
              pathogens: [],
              isAllNegative: true,
              hasPositive: false,
              positiveList: [],
              rawText: "",
            }),
            status: "sample_received",
            faceMatchStatus: faceMatchStatus ?? "none",
            labPartnerName,
            createdAt: new Date(),
          },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.labReports) data.labReports = [];
        const visit = {
          id: Math.random().toString(36).substring(2, 11),
          userId,
          source: "lab",
          rawText: "",
          parsed: {
            pathogens: [],
            isAllNegative: true,
            hasPositive: false,
            positiveList: [],
            rawText: "",
          },
          status: "sample_received",
          faceMatchStatus: faceMatchStatus ?? "none",
          labPartnerName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.labReports.push(visit);
        writeFallback(data);
        return visit;
      },
      "createLabVisit",
    );
  },

  async updateLabReportContent(reportId: string, rawText: string, parsed: any, status: string) {
    return runWithDb(
      async (p) =>
        (p as any).labReport.update({
          where: { id: reportId },
          data: { rawText, parsed: JSON.stringify(parsed), status, updatedAt: new Date() },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.labReports) return null;
        const idx = data.labReports.findIndex((r: any) => r.id === reportId);
        if (idx === -1) return null;
        const updated = {
          ...data.labReports[idx],
          rawText,
          parsed,
          status,
          updatedAt: new Date().toISOString(),
        };
        data.labReports[idx] = updated;
        writeFallback(data);
        return updated;
      },
      "updateLabReportContent",
    );
  },

  async updateLabReportFace(reportId: string, faceMatchStatus: string) {
    return runWithDb(
      async (p) =>
        (p as any).labReport.update({
          where: { id: reportId },
          data: { faceMatchStatus, updatedAt: new Date() },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.labReports) return null;
        const idx = data.labReports.findIndex((r: any) => r.id === reportId);
        if (idx === -1) return null;
        const updated = {
          ...data.labReports[idx],
          faceMatchStatus,
          updatedAt: new Date().toISOString(),
        };
        data.labReports[idx] = updated;
        writeFallback(data);
        return updated;
      },
      "updateLabReportFace",
    );
  },

  /** All visits/reports attached by a given lab partner, newest first. */
  async getLabVisitsByPartner(labPartnerName: string) {
    return runWithDb(
      async (p) => {
        const rows = await (p as any).labReport.findMany({
          where: { labPartnerName: { equals: labPartnerName } },
          orderBy: { createdAt: "desc" },
        });
        return (rows || []).map((r: any) => {
          let parsed = r.parsed;
          if (typeof parsed === "string") {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              parsed = null;
            }
          }
          return { ...r, parsed };
        });
      },
      () => {
        const data = readFallback();
        if (!data.labReports) return [];
        return data.labReports
          .filter((r: any) => r.labPartnerName === labPartnerName)
          .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)));
      },
      "getLabVisitsByPartner",
    );
  },

  // --- COMPANION PATIENTS (cross-device Companion-mode records) ---
  // A patient registers with a client-generated `companion_user_id`; the lab
  // fetches the same record from any device by that id (or lists all patients).

  async upsertCompanionPatient(patient: {
    id: string;
    name?: string | null;
    photo?: string | null;
    additionalPhotos?: string[] | null;
    location?: string | null;
    stdCompatible?: boolean;
  }) {
    const additionalPhotosJson = JSON.stringify(patient.additionalPhotos || []);
    return runWithDb(
      async (p) =>
        (p as any).companionPatient.upsert({
          where: { id: patient.id },
          create: {
            id: patient.id,
            name: patient.name ?? null,
            photo: patient.photo ?? null,
            additionalPhotos: additionalPhotosJson,
            location: patient.location ?? null,
            stdCompatible: Boolean(patient.stdCompatible),
          },
          update: {
            name: patient.name ?? null,
            photo: patient.photo ?? null,
            additionalPhotos: additionalPhotosJson,
            location: patient.location ?? null,
            stdCompatible: Boolean(patient.stdCompatible),
          },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.companionPatients) data.companionPatients = [];
        const idx = data.companionPatients.findIndex((x: any) => x.id === patient.id);
        const record: any = {
          id: patient.id,
          name: patient.name ?? null,
          photo: patient.photo ?? null,
          additionalPhotos: additionalPhotosJson,
          location: patient.location ?? null,
          stdCompatible: Boolean(patient.stdCompatible),
          updatedAt: new Date().toISOString(),
        };
        if (idx === -1) {
          record.createdAt = new Date().toISOString();
          data.companionPatients.push(record);
        } else {
          data.companionPatients[idx] = { ...data.companionPatients[idx], ...record };
        }
        writeFallback(data);
        return data.companionPatients[idx === -1 ? data.companionPatients.length - 1 : idx];
      },
      "upsertCompanionPatient",
    );
  },

  async getCompanionPatient(id: string) {
    return runWithDb(
      async (p) => {
        const row = await (p as any).companionPatient.findUnique({ where: { id } });
        if (!row) return null;
        return { ...row, additionalPhotos: safeParseJsonArray(row.additionalPhotos) };
      },
      () => {
        const data = readFallback();
        if (!data.companionPatients) return null;
        const row = data.companionPatients.find((x: any) => x.id === id) || null;
        if (!row) return null;
        return { ...row, additionalPhotos: safeParseJsonArray(row.additionalPhotos) };
      },
      "getCompanionPatient",
    );
  },

  async listCompanionPatients() {
    return runWithDb(
      async (p) => {
        const rows = await (p as any).companionPatient.findMany({
          orderBy: { createdAt: "desc" },
        });
        return (rows || []).map((r: any) => ({
          ...r,
          additionalPhotos: safeParseJsonArray(r.additionalPhotos),
        }));
      },
      () => {
        const data = readFallback();
        if (!data.companionPatients) return [];
        return data.companionPatients
          .slice()
          .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)))
          .map((r: any) => ({ ...r, additionalPhotos: safeParseJsonArray(r.additionalPhotos) }));
      },
      "listCompanionPatients",
    );
  },

  // --- COMPANION LABS (searchable directory) ---

  async upsertCompanionLab(lab: {
    id: string;
    name: string;
    description?: string | null;
    address?: string | null;
    phone?: string | null;
    country?: string | null;
    city?: string | null;
  }) {
    return runWithDb(
      async (p) =>
        (p as any).companionLab.upsert({
          where: { id: lab.id },
          create: { ...lab },
          update: { ...lab },
        }) as Promise<any>,
      () => {
        const data = readFallback();
        if (!data.companionLabs) data.companionLabs = [];
        const idx = data.companionLabs.findIndex((x: any) => x.id === lab.id);
        const record: any = { ...lab, updatedAt: new Date().toISOString() };
        if (idx === -1) {
          record.createdAt = new Date().toISOString();
          data.companionLabs.push(record);
        } else {
          data.companionLabs[idx] = { ...data.companionLabs[idx], ...record };
        }
        writeFallback(data);
        return data.companionLabs[idx === -1 ? data.companionLabs.length - 1 : idx];
      },
      "upsertCompanionLab",
    );
  },

  /** List labs, optionally narrowed by country/city (case-insensitive). */
  async listCompanionLabs(country?: string, city?: string) {
    const norm = (s?: string | null) => (s || "").trim().toLowerCase();
    const c = norm(country);
    const ci = norm(city);
    return runWithDb(
      async (p) => {
        const rows = await (p as any).companionLab.findMany({ orderBy: { name: "asc" } });
        return (rows || []).filter(
          (r: any) => (!c || norm(r.country) === c) && (!ci || norm(r.city).includes(ci)),
        );
      },
      () => {
        const data = readFallback();
        if (!data.companionLabs) return [];
        return data.companionLabs
          .slice()
          .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)))
          .filter((r: any) => (!c || norm(r.country) === c) && (!ci || norm(r.city).includes(ci)));
      },
      "listCompanionLabs",
    );
  },
};

// Generate a random 32-character hex API key for lab partners.
function generateApiKey(): string {
  return Array(8)
    .fill(0)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}
