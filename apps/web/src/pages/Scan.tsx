import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";

// API helper with credentials include
const apiFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, credentials: "include" });

const Scan: React.FC = () => {
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<"success" | "self" | "pending" | "error" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  // Start/stop scanner logic
  useEffect(() => {
    if (!scanning) {
      scannerRef.current?.stop().catch(() => undefined);
      return;
    }

    let stopped = false;
    const onDecoded = (decodedText: string) => {
      // Decode payload: evolve://person/<userId>
      const match = decodedText.match(/evolve:\/\/person\/(.+)$/);
      const extractedId = match ? decodeURIComponent(match[1]) : decodedText.trim();
      if (!extractedId) {
        setMessage(t("scan.invalidCode"));
        return;
      }
      setTargetId(extractedId);
      scannerRef.current?.stop().catch(() => undefined);
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

    const initScanner = async () => {
      // Ensure the element is already rendered
      const element = document.getElementById("evolve-scan-reader");
      if (!element) {
        console.error("Scanner element not found");
        setScanning(false);
        return;
      }

      const scanner = new Html5Qrcode("evolve-scan-reader");
      scannerRef.current = scanner;

      try {
        await startWithFacingMode(scanner, "environment");
      } catch (err) {
        if (stopped) return;
        // Fallback to user-facing camera for desktops
        try {
          await startWithFacingMode(scanner, "user");
        } catch (err2) {
          if (stopped) return;
          console.error(err, err2);
          scannerRef.current = null;
          setScanning(false);
          const name = (err2 as { name?: string })?.name;
          if (name === "NotAllowedError") {
            setMessage(t("publicProfile.loginRequired"));
          } else if (name === "NotFoundError") {
            setMessage(t("scan.error"));
          } else {
            setMessage(t("scan.error"));
          }
        }
      }
    };

    void initScanner();

    return () => {
      stopped = true;
    };
  }, [scanning, t]);

  const handleStart = () => {
    setResult(null);
    setMessage(null);
    setTargetId(null);
    setScanning(true);
  };

  const handleStop = async () => {
    await scannerRef.current?.stop().catch(() => undefined);
    scannerRef.current = null;
    setScanning(false);
  };

  const handleRequest = async () => {
    if (!targetId) return;
    setResult(null);
    setMessage(null);
    try {
      const res = await apiFetch("/api/checks/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult("success");
        setMessage(t("scan.requested"));
        // Stop scanner after success
        await handleStop();
      } else {
        if (res.status === 400) {
          // Self request
          setResult("self");
          setMessage(t("scan.self"));
        } else if (res.status === 409) {
          setResult("pending");
          setMessage(t("scan.pendingExists"));
        } else if (res.status === 401) {
          setMessage(t("publicProfile.loginRequired"));
        } else {
          setResult("error");
          setMessage(t("scan.error"));
        }
        // Allow restart after non-2xx
        await handleStop();
      }
    } catch (err) {
      console.error(err);
      setResult("error");
      setMessage(t("scan.error"));
      await handleStop();
    }
  };

  // Auto-request when targetId is set (from scan)
  useEffect(() => {
    if (targetId && !scanning) {
      void handleRequest();
    }
  }, [targetId, scanning]);

  const showScanner = scanning && !result;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-2">{t("scan.title")}</h1>
          <p className="text-sm text-gray-600 mb-4">{t("scan.hint")}</p>
          {showScanner ? (
            <div className="space-y-4">
              <div id="evolve-scan-reader" className="w-full max-w-sm mx-auto" />
              <button
                onClick={handleStop}
                className="w-full py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t("scan.stop")}
              </button>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {scanning ? t("scan.scanning") : t("scan.start")}
            </button>
          )}
          {message && (
            <div className="mt-4 p-3 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-800">{message}</p>
            </div>
          )}
          {result === "success" && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">{t("scan.requested")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;
