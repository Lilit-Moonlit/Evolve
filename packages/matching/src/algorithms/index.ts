/**
 * Matching algorithms for Evolve
 * Provides compatibility scoring and preference matching
 */

import type {
  MatchingProfile,
  UserPreferences,
  MatchScore,
  ScoreFactors,
} from "../types";

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate interest compatibility score
 */
function calculateInterestScore(
  interests1: string[],
  interests2: string[],
): number {
  if (interests1.length === 0 || interests2.length === 0) return 0;

  const commonInterests = interests1.filter((interest) =>
    interests2.includes(interest),
  );

  const totalUniqueInterests = new Set([...interests1, ...interests2]).size;
  const commonRatio = commonInterests.length / totalUniqueInterests;

  return Math.min(commonRatio * 100, 100);
}

/**
 * Calculate age compatibility score
 */
function calculateAgeScore(age1: number, age2: number): number {
  const ageDiff = Math.abs(age1 - age2);
  const maxAgeDiff = 20; // Maximum acceptable age difference

  if (ageDiff === 0) return 100;
  if (ageDiff >= maxAgeDiff) return 0;

  return ((maxAgeDiff - ageDiff) / maxAgeDiff) * 100;
}

/**
 * Calculate location compatibility score
 */
function calculateLocationScore(
  location1: { lat: number; lon: number },
  location2: { lat: number; lon: number },
  maxDistance: number = 100,
): number {
  if (!location1 || !location2) return 0;

  const distance = calculateDistance(
    location1.lat,
    location1.lon,
    location2.lat,
    location2.lon,
  );

  if (distance === 0) return 100;
  if (distance >= maxDistance) return 0;

  return ((maxDistance - distance) / maxDistance) * 100;
}

/**
 * Calculate preference compatibility score
 */
function calculatePreferenceScore(
  profile: MatchingProfile,
  otherProfile: MatchingProfile,
): number {
  let score = 0;
  let factors = 0;

  const preferences = profile.preferences || {};

  // Age preference
  if (preferences.minAge !== undefined && preferences.maxAge !== undefined) {
    factors++;
    if (
      otherProfile.age >= preferences.minAge &&
      otherProfile.age <= preferences.maxAge
    ) {
      score += 100;
    }
  }

  // Gender preference
  if (preferences.gender && otherProfile.gender) {
    factors++;
    if (preferences.gender === otherProfile.gender) {
      score += 100;
    }
  }

  // Distance preference
  if (preferences.maxDistance && profile.location && otherProfile.location) {
    factors++;
    const locationScore = calculateLocationScore(
      profile.location,
      otherProfile.location,
      preferences.maxDistance,
    );
    score += locationScore;
  }

  // Interest preference
  if (preferences.interests && preferences.interests.length > 0) {
    factors++;
    const commonInterests = otherProfile.interests.filter((interest) =>
      preferences.interests!.includes(interest),
    );
    const interestScore =
      (commonInterests.length / preferences.interests.length) * 100;
    score += interestScore;
  }

  return factors > 0 ? score / factors : 0;
}

/**
 * Calculate activity score (placeholder - would use actual activity data)
 */
function calculateActivityScore(): number {
  // In a real implementation, this would use user activity data
  // For now, return a neutral score
  return 50;
}

/**
 * Calculate comprehensive match score
 */
export function calculateMatchScore(
  profile: MatchingProfile,
  otherProfile: MatchingProfile,
): MatchScore {
  const factors: ScoreFactors = {
    interests: calculateInterestScore(
      profile.interests,
      otherProfile.interests,
    ),
    location:
      profile.location && otherProfile.location
        ? calculateLocationScore(profile.location, otherProfile.location)
        : 0,
    age: calculateAgeScore(profile.age, otherProfile.age),
    preferences: calculatePreferenceScore(profile, otherProfile),
    activity: calculateActivityScore(),
  };

  // Weight the factors
  const weights = {
    interests: 0.3,
    location: 0.2,
    age: 0.15,
    preferences: 0.25,
    activity: 0.1,
  };

  let score =
    factors.interests * weights.interests +
    factors.location * weights.location +
    factors.age * weights.age +
    factors.preferences * weights.preferences +
    factors.activity * weights.activity;

  // Apply a small priority boost based on the candidate's Social PageRank reputation score
  // reputationScore is 1.0 to 100.0, mapping to up to +10 bonus points
  if (otherProfile.reputationScore) {
    const reputationBoost = (otherProfile.reputationScore / 100) * 10;
    score = Math.min(score + reputationBoost, 100);
  }

  return {
    userId: profile.userId,
    matchedUserId: otherProfile.userId,
    score: Math.round(score),
    factors,
    timestamp: new Date(),
  };
}

/**
 * Find best matches for a user
 */
export function findBestMatches(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
  limit: number = 10,
): MatchScore[] {
  const scores = candidates
    .filter((candidate) => candidate.userId !== profile.userId)
    // Hard filter on medical/DNA verification if required by preferences
    .filter((candidate) => {
      if (profile.preferences?.requireStdVerified && !candidate.stdVerified)
        return false;
      if (profile.preferences?.requireDnaVerified && !candidate.dnaVerified)
        return false;
      return true;
    })
    .map((candidate) => calculateMatchScore(profile, candidate))
    .filter((score) => score.score >= (profile.preferences?.minScore || 50))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scores;
}

/**
 * Preference-based matching
 */
export function preferenceMatch(
  profile: MatchingProfile,
  candidates: MatchingProfile[],
): MatchingProfile[] {
  const preferences = profile.preferences;
  if (!preferences) return candidates;

  return candidates.filter((candidate) => {
    // Age filter
    if (preferences.minAge && candidate.age < preferences.minAge) return false;
    if (preferences.maxAge && candidate.age > preferences.maxAge) return false;

    // Gender filter
    if (preferences.gender && candidate.gender !== preferences.gender)
      return false;

    // Distance filter
    if (preferences.maxDistance && profile.location && candidate.location) {
      const distance = calculateDistance(
        profile.location.lat,
        profile.location.lon,
        candidate.location.lat,
        candidate.location.lon,
      );
      if (distance > preferences.maxDistance) return false;
    }

    // Interest filter
    if (preferences.interests && preferences.interests.length > 0) {
      const hasCommonInterest = candidate.interests.some((interest) =>
        preferences.interests!.includes(interest),
      );
      if (!hasCommonInterest) return false;
    }

    // STD / DNA Verification filters
    if (preferences.requireStdVerified && !candidate.stdVerified) return false;
    if (preferences.requireDnaVerified && !candidate.dnaVerified) return false;

    return true;
  });
}

/**
 * Batch calculate match scores
 */
export function batchCalculateMatchScores(
  profiles: MatchingProfile[],
): Map<string, MatchScore[]> {
  const results = new Map<string, MatchScore[]>();

  for (const profile of profiles) {
    const otherProfiles = profiles.filter((p) => p.userId !== profile.userId);
    const scores = otherProfiles.map((other) =>
      calculateMatchScore(profile, other),
    );
    results.set(profile.userId, scores);
  }

  return results;
}
