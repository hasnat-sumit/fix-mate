import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/container";

type StatusMessageProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
  tone?: "neutral" | "error";
};

/** Centered full-section message for not-found and error states. */
export function StatusMessage({ icon: Icon, eyebrow, title, description, actions, tone = "neutral" }: StatusMessageProps) {
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <Container className="flex flex-col items-center text-center">
        <span
          className={
            tone === "error"
              ? "flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error"
              : "flex size-14 items-center justify-center rounded-2xl bg-secondary text-accent"
          }
        >
          <Icon aria-hidden="true" className="size-7" strokeWidth={1.7} />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl font-heading text-balance text-3xl font-extrabold tracking-[-0.05em] text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">{actions}</div>
      </Container>
    </section>
  );
}
