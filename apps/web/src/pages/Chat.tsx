import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";

export default function Chat() {
  const { t } = useTranslation();
  const { profiles, addMessage, requestAccess, approveAccess, denyAccess } =
    useAppState();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedProfile?.chatHistory]);

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

  return (
    <div className="flex h-[calc(100vh-12rem)] w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Profile list sidebar */}
      <aside className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">{t("chat.title")}</h2>
          <p className="text-sm text-gray-500">{t("chat.subtitle")}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {profiles.length === 0 && (
            <p className="p-4 text-sm text-gray-400 text-center">
              {t("chat.noMatches")}
            </p>
          )}
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfileId(profile.id)}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-white transition-colors ${
                selectedProfileId === profile.id ? "bg-white shadow-sm" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {profile.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {profile.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {profile.verifiedStd && profile.verifiedDna
                      ? t("profile.status.verified")
                      : t("chat.pendingVerification")}
                  </div>
                </div>
              </div>
            </button>
          ))}
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
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {selectedProfile.name[0]}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {selectedProfile.name}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedProfile.verifiedStd && selectedProfile.verifiedDna
                    ? `✅ ${t("profile.status.verified")}`
                    : `⚠️ ${t("chat.pendingVerification")}`}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedProfile.chatHistory.map((msg) => (
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
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Access request buttons */}
            {permissions && (
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
                    className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
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
          </>
        )}
      </main>
    </div>
  );
}
