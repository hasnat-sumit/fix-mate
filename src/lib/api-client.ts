import { refreshServiceCatalog } from "@/app/actions/service-catalog";
import { getApiToken } from "@/lib/auth-client";

/** An error response from the FixMate API, or `status: 0` when the request didn't reach it. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiErrorBody = { code?: string; message?: string; details?: unknown };

/**
 * Browser-side call to the Express API (same origin, proxied by the /api rewrite) with the signed-in
 * user's short-lived JWT. Resolves to the response's `data`; throws ApiError otherwise.
 */
export async function apiRequest<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = await getApiToken();
  if (!token) throw new ApiError(401, "UNAUTHORIZED", "Please sign in to continue.");

  let response: Response;
  try {
    response = await fetch(path, {
      method: options.method ?? "GET",
      headers: {
        authorization: `Bearer ${token}`,
        ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "We couldn’t reach FixMate. Check your connection and try again.");
  }

  const json = (await response.json().catch(() => null)) as ({ data: T } & ApiErrorBody) | null;
  if (!response.ok) {
    throw new ApiError(response.status, json?.code ?? "UNKNOWN", json?.message ?? "Something went wrong. Please try again.", json?.details);
  }
  return (json as { data: T }).data;
}

/** After a service change: expire the cached public service pages (verified server-side). Best effort. */
export async function refreshServiceCatalogCache() {
  const token = await getApiToken();
  if (token) await refreshServiceCatalog(token).catch(() => undefined);
}
