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
  { title: "Verified technicians", description: "Every service is reviewed and approved by an admin before customers can book it.", icon: BadgeCheck },
  { title: "Upfront starting prices", description: "Each listing shows its starting price; the technician confirms the final amount when the job is done.", icon: CircleDollarSign },
  { title: "Pay after service", description: "The Pay Now button appears only after the job is completed. Nothing is charged upfront.", icon: ShieldCheck },
  { title: "Know your technician", description: "See the technician’s name, photo, service area and experience before you request.", icon: MessageSquareQuote },
  { title: "Track every step", description: "Requested → Accepted → In Progress → Completed → Paid, all visible in your dashboard.", icon: Waypoints },
];

export function TrustSection() {
  return (
    <section id="why-fixmate" className="overflow-hidden bg-hero py-20 text-hero-foreground sm:py-24 lg:py-28">
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
