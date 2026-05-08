import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { BookResponse, AddBookRequest } from "../api/books";
import {
  getMyBooks,
  addBook as addBookApi,
  updateBook as updateBookApi,
  deleteBook as deleteBookApi,
} from "../api/books";
import type { BorrowRequest } from "../types/borrow";
import { useAuth } from "./AuthContext";

interface BookContextType {
  books: BookResponse[];
  borrowRequests: BorrowRequest[];
  loading: boolean;
  addBook: (book: AddBookRequest) => Promise<void>;
  updateBook: (id: number, book: AddBookRequest) => Promise<void>;
  removeBook: (id: number) => Promise<void>;
  addBorrowRequest: (request: BorrowRequest) => void;
  updateBorrowRequest: (id: string, status: BorrowRequest["status"]) => void;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<BookResponse[]>([]);
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

  const updateBook = async (id: number, bookData: AddBookRequest) => {
    const updated = await updateBookApi(id, bookData);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
  };

  const removeBook = async (id: number) => {
    await deleteBookApi(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
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
        borrowRequests,
        loading,
        addBook,
        updateBook,
        removeBook,
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
