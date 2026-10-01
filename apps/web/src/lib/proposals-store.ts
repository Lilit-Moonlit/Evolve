// Shared proposals store module
// Implements sessionStorage persistence with defensive JSON handling
// Matches the exact defensive logic from ProposalsPanel.tsx (lines 34-53)

export const STORAGE_KEY = "evolve_proposals_v1";

/** Forge platforms a proposal can originate from ("in-app" = created locally) */
export type ProposalPlatform = "github" | "codeberg" | "gitlab" | "in-app";

/** Lifecycle of a remote (or local) proposal */
export type ProposalStatus = "open" | "closed" | "merged";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  source?: string; // Legacy source tracking from Info icon — kept for backward compat
  votes: Record<string, { vote: "yes" | "no"; weight: number }>;
  platform?: ProposalPlatform;
  platformIssueId?: number | string;
  platformUrl?: string;
  status?: ProposalStatus;
}

const VALID_PLATFORMS: readonly string[] = ["github", "codeberg", "gitlab", "in-app"];
const VALID_STATUSES: readonly string[] = ["open", "closed", "merged"];

export interface PersistedState {
  proposals: Proposal[];
}

/** Load proposals from sessionStorage
 * Returns empty array on corruption or missing data
 * Matches ProposalsPanel loadState() behavior exactly
 */
export function loadProposals(): Proposal[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.proposals)) {
        return parsed.proposals;
      }
    }
  } catch {
    /* ignore corrupt state */
  }
  return [];
}

/** Persist proposals to sessionStorage */
export function saveProposals(proposals: Proposal[]): void {
  try {
    const state: PersistedState = { proposals };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* sessionStorage may be unavailable; non-fatal */
  }
}

/** Add a new proposal and persist immediately */
export function addProposal({
  title,
  description,
  source = "in-app",
}: {
  title: string;
  description: string;
  source?: string;
}): Proposal {
  const now = Date.now();
  const proposal: Proposal = {
    id: `p-${now}-${Math.random().toString(36).slice(2, 6)}`,
    title: title.trim(),
    description: description.trim(),
    createdAt: now,
    source,
    platform: "in-app",
    votes: {},
  };
  const current = loadProposals();
  const updated = [proposal, ...current];
  saveProposals(updated);
  return proposal;
}

/** Seed default proposals when storage is empty */
export function seedDefaultProposals(): Proposal[] {
  const now = Date.now();
  return [
    {
      id: `p-${now}-1`,
      title: "Improve profile photo privacy",
      description: "Allow users to blur photos by default and reveal on request.",
      createdAt: now,
      votes: {},
    },
    {
      id: `p-${now}-2`,
      title: "Add compatibility badges to chat",
      description: "Show anonymous STD compatibility in the conversation list.",
      createdAt: now,
      votes: {},
    },
  ];
}

/** Validate proposal data integrity (platform fields optional but validated when present) */
export function isValidProposal(p: Proposal): boolean {
  return (
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    typeof p.description === "string" &&
    typeof p.createdAt === "number" &&
    typeof p.votes === "object" &&
    (!p.source || typeof p.source === "string") &&
    (p.platform === undefined ||
      (typeof p.platform === "string" && VALID_PLATFORMS.includes(p.platform))) &&
    (p.status === undefined ||
      (typeof p.status === "string" && VALID_STATUSES.includes(p.status))) &&
    (p.platformUrl === undefined || typeof p.platformUrl === "string") &&
    (p.platformIssueId === undefined ||
      typeof p.platformIssueId === "number" ||
      typeof p.platformIssueId === "string")
  );
}
