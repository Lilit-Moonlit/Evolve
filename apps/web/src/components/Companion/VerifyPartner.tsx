import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { parseStdTestResult, checkStdCompatibility } from "@/lib/std-parser";

export const VerifyPartner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null);
  const [userTest, setUserTest] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<
    "compatible" | "notCompatible" | "error" | null
  >(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [partnerTestResult, setPartnerTestResult] = useState<string>("");

  useEffect(() => {
    if (userId) {
      const storedPhoto = localStorage.getItem(`companion_photo_${userId}`);
      if (storedPhoto) {
        setPartnerPhoto(storedPhoto);
      }
      const storedTest = localStorage.getItem(`companion_test_${userId}`);
      if (storedTest) {
        setPartnerTestResult(storedTest);
      }
    }
  }, [userId]);

  const handleVerify = () => {
    if (!userTest.trim()) {
      setVerificationResult("error");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      try {
        const myParsedTest = parseStdTestResult(userTest);
        const partnerParsedTest = parseStdTestResult(partnerTestResult);

        const compatibility = checkStdCompatibility(myParsedTest, partnerParsedTest);

        if (compatibility.safe) {
          setVerificationResult("compatible");
        } else {
          setVerificationResult("notCompatible");
        }
      } catch (error) {
        console.error("Error checking compatibility:", error);
        setVerificationResult("error");
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleUploadMyTest = () => {
    navigate("/companion/upload");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.verify.title")}</h1>
          <button
            onClick={() => navigate("/companion")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4">
              {partnerPhoto ? (
                <img
                  src={partnerPhoto}
                  alt="Partner"
                  className="w-full h-full object-cover rounded-full border-4 border-blue-500/30"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 rounded-full border-4 border-slate-600 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            <p className="text-sm text-slate-400">{t("companion.verify.partnerPhoto")}</p>
          </div>

          {verificationResult === null && (
            <>
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  {t("companion.verify.uploadYourTest")}
                </h3>
                <textarea
                  value={userTest}
                  onChange={(e) => setUserTest(e.target.value)}
                  placeholder="Paste your STD test result here..."
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "..." : t("companion.verify.checkButton")}
              </button>
            </>
          )}

          {verificationResult === "compatible" && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                {t("companion.verify.compatible")}
              </h3>
              <p className="text-sm text-slate-300">
                Your test results are compatible with this partner.
              </p>
            </div>
          )}

          {verificationResult === "notCompatible" && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                {t("companion.verify.notCompatible")}
              </h3>
              <p className="text-sm text-slate-300">
                Your test results are not compatible with this partner.
              </p>
            </div>
          )}

          {verificationResult === "error" && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">❌</div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                {t("companion.verify.error")}
              </h3>
              <p className="text-sm text-slate-300">Please upload your test result first.</p>
            </div>
          )}

          {verificationResult && (
            <button
              onClick={() => {
                setVerificationResult(null);
                setUserTest("");
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
            >
              Check Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPartner;
