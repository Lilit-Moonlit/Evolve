import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { AppStateProvider } from "../store/AppContext";

test("renders Home component with filters", () => {
  render(
    <AppStateProvider>
      <Home />
    </AppStateProvider>,
  );
  const filterLabel = screen.getByText(/home\.filters\.verifiedStd/i);
  expect(filterLabel).toBeInTheDocument();
});
