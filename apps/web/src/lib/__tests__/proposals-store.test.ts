import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  addProposal,
  isValidProposal,
  seedDefaultProposals,
  type Proposal,
} from "../proposals-store";

/** Minimal valid proposal fixture; overridden per case */
function baseProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: "p-test-1",
    title: "Improve governance",
    description: "Sync proposals from forges.",
    createdAt: 1_700_000_000_000,
    votes: {},
    ...overrides,
  };
}

beforeEach(() => {
  sessionStorage.clear();
});

describe("isValidProposal — platform fields", () => {
  it("accepts every supported platform value", () => {
    for (const platform of ["github", "codeberg", "gitlab", "in-app"] as const) {
      expect(isValidProposal(baseProposal({ platform }))).toBe(true);
    }
  });

  it("accepts every supported status value", () => {
    for (const status of ["open", "closed", "merged"] as const) {
      expect(isValidProposal(baseProposal({ status }))).toBe(true);
    }
  });

  it("accepts platformIssueId as number or string and platformUrl as string", () => {
    expect(
      isValidProposal(
        baseProposal({
          platform: "github",
          platformIssueId: 42,
          platformUrl: "https://github.com/o/r/issues/42",
        }),
      ),
    ).toBe(true);
    expect(
      isValidProposal(
        baseProposal({
          platform: "codeberg",
          platformIssueId: "cb-7",
          platformUrl: "https://codeberg.org/o/r/issues/7",
        }),
      ),
    ).toBe(true);
  });

  it("accepts legacy proposals without any platform field", () => {
    expect(isValidProposal(baseProposal())).toBe(true);
  });

  it("rejects an unknown platform string", () => {
    expect(isValidProposal(baseProposal({ platform: "discord" as Proposal["platform"] }))).toBe(
      false,
    );
  });

  it("rejects an unknown status string", () => {
    expect(isValidProposal(baseProposal({ status: "pending" as Proposal["status"] }))).toBe(false);
  });

  it("rejects a non-string platformUrl and a non number/string platformIssueId", () => {
    expect(isValidProposal(baseProposal({ platformUrl: 123 as unknown as string }))).toBe(false);
    expect(isValidProposal(baseProposal({ platformIssueId: true as unknown as number }))).toBe(
      false,
    );
  });
});

describe("addProposal — platform defaults", () => {
  it("defaults platform and source to in-app when neither is given", () => {
    const created = addProposal({ title: "Roadmap", description: "Publish the roadmap." });

    expect(created.platform).toBe("in-app");
    expect(created.source).toBe("in-app");
    expect(created.votes).toEqual({});
    expect(created.title).toBe("Roadmap");
  });

  it("keeps an explicitly provided source (backward compat)", () => {
    const created = addProposal({ title: "Roadmap", description: "d", source: "github" });

    expect(created.source).toBe("github");
    expect(created.platform).toBe("in-app");
  });

  it("persists the created proposal under the known storage key", () => {
    addProposal({ title: "Persisted", description: "d" });

    const raw = sessionStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string) as { proposals: Proposal[] };
    expect(parsed.proposals.some((p) => p.title === "Persisted")).toBe(true);
  });
});

describe("seedDefaultProposals — validity without platform", () => {
  it("returns only valid proposals (no platform required on seeds)", () => {
    const seeds = seedDefaultProposals();

    expect(seeds.length).toBeGreaterThan(0);
    for (const seed of seeds) {
      expect(isValidProposal(seed)).toBe(true);
      expect(seed.platform).toBeUndefined();
    }
  });
});
