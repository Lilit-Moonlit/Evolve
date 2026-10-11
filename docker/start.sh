#!/bin/sh
# Render/Docker entrypoint. Keeps the free tier usable without Postgres:
# no DATABASE_URL → JSON fallback (ephemeral; lost on spin-down/redeploy).
set -eu
cd /app/apps/web
if [ -z "${DATABASE_URL:-}" ]; then
  export FORCE_FALLBACK=1
  echo "[evolve] DATABASE_URL unset — ephemeral JSON fallback (resets when the free instance sleeps)."
fi
exec /app/node_modules/.bin/tsx src/server/prod-server.ts
