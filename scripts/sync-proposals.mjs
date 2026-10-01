#!/usr/bin/env node
// Serverless multi-platform proposals sync (GitHub + Codeberg + GitLab).
//
// Fetches issues from each forge, normalizes them through the SHARED mapping
// in apps/web/src/lib/proposals-sync.ts (run via tsx so this .mjs can import
// the .ts module), and writes a unified manifest to
// apps/web/public/proposals.json: { "generatedAt": "<ISO>", "proposals": Proposal[] }
//
// There is NO central server: the script runs offline (`--fixture`) or in CI
// (cron / workflow_dispatch) and the manifest is committed + IPFS-pinned by
// .github/workflows/sync-proposals.yml.
//
// Per-platform failures are non-fatal: they log `WARN <platform>: <err>` and
// the run continues. Exit code is 0 as long as the manifest is written.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeRemoteIssue } from "../apps/web/src/lib/proposals-sync.ts";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const MANIFEST_PATH = resolve(ROOT, "apps/web/public/proposals.json");
const FIXTURE_DIR = resolve(SCRIPT_DIR, "fixtures/proposals");

// Forge API base URLs (public API endpoints, not an app deploy domain).
const GITHUB_API = "https://api.github.com";
const CODEBERG_API = "https://codeberg.org/api/v1";
const GITLAB_API = "https://gitlab.com/api/v4";

const REQUEST_TIMEOUT_MS = 30_000;
const USER_AGENT = "evolve-proposals-sync/1.0";

/** CI renders unset vars/secrets as "" — treat blank as "not provided". */
function env(name) {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, ...headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} from ${url}`);
  }
  return response.json();
}

async function readFixture(name) {
  return JSON.parse(await readFile(resolve(FIXTURE_DIR, name), "utf8"));
}

async function fetchGithubIssues() {
  const repo = env("GITHUB_REPO") ?? "Lilit-Moonlit/Evolve";
  const headers = { Accept: "application/vnd.github+json" };
  const token = env("GITHUB_TOKEN");
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetchJson(`${GITHUB_API}/repos/${repo}/issues?state=all&per_page=100`, headers);
}

async function fetchCodebergIssues() {
  const repo = env("CODEBERG_REPO") ?? "evolve/evolve";
  const headers = { Accept: "application/json" };
  const token = env("CODEBERG_TOKEN");
  if (token) headers.Authorization = `token ${token}`;
  return fetchJson(`${CODEBERG_API}/repos/${repo}/issues?state=all&type=issues&limit=100`, headers);
}

async function fetchGitlabIssues() {
  // GitLab addresses a project by its URL-encoded full path.
  const project = encodeURIComponent(env("GITLAB_PROJECT") ?? "evolve-project/evolve");
  const headers = {};
  const token = env("GITLAB_TOKEN");
  if (token) headers["PRIVATE-TOKEN"] = token;
  return fetchJson(`${GITLAB_API}/projects/${project}/issues?per_page=100`, headers);
}

/** GitLab REST issues are flat; the shared normalizer consumes the webhook
 *  shape (fields nested under object_attributes). Transport adaptation ONLY —
 *  every mapping rule (PR filtering, ids, status, timestamps) stays inside
 *  normalizeRemoteIssue. */
function toGitLabWebhookShape(item) {
  if (typeof item !== "object" || item === null) return item;
  return { object_attributes: { ...item, url: item.web_url } };
}

const FIXTURE_MODE = process.argv.includes("--fixture");

const SOURCES = [
  {
    platform: "github",
    load: FIXTURE_MODE ? () => readFixture("github.json") : fetchGithubIssues,
  },
  {
    platform: "codeberg",
    load: FIXTURE_MODE ? () => readFixture("codeberg.json") : fetchCodebergIssues,
  },
  {
    platform: "gitlab",
    load: FIXTURE_MODE ? () => readFixture("gitlab.json") : fetchGitlabIssues,
  },
];

async function main() {
  console.log(`sync-proposals: ${FIXTURE_MODE ? "fixture (offline)" : "network"} mode`);

  const byId = new Map();
  let fetchedTotal = 0;

  for (const { platform, load } of SOURCES) {
    let rawItems;
    try {
      rawItems = await load();
    } catch (err) {
      console.warn(`WARN ${platform}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }

    const items = Array.isArray(rawItems) ? rawItems : [];
    fetchedTotal += items.length;

    let valid = 0;
    let added = 0;
    for (const raw of items) {
      const payload = platform === "gitlab" ? toGitLabWebhookShape(raw) : raw;
      const proposal = normalizeRemoteIssue(platform, payload);
      if (proposal === null) continue; // pull request or invalid payload
      valid += 1;
      if (!byId.has(proposal.id)) {
        byId.set(proposal.id, proposal); // dedup by id
        added += 1;
      }
    }
    console.log(
      `${platform}: ${items.length} fetched → ${valid} valid → ${added} new (manifest total: ${byId.size})`,
    );
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    proposals: [...byId.values()],
  };

  try {
    await mkdir(dirname(MANIFEST_PATH), { recursive: true });
    await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  } catch (err) {
    console.error(
      `FATAL: manifest write failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `OK ${relative(ROOT, MANIFEST_PATH)} — ${manifest.proposals.length} proposals ` +
      `(${fetchedTotal} fetched, ${fetchedTotal - manifest.proposals.length} dropped as PR/invalid/dup)`,
  );
}

await main();
