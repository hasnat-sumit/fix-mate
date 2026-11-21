/** Sort options on the /services page, applied by the API (MongoDB). */
export const serviceSorts = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type ServiceSort = (typeof serviceSorts)[number]["value"];

export const defaultServiceSort: ServiceSort = "newest";

export function isServiceSort(value: string | undefined): value is ServiceSort {
  return serviceSorts.some((option) => option.value === value);
}

type ServicesQuery = {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  page?: number;
};

/**
 * Builds a canonical /services URL, omitting empty values, the default sort and page 1.
 * Every filter lives in the URL, so it survives a reload and can be shared (e.g. /services?category=AC).
 */
export function buildServicesHref({ search, category, serviceMode, sort, page }: ServicesQuery) {
  const params = new URLSearchParams();
  const query = search?.trim();

  if (query) params.set("search", query);
  if (category) params.set("category", category);
  if (serviceMode) params.set("serviceMode", serviceMode);
  if (sort && sort !== defaultServiceSort) params.set("sort", sort);
  if (page && page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString ? `/services?${queryString}` : "/services";
}
