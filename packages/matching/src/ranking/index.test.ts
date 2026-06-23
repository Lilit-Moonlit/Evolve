/**
 * Tests for ranking algorithms
 */

import type { MatchingProfile } from "../types";
import {
  rankByScore,
  rankByWeightedFactors,
  rankByRecency,
  rankByDistance,
  rankByInterests,
  hybridRank,
  getTopMatches,
  getMatchesAboveThreshold,
  rerankByFeedback,
} from "./index";

describe("Ranking Algorithms", () => {
  const mockProfile: MatchingProfile = {
    userId: "user1",
    age: 25,
    gender: "male",
    location: { lat: 40.7128, lon: -74.006 },
    interests: ["Music", "Sports"],
  };

  const mockCandidates: MatchingProfile[] = [
    {
      userId: "candidate1",
      age: 24,
      gender: "female",
      location: { lat: 40.7128, lon: -74.006 },
      interests: ["Music", "Sports", "Art"],
    },
    {
      userId: "candidate2",
      age: 28,
      gender: "female",
      location: { lat: 41.8781, lon: -87.6298 },
      interests: ["Travel", "Food"],
    },
    {
      userId: "candidate3",
      age: 26,
      gender: "female",
      location: { lat: 40.7128, lon: -74.006 },
      interests: ["Music", "Art"],
    },
  ];

  describe("rankByScore", () => {
    it("should rank matches by score", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      expect(rankings).toHaveLength(3);
      expect(rankings[0].rank).toBe(1);
      expect(rankings[1].rank).toBe(2);
      expect(rankings[2].rank).toBe(3);
      expect(rankings[0].score).toBeGreaterThanOrEqual(rankings[1].score);
    });

    it("should limit results to specified limit", () => {
      const rankings = rankByScore(mockProfile, mockCandidates, 2);
      expect(rankings).toHaveLength(2);
    });

    it("should exclude the user from rankings", () => {
      const candidatesWithUser = [...mockCandidates, mockProfile];
      const rankings = rankByScore(mockProfile, candidatesWithUser);
      expect(rankings).not.toContainEqual(
        expect.objectContaining({ matchedUserId: "user1" }),
      );
    });
  });

  describe("rankByWeightedFactors", () => {
    it("should rank matches by weighted factors", () => {
      const weights = { interests: 2, location: 1 };
      const rankings = rankByWeightedFactors(
        mockProfile,
        mockCandidates,
        weights,
      );
      expect(rankings).toHaveLength(3);
      expect(rankings[0].rank).toBe(1);
    });

    it("should apply custom weights correctly", () => {
      const weights = { interests: 5, location: 0.1 };
      const rankings = rankByWeightedFactors(
        mockProfile,
        mockCandidates,
        weights,
      );
      expect(rankings).toHaveLength(3);
    });
  });

  describe("rankByRecency", () => {
    it("should rank matches by recency", () => {
      const activityScores = new Map([
        ["candidate1", 80],
        ["candidate2", 60],
        ["candidate3", 90],
      ]);
      const rankings = rankByRecency(
        mockProfile,
        mockCandidates,
        activityScores,
      );
      expect(rankings).toHaveLength(3);
      expect(rankings[0].rank).toBe(1);
    });

    it("should handle missing activity scores", () => {
      const activityScores = new Map([["candidate1", 80]]);
      const rankings = rankByRecency(
        mockProfile,
        mockCandidates,
        activityScores,
      );
      expect(rankings).toHaveLength(3);
    });
  });

  describe("rankByDistance", () => {
    it("should rank matches by distance", () => {
      const rankings = rankByDistance(mockProfile, mockCandidates);
      expect(rankings).toHaveLength(3);
      expect(rankings[0].rank).toBe(1);
    });

    it("should exclude profiles without location", () => {
      const candidatesWithoutLocation: MatchingProfile[] = [
        { userId: "candidate4", age: 25, interests: ["Music"] },
        ...mockCandidates,
      ];
      const rankings = rankByDistance(mockProfile, candidatesWithoutLocation);
      expect(rankings).toHaveLength(3);
      expect(
        rankings.find((r) => r.matchedUserId === "candidate4"),
      ).toBeUndefined();
    });
  });

  describe("rankByInterests", () => {
    it("should rank matches by interest compatibility", () => {
      const rankings = rankByInterests(mockProfile, mockCandidates);
      expect(rankings).toHaveLength(3);
      expect(rankings[0].rank).toBe(1);
    });
  });

  describe("hybridRank", () => {
    it("should rank matches using hybrid algorithm", () => {
      const rankings = hybridRank(mockProfile, mockCandidates);
      expect(rankings).toHaveLength(3);
      expect(rankings[0].rank).toBe(1);
    });

    it("should apply custom weights", () => {
      const options = {
        scoreWeight: 0.7,
        distanceWeight: 0.3,
        recencyWeight: 0,
      };
      const rankings = hybridRank(mockProfile, mockCandidates, options);
      expect(rankings).toHaveLength(3);
    });
  });

  describe("getTopMatches", () => {
    it("should return top N matches", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      const topMatches = getTopMatches(rankings, 2);
      expect(topMatches).toHaveLength(2);
      expect(topMatches[0].rank).toBe(1);
      expect(topMatches[1].rank).toBe(2);
    });

    it("should return all matches if N is larger than rankings", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      const topMatches = getTopMatches(rankings, 10);
      expect(topMatches).toHaveLength(3);
    });
  });

  describe("getMatchesAboveThreshold", () => {
    it("should return matches above threshold", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      const matchesAboveThreshold = getMatchesAboveThreshold(rankings, 50);
      expect(matchesAboveThreshold.length).toBeLessThanOrEqual(rankings.length);
      expect(matchesAboveThreshold.every((m) => m.score >= 50)).toBe(true);
    });

    it("should return empty array if no matches above threshold", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      const matchesAboveThreshold = getMatchesAboveThreshold(rankings, 100);
      expect(matchesAboveThreshold).toHaveLength(0);
    });
  });

  describe("rerankByFeedback", () => {
    it("should rerank based on user feedback", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      const feedback = new Map([
        ["candidate1", 1],
        ["candidate2", -1],
      ]);
      const reranked = rerankByFeedback(rankings, feedback);
      expect(reranked).toHaveLength(3);
      expect(reranked[0].rank).toBe(1);
    });

    it("should handle missing feedback", () => {
      const rankings = rankByScore(mockProfile, mockCandidates);
      const feedback = new Map([["candidate1", 1]]);
      const reranked = rerankByFeedback(rankings, feedback);
      expect(reranked).toHaveLength(3);
    });
  });
});
