import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Browser auth client. Requests go to /api/auth on this origin, and the Next.js rewrite forwards them
 * to the Express server, so the session cookie is first-party and httpOnly.
 */
export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    // Mirrors the server's user fields (server/src/lib/auth.ts). Neither can be set by the client.
    inferAdditionalFields({
      user: {
        role: { type: ["customer", "technician", "admin"], required: true, input: false },
        status: { type: ["active", "suspended"], required: true, input: false },
      },
    }),
  ],
});

export type AuthSession = typeof authClient.$Infer.Session;
export type UserRole = AuthSession["user"]["role"];

/** Refresh this long before expiry so a token never expires mid-request. */
const REFRESH_MARGIN_MS = 60_000;

let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<string | null> | null = null;

function readExpiry(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return 0;
  try {
    const { exp } = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: unknown };
    return typeof exp === "number" ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function fetchToken() {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    cachedToken = null;
    return null;
  }
  cachedToken = { value: data.token, expiresAt: readExpiry(data.token) };
  return data.token;
}

/**
 * Returns a short-lived API JWT for the signed-in user, or null when signed out.
 * The token is kept in memory only (never localStorage) and concurrent callers share one request.
 */
export async function getApiToken() {
  if (typeof window === "undefined") {
    // A module-level cache on the server would be shared between users.
    throw new Error("getApiToken() is browser-only");
  }
  if (cachedToken && cachedToken.expiresAt - REFRESH_MARGIN_MS > Date.now()) return cachedToken.value;

  pendingToken ??= fetchToken().finally(() => {
    pendingToken = null;
  });
  return pendingToken;
}

/** Call on sign-out so the next user never receives the previous user's token. */
export function clearApiToken() {
  cachedToken = null;
}
