const BASE_URL = "http://localhost:5128/api";
export interface BookResponse {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  shelf: string;
  rating: number | null;
  userId: string;
}
export interface AddBookRequest {
  title: string;
  author: string;
  coverUrl: string;
  shelf: string;
  rating: number | null;
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

export async function getMyBooks(): Promise<BookResponse[]> {
  const response = await fetch(`${BASE_URL}/books`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return response.json();
}

export async function browseBooks(): Promise<BookResponse[]> {
  const response = await fetch(`${BASE_URL}/books/browse`);
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
}
export async function addBook(book: AddBookRequest): Promise<BookResponse> {
  const response = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error("Failed to add book");
  }
  return response.json();
}
export async function updateBook(
  id: number,
  book: AddBookRequest,
): Promise<BookResponse> {
  const response = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error("Failed to update book");
  }
  return response.json();
}
export async function deleteBook(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
}
