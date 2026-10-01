import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LabProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [labData, setLabData] = useState<any>(null);
  const [labId, setLabId] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("lab_data");
    const storedId = localStorage.getItem("lab_id");
    if (storedData) {
      setLabData(JSON.parse(storedData));
    }
    if (storedId) {
      setLabId(storedId);
    }
  }, []);

  if (!labData) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <p>Loading...</p>
      </div>
    );
  }

  // Кнопки «Написати» тут немає: лабораторія не листується сама із собою.
  // Чат із ПАЦІЄНТОМ доступний з кабінету (LabDashboard) по кожному пацієнту.

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.lab.profile")}</h1>
          <button
            onClick={() => navigate("/companion/lab/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">{labData.name}</h3>
            <p className="text-sm text-slate-300">{labData.description}</p>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-white">{t("companion.lab.address")}</h3>
            <p className="text-sm text-slate-300">{labData.address}</p>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-white">{t("companion.lab.phone")}</h3>
            <p className="text-sm text-slate-300">{labData.phone}</p>
          </div>

          <button
            onClick={() => navigate("/companion/lab/dashboard")}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            {t("companion.lab.dashboard")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabProfile;
