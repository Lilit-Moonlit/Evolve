import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StdTestParseResult } from "@/lib/std-parser";

export const Result: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  let parsed: StdTestParseResult | null = (location.state as any)?.parsed || null;
  if (!parsed) {
    const saved = sessionStorage.getItem("companion_parsed_test");
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        // ignore parse error
      }
    }
  }

  // Determine safety from parsed test
  const hasPositive = parsed ? parsed.hasPositive : false;
  const isSafe = parsed ? !hasPositive : true;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border ${
            isSafe
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-red-500/20 text-red-400 border-red-500/30"
          }`}
        >
          {isSafe ? "✓" : "!"}
        </div>

        <h1 className="text-2xl font-bold mb-2 text-white">{t("companion.result.title")}</h1>

        <div
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
            isSafe
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {isSafe ? t("companion.result.safe") : t("companion.result.risk")}
        </div>

        <p className="text-slate-300 mb-8 text-sm leading-relaxed">
          {t("companion.result.description")}
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate("/companion/profile")}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            {t("companion.profile.title")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/companion/upload")}
            className="w-full py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
          >
            {t("companion.startButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
