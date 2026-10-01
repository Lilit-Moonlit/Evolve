import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Entry from "../Entry";
import i18n from "i18next";
import "@/i18n/config";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  };
});

describe("Entry component", () => {
  it("renders title, description and navigates on start click", () => {
    render(
      <MemoryRouter>
        <Entry />
      </MemoryRouter>,
    );

    expect(screen.getByText(i18n.t("companion.title"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("companion.intro"))).toBeInTheDocument();

    const startBtn = screen.getByRole("button", {
      name: i18n.t("companion.startButton"),
    });
    fireEvent.click(startBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/companion/upload");
  });
});
