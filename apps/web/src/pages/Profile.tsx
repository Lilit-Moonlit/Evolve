import React, { useState } from "react";
import { useAppState, PDFDocument } from "../store/AppContext";
import { useTranslation } from "react-i18next";
import { useAccount, useBalance } from "wagmi";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { myProfile, uploadDocument, authMode, setAuthMode } = useAppState();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [activeTab, setActiveTab] = useState<"profile" | "reputation">(
    "profile",
  );
  const [uploadingDoc, setUploadingDoc] = useState<{
    file: File | null;
    type: "STD" | "DNA";
    redactedFields: string[];
  }>({
    file: null,
    type: "STD",
    redactedFields: [],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingDoc((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const toggleRedaction = (field: string) => {
    setUploadingDoc((prev) => ({
      ...prev,
      redactedFields: prev.redactedFields.includes(field)
        ? prev.redactedFields.filter((f) => f !== field)
        : [...prev.redactedFields, field],
    }));
  };

  const handleUpload = () => {
    if (!uploadingDoc.file) return;

    const newDoc: PDFDocument = {
      name: uploadingDoc.file.name,
      size: (uploadingDoc.file.size / 1024).toFixed(2) + " KB",
      type: uploadingDoc.type,
      uploadDate: new Date().toLocaleDateString(),
      isRedacted: uploadingDoc.redactedFields.length > 0,
      redactedFields: uploadingDoc.redactedFields,
      status: "encrypted",
      resultText:
        uploadingDoc.type === "STD"
          ? "NEGATIVE for all common pathogens (HIV-1/2, Syphilis, Chlamydia, Gonorrhea, HSV-1/2)"
          : "STR Profile: D3S1358[15,18], vWA[16,17], FGA[21,24]...",
    };

    uploadDocument(newDoc);
    setUploadingDoc({ file: null, type: "STD", redactedFields: [] });
    alert(t("profile.upload.uploadSuccess"));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 px-4 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-600 font-bold" : "text-gray-500"}`}
        >
          {t("profile.tabs.profile")}
        </button>
        <button
          onClick={() => setActiveTab("reputation")}
          className={`pb-2 px-4 ${activeTab === "reputation" ? "border-b-2 border-blue-500 text-blue-600 font-bold" : "text-gray-500"}`}
        >
          {t("profile.tabs.reputation")}
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="space-y-8">
          {/* Dating Mode Selector */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-2">
              {t("auth.modeSelector.title") || "Select Mode"}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {t("auth.modeSelector.description") ||
                "Change your active dating mode"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setAuthMode("normal")}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  authMode === "normal"
                    ? "border-pink-500 bg-pink-50/50 text-pink-700 font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                }`}
              >
                <span className="text-3xl mb-1 font-emoji">💜</span>
                <span className="text-base font-bold">
                  {t("auth.modeSelector.normal.label")}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {t("auth.modeSelector.normal.description")}
                </span>
              </button>
              <button
                onClick={() => setAuthMode("pregnancy-bond")}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  authMode === "pregnancy-bond"
                    ? "border-pink-500 bg-pink-50/50 text-pink-700 font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                }`}
              >
                <span className="text-3xl mb-1 font-emoji">🤰</span>
                <span className="text-base font-bold">
                  {t("auth.modeSelector.pregnancyBond.label")}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {t("auth.modeSelector.pregnancyBond.description")}
                </span>
              </button>
              <button
                onClick={() => setAuthMode("cryptic-choice")}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  authMode === "cryptic-choice"
                    ? "border-pink-500 bg-pink-50/50 text-pink-700 font-semibold"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                }`}
              >
                <span className="text-3xl mb-1 font-emoji">🎭</span>
                <span className="text-base font-bold">
                  {t("auth.modeSelector.crypticChoice.label")}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {t("auth.modeSelector.crypticChoice.description")}
                </span>
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">
              {t("profile.myProfile.title")}
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                {myProfile.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{myProfile.name}</h3>
                <p className="text-gray-500">
                  {t("profile.myProfile.verifiedUser")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">
                  {t("profile.status.stdStatus")}
                </p>
                <p
                  className={`text-lg font-bold ${myProfile.stdUploaded ? "text-green-600" : "text-red-500"}`}
                >
                  {myProfile.stdUploaded
                    ? t("profile.status.uploaded")
                    : t("profile.status.notUploaded")}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">
                  {t("profile.status.dnaStatus")}
                </p>
                <p
                  className={`text-lg font-bold ${myProfile.dnaUploaded ? "text-green-600" : "text-red-500"}`}
                >
                  {myProfile.dnaUploaded
                    ? t("profile.status.uploaded")
                    : t("profile.status.notUploaded")}
                </p>
              </div>
            </div>
          </section>

          {isConnected && address && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">
                {t("profile.wallet.title")}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    {t("profile.wallet.address")}
                  </span>
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    {t("profile.wallet.balance")}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {balance
                      ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
                      : "—"}
                  </span>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">
              {t("profile.upload.title")}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <select
                  value={uploadingDoc.type}
                  onChange={(e) =>
                    setUploadingDoc((prev) => ({
                      ...prev,
                      type: e.target.value as "STD" | "DNA",
                    }))
                  }
                  className="p-2 border rounded-md bg-white"
                >
                  <option value="STD">{t("profile.upload.stdTest")}</option>
                  <option value="DNA">{t("profile.upload.dnaTest")}</option>
                </select>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm font-medium mb-2">
                  {t("profile.upload.redactFields")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    t("profile.upload.fullName"),
                    t("profile.upload.address"),
                    t("profile.upload.phoneNumber"),
                    t("profile.upload.patientId"),
                  ].map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={uploadingDoc.redactedFields.includes(field)}
                        onChange={() => toggleRedaction(field)}
                      />
                      {field}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!uploadingDoc.file}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-300 transition-colors"
              >
                {t("profile.upload.encryptUpload")}
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {t("profile.documents.title")}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {myProfile.uploadedDocs.length === 0 && (
                <p className="text-gray-500">
                  {t("profile.documents.noDocuments")}
                </p>
              )}
              {myProfile.uploadedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border rounded-lg flex justify-between items-center shadow-sm"
                >
                  <div>
                    <p className="font-bold">{doc.name}</p>
                    <p className="text-xs text-gray-400">
                      {doc.type} • {doc.uploadDate} • {doc.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${doc.status === "decrypted" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {doc.status.toUpperCase()}
                    </span>
                    {doc.status === "decrypted" ? (
                      <div className="text-sm text-gray-600 italic max-w-xs truncate">
                        {doc.resultText}
                      </div>
                    ) : (
                      <div
                        className="w-12 h-4 bg-gray-300 rounded animate-pulse"
                        title="Encrypted content"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "reputation" && (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-6">
              {t("profile.reputation.title")}
            </h2>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={
                    440 - (440 * myProfile.reputationScore) / 10
                  }
                  strokeLinecap="round"
                  className="text-blue-600 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-800">
                  {myProfile.reputationScore}
                </span>
                <span className="text-xs text-gray-500 uppercase font-bold">
                  {t("profile.reputation.score")}
                </span>
              </div>
            </div>
            <p className="mt-6 text-gray-600 max-w-md">
              {t("profile.reputation.description")}
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">
              {t("profile.reputation.votersTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProfile.voters.map((voter, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {voter.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{voter.name}</p>
                      <p className="text-xs text-gray-500">{voter.relation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">
                      {t("profile.reputation.weight")} {voter.weight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
export default Profile;
