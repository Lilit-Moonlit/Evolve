import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, expect, test, vi } from "vitest";
import Chat from "./Chat";
import { AppStateProvider } from "../store/AppContext";

beforeAll(() => {
  // jsdom does not implement scrollIntoView (LocalChat auto-scroll effect)
  Element.prototype.scrollIntoView = vi.fn();
});

test("renders the local chat as the messenger landing view", () => {
  render(
    <MemoryRouter>
      <AppStateProvider>
        <Chat />
      </AppStateProvider>
    </MemoryRouter>,
  );
  // The pinned city-chat entry is present in the sidebar (shows the city,
  // or the select-city hint when none is chosen — no redundant "Місцевий чат" label)
  const localChatEntry = screen.getByRole("button", { name: /localChat\.selectCity/i });
  expect(localChatEntry).toBeInTheDocument();
  // The old "Головна" tab was removed from the sidebar
  expect(screen.queryByRole("button", { name: /navigation\.home/i })).not.toBeInTheDocument();
  // Without a selected city the local chat shows the select-city hint
  expect(screen.getAllByText(/localChat\.selectCity/i).length).toBeGreaterThan(0);
});
