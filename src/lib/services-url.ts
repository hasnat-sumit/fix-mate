/** Sort options offered on the /services page (the API also supports "newest"). */
export type ServiceSort = "featured" | "price-asc" | "price-desc";

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
