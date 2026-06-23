/**
 * Ranking algorithms for Evolve matching
 * Provides match ranking algorithms
 */

import type { MatchingProfile, MatchRanking, ScoreFactors } from "../types";
import { calculateMatchScore } from "../algorithms";

/**
 * Rank matches by score
 */
export function rankByScore(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  limit?: number,
): MatchRanking[] {
  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    .map((candidate) => {
      const matchScore = calculateMatchScore(profile, candidate);
      return {
        userId: profile.userId,
        matchedUserId: candidate.userId,
        rank: 0, // Will be set after sorting
        score: matchScore.score,
        factors: matchScore.factors,
      };
    })
    .sort((a, b) => b.score - a.score);

  // Assign ranks
  scores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return limit ? scores.slice(0, limit) : scores;
}

/**
 * Rank matches by weighted factors
 */
export function rankByWeightedFactors(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  weights: Partial<ScoreFactors>,
  limit?: number,
): MatchRanking[] {
  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    .map((candidate) => {
      const matchScore = calculateMatchScore(profile, candidate);

      // Apply custom weights
      const weightedScore =
        matchScore.factors.interests * (weights.interests || 1) +
        matchScore.factors.location * (weights.location || 1) +
        matchScore.factors.age * (weights.age || 1) +
        matchScore.factors.preferences * (weights.preferences || 1) +
        matchScore.factors.activity * (weights.activity || 1);

      return {
        userId: profile.userId,
        matchedUserId: candidate.userId,
        rank: 0,
        score: Math.round(weightedScore),
        factors: matchScore.factors,
      };
    })
    .sort((a, b) => b.score - a.score);

  scores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return limit ? scores.slice(0, limit) : scores;
}

/**
 * Rank matches by recency (activity-based)
 */
export function rankByRecency(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  activityScores: Map<string, number>,
  limit?: number,
): MatchRanking[] {
  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    .map((candidate) => {
      const matchScore = calculateMatchScore(profile, candidate);
      const activityScore = activityScores.get(candidate.userId) || 0;

      // Combine match score with activity score
      const combinedScore = matchScore.score * 0.7 + activityScore * 0.3;

      return {
        userId: profile.userId,
        matchedUserId: candidate.userId,
        rank: 0,
        score: Math.round(combinedScore),
        factors: matchScore.factors,
      };
    })
    .sort((a, b) => b.score - a.score);

  scores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return limit ? scores.slice(0, limit) : scores;
}

/**
 * Rank matches by distance priority
 */
export function rankByDistance(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  limit?: number,
): MatchRanking[] {
  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    .filter((candidate) => candidate.location && profile.location)
    .map((candidate) => {
      const matchScore = calculateMatchScore(profile, candidate);

      // Give extra weight to location score
      const locationBoostedScore =
        matchScore.score + matchScore.factors.location * 0.5;

      return {
        userId: profile.userId,
        matchedUserId: candidate.userId,
        rank: 0,
        score: Math.min(Math.round(locationBoostedScore), 100),
        factors: matchScore.factors,
      };
    })
    .sort((a, b) => b.score - a.score);

  scores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return limit ? scores.slice(0, limit) : scores;
}

/**
 * Rank matches by interest compatibility
 */
export function rankByInterests(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  limit?: number,
): MatchRanking[] {
  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    .map((candidate) => {
      const matchScore = calculateMatchScore(profile, candidate);

      // Give extra weight to interest score
      const interestBoostedScore =
        matchScore.score + matchScore.factors.interests * 0.5;

      return {
        userId: profile.userId,
        matchedUserId: candidate.userId,
        rank: 0,
        score: Math.min(Math.round(interestBoostedScore), 100),
        factors: matchScore.factors,
      };
    })
    .sort((a, b) => b.score - a.score);

  scores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return limit ? scores.slice(0, limit) : scores;
}

/**
 * Hybrid ranking (combines multiple factors)
 */
export function hybridRank(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  options: {
    scoreWeight?: number;
    distanceWeight?: number;
    recencyWeight?: number;
    activityScores?: Map<string, number>;
  } = {},
  limit?: number,
): MatchRanking[] {
  const {
    scoreWeight = 0.5,
    distanceWeight = 0.2,
    recencyWeight = 0.3,
    activityScores = new Map(),
  } = options;

  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    .map((candidate) => {
      const matchScore = calculateMatchScore(profile, candidate);
      const activityScore = activityScores.get(candidate.userId) || 0;

      // Calculate hybrid score
      const hybridScore =
        matchScore.score * scoreWeight +
        matchScore.factors.location * distanceWeight +
        activityScore * recencyWeight;

      return {
        userId: profile.userId,
        matchedUserId: candidate.userId,
        rank: 0,
        score: Math.min(Math.round(hybridScore), 100),
        factors: matchScore.factors,
      };
    })
    .sort((a, b) => b.score - a.score);

  scores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return limit ? scores.slice(0, limit) : scores;
}

/**
 * Get top N matches
 */
export function getTopMatches(
  rankings: MatchRanking[],
  n: number,
): MatchRanking[] {
  return rankings.slice(0, n);
}

/**
 * Get matches above threshold
 */
export function getMatchesAboveThreshold(
  rankings: MatchRanking[],
  threshold: number,
): MatchRanking[] {
  return rankings.filter((ranking) => ranking.score >= threshold);
}

/**
 * Re-rank based on user feedback
 */
export function rerankByFeedback(
  rankings: MatchRanking[],
  feedback: Map<string, number>, // userId -> feedback score (-1 to 1)
): MatchRanking[] {
  return rankings
    .map((ranking) => {
      const feedbackScore = feedback.get(ranking.matchedUserId) || 0;
      const adjustedScore = ranking.score + feedbackScore * 10;

      return {
        ...ranking,
        score: Math.max(0, Math.min(100, Math.round(adjustedScore))),
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}
