# Web QA Report

Generated: 2026-06-16

## Test Results

```
Test Files:  1 failed | 3 passed (4)
Tests:       1 failed | 6 passed (7)
Duration:    5.00s
```

### Failed Tests

| File                      | Test                                | Error                                                                    |
| ------------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `src/pages/Home.test.tsx` | renders Home component with filters | `useNavigate() may be used only in the context of a <Router> component.` |

**Root Cause:** Test does not wrap `<Home>` in a `<Router>` provider. This is a pre-existing test infrastructure issue, not a code regression.

### Passed Tests

| File                         | Test                                   |
| ---------------------------- | -------------------------------------- |
| `src/utils/dnaUtils.test.ts` | 4 tests                                |
| `src/pages/Chat.test.tsx`    | renders Chat component placeholder     |
| `src/pages/Profile.test.tsx` | renders Profile page with profile info |

### Warnings

- `react-i18next:: useTranslation: You will need to pass in an i18next instance` — test environment missing i18n provider
- `Failed to parse URL from /api/auth/siwe/session` — test environment missing API base URL
- `An update to AppStateProvider inside a test was not wrapped in act(...)` — async state update in test

## Build Results

```
✓ prisma generate — success
✓ tsc — success
✓ vite build — success (1m 36s)
```

### Build Output

- `dist/index.html` — 1.30 kB
- Total modules: 5,441 transformed
- Large chunks warning (>500 kB):
  - `core-C7C9x43Q.js` — 523 kB
  - `metamask-sdk-JiB1cTWf.js` — 557 kB
  - `index-BJqreCaI.js` — 1,720 kB

### Build Warnings

- Rollup `/*#__PURE__*/` annotation warnings from node_modules (cosmetic, no impact)
- PostgreSQL not available — using JSON fallback database (expected in dev)

## TypeScript Compile

```
✓ npx tsc --noEmit — 0 errors
```

No type errors found.

## Summary

| Check      | Status                                                   |
| ---------- | -------------------------------------------------------- |
| Tests      | ⚠️ 1 pre-existing failure (Home.test.tsx missing Router) |
| Build      | ✅ Success                                               |
| TypeScript | ✅ 0 errors                                              |

## Recommendations

1. Fix `Home.test.tsx` by wrapping in `<MemoryRouter>` (low priority, pre-existing)
2. Add i18n test provider to test setup (low priority)
3. Consider code-splitting for large chunks (performance optimization)
