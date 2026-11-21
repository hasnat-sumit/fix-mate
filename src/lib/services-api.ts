import { cacheLife, cacheTag } from "next/cache";
import type { ServiceCategoryName, ServiceMode } from "@/data/service-categories";
import { apiOrigin } from "@/lib/api-origin";
import type { ServiceSort } from "@/lib/services-url";

// Server-side reads of the public service catalog. Each function is cached with `use cache`, so pages
// can be prerendered and are refreshed in the background about once a minute. The "services" tag
// lets technician/admin changes refresh them immediately (see app/actions/service-catalog.ts).

/** A service document as the API returns it (the `services` collection). */
export type Service = {
  _id: string;
  title: string;
  category: ServiceCategoryName;
  description: string;
  image: string;
  /** Starting price in USD. */
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServiceDetail = Service & {
  technician: { name: string; image: string | null; area: string | null; bio: string | null };
};

export type ServiceList = {
  items: Service[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

type ServiceListParams = {
  search?: string;
  category?: ServiceCategoryName;
  serviceMode?: ServiceMode;
  sort?: ServiceSort;
  page?: number;
  limit?: number;
};

/** Returns the response's `data`, or null for a 404. Any other failure throws (and is never cached). */
async function apiGet<T>(path: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(`${apiOrigin}${path}`, { headers: { accept: "application/json" } });
  } catch (error) {
    throw new Error(`Could not reach the FixMate API at ${apiOrigin}. Start fixmate-server with "npm run dev", or set API_URL.`, {
      cause: error,
    });
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`FixMate API request ${path} failed with status ${response.status}`);
  return ((await response.json()) as { data: T }).data;
}

/** Approved, available services. Search, filters, sort and pagination all run on the server. */
export async function getServices(params: ServiceListParams = {}): Promise<ServiceList> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }

  const list = await apiGet<ServiceList>(`/api/services?${query.toString()}`);
  if (!list) throw new Error("FixMate API returned 404 for the service list");
  return list;
}

/** The 6 latest approved, available services for the home page. */
export async function getFeaturedServices(): Promise<Service[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");
  return (await apiGet<Service[]>("/api/services/featured")) ?? [];
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
