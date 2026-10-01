// Multi-platform proposal sync — pure, framework-free normalization and merge.
// No fetch, no Node APIs: fetching webhooks/issues is the caller's concern.
import type { Proposal, ProposalPlatform } from "./proposals-store";

/** All supported proposal platforms, display order */
export const PLATFORMS = ["github", "codeberg", "gitlab", "in-app"] as const;

export type Platform = ProposalPlatform;
/** Platforms whose issues can be synced from a remote forge */
export type RemotePlatform = "github" | "codeberg" | "gitlab";
export type PlatformFilter = "all" | Platform;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTimestamp(value: unknown): number {
  if (typeof value !== "string") return Date.now();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function toStatus(value: unknown): Proposal["status"] {
  if (value === "opened") return "open"; // GitLab uses "opened" for issues
  if (value === "open" || value === "closed" || value === "merged") return value;
  return undefined;
}

/**
 * Parse label arrays defensively (GitHub/Codeberg: [{name}], GitLab: [{title}] or string[]).
 * Labels are tolerated in payloads but are not part of the persisted Proposal shape.
 */
function extractLabelNames(labels: unknown): string[] {
  if (!Array.isArray(labels)) return [];
  const names: string[] = [];
  for (const label of labels) {
    if (typeof label === "string") {
      names.push(label);
    } else if (isRecord(label) && typeof label.name === "string") {
      names.push(label.name);
    } else if (isRecord(label) && typeof label.title === "string") {
      names.push(label.title);
    }
  }
  return names;
}

/** GitHub / Codeberg (Gitea) share the same issue payload shape */
function normalizeGiteaLikeIssue(
  platform: RemotePlatform,
  raw: Record<string, unknown>,
): Proposal | null {
  // Pull requests are not proposals
  if (raw.pull_request !== undefined && raw.pull_request !== null) return null;

  const issueId = raw.number;
  if (typeof issueId !== "number" && typeof issueId !== "string") return null;
  const title = raw.title;
  if (typeof title !== "string" || title.length === 0) return null;

  extractLabelNames(raw.labels);

  return {
    id: `${platform}-${issueId}`,
    title,
    description: typeof raw.body === "string" ? raw.body : "",
    createdAt: parseTimestamp(raw.created_at),
    source: platform,
    votes: {},
    platform,
    platformIssueId: issueId,
    platformUrl: typeof raw.html_url === "string" ? raw.html_url : undefined,
    status: toStatus(raw.state),
  };
}

/** GitLab webhook payloads nest issue fields under object_attributes */
function normalizeGitLabIssue(raw: Record<string, unknown>): Proposal | null {
  const attrs = isRecord(raw.object_attributes) ? raw.object_attributes : {};

  const issueId = attrs.iid !== undefined ? attrs.iid : attrs.id !== undefined ? attrs.id : raw.iid;
  if (typeof issueId !== "number" && typeof issueId !== "string") return null;

  const title = attrs.title !== undefined ? attrs.title : raw.title;
  if (typeof title !== "string" || title.length === 0) return null;

  // labels[].title (top-level) or object_attributes.labels (string[])
  extractLabelNames(raw.labels);
  extractLabelNames(attrs.labels);

  const description = attrs.description !== undefined ? attrs.description : raw.description;

  return {
    id: `gitlab-${issueId}`,
    title,
    description: typeof description === "string" ? description : "",
    createdAt: parseTimestamp(attrs.created_at !== undefined ? attrs.created_at : raw.created_at),
    source: "gitlab",
    votes: {},
    platform: "gitlab",
    platformIssueId: issueId,
    platformUrl: typeof attrs.url === "string" ? attrs.url : undefined,
    status: toStatus(attrs.state),
  };
}

/** Normalize a remote forge issue (GitHub/Codeberg/GitLab payload) into a Proposal.
 *  Returns null for pull requests, non-objects, or payloads without id/title.
 *  Synced ids are deterministic: `${platform}-${platformIssueId}`.
 */
export function normalizeRemoteIssue(platform: RemotePlatform, raw: unknown): Proposal | null {
  if (!isRecord(raw)) return null;
  if (platform === "gitlab") return normalizeGitLabIssue(raw);
  return normalizeGiteaLikeIssue(platform, raw);
}

/** Merge remote (authoritative) proposals with local in-app ones.
 *  Remote entries win for their ids; local votes survive id collisions;
 *  local-only proposals (in-app or legacy no-platform) are appended after
 *  the remote block, which is ordered by createdAt descending.
 */
export function mergeRemoteWithLocal(remote: Proposal[], local: Proposal[]): Proposal[] {
  const localById = new Map(local.map((entry) => [entry.id, entry]));

  const mergedRemote = [...remote]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((entry) => {
      const localEntry = localById.get(entry.id);
      return localEntry && Object.keys(localEntry.votes).length > 0
        ? { ...entry, votes: localEntry.votes }
        : { ...entry };
    });

  const remoteIds = new Set(remote.map((entry) => entry.id));
  const localOnly = local.filter((entry) => !remoteIds.has(entry.id));

  return [...mergedRemote, ...localOnly];
}

/** Filter proposals by platform; "all" returns the list unchanged.
 *  Legacy proposals without a platform count as "in-app".
 */
export function filterByPlatform(proposals: Proposal[], platform: PlatformFilter): Proposal[] {
  if (platform === "all") return proposals;
  return proposals.filter(
    (p) => p.platform === platform || (platform === "in-app" && p.platform === undefined),
  );
}

/** Legacy migration: map a free-form `source` string onto a known platform */
export function platformFromSource(source?: string): Platform | undefined {
  if (typeof source !== "string") return undefined;
  const key = source.trim().toLowerCase();
  return PLATFORMS.find((candidate) => candidate === key);
}
