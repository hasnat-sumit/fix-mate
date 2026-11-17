import { ClipboardCheck, CreditCard, Search, Wrench, type LucideIcon } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { repairSteps, type RepairStep } from "@/data/homepage";

const stepIcons: Record<RepairStep["icon"], LucideIcon> = {
  search: Search,
  clipboard: ClipboardCheck,
  wrench: Wrench,
  "credit-card": CreditCard,
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          centered
          eyebrow="Simple by design"
          title="A better repair, from first search to final check."
          description="Know what happens next, stay in the loop, and settle up when the work is complete."
        />
        <ol className="relative mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-9 hidden border-t border-dashed border-accent/35 lg:block" />
          {repairSteps.map((step) => {
            const Icon = stepIcons[step.icon];
            return (
              <li key={step.number} className="relative rounded-2xl border border-border bg-card p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="relative z-10 flex size-[46px] items-center justify-center rounded-2xl border border-accent/20 bg-background text-accent shadow-sm">
                    <Icon aria-hidden="true" className="size-[21px]" strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-xs font-semibold tracking-[0.12em] text-muted-foreground/75">{step.number}</span>
                </div>
                <h3 className="mt-6 font-heading text-lg font-bold tracking-[-0.03em] text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
