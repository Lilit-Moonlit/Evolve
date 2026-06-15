---
trigger: always_on
description: "Code standards for Evolve dating platform"
---

# Code Standards

## TypeScript

- Use TypeScript strict mode
- Prefer named exports over default exports
- Use @evolve/\* workspace aliases for imports

## React

- Functional components with hooks
- No default exports for components
- Props typed as {ComponentName}Props interfaces

## Testing

- Tests in packages/contracts/test/ and packages/_/src/\*\*/_.test.ts
- Run: cd apps/web && npm test

## Formatting

- All changes must pass prettier
- Run: npx prettier --write on changed files

## Smart Contracts

- Solidity 0.8.24
- Hardhat + Ignition for deployment
- Tests in packages/contracts/test/
