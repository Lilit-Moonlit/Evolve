import { render, screen } from "@testing-library/react";
import Chat from "./Chat";
import { AppStateProvider } from "../store/AppContext";

test("renders Chat component placeholder", () => {
  render(
    <AppStateProvider>
      <Chat />
    </AppStateProvider>,
  );
  const heading = screen.getByRole("heading", { name: /Chat/i });
  expect(heading).toBeInTheDocument();
});
