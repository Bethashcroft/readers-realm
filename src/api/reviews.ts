import { BASE_URL, getHeaders, parseError } from "./client";

export interface ReviewResponse {
  id: number;
  rating: number;
  text: string;
  date: string;
  bookId: number;
  userId: string;
  userName: string;
}

export interface AddReviewRequest {
  rating: number;
  text: string;
  bookId: number;
}

export async function getReviewsForBook(
  bookId: number,
): Promise<ReviewResponse[]> {
  const response = await fetch(`${BASE_URL}/reviews/book/${bookId}`);

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to fetch reviews"));
  }

  return response.json();
}

export async function addReview(
  review: AddReviewRequest,
): Promise<ReviewResponse> {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to add review"));
  }

  return response.json();
}

export async function deleteReview(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to delete review"));
  }
}
