import React, { useState } from "react";
import { FaHeart, FaTimes, FaUser, FaStar } from "react-icons/fa";
import { useAppState } from "../store/AppContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ProfileData } from "../store/AppContext";
import { getCompatibilityLabel } from "../lib/std-parser";

const levelOrder = { normal: 1, "pregnancy-bond": 2, "cryptic-choice": 3 };

function canSeeProfile(viewerMode: string, target: ProfileData): boolean {
  if (!target.hideProfileFromLowerLevels) return true;
  const viewerLevel = levelOrder[viewerMode as keyof typeof levelOrder] || 1;
  const targetLevel =
    levelOrder[target.authMode as keyof typeof levelOrder] || 1;
  return viewerLevel >= targetLevel;
}

export default function Home() {
  const { t } = useTranslation();
  const { profiles, filters, setFilters, authMode, checkCompatibility } =
    useAppState();
  const navigate = useNavigate();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const filteredProfiles = profiles.filter((profile) => {
    if (filters.onlyVerifiedStd && !profile.verifiedStd) return false;
    if (filters.onlyVerifiedDna && !profile.verifiedDna) return false;
    if (!canSeeProfile(authMode, profile)) return false;
    return true;
  });

  const handleSwipe = (direction: "left" | "right") => {
    if (filteredProfiles.length === 0) return;
    console.log(
      `Swiped ${direction} on ${filteredProfiles[currentProfileIndex].name}`,
    );
    if (currentProfileIndex < filteredProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      alert(t("home.profile.noMoreProfiles"));
      setCurrentProfileIndex(0);
    }
  };

  const currentProfile = filteredProfiles[currentProfileIndex];
  const profileVisible = currentProfile
    ? canSeeProfile(authMode, currentProfile)
    : false;

  if (!authMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {t("auth.noMode.title")}
        </h2>
        <p className="text-gray-400">{t("auth.noMode.description")}</p>
        <button
          onClick={() => navigate("/profile/settings")}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
        >
          {t("auth.noMode.button")}
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero">
        <h2>{t("home.hero.title")}</h2>
        <p>{t("home.hero.subtitle")}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyVerifiedStd}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                onlyVerifiedStd: e.target.checked,
              }))
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {t("home.filters.verifiedStd")}
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyVerifiedDna}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                onlyVerifiedDna: e.target.checked,
              }))
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {t("home.filters.verifiedDna")}
        </label>
      </div>
      {filteredProfiles.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">
            {t("home.filters.noProfiles")}
          </p>
        </div>
      ) : (
        <>
          <div className="card-container">
            <div className="profile-card">
              {profileVisible ? (
                <>
                  <div className="profile-image-container">
                    {currentProfile.imageUrl ? (
                      <img
                        src={currentProfile.imageUrl}
                        alt={currentProfile.name}
                        className="profile-img"
                      />
                    ) : (
                      <div className="profile-img-placeholder">
                        <FaUser />
                      </div>
                    )}
                    <span className="profile-tag">
                      {t("home.profile.newMatch")}
                    </span>
                  </div>
                  <div className="profile-info">
                    <div>
                      <div className="profile-header">
                        <h3 className="profile-name">{currentProfile.name}</h3>
                        <span className="profile-age">
                          {currentProfile.age}
                        </span>
                      </div>
                      <p className="profile-bio">{currentProfile.bio}</p>
                    </div>
                    <div className="profile-interests">
                      {currentProfile.interests.map((interest, index) => (
                        <span key={index} className="interest-tag">
                          {interest}
                        </span>
                      ))}
                    </div>
                    {currentProfile.parsedStd &&
                      currentProfile.parsedStd.pathogens.length > 0 &&
                      (() => {
                        const compat = checkCompatibility(currentProfile);
                        const label = getCompatibilityLabel(compat);
                        return (
                          <div
                            className={`mt-3 p-2 rounded-lg ${
                              label.color === "green"
                                ? "bg-green-50 border border-green-200"
                                : label.color === "blue"
                                  ? "bg-blue-50 border border-blue-200"
                                  : label.color === "yellow"
                                    ? "bg-yellow-50 border border-yellow-200"
                                    : "bg-red-50 border border-red-200"
                            }`}
                          >
                            <span className="text-sm">
                              {label.icon}{" "}
                              <span
                                className={`font-semibold ${
                                  label.color === "green"
                                    ? "text-green-800"
                                    : label.color === "blue"
                                      ? "text-blue-800"
                                      : label.color === "yellow"
                                        ? "text-yellow-800"
                                        : "text-red-800"
                                }`}
                              >
                                {label.label}
                              </span>
                            </span>
                          </div>
                        );
                      })()}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <FaUser className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">•••</h3>
                  <div className="flex items-center gap-1 mt-2 text-yellow-500">
                    <FaStar />
                    <span className="font-semibold text-gray-700">
                      {currentProfile.reputationScore}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {t("chat.hiddenProfile")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="action-buttons">
            <button
              className="action-btn dislike"
              onClick={() => handleSwipe("left")}
            >
              <FaTimes />
            </button>
            <button
              className="action-btn like"
              onClick={() => handleSwipe("right")}
            >
              <FaHeart />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
