/**
 * Types for Evolve matching algorithms
 */

/**
 * User profile for matching
 */
export interface MatchingProfile {
  userId: string;
  age: number;
  gender?: string;
  location?: {
    lat: number;
    lon: number;
  };
  interests: string[];
  preferences?: UserPreferences;
  reputationScore?: number; // Social PageRank score
  stdVerified?: boolean; // STD verification status
  dnaVerified?: boolean; // DNA verification status
}

/**
 * User preferences for matching
 */
export interface UserPreferences {
  minAge?: number;
  maxAge?: number;
  gender?: string;
  maxDistance?: number;
  interests?: string[];
  minScore?: number;
  requireStdVerified?: boolean; // Filter by health verification
  requireDnaVerified?: boolean; // Filter by DNA verification
}

/**
 * Match score result
 */
export interface MatchScore {
  userId: string;
  matchedUserId: string;
  score: number;
  factors: ScoreFactors;
  timestamp: Date;
}

/**
 * Score factors breakdown
 */
export interface ScoreFactors {
  interests: number;
  location: number;
  age: number;
  preferences: number;
  activity: number;
}

/**
 * Match filter criteria
 */
export interface MatchFilter {
  minAge?: number;
  maxAge?: number;
  gender?: string;
  maxDistance?: number;
  interests?: string[];
  minScore?: number;
  excludeIds?: string[];
  requireStdVerified?: boolean;
  requireDnaVerified?: boolean;
}

/**
 * Match ranking result
 */
export interface MatchRanking {
  userId: string;
  matchedUserId: string;
  rank: number;
  score: number;
  factors: ScoreFactors;
}

/**
 * Match statistics
 */
export interface MatchStatistics {
  totalMatches: number;
  averageScore: number;
  scoreDistribution: Record<string, number>;
  factorAverages: ScoreFactors;
  topInterests: Array<{ interest: string; count: number }>;
}

/**
 * User behavior analytics
 */
export interface UserBehavior {
  userId: string;
  totalSwipes: number;
  totalMatches: number;
  acceptanceRate: number;
  averageResponseTime: number;
  mostActiveTime: string;
  preferredAgeRange: { min: number; max: number };
  preferredInterests: string[];
}
