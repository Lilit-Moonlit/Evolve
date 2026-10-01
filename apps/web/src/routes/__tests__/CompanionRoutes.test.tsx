import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CompanionRoutes from "../CompanionRoutes";
import i18n from "i18next";
import "@/i18n/config";

/** Mount helper — mirrors how App.tsx mounts the companion flow. */
function renderCompanionAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="companion/*" element={<CompanionRoutes />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CompanionRoutes", () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await i18n.changeLanguage("uk");
  });

  it("renders the welcome screen with role selection and starts the user flow", () => {
    renderCompanionAt("/companion");

    expect(screen.getByText(i18n.t("companion.title"))).toBeInTheDocument();
    const startBtn = screen.getByRole("button", {
      name: i18n.t("companion.startButton"),
    });
    expect(startBtn).toBeInTheDocument();

    fireEvent.click(startBtn);
    expect(screen.getByText(i18n.t("companion.userAuth.title"))).toBeInTheDocument();
  });

  it("handles test submission and displays result", () => {
    renderCompanionAt("/companion/upload");

    const textarea = screen.getByPlaceholderText(/HIV: Negative/i);
    fireEvent.change(textarea, {
      target: { value: "HIV: Negative\nSyphilis: Negative" },
    });

    const submitBtn = screen.getByRole("button", {
      name: i18n.t("companion.uploadButton"),
    });
    fireEvent.click(submitBtn);

    expect(screen.getByText(i18n.t("companion.result.title"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("companion.result.safe"))).toBeInTheDocument();
  });
});
