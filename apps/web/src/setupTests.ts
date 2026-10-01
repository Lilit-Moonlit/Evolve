// setupTests.ts - Test environment setup for Vite + React Testing Library
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AppStateProvider } from "./store/AppContext";

// Initialize i18next with all supported locales (empty translation objects)
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: {} },
    uk: { translation: {} },
    de: { translation: {} },
    fr: { translation: {} },
    es: { translation: {} },
    pt: { translation: {} },
    ja: { translation: {} },
    ko: { translation: {} },
    zh: { translation: {} },
    ar: { translation: {} },
    vi: { translation: {} },
    hi: { translation: {} },
    tr: { translation: {} },
    th: { translation: {} },
    id: { translation: {} },
    ms: { translation: {} },
    ru: { translation: {} },
    bg: { translation: {} },
    cs: { translation: {} },
    da: { translation: {} },
    el: { translation: {} },
    et: { translation: {} },
    fi: { translation: {} },
    hu: { translation: {} },
    ga: { translation: {} },
    it: { translation: {} },
    lt: { translation: {} },
    lv: { translation: {} },
    mt: { translation: {} },
    nl: { translation: {} },
    pl: { translation: {} },
    ro: { translation: {} },
    sk: { translation: {} },
    sl: { translation: {} },
    sv: { translation: {} },
  },
});

/**
 * Render a React element wrapped with required providers for tests.
 * @param ui React element to render.
 */
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(AppStateProvider, null, ui),
    ),
  );
};
