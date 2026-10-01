import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Result from "../Result";
import i18n from "i18next";
import "@/i18n/config";

describe("Result component", () => {
  it("renders safe verdict when no positive pathogens found", () => {
    render(
      <MemoryRouter>
        <Result />
      </MemoryRouter>,
    );

    expect(screen.getByText(i18n.t("companion.result.title"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("companion.result.safe"))).toBeInTheDocument();
  });
});
