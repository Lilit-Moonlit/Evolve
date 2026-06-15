import { NavLink, Outlet } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { useAppState } from "../store/AppContext";

export default function Layout() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAppState();

  return (
    <div className="layout">
      <header>
        <h1>💖 {t("app.name")}</h1>
        <nav>
          {isAuthenticated && (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {t("navigation.swipe")}
              </NavLink>
              <NavLink
                to="/chat"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {t("navigation.messages")}
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {t("navigation.profile")}
              </NavLink>
              <NavLink
                to="/profile/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {t("navigation.settings")}
              </NavLink>
            </>
          )}
          <ConnectButton />
          {isAuthenticated && (
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition ml-2"
            >
              {t("auth.logout")}
            </button>
          )}
          <LanguageSelector showLabel={false} className="ml-2" />
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
