import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import { ProfileData } from "../store/AppContext";
import { getCompatibilityLabel } from "../lib/std-parser";

type Tab = "messages" | "discover";

const levelOrder = { normal: 1, "pregnancy-bond": 2, "cryptic-choice": 3 };

function canSeeProfile(viewerMode: string, target: ProfileData): boolean {
  if (!target.hideProfileFromLowerLevels) return true;
  const viewerLevel = levelOrder[viewerMode as keyof typeof levelOrder] || 1;
  const targetLevel =
    levelOrder[target.authMode as keyof typeof levelOrder] || 1;
  return viewerLevel >= targetLevel;
}

function canSeeContent(viewerMode: string, target: ProfileData): boolean {
  if (!target.hideProfileFromLowerLevels) return true;
  const viewerLevel = levelOrder[viewerMode as keyof typeof levelOrder] || 1;
  const targetLevel =
    levelOrder[target.authMode as keyof typeof levelOrder] || 1;
  if (viewerLevel >= targetLevel) return true;
  return false;
}

export default function Chat() {
  const { t } = useTranslation();
  const {
    profiles,
    addMessage,
    requestAccess,
    approveAccess,
    denyAccess,
    authMode,
    checkCompatibility,
  } = useAppState();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("messages");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedProfile?.chatHistory]);

  const matchedProfiles = profiles.filter((p) => p.chatHistory.length > 0);
  const allProfiles = profiles;

  const visibleProfiles =
    activeTab === "messages" ? matchedProfiles : allProfiles;

  const handleSend = async () => {
    if (!messageText.trim() || !selectedProfileId) return;
    await addMessage(selectedProfileId, messageText);
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRequestAccess = (testType: "STD" | "DNA") => {
    if (selectedProfileId) requestAccess(selectedProfileId, testType, t);
  };

  const handleApprove = (testType: "STD" | "DNA") => {
    if (selectedProfileId) approveAccess(selectedProfileId, testType, t);
  };

  const handleDeny = (testType: "STD" | "DNA") => {
    if (selectedProfileId) denyAccess(selectedProfileId, testType, t);
  };

  const permissions = selectedProfile?.accessPermissions;
  const showContent = selectedProfile
    ? canSeeContent(authMode, selectedProfile)
    : true;

  return (
    <div className="flex h-[calc(100vh-12rem)] w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "messages"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("chat.title")}
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "discover"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("navigation.swipe")}
          </button>
        </div>

        {/* Profile list */}
        <div className="flex-1 overflow-y-auto">
          {visibleProfiles.length === 0 && (
            <p className="p-4 text-sm text-gray-400 text-center">
              {activeTab === "messages"
                ? t("chat.noMatches")
                : t("home.filters.noProfiles")}
            </p>
          )}
          {visibleProfiles.map((profile) => {
            const visible = canSeeProfile(authMode, profile);
            return (
              <button
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-white transition-colors ${
                  selectedProfileId === profile.id ? "bg-white shadow-sm" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {profile.imageUrl && visible ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {profile.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {visible ? profile.name : "•••"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {visible
                        ? profile.verifiedStd && profile.verifiedDna
                          ? t("profile.status.verified")
                          : t("chat.pendingVerification")
                        : t("chat.hiddenProfile")}
                    </div>
                    {!visible && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {profile.reputationScore}
                        </span>
                      </div>
                    )}
                    {profile.parsedStd &&
                      profile.parsedStd.pathogens.length > 0 && (
                        <div className="mt-1">
                          {(() => {
                            const compat = checkCompatibility(profile);
                            const label = getCompatibilityLabel(compat);
                            return (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  label.color === "green"
                                    ? "bg-green-100 text-green-800"
                                    : label.color === "blue"
                                      ? "bg-blue-100 text-blue-800"
                                      : label.color === "yellow"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {label.icon} {label.label}
                              </span>
                            );
                          })()}
                        </div>
                      )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {!selectedProfile ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>{t("chat.selectChat")}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              {selectedProfile.imageUrl &&
              canSeeProfile(authMode, selectedProfile) ? (
                <img
                  src={selectedProfile.imageUrl}
                  alt={selectedProfile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {selectedProfile.name[0]}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900">
                  {canSeeProfile(authMode, selectedProfile)
                    ? selectedProfile.name
                    : "•••"}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedProfile.verifiedStd && selectedProfile.verifiedDna
                    ? `✅ ${t("profile.status.verified")}`
                    : `⚠️ ${t("chat.pendingVerification")}`}
                  {!canSeeProfile(authMode, selectedProfile) && (
                    <span className="ml-2 inline-flex items-center gap-0.5">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-700">
                        {selectedProfile.reputationScore}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!showContent && selectedProfile.chatHistory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 h-full">
                  <p>{t("chat.hiddenContent")}</p>
                </div>
              ) : (
                selectedProfile.chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-xl px-4 py-2 ${
                        msg.sender === "me"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div
                        className={`text-xs mt-1 ${msg.sender === "me" ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Profile info (when viewing discover tab and profile is visible) */}
            {activeTab === "discover" && showContent && (
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {t("profile.reputation.score")}:{" "}
                    <strong className="text-gray-900">
                      {selectedProfile.reputationScore}
                    </strong>
                  </span>
                  {selectedProfile.interests.length > 0 && (
                    <span className="truncate">
                      {selectedProfile.interests.slice(0, 3).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Access request buttons */}
            {permissions && showContent && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-2">
                {!permissions.stdRequested && (
                  <button
                    onClick={() => handleRequestAccess("STD")}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    🔬 {t("chat.requestStd")}
                  </button>
                )}
                {!permissions.dnaRequested && (
                  <button
                    onClick={() => handleRequestAccess("DNA")}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    🧬 {t("chat.requestDna")}
                  </button>
                )}
                {permissions.stdRequested &&
                  !permissions.myStdApprovedToThem && (
                    <>
                      <button
                        onClick={() => handleApprove("STD")}
                        className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        ✅ {t("chat.approveStd")}
                      </button>
                      <button
                        onClick={() => handleDeny("STD")}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        ❌ {t("chat.denyStd")}
                      </button>
                    </>
                  )}
                {permissions.dnaRequested &&
                  !permissions.myDnaApprovedToThem && (
                    <>
                      <button
                        onClick={() => handleApprove("DNA")}
                        className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        ✅ {t("chat.approveDna")}
                      </button>
                      <button
                        onClick={() => handleDeny("DNA")}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        ❌ {t("chat.denyDna")}
                      </button>
                    </>
                  )}
              </div>
            )}

            {/* Input */}
            {showContent && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("chat.inputPlaceholder")}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
                  >
                    {t("chat.send")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
