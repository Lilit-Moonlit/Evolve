import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LabAuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    // Перевіряємо чи лабораторія вже зареєстрована
    const labId = localStorage.getItem("lab_id");
    setIsRegistered(!!labId);
  }, []);

  const handleRegister = () => {
    navigate("/companion/lab/register");
  };

  const handleLogin = () => {
    // Лабораторія після входу одразу потрапляє на робочий екран — кабінет
    // зі списком пацієнтів і скануванням QR (профіль — вторинний екран).
    navigate("/companion/lab/dashboard");
  };

  const handleBack = () => {
    // Повертаємося на WelcomeScreen (роль можна змінити там — при виборі
    // іншої ролі старі дані будуть скинуті).
    navigate("/companion");
  };

  if (isRegistered === null) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="text-slate-400">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border border-blue-500/30">
          🔬
        </div>
        <h1 className="text-2xl font-bold mb-3 text-white">{t("companion.labAuth.title")}</h1>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          {isRegistered ? t("companion.labAuth.welcomeBack") : t("companion.labAuth.welcomeNew")}
        </p>

        <div className="space-y-3">
          {isRegistered ? (
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              {t("companion.labAuth.loginButton")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              {t("companion.labAuth.registerButton")}
            </button>
          )}

          <button
            type="button"
            onClick={handleBack}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition active:scale-[0.98]"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabAuthScreen;
