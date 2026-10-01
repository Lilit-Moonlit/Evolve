import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import {
  loadProposals,
  saveProposals,
  addProposal as storeAddProposal,
  seedDefaultProposals,
  Proposal,
} from "../lib/proposals-store";
import {
  mergeRemoteWithLocal,
  filterByPlatform,
  PLATFORMS,
  PlatformFilter,
} from "../lib/proposals-sync";
import InfoProposalIcons from "./InfoProposalIcons";

/**
 * In-app "Proposals" module shown alongside communications.
 *
 * Reads the multi-platform manifest (`${BASE_URL}proposals.json`, relative —
 * no absolute domain, ban-resistance) ONCE on mount and merges it with local
 * sessionStorage proposals. The manifest is read-only: local create/vote
 * still lives in sessionStorage; voting on a remote proposal UPSERTS it into
 * the local store so the vote survives and overlays the merged view.
 *
 * Each vote is weighted by the voter's reputation score
 * (`myProfile.reputationScore`), so higher-rated users carry more weight.
 */

interface ProposalsManifest {
  generatedAt: string;
  proposals: Proposal[];
}

const FILTER_OPTIONS: readonly PlatformFilter[] = ["all", ...PLATFORMS];

export default function ProposalsPanel() {
  const { t } = useTranslation();
  const { myProfile } = useAppState();

  // Remote proposals from the read-only manifest (empty until fetched)
  const [remote, setRemote] = useState<Proposal[]>([]);
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>("all");

  // Fetch the manifest ONCE; on failure/!ok/invalid JSON warn and continue
  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}proposals.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`proposals manifest request failed: ${res.status}`);
        return res.json() as Promise<ProposalsManifest>;
      })
      .then((data) => {
        if (cancelled) return;
        if (!data || !Array.isArray(data.proposals)) {
          throw new Error("proposals manifest has an invalid shape");
        }
        setRemote(data.proposals);
      })
      .catch(() => {
        if (!cancelled) console.warn("proposals manifest unavailable; continuing with local");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load existing local proposals or seed defaults
  const [local, setLocal] = useState<Proposal[]>(() => {
    const loaded = loadProposals();
    return loaded.length > 0 ? loaded : seedDefaultProposals();
  });

  // Persist local state changes to sessionStorage
  useEffect(() => {
    saveProposals(local);
  }, [local]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const myKey = myProfile?.id || myProfile?.name || "me";
  const myWeight = myProfile?.reputationScore || 1;

  const merged = useMemo(() => mergeRemoteWithLocal(remote, local), [remote, local]);
  const visible = useMemo(() => filterByPlatform(merged, activeFilter), [merged, activeFilter]);

  const vote = (proposalId: string, choice: "yes" | "no") => {
    const target = merged.find((p) => p.id === proposalId);
    if (!target) return;
    const nextVotes = { ...target.votes };
    nextVotes[myKey] = { vote: choice, weight: myWeight };
    // UPSERT into the local store (works for local AND remote proposals)
    const current = loadProposals();
    const upserted = current.some((p) => p.id === proposalId)
      ? current.map((p) => (p.id === proposalId ? { ...p, votes: nextVotes } : p))
      : [{ ...target, votes: nextVotes }, ...current];
    saveProposals(upserted);
    setLocal(loadProposals());
  };

  const addProposal = () => {
    if (!title.trim()) return;
    storeAddProposal({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
    setLocal(loadProposals());
  };

  const { totalFor, totalAgainst } = useMemo(() => {
    let for_ = 0;
    let against = 0;
    for (const p of merged) {
      for (const v of Object.values(p.votes)) {
        if (v.vote === "yes") for_ += v.weight;
        else against += v.weight;
      }
    }
    return { totalFor: for_, totalAgainst: against };
  }, [merged]);

  return (
    <section className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-bold text-gray-900">{t("communications.proposalsTitle")}</h2>
        <InfoProposalIcons term="chat.proposals" align="left" />
      </div>
      <p className="text-xs text-gray-500 mb-4">{t("communications.proposalsSubtitle")}</p>

      {/* Create proposal */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addProposal();
        }}
        className="mb-4 space-y-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("communications.proposalTitlePlaceholder")}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("communications.proposalDescPlaceholder")}
          rows={2}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md transition-colors"
        >
          {t("communications.createProposal")}
        </button>
      </form>

      {/* Global tally */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-700">{totalFor}</div>
          <div className="text-xs text-green-600">{t("communications.votesFor")}</div>
        </div>
        <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-red-700">{totalAgainst}</div>
          <div className="text-xs text-red-600">{t("communications.votesAgainst")}</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        {t("communications.voteWeightHint", { weight: myWeight })}
      </p>

      {/* Platform filter */}
      <div className="flex flex-wrap gap-2 mb-3" role="group">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActiveFilter(option)}
            className={`py-1 px-2.5 rounded-full text-xs font-semibold transition-colors ${
              activeFilter === option
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t(`communications.proposalPlatformFilter.${option}`)}
          </button>
        ))}
      </div>

      {/* Proposal list */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {visible.length === 0 && (
          <p className="text-sm text-gray-400 text-center">{t("communications.noProposals")}</p>
        )}
        {visible.map((p) => {
          const tally = Object.values(p.votes).reduce(
            (acc, v) => {
              if (v.vote === "yes") acc.for_ += v.weight;
              else acc.against += v.weight;
              return acc;
            },
            { for_: 0, against: 0 },
          );
          const myVote = p.votes[myKey];
          const sourceLabel = p.source ? t("proposals.sourceLabel", { source: p.source }) : null;
          const platformLabel =
            p.platform && p.platform !== "in-app"
              ? t(`communications.proposalPlatformFilter.${p.platform}`)
              : null;
          const statusLabel = p.status ? t(`communications.proposalStatus.${p.status}`) : null;
          return (
            <div key={p.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              {sourceLabel && <div className="text-[10px] text-gray-500 mb-1">{sourceLabel}</div>}
              <div className="font-semibold text-gray-900 text-sm">{p.title}</div>
              {p.description && (
                <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{p.description}</p>
              )}
              {platformLabel && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-block py-0.5 px-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-semibold">
                    {platformLabel}
                  </span>
                  {statusLabel && (
                    <span className="inline-block py-0.5 px-2 rounded-full bg-gray-100 border border-gray-300 text-gray-600 text-[10px] font-semibold">
                      {statusLabel}
                    </span>
                  )}
                  {p.platformUrl && (
                    <a
                      href={p.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      {t("communications.proposalViewOn", { platform: platformLabel })}
                    </a>
                  )}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => vote(p.id, "yes")}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                    myVote?.vote === "yes"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {t("communications.yes")} ({tally.for_})
                </button>
                <button
                  onClick={() => vote(p.id, "no")}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                    myVote?.vote === "no"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {t("communications.no")} ({tally.against})
                </button>
              </div>
              {myVote && (
                <p className="text-[10px] text-gray-400 mt-1">
                  {t("communications.youVotedWeight", { weight: myVote.weight })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
