import React from "react";
import { STRProfile } from "../lib/dna-parser";
import { useTranslation } from "react-i18next";

interface DNAProfileProps {
  profile: STRProfile | null;
  isVerified: boolean;
  onRevoke: () => void;
  isRevoking: boolean;
}

const DNAProfile: React.FC<DNAProfileProps> = ({ profile, isVerified, onRevoke, isRevoking }) => {
  const { t } = useTranslation();

  if (!profile) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        {t("dna.profile.notVerified")}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold">{t("dna.profile.title")}</h3>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-medium">
          {isVerified ? t("dna.profile.verified") : t("dna.profile.notVerified")}
        </span>
        {isVerified ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            &#10004; {t("dna.profile.verified")}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            &#x2716; {t("dna.profile.notVerified")}
          </span>
        )}
      </div>

      {profile.haplogroup && (
        <div>
          <p className="text-sm text-gray-500">{t("dna.profile.haplogroup")}:</p>
          <p className="font-medium">{profile.haplogroup}</p>
        </div>
      )}

      {Object.keys(profile.markers).length > 0 && (
        <div>
          <p className="text-sm text-gray-500">{t("dna.profile.markers")}:</p>
          <ul className="list-disc list-inside ml-4">
            {Object.entries(profile.markers).map(([marker, value]) => (
              <li key={marker}>
                {marker}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isVerified && (
        <button
          onClick={onRevoke}
          disabled={isRevoking}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${isRevoking ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"}
          `}
        >
          {isRevoking ? "Revoking..." : t("dna.profile.revoke")}
        </button>
      )}
    </div>
  );
};

export default DNAProfile;
