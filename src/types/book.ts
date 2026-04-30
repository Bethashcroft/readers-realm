export type ShelfType =
  | "currently-reading"
  | "read"
  | "tbr"
  | "dnf"
  | "available-to-borrow"
  | "lent-out"
  | "for-sale";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  shelf: ShelfType;
  rating?: number;
  owner: string;
}
