import type { Book } from "../types/book";

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780756404741-M.jpg",
    shelf: "currently-reading",
  },
  {
    id: "2",
    title: "Mistborn: The Final Empire",
    author: "Brandon Sanderson",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780765311788-M.jpg",
    shelf: "read",
    rating: 5,
    review: "Incredible magic system and world building.",
  },
  {
    id: "3",
    title: "The Priory of the Orange Tree",
    author: "Samantha Shannon",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781635570298-M.jpg",
    shelf: "tbr",
  },
  {
    id: "4",
    title: "Circe",
    author: "Madeline Miller",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316556347-M.jpg",
    shelf: "read",
    rating: 4,
  },
  {
    id: "5",
    title: "The Poppy War",
    author: "R.F. Kuang",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062662569-M.jpg",
    shelf: "dnf",
  },
  {
    id: "6",
    title: "House of Leaves",
    author: "Mark Z. Danielewski",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780375703768-M.jpg",
    shelf: "available-to-borrow",
  },
  {
    id: "7",
    title: "Piranesi",
    author: "Susanna Clarke",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781635575996-M.jpg",
    shelf: "tbr",
  },
];
