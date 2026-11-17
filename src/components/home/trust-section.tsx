import {
  BadgeCheck,
  CircleDollarSign,
  MessageSquareQuote,
  ShieldCheck,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const trustFeatures: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Verified technicians", description: "Know who’s coming to help before work begins.", icon: BadgeCheck },
  { title: "Transparent pricing", description: "See a clear starting price before you send a request.", icon: CircleDollarSign },
  { title: "Secure payments", description: "Your payment is handled with care and security.", icon: ShieldCheck },
  { title: "Helpful reviews", description: "Choose with confidence from real customer feedback.", icon: MessageSquareQuote },
  { title: "Repair progress", description: "Stay informed from your first request to completion.", icon: Waypoints },
];

export function TrustSection() {
  return (
    <section id="about" className="overflow-hidden bg-hero py-20 text-hero-foreground sm:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Care you can count on"
            title="Good repairs start with trust."
            description="FixMate is designed to make the whole experience feel clear, respectful and dependable."
            light
          />
          <div className="grid grid-cols-1 gap-x-7 gap-y-8 sm:grid-cols-2">
            {trustFeatures.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className={`flex gap-4 ${index === trustFeatures.length - 1 ? "sm:col-span-2 sm:max-w-[calc(50%-14px)]" : ""}`}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-hero-highlight">
                  <Icon aria-hidden="true" className="size-[21px]" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/60">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
