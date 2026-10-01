import React from "react";
import { useTranslation } from "react-i18next";

export type VerificationGender = "male" | "female";
export type VerificationSearchMode =
  | "normal"
  | "pregnancy-bond"
  | "cryptic-choice";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: VerificationSearchMode;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const modeLabelKey =
    mode === "pregnancy-bond"
      ? "home.filters.modePregnancyBond"
      : mode === "cryptic-choice"
        ? "home.filters.modeCrypticChoice"
        : "home.filters.modeNormal";

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label={t("verificationModal.title")}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-1">
          {t("verificationModal.title")}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t("verificationModal.description")}:{" "}
          <span className="font-medium text-gray-700">{t(modeLabelKey)}</span>
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">
              {t("verificationModal.womenRequirements")}
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>{t("verificationModal.requirement.std")}</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 text-sm mb-2">
              {t("verificationModal.menRequirements")}
            </h4>
            <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
              <li>{t("verificationModal.requirement.std")}</li>
              <li>{t("verificationModal.requirement.dna")}</li>
              <li>{t("verificationModal.requirement.evolveFund")}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            aria-label={t("verificationModal.close")}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("verificationModal.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
