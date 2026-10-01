// LabDashboard.tsx — Laboratory dashboard (partner session, OUTSIDE ProtectedRoute).
// Sign in as a lab partner (email+password session, cookie partner_session),
// scan the patient QR (evolve://lab-patient/<userId>), begin a visit,
// confirm identity, attach the STD report, and list visits.
// Must compile with tsc --noEmit (ignore db.ts:270) and pass prettier.

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";

const apiFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

type Visit = {
  id: string;
  patientName: string | null;
  status: string;
  rawText?: string | null;
  createdAt: string;
};

export default function LabDashboard() {
  const { t } = useTranslation("labDashboard");

  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [labName, setLabName] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  // Scan state
  const [scanning, setScanning] = useState(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [patient, setPatient] = useState<{
    userId: string;
    username: string | null;
    name: string | null;
    imageUrl: string | null;
  } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Visit state
  const [visitId, setVisitId] = useState<string | null>(null);
  const [visitStatus, setVisitStatus] = useState<string | null>(null);
  const [faceStatus, setFaceStatus] = useState<"matched" | "none" | null>(null);
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Visits list
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(false);

  // Restore partner session on mount.
  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/partner/me");
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
          setLabName(data.name || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  // Stop the scanner on unmount.
  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = authMode === "register" ? "/api/partner/register" : "/api/partner/login";
    const body =
      authMode === "register"
        ? { name: registerName.trim(), email: email.trim(), password }
        : { email: email.trim(), password };
    try {
      const res = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || t("login"));
        return;
      }
      setAuthenticated(true);
      setLabName(data.name || registerName);
      setPassword("");
    } catch (err) {
      console.error(err);
      setAuthError(t("login"));
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/api/partner/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setAuthenticated(false);
    setLabName("");
    setScannedId(null);
    setPatient(null);
    setVisitId(null);
    setVisitStatus(null);
    setFaceStatus(null);
    setRawText("");
    setVisits([]);
  };

  const handleStartScan = () => {
    setAuthError(null);
    setStatusMsg(null);
    setScannedId(null);
    setPatient(null);
    setVisitId(null);
    setVisitStatus(null);
    setFaceStatus(null);
    setRawText("");
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

  // Start the camera scanner only AFTER <div id="lab-dash-qr-reader"> is mounted.
  useEffect(() => {
    if (!scanning) return;
    let stopped = false;

    const onDecoded = (decodedText: string) => {
      const match = decodedText.match(/evolve:\/\/lab-patient\/(.+)$/);
      const userId = match ? decodeURIComponent(match[1]) : decodedText.trim();
      if (!userId) return;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      setScannedId(userId);
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
      const scanner = new Html5Qrcode("lab-dash-qr-reader");
      scannerRef.current = scanner;
      try {
        await startWithFacingMode(scanner, "environment");
      } catch (err) {
        if (stopped) return;
        try {
          await startWithFacingMode(scanner, "user");
        } catch (err2) {
          if (stopped) return;
          console.error(err, err2);
          scannerRef.current = null;
          setScanning(false);
          setStatusMsg(t("scanTitle"));
        }
      }
    };

    void start();
    return () => {
      stopped = true;
    };
  }, [scanning, t]);

  // Fetch patient card for the scanned QR id.
  const handleApplyScan = useCallback(async () => {
    if (!scannedId) return;
    setAuthError(null);
    setStatusMsg(null);
    try {
      const res = await apiFetch(`/api/lab/account/scan?userId=${encodeURIComponent(scannedId)}`);
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || t("scanTitle"));
        return;
      }
      setPatient(data);
    } catch (err) {
      console.error(err);
      setStatusMsg(t("scanTitle"));
    }
  }, [scannedId, t]);

  useEffect(() => {
    if (scannedId) void handleApplyScan();
  }, [scannedId, handleApplyScan]);

  const handleBeginVisit = async () => {
    if (!patient) return;
    setStatusMsg(null);
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/lab/account/begin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: patient.userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || t("beginVisit"));
        return;
      }
      setVisitId(data.visitId || null);
      setVisitStatus(data.status || null);
    } catch (err) {
      console.error(err);
      setStatusMsg(t("beginVisit"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFaceConfirm = async (status: "matched" | "none") => {
    if (!visitId) return;
    setStatusMsg(null);
    try {
      const res = await apiFetch(`/api/lab/account/visit/${visitId}/face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceMatchStatus: status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || t("faceTitle"));
        return;
      }
      setFaceStatus(status);
    } catch (err) {
      console.error(err);
      setStatusMsg(t("faceTitle"));
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitId || !rawText.trim()) return;
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await apiFetch(`/api/lab/account/visit/${visitId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: rawText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || t("reportFailed"));
        return;
      }
      setVisitStatus(data.status || "pending");
      setStatusMsg(t("reportSuccess"));
      await loadVisits();
    } catch (err) {
      console.error(err);
      setStatusMsg(t("reportFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const loadVisits = useCallback(async () => {
    try {
      const res = await apiFetch("/api/lab/account/visits");
      const data = await res.json();
      if (res.ok && Array.isArray(data.visits)) {
        setVisits(data.visits);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (authenticated) void loadVisits();
  }, [authenticated, loadVisits]);

  const resetVisit = async () => {
    await stopScanner();
    setScanning(false);
    setScannedId(null);
    setPatient(null);
    setVisitId(null);
    setVisitStatus(null);
    setFaceStatus(null);
    setRawText("");
    setStatusMsg(null);
  };

  // --- Auth screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-sm text-gray-600 mb-6">{t("scanHint")}</p>

          {authMode === "login" ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("login")}</h2>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t("email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t("password")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {authError && <div className="text-sm text-red-600">{authError}</div>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {t("submit")}
                </button>
              </form>
              <div className="mt-4 text-sm text-gray-600">
                {t("noAccount")}{" "}
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError(null);
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {t("createAccount")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("register")}</h2>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t("labName")}</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t("email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t("password")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                </div>
                {authError && <div className="text-sm text-red-600">{authError}</div>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {t("submit")}
                </button>
              </form>
              <div className="mt-4 text-sm text-gray-600">
                {t("haveAccount")}{" "}
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError(null);
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {t("login")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- Dashboard screen ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("title")}</h1>
            <p className="text-sm text-gray-600">
              {t("loggedInAs")}: <span className="font-medium text-gray-900">{labName}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            {t("logout")}
          </button>
        </div>

        {statusMsg && (
          <div className="text-sm text-gray-600 bg-white px-4 py-3 rounded-xl border border-gray-100">
            {statusMsg}
          </div>
        )}

        {/* Scan card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("scanTitle")}</h2>
          <p className="text-sm text-gray-600 mb-4">{t("scanHint")}</p>

          {!scanning && !patient && (
            <button
              onClick={handleStartScan}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {t("start")}
            </button>
          )}

          {scanning && (
            <div>
              <div id="lab-dash-qr-reader" className="w-full max-w-sm mx-auto" />
              <button
                onClick={handleStopScan}
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                {t("stop")}
              </button>
            </div>
          )}

          {patient && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden">
                  {patient.imageUrl ? (
                    <img
                      src={patient.imageUrl}
                      alt={patient.name || patient.username || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
                      {(patient.name || patient.username || "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{patient.name || "—"}</div>
                  <div className="text-sm text-gray-500">
                    {patient.username ? `@${patient.username}` : "—"}
                  </div>
                </div>
              </div>

              {!visitId ? (
                <button
                  onClick={handleBeginVisit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {t("beginVisit")}
                </button>
              ) : (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-600">
                    {t("status")}:{" "}
                    <span className="font-medium">{t(`visitStatus.${visitStatus || "none"}`)}</span>
                  </div>

                  {/* Face identity */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{t("faceTitle")}</h3>
                    {faceStatus === null ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => void handleFaceConfirm("matched")}
                          className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition-colors"
                        >
                          {t("matched")}
                        </button>
                        <button
                          onClick={() => void handleFaceConfirm("none")}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
                        >
                          {t("unmatched")}
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`text-sm font-medium ${
                          faceStatus === "matched" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {faceStatus === "matched" ? t("matched") : t("unmatched")}
                      </div>
                    )}
                  </div>

                  {/* Report */}
                  <form onSubmit={handleSubmitReport} className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      {t("reportTitle")}
                    </label>
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder={t("reportPlaceholder")}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !rawText.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {t("reportSubmit")}
                    </button>
                  </form>

                  <button
                    onClick={resetVisit}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    {t("start")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visits list */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("visits")}</h2>
          {visitsLoading ? (
            <div className="text-sm text-gray-500">{t("status")}…</div>
          ) : visits.length === 0 ? (
            <div className="text-sm text-gray-500">{t("noVisits")}</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visits.map((visit) => (
                <div key={visit.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{visit.patientName || "—"}</div>
                    <div className="text-xs text-gray-500">{visit.createdAt}</div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {t(`visitStatus.${visit.status || "none"}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
