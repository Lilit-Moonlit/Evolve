import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLock, FaUser } from "react-icons/fa";

interface PhotoViewProps {
  imageUrl?: string;
  /** Accessible name of the photo. */
  alt: string;
  /** Whether the owner marked this photo as blurred. */
  blurred: boolean;
  /** Whether the current viewer may see the unblurred photo (grants already applied). */
  visible: boolean;
  /** Epoch ms until a temporary grant expires (0 when there is none). */
  temporaryUntil?: number;
  /** Called when a temporary grant countdown reaches zero. */
  onTemporaryExpired?: () => void;
  /** Show the "request access" action when the photo is locked. */
  showRequest?: boolean;
  onRequestClick?: () => void;
  className?: string;
  imgClassName?: string;
}

function formatSeconds(ms: number): string {
  return Math.max(0, Math.ceil(ms / 1000)).toString();
}

const PhotoView: React.FC<PhotoViewProps> = ({
  imageUrl,
  alt,
  blurred,
  visible,
  temporaryUntil,
  onTemporaryExpired,
  showRequest,
  onRequestClick,
  className = "",
  imgClassName = "",
}) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());

  // A temporary grant may expire while the page is open — blur locally at zero.
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // New grant (or new profile): reset the local expiry flag.
    setExpired(false);
    setNow(Date.now());
  }, [temporaryUntil]);

  const remaining = visible && temporaryUntil ? new Date(temporaryUntil).getTime() - now : 0;
  const tempActive = remaining > 0;

  useEffect(() => {
    if (!tempActive) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [tempActive, temporaryUntil]);

  useEffect(() => {
    if (visible && temporaryUntil && remaining <= 0) {
      setExpired(true);
      onTemporaryExpired?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, visible, temporaryUntil]);

  if (!imageUrl) {
    return (
      <div className={`profile-img-placeholder flex items-center justify-center ${className}`}>
        <FaUser />
      </div>
    );
  }

  const isLocked = blurred && (!visible || expired);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover ${isLocked ? "photo-blurred" : ""} ${imgClassName}`}
      />

      {isLocked && (
        <div className="photo-lock-overlay">
          <FaLock className="text-gray-300" />
          {showRequest && onRequestClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestClick();
              }}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {t("photo.request")}
            </button>
          )}
        </div>
      )}

      {tempActive && !expired && (
        <div className="photo-countdown">
          {t("photo.tempView", { seconds: formatSeconds(remaining) })}
        </div>
      )}
    </div>
  );
};

export default PhotoView;
