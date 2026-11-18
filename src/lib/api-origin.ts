/**
 * The Express API's origin, used by the /api rewrite (next.config.ts) and by server-side data fetching.
 * Server-only: API_URL is not exposed to the browser, which always calls /api on this site instead.
 */
export const apiOrigin = (process.env.API_URL ?? "http://localhost:5000").replace(/\/+$/, "");
