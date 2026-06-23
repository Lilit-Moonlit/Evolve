/**
 * Match type for Evolve
 * Represents a match between two users
 */
export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  matchScore: number;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Match status
 */
export enum MatchStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

/**
 * Match algorithm result
 */
export interface MatchResult {
  userId: string;
  matchedUserId: string;
  score: number;
  reasons: string[];
  timestamp: Date;
}

/**
 * Match preferences for algorithm
 */
export interface MatchPreferences {
  userId: string;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  location?: string;
  maxDistance?: number;
  interests?: string[];
  minScore?: number;
}
