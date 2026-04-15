import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookProvider } from "./context/BookContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shelves from "./pages/Shelves";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <BrowserRouter>
      <BookProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/shelves" element={<Shelves />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Route>
        </Routes>
      </BookProvider>
    </BrowserRouter>
  );
}

export default App;
