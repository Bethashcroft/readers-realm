import { BASE_URL, getHeaders, parseError } from "./client";

export type BorrowStatus = "pending" | "accepted" | "declined";

export interface BorrowRequestResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: BorrowStatus;
  message: string;
  date: string;
}

export interface CreateBorrowRequest {
  bookId: number;
  message: string;
}

export async function createBorrowRequest(
  request: CreateBorrowRequest,
): Promise<BorrowRequestResponse> {
  const response = await fetch(`${BASE_URL}/borrowrequests`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to send borrow request"));
  }

  return response.json();
}

export async function getMyRequests(): Promise<BorrowRequestResponse[]> {
  const response = await fetch(`${BASE_URL}/borrowrequests`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to fetch borrow requests"));
  }

  return response.json();
}

export async function updateBorrowStatus(
  id: number,
  status: BorrowStatus,
): Promise<BorrowRequestResponse> {
  const response = await fetch(`${BASE_URL}/borrowrequests/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update borrow request"));
  }

  return response.json();
}

export async function withdrawBorrowRequest(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/borrowrequests/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to withdraw request"));
  }
}
