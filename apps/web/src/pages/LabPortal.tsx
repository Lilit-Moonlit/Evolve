import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";
import { extractFaceEmbedding, type FaceEmbedding } from "../lib/face-verification";

const apiFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

const API_KEY_STORAGE = "evolve_lab_api_key";

type Step = "register" | "scan" | "verify" | "done";

interface LabPortalProps {
  /** Optional initial apiKey (e.g. from a URL param) to skip registration. */
  initialApiKey?: string;
}

/**
 * On-site lab portal. Lives OUTSIDE ProtectedRoute (no user session): the lab
 * authenticates itself with its own API key, scans the patient QR, face-matches
 * the patient against the stored private embedding, and attaches a report.
 *
 * Privacy guarantee: the lab never receives profile data — only the boolean
 * face-match result and the userId embedded in the QR.
 */
export default function LabPortal({ initialApiKey }: LabPortalProps) {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return sessionStorage.getItem(API_KEY_STORAGE) || initialApiKey || "";
    } catch {
      return initialApiKey || "";
    }
  });
  const [step, setStep] = useState<Step>("register");
  const [labName, setLabName] = useState("");
  const [labEmail, setLabEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scan state
  const [scanning, setScanning] = useState(false);
  const [scannedUserId, setScannedUserId] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Verify state
  const [verifyPhotoEmbedding, setVerifyPhotoEmbedding] = useState<FaceEmbedding | null>(null);
  const [verifyPhotoUrl, setVerifyPhotoUrl] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matched: boolean;
    similarity: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Report state
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Move straight to scan once we have an API key.
  useEffect(() => {
    if (apiKey && step === "register") {
      setStep("scan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // Cleanup scanner on unmount.
  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  const persistApiKey = (key: string) => {
    setApiKey(key);
    try {
      sessionStorage.setItem(API_KEY_STORAGE, key);
    } catch {
      /* storage unavailable — non fatal */
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    if (!labName.trim() || !labEmail.trim()) {
      setError(t("labPortal.register.required"));
      return;
    }
    try {
      const res = await apiFetch("/api/lab/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: labName.trim(), email: labEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("labPortal.register.failed"));
        return;
      }
      persistApiKey(data.apiKey);
      setStatus(t("labPortal.register.savedKey"));
    } catch (err) {
      console.error(err);
      setError(t("labPortal.register.failed"));
    }
  };

  const handleStartScan = () => {
    setError(null);
    setStatus(null);
    if (!apiKey) return;
    setScanning(true);
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      await scanner.stop().catch(() => undefined);
    }
  };

  const handleStopScan = async () => {
    await stopScanner();
    setScanning(false);
  };

  // Start the camera scanner only AFTER <div id="lab-qr-reader"> is mounted
  // (it renders when scanning === true). Html5Qrcode throws in its constructor
  // when the element is missing, so it must never be instantiated synchronously
  // right after setScanning(true) — otherwise the camera can never start.
  useEffect(() => {
    if (!scanning) return;
    let stopped = false;

    const onDecoded = (decodedText: string) => {
      // Payload format: evolve://lab-patient/<userId>
      const match = decodedText.match(/evolve:\/\/lab-patient\/(.+)$/);
      const userId = match ? decodeURIComponent(match[1]) : decodedText.trim();
      if (!userId) return;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      setScannedUserId(userId);
      setStep("verify");
      setScanning(false);
      scanner?.stop().catch(() => undefined);
    };

    const startWithFacingMode = async (
      scanner: Html5Qrcode,
      facingMode: "environment" | "user",
    ) => {
      await scanner.start(
        { facingMode },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        onDecoded,
        () => {
          /* per-frame errors ignored */
        },
      );
    };

    const start = async () => {
      const scanner = new Html5Qrcode("lab-qr-reader");
      scannerRef.current = scanner;
      try {
        await startWithFacingMode(scanner, "environment");
      } catch (err) {
        if (stopped) return;
        // Laptops/desktops frequently expose only a "user" camera — fall back.
        try {
          await startWithFacingMode(scanner, "user");
        } catch (err2) {
          if (stopped) return;
          console.error(err, err2);
          scannerRef.current = null;
          setScanning(false);
          const name = (err2 as { name?: string })?.name;
          if (name === "NotAllowedError") {
            setError(t("labPortal.scan.noPermission"));
          } else if (name === "NotFoundError") {
            setError(t("labPortal.scan.noCamera"));
          } else {
            setError(t("labPortal.scan.startFailed"));
          }
        }
      }
    };

    void start();
    return () => {
      stopped = true;
    };
  }, [scanning, t]);

  const handlePhotoFile = async (file: File | undefined) => {
    setError(null);
    setMatchResult(null);
    setVerifyPhotoEmbedding(null);
    setVerifyPhotoUrl(null);
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      setVerifyPhotoUrl(dataUrl);
      const embedding = await extractFaceEmbedding(dataUrl);
      if (!embedding) {
        setError(t("labPortal.verify.noFace"));
        return;
      }
      setVerifyPhotoEmbedding(embedding);
    } catch (err) {
      console.error(err);
      setError(t("labPortal.verify.photoError"));
    }
  };

  const handleVerify = async () => {
    setError(null);
    setStatus(null);
    if (!apiKey || !scannedUserId || !verifyPhotoEmbedding) return;
    setVerifying(true);
    try {
      const res = await apiFetch("/api/lab/partner/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          userId: scannedUserId,
          embedding: verifyPhotoEmbedding,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("labPortal.verify.failed"));
        return;
      }
      setMatchResult({ matched: !!data.matched, similarity: data.similarity ?? 0 });
    } catch (err) {
      console.error(err);
      setError(t("labPortal.verify.failed"));
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    if (!apiKey || !scannedUserId || !rawText.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/lab/partner/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          userId: scannedUserId,
          rawText: rawText.trim(),
          faceMatchStatus: matchResult?.matched ? "matched" : "none",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("labPortal.report.failed"));
        return;
      }
      setSubmitted(true);
      setStatus(t("labPortal.report.success"));
    } catch (err) {
      console.error(err);
      setError(t("labPortal.report.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const resetSession = async () => {
    await stopScanner();
    setScanning(false);
    setScannedUserId(null);
    setVerifyPhotoEmbedding(null);
    setVerifyPhotoUrl(null);
    setMatchResult(null);
    setRawText("");
    setSubmitted(false);
    setError(null);
    setStatus(null);
    setStep("scan");
  };

  if (step === "register") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold mb-1">{t("labPortal.title")}</h1>
            <p className="text-sm text-gray-500 mb-6">{t("labPortal.subtitle")}</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("labPortal.register.name")}
                </label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder={t("labPortal.register.namePlaceholder")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("labPortal.register.email")}
                </label>
                <input
                  type="email"
                  value={labEmail}
                  onChange={(e) => setLabEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="lab@example.com"
                />
              </div>
              {status && <p className="text-sm text-green-700">{status}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t("labPortal.register.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold">{t("labPortal.title")}</h1>
              <p className="text-xs text-gray-500">
                {t("labPortal.apiKey")}: <span className="font-mono">{apiKey}</span>
              </p>
            </div>
            <button
              onClick={resetSession}
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("labPortal.newPatient")}
            </button>
          </div>
        </div>

        {step === "scan" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-semibold">{t("labPortal.scan.title")}</h2>
            <p className="text-sm text-gray-500">{t("labPortal.scan.hint")}</p>
            {!scanning ? (
              <button
                onClick={handleStartScan}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t("labPortal.scan.start")}
              </button>
            ) : (
              <div className="space-y-2">
                <div id="lab-qr-reader" className="w-full max-w-sm mx-auto" />
                <button
                  onClick={handleStopScan}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t("labPortal.scan.stop")}
                </button>
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}

        {step === "verify" && scannedUserId && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-semibold">{t("labPortal.verify.title")}</h2>
              <p className="text-xs text-gray-400">
                {t("labPortal.verify.patientId")}:{" "}
                <span className="font-mono">{scannedUserId}</span>
              </p>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {t("labPortal.verify.takePhoto")}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => {
                    void handlePhotoFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              {verifyPhotoUrl && (
                <img
                  src={verifyPhotoUrl}
                  alt={t("labPortal.verify.photoAlt")}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              )}
              {verifyPhotoEmbedding && (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors"
                >
                  {verifying ? t("labPortal.verify.checking") : t("labPortal.verify.confirm")}
                </button>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {matchResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    matchResult.matched
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <p className="font-semibold">
                    {matchResult.matched
                      ? t("labPortal.verify.matched")
                      : t("labPortal.verify.unmatched")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("labPortal.verify.similarity")}: {Math.round(matchResult.similarity * 100)}%
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-1">{t("labPortal.report.title")}</h2>
              <p className="text-xs text-gray-500 mb-3">{t("labPortal.report.hint")}</p>
              <form onSubmit={handleSubmitReport} className="space-y-3">
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={5}
                  disabled={!matchResult?.matched}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder={t("labPortal.report.placeholder")}
                />
                <button
                  type="submit"
                  disabled={!matchResult?.matched || !rawText.trim() || submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? t("labPortal.report.submitting") : t("labPortal.report.submit")}
                </button>
              </form>
              {submitted && <p className="mt-3 text-sm text-green-700">{status}</p>}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
