import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UploadTest from "../UploadTest";
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

describe("UploadTest component", () => {
  it("renders upload form and navigates to result on submit", () => {
    render(
      <MemoryRouter>
        <UploadTest />
      </MemoryRouter>,
    );

    expect(screen.getByText(i18n.t("companion.uploadPrompt"))).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/HIV: Negative/i);
    expect(textarea).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", {
      name: i18n.t("companion.uploadButton"),
    });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(textarea, {
      target: { value: "HIV: Negative\nSyphilis: Negative" },
    });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/companion/result", expect.anything());
  });
});
