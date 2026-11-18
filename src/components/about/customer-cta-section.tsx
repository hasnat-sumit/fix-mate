import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export function CustomerCtaSection() {
  return (
    <section aria-labelledby="customer-cta-heading" className="pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <div className="flex flex-col items-start gap-8 rounded-[28px] bg-hero px-6 py-10 text-hero-foreground sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-hero-highlight">Something not working?</p>
            <h2 id="customer-cta-heading" className="font-heading text-balance text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
              Find the right help for your device or appliance.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
              Compare services and starting prices, then send a request when you’re ready.
            </p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-xl bg-white px-6 text-[#142c3c] hover:bg-white/90">
            <Link href="/services">
              Find a service <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
