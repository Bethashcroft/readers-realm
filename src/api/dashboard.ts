import { BASE_URL, getHeaders, parseError } from "./client";

export interface DashboardSummary {
  myBooks: number;
  nearby: number;
  pendingRequests: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${BASE_URL}/dashboard/summary`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await parseError(response, "Failed to load dashboard summary"),
    );
  }

  return response.json();
}
