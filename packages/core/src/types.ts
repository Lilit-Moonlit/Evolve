// User types
export interface User {
  id: string;
  address: string;
  profileId?: string;
  createdAt: number;
  updatedAt: number;
}

export type GiftType = "ROSE" | "CACTUS";

export interface MedicalDocument {
  ipfsCid: string;
  litAccessControl: any[];
  hash: string;
  stdVerified: boolean;
  updatedAt: number;
}

export interface DnaDocument {
  ipfsCid: string;
  litAccessControl: any[];
  hash: string;
  dnaVerified: boolean;
  strLoci: string[]; // STR Loci markers for paternity verification
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  owner: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  interestedIn: ("male" | "female" | "other")[];
  bio?: string;
  photos: string[];
  location?: Location;
  interests: string[];
  trustScore: number;
  evolveTokenBalance: number;
  reputationScore: number; // Social PageRank score (starts at 1.0)
  votesReceived: number;
  votesGiven: string[]; // User IDs this user voted for (max 8)
  medicalDocument?: MedicalDocument;
  dnaDocument?: DnaDocument;
  giftsReceivedCount: number; // Total number of roses/cacti received
  giftsSentCount: number; // Total number of roses/cacti sent
  createdAt: number;
  updatedAt: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// Message types
export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  createdAt: number;
  updatedAt: number;
}

// Matching types
export interface Match {
  id: string;
  user1: string;
  user2: string;
  score: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
  updatedAt: number;
}

export interface MatchPreferences {
  ageRange: [number, number];
  maxDistance?: number;
  gender?: ("male" | "female" | "other")[];
  minTrustScore?: number;
  requireStdVerified?: boolean;
  requireDnaVerified?: boolean;
}

// Token types
export interface EvolveInfo {
  address: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

// Contract types
export interface ContractConfig {
  address: string;
  chainId: number;
  abi: any[];
}

// Network types
export type Network = "mainnet" | "sepolia" | "localhost";

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Storage types
export interface StoredData {
  cid: string;
  size: number;
  timestamp: number;
}

export interface EncryptedData {
  encryptedString: string;
  accessControlConditions: any[];
}

// P2P types
export interface PeerInfo {
  id: string;
  address: string;
  lastSeen: number;
}

export interface P2PMessage {
  type: "chat" | "profile" | "match";
  data: any;
  from: string;
  to: string;
  timestamp: number;
}

// Relationship/search modes (shared across web + mobile)
export type EvolveMode = "normal" | "pregnancy-bond" | "cryptic-choice";
