import { useState } from "react";
import BookCard from "../components/BookCard";
import type { Book, ShelfType } from "../types/book";
import "./Shelves.css";

const shelfLabels: Record<ShelfType, string> = {
  "currently-reading": "Currently Reading",
  read: "Read",
  tbr: "To Be Read",
  dnf: "Did Not Finish",
  "available-to-borrow": "Available to Borrow",
  "lent-out": "Lent Out",
  "for-sale": "For Sale",
};

interface ShelvesProps {
  books: Book[];
}

function Shelves({ books }: ShelvesProps) {
  const [activeShelf, setActiveShelf] = useState<ShelfType | "all">("all");

  const filteredBooks =
    activeShelf === "all"
      ? books
      : books.filter((book) => book.shelf === activeShelf);

  return (
    <div className="shelves">
      <h1>My Shelves</h1>

      <div className="shelf-tabs">
        <button
          className={`shelf-tab ${activeShelf === "all" ? "active" : ""}`}
          onClick={() => setActiveShelf("all")}
        >
          All
        </button>
        {Object.entries(shelfLabels).map(([value, label]) => (
          <button
            key={value}
            className={`shelf-tab ${activeShelf === value ? "active" : ""}`}
            onClick={() => setActiveShelf(value as ShelfType)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="empty-shelf">No books on this shelf yet.</p>
      )}
    </div>
  );
}

export default Shelves;
