import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Container } from "@/components/container";
import { ServicesSearchForm } from "@/components/services/services-search-form";
import { Button } from "@/components/ui/button";

const confidencePoints = ["Compare service details", "Clear starting prices", "Pay after service"];

export function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-background">
      <Container className="grid grid-cols-1 min-h-[650px] items-center gap-14 py-14 md:grid-cols-[1.03fr_0.97fr] md:gap-8 md:py-16 lg:min-h-[700px] lg:gap-14 lg:py-20">
        <div className="relative z-10 min-w-0 max-w-[620px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
            <span className="size-2 rounded-full bg-success" />
            A smarter way to get things working again
          </div>
          <h1 className="font-heading text-balance text-[clamp(2rem,9vw,2.8rem)] font-extrabold leading-[1.04] tracking-[-0.065em] text-foreground sm:text-5xl md:text-[3.45rem] lg:text-[4.25rem]">
            Your Devices Deserve <span className="text-accent">Expert Care.</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Find trusted technicians for smartphones, computers and home appliances. Book repairs with confidence and pay after the job is done.
          </p>

          <ServicesSearchForm role="search" aria-label="Search for a repair service" className="mt-8 flex max-w-[560px] flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_10px_34px_rgba(20,44,60,0.07)] sm:flex-row sm:items-center">
            <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 px-3">
              <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
              <span className="sr-only">Search for a repair service</span>
              <input
                type="search"
                name="search"
                placeholder="What needs fixing?"
                className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
              />
            </label>
            <Button type="submit" className="h-12 rounded-xl px-5 sm:px-6">
              Find a service <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </ServicesSearchForm>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {confidencePoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-[13px]">
                <CheckCircle2 aria-hidden="true" className="size-4 text-success" /> {point}
              </span>
            ))}
          </div>

          <div className="mt-9 flex items-center gap-3 border-t border-border pt-6">
            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
              <CheckCircle2 className="size-[18px]" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Repair with Confidence</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Thoughtful service details and clear next steps.</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[550px] md:ml-auto">
          <figure className="relative min-h-[390px] overflow-hidden rounded-[30px] bg-hero shadow-[0_30px_80px_rgba(20,44,60,0.2)] sm:min-h-[475px]">
            <Image
              src="/images/hero-technician-repair.webp"
              alt="Technician carefully repairing an electronic device at a workshop bench"
              fill
              preload
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-center"
            />
            <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-[#142c3c]/90 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:px-5 sm:py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-hero-highlight">The FixMate difference</p>
                <p className="mt-1 text-sm font-semibold">Trusted hands, careful work</p>
                <p className="mt-1 text-xs text-white/70">Repair with confidence, every step.</p>
              </div>
              <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">FM</span>
            </figcaption>
          </figure>

          <Link href="#how-it-works" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-accent">
            See how FixMate works <ArrowDown aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
