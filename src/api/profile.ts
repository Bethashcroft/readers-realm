import { BASE_URL, getHeaders, parseError } from "./client";

export interface ProfileResponse {
  userName: string;
  displayName: string;
  bio: string;
  joinedDate: string;
}

export interface UpdateProfileRequest {
  displayName: string;
  bio: string;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await fetch(`${BASE_URL}/auth/profile`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to fetch profile"));
  }

  return response.json();
}

export async function getUserProfile(
  username: string,
): Promise<ProfileResponse> {
  const response = await fetch(`${BASE_URL}/users/${username}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to fetch profile"));
  }

  return response.json();
}

export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<ProfileResponse> {
  const response = await fetch(`${BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update profile"));
  }

  return response.json();
}
