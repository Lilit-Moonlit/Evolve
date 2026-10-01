// SafetyDashboard.tsx
// Default export React component for the authenticated user's Safety center page.
// Implements STD status, public link management, lab QR, and compatibility checks.

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import LabPatientQR from "../components/LabPatientQR";

const apiFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

// Types from AppContext (inferred)
interface UserProfile {
  id: string;
  name: string;
  imageUrl?: string;
  stdTestResult?: string;
  verifiedStd: boolean;
  verifiedDna: boolean;
  reputationScore: number;
}

interface Check {
  id: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  requester: {
    userId: string;
    username: string;
    name: string;
    imageUrl?: string;
    verifiedStd: boolean;
    verifiedDna: boolean;
    rating: number;
  };
}

interface InboxCheck extends Check {
  direction: "incoming" | "outgoing";
  other: {
    userId: string;
    username: string;
    name: string;
    imageUrl?: string;
    verifiedStd: boolean;
    verifiedDna: boolean;
    rating: number;
  };
  verdict: string | null;
}

function SafetyDashboard() {
  const { t } = useTranslation();
  const { myProfile } = useAppState();
  const userId = myProfile?.id || "";

  // Public link state
  const [publicLink, setPublicLink] = useState<{ username: string | null; enabled: boolean }>({
    username: null,
    enabled: false,
  });
  const [publicLinkLoading, setPublicLinkLoading] = useState(false);
  const [publicLinkError, setPublicLinkError] = useState<string | null>(null);

  // Compatibility checks
  const [pendingChecks, setPendingChecks] = useState<Check[]>([]);
  const [inboxChecks, setInboxChecks] = useState<InboxCheck[]>([]);
  const [checksLoading, setChecksLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchPublicLink();
    fetchChecks();
  }, []);

  const fetchPublicLink = async () => {
    try {
      const res = await apiFetch("/api/public-link/me");
      if (res.ok) {
        const data = await res.json();
        setPublicLink({ username: data.username, enabled: data.publicLinkEnabled });
      } else if (res.status === 401) {
        // Not authenticated — treat as disabled
        setPublicLink({ username: null, enabled: false });
      } else {
        throw new Error(`Public link fetch failed: ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to fetch public link", e);
      setPublicLinkError(t("safety.publicLink.error"));
    }
  };

  const fetchChecks = async () => {
    setChecksLoading(true);
    try {
      const [pendingRes, inboxRes] = await Promise.all([
        apiFetch("/api/checks/pending"),
        apiFetch("/api/checks/inbox"),
      ]);
      const pendingData = pendingRes.ok ? await pendingRes.json() : { checks: [] };
      const inboxData = inboxRes.ok ? await inboxRes.json() : { checks: [] };

      // Transform inbox checks
      const transformedInbox = inboxData.checks.map((c: any) => ({
        ...c,
        direction: "incoming" as const,
        other: c.requester,
        requester: undefined,
      }));

      setPendingChecks(pendingData.checks);
      setInboxChecks(transformedInbox);
    } catch (e) {
      console.error("Failed to fetch checks", e);
    } finally {
      setChecksLoading(false);
    }
  };

  const updatePublicLink = async (payload: { username?: string; enabled?: boolean }) => {
    setPublicLinkLoading(true);
    setPublicLinkError(null);
    try {
      const res = await apiFetch("/api/public-link/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setPublicLink({ username: data.username, enabled: data.publicLinkEnabled });
        if (payload.username && !publicLink.enabled && payload.enabled) {
          // Username was added and enabled — show success
          setPublicLinkError(t("safety.publicLink.saved"));
        }
      } else {
        const err = await res.json();
        if (err.error === "username_taken") {
          setPublicLinkError(t("safety.publicLink.taken"));
        } else if (err.error === "invalid_username") {
          setPublicLinkError(t("safety.publicLink.invalid"));
        } else {
          throw new Error(err.error);
        }
      }
    } catch (e) {
      console.error("Failed to update public link", e);
      setPublicLinkError(t("safety.publicLink.error"));
    } finally {
      setPublicLinkLoading(false);
    }
  };

  const handleEnable = () => {
    const usernameInput = prompt(t("safety.publicLink.usernamePrompt"));
    if (!usernameInput) return;
    const trimmed = usernameInput.trim();
    if (!/^[a-z0-9._]{3,40}$/.test(trimmed)) {
      setPublicLinkError(t("safety.publicLink.invalid"));
      return;
    }
    updatePublicLink({ username: trimmed, enabled: true });
  };

  const handleDisable = () => {
    updatePublicLink({ enabled: false });
  };

  const handleCopyLink = () => {
    if (!publicLink.username) return;
    const link = `${window.location.origin}/p/${publicLink.username}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Show copied feedback via toast would be ideal; here we flash text
        const btn = document.getElementById("copy-link-btn");
        if (btn) {
          btn.textContent = t("safety.publicLink.copied");
          setTimeout(() => {
            if (btn) btn.textContent = t("safety.publicLink.copy");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Clipboard write failed", err);
      });
  };

  const handleCheckResponse = async (checkId: string, approve: boolean) => {
    try {
      const res = await apiFetch(`/api/checks/${checkId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh both pending and inbox
        fetchChecks();
      }
    } catch (e) {
      console.error("Failed to respond to check", e);
    }
  };

  // Verdict color mapping
  const verdictColors = {
    safe: "bg-emerald-50 border-emerald-200 text-emerald-800",
    compatible: "bg-blue-50 border-blue-200 text-blue-800",
    caution: "bg-amber-50 border-amber-200 text-amber-800",
    risk: "bg-red-50 border-red-200 text-red-800",
    incomplete: "bg-gray-50 border-gray-200 text-gray-800",
  };

  const verdictLabels = {
    safe: t("safety.verdict.safe"),
    compatible: t("safety.verdict.compatible"),
    caution: t("safety.verdict.caution"),
    risk: t("safety.verdict.risk"),
    incomplete: t("safety.verdict.incomplete"),
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("safety.title")}</h1>
        <p className="text-gray-600">{t("safety.subtitle")}</p>
      </div>

      {/* STD Status Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("safety.stdStatus.title")}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {myProfile?.stdUploaded
                ? t("safety.stdStatus.verified")
                : t("safety.stdStatus.notVerified")}
            </p>
            {!myProfile?.stdUploaded && (
              <p className="text-xs text-gray-500">{t("safety.stdStatus.hint")}</p>
            )}
          </div>
          {myProfile?.stdUploaded && (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Public Link Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("safety.publicLink.title")}</h2>
        <p className="text-sm text-gray-600 mb-4">{t("safety.publicLink.hint")}</p>
        {publicLinkLoading && <div className="text-sm text-gray-500">{t("common.loading")}</div>}
        {publicLinkError && <div className="text-sm text-red-600 mb-2">{publicLinkError}</div>}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t("safety.publicLink.usernamePlaceholder")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={publicLink.username || ""}
            onChange={(e) => {
              const trimmed = e.target.value.trim();
              setPublicLink((prev) => ({ ...prev, username: trimmed || null }));
            }}
            disabled={!publicLink.enabled}
          />
          {publicLink.enabled ? (
            <button
              onClick={handleDisable}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              {t("safety.publicLink.disable")}
            </button>
          ) : (
            <button
              onClick={handleEnable}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {t("safety.publicLink.enable")}
            </button>
          )}
        </div>
        {publicLink.enabled && publicLink.username && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 font-medium">
                {t("safety.publicLink.enabled")}
              </span>
              <button
                id="copy-link-btn"
                onClick={handleCopyLink}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t("safety.publicLink.copy")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lab QR Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("safety.qr.title")}</h2>
        <p className="text-sm text-gray-600 mb-4">{t("safety.qr.hint")}</p>
        {userId && (
          <div className="flex justify-center">
            <LabPatientQR userId={userId} size={180} />
          </div>
        )}
      </div>

      {/* Compatibility Checks */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("safety.checks.title")}</h2>
        {checksLoading && <div className="text-sm text-gray-500">{t("common.loading")}</div>}
        {!checksLoading && (
          <>
            {/* Incoming Requests */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {t("safety.checks.incoming")}
              </h3>
              {pendingChecks.length === 0 ? (
                <p className="text-sm text-gray-500">{t("safety.checks.empty")}</p>
              ) : (
                <div className="space-y-3">
                  {pendingChecks.map((check) => (
                    <div
                      key={check.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={check.requester.imageUrl || ""}
                          alt={check.requester.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const initials = check.requester.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();
                              e.currentTarget.style.display = "none";
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm";
                              fallback.textContent = initials;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{check.requester.name}</div>
                          <div className="text-xs text-gray-500">@{check.requester.username}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(check.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCheckResponse(check.id, true)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          {t("safety.checks.approve")}
                        </button>
                        <button
                          onClick={() => handleCheckResponse(check.id, false)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          {t("safety.checks.deny")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing History */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {t("safety.checks.outgoing")}
              </h3>
              {inboxChecks.length === 0 ? (
                <p className="text-sm text-gray-500">{t("safety.checks.empty")}</p>
              ) : (
                <div className="space-y-3">
                  {inboxChecks.map((check) => (
                    <div
                      key={check.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={check.other.imageUrl || ""}
                          alt={check.other.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const initials = check.other.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();
                              e.currentTarget.style.display = "none";
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm";
                              fallback.textContent = initials;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{check.other.name}</div>
                          <div className="text-xs text-gray-500">@{check.other.username}</div>
                        </div>
                        {check.verdict && (
                          <div
                            className={`px-2 py-1 rounded text-xs font-semibold ${verdictColors[check.verdict as keyof typeof verdictColors] || verdictColors.incomplete}`}
                          >
                            {verdictLabels[check.verdict as keyof typeof verdictLabels] ||
                              verdictLabels.incomplete}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(check.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SafetyDashboard;
