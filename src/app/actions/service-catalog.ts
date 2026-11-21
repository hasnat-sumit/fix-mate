"use server";

import { updateTag } from "next/cache";
import { apiOrigin } from "@/lib/api-origin";

/**
 * Expires the cached public service pages after a technician or admin changes a service, so the change
 * shows on the next visit instead of after the one-minute background refresh.
 *
 * Server Actions are public endpoints, so the caller's API token is verified with the API first;
 * only technicians and admins can trigger a refresh.
 */
export async function refreshServiceCatalog(token: string) {
  const response = await fetch(`${apiOrigin}/api/users/me`, { headers: { authorization: `Bearer ${token}` } }).catch(() => null);
  if (!response?.ok) return { refreshed: false };

  const { data } = (await response.json()) as { data: { role: string } };
  if (data.role !== "technician" && data.role !== "admin") return { refreshed: false };

  updateTag("services");
  return { refreshed: true };
}
