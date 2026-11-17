import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Check, UsersRound } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const benefits = ["Connect with customers nearby", "Build a reputation that travels", "Grow at a pace that works for you"];

export function TechnicianCtaSection() {
  return (
    <section id="technicians" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[28px] bg-secondary px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div aria-hidden="true" className="absolute -right-20 -top-32 -z-10 size-[380px] rounded-full border border-accent/15" />
          <div aria-hidden="true" className="absolute -right-6 -top-20 -z-10 size-[250px] rounded-full border border-accent/15" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <span className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-card text-accent shadow-sm">
                <BriefcaseBusiness aria-hidden="true" className="size-[21px]" />
              </span>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">For skilled hands</p>
              <h2 className="font-heading text-balance text-3xl font-bold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[2.8rem] lg:leading-[1.12]">
                Are you a skilled technician?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Grow your repair business and connect with customers through FixMate.
              </p>
              <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {benefits.map((benefit) => (
                  <li key={benefit} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80">
                    <Check aria-hidden="true" className="size-4 text-success" /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><UsersRound aria-hidden="true" className="size-[18px]" /></span>
                <span className="text-xs font-semibold leading-5 text-muted-foreground">A network built around<br /><strong className="text-foreground">quality work</strong></span>
              </div>
              <Button asChild className="h-12 rounded-xl px-6">
                <Link href="#footer">Join FixMate <ArrowRight aria-hidden="true" className="size-4" /></Link>
              </Button>
              <p className="text-xs text-muted-foreground">Technician registration is coming soon.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
