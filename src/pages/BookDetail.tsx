import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import { getReviewsForBook, addReview as addReviewApi } from "../api/reviews";
import type { ReviewResponse } from "../api/reviews";
import type { ShelfType } from "../types/book";
import "./BookDetail.css";

const shelfLabels: Record<ShelfType, string> = {
  "currently-reading": "Currently Reading",
  read: "Read",
  tbr: "To Be Read",
  dnf: "Did Not Finish",
  "available-to-borrow": "Available to Borrow",
  "lent-out": "Lent Out",
  "for-sale": "For Sale",
};

function BookDetail() {
  const { books, updateBook, removeBook } = useBooks();
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === Number(id));

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [rating, setRating] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [shelf, setShelf] = useState("");
  const [bookRating, setBookRating] = useState("");

  useEffect(() => {
    if (!book) return;
    setShelf(book.shelf);
    setBookRating(book.rating ? String(book.rating) : "");

    const fetchReviews = async () => {
      try {
        const data = await getReviewsForBook(book.id);
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [book]);

  if (!book) {
    return <p>Book not found</p>;
  }

  const handleShelfChange = async (newShelf: string) => {
    setShelf(newShelf);
    try {
      await updateBook(book.id, {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        shelf: newShelf,
        rating: bookRating ? Number(bookRating) : null,
      });
    } catch (err) {
      console.error("Failed to update shelf:", err);
      setShelf(book.shelf);
    }
  };

  const handleRatingChange = async (newRating: string) => {
    setBookRating(newRating);
    try {
      await updateBook(book.id, {
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        shelf,
        rating: newRating ? Number(newRating) : null,
      });
    } catch (err) {
      console.error("Failed to update rating:", err);
      setBookRating(book.rating ? String(book.rating) : "");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return;
    }

    try {
      await removeBook(book.id);
      navigate("/shelves");
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  const handleReviewSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const newReview = await addReviewApi({
        rating: Number(rating),
        text,
        bookId: book.id,
      });
      setReviews((prev) => [...prev, newReview]);
      setRating("");
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add review");
    }
  };

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <img
          className="book-detail-cover"
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
        />
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>

          <div className="book-detail-controls">
            <label htmlFor="book-shelf">Shelf</label>
            <select
              id="book-shelf"
              value={shelf}
              onChange={(e) => handleShelfChange(e.target.value)}
            >
              {Object.entries(shelfLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <label htmlFor="book-rating">Rating</label>
            <select
              id="book-rating"
              value={bookRating}
              onChange={(e) => handleRatingChange(e.target.value)}
            >
              <option value="">No rating</option>
              <option value="1">★☆☆☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="3">★★★☆☆</option>
              <option value="4">★★★★☆</option>
              <option value="5">★★★★★</option>
            </select>
          </div>

          <button className="btn-delete" onClick={handleDelete}>
            Delete Book
          </button>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>

        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <span className="review-author">{review.userName}</span>
              <span className="review-rating">
                {" "}
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
              <span className="review-date">
                {new Date(review.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="no-reviews">No reviews yet. Be the first!</p>
        )}
      </section>

      <section className="add-review-section">
        <h2>Write a Review</h2>
        {error && <p className="form-error">{error}</p>}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <label htmlFor="review-rating">Rating</label>
          <select
            id="review-rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select a rating</option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>

          <label htmlFor="review-text">Review</label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          <button type="submit">Submit Review</button>
        </form>
      </section>
    </div>
  );
}

export default BookDetail;
