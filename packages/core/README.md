# @evolve/core

Shared types, constants, and utilities for Evolve. Used by all other packages.

## Modules

- **types** — User, Match, Message, and profile type definitions
- **constants** — App-wide constants and configuration
- **utils** — Validation, crypto, formatting, reputation scoring, web3 helpers
- **middleware** — Auth, logging, error handling

## Scripts

```bash
npm test              # vitest run
npm run type-check    # tsc --noEmit
npm run test:coverage # vitest run --coverage
```

## Testing

34 tests across validation, reputation, and test utilities.

| File                           | Tests              |
| ------------------------------ | ------------------ |
| `src/utils/validation.test.ts` | validation logic   |
| `src/utils/reputation.test.ts` | reputation scoring |

```bash
npm test
```

## License

UNLICENSED — internal Evolve project.
