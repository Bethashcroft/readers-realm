import { render, screen } from "@testing-library/react";
import Browse from "./Browse";
import type { BookResponse } from "../api/books";

const { mockBrowseBooks } = vi.hoisted(() => ({ mockBrowseBooks: vi.fn() }));

vi.mock("../api/books", () => ({
  browseBooks: mockBrowseBooks,
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

const books: BookResponse[] = [
  {
    id: 1,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverUrl: "x",
    shelf: "available-to-borrow",
    rating: null,
    userId: "u1",
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "x",
    shelf: "for-sale",
    rating: null,
    userId: "u2",
  },
];

describe("Browse", () => {
  beforeEach(() => {
    mockBrowseBooks.mockReset();
  });

  it("shows a loading message, then the fetched books", async () => {
    mockBrowseBooks.mockResolvedValue(books);
    render(<Browse />);

    expect(screen.getByText("Loading books...")).toBeInTheDocument();

    expect(await screen.findByText("The Hobbit")).toBeInTheDocument();
    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(screen.queryByText("Loading books...")).not.toBeInTheDocument();
  });

  it("shows an empty-state message when no books are available", async () => {
    mockBrowseBooks.mockResolvedValue([]);
    render(<Browse />);

    expect(
      await screen.findByText("No books available nearby right now."),
    ).toBeInTheDocument();
  });
});
