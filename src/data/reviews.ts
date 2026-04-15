import type { Review } from "../types/review";

export const mockReviews: Review[] = [
  {
    id: "1",
    bookId: "2",
    userName: "Beth Ashcroft",
    rating: 5,
    text: "Incredible magic system and world building. Kelsier is one of the best characters in fantasy.",
    date: "2026-03-15",
  },
  {
    id: "2",
    bookId: "2",
    userName: "Jane Reader",
    rating: 4,
    text: "Loved the heist elements. The ending completely blindsided me.",
    date: "2026-03-20",
  },
  {
    id: "3",
    bookId: "4",
    userName: "Beth Ashcroft",
    rating: 4,
    text: "Beautiful retelling. Miller makes you feel every moment of Circe's isolation and growth.",
    date: "2026-02-10",
  },
];
