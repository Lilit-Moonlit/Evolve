import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";

interface LabPatientQRProps {
  userId: string;
  /** Optional size in px; defaults to 180. */
  size?: number;
}

/**
 * Patient QR code for on-site lab verification.
 *
 * The QR encodes ONLY the public userId (no name, no photo, no profile data),
 * so it can be safely shown in the account and scanned by a partner lab.
 * The lab then face-matches the patient against the stored (private) face
 * embedding server-side — the lab never receives any profile data.
 */
export default function LabPatientQR({ userId, size = 180 }: LabPatientQRProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !userId) return;
    setError(false);
    // Namespace the payload so QR readers can recognize it as a lab token.
    const payload = `evolve://lab-patient/${encodeURIComponent(userId)}`;
    QRCode.toCanvas(
      canvasRef.current,
      payload,
      { width: size, margin: 1, errorCorrectionLevel: "M" },
      (err) => {
        if (err) {
          console.error("QR generation failed", err);
          setError(true);
        }
      },
    );
  }, [userId, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-gray-200 bg-white p-1"
        width={size}
        height={size}
        aria-label={t("profile.lab.patientQrAria")}
      />
      {error && <p className="text-xs text-red-600">{t("profile.lab.patientQrError")}</p>}
    </div>
  );
}
