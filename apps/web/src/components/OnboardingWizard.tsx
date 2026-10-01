import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAppState } from "../store/AppContext";
import { LANGUAGES } from "../lib/languages";
import { fileToDataUrl } from "../lib/image";
import { PROFILE_KINDS, kindToGender } from "../lib/profile-kind";
import { ProfileNFTABI } from "../lib/abi/ProfileNFTABI";
import {
  extractFaceEmbedding,
  computeFaceHash,
  verifyFaceMatch,
  captureCameraFrame,
  FaceEmbedding,
} from "../lib/face-verification";

// Contract address - replace with actual deployed address
const PROFILE_NFT_ADDRESS =
  import.meta.env.VITE_PROFILE_NFT_ADDRESS || "0x0000000000000000000000000000000000000000";

const LOOKING_FOR_OPTIONS = [
  "man",
  "woman",
  "couple_man_woman",
  "couple_woman_woman",
  "couple_man_man",
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

type Step = "age" | "gender" | "languages" | "bio" | "photo";

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { completeOnboarding, myProfile } = useAppState();
  const { address } = useAccount();

  const [step, setStep] = useState<Step>("age");
  const [age, setAge] = useState<number>(25);
  const [ageHidden, setAgeHidden] = useState(false);
  const [kind, setKind] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [photoBlurred, setPhotoBlurred] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [faceEmbedding, setFaceEmbedding] = useState<FaceEmbedding | null>(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [faceError, setFaceError] = useState<string | null>(null);
  const [verifyingFace, setVerifyingFace] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mintingNft, setMintingNft] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ProfileNFT mint
  const { writeContract, data: txHash } = useWriteContract();
  const { isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const toggleLanguage = (code: string) => {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handlePhotoFile = async (file: File | undefined) => {
    setPhotoError(null);
    setFaceError(null);
    setFaceVerified(false);
    setFaceEmbedding(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError(t("onboarding.photo.invalidType"));
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
    } catch (e) {
      console.error(e);
      setPhotoError(t("onboarding.photo.readError"));
    }
  };

  const handleVerifyFace = async () => {
    if (!imageUrl) return;
    setVerifyingFace(true);
    setFaceError(null);
    try {
      // Extract face from uploaded photo
      const photoEmbedding = await extractFaceEmbedding(imageUrl);
      if (!photoEmbedding) {
        setFaceError(t("onboarding.photo.noFaceDetected"));
        setVerifyingFace(false);
        return;
      }
      setFaceEmbedding(photoEmbedding);

      // Capture live selfie from camera
      const cameraFrame = await captureCameraFrame();
      const result = await verifyFaceMatch(photoEmbedding, cameraFrame, 0.65);

      if (result.match) {
        setFaceVerified(true);
        const hash = await computeFaceHash(photoEmbedding);
        setFaceHashLocal(hash);
      } else {
        setFaceError(
          t("onboarding.photo.faceMismatch", {
            similarity: Math.round(result.similarity * 100),
          }),
        );
      }
    } catch (err) {
      console.error(err);
      setFaceError(t("onboarding.photo.verificationError"));
    } finally {
      setVerifyingFace(false);
    }
  };

  const [faceHashLocal, setFaceHashLocal] = useState<string | null>(null);

  const goNext = () => {
    if (step === "age") setStep("gender");
    else if (step === "gender") setStep("languages");
    else if (step === "languages") setStep("bio");
    else if (step === "bio") setStep("photo");
  };

  const goBack = () => {
    if (step === "gender") setStep("age");
    else if (step === "languages") setStep("gender");
    else if (step === "bio") setStep("languages");
    else if (step === "photo") setStep("bio");
  };

  const finish = async () => {
    setSaving(true);
    try {
      await completeOnboarding({
        age,
        faceEmbedding: faceEmbedding,
        ageHidden,
        kind,
        gender: kindToGender(kind),
        lookingFor,
        languages,
        bio: bio.trim(),
        imageUrl,
        photoBlurred,
        faceVerified,
        faceHash: faceHashLocal,
      });

      // Mint ProfileNFT if wallet is connected
      if (address && PROFILE_NFT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        setMintingNft(true);
        const metadataUri = `ipfs://profile/${myProfile.id || "new"}`;
        writeContract({
          address: PROFILE_NFT_ADDRESS,
          abi: ProfileNFTABI,
          functionName: "safeMint",
          args: [address, metadataUri],
        });
      }

      onComplete();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const skip = async () => {
    // Mark onboarding complete with an empty payload — fields stay editable
    // later in the profile settings.
    setSaving(true);
    try {
      await completeOnboarding({
        age: 25,
        ageHidden: false,
        kind: "",
        gender: "",
        lookingFor: "",
        languages: [],
        bio: "",
        imageUrl: "",
        photoBlurred: false,
      });
      onComplete();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const stepTitles: Record<Step, string> = {
    age: t("onboarding.age.title"),
    gender: t("onboarding.kind.title"),
    languages: t("onboarding.languages.title"),
    bio: t("onboarding.bio.title"),
    photo: t("onboarding.photo.title"),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-8 my-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{t("onboarding.title")}</h1>
          <p className="text-gray-400 text-sm">{t("onboarding.subtitle")}</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {(["age", "gender", "languages", "bio", "photo"] as Step[]).map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? "w-8 bg-blue-500" : "w-3 bg-slate-600"
              }`}
            />
          ))}
        </div>

        <h2 className="text-lg font-semibold text-white text-center mb-4">{stepTitles[step]}</h2>

        {step === "age" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                {t("onboarding.age.label")}
              </label>
              <input
                type="number"
                min={18}
                max={120}
                value={age || ""}
                onChange={(e) => setAge(Math.max(0, Math.min(120, Number(e.target.value))))}
                className="w-full p-2 border border-slate-600 rounded-md bg-slate-900 text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={ageHidden}
                onChange={(e) => setAgeHidden(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <p className="text-white text-sm font-medium">{t("onboarding.age.hide")}</p>
                <p className="text-gray-400 text-xs">{t("onboarding.age.hideHint")}</p>
              </div>
            </label>
          </div>
        )}

        {step === "gender" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                {t("onboarding.kind.title")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PROFILE_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      kind === k
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-slate-900 border-slate-600 text-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {t(`profileKind.${k}`)}
                  </button>
                ))}
              </div>
            </div>
            {kind !== "laboratory" && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  {t("onboarding.gender.lookingForLabel")}
                </label>
                <div className="flex flex-col gap-2">
                  {LOOKING_FOR_OPTIONS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setLookingFor(o)}
                      className={`px-3 py-2 rounded-lg text-sm text-left font-medium border transition-colors ${
                        lookingFor === o
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-slate-900 border-slate-600 text-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {t(`onboarding.gender.lookingForOptions.${o}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === "languages" && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">{t("onboarding.languages.hint")}</p>
            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {LANGUAGES.map((lang) => {
                const active = languages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-slate-900 border-slate-600 text-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === "bio" && (
          <div>
            <label className="block text-sm text-gray-300 mb-1">{t("onboarding.bio.label")}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              rows={5}
              maxLength={300}
              placeholder={t("onboarding.bio.placeholder")}
              className="w-full p-2 border border-slate-600 rounded-md bg-slate-900 text-white text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-right text-xs text-gray-500">{bio.length}/300</p>
          </div>
        )}

        {step === "photo" && (
          <div className="space-y-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
            >
              {imageUrl ? t("onboarding.photo.change") : t("onboarding.photo.upload")}
            </button>
            {photoError && <p className="text-red-400 text-sm">{photoError}</p>}
            {imageUrl && (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={imageUrl}
                    alt={t("onboarding.photo.preview")}
                    className={`w-full h-full object-cover ${photoBlurred ? "photo-blurred" : ""}`}
                  />
                </div>
                <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-xl cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={photoBlurred}
                    onChange={(e) => setPhotoBlurred(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{t("onboarding.photo.blur")}</p>
                    <p className="text-gray-400 text-xs">{t("onboarding.photo.blurHint")}</p>
                  </div>
                </label>

                {/* Face Verification Section */}
                <div className="w-full p-3 bg-slate-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛡️</span>
                    <p className="text-white text-sm font-medium">
                      {t("onboarding.photo.faceVerify")}
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">
                    {t("onboarding.photo.faceVerifyHint")}
                  </p>
                  {faceVerified ? (
                    <div className="flex items-center gap-2 p-2 bg-green-900/30 border border-green-700 rounded-lg">
                      <span className="text-green-400">✅</span>
                      <p className="text-green-300 text-sm">{t("onboarding.photo.faceVerified")}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyFace}
                      disabled={verifyingFace}
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {verifyingFace
                        ? t("onboarding.photo.verifying")
                        : t("onboarding.photo.verifyFace")}
                    </button>
                  )}
                  {faceError && <p className="text-red-400 text-xs mt-2">{faceError}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 gap-3">
          <button
            type="button"
            onClick={skip}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            {t("onboarding.skip")}
          </button>
          <div className="flex items-center gap-3">
            {step !== "age" && (
              <button
                type="button"
                onClick={goBack}
                disabled={saving}
                className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {t("onboarding.back")}
              </button>
            )}
            {step !== "photo" ? (
              <button
                type="button"
                onClick={goNext}
                disabled={saving}
                className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {t("onboarding.next")}
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={saving}
                className="px-5 py-2 text-sm bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? t("onboarding.saving") : t("onboarding.finish")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
