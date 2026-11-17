import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const confidencePoints = ["Verified Technicians", "Pay After Service", "Customer Reviews"];

export function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-background">
      <Container className="grid grid-cols-1 min-h-[650px] items-center gap-14 py-14 md:grid-cols-[1.03fr_0.97fr] md:gap-8 md:py-16 lg:min-h-[700px] lg:gap-14 lg:py-20">
        <div className="relative z-10 max-w-[620px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
            <span className="size-2 rounded-full bg-success" />
            A smarter way to get things working again
          </div>
          <h1 className="font-heading text-balance text-[2.8rem] font-extrabold leading-[1.04] tracking-[-0.065em] text-foreground sm:text-5xl md:text-[3.45rem] lg:text-[4.25rem]">
            Your Devices Deserve <span className="text-accent">Expert Care.</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Find trusted technicians for smartphones, computers and home appliances. Book repairs with confidence and pay after the job is done.
          </p>

          <form action="#featured-services" method="get" role="search" className="mt-8 flex max-w-[560px] flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_10px_34px_rgba(20,44,60,0.07)] sm:flex-row sm:items-center">
            <label className="flex min-h-12 min-w-0 flex-1 items-center gap-3 px-3">
              <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
              <span className="sr-only">Search for a repair service</span>
              <input
                type="search"
                name="service"
                placeholder="What needs fixing?"
                className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
              />
            </label>
            <Button type="submit" className="h-12 rounded-xl px-5 sm:px-6">
              Find a service <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {confidencePoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-[13px]">
                <CheckCircle2 aria-hidden="true" className="size-4 text-success" /> {point}
              </span>
            ))}
          </div>

          <div className="mt-9 flex items-center gap-4 border-t border-border pt-6">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-art-sand text-[11px] font-bold text-foreground">AM</span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-art-sage text-[11px] font-bold text-foreground">DF</span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-art-sky text-[11px] font-bold text-foreground">RH</span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-accent text-[11px] font-bold text-accent-foreground">+</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <span className="inline-flex items-center gap-1"><Star aria-hidden="true" className="size-3.5 fill-warning text-warning" /> 4.9</span>
                <span className="font-medium text-muted-foreground">from happy customers</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">A better repair starts with the right people.</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[550px] md:ml-auto">
          <div className="relative min-h-[390px] overflow-hidden rounded-[30px] bg-hero p-5 shadow-[0_30px_80px_rgba(20,44,60,0.2)] sm:min-h-[475px] sm:p-8">
            <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-80" />
            <div aria-hidden="true" className="absolute -right-16 -top-20 size-72 rounded-full bg-accent/20 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-32 -left-24 size-80 rounded-full bg-hero-blue/15 blur-3xl" />

            <div className="relative flex items-center justify-between text-white/75">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">The FixMate difference</p>
                <p className="mt-1 text-xs text-white/50">A little more care, every step.</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
                <Wrench aria-hidden="true" className="size-[17px] text-hero-highlight" />
              </span>
            </div>

            <div className="relative mx-auto mt-8 flex max-w-[340px] items-center justify-center sm:mt-10">
              <div aria-hidden="true" className="absolute size-[245px] rounded-full border border-white/10 sm:size-[290px]" />
              <div aria-hidden="true" className="absolute size-[195px] rounded-full border border-white/10 sm:size-[235px]" />
              <div className="relative flex h-[230px] w-[150px] items-center justify-center rounded-[30px] border-[5px] border-hero-frame bg-hero-device shadow-[0_26px_50px_rgba(0,0,0,0.3)] sm:h-[275px] sm:w-[176px]">
                <span aria-hidden="true" className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-hero-frame" />
                <div className="flex size-[calc(100%-18px)] flex-col items-center justify-center rounded-[22px] bg-gradient-to-br from-hero-screen to-hero-screen-deep text-hero">
                  <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-white/70 shadow-sm sm:size-16">
                    <Smartphone aria-hidden="true" className="size-8 text-accent sm:size-9" strokeWidth={1.6} />
                  </span>
                  <span className="font-heading text-[11px] font-extrabold sm:text-xs">GOOD AS NEW</span>
                  <span className="mt-1 text-[9px] text-hero-detail sm:text-[10px]">Care you can count on</span>
                  <div className="mt-4 flex w-[76%] items-center gap-1.5 rounded-full bg-white/75 px-2 py-1.5">
                    <Check aria-hidden="true" className="size-3 text-success" />
                    <span className="text-[8px] font-semibold sm:text-[9px]">Quality check complete</span>
                  </div>
                </div>
                <span aria-hidden="true" className="absolute bottom-2 size-1 rounded-full bg-hero-frame" />
              </div>
              <span className="absolute bottom-[18%] right-[3%] flex size-11 items-center justify-center rounded-2xl border border-white/30 bg-accent text-accent-foreground shadow-lg sm:right-[4%] sm:size-[52px]">
                <Wrench aria-hidden="true" className="size-5 sm:size-6" />
              </span>
            </div>

            <div className="relative mx-auto mt-7 flex max-w-[370px] items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-white shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <BadgeCheck aria-hidden="true" className="size-5 text-hero-highlight" />
                </span>
                <div>
                  <p className="text-xs font-bold">Trusted hands, careful work</p>
                  <p className="mt-1 text-[10px] text-white/55">Every technician is verified</p>
                </div>
              </div>
              <ShieldCheck aria-hidden="true" className="size-5 text-hero-highlight" />
            </div>
            <div className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-full bg-card px-3 py-2 text-[10px] font-semibold text-foreground shadow-lg sm:flex">
              <span className="flex size-5 items-center justify-center rounded-full bg-success/10 text-success"><Check aria-hidden="true" className="size-3" /></span>
              Repairs, made right
            </div>
          </div>

          <Link href="#how-it-works" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-accent">
            See how FixMate works <ArrowDown aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
