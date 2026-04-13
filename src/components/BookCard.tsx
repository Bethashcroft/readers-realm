import type { Book } from "../types/book";
import "./BookCard.css";

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  return (
    <div className="book-card">
      <img
        className="book-cover"
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
      />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        {book.rating && (
          <p className="book-rating">
            {"★".repeat(book.rating)}
            {"☆".repeat(5 - book.rating)}
          </p>
        )}
      </div>
    </div>
  );
}

export default BookCard;
