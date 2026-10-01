import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { canConfirmPatient, PhotoDecision } from "./lib/verify-patient";
import { fetchCompanionPatient } from "./lib/companion-api";

interface PhotoVerification {
  url: string;
  status: PhotoDecision;
}

export const LabVerifyPatient: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [mainPhoto, setMainPhoto] = useState<string>("");
  const [mainPhotoStatus, setMainPhotoStatus] = useState<PhotoDecision>("none");
  const [additionalPhotos, setAdditionalPhotos] = useState<PhotoVerification[]>([]);
  const [location, setLocation] = useState<string>("");
  const [stdCompatible, setStdCompatible] = useState(false);
  const [testInfo, setTestInfo] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    // Локальні дані (той самий пристрій) — fallback, якщо API недоступний.
    const applyLocal = () => {
      const patientPhoto = localStorage.getItem(`patient_${userId}_photo`);
      const patientAdditionalPhotos = localStorage.getItem(`patient_${userId}_additional_photos`);
      const patientLocation = localStorage.getItem(`patient_${userId}_location`);
      const patientStdCompatible = localStorage.getItem(`patient_${userId}_std_compatible`);

      if (!patientPhoto && !patientAdditionalPhotos) {
        setError(t("companion.lab.patientNotFound"));
        return;
      }
      if (patientPhoto) setMainPhoto(patientPhoto);
      if (patientAdditionalPhotos) {
        const photos = JSON.parse(patientAdditionalPhotos);
        setAdditionalPhotos(photos.map((url: string) => ({ url, status: "none" as const })));
      }
      if (patientLocation) setLocation(patientLocation);
      if (patientStdCompatible) setStdCompatible(patientStdCompatible === "true");
    };

    // Спершу пробуємо сервер (крос-девайсний доступ лаби), потім — localStorage.
    fetchCompanionPatient(userId)
      .then((server) => {
        if (cancelled) return;
        if (server && (server.photo || server.additionalPhotos?.length)) {
          setMainPhoto(server.photo || "");
          setAdditionalPhotos(
            (server.additionalPhotos || []).map((url) => ({ url, status: "none" as const })),
          );
          setLocation(server.location || "");
          setStdCompatible(Boolean(server.stdCompatible));
        } else {
          applyLocal();
        }
      })
      .catch(() => {
        if (!cancelled) applyLocal();
      });

    return () => {
      cancelled = true;
    };
  }, [userId, t]);

  const handlePhotoVerification = (index: number, status: "verified" | "uncertain") => {
    setAdditionalPhotos((prev) => {
      const updated = [...prev];
      updated[index].status = status;
      return updated;
    });
  };

  const handleMainPhotoVerification = (status: "verified" | "uncertain") => {
    setMainPhotoStatus(status);
  };

  const hasMainPhoto = Boolean(mainPhoto);
  const canConfirm = canConfirmPatient(hasMainPhoto, mainPhotoStatus, additionalPhotos);

  const handleConfirmPatient = () => {
    if (!userId) return;

    // Зберігаємо статуси верифікації фото
    const verifiedPhotos = additionalPhotos.map((photo) => ({
      url: photo.url,
      status: photo.status,
    }));

    localStorage.setItem(`patient_${userId}_verified_photos`, JSON.stringify(verifiedPhotos));

    // Додаємо пацієнта до списку лабораторії
    const labId = localStorage.getItem("lab_id");
    const labPatients = JSON.parse(localStorage.getItem(`lab_${labId}_patients`) || "[]");

    const patientData = {
      id: userId,
      name: `Patient ${userId.substring(0, 8)}`,
      hasResult: false,
      verifiedPhotos,
      mainPhoto,
      mainPhotoStatus,
      location,
      stdCompatible,
      testInfo,
      addedAt: new Date().toISOString(),
    };

    // Перевіряємо чи пацієнт вже в списку
    const existingIndex = labPatients.findIndex((p: any) => p.id === userId);
    if (existingIndex >= 0) {
      labPatients[existingIndex] = patientData;
    } else {
      labPatients.push(patientData);
    }

    localStorage.setItem(`lab_${labId}_patients`, JSON.stringify(labPatients));

    // Оновлюємо глобальний список пацієнтів для LabDashboard
    const globalPatients = JSON.parse(localStorage.getItem("lab_patients") || "[]");
    const globalIndex = globalPatients.findIndex((p: any) => p.id === userId);
    if (globalIndex >= 0) {
      globalPatients[globalIndex] = patientData;
    } else {
      globalPatients.push(patientData);
    }
    localStorage.setItem("lab_patients", JSON.stringify(globalPatients));

    navigate("/companion/lab/dashboard");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/companion/lab/dashboard")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
            >
              {t("companion.lab.backToDashboard")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.lab.verifyPatient")}</h1>
          <button
            onClick={() => navigate("/companion/lab/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Головне фото */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3 text-white">
              {t("companion.lab.mainPhoto")}
            </h3>
            <div className="flex flex-col items-center gap-3">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt="Main profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-500/30"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-600 rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={() => handleMainPhotoVerification("verified")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
                    mainPhotoStatus === "verified"
                      ? "bg-green-600 text-white"
                      : "bg-slate-600 hover:bg-green-600/50 text-slate-300"
                  }`}
                >
                  {t("companion.lab.match")}
                </button>
                <button
                  onClick={() => handleMainPhotoVerification("uncertain")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
                    mainPhotoStatus === "uncertain"
                      ? "bg-yellow-600 text-white"
                      : "bg-slate-600 hover:bg-yellow-600/50 text-slate-300"
                  }`}
                >
                  {t("companion.lab.uncertain")}
                </button>
              </div>
            </div>
          </div>

          {/* Додаткові фото з кнопками верифікації */}
          {additionalPhotos.length > 0 && (
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 text-white">
                {t("companion.lab.verifyPhotos")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {additionalPhotos.map((photo, index) => (
                  <div key={index} className="space-y-2">
                    <img
                      src={photo.url}
                      alt={`Photo ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePhotoVerification(index, "verified")}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
                          photo.status === "verified"
                            ? "bg-green-600 text-white"
                            : "bg-slate-600 hover:bg-green-600/50 text-slate-300"
                        }`}
                      >
                        {t("companion.lab.match")}
                      </button>
                      <button
                        onClick={() => handlePhotoVerification(index, "uncertain")}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
                          photo.status === "uncertain"
                            ? "bg-yellow-600 text-white"
                            : "bg-slate-600 hover:bg-yellow-600/50 text-slate-300"
                        }`}
                      >
                        {t("companion.lab.uncertain")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Інформація про пацієнта */}
          <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">{t("companion.lab.patientId")}:</span>{" "}
              {userId}
            </p>
            {location && (
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">{t("companion.profile.location")}:</span>{" "}
                {location}
              </p>
            )}
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">
                {t("companion.profile.stdCompatible")}:
              </span>{" "}
              {stdCompatible ? t("companion.result.safe") : t("companion.result.risk")}
            </p>
          </div>

          {/* Інформація про тест */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm font-semibold mb-3 text-white block">
              {t("companion.lab.testInfo")}
            </label>
            <input
              type="text"
              value={testInfo}
              onChange={(e) => setTestInfo(e.target.value)}
              placeholder={t("companion.lab.testInfoPlaceholder")}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-2">{t("companion.lab.testInfoHint")}</p>
          </div>

          {!canConfirm && (
            <p className="text-xs text-slate-400 text-center">
              {t("companion.lab.verifyAllPhotos")}
            </p>
          )}

          <button
            onClick={handleConfirmPatient}
            disabled={!canConfirm}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("companion.lab.confirmPatient")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabVerifyPatient;
