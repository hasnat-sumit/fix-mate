import { cacheLife, cacheTag } from "next/cache";
import { apiOrigin } from "@/lib/api-origin";
import type { ServiceSort } from "@/lib/services-url";

// Server-side reads of the public service catalog. Each function is cached with `use cache`, so pages
// can be prerendered and are refreshed in the background about once a minute. The "services" tag
// lets later phases refresh them immediately with revalidateTag.

export type ServiceSummary = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Starting price in cents (USD). */
  price: number;
  image: string;
  availability: string;
  isFeatured: boolean;
  ratingAverage: number;
  reviewCount: number;
  technician: { id: string; name: string };
};

export type ServiceDetail = Omit<ServiceSummary, "technician"> & {
  details: string;
  includes: string[];
  technician: { id: string; name: string; area: string | null; bio: string | null };
  updatedAt: string;
};

export type ServiceList = {
  items: ServiceSummary[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

type ServiceListParams = {
  q?: string;
  /** The category name, e.g. "Laptop & PC". */
  category?: string;
  sort?: ServiceSort;
  featured?: boolean;
  page?: number;
  limit?: number;
};

/** Returns the response's `data`, or null for a 404. Any other failure throws (and is never cached). */
async function apiGet<T>(path: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${apiOrigin}${path}`, { headers: { accept: "application/json" } });
  } catch (error) {
    throw new Error(
      `Could not reach the FixMate API at ${apiOrigin}. Start it with "cd server && npm run dev", or set API_URL.`,
      { cause: error },
    );
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`FixMate API request ${path} failed with status ${response.status}`);
  return ((await response.json()) as { data: T }).data;
}

export async function getServices(params: ServiceListParams = {}): Promise<ServiceList> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");

  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.sort) search.set("sort", params.sort);
  if (params.featured !== undefined) search.set("featured", String(params.featured));
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const list = await apiGet<ServiceList>(`/api/services?${search.toString()}`);
  if (!list) throw new Error("FixMate API returned 404 for the service list");
  return list;
}

/** Public details of an approved service, or null if it doesn't exist or isn't public. */
export async function getService(id: string): Promise<ServiceDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services", `service-${id}`);

  // Anything that isn't an ObjectId can't be a service, so skip the request.
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return apiGet<ServiceDetail>(`/api/services/${id}`);
}
