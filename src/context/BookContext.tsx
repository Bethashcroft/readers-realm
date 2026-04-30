import { createContext, useContext, useState } from "react";
import { mockBooks } from "../data/books";
import { mockReviews } from "../data/reviews";
import type { Book } from "../types/book";
import type { Review } from "../types/review";
import type { BorrowRequest } from "../types/borrow";

interface BookContextType {
  books: Book[];
  reviews: Review[];
  borrowRequests: BorrowRequest[];
  addBook: (book: Book) => void;
  addReview: (review: Review) => void;
  addBorrowRequest: (request: BorrowRequest) => void;
  updateBorrowRequest: (id: string, status: BorrowRequest["status"]) => void;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);

  const addBook = (newBook: Book) => {
    setBooks((prev) => [...prev, newBook]);
  };

  const addReview = (newReview: Review) => {
    setReviews((prev) => [...prev, newReview]);
  };

  const addBorrowRequest = (request: BorrowRequest) => {
    setBorrowRequests((prev) => [...prev, request]);
  };

  const updateBorrowRequest = (id: string, status: BorrowRequest["status"]) => {
    setBorrowRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req)),
    );
  };

  return (
    <BookContext.Provider
      value={{
        books,
        reviews,
        borrowRequests,
        addBook,
        addReview,
        addBorrowRequest,
        updateBorrowRequest,
      }}
    >
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
