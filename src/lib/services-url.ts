import type { ServiceSort } from "@/data/services";

export const defaultServiceSort: ServiceSort = "featured";

type ServicesQuery = {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
};

/** Builds a canonical /services URL, omitting empty values, the default sort and page 1. */
export function buildServicesHref({ q, category, sort, page }: ServicesQuery) {
  const params = new URLSearchParams();
  const query = q?.trim();

  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (sort && sort !== defaultServiceSort) params.set("sort", sort);
  if (page && page > 1) params.set("page", String(page));

  const search = params.toString();
  return search ? `/services?${search}` : "/services";
}
