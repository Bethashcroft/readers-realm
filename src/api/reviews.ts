const BASE_URL = "http://localhost:5128/api";

export interface ReviewResponse {
  id: number;
  rating: number;
  text: string;
  date: string;
  bookId: number;
  userName: string;
}

export interface AddReviewRequest {
  rating: number;
  text: string;
  bookId: number;
}

function getHeaders(): Record<string, string> {
  const stored = localStorage.getItem("user");
  const token = stored ? JSON.parse(stored).token : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function getReviewsForBook(
  bookId: number,
): Promise<ReviewResponse[]> {
  const response = await fetch(`${BASE_URL}/reviews/book/${bookId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
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
    throw new Error("Failed to fetch review");
  }

  return response.json();
}

export async function deleteReview(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }
}
