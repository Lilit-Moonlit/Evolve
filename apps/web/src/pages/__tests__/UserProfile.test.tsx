import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserProfile from "../UserProfile";
import { useAppState } from "../../store/AppContext";
import type { ProfileData } from "../../store/AppContext";

const mockProfile: ProfileData = {
  id: "p1",
  name: "Alice",
  age: 28,
  bio: "Love hiking",
  interests: ["hiking", "music"],
  verifiedStd: true,
  verifiedDna: false,
  reputationScore: 7,
  voters: [],
  chatHistory: [],
  accessPermissions: {
    stdRequested: false,
    stdApproved: false,
    dnaRequested: false,
    dnaApproved: false,
    myStdApprovedToThem: false,
    myDnaApprovedToThem: false,
  },
};

const mockAppState = {
  profiles: [mockProfile],
  myProfile: { id: "me" },
  requestAccess: vi.fn().mockResolvedValue(undefined),
  requestPhotoAccess: vi.fn().mockResolvedValue(undefined),
  canViewTheirPhoto: vi.fn(() => false),
  checkCompatibility: vi.fn(() => ({
    safe: true,
    riskLevel: "none" as const,
    reason: "",
    sharedPathogens: [],
    riskyPathogens: [],
  })),
};

vi.mock("../../store/AppContext", async () => {
  const actual =
    await vi.importActual<typeof import("../../store/AppContext")>("../../store/AppContext");
  return {
    ...actual,
    useAppState: () => mockAppState,
  };
});

const renderProfile = (initialPath = "/profile/p1") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/profile/:id" element={<UserProfile />} />
      </Routes>
    </MemoryRouter>,
  );

test("renders other user profile details", () => {
  renderProfile();
  expect(screen.getByRole("heading", { name: /Alice/ })).toBeInTheDocument();
  expect(screen.getByText(/28/)).toBeInTheDocument();
  expect(screen.getByText(/Love hiking/)).toBeInTheDocument();
  expect(screen.getAllByText(/hiking/).length).toBeGreaterThan(0);
});

test("shows not-found state for unknown profile id", () => {
  renderProfile("/profile/unknown-id");
  expect(screen.getByText(/userProfile\.notFound/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /userProfile\.backToHome/i })).toBeInTheDocument();
});

test("requests STD access when button clicked", () => {
  renderProfile();
  const stdButton = screen.getByRole("button", {
    name: /userProfile\.requestStd/i,
  });
  fireEvent.click(stdButton);
  expect(mockAppState.requestAccess).toHaveBeenCalledWith("p1", "STD", expect.anything());
});
