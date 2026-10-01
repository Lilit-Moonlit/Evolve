import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { parseStdTestResult } from "@/lib/std-parser";

export const UploadTest: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [testText, setTestText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setTestText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testText.trim()) return;

    setLoading(true);
    try {
      const parsed = parseStdTestResult(testText);
      sessionStorage.setItem("companion_parsed_test", JSON.stringify(parsed));
      navigate("/companion/result", { state: { parsed } });
    } catch (err) {
      console.error("Error parsing test", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">{t("companion.uploadPrompt")}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              {t("profile.upload.redactFields") || "Upload or paste test result"}
            </label>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 cursor-pointer mb-3"
            />
            <textarea
              rows={5}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="HIV: Negative&#10;Syphilis: Negative&#10;Hepatitis B: Negative..."
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={!testText.trim() || loading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            {loading ? "..." : t("companion.uploadButton")}
          </button>

          <button
            type="button"
            onClick={() => navigate("/companion")}
            className="w-full py-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            ← {t("companion.title")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadTest;
