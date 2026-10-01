import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// Chromium fires `beforeinstallprompt` ONCE per page load — possibly BEFORE
// React mounts (the main bundle is large). Capture it at module scope so the
// nav item never misses it; the hook also keeps its own listener for the
// late-firing case. Both listeners calling preventDefault is harmless.
let earlyInstallEvt: BeforeInstallPromptEvent | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", ((e: BeforeInstallPromptEvent) => {
    e.preventDefault();
    earlyInstallEvt = e;
  }) as EventListener);
}

/**
 * Shared PWA install detection + prompt logic. Because the web build is a
 * PWA that runs from ANY origin, installing it is the ban-resistant
 * distribution channel: if the stores remove the app, the web version still
 * lets users install Evolve without Google Play / App Store.
 *
 * Chromium exposes `beforeinstallprompt`; iOS requires the manual
 * "Share → Add to Home Screen" flow, so we surface a hint panel instead.
 * When Chromium never fires the event (install criteria unmet, stale
 * registration, browser policy), the UI falls back to the hint panel too —
 * the nav item must stay discoverable either way.
 */
function usePwaInstall() {
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(earlyInstallEvt);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as NavigatorWithStandalone).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window);
    setIsIos(ios);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installEvt) return false;
    try {
      await installEvt.prompt();
      const choice = await installEvt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        return true;
      }
      return false;
    } catch {
      /* user dismissed the prompt */
      return false;
    }
  };

  return { canInstall: Boolean(installEvt), isIos, installed, promptInstall };
}

/**
 * Header nav variant of the install affordance (moved here from the old
 * floating bottom-right button). Chromium installs directly on click; iOS
 * (or unknown browsers) toggle a hint panel dropping below the header.
 */
export const PwaInstallNavItem: React.FC = () => {
  const { t } = useTranslation();
  const { canInstall, isIos, installed, promptInstall } = usePwaInstall();
  const [open, setOpen] = useState(false);

  // Hide ONLY when the app is already installed (running standalone).
  // Visibility must NOT depend on `beforeinstallprompt` / iOS detection:
  // Chromium often never fires the event (install criteria unmet, stale
  // registration, browser policy), which made the nav item vanish entirely.
  // Without the event the click falls back to the instruction panel.
  if (installed) return null;

  const handleClick = () => {
    if (canInstall) {
      void promptInstall();
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <span className="relative ml-2 inline-flex">
      <button
        type="button"
        onClick={handleClick}
        className="bg-transparent border-none cursor-pointer p-0 text-base font-medium text-[color:#eef2f7] transition-colors hover:text-white"
      >
        {t("navigation.downloadApp")}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-2xl p-4 shadow-xl text-left">
          <p className="text-sm font-medium text-white">{t("pwa.installTitle")}</p>
          <p className="text-xs text-slate-400 mt-1">
            {isIos ? t("pwa.iosHint") : t("pwa.installHint")}
          </p>
          <div className="flex gap-2 mt-3">
            {canInstall && (
              <button
                type="button"
                onClick={() => void promptInstall()}
                className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium transition"
              >
                {t("pwa.install")}
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition"
            >
              {t("pwa.dismiss")}
            </button>
          </div>
        </div>
      )}
    </span>
  );
};

export default PwaInstallNavItem;
