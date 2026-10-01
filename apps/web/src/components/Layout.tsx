import { Link, NavLink, Outlet } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import PwaInstallNavItem from "./PwaInstallPrompt";
import { useAppState } from "../store/AppContext";
import { isSafetyMode } from "../lib/config";

export default function Layout() {
  const { t } = useTranslation();
  const { isAuthenticated, authMode } = useAppState();
  const safety = isSafetyMode();

  return (
    <div className="layout">
      <header>
        <h1>
          {/* Logo + EVOLVE as a single clickable link — replaces the old
              "Головна" nav item (all of its functionality lives here). */}
          <Link to="/" aria-label={t("app.name")} className="flex items-center gap-2">
            <img src="/logo.jpg" alt={t("app.name")} className="h-8" />
            <span className="uppercase tracking-widest">{t("app.name")}</span>
          </Link>
        </h1>
        <nav>
          {isAuthenticated && safety && (
            <NavLink to="/scan" className={({ isActive }) => (isActive ? "active" : "")}>
              {t("navigation.check")}
            </NavLink>
          )}
          {isAuthenticated && !safety && (
            <>
              <NavLink to="/chat" className={({ isActive }) => (isActive ? "active" : "")}>
                {t("navigation.communications")}
              </NavLink>
              {authMode === "pregnancy-bond" && (
                <NavLink to="/mode2" className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("navigation.mode2")}
                </NavLink>
              )}
              {authMode === "cryptic-choice" && (
                <NavLink to="/mode3" className={({ isActive }) => (isActive ? "active" : "")}>
                  {t("navigation.mode3")}
                </NavLink>
              )}
            </>
          )}
          {isAuthenticated && (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
              {t("navigation.profile")}
            </NavLink>
          )}
          <ConnectButton />
          <LanguageSelector showLabel={false} className="ml-2" />
          <PwaInstallNavItem />
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <Outlet />
      </main>

      <footer>
        <p>{t("app.copyright")}</p>
      </footer>
    </div>
  );
}
