import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import type { Book, ShelfType } from "../types/book";
import "../styles/forms.css";
import "./AddBook.css";

function AddBook() {
  const { addBook } = useBooks();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [shelf, setShelf] = useState<ShelfType>("tbr");
  const [rating, setRating] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      coverUrl: `https://placehold.co/200x300/e2e8f0/64748b?text=${encodeURIComponent(title)}`,
      shelf,
      rating: rating ? Number(rating) : undefined,
      owner: "bethashcroft",
    };

    addBook(newBook);
    navigate("/shelves");
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Add a Book</h1>

        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <label htmlFor="shelf">Shelf</label>
        <select
          id="shelf"
          value={shelf}
          onChange={(e) => setShelf(e.target.value as ShelfType)}
        >
          <option value="currently-reading">Currently Reading</option>
          <option value="read">Read</option>
          <option value="tbr">To Be Read</option>
          <option value="dnf">Did Not Finish</option>
          <option value="available-to-borrow">Available to Borrow</option>
          <option value="lent-out">Lent Out</option>
          <option value="for-sale">For Sale</option>
        </select>

        <label htmlFor="rating">Optional Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">No rating</option>
          <option value="1">★☆☆☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="3">★★★☆☆</option>
          <option value="4">★★★★☆</option>
          <option value="5">★★★★★</option>
        </select>

        <button type="submit">Add book</button>
      </form>
    </div>
  );
}

export default AddBook;
