import { UserProfile } from "../types";

/**
 * Calculates the PageRank reputation scores for a list of user profiles.
 * The formula used is: R(u) = 1 + Sum( R(v) / Out(v) )
 * where:
 * - R(u) is the reputation score of user u
 * - In(u) is the set of users v who voted for u (included u in their votesGiven array)
 * - R(v) is the reputation score of user v
 * - Out(v) is the number of votes cast by user v (v.votesGiven.length, max 8)
 *
 * @param profiles List of all user profiles in the network
 * @param iterations Maximum number of iterations for convergence (default 20)
 * @param epsilon Convergence threshold (default 0.0001)
 * @returns Map of userId to reputation score
 */
export function calculatePageRank(
  profiles: UserProfile[],
  iterations = 20,
  epsilon = 0.0001,
): Map<string, number> {
  const scores = new Map<string, number>();
  const profileMap = new Map<string, UserProfile>();
  const incomingVotes = new Map<string, string[]>();

  // Initialize scores to 1.0 and build lookups
  for (const profile of profiles) {
    scores.set(profile.id, 1.0);
    profileMap.set(profile.id, profile);
    incomingVotes.set(profile.id, []);
  }

  // Populate incoming votes mapping (In(u))
  for (const profile of profiles) {
    // A user can cast up to 8 votes
    const votes = profile.votesGiven.slice(0, 8);
    for (const votedId of votes) {
      if (incomingVotes.has(votedId)) {
        incomingVotes.get(votedId)!.push(profile.id);
      }
    }
  }

  // Iterative power method to compute PageRank
  for (let iter = 0; iter < iterations; iter++) {
    const nextScores = new Map<string, number>();
    let maxDiff = 0;

    for (const profile of profiles) {
      const uId = profile.id;
      const voters = incomingVotes.get(uId) || [];

      let sum = 0;
      for (const voterId of voters) {
        const voterProfile = profileMap.get(voterId);
        const voterScore = scores.get(voterId) ?? 1.0;

        if (voterProfile && voterProfile.votesGiven.length > 0) {
          const outDegree = Math.min(voterProfile.votesGiven.length, 8);
          sum += voterScore / outDegree;
        }
      }

      const newScore = 1.0 + sum;
      nextScores.set(uId, newScore);

      const diff = Math.abs(newScore - (scores.get(uId) ?? 1.0));
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }

    // Update scores for the next iteration
    for (const [id, score] of nextScores.entries()) {
      scores.set(id, score);
    }

    // If change is below threshold, stop early (converged)
    if (maxDiff < epsilon) {
      break;
    }
  }

  return scores;
}

/**
 * Calculates the composite reputation score for a user profile.
 * Formula: Composite Score = 50% PageRank (normalized) + 50% Verified Documents & Activity
 *
 * Verified Documents and Activity (out of 100 points):
 * - DNA Verified: 40 points
 * - STD Verified: 40 points
 * - Age/Activity (Trust Score): up to 20 points (trustScore * 0.2)
 *
 * @param profile The user profile to calculate composite reputation for
 * @param pageRankScore The calculated PageRank score of this user
 * @param maxPageRank The maximum PageRank score in the system (for normalization)
 * @returns Score between 1.0 and 100.0
 */
export function calculateCompositeReputation(
  profile: UserProfile,
  pageRankScore: number,
  maxPageRank: number,
): number {
  // 1. PageRank score component (50%)
  // Normalize PageRank relative to the highest rank in the system, map to 1-50 points.
  const normalizedPageRankPoints =
    maxPageRank > 1.0 ? (pageRankScore / maxPageRank) * 50.0 : 50.0; // If no votes or everyone has 1.0, give full base 50.0

  // 2. Documents & Activity component (50%)
  let docPoints = 0;
  if (profile.dnaDocument?.dnaVerified) {
    docPoints += 40;
  }
  if (profile.medicalDocument?.stdVerified) {
    docPoints += 40;
  }

  // Trust score scales up to 20 points (profile.trustScore is 0-100)
  const activityPoints = (profile.trustScore / 100) * 20;
  const docsAndActivityScore = (docPoints + activityPoints) * 0.5; // Scale to 50%

  // Return combined score, clamped between 1.0 and 100.0
  return Math.min(
    Math.max(normalizedPageRankPoints + docsAndActivityScore, 1.0),
    100.0,
  );
}
