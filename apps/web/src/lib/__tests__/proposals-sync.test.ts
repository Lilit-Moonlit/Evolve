import { describe, expect, it } from "vitest";
import {
  PLATFORMS,
  filterByPlatform,
  mergeRemoteWithLocal,
  normalizeRemoteIssue,
  platformFromSource,
} from "../proposals-sync";
import type { Proposal } from "../proposals-store";

/** GitHub / Codeberg (Gitea) issue fixture — offline, no network */
const githubIssue = {
  number: 42,
  title: "Add multi-platform proposals",
  body: "Sync issues from forges into the in-app board.",
  html_url: "https://github.com/evolve/evolve/issues/42",
  state: "open",
  labels: [{ name: "enhancement" }, { name: "governance" }],
  created_at: "2026-09-01T12:00:00Z",
};

const codebergIssue = {
  number: 7,
  title: "Mirror issues from Codeberg",
  body: "Gitea-shaped payload.",
  html_url: "https://codeberg.org/evolve/evolve/issues/7",
  state: "closed",
  labels: [{ name: "bug" }],
  created_at: "2026-09-02T08:30:00Z",
};

/** GitLab issue webhook fixture — payload nests fields under object_attributes */
const gitlabWebhook = {
  object_kind: "issue",
  title: "GitLab top-level title",
  description: "Top-level description (attrs win)",
  created_at: "2026-09-03T10:00:00Z",
  labels: [{ title: "backend" }],
  object_attributes: {
    iid: 9,
    title: "Support GitLab webhooks",
    description: "Normalize object_attributes payloads.",
    url: "https://gitlab.com/evolve/evolve/-/issues/9",
    state: "opened",
    created_at: "2026-09-03T10:00:00Z",
    labels: ["webhook", "sync"],
  },
};

function inAppProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: "p-local-1",
    title: "Local only proposal",
    description: "Created in-app",
    createdAt: 1_750_000_000_000,
    source: "in-app",
    platform: "in-app",
    votes: {},
    ...overrides,
  };
}

describe("normalizeRemoteIssue — GitHub / Codeberg", () => {
  it("maps a GitHub issue to a Proposal with deterministic id", () => {
    const result = normalizeRemoteIssue("github", githubIssue);

    expect(result).not.toBeNull();
    expect(result?.id).toBe("github-42");
    expect(result?.platform).toBe("github");
    expect(result?.platformIssueId).toBe(42);
    expect(result?.title).toBe("Add multi-platform proposals");
    expect(result?.description).toBe("Sync issues from forges into the in-app board.");
    expect(result?.platformUrl).toBe("https://github.com/evolve/evolve/issues/42");
    expect(result?.status).toBe("open");
    expect(result?.createdAt).toBe(Date.parse("2026-09-01T12:00:00Z"));
    expect(result?.votes).toEqual({});
  });

  it("maps a closed Codeberg (Gitea-shaped) issue with platform codeberg", () => {
    const result = normalizeRemoteIssue("codeberg", codebergIssue);

    expect(result?.id).toBe("codeberg-7");
    expect(result?.platform).toBe("codeberg");
    expect(result?.platformIssueId).toBe(7);
    expect(result?.status).toBe("closed");
    expect(result?.platformUrl).toBe("https://codeberg.org/evolve/evolve/issues/7");
  });

  it("filters out GitHub pull requests (they are not proposals)", () => {
    const pullRequest = {
      ...githubIssue,
      pull_request: { url: "https://github.com/evolve/evolve/pull/42" },
    };

    expect(normalizeRemoteIssue("github", pullRequest)).toBeNull();
  });

  it("returns null for malformed payloads", () => {
    expect(normalizeRemoteIssue("github", null)).toBeNull();
    expect(normalizeRemoteIssue("github", "not-an-object")).toBeNull();
    expect(normalizeRemoteIssue("github", { title: "no number" })).toBeNull();
    expect(normalizeRemoteIssue("github", { number: 1 })).toBeNull();
  });

  it("falls back to Date.now() when created_at is missing or unparseable", () => {
    const before = Date.now();
    const noDate = normalizeRemoteIssue("github", { number: 5, title: "No date" });
    const after = Date.now();

    expect(noDate).not.toBeNull();
    expect(noDate?.createdAt).toBeGreaterThanOrEqual(before);
    expect(noDate?.createdAt).toBeLessThanOrEqual(after);
  });
});

describe("normalizeRemoteIssue — GitLab", () => {
  it("maps a GitLab webhook (object_attributes) to a Proposal", () => {
    const result = normalizeRemoteIssue("gitlab", gitlabWebhook);

    expect(result).not.toBeNull();
    expect(result?.id).toBe("gitlab-9");
    expect(result?.platform).toBe("gitlab");
    expect(result?.platformIssueId).toBe(9);
    expect(result?.title).toBe("Support GitLab webhooks");
    expect(result?.description).toBe("Normalize object_attributes payloads.");
    expect(result?.platformUrl).toBe("https://gitlab.com/evolve/evolve/-/issues/9");
    expect(result?.status).toBe("open"); // "opened" -> "open"
    expect(result?.createdAt).toBe(Date.parse("2026-09-03T10:00:00Z"));
    expect(result?.votes).toEqual({});
  });

  it("falls back to object_attributes.id when iid is absent", () => {
    const attrs = { ...gitlabWebhook.object_attributes } as Record<string, unknown>;
    delete attrs.iid;
    attrs.id = 777;
    const result = normalizeRemoteIssue("gitlab", { ...gitlabWebhook, object_attributes: attrs });

    expect(result?.id).toBe("gitlab-777");
    expect(result?.platformIssueId).toBe(777);
  });

  it("maps state closed without rewriting", () => {
    const attrs = { ...gitlabWebhook.object_attributes, state: "closed" };
    const result = normalizeRemoteIssue("gitlab", { ...gitlabWebhook, object_attributes: attrs });

    expect(result?.status).toBe("closed");
  });

  it("returns null when object_attributes lacks a usable id", () => {
    expect(normalizeRemoteIssue("gitlab", { object_attributes: { title: "no id" } })).toBeNull();
  });
});

describe("mergeRemoteWithLocal", () => {
  const remoteNewer: Proposal = {
    id: "github-42",
    title: "Remote title (newer)",
    description: "remote",
    createdAt: 2_000_000_000_000,
    source: "github",
    platform: "github",
    platformIssueId: 42,
    status: "open",
    votes: {},
  };
  const remoteOlder: Proposal = {
    id: "codeberg-7",
    title: "Remote older",
    description: "remote",
    createdAt: 1_000_000_000_000,
    source: "codeberg",
    platform: "codeberg",
    platformIssueId: 7,
    status: "closed",
    votes: {},
  };

  it("keeps local votes on a colliding remote entry and is remote-authoritative otherwise", () => {
    const localCopy: Proposal = {
      ...remoteNewer,
      title: "Local edit that must lose",
      votes: { alice: { vote: "yes", weight: 3 }, bob: { vote: "no", weight: 1 } },
    };
    const localOnly = inAppProposal();

    const merged = mergeRemoteWithLocal([remoteOlder, remoteNewer], [localCopy, localOnly]);

    // Remote first, ordered by createdAt desc; local-only appended after
    expect(merged.map((p) => p.id)).toEqual(["github-42", "codeberg-7", "p-local-1"]);

    const collision = merged[0];
    expect(collision.title).toBe("Remote title (newer)"); // remote authoritative
    expect(collision.votes).toEqual({
      alice: { vote: "yes", weight: 3 },
      bob: { vote: "no", weight: 1 },
    });

    const tail = merged[2];
    expect(tail.id).toBe("p-local-1");
    expect(tail.platform).toBe("in-app");
  });

  it("preserves legacy in-app locals that have no platform field", () => {
    const legacy = inAppProposal({ platform: undefined, source: undefined, id: "p-legacy" });

    const merged = mergeRemoteWithLocal([remoteNewer], [legacy]);

    expect(merged.some((p) => p.id === "p-legacy")).toBe(true);
  });

  it("returns local-only entries unchanged when remote is empty", () => {
    const localOnly = inAppProposal();

    expect(mergeRemoteWithLocal([], [localOnly])).toEqual([localOnly]);
  });
});

describe("filterByPlatform", () => {
  const githubOne = inAppProposal({ id: "github-1", platform: "github" });
  const codebergOne = inAppProposal({ id: "codeberg-1", platform: "codeberg" });
  const legacy = inAppProposal({ id: "p-legacy", platform: undefined });
  const all = [githubOne, codebergOne, legacy, inAppProposal({ id: "in-app-1" })];

  it('returns the list unchanged for "all"', () => {
    expect(filterByPlatform(all, "all")).toEqual(all);
  });

  it("subsets to the requested platform", () => {
    expect(filterByPlatform(all, "github")).toEqual([githubOne]);
    expect(filterByPlatform(all, "codeberg")).toEqual([codebergOne]);
  });

  it('includes legacy no-platform proposals under "in-app"', () => {
    const result = filterByPlatform(all, "in-app");

    expect(result.map((p) => p.id).sort()).toEqual(["in-app-1", "p-legacy"]);
  });
});

describe("platformFromSource — legacy migration", () => {
  it("maps known sources case-insensitively", () => {
    expect(platformFromSource("GitHub")).toBe("github");
    expect(platformFromSource("codeberg")).toBe("codeberg");
    expect(platformFromSource("GitLab")).toBe("gitlab");
    expect(platformFromSource("in-app")).toBe("in-app");
  });

  it("returns undefined for unknown or missing sources", () => {
    expect(platformFromSource("discord")).toBeUndefined();
    expect(platformFromSource(undefined)).toBeUndefined();
    expect(platformFromSource("")).toBeUndefined();
  });
});

describe("PLATFORMS constant", () => {
  it("exposes the four supported platforms in order", () => {
    expect(PLATFORMS).toEqual(["github", "codeberg", "gitlab", "in-app"]);
  });
});
