const BASE_URL = "http://localhost:5128/api";

export interface AuthResponse {
  token: string;
  userId: string;
  userName: string;
  displayName: string;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error[0]?.description || "Login failed");
  }

  return response.json();
}

export async function registerUser(
  userName: string,
  email: string,
  displayName: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, email, displayName, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || error[0]?.description || "Registration failed",
    );
  }

  return response.json();
}
