/**
 * Interface representing recursive vote details used for PageRank calculation.
 */
export interface VoteInfo {
  voter: string;
  target: string;
  weight: number; // Out(v) - number of outgoing votes cast by this voter. Should be > 0.
  targetsVotes: VoteInfo[]; // Recursive votes cast for this voter (depth <= 3)
}

/**
 * Input parameters for calculating user rating.
 */
export interface RatingInput {
  recursiveVotes: VoteInfo[];
  fundBalance: bigint; // Men: tokens in EvolveFund, Women: tokens in wallet
  parenthoodCount: number; // Weighted count of births: conception (+1), post-copulation (+2)
  gender: "male" | "female";
  totalFundBalance?: bigint; // System-wide total for the corresponding gender fund/balance
  totalBirths?: number; // System-wide total births in project
}

/**
 * Calculated 3-component rating results normalized to 0-100 range.
 */
export interface RatingResult {
  overall: number; // 0-100 (weighted sum: 30% voting, 30% fund, 40% parenthood)
  votingScore: number; // 0-100 (30% weight)
  fundBalanceScore: number; // 0-100 (30% weight)
  parenthoodScore: number; // 0-100 (40% weight)
}

// Maximum theoretical PageRank score for a node with 8 incoming votes and depth 3.
// Level 3 rank = 1.0 (base)
// Level 2 rank = 1.0 + 8 * (1.0 / 1) = 9.0
// Level 1 rank = 1.0 + 8 * (9.0 / 1) = 73.0
// Level 0 (target) rank = 1.0 + 8 * (73.0 / 1) = 585.0
const MAX_THEORETICAL_PAGERANK = 585.0;

/**
 * Recursively calculates the PageRank of a voter node up to depth 3.
 *
 * @param node The voter node
 * @param depth Current recursion depth (1-indexed, starting at 1 for direct voters of u)
 */
function calculateNodeRank(node: VoteInfo, depth: number): number {
  if (depth >= 3 || !node.targetsVotes || node.targetsVotes.length === 0) {
    return 1.0;
  }

  // Max 8 votes are considered per node
  const activeVotes = node.targetsVotes.slice(0, 8);
  let sum = 0.0;

  for (const subVote of activeVotes) {
    const subRank = calculateNodeRank(subVote, depth + 1);
    const outDegree = subVote.weight > 0 ? subVote.weight : 1.0;
    sum += subRank / outDegree;
  }

  return 1.0 + sum;
}

/**
 * Helper to round a number to two decimal places.
 */
function roundToTwoDecimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates the Evolve 3-component rating for a user.
 *
 * Formula: Rating(u) = (PageRank_norm * 0.30) + (FundBalance_share * 0.30) + (Parenthood_share * 0.40)
 *
 * All scores are normalized and clamped to the 0-100 range.
 *
 * @param input The rating input parameters
 * @returns The calculated rating scores
 */
export function calculateRating(input: RatingInput): RatingResult {
  const {
    recursiveVotes,
    fundBalance,
    parenthoodCount,
    totalFundBalance,
    totalBirths,
  } = input;

  // --- 1. PageRank Calculation (30% weight) ---
  // Limit to maximum of 8 direct votes
  const directVotes = recursiveVotes.slice(0, 8);
  let rankSum = 0.0;

  for (const vote of directVotes) {
    const voterRank = calculateNodeRank(vote, 1);
    const outDegree = vote.weight > 0 ? vote.weight : 1.0;
    rankSum += voterRank / outDegree;
  }

  const userRank = 1.0 + rankSum;

  // Normalize PageRank to 0-100 range
  // R(u) base is 1.0 (no votes), max is 585.0.
  // Formula: ((userRank - 1.0) / (MAX_THEORETICAL_PAGERANK - 1.0)) * 100
  let votingScore = 0.0;
  if (userRank > 1.0) {
    votingScore = ((userRank - 1.0) / (MAX_THEORETICAL_PAGERANK - 1.0)) * 100.0;
  }
  votingScore = Math.min(Math.max(votingScore, 0.0), 100.0);

  // --- 2. Fund Balance Share Calculation (30% weight) ---
  let fundBalanceScore = 0.0;
  if (!totalFundBalance || totalFundBalance === 0n) {
    fundBalanceScore = fundBalance > 0n ? 100.0 : 0.0;
  } else {
    // Keep high precision with BigInt math and map to percentage
    fundBalanceScore =
      Number((fundBalance * 10000n) / totalFundBalance) / 100.0;
  }
  fundBalanceScore = Math.min(Math.max(fundBalanceScore, 0.0), 100.0);

  // --- 3. Parenthood Share Calculation (40% weight) ---
  let parenthoodScore = 0.0;
  if (!totalBirths || totalBirths === 0) {
    parenthoodScore = parenthoodCount > 0 ? 100.0 : 0.0;
  } else {
    parenthoodScore = (parenthoodCount / totalBirths) * 100.0;
  }
  parenthoodScore = Math.min(Math.max(parenthoodScore, 0.0), 100.0);

  // --- 4. Overall Rating Calculation ---
  const overall =
    votingScore * 0.3 + fundBalanceScore * 0.3 + parenthoodScore * 0.4;

  return {
    overall: roundToTwoDecimals(overall),
    votingScore: roundToTwoDecimals(votingScore),
    fundBalanceScore: roundToTwoDecimals(fundBalanceScore),
    parenthoodScore: roundToTwoDecimals(parenthoodScore),
  };
}
