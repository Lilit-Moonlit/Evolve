import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import { upsertCompanionPatient } from "./lib/companion-api";

export const Profile: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [verifiedPhotos, setVerifiedPhotos] = useState<Record<string, "verified" | "uncertain">>(
    {},
  );
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [stdCompatible, setStdCompatible] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalPhotosInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const generateUserId = () => {
    const existingId = localStorage.getItem("companion_user_id");
    if (existingId) return existingId;
    const newId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("companion_user_id", newId);
    return newId;
  };

  const userId = generateUserId();

  // Push the patient's profile to the server so a lab on another device can
  // fetch it by scanning this device's QR code. Fire-and-forget: never blocks
  // the UI, and the localStorage copy remains the local source of truth.
  const syncPatientToServer = () => {
    void upsertCompanionPatient({
      id: userId,
      name: name || null,
      photo,
      additionalPhotos,
      location,
      stdCompatible,
    }).catch(() => {
      /* offline / no API server — ignore */
    });
  };

  // Auto-sync to the server (debounced) whenever the identity/health data that
  // the lab needs changes, so the QR code works cross-device without an
  // explicit save click.
  useEffect(() => {
    const timer = setTimeout(syncPatientToServer, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo, additionalPhotos, location, stdCompatible, name]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        setPhoto(photoData);
        localStorage.setItem("companion_photo", photoData);
        // Зберігаємо для доступу лабораторії
        localStorage.setItem(`patient_${userId}_photo`, photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        setPhoto(photoData);
        localStorage.setItem("companion_photo", photoData);
        localStorage.setItem(`patient_${userId}_photo`, photoData);
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const photoData = reader.result as string;
          setAdditionalPhotos((prev) => [...prev, photoData]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  useEffect(() => {
    const savedPhoto = localStorage.getItem("companion_photo");
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
    const savedAdditionalPhotos = localStorage.getItem("companion_additional_photos");
    if (savedAdditionalPhotos) {
      setAdditionalPhotos(JSON.parse(savedAdditionalPhotos));
    }
    const savedName = localStorage.getItem("companion_name");
    if (savedName) {
      setName(savedName);
    }
    const savedGender = localStorage.getItem("companion_gender");
    if (savedGender) {
      setGender(savedGender);
    }
    const savedCity = localStorage.getItem("companion_city");
    if (savedCity) {
      setCity(savedCity);
    }
    const savedEmail = localStorage.getItem("companion_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
    const savedLocation = localStorage.getItem(`patient_${userId}_location`);
    if (savedLocation) {
      setLocation(savedLocation);
      setShowLocation(true);
    }
    const savedStdCompatible = localStorage.getItem(`patient_${userId}_std_compatible`);
    if (savedStdCompatible) {
      setStdCompatible(savedStdCompatible === "true");
    }
    // Завантажуємо статуси верифікації фото
    const savedVerifiedPhotos = localStorage.getItem(`patient_${userId}_verified_photos`);
    if (savedVerifiedPhotos) {
      const verified = JSON.parse(savedVerifiedPhotos);
      const verifiedMap: Record<string, "verified" | "uncertain"> = {};
      verified.forEach((item: { url: string; status: "verified" | "uncertain" }) => {
        if (item.status === "verified") {
          verifiedMap[item.url] = "verified";
        }
      });
      setVerifiedPhotos(verifiedMap);
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("companion_additional_photos", JSON.stringify(additionalPhotos));
    localStorage.setItem(`patient_${userId}_additional_photos`, JSON.stringify(additionalPhotos));
  }, [additionalPhotos, userId]);

  useEffect(() => {
    localStorage.setItem("companion_name", name);
    localStorage.setItem(`patient_${userId}_name`, name);
  }, [name, userId]);

  useEffect(() => {
    localStorage.setItem("companion_gender", gender);
    localStorage.setItem(`patient_${userId}_gender`, gender);
  }, [gender, userId]);

  useEffect(() => {
    localStorage.setItem("companion_city", city);
    localStorage.setItem(`patient_${userId}_city`, city);
  }, [city, userId]);

  useEffect(() => {
    localStorage.setItem("companion_email", email);
    localStorage.setItem(`patient_${userId}_email`, email);
  }, [email, userId]);

  useEffect(() => {
    localStorage.setItem(`patient_${userId}_location`, location);
  }, [location, userId]);

  useEffect(() => {
    localStorage.setItem(`patient_${userId}_std_compatible`, String(stdCompatible));
  }, [stdCompatible, userId]);

  // Генеруємо QR-код пацієнта — той самий формат, що читають лаб-сканери.
  useEffect(() => {
    if (!canvasRef.current || !userId) return;
    const payload = `evolve://lab-patient/${encodeURIComponent(userId)}`;
    QRCode.toCanvas(
      canvasRef.current,
      payload,
      { width: 160, margin: 1, errorCorrectionLevel: "M" },
      (err) => {
        if (err) {
          console.error("QR generation failed", err);
        }
      },
    );
  }, [userId]);

  const shareLink = `${window.location.origin}/companion/profile`;

  const handleCopyLink = () => {
    try {
      void navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleSearchUsers = () => {
    navigate("/companion/search");
  };

  const handleSaveProfile = () => {
    // Реєстрація пацієнта: зберігаємо ID як ознаку реєстрації, синхронізуємо
    // з сервером (для крос-девайсного доступу лаби).
    localStorage.setItem("companion_user_id", userId);
    syncPatientToServer();
    if (!embedded) {
      navigate("/companion/search");
    }
  };

  return (
    <div
      className={
        embedded
          ? "w-full flex flex-col items-center"
          : "min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6"
      }
    >
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.profile.title")}</h1>
          {!embedded && (
            <button
              onClick={() => navigate("/companion")}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-blue-500/30"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 rounded-full border-4 border-slate-600 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition border-4 border-slate-800"
              >
                📷
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-sm text-slate-400">{t("companion.profile.uploadPhoto")}</p>
          </div>

          {additionalPhotos.length > 0 && (
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 text-white">
                {t("companion.profile.additionalPhotos")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {additionalPhotos.map((photoUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photoUrl}
                      alt={`Additional ${index}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    {verifiedPhotos[photoUrl] === "verified" && (
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => additionalPhotosInputRef.current?.click()}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
          >
            {t("companion.profile.addMorePhotos")}
          </button>
          <input
            ref={additionalPhotosInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalPhotosUpload}
            className="hidden"
          />

          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showLocation}
                onChange={(e) => setShowLocation(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-white">{t("companion.profile.locationOptional")}</span>
            </label>
            {showLocation && (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("companion.profile.location")}
                className="mt-3 w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={stdCompatible}
                onChange={(e) => setStdCompatible(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-white">{t("companion.profile.stdCompatible")}</span>
            </label>
          </div>

          {!embedded && (
            <button
              onClick={handleSearchUsers}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              {t("companion.profile.searchUsers")}
            </button>
          )}

          {/* QR only in the standalone companion profile. When embedded in the
              main Profile page, the single LabPatientQR at the top of the page
              replaces it (same evolve://lab-patient/ payload, account-bound id). */}
          {!embedded && (
            <div className="bg-slate-700/50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-3 text-white">
                {t("companion.profile.qrCode")}
              </h3>
              <div className="bg-white p-4 rounded-lg inline-block mb-3">
                <canvas ref={canvasRef} />
              </div>
              <p className="text-xs text-slate-400">{t("companion.profile.qrHint")}</p>
            </div>
          )}

          <div className="bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-white">
              {t("companion.profile.shareLink")}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-300"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
              >
                {linkCopied ? t("companion.profile.linkCopied") : t("companion.profile.copyLink")}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">{t("companion.profile.shareHint")}</p>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            {t("companion.profile.title")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
