# Aztec Prototype (Phase 3) — STATUS: BLOCKED (2026-10-04)

## Prerequisite check (plan todo 5, STEP 0)

- **WSL**: PRESENT (WSL2, Ubuntu-24.04)
- **Docker Desktop**: ABSENT (`docker` command not found on PATH)

## Verdict

Aztec's local sandbox (`aztec-sandbox`) is Docker-based. Docker Desktop is not
installed on this machine, so the private-gift Noir prototype (plan todo 5) and
the private-bond prototype (plan todo 11) cannot be executed locally right now.
Recorded as a graceful BLOCKER per the plan's Executor-profile "BLOCKER-and-skip"
protocol — no workaround attempted (change control forbids improvisation).

## Phase-4 gate criteria

STATUS: **OPEN**. The Phase-4 migration decision gate (Aztec Beta bar + user
demand evidence) remains open; no prototype findings are available yet to inform
it.

## Next steps (requires a separate user decision — NOT improvised here)

1. Install Docker Desktop (user consent required; never done automatically).
2. Re-run todo 5: pin nargo + aztec-packages versions, create
   `packages/contracts/aztec-prototype/`, port the reference token into `PrivateGift`.
3. Re-run todo 11: `PrivateBond` skeleton + findings + Phase-4 gate checklist.

## Notes

- This is a research/strategic track (Phase 3), not a production dependency.
- A WSL-only `nargo` path (Noir compiler + unit tests without a sandbox) may be
  feasible and is noted here as a future option — but it is out of scope for this
  plan run and would require a dated Amendment to pursue.
- No application code was changed; the plan's other waves are unaffected.
