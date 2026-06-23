/**
 * Analytics for Evolve matching
 * Provides match statistics and user behavior analytics
 */

import type {
  MatchStatistics,
  UserBehavior,
  ScoreFactors,
  MatchScore,
} from "../types";

/**
 * Calculate match statistics
 */
export function calculateMatchStatistics(
  scores: MatchScore[],
): MatchStatistics {
  if (scores.length === 0) {
    return {
      totalMatches: 0,
      averageScore: 0,
      scoreDistribution: {},
      factorAverages: {
        interests: 0,
        location: 0,
        age: 0,
        preferences: 0,
        activity: 0,
      },
      topInterests: [],
    };
  }

  const totalMatches = scores.length;
  const averageScore =
    scores.reduce((sum, score) => sum + score.score, 0) / totalMatches;

  // Score distribution
  const scoreDistribution: Record<string, number> = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61-80": 0,
    "81-100": 0,
  };

  scores.forEach((score) => {
    if (score.score <= 20) scoreDistribution["0-20"]++;
    else if (score.score <= 40) scoreDistribution["21-40"]++;
    else if (score.score <= 60) scoreDistribution["41-60"]++;
    else if (score.score <= 80) scoreDistribution["61-80"]++;
    else scoreDistribution["81-100"]++;
  });

  // Factor averages
  const factorAverages: ScoreFactors = {
    interests:
      scores.reduce((sum, score) => sum + score.factors.interests, 0) /
      totalMatches,
    location:
      scores.reduce((sum, score) => sum + score.factors.location, 0) /
      totalMatches,
    age:
      scores.reduce((sum, score) => sum + score.factors.age, 0) / totalMatches,
    preferences:
      scores.reduce((sum, score) => sum + score.factors.preferences, 0) /
      totalMatches,
    activity:
      scores.reduce((sum, score) => sum + score.factors.activity, 0) /
      totalMatches,
  };

  // Top interests (would need profile data)
  const topInterests: Array<{ interest: string; count: number }> = [];

  return {
    totalMatches,
    averageScore: Math.round(averageScore),
    scoreDistribution,
    factorAverages: {
      interests: Math.round(factorAverages.interests),
      location: Math.round(factorAverages.location),
      age: Math.round(factorAverages.age),
      preferences: Math.round(factorAverages.preferences),
      activity: Math.round(factorAverages.activity),
    },
    topInterests,
  };
}

/**
 * Calculate user behavior analytics
 */
export function calculateUserBehavior(
  userId: string,
  swipeData: Array<{ targetUserId: string; action: "like" | "pass" }>,
  matchData: Array<{ matchedUserId: string }>,
  messageData: Array<{ matchedUserId: string; timestamp: Date }>,
): UserBehavior {
  const totalSwipes = swipeData.length;
  const totalMatches = matchData.length;
  const likes = swipeData.filter((s) => s.action === "like").length;
  const acceptanceRate = totalSwipes > 0 ? (totalMatches / likes) * 100 : 0;

  // Average response time
  const responseTimes: number[] = [];
  matchData.forEach((match) => {
    const messages = messageData.filter(
      (m) => m.matchedUserId === match.matchedUserId,
    );
    if (messages.length >= 2) {
      const timeDiff =
        messages[1].timestamp.getTime() - messages[0].timestamp.getTime();
      responseTimes.push(timeDiff);
    }
  });
  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) /
        responseTimes.length
      : 0;

  // Most active time (hour of day)
  const hourCounts: Record<number, number> = {};
  messageData.forEach((message) => {
    const hour = message.timestamp.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const mostActiveHour = Object.entries(hourCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const mostActiveTime = mostActiveHour ? `${mostActiveHour[0]}:00` : "N/A";

  // Preferred age range (would need profile data)
  const preferredAgeRange = { min: 18, max: 120 };

  // Preferred interests (would need profile data)
  const preferredInterests: string[] = [];

  return {
    userId,
    totalSwipes,
    totalMatches,
    acceptanceRate: Math.round(acceptanceRate),
    averageResponseTime: Math.round(averageResponseTime),
    mostActiveTime,
    preferredAgeRange,
    preferredInterests,
  };
}

/**
 * Calculate match success rate
 */
export function calculateMatchSuccessRate(
  matches: Array<{ status: string }>,
): number {
  if (matches.length === 0) return 0;
  const successfulMatches = matches.filter(
    (m) => m.status === "accepted",
  ).length;
  return (successfulMatches / matches.length) * 100;
}

/**
 * Calculate average match score over time
 */
export function calculateAverageScoreOverTime(
  scores: MatchScore[],
  period: "daily" | "weekly" | "monthly" = "daily",
): Array<{ date: string; averageScore: number }> {
  const groupedScores: Record<string, MatchScore[]> = {};

  scores.forEach((score) => {
    const date = new Date(score.timestamp);
    let key: string;

    if (period === "daily") {
      key = date.toISOString().split("T")[0];
    } else if (period === "weekly") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    if (!groupedScores[key]) {
      groupedScores[key] = [];
    }
    groupedScores[key].push(score);
  });

  return Object.entries(groupedScores)
    .map(([date, scoreList]) => ({
      date,
      averageScore:
        scoreList.reduce((sum, score) => sum + score.score, 0) /
        scoreList.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate factor importance
 */
export function calculateFactorImportance(scores: MatchScore[]): ScoreFactors {
  if (scores.length === 0) {
    return {
      interests: 0,
      location: 0,
      age: 0,
      preferences: 0,
      activity: 0,
    };
  }

  const factorAverages: ScoreFactors = {
    interests:
      scores.reduce((sum, score) => sum + score.factors.interests, 0) /
      scores.length,
    location:
      scores.reduce((sum, score) => sum + score.factors.location, 0) /
      scores.length,
    age:
      scores.reduce((sum, score) => sum + score.factors.age, 0) / scores.length,
    preferences:
      scores.reduce((sum, score) => sum + score.factors.preferences, 0) /
      scores.length,
    activity:
      scores.reduce((sum, score) => sum + score.factors.activity, 0) /
      scores.length,
  };

  const total = Object.values(factorAverages).reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    interests: Math.round((factorAverages.interests / total) * 100),
    location: Math.round((factorAverages.location / total) * 100),
    age: Math.round((factorAverages.age / total) * 100),
    preferences: Math.round((factorAverages.preferences / total) * 100),
    activity: Math.round((factorAverages.activity / total) * 100),
  };
}

/**
 * Calculate user retention
 */
export function calculateUserRetention(
  userActivity: Array<{ userId: string; lastActive: Date }>,
): {
  dailyRetention: number;
  weeklyRetention: number;
  monthlyRetention: number;
} {
  if (userActivity.length === 0) {
    return { dailyRetention: 0, weeklyRetention: 0, monthlyRetention: 0 };
  }

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dailyRetention =
    userActivity.filter((u) => u.lastActive >= dayAgo).length /
    userActivity.length;
  const weeklyRetention =
    userActivity.filter((u) => u.lastActive >= weekAgo).length /
    userActivity.length;
  const monthlyRetention =
    userActivity.filter((u) => u.lastActive >= monthAgo).length /
    userActivity.length;

  return {
    dailyRetention: Math.round(dailyRetention * 100),
    weeklyRetention: Math.round(weeklyRetention * 100),
    monthlyRetention: Math.round(monthlyRetention * 100),
  };
}

/**
 * Calculate match conversion rate
 */
export function calculateMatchConversionRate(
  views: number,
  likes: number,
  matches: number,
): {
  viewToLikeRate: number;
  likeToMatchRate: number;
  viewToMatchRate: number;
} {
  const viewToLikeRate = views > 0 ? (likes / views) * 100 : 0;
  const likeToMatchRate = likes > 0 ? (matches / likes) * 100 : 0;
  const viewToMatchRate = views > 0 ? (matches / views) * 100 : 0;

  return {
    viewToLikeRate: Math.round(viewToLikeRate),
    likeToMatchRate: Math.round(likeToMatchRate),
    viewToMatchRate: Math.round(viewToMatchRate),
  };
}
