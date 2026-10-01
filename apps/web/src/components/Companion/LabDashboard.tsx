import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Patient {
  id: string;
  name: string;
  hasResult: boolean;
  photos: string[];
}

export const LabDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  useEffect(() => {
    const labId = localStorage.getItem("lab_id");
    if (!labId) {
      navigate("/companion/lab/auth");
      return;
    }

    const storedPatients = localStorage.getItem(`lab_${labId}_patients`);
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, [navigate]);

  const filteredPatients = showPendingOnly ? patients.filter((p) => !p.hasResult) : patients;

  const handleChatWithPatient = (patientId: string) => {
    // Лабораторія пише ПАЦІЄНТУ (не собі) — роль lab у Chat визначається ?as=lab.
    navigate(`/companion/chat/${patientId}?as=lab`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.lab.dashboard")}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/companion/lab/profile")}
              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition"
            >
              {t("companion.lab.profile")}
            </button>
            <button
              onClick={() => navigate("/companion")}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{t("companion.lab.patients")}</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/companion/lab/scan")}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition"
            >
              {t("companion.lab.scanQR")}
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={showPendingOnly}
                onChange={(e) => setShowPendingOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              {t("companion.lab.showPending")}
            </label>
          </div>
        </div>

        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-white">{patient.name}</p>
                <p className="text-xs text-slate-400">
                  {t("companion.lab.patientId")}: {patient.id}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChatWithPatient(patient.id)}
                  className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition"
                >
                  {t("companion.lab.contact")}
                </button>
                {!patient.hasResult && (
                  <button
                    onClick={() => navigate(`/companion/lab/add-result/${patient.id}`)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition"
                  >
                    {t("companion.lab.addResult")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-slate-400">{t("companion.lab.noPatients")}</div>
        )}
      </div>
    </div>
  );
};

export default LabDashboard;
