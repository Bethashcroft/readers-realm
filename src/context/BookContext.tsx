import { createContext, useContext, useState } from "react";
import { mockBooks } from "../data/books";
import { mockReviews } from "../data/reviews";
import type { Book } from "../types/book";
import type { Review } from "../types/review";

interface BookContextType {
  books: Book[];
  reviews: Review[];
  addBook: (book: Book) => void;
  addReview: (review: Review) => void;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const addBook = (newBook: Book) => {
    setBooks((prev) => [...prev, newBook]);
  };

  const addReview = (newReview: Review) => {
    setReviews((prev) => [...prev, newReview]);
  };

  return (
    <BookContext.Provider value={{ books, reviews, addBook, addReview }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }

  return context;
}
