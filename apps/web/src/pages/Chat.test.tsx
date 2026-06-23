import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Chat from "./Chat";
import { AppStateProvider } from "../store/AppContext";

test("renders Chat component placeholder", () => {
  render(
    <MemoryRouter>
      <AppStateProvider>
        <Chat />
      </AppStateProvider>
    </MemoryRouter>,
  );
  // Component uses i18n key chat.title - look for the tab button
  const chatTab = screen.getByRole("button", { name: /chat\.title/i });
  expect(chatTab).toBeInTheDocument();
});
