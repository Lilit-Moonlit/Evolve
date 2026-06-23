/**
 * Tests for analytics
 */

import type { MatchScore } from "../types";
import {
  calculateMatchStatistics,
  calculateUserBehavior,
  calculateMatchSuccessRate,
  calculateAverageScoreOverTime,
  calculateFactorImportance,
  calculateUserRetention,
  calculateMatchConversionRate,
} from "./index";

describe("Analytics", () => {
  describe("calculateMatchStatistics", () => {
    it("should calculate match statistics", () => {
      const scores: MatchScore[] = [
        {
          userId: "user1",
          matchedUserId: "user2",
          score: 85,
          factors: {
            interests: 80,
            location: 90,
            age: 85,
            preferences: 80,
            activity: 90,
          },
          timestamp: new Date(),
        },
        {
          userId: "user1",
          matchedUserId: "user3",
          score: 70,
          factors: {
            interests: 70,
            location: 75,
            age: 70,
            preferences: 65,
            activity: 70,
          },
          timestamp: new Date(),
        },
      ];
      const stats = calculateMatchStatistics(scores);
      expect(stats.totalMatches).toBe(2);
      expect(stats.averageScore).toBeGreaterThan(0);
      expect(stats.scoreDistribution).toBeDefined();
      expect(stats.factorAverages).toBeDefined();
    });

    it("should handle empty scores", () => {
      const stats = calculateMatchStatistics([]);
      expect(stats.totalMatches).toBe(0);
      expect(stats.averageScore).toBe(0);
    });
  });

  describe("calculateUserBehavior", () => {
    it("should calculate user behavior", () => {
      const swipeData = [
        { targetUserId: "user2", action: "like" },
        { targetUserId: "user3", action: "like" },
        { targetUserId: "user4", action: "pass" },
      ];
      const matchData = [{ matchedUserId: "user2" }];
      const messageData = [
        { matchedUserId: "user2", timestamp: new Date() },
        { matchedUserId: "user2", timestamp: new Date() },
      ];
      const behavior = calculateUserBehavior(
        "user1",
        swipeData,
        matchData,
        messageData,
      );
      expect(behavior.userId).toBe("user1");
      expect(behavior.totalSwipes).toBe(3);
      expect(behavior.totalMatches).toBe(1);
      expect(behavior.acceptanceRate).toBeGreaterThanOrEqual(0);
    });

    it("should handle empty data", () => {
      const behavior = calculateUserBehavior("user1", [], [], []);
      expect(behavior.userId).toBe("user1");
      expect(behavior.totalSwipes).toBe(0);
      expect(behavior.totalMatches).toBe(0);
    });
  });

  describe("calculateMatchSuccessRate", () => {
    it("should calculate match success rate", () => {
      const matches = [
        { status: "accepted" },
        { status: "accepted" },
        { status: "rejected" },
      ];
      const rate = calculateMatchSuccessRate(matches);
      expect(rate).toBeCloseTo(66.67, 1);
    });

    it("should handle empty matches", () => {
      const rate = calculateMatchSuccessRate([]);
      expect(rate).toBe(0);
    });
  });

  describe("calculateAverageScoreOverTime", () => {
    it("should calculate average score over time", () => {
      const scores: MatchScore[] = [
        {
          userId: "user1",
          matchedUserId: "user2",
          score: 80,
          factors: {
            interests: 80,
            location: 80,
            age: 80,
            preferences: 80,
            activity: 80,
          },
          timestamp: new Date("2024-01-01"),
        },
        {
          userId: "user1",
          matchedUserId: "user3",
          score: 90,
          factors: {
            interests: 90,
            location: 90,
            age: 90,
            preferences: 90,
            activity: 90,
          },
          timestamp: new Date("2024-01-02"),
        },
      ];
      const averageScores = calculateAverageScoreOverTime(scores, "daily");
      expect(averageScores).toHaveLength(2);
      expect(averageScores[0].averageScore).toBeGreaterThan(0);
    });

    it("should handle empty scores", () => {
      const averageScores = calculateAverageScoreOverTime([], "daily");
      expect(averageScores).toHaveLength(0);
    });
  });

  describe("calculateFactorImportance", () => {
    it("should calculate factor importance", () => {
      const scores: MatchScore[] = [
        {
          userId: "user1",
          matchedUserId: "user2",
          score: 80,
          factors: {
            interests: 80,
            location: 80,
            age: 80,
            preferences: 80,
            activity: 80,
          },
          timestamp: new Date(),
        },
      ];
      const importance = calculateFactorImportance(scores);
      expect(importance.interests).toBeGreaterThanOrEqual(0);
      expect(importance.location).toBeGreaterThanOrEqual(0);
      expect(importance.age).toBeGreaterThanOrEqual(0);
      expect(importance.preferences).toBeGreaterThanOrEqual(0);
      expect(importance.activity).toBeGreaterThanOrEqual(0);
    });

    it("should handle empty scores", () => {
      const importance = calculateFactorImportance([]);
      expect(importance.interests).toBe(0);
      expect(importance.location).toBe(0);
      expect(importance.age).toBe(0);
      expect(importance.preferences).toBe(0);
      expect(importance.activity).toBe(0);
    });
  });

  describe("calculateUserRetention", () => {
    it("should calculate user retention", () => {
      const userActivity = [
        { userId: "user1", lastActive: new Date() },
        {
          userId: "user2",
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          userId: "user3",
          lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      ];
      const retention = calculateUserRetention(userActivity);
      expect(retention.dailyRetention).toBeGreaterThanOrEqual(0);
      expect(retention.weeklyRetention).toBeGreaterThanOrEqual(0);
      expect(retention.monthlyRetention).toBeGreaterThanOrEqual(0);
    });

    it("should handle empty activity", () => {
      const retention = calculateUserRetention([]);
      expect(retention.dailyRetention).toBe(0);
      expect(retention.weeklyRetention).toBe(0);
      expect(retention.monthlyRetention).toBe(0);
    });
  });

  describe("calculateMatchConversionRate", () => {
    it("should calculate match conversion rate", () => {
      const conversion = calculateMatchConversionRate(100, 50, 25);
      expect(conversion.viewToLikeRate).toBe(50);
      expect(conversion.likeToMatchRate).toBe(50);
      expect(conversion.viewToMatchRate).toBe(25);
    });

    it("should handle zero views", () => {
      const conversion = calculateMatchConversionRate(0, 0, 0);
      expect(conversion.viewToLikeRate).toBe(0);
      expect(conversion.likeToMatchRate).toBe(0);
      expect(conversion.viewToMatchRate).toBe(0);
    });
  });
});
