import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import { PROFILE_KINDS, kindToGender, kindToLookingFor } from "../lib/profile-kind";

/**
 * Mandatory "Ким ви є" selection for legacy accounts that registered before
 * the profile-kind feature (their `searchDetails.kind` is empty). Without a
 * kind the Who-search filter cannot match the profile correctly, so the
 * modal has NO skip/close path — the user declares their kind once.
 *
 * Saves `kind` + derived `gender` (and `lookingFor` for couples) via
 * persistProfile; hides automatically once `searchDetails.kind` is set.
 */
const KindSelectModal: React.FC = () => {
  const { t } = useTranslation();
  const { myProfile, saveProfile } = useAppState();
  const [selectedKind, setSelectedKind] = useState<string>("");
  const [saving, setSaving] = useState(false);

  if (!myProfile.id || myProfile.searchDetails?.kind) return null;

  const handleConfirm = async () => {
    if (!selectedKind || saving) return;
    setSaving(true);
    try {
      const lookingFor = kindToLookingFor(selectedKind);
      await saveProfile({
        kind: selectedKind,
        gender: kindToGender(selectedKind),
        ...(lookingFor ? { lookingFor } : {}),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-xl font-bold text-white text-center mb-2">{t("profileKind.title")}</h2>
        <p className="text-sm text-gray-400 text-center mb-6">{t("kindModal.description")}</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PROFILE_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedKind(k)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedKind === k
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-900 border-slate-600 text-gray-300 hover:border-blue-400"
              }`}
            >
              {t(`profileKind.${k}`)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={!selectedKind || saving}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium transition"
        >
          {t("kindModal.confirm")}
        </button>
      </div>
    </div>
  );
};

export default KindSelectModal;
