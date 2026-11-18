import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { featuredServices } from "@/data/services";

export function FeaturedServicesSection() {
  return (
    <section id="featured-services" className="border-y border-border/70 bg-card py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Popular right now"
            title="Skilled service. Clear starting prices."
            description="Meet a few of the trusted specialists customers turn to when something needs a little expert attention."
          />
          <Link href="/services" className="mb-1 inline-flex w-fit items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-accent">
            View all services <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {featuredServices.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Demonstration listings, providers, ratings and starting prices are illustrative examples.</p>
      </Container>
    </section>
  );
}
