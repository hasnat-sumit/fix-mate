import { Container } from "@/components/container";
import { PublicNavbar } from "@/components/public-navbar";
import { Skeleton } from "@/components/ui/skeleton";

/** Shown while a service details page streams in. */
export default function Loading() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" aria-busy="true" aria-label="Loading service">
        <Container className="pt-8 sm:pt-10">
          <Skeleton className="h-4 w-64 rounded" />
        </Container>
        <Container className="grid grid-cols-1 gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
          <div>
            <Skeleton className="aspect-[16/10] rounded-2xl" />
            <Skeleton className="mt-8 h-4 w-28 rounded" />
            <Skeleton className="mt-3 h-12 w-3/4 rounded-xl" />
            <Skeleton className="mt-4 h-24 rounded-xl" />
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-20 rounded-2xl" />
              ))}
            </div>
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </Container>
      </main>
    </>
  );
}
