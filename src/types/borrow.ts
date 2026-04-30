export type BorrowStatus = "pending" | "accepted" | "declined";

export interface BorrowRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  fromUser: string;
  toUser: string;
  status: BorrowStatus;
  message: string;
  date: string;
}
