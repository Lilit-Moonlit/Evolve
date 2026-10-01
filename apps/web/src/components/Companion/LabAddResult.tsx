import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LabAddResult: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [mainPhoto, setMainPhoto] = useState<string>("");
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [stdCompatible, setStdCompatible] = useState(false);
  const [testInfo, setTestInfo] = useState<string>("");
  const [resultPhoto, setResultPhoto] = useState<string>("");
  const [resultDate, setResultDate] = useState<string>("");
  const [resultNotes, setResultNotes] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!userId) return;

    // Завантажуємо дані пацієнта
    const patientPhoto = localStorage.getItem(`patient_${userId}_photo`);
    const patientAdditionalPhotos = localStorage.getItem(`patient_${userId}_additional_photos`);
    const patientLocation = localStorage.getItem(`patient_${userId}_location`);
    const patientStdCompatible = localStorage.getItem(`patient_${userId}_std_compatible`);

    if (patientPhoto) {
      setMainPhoto(patientPhoto);
    }

    if (patientAdditionalPhotos) {
      setAdditionalPhotos(JSON.parse(patientAdditionalPhotos));
    }

    if (patientLocation) {
      setLocation(patientLocation);
    }

    if (patientStdCompatible) {
      setStdCompatible(patientStdCompatible === "true");
    }

    // Завантажуємо інформацію про тест зі списку лабораторії
    const labId = localStorage.getItem("lab_id");
    const labPatients = JSON.parse(localStorage.getItem(`lab_${labId}_patients`) || "[]");
    const patient = labPatients.find((p: any) => p.id === userId);
    if (patient) {
      setTestInfo(patient.testInfo || "");
    }
  }, [userId]);

  const handleResultPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResultPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveResult = () => {
    if (!userId) return;

    // Зберігаємо результат тесту
    const resultData = {
      photo: resultPhoto,
      date: resultDate,
      notes: resultNotes,
      addedAt: new Date().toISOString(),
    };

    localStorage.setItem(`patient_${userId}_result`, JSON.stringify(resultData));

    // Оновлюємо статус пацієнта в списку лабораторії
    const labId = localStorage.getItem("lab_id");
    const labPatients = JSON.parse(localStorage.getItem(`lab_${labId}_patients`) || "[]");
    const updatedPatients = labPatients.map((p: any) =>
      p.id === userId ? { ...p, hasResult: true, result: resultData } : p,
    );
    localStorage.setItem(`lab_${labId}_patients`, JSON.stringify(updatedPatients));

    // Оновлюємо глобальний список пацієнтів
    const globalPatients = JSON.parse(localStorage.getItem("lab_patients") || "[]");
    const updatedGlobal = globalPatients.map((p: any) =>
      p.id === userId ? { ...p, hasResult: true, result: resultData } : p,
    );
    localStorage.setItem("lab_patients", JSON.stringify(updatedGlobal));

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
          <h1 className="text-2xl font-bold text-white">{t("companion.lab.addResult")}</h1>
          <button
            onClick={() => navigate("/companion/lab/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Інформація про пацієнта */}
          <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">{t("companion.lab.patientId")}:</span>{" "}
              {userId}
            </p>
            {testInfo && (
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">{t("companion.lab.testInfo")}:</span>{" "}
                {testInfo}
              </p>
            )}
            {location && (
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">{t("companion.profile.location")}:</span>{" "}
                {location}
              </p>
            )}
          </div>

          {/* Фото результату */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm font-semibold mb-3 text-white block">
              {t("companion.lab.resultPhoto")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleResultPhotoUpload}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {resultPhoto && (
              <div className="mt-4">
                <img
                  src={resultPhoto}
                  alt="Result"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Дата результату */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm font-semibold mb-3 text-white block">
              {t("companion.lab.resultDate")}
            </label>
            <input
              type="date"
              value={resultDate}
              onChange={(e) => setResultDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Нотатки */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <label className="text-sm font-semibold mb-3 text-white block">
              {t("companion.lab.resultNotes")}
            </label>
            <textarea
              value={resultNotes}
              onChange={(e) => setResultNotes(e.target.value)}
              placeholder={t("companion.lab.resultNotesPlaceholder")}
              rows={4}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSaveResult}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            {t("companion.lab.saveResult")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabAddResult;
