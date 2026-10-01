import React, { useRef, useState, useEffect, useMemo } from "react";
import { useAppState, PDFDocument } from "../store/AppContext";
import { useTranslation } from "react-i18next";
import { useAccount, useBalance } from "wagmi";
import { getCompatibilityLabel, StdCompatibilityResult } from "../lib/std-parser";
import DNAUpload from "../components/DNAUpload";
import DNAProfile from "../components/DNAProfile";
import DNAVerificationModal from "../components/DNAVerificationModal";
import { STRProfile } from "../lib/dna-parser";
import { LANGUAGES, languageFlag, languageName } from "../lib/languages";
import { fileToDataUrl } from "../lib/image";
import { TESTING_PREFERENCE_OPTIONS } from "../lib/lab-preference";
import { generateLabEmail } from "../lib/lab-report";
import { LOOKING_FOR_OPTIONS } from "../lib/looking-for";
import { PROFILE_KINDS, kindToGender } from "../lib/profile-kind";
import { useLocations, withLegacyOption } from "../lib/locations";
import LabPatientQR from "../components/LabPatientQR";
import InfoProposalIcons from "../components/InfoProposalIcons";
import CompanionProfile from "../components/Companion/Profile";
import DexSwap from "../components/DexSwap";
import {
  chipOptions,
  EYE_COLOR_OPTIONS,
  HAIR_COLOR_OPTIONS,
  BODY_TYPE_OPTIONS,
} from "../lib/search-options";
import { useNavigate } from "react-router-dom";

const GENDER_OPTIONS = [
  { value: "male", labelKey: "filters.genders.male" },
  { value: "female", labelKey: "filters.genders.female" },
  { value: "other", labelKey: "filters.genders.other" },
];

const SKIN_COLOR_OPTIONS = chipOptions(
  ["fair", "light", "medium", "tan", "dark", "deep"],
  "filters.skinColors",
);
const EYE_COLOR_CHIPS = chipOptions(EYE_COLOR_OPTIONS, "filters.eyeColors");
const HAIR_COLOR_CHIPS = chipOptions(HAIR_COLOR_OPTIONS, "filters.hairColors");
const BODY_TYPE_CHIPS = chipOptions(BODY_TYPE_OPTIONS, "filters.bodyTypes");

interface PendingLabReport {
  id: string;
  userId: string;
  source: string;
  rawText: string;
  parsed: {
    safe: boolean;
    riskLevel: string;
    reason?: string;
    pathogens?: { id: string }[];
  } | null;
  status: string;
  createdAt: string;
}

const apiFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const {
    myProfile,
    uploadDocument,
    dnaProfile,
    isDnaVerified,
    isDnaVerifying,
    isDnaRevoking,
    dnaVerificationError,
    setDnaVerificationError,
    uploadDNA,
    verifyDNA,
    revokeDNA,
    profiles,
    saveProfile,
    revokePhotoAccess,
    logout,
  } = useAppState();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const navigate = useNavigate();
  const [labRegistered, setLabRegistered] = useState(() => !!localStorage.getItem("lab_id"));

  // Re-check lab registration on mount (registration happens on the companion
  // lab route — the user may come back to Profile after registering there).
  useEffect(() => {
    setLabRegistered(!!localStorage.getItem("lab_id"));
  }, []);
  const [uploadingDoc, setUploadingDoc] = useState<{
    file: File | null;
    type: "STD" | "DNA";
    redactedFields: string[];
  }>({
    file: null,
    type: "STD",
    redactedFields: [],
  });

  // --- Own profile editing (photo / age / languages / bio) ---
  const [editAge, setEditAge] = useState(myProfile.age || 25);
  const [editAgeHidden, setEditAgeHidden] = useState(myProfile.ageHidden);
  const [editLanguages, setEditLanguages] = useState<string[]>(myProfile.languages || []);
  const [editBio, setEditBio] = useState(myProfile.bio || "");
  const [editImageUrl, setEditImageUrl] = useState<string | undefined>(myProfile.imageUrl);
  const [editPhotoBlurred, setEditPhotoBlurred] = useState(myProfile.photoBlurred);
  const [editPhotoError, setEditPhotoError] = useState<string | null>(null);
  const [editTestingPreference, setEditTestingPreference] = useState<string | undefined>(
    myProfile.searchDetails?.testingPreference,
  );
  const [editGender, setEditGender] = useState<string | undefined>(myProfile.searchDetails?.gender);
  const [editKind, setEditKind] = useState<string | undefined>(myProfile.searchDetails?.kind);
  const [editLookingFor, setEditLookingFor] = useState<string | undefined>(
    myProfile.searchDetails?.lookingFor,
  );
  const [editSkinColor, setEditSkinColor] = useState<string | undefined>(
    myProfile.searchDetails?.skinColor,
  );
  const [editCountry, setEditCountry] = useState(myProfile.searchDetails?.country || "");
  const [editCity, setEditCity] = useState(myProfile.searchDetails?.city || "");
  const [editCanTravel, setEditCanTravel] = useState(myProfile.searchDetails?.canTravel ?? false);
  const [editCanTravelCountries, setEditCanTravelCountries] = useState<Set<string>>(
    () => new Set(myProfile.searchDetails?.canTravelCountries ?? []),
  );
  // Cascading Country → City dropdown data (lazy-loaded offline dataset).
  const locationIndex = useLocations();
  const [editHeight, setEditHeight] = useState(
    myProfile.searchDetails?.height != null ? String(myProfile.searchDetails.height) : "",
  );
  const [editWeight, setEditWeight] = useState(
    myProfile.searchDetails?.weight != null ? String(myProfile.searchDetails.weight) : "",
  );
  const [editEyeColor, setEditEyeColor] = useState<string | undefined>(
    myProfile.searchDetails?.eyeColor,
  );
  const [editHairColor, setEditHairColor] = useState<string | undefined>(
    myProfile.searchDetails?.hairColor,
  );
  const [editBodyType, setEditBodyType] = useState<string | undefined>(
    myProfile.searchDetails?.bodyType,
  );
  const [editSmoking, setEditSmoking] = useState<boolean | undefined>(
    myProfile.searchDetails?.smoking,
  );
  const [editDrinking, setEditDrinking] = useState<boolean | undefined>(
    myProfile.searchDetails?.drinking,
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [pendingReports, setPendingReports] = useState<PendingLabReport[]>([]);
  const [labLoading, setLabLoading] = useState(false);
  const [labEmail, setLabEmail] = useState<string | null>(null);
  const [labEmailError, setLabEmailError] = useState<string | null>(null);
  const [labActionMsg, setLabActionMsg] = useState<string | null>(null);

  const [isDNAUploadModalOpen, setIsDNAUploadModalOpen] = useState(false);
  const [dnaProfileToVerify, setDnaProfileToVerify] = useState<STRProfile | null>(null);
  const [rawDNAText, setRawDNAText] = useState<string | null>(null);

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

  const handleDNAUploadParsed = (profile: STRProfile, rawText: string) => {
    setDnaProfileToVerify(profile);
    setRawDNAText(rawText);
    setDnaVerificationError(null); // Clear previous errors
  };

  const handleVerifyDNA = async () => {
    if (dnaProfileToVerify && rawDNAText) {
      await verifyDNA(dnaProfileToVerify, rawDNAText);
      if (!dnaVerificationError) {
        setIsDNAUploadModalOpen(false);
      }
    }
  };

  const handleRevokeDNA = async () => {
    await revokeDNA();
  };

  const handleEditPhotoFile = async (file: File | undefined) => {
    setEditPhotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEditPhotoError(t("onboarding.photo.invalidType"));
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setEditImageUrl(dataUrl);
    } catch (e) {
      console.error(e);
      setEditPhotoError(t("onboarding.photo.readError"));
    }
  };

  const toggleEditLanguage = (code: string) => {
    setEditLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await saveProfile({
        age: editAge,
        ageHidden: editAgeHidden,
        bio: editBio.trim(),
        languages: editLanguages,
        imageUrl: editImageUrl,
        photoBlurred: editPhotoBlurred,
        testingPreference: editTestingPreference,
        kind: editKind,
        gender: editKind ? kindToGender(editKind) : editGender,
        lookingFor: editLookingFor,
        skinColor: editSkinColor,
        country: editCountry.trim() || undefined,
        city: editCity.trim() || undefined,
        canTravel: editCanTravel,
        canTravelCountries: editCanTravel ? Array.from(editCanTravelCountries).sort() : [],
        height: editHeight ? Number(editHeight) : undefined,
        weight: editWeight ? Number(editWeight) : undefined,
        eyeColor: editEyeColor,
        hairColor: editHairColor,
        bodyType: editBodyType,
        smoking: editSmoking,
        drinking: editDrinking,
      });
      alert(t("profile.edit.saved"));
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  const grantEntries = Object.entries(myProfile.photoGrants || {});
  // Countries for the "can travel" panel — canonical English names from the
  // lazy offline geo dataset, sorted alphabetically.
  const travelCountries = useMemo(
    () => [...(locationIndex?.countries ?? [])].sort((a, b) => a.localeCompare(b)),
    [locationIndex],
  );
  const viewerName = (id: string) => profiles.find((p) => p.id === id)?.name || id;

  const openDNAUploadModal = () => setIsDNAUploadModalOpen(true);
  const closeDNAUploadModal = () => {
    setIsDNAUploadModalOpen(false);
    setDnaProfileToVerify(null);
    setRawDNAText(null);
    setDnaVerificationError(null);
  };

  // ─── Lab testing panel ───
  // Unique per-user lab email + provider-agnostic report ingestion.
  useEffect(() => {
    if (!myProfile.id) return;
    setLabEmail(generateLabEmail(myProfile.id));
    setLabLoading(true);
    setLabEmailError(null);
    (async () => {
      try {
        const res = await apiFetch(`/api/lab/pending?userId=${myProfile.id}`);
        if (res.ok) {
          const data = await res.json();
          setPendingReports(Array.isArray(data) ? data : []);
        } else {
          setPendingReports([]);
        }
      } catch (e) {
        console.error("Failed to load pending lab reports", e);
        setPendingReports([]);
      } finally {
        setLabLoading(false);
      }
    })();
  }, [myProfile.id]);

  const handleLabAccept = async (reportId: string) => {
    setLabActionMsg(null);
    try {
      const res = await apiFetch("/api/lab/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, accept: true }),
      });
      if (res.ok) {
        setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
        setLabActionMsg(t("profile.lab.reportAccepted"));
      } else {
        setLabActionMsg(t("profile.lab.reportFailed"));
      }
    } catch (e) {
      console.error(e);
      setLabActionMsg(t("profile.lab.reportFailed"));
    }
  };

  const handleLabReject = async (reportId: string) => {
    setLabActionMsg(null);
    try {
      await apiFetch("/api/lab/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, accept: false }),
      });
      setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 1. QR code — lab verification (photo + STD result) and user-to-user
          STD compatibility checks. Encodes only the public userId. */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start gap-6 flex-wrap">
          {myProfile.id && <LabPatientQR userId={myProfile.id} size={160} />}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{t("profile.qr.title")}</h2>
            <p className="text-gray-500 text-sm mt-2">{t("profile.qr.hint")}</p>
            <div className="mt-3 flex items-center gap-2">
              {myProfile.faceEmbedding ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-full border border-green-200">
                  ✓ {t("profile.lab.faceVerified")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  {t("profile.lab.faceNotVerified")}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {/* 2. Account — how other users see it (editable below) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">{t("profile.myProfile.title")}</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
              {myProfile.name[0]}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{myProfile.name}</h3>
              <p className="text-gray-500">{t("profile.myProfile.verifiedUser")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">{t("profile.status.stdStatus")}</p>
              <p
                className={`text-lg font-bold ${myProfile.stdUploaded ? "text-green-600" : "text-red-500"}`}
              >
                {myProfile.stdUploaded
                  ? t("profile.status.uploaded")
                  : t("profile.status.notUploaded")}
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">{t("profile.status.dnaStatus")}</p>
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

        {/* 3. Search goals — what/who you seek. Works with Home search:
            another user's "Who are you looking for" filter matches these marks. */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-1">{t("profile.searchGoals.title")}</h2>
          <p className="text-gray-500 text-sm mb-5">{t("profile.searchGoals.hint")}</p>

          {/* Who you are (kind) — checkbox marks, single choice */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("onboarding.kind.title")}
          </label>
          <div className="flex flex-col gap-2 mb-5">
            {PROFILE_KINDS.map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={editKind === k}
                  onChange={() => {
                    const next = editKind === k ? undefined : k;
                    setEditKind(next);
                    if (next) setEditGender(kindToGender(next));
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t(`profileKind.${k}`)}
              </label>
            ))}
          </div>

          {/* Who you are looking for — checkbox marks, single choice */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filters.lookingFor")}
          </label>
          <div className="flex flex-col gap-2">
            {LOOKING_FOR_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={editLookingFor === opt}
                  onChange={() => setEditLookingFor(editLookingFor === opt ? undefined : opt)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t(`filters.lookingForOptions.${opt}`)}
              </label>
            ))}
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-300"
          >
            {savingProfile ? t("profile.edit.saving") : t("profile.edit.save")}
          </button>
        </section>

        {/* Profile info editor (photo / age / languages / bio) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">{t("profile.edit.title")}</h2>
            <InfoProposalIcons term="profile.sections.profileEdit" align="left" />
          </div>

          {/* Photo */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
              {editImageUrl ? (
                <img
                  src={editImageUrl}
                  alt={t("profile.edit.photoAlt")}
                  className={`w-full h-full object-cover ${editPhotoBlurred ? "photo-blurred" : ""}`}
                />
              ) : (
                <span className="text-gray-400 text-3xl">👤</span>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleEditPhotoFile(e.target.files?.[0])}
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                {editImageUrl ? t("profile.edit.changePhoto") : t("profile.edit.uploadPhoto")}
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPhotoBlurred}
                  onChange={(e) => setEditPhotoBlurred(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t("profile.edit.blurPhoto")}
              </label>
              {editPhotoError && <p className="text-xs text-red-500">{editPhotoError}</p>}
            </div>
          </div>

          {/* Age */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.edit.age")}
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="number"
                min={18}
                max={120}
                value={editAge || ""}
                onChange={(e) => setEditAge(Math.max(0, Math.min(120, Number(e.target.value))))}
                className="w-28 p-2 border border-gray-300 rounded-md text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editAgeHidden}
                  onChange={(e) => setEditAgeHidden(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t("profile.edit.hideAge")}
              </label>
            </div>
          </div>

          {/* Languages */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("profile.edit.languages")}
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const active = editLanguages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleEditLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.edit.bio")}
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value.slice(0, 300))}
              rows={4}
              maxLength={300}
              placeholder={t("onboarding.bio.placeholder")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
            />
            <p className="text-right text-xs text-gray-400">{editBio.length}/300</p>
          </div>

          {/* Gender */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("filters.gender")}
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((opt) => {
                const active = editGender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditGender(active ? undefined : opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skin color */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("filters.skinColor")}
            </label>
            <div className="flex flex-wrap gap-2">
              {SKIN_COLOR_OPTIONS.map((opt) => {
                const active = editSkinColor === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditSkinColor(active ? undefined : opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country / City — каскадні списки: країна звужує вибір міст.
                Legacy free-text значення зберігаються як додаткові опції. */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.country")}
              </label>
              <select
                value={editCountry}
                onChange={(e) => {
                  const nextCountry = e.target.value;
                  setEditCountry(nextCountry);
                  // Місто має належати новій країні — інакше скидаємо.
                  setEditCity((prevCity) =>
                    prevCity &&
                    nextCountry &&
                    (locationIndex?.citiesFor(nextCountry) ?? []).includes(prevCity)
                      ? prevCity
                      : "",
                  );
                }}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">—</option>
                {withLegacyOption(locationIndex?.countries ?? [], editCountry).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.city")}
              </label>
              <select
                value={editCity}
                disabled={!editCountry}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                <option value="">—</option>
                {editCountry &&
                  withLegacyOption(locationIndex?.citiesFor(editCountry) ?? [], editCity).map(
                    (city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ),
                  )}
              </select>
            </div>
          </div>

          {/* Можу прибути до вашої країни — декларація користувача для пошуку */}
          <label className="flex items-center gap-2 mb-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={editCanTravel}
              onChange={(e) => setEditCanTravel(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {t("filters.canTravel")}
          </label>

          {/* Країни, до яких можу прибути — панель із «Відмітити усі».
              Порожній список зі включеною галочкою = «всюди» (легасі-семантика). */}
          {editCanTravel && (
            <div className="mb-5 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {t("profile.canTravel.countriesTitle")}
                  {travelCountries.length > 0 && (
                    <span className="font-normal text-gray-400">
                      {" "}
                      ({editCanTravelCountries.size}/{travelCountries.length})
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setEditCanTravelCountries(new Set(travelCountries))}
                  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {t("profile.canTravel.selectAll")}
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1 pr-1">
                {travelCountries.map((country) => (
                  <label
                    key={country}
                    className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editCanTravelCountries.has(country)}
                      onChange={() =>
                        setEditCanTravelCountries((prev) => {
                          const next = new Set(prev);
                          if (next.has(country)) {
                            next.delete(country);
                          } else {
                            next.add(country);
                          }
                          return next;
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {country}
                  </label>
                ))}
                {travelCountries.length === 0 && (
                  <p className="col-span-2 text-xs text-gray-400">
                    {t("profile.canTravel.loadingCountries")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Height / Weight */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.heightRange")}
              </label>
              <input
                type="number"
                min={120}
                max={230}
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                placeholder={t("filters.min")}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.weightRange")}
              </label>
              <input
                type="number"
                min={30}
                max={250}
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                placeholder={t("filters.min")}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Eye color */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("filters.eyeColor")}
            </label>
            <div className="flex flex-wrap gap-2">
              {EYE_COLOR_CHIPS.map((opt) => {
                const active = editEyeColor === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditEyeColor(active ? undefined : opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hair color */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("filters.hairColor")}
            </label>
            <div className="flex flex-wrap gap-2">
              {HAIR_COLOR_CHIPS.map((opt) => {
                const active = editHairColor === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditHairColor(active ? undefined : opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body type */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("filters.bodyType")}
            </label>
            <div className="flex flex-wrap gap-2">
              {BODY_TYPE_CHIPS.map((opt) => {
                const active = editBodyType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditBodyType(active ? undefined : opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smoking / Drinking */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            {[
              ["filters.smoking", editSmoking, setEditSmoking] as const,
              ["filters.drinking", editDrinking, setEditDrinking] as const,
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t(label)}</label>
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setter(value === v ? undefined : v)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        value === v
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-gray-300 text-gray-600 hover:border-blue-400"
                      }`}
                    >
                      {t(v ? "filters.yes" : "filters.no")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Testing preference (lab / portable / both / none) */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.edit.testingPreference")}
            </label>
            <div className="flex flex-wrap gap-2">
              {TESTING_PREFERENCE_OPTIONS.map((opt) => {
                const active = editTestingPreference === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEditTestingPreference(active ? undefined : opt)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t(`filters.testingPreferences.${opt}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-300"
          >
            {savingProfile ? t("profile.edit.saving") : t("profile.edit.save")}
          </button>
        </section>

        {/* 4. Medical card — patient card with QR (photos verified via lab scan) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-1">{t("profile.medical.title")}</h2>
          <p className="text-gray-500 text-sm mb-6">{t("profile.medical.subtitle")}</p>
          <CompanionProfile embedded />
        </section>

        {/* Laboratory tools */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-2">{t("profile.medical.labTitle")}</h2>
          <p className="text-gray-500 text-sm mb-4">{t("profile.medical.labSubtitle")}</p>
          {labRegistered ? (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/companion/lab/dashboard")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {t("companion.lab.dashboard")}
              </button>
              <button
                onClick={() => navigate("/companion/lab/profile")}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
              >
                {t("companion.lab.profile")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/companion/lab/register")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {t("companion.lab.register")}
            </button>
          )}
        </section>

        {/* Lab testing panel — per-user lab email + pending reports */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{t("profile.lab.title")}</h2>
            <InfoProposalIcons term="profile.sections.lab" align="left" />
          </div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">{t("profile.lab.yourEmail")}</p>
            <p className="text-base font-mono font-semibold text-blue-900 mt-1">
              {labEmail ?? (labEmailError ? t("profile.lab.emailError") : "—")}
            </p>
            <p className="text-xs text-blue-500 mt-1">{t("profile.lab.emailHint")}</p>
          </div>
          {/* Patient QR + face badge live in the single QR section at the top
              of the page — no duplicate QR here. */}
          <h3 className="text-lg font-semibold mb-2">{t("profile.lab.pendingTitle")}</h3>
          {labLoading ? (
            <p className="text-sm text-gray-400">{t("profile.lab.loading")}</p>
          ) : pendingReports.length === 0 ? (
            <p className="text-sm text-gray-500">{t("profile.lab.noPending")}</p>
          ) : (
            <ul className="space-y-3">
              {pendingReports.map((report) => (
                <li
                  key={report.id}
                  className="flex items-center justify-between gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">
                      {report.source} • {new Date(report.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {report.rawText?.slice(0, 80) || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleLabAccept(report.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      {t("profile.lab.accept")}
                    </button>
                    <button
                      onClick={() => handleLabReject(report.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      {t("profile.lab.reject")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {labActionMsg && <p className="mt-3 text-sm text-green-700">{labActionMsg}</p>}
        </section>

        {/* Photo access management */}
        {grantEntries.length > 0 && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-1">{t("profile.photoGrants.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("profile.photoGrants.description")}</p>
            <ul className="space-y-3">
              {grantEntries.map(([viewerId, grant]) => (
                <li
                  key={viewerId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {viewerName(viewerId)[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{viewerName(viewerId)}</p>
                      <p className="text-xs text-gray-400">
                        {grant.kind === "permanent"
                          ? t("profile.photoGrants.permanent")
                          : t("profile.photoGrants.temporary")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => revokePhotoAccess(viewerId, t)}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {t("profile.photoGrants.revoke")}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">{t("profile.stdCompatibility.title")}</h2>
          {myProfile.parsedStd && myProfile.parsedStd.pathogens.length > 0 ? (
            <div className="space-y-3">
              {(["none", "same_strain", "potential_risk", "high_risk"] as const).map((risk) => {
                const compat: StdCompatibilityResult = {
                  safe: risk === "none" || risk === "same_strain",
                  riskLevel: risk,
                  reason: "",
                  sharedPathogens: [],
                  riskyPathogens: [],
                };
                const label = getCompatibilityLabel(compat);
                if (!label) return null;
                const colors: Record<string, string> = {
                  green: "border-green-200 bg-green-50 text-green-800",
                  blue: "border-blue-200 bg-blue-50 text-blue-800",
                  yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
                  red: "border-red-200 bg-red-50 text-red-800",
                };
                const borderColor = label.color || "gray";
                return (
                  <div
                    key={risk}
                    className={`p-3 rounded-lg border ${colors[borderColor] || "border-gray-200 bg-gray-50 text-gray-800"}`}
                  >
                    <span className="text-sm">
                      {label.icon} <span className="font-semibold">{label.label}</span>
                    </span>
                    <span className="text-xs ml-2 text-gray-500">
                      {risk === "none" && t("profile.stdCompatibility.allNegative")}
                      {risk === "same_strain" && t("profile.stdCompatibility.samePathogen")}
                      {risk === "potential_risk" && t("profile.stdCompatibility.unknown")}
                      {risk === "high_risk" && t("profile.stdCompatibility.highRisk")}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{t("profile.stdCompatibility.noData")}</p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            {t("profile.stdCompatibility.privacyNotice")}
          </p>
        </section>

        {/* DNA Verification Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">{t("dna.title")}</h2>
          <p className="text-gray-500 mb-4">{t("dna.description")}</p>
          {myProfile.dnaProfile ? (
            <DNAProfile
              profile={myProfile.dnaProfile}
              isVerified={isDnaVerified}
              onRevoke={handleRevokeDNA}
              isRevoking={isDnaRevoking}
            />
          ) : (
            <button
              onClick={openDNAUploadModal}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-300 transition-colors"
            >
              {t("dna.upload.title")}
            </button>
          )}
        </section>

        {isConnected && address && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">{t("profile.wallet.title")}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{t("profile.wallet.address")}</span>
                <span className="text-sm font-mono font-semibold text-gray-900">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{t("profile.wallet.balance")}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "—"}
                </span>
              </div>
            </div>
          </section>
        )}

        <DexSwap />

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">{t("profile.upload.title")}</h2>
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
              <p className="text-sm font-medium mb-2">{t("profile.upload.redactFields")}</p>
              <div className="flex flex-wrap gap-3">
                {[
                  t("profile.upload.fullName"),
                  t("profile.upload.address"),
                  t("profile.upload.phoneNumber"),
                  t("profile.upload.patientId"),
                ].map((field) => (
                  <label key={field} className="flex items-center gap-2 text-sm cursor-pointer">
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
          <h2 className="text-2xl font-bold mb-4">{t("profile.documents.title")}</h2>
          <div className="grid grid-cols-1 gap-4">
            {myProfile.uploadedDocs.length === 0 && (
              <p className="text-gray-500">{t("profile.documents.noDocuments")}</p>
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

      <DNAVerificationModal
        isOpen={isDNAUploadModalOpen}
        onClose={closeDNAUploadModal}
        profileToVerify={dnaProfileToVerify}
        onConfirm={handleVerifyDNA}
        isConfirming={isDnaVerifying}
        error={dnaVerificationError}
      />

      {/* 5. Reputation */}
      <div className="space-y-8 mt-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-6">{t("profile.reputation.title")}</h2>
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
                strokeDashoffset={440 - (440 * myProfile.reputationScore) / 10}
                strokeLinecap="round"
                className="text-blue-600 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-800">{myProfile.reputationScore}</span>
              <span className="text-xs text-gray-500 uppercase font-bold">
                {t("profile.reputation.score")}
              </span>
            </div>
          </div>
          <p className="mt-6 text-gray-600 max-w-md">{t("profile.reputation.description")}</p>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">{t("profile.reputation.votersTitle")}</h2>
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

      {/* Logout — moved from the header to the very bottom of the Profile
          page (product decision: header stays clean). */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
        >
          {t("auth.logout")}
        </button>
      </div>
    </div>
  );
};
export default Profile;
