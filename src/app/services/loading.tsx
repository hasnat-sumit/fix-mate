import { Container } from "@/components/container";
import { PublicNavbar } from "@/components/public-navbar";
import { ServiceResultsSkeleton } from "@/components/services/service-results-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Shown while /services streams in. */
export default function Loading() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" aria-busy="true">
        <section className="bg-secondary/60 py-14 sm:py-16 lg:py-20">
          <Container>
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="mt-4 h-14 w-full max-w-xl rounded-xl" />
            <Skeleton className="mt-5 h-5 w-full max-w-2xl rounded" />
          </Container>
        </section>
        <section className="py-12 sm:py-16 lg:py-20">
          <Container>
            <ServiceResultsSkeleton />
          </Container>
        </section>
      </main>
    </>
  );
}
