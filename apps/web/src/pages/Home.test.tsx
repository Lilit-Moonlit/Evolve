import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { AppStateProvider } from "../store/AppContext";

test("renders Home component with filters", () => {
  render(
    <MemoryRouter>
      <AppStateProvider>
        <Home />
      </AppStateProvider>
    </MemoryRouter>,
  );
  const filterLabel = screen.getByText(/home\.filters\.verifiedStd/i);
  expect(filterLabel).toBeInTheDocument();
});
