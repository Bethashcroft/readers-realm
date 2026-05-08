import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import { getReviewsForBook, addReview as addReviewApi } from "../api/reviews";
import type { ReviewResponse } from "../api/reviews";
import "./BookDetail.css";

function BookDetail() {
  const { books } = useBooks();
  const { id } = useParams();
  const book = books.find((b) => b.id === Number(id));

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [rating, setRating] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!book) return;

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
          {book.rating && (
            <p className="book-detail-rating">
              {"★".repeat(book.rating)}
              {"☆".repeat(5 - book.rating)}
            </p>
          )}
          <p className="book-detail-shelf">
            Shelf: {book.shelf.replace(/-/g, " ")}
          </p>
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
        <form className="review-form" onSubmit={handleSubmit}>
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
