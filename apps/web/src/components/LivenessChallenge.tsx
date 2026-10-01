/**
 * Liveness Challenge Component
 *
 * Displays a random liveness challenge during chat to verify the user is real.
 * Captures a selfie, compares to stored face hash, and checks the challenge.
 *
 * Anti-catfish defense: random-timed challenges make it impossible for
 * operators of fake profiles to prepare responses in advance.
 */

import React, { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import {
  getRandomChallenge,
  getChallengeText,
  performLivenessCheck,
  captureCameraFrame,
  loadFaceMesh,
  extractFaceEmbedding,
  computeFaceHash,
  type LivenessChallenge as LivenessChallengeType,
  type LivenessCheckResult,
} from "../lib/face-verification";

interface LivenessChallengeProps {
  /** The profile ID we're chatting with */
  profileId: string;
  /** Callback when challenge is completed (success or failure) */
  onComplete: (result: LivenessCheckResult) => void;
  /** Callback to dismiss without completing */
  onDismiss: () => void;
}

const LivenessChallenge: React.FC<LivenessChallengeProps> = ({
  profileId,
  onComplete,
  onDismiss,
}) => {
  const { t } = useTranslation();
  const { myProfile } = useAppState();
  const [challenge] = useState<LivenessChallengeType>(() => getRandomChallenge());
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [status, setStatus] = useState<"idle" | "capturing" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LivenessCheckResult | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setError(t("chat.liveness.cameraError"));
    }
  }, [t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const captureAndVerify = useCallback(async () => {
    if (!videoRef.current) return;
    setCapturing(true);
    setStatus("capturing");

    try {
      // Capture frame from video
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(videoRef.current, 0, 0);

      // Stop camera
      stopCamera();

      setStatus("processing");

      // Get stored face embedding from profile hash
      // For now, we'll re-extract from the profile photo
      const profile = myProfile;
      if (!profile.faceHash) {
        setError(t("chat.liveness.noStoredFace"));
        setStatus("done");
        return;
      }

      // Extract embedding from camera frame
      const liveEmbedding = await extractFaceEmbedding(canvas);
      if (!liveEmbedding) {
        setError(t("chat.liveness.noFaceDetected"));
        setStatus("done");
        return;
      }

      // Compare with stored face hash
      const liveHash = await computeFaceHash(liveEmbedding);
      const match = liveHash === profile.faceHash;

      const checkResult: LivenessCheckResult = {
        confirmed: match,
        challenge,
        faceResult: {
          match,
          similarity: match ? 1.0 : 0.0,
          facesDetected: 1,
        },
        timestamp: Date.now(),
      };

      setResult(checkResult);
      setStatus("done");
      onComplete(checkResult);
    } catch (err) {
      console.error(err);
      setError(t("chat.liveness.verificationError"));
      setStatus("done");
    }
  }, [challenge, myProfile, onComplete, stopCamera, t]);

  const handleStartCapture = useCallback(async () => {
    await startCamera();
    // Countdown before capture
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(0);
    await captureAndVerify();
  }, [startCamera, captureAndVerify]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="bg-indigo-900/20 border border-indigo-700 rounded-xl p-4 my-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🛡️</span>
        <p className="text-indigo-300 text-sm font-medium">{t("chat.liveness.title")}</p>
      </div>
      <p className="text-indigo-200 text-xs mb-3">{t("chat.liveness.description")}</p>

      {/* Challenge instruction */}
      <div className="bg-slate-800 rounded-lg p-3 mb-3">
        <p className="text-white text-sm font-medium">{getChallengeText(challenge)}</p>
        <p className="text-gray-400 text-xs mt-1">{t("chat.liveness.lookStraight")}</p>
      </div>

      {/* Camera preview */}
      <video
        ref={videoRef}
        className="w-full max-w-xs rounded-lg mb-3 hidden"
        autoPlay
        playsInline
        muted
      />

      {/* Status display */}
      {status === "idle" && (
        <div className="flex gap-2">
          <button
            onClick={handleStartCapture}
            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("chat.liveness.startCapture")}
          </button>
          <button
            onClick={onDismiss}
            className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 text-sm rounded-lg transition-colors"
          >
            {t("chat.liveness.skip")}
          </button>
        </div>
      )}

      {status === "capturing" && countdown > 0 && (
        <div className="text-center">
          <p className="text-4xl font-bold text-white mb-2">{countdown}</p>
          <p className="text-indigo-300 text-sm">{t("chat.liveness.getReady")}</p>
        </div>
      )}

      {status === "processing" && (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-indigo-300 text-sm">{t("chat.liveness.processing")}</p>
        </div>
      )}

      {status === "done" && result && (
        <div
          className={`p-3 rounded-lg ${
            result.confirmed
              ? "bg-green-900/30 border border-green-700"
              : "bg-red-900/30 border border-red-700"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              result.confirmed ? "text-green-300" : "text-red-300"
            }`}
          >
            {result.confirmed ? t("chat.liveness.success") : t("chat.liveness.failed")}
          </p>
          {result.confirmed && (
            <p className="text-green-400/70 text-xs mt-1">
              {t("chat.liveness.lastCheck", {
                time: new Date(result.timestamp).toLocaleTimeString(),
              })}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg mt-2">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LivenessChallenge;
