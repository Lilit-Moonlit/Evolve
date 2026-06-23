# @evolve/matching

Matching algorithms, filters, ranking, and analytics for Evolve.

## Modules

- **algorithms** — `calculateMatchScore`, `findBestMatches`, `preferenceMatch`, `batchCalculateMatchScores`. Interest/location/age/preference compatibility scoring with configurable weights.
- **filters** — Profile filtering by age, location, interests, gender, verification status
- **ranking** — `rankByScore`, `rankByWeightedFactors`, `rankByDistance`, `rankByInterests`, `rankByRecency`, `hybridRank`, `rerankByFeedback`
- **analytics** — `calculateMatchStatistics`, `calculateUserBehavior`, `calculateUserRetention`, `calculateMatchConversionRate`, `calculateFactorImportance`

## Scripts

```bash
npm test              # vitest run
npm run type-check    # tsc --noEmit
npm run test:coverage # vitest run --coverage
```

## Testing

67 tests across all modules.

| Module     | Tests |
| ---------- | ----- |
| algorithms | 9     |
| filters    | 22    |
| ranking    | 18    |
| analytics  | 18    |

```bash
npm test
```

## License

UNLICENSED — internal Evolve project.
