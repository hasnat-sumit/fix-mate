import { Compass, Target, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const statements: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Our mission",
    description:
      "To make getting a device or appliance repaired feel simple and fair: clear service details, upfront starting prices, and payment only after the work is done.",
    icon: Target,
  },
  {
    title: "Our vision",
    description:
      "A world where repairing is the obvious first choice, where skilled technicians are easy to find and the things people rely on last longer.",
    icon: Compass,
  },
];

export function MissionVisionSection() {
  return (
    <section aria-labelledby="mission-heading" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          id="mission-heading"
          eyebrow="What drives us"
          title="Better repairs for everyday life."
          description="We believe good repair work deserves a clear, respectful experience for customers and technicians alike."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
          {statements.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-accent">
                <Icon aria-hidden="true" className="size-6" strokeWidth={1.7} />
              </span>
              <h3 className="mt-6 font-heading text-xl font-bold tracking-[-0.03em] text-foreground">{title}</h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
