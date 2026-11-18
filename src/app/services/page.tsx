import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { ServiceResults } from "@/components/services/service-results";
import { ServiceResultsSkeleton } from "@/components/services/service-results-skeleton";

export const metadata: Metadata = {
  title: "Services — FixMate",
  description: "Browse device and home appliance repair services from FixMate technicians, compare starting prices, and find the right help.",
};

export default function ServicesPage({ searchParams }: PageProps<"/services">) {
  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <section className="bg-secondary/60 py-14 sm:py-16 lg:py-20">
          <Container>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Thoughtful repair services</p>
            <h1 className="max-w-3xl font-heading text-balance text-4xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
              Explore Our Services
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Browse repair services offered by FixMate technicians for the devices and appliances you rely on. Compare service details and starting prices before choosing what fits.
            </p>
          </Container>
        </section>

        <section aria-labelledby="service-results-heading" className="py-12 sm:py-16 lg:py-20">
          <Container>
            {/* Search params are request-time data, so results stream in behind a static page shell. */}
            <Suspense fallback={<ServiceResultsSkeleton />}>
              <ServiceResults searchParams={searchParams} />
            </Suspense>
          </Container>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
