import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { AppStateProvider } from "../store/AppContext";

test("renders Profile page with profile info", () => {
  render(
    <AppStateProvider>
      <Profile />
    </AppStateProvider>,
  );
  const heading = screen.getByRole("heading", {
    name: /profile\.myProfile\.title/i,
  });
  expect(heading).toBeInTheDocument();
});
