import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export function AboutHeroSection() {
  return (
    <section className="bg-secondary/60">
      <Container className="grid grid-cols-1 items-center gap-10 py-14 sm:py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-16 lg:py-20">
        <div className="min-w-0 max-w-[600px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">About FixMate</p>
          <h1 className="font-heading text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
            Repair with <span className="text-accent">Confidence.</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            FixMate connects people with skilled technicians for smartphones, computers and home appliances. We are building a repair experience that is clear from the first search to the final check.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-xl px-6">
              <Link href="/services">
                Browse services <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-6">
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-hero shadow-[0_30px_80px_rgba(20,44,60,0.18)] md:aspect-[5/6] lg:aspect-[4/4.2]">
          <Image
            src="/images/electrical-service.webp"
            alt="Technician working carefully on an electrical control panel"
            fill
            preload
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
