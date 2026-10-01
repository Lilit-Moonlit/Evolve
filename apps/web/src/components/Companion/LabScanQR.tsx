import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";
import { parseLabPatientPayload } from "./lib/lab-qr";
import { fetchCompanionPatient } from "./lib/companion-api";

export const LabScanQR: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  // Спільна логіка: валідація пацієнта (сервер → localStorage) → список лабораторії → verify
  const handleProcessPatient = async (id: string) => {
    // Крос-девайсний доступ: спершу перевіряємо сервер, потім локальний fallback.
    let exists = false;
    try {
      const server = await fetchCompanionPatient(id);
      exists = Boolean(server && (server.photo || (server.additionalPhotos || []).length > 0));
    } catch {
      exists = false;
    }
    if (!exists) {
      const patientPhoto = localStorage.getItem(`patient_${id}_photo`);
      const patientAdditionalPhotos = localStorage.getItem(`patient_${id}_additional_photos`);
      exists = Boolean(patientPhoto || patientAdditionalPhotos);
    }

    if (!exists) {
      setError(t("companion.lab.patientNotFound"));
      return;
    }

    // Додаємо пацієнта до списку лабораторії
    const labId = localStorage.getItem("lab_id");
    if (labId) {
      const labPatients = JSON.parse(localStorage.getItem(`lab_${labId}_patients`) || "[]");
      const existingPatient = labPatients.find((p: any) => p.id === id);

      if (!existingPatient) {
        labPatients.push({
          id,
          name: `Patient ${id}`,
          hasResult: false,
          photos: [],
          testInfo: "",
        });
        localStorage.setItem(`lab_${labId}_patients`, JSON.stringify(labPatients));
      }
    }

    // Переходимо на сторінку верифікації пацієнта
    navigate(`/companion/lab/verify/${id}`);
  };

  const handleScan = () => {
    if (!userId.trim()) {
      setError(t("companion.lab.scanError"));
      return;
    }
    setError("");
    void handleProcessPatient(userId.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  // Почати/зупинити сканування камерою
  useEffect(() => {
    if (!scanning) {
      scannerRef.current?.stop().catch(() => undefined);
      return;
    }

    let stopped = false;
    const onDecoded = (decodedText: string) => {
      const extractedId = parseLabPatientPayload(decodedText);
      if (!extractedId) {
        setError(t("scan.invalidCode"));
        return;
      }
      awaitStopScanner();
      setError("");
      void handleProcessPatient(extractedId);
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
      const element = document.getElementById("companion-lab-qr-reader");
      if (!element) {
        console.error("Scanner element not found");
        setScanning(false);
        return;
      }

      const scanner = new Html5Qrcode("companion-lab-qr-reader");
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
          const name = (err2 as { name?: string })?.name;
          setError(
            name === "NotAllowedError"
              ? t("scan.error")
              : name === "NotFoundError"
                ? t("scan.error")
                : t("scan.error"),
          );
        }
      }
    };

    void initScanner();

    return () => {
      stopped = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const awaitStopScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setScanning(false);
    await scanner?.stop().catch(() => undefined);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.lab.scanQR")}</h1>
          <button
            onClick={() => navigate("/companion/lab/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/50 rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-sm text-slate-300 mb-4">{t("companion.lab.scanHint")}</p>

            {scanning ? (
              <div className="space-y-4">
                <div
                  id="companion-lab-qr-reader"
                  className="w-full max-w-sm mx-auto rounded-lg overflow-hidden"
                />
                <button
                  onClick={() => void awaitStopScanner()}
                  className="w-full py-2.5 bg-slate-600 text-slate-200 font-semibold rounded-lg hover:bg-slate-500 transition"
                >
                  {t("scan.stop")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setScanning(true)}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition shadow-lg shadow-emerald-500/25"
              >
                {t("scan.start")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs uppercase tracking-wider">
              {t("companion.lab.enterUserId")}
            </span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("companion.lab.enterUserId")}
            className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleScan}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            {t("companion.lab.scanButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabScanQR;
