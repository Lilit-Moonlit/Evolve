// Tests for the 3-component rating system
import { calculateRating, RatingInput } from "../../src/rating";

describe("calculateRating", () => {
  test("calculates rating with no votes, zero fund and no parenthood", () => {
    const input: RatingInput = {
      recursiveVotes: [],
      fundBalance: 0n,
      parenthoodCount: 0,
      gender: "male",
    };
    const result = calculateRating(input);
    expect(result.overall).toBeCloseTo(0);
    expect(result.votingScore).toBeCloseTo(0);
    expect(result.fundBalanceScore).toBeCloseTo(0);
    expect(result.parenthoodScore).toBeCloseTo(0);
  });

  test("full fund balance gives max fund score", () => {
    const input: RatingInput = {
      recursiveVotes: [],
      fundBalance: 100n,
      totalFundBalance: 100n,
      parenthoodCount: 0,
      gender: "female",
    };
    const result = calculateRating(input);
    expect(result.fundBalanceScore).toBeCloseTo(100);
  });

  test("parenthood count gives max parenthood score when total births equals count", () => {
    const input: RatingInput = {
      recursiveVotes: [],
      fundBalance: 0n,
      totalBirths: 5,
      parenthoodCount: 5,
      gender: "female",
    };
    const result = calculateRating(input);
    expect(result.parenthoodScore).toBeCloseTo(100);
  });

  test("simple vote rank contributes to voting score", () => {
    const input: RatingInput = {
      recursiveVotes: [
        { voter: "a", target: "u", weight: 1, targetsVotes: [] },
      ],
      fundBalance: 0n,
      parenthoodCount: 0,
      gender: "male",
    };
    const result = calculateRating(input);
    expect(result.votingScore).toBeGreaterThan(0);
  });

  test("multiple votes and depth affect voting score", () => {
    const input: RatingInput = {
      recursiveVotes: [
        {
          voter: "v1",
          target: "u",
          weight: 2,
          targetsVotes: [
            { voter: "v2", target: "v1", weight: 1, targetsVotes: [] },
          ],
        },
      ],
      fundBalance: 0n,
      parenthoodCount: 0,
      gender: "female",
    };
    const result = calculateRating(input);
    expect(result.votingScore).toBeGreaterThan(0);
    expect(result.overall).toBeGreaterThan(0);
  });

  test("overall rating combines components correctly", () => {
    const input: RatingInput = {
      recursiveVotes: [
        { voter: "a", target: "u", weight: 1, targetsVotes: [] },
        { voter: "b", target: "u", weight: 1, targetsVotes: [] },
      ],
      fundBalance: 50n,
      totalFundBalance: 100n,
      parenthoodCount: 2,
      totalBirths: 4,
      gender: "female",
    };
    const result = calculateRating(input);
    // Expect each component roughly 30-40% weighting
    expect(result.overall).toBeCloseTo(
      result.votingScore * 0.3 +
        result.fundBalanceScore * 0.3 +
        result.parenthoodScore * 0.4,
      2,
    );
  });
});
