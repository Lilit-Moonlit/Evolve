import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";

interface PhoneAuthFormProps {
  onBack: () => void;
}

type PhoneStep = "requesting" | "entered";

export default function PhoneAuthForm({ onBack }: PhoneAuthFormProps) {
  const { t } = useTranslation();
  const { requestPhoneOtp, verifyPhoneOtp, phoneOtpSent, loading } =
    useAppState();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const step: PhoneStep = phoneOtpSent ? "entered" : "requesting";

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) {
      setError("Please enter a phone number");
      return;
    }
    try {
      await requestPhoneOtp(phone);
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }
    try {
      await verifyPhoneOtp(phone, otp);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-6">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="text-pink-400 hover:text-pink-300 text-sm mr-4"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-white">
          {t("auth.phone.title")}
        </h2>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {step === "requesting" && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("auth.phone.phone")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("auth.phone.phonePlaceholder")}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] min-h-[48px] disabled:opacity-50"
          >
            {loading ? t("auth.loading") : t("auth.phone.getCode")}
          </button>
        </form>
      )}

      {step === "entered" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-gray-400 text-sm">
            {t("auth.phone.otpSent", { phone })}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("auth.phone.otp")}
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder={t("auth.phone.otpPlaceholder")}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-pink-500 text-center text-2xl tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] min-h-[48px] disabled:opacity-50"
          >
            {loading ? t("auth.loading") : t("auth.phone.verify")}
          </button>

          <button
            type="button"
            onClick={handleRequestOtp}
            disabled={loading}
            className="w-full py-2 text-pink-400 hover:text-pink-300 text-sm transition-colors"
          >
            {t("auth.phone.resendCode")}
          </button>
        </form>
      )}
    </div>
  );
}
