const BASE_URL = "http://localhost:5128/api";

export interface ProfileResponse {
  userName: string;
  displayName: string;
  bio: string;
  joinedDate: string;
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

export async function getProfile(): Promise<ProfileResponse> {
  const response = await fetch(`${BASE_URL}/auth/profile`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
}

export interface UpdateProfileRequest {
  displayName: string;
  bio: string;
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
    throw new Error("Failed to update profile");
  }

  return response.json();
}
