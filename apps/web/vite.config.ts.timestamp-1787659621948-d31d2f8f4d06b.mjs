var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/addresses.ts
var addresses_exports = {};
__export(addresses_exports, {
  BOND_MANAGER_ADDRESS: () => BOND_MANAGER_ADDRESS,
  CHAIN_ID: () => CHAIN_ID,
  CONTRACTS: () => CONTRACTS,
  EXPLORER_URL: () => EXPLORER_URL,
  FUND_ADDRESS: () => FUND_ADDRESS,
  GOVERNANCE_ADDRESS: () => GOVERNANCE_ADDRESS,
  NETWORK_NAME: () => NETWORK_NAME,
  TRUST_SCORE_ADDRESS: () => TRUST_SCORE_ADDRESS
});
var CONTRACTS, CHAIN_ID, NETWORK_NAME, EXPLORER_URL, GOVERNANCE_ADDRESS, FUND_ADDRESS, BOND_MANAGER_ADDRESS, TRUST_SCORE_ADDRESS;
var init_addresses = __esm({
  "src/lib/addresses.ts"() {
    "use strict";
    CONTRACTS = {
      EVOLVE: "0x17b7D47a7A2fEe2999d2DEbb4b29379Cf7481d7d",
      PROFILE_NFT: "0x1A58b3e3f2698a7449D2EB4daf7d09849015d277",
      TRUST_SCORE: "0x0Cb18aa859f4A625aD3e8dE5958E577dfD9FEeB9",
      VOTING: "0x0Cb18aa859f4A625aD3e8dE5958E577dfD9FEeB9",
      // Voting is part of TrustScore
      EVOLVE_2_EARN: "0x0bbEe887E29F101b66EB87Ce1636d33db4e5412e",
      GOVERNANCE: "0x8f95C852114e0C01B3D722EA9653F5b3e4460000",
      BOND_MANAGER: "0x9c7fEf3Db6285c291239115e910f44d59598d962",
      EVOLVE_FUND: "0x016F6D873ed4B366098f9BE5C042ef583DC66DeE",
      VERIFICATION_REGISTRY: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189",
      DNA_VERIFICATION: "0x2d6d770F7e5a8C10dC2B103B4f3Cb0e046Db649f"
    };
    CHAIN_ID = 11155111;
    NETWORK_NAME = "Ethereum Sepolia";
    EXPLORER_URL = "https://sepolia.etherscan.io";
    GOVERNANCE_ADDRESS = CONTRACTS.GOVERNANCE;
    FUND_ADDRESS = CONTRACTS.EVOLVE_FUND;
    BOND_MANAGER_ADDRESS = CONTRACTS.BOND_MANAGER;
    TRUST_SCORE_ADDRESS = CONTRACTS.TRUST_SCORE;
  }
});

// src/lib/abi/DNAVerificationABI.ts
var DNAVerificationABI_exports = {};
__export(DNAVerificationABI_exports, {
  DNAVerificationABI: () => DNAVerificationABI
});
var DNAVerificationABI;
var init_DNAVerificationABI = __esm({
  "src/lib/abi/DNAVerificationABI.ts"() {
    "use strict";
    DNAVerificationABI = [
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" }
        ],
        name: "isDNAVerified",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getDNAProfile",
        outputs: [
          {
            components: [
              { internalType: "bytes32", name: "dnaHash", type: "bytes32" },
              { internalType: "uint256", name: "timestamp", type: "uint256" },
              { internalType: "bool", name: "verified", type: "bool" },
              { internalType: "address", name: "verifier", type: "address" },
              { internalType: "bytes", name: "metadata", type: "bytes" }
            ],
            internalType: "struct DNAVerification.DNAProfile",
            name: "",
            type: "tuple"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "bytes32", name: "dnaHash", type: "bytes32" },
          { internalType: "bytes", name: "metadata", type: "bytes" }
        ],
        name: "verifyDNA",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "revokeDNA",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];
  }
});

// vite.config.ts
import { defineConfig } from "file:///C:/CFC/node_modules/vitest/dist/config.js";
import react from "file:///C:/CFC/node_modules/@vitejs/plugin-react/dist/index.js";
import path2 from "path";

// src/lib/db.ts
import { PrismaClient } from "file:///C:/CFC/apps/web/node_modules/@prisma/client/default.js";
import fs from "fs";
import path from "path";
var prisma = null;
var useFallback = false;
var MAX_RETRIES = 3;
var BASE_RETRY_DELAY = 1e3;
function getRetryDelay(attempt) {
  return BASE_RETRY_DELAY * Math.pow(2, attempt);
}
async function retryWithBackoff(operation, operationName) {
  let lastError = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
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
async function initializePrisma() {
  try {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/evolve_db?schema=public"
        }
      },
      log: ["error", "warn"]
    });
    await retryWithBackoff(() => client.$connect(), "Prisma connection");
    console.info("Prisma Client initialized successfully");
    return client;
  } catch (e) {
    console.info("PostgreSQL not available. Using JSON fallback database.");
    return null;
  }
}
initializePrisma().then((client) => {
  prisma = client;
  useFallback = !client;
}).catch(() => {
  useFallback = true;
});
var FALLBACK_FILE = path.join(process.cwd(), "fallback-db.json");
var initialFallbackData = {
  users: [
    {
      id: "1",
      ethAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "2",
      ethAddress: "0x3AcA7bbf08F6D6cf92ED9C5B7FDE7b944208a0e8",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "3",
      ethAddress: "0x90F8bf6A479f320ced073E824F25135bc93C7a4e",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
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
        { name: "Diana", weight: 9.1, relation: "Vouched match" }
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
        D7S820: [10, 11]
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
        { name: "Frank", weight: 7.8, relation: "Node Operator" }
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
        D7S820: [8, 10]
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
        myDnaApprovedToThem: false
      }
    },
    {
      id: "4",
      userId: "4",
      name: "Diana",
      age: 30,
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
        { name: "Bob", weight: 9.4, relation: "Crypto partner" }
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
        D7S820: [9, 12]
      },
      stdTestResult: "NEGATIVE for all common pathogens",
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
      id: "5",
      userId: "5",
      name: "Elena",
      age: 27,
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
        { name: "Diana", weight: 9.1, relation: "Friend" }
      ],
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
      id: "6",
      userId: "6",
      name: "Frank",
      age: 35,
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
        { name: "Diana", weight: 9.1, relation: "Verified match" }
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
        D7S820: [7, 11]
      },
      stdTestResult: "NEGATIVE for all common pathogens",
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
      id: "7",
      userId: "7",
      name: "Grace",
      age: 24,
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
        myDnaApprovedToThem: false
      }
    },
    {
      id: "8",
      userId: "8",
      name: "Henry",
      age: 31,
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
        { name: "Diana", weight: 9.1, relation: "Investor" }
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
        D7S820: [8, 10]
      },
      stdTestResult: "NEGATIVE for all common pathogens",
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
  messages: [
    {
      id: "m1",
      senderId: "0fxxttsis",
      receiverId: "1",
      text: "Hey Alice! Love your Web3 projects.",
      time: "2026-06-10T10:30:00.000Z",
      isRequest: false
    },
    {
      id: "m2",
      senderId: "1",
      receiverId: "0fxxttsis",
      text: "Thanks! I saw you're into crypto too. What chains do you use?",
      time: "2026-06-10T10:35:00.000Z",
      isRequest: false
    },
    {
      id: "m3",
      senderId: "0fxxttsis",
      receiverId: "1",
      text: "Mostly Arbitrum and Polygon. Love the low fees!",
      time: "2026-06-10T10:40:00.000Z",
      isRequest: false
    },
    {
      id: "m4",
      senderId: "0fxxttsis",
      receiverId: "4",
      text: "Hi Diana! Fellow digital nomad here.",
      time: "2026-06-10T11:00:00.000Z",
      isRequest: false
    },
    {
      id: "m5",
      senderId: "4",
      receiverId: "0fxxttsis",
      text: "Hey! Where are you based right now?",
      time: "2026-06-10T11:05:00.000Z",
      isRequest: false
    },
    {
      id: "m6",
      senderId: "0fxxttsis",
      receiverId: "4",
      text: "Currently in Lisbon. You?",
      time: "2026-06-10T11:10:00.000Z",
      isRequest: false
    },
    {
      id: "m7",
      senderId: "4",
      receiverId: "0fxxttsis",
      text: "Bali! We should connect at a crypto conference sometime.",
      time: "2026-06-10T11:15:00.000Z",
      isRequest: false
    }
  ],
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
async function runWithDb(dbQuery, fallbackQuery, operationName = "database operation") {
  if (useFallback || !prisma) {
    return fallbackQuery();
  }
  try {
    return await retryWithBackoff(() => dbQuery(prisma), operationName);
  } catch (e) {
    if (e.code === "P1001" || e.message?.includes("Can't reach database") || e.message?.includes("initialization")) {
      console.info("PostgreSQL not reachable. Falling back to JSON database.");
      useFallback = true;
      return fallbackQuery();
    }
    throw e;
  }
}
var PROFILE_JSON_COLUMNS = [
  "dnaProfile",
  "accessPermissions",
  "interests",
  "voters",
  "languages",
  "photoGrants"
];
function deserializeProfileRow(profile) {
  if (!profile || typeof profile !== "object") return profile;
  const parsed = { ...profile };
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
      },
      "getUsers"
    );
  },
  async getUserByAddress(ethAddress) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) => {
        const user = await p.user.findFirst({
          where: { ethAddress: { equals: formattedAddr } },
          include: { profile: true }
        });
        return user ? { ...user, profile: deserializeProfileRow(user.profile) } : null;
      },
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u) => u.ethAddress && u.ethAddress.toLowerCase() === formattedAddr
        );
        if (!user) return null;
        return {
          ...user,
          profile: data.profiles.find((p) => p.userId === user.id) || null
        };
      },
      "getUserByAddress"
    );
  },
  async getUserByEmail(email) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) => {
        const user = await p.user.findFirst({
          where: { email: { equals: formattedEmail } },
          include: { profile: true }
        });
        return user ? { ...user, profile: deserializeProfileRow(user.profile) } : null;
      },
      () => {
        const data = readFallback();
        const user = data.users.find(
          (u) => u.email && u.email.toLowerCase() === formattedEmail
        );
        if (!user) return null;
        return {
          ...user,
          profile: data.profiles.find((p) => p.userId === user.id) || null
        };
      },
      "getUserByEmail"
    );
  },
  async createUser(ethAddress) {
    const formattedAddr = ethAddress.toLowerCase();
    return runWithDb(
      async (p) => p.user.create({ data: { ethAddress: formattedAddr } }),
      () => {
        const data = readFallback();
        const existing = data.users.find(
          (u) => u.ethAddress && u.ethAddress.toLowerCase() === formattedAddr
        );
        if (existing) return existing;
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          ethAddress: formattedAddr,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.users.push(newUser);
        writeFallback(data);
        return newUser;
      },
      "createUser"
    );
  },
  async createUserWithEmail(email, passwordHash) {
    const formattedEmail = email.toLowerCase().trim();
    return runWithDb(
      async (p) => p.user.create({ data: { email: formattedEmail, passwordHash } }),
      () => {
        const data = readFallback();
        const existing = data.users.find(
          (u) => u.email && u.email.toLowerCase() === formattedEmail
        );
        if (existing) return existing;
        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          email: formattedEmail,
          passwordHash,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.users.push(newUser);
        writeFallback(data);
        return newUser;
      },
      "createUserWithEmail"
    );
  },
  // --- PROFILES ---
  async getProfiles() {
    return runWithDb(
      async (p) => (await p.profile.findMany()).map((row) => deserializeProfileRow(row)),
      () => readFallback().profiles,
      "getProfiles"
    );
  },
  async upsertProfile(userId, profileData) {
    const { interests, voters, accessPermissions, dnaProfile, languages, photoGrants, ...rest } = profileData ?? {};
    const updatePatch = { ...rest };
    if (interests !== void 0) updatePatch.interests = JSON.stringify(interests);
    if (voters !== void 0) updatePatch.voters = JSON.stringify(voters);
    if (accessPermissions !== void 0) {
      updatePatch.accessPermissions = JSON.stringify(accessPermissions ?? null);
    }
    if (dnaProfile !== void 0) {
      updatePatch.dnaProfile = JSON.stringify(dnaProfile ?? null);
    }
    if (languages !== void 0) {
      updatePatch.languages = JSON.stringify(languages);
    }
    if (photoGrants !== void 0) {
      updatePatch.photoGrants = JSON.stringify(photoGrants ?? {});
    }
    const createData = {
      userId,
      ...rest,
      interests: interests !== void 0 ? JSON.stringify(interests) : "[]",
      voters: voters !== void 0 ? JSON.stringify(voters) : "[]",
      accessPermissions: accessPermissions !== void 0 ? JSON.stringify(accessPermissions ?? null) : "null",
      dnaProfile: dnaProfile !== void 0 ? JSON.stringify(dnaProfile ?? null) : "null",
      languages: languages !== void 0 ? JSON.stringify(languages) : "[]",
      photoGrants: photoGrants !== void 0 ? JSON.stringify(photoGrants ?? {}) : "{}"
    };
    return runWithDb(
      async (p) => p.profile.upsert({
        where: { userId },
        update: updatePatch,
        create: createData
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
      },
      "upsertProfile"
    );
  },
  // --- MATCHES ---
  async getMatches() {
    return runWithDb(
      async (p) => p.match.findMany(),
      () => readFallback().matches,
      "getMatches"
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
      },
      "createMatch"
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
      },
      "getMessages"
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
      },
      "createMessage"
    );
  },
  async updateMessageRequestStatus(messageId, status) {
    return runWithDb(
      async (p) => p.message.update({
        where: { id: messageId },
        data: { requestStatus: status }
      }),
      () => {
        const data = readFallback();
        const msg = data.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.requestStatus = status;
          writeFallback(data);
        }
        return msg;
      },
      "updateMessageRequestStatus"
    );
  },
  // --- DOCUMENTS ---
  async getDocuments(userId) {
    const parseRedacted = (value) => {
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
    const parseJsonField = (value) => {
      if (value === null || value === void 0 || typeof value !== "string") {
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
        const docs = await p.document.findMany({ where: { userId } });
        return docs.map((d) => ({
          ...d,
          redactedFields: parseRedacted(d.redactedFields),
          // Stored as a JSON string scalar in Postgres; object in fallback.
          dnaProfile: parseJsonField(d.dnaProfile)
        }));
      },
      () => readFallback().documents.filter((d) => d.userId === userId),
      "getDocuments"
    );
  },
  async createDocument(doc) {
    return runWithDb(
      async (p) => p.document.create({
        data: {
          ...doc,
          // Prisma schema stores redactedFields as a JSON string scalar.
          redactedFields: JSON.stringify(doc.redactedFields),
          // `dnaProfile` is a required String column holding JSON (or "null").
          dnaProfile: JSON.stringify(doc.dnaProfile ?? null)
        }
      }),
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
      },
      "createDocument"
    );
  },
  // --- NONCES ---
  async createNonce(nonce, address, expiresAt) {
    return runWithDb(
      async (p) => p.nonce.create({ data: { nonce, address, expiresAt } }),
      () => {
        const data = readFallback();
        if (!data.nonces) data.nonces = [];
        const newNonce = {
          id: Math.random().toString(36).substring(2, 11),
          nonce,
          address,
          expiresAt: expiresAt.toISOString(),
          used: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        data.nonces.push(newNonce);
        writeFallback(data);
        return newNonce;
      },
      "createNonce"
    );
  },
  async getNonce(nonce) {
    return runWithDb(
      async (p) => p.nonce.findFirst({ where: { nonce } }),
      () => {
        const data = readFallback();
        if (!data.nonces) return null;
        return data.nonces.find((n) => n.nonce === nonce) || null;
      },
      "getNonce"
    );
  },
  async markNonceUsed(nonce) {
    await runWithDb(
      async (p) => p.nonce.update({ where: { nonce }, data: { used: true } }),
      () => {
        const data = readFallback();
        if (!data.nonces) return;
        const n = data.nonces.find((n2) => n2.nonce === nonce);
        if (n) {
          n.used = true;
          writeFallback(data);
        }
      },
      "markNonceUsed"
    );
  }
};

// src/lib/apiServer.ts
import { generateNonce, SiweMessage } from "file:///C:/CFC/node_modules/siwe/dist/siwe.js";
import { parse as parseUrl } from "url";
import { WebSocketServer, WebSocket } from "file:///C:/CFC/node_modules/ws/wrapper.mjs";

// src/lib/kv.ts
import Redis from "file:///C:/CFC/node_modules/ioredis/built/index.js";
var memoryStore = /* @__PURE__ */ new Map();
function memoryGet(key) {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}
function memorySet(key, value, ttlMs) {
  memoryStore.set(key, {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : null
  });
}
function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (!globalThis.__evolveRedis) {
    try {
      const client = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 2,
        lazyConnect: false
      });
      client.on("error", (err) => {
        console.error("[kv] Redis error:", err.message);
      });
      globalThis.__evolveRedis = client;
    } catch (err) {
      console.error("[kv] Failed to initialize Redis, using memory:", err);
      globalThis.__evolveRedis = null;
    }
  }
  return globalThis.__evolveRedis ?? null;
}
var kv = {
  async get(key) {
    const redis = getRedis();
    if (redis) {
      try {
        return await redis.get(key);
      } catch (err) {
        console.error("[kv] Redis get failed, falling back to memory:", err);
      }
    }
    return memoryGet(key);
  },
  async set(key, value, ttlMs) {
    const redis = getRedis();
    if (redis) {
      try {
        if (ttlMs) {
          await redis.set(key, value, "PX", ttlMs);
        } else {
          await redis.set(key, value);
        }
        return;
      } catch (err) {
        console.error("[kv] Redis set failed, falling back to memory:", err);
      }
    }
    memorySet(key, value, ttlMs);
  },
  async del(key) {
    const redis = getRedis();
    if (redis) {
      try {
        await redis.del(key);
      } catch (err) {
        console.error("[kv] Redis del failed:", err);
      }
    }
    memoryStore.delete(key);
  }
};

// src/lib/adminChain.ts
init_addresses();
import {
  createPublicClient,
  createWalletClient,
  http
} from "file:///C:/CFC/node_modules/viem/_esm/index.js";
import { privateKeyToAccount } from "file:///C:/CFC/node_modules/viem/_esm/accounts/index.js";
import { sepolia } from "file:///C:/CFC/node_modules/viem/_esm/chains/index.js";
var RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
var FAUCET_AMOUNT_TOKENS = Number(process.env.FAUCET_AMOUNT || "50");
var FAUCET_AMOUNT_WEI = BigInt(FAUCET_AMOUNT_TOKENS) * 10n ** 18n;
var publicClient = null;
var walletClient = null;
var adminAddress = null;
function initClients() {
  if (walletClient) return;
  const rawKey = process.env.ADMIN_PRIVATE_KEY;
  if (!rawKey) return;
  const normalized = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  try {
    const account = privateKeyToAccount(normalized);
    adminAddress = account.address;
    publicClient = createPublicClient({ chain: sepolia, transport: http(RPC_URL) });
    walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(RPC_URL)
    });
    console.log(`[adminChain] Admin relay configured for ${adminAddress}`);
  } catch (err) {
    console.error("[adminChain] Invalid ADMIN_PRIVATE_KEY:", err);
  }
}
function isAdminConfigured() {
  initClients();
  return walletClient !== null && adminAddress !== null && publicClient !== null;
}
function requireClients() {
  if (!isAdminConfigured() || !publicClient || !walletClient || !adminAddress) {
    throw new Error("Admin relay not configured (ADMIN_PRIVATE_KEY missing or invalid)");
  }
  return { pc: publicClient, wc: walletClient, admin: adminAddress };
}
var ERC20_MIN_ABI = [
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  }
];
var DNA_ABI = [
  {
    name: "verifyDNA",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "dnaDataHash", type: "bytes32" },
      { name: "metadata", type: "string" }
    ],
    outputs: []
  },
  {
    name: "revokeDNA",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "user", type: "address" }],
    outputs: []
  }
];
async function mintEvolve(to) {
  const { pc, wc, admin } = requireClients();
  const hash = await wc.writeContract({
    address: CONTRACTS.EVOLVE,
    abi: ERC20_MIN_ABI,
    functionName: "mint",
    args: [to, FAUCET_AMOUNT_WEI],
    chain: sepolia,
    account: admin
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}
async function relayDnaVerify(user, dnaHash) {
  const { pc, wc, admin } = requireClients();
  const hash = await wc.writeContract({
    address: CONTRACTS.DNA_VERIFICATION,
    abi: DNA_ABI,
    functionName: "verifyDNA",
    args: [user, dnaHash, ""],
    chain: sepolia,
    account: admin
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}
async function relayDnaRevoke(user) {
  const { pc, wc, admin } = requireClients();
  const hash = await wc.writeContract({
    address: CONTRACTS.DNA_VERIFICATION,
    abi: DNA_ABI,
    functionName: "revokeDNA",
    args: [user],
    chain: sepolia,
    account: admin
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}

// src/lib/apiServer.ts
var wsClients = /* @__PURE__ */ new Map();
function createChannelId(userId1, userId2) {
  return [userId1, userId2].sort().join(":");
}
function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", (ws) => {
    let userId = null;
    let username = null;
    let channelId = null;
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "join") {
          userId = msg.userId;
          username = msg.username || "Anonymous";
          channelId = createChannelId(msg.userId, msg.targetUserId);
          if (!wsClients.has(channelId)) {
            wsClients.set(channelId, []);
          }
          wsClients.get(channelId).push({ ws, userId, username });
          ws.send(JSON.stringify({ type: "joined", channelId }));
          broadcastToChannel(
            channelId,
            {
              type: "user_joined",
              userId,
              username
            },
            ws
          );
        }
        if (msg.type === "message" && channelId && userId) {
          const chatMsg = {
            type: "message",
            id: Date.now().toString(),
            senderId: userId,
            senderName: username,
            text: msg.text,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          dbService.createMessage({
            senderId: userId,
            receiverId: msg.targetUserId,
            text: msg.text,
            time: (/* @__PURE__ */ new Date()).toISOString(),
            isRequest: false
          });
          broadcastToChannel(channelId, chatMsg);
        }
        if (msg.type === "typing" && channelId && userId) {
          broadcastToChannel(
            channelId,
            {
              type: "typing",
              userId,
              username
            },
            ws
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
                username
              },
              clients[idx].ws
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
function broadcastToChannel(channelId, message, exclude) {
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
var rateLimitStore = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW_MS = 60 * 1e3;
var RATE_LIMIT_MAX_REQUESTS = 30;
function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "127.0.0.1";
}
function isRateLimited(req) {
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
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(ip);
      }
    }
  },
  5 * 60 * 1e3
);
var sessions = {};
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
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
  if (isRateLimited(req)) {
    res.statusCode = 429;
    res.end(JSON.stringify({ error: "Too many requests. Please try again later." }));
    return true;
  }
  try {
    const cookies = parseCookies(req);
    let sessionId = cookies["siwe_session"] || cookies["email_session"];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      sessionId = authHeader.substring(7);
    }
    const session = sessionId ? sessions[sessionId] : null;
    if (pathname === "/api/auth/siwe/nonce" && req.method === "GET") {
      const nonce = generateNonce();
      const address = parsedUrl.query.address || "0x0000000000000000000000000000000000000000";
      const expiresAt = new Date(Date.now() + 5 * 60 * 1e3);
      await dbService.createNonce(nonce, address.toLowerCase(), expiresAt);
      res.statusCode = 200;
      res.end(JSON.stringify({ nonce }));
      return true;
    }
    if (pathname === "/api/auth/siwe/verify" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { message, signature } = body;
      const siweMessage = new SiweMessage(message);
      const nonceRecord = await dbService.getNonce(siweMessage.nonce);
      if (!nonceRecord || nonceRecord.used || new Date(nonceRecord.expiresAt) < /* @__PURE__ */ new Date()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Nonce is invalid or expired" }));
        return true;
      }
      const verification = await siweMessage.verify({ signature });
      if (verification.success) {
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
            reputationScore: 5,
            voters: []
          });
          if (isAdminConfigured()) {
            mintEvolve(ethAddress).then(() => console.log(`[faucet] Welcome mint to ${ethAddress}`)).catch(
              (err) => console.error(`[faucet] Welcome mint failed for ${ethAddress}:`, err)
            );
          }
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
    if (pathname === "/api/auth/siwe/logout" && req.method === "POST") {
      if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
      }
      res.setHeader("Set-Cookie", "siwe_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }
    if (pathname === "/api/auth/email/send-verification" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { email } = body;
      if (!email) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Email required" }));
        return true;
      }
      const code = Math.floor(1e5 + Math.random() * 9e5).toString();
      await kv.set(
        `emailotp:${email.toLowerCase()}`,
        JSON.stringify({ code, expires: Date.now() + 10 * 60 * 1e3 }),
        10 * 60 * 1e3
      );
      console.log(`[DEV] Email verification code for ${email}: ${code}`);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, expiresIn: 600 }));
      return true;
    }
    if (pathname === "/api/auth/email/verify-code" && req.method === "POST") {
      const body = await getJsonBody(req);
      const { email, code } = body;
      if (!email || !code) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Email and code required" }));
        return true;
      }
      const raw = await kv.get(`emailotp:${email.toLowerCase()}`);
      let entry = null;
      if (raw) {
        try {
          entry = JSON.parse(raw);
        } catch {
          entry = null;
        }
      }
      if (!entry || entry.code !== code || Date.now() > entry.expires) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "INVALID_CODE" }));
        return true;
      }
      await kv.del(`emailotp:${email.toLowerCase()}`);
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
          reputationScore: 5,
          voters: []
        });
        user = await dbService.getUserByEmail(email);
      }
      const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };
      res.setHeader("Set-Cookie", `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      return true;
    }
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
        reputationScore: 5,
        voters: []
      });
      user = await dbService.getUserByEmail(email) || user;
      const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };
      res.setHeader("Set-Cookie", `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      return true;
    }
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
      const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessions[newSessionId] = { userId: user.id, email };
      res.setHeader("Set-Cookie", `email_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax`);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, user, sessionId: newSessionId }));
      return true;
    }
    if (pathname === "/api/auth/email/logout" && req.method === "POST") {
      if (sessionId && sessions[sessionId] && sessions[sessionId].email) {
        delete sessions[sessionId];
      }
      res.setHeader("Set-Cookie", "email_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
      return true;
    }
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
    if (pathname === "/api/search/profiles" && req.method === "GET") {
      const { mode, limit, offset } = parsedUrl.query;
      const limitNum = limit ? parseInt(limit) : 10;
      const offsetNum = offset ? parseInt(offset) : 0;
      const users = await dbService.getUsers();
      const allProfiles = users.filter((u) => u.profile).map((u) => ({
        ...u.profile,
        user: {
          id: u.id,
          ethAddress: u.ethAddress,
          email: u.email
        }
      }));
      let filteredProfiles = allProfiles;
      if (mode === "normal") {
        filteredProfiles = allProfiles.filter((p) => {
          return p.reputationScore >= 0;
        });
      } else if (mode === "pregnancy-bond") {
        filteredProfiles = allProfiles.filter((p) => {
          return p.interests && p.interests.some(
            (i) => i.toLowerCase().includes("family") || i.toLowerCase().includes("children") || i.toLowerCase().includes("parent")
          );
        });
      } else if (mode === "cryptic-choice") {
        filteredProfiles = allProfiles.filter((p) => {
          return p.interests && p.interests.some(
            (i) => i.toLowerCase().includes("privacy") || i.toLowerCase().includes("anonymous") || i.toLowerCase().includes("crypto")
          );
        });
      }
      filteredProfiles.sort((a, b) => b.reputationScore - a.reputationScore);
      const paginatedProfiles = filteredProfiles.slice(offsetNum, offsetNum + limitNum);
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          profiles: paginatedProfiles,
          total: filteredProfiles.length,
          limit: limitNum,
          offset: offsetNum
        })
      );
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
        const txHash = await relayDnaVerify(ethAddress, dnaHash);
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
    if (pathname === "/api/auth/dna-recover" && req.method === "POST") {
      try {
        const { email, dnaHash } = await getJsonBody(req);
        if (!email || !dnaHash) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "email and dnaHash are required" }));
          return true;
        }
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
        let onChainDnaHash = null;
        try {
          const { createPublicClient: createPublicClient2, http: http2 } = await import("file:///C:/CFC/node_modules/viem/_esm/index.js");
          const { sepolia: sepolia2 } = await import("file:///C:/CFC/node_modules/viem/_esm/chains/index.js");
          const { DNAVerificationABI: DNAVerificationABI2 } = await Promise.resolve().then(() => (init_DNAVerificationABI(), DNAVerificationABI_exports));
          const { CONTRACTS: CONTRACTS2 } = await Promise.resolve().then(() => (init_addresses(), addresses_exports));
          const RPC_URL2 = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
          const publicClient2 = createPublicClient2({
            chain: sepolia2,
            transport: http2(RPC_URL2)
          });
          const profile = await publicClient2.readContract({
            address: CONTRACTS2.DNA_VERIFICATION,
            abi: DNAVerificationABI2,
            functionName: "getDNAProfile",
            args: [ethAddress]
          });
          const verified = profile[2];
          const rawHash = profile[0];
          if (verified && rawHash && rawHash !== "0x".padEnd(66, "0")) {
            onChainDnaHash = parseInt(rawHash, 16).toString(16);
          }
        } catch (chainErr) {
          console.error("[dna-recover] On-chain read failed:", chainErr);
          res.statusCode = 503;
          res.end(
            JSON.stringify({
              error: "On-chain DNA verification unavailable"
            })
          );
          return true;
        }
        if (!onChainDnaHash) {
          res.statusCode = 404;
          res.end(
            JSON.stringify({
              error: "No verified DNA profile found for this account. Please verify your DNA first."
            })
          );
          return true;
        }
        if (onChainDnaHash.toLowerCase() !== dnaHash.toLowerCase().trim()) {
          res.statusCode = 403;
          res.end(
            JSON.stringify({
              error: "DNA hash does not match the on-chain record for this account"
            })
          );
          return true;
        }
        const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessions[newSessionId] = { userId: user.id, ethAddress, email: user.email };
        res.setHeader(
          "Set-Cookie",
          `siwe_session=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
        );
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            user: {
              id: user.id,
              email: user.email,
              ethAddress: user.ethAddress
            }
          })
        );
      } catch (err) {
        console.error("[dna-recover] Error:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "DNA recovery failed" }));
      }
      return true;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
    return true;
  } catch (error) {
    console.error("API Error:", error);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message
      })
    );
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
        if (server.httpServer) {
          setupWebSocketServer(server.httpServer);
        }
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
      "@": path2.resolve(__vite_injected_original_dirname, "./src")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2xpYi9hZGRyZXNzZXMudHMiLCAic3JjL2xpYi9hYmkvRE5BVmVyaWZpY2F0aW9uQUJJLnRzIiwgInZpdGUuY29uZmlnLnRzIiwgInNyYy9saWIvZGIudHMiLCAic3JjL2xpYi9hcGlTZXJ2ZXIudHMiLCAic3JjL2xpYi9rdi50cyIsICJzcmMvbGliL2FkbWluQ2hhaW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGxpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHNyY1xcXFxsaWJcXFxcYWRkcmVzc2VzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvc3JjL2xpYi9hZGRyZXNzZXMudHNcIjsvKipcbiAqIENlbnRyYWxpemVkIGNvbnRyYWN0IGFkZHJlc3NlcyBmb3IgRXZvbHZlIHBsYXRmb3JtLlxuICpcbiAqIEFsbCBhZGRyZXNzZXMgYXJlIGNoZWNrc3VtbWVkIGAweCR7c3RyaW5nfWAgZm9yIHdhZ21pIGNvbXBhdGliaWxpdHkuXG4gKlxuICogTmV0d29yazogRXRoZXJldW0gU2Vwb2xpYSAoY2hhaW5JZDogMTExNTUxMTEpXG4gKiBEZXBsb3llZDogMjAyNi0wOC0yMSB2aWEgZGVwbG95LXNlcG9saWEubWpzXG4gKiBFeHBsb3JlcjogaHR0cHM6Ly9zZXBvbGlhLmV0aGVyc2Nhbi5pb1xuICovXG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBFdGhlcmV1bSBTZXBvbGlhIChjaGFpbklkOiAxMTE1NTExMSkgXHUyNTAwXHUyNTAwXHUyNTAwXG5leHBvcnQgY29uc3QgQ09OVFJBQ1RTID0ge1xuICBFVk9MVkU6IFwiMHgxN2I3RDQ3YTdBMmZFZTI5OTlkMkRFYmI0YjI5Mzc5Q2Y3NDgxZDdkXCIsXG4gIFBST0ZJTEVfTkZUOiBcIjB4MUE1OGIzZTNmMjY5OGE3NDQ5RDJFQjRkYWY3ZDA5ODQ5MDE1ZDI3N1wiLFxuICBUUlVTVF9TQ09SRTogXCIweDBDYjE4YWE4NTlmNEE2MjVhRDNlOGRFNTk1OEU1NzdkZkQ5RkVlQjlcIixcbiAgVk9USU5HOiBcIjB4MENiMThhYTg1OWY0QTYyNWFEM2U4ZEU1OTU4RTU3N2RmRDlGRWVCOVwiLCAvLyBWb3RpbmcgaXMgcGFydCBvZiBUcnVzdFNjb3JlXG4gIEVWT0xWRV8yX0VBUk46IFwiMHgwYmJFZTg4N0UyOUYxMDFiNjZFQjg3Q2UxNjM2ZDMzZGI0ZTU0MTJlXCIsXG4gIEdPVkVSTkFOQ0U6IFwiMHg4Zjk1Qzg1MjExNGUwQzAxQjNENzIyRUE5NjUzRjViM2U0NDYwMDAwXCIsXG4gIEJPTkRfTUFOQUdFUjogXCIweDljN2ZFZjNEYjYyODVjMjkxMjM5MTE1ZTkxMGY0NGQ1OTU5OGQ5NjJcIixcbiAgRVZPTFZFX0ZVTkQ6IFwiMHgwMTZGNkQ4NzNlZDRCMzY2MDk4ZjlCRTVDMDQyZWY1ODNEQzY2RGVFXCIsXG4gIFZFUklGSUNBVElPTl9SRUdJU1RSWTogXCIweDQyRTkxOUMwZjMyMThGRTg5QUZCMzRCOWYwNGQ3MWQyY0IwMkExODlcIixcbiAgRE5BX1ZFUklGSUNBVElPTjogXCIweDJkNmQ3NzBGN2U1YThDMTBkQzJCMTAzQjRmM0NiMGUwNDZEYjY0OWZcIixcbn0gYXMgY29uc3Q7XG5cbi8qKiBOZXR3b3JrIGNoYWluIElEIFx1MjAxNCBFdGhlcmV1bSBTZXBvbGlhICovXG5leHBvcnQgY29uc3QgQ0hBSU5fSUQgPSAxMTE1NTExMTtcblxuLyoqIE5ldHdvcmsgbmFtZSAqL1xuZXhwb3J0IGNvbnN0IE5FVFdPUktfTkFNRSA9IFwiRXRoZXJldW0gU2Vwb2xpYVwiO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRXhwbG9yZXIgYmFzZSBVUkwgXHUyNTAwXHUyNTAwXHUyNTAwXG5leHBvcnQgY29uc3QgRVhQTE9SRVJfVVJMID0gXCJodHRwczovL3NlcG9saWEuZXRoZXJzY2FuLmlvXCI7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBSZS1leHBvcnQgaW5kaXZpZHVhbCBhZGRyZXNzZXMgZm9yIGJhY2t3YXJkLWNvbXBhdGlibGUgaW1wb3J0cyBcdTI1MDBcdTI1MDBcdTI1MDBcbmV4cG9ydCBjb25zdCBHT1ZFUk5BTkNFX0FERFJFU1MgPSBDT05UUkFDVFMuR09WRVJOQU5DRSBhcyBgMHgke3N0cmluZ31gO1xuZXhwb3J0IGNvbnN0IEZVTkRfQUREUkVTUyA9IENPTlRSQUNUUy5FVk9MVkVfRlVORCBhcyBgMHgke3N0cmluZ31gO1xuZXhwb3J0IGNvbnN0IEJPTkRfTUFOQUdFUl9BRERSRVNTID0gQ09OVFJBQ1RTLkJPTkRfTUFOQUdFUiBhcyBgMHgke3N0cmluZ31gO1xuZXhwb3J0IGNvbnN0IFRSVVNUX1NDT1JFX0FERFJFU1MgPSBDT05UUkFDVFMuVFJVU1RfU0NPUkUgYXMgYDB4JHtzdHJpbmd9YDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHNyY1xcXFxsaWJcXFxcYWJpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGxpYlxcXFxhYmlcXFxcRE5BVmVyaWZpY2F0aW9uQUJJLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvc3JjL2xpYi9hYmkvRE5BVmVyaWZpY2F0aW9uQUJJLnRzXCI7LyoqXG4gKiBNaW5pbWFsIEFCSSBmb3IgRE5BVmVyaWZpY2F0aW9uIChTZXBvbGlhOiBzZWUgbGliL2FkZHJlc3Nlcy50cykuXG4gKiBVc2VkIGZvciByZWFkLW9ubHkgc3RhdHVzIGNoZWNrcyBmcm9tIHRoZSBicm93c2VyOyB3cml0ZXMgYXJlXG4gKiB2ZXJpZmllci1nYXRlZCBvbi1jaGFpbiBhbmQgZ28gdGhyb3VnaCB0aGUgYmFja2VuZCByZWxheS5cbiAqL1xuZXhwb3J0IGNvbnN0IEROQVZlcmlmaWNhdGlvbkFCSSA9IFtcbiAge1xuICAgIGlucHV0czogW1xuICAgICAgeyBpbnRlcm5hbFR5cGU6IFwiYWRkcmVzc1wiLCBuYW1lOiBcInVzZXJcIiwgdHlwZTogXCJhZGRyZXNzXCIgfSxcbiAgICBdLFxuICAgIG5hbWU6IFwiaXNETkFWZXJpZmllZFwiLFxuICAgIG91dHB1dHM6IFt7IGludGVybmFsVHlwZTogXCJib29sXCIsIG5hbWU6IFwiXCIsIHR5cGU6IFwiYm9vbFwiIH1dLFxuICAgIHN0YXRlTXV0YWJpbGl0eTogXCJ2aWV3XCIsXG4gICAgdHlwZTogXCJmdW5jdGlvblwiLFxuICB9LFxuICB7XG4gICAgaW5wdXRzOiBbeyBpbnRlcm5hbFR5cGU6IFwiYWRkcmVzc1wiLCBuYW1lOiBcInVzZXJcIiwgdHlwZTogXCJhZGRyZXNzXCIgfV0sXG4gICAgbmFtZTogXCJnZXRETkFQcm9maWxlXCIsXG4gICAgb3V0cHV0czogW1xuICAgICAge1xuICAgICAgICBjb21wb25lbnRzOiBbXG4gICAgICAgICAgeyBpbnRlcm5hbFR5cGU6IFwiYnl0ZXMzMlwiLCBuYW1lOiBcImRuYUhhc2hcIiwgdHlwZTogXCJieXRlczMyXCIgfSxcbiAgICAgICAgICB7IGludGVybmFsVHlwZTogXCJ1aW50MjU2XCIsIG5hbWU6IFwidGltZXN0YW1wXCIsIHR5cGU6IFwidWludDI1NlwiIH0sXG4gICAgICAgICAgeyBpbnRlcm5hbFR5cGU6IFwiYm9vbFwiLCBuYW1lOiBcInZlcmlmaWVkXCIsIHR5cGU6IFwiYm9vbFwiIH0sXG4gICAgICAgICAgeyBpbnRlcm5hbFR5cGU6IFwiYWRkcmVzc1wiLCBuYW1lOiBcInZlcmlmaWVyXCIsIHR5cGU6IFwiYWRkcmVzc1wiIH0sXG4gICAgICAgICAgeyBpbnRlcm5hbFR5cGU6IFwiYnl0ZXNcIiwgbmFtZTogXCJtZXRhZGF0YVwiLCB0eXBlOiBcImJ5dGVzXCIgfSxcbiAgICAgICAgXSxcbiAgICAgICAgaW50ZXJuYWxUeXBlOiBcInN0cnVjdCBETkFWZXJpZmljYXRpb24uRE5BUHJvZmlsZVwiLFxuICAgICAgICBuYW1lOiBcIlwiLFxuICAgICAgICB0eXBlOiBcInR1cGxlXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgc3RhdGVNdXRhYmlsaXR5OiBcInZpZXdcIixcbiAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gIH0sXG4gIHtcbiAgICBpbnB1dHM6IFtcbiAgICAgIHsgaW50ZXJuYWxUeXBlOiBcImFkZHJlc3NcIiwgbmFtZTogXCJ1c2VyXCIsIHR5cGU6IFwiYWRkcmVzc1wiIH0sXG4gICAgICB7IGludGVybmFsVHlwZTogXCJieXRlczMyXCIsIG5hbWU6IFwiZG5hSGFzaFwiLCB0eXBlOiBcImJ5dGVzMzJcIiB9LFxuICAgICAgeyBpbnRlcm5hbFR5cGU6IFwiYnl0ZXNcIiwgbmFtZTogXCJtZXRhZGF0YVwiLCB0eXBlOiBcImJ5dGVzXCIgfSxcbiAgICBdLFxuICAgIG5hbWU6IFwidmVyaWZ5RE5BXCIsXG4gICAgb3V0cHV0czogW10sXG4gICAgc3RhdGVNdXRhYmlsaXR5OiBcIm5vbnBheWFibGVcIixcbiAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gIH0sXG4gIHtcbiAgICBpbnB1dHM6IFt7IGludGVybmFsVHlwZTogXCJhZGRyZXNzXCIsIG5hbWU6IFwidXNlclwiLCB0eXBlOiBcImFkZHJlc3NcIiB9XSxcbiAgICBuYW1lOiBcInJldm9rZUROQVwiLFxuICAgIG91dHB1dHM6IFtdLFxuICAgIHN0YXRlTXV0YWJpbGl0eTogXCJub25wYXlhYmxlXCIsXG4gICAgdHlwZTogXCJmdW5jdGlvblwiLFxuICB9LFxuXSBhcyBjb25zdDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0NGQy9hcHBzL3dlYi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlc3QvY29uZmlnXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgaGFuZGxlQXBpUmVxdWVzdCwgc2V0dXBXZWJTb2NrZXRTZXJ2ZXIgfSBmcm9tIFwiLi9zcmMvbGliL2FwaVNlcnZlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB7XG4gICAgICBuYW1lOiBcImFwaS1zZXJ2ZXJcIixcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXI6IGFueSkge1xuICAgICAgICAvLyBTZXR1cCBXZWJTb2NrZXQgc2VydmVyIG9uIHRoZSBzYW1lIEhUVFAgc2VydmVyXG4gICAgICAgIGlmIChzZXJ2ZXIuaHR0cFNlcnZlcikge1xuICAgICAgICAgIHNldHVwV2ViU29ja2V0U2VydmVyKHNlcnZlci5odHRwU2VydmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoYXN5bmMgKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlZCA9IGF3YWl0IGhhbmRsZUFwaVJlcXVlc3QocmVxLCByZXMpO1xuICAgICAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0gYXMgYW55LFxuICBdLFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxuICAgIHNldHVwRmlsZXM6IFwiLi9zcmMvdGVzdC9zZXR1cC50c1wiLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogdHJ1ZSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgfSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGxpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHNyY1xcXFxsaWJcXFxcZGIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0NGQy9hcHBzL3dlYi9zcmMvbGliL2RiLnRzXCI7aW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vLyBEdWFsLW1vZGUgREIgaGFuZGxlcjogdXNlcyBQcmlzbWEvUG9zdGdyZVNRTCBpZiBhdmFpbGFibGUsIGZhbGxzIGJhY2sgdG8gbG9jYWwgSlNPTiBmaWxlIG9yIG1lbW9yeS5cbmxldCBwcmlzbWE6IFByaXNtYUNsaWVudCB8IG51bGwgPSBudWxsO1xubGV0IHVzZUZhbGxiYWNrID0gZmFsc2U7XG5cbi8vIFJldHJ5IGNvbmZpZ3VyYXRpb25cbmNvbnN0IE1BWF9SRVRSSUVTID0gMztcbmNvbnN0IEJBU0VfUkVUUllfREVMQVkgPSAxMDAwOyAvLyAxIHNlY29uZFxuXG4vLyBFeHBvbmVudGlhbCBiYWNrb2ZmIGRlbGF5IGNhbGN1bGF0aW9uXG5mdW5jdGlvbiBnZXRSZXRyeURlbGF5KGF0dGVtcHQ6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBCQVNFX1JFVFJZX0RFTEFZICogTWF0aC5wb3coMiwgYXR0ZW1wdCk7XG59XG5cbi8vIFJldHJ5IHdyYXBwZXIgd2l0aCBleHBvbmVudGlhbCBiYWNrb2ZmXG5hc3luYyBmdW5jdGlvbiByZXRyeVdpdGhCYWNrb2ZmPFQ+KG9wZXJhdGlvbjogKCkgPT4gUHJvbWlzZTxUPiwgb3BlcmF0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gIGxldCBsYXN0RXJyb3I6IEVycm9yIHwgbnVsbCA9IG51bGw7XG5cbiAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCBNQVhfUkVUUklFUzsgYXR0ZW1wdCsrKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBvcGVyYXRpb24oKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBsYXN0RXJyb3IgPSBlcnJvcjtcblxuICAgICAgLy8gRG9uJ3QgcmV0cnkgb24gY2VydGFpbiBlcnJvcnNcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSBcIlAyMDAyXCIgfHwgZXJyb3IuY29kZSA9PT0gXCJQMjAyNVwiKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ZW1wdCA8IE1BWF9SRVRSSUVTIC0gMSkge1xuICAgICAgICBjb25zdCBkZWxheSA9IGdldFJldHJ5RGVsYXkoYXR0ZW1wdCk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgUmV0cnkgJHthdHRlbXB0ICsgMX0vJHtNQVhfUkVUUklFU30gZm9yICR7b3BlcmF0aW9uTmFtZX0gYWZ0ZXIgJHtkZWxheX1tc2ApO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IGxhc3RFcnJvcjtcbn1cblxuLy8gSW5pdGlhbGl6ZSBQcmlzbWEgd2l0aCByZXRyeSBsb2dpY1xuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZVByaXNtYSgpOiBQcm9taXNlPFByaXNtYUNsaWVudCB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgUHJpc21hQ2xpZW50KHtcbiAgICAgIGRhdGFzb3VyY2VzOiB7XG4gICAgICAgIGRiOiB7XG4gICAgICAgICAgdXJsOlxuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMIHx8XG4gICAgICAgICAgICBcInBvc3RncmVzcWw6Ly9wb3N0Z3Jlczpwb3N0Z3Jlc0Bsb2NhbGhvc3Q6NTQzMi9ldm9sdmVfZGI/c2NoZW1hPXB1YmxpY1wiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGxvZzogW1wiZXJyb3JcIiwgXCJ3YXJuXCJdLFxuICAgIH0pO1xuXG4gICAgLy8gVGVzdCBjb25uZWN0aW9uIHdpdGggcmV0cnlcbiAgICBhd2FpdCByZXRyeVdpdGhCYWNrb2ZmKCgpID0+IGNsaWVudC4kY29ubmVjdCgpLCBcIlByaXNtYSBjb25uZWN0aW9uXCIpO1xuXG4gICAgY29uc29sZS5pbmZvKFwiUHJpc21hIENsaWVudCBpbml0aWFsaXplZCBzdWNjZXNzZnVsbHlcIik7XG4gICAgcmV0dXJuIGNsaWVudDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuaW5mbyhcIlBvc3RncmVTUUwgbm90IGF2YWlsYWJsZS4gVXNpbmcgSlNPTiBmYWxsYmFjayBkYXRhYmFzZS5cIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gSW5pdGlhbGl6ZSBQcmlzbWEgYXN5bmNocm9ub3VzbHlcbmluaXRpYWxpemVQcmlzbWEoKVxuICAudGhlbigoY2xpZW50KSA9PiB7XG4gICAgcHJpc21hID0gY2xpZW50O1xuICAgIHVzZUZhbGxiYWNrID0gIWNsaWVudDtcbiAgfSlcbiAgLmNhdGNoKCgpID0+IHtcbiAgICB1c2VGYWxsYmFjayA9IHRydWU7XG4gIH0pO1xuXG5jb25zdCBGQUxMQkFDS19GSUxFID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwiZmFsbGJhY2stZGIuanNvblwiKTtcblxuLy8gTW9jayBkYXRhIHRvIGluaXRpYWxpemUgaWYgZmFsbGJhY2stZGIuanNvbiBkb2Vzbid0IGV4aXN0XG5jb25zdCBpbml0aWFsRmFsbGJhY2tEYXRhID0ge1xuICB1c2VyczogW1xuICAgIHtcbiAgICAgIGlkOiBcIjFcIixcbiAgICAgIGV0aEFkZHJlc3M6IFwiMHg3MUM3NjU2RUM3YWI4OGIwOThkZWZCNzUxQjc0MDFCNWY2ZDE0NzZCXCIsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiBcIjJcIixcbiAgICAgIGV0aEFkZHJlc3M6IFwiMHgzQWNBN2JiZjA4RjZENmNmOTJFRDlDNUI3RkRFN2I5NDQyMDhhMGU4XCIsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiBcIjNcIixcbiAgICAgIGV0aEFkZHJlc3M6IFwiMHg5MEY4YmY2QTQ3OWYzMjBjZWQwNzNFODI0RjI1MTM1YmM5M0M3YTRlXCIsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9LFxuICBdLFxuICBwcm9maWxlczogW1xuICAgIHtcbiAgICAgIGlkOiBcIjFcIixcbiAgICAgIHVzZXJJZDogXCIxXCIsXG4gICAgICBuYW1lOiBcIkFsaWNlXCIsXG4gICAgICBhZ2U6IDI4LFxuICAgICAgYmlvOiBcIlBhc3Npb25hdGUgYWJvdXQgYmxvY2tjaGFpbiBhbmQgZGVjZW50cmFsaXplZCBhcHBzLiBMb29raW5nIGZvciBtZWFuaW5nZnVsIGNvbm5lY3Rpb25zLlwiLFxuICAgICAgaW50ZXJlc3RzOiBbXCJXZWIzXCIsIFwiQ3J5cHRvXCIsIFwiR2FtaW5nXCIsIFwiVHJhdmVsXCJdLFxuICAgICAgaW1hZ2VVcmw6IFwiaHR0cHM6Ly9yYW5kb211c2VyLm1lL2FwaS9wb3J0cmFpdHMvd29tZW4vMS5qcGdcIixcbiAgICAgIGFnZUhpZGRlbjogZmFsc2UsXG4gICAgICBsYW5ndWFnZXM6IFtcImVuXCIsIFwiZGVcIl0sXG4gICAgICBwaG90b0JsdXJyZWQ6IHRydWUsXG4gICAgICBwaG90b0dyYW50czoge30sXG4gICAgICBvbmJvYXJkaW5nQ29tcGxldGU6IHRydWUsXG4gICAgICB2ZXJpZmllZFN0ZDogdHJ1ZSxcbiAgICAgIHZlcmlmaWVkRG5hOiBmYWxzZSxcbiAgICAgIHJlcHV0YXRpb25TY29yZTogOC43LFxuICAgICAgYXV0aE1vZGU6IFwibm9ybWFsXCIsXG4gICAgICBoaWRlUHJvZmlsZUZyb21Mb3dlckxldmVsczogZmFsc2UsXG4gICAgICB2b3RlcnM6IFtcbiAgICAgICAgeyBuYW1lOiBcIkJvYlwiLCB3ZWlnaHQ6IDguMiwgcmVsYXRpb246IFwiUGVlclwiIH0sXG4gICAgICAgIHsgbmFtZTogXCJDaGFybGllXCIsIHdlaWdodDogNi41LCByZWxhdGlvbjogXCJDb2xsZWFndWVcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiRGlhbmFcIiwgd2VpZ2h0OiA5LjEsIHJlbGF0aW9uOiBcIlZvdWNoZWQgbWF0Y2hcIiB9LFxuICAgICAgXSxcbiAgICAgIGRuYVByb2ZpbGU6IHtcbiAgICAgICAgRDNTMTM1ODogWzE1LCAxOF0sXG4gICAgICAgIHZXQTogWzE2LCAxN10sXG4gICAgICAgIEZHQTogWzIxLCAyNF0sXG4gICAgICAgIEQ4UzExNzk6IFsxMywgMTRdLFxuICAgICAgICBEMjFTMTE6IFsyOSwgMzEuMl0sXG4gICAgICAgIEQxOFM1MTogWzEyLCAxNV0sXG4gICAgICAgIEQ1UzgxODogWzExLCAxMl0sXG4gICAgICAgIEQxM1MzMTc6IFs4LCAxMl0sXG4gICAgICAgIEQ3UzgyMDogWzEwLCAxMV0sXG4gICAgICB9LFxuICAgICAgc3RkVGVzdFJlc3VsdDpcbiAgICAgICAgXCJORUdBVElWRSBmb3IgYWxsIGNvbW1vbiBwYXRob2dlbnMgKEhJVi0xLzIsIFN5cGhpbGlzLCBDaGxhbXlkaWEsIEdvbm9ycmhlYSwgSFNWLTEvMilcIixcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XG4gICAgICAgIHN0ZFJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIHN0ZEFwcHJvdmVkOiBmYWxzZSxcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcbiAgICAgICAgZG5hQXBwcm92ZWQ6IGZhbHNlLFxuICAgICAgICBteVN0ZEFwcHJvdmVkVG9UaGVtOiBmYWxzZSxcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IFwiMlwiLFxuICAgICAgdXNlcklkOiBcIjJcIixcbiAgICAgIG5hbWU6IFwiQm9iXCIsXG4gICAgICBhZ2U6IDMyLFxuICAgICAgYmlvOiBcIkVhcmx5IGNyeXB0byBhZG9wdGVyIGFuZCBhIGJpZyBmYW4gb2Ygb3Blbi1zb3VyY2UuIEVuam95IGhpa2luZyBhbmQgY29kaW5nLlwiLFxuICAgICAgaW50ZXJlc3RzOiBbXCJIaWtpbmdcIiwgXCJDb2RpbmdcIiwgXCJFdGhlcmV1bVwiLCBcIkRlRmlcIl0sXG4gICAgICBpbWFnZVVybDogXCJodHRwczovL3JhbmRvbXVzZXIubWUvYXBpL3BvcnRyYWl0cy9tZW4vMS5qcGdcIixcbiAgICAgIGFnZUhpZGRlbjogZmFsc2UsXG4gICAgICBsYW5ndWFnZXM6IFtcImVuXCIsIFwiZXNcIl0sXG4gICAgICBwaG90b0JsdXJyZWQ6IHRydWUsXG4gICAgICBwaG90b0dyYW50czoge30sXG4gICAgICBvbmJvYXJkaW5nQ29tcGxldGU6IHRydWUsXG4gICAgICB2ZXJpZmllZFN0ZDogdHJ1ZSxcbiAgICAgIHZlcmlmaWVkRG5hOiB0cnVlLFxuICAgICAgcmVwdXRhdGlvblNjb3JlOiA5LjQsXG4gICAgICBhdXRoTW9kZTogXCJwcmVnbmFuY3ktYm9uZFwiLFxuICAgICAgaGlkZVByb2ZpbGVGcm9tTG93ZXJMZXZlbHM6IHRydWUsXG4gICAgICB2b3RlcnM6IFtcbiAgICAgICAgeyBuYW1lOiBcIkFsaWNlXCIsIHdlaWdodDogOC43LCByZWxhdGlvbjogXCJEZXZlbG9wZXIgUGFydG5lclwiIH0sXG4gICAgICAgIHsgbmFtZTogXCJFbGVuYVwiLCB3ZWlnaHQ6IDkuNSwgcmVsYXRpb246IFwiVmVyaWZpZWQgUGFydG5lclwiIH0sXG4gICAgICAgIHsgbmFtZTogXCJGcmFua1wiLCB3ZWlnaHQ6IDcuOCwgcmVsYXRpb246IFwiTm9kZSBPcGVyYXRvclwiIH0sXG4gICAgICBdLFxuICAgICAgZG5hUHJvZmlsZToge1xuICAgICAgICBEM1MxMzU4OiBbMTQsIDE1XSxcbiAgICAgICAgdldBOiBbMTQsIDE2XSxcbiAgICAgICAgRkdBOiBbMjAsIDIyXSxcbiAgICAgICAgRDhTMTE3OTogWzEyLCAxM10sXG4gICAgICAgIEQyMVMxMTogWzI4LCAzMF0sXG4gICAgICAgIEQxOFM1MTogWzE0LCAxNl0sXG4gICAgICAgIEQ1UzgxODogWzExLCAxM10sXG4gICAgICAgIEQxM1MzMTc6IFs5LCAxMV0sXG4gICAgICAgIEQ3UzgyMDogWzgsIDEwXSxcbiAgICAgIH0sXG4gICAgICBzdGRUZXN0UmVzdWx0OlxuICAgICAgICBcIk5FR0FUSVZFIGZvciBhbGwgY29tbW9uIHBhdGhvZ2VucyAoSElWLTEvMiwgU3lwaGlsaXMsIENobGFteWRpYSwgR29ub3JyaGVhLCBIU1YtMS8yKVwiLFxuICAgICAgYWNjZXNzUGVybWlzc2lvbnM6IHtcbiAgICAgICAgc3RkUmVxdWVzdGVkOiBmYWxzZSxcbiAgICAgICAgc3RkQXBwcm92ZWQ6IGZhbHNlLFxuICAgICAgICBkbmFSZXF1ZXN0ZWQ6IGZhbHNlLFxuICAgICAgICBkbmFBcHByb3ZlZDogZmFsc2UsXG4gICAgICAgIG15U3RkQXBwcm92ZWRUb1RoZW06IGZhbHNlLFxuICAgICAgICBteURuYUFwcHJvdmVkVG9UaGVtOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogXCIzXCIsXG4gICAgICB1c2VySWQ6IFwiM1wiLFxuICAgICAgbmFtZTogXCJDaGFybGllXCIsXG4gICAgICBhZ2U6IDI1LFxuICAgICAgYmlvOiBcIkxvdmVzIGV4cGxvcmluZyBuZXcgdGVjaG5vbG9naWVzIGFuZCBtZWV0aW5nIGxpa2UtbWluZGVkIHBlb3BsZS4gQ29mZmVlIGVudGh1c2lhc3QuXCIsXG4gICAgICBpbnRlcmVzdHM6IFtcIkNvZmZlZVwiLCBcIkFJXCIsIFwiU3RhcnR1cHNcIiwgXCJBcnRcIl0sXG4gICAgICBpbWFnZVVybDogXCJodHRwczovL3JhbmRvbXVzZXIubWUvYXBpL3BvcnRyYWl0cy9tZW4vMi5qcGdcIixcbiAgICAgIGFnZUhpZGRlbjogdHJ1ZSxcbiAgICAgIGxhbmd1YWdlczogW1wiZW5cIiwgXCJmclwiXSxcbiAgICAgIHBob3RvQmx1cnJlZDogZmFsc2UsXG4gICAgICBwaG90b0dyYW50czoge30sXG4gICAgICBvbmJvYXJkaW5nQ29tcGxldGU6IHRydWUsXG4gICAgICB2ZXJpZmllZFN0ZDogZmFsc2UsXG4gICAgICB2ZXJpZmllZERuYTogZmFsc2UsXG4gICAgICByZXB1dGF0aW9uU2NvcmU6IDYuMixcbiAgICAgIGF1dGhNb2RlOiBcIm5vcm1hbFwiLFxuICAgICAgaGlkZVByb2ZpbGVGcm9tTG93ZXJMZXZlbHM6IGZhbHNlLFxuICAgICAgdm90ZXJzOiBbeyBuYW1lOiBcIkJvYlwiLCB3ZWlnaHQ6IDguMiwgcmVsYXRpb246IFwiSGFja2F0aG9uIFRlYW1tYXRlXCIgfV0sXG4gICAgICBhY2Nlc3NQZXJtaXNzaW9uczoge1xuICAgICAgICBzdGRSZXF1ZXN0ZWQ6IGZhbHNlLFxuICAgICAgICBzdGRBcHByb3ZlZDogZmFsc2UsXG4gICAgICAgIGRuYVJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIGRuYUFwcHJvdmVkOiBmYWxzZSxcbiAgICAgICAgbXlTdGRBcHByb3ZlZFRvVGhlbTogZmFsc2UsXG4gICAgICAgIG15RG5hQXBwcm92ZWRUb1RoZW06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiBcIjRcIixcbiAgICAgIHVzZXJJZDogXCI0XCIsXG4gICAgICBuYW1lOiBcIkRpYW5hXCIsXG4gICAgICBhZ2U6IDMwLFxuICAgICAgYmlvOiBcIkRpZ2l0YWwgbm9tYWQgYW5kIGNyeXB0byBlbnRodXNpYXN0LiBMb3ZlIGV4cGxvcmluZyBuZXcgY3VsdHVyZXMgYW5kIHRlY2hub2xvZ2llcy5cIixcbiAgICAgIGludGVyZXN0czogW1wiVHJhdmVsXCIsIFwiQ3J5cHRvXCIsIFwiUGhvdG9ncmFwaHlcIiwgXCJZb2dhXCJdLFxuICAgICAgaW1hZ2VVcmw6IFwiaHR0cHM6Ly9yYW5kb211c2VyLm1lL2FwaS9wb3J0cmFpdHMvd29tZW4vMi5qcGdcIixcbiAgICAgIGFnZUhpZGRlbjogZmFsc2UsXG4gICAgICBsYW5ndWFnZXM6IFtcInVrXCIsIFwicGxcIl0sXG4gICAgICBwaG90b0JsdXJyZWQ6IGZhbHNlLFxuICAgICAgcGhvdG9HcmFudHM6IHt9LFxuICAgICAgb25ib2FyZGluZ0NvbXBsZXRlOiB0cnVlLFxuICAgICAgdmVyaWZpZWRTdGQ6IHRydWUsXG4gICAgICB2ZXJpZmllZERuYTogdHJ1ZSxcbiAgICAgIHJlcHV0YXRpb25TY29yZTogOS4xLFxuICAgICAgYXV0aE1vZGU6IFwiY3J5cHRpYy1jaG9pY2VcIixcbiAgICAgIGhpZGVQcm9maWxlRnJvbUxvd2VyTGV2ZWxzOiB0cnVlLFxuICAgICAgdm90ZXJzOiBbXG4gICAgICAgIHsgbmFtZTogXCJBbGljZVwiLCB3ZWlnaHQ6IDguNywgcmVsYXRpb246IFwiVHJhdmVsIGJ1ZGR5XCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIkJvYlwiLCB3ZWlnaHQ6IDkuNCwgcmVsYXRpb246IFwiQ3J5cHRvIHBhcnRuZXJcIiB9LFxuICAgICAgXSxcbiAgICAgIGRuYVByb2ZpbGU6IHtcbiAgICAgICAgRDNTMTM1ODogWzEzLCAxNl0sXG4gICAgICAgIHZXQTogWzE1LCAxOF0sXG4gICAgICAgIEZHQTogWzE5LCAyM10sXG4gICAgICAgIEQ4UzExNzk6IFsxMSwgMTRdLFxuICAgICAgICBEMjFTMTE6IFsyNywgMzFdLFxuICAgICAgICBEMThTNTE6IFsxMywgMTZdLFxuICAgICAgICBENVM4MTg6IFsxMCwgMTJdLFxuICAgICAgICBEMTNTMzE3OiBbNywgMTFdLFxuICAgICAgICBEN1M4MjA6IFs5LCAxMl0sXG4gICAgICB9LFxuICAgICAgc3RkVGVzdFJlc3VsdDogXCJORUdBVElWRSBmb3IgYWxsIGNvbW1vbiBwYXRob2dlbnNcIixcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XG4gICAgICAgIHN0ZFJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIHN0ZEFwcHJvdmVkOiBmYWxzZSxcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcbiAgICAgICAgZG5hQXBwcm92ZWQ6IGZhbHNlLFxuICAgICAgICBteVN0ZEFwcHJvdmVkVG9UaGVtOiBmYWxzZSxcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IFwiNVwiLFxuICAgICAgdXNlcklkOiBcIjVcIixcbiAgICAgIG5hbWU6IFwiRWxlbmFcIixcbiAgICAgIGFnZTogMjcsXG4gICAgICBiaW86IFwiU29mdHdhcmUgZW5naW5lZXIgYnkgZGF5LCBhcnRpc3QgYnkgbmlnaHQuIEJlbGlldmVyIGluIGRlY2VudHJhbGl6ZWQgZnV0dXJlLlwiLFxuICAgICAgaW50ZXJlc3RzOiBbXCJBcnRcIiwgXCJDb2RpbmdcIiwgXCJNdXNpY1wiLCBcIkRlRmlcIl0sXG4gICAgICBpbWFnZVVybDogXCJodHRwczovL3JhbmRvbXVzZXIubWUvYXBpL3BvcnRyYWl0cy93b21lbi8zLmpwZ1wiLFxuICAgICAgYWdlSGlkZGVuOiBmYWxzZSxcbiAgICAgIGxhbmd1YWdlczogW1wiZW5cIiwgXCJqYVwiXSxcbiAgICAgIHBob3RvQmx1cnJlZDogZmFsc2UsXG4gICAgICBwaG90b0dyYW50czoge30sXG4gICAgICBvbmJvYXJkaW5nQ29tcGxldGU6IHRydWUsXG4gICAgICB2ZXJpZmllZFN0ZDogdHJ1ZSxcbiAgICAgIHZlcmlmaWVkRG5hOiBmYWxzZSxcbiAgICAgIHJlcHV0YXRpb25TY29yZTogOC45LFxuICAgICAgYXV0aE1vZGU6IFwicHJlZ25hbmN5LWJvbmRcIixcbiAgICAgIGhpZGVQcm9maWxlRnJvbUxvd2VyTGV2ZWxzOiBmYWxzZSxcbiAgICAgIHZvdGVyczogW1xuICAgICAgICB7IG5hbWU6IFwiQm9iXCIsIHdlaWdodDogOS40LCByZWxhdGlvbjogXCJDb2xsZWFndWVcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiRGlhbmFcIiwgd2VpZ2h0OiA5LjEsIHJlbGF0aW9uOiBcIkZyaWVuZFwiIH0sXG4gICAgICBdLFxuICAgICAgYWNjZXNzUGVybWlzc2lvbnM6IHtcbiAgICAgICAgc3RkUmVxdWVzdGVkOiBmYWxzZSxcbiAgICAgICAgc3RkQXBwcm92ZWQ6IGZhbHNlLFxuICAgICAgICBkbmFSZXF1ZXN0ZWQ6IGZhbHNlLFxuICAgICAgICBkbmFBcHByb3ZlZDogZmFsc2UsXG4gICAgICAgIG15U3RkQXBwcm92ZWRUb1RoZW06IGZhbHNlLFxuICAgICAgICBteURuYUFwcHJvdmVkVG9UaGVtOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogXCI2XCIsXG4gICAgICB1c2VySWQ6IFwiNlwiLFxuICAgICAgbmFtZTogXCJGcmFua1wiLFxuICAgICAgYWdlOiAzNSxcbiAgICAgIGJpbzogXCJCbG9ja2NoYWluIG5vZGUgb3BlcmF0b3IgYW5kIG9wZW4tc291cmNlIGNvbnRyaWJ1dG9yLiBEb2cgcGVyc29uLlwiLFxuICAgICAgaW50ZXJlc3RzOiBbXCJEb2dzXCIsIFwiRXRoZXJldW1cIiwgXCJSdXN0XCIsIFwiSGlraW5nXCJdLFxuICAgICAgaW1hZ2VVcmw6IFwiaHR0cHM6Ly9yYW5kb211c2VyLm1lL2FwaS9wb3J0cmFpdHMvbWVuLzMuanBnXCIsXG4gICAgICBhZ2VIaWRkZW46IGZhbHNlLFxuICAgICAgbGFuZ3VhZ2VzOiBbXCJlblwiLCBcInB0XCJdLFxuICAgICAgcGhvdG9CbHVycmVkOiBmYWxzZSxcbiAgICAgIHBob3RvR3JhbnRzOiB7fSxcbiAgICAgIG9uYm9hcmRpbmdDb21wbGV0ZTogdHJ1ZSxcbiAgICAgIHZlcmlmaWVkU3RkOiB0cnVlLFxuICAgICAgdmVyaWZpZWREbmE6IHRydWUsXG4gICAgICByZXB1dGF0aW9uU2NvcmU6IDkuNixcbiAgICAgIGF1dGhNb2RlOiBcImNyeXB0aWMtY2hvaWNlXCIsXG4gICAgICBoaWRlUHJvZmlsZUZyb21Mb3dlckxldmVsczogdHJ1ZSxcbiAgICAgIHZvdGVyczogW1xuICAgICAgICB7IG5hbWU6IFwiQm9iXCIsIHdlaWdodDogOS40LCByZWxhdGlvbjogXCJOb2RlIHBhcnRuZXJcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiRGlhbmFcIiwgd2VpZ2h0OiA5LjEsIHJlbGF0aW9uOiBcIlZlcmlmaWVkIG1hdGNoXCIgfSxcbiAgICAgIF0sXG4gICAgICBkbmFQcm9maWxlOiB7XG4gICAgICAgIEQzUzEzNTg6IFsxNCwgMTddLFxuICAgICAgICB2V0E6IFsxMywgMTVdLFxuICAgICAgICBGR0E6IFsyMiwgMjVdLFxuICAgICAgICBEOFMxMTc5OiBbMTAsIDEzXSxcbiAgICAgICAgRDIxUzExOiBbMjksIDMwXSxcbiAgICAgICAgRDE4UzUxOiBbMTUsIDE3XSxcbiAgICAgICAgRDVTODE4OiBbMTIsIDEzXSxcbiAgICAgICAgRDEzUzMxNzogWzgsIDEwXSxcbiAgICAgICAgRDdTODIwOiBbNywgMTFdLFxuICAgICAgfSxcbiAgICAgIHN0ZFRlc3RSZXN1bHQ6IFwiTkVHQVRJVkUgZm9yIGFsbCBjb21tb24gcGF0aG9nZW5zXCIsXG4gICAgICBhY2Nlc3NQZXJtaXNzaW9uczoge1xuICAgICAgICBzdGRSZXF1ZXN0ZWQ6IGZhbHNlLFxuICAgICAgICBzdGRBcHByb3ZlZDogZmFsc2UsXG4gICAgICAgIGRuYVJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIGRuYUFwcHJvdmVkOiBmYWxzZSxcbiAgICAgICAgbXlTdGRBcHByb3ZlZFRvVGhlbTogZmFsc2UsXG4gICAgICAgIG15RG5hQXBwcm92ZWRUb1RoZW06IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiBcIjdcIixcbiAgICAgIHVzZXJJZDogXCI3XCIsXG4gICAgICBuYW1lOiBcIkdyYWNlXCIsXG4gICAgICBhZ2U6IDI0LFxuICAgICAgYmlvOiBcIkNyeXB0byBuZXdiZSBsZWFybmluZyBhYm91dCBEZUZpIGFuZCBXZWIzLiBMb3ZlIGNhdHMgYW5kIGJvb2tzLlwiLFxuICAgICAgaW50ZXJlc3RzOiBbXCJCb29rc1wiLCBcIkNhdHNcIiwgXCJMZWFybmluZ1wiLCBcIkNyeXB0b1wiXSxcbiAgICAgIGltYWdlVXJsOiBcImh0dHBzOi8vcmFuZG9tdXNlci5tZS9hcGkvcG9ydHJhaXRzL3dvbWVuLzQuanBnXCIsXG4gICAgICB2ZXJpZmllZFN0ZDogZmFsc2UsXG4gICAgICB2ZXJpZmllZERuYTogZmFsc2UsXG4gICAgICByZXB1dGF0aW9uU2NvcmU6IDUuOCxcbiAgICAgIGF1dGhNb2RlOiBcIm5vcm1hbFwiLFxuICAgICAgaGlkZVByb2ZpbGVGcm9tTG93ZXJMZXZlbHM6IGZhbHNlLFxuICAgICAgdm90ZXJzOiBbXSxcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XG4gICAgICAgIHN0ZFJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIHN0ZEFwcHJvdmVkOiBmYWxzZSxcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcbiAgICAgICAgZG5hQXBwcm92ZWQ6IGZhbHNlLFxuICAgICAgICBteVN0ZEFwcHJvdmVkVG9UaGVtOiBmYWxzZSxcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IFwiOFwiLFxuICAgICAgdXNlcklkOiBcIjhcIixcbiAgICAgIG5hbWU6IFwiSGVucnlcIixcbiAgICAgIGFnZTogMzEsXG4gICAgICBiaW86IFwiVGVjaCBlbnRyZXByZW5ldXIgYW5kIGFuZ2VsIGludmVzdG9yLiBMb29raW5nIGZvciBnZW51aW5lIGNvbm5lY3Rpb25zLlwiLFxuICAgICAgaW50ZXJlc3RzOiBbXCJTdGFydHVwc1wiLCBcIkFJXCIsIFwiV2luZVwiLCBcIlRlbm5pc1wiXSxcbiAgICAgIGltYWdlVXJsOiBcImh0dHBzOi8vcmFuZG9tdXNlci5tZS9hcGkvcG9ydHJhaXRzL21lbi80LmpwZ1wiLFxuICAgICAgdmVyaWZpZWRTdGQ6IHRydWUsXG4gICAgICB2ZXJpZmllZERuYTogdHJ1ZSxcbiAgICAgIHJlcHV0YXRpb25TY29yZTogOS4yLFxuICAgICAgYXV0aE1vZGU6IFwicHJlZ25hbmN5LWJvbmRcIixcbiAgICAgIGhpZGVQcm9maWxlRnJvbUxvd2VyTGV2ZWxzOiB0cnVlLFxuICAgICAgdm90ZXJzOiBbXG4gICAgICAgIHsgbmFtZTogXCJGcmFua1wiLCB3ZWlnaHQ6IDkuNiwgcmVsYXRpb246IFwiQnVzaW5lc3MgcGFydG5lclwiIH0sXG4gICAgICAgIHsgbmFtZTogXCJEaWFuYVwiLCB3ZWlnaHQ6IDkuMSwgcmVsYXRpb246IFwiSW52ZXN0b3JcIiB9LFxuICAgICAgXSxcbiAgICAgIGRuYVByb2ZpbGU6IHtcbiAgICAgICAgRDNTMTM1ODogWzE2LCAxOV0sXG4gICAgICAgIHZXQTogWzE0LCAxN10sXG4gICAgICAgIEZHQTogWzIwLCAyNF0sXG4gICAgICAgIEQ4UzExNzk6IFsxMiwgMTVdLFxuICAgICAgICBEMjFTMTE6IFsyOCwgMzFdLFxuICAgICAgICBEMThTNTE6IFsxMywgMTRdLFxuICAgICAgICBENVM4MTg6IFsxMSwgMTJdLFxuICAgICAgICBEMTNTMzE3OiBbOSwgMTJdLFxuICAgICAgICBEN1M4MjA6IFs4LCAxMF0sXG4gICAgICB9LFxuICAgICAgc3RkVGVzdFJlc3VsdDogXCJORUdBVElWRSBmb3IgYWxsIGNvbW1vbiBwYXRob2dlbnNcIixcbiAgICAgIGFjY2Vzc1Blcm1pc3Npb25zOiB7XG4gICAgICAgIHN0ZFJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIHN0ZEFwcHJvdmVkOiBmYWxzZSxcbiAgICAgICAgZG5hUmVxdWVzdGVkOiBmYWxzZSxcbiAgICAgICAgZG5hQXBwcm92ZWQ6IGZhbHNlLFxuICAgICAgICBteVN0ZEFwcHJvdmVkVG9UaGVtOiBmYWxzZSxcbiAgICAgICAgbXlEbmFBcHByb3ZlZFRvVGhlbTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIG1hdGNoZXM6IFtdIGFzIGFueVtdLFxuICBtZXNzYWdlczogW1xuICAgIHtcbiAgICAgIGlkOiBcIm0xXCIsXG4gICAgICBzZW5kZXJJZDogXCIwZnh4dHRzaXNcIixcbiAgICAgIHJlY2VpdmVySWQ6IFwiMVwiLFxuICAgICAgdGV4dDogXCJIZXkgQWxpY2UhIExvdmUgeW91ciBXZWIzIHByb2plY3RzLlwiLFxuICAgICAgdGltZTogXCIyMDI2LTA2LTEwVDEwOjMwOjAwLjAwMFpcIixcbiAgICAgIGlzUmVxdWVzdDogZmFsc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogXCJtMlwiLFxuICAgICAgc2VuZGVySWQ6IFwiMVwiLFxuICAgICAgcmVjZWl2ZXJJZDogXCIwZnh4dHRzaXNcIixcbiAgICAgIHRleHQ6IFwiVGhhbmtzISBJIHNhdyB5b3UncmUgaW50byBjcnlwdG8gdG9vLiBXaGF0IGNoYWlucyBkbyB5b3UgdXNlP1wiLFxuICAgICAgdGltZTogXCIyMDI2LTA2LTEwVDEwOjM1OjAwLjAwMFpcIixcbiAgICAgIGlzUmVxdWVzdDogZmFsc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogXCJtM1wiLFxuICAgICAgc2VuZGVySWQ6IFwiMGZ4eHR0c2lzXCIsXG4gICAgICByZWNlaXZlcklkOiBcIjFcIixcbiAgICAgIHRleHQ6IFwiTW9zdGx5IEFyYml0cnVtIGFuZCBQb2x5Z29uLiBMb3ZlIHRoZSBsb3cgZmVlcyFcIixcbiAgICAgIHRpbWU6IFwiMjAyNi0wNi0xMFQxMDo0MDowMC4wMDBaXCIsXG4gICAgICBpc1JlcXVlc3Q6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IFwibTRcIixcbiAgICAgIHNlbmRlcklkOiBcIjBmeHh0dHNpc1wiLFxuICAgICAgcmVjZWl2ZXJJZDogXCI0XCIsXG4gICAgICB0ZXh0OiBcIkhpIERpYW5hISBGZWxsb3cgZGlnaXRhbCBub21hZCBoZXJlLlwiLFxuICAgICAgdGltZTogXCIyMDI2LTA2LTEwVDExOjAwOjAwLjAwMFpcIixcbiAgICAgIGlzUmVxdWVzdDogZmFsc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogXCJtNVwiLFxuICAgICAgc2VuZGVySWQ6IFwiNFwiLFxuICAgICAgcmVjZWl2ZXJJZDogXCIwZnh4dHRzaXNcIixcbiAgICAgIHRleHQ6IFwiSGV5ISBXaGVyZSBhcmUgeW91IGJhc2VkIHJpZ2h0IG5vdz9cIixcbiAgICAgIHRpbWU6IFwiMjAyNi0wNi0xMFQxMTowNTowMC4wMDBaXCIsXG4gICAgICBpc1JlcXVlc3Q6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IFwibTZcIixcbiAgICAgIHNlbmRlcklkOiBcIjBmeHh0dHNpc1wiLFxuICAgICAgcmVjZWl2ZXJJZDogXCI0XCIsXG4gICAgICB0ZXh0OiBcIkN1cnJlbnRseSBpbiBMaXNib24uIFlvdT9cIixcbiAgICAgIHRpbWU6IFwiMjAyNi0wNi0xMFQxMToxMDowMC4wMDBaXCIsXG4gICAgICBpc1JlcXVlc3Q6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IFwibTdcIixcbiAgICAgIHNlbmRlcklkOiBcIjRcIixcbiAgICAgIHJlY2VpdmVySWQ6IFwiMGZ4eHR0c2lzXCIsXG4gICAgICB0ZXh0OiBcIkJhbGkhIFdlIHNob3VsZCBjb25uZWN0IGF0IGEgY3J5cHRvIGNvbmZlcmVuY2Ugc29tZXRpbWUuXCIsXG4gICAgICB0aW1lOiBcIjIwMjYtMDYtMTBUMTE6MTU6MDAuMDAwWlwiLFxuICAgICAgaXNSZXF1ZXN0OiBmYWxzZSxcbiAgICB9LFxuICBdLFxuICBkb2N1bWVudHM6IFtdIGFzIGFueVtdLFxufTtcblxuZnVuY3Rpb24gcmVhZEZhbGxiYWNrKCkge1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoRkFMTEJBQ0tfRklMRSkpIHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKEZBTExCQUNLX0ZJTEUsIEpTT04uc3RyaW5naWZ5KGluaXRpYWxGYWxsYmFja0RhdGEsIG51bGwsIDIpKTtcbiAgICByZXR1cm4gaW5pdGlhbEZhbGxiYWNrRGF0YTtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhGQUxMQkFDS19GSUxFLCBcInV0Zi04XCIpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBpbml0aWFsRmFsbGJhY2tEYXRhO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyaXRlRmFsbGJhY2soZGF0YTogYW55KSB7XG4gIGZzLndyaXRlRmlsZVN5bmMoRkFMTEJBQ0tfRklMRSwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xufVxuXG4vLyBXcmFwcGVyIHRvIHRyeSBQcmlzbWEgd2l0aCByZXRyeSBhbmQgZmFsbGJhY2sgaWYgaXQgY2FuJ3QgY29ubmVjdFxuYXN5bmMgZnVuY3Rpb24gcnVuV2l0aERiPFQ+KFxuICBkYlF1ZXJ5OiAocDogUHJpc21hQ2xpZW50KSA9PiBQcm9taXNlPFQ+LFxuICBmYWxsYmFja1F1ZXJ5OiAoKSA9PiBULFxuICBvcGVyYXRpb25OYW1lOiBzdHJpbmcgPSBcImRhdGFiYXNlIG9wZXJhdGlvblwiLFxuKTogUHJvbWlzZTxUPiB7XG4gIGlmICh1c2VGYWxsYmFjayB8fCAhcHJpc21hKSB7XG4gICAgcmV0dXJuIGZhbGxiYWNrUXVlcnkoKTtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCByZXRyeVdpdGhCYWNrb2ZmKCgpID0+IGRiUXVlcnkocHJpc21hISksIG9wZXJhdGlvbk5hbWUpO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICBlLmNvZGUgPT09IFwiUDEwMDFcIiB8fFxuICAgICAgZS5tZXNzYWdlPy5pbmNsdWRlcyhcIkNhbid0IHJlYWNoIGRhdGFiYXNlXCIpIHx8XG4gICAgICBlLm1lc3NhZ2U/LmluY2x1ZGVzKFwiaW5pdGlhbGl6YXRpb25cIilcbiAgICApIHtcbiAgICAgIGNvbnNvbGUuaW5mbyhcIlBvc3RncmVTUUwgbm90IHJlYWNoYWJsZS4gRmFsbGluZyBiYWNrIHRvIEpTT04gZGF0YWJhc2UuXCIpO1xuICAgICAgdXNlRmFsbGJhY2sgPSB0cnVlO1xuICAgICAgcmV0dXJuIGZhbGxiYWNrUXVlcnkoKTtcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG4vLyBTZXZlcmFsIFByb2ZpbGUgY29sdW1ucyAoZG5hUHJvZmlsZSwgYWNjZXNzUGVybWlzc2lvbnMsIGludGVyZXN0cywgdm90ZXJzKVxuLy8gYXJlIE5PVCBOVUxMIFN0cmluZyBjb2x1bW5zIGhvbGRpbmcgc2VyaWFsaXplZCBKU09OLiBQcmlzbWEgcmVhZHMgcmV0dXJuIHRoZVxuLy8gcmF3IHN0cmluZ3M7IGV4cG9zZSB0aGVtIHRvIGNvbnN1bWVycyBhcyBvYmplY3RzL2FycmF5cyBzbyB0aGUgUG9zdGdyZXMgcGF0aFxuLy8gbWF0Y2hlcyB0aGUgc2hhcGUgdGhlIGZpbGUtYmFzZWQgZmFsbGJhY2sgc3RvcmUgcHJvdmlkZXMuXG5jb25zdCBQUk9GSUxFX0pTT05fQ09MVU1OUyA9IFtcbiAgXCJkbmFQcm9maWxlXCIsXG4gIFwiYWNjZXNzUGVybWlzc2lvbnNcIixcbiAgXCJpbnRlcmVzdHNcIixcbiAgXCJ2b3RlcnNcIixcbiAgXCJsYW5ndWFnZXNcIixcbiAgXCJwaG90b0dyYW50c1wiLFxuXTtcblxuZnVuY3Rpb24gZGVzZXJpYWxpemVQcm9maWxlUm93KHByb2ZpbGU6IGFueSkge1xuICBpZiAoIXByb2ZpbGUgfHwgdHlwZW9mIHByb2ZpbGUgIT09IFwib2JqZWN0XCIpIHJldHVybiBwcm9maWxlO1xuICBjb25zdCBwYXJzZWQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0geyAuLi5wcm9maWxlIH07XG4gIGZvciAoY29uc3Qga2V5IG9mIFBST0ZJTEVfSlNPTl9DT0xVTU5TKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZWRba2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwYXJzZWRba2V5XSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHBhcnNlZFtrZXldID0ga2V5ID09PSBcImludGVyZXN0c1wiIHx8IGtleSA9PT0gXCJ2b3RlcnNcIiA/IFtdIDogbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcnNlZDtcbn1cblxuZXhwb3J0IGNvbnN0IGRiU2VydmljZSA9IHtcbiAgLy8gLS0tIFVTRVJTIC0tLVxuICBhc3luYyBnZXRVc2VycygpIHtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IHAudXNlci5maW5kTWFueSh7IGluY2x1ZGU6IHsgcHJvZmlsZTogdHJ1ZSB9IH0pLFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybiBkYXRhLnVzZXJzLm1hcCgodTogYW55KSA9PiAoe1xuICAgICAgICAgIC4uLnUsXG4gICAgICAgICAgcHJvZmlsZTogZGF0YS5wcm9maWxlcy5maW5kKChwOiBhbnkpID0+IHAudXNlcklkID09PSB1LmlkKSB8fCBudWxsLFxuICAgICAgICB9KSk7XG4gICAgICB9LFxuICAgICAgXCJnZXRVc2Vyc1wiLFxuICAgICk7XG4gIH0sXG5cbiAgYXN5bmMgZ2V0VXNlckJ5QWRkcmVzcyhldGhBZGRyZXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBmb3JtYXR0ZWRBZGRyID0gZXRoQWRkcmVzcy50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT4ge1xuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcC51c2VyLmZpbmRGaXJzdCh7XG4gICAgICAgICAgd2hlcmU6IHsgZXRoQWRkcmVzczogeyBlcXVhbHM6IGZvcm1hdHRlZEFkZHIgfSB9LFxuICAgICAgICAgIGluY2x1ZGU6IHsgcHJvZmlsZTogdHJ1ZSB9LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHVzZXIgPyB7IC4uLnVzZXIsIHByb2ZpbGU6IGRlc2VyaWFsaXplUHJvZmlsZVJvdyh1c2VyLnByb2ZpbGUpIH0gOiBudWxsO1xuICAgICAgfSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xuICAgICAgICBjb25zdCB1c2VyID0gZGF0YS51c2Vycy5maW5kKFxuICAgICAgICAgICh1OiBhbnkpID0+IHUuZXRoQWRkcmVzcyAmJiB1LmV0aEFkZHJlc3MudG9Mb3dlckNhc2UoKSA9PT0gZm9ybWF0dGVkQWRkcixcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgIHByb2ZpbGU6IGRhdGEucHJvZmlsZXMuZmluZCgocDogYW55KSA9PiBwLnVzZXJJZCA9PT0gdXNlci5pZCkgfHwgbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBcImdldFVzZXJCeUFkZHJlc3NcIixcbiAgICApO1xuICB9LFxuXG4gIGFzeW5jIGdldFVzZXJCeUVtYWlsKGVtYWlsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBmb3JtYXR0ZWRFbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT4ge1xuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcC51c2VyLmZpbmRGaXJzdCh7XG4gICAgICAgICAgd2hlcmU6IHsgZW1haWw6IHsgZXF1YWxzOiBmb3JtYXR0ZWRFbWFpbCB9IH0sXG4gICAgICAgICAgaW5jbHVkZTogeyBwcm9maWxlOiB0cnVlIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdXNlciA/IHsgLi4udXNlciwgcHJvZmlsZTogZGVzZXJpYWxpemVQcm9maWxlUm93KHVzZXIucHJvZmlsZSkgfSA6IG51bGw7XG4gICAgICB9LFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBkYXRhLnVzZXJzLmZpbmQoXG4gICAgICAgICAgKHU6IGFueSkgPT4gdS5lbWFpbCAmJiB1LmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdHRlZEVtYWlsLFxuICAgICAgICApO1xuICAgICAgICBpZiAoIXVzZXIpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnVzZXIsXG4gICAgICAgICAgcHJvZmlsZTogZGF0YS5wcm9maWxlcy5maW5kKChwOiBhbnkpID0+IHAudXNlcklkID09PSB1c2VyLmlkKSB8fCBudWxsLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIFwiZ2V0VXNlckJ5RW1haWxcIixcbiAgICApO1xuICB9LFxuXG4gIGFzeW5jIGNyZWF0ZVVzZXIoZXRoQWRkcmVzczogc3RyaW5nKSB7XG4gICAgY29uc3QgZm9ybWF0dGVkQWRkciA9IGV0aEFkZHJlc3MudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IHAudXNlci5jcmVhdGUoeyBkYXRhOiB7IGV0aEFkZHJlc3M6IGZvcm1hdHRlZEFkZHIgfSB9KSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGRhdGEudXNlcnMuZmluZChcbiAgICAgICAgICAodTogYW55KSA9PiB1LmV0aEFkZHJlc3MgJiYgdS5ldGhBZGRyZXNzLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdHRlZEFkZHIsXG4gICAgICAgICk7XG4gICAgICAgIGlmIChleGlzdGluZykgcmV0dXJuIGV4aXN0aW5nO1xuICAgICAgICBjb25zdCBuZXdVc2VyID0ge1xuICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpLFxuICAgICAgICAgIGV0aEFkZHJlc3M6IGZvcm1hdHRlZEFkZHIsXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIH07XG4gICAgICAgIGRhdGEudXNlcnMucHVzaChuZXdVc2VyKTtcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcbiAgICAgICAgcmV0dXJuIG5ld1VzZXI7XG4gICAgICB9LFxuICAgICAgXCJjcmVhdGVVc2VyXCIsXG4gICAgKTtcbiAgfSxcblxuICBhc3luYyBjcmVhdGVVc2VyV2l0aEVtYWlsKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkSGFzaDogc3RyaW5nKSB7XG4gICAgY29uc3QgZm9ybWF0dGVkRW1haWwgPSBlbWFpbC50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IHAudXNlci5jcmVhdGUoeyBkYXRhOiB7IGVtYWlsOiBmb3JtYXR0ZWRFbWFpbCwgcGFzc3dvcmRIYXNoIH0gfSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBkYXRhLnVzZXJzLmZpbmQoXG4gICAgICAgICAgKHU6IGFueSkgPT4gdS5lbWFpbCAmJiB1LmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IGZvcm1hdHRlZEVtYWlsLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHJldHVybiBleGlzdGluZztcbiAgICAgICAgY29uc3QgbmV3VXNlciA9IHtcbiAgICAgICAgICBpZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDExKSxcbiAgICAgICAgICBlbWFpbDogZm9ybWF0dGVkRW1haWwsXG4gICAgICAgICAgcGFzc3dvcmRIYXNoLFxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgICBkYXRhLnVzZXJzLnB1c2gobmV3VXNlcik7XG4gICAgICAgIHdyaXRlRmFsbGJhY2soZGF0YSk7XG4gICAgICAgIHJldHVybiBuZXdVc2VyO1xuICAgICAgfSxcbiAgICAgIFwiY3JlYXRlVXNlcldpdGhFbWFpbFwiLFxuICAgICk7XG4gIH0sXG5cbiAgLy8gLS0tIFBST0ZJTEVTIC0tLVxuICBhc3luYyBnZXRQcm9maWxlcygpIHtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IChhd2FpdCBwLnByb2ZpbGUuZmluZE1hbnkoKSkubWFwKChyb3cpID0+IGRlc2VyaWFsaXplUHJvZmlsZVJvdyhyb3cpKSxcbiAgICAgICgpID0+IHJlYWRGYWxsYmFjaygpLnByb2ZpbGVzLFxuICAgICAgXCJnZXRQcm9maWxlc1wiLFxuICAgICk7XG4gIH0sXG5cbiAgYXN5bmMgdXBzZXJ0UHJvZmlsZSh1c2VySWQ6IHN0cmluZywgcHJvZmlsZURhdGE6IGFueSkge1xuICAgIC8vIFNldmVyYWwgUHJvZmlsZSBjb2x1bW5zIChpbnRlcmVzdHMsIHZvdGVycywgYWNjZXNzUGVybWlzc2lvbnMsXG4gICAgLy8gZG5hUHJvZmlsZSwgbGFuZ3VhZ2VzLCBwaG90b0dyYW50cykgYXJlIE5PVCBOVUxMIFN0cmluZyBjb2x1bW5zIGhvbGRpbmdcbiAgICAvLyBzZXJpYWxpemVkIEpTT04gd2hpbGUgY2FsbGVycyB3b3JrIHdpdGggcGxhaW4gYXJyYXlzL29iamVjdHMuIFNlcmlhbGl6ZVxuICAgIC8vIG9uIHdyaXRlOyBwYXJzZSBiYWNrIG9uIHJlYWQgdmlhIGRlc2VyaWFsaXplUHJvZmlsZVJvdy4gVGhlIGNyZWF0ZVxuICAgIC8vIGJyYW5jaCBkZWZhdWx0cyBvbWl0dGVkIGZpZWxkczsgdGhlIHVwZGF0ZSBicmFuY2ggdG91Y2hlcyBhIGNvbHVtbiBvbmx5XG4gICAgLy8gd2hlbiBleHBsaWNpdGx5IHByb3ZpZGVkLlxuICAgIGNvbnN0IHsgaW50ZXJlc3RzLCB2b3RlcnMsIGFjY2Vzc1Blcm1pc3Npb25zLCBkbmFQcm9maWxlLCBsYW5ndWFnZXMsIHBob3RvR3JhbnRzLCAuLi5yZXN0IH0gPVxuICAgICAgcHJvZmlsZURhdGEgPz8ge307XG4gICAgY29uc3QgdXBkYXRlUGF0Y2g6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0geyAuLi5yZXN0IH07XG4gICAgaWYgKGludGVyZXN0cyAhPT0gdW5kZWZpbmVkKSB1cGRhdGVQYXRjaC5pbnRlcmVzdHMgPSBKU09OLnN0cmluZ2lmeShpbnRlcmVzdHMpO1xuICAgIGlmICh2b3RlcnMgIT09IHVuZGVmaW5lZCkgdXBkYXRlUGF0Y2gudm90ZXJzID0gSlNPTi5zdHJpbmdpZnkodm90ZXJzKTtcbiAgICBpZiAoYWNjZXNzUGVybWlzc2lvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdXBkYXRlUGF0Y2guYWNjZXNzUGVybWlzc2lvbnMgPSBKU09OLnN0cmluZ2lmeShhY2Nlc3NQZXJtaXNzaW9ucyA/PyBudWxsKTtcbiAgICB9XG4gICAgaWYgKGRuYVByb2ZpbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdXBkYXRlUGF0Y2guZG5hUHJvZmlsZSA9IEpTT04uc3RyaW5naWZ5KGRuYVByb2ZpbGUgPz8gbnVsbCk7XG4gICAgfVxuICAgIGlmIChsYW5ndWFnZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdXBkYXRlUGF0Y2gubGFuZ3VhZ2VzID0gSlNPTi5zdHJpbmdpZnkobGFuZ3VhZ2VzKTtcbiAgICB9XG4gICAgaWYgKHBob3RvR3JhbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHVwZGF0ZVBhdGNoLnBob3RvR3JhbnRzID0gSlNPTi5zdHJpbmdpZnkocGhvdG9HcmFudHMgPz8ge30pO1xuICAgIH1cbiAgICBjb25zdCBjcmVhdGVEYXRhID0ge1xuICAgICAgdXNlcklkLFxuICAgICAgLi4ucmVzdCxcbiAgICAgIGludGVyZXN0czogaW50ZXJlc3RzICE9PSB1bmRlZmluZWQgPyBKU09OLnN0cmluZ2lmeShpbnRlcmVzdHMpIDogXCJbXVwiLFxuICAgICAgdm90ZXJzOiB2b3RlcnMgIT09IHVuZGVmaW5lZCA/IEpTT04uc3RyaW5naWZ5KHZvdGVycykgOiBcIltdXCIsXG4gICAgICBhY2Nlc3NQZXJtaXNzaW9uczpcbiAgICAgICAgYWNjZXNzUGVybWlzc2lvbnMgIT09IHVuZGVmaW5lZCA/IEpTT04uc3RyaW5naWZ5KGFjY2Vzc1Blcm1pc3Npb25zID8/IG51bGwpIDogXCJudWxsXCIsXG4gICAgICBkbmFQcm9maWxlOiBkbmFQcm9maWxlICE9PSB1bmRlZmluZWQgPyBKU09OLnN0cmluZ2lmeShkbmFQcm9maWxlID8/IG51bGwpIDogXCJudWxsXCIsXG4gICAgICBsYW5ndWFnZXM6IGxhbmd1YWdlcyAhPT0gdW5kZWZpbmVkID8gSlNPTi5zdHJpbmdpZnkobGFuZ3VhZ2VzKSA6IFwiW11cIixcbiAgICAgIHBob3RvR3JhbnRzOiBwaG90b0dyYW50cyAhPT0gdW5kZWZpbmVkID8gSlNPTi5zdHJpbmdpZnkocGhvdG9HcmFudHMgPz8ge30pIDogXCJ7fVwiLFxuICAgIH07XG4gICAgcmV0dXJuIHJ1bldpdGhEYihcbiAgICAgIGFzeW5jIChwKSA9PlxuICAgICAgICBwLnByb2ZpbGUudXBzZXJ0KHtcbiAgICAgICAgICB3aGVyZTogeyB1c2VySWQgfSxcbiAgICAgICAgICB1cGRhdGU6IHVwZGF0ZVBhdGNoLFxuICAgICAgICAgIGNyZWF0ZTogY3JlYXRlRGF0YSxcbiAgICAgICAgfSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcbiAgICAgICAgbGV0IHByb2ZpbGUgPSBkYXRhLnByb2ZpbGVzLmZpbmQoKHA6IGFueSkgPT4gcC51c2VySWQgPT09IHVzZXJJZCk7XG4gICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihwcm9maWxlLCBwcm9maWxlRGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvZmlsZSA9IHtcbiAgICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpLFxuICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgLi4ucHJvZmlsZURhdGEsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBkYXRhLnByb2ZpbGVzLnB1c2gocHJvZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcbiAgICAgICAgcmV0dXJuIHByb2ZpbGU7XG4gICAgICB9LFxuICAgICAgXCJ1cHNlcnRQcm9maWxlXCIsXG4gICAgKTtcbiAgfSxcblxuICAvLyAtLS0gTUFUQ0hFUyAtLS1cbiAgYXN5bmMgZ2V0TWF0Y2hlcygpIHtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IHAubWF0Y2guZmluZE1hbnkoKSxcbiAgICAgICgpID0+IHJlYWRGYWxsYmFjaygpLm1hdGNoZXMsXG4gICAgICBcImdldE1hdGNoZXNcIixcbiAgICApO1xuICB9LFxuXG4gIGFzeW5jIGNyZWF0ZU1hdGNoKHVzZXJJZDogc3RyaW5nLCBtYXRjaGVkVXNlcklkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IHAubWF0Y2guY3JlYXRlKHsgZGF0YTogeyB1c2VySWQsIG1hdGNoZWRVc2VySWQgfSB9KSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IGRhdGEubWF0Y2hlcy5maW5kKFxuICAgICAgICAgIChtOiBhbnkpID0+XG4gICAgICAgICAgICAobS51c2VySWQgPT09IHVzZXJJZCAmJiBtLm1hdGNoZWRVc2VySWQgPT09IG1hdGNoZWRVc2VySWQpIHx8XG4gICAgICAgICAgICAobS51c2VySWQgPT09IG1hdGNoZWRVc2VySWQgJiYgbS5tYXRjaGVkVXNlcklkID09PSB1c2VySWQpLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZXhpc3RpbmcpIHJldHVybiBleGlzdGluZztcbiAgICAgICAgY29uc3QgbmV3TWF0Y2ggPSB7XG4gICAgICAgICAgaWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMSksXG4gICAgICAgICAgdXNlcklkLFxuICAgICAgICAgIG1hdGNoZWRVc2VySWQsXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIH07XG4gICAgICAgIGRhdGEubWF0Y2hlcy5wdXNoKG5ld01hdGNoKTtcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcbiAgICAgICAgcmV0dXJuIG5ld01hdGNoO1xuICAgICAgfSxcbiAgICAgIFwiY3JlYXRlTWF0Y2hcIixcbiAgICApO1xuICB9LFxuXG4gIC8vIC0tLSBNRVNTQUdFUyAtLS1cbiAgYXN5bmMgZ2V0TWVzc2FnZXMoc2VuZGVySWQ6IHN0cmluZywgcmVjZWl2ZXJJZDogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT5cbiAgICAgICAgcC5tZXNzYWdlLmZpbmRNYW55KHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgT1I6IFtcbiAgICAgICAgICAgICAgeyBzZW5kZXJJZCwgcmVjZWl2ZXJJZCB9LFxuICAgICAgICAgICAgICB7IHNlbmRlcklkOiByZWNlaXZlcklkLCByZWNlaXZlcklkOiBzZW5kZXJJZCB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiBcImFzY1wiIH0sXG4gICAgICAgIH0pIGFzIFByb21pc2U8YW55W10+LFxuICAgICAgKCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gcmVhZEZhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybiBkYXRhLm1lc3NhZ2VzLmZpbHRlcihcbiAgICAgICAgICAobTogYW55KSA9PlxuICAgICAgICAgICAgKG0uc2VuZGVySWQgPT09IHNlbmRlcklkICYmIG0ucmVjZWl2ZXJJZCA9PT0gcmVjZWl2ZXJJZCkgfHxcbiAgICAgICAgICAgIChtLnNlbmRlcklkID09PSByZWNlaXZlcklkICYmIG0ucmVjZWl2ZXJJZCA9PT0gc2VuZGVySWQpLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIFwiZ2V0TWVzc2FnZXNcIixcbiAgICApO1xuICB9LFxuXG4gIGFzeW5jIGNyZWF0ZU1lc3NhZ2UobXNnOiB7XG4gICAgc2VuZGVySWQ6IHN0cmluZztcbiAgICByZWNlaXZlcklkOiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIHRpbWU6IHN0cmluZztcbiAgICBpc1JlcXVlc3Q/OiBib29sZWFuO1xuICAgIHJlcXVlc3RUeXBlPzogc3RyaW5nO1xuICAgIHJlcXVlc3RTdGF0dXM/OiBzdHJpbmc7XG4gICAgcGhvdG9HcmFudEtpbmQ/OiBzdHJpbmc7XG4gICAgcGhvdG9BY3Rpb24/OiBzdHJpbmc7XG4gIH0pOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT4gcC5tZXNzYWdlLmNyZWF0ZSh7IGRhdGE6IG1zZyB9KSBhcyBQcm9taXNlPGFueT4sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcbiAgICAgICAgY29uc3QgbmV3TXNnID0ge1xuICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpLFxuICAgICAgICAgIC4uLm1zZyxcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgfTtcbiAgICAgICAgZGF0YS5tZXNzYWdlcy5wdXNoKG5ld01zZyk7XG4gICAgICAgIHdyaXRlRmFsbGJhY2soZGF0YSk7XG4gICAgICAgIHJldHVybiBuZXdNc2c7XG4gICAgICB9LFxuICAgICAgXCJjcmVhdGVNZXNzYWdlXCIsXG4gICAgKTtcbiAgfSxcblxuICBhc3luYyB1cGRhdGVNZXNzYWdlUmVxdWVzdFN0YXR1cyhtZXNzYWdlSWQ6IHN0cmluZywgc3RhdHVzOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT5cbiAgICAgICAgcC5tZXNzYWdlLnVwZGF0ZSh7XG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IG1lc3NhZ2VJZCB9LFxuICAgICAgICAgIGRhdGE6IHsgcmVxdWVzdFN0YXR1czogc3RhdHVzIH0sXG4gICAgICAgIH0pIGFzIFByb21pc2U8YW55PixcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xuICAgICAgICBjb25zdCBtc2cgPSBkYXRhLm1lc3NhZ2VzLmZpbmQoKG06IGFueSkgPT4gbS5pZCA9PT0gbWVzc2FnZUlkKTtcbiAgICAgICAgaWYgKG1zZykge1xuICAgICAgICAgIG1zZy5yZXF1ZXN0U3RhdHVzID0gc3RhdHVzO1xuICAgICAgICAgIHdyaXRlRmFsbGJhY2soZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICAgIH0sXG4gICAgICBcInVwZGF0ZU1lc3NhZ2VSZXF1ZXN0U3RhdHVzXCIsXG4gICAgKTtcbiAgfSxcblxuICAvLyAtLS0gRE9DVU1FTlRTIC0tLVxuICBhc3luYyBnZXREb2N1bWVudHModXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgY29uc3QgcGFyc2VSZWRhY3RlZCA9ICh2YWx1ZTogYW55KTogc3RyaW5nW10gPT4ge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocGFyc2VkKSA/IHBhcnNlZCA6IFtdO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9O1xuICAgIGNvbnN0IHBhcnNlSnNvbkZpZWxkID0gKHZhbHVlOiBhbnkpOiBhbnkgPT4ge1xuICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA/PyBudWxsO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHJ1bldpdGhEYihcbiAgICAgIGFzeW5jIChwKSA9PiB7XG4gICAgICAgIGNvbnN0IGRvY3MgPSAoYXdhaXQgcC5kb2N1bWVudC5maW5kTWFueSh7IHdoZXJlOiB7IHVzZXJJZCB9IH0pKSBhcyBhbnlbXTtcbiAgICAgICAgcmV0dXJuIGRvY3MubWFwKChkKSA9PiAoe1xuICAgICAgICAgIC4uLmQsXG4gICAgICAgICAgcmVkYWN0ZWRGaWVsZHM6IHBhcnNlUmVkYWN0ZWQoZC5yZWRhY3RlZEZpZWxkcyksXG4gICAgICAgICAgLy8gU3RvcmVkIGFzIGEgSlNPTiBzdHJpbmcgc2NhbGFyIGluIFBvc3RncmVzOyBvYmplY3QgaW4gZmFsbGJhY2suXG4gICAgICAgICAgZG5hUHJvZmlsZTogcGFyc2VKc29uRmllbGQoZC5kbmFQcm9maWxlKSxcbiAgICAgICAgfSkpO1xuICAgICAgfSxcbiAgICAgICgpID0+IHJlYWRGYWxsYmFjaygpLmRvY3VtZW50cy5maWx0ZXIoKGQ6IGFueSkgPT4gZC51c2VySWQgPT09IHVzZXJJZCksXG4gICAgICBcImdldERvY3VtZW50c1wiLFxuICAgICk7XG4gIH0sXG5cbiAgYXN5bmMgY3JlYXRlRG9jdW1lbnQoZG9jOiB7XG4gICAgdXNlcklkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHNpemU6IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgdXBsb2FkRGF0ZTogc3RyaW5nO1xuICAgIGlzUmVkYWN0ZWQ6IGJvb2xlYW47XG4gICAgcmVkYWN0ZWRGaWVsZHM6IHN0cmluZ1tdO1xuICAgIHN0YXR1czogc3RyaW5nO1xuICAgIHJlc3VsdFRleHQ6IHN0cmluZztcbiAgICBkbmFQcm9maWxlPzogYW55O1xuICB9KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+XG4gICAgICAgIHAuZG9jdW1lbnQuY3JlYXRlKHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5kb2MsXG4gICAgICAgICAgICAvLyBQcmlzbWEgc2NoZW1hIHN0b3JlcyByZWRhY3RlZEZpZWxkcyBhcyBhIEpTT04gc3RyaW5nIHNjYWxhci5cbiAgICAgICAgICAgIHJlZGFjdGVkRmllbGRzOiBKU09OLnN0cmluZ2lmeShkb2MucmVkYWN0ZWRGaWVsZHMpLFxuICAgICAgICAgICAgLy8gYGRuYVByb2ZpbGVgIGlzIGEgcmVxdWlyZWQgU3RyaW5nIGNvbHVtbiBob2xkaW5nIEpTT04gKG9yIFwibnVsbFwiKS5cbiAgICAgICAgICAgIGRuYVByb2ZpbGU6IEpTT04uc3RyaW5naWZ5KGRvYy5kbmFQcm9maWxlID8/IG51bGwpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pIGFzIFByb21pc2U8YW55PixcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xuICAgICAgICBjb25zdCBuZXdEb2MgPSB7XG4gICAgICAgICAgaWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMSksXG4gICAgICAgICAgLi4uZG9jLFxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgICBkYXRhLmRvY3VtZW50cy5wdXNoKG5ld0RvYyk7XG4gICAgICAgIHdyaXRlRmFsbGJhY2soZGF0YSk7XG4gICAgICAgIHJldHVybiBuZXdEb2M7XG4gICAgICB9LFxuICAgICAgXCJjcmVhdGVEb2N1bWVudFwiLFxuICAgICk7XG4gIH0sXG5cbiAgLy8gLS0tIE5PTkNFUyAtLS1cbiAgYXN5bmMgY3JlYXRlTm9uY2Uobm9uY2U6IHN0cmluZywgYWRkcmVzczogc3RyaW5nLCBleHBpcmVzQXQ6IERhdGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT4gKHAgYXMgYW55KS5ub25jZS5jcmVhdGUoeyBkYXRhOiB7IG5vbmNlLCBhZGRyZXNzLCBleHBpcmVzQXQgfSB9KSBhcyBQcm9taXNlPGFueT4sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcbiAgICAgICAgaWYgKCFkYXRhLm5vbmNlcykgZGF0YS5ub25jZXMgPSBbXTtcbiAgICAgICAgY29uc3QgbmV3Tm9uY2UgPSB7XG4gICAgICAgICAgaWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMSksXG4gICAgICAgICAgbm9uY2UsXG4gICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICBleHBpcmVzQXQ6IGV4cGlyZXNBdC50b0lTT1N0cmluZygpLFxuICAgICAgICAgIHVzZWQ6IGZhbHNlLFxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB9O1xuICAgICAgICBkYXRhLm5vbmNlcy5wdXNoKG5ld05vbmNlKTtcbiAgICAgICAgd3JpdGVGYWxsYmFjayhkYXRhKTtcbiAgICAgICAgcmV0dXJuIG5ld05vbmNlO1xuICAgICAgfSxcbiAgICAgIFwiY3JlYXRlTm9uY2VcIixcbiAgICApO1xuICB9LFxuXG4gIGFzeW5jIGdldE5vbmNlKG5vbmNlOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBydW5XaXRoRGIoXG4gICAgICBhc3luYyAocCkgPT4gKHAgYXMgYW55KS5ub25jZS5maW5kRmlyc3QoeyB3aGVyZTogeyBub25jZSB9IH0pIGFzIFByb21pc2U8YW55PixcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlYWRGYWxsYmFjaygpO1xuICAgICAgICBpZiAoIWRhdGEubm9uY2VzKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIGRhdGEubm9uY2VzLmZpbmQoKG46IGFueSkgPT4gbi5ub25jZSA9PT0gbm9uY2UpIHx8IG51bGw7XG4gICAgICB9LFxuICAgICAgXCJnZXROb25jZVwiLFxuICAgICk7XG4gIH0sXG5cbiAgYXN5bmMgbWFya05vbmNlVXNlZChub25jZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgcnVuV2l0aERiKFxuICAgICAgYXN5bmMgKHApID0+IChwIGFzIGFueSkubm9uY2UudXBkYXRlKHsgd2hlcmU6IHsgbm9uY2UgfSwgZGF0YTogeyB1c2VkOiB0cnVlIH0gfSksXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSByZWFkRmFsbGJhY2soKTtcbiAgICAgICAgaWYgKCFkYXRhLm5vbmNlcykgcmV0dXJuO1xuICAgICAgICBjb25zdCBuID0gZGF0YS5ub25jZXMuZmluZCgobjogYW55KSA9PiBuLm5vbmNlID09PSBub25jZSk7XG4gICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgbi51c2VkID0gdHJ1ZTtcbiAgICAgICAgICB3cml0ZUZhbGxiYWNrKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJtYXJrTm9uY2VVc2VkXCIsXG4gICAgKTtcbiAgfSxcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXENGQ1xcXFxhcHBzXFxcXHdlYlxcXFxzcmNcXFxcbGliXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGxpYlxcXFxhcGlTZXJ2ZXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0NGQy9hcHBzL3dlYi9zcmMvbGliL2FwaVNlcnZlci50c1wiO2ltcG9ydCB7IEluY29taW5nTWVzc2FnZSwgU2VydmVyUmVzcG9uc2UgfSBmcm9tIFwiaHR0cFwiO1xuaW1wb3J0IHsgZGJTZXJ2aWNlIH0gZnJvbSBcIi4vZGJcIjtcbmltcG9ydCB7IGdlbmVyYXRlTm9uY2UsIFNpd2VNZXNzYWdlIH0gZnJvbSBcInNpd2VcIjtcbmltcG9ydCB7IHBhcnNlIGFzIHBhcnNlVXJsIH0gZnJvbSBcInVybFwiO1xuXG5pbXBvcnQgeyBXZWJTb2NrZXRTZXJ2ZXIsIFdlYlNvY2tldCB9IGZyb20gXCJ3c1wiO1xuaW1wb3J0IHsga3YgfSBmcm9tIFwiLi9rdlwiO1xuaW1wb3J0IHtcbiAgRkFVQ0VUX0FNT1VOVF9UT0tFTlMsXG4gIGlzQWRtaW5Db25maWd1cmVkLFxuICBtaW50RXZvbHZlLFxuICByZWxheURuYVJldm9rZSxcbiAgcmVsYXlEbmFWZXJpZnksXG59IGZyb20gXCIuL2FkbWluQ2hhaW5cIjtcblxuLy8gLS0tIFdlYlNvY2tldCBDaGF0IFNlcnZlciAtLS1cbmludGVyZmFjZSBXc0NsaWVudCB7XG4gIHdzOiBXZWJTb2NrZXQ7XG4gIHVzZXJJZDogc3RyaW5nO1xuICB1c2VybmFtZTogc3RyaW5nO1xufVxuXG5jb25zdCB3c0NsaWVudHMgPSBuZXcgTWFwPHN0cmluZywgV3NDbGllbnRbXT4oKTsgLy8gY2hhbm5lbElkIC0+IGNsaWVudHNcblxuZnVuY3Rpb24gY3JlYXRlQ2hhbm5lbElkKHVzZXJJZDE6IHN0cmluZywgdXNlcklkMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFt1c2VySWQxLCB1c2VySWQyXS5zb3J0KCkuam9pbihcIjpcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cFdlYlNvY2tldFNlcnZlcihzZXJ2ZXI6IGFueSkge1xuICBjb25zdCB3c3MgPSBuZXcgV2ViU29ja2V0U2VydmVyKHsgc2VydmVyLCBwYXRoOiBcIi93c1wiIH0pO1xuXG4gIHdzcy5vbihcImNvbm5lY3Rpb25cIiwgKHdzOiBXZWJTb2NrZXQpID0+IHtcbiAgICBsZXQgdXNlcklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgdXNlcm5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCBjaGFubmVsSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gICAgd3Mub24oXCJtZXNzYWdlXCIsIChkYXRhOiBCdWZmZXIpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04ucGFyc2UoZGF0YS50b1N0cmluZygpKTtcblxuICAgICAgICBpZiAobXNnLnR5cGUgPT09IFwiam9pblwiKSB7XG4gICAgICAgICAgdXNlcklkID0gbXNnLnVzZXJJZDtcbiAgICAgICAgICB1c2VybmFtZSA9IG1zZy51c2VybmFtZSB8fCBcIkFub255bW91c1wiO1xuICAgICAgICAgIGNoYW5uZWxJZCA9IGNyZWF0ZUNoYW5uZWxJZChtc2cudXNlcklkLCBtc2cudGFyZ2V0VXNlcklkKTtcblxuICAgICAgICAgIGlmICghd3NDbGllbnRzLmhhcyhjaGFubmVsSWQpKSB7XG4gICAgICAgICAgICB3c0NsaWVudHMuc2V0KGNoYW5uZWxJZCwgW10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3c0NsaWVudHMuZ2V0KGNoYW5uZWxJZCkhLnB1c2goeyB3cywgdXNlcklkOiB1c2VySWQhLCB1c2VybmFtZTogdXNlcm5hbWUhIH0pO1xuXG4gICAgICAgICAgd3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwiam9pbmVkXCIsIGNoYW5uZWxJZCB9KSk7XG4gICAgICAgICAgYnJvYWRjYXN0VG9DaGFubmVsKFxuICAgICAgICAgICAgY2hhbm5lbElkLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcInVzZXJfam9pbmVkXCIsXG4gICAgICAgICAgICAgIHVzZXJJZCxcbiAgICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3MsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gXCJtZXNzYWdlXCIgJiYgY2hhbm5lbElkICYmIHVzZXJJZCkge1xuICAgICAgICAgIGNvbnN0IGNoYXRNc2cgPSB7XG4gICAgICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIGlkOiBEYXRlLm5vdygpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBzZW5kZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgc2VuZGVyTmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICB0ZXh0OiBtc2cudGV4dCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBQZXJzaXN0IHRvIGRhdGFiYXNlXG4gICAgICAgICAgZGJTZXJ2aWNlLmNyZWF0ZU1lc3NhZ2Uoe1xuICAgICAgICAgICAgc2VuZGVySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIHJlY2VpdmVySWQ6IG1zZy50YXJnZXRVc2VySWQsXG4gICAgICAgICAgICB0ZXh0OiBtc2cudGV4dCxcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIGlzUmVxdWVzdDogZmFsc2UsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBicm9hZGNhc3RUb0NoYW5uZWwoY2hhbm5lbElkLCBjaGF0TXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gXCJ0eXBpbmdcIiAmJiBjaGFubmVsSWQgJiYgdXNlcklkKSB7XG4gICAgICAgICAgYnJvYWRjYXN0VG9DaGFubmVsKFxuICAgICAgICAgICAgY2hhbm5lbElkLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcInR5cGluZ1wiLFxuICAgICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdzLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIldlYlNvY2tldCBtZXNzYWdlIGVycm9yOlwiLCBlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdzLm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgaWYgKGNoYW5uZWxJZCAmJiB1c2VySWQpIHtcbiAgICAgICAgY29uc3QgY2xpZW50cyA9IHdzQ2xpZW50cy5nZXQoY2hhbm5lbElkKTtcbiAgICAgICAgaWYgKGNsaWVudHMpIHtcbiAgICAgICAgICBjb25zdCBpZHggPSBjbGllbnRzLmZpbmRJbmRleCgoYykgPT4gYy51c2VySWQgPT09IHVzZXJJZCk7XG4gICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJyb2FkY2FzdFRvQ2hhbm5lbChcbiAgICAgICAgICAgICAgY2hhbm5lbElkLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJ1c2VyX2xlZnRcIixcbiAgICAgICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNsaWVudHNbaWR4XS53cyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjbGllbnRzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2xpZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHdzQ2xpZW50cy5kZWxldGUoY2hhbm5lbElkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHdzcztcbn1cblxuZnVuY3Rpb24gYnJvYWRjYXN0VG9DaGFubmVsKGNoYW5uZWxJZDogc3RyaW5nLCBtZXNzYWdlOiBhbnksIGV4Y2x1ZGU/OiBXZWJTb2NrZXQpIHtcbiAgY29uc3QgY2xpZW50cyA9IHdzQ2xpZW50cy5nZXQoY2hhbm5lbElkKTtcbiAgaWYgKGNsaWVudHMpIHtcbiAgICBjb25zdCBkYXRhID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG4gICAgY2xpZW50cy5mb3JFYWNoKChjbGllbnQpID0+IHtcbiAgICAgIGlmIChjbGllbnQud3MucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0Lk9QRU4gJiYgY2xpZW50LndzICE9PSBleGNsdWRlKSB7XG4gICAgICAgIGNsaWVudC53cy5zZW5kKGRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8vIC0tLSBSYXRlIExpbWl0ZXIgKGluLW1lbW9yeSkgLS0tXG5pbnRlcmZhY2UgUmF0ZUxpbWl0RW50cnkge1xuICBjb3VudDogbnVtYmVyO1xuICByZXNldEF0OiBudW1iZXI7XG59XG5cbmNvbnN0IHJhdGVMaW1pdFN0b3JlID0gbmV3IE1hcDxzdHJpbmcsIFJhdGVMaW1pdEVudHJ5PigpO1xuY29uc3QgUkFURV9MSU1JVF9XSU5ET1dfTVMgPSA2MCAqIDEwMDA7IC8vIDEgbWludXRlXG5jb25zdCBSQVRFX0xJTUlUX01BWF9SRVFVRVNUUyA9IDMwOyAvLyBwZXIgd2luZG93XG5cbmZ1bmN0aW9uIGdldENsaWVudElwKHJlcTogSW5jb21pbmdNZXNzYWdlKTogc3RyaW5nIHtcbiAgcmV0dXJuIChyZXEuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXSBhcyBzdHJpbmcpPy5zcGxpdChcIixcIilbMF0/LnRyaW0oKSB8fCBcIjEyNy4wLjAuMVwiO1xufVxuXG5mdW5jdGlvbiBpc1JhdGVMaW1pdGVkKHJlcTogSW5jb21pbmdNZXNzYWdlKTogYm9vbGVhbiB7XG4gIGNvbnN0IGlwID0gZ2V0Q2xpZW50SXAocmVxKTtcbiAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgZW50cnkgPSByYXRlTGltaXRTdG9yZS5nZXQoaXApO1xuXG4gIGlmICghZW50cnkgfHwgbm93ID4gZW50cnkucmVzZXRBdCkge1xuICAgIHJhdGVMaW1pdFN0b3JlLnNldChpcCwgeyBjb3VudDogMSwgcmVzZXRBdDogbm93ICsgUkFURV9MSU1JVF9XSU5ET1dfTVMgfSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZW50cnkuY291bnQrKztcbiAgaWYgKGVudHJ5LmNvdW50ID4gUkFURV9MSU1JVF9NQVhfUkVRVUVTVFMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIENsZWFuIHVwIGV4cGlyZWQgZW50cmllcyBldmVyeSA1IG1pbnV0ZXNcbnNldEludGVydmFsKFxuICAoKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBmb3IgKGNvbnN0IFtpcCwgZW50cnldIG9mIHJhdGVMaW1pdFN0b3JlLmVudHJpZXMoKSkge1xuICAgICAgaWYgKG5vdyA+IGVudHJ5LnJlc2V0QXQpIHtcbiAgICAgICAgcmF0ZUxpbWl0U3RvcmUuZGVsZXRlKGlwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIDUgKiA2MCAqIDEwMDAsXG4pO1xuXG4vLyBTaW1wbGUgaW4tbWVtb3J5IHNlc3Npb24gc3RvcmVcbmNvbnN0IHNlc3Npb25zOiBSZWNvcmQ8c3RyaW5nLCB7IHVzZXJJZDogc3RyaW5nOyBldGhBZGRyZXNzPzogc3RyaW5nOyBlbWFpbD86IHN0cmluZyB9PiA9IHt9O1xuXG5mdW5jdGlvbiBzaW1wbGVIYXNoKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGhhc2ggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoYXIgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgY2hhcjtcbiAgICBoYXNoID0gaGFzaCAmIGhhc2g7XG4gIH1cbiAgcmV0dXJuIE1hdGguYWJzKGhhc2gpLnRvU3RyaW5nKDE2KTtcbn1cblxuLy8gSGVscGVyIHRvIHBhcnNlIEpTT04gYm9keSBmcm9tIHJlcXVlc3RcbmZ1bmN0aW9uIGdldEpzb25Cb2R5KHJlcTogSW5jb21pbmdNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKFwiZGF0YVwiLCAoY2h1bmspID0+IHtcbiAgICAgIGJvZHkgKz0gY2h1bms7XG4gICAgfSk7XG4gICAgcmVxLm9uKFwiZW5kXCIsICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmUoYm9keSA/IEpTT04ucGFyc2UoYm9keSkgOiB7fSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXEub24oXCJlcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIEhlbHBlciB0byBwYXJzZSBjb29raWVzXG5mdW5jdGlvbiBwYXJzZUNvb2tpZXMocmVxOiBJbmNvbWluZ01lc3NhZ2UpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgbGlzdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBjb29raWVIZWFkZXIgPSByZXEuaGVhZGVycy5jb29raWU7XG4gIGlmIChjb29raWVIZWFkZXIpIHtcbiAgICBjb29raWVIZWFkZXIuc3BsaXQoXCI7XCIpLmZvckVhY2goKGNvb2tpZSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBjb29raWUuc3BsaXQoXCI9XCIpO1xuICAgICAgbGlzdFtwYXJ0c1swXS50cmltKCldID0gZGVjb2RlVVJJQ29tcG9uZW50KChwYXJ0c1sxXSB8fCBcIlwiKS50cmltKCkpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBsaXN0O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlQXBpUmVxdWVzdChcbiAgcmVxOiBJbmNvbWluZ01lc3NhZ2UsXG4gIHJlczogU2VydmVyUmVzcG9uc2UsXG4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3QgcGFyc2VkVXJsID0gcGFyc2VVcmwocmVxLnVybCB8fCBcIlwiLCB0cnVlKTtcbiAgY29uc3QgcGF0aG5hbWUgPSBwYXJzZWRVcmwucGF0aG5hbWUgfHwgXCJcIjtcblxuICBpZiAoIXBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvYXBpXCIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gU2V0IGRlZmF1bHQgQ09SUyBhbmQgSlNPTiBoZWFkZXJzXG4gIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICByZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsIFwiKlwiKTtcbiAgcmVzLnNldEhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIiwgXCJHRVQsIFBPU1QsIFBVVCwgREVMRVRFLCBPUFRJT05TXCIpO1xuICByZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiLCBcIkNvbnRlbnQtVHlwZSwgQXV0aG9yaXphdGlvblwiKTtcblxuICBpZiAocmVxLm1ldGhvZCA9PT0gXCJPUFRJT05TXCIpIHtcbiAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBSYXRlIGxpbWl0aW5nXG4gIGlmIChpc1JhdGVMaW1pdGVkKHJlcSkpIHtcbiAgICByZXMuc3RhdHVzQ29kZSA9IDQyOTtcbiAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiVG9vIG1hbnkgcmVxdWVzdHMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXCIgfSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBjb29raWVzID0gcGFyc2VDb29raWVzKHJlcSk7XG4gICAgbGV0IHNlc3Npb25JZCA9IGNvb2tpZXNbXCJzaXdlX3Nlc3Npb25cIl0gfHwgY29va2llc1tcImVtYWlsX3Nlc3Npb25cIl07XG5cbiAgICAvLyBTdXBwb3J0IFNlc3Npb24gSUQgaW4gQXV0aG9yaXphdGlvbiBoZWFkZXIgYXMgd2VsbFxuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgIGlmIChhdXRoSGVhZGVyICYmIGF1dGhIZWFkZXIuc3RhcnRzV2l0aChcIkJlYXJlciBcIikpIHtcbiAgICAgIHNlc3Npb25JZCA9IGF1dGhIZWFkZXIuc3Vic3RyaW5nKDcpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlc3Npb24gPSBzZXNzaW9uSWQgPyBzZXNzaW9uc1tzZXNzaW9uSWRdIDogbnVsbDtcblxuICAgIC8vIC0tLSAxLiBTSVdFIEFVVEggRU5EUE9JTlRTIC0tLVxuXG4gICAgLy8gR0VUIC9hcGkvYXV0aC9zaXdlL25vbmNlXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvYXV0aC9zaXdlL25vbmNlXCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgY29uc3Qgbm9uY2UgPSBnZW5lcmF0ZU5vbmNlKCk7XG4gICAgICBjb25zdCBhZGRyZXNzID1cbiAgICAgICAgKHBhcnNlZFVybC5xdWVyeS5hZGRyZXNzIGFzIHN0cmluZykgfHwgXCIweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBcIjtcbiAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IG5ldyBEYXRlKERhdGUubm93KCkgKyA1ICogNjAgKiAxMDAwKTsgLy8gNSBtaW51dGVzXG5cbiAgICAgIGF3YWl0IGRiU2VydmljZS5jcmVhdGVOb25jZShub25jZSwgYWRkcmVzcy50b0xvd2VyQ2FzZSgpLCBleHBpcmVzQXQpO1xuXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBub25jZSB9KSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBQT1NUIC9hcGkvYXV0aC9zaXdlL3ZlcmlmeVxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2F1dGgvc2l3ZS92ZXJpZnlcIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGdldEpzb25Cb2R5KHJlcSk7XG4gICAgICBjb25zdCB7IG1lc3NhZ2UsIHNpZ25hdHVyZSB9ID0gYm9keTtcblxuICAgICAgY29uc3Qgc2l3ZU1lc3NhZ2UgPSBuZXcgU2l3ZU1lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgIC8vIFZlcmlmeSBub25jZSBpcyB2YWxpZCBhbmQgbm90IGV4cGlyZWRcbiAgICAgIGNvbnN0IG5vbmNlUmVjb3JkID0gYXdhaXQgZGJTZXJ2aWNlLmdldE5vbmNlKHNpd2VNZXNzYWdlLm5vbmNlKTtcbiAgICAgIGlmICghbm9uY2VSZWNvcmQgfHwgbm9uY2VSZWNvcmQudXNlZCB8fCBuZXcgRGF0ZShub25jZVJlY29yZC5leHBpcmVzQXQpIDwgbmV3IERhdGUoKSkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb25jZSBpcyBpbnZhbGlkIG9yIGV4cGlyZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZmljYXRpb24gPSBhd2FpdCBzaXdlTWVzc2FnZS52ZXJpZnkoeyBzaWduYXR1cmUgfSk7XG5cbiAgICAgIGlmICh2ZXJpZmljYXRpb24uc3VjY2Vzcykge1xuICAgICAgICAvLyBNYXJrIG5vbmNlIGFzIHVzZWRcbiAgICAgICAgYXdhaXQgZGJTZXJ2aWNlLm1hcmtOb25jZVVzZWQoc2l3ZU1lc3NhZ2Uubm9uY2UpO1xuXG4gICAgICAgIGNvbnN0IGV0aEFkZHJlc3MgPSB2ZXJpZmljYXRpb24uZGF0YS5hZGRyZXNzLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgbGV0IHVzZXIgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0VXNlckJ5QWRkcmVzcyhldGhBZGRyZXNzKTtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgdXNlciA9IGF3YWl0IGRiU2VydmljZS5jcmVhdGVVc2VyKGV0aEFkZHJlc3MpO1xuICAgICAgICAgIGF3YWl0IGRiU2VydmljZS51cHNlcnRQcm9maWxlKHVzZXIuaWQsIHtcbiAgICAgICAgICAgIG5hbWU6IGBFdGhVc2VyLSR7ZXRoQWRkcmVzcy5zdWJzdHJpbmcoMiwgNil9YCxcbiAgICAgICAgICAgIGFnZTogMjUsXG4gICAgICAgICAgICBiaW86IFwiVm91Y2hlZCBtYXRjaCB1c2VyLlwiLFxuICAgICAgICAgICAgaW50ZXJlc3RzOiBbXCJFdGhlcmV1bVwiLCBcIldlYjNcIl0sXG4gICAgICAgICAgICBpbWFnZVVybDogXCJcIixcbiAgICAgICAgICAgIGFnZUhpZGRlbjogZmFsc2UsXG4gICAgICAgICAgICBsYW5ndWFnZXM6IFtdLFxuICAgICAgICAgICAgcGhvdG9CbHVycmVkOiBmYWxzZSxcbiAgICAgICAgICAgIHBob3RvR3JhbnRzOiB7fSxcbiAgICAgICAgICAgIG9uYm9hcmRpbmdDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgICAgICB2ZXJpZmllZFN0ZDogZmFsc2UsXG4gICAgICAgICAgICB2ZXJpZmllZERuYTogZmFsc2UsXG4gICAgICAgICAgICByZXB1dGF0aW9uU2NvcmU6IDUuMCxcbiAgICAgICAgICAgIHZvdGVyczogW10sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gV2VsY29tZSBmYXVjZXQ6IGZ1bmQgbmV3IHdhbGxldCB1c2VycyBzbyB0aGV5IGNhbiB1c2UgZ2lmdHMvRXZvbHZlRnVuZC5cbiAgICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQ6IG5ldmVyIGJsb2NrcyBsb2dpbi5cbiAgICAgICAgICBpZiAoaXNBZG1pbkNvbmZpZ3VyZWQoKSkge1xuICAgICAgICAgICAgbWludEV2b2x2ZShldGhBZGRyZXNzKVxuICAgICAgICAgICAgICAudGhlbigoKSA9PiBjb25zb2xlLmxvZyhgW2ZhdWNldF0gV2VsY29tZSBtaW50IHRvICR7ZXRoQWRkcmVzc31gKSlcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW2ZhdWNldF0gV2VsY29tZSBtaW50IGZhaWxlZCBmb3IgJHtldGhBZGRyZXNzfTpgLCBlcnIpLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1c2VyID0gYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJCeUFkZHJlc3MoZXRoQWRkcmVzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTZXNzaW9uSWQgPVxuICAgICAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSkgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpO1xuICAgICAgICBzZXNzaW9uc1tuZXdTZXNzaW9uSWRdID0geyB1c2VySWQ6IHVzZXIhLmlkLCBldGhBZGRyZXNzIH07XG5cbiAgICAgICAgcmVzLnNldEhlYWRlcihcIlNldC1Db29raWVcIiwgYHNpd2Vfc2Vzc2lvbj0ke25ld1Nlc3Npb25JZH07IFBhdGg9LzsgSHR0cE9ubHk7IFNhbWVTaXRlPUxheGApO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIHVzZXIsIHNlc3Npb25JZDogbmV3U2Vzc2lvbklkIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlZlcmlmaWNhdGlvbiBmYWlsZWRcIiB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBHRVQgL2FwaS9hdXRoL3Npd2Uvc2Vzc2lvblxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2F1dGgvc2l3ZS9zZXNzaW9uXCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgaWYgKHNlc3Npb24gJiYgc2Vzc2lvbi5ldGhBZGRyZXNzKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0VXNlckJ5QWRkcmVzcyhzZXNzaW9uLmV0aEFkZHJlc3MpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGF1dGhlbnRpY2F0ZWQ6IHRydWUsIHNlc3Npb24sIHVzZXIgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBhdXRoZW50aWNhdGVkOiBmYWxzZSB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBQT1NUIC9hcGkvYXV0aC9zaXdlL2xvZ291dFxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2F1dGgvc2l3ZS9sb2dvdXRcIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgaWYgKHNlc3Npb25JZCAmJiBzZXNzaW9uc1tzZXNzaW9uSWRdKSB7XG4gICAgICAgIGRlbGV0ZSBzZXNzaW9uc1tzZXNzaW9uSWRdO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIlNldC1Db29raWVcIiwgXCJzaXdlX3Nlc3Npb249OyBQYXRoPS87IEV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVRcIik7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiB0cnVlIH0pKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIC0tLSAyLiBFTUFJTCBBVVRIIEVORFBPSU5UUyAtLS1cblxuICAgIC8vIFBPU1QgL2FwaS9hdXRoL2VtYWlsL3NlbmQtdmVyaWZpY2F0aW9uXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvYXV0aC9lbWFpbC9zZW5kLXZlcmlmaWNhdGlvblwiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHsgZW1haWwgfSA9IGJvZHk7XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkVtYWlsIHJlcXVpcmVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gR2VuZXJhdGUgNi1kaWdpdCBjb2RlXG4gICAgICBjb25zdCBjb2RlID0gTWF0aC5mbG9vcigxMDAwMDAgKyBNYXRoLnJhbmRvbSgpICogOTAwMDAwKS50b1N0cmluZygpO1xuICAgICAgYXdhaXQga3Yuc2V0KFxuICAgICAgICBgZW1haWxvdHA6JHtlbWFpbC50b0xvd2VyQ2FzZSgpfWAsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgY29kZSwgZXhwaXJlczogRGF0ZS5ub3coKSArIDEwICogNjAgKiAxMDAwIH0pLFxuICAgICAgICAxMCAqIDYwICogMTAwMCxcbiAgICAgICk7XG5cbiAgICAgIC8vIEluIHByb2R1Y3Rpb24sIHNlbmQgZW1haWwgaGVyZSAoZS5nLiwgdmlhIFNlbmRHcmlkLCBSZXNlbmQsIGV0Yy4pXG4gICAgICBjb25zb2xlLmxvZyhgW0RFVl0gRW1haWwgdmVyaWZpY2F0aW9uIGNvZGUgZm9yICR7ZW1haWx9OiAke2NvZGV9YCk7XG5cbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIGV4cGlyZXNJbjogNjAwIH0pKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFBPU1QgL2FwaS9hdXRoL2VtYWlsL3ZlcmlmeS1jb2RlXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvYXV0aC9lbWFpbC92ZXJpZnktY29kZVwiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHsgZW1haWwsIGNvZGUgfSA9IGJvZHk7XG4gICAgICBpZiAoIWVtYWlsIHx8ICFjb2RlKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkVtYWlsIGFuZCBjb2RlIHJlcXVpcmVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmF3ID0gYXdhaXQga3YuZ2V0KGBlbWFpbG90cDoke2VtYWlsLnRvTG93ZXJDYXNlKCl9YCk7XG4gICAgICBsZXQgZW50cnk6IHsgY29kZTogc3RyaW5nOyBleHBpcmVzOiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xuICAgICAgaWYgKHJhdykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGVudHJ5ID0gSlNPTi5wYXJzZShyYXcpIGFzIHsgY29kZTogc3RyaW5nOyBleHBpcmVzOiBudW1iZXIgfTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgZW50cnkgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWVudHJ5IHx8IGVudHJ5LmNvZGUgIT09IGNvZGUgfHwgRGF0ZS5ub3coKSA+IGVudHJ5LmV4cGlyZXMpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiSU5WQUxJRF9DT0RFXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRGVsZXRlIHVzZWQgY29kZVxuICAgICAgYXdhaXQga3YuZGVsKGBlbWFpbG90cDoke2VtYWlsLnRvTG93ZXJDYXNlKCl9YCk7XG5cbiAgICAgIC8vIEZpbmQgb3IgY3JlYXRlIHVzZXJcbiAgICAgIGxldCB1c2VyID0gYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJCeUVtYWlsKGVtYWlsKTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICB1c2VyID0gYXdhaXQgZGJTZXJ2aWNlLmNyZWF0ZVVzZXJXaXRoRW1haWwoZW1haWwsIFwiXCIpO1xuICAgICAgICBhd2FpdCBkYlNlcnZpY2UudXBzZXJ0UHJvZmlsZSh1c2VyLmlkLCB7XG4gICAgICAgICAgbmFtZTogZW1haWwuc3BsaXQoXCJAXCIpWzBdLFxuICAgICAgICAgIGFnZTogMjUsXG4gICAgICAgICAgYmlvOiBcIk5ldyBFdm9sdmUgbWVtYmVyLlwiLFxuICAgICAgICAgIGludGVyZXN0czogW10sXG4gICAgICAgICAgaW1hZ2VVcmw6IFwiXCIsXG4gICAgICAgICAgYWdlSGlkZGVuOiBmYWxzZSxcbiAgICAgICAgICBsYW5ndWFnZXM6IFtdLFxuICAgICAgICAgIHBob3RvQmx1cnJlZDogZmFsc2UsXG4gICAgICAgICAgcGhvdG9HcmFudHM6IHt9LFxuICAgICAgICAgIG9uYm9hcmRpbmdDb21wbGV0ZTogZmFsc2UsXG4gICAgICAgICAgdmVyaWZpZWRTdGQ6IGZhbHNlLFxuICAgICAgICAgIHZlcmlmaWVkRG5hOiBmYWxzZSxcbiAgICAgICAgICByZXB1dGF0aW9uU2NvcmU6IDUuMCxcbiAgICAgICAgICB2b3RlcnM6IFtdLFxuICAgICAgICB9KTtcbiAgICAgICAgdXNlciA9IGF3YWl0IGRiU2VydmljZS5nZXRVc2VyQnlFbWFpbChlbWFpbCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld1Nlc3Npb25JZCA9XG4gICAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSkgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpO1xuICAgICAgc2Vzc2lvbnNbbmV3U2Vzc2lvbklkXSA9IHsgdXNlcklkOiB1c2VyIS5pZCwgZW1haWwgfTtcblxuICAgICAgcmVzLnNldEhlYWRlcihcIlNldC1Db29raWVcIiwgYGVtYWlsX3Nlc3Npb249JHtuZXdTZXNzaW9uSWR9OyBQYXRoPS87IEh0dHBPbmx5OyBTYW1lU2l0ZT1MYXhgKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIHVzZXIsIHNlc3Npb25JZDogbmV3U2Vzc2lvbklkIH0pKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFBPU1QgL2FwaS9hdXRoL2VtYWlsL3JlZ2lzdGVyXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvYXV0aC9lbWFpbC9yZWdpc3RlclwiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSBib2R5O1xuICAgICAgaWYgKCFlbWFpbCB8fCAhcGFzc3dvcmQpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJFbWFpbCBhbmQgcGFzc3dvcmQgcmVxdWlyZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGRiU2VydmljZS5nZXRVc2VyQnlFbWFpbChlbWFpbCk7XG4gICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJVc2VyIGFscmVhZHkgZXhpc3RzXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFzc3dvcmRIYXNoID0gc2ltcGxlSGFzaChwYXNzd29yZCk7XG4gICAgICBsZXQgdXNlciA9IGF3YWl0IGRiU2VydmljZS5jcmVhdGVVc2VyV2l0aEVtYWlsKGVtYWlsLCBwYXNzd29yZEhhc2gpO1xuICAgICAgYXdhaXQgZGJTZXJ2aWNlLnVwc2VydFByb2ZpbGUodXNlci5pZCwge1xuICAgICAgICBuYW1lOiBlbWFpbC5zcGxpdChcIkBcIilbMF0sXG4gICAgICAgIGFnZTogMjUsXG4gICAgICAgIGJpbzogXCJOZXcgRXZvbHZlIG1lbWJlci5cIixcbiAgICAgICAgaW50ZXJlc3RzOiBbXSxcbiAgICAgICAgaW1hZ2VVcmw6IFwiXCIsXG4gICAgICAgIGFnZUhpZGRlbjogZmFsc2UsXG4gICAgICAgIGxhbmd1YWdlczogW10sXG4gICAgICAgIHBob3RvQmx1cnJlZDogZmFsc2UsXG4gICAgICAgIHBob3RvR3JhbnRzOiB7fSxcbiAgICAgICAgb25ib2FyZGluZ0NvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgdmVyaWZpZWRTdGQ6IGZhbHNlLFxuICAgICAgICB2ZXJpZmllZERuYTogZmFsc2UsXG4gICAgICAgIHJlcHV0YXRpb25TY29yZTogNS4wLFxuICAgICAgICB2b3RlcnM6IFtdLFxuICAgICAgfSk7XG5cbiAgICAgIHVzZXIgPSAoYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJCeUVtYWlsKGVtYWlsKSkgfHwgdXNlcjtcblxuICAgICAgY29uc3QgbmV3U2Vzc2lvbklkID1cbiAgICAgICAgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxNSk7XG4gICAgICBzZXNzaW9uc1tuZXdTZXNzaW9uSWRdID0geyB1c2VySWQ6IHVzZXIuaWQsIGVtYWlsIH07XG5cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJTZXQtQ29va2llXCIsIGBlbWFpbF9zZXNzaW9uPSR7bmV3U2Vzc2lvbklkfTsgUGF0aD0vOyBIdHRwT25seTsgU2FtZVNpdGU9TGF4YCk7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiB0cnVlLCB1c2VyLCBzZXNzaW9uSWQ6IG5ld1Nlc3Npb25JZCB9KSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBQT1NUIC9hcGkvYXV0aC9lbWFpbC9sb2dpblxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2F1dGgvZW1haWwvbG9naW5cIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGdldEpzb25Cb2R5KHJlcSk7XG4gICAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gYm9keTtcbiAgICAgIGlmICghZW1haWwgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiRW1haWwgYW5kIHBhc3N3b3JkIHJlcXVpcmVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXNlciA9IGF3YWl0IGRiU2VydmljZS5nZXRVc2VyQnlFbWFpbChlbWFpbCk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDE7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJJbnZhbGlkIGNyZWRlbnRpYWxzXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFzc3dvcmRIYXNoID0gc2ltcGxlSGFzaChwYXNzd29yZCk7XG4gICAgICBpZiAodXNlci5wYXNzd29yZEhhc2ggIT09IHBhc3N3b3JkSGFzaCkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkludmFsaWQgY3JlZGVudGlhbHNcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdTZXNzaW9uSWQgPVxuICAgICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcbiAgICAgIHNlc3Npb25zW25ld1Nlc3Npb25JZF0gPSB7IHVzZXJJZDogdXNlci5pZCwgZW1haWwgfTtcblxuICAgICAgcmVzLnNldEhlYWRlcihcIlNldC1Db29raWVcIiwgYGVtYWlsX3Nlc3Npb249JHtuZXdTZXNzaW9uSWR9OyBQYXRoPS87IEh0dHBPbmx5OyBTYW1lU2l0ZT1MYXhgKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIHVzZXIsIHNlc3Npb25JZDogbmV3U2Vzc2lvbklkIH0pKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFBPU1QgL2FwaS9hdXRoL2VtYWlsL2xvZ291dFxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2F1dGgvZW1haWwvbG9nb3V0XCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICAgIGlmIChzZXNzaW9uSWQgJiYgc2Vzc2lvbnNbc2Vzc2lvbklkXSAmJiBzZXNzaW9uc1tzZXNzaW9uSWRdLmVtYWlsKSB7XG4gICAgICAgIGRlbGV0ZSBzZXNzaW9uc1tzZXNzaW9uSWRdO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIlNldC1Db29raWVcIiwgXCJlbWFpbF9zZXNzaW9uPTsgUGF0aD0vOyBFeHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UXCIpO1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogdHJ1ZSB9KSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBHRVQgL2FwaS9hdXRoL2VtYWlsL3Nlc3Npb25cbiAgICBpZiAocGF0aG5hbWUgPT09IFwiL2FwaS9hdXRoL2VtYWlsL3Nlc3Npb25cIiAmJiByZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICBpZiAoc2Vzc2lvbiAmJiBzZXNzaW9uLmVtYWlsKSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0VXNlckJ5RW1haWwoc2Vzc2lvbi5lbWFpbCk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgYXV0aGVudGljYXRlZDogdHJ1ZSwgc2Vzc2lvbiwgdXNlciB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGF1dGhlbnRpY2F0ZWQ6IGZhbHNlIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIC0tLSAzLiBVU0VSUyAmIFBST0ZJTEVTIEVORFBPSU5UUyAtLS1cblxuICAgIC8vIEdFVCAvYXBpL3VzZXJzXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvdXNlcnNcIiAmJiByZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICBjb25zdCB1c2VycyA9IGF3YWl0IGRiU2VydmljZS5nZXRVc2VycygpO1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHVzZXJzKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBHRVQgL2FwaS9wcm9maWxlc1xuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL3Byb2ZpbGVzXCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgY29uc3QgcHJvZmlsZXMgPSBhd2FpdCBkYlNlcnZpY2UuZ2V0UHJvZmlsZXMoKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShwcm9maWxlcykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gR0VUIC9hcGkvc2VhcmNoL3Byb2ZpbGVzXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvc2VhcmNoL3Byb2ZpbGVzXCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgY29uc3QgeyBtb2RlLCBsaW1pdCwgb2Zmc2V0IH0gPSBwYXJzZWRVcmwucXVlcnk7XG4gICAgICBjb25zdCBsaW1pdE51bSA9IGxpbWl0ID8gcGFyc2VJbnQobGltaXQgYXMgc3RyaW5nKSA6IDEwO1xuICAgICAgY29uc3Qgb2Zmc2V0TnVtID0gb2Zmc2V0ID8gcGFyc2VJbnQob2Zmc2V0IGFzIHN0cmluZykgOiAwO1xuXG4gICAgICAvLyBHZXQgYWxsIHByb2ZpbGVzIHdpdGggdXNlcnNcbiAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJzKCk7XG4gICAgICBjb25zdCBhbGxQcm9maWxlcyA9IHVzZXJzXG4gICAgICAgIC5maWx0ZXIoKHU6IGFueSkgPT4gdS5wcm9maWxlKVxuICAgICAgICAubWFwKCh1OiBhbnkpID0+ICh7XG4gICAgICAgICAgLi4udS5wcm9maWxlLFxuICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgIGlkOiB1LmlkLFxuICAgICAgICAgICAgZXRoQWRkcmVzczogdS5ldGhBZGRyZXNzLFxuICAgICAgICAgICAgZW1haWw6IHUuZW1haWwsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSkpO1xuXG4gICAgICAvLyBGaWx0ZXIgYnkgbW9kZSAoYmFzaWMgaW1wbGVtZW50YXRpb24pXG4gICAgICBsZXQgZmlsdGVyZWRQcm9maWxlcyA9IGFsbFByb2ZpbGVzO1xuICAgICAgaWYgKG1vZGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgLy8gTm9ybWFsIG1vZGU6IGZpbHRlciBieSBiYXNpYyBjcml0ZXJpYVxuICAgICAgICBmaWx0ZXJlZFByb2ZpbGVzID0gYWxsUHJvZmlsZXMuZmlsdGVyKChwOiBhbnkpID0+IHtcbiAgICAgICAgICAvLyBCYXNpYyBmaWx0ZXJpbmcgLSBjYW4gYmUgZW5oYW5jZWQgd2l0aCBhY3R1YWwgY3JpdGVyaWFcbiAgICAgICAgICByZXR1cm4gcC5yZXB1dGF0aW9uU2NvcmUgPj0gMDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFwicHJlZ25hbmN5LWJvbmRcIikge1xuICAgICAgICAvLyBQcmVnbmFuY3kgYm9uZCBtb2RlOiBmaWx0ZXIgZm9yIGZhbWlseS1vcmllbnRlZCBwcm9maWxlc1xuICAgICAgICBmaWx0ZXJlZFByb2ZpbGVzID0gYWxsUHJvZmlsZXMuZmlsdGVyKChwOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgcC5pbnRlcmVzdHMgJiZcbiAgICAgICAgICAgIHAuaW50ZXJlc3RzLnNvbWUoXG4gICAgICAgICAgICAgIChpOiBzdHJpbmcpID0+XG4gICAgICAgICAgICAgICAgaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwiZmFtaWx5XCIpIHx8XG4gICAgICAgICAgICAgICAgaS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwiY2hpbGRyZW5cIikgfHxcbiAgICAgICAgICAgICAgICBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJwYXJlbnRcIiksXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFwiY3J5cHRpYy1jaG9pY2VcIikge1xuICAgICAgICAvLyBDcnlwdGljIGNob2ljZSBtb2RlOiBmaWx0ZXIgZm9yIGFub255bW91cy9wcml2YWN5LWZvY3VzZWQgcHJvZmlsZXNcbiAgICAgICAgZmlsdGVyZWRQcm9maWxlcyA9IGFsbFByb2ZpbGVzLmZpbHRlcigocDogYW55KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHAuaW50ZXJlc3RzICYmXG4gICAgICAgICAgICBwLmludGVyZXN0cy5zb21lKFxuICAgICAgICAgICAgICAoaTogc3RyaW5nKSA9PlxuICAgICAgICAgICAgICAgIGkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcInByaXZhY3lcIikgfHxcbiAgICAgICAgICAgICAgICBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJhbm9ueW1vdXNcIikgfHxcbiAgICAgICAgICAgICAgICBpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoXCJjcnlwdG9cIiksXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNvcnQgYnkgcmVwdXRhdGlvbiBzY29yZSBERVNDXG4gICAgICBmaWx0ZXJlZFByb2ZpbGVzLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiBiLnJlcHV0YXRpb25TY29yZSAtIGEucmVwdXRhdGlvblNjb3JlKTtcblxuICAgICAgLy8gQXBwbHkgcGFnaW5hdGlvblxuICAgICAgY29uc3QgcGFnaW5hdGVkUHJvZmlsZXMgPSBmaWx0ZXJlZFByb2ZpbGVzLnNsaWNlKG9mZnNldE51bSwgb2Zmc2V0TnVtICsgbGltaXROdW0pO1xuXG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBwcm9maWxlczogcGFnaW5hdGVkUHJvZmlsZXMsXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkUHJvZmlsZXMubGVuZ3RoLFxuICAgICAgICAgIGxpbWl0OiBsaW1pdE51bSxcbiAgICAgICAgICBvZmZzZXQ6IG9mZnNldE51bSxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUE9TVCAvYXBpL3Byb2ZpbGVzL3Vwc2VydFxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL3Byb2ZpbGVzL3Vwc2VydFwiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDE7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGdldEpzb25Cb2R5KHJlcSk7XG4gICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgZGJTZXJ2aWNlLnVwc2VydFByb2ZpbGUoc2Vzc2lvbi51c2VySWQsIGJvZHkpO1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHByb2ZpbGUpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIC0tLSA0LiBNQVRDSEVTIEVORFBPSU5UUyAtLS1cblxuICAgIC8vIEdFVCAvYXBpL21hdGNoZXNcbiAgICBpZiAocGF0aG5hbWUgPT09IFwiL2FwaS9tYXRjaGVzXCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgY29uc3QgbWF0Y2hlcyA9IGF3YWl0IGRiU2VydmljZS5nZXRNYXRjaGVzKCk7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkobWF0Y2hlcykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUE9TVCAvYXBpL21hdGNoZXNcbiAgICBpZiAocGF0aG5hbWUgPT09IFwiL2FwaS9tYXRjaGVzXCIgJiYgcmVxLm1ldGhvZCA9PT0gXCJQT1NUXCIpIHtcbiAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMTtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIlVuYXV0aG9yaXplZFwiIH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcbiAgICAgIGNvbnN0IHsgbWF0Y2hlZFVzZXJJZCB9ID0gYm9keTtcbiAgICAgIGNvbnN0IG1hdGNoID0gYXdhaXQgZGJTZXJ2aWNlLmNyZWF0ZU1hdGNoKHNlc3Npb24udXNlcklkLCBtYXRjaGVkVXNlcklkKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShtYXRjaCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gLS0tIDUuIE1FU1NBR0VTIEVORFBPSU5UUyAtLS1cblxuICAgIC8vIEdFVCAvYXBpL21lc3NhZ2VzXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvbWVzc2FnZXNcIiAmJiByZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICBjb25zdCB7IHNlbmRlcklkLCByZWNlaXZlcklkIH0gPSBwYXJzZWRVcmwucXVlcnk7XG4gICAgICBpZiAoIXNlbmRlcklkIHx8ICFyZWNlaXZlcklkKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwic2VuZGVySWQgYW5kIHJlY2VpdmVySWQgYXJlIHJlcXVpcmVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgZGJTZXJ2aWNlLmdldE1lc3NhZ2VzKHNlbmRlcklkIGFzIHN0cmluZywgcmVjZWl2ZXJJZCBhcyBzdHJpbmcpO1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBQT1NUIC9hcGkvbWVzc2FnZXNcbiAgICBpZiAocGF0aG5hbWUgPT09IFwiL2FwaS9tZXNzYWdlc1wiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDE7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGdldEpzb25Cb2R5KHJlcSk7XG4gICAgICBpZiAoYm9keS5zZW5kZXJJZCAhPT0gc2Vzc2lvbi51c2VySWQpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDM7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJGb3JiaWRkZW46IHNlbmRlcklkIG11c3QgbWF0Y2ggc2Vzc2lvblwiIH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZGJTZXJ2aWNlLmNyZWF0ZU1lc3NhZ2UoYm9keSk7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUE9TVCAvYXBpL21lc3NhZ2VzL3N0YXR1c1xuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL21lc3NhZ2VzL3N0YXR1c1wiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDE7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGdldEpzb25Cb2R5KHJlcSk7XG4gICAgICBjb25zdCB7IG1lc3NhZ2VJZCwgc3RhdHVzIH0gPSBib2R5O1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IGRiU2VydmljZS51cGRhdGVNZXNzYWdlUmVxdWVzdFN0YXR1cyhtZXNzYWdlSWQsIHN0YXR1cyk7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gLS0tIDYuIERPQ1VNRU5UUyBFTkRQT0lOVFMgLS0tXG5cbiAgICAvLyBHRVQgL2FwaS9kb2N1bWVudHNcbiAgICBpZiAocGF0aG5hbWUgPT09IFwiL2FwaS9kb2N1bWVudHNcIiAmJiByZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgICBjb25zdCB7IHVzZXJJZCB9ID0gcGFyc2VkVXJsLnF1ZXJ5O1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJ1c2VySWQgaXMgcmVxdWlyZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gYXdhaXQgZGJTZXJ2aWNlLmdldERvY3VtZW50cyh1c2VySWQgYXMgc3RyaW5nKTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkb2N1bWVudHMpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFBPU1QgL2FwaS9kb2N1bWVudHNcbiAgICBpZiAocGF0aG5hbWUgPT09IFwiL2FwaS9kb2N1bWVudHNcIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAxO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBnZXRKc29uQm9keShyZXEpO1xuICAgICAgaWYgKGJvZHkudXNlcklkICE9PSBzZXNzaW9uLnVzZXJJZCkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMztcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkZvcmJpZGRlbjogdXNlcklkIG11c3QgbWF0Y2ggc2Vzc2lvblwiIH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCBkb2N1bWVudCA9IGF3YWl0IGRiU2VydmljZS5jcmVhdGVEb2N1bWVudChib2R5KTtcbiAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkb2N1bWVudCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gLS0tIFRPS0VOIEZBVUNFVCAoYWRtaW4gcmVsYXkpIC0tLVxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2ZhdWNldFwiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcbiAgICAgIGNvbnN0IGFkZHJlc3MgPSB0eXBlb2YgYm9keS5hZGRyZXNzID09PSBcInN0cmluZ1wiID8gYm9keS5hZGRyZXNzLnRvTG93ZXJDYXNlKCkgOiBcIlwiO1xuICAgICAgaWYgKCEvXjB4WzAtOWEtZl17NDB9JC8udGVzdChhZGRyZXNzKSkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIlZhbGlkIHdhbGxldCBhZGRyZXNzIHJlcXVpcmVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNBZG1pbkNvbmZpZ3VyZWQoKSkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMztcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkZhdWNldCBub3QgY29uZmlndXJlZCAoQURNSU5fUFJJVkFURV9LRVkgbWlzc2luZylcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gT25lIGNsYWltIHBlciBhZGRyZXNzLCBldmVyLlxuICAgICAgY29uc3QgZXhpc3RpbmdDbGFpbSA9IGF3YWl0IGt2LmdldChgZmF1Y2V0OiR7YWRkcmVzc31gKTtcbiAgICAgIGlmIChleGlzdGluZ0NsYWltKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDI5O1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiRmF1Y2V0IGFscmVhZHkgY2xhaW1lZFwiLCB0eEhhc2g6IGV4aXN0aW5nQ2xhaW0gfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHR4SGFzaCA9IGF3YWl0IG1pbnRFdm9sdmUoYWRkcmVzcyk7XG4gICAgICAgIGF3YWl0IGt2LnNldChgZmF1Y2V0OiR7YWRkcmVzc31gLCB0eEhhc2gpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIGFtb3VudDogRkFVQ0VUX0FNT1VOVF9UT0tFTlMsIHR4SGFzaCB9KSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgW2ZhdWNldF0gTWludCB0byAke2FkZHJlc3N9IGZhaWxlZDpgLCBlcnIpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkZhdWNldCBtaW50IGZhaWxlZFwiIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIC0tLSBETkEgVkVSSUZJQ0FUSU9OIFJFTEFZIC0tLVxuICAgIC8vIHZlcmlmeUROQS9yZXZva2VETkEgYXJlIG9ubHlWZXJpZmllciBvbi1jaGFpbjsgdXNlcnMgcmVxdWVzdCB0aHJvdWdoIHRoaXNcbiAgICAvLyBhdXRoZW50aWNhdGVkIGVuZHBvaW50IGFuZCB0aGUgYWRtaW4ga2V5IHNpZ25zIGZvciB0aGVtLlxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL3ZlcmlmaWNhdGlvbi9kbmEvcmVxdWVzdFwiICYmIHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDE7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgZXRoQWRkcmVzcyA9IHNlc3Npb24uZXRoQWRkcmVzcz8udG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghZXRoQWRkcmVzcykge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIldhbGxldC1saW5rZWQgc2Vzc2lvbiByZXF1aXJlZFwiIH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZ2V0SnNvbkJvZHkocmVxKTtcbiAgICAgIGNvbnN0IGRuYUhhc2ggPSB0eXBlb2YgYm9keS5kbmFIYXNoID09PSBcInN0cmluZ1wiID8gYm9keS5kbmFIYXNoIDogXCJcIjtcbiAgICAgIGlmICghL14weFswLTlhLWZBLUZdezY0fSQvLnRlc3QoZG5hSGFzaCkpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJkbmFIYXNoIG11c3QgYmUgYSBieXRlczMyIGhleCBzdHJpbmdcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCFpc0FkbWluQ29uZmlndXJlZCgpKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAzO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiRE5BIHJlbGF5IG5vdCBjb25maWd1cmVkIChBRE1JTl9QUklWQVRFX0tFWSBtaXNzaW5nKVwiIH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0eEhhc2ggPSBhd2FpdCByZWxheURuYVZlcmlmeShldGhBZGRyZXNzLCBkbmFIYXNoIGFzIGAweCR7c3RyaW5nfWApO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IHRydWUsIHR4SGFzaCB9KSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgW2RuYS1yZWxheV0gVmVyaWZ5IGZvciAke2V0aEFkZHJlc3N9IGZhaWxlZDpgLCBlcnIpO1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkROQSB2ZXJpZmljYXRpb24gZmFpbGVkXCIgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHBhdGhuYW1lID09PSBcIi9hcGkvdmVyaWZpY2F0aW9uL2RuYS9yZXZva2VcIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAxO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGV0aEFkZHJlc3MgPSBzZXNzaW9uLmV0aEFkZHJlc3M/LnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIWV0aEFkZHJlc3MpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJXYWxsZXQtbGlua2VkIHNlc3Npb24gcmVxdWlyZWRcIiB9KSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCFpc0FkbWluQ29uZmlndXJlZCgpKSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAzO1xuICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiRE5BIHJlbGF5IG5vdCBjb25maWd1cmVkIChBRE1JTl9QUklWQVRFX0tFWSBtaXNzaW5nKVwiIH0pKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0eEhhc2ggPSBhd2FpdCByZWxheURuYVJldm9rZShldGhBZGRyZXNzKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAyMDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiB0cnVlLCB0eEhhc2ggfSkpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtkbmEtcmVsYXldIFJldm9rZSBmb3IgJHtldGhBZGRyZXNzfSBmYWlsZWQ6YCwgZXJyKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJETkEgcmV2b2NhdGlvbiBmYWlsZWRcIiB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAtLS0gRE5BIEFjY291bnQgUmVjb3ZlcnkgLS0tXG4gICAgLy8gUE9TVCAvYXBpL2F1dGgvZG5hLXJlY292ZXIgXHUyMDE0IHZlcmlmeSBETkEgaGFzaCBhZ2FpbnN0IG9uLWNoYWluIHJlY29yZFxuICAgIC8vIGFuZCBpc3N1ZSBhIHNlc3Npb24gZm9yIGFjY291bnQgcmVjb3ZlcnkgKG5vIHdhbGxldCBuZWVkZWQpLlxuICAgIGlmIChwYXRobmFtZSA9PT0gXCIvYXBpL2F1dGgvZG5hLXJlY292ZXJcIiAmJiByZXEubWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgZG5hSGFzaCB9ID0gKGF3YWl0IGdldEpzb25Cb2R5KHJlcSkpIGFzIHtcbiAgICAgICAgICBlbWFpbD86IHN0cmluZztcbiAgICAgICAgICBkbmFIYXNoPzogc3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIWVtYWlsIHx8ICFkbmFIYXNoKSB7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcImVtYWlsIGFuZCBkbmFIYXNoIGFyZSByZXF1aXJlZFwiIH0pKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb2sgdXAgdXNlciBieSBlbWFpbFxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgZGJTZXJ2aWNlLmdldFVzZXJCeUVtYWlsKGVtYWlsLnRvTG93ZXJDYXNlKCkudHJpbSgpKTtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIk5vIGFjY291bnQgZm91bmQgZm9yIHRoaXMgZW1haWxcIiB9KSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldGhBZGRyZXNzID0gdXNlci5ldGhBZGRyZXNzPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIWV0aEFkZHJlc3MpIHtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiQWNjb3VudCBoYXMgbm8gbGlua2VkIHdhbGxldCBhZGRyZXNzXCIgfSkpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmV0Y2ggb24tY2hhaW4gRE5BIHByb2ZpbGUgdmlhIHB1YmxpY0NsaWVudFxuICAgICAgICBsZXQgb25DaGFpbkRuYUhhc2g6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHsgY3JlYXRlUHVibGljQ2xpZW50LCBodHRwIH0gPSBhd2FpdCBpbXBvcnQoXCJ2aWVtXCIpO1xuICAgICAgICAgIGNvbnN0IHsgc2Vwb2xpYSB9ID0gYXdhaXQgaW1wb3J0KFwidmllbS9jaGFpbnNcIik7XG4gICAgICAgICAgY29uc3QgeyBETkFWZXJpZmljYXRpb25BQkkgfSA9IGF3YWl0IGltcG9ydChcIi4vYWJpL0ROQVZlcmlmaWNhdGlvbkFCSVwiKTtcbiAgICAgICAgICBjb25zdCB7IENPTlRSQUNUUyB9ID0gYXdhaXQgaW1wb3J0KFwiLi9hZGRyZXNzZXNcIik7XG5cbiAgICAgICAgICBjb25zdCBSUENfVVJMID1cbiAgICAgICAgICAgIHByb2Nlc3MuZW52LlNFUE9MSUFfUlBDX1VSTCB8fCBcImh0dHBzOi8vZXRoZXJldW0tc2Vwb2xpYS1ycGMucHVibGljbm9kZS5jb21cIjtcbiAgICAgICAgICBjb25zdCBwdWJsaWNDbGllbnQgPSBjcmVhdGVQdWJsaWNDbGllbnQoe1xuICAgICAgICAgICAgY2hhaW46IHNlcG9saWEsXG4gICAgICAgICAgICB0cmFuc3BvcnQ6IGh0dHAoUlBDX1VSTCksXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHB1YmxpY0NsaWVudC5yZWFkQ29udHJhY3Qoe1xuICAgICAgICAgICAgYWRkcmVzczogQ09OVFJBQ1RTLkROQV9WRVJJRklDQVRJT04sXG4gICAgICAgICAgICBhYmk6IEROQVZlcmlmaWNhdGlvbkFCSSxcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogXCJnZXRETkFQcm9maWxlXCIsXG4gICAgICAgICAgICBhcmdzOiBbZXRoQWRkcmVzcyBhcyBgMHgke3N0cmluZ31gXSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIHByb2ZpbGUgaXMgW2RuYUhhc2gsIHRpbWVzdGFtcCwgdmVyaWZpZWQsIHZlcmlmaWVyLCBtZXRhZGF0YV1cbiAgICAgICAgICBjb25zdCB2ZXJpZmllZCA9IChwcm9maWxlIGFzIGFueSlbMl07XG4gICAgICAgICAgY29uc3QgcmF3SGFzaCA9IChwcm9maWxlIGFzIGFueSlbMF0gYXMgYDB4JHtzdHJpbmd9YDtcbiAgICAgICAgICBpZiAodmVyaWZpZWQgJiYgcmF3SGFzaCAmJiByYXdIYXNoICE9PSBcIjB4XCIucGFkRW5kKDY2LCBcIjBcIikpIHtcbiAgICAgICAgICAgIC8vIENvbnZlcnQgYnl0ZXMzMiB0byBoZXggc3RyaW5nIChzdHJpcCAweCBhbmQgbGVhZGluZyB6ZXJvcyxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGdlbmVyYXRlRE5BSGFzaCBvdXRwdXQpXG4gICAgICAgICAgICBvbkNoYWluRG5hSGFzaCA9IHBhcnNlSW50KHJhd0hhc2gsIDE2KS50b1N0cmluZygxNik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChjaGFpbkVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbZG5hLXJlY292ZXJdIE9uLWNoYWluIHJlYWQgZmFpbGVkOlwiLCBjaGFpbkVycik7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDM7XG4gICAgICAgICAgcmVzLmVuZChcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgZXJyb3I6IFwiT24tY2hhaW4gRE5BIHZlcmlmaWNhdGlvbiB1bmF2YWlsYWJsZVwiLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb25DaGFpbkRuYUhhc2gpIHtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICByZXMuZW5kKFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBlcnJvcjpcbiAgICAgICAgICAgICAgICBcIk5vIHZlcmlmaWVkIEROQSBwcm9maWxlIGZvdW5kIGZvciB0aGlzIGFjY291bnQuIFBsZWFzZSB2ZXJpZnkgeW91ciBETkEgZmlyc3QuXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tcGFyZSBoYXNoZXNcbiAgICAgICAgaWYgKG9uQ2hhaW5EbmFIYXNoLnRvTG93ZXJDYXNlKCkgIT09IGRuYUhhc2gudG9Mb3dlckNhc2UoKS50cmltKCkpIHtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMztcbiAgICAgICAgICByZXMuZW5kKFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBlcnJvcjogXCJETkEgaGFzaCBkb2VzIG5vdCBtYXRjaCB0aGUgb24tY2hhaW4gcmVjb3JkIGZvciB0aGlzIGFjY291bnRcIixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYXRjaCBcdTIwMTQgaXNzdWUgc2Vzc2lvbiBjb29raWVcbiAgICAgICAgY29uc3QgbmV3U2Vzc2lvbklkID1cbiAgICAgICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcbiAgICAgICAgc2Vzc2lvbnNbbmV3U2Vzc2lvbklkXSA9IHsgdXNlcklkOiB1c2VyLmlkLCBldGhBZGRyZXNzLCBlbWFpbDogdXNlci5lbWFpbCB9O1xuXG4gICAgICAgIHJlcy5zZXRIZWFkZXIoXG4gICAgICAgICAgXCJTZXQtQ29va2llXCIsXG4gICAgICAgICAgYHNpd2Vfc2Vzc2lvbj0ke25ld1Nlc3Npb25JZH07IFBhdGg9LzsgSHR0cE9ubHk7IFNhbWVTaXRlPUxheDsgTWF4LUFnZT04NjQwMGAsXG4gICAgICAgICk7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICByZXMuZW5kKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgZXRoQWRkcmVzczogdXNlci5ldGhBZGRyZXNzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiW2RuYS1yZWNvdmVyXSBFcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJETkEgcmVjb3ZlcnkgZmFpbGVkXCIgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkVuZHBvaW50IG5vdCBmb3VuZFwiIH0pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJBUEkgRXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICByZXMuZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBlcnJvcjogXCJJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIixcbiAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcQ0ZDXFxcXGFwcHNcXFxcd2ViXFxcXHNyY1xcXFxsaWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENGQ1xcXFxhcHBzXFxcXHdlYlxcXFxzcmNcXFxcbGliXFxcXGt2LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvc3JjL2xpYi9rdi50c1wiOy8qKlxuICogTWluaW1hbCBhc3luYyBLViBzdG9yZSB3aXRoIG9wdGlvbmFsIFJlZGlzIGJhY2tpbmcuXG4gKlxuICogU2V0IFJFRElTX1VSTCB0byBiYWNrIHRoaXMgd2l0aCBSZWRpcyAoc3Vydml2ZXMgcmVzdGFydHMsIHNoYXJlZCBhY3Jvc3NcbiAqIGluc3RhbmNlcykuIFdpdGhvdXQgaXQgYSBwbGFpbiBpbi1tZW1vcnkgTWFwIGlzIHVzZWQgXHUyMDE0IGZpbmUgZm9yIHRoZVxuICogc2luZ2xlLWluc3RhbmNlIE1WUCBkZXBsb3kuXG4gKi9cbmltcG9ydCBSZWRpcyBmcm9tIFwiaW9yZWRpc1wiO1xuXG5pbnRlcmZhY2UgS1ZFbnRyeSB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGV4cGlyZXNBdDogbnVtYmVyIHwgbnVsbDtcbn1cblxuY29uc3QgbWVtb3J5U3RvcmUgPSBuZXcgTWFwPHN0cmluZywgS1ZFbnRyeT4oKTtcblxuZnVuY3Rpb24gbWVtb3J5R2V0KGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGVudHJ5ID0gbWVtb3J5U3RvcmUuZ2V0KGtleSk7XG4gIGlmICghZW50cnkpIHJldHVybiBudWxsO1xuICBpZiAoZW50cnkuZXhwaXJlc0F0ICE9PSBudWxsICYmIERhdGUubm93KCkgPiBlbnRyeS5leHBpcmVzQXQpIHtcbiAgICBtZW1vcnlTdG9yZS5kZWxldGUoa2V5KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gZW50cnkudmFsdWU7XG59XG5cbmZ1bmN0aW9uIG1lbW9yeVNldChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgdHRsTXM/OiBudW1iZXIpOiB2b2lkIHtcbiAgbWVtb3J5U3RvcmUuc2V0KGtleSwge1xuICAgIHZhbHVlLFxuICAgIGV4cGlyZXNBdDogdHRsTXMgPyBEYXRlLm5vdygpICsgdHRsTXMgOiBudWxsLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVkaXMoKTogUmVkaXMgfCBudWxsIHtcbiAgaWYgKCFwcm9jZXNzLmVudi5SRURJU19VUkwpIHJldHVybiBudWxsO1xuICAvLyBMYXp5IHNpbmdsZXRvbiBzbyByZXF1aXJpbmcgdGhpcyBtb2R1bGUgbmV2ZXIgb3BlbnMgYSBjb25uZWN0aW9uXG4gIC8vIHVubGVzcyBSZWRpcyBpcyBhY3R1YWxseSBjb25maWd1cmVkLlxuICBpZiAoIShnbG9iYWxUaGlzIGFzIHsgX19ldm9sdmVSZWRpcz86IFJlZGlzIHwgbnVsbCB9KS5fX2V2b2x2ZVJlZGlzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBSZWRpcyhwcm9jZXNzLmVudi5SRURJU19VUkwsIHtcbiAgICAgICAgbWF4UmV0cmllc1BlclJlcXVlc3Q6IDIsXG4gICAgICAgIGxhenlDb25uZWN0OiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgY2xpZW50Lm9uKFwiZXJyb3JcIiwgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltrdl0gUmVkaXMgZXJyb3I6XCIsIGVyci5tZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgICAgKGdsb2JhbFRoaXMgYXMgeyBfX2V2b2x2ZVJlZGlzPzogUmVkaXMgfCBudWxsIH0pLl9fZXZvbHZlUmVkaXMgPSBjbGllbnQ7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW2t2XSBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBSZWRpcywgdXNpbmcgbWVtb3J5OlwiLCBlcnIpO1xuICAgICAgKGdsb2JhbFRoaXMgYXMgeyBfX2V2b2x2ZVJlZGlzPzogUmVkaXMgfCBudWxsIH0pLl9fZXZvbHZlUmVkaXMgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gKGdsb2JhbFRoaXMgYXMgeyBfX2V2b2x2ZVJlZGlzPzogUmVkaXMgfCBudWxsIH0pLl9fZXZvbHZlUmVkaXMgPz8gbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLdlN0b3JlIHtcbiAgZ2V0KGtleTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPjtcbiAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCB0dGxNcz86IG51bWJlcik6IFByb21pc2U8dm9pZD47XG4gIGRlbChrZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjb25zdCBrdjogS3ZTdG9yZSA9IHtcbiAgYXN5bmMgZ2V0KGtleTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgcmVkaXMgPSBnZXRSZWRpcygpO1xuICAgIGlmIChyZWRpcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHJlZGlzLmdldChrZXkpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJba3ZdIFJlZGlzIGdldCBmYWlsZWQsIGZhbGxpbmcgYmFjayB0byBtZW1vcnk6XCIsIGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZW1vcnlHZXQoa2V5KTtcbiAgfSxcblxuICBhc3luYyBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHR0bE1zPzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcmVkaXMgPSBnZXRSZWRpcygpO1xuICAgIGlmIChyZWRpcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHR0bE1zKSB7XG4gICAgICAgICAgYXdhaXQgcmVkaXMuc2V0KGtleSwgdmFsdWUsIFwiUFhcIiwgdHRsTXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF3YWl0IHJlZGlzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltrdl0gUmVkaXMgc2V0IGZhaWxlZCwgZmFsbGluZyBiYWNrIHRvIG1lbW9yeTpcIiwgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb3J5U2V0KGtleSwgdmFsdWUsIHR0bE1zKTtcbiAgfSxcblxuICBhc3luYyBkZWwoa2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCByZWRpcyA9IGdldFJlZGlzKCk7XG4gICAgaWYgKHJlZGlzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCByZWRpcy5kZWwoa2V5KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiW2t2XSBSZWRpcyBkZWwgZmFpbGVkOlwiLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vcnlTdG9yZS5kZWxldGUoa2V5KTtcbiAgfSxcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXENGQ1xcXFxhcHBzXFxcXHdlYlxcXFxzcmNcXFxcbGliXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxDRkNcXFxcYXBwc1xcXFx3ZWJcXFxcc3JjXFxcXGxpYlxcXFxhZG1pbkNoYWluLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9DRkMvYXBwcy93ZWIvc3JjL2xpYi9hZG1pbkNoYWluLnRzXCI7LyoqXG4gKiBTZXJ2ZXItc2lkZSBhZG1pbiBjaGFpbiByZWxheS5cbiAqXG4gKiBTaWducyB0cmFuc2FjdGlvbnMgd2l0aCBBRE1JTl9QUklWQVRFX0tFWSBmb3Igb3BlcmF0aW9ucyByZWd1bGFyIHVzZXJzXG4gKiBjYW5ub3QgcGVyZm9ybSB0aGVtc2VsdmVzIChETkFWZXJpZmljYXRpb24udmVyaWZ5RE5BL3Jldm9rZUROQSBhcmVcbiAqIG9ubHlWZXJpZmllcikgYW5kIGZvciB0aGUgd2VsY29tZSB0b2tlbiBmYXVjZXQuXG4gKlxuICogRW52OlxuICogICBBRE1JTl9QUklWQVRFX0tFWSAgXHUyMDE0IDB4LXByZWZpeGVkIDMyLWJ5dGUga2V5IG9mIHRoZSBkZXBsb3llci92ZXJpZmllclxuICogICBTRVBPTElBX1JQQ19VUkwgICAgXHUyMDE0IFJQQyBlbmRwb2ludCAoZGVmYXVsdDogcHVibGljbm9kZSBTZXBvbGlhKVxuICovXG5pbXBvcnQge1xuICBjcmVhdGVQdWJsaWNDbGllbnQsXG4gIGNyZWF0ZVdhbGxldENsaWVudCxcbiAgaHR0cCxcbiAgdHlwZSBQdWJsaWNDbGllbnQsXG4gIHR5cGUgV2FsbGV0Q2xpZW50LFxufSBmcm9tIFwidmllbVwiO1xuaW1wb3J0IHsgcHJpdmF0ZUtleVRvQWNjb3VudCB9IGZyb20gXCJ2aWVtL2FjY291bnRzXCI7XG5pbXBvcnQgeyBzZXBvbGlhIH0gZnJvbSBcInZpZW0vY2hhaW5zXCI7XG5pbXBvcnQgeyBDT05UUkFDVFMgfSBmcm9tIFwiLi9hZGRyZXNzZXNcIjtcblxuY29uc3QgUlBDX1VSTCA9IHByb2Nlc3MuZW52LlNFUE9MSUFfUlBDX1VSTCB8fCBcImh0dHBzOi8vZXRoZXJldW0tc2Vwb2xpYS1ycGMucHVibGljbm9kZS5jb21cIjtcblxuZXhwb3J0IGNvbnN0IEZBVUNFVF9BTU9VTlRfVE9LRU5TID0gTnVtYmVyKHByb2Nlc3MuZW52LkZBVUNFVF9BTU9VTlQgfHwgXCI1MFwiKTtcbmV4cG9ydCBjb25zdCBGQVVDRVRfQU1PVU5UX1dFSSA9IEJpZ0ludChGQVVDRVRfQU1PVU5UX1RPS0VOUykgKiAxMG4gKiogMThuO1xuXG5sZXQgcHVibGljQ2xpZW50OiBQdWJsaWNDbGllbnQgfCBudWxsID0gbnVsbDtcbmxldCB3YWxsZXRDbGllbnQ6IFdhbGxldENsaWVudCB8IG51bGwgPSBudWxsO1xubGV0IGFkbWluQWRkcmVzczogYDB4JHtzdHJpbmd9YCB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBpbml0Q2xpZW50cygpOiB2b2lkIHtcbiAgaWYgKHdhbGxldENsaWVudCkgcmV0dXJuO1xuXG4gIGNvbnN0IHJhd0tleSA9IHByb2Nlc3MuZW52LkFETUlOX1BSSVZBVEVfS0VZO1xuICBpZiAoIXJhd0tleSkgcmV0dXJuO1xuXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSByYXdLZXkuc3RhcnRzV2l0aChcIjB4XCIpID8gcmF3S2V5IDogYDB4JHtyYXdLZXl9YDtcbiAgdHJ5IHtcbiAgICBjb25zdCBhY2NvdW50ID0gcHJpdmF0ZUtleVRvQWNjb3VudChub3JtYWxpemVkIGFzIGAweCR7c3RyaW5nfWApO1xuICAgIGFkbWluQWRkcmVzcyA9IGFjY291bnQuYWRkcmVzcztcbiAgICBwdWJsaWNDbGllbnQgPSBjcmVhdGVQdWJsaWNDbGllbnQoeyBjaGFpbjogc2Vwb2xpYSwgdHJhbnNwb3J0OiBodHRwKFJQQ19VUkwpIH0pO1xuICAgIHdhbGxldENsaWVudCA9IGNyZWF0ZVdhbGxldENsaWVudCh7XG4gICAgICBhY2NvdW50LFxuICAgICAgY2hhaW46IHNlcG9saWEsXG4gICAgICB0cmFuc3BvcnQ6IGh0dHAoUlBDX1VSTCksXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coYFthZG1pbkNoYWluXSBBZG1pbiByZWxheSBjb25maWd1cmVkIGZvciAke2FkbWluQWRkcmVzc31gKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlthZG1pbkNoYWluXSBJbnZhbGlkIEFETUlOX1BSSVZBVEVfS0VZOlwiLCBlcnIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FkbWluQ29uZmlndXJlZCgpOiBib29sZWFuIHtcbiAgaW5pdENsaWVudHMoKTtcbiAgcmV0dXJuIHdhbGxldENsaWVudCAhPT0gbnVsbCAmJiBhZG1pbkFkZHJlc3MgIT09IG51bGwgJiYgcHVibGljQ2xpZW50ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiByZXF1aXJlQ2xpZW50cygpOiB7IHBjOiBQdWJsaWNDbGllbnQ7IHdjOiBXYWxsZXRDbGllbnQ7IGFkbWluOiBgMHgke3N0cmluZ31gIH0ge1xuICBpZiAoIWlzQWRtaW5Db25maWd1cmVkKCkgfHwgIXB1YmxpY0NsaWVudCB8fCAhd2FsbGV0Q2xpZW50IHx8ICFhZG1pbkFkZHJlc3MpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBZG1pbiByZWxheSBub3QgY29uZmlndXJlZCAoQURNSU5fUFJJVkFURV9LRVkgbWlzc2luZyBvciBpbnZhbGlkKVwiKTtcbiAgfVxuICByZXR1cm4geyBwYzogcHVibGljQ2xpZW50LCB3Yzogd2FsbGV0Q2xpZW50LCBhZG1pbjogYWRtaW5BZGRyZXNzIH07XG59XG5cbmNvbnN0IEVSQzIwX01JTl9BQkkgPSBbXG4gIHtcbiAgICBuYW1lOiBcIm1pbnRcIixcbiAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gICAgc3RhdGVNdXRhYmlsaXR5OiBcIm5vbnBheWFibGVcIixcbiAgICBpbnB1dHM6IFtcbiAgICAgIHsgbmFtZTogXCJ0b1wiLCB0eXBlOiBcImFkZHJlc3NcIiB9LFxuICAgICAgeyBuYW1lOiBcImFtb3VudFwiLCB0eXBlOiBcInVpbnQyNTZcIiB9LFxuICAgIF0sXG4gICAgb3V0cHV0czogW10sXG4gIH0sXG5dIGFzIGNvbnN0O1xuXG5jb25zdCBETkFfQUJJID0gW1xuICB7XG4gICAgbmFtZTogXCJ2ZXJpZnlETkFcIixcbiAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gICAgc3RhdGVNdXRhYmlsaXR5OiBcIm5vbnBheWFibGVcIixcbiAgICBpbnB1dHM6IFtcbiAgICAgIHsgbmFtZTogXCJ1c2VyXCIsIHR5cGU6IFwiYWRkcmVzc1wiIH0sXG4gICAgICB7IG5hbWU6IFwiZG5hRGF0YUhhc2hcIiwgdHlwZTogXCJieXRlczMyXCIgfSxcbiAgICAgIHsgbmFtZTogXCJtZXRhZGF0YVwiLCB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgXSxcbiAgICBvdXRwdXRzOiBbXSxcbiAgfSxcbiAge1xuICAgIG5hbWU6IFwicmV2b2tlRE5BXCIsXG4gICAgdHlwZTogXCJmdW5jdGlvblwiLFxuICAgIHN0YXRlTXV0YWJpbGl0eTogXCJub25wYXlhYmxlXCIsXG4gICAgaW5wdXRzOiBbeyBuYW1lOiBcInVzZXJcIiwgdHlwZTogXCJhZGRyZXNzXCIgfV0sXG4gICAgb3V0cHV0czogW10sXG4gIH0sXG5dIGFzIGNvbnN0O1xuXG4vKiogTWludCBGQVVDRVRfQU1PVU5UX1dFSSBFVk9MVkUgdG9rZW5zIHRvIGB0b2AuIFJldHVybnMgdHggaGFzaC4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW50RXZvbHZlKHRvOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCB7IHBjLCB3YywgYWRtaW4gfSA9IHJlcXVpcmVDbGllbnRzKCk7XG4gIGNvbnN0IGhhc2ggPSBhd2FpdCB3Yy53cml0ZUNvbnRyYWN0KHtcbiAgICBhZGRyZXNzOiBDT05UUkFDVFMuRVZPTFZFLFxuICAgIGFiaTogRVJDMjBfTUlOX0FCSSxcbiAgICBmdW5jdGlvbk5hbWU6IFwibWludFwiLFxuICAgIGFyZ3M6IFt0byBhcyBgMHgke3N0cmluZ31gLCBGQVVDRVRfQU1PVU5UX1dFSV0sXG4gICAgY2hhaW46IHNlcG9saWEsXG4gICAgYWNjb3VudDogYWRtaW4sXG4gIH0pO1xuICBhd2FpdCBwYy53YWl0Rm9yVHJhbnNhY3Rpb25SZWNlaXB0KHsgaGFzaCB9KTtcbiAgcmV0dXJuIGhhc2g7XG59XG5cbi8qKiBSZWxheSBETkFWZXJpZmljYXRpb24udmVyaWZ5RE5BKHVzZXIsIGRuYUhhc2gpIHZpYSBhZG1pbi4gUmV0dXJucyB0eCBoYXNoLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbGF5RG5hVmVyaWZ5KHVzZXI6IHN0cmluZywgZG5hSGFzaDogYDB4JHtzdHJpbmd9YCk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHsgcGMsIHdjLCBhZG1pbiB9ID0gcmVxdWlyZUNsaWVudHMoKTtcbiAgY29uc3QgaGFzaCA9IGF3YWl0IHdjLndyaXRlQ29udHJhY3Qoe1xuICAgIGFkZHJlc3M6IENPTlRSQUNUUy5ETkFfVkVSSUZJQ0FUSU9OLFxuICAgIGFiaTogRE5BX0FCSSxcbiAgICBmdW5jdGlvbk5hbWU6IFwidmVyaWZ5RE5BXCIsXG4gICAgYXJnczogW3VzZXIgYXMgYDB4JHtzdHJpbmd9YCwgZG5hSGFzaCwgXCJcIl0sXG4gICAgY2hhaW46IHNlcG9saWEsXG4gICAgYWNjb3VudDogYWRtaW4sXG4gIH0pO1xuICBhd2FpdCBwYy53YWl0Rm9yVHJhbnNhY3Rpb25SZWNlaXB0KHsgaGFzaCB9KTtcbiAgcmV0dXJuIGhhc2g7XG59XG5cbi8qKiBSZWxheSBETkFWZXJpZmljYXRpb24ucmV2b2tlRE5BKHVzZXIpIHZpYSBhZG1pbi4gUmV0dXJucyB0eCBoYXNoLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbGF5RG5hUmV2b2tlKHVzZXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHsgcGMsIHdjLCBhZG1pbiB9ID0gcmVxdWlyZUNsaWVudHMoKTtcbiAgY29uc3QgaGFzaCA9IGF3YWl0IHdjLndyaXRlQ29udHJhY3Qoe1xuICAgIGFkZHJlc3M6IENPTlRSQUNUUy5ETkFfVkVSSUZJQ0FUSU9OLFxuICAgIGFiaTogRE5BX0FCSSxcbiAgICBmdW5jdGlvbk5hbWU6IFwicmV2b2tlRE5BXCIsXG4gICAgYXJnczogW3VzZXIgYXMgYDB4JHtzdHJpbmd9YF0sXG4gICAgY2hhaW46IHNlcG9saWEsXG4gICAgYWNjb3VudDogYWRtaW4sXG4gIH0pO1xuICBhd2FpdCBwYy53YWl0Rm9yVHJhbnNhY3Rpb25SZWNlaXB0KHsgaGFzaCB9KTtcbiAgcmV0dXJuIGhhc2g7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVdhLFdBY0EsVUFHQSxjQUdBLGNBR0Esb0JBQ0EsY0FDQSxzQkFDQTtBQXJDYjtBQUFBO0FBQUE7QUFXTyxJQUFNLFlBQVk7QUFBQSxNQUN2QixRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsTUFDYixhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxNQUNSLGVBQWU7QUFBQSxNQUNmLFlBQVk7QUFBQSxNQUNaLGNBQWM7QUFBQSxNQUNkLGFBQWE7QUFBQSxNQUNiLHVCQUF1QjtBQUFBLE1BQ3ZCLGtCQUFrQjtBQUFBLElBQ3BCO0FBR08sSUFBTSxXQUFXO0FBR2pCLElBQU0sZUFBZTtBQUdy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QW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsUUFBYTtBQUUzQixZQUFJLE9BQU8sWUFBWTtBQUNyQiwrQkFBcUIsT0FBTyxVQUFVO0FBQUEsUUFDeEM7QUFFQSxlQUFPLFlBQVksSUFBSSxPQUFPLEtBQVUsS0FBVSxTQUFjO0FBQzlELGdCQUFNLFVBQVUsTUFBTSxpQkFBaUIsS0FBSyxHQUFHO0FBQy9DLGNBQUksQ0FBQyxTQUFTO0FBQ1osaUJBQUs7QUFBQSxVQUNQO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBS0ksTUFBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAibiIsICJjcmVhdGVQdWJsaWNDbGllbnQiLCAiaHR0cCIsICJzZXBvbGlhIiwgIkROQVZlcmlmaWNhdGlvbkFCSSIsICJDT05UUkFDVFMiLCAiUlBDX1VSTCIsICJwdWJsaWNDbGllbnQiLCAicGF0aCJdCn0K
