// PublicProfile.tsx — Public profile page for /p/:username
// Shows minimal public data (photo, username, name) + QR code + compatibility check button
// Must compile with tsc --noEmit (ignore db.ts:270) and pass prettier

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppState } from "../store/AppContext";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";

// API helper with credentials included
const apiFetch = (input: RequestInfo, init?: RequestInit) => {
  return fetch(input, { ...init, credentials: "include" });
};

export default function PublicProfile() {
  const { t } = useTranslation("publicProfile");
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, myProfile } = useAppState();
  const myUserId = myProfile?.id || "";

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch profile on username change
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    apiFetch(`/api/public/profile/${encodeURIComponent(username)}`)
      .then((res) => {
        if (res.status === 404) {
          setError(t("publicProfile.notFound"));
          setProfile(null);
        } else if (!res.ok) {
          setError(t("publicProfile.loading"));
          setProfile(null);
        } else {
          res
            .json()
            .then((data) => {
              setProfile(data);
              setError(null);
            })
            .catch(() => {
              setError(t("publicProfile.loading"));
              setProfile(null);
            });
        }
      })
      .catch(() => {
        setError(t("publicProfile.loading"));
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, [username, t]);

  // Generate QR code for the profile userId
  useEffect(() => {
    if (!canvasRef.current || !profile?.userId) return;
    const payload = `evolve://person/${encodeURIComponent(profile.userId)}`;
    QRCode.toCanvas(
      canvasRef.current,
      payload,
      {
        width: 180,
        margin: 1,
        errorCorrectionLevel: "M",
      },
      (err) => {
        if (err) console.error("QR generation failed", err);
      },
    );
  }, [profile?.userId]);

  const handleCheckCompatibility = async () => {
    if (!profile?.userId) return;
    setCheckStatus(null);
    try {
      const res = await apiFetch("/api/checks/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: profile.userId }),
      });
      if (res.status === 200) {
        const data = await res.json();
        setCheckStatus(t("publicProfile.requested"));
      } else if (res.status === 409) {
        setCheckStatus(t("scan.pendingExists"));
      } else if (res.status === 400) {
        setCheckStatus(t("publicProfile.self"));
      } else if (res.status === 401) {
        setCheckStatus(t("publicProfile.loginRequired"));
      } else {
        setCheckStatus(t("publicProfile.loading"));
      }
    } catch (e) {
      setCheckStatus(t("publicProfile.loading"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">{t("publicProfile.loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">{t("publicProfile.notFound")}</div>
      </div>
    );
  }

  const isOwner = profile.userId === myUserId;
  const canCheck = isAuthenticated && !isOwner;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center gap-4">
            {/* Photo */}
            <div className="w-40 h-40 rounded-2xl border border-gray-200 overflow-hidden">
              {profile.imageUrl ? (
                <img
                  src={profile.imageUrl}
                  alt={profile.name || profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-semibold">
                    {(profile.name || profile.username || "")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
            {profile.name && <p className="text-lg text-gray-600">{profile.name}</p>}
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("publicProfile.scanTitle")}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <canvas
              ref={canvasRef}
              className="rounded-lg border border-gray-200 bg-white p-1"
              width={180}
              height={180}
              aria-label={t("publicProfile.qrAria")}
            />
            <p className="text-sm text-gray-500 text-center">{t("publicProfile.qrDescription")}</p>
          </div>
        </div>

        {/* Compatibility Check */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {canCheck ? (
            <button
              onClick={handleCheckCompatibility}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2.5 disabled:opacity-40 transition-colors"
              disabled={!!checkStatus}
            >
              {t("publicProfile.check")}
            </button>
          ) : !isAuthenticated ? (
            <p className="text-sm text-gray-600 text-center">{t("publicProfile.loginRequired")}</p>
          ) : isOwner ? (
            <p className="text-sm text-gray-500 text-center">{t("publicProfile.selfHint")}</p>
          ) : null}
          {checkStatus && (
            <p className="mt-3 text-sm text-center text-blue-600 font-medium">{checkStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
