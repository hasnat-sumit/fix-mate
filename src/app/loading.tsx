import { Container } from "@/components/container";
import { PublicNavbar } from "@/components/public-navbar";
import { Skeleton } from "@/components/ui/skeleton";

/** Shown while a public page streams in. */
export default function Loading() {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" aria-busy="true" aria-label="Loading page">
        <section className="bg-secondary/60 py-14 sm:py-20">
          <Container>
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="mt-4 h-12 w-full max-w-2xl rounded-xl" />
            <Skeleton className="mt-4 h-5 w-full max-w-xl rounded" />
          </Container>
        </section>
        <Container className="grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-[360px] rounded-2xl" />
          ))}
        </Container>
      </main>
    </>
  );
}
