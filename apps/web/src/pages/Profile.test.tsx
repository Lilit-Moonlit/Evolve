import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";
import { AppStateProvider } from "../store/AppContext";

test("renders Profile page with profile info", () => {
  render(
    <MemoryRouter>
      <AppStateProvider>
        <Profile />
      </AppStateProvider>
    </MemoryRouter>,
  );
  const heading = screen.getByRole("heading", {
    name: /profile\.myProfile\.title/i,
  });
  expect(heading).toBeInTheDocument();
});
