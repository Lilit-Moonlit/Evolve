import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ProposalsPanel from "../ProposalsPanel";
import { AppStateProvider } from "../../store/AppContext";
import { STORAGE_KEY, type PersistedState } from "../../lib/proposals-store";

/**
 * ProposalsPanel consumes the read-only multi-platform manifest
 * (`${BASE_URL}proposals.json`) alongside local sessionStorage proposals.
 *
 * i18n is intentionally NOT initialized in tests: `t(key)` returns the raw
 * key, so assertions match translated-label keys literally (same pattern as
 * VerificationModal.test.tsx / HomeFilters.test.tsx).
 */

const githubProposal = {
  id: "github-42",
  title: "From GitHub",
  description: "x",
  createdAt: 1700000000000,
  votes: {},
  platform: "github",
  platformIssueId: 42,
  platformUrl: "https://github.com/x/y/issues/42",
  status: "open",
  source: "github",
};

const codebergProposal = {
  id: "codeberg-7",
  title: "From Codeberg",
  description: "y",
  createdAt: 1700000000000,
  votes: {},
  platform: "codeberg",
  platformIssueId: 7,
  platformUrl: "https://codeberg.org/x/y/issues/7",
  status: "closed",
  source: "codeberg",
};

const manifest = {
  generatedAt: "2026-10-01T00:00:00.000Z",
  proposals: [githubProposal, codebergProposal],
};

/** Route fetch by URL: manifest for proposals.json, harmless JSON otherwise. */
function stubManifestFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url.includes("proposals.json")) {
        return { ok: true, status: 200, json: async () => manifest };
      }
      return { ok: true, status: 200, json: async () => ({ authenticated: false }) };
    }),
  );
}

function readStore(): PersistedState {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as PersistedState) : { proposals: [] };
}

function renderPanel() {
  return render(
    <AppStateProvider>
      <ProposalsPanel />
    </AppStateProvider>,
  );
}

describe("ProposalsPanel multi-platform manifest", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders remote proposals with platform badges, statuses and View-on links", async () => {
    stubManifestFetch();
    renderPanel();

    // Remote proposals appear after the manifest fetch resolves
    expect(await screen.findByText("From GitHub")).toBeInTheDocument();
    expect(screen.getByText("From Codeberg")).toBeInTheDocument();

    // Platform badges (filter buttons reuse the same label keys → 2 matches each)
    expect(screen.getAllByText("communications.proposalPlatformFilter.github").length).toBe(2);
    expect(screen.getAllByText("communications.proposalPlatformFilter.codeberg").length).toBe(2);

    // Status labels
    expect(screen.getByText("communications.proposalStatus.open")).toBeInTheDocument();
    expect(screen.getByText("communications.proposalStatus.closed")).toBeInTheDocument();

    // View-on links with correct hrefs
    const links = screen.getAllByRole("link", { name: "communications.proposalViewOn" });
    const hrefs = links.map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://github.com/x/y/issues/42");
    expect(hrefs).toContain("https://codeberg.org/x/y/issues/7");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    // Local seeded proposals still render (merged view)
    expect(await screen.findByText("Improve profile photo privacy")).toBeInTheDocument();
  });

  it("filtering by GitHub keeps only the GitHub proposal", async () => {
    stubManifestFetch();
    renderPanel();

    expect(await screen.findByText("From GitHub")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "communications.proposalPlatformFilter.github" }),
    );

    await waitFor(() => {
      expect(screen.queryByText("From Codeberg")).toBeNull();
    });
    expect(screen.getByText("From GitHub")).toBeInTheDocument();
    // local (in-app) proposals are filtered out too
    expect(screen.queryByText("Improve profile photo privacy")).toBeNull();
  });

  it("upserts a remote vote into the local sessionStorage store", async () => {
    stubManifestFetch();
    renderPanel();

    expect(await screen.findByText("From GitHub")).toBeInTheDocument();

    // First yes-button belongs to the first card (github-42 renders first)
    const yesButtons = screen.getAllByRole("button", { name: /communications\.yes \(0\)/ });
    fireEvent.click(yesButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /communications\.yes \(1\)/ })).toBeInTheDocument();
    });

    // Remote proposal was upserted into the local store with our vote
    const stored = readStore();
    const storedGithub = stored.proposals.find((p) => p.id === "github-42");
    expect(storedGithub).toBeDefined();
    expect(storedGithub?.votes).toMatchObject({ me: { vote: "yes", weight: 1 } });
  });

  it("continues with local proposals when the manifest fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    renderPanel();

    // Local seeded proposals still render; nothing throws
    expect(await screen.findByText("Improve profile photo privacy")).toBeInTheDocument();
    expect(screen.getByText("Add compatibility badges to chat")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("From GitHub")).toBeNull();
      expect(screen.queryByText("From Codeberg")).toBeNull();
    });
  });
});
