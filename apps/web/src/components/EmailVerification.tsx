import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function EmailVerification({
  email,
  onVerified,
  onBack,
}: EmailVerificationProps) {
  const { t } = useTranslation();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send verification code on mount — runs once, sendCode intentionally omitted from deps
  useEffect(() => {
    sendCode();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const sendCode = async () => {
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/email/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(t("auth.email.verify.sendFailed"));
      } else {
        setResendCooldown(60);
      }
    } catch (error: unknown) {
      setError(t("auth.email.verify.sendFailed"));
    } finally {
      setResendLoading(false);
    }
  };

  const handleInput = (index: number, value: string) => {
    // Only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (digit && index === 5 && newCode.every((d) => d !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newCode = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();

    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeStr?: string) => {
    const fullCode = codeStr ?? code.join("");
    if (fullCode.length !== 6) {
      setError(t("auth.email.verify.invalidCode"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: fullCode }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified();
      } else {
        setError(
          data.error === "INVALID_CODE"
            ? t("auth.email.verify.wrongCode")
            : t("auth.email.verify.verifyFailed"),
        );
        // Clear code on wrong attempt
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: unknown) {
      setError(t("auth.email.verify.verifyFailed"));
    } finally {
      setLoading(false);
    }
  };

  const codeComplete = code.every((d) => d !== "");

  return (
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 text-sm mr-4"
          aria-label={t("common.back")}
        >
          ← {t("common.back")}
        </button>
        <h2 className="text-2xl font-bold text-white">
          {t("auth.email.verify.title")}
        </h2>
      </div>

      {/* Description */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-blue-900 rounded-full flex items-center justify-center">
          <span className="text-3xl">📧</span>
        </div>
        <p className="text-gray-300 text-sm">
          {t("auth.email.verify.description")}
        </p>
        <p className="text-blue-400 font-medium text-sm">{email}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 6-digit code inputs */}
      <div className="flex justify-center gap-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-2xl font-bold bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            aria-label={t("auth.email.verify.digitLabel", {
              position: index + 1,
            })}
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={() => handleVerify()}
        disabled={loading || !codeComplete}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? t("auth.loading") : t("auth.email.verify.button")}
      </button>

      {/* Resend */}
      <div className="text-center">
        {resendCooldown > 0 ? (
          <p className="text-gray-400 text-sm">
            {t("auth.email.verify.resendIn", { seconds: resendCooldown })}
          </p>
        ) : (
          <button
            onClick={sendCode}
            disabled={resendLoading}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors disabled:opacity-50"
          >
            {resendLoading ? t("auth.loading") : t("auth.email.verify.resend")}
          </button>
        )}
      </div>
    </div>
  );
}
