import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "./Layout";

const { mockUseAuth, mockGetMyRequests } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockGetMyRequests: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("../api/borrow", () => ({
  getMyRequests: mockGetMyRequests,
}));

function renderLayout() {
  return render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  );
}

const loggedInUser = {
  token: "t",
  userId: "me",
  userName: "me",
  displayName: "Me",
};

describe("Layout", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
    mockGetMyRequests.mockReset();
    mockGetMyRequests.mockResolvedValue([]);
  });

  it("shows only Login and Register when logged out", () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    renderLayout();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.queryByText("My Shelves")).not.toBeInTheDocument();
    expect(screen.queryByText("Add Book")).not.toBeInTheDocument();
    expect(screen.queryByText("Browse")).not.toBeInTheDocument();
  });

  it("shows the app links when logged in", () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser, logout: vi.fn() });
    renderLayout();

    expect(screen.getByText("My Shelves")).toBeInTheDocument();
    expect(screen.getByText("Add Book")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("shows a badge with the count of incoming pending requests", async () => {
    mockUseAuth.mockReturnValue({ user: loggedInUser, logout: vi.fn() });
    mockGetMyRequests.mockResolvedValue([
      { id: 1, toUserId: "me", status: "pending" },
      { id: 2, toUserId: "me", status: "pending" },
      { id: 3, toUserId: "me", status: "accepted" },
      { id: 4, fromUserId: "me", toUserId: "other", status: "pending" },
    ]);
    renderLayout();

    expect(await screen.findByText("2")).toBeInTheDocument();
  });
});
