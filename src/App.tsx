import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shelves from "./pages/Shelves";
import AddBook from "./pages/AddBook";
import { mockBooks } from "./data/books";
import type { Book } from "./types/book";

function App() {
  const [books, setBooks] = useState<Book[]>(mockBooks);

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [...prev, newBook]);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/shelves" element={<Shelves books={books} />} />
          <Route
            path="/add-book"
            element={<AddBook onAddBook={handleAddBook} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
