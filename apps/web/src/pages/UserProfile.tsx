import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { useAppState } from "../store/AppContext";
import { getCompatibilityLabel } from "../lib/std-parser";
import { languageFlag, languageName } from "../lib/languages";
import type { ProfileData } from "../store/AppContext";
import PhotoView from "../components/PhotoView";

export default function UserProfile() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    profiles,
    requestAccess,
    checkCompatibility,
    myProfile,
    requestPhotoAccess,
    canViewTheirPhoto,
  } = useAppState();

  const profile = profiles.find((p: ProfileData) => p.id === id);

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500 font-medium">{t("userProfile.notFound")}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {t("userProfile.backToHome")}
        </button>
      </div>
    );
  }

  const compat = profile.parsedStd ? checkCompatibility(profile) : null;
  const label = compat ? getCompatibilityLabel(compat) : null;

  const photoVisible = canViewTheirPhoto(profile);
  const myGrant = profile.photoGrants?.[myProfile.id];
  const tempUntil = myGrant?.kind === "temporary" ? (myGrant.expiresAt ?? 0) : 0;

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
      >
        <FaArrowLeft /> {t("userProfile.back")}
      </button>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="profile-image-container h-56 bg-gray-100">
          <PhotoView
            imageUrl={profile.imageUrl}
            alt={profile.name}
            blurred={profile.photoBlurred || false}
            visible={photoVisible}
            temporaryUntil={tempUntil}
            showRequest={Boolean(profile.photoBlurred) && !photoVisible}
            onRequestClick={() => requestPhotoAccess(profile.id, t).catch(() => {})}
            className="w-full h-full"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.name}
                <span className="ml-2 text-lg font-semibold text-gray-400">
                  {profile.ageHidden ? t("userProfile.ageHidden") : profile.age}
                </span>
              </h2>
            </div>
            {profile.verifiedStd && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {t("userProfile.verifiedStd")}
              </span>
            )}
          </div>

          {profile.languages && profile.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                >
                  {languageFlag(lang)} {languageName(lang)}
                </span>
              ))}
            </div>
          )}

          {profile.photoBlurred && (
            <p className="text-xs text-gray-400 mt-2">
              {photoVisible
                ? myGrant?.kind === "permanent"
                  ? t("photo.accessPermanent")
                  : t("photo.accessTemporary")
                : t("photo.accessNone")}
            </p>
          )}

          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <FaStar />
            <span className="font-semibold text-gray-700">{profile.reputationScore}</span>
          </div>

          <p className="text-gray-600 mt-4">{profile.bio}</p>

          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.map((interest, idx) => (
                <span key={idx} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          )}

          {label && (
            <div
              className={`mt-4 p-3 rounded-lg ${
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
                {label.icon} <span className="font-semibold">{label.label}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{t("userProfile.accessTitle")}</h3>
        <p className="text-sm text-gray-500 mb-4">{t("userProfile.accessDescription")}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => requestAccess(profile.id, "STD", t).catch(() => {})}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            {t("userProfile.requestStd")}
          </button>
          <button
            onClick={() => requestAccess(profile.id, "DNA", t).catch(() => {})}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
          >
            {t("userProfile.requestDna")}
          </button>
        </div>
      </section>
    </div>
  );
}
