import { BASE_URL, parseError } from "./client";

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
    throw new Error(await parseError(response, "Login failed"));
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
    throw new Error(await parseError(response, "Registration failed"));
  }

  return response.json();
}
