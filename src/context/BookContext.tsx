import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { mockReviews } from "../data/reviews";
import type { BookResponse, AddBookRequest } from "../api/books";
import { getMyBooks, addBook as addBookApi } from "../api/books";
import type { Review } from "../types/review";
import type { BorrowRequest } from "../types/borrow";
import { useAuth } from "./AuthContext";

interface BookContextType {
  books: BookResponse[];
  reviews: Review[];
  borrowRequests: BorrowRequest[];
  loading: boolean;
  addBook: (book: AddBookRequest) => Promise<void>;
  addReview: (review: Review) => void;
  addBorrowRequest: (request: BorrowRequest) => void;
  updateBorrowRequest: (id: string, status: BorrowRequest["status"]) => void;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBooks = useCallback(async () => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMyBooks();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (book: AddBookRequest) => {
    const newBook = await addBookApi(book);
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
        loading,
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
