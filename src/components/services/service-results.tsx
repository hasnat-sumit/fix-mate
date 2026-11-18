import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { ServicesSearchForm } from "@/components/services/services-search-form";
import { Button } from "@/components/ui/button";
import { serviceCategories, serviceCategorySlug, services, type ServiceSort } from "@/data/services";
import { buildServicesHref, defaultServiceSort } from "@/lib/services-url";
import { cn } from "@/lib/utils";

export type ServicesSearchParams = Record<string, string | string[] | undefined>;

type ServiceResultsProps = {
  searchParams: Promise<ServicesSearchParams>;
};

const pageSize = 8;

const sortOptions: { value: ServiceSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const fieldClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isServiceSort(value: string | undefined): value is ServiceSort {
  return sortOptions.some((option) => option.value === value);
}

export async function ServiceResults({ searchParams }: ServiceResultsProps) {
  const params = await searchParams;
  const query = firstValue(params.q)?.trim() ?? "";
  const category = firstValue(params.category) ?? "";
  const requestedSort = firstValue(params.sort);
  const sort: ServiceSort = isServiceSort(requestedSort) ? requestedSort : defaultServiceSort;
  const requestedPage = Number(firstValue(params.page) ?? "1");
  const isKnownCategory = serviceCategories.some((item) => serviceCategorySlug(item.name) === category);

  const matchingServices = services
    .filter((service) => service.name.toLowerCase().includes(query.toLowerCase()))
    .filter((service) => !category || serviceCategorySlug(service.category) === category)
    .sort((first, second) => {
      if (sort === "price-asc") return first.startingPrice - second.startingPrice;
      if (sort === "price-desc") return second.startingPrice - first.startingPrice;
      return Number(second.featured) - Number(first.featured);
    });

  const pageCount = Math.max(1, Math.ceil(matchingServices.length / pageSize));
  const page = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const startIndex = (page - 1) * pageSize;
  const pageServices = matchingServices.slice(startIndex, startIndex + pageSize);
  const hasActiveFilters = Boolean(query || category || sort !== defaultServiceSort);

  function pageHref(pageNumber: number) {
    return buildServicesHref({ q: query, category, sort, page: pageNumber });
  }

  return (
    <>
      {/* Keyed on the active filters so uncontrolled fields reset after client navigation (e.g. Clear filters). */}
      <ServicesSearchForm key={pageHref(1)} role="search" aria-label="Search and filter services" className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
          <SlidersHorizontal aria-hidden="true" className="size-4 text-accent" />
          Search and refine services
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1.5fr)_minmax(180px,1fr)_minmax(170px,1fr)_auto] lg:items-end">
          <div>
            <label htmlFor="service-query" className="mb-1.5 block text-xs font-semibold text-muted-foreground">Search by service name</label>
            <div className="flex h-11 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <input
                id="service-query"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Try phone screen replacement"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          <div>
            <label htmlFor="service-category" className="mb-1.5 block text-xs font-semibold text-muted-foreground">Category</label>
            <select id="service-category" name="category" defaultValue={category} className={fieldClassName}>
              <option value="">All categories</option>
              {serviceCategories.map((item) => (
                <option key={item.name} value={serviceCategorySlug(item.name)}>{item.name}</option>
              ))}
              {category && !isKnownCategory ? <option value={category}>Unrecognized category</option> : null}
            </select>
          </div>
          <div>
            <label htmlFor="service-sort" className="mb-1.5 block text-xs font-semibold text-muted-foreground">Sort by</label>
            <select id="service-sort" name="sort" defaultValue={sort} className={fieldClassName}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="h-11 w-full rounded-lg px-5 lg:w-auto">
            Apply filters
          </Button>
        </div>
      </ServicesSearchForm>

      <div className="mt-10 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="service-results-heading" className="font-heading text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">Available services</h2>
          <p aria-live="polite" className="mt-2 text-sm tabular-nums text-muted-foreground">
            {matchingServices.length === 0
              ? "No matching services in this preview."
              : `Showing ${startIndex + 1}–${Math.min(startIndex + pageSize, matchingServices.length)} of ${matchingServices.length} example services`}
          </p>
        </div>
        {hasActiveFilters ? (
          <Link href="/services" className="w-fit text-sm font-semibold text-accent underline-offset-4 hover:underline">Clear filters</Link>
        ) : null}
      </div>

      {pageServices.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {pageServices.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center sm:py-16">
          <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-accent">
            <SearchX aria-hidden="true" className="size-6" />
          </span>
          <h3 className="mt-4 font-heading text-xl font-bold text-foreground">No services found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {category && !query
              ? "There are no example listings in this category yet. Try another category or clear your filters."
              : "Try a different service name or category, or clear your filters to see all listings."}
          </p>
          <Button asChild variant="outline" className="mt-5 h-11 rounded-lg px-5">
            <Link href="/services">Clear filters</Link>
          </Button>
        </div>
      )}

      {pageCount > 1 ? (
        <nav aria-label="Service results pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {page > 1 ? (
            <Button asChild variant="outline" className="h-11 gap-2 rounded-lg px-4">
              <Link href={pageHref(page - 1)} aria-label="Previous page"><ArrowLeft aria-hidden="true" className="size-4" /> <span className="hidden sm:inline">Previous</span></Link>
            </Button>
          ) : null}
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={pageHref(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
              className={cn(
                "flex size-11 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                pageNumber === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {pageNumber}
            </Link>
          ))}
          {page < pageCount ? (
            <Button asChild variant="outline" className="h-11 gap-2 rounded-lg px-4">
              <Link href={pageHref(page + 1)} aria-label="Next page"><span className="hidden sm:inline">Next</span> <ArrowRight aria-hidden="true" className="size-4" /></Link>
            </Button>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
