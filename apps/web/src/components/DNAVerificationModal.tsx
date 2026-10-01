import React from "react";
import { STRProfile } from "../lib/dna-parser";
import { useTranslation } from "react-i18next";

interface DNAVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToVerify: STRProfile | null;
  onConfirm: () => void;
  isConfirming: boolean;
  error: string | null;
}

const DNAVerificationModal: React.FC<DNAVerificationModalProps> = ({
  isOpen,
  onClose,
  profileToVerify,
  onConfirm,
  isConfirming,
  error,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-4">{t("dna.upload.verify")}</h3>

        {!profileToVerify ? (
          <p className="text-red-600">Error: No DNA profile provided for verification.</p>
        ) : (
          <div className="space-y-3">
            <p>{t("dna.upload.parsing")}</p>
            {profileToVerify.haplogroup && (
              <div>
                <p className="text-sm text-gray-500">{t("dna.profile.haplogroup")}:</p>
                <p className="font-medium">{profileToVerify.haplogroup}</p>
              </div>
            )}
            {Object.keys(profileToVerify.markers).length > 0 && (
              <div>
                <p className="text-sm text-gray-500">{t("dna.profile.markers")}:</p>
                <ul className="list-disc list-inside ml-4">
                  {Object.entries(profileToVerify.markers).map(([marker, value]) => (
                    <li key={marker}>
                      {marker}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4">Error: {error}</p>}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!profileToVerify || isConfirming}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${!profileToVerify || isConfirming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}
            `}
          >
            {isConfirming ? t("dna.upload.verifying") : t("dna.upload.verify")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DNAVerificationModal;
