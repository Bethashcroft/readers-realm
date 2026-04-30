import { useState } from "react";
import { useBooks } from "../context/BookContext";
import type { BorrowRequest } from "../types/borrow";
import "./Browse.css";

function Browse() {
  const { books, addBorrowRequest } = useBooks();
  const [message, setMessage] = useState("");
  const [requestingBookId, setRequestingBookId] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const currentUser = "bethashcroft";

  const availableBooks = books.filter(
    (book) =>
      (book.shelf === "available-to-borrow" || book.shelf === "for-sale") &&
      book.owner !== currentUser,
  );

  const handleRequest = (bookId: string, bookTitle: string, toUser: string) => {
    const newRequest: BorrowRequest = {
      id: Date.now().toString(),
      bookId,
      bookTitle,
      fromUser: currentUser,
      toUser,
      status: "pending",
      message,
      date: new Date().toISOString().split("T")[0],
    };

    addBorrowRequest(newRequest);
    setSentRequests((prev) => new Set(prev).add(bookId));
    setRequestingBookId(null);
    setMessage("");
  };
  return (
    <div className="browse">
      <h1>Browse Nearby Books</h1>
      <p className="browse-subtitle">
        Books available to borrow or buy from readers near you
      </p>
      <div className="browse-banner">
        For your safety, always arrange exchanges through in-app messaging.
        Never share personal contact details.
      </div>
      {availableBooks.length === 0 && (
        <p className="empty-browse">No books available nearby right now.</p>
      )}
      <div className="browse-list">
        {availableBooks.map((book) => (
          <div key={book.id} className="browse-card">
            <img
              className="browse-cover"
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
            />
            <div className="browse-info">
              <h2>{book.title}</h2>
              <p className="browse-author">{book.author}</p>
              <p className="browse-owner">Owned by @{book.owner}</p>
              <span className={`browse-badge ${book.shelf}`}>
                {book.shelf === "for-sale" ? "For Sale" : "Available to Borrow"}
              </span>
              {sentRequests.has(book.id) ? (
                <p className="request-sent">Request sent!</p>
              ) : requestingBookId === book.id ? (
                <div className="request-form">
                  <textarea
                    placeholder="Add a message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="request-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleRequest(book.id, book.title, book.owner)
                      }
                    >
                      Send Request
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setRequestingBookId(null);
                        setMessage("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setRequestingBookId(book.id)}
                >
                  {book.shelf === "for-sale"
                    ? "Request to Buy"
                    : "Request to Borrow"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Browse;
