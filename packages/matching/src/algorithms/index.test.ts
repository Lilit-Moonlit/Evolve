/**
 * Tests for matching algorithms
 */

import type { MatchingProfile } from "../types";
import {
  calculateMatchScore,
  findBestMatches,
  preferenceMatch,
  batchCalculateMatchScores,
} from "./index";

describe("Matching Algorithms", () => {
  const mockProfile: MatchingProfile = {
    userId: "user1",
    age: 25,
    gender: "male",
    location: { lat: 40.7128, lon: -74.006 },
    interests: ["Music", "Sports", "Travel"],
    preferences: {
      minAge: 20,
      maxAge: 30,
      gender: "female",
      maxDistance: 50,
    },
  };

  const mockCandidate1: MatchingProfile = {
    userId: "candidate1",
    age: 24,
    gender: "female",
    location: { lat: 40.7128, lon: -74.006 },
    interests: ["Music", "Sports", "Art"],
  };

  const mockCandidate2: MatchingProfile = {
    userId: "candidate2",
    age: 26,
    gender: "female",
    location: { lat: 40.7128, lon: -74.006 },
    interests: ["Travel", "Food", "Movies"],
  };

  describe("calculateMatchScore", () => {
    it("should calculate match score between two profiles", () => {
      const score = calculateMatchScore(mockProfile, mockCandidate1);
      expect(score).toHaveProperty("userId", "user1");
      expect(score).toHaveProperty("matchedUserId", "candidate1");
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(100);
      expect(score).toHaveProperty("factors");
      expect(score).toHaveProperty("timestamp");
    });

    it("should calculate higher score for profiles with similar interests", () => {
      const score1 = calculateMatchScore(mockProfile, mockCandidate1);
      const score2 = calculateMatchScore(mockProfile, mockCandidate2);
      expect(score1.score).toBeGreaterThan(score2.score);
    });

    it("should calculate score of 0 for profiles with no common interests", () => {
      const profileWithNoCommonInterests: MatchingProfile = {
        userId: "user3",
        age: 25,
        interests: ["Coding", "Gaming"],
      };
      const candidateWithNoCommonInterests: MatchingProfile = {
        userId: "candidate3",
        age: 25,
        interests: ["Music", "Sports"],
      };
      const score = calculateMatchScore(
        profileWithNoCommonInterests,
        candidateWithNoCommonInterests,
      );
      expect(score.factors.interests).toBe(0);
    });
  });

  describe("findBestMatches", () => {
    it("should find best matches for a profile", () => {
      const candidates = [mockCandidate1, mockCandidate2];
      const matches = findBestMatches(mockProfile, candidates, 2);
      expect(matches).toHaveLength(2);
      expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score);
    });

    it("should limit results to specified limit", () => {
      const candidates = [mockCandidate1, mockCandidate2];
      const matches = findBestMatches(mockProfile, candidates, 1);
      expect(matches).toHaveLength(1);
    });

    it("should filter out profiles below min score", () => {
      const profileWithHighMinScore: MatchingProfile = {
        ...mockProfile,
        preferences: { ...mockProfile.preferences, minScore: 90 },
      };
      const candidates = [mockCandidate1, mockCandidate2];
      const matches = findBestMatches(profileWithHighMinScore, candidates);
      expect(matches.length).toBeLessThanOrEqual(candidates.length);
    });

    it("should exclude the user from matches", () => {
      const candidates = [mockProfile, mockCandidate1];
      const matches = findBestMatches(mockProfile, candidates);
      expect(matches).not.toContainEqual(
        expect.objectContaining({ matchedUserId: "user1" }),
      );
    });
  });

  describe("preferenceMatch", () => {
    it("should filter candidates by preferences", () => {
      const candidates = [mockCandidate1, mockCandidate2];
      const filtered = preferenceMatch(mockProfile, candidates);
      expect(filtered).toHaveLength(2);
    });

    it("should filter by age preferences", () => {
      const profileWithAgePrefs: MatchingProfile = {
        ...mockProfile,
        preferences: { minAge: 25, maxAge: 27 },
      };
      const candidates = [mockCandidate1, mockCandidate2];
      const filtered = preferenceMatch(profileWithAgePrefs, candidates);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].age).toBeGreaterThanOrEqual(25);
      expect(filtered[0].age).toBeLessThanOrEqual(27);
    });

    it("should filter by gender preferences", () => {
      const candidates = [mockCandidate1, mockCandidate2];
      const filtered = preferenceMatch(mockProfile, candidates);
      expect(filtered.every((c) => c.gender === "female")).toBe(true);
    });

    it("should return all candidates if no preferences", () => {
      const profileWithoutPrefs: MatchingProfile = {
        userId: "user4",
        age: 25,
        interests: ["Music"],
      };
      const candidates = [mockCandidate1, mockCandidate2];
      const filtered = preferenceMatch(profileWithoutPrefs, candidates);
      expect(filtered).toHaveLength(2);
    });
  });

  describe("batchCalculateMatchScores", () => {
    it("should calculate match scores for all profile pairs", () => {
      const profiles = [mockProfile, mockCandidate1, mockCandidate2];
      const results = batchCalculateMatchScores(profiles);
      expect(results.size).toBe(3);
      expect(results.get("user1")).toHaveLength(2);
      expect(results.get("candidate1")).toHaveLength(2);
      expect(results.get("candidate2")).toHaveLength(2);
    });

    it("should not include self-matches", () => {
      const profiles = [mockProfile, mockCandidate1];
      const results = batchCalculateMatchScores(profiles);
      const user1Scores = results.get("user1")!;
      expect(user1Scores).not.toContainEqual(
        expect.objectContaining({ matchedUserId: "user1" }),
      );
    });
  });
});
