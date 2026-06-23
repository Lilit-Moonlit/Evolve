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
  strLoci: string[];
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
  cfcTokenBalance: number;
  reputationScore: number;
  votesReceived: number;
  votesGiven: string[];
  medicalDocument?: MedicalDocument;
  dnaDocument?: DnaDocument;
  giftsReceivedCount: number;
  giftsSentCount: number;
  createdAt: number;
  updatedAt: number;
}
export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}
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
export interface CFCInfo {
  address: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}
export interface ContractConfig {
  address: string;
  chainId: number;
  abi: any[];
}
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
export interface StoredData {
  cid: string;
  size: number;
  timestamp: number;
}
export interface EncryptedData {
  encryptedString: string;
  accessControlConditions: any[];
}
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
//# sourceMappingURL=types.d.ts.map
