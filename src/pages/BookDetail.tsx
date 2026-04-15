import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import type { Review } from "../types/review";
import "./BookDetail.css";

function BookDetail() {
  const { books, reviews, addReview } = useBooks();
  const { id } = useParams();
  const book = books.find((b) => b.id === id);

  const [rating, setRating] = useState("");
  const [text, setText] = useState("");

  if (!book) {
    return <p>Book not found</p>;
  }

  const bookReviews = reviews.filter((r) => r.bookId === book.id);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newReview: Review = {
      id: Date.now().toString(),
      bookId: book.id,
      userName: "Beth Ashcroft",
      rating: Number(rating),
      text,
      date: new Date().toISOString().split("T")[0],
    };

    addReview(newReview);
    setRating("");
    setText("");
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
        <h2>Reviews ({bookReviews.length})</h2>

        {bookReviews.map((review) => (
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

        {bookReviews.length === 0 && (
          <p className="no-reviews">No reviews yet. Be the first!</p>
        )}
      </section>

      <section className="add-review-section">
        <h2>Write a Review</h2>
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
            required
          />

          <button type="submit">Submit Review</button>
        </form>
      </section>
    </div>
  );
}

export default BookDetail;
